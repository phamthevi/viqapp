/* ============================================================
 * FILE: 18-bootstrap.js
 * DOMAIN: Khởi động app (DOMContentLoaded)
 * DEPENDS: mọi file khác
 * ============================================================ */

window.addEventListener('DOMContentLoaded', async () => {
  await initData();
  cleanupTombstones(30);
  await saveAllData();
  renderReader();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isZenMode) toggleZenMode();
    if (e.code === 'Space' && !document.getElementById('modal-flashcard-session').classList.contains('hidden')) {
      e.preventDefault();
      toggleFlipFlashcard();
    }
  });
});