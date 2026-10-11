/* ============================================================
 * FILE: 15-reader.js
 * DOMAIN: Reader render, pagination, bookmark, TTS, zen, font
 * DEPENDS: 02-text-utils, 03-state, 04-ui-shared, 09-grammar-engine,
 *          10-grammar-ui, 12-structure-select
 * ============================================================ */

// ==================== RENDER READER ====================
function renderReader() {
  const container = document.getElementById('reader-content');
  const emptyState = document.getElementById('reader-empty');
  const titleElem = document.getElementById('reader-title');
  const statusTag = document.getElementById('reader-status-tag');
  const testBadge = document.getElementById('doc-test-status-badge');
  const btnStartTest = document.getElementById('btn-start-test-text');
  updateBadges();
  const modeBtnText = document.getElementById('highlight-mode-text');
  const modeBtnIcon = document.getElementById('highlight-mode-icon');
  const floatBtnText = document.getElementById('floating-hl-text');
  const floatBtnIcon = document.getElementById('floating-hl-icon');
  if (highlightMode === 'vocab') {
    if (modeBtnIcon) modeBtnIcon.innerText = '📑';
    if (modeBtnText) modeBtnText.innerText = 'Màu: Từ vựng';
    if (floatBtnIcon) floatBtnIcon.innerText = '📑';
    if (floatBtnText) floatBtnText.innerText = 'Từ vựng';
  } else {
    if (modeBtnIcon) modeBtnIcon.innerText = '🟣';
    if (modeBtnText) modeBtnText.innerText = 'Màu: Ngữ pháp';
    if (floatBtnIcon) floatBtnIcon.innerText = '🟣';
    if (floatBtnText) floatBtnText.innerText = 'Ngữ pháp';
  }
  if (container) container.style.fontSize = `${readerFontSize}px`;
  const indicator = document.getElementById('font-size-indicator');
  if (indicator) indicator.innerText = `${readerFontSize}px`;
  const currentDoc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt) || docs.find(d => !d.hidden && !d.deletedAt);
  if (!currentDoc) {
    container.innerHTML = '';
    container.classList.add('hidden');
    emptyState.classList.remove('hidden');
    titleElem.querySelector('span').innerText = 'Chưa chọn bài đọc';
    statusTag.innerText = '';
    if (testBadge) testBadge.classList.add('hidden');
    return;
  }
  activeDocId = currentDoc.id;
  idbSet('activeDocId', activeDocId);
  container.classList.remove('hidden');
  emptyState.classList.add('hidden');
  titleElem.querySelector('span').innerText = currentDoc.title;
  statusTag.innerText = `Độ dài: ${currentDoc.content.replace(/\s+/g, '').length} ký tự`;
  if (testBadge && currentDoc.testStatus) {
    testBadge.classList.remove('hidden');
    const st = currentDoc.testStatus;
    if (!st.tested) {
      testBadge.className = "text-xs px-2.5 py-0.5 rounded-full font-bold bg-stone-100 text-stone-600 border border-stone-200";
      testBadge.innerText = "Chưa thẩm định";
      if (btnStartTest) btnStartTest.innerText = "Bắt đầu Thẩm định";
    } else if (st.failed) {
      testBadge.className = "text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 border border-rose-300";
      testBadge.innerText = `Chưa đạt (${st.corruptionRate.toFixed(1)}%)`;
      if (btnStartTest) btnStartTest.innerText = "Tái thẩm định";
    } else {
      testBadge.className = "text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300";
      testBadge.innerText = `Đạt chuẩn (${st.corruptionRate.toFixed(1)}%)`;
      if (btnStartTest) btnStartTest.innerText = "Thẩm định lại";
    }
  }
  container.innerHTML = '';

  if (highlightMode === 'grammar') container.classList.add('grammar-mode-active');
  else container.classList.remove('grammar-mode-active');

  if (!paginatedDoc || paginatedDoc.docId !== currentDoc.id) {
    paginatedDoc = buildPagination(currentDoc);
    currentPage = 1;
  }
  if (currentPage > paginatedDoc.pages.length) currentPage = paginatedDoc.pages.length;
  if (currentPage < 1) currentPage = 1;
  const pageData = getCurrentPageLines();
  if (!pageData) { renderPaginationBar(); return; }
  const lines = pageData.lines;
  const pageContent = lines.join('\n');
  const grammarResult = (highlightMode === 'grammar')
    ? detectGrammarForDoc(pageContent)
    : { matchesByLine: {}, tokensByLine: {} };

  lines.forEach((line, lineIdx) => {
    if (!line.trim()) {
      const br = document.createElement('div');
      br.className = "h-4";
      container.appendChild(br);
      return;
    }
    const lineDiv = document.createElement('div');
    lineDiv.className = "flex flex-wrap items-baseline";

    const tokens = grammarResult.tokensByLine[lineIdx] || tokenizeEnglishText(line.trim());

    const wordUnitElements = tokens.map((word, tokenIdx) => {
      if (!word) return null;
      const cleanWord = cleanEnglishWord(word);
      const isEnglish = cleanWord.length > 0;

      if (!isEnglish) {
        const punctSpan = document.createElement('span');
        punctSpan.className = "text-stone-500 mx-1";
        punctSpan.innerText = word;
        return { type: 'punct', el: punctSpan };
      }

      const vocabEntry = getVocabEntry(cleanWord);
      let vocabLvl = getLingqStatus('vocab', cleanWord);
      if (vocabLvl === 1 && vocabEntry && vocabEntry.matchWord && vocabEntry.matchWord !== cleanWord) {
        const baseLvl = getLingqStatus('vocab', vocabEntry.matchWord);
        if (baseLvl > 1) vocabLvl = baseLvl;
      }

      const wordUnit = document.createElement('span');

      if (highlightMode === 'vocab' || highlightMode === 'grammar') {
        wordUnit.className = `word-unit lingq-level-${vocabLvl}`;
        if (vocabLvl < 4 && !vocabEntry) wordUnit.classList.add('needs-data');
      } else {
        wordUnit.className = `word-unit lingq-level-4`;
      }
      wordUnit.dataset.word = cleanWord;

      if (isTestActive && testSessionLookups.words.has(cleanWord)
          && !testSessionLookups.manualMarkedKnown.has(cleanWord)) {
        wordUnit.classList.add('test-looked-up');
      }

      if (showPinyinRuby && vocabEntry && vocabEntry.ipa) {
        const displayIpa = vocabEntry.ipa.split('/').filter(Boolean)[0] || vocabEntry.ipa;
        wordUnit.innerHTML = `<ruby>${word}<rt class="text-[10px] font-sans font-normal text-stone-500">${displayIpa}</rt></ruby>`;
      } else {
        wordUnit.innerText = word;
      }

      attachWordInteractions(wordUnit, cleanWord, lineIdx, tokenIdx);
      return { type: 'word', el: wordUnit };
    });

    const lineMatches = grammarResult.matchesByLine[lineIdx] || [];
    if (highlightMode === 'grammar' && lineMatches.length > 0) {
      applyGrammarHighlightToLine(lineDiv, tokens, wordUnitElements, lineMatches);
    } else {
      wordUnitElements.forEach(w => { if (w) lineDiv.appendChild(w.el); });
    }

    container.appendChild(lineDiv);
  });
  renderPaginationBar();
  updateBookmarkButton();
  updatePageSizeInput();
}

