/* ============================================================
 * FILE: 05-vocab.js
 * DOMAIN: Vocab DB, LingQ status, vocab card/table, rank export
 * DEPENDS: 00-config, 02-text-utils, 03-state, 04-ui-shared
 * ============================================================ */

function getLingqStatus(type, key) {
  const k = (key || '').toLowerCase();
  if (statusDb.vocab && statusDb.vocab[k] !== undefined) return statusDb.vocab[k];
  if (statusDb.vocab && statusDb.vocab[key] !== undefined) return statusDb.vocab[key];
  return (vocabDb[k] || vocabDb[key]) ? 2 : 1;
}

function setLingqStatus(type, key, level) {
  const k = (key || '').toLowerCase();
  if (!statusDb.vocab) statusDb.vocab = {};
  statusDb.vocab[k] = level;
  if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
  statusTimestamps.vocab[k] = Date.now();
  touch();

  if (isTestActive) {
    if (level === 4) {
      testSessionLookups.manualMarkedKnown.add(k);
      testSessionLookups.words.delete(k);
    } else {
      testSessionLookups.manualMarkedKnown.delete(k);
    }
    updateTestLiveStats();
  }

  saveAllData();
  closeModal('modal-vocab-card');

  if (!document.getElementById('view-reader').classList.contains('hidden')) {
    requestAnimationFrame(() => renderReader());
  }
}

function updateLingqModalButtons(type, currentLevel) {
  const container = document.getElementById('vc-lingq-selector');
  if (!container) return;
  const buttons = container.querySelectorAll('button');
  buttons.forEach((btn, idx) => {
    if (idx + 1 === currentLevel) btn.classList.add('ring-2', 'ring-crimson-600', 'font-black', 'scale-105');
    else btn.classList.remove('ring-2', 'ring-crimson-600', 'font-black', 'scale-105');
  });
}

function openVocabCard(word) {
  const key = cleanEnglishWord(word);
  const data = getVocabEntry(key);
  const targetWord = (data && data.matchWord) ? data.matchWord : key;
  currentOpenKey = targetWord;

  const level = getLingqStatus('vocab', targetWord);

  if (data && (data.isBaseForm || data.isFuzzy) && data.matchWord !== key) {
    document.getElementById('vc-card-word').innerHTML = `
      ${data.matchWord} 
      <span class="text-[11px] px-2 py-0.5 rounded-full bg-amber-300 text-amber-950 font-sans font-bold">
        Gốc của "${key}"
      </span>
    `;
  } else {
    document.getElementById('vc-card-word').innerText = key;
  }

  document.getElementById('vc-card-pinyin').innerText = data ? (data.ipa || '--') : 'Chưa có IPA';

  const vcRankBadge = document.getElementById('vc-card-rank-badge');
  if (vcRankBadge) {
    const rank = getItemRank('vocab', key);
    const vcEntry = vcRankList.find(x => x.word === key);
    const count = vcEntry ? vcEntry.count : 0;
    if (rank < 9999 && count > 0) vcRankBadge.innerText = `#${rank} · ${count} lần`;
    else vcRankBadge.innerText = 'Không có trong bài';
    vcRankBadge.classList.remove('hidden');
  }

  const logicBox = document.getElementById('vc-card-logic');
  logicBox.innerText = data && data.logic ? data.logic : 'Chưa có phân tích từ nguyên.';

  const meaningsBox = document.getElementById('vc-card-meanings-list');
  meaningsBox.innerHTML = '';
  if (data && data.meaning) {
    data.meaning.split('\n').forEach(l => {
      if (l.trim()) {
        const p = document.createElement('p');
        p.className = "text-stone-900 leading-relaxed";
        p.innerText = l.trim();
        meaningsBox.appendChild(p);
      }
    });
  } else {
    meaningsBox.innerHTML = `<span class="text-stone-500 font-normal">Chưa có dữ liệu nghĩa từ vựng.</span>`;
  }

  const examplesBox = document.getElementById('vc-card-examples');
  examplesBox.innerHTML = '';
  if (data && data.examples && data.examples.length > 0) {
    data.examples.forEach(ex => {
      const p = document.createElement('p');
      p.className = "bg-stone-50 p-2 rounded border border-stone-100 font-english italic";
      p.innerText = ex;
      examplesBox.appendChild(p);
    });
  } else {
    examplesBox.innerHTML = `<span class="text-stone-400 italic">Chưa có ví dụ.</span>`;
  }

  updateLingqModalButtons('vocab', level);
  const editBtn = document.getElementById('vc-card-edit-btn');
  editBtn.innerText = targetWord !== key ? `✏️ Chỉnh sửa từ gốc "${targetWord}"` : '✏️ Chỉnh sửa từ này';
  editBtn.onclick = () => { closeModal('modal-vocab-card'); openAddVocabModal(targetWord); };

  renderGrammarHintInVocabCard(key);

  openModal('modal-vocab-card');
  speakText(key);
}

