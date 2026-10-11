/* ============================================================
 * FILE: 08-test-mode.js
 * DOMAIN: Chế độ thẩm định bài đọc (Test Mode)
 * DEPENDS: 00-config, 02-text-utils, 03-state, 04-ui-shared,
 *          06-fsrs-core, 15-reader
 * ============================================================ */

function startTestMode() {
  const currentDoc = docs.find(d => d.id === activeDocId && !d.hidden);
  if (!currentDoc) { showToast("Vui lòng chọn bài đọc hợp lệ", "warning"); return; }
  const now = Date.now();
  const status = currentDoc.testStatus || {};
  if (status.failed && !status.retested && status.lockedUntil && now < status.lockedUntil) {
    const hoursLeft = Math.ceil((status.lockedUntil - now) / (1000 * 60 * 60));
    showToast(`Bài đọc đang trong thời gian nghỉ tái thẩm định! Vui lòng quay lại sau ${hoursLeft} giờ.`, "warning");
    return;
  }
  if (status.retested) {
    const check = checkDocDueEligibility(currentDoc);
    if (!check.eligible) {
      showToast(`Bài đọc đã đạt thẩm định. Chỉ có thể tái kiểm tra khi trên ${fsrsConfig.retestDueThreshold}% mục củng cố tới kỳ hạn FSRS.`, "info");
      return;
    }
  }
  isTestActive = true;
  testSessionLookups = { words: new Set(), manualMarkedKnown: new Set() };
  const banner = document.getElementById('test-mode-banner');
  const badgeType = document.getElementById('test-badge-type');
  const cardWrapper = document.getElementById('reader-card-wrapper');
  if (banner) banner.classList.remove('hidden');
  if (cardWrapper) cardWrapper.classList.add('in-test-mode');
  if (badgeType) badgeType.innerText = status.tested ? (status.failed ? "Tái thẩm định (Lần 1)" : "Kiểm tra định kỳ") : "Thẩm định lần đầu";
  updateTestLiveStats();
  renderReader();
  showToast("Đã kích hoạt Chế độ Thẩm định!", "info");
}

function cancelTestMode() {
  isTestActive = false;
  testSessionLookups.words.clear();
  testSessionLookups.manualMarkedKnown.clear();
  document.getElementById('test-mode-banner').classList.add('hidden');
  document.getElementById('reader-card-wrapper').classList.remove('in-test-mode');
  renderReader();
  showToast("Đã hủy chế độ thẩm định.", "info");
}

function updateTestLiveStats() {
  if (!isTestActive) return;
  const currentDoc = docs.find(d => d.id === activeDocId);
  if (!currentDoc) return;
  const wordsElem = document.getElementById('test-lookup-words-count');
  const ratioElem = document.getElementById('test-current-ratio');
  const words = currentDoc.content.trim().split(/\s+/);
  const uniqueWordsInDoc = new Set();
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned) uniqueWordsInDoc.add(cleaned);
  });
  const totalDistinct = uniqueWordsInDoc.size;
  const activeLookedWords = Array.from(testSessionLookups.words).filter(w => !testSessionLookups.manualMarkedKnown.has(w));
  const totalLooked = activeLookedWords.length;
  const ratio = totalDistinct > 0 ? (totalLooked / totalDistinct) * 100 : 0;
  if (wordsElem) wordsElem.innerText = activeLookedWords.length;
  if (ratioElem) ratioElem.innerText = `${ratio.toFixed(1)}%`;
}

function registerTestLookup(type, key) {
  if (!isTestActive) return;
  const k = (key || '').toLowerCase();
  testSessionLookups.words.add(k);
  if (!testSessionLookups.manualMarkedKnown.has(k)) {
    if (!statusDb.vocab) statusDb.vocab = {};
    statusDb.vocab[k] = 2;
    if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
    statusTimestamps.vocab[k] = Date.now();
  }
  updateTestLiveStats();
  saveAllData();
}

