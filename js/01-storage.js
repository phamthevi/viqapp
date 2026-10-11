/* ============================================================
 * FILE: 01-storage.js
 * DOMAIN: IndexedDB wrapper, initData, saveAllData, migration
 * DEPENDS: 00-config, 02-text-utils (runtime), 03-state
 *         09-grammar-engine (runtime), 04-ui-shared (runtime)
 *         17-backup-sync (runtime, SupabaseSync + updateSupabaseUI)
 * ============================================================ */

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = (e) => { dbInstance = e.target.result; resolve(dbInstance); };
    request.onerror = (e) => { console.error("IndexedDB error:", e.target.error); reject(e.target.error); };
  });
}

async function idbGet(key, defaultValue = null) {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result !== undefined ? req.result.value : defaultValue);
      req.onerror = () => resolve(defaultValue);
    });
  } catch (err) { return defaultValue; }
}

async function idbSet(key, value) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ key, value });
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) { console.error(`Lỗi ghi ${key}:`, err); }
}

async function idbBatchSet(items) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      for (const [key, value] of Object.entries(items)) {
        store.put({ key, value });
      }
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) { console.error("Lỗi batch lưu:", err); }
}

// ==================== KHỞI TẠO DATA ====================
async function initData() {
  try {
    await openDatabase();
    docs = (await idbGet('docs')) || DEFAULT_DOCS;
    folders = (await idbGet('folders')) || [];
    vocabDb = (await idbGet('vocabDb')) || DEFAULT_VOCAB;
    statusDb = (await idbGet('statusDb')) || DEFAULT_STATUS;
    if (!statusDb.vocab) statusDb.vocab = {};

    fsrsPool = (await idbGet('fsrsPool')) || { vocab: {} };
    if (!fsrsPool.vocab) fsrsPool.vocab = {};

    fsrsConfig = (await idbGet('fsrsConfig')) || DEFAULT_FSRS_CONFIG;
    if (fsrsConfig.fsrsSteps === undefined) fsrsConfig.fsrsSteps = 4;
    activeDocId = (await idbGet('activeDocId')) || (docs[0] ? docs[0].id : null);
    showPinyinRuby = (await idbGet('showPinyinRuby', false)) === true;
    readerFontSize = (await idbGet('readerFontSize', 24)) || 24;
    highlightMode = (await idbGet('highlightMode', 'vocab')) || 'vocab';
    includeHiddenInStats = (await idbGet('includeHiddenInStats', true)) !== false;
    savedFirebaseConfig = await idbGet('savedFirebaseConfig', null);
    statusTimestamps = (await idbGet('statusTimestamps')) || { vocab: {} };
    if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
    localLastModified = (await idbGet('localLastModified', 0)) || 0;

    const MIGRATE_TIME = new Date('2020-01-01T00:00:00Z').getTime();

    const rawGrammar = await idbGet('grammarDb', null);
    grammarDb = normalizeGrammarDb(rawGrammar);
    rebuildGrammarIndex();
    grammarFsrsPool = (await idbGet('grammarFsrsPool', {})) || {};

    // Load Sentence Mining data
    sentenceDb = (await idbGet('sentenceDb', {})) || {};
    sentenceFsrsPool = (await idbGet('sentenceFsrsPool', {})) || {};
    Object.keys(sentenceFsrsPool).forEach(k => {
      const item = sentenceFsrsPool[k];
      if (item.updatedAt === undefined || item.updatedAt <= 1) item.updatedAt = MIGRATE_TIME;
      if (item.deleted === undefined) item.deleted = false;
      if (item.deletedAt === undefined) item.deletedAt = 0;
    });
    pageSize = (await idbGet('pageSize', 1000)) || 1000;
    patternPreferences = (await idbGet('patternPreferences', {})) || {};

    docs.forEach(d => {
      if (d.updatedAt === undefined || d.updatedAt <= 1) d.updatedAt = MIGRATE_TIME;
      if (d.deletedAt === undefined) d.deletedAt = null;
      if (!d.testStatus) {
        d.testStatus = { tested: false, lastTestDate: null, corruptionRate: 0, failed: false, lockedUntil: null, retested: false, trackedItems: [] };
      }
    });
    folders.forEach(f => {
      if (f.updatedAt === undefined || f.updatedAt <= 1) f.updatedAt = MIGRATE_TIME;
      if (f.deletedAt === undefined) f.deletedAt = null;
    });
    Object.keys(vocabDb).forEach(k => {
      if (vocabDb[k].updatedAt === undefined || vocabDb[k].updatedAt <= 1) vocabDb[k].updatedAt = MIGRATE_TIME;
    });
    Object.keys(fsrsPool.vocab).forEach(k => {
      if (fsrsPool.vocab[k].updatedAt === undefined || fsrsPool.vocab[k].updatedAt <= 1) fsrsPool.vocab[k].updatedAt = MIGRATE_TIME;
      if (fsrsPool.vocab[k].deletedAt === undefined) fsrsPool.vocab[k].deletedAt = 0;
      if (fsrsPool.vocab[k].deleted === undefined) fsrsPool.vocab[k].deleted = false;
    });
    ['vocab'].forEach(type => {
      if (!statusTimestamps[type]) statusTimestamps[type] = {};
      Object.keys(statusDb[type] || {}).forEach(k => {
        if (!statusTimestamps[type][k] || statusTimestamps[type][k] <= 1) {
          statusTimestamps[type][k] = MIGRATE_TIME;
        }
      });
    });
  } catch (e) {
    console.error("Lỗi khởi tạo:", e);
    docs = DEFAULT_DOCS;
    vocabDb = DEFAULT_VOCAB;
    statusDb = DEFAULT_STATUS;
    fsrsPool = { vocab: {} };
  }
  calculateFrequencies();
  await saveAllData();
  updateBadges();

  lastSyncedAt = (await idbGet('lastSyncedAt', 0)) || 0;

  // ========== DEFAULT SUPABASE CONFIG ==========
  const DEFAULT_SB_URL = 'https://wxmzmcopqierhdwnshyr.supabase.co';
  const DEFAULT_SB_KEY = 'sb_publishable_RiAgCkxK9tZxhuKEqCk2SQ_0LqnO138';
  const sbCfg = (await idbGet('supabaseConfig', null)) || { url: DEFAULT_SB_URL, key: DEFAULT_SB_KEY };

  const urlInp = document.getElementById('sb-url');
  const keyInp = document.getElementById('sb-anon-key');
  if (urlInp) urlInp.value = sbCfg.url;
  if (keyInp) keyInp.value = sbCfg.key;

  window.SupabaseSync.init(sbCfg.url, sbCfg.key);
  await window.SupabaseSync.checkAuth();
  updateSupabaseUI();
}

function touch() {
  localLastModified = Date.now();
}

async function saveAllData() {
  updateBadges();
  try {
    await idbBatchSet({
      docs, folders, vocabDb, statusDb, fsrsPool, fsrsConfig,
      activeDocId, showPinyinRuby, readerFontSize, highlightMode, includeHiddenInStats,
      savedFirebaseConfig,
      statusTimestamps,
      localLastModified,
      grammarDb,
      grammarFsrsPool,
      pageSize, bookmarks,
      sentenceDb,
      sentenceFsrsPool
    });
  } catch (err) { console.error("Lỗi lưu DB:", err); }
}