function renderGrammarHintInVocabCard(cleanWord) {
  let hintBox = document.getElementById('vc-grammar-hint-box');
  if (!hintBox) {
    const modalBody = document.querySelector('#modal-vocab-card .p-5.space-y-4');
    if (!modalBody) return;
    hintBox = document.createElement('div');
    hintBox.id = 'vc-grammar-hint-box';
    hintBox.className = 'hidden';
    const footer = modalBody.querySelector('.pt-2.flex.items-center.justify-between');
    if (footer) modalBody.insertBefore(hintBox, footer);
    else modalBody.appendChild(hintBox);
  }
  hintBox.innerHTML = '';
  hintBox.classList.add('hidden');

  const ids = grammarAnchorIndex[cleanWord] || [];
  if (ids.length === 0) return;

  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (!doc) return;

  const bm = bookmarks[doc.id];
  let targetSentence = '';
  if (bm && bm.type === 'vocab' && cleanEnglishWord(bm.word) === cleanWord) {
    const lines = doc.content.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes(cleanWord)) { targetSentence = line.trim(); break; }
    }
  }
  if (!targetSentence) {
    const lines = doc.content.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes(cleanWord)) { targetSentence = line.trim(); break; }
    }
  }
  if (!targetSentence) return;

  const tokens = tokenizeEnglishText(targetSentence);
  const matches = detectGrammarInSentence(tokens).filter(m => {
    const p = grammarDb._patterns[m.patternId];
    if (!p) return false;
    return ids.includes(m.patternId);
  });
  if (matches.length === 0) return;

  hintBox.classList.remove('hidden');
  let html = `<div class="bg-purple-50 border border-purple-200 rounded-xl p-3 space-y-2">
    <p class="text-[10px] uppercase font-bold text-purple-700 flex items-center gap-1.5">
      <span>🟣</span> Từ này thuộc cấu trúc ngữ pháp trong câu:
    </p>
    <p class="text-xs font-english text-stone-700 italic">${targetSentence}</p>
    <div class="space-y-1.5">`;

  matches.forEach(m => {
    const p = grammarDb._patterns[m.patternId];
    const matchedText = tokens.slice(m.start, m.end + 1).join(' ');
    html += `
      <button onclick="closeModal('modal-vocab-card'); openGrammarCard('${m.patternId}', ${JSON.stringify(matchedText).replace(/"/g, '&quot;')})"
              class="w-full text-left flex items-center justify-between gap-2 px-3 py-2 bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50 rounded-lg transition">
        <div class="min-w-0 flex-1">
          <p class="font-mono text-xs font-bold text-purple-800 truncate">${m.patternId}</p>
          <p class="text-[11px] text-stone-600 truncate">${p.meaning || '(chưa có nghĩa)'}</p>
        </div>
        <span class="text-purple-500 text-xs font-bold flex-shrink-0">Xem ngay →</span>
      </button>`;
  });
  html += `</div></div>`;
  hintBox.innerHTML = html;
}