// ==================== PAGINATION ENGINE ====================
function buildPagination(doc) {
  if (!doc || !doc.content) return { docId: null, pages: [] };
  const lines = doc.content.split('\n');
  const pages = [];
  let curLines = [];
  let curCount = 0;
  const countWords = (str) => (str.match(/[A-Za-z]+/g) || []).length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const c = countWords(line);
    if (curCount + c > pageSize && curLines.length > 0) {
      pages.push({ lines: curLines.slice(), charCount: curCount });
      curLines = []; curCount = 0;
    }
    curLines.push(line);
    curCount += c;
  }
  if (curLines.length > 0) pages.push({ lines: curLines.slice(), charCount: curCount });
  return { docId: doc.id, pages };
}

function getCurrentPageLines() {
  if (!paginatedDoc || !paginatedDoc.pages.length) return null;
  return paginatedDoc.pages[Math.min(currentPage - 1, paginatedDoc.pages.length - 1)];
}

function renderPaginationBar() {
  const topBar = document.getElementById('pagination-bar-top');
  const bottomBar = document.getElementById('pagination-bar-bottom');
  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (!doc || !paginatedDoc || paginatedDoc.pages.length <= 1) {
    if (topBar) topBar.classList.add('hidden');
    if (bottomBar) bottomBar.classList.add('hidden');
    return;
  }
  if (topBar) topBar.classList.remove('hidden');
  if (bottomBar) bottomBar.classList.remove('hidden');

  const total = paginatedDoc.pages.length;
  const bm = bookmarks[doc.id];
  let html = `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="gotoPage(${currentPage - 1})">‹ Trước</button>`;
  const show = [];
  if (total <= 7) { for (let i = 1; i <= total; i++) show.push(i); }
  else {
    show.push(1);
    let s = Math.max(2, currentPage - 2), e = Math.min(total - 1, currentPage + 2);
    if (s > 2) show.push('...');
    for (let i = s; i <= e; i++) show.push(i);
    if (e < total - 1) show.push('...');
    show.push(total);
  }
  show.forEach(p => {
    if (p === '...') html += `<span class="px-1 text-stone-400 text-xs font-bold">…</span>`;
    else {
      const isBm = bm && bm.page === p;
      html += `<button class="page-btn ${p === currentPage ? 'active' : ''} ${isBm && p !== currentPage ? 'bookmark-active' : ''}" onclick="gotoPage(${p})">${p}${isBm ? '📍' : ''}</button>`;
    }
  });
  html += `<button class="page-btn" ${currentPage === total ? 'disabled' : ''} onclick="gotoPage(${currentPage + 1})">Sau ›</button>`;
  const info = paginatedDoc.pages[currentPage - 1];
  html += `<span class="text-[10px] font-mono text-stone-500 ml-2 px-2 py-1 bg-stone-100 rounded-md">${info.charCount} từ</span>`;
  if (topBar) topBar.innerHTML = html;
  if (bottomBar) bottomBar.innerHTML = html;
}