async function submitPartialTest() {
  const currentDoc = docs.find(d => d.id === activeDocId);
  if (!currentDoc) return;

  const confirmed = await new Promise(resolve => {
    showConfirmModal(
      "Nộp bài giữa chừng? Chỉ các từ bạn ĐÃ tra cứu mới được ghi nhận. Từ chưa tra sẽ giữ nguyên trạng thái.",
      () => resolve(true),
      () => resolve(false)
    );
  });
  if (!confirmed) return;

  const words = currentDoc.content.trim().split(/\s+/);
  const uniqueWordsInDoc = new Set();
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned) uniqueWordsInDoc.add(cleaned);
  });
  const totalDistinct = uniqueWordsInDoc.size;

  const validLookedWords = Array.from(testSessionLookups.words).filter(w => !testSessionLookups.manualMarkedKnown.has(w));
  const queuedToFsrs = [];
  const now = Date.now();
  validLookedWords.forEach(word => {
    const rank = getItemRank('vocab', word);
    if (rank <= fsrsConfig.rankThreshold) {
      if (!fsrsPool.vocab[word]) {
        fsrsPool.vocab[word] = { streak: 0, interval: 1, nextReview: now, lastReview: now, usedSentences: [], rank };
      } else {
        fsrsPool.vocab[word].streak = 0;
        fsrsPool.vocab[word].nextReview = now;
      }
      queuedToFsrs.push({ type: 'vocab', key: word, rank });
    }
  });

  const totalLookedCount = validLookedWords.length;
  const corruptionRate = totalDistinct > 0 ? (totalLookedCount / totalDistinct) * 100 : 0;

  if (!currentDoc.testStatus) {
    currentDoc.testStatus = { tested: false, lastTestDate: null, corruptionRate: 0, failed: false, lockedUntil: null, retested: false, trackedItems: [] };
  }
  currentDoc.testStatus.corruptionRate = corruptionRate;
  currentDoc.testStatus.lastTestDate = now;
  const newTracked = queuedToFsrs.map(x => `${x.type}:${x.key}`);
  const existingTracked = currentDoc.testStatus.trackedItems || [];
  currentDoc.testStatus.trackedItems = Array.from(new Set([...existingTracked, ...newTracked]));

  isTestActive = false;
  document.getElementById('test-mode-banner').classList.add('hidden');
  document.getElementById('reader-card-wrapper').classList.remove('in-test-mode');
  testSessionLookups.words.clear();
  testSessionLookups.manualMarkedKnown.clear();

  await saveAllData();
  renderReader();
  showToast(`📝 Đã nộp bài: ${totalLookedCount} mục tra cứu đã ghi nhận vào FSRS. Từ chưa tra giữ nguyên trạng thái.`, "success");
}

async function finishTestReading() {
  const currentDoc = docs.find(d => d.id === activeDocId);
  if (!currentDoc) return;
  const words = currentDoc.content.trim().split(/\s+/);
  const uniqueWordsInDoc = new Set();
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned) uniqueWordsInDoc.add(cleaned);
  });
  const totalDistinct = uniqueWordsInDoc.size;

  const tsNow = Date.now();
  if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
  uniqueWordsInDoc.forEach(w => {
    if (!testSessionLookups.words.has(w)) {
      const currentStatus = getLingqStatus('vocab', w);
      if (currentStatus !== 4) {
        statusDb.vocab[w] = 4;
        statusTimestamps.vocab[w] = tsNow;
      }
    }
  });

  const validLookedWords = Array.from(testSessionLookups.words).filter(w => !testSessionLookups.manualMarkedKnown.has(w));
  const queuedToFsrs = [];
  const now = Date.now();
  validLookedWords.forEach(word => {
    const rank = getItemRank('vocab', word);
    if (rank <= fsrsConfig.rankThreshold) {
      if (!fsrsPool.vocab[word]) {
        fsrsPool.vocab[word] = { streak: 0, interval: 1, nextReview: now, lastReview: now, usedSentences: [], rank };
      } else {
        fsrsPool.vocab[word].streak = 0;
        fsrsPool.vocab[word].nextReview = now;
      }
      queuedToFsrs.push({ type: 'vocab', key: word, rank });
    }
  });

  const totalLookedCount = validLookedWords.length;
  const corruptionRate = totalDistinct > 0 ? (totalLookedCount / totalDistinct) * 100 : 0;
  const isFailed = corruptionRate > fsrsConfig.corruptionThreshold;
  const wasFailedBefore = currentDoc.testStatus && currentDoc.testStatus.failed;
  const isRetestRun = wasFailedBefore && !currentDoc.testStatus.retested;

  if (isRetestRun) {
    applyRetestEffectOnFsrs(currentDoc);
    currentDoc.testStatus = { tested: true, lastTestDate: now, corruptionRate, failed: isFailed, lockedUntil: null, retested: true, trackedItems: queuedToFsrs.map(x => `${x.type}:${x.key}`) };
  } else {
    currentDoc.testStatus = { tested: true, lastTestDate: now, corruptionRate, failed: isFailed, lockedUntil: isFailed ? (now + 24 * 60 * 60 * 1000) : null, retested: false, trackedItems: queuedToFsrs.map(x => `${x.type}:${x.key}`) };
  }
  isTestActive = false;
  document.getElementById('test-mode-banner').classList.add('hidden');
  document.getElementById('reader-card-wrapper').classList.remove('in-test-mode');
  await saveAllData();
  renderReader();
  showTestResultModal(corruptionRate, isFailed, totalLookedCount, queuedToFsrs, isRetestRun);
}