function quickAddToFsrs(type, key) {
  if (!key) return;
  const k = (key || '').toLowerCase();
  const rank = getItemRank('vocab', k);
  const now = Date.now();
  const pool = fsrsPool.vocab;
  const existing = pool[k];

  if (!statusDb.vocab) statusDb.vocab = {};
  const currentLvl = getLingqStatus('vocab', k);
  if (currentLvl !== 3 && currentLvl !== 4) {
    statusDb.vocab[k] = 2;
    if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
    statusTimestamps.vocab[k] = now;
  }

  if (existing) {
    existing.streak = 0;
    existing.nextReview = now;
    existing.interval = 1;
    existing.lastReview = now;
    existing.updatedAt = now;
    existing.rank = rank;
    showToast(`🔄 "${k}" đã được reset trong bể FSRS (streak về 0).`, "info");
  } else {
    pool[k] = {
      streak: 0, interval: 1, nextReview: now, lastReview: now,
      usedSentences: [], rank: rank, updatedAt: now
    };
    showToast(`🎯 Đã ném "${k}" (Rank #${rank}) vào bể FSRS!`, "success");
  }

  touch();
  saveAllData();
  updateBadges();
  closeModal('modal-vocab-card');

  if (!document.getElementById('view-review').classList.contains('hidden')) renderReviewTables();
  if (!document.getElementById('view-reader').classList.contains('hidden')) {
    requestAnimationFrame(() => renderReader());
  }
}

