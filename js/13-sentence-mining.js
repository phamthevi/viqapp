/* ============================================================
 * FILE: 13-sentence-mining.js
 * DOMAIN: Sentence Mining (DB, FSRS, table, card, import)
 * DEPENDS: 03-state, 04-ui-shared, 06-fsrs-core
 * ============================================================ */

function generateSentenceId() {
  const existing = sentenceDb || {};
  let id;
  let attempts = 0;
  const MAX_ATTEMPTS = 100;

  do {
    const num = Math.floor(Math.random() * 9999) + 1;
    id = 'S' + String(num).padStart(4, '0');
    attempts++;
    if (attempts > MAX_ATTEMPTS) {
      id = 'S' + Date.now().toString().slice(-6);
      break;
    }
  } while (existing[id] !== undefined);

  return id;
}

function softDeleteSentenceFsrs(sentenceId, reason = 'manual') {
  if (!sentenceFsrsPool[sentenceId]) return false;
  const now = Date.now();
  sentenceFsrsPool[sentenceId] = {
    ...sentenceFsrsPool[sentenceId],
    deleted: true,
    deletedAt: now,
    updatedAt: now,
    deleteReason: reason
  };
  return true;
}

function graduateSentenceFsrsManually(sentenceId) {
  if (sentenceFsrsPool[sentenceId]) {
    softDeleteSentenceFsrs(sentenceId, 'graduated');
    touch();
    saveAllData();
    renderReviewTables();
    updateBadges();
    showToast(`Đã tốt nghiệp Sentence "${sentenceId}"!`, "success");
  }
}

function removeSentenceFsrsItem(sentenceId) {
  showConfirmModal(`Xóa Sentence "${sentenceId}" khỏi danh sách củng cố?`, () => {
    softDeleteSentenceFsrs(sentenceId, 'manual');
    touch();
    saveAllData();
    renderReviewTables();
    updateBadges();
    showToast(`Đã xóa "${sentenceId}"`, "info");
  });
}

function validateSentenceCard(id, card) {
  if (!id || typeof id !== 'string') {
    return { valid: false, reason: 'ID không phải string' };
  }
  if (!/^S\d{4}$/.test(id)) {
    return { valid: false, reason: `ID "${id}" sai format (phải là S + đúng 4 chữ số, VD: S0001)` };
  }
  if (!card || typeof card !== 'object' || Array.isArray(card)) {
    return { valid: false, reason: 'Card không phải object' };
  }
  if (!card.sentenceMeaning || typeof card.sentenceMeaning !== 'string' || !card.sentenceMeaning.trim()) {
    return { valid: false, reason: 'Thiếu "sentenceMeaning"' };
  }
  if (!Array.isArray(card.anchorMeanings)) {
    return { valid: false, reason: 'Thiếu hoặc sai "anchorMeanings" (phải là array)' };
  }
  return { valid: true };
}

function importSentenceJsonValidated(parsed) {
  const report = {
    total: 0,
    accepted: [],
    rejected: []
  };

  if (!parsed || typeof parsed !== 'object') {
    report.rejected.push({ id: '(root)', reason: 'JSON gốc không phải object' });
    return report;
  }

  const sentences = parsed._sentences || parsed;
  if (!sentences || typeof sentences !== 'object') {
    report.rejected.push({ id: '(root)', reason: 'Thiếu "_sentences" hoặc không phải object' });
    return report;
  }

  Object.entries(sentences).forEach(([id, card]) => {
    report.total++;

    const check = validateSentenceCard(id, card);
    if (!check.valid) {
      report.rejected.push({ id, reason: check.reason });
      return;
    }

    const existing = sentenceDb[id];
    if (!existing) {
      report.rejected.push({
        id,
        reason: 'ID chưa tồn tại trong DB (chỉ nhận cập nhật card đã có)'
      });
      return;
    }

    const expected = (existing.anchors || []).length;
    const received = card.anchorMeanings.length;
    if (expected !== received) {
      report.rejected.push({
        id,
        reason: `anchorMeanings có ${received} phần tử, nhưng card có ${expected} neo. Bỏ qua để tránh lệch.`
      });
      return;
    }

    sentenceDb[id] = {
      ...existing,
      sentenceMeaning: card.sentenceMeaning.trim(),
      anchorMeanings: card.anchorMeanings.map(m => String(m || '').trim()),
      grammarNote: (card.grammarNote || '').trim(),
      needsData: false,
      updatedAt: Date.now()
    };

    if (sentenceFsrsPool[id] && !sentenceFsrsPool[id].deleted) {
      sentenceFsrsPool[id].snapshotMeaning = sentenceDb[id].sentenceMeaning;
      sentenceFsrsPool[id].snapshotAnchorMeanings = sentenceDb[id].anchorMeanings;
      sentenceFsrsPool[id].updatedAt = Date.now();
    }

    report.accepted.push({ id, action: 'overwritten' });
  });

  if (report.accepted.length > 0) {
    touch();
    saveAllData();
  }

  return report;
}

