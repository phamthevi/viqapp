/* ============================================================
 * FILE: 11-grammar-fsrs.js
 * DOMAIN: Grammar FSRS helpers
 * DEPENDS: 03-state, 04-ui-shared, 06-fsrs-core, 09-grammar-engine
 * ============================================================ */

function getGrammarFsrsKey(patternId) {
  return `grammar::${patternId}`;
}

function isGrammarPatternInFsrs(patternId) {
  const item = grammarFsrsPool[patternId];
  return item && !item.deleted;
}

function softDeleteGrammarFsrs(patternId, reason = 'manual') {
  if (!grammarFsrsPool[patternId]) return false;
  const now = Date.now();
  grammarFsrsPool[patternId] = {
    ...grammarFsrsPool[patternId],
    deleted: true,
    deletedAt: now,
    updatedAt: now,
    deleteReason: reason
  };
  return true;
}

function quickAddGrammarToFsrs(patternId, exampleSentence) {
  if (!patternId) return;
  const p = grammarDb._patterns[patternId];
  if (!p) { showToast("Không tìm thấy cấu trúc này!", "warning"); return; }

  const now = Date.now();
  const existing = grammarFsrsPool[patternId];
  const exampleClean = (exampleSentence || '').trim();

  if (existing && !existing.deleted) {
    existing.streak = 0;
    existing.nextReview = now;
    existing.interval = 1;
    existing.lastReview = now;
    existing.updatedAt = now;
    if (exampleClean) existing.usedSentences = [exampleClean];
    showToast(`🔄 "${patternId}" đã được reset trong bể FSRS ngữ pháp.`, "info");
  } else {
    grammarFsrsPool[patternId] = {
      streak: 0,
      interval: 1,
      nextReview: now,
      lastReview: now,
      usedSentences: exampleClean ? [exampleClean] : (p.examples || []).slice(0, 1),
      updatedAt: now,
      deleted: false,
      deletedAt: 0,
      rank: 0,
      snapshotType: p.type || 'pair',
      snapshotMeaning: p.meaning || '',
      snapshotLevel: p.level || '',
      snapshotNotes: p.notes || '',
      snapshotAnchors: getGrammarPatternDisplay(p)
    };
    showToast(`🎯 Đã ném cấu trúc "${patternId}" vào bể FSRS ngữ pháp!`, "success");
  }

  touch();
  saveAllData();
  updateBadges();
  closeModal('modal-grammar-card');
  if (!document.getElementById('view-review').classList.contains('hidden')) {
    renderReviewTables();
  }
}

function graduateGrammarFsrsManually(patternId) {
  if (grammarFsrsPool[patternId]) {
    softDeleteGrammarFsrs(patternId, 'graduated');
    touch();
    saveAllData();
    renderReviewTables();
    updateBadges();
    showToast(`Đã tốt nghiệp cấu trúc "${patternId}"!`, "success");
  }
}

function removeGrammarFsrsItem(patternId) {
  showConfirmModal(`Xóa cấu trúc "${patternId}" khỏi danh sách củng cố?`, () => {
    softDeleteGrammarFsrs(patternId, 'manual');
    touch();
    saveAllData();
    renderReviewTables();
    updateBadges();
    showToast(`Đã xóa "${patternId}"`, "info");
  });
}