function showTestResultModal(corruptionRate, isFailed, totalLookedCount, queuedToFsrs, isRetestRun) {
  const header = document.getElementById('test-result-header');
  const icon = document.getElementById('test-result-icon');
  const title = document.getElementById('test-result-title');
  const sub = document.getElementById('test-result-sub');
  const rateElem = document.getElementById('res-corruption-rate');
  const countElem = document.getElementById('res-lookedup-count');
  const fsrsElem = document.getElementById('res-fsrs-added-count');
  const feedback = document.getElementById('test-result-feedback');
  const queuedBox = document.getElementById('res-queued-items-box');
  rateElem.innerText = `${corruptionRate.toFixed(1)}%`;
  countElem.innerText = totalLookedCount;
  fsrsElem.innerText = queuedToFsrs.length;
  queuedBox.innerHTML = '';
  if (queuedToFsrs.length === 0) {
    queuedBox.innerHTML = `<span class="text-stone-400 text-xs italic">Không có mục nào thuộc Rank ≤ ${fsrsConfig.rankThreshold}.</span>`;
  } else {
    queuedToFsrs.forEach(item => {
      const tag = document.createElement('span');
      tag.className = "inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-stone-200 rounded-lg text-xs";
      tag.innerHTML = `<b>${item.key}</b> <span class="text-[10px] text-stone-400">#${item.rank}</span>`;
      queuedBox.appendChild(tag);
    });
  }
  if (isFailed) {
    header.className = "p-6 bg-gradient-to-r from-rose-900 to-crimson-800 text-white text-center";
    icon.innerText = "⚠️";
    title.innerText = "Chưa Đạt Ngưỡng Thẩm Định";
    sub.innerText = `Tỉ lệ khuyết thiếu (${corruptionRate.toFixed(1)}%) vượt quá mức cho phép (${fsrsConfig.corruptionThreshold}%)`;
    feedback.className = "p-3.5 rounded-2xl text-xs leading-relaxed bg-rose-50 border border-rose-200 text-rose-900";
    feedback.innerHTML = `<b>Đã kích hoạt đợt củng cố!</b>${!isRetestRun ? `<br>⏰ Bạn có thể làm lại sau <b>24 giờ nữa</b>.` : `<br>Bài đọc đã hoàn thành đợt tái thẩm định.`}`;
  } else {
    header.className = "p-6 bg-gradient-to-r from-emerald-800 to-teal-700 text-white text-center";
    icon.innerText = "🎉";
    title.innerText = "Thẩm Định Thành Công!";
    sub.innerText = `Tỉ lệ khuyết thiếu đạt chuẩn: ${corruptionRate.toFixed(1)}% (≤ ${fsrsConfig.corruptionThreshold}%)`;
    feedback.className = "p-3.5 rounded-2xl text-xs leading-relaxed bg-emerald-50 border border-emerald-200 text-emerald-900";
    feedback.innerHTML = `<b>Xuất sắc!</b> Toàn bộ các từ chưa tra cứu đã được ghi nhận vào trạng thái <b>Đã biết</b>.`;
  }
  openModal('modal-test-result');
}