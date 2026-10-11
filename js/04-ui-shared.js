/* ============================================================
 * FILE: 04-ui-shared.js
 * DOMAIN: Modal, toast, confirm, tab switcher, badge, clipboard
 * DEPENDS: 00-config, 03-state
 * ============================================================ */

function openModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('hidden'); }

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
  if (id === 'modal-flashcard-session') {
    document.body.classList.remove('flashcard-open');
  }
  if (window.__needReaderRerender && (id === 'modal-vocab-card')) {
    window.__needReaderRerender = false;
    if (!document.getElementById('view-reader').classList.contains('hidden')) {
      requestAnimationFrame(() => renderReader());
    }
  }
}

function showToast(message, type = "info") {
  if (toastTimeout) clearTimeout(toastTimeout);
  const container = document.getElementById('toast-container');
  container.innerHTML = '';
  const toast = document.createElement('div');
  const bgColors = { success: 'bg-emerald-800 text-white', error: 'bg-rose-800 text-white', warning: 'bg-amber-700 text-white', info: 'bg-stone-800 text-white' };
  toast.className = `${bgColors[type] || bgColors.info} px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  toastTimeout = setTimeout(() => {
    if (toast.parentNode) toast.remove();
    toastTimeout = null;
  }, 2000);
}

function showConfirmModal(question, onConfirm, onCancel) {
  const existing = document.getElementById('custom-confirm-modal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'custom-confirm-modal';
  modal.className = "fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4";
  modal.innerHTML = `
    <div class="bg-white max-w-sm w-full rounded-2xl p-5 shadow-xl border border-stone-200">
      <p class="text-sm font-semibold text-stone-800 mb-4">${question}</p>
      <div class="flex justify-end gap-2">
        <button id="btn-confirm-cancel" class="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold">Hủy</button>
        <button id="btn-confirm-ok" class="px-3.5 py-1.5 bg-crimson-600 hover:bg-crimson-700 text-white rounded-lg text-xs font-semibold">Đồng ý</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('btn-confirm-cancel').onclick = () => {
    modal.remove();
    if (typeof onCancel === 'function') onCancel();
  };
  document.getElementById('btn-confirm-ok').onclick = () => {
    modal.remove();
    onConfirm();
  };
}

function copyToClipboard(text, msg = "Đã sao chép!") {
  if (!text) return;
  const t = document.createElement("textarea");
  t.value = text;
  t.style.position = "fixed";
  document.body.appendChild(t);
  t.select();
  try { document.execCommand('copy'); showToast(msg, "success"); } catch (e) {}
  document.body.removeChild(t);
}

function switchTab(tabId) {
  const tabs = ['reader', 'review', 'docs', 'vocab', 'grammar', 'sentence'];
  tabs.forEach(t => {
    const view = document.getElementById(`view-${t}`);
    const btn = document.getElementById(`tab-btn-${t}`);
    if (!view || !btn) return;
    if (t === tabId) {
      view.classList.remove('hidden');
      btn.className = "px-3.5 py-1.5 rounded-lg transition-all duration-150 bg-white text-crimson-600 font-bold shadow-sm";
    } else {
      view.classList.add('hidden');
      btn.className = "px-3.5 py-1.5 rounded-lg transition-all duration-150 text-stone-600 hover:text-stone-900";
    }
  });
  if (tabId === 'reader') renderReader();
  if (tabId === 'review') renderReviewTables();
  if (tabId === 'docs') renderDocList();
  if (tabId === 'vocab') renderVocabTable();
  if (tabId === 'grammar') renderGrammarTable();
  if (tabId === 'sentence') renderSentenceTable();
}

function switchReviewSubTab(subtab) {
  const tabs = ['hanzi', 'vocab', 'grammar', 'sentence', 'docs'];
  tabs.forEach(t => {
    const btn = document.getElementById(`subtab-review-${t}`);
    const content = document.getElementById(`review-subcontent-${t}`);
    if (!btn || !content) return;
    if (t === subtab) {
      btn.className = "py-2.5 px-4 text-crimson-600 border-b-2 border-crimson-600 transition flex items-center gap-1.5 font-bold";
      content.classList.remove('hidden');
    } else {
      btn.className = "py-2.5 px-4 text-stone-500 hover:text-stone-800 border-b-2 border-transparent transition flex items-center gap-1.5";
      content.classList.add('hidden');
    }
  });
  renderReviewTables();
}

function updateBadges() {
  const vcBadge = document.getElementById('vocab-count-badge');
  if (vcBadge) vcBadge.innerText = `${Object.keys(vocabDb).length} từ`;
  const activeDoc = docs.find(d => d.id === activeDocId && !d.hidden) || docs.find(d => !d.hidden);
  const btnTitle = document.getElementById('current-doc-btn-title');
  if (btnTitle) btnTitle.innerText = activeDoc ? activeDoc.title : '(Chưa chọn bài đọc)';

  const activeVc = Object.values(fsrsPool.vocab).filter(i => !i.deleted);
  const activeGm = Object.values(grammarFsrsPool).filter(i => !i.deleted);
  const activeSn = Object.values(sentenceFsrsPool).filter(i => !i.deleted);
  const totalFsrs = activeVc.length + activeGm.length + activeSn.length;
  const totalPoolElem = document.getElementById('review-total-items-badge');
  if (totalPoolElem) totalPoolElem.innerText = `${totalFsrs} mục`;
  const now = Date.now();
  let dueCount = 0;
  activeVc.forEach(i => { if (i.nextReview <= now) dueCount++; });
  activeGm.forEach(i => { if (i.nextReview <= now) dueCount++; });
  activeSn.forEach(i => { if (i.nextReview <= now) dueCount++; });
  const dueElem = document.getElementById('fsrs-stat-due-count');
  if (dueElem) dueElem.innerText = dueCount;
  const navDue = document.getElementById('nav-due-badge');
  if (navDue) {
    if (dueCount > 0) { navDue.innerText = dueCount; navDue.classList.remove('hidden'); }
    else navDue.classList.add('hidden');
  }
  const hzCountElem = document.getElementById('fsrs-stat-hanzi-count');
  if (hzCountElem) hzCountElem.innerText = activeVc.filter(i => {
    const k = Object.keys(fsrsPool.vocab).find(key => fsrsPool.vocab[key] === i);
    return k && !k.includes(' ');
  }).length;
  const vcCountElem = document.getElementById('fsrs-stat-vocab-count');
  if (vcCountElem) vcCountElem.innerText = activeVc.filter(i => {
    const k = Object.keys(fsrsPool.vocab).find(key => fsrsPool.vocab[key] === i);
    return k && k.includes(' ');
  }).length;

  const readyDocs = docs.filter(d => d.testStatus && d.testStatus.tested && checkDocDueEligibility(d).eligible);
  const readyDocsElem = document.getElementById('fsrs-stat-ready-docs-count');
  if (readyDocsElem) readyDocsElem.innerText = readyDocs.length;

  const stepsLabelEl = document.getElementById('review-steps-label');
  if (stepsLabelEl) {
    const s = fsrsConfig.fsrsSteps || 4;
    stepsLabelEl.innerText = s >= 999 ? 'số lần không giới hạn' : `${s} lần liên tiếp`;
  }
}