// ==================== VOCAB TABLE ====================
function renderVocabTable() {
  calculateFrequencies();
  const tbody = document.getElementById('vocab-table-body');
  const query = (document.getElementById('vocab-search-input').value || '').trim().toLowerCase();
  tbody.innerHTML = '';

  const items = vcRankList.map(item => ({
    word: item.word, count: item.count, frequency: item.frequency, rank: item.rank,
    ...(getVocabEntry(item.word) || {})
  }));
  const statTotal = document.getElementById('vc-stat-total-tokens');
  const statUnique = document.getElementById('vc-stat-unique-count');
  const statKnown = document.getElementById('vc-stat-known-count');
  const statDisplay = document.getElementById('vc-stat-display-count');
  if (statTotal) statTotal.innerText = totalVcOccurrences.toLocaleString('vi-VN');
  if (statUnique) statUnique.innerText = items.filter(i => i.count > 0).length.toLocaleString('vi-VN');
  if (statKnown) statKnown.innerText = items.filter(i => getLingqStatus('vocab', i.word) === 4).length.toLocaleString('vi-VN');

  let filtered = items.filter(item => {
    const lvl = getLingqStatus('vocab', item.word);
    if (vcHideKnown && lvl === 4) return false;
    if (query.startsWith('#')) {
      const searchRank = parseInt(query.substring(1), 10);
      if (!isNaN(searchRank)) return item.rank === searchRank;
    }
    return item.word.includes(query) || (item.ipa && item.ipa.toLowerCase().includes(query)) || (item.meaning && item.meaning.toLowerCase().includes(query));
  });

  let displayedList = (!vcShowAllRanks && !query) ? filtered.filter(i => i.rank >= vcRankOffset && i.rank < vcRankOffset + vcDisplayLimit) : filtered;
  if (statDisplay) statDisplay.innerText = displayedList.length.toLocaleString('vi-VN');

  displayedList.forEach(item => {
    const word = item.word;
    const lvl = getLingqStatus('vocab', word);
    const tr = document.createElement('tr');
    tr.className = "hover:bg-stone-50 transition";
    tr.innerHTML = `
      <td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded font-mono text-xs font-bold bg-stone-100">#${item.rank}</span></td>
      <td class="px-4 py-3 font-english text-xl font-bold text-stone-900 cursor-pointer hover:text-crimson-600" onclick="openVocabCard('${word}')">${word}</td>
      <td class="px-4 py-3 font-mono text-xs">${item.count} lần (${item.frequency.toFixed(2)}%)</td>
      <td class="px-4 py-3 text-crimson-600 font-medium text-xs">${item.ipa || '--'}</td>
      <td class="px-4 py-3 text-stone-800 text-xs max-w-xs truncate">${item.meaning || '--'}</td>
      <td class="px-4 py-3 text-stone-500 text-xs max-w-sm truncate">${item.logic || '--'}</td>
      <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold lingq-level-${lvl}">Mức ${lvl}</span></td>
      <td class="px-4 py-3 text-right">
        <button onclick="openAddVocabModal('${word}')" class="text-xs text-stone-600 hover:text-crimson-600 mr-2">Sửa</button>
        <button onclick="deleteVocab('${word}')" class="text-xs text-red-500 hover:text-red-700">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleIncludeHiddenStats(checked) {
  includeHiddenInStats = checked;
  idbSet('includeHiddenInStats', includeHiddenInStats);
  calculateFrequencies();
  renderVocabTable();
}

function handleRankSlider(type, value) {
  vcRankOffset = parseInt(value, 10) || 1;
  vcShowAllRanks = false;
  renderVocabTable();
}

function resetRankView(type) {
  vcShowAllRanks = true;
  renderVocabTable();
}

function loadMoreItems(type) {
  vcDisplayLimit += 50;
  renderVocabTable();
}

function toggleLoadAll(type) {
  vcShowAllRanks = !vcShowAllRanks;
  renderVocabTable();
}

function toggleHideKnown(type) {
  vcHideKnown = !vcHideKnown;
  renderVocabTable();
}

function handleTableScroll(type) { /* để trống cho tương thích */ }

function openAddVocabModal(existingWord = null) {
  document.getElementById('vc-input-word').value = existingWord || '';
  document.getElementById('vc-input-word').readOnly = !!existingWord;
  const item = existingWord ? vocabDb[existingWord.toLowerCase()] || vocabDb[existingWord] : null;
  document.getElementById('vc-input-pinyin').value = item ? (item.ipa || '') : '';
  document.getElementById('vc-input-meaning').value = item ? (item.meaning || '') : '';
  document.getElementById('vc-input-logic').value = item ? (item.logic || '') : '';
  document.getElementById('vc-input-examples').value = item && item.examples ? item.examples.join('\n') : '';
  openModal('modal-vocab-editor');
}

function saveVocabForm(e) {
  e.preventDefault();
  const word = document.getElementById('vc-input-word').value.trim().toLowerCase();
  if (!word) return;
  const examplesRaw = document.getElementById('vc-input-examples').value.trim();
  vocabDb[word] = {
    ipa: document.getElementById('vc-input-pinyin').value.trim(),
    meaning: document.getElementById('vc-input-meaning').value.trim(),
    logic: document.getElementById('vc-input-logic').value.trim(),
    examples: examplesRaw ? examplesRaw.split('\n').map(s => s.trim()).filter(Boolean) : [],
    updatedAt: Date.now()
  };
  touch();
  saveAllData();
  closeModal('modal-vocab-editor');
  renderVocabTable();
  showToast(`Đã lưu từ vựng "${word}"`, "success");
}

function deleteVocab(word) {
  showConfirmModal(`Xóa từ vựng "${word}"?`, () => {
    delete vocabDb[word];
    touch();
    saveAllData();
    renderVocabTable();
  });
}

async function markAllAsNew(type) {
  const currentStatus = statusDb.vocab || {};
  const toChange = Object.keys(currentStatus).filter(k => {
    const lvl = currentStatus[k];
    return lvl !== 2 && lvl !== 3;
  });

  const confirmed = await new Promise(resolve => {
    const existing = document.getElementById('danger-confirm-modal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'danger-confirm-modal';
    modal.className = "fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4";
    const requireText = 'RESET VOCAB';
    modal.innerHTML = `
      <div class="bg-white max-w-md w-full rounded-2xl p-5 shadow-2xl border-2 border-rose-300">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">⚠️</span>
          <h3 class="font-bold text-base text-rose-700">CẢNH BÁO NGUY HIỂM</h3>
        </div>
        <div class="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 space-y-2 mb-4">
          <p><b>Hành động này sẽ đánh dấu toàn bộ Từ vựng là "Mới" (level 1).</b></p>
          <p><b>SẼ GIỮ NGUYÊN:</b> level 2 (Đang học) và level 3 (Sắp thuộc).</p>
          <p><b>SẼ ĐỔI VỀ LEVEL 1:</b> ${toChange.length} mục.</p>
          <p class="text-rose-700 font-bold">⚠️ Level 4 (Đã biết) cũng sẽ bị đưa về level 1!</p>
        </div>
        <label class="block text-xs font-bold text-stone-700 mb-1.5">
          Gõ chính xác <span class="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-rose-700">${requireText}</span> để xác nhận:
        </label>
        <input type="text" id="danger-confirm-input" autocomplete="off" spellcheck="false"
               class="w-full bg-stone-50 border-2 border-stone-300 focus:border-rose-500 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none"
               placeholder="Gõ vào đây...">
        <div class="flex justify-end gap-2 mt-4">
          <button id="danger-confirm-cancel" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold">Hủy</button>
          <button id="danger-confirm-ok" disabled class="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold opacity-40 cursor-not-allowed">Xác nhận Reset</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const input = document.getElementById('danger-confirm-input');
    const okBtn = document.getElementById('danger-confirm-ok');
    const cancelBtn = document.getElementById('danger-confirm-cancel');
    input.addEventListener('input', () => {
      if (input.value === requireText) {
        okBtn.disabled = false;
        okBtn.classList.remove('opacity-40', 'cursor-not-allowed');
        okBtn.classList.add('hover:bg-rose-700');
      } else {
        okBtn.disabled = true;
        okBtn.classList.add('opacity-40', 'cursor-not-allowed');
        okBtn.classList.remove('hover:bg-rose-700');
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value === requireText) {
        modal.remove();
        resolve(true);
      }
    });
    cancelBtn.onclick = () => { modal.remove(); resolve(false); };
    okBtn.onclick = () => {
      if (input.value !== requireText) return;
      modal.remove();
      resolve(true);
    };
    setTimeout(() => input.focus(), 100);
  });

  if (!confirmed) return;

  const now = Date.now();
  let changedCount = 0;
  Object.keys(currentStatus).forEach(k => {
    const lvl = currentStatus[k];
    if (lvl === 2 || lvl === 3) return;
    currentStatus[k] = 1;
    if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
    statusTimestamps.vocab[k] = now;
    changedCount++;
  });
  Object.keys(vocabDb).forEach(k => {
    if (currentStatus[k] === undefined) {
      currentStatus[k] = 1;
      if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
      statusTimestamps.vocab[k] = now;
      changedCount++;
    }
  });
  statusDb.vocab = currentStatus;
  touch();
  await saveAllData();
  renderVocabTable();
  if (!document.getElementById('view-reader').classList.contains('hidden')) renderReader();
  showToast(`🔄 Đã đánh dấu ${changedCount} từ vựng là "Mới".`, "success");
}