function gotoPage(p) {
  if (!paginatedDoc) return;
  currentPage = Math.max(1, Math.min(p, paginatedDoc.pages.length));
  renderReader();
  const w = document.getElementById('reader-card-wrapper');
  if (w) window.scrollTo({ top: w.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
}

function updatePageSize(val) {
  const n = parseInt(val, 10);
  if (isNaN(n) || n < 200) { showToast("Tối thiểu 200 từ", "warning"); return; }
  if (n > 5000) { showToast("Tối đa 5000 từ", "warning"); return; }
  pageSize = n;
  idbSet('pageSize', pageSize);
  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (doc) { paginatedDoc = buildPagination(doc); currentPage = 1; renderReader(); }
  showToast(`Đã đổi thành ${pageSize} từ/trang`, "success");
}

function updatePageSizeInput() {
  const inp = document.getElementById('page-size-input');
  if (inp) inp.value = pageSize;
}

// ==================== BOOKMARK ENGINE ====================
function saveBookmark(type, key) {
  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (!doc) return;
  bookmarks[doc.id] = { type, word: key, page: currentPage, timestamp: Date.now() };
  idbSet('bookmarks', bookmarks);
  updateBookmarkButton();
}

function updateBookmarkButton() {
  const btn = document.getElementById('bookmark-floating-btn');
  const label = document.getElementById('bm-label-text');
  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (!btn) return;
  const bm = doc ? bookmarks[doc.id] : null;
  if (bm) {
    btn.classList.add('visible');
    if (label) label.innerText = bm.word;
  } else btn.classList.remove('visible');
}

function jumpToBookmark() {
  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (!doc) return;
  const bm = bookmarks[doc.id];
  if (!bm) { showToast("Chưa có bookmark", "info"); return; }
  if (bm.page !== currentPage) { currentPage = bm.page; renderReader(); }
  setTimeout(() => {
    const el = document.querySelector(`.word-unit[data-word="${bm.word}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bookmark-highlight');
      setTimeout(() => el.classList.remove('bookmark-highlight'), 3000);
      showToast(`📍 Đã nhảy tới "${bm.word}"`, "success");
    } else showToast(`Không tìm thấy "${bm.word}"`, "warning");
  }, 250);
}

function clearBookmark() {
  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (!doc || !bookmarks[doc.id]) return;
  delete bookmarks[doc.id];
  idbSet('bookmarks', bookmarks);
  updateBookmarkButton();
  showToast("Đã xóa bookmark", "info");
}

// ==================== TTS ====================
function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
                 || voices.find(v => v.lang === 'en-US')
                 || voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
    window.speechSynthesis.speak(utterance);
  } catch (err) {}
}

function speakCurrentText() {
  const currentDoc = docs.find(d => d.id === activeDocId);
  if (currentDoc) { speakText(currentDoc.content); showToast("Đang phát âm bài đọc tiếng Anh...", "info"); }
}

function adjustFontSize(delta) {
  readerFontSize = Math.max(16, Math.min(48, readerFontSize + delta));
  idbSet('readerFontSize', readerFontSize);
  renderReader();
}

function toggleZenMode() {
  isZenMode = !isZenMode;
  const floatingBtn = document.getElementById('zen-floating-toggle');
  if (isZenMode) {
    document.body.classList.add('zen-active');
    if (floatingBtn) { floatingBtn.classList.remove('hidden'); floatingBtn.classList.add('flex'); }
  } else {
    document.body.classList.remove('zen-active');
    if (floatingBtn) { floatingBtn.classList.add('hidden'); floatingBtn.classList.remove('flex'); }
  }
}

function togglePinyinHelper() {
  showPinyinRuby = !showPinyinRuby;
  idbSet('showPinyinRuby', showPinyinRuby);
  renderReader();
}

function toggleHighlightMode() {
  if (highlightMode === 'vocab') highlightMode = 'grammar';
  else highlightMode = 'vocab';
  idbSet('highlightMode', highlightMode);
  renderReader();
}

function markAllCurrentDocAsKnown() {
  const currentDoc = docs.find(d => d.id === activeDocId && !d.hidden);
  if (!currentDoc) return;

  const words = currentDoc.content.trim().split(/\s+/);
  const uniqueVocab = new Set();
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned) uniqueVocab.add(cleaned);
  });

  let willChange = 0;
  uniqueVocab.forEach(w => { if (getLingqStatus('vocab', w) === 1) willChange++; });

  showConfirmModal(
    `Đánh dấu "Đã biết" (level 4) cho tất cả mục đang ở level 1 (Mới) trong bài này?\n\n` +
    `SẼ GIỮ NGUYÊN:\n` +
    `• Level 2 (Đang học)\n` +
    `• Level 3 (Sắp thuộc)\n` +
    `• Level 4 (Đã biết)\n\n` +
    `Sẽ đổi sang "Đã biết": ${willChange} mục.`,
    async () => {
      const now = Date.now();
      let changedCount = 0;
      uniqueVocab.forEach(word => {
        const lvl = getLingqStatus('vocab', word);
        if (lvl === 1) {
          statusDb.vocab[word] = 4;
          if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
          statusTimestamps.vocab[word] = now;
          changedCount++;
        }
      });
      touch();
      await saveAllData();
      renderReader();
      showToast(`✅ Đã đánh dấu ${changedCount} mục "Mới" thành "Đã biết".`, "success");
    }
  );
}

function resetCurrentDocToNew() {
  const currentDoc = docs.find(d => d.id === activeDocId && !d.hidden);
  if (!currentDoc) { showToast("Vui lòng chọn một bài đọc hợp lệ!", "warning"); return; }

  const words = currentDoc.content.trim().split(/\s+/);
  const uniqueVocab = new Set();
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned) uniqueVocab.add(cleaned);
  });
  const totalItems = uniqueVocab.size;

  showConfirmModal(
    `Đánh dấu toàn bộ từ vựng trong bài này là "Mới"?\n\n` +
    `SẼ GIỮ NGUYÊN:\n` +
    `• Mục đang ở mức 2 (Đang học)\n` +
    `• Mục đang ở mức 3 (Sắp thuộc)\n\n` +
    `Tổng số mục sẽ xét: ${totalItems}`,
    async () => {
      const now = Date.now();
      let changedCount = 0;
      uniqueVocab.forEach(word => {
        const currentLvl = getLingqStatus('vocab', word);
        if (currentLvl !== 2 && currentLvl !== 3) {
          statusDb.vocab[word] = 1;
          if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
          statusTimestamps.vocab[word] = now;
          changedCount++;
        }
      });
      touch();
      await saveAllData();
      renderReader();
      showToast(`🔄 Đã đánh dấu ${changedCount} mục trong bài là "Mới".`, "success");
    }
  );
}