// ==================== SENTENCE TABLE RENDER ====================
function renderSentenceTable() {
  const tbody = document.getElementById('sentence-table-body');
  if (!tbody) return;

  const query = (document.getElementById('sentence-search-input')?.value || '').trim().toLowerCase();
  const entries = Object.entries(sentenceDb || {}).map(([id, s]) => ({ id, ...s }));

  const totalEl = document.getElementById('sn-stat-total');
  const pendingEl = document.getElementById('sn-stat-pending');
  const inFsrsEl = document.getElementById('sn-stat-in-fsrs');
  const anchorsEl = document.getElementById('sn-stat-anchors');
  const navBadge = document.getElementById('sentence-count-badge-nav');
  const headerBadge = document.getElementById('sentence-count-badge');

  const pendingCount = entries.filter(e => e.needsData).length;
  const inFsrsCount = Object.keys(sentenceFsrsPool || {}).filter(id => !sentenceFsrsPool[id].deleted).length;
  const totalAnchors = entries.reduce((sum, e) => sum + (e.anchors?.length || 0), 0);

  if (totalEl) totalEl.innerText = entries.length;
  if (pendingEl) pendingEl.innerText = pendingCount;
  if (inFsrsEl) inFsrsEl.innerText = inFsrsCount;
  if (anchorsEl) anchorsEl.innerText = totalAnchors;
  if (navBadge) navBadge.innerText = entries.length;
  if (headerBadge) headerBadge.innerText = `${entries.length} câu`;

  let filtered = entries.filter(e => {
    if (!query) return true;
    const hay = [
      e.id, e.current, e.prev, e.next, e.sentenceMeaning,
      ...(e.anchors || []), ...(e.anchorMeanings || []), e.grammarNote
    ].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(query);
  });

  filtered.sort((a, b) => {
    if (a.needsData !== b.needsData) return a.needsData ? -1 : 1;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-stone-400 text-xs">Chưa có Sentence Card nào. Vào tab Đọc → bật "Ghép cấu trúc" → chọn neo → bấm 📸 Sentence.</td></tr>`;
    return;
  }

  filtered.forEach(s => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-stone-50 transition";

    const anchorsDisplay = (s.anchors || []).join(' · ') || '--';
    const meaningDisplay = s.needsData
      ? `<span class="text-amber-600 text-xs italic">Chờ AI nạp nghĩa...</span>`
      : `<span class="text-stone-800 text-xs">${(s.sentenceMeaning || '').substring(0, 80)}${(s.sentenceMeaning || '').length > 80 ? '...' : ''}</span>`;

    const statusBadge = s.needsData
      ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">Chờ nạp</span>`
      : `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">Sẵn sàng</span>`;

    const inFsrs = sentenceFsrsPool[s.id] && !sentenceFsrsPool[s.id].deleted;
    const fsrsBadge = inFsrs ? `<span class="ml-1 text-[10px] text-rose-600" title="Đang trong FSRS">🎯</span>` : '';

    tr.innerHTML = `
      <td class="px-4 py-3">
        <span class="font-mono text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 cursor-pointer hover:bg-rose-100"
              onclick="openSentenceCard('${s.id}')">${s.id}</span>
      </td>
      <td class="px-4 py-3 font-english text-xs text-stone-700 max-w-md">
        <p class="line-clamp-2" title="${(s.current || '').replace(/"/g, '&quot;')}">${s.current || '--'}</p>
        <p class="text-[10px] text-stone-400 mt-0.5">Từ: ${s.docTitle || '--'}</p>
      </td>
      <td class="px-4 py-3 text-xs text-purple-800 font-mono">${anchorsDisplay}</td>
      <td class="px-4 py-3">${meaningDisplay}</td>
      <td class="px-4 py-3">${statusBadge}${fsrsBadge}</td>
      <td class="px-4 py-3 text-right whitespace-nowrap">
        <button onclick="openSentenceCard('${s.id}')" class="text-xs text-stone-600 hover:text-rose-700 mr-2">Xem</button>
        <button onclick="deleteSentenceCard('${s.id}')" class="text-xs text-red-500 hover:text-red-700">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==================== SENTENCE CARD MODAL ====================
function openSentenceCard(sentenceId) {
  const s = sentenceDb[sentenceId];
  if (!s) { showToast("Không tìm thấy Sentence Card!", "warning"); return; }

  let modal = document.getElementById('modal-sentence-card');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-sentence-card';
    modal.className = 'fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden';
    modal.innerHTML = `
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-rose-200 overflow-hidden flex flex-col max-h-[88vh]">
        <div class="p-4 border-b border-rose-200 flex items-center justify-between bg-rose-50">
          <h3 class="font-bold text-sm text-rose-900 flex items-center gap-1.5"><span>📸</span> Sentence Card</h3>
          <button onclick="closeModal('modal-sentence-card')" class="text-stone-400 hover:text-stone-700 text-xl leading-none">&times;</button>
        </div>
        <div id="sentence-card-body" class="p-5 space-y-4 overflow-y-auto"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const anchorMeaningsHtml = (s.anchors || []).map((anchor, idx) => {
    const meaning = (s.anchorMeanings || [])[idx] || '';
    return `
      <div class="flex items-start gap-2 bg-purple-50 border border-purple-200 rounded-lg p-2.5">
        <span class="font-mono text-xs font-bold text-purple-800 bg-white px-2 py-0.5 rounded border border-purple-300 flex-shrink-0">${anchor}</span>
        <span class="text-xs text-stone-700 flex-1">${meaning || '<i class="text-stone-400">Chưa có nghĩa</i>'}</span>
      </div>
    `;
  }).join('');

  const body = modal.querySelector('#sentence-card-body');
  body.innerHTML = `
    <div>
      <h3 class="font-bold text-lg text-rose-800 flex items-center gap-2">
        <span class="font-mono text-sm bg-rose-100 px-2 py-0.5 rounded">${s.id}</span>
        <span class="text-sm text-stone-500 font-normal">Sentence Card</span>
      </h3>
      <p class="text-xs text-stone-500 mt-1">
        Từ bài: <b>${s.docTitle || '--'}</b>
        ${s.needsData ? '<span class="ml-2 text-amber-600 font-bold">⚠️ Chờ nạp nghĩa</span>' : '<span class="ml-2 text-emerald-600 font-bold">✓ Sẵn sàng</span>'}
      </p>
    </div>
    <div class="bg-amber-50/60 border border-amber-200 rounded-xl p-3 space-y-2">
      <span class="text-[10px] uppercase font-bold text-amber-800 block">Ngữ cảnh:</span>
      ${s.prev ? `<p class="text-xs text-stone-500 italic line-clamp-2">${s.prev}</p>` : ''}
      <p class="font-english text-base font-bold text-stone-900">${s.current}</p>
      ${s.next ? `<p class="text-xs text-stone-500 italic line-clamp-2">${s.next}</p>` : ''}
    </div>
    <div>
      <span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Nghĩa câu:</span>
      <p class="text-sm text-stone-800">${s.sentenceMeaning || '<i class="text-stone-400">Chưa có nghĩa</i>'}</p>
    </div>
    <div>
      <span class="text-[10px] uppercase font-bold text-stone-400 block mb-1.5">Neo trong câu (${(s.anchors || []).length}):</span>
      <div class="space-y-1.5">${anchorMeaningsHtml || '<i class="text-stone-400 text-xs">Không có neo</i>'}</div>
    </div>
    ${s.grammarNote ? `
    <div>
      <span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Ghi chú ngữ pháp:</span>
      <p class="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">${s.grammarNote}</p>
    </div>` : ''}
    <div class="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
      <div class="text-[11px] text-stone-400">
        ${sentenceFsrsPool[s.id] && !sentenceFsrsPool[s.id].deleted
          ? `🎯 Trong FSRS · Chuỗi ${sentenceFsrsPool[s.id].streak || 0}`
          : '⚪ Chưa có trong FSRS'}
      </div>
      <div class="flex items-center gap-2">
        <button onclick="speakText(${JSON.stringify(s.current).replace(/"/g, '&quot;')})"
                class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition">🔊 Đọc câu</button>
        <button onclick="addSentenceToFsrs('${s.id}')"
                class="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-lg transition flex items-center gap-1">🎯 Ném vào FSRS</button>
        <button onclick="closeModal('modal-sentence-card')"
                class="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition">Đóng</button>
      </div>
    </div>
  `;
  openModal('modal-sentence-card');
}

function deleteSentenceCard(sentenceId) {
  showConfirmModal(`Xóa Sentence Card "${sentenceId}"?`, () => {
    delete sentenceDb[sentenceId];
    if (sentenceFsrsPool[sentenceId]) {
      softDeleteSentenceFsrs(sentenceId, 'parent_deleted');
    }
    touch();
    saveAllData();
    renderSentenceTable();
    updateBadges();
    showToast(`Đã xóa "${sentenceId}"`, "info");
  });
}

function addSentenceToFsrs(sentenceId) {
  const s = sentenceDb[sentenceId];
  if (!s) { showToast("Không tìm thấy Sentence Card!", "warning"); return; }
  if (s.needsData) { showToast("Vui lòng nạp nghĩa trước khi ném vào FSRS!", "warning"); return; }

  const now = Date.now();
  const existing = sentenceFsrsPool[sentenceId];

  if (existing && !existing.deleted) {
    existing.snapshotCurrent = s.current;
    existing.snapshotPrev = s.prev || '';
    existing.snapshotNext = s.next || '';
    existing.snapshotMeaning = s.sentenceMeaning || '';
    existing.snapshotAnchors = s.anchors || [];
    existing.snapshotAnchorMeanings = s.anchorMeanings || [];
    existing.updatedAt = now;
    showToast(`♻️ "${sentenceId}" đã có trong FSRS, chỉ cập nhật lại snapshot.`, "info");
  } else {
    sentenceFsrsPool[sentenceId] = {
      streak: 0,
      interval: 1,
      nextReview: now,
      lastReview: now,
      updatedAt: now,
      deleted: false,
      deletedAt: 0,
      snapshotCurrent: s.current,
      snapshotPrev: s.prev || '',
      snapshotNext: s.next || '',
      snapshotMeaning: s.sentenceMeaning || '',
      snapshotAnchors: s.anchors || [],
      snapshotAnchorMeanings: s.anchorMeanings || []
    };
    showToast(`🎯 Đã ném "${sentenceId}" vào bể FSRS!`, "success");
  }

  touch();
  saveAllData();
  updateBadges();
  renderSentenceTable();
  closeModal('modal-sentence-card');
}

// ==================== SCAN MISSING SENTENCE CARDS ====================
function scanMissingSentenceCards() {
  const candidates = [];

  Object.entries(sentenceDb || {}).forEach(([id, s]) => {
    const isMissing =
      s.needsData === true ||
      !s.sentenceMeaning ||
      !s.sentenceMeaning.trim();

    if (!isMissing) return;

    candidates.push({
      token: id,
      type: 'sentence',
      context: {
        current: s.current || '',
        prev: s.prev || '',
        next: s.next || ''
      },
      anchors: s.anchors || [],
      anchorMeanings: s.anchorMeanings || [],
      docTitle: s.docTitle || '',
      docId: s.docId || '',
      label: `[Cần nạp] ${id}`,
      needsData: true
    });
  });

  candidates.sort((a, b) => {
    const ta = sentenceDb[a.token]?.createdAt || 0;
    const tb = sentenceDb[b.token]?.createdAt || 0;
    return tb - ta;
  });

  return candidates;
}