// ==================== RANK EXPORT ====================
function openRankExportModal(type) {
  calculateFrequencies();
  document.getElementById('rank-export-min').value = 1;
  document.getElementById('rank-export-max').value = 50;
  updateRankExportPreview();
  openModal('modal-rank-export');
}

function updateRankExportPreview() {
  const minRank = parseInt(document.getElementById('rank-export-min').value, 10) || 1;
  const maxRank = parseInt(document.getElementById('rank-export-max').value, 10) || 50;
  const excludeKnown = document.getElementById('rank-export-exclude-known').checked;
  const onlyMissing = document.getElementById('rank-export-only-missing').checked;
  const sourceList = vcRankList;
  currentRankExportFilteredList = sourceList.filter(item => {
    if (item.rank < minRank || item.rank > maxRank) return false;
    const key = item.word;
    if (excludeKnown && getLingqStatus('vocab', key) === 4) return false;
    if (onlyMissing && vocabDb[key]) return false;
    return true;
  });
  document.getElementById('rank-export-count').innerText = currentRankExportFilteredList.length;
  const previewBox = document.getElementById('rank-export-preview-box');
  previewBox.innerHTML = '';
  currentRankExportFilteredList.forEach(item => {
    const tag = document.createElement('span');
    tag.className = "inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-stone-200 rounded-lg text-xs font-english shadow-xs";
    tag.innerHTML = `<span>${item.word}</span><span class="text-[10px] text-stone-400 font-mono">#${item.rank}</span>`;
    previewBox.appendChild(tag);
  });
  const rawItems = currentRankExportFilteredList.map(i => i.word);
  document.getElementById('rank-export-prompt-box').value = generateAiPrompt('vocab', rawItems);
}

function copyRankExportItemsOnly() {
  const raw = currentRankExportFilteredList.map(i => i.word);
  copyToClipboard(raw.join(', '), "Đã sao chép danh sách!");
}

function copyRankExportPrompt() {
  copyToClipboard(document.getElementById('rank-export-prompt-box').value, "Đã sao chép prompt!");
}

function downloadRankExportJson() {
  const payload = { type: 'vocab', items: currentRankExportFilteredList };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rank_export_vocab.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}