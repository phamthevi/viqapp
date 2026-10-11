/* ============================================================
 * FILE: 17-backup-sync.js
 * DOMAIN: Backup/Restore JSON, SupabaseSync, delta sync
 * DEPENDS: 01-storage, 03-state, 04-ui-shared, 09-grammar-engine,
 *          10-grammar-ui, 13-sentence-mining
 * ============================================================ */

// ==================== SUPABASE SDK WRAPPER ====================
window.SupabaseSync = {
  client: null,
  currentUser: null,

  init(url, key) {
    if (!url || !key || typeof window.supabase === 'undefined') return false;
    this.client = window.supabase.createClient(url, key);
    return true;
  },

  async checkAuth() {
    if (!this.client) return null;
    try {
      const { data: { session } } = await this.client.auth.getSession();
      this.currentUser = session ? session.user : null;
      return this.currentUser;
    } catch (e) {
      console.warn("Lỗi kiểm tra auth Supabase:", e);
      return null;
    }
  }
};

// ==================== NORMALIZE HELPERS ====================
// Chuyển đổi giữa local shape và cloud shape cho grammar/sentence

function grammarPatternToCloud(id, p) {
  return {
    id: id,
    type: p.type || 'pair',
    meaning: p.meaning || '',
    notes: p.notes || '',
    level_cefr: p.level || '',
    priority: p.priority || 10,
    examples: p.examples || [],
    left_tokens: p.left || [],
    right_tokens: p.right || [],
    anchor_tokens: p.anchor || [],
    chain_tokens: p.chain || [],
    left_group: p.leftGroup || null,
    right_group: p.rightGroup || null,
    anchor_group: p.anchorGroup || null,
    needs_data: p.needsData === true,
    context: p.context || {},
    updated_at: new Date(p.updatedAt || Date.now()).toISOString(),
    deleted_at: p.deletedAt ? new Date(p.deletedAt).toISOString() : null
  };
}

function cloudGrammarToPattern(row) {
  const p = {
    type: row.type || 'pair',
    meaning: row.meaning || '',
    notes: row.notes || '',
    level: row.level_cefr || '',
    priority: row.priority || 10,
    examples: row.examples || [],
    needsData: row.needs_data === true,
    context: row.context || {},
    updatedAt: new Date(row.updated_at).getTime()
  };
  if (row.left_group) p.leftGroup = row.left_group;
  else if (Array.isArray(row.left_tokens) && row.left_tokens.length) p.left = row.left_tokens;

  if (row.right_group) p.rightGroup = row.right_group;
  else if (Array.isArray(row.right_tokens) && row.right_tokens.length) p.right = row.right_tokens;

  if (row.anchor_group) p.anchorGroup = row.anchor_group;
  else if (Array.isArray(row.anchor_tokens) && row.anchor_tokens.length) p.anchor = row.anchor_tokens;

  if (Array.isArray(row.chain_tokens) && row.chain_tokens.length) p.chain = row.chain_tokens;

  return p;
}

function sentenceCardToCloud(id, s) {
  return {
    id: id,
    current: s.current || '',
    prev: s.prev || '',
    next: s.next || '',
    page_index: s.pageIndex || 0,
    doc_id: s.docId || null,
    doc_title: s.docTitle || '',
    anchors: s.anchors || [],
    sentence_meaning: s.sentenceMeaning || '',
    anchor_meanings: s.anchorMeanings || [],
    grammar_note: s.grammarNote || '',
    needs_data: s.needsData === true,
    created_at: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
    updated_at: new Date(s.updatedAt || Date.now()).toISOString(),
    deleted_at: s.deletedAt ? new Date(s.deletedAt).toISOString() : null
  };
}

function cloudSentenceToCard(row) {
  return {
    id: row.id,
    current: row.current || '',
    prev: row.prev || '',
    next: row.next || '',
    pageIndex: row.page_index || 0,
    docId: row.doc_id || null,
    docTitle: row.doc_title || '',
    anchors: row.anchors || [],
    sentenceMeaning: row.sentence_meaning || '',
    anchorMeanings: row.anchor_meanings || [],
    grammarNote: row.grammar_note || '',
    needsData: row.needs_data === true,
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    updatedAt: new Date(row.updated_at).getTime(),
    deletedAt: row.deleted_at ? new Date(row.deleted_at).getTime() : null
  };
}

function grammarFsrsToCloud(pid, item) {
  return {
    pattern_id: pid,
    streak: item.streak || 0,
    interval: item.interval || 1,
    next_review: item.nextReview ? new Date(item.nextReview).toISOString() : null,
    last_review: item.lastReview ? new Date(item.lastReview).toISOString() : null,
    used_sentences: item.usedSentences || [],
    rank: item.rank || 0,
    snapshot_type: item.snapshotType || '',
    snapshot_meaning: item.snapshotMeaning || '',
    snapshot_level: item.snapshotLevel || '',
    snapshot_notes: item.snapshotNotes || '',
    snapshot_anchors: item.snapshotAnchors || '',
    updated_at: new Date(item.updatedAt || Date.now()).toISOString(),
    deleted_at: item.deletedAt ? new Date(item.deletedAt).toISOString() : null,
    deleted: item.deleted === true
  };
}

function cloudGrammarFsrsToItem(row) {
  return {
    streak: row.streak || 0,
    interval: row.interval || 1,
    nextReview: row.next_review ? new Date(row.next_review).getTime() : Date.now(),
    lastReview: row.last_review ? new Date(row.last_review).getTime() : 0,
    usedSentences: row.used_sentences || [],
    rank: row.rank || 0,
    snapshotType: row.snapshot_type || '',
    snapshotMeaning: row.snapshot_meaning || '',
    snapshotLevel: row.snapshot_level || '',
    snapshotNotes: row.snapshot_notes || '',
    snapshotAnchors: row.snapshot_anchors || '',
    updatedAt: new Date(row.updated_at).getTime(),
    deleted: row.deleted === true,
    deletedAt: row.deleted_at ? new Date(row.deleted_at).getTime() : 0
  };
}

function sentenceFsrsToCloud(sid, item) {
  return {
    sentence_id: sid,
    streak: item.streak || 0,
    interval: item.interval || 1,
    next_review: item.nextReview ? new Date(item.nextReview).toISOString() : null,
    last_review: item.lastReview ? new Date(item.lastReview).toISOString() : null,
    snapshot_current: item.snapshotCurrent || '',
    snapshot_prev: item.snapshotPrev || '',
    snapshot_next: item.snapshotNext || '',
    snapshot_meaning: item.snapshotMeaning || '',
    snapshot_anchors: item.snapshotAnchors || [],
    snapshot_anchor_meanings: item.snapshotAnchorMeanings || [],
    updated_at: new Date(item.updatedAt || Date.now()).toISOString(),
    deleted_at: item.deletedAt ? new Date(item.deletedAt).toISOString() : null,
    deleted: item.deleted === true
  };
}

function cloudSentenceFsrsToItem(row) {
  return {
    streak: row.streak || 0,
    interval: row.interval || 1,
    nextReview: row.next_review ? new Date(row.next_review).getTime() : Date.now(),
    lastReview: row.last_review ? new Date(row.last_review).getTime() : 0,
    updatedAt: new Date(row.updated_at).getTime(),
    deleted: row.deleted === true,
    deletedAt: row.deleted_at ? new Date(row.deleted_at).getTime() : 0,
    snapshotCurrent: row.snapshot_current || '',
    snapshotPrev: row.snapshot_prev || '',
    snapshotNext: row.snapshot_next || '',
    snapshotMeaning: row.snapshot_meaning || '',
    snapshotAnchors: row.snapshot_anchors || [],
    snapshotAnchorMeanings: row.snapshot_anchor_meanings || []
  };
}

async function pushInChunks(sb, table, rows, conflictCols, chunkSize = 200) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const batch = rows.slice(i, i + chunkSize);
    const { error } = await sb.from(table).upsert(batch, { onConflict: conflictCols });
    if (error) throw error;
  }
}

// ==================== SUPABASE CONFIG & AUTH ====================
async function saveSupabaseConfig() {
  const url = (document.getElementById('sb-url') || {}).value?.trim() || '';
  const key = (document.getElementById('sb-anon-key') || {}).value?.trim() || '';
  if (!url || !key) {
    showToast("Vui lòng nhập đầy đủ URL và Anon Key", "warning");
    return;
  }
  await idbSet('supabaseConfig', { url, key });
  window.SupabaseSync.init(url, key);
  await window.SupabaseSync.checkAuth();
  updateSupabaseUI();
  showToast("Đã lưu cấu hình Supabase!", "success");
}

async function handleSupabaseSignIn() {
  const email = (document.getElementById('sb-auth-email') || {}).value?.trim() || '';
  const password = (document.getElementById('sb-auth-pass') || {}).value?.trim() || '';
  const sb = window.SupabaseSync.client;
  if (!sb) { showToast("Chưa cấu hình Supabase URL và Key", "warning"); return; }
  if (!email || !password) { showToast("Vui lòng nhập email và mật khẩu", "warning"); return; }

  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) { showToast("Đăng nhập thất bại: " + error.message, "error"); return; }
  window.SupabaseSync.currentUser = data.user;
  updateSupabaseUI();
  showToast("Đăng nhập thành công!", "success");
}

async function handleSupabaseSignUp() {
  const email = (document.getElementById('sb-auth-email') || {}).value?.trim() || '';
  const password = (document.getElementById('sb-auth-pass') || {}).value?.trim() || '';
  const sb = window.SupabaseSync.client;
  if (!sb) { showToast("Chưa cấu hình Supabase URL và Key", "warning"); return; }
  if (!email || !password) { showToast("Vui lòng nhập email và mật khẩu", "warning"); return; }

  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) { showToast("Đăng ký thất bại: " + error.message, "error"); return; }
  showToast("Đã tạo tài khoản! Kiểm tra email xác thực nếu có.", "info");
}

function updateSupabaseUI() {
  const user = window.SupabaseSync.currentUser;
  const statusDot = document.getElementById('cloud-status-dot');
  const statusText = document.getElementById('cloud-status-text');
  const userEmailCont = document.getElementById('cloud-user-email');
  const userEmailText = document.getElementById('cloud-user-email-text');
  const btnSync = document.getElementById('btn-cloud-upload');
  const authBox = document.getElementById('sb-auth-box');

  if (user) {
    if (statusDot) statusDot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block";
    if (statusText) statusText.innerText = "Đã kết nối";
    if (userEmailCont) userEmailCont.classList.remove('hidden');
    if (userEmailText) userEmailText.innerText = user.email;
    if (btnSync) btnSync.disabled = false;
    if (authBox) authBox.classList.add('hidden');
  } else {
    if (statusDot) statusDot.className = "w-2.5 h-2.5 rounded-full bg-stone-300 inline-block";
    if (statusText) statusText.innerText = window.SupabaseSync.client ? "Chưa đăng nhập" : "Chưa cấu hình Supabase";
    if (userEmailCont) userEmailCont.classList.add('hidden');
    if (btnSync) btnSync.disabled = true;
    if (authBox) authBox.classList.remove('hidden');
  }
}

// ==================== TIMESTAMP BACKFILL & RESET ====================
function backfillTimestampsForSync() {
  const FAKE_OLD_TS = Date.now() - 24 * 60 * 60 * 1000;
  const needsBackfill = (ts) => (ts === undefined || ts === null || ts <= 1);
  let count = 0;

  docs.forEach(d => {
    if (needsBackfill(d.updatedAt)) { d.updatedAt = FAKE_OLD_TS; count++; }
    if (d.deletedAt === undefined) d.deletedAt = null;
  });
  folders.forEach(f => {
    if (needsBackfill(f.updatedAt)) { f.updatedAt = FAKE_OLD_TS; count++; }
    if (f.deletedAt === undefined) f.deletedAt = null;
  });
  Object.keys(vocabDb).forEach(k => {
    if (needsBackfill(vocabDb[k].updatedAt)) { vocabDb[k].updatedAt = FAKE_OLD_TS; count++; }
    if (vocabDb[k].deletedAt === undefined) vocabDb[k].deletedAt = null;
  });
  ['vocab'].forEach(type => {
    Object.keys(fsrsPool[type] || {}).forEach(k => {
      const item = fsrsPool[type][k];
      if (needsBackfill(item.updatedAt)) { item.updatedAt = FAKE_OLD_TS; count++; }
      if (item.deletedAt === undefined) item.deletedAt = 0;
      if (item.deleted === undefined) item.deleted = false;
    });
  });
  ['vocab'].forEach(type => {
    if (!statusTimestamps[type]) statusTimestamps[type] = {};
    Object.keys(statusDb[type] || {}).forEach(k => {
      if (needsBackfill(statusTimestamps[type][k])) {
        statusTimestamps[type][k] = FAKE_OLD_TS;
        count++;
      }
    });
  });
  Object.keys(grammarDb._patterns || {}).forEach(id => {
    if (needsBackfill(grammarDb._patterns[id].updatedAt)) {
      grammarDb._patterns[id].updatedAt = FAKE_OLD_TS;
      count++;
    }
    if (grammarDb._patterns[id].deletedAt === undefined) grammarDb._patterns[id].deletedAt = null;
  });
  if (!grammarDb._aliasGroupTimestamps) grammarDb._aliasGroupTimestamps = {};
  Object.keys(grammarDb._aliasGroups || {}).forEach(name => {
    if (needsBackfill(grammarDb._aliasGroupTimestamps[name])) {
      grammarDb._aliasGroupTimestamps[name] = FAKE_OLD_TS;
      count++;
    }
  });
  Object.keys(sentenceDb || {}).forEach(id => {
    if (needsBackfill(sentenceDb[id].updatedAt)) { sentenceDb[id].updatedAt = FAKE_OLD_TS; count++; }
    if (sentenceDb[id].deletedAt === undefined) sentenceDb[id].deletedAt = null;
  });
  Object.keys(grammarFsrsPool || {}).forEach(pid => {
    const item = grammarFsrsPool[pid];
    if (needsBackfill(item.updatedAt)) { item.updatedAt = FAKE_OLD_TS; count++; }
    if (item.deletedAt === undefined) item.deletedAt = 0;
    if (item.deleted === undefined) item.deleted = false;
  });
  Object.keys(sentenceFsrsPool || {}).forEach(sid => {
    const item = sentenceFsrsPool[sid];
    if (needsBackfill(item.updatedAt)) { item.updatedAt = FAKE_OLD_TS; count++; }
    if (item.deletedAt === undefined) item.deletedAt = 0;
    if (item.deleted === undefined) item.deleted = false;
  });

  if (count > 0) console.log(`[Backfill] Đã gán timestamp giả cho ${count} mục cũ.`);
  return count;
}

async function setAllTimestampsToNow() {
  const ok = confirm(
    "⚠️ CẢNH BÁO NGUY HIỂM\n\n" +
    "Hành động này sẽ:\n" +
    "• Gán updatedAt = THỜI ĐIỂM HIỆN TẠI cho TOÀN BỘ dữ liệu local\n" +
    "• Bao gồm: bài đọc, thư mục, từ vựng, FSRS, ngữ pháp, sentence\n" +
    "• Kể cả những mục đã có timestamp mới hơn\n\n" +
    "Khi sync tiếp theo:\n" +
    "• TOÀN BỘ dữ liệu local sẽ được đẩy lên cloud\n" +
    "• GHI ĐÈ lên dữ liệu cloud (dù cloud có bản mới hơn)\n\n" +
    "Chỉ dùng khi bạn chắc chắn máy này có dữ liệu ĐÚNG NHẤT.\n\n" +
    "Tiếp tục?"
  );
  if (!ok) return;

  const now = Date.now();
  let count = 0;
  docs.forEach(d => { d.updatedAt = now; count++; });
  folders.forEach(f => { f.updatedAt = now; count++; });
  Object.keys(vocabDb).forEach(k => { vocabDb[k].updatedAt = now; count++; });
  ['vocab'].forEach(type => {
    Object.keys(fsrsPool[type] || {}).forEach(k => {
      fsrsPool[type][k].updatedAt = now;
      count++;
    });
  });
  ['vocab'].forEach(type => {
    if (!statusTimestamps[type]) statusTimestamps[type] = {};
    Object.keys(statusDb[type] || {}).forEach(k => {
      statusTimestamps[type][k] = now;
      count++;
    });
  });
  Object.keys(grammarDb._patterns || {}).forEach(id => {
    grammarDb._patterns[id].updatedAt = now;
    count++;
  });
  if (!grammarDb._aliasGroupTimestamps) grammarDb._aliasGroupTimestamps = {};
  Object.keys(grammarDb._aliasGroups || {}).forEach(name => {
    grammarDb._aliasGroupTimestamps[name] = now;
    count++;
  });
  Object.keys(sentenceDb || {}).forEach(id => {
    sentenceDb[id].updatedAt = now;
    count++;
  });
  Object.keys(grammarFsrsPool || {}).forEach(pid => {
    grammarFsrsPool[pid].updatedAt = now;
    count++;
  });
  Object.keys(sentenceFsrsPool || {}).forEach(sid => {
    sentenceFsrsPool[sid].updatedAt = now;
    count++;
  });
  await saveAllData();
  showToast(`⏰ Đã set ${count} mục về timestamp hôm nay. Giờ hãy bấm Đồng bộ Delta.`, "success");
}

async function forceFullResync() {
  const ok = confirm(
    "Ép đồng bộ lại từ đầu sẽ:\n" +
    "• Đặt mốc lastSyncedAt = 0\n" +
    "• Đẩy TOÀN BỘ dữ liệu local lên cloud\n" +
    "• Vẫn merge 2 chiều (không ghi đè dữ liệu cloud mới hơn)\n\n" +
    "Tiếp tục?"
  );
  if (!ok) return;
  lastSyncedAt = 0;
  await idbSet('lastSyncedAt', 0);
  showToast("Đã reset mốc sync. Đang chạy đồng bộ lại...", "info");
  await syncWithSupabase();
}

async function forcePullAllFromCloud() {
  const sb = window.SupabaseSync.client;
  const user = window.SupabaseSync.currentUser;
  if (!sb || !user) { showToast("Vui lòng đăng nhập Supabase trước", "warning"); return; }

  const ok = confirm(
    "⚠️ FORCE PULL ALL — KÉO TOÀN BỘ TỪ CLOUD VỀ\n\n" +
    "Hành động này sẽ:\n" +
    "• XÓA HẾT dữ liệu local hiện tại\n" +
    "• Kéo TOÀN BỘ dữ liệu từ cloud về (không quan tâm timestamp)\n" +
    "• GHI ĐÈ tất cả\n\n" +
    "Mọi thay đổi local CHƯA sync sẽ MẤT VĨNH VIỄN.\n\n" +
    "Tiếp tục?"
  );
  if (!ok) return;

  const btn = document.getElementById('btn-force-pull');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = `<span class="animate-spin">⏳</span> Đang kéo toàn bộ từ cloud...`;
    btn.disabled = true;
  }

  try {
    const pullStats = { docs: 0, folders: 0, vocab: 0, progress: 0, grammar: 0, aliasGroups: 0, sentenceCards: 0, grammarFsrs: 0, sentenceFsrs: 0 };
    const PAGE_SIZE = 1000;

    // ============ FOLDERS ============
    {
      const { data: cloudFolders, error: errF } = await sb.from('folders').select('*');
      if (errF) throw errF;
      folders = (cloudFolders || []).filter(row => !row.deleted_at).map(row => ({
        id: row.id, name: row.name,
        createdAt: row.created_at,
        updatedAt: new Date(row.updated_at).getTime(),
        deletedAt: row.deleted_at ? new Date(row.deleted_at).getTime() : null
      }));
      pullStats.folders = folders.length;
    }

    // ============ VOCAB ============
    let allVocab = []; let offset = 0;
    while (true) {
      const { data, error } = await sb.from('vocab').select('*').range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      allVocab = allVocab.concat(data);
      if (data.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }
    vocabDb = {};
    allVocab.forEach(row => {
      if (!row.deleted_at) {
        vocabDb[row.id] = {
          ipa: row.ipa || row.pinyin || '',
          pos: row.pos || '',
          meaning: row.meaning || '',
          logic: row.logic || '',
          examples: row.examples || [],
          level: row.level_cefr || '',
          updatedAt: new Date(row.updated_at).getTime()
        };
      }
    });
    pullStats.vocab = Object.keys(vocabDb).length;

    // ============ DOCS ============
    let allDocs = []; offset = 0;
    while (true) {
      const { data, error } = await sb.from('docs').select('*').range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      allDocs = allDocs.concat(data);
      if (data.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }
    docs = allDocs.filter(row => !row.deleted_at).map(row => ({
      id: row.id, title: row.title, content: row.content,
      folderId: row.folder_id, hidden: row.hidden,
      testStatus: row.test_status || { tested: false, lastTestDate: null, corruptionRate: 0, failed: false, lockedUntil: null, retested: false, trackedItems: [] },
      createdAt: row.created_at,
      updatedAt: new Date(row.updated_at).getTime(),
      deletedAt: null
    }));
    pullStats.docs = docs.length;

    // ============ USER_PROGRESS (chỉ vocab) ============
    let allProgress = []; offset = 0;
    while (true) {
      const { data, error } = await sb.from('user_progress').select('*').range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      allProgress = allProgress.concat(data);
      if (data.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }
    statusDb = { vocab: {} };
    statusTimestamps = { vocab: {} };
    fsrsPool = { vocab: {} };
    allProgress.forEach(row => {
      const type = row.item_type;
      const key = row.item_key;
      if (!type || !key) return;
      if (!statusDb[type]) statusDb[type] = {};
      if (!statusTimestamps[type]) statusTimestamps[type] = {};
      if (!fsrsPool[type]) fsrsPool[type] = {};
      const cTime = new Date(row.updated_at).getTime();
      statusDb[type][key] = row.level || 1;
      statusTimestamps[type][key] = cTime;
      if (!row.deleted_at && row.next_review) {
        fsrsPool[type][key] = {
          streak: row.streak || 0,
          interval: row.interval || 1,
          nextReview: new Date(row.next_review).getTime(),
          lastReview: row.last_review ? new Date(row.last_review).getTime() : 0,
          usedSentences: row.used_sentences || [],
          rank: row.rank || 9999,
          updatedAt: cTime,
          deleted: false
        };
      }
    });
    pullStats.progress = allProgress.length;

    // ============ GRAMMAR ALIAS GROUPS ============
    {
      const { data, error } = await sb.from('grammar_alias_groups').select('*');
      if (error) throw error;
      grammarDb._aliasGroups = {};
      grammarDb._aliasGroupTimestamps = {};
      (data || []).forEach(row => {
        if (row.deleted_at) return;
        grammarDb._aliasGroups[row.name] = row.tokens || [];
        grammarDb._aliasGroupTimestamps[row.name] = new Date(row.updated_at).getTime();
      });
      pullStats.aliasGroups = Object.keys(grammarDb._aliasGroups).length;
    }

    // ============ GRAMMAR PATTERNS ============
    let allGrammar = []; offset = 0;
    while (true) {
      const { data, error } = await sb.from('grammar').select('*').range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      allGrammar = allGrammar.concat(data);
      if (data.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }
    grammarDb._patterns = {};
    allGrammar.forEach(row => {
      if (row.deleted_at) return;
      grammarDb._patterns[row.id] = cloudGrammarToPattern(row);
    });
    pullStats.grammar = Object.keys(grammarDb._patterns).length;

    // ============ SENTENCE CARDS ============
    let allSentences = []; offset = 0;
    while (true) {
      const { data, error } = await sb.from('sentence_cards').select('*').range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      allSentences = allSentences.concat(data);
      if (data.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }
    sentenceDb = {};
    allSentences.forEach(row => {
      if (row.deleted_at) return;
      sentenceDb[row.id] = cloudSentenceToCard(row);
    });
    pullStats.sentenceCards = Object.keys(sentenceDb).length;

    // ============ GRAMMAR FSRS ============
    let allGFsrs = []; offset = 0;
    while (true) {
      const { data, error } = await sb.from('grammar_fsrs').select('*').range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      allGFsrs = allGFsrs.concat(data);
      if (data.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }
    grammarFsrsPool = {};
    allGFsrs.forEach(row => {
      if (row.deleted_at) return;
      grammarFsrsPool[row.pattern_id] = cloudGrammarFsrsToItem(row);
    });
    pullStats.grammarFsrs = Object.keys(grammarFsrsPool).length;

    // ============ SENTENCE FSRS ============
    let allSFsrs = []; offset = 0;
    while (true) {
      const { data, error } = await sb.from('sentence_fsrs').select('*').range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      allSFsrs = allSFsrs.concat(data);
      if (data.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }
    sentenceFsrsPool = {};
    allSFsrs.forEach(row => {
      if (row.deleted_at) return;
      sentenceFsrsPool[row.sentence_id] = cloudSentenceFsrsToItem(row);
    });
    pullStats.sentenceFsrs = Object.keys(sentenceFsrsPool).length;

    // ============ REBUILD INDEX & SAVE ============
    rebuildGrammarIndex();

    if (!docs.find(d => d.id === activeDocId)) {
      activeDocId = docs.length > 0 ? docs[0].id : null;
    }

    lastSyncedAt = Date.now();
    await idbSet('lastSyncedAt', lastSyncedAt);
    await saveAllData();

    renderReader();
    renderDocList();
    renderVocabTable();
    renderGrammarTable();
    renderSentenceTable();
    renderReviewTables();
    updateBadges();

    const summary =
      `✅ Đã kéo toàn bộ từ cloud:\n\n` +
      `📚 Bài đọc: ${pullStats.docs}\n` +
      `📁 Thư mục: ${pullStats.folders}\n` +
      `📑 Từ vựng: ${pullStats.vocab}\n` +
      `🎯 Tiến độ/FSRS: ${pullStats.progress}\n` +
      `🟣 Ngữ pháp: ${pullStats.grammar} pattern, ${pullStats.aliasGroups} group\n` +
      `📸 Sentence: ${pullStats.sentenceCards} câu\n` +
      `🎓 Grammar FSRS: ${pullStats.grammarFsrs}\n` +
      `🎓 Sentence FSRS: ${pullStats.sentenceFsrs}`;
    alert(summary);
    showToast(`✅ Đã kéo ${pullStats.vocab} từ và ${pullStats.grammar} pattern từ cloud!`, "success");
  } catch (err) {
    console.error("❌ Lỗi Force Pull All:", err);
    alert("❌ LỖI KÉO DỮ LIỆU:\n\n" + err.message);
    showToast("Lỗi kéo dữ liệu: " + err.message, "error");
  } finally {
    if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
  }
}

// ==================== SYNC CHÍNH (DELTA 2 CHIỀU) ====================
async function syncWithSupabase() {
  const sb = window.SupabaseSync.client;
  const user = window.SupabaseSync.currentUser;
  if (!sb || !user) { showToast("Vui lòng đăng nhập Supabase trước khi sync", "warning"); return; }

  const btn = document.getElementById('btn-cloud-upload');
  const originalText = btn.innerHTML;
  btn.innerHTML = `<span class="animate-spin">⏳</span> Đang sync delta...`;
  btn.disabled = true;

  try {
    const syncStartTime = Date.now();
    const lastSyncIso = new Date(lastSyncedAt).toISOString();
    let maxCloudTimestamp = lastSyncedAt;
    let pushCount = 0, pullCount = 0;
    const ensureTs = (ts) => (!ts || ts <= 1) ? syncStartTime : ts;
    const userId = user.id;

    // ============ FOLDERS ============
    {
      const localChanges = folders
        .filter(f => (f.updatedAt || 0) > lastSyncedAt || !f.updatedAt)
        .map(f => {
          f.updatedAt = ensureTs(f.updatedAt);
          return {
            id: f.id, user_id: userId, name: f.name,
            created_at: f.createdAt || new Date(syncStartTime).toISOString(),
            updated_at: new Date(f.updatedAt).toISOString(),
            deleted_at: f.deletedAt ? new Date(f.deletedAt).toISOString() : null
          };
        });
      if (localChanges.length > 0) {
        await pushInChunks(sb, 'folders', localChanges, 'user_id,id');
        pushCount += localChanges.length;
      }
      const { data: cloudRows, error } = await sb.from('folders').select('*').gt('updated_at', lastSyncIso);
      if (error) throw error;
      (cloudRows || []).forEach(row => {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const existing = folders.find(f => f.id === row.id);
        const lTime = existing?.updatedAt || 0;
        if (cTime > lTime) {
          if (row.deleted_at) folders = folders.filter(f => f.id !== row.id);
          else {
            const updated = { id: row.id, name: row.name, createdAt: row.created_at, updatedAt: cTime };
            if (existing) Object.assign(existing, updated);
            else folders.push(updated);
          }
          pullCount++;
        }
      });
    }

    // ============ VOCAB ============
    {
      const localChanges = Object.entries(vocabDb)
        .filter(([_, item]) => (item.updatedAt || 0) > lastSyncedAt || !item.updatedAt)
        .map(([word, item]) => {
          item.updatedAt = ensureTs(item.updatedAt);
          return {
            id: word, user_id: userId,
            ipa: item.ipa || '', pos: item.pos || '',
            meaning: item.meaning || '', logic: item.logic || '',
            examples: item.examples || [], level_cefr: item.level || '',
            updated_at: new Date(item.updatedAt).toISOString(),
            deleted_at: item.deletedAt ? new Date(item.deletedAt).toISOString() : null
          };
        });
      if (localChanges.length > 0) {
        await pushInChunks(sb, 'vocab', localChanges, 'user_id,id');
        pushCount += localChanges.length;
      }
      const { data: cloudRows, error } = await sb.from('vocab').select('*').gt('updated_at', lastSyncIso);
      if (error) throw error;
      (cloudRows || []).forEach(row => {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const lTime = vocabDb[row.id]?.updatedAt || 0;
        if (cTime > lTime) {
          if (row.deleted_at) delete vocabDb[row.id];
          else {
            vocabDb[row.id] = {
              ipa: row.ipa || row.pinyin || '', pos: row.pos || '',
              meaning: row.meaning || '', logic: row.logic || '',
              examples: row.examples || [], level: row.level_cefr || '',
              updatedAt: cTime
            };
          }
          pullCount++;
        }
      });
    }

    // ============ DOCS ============
    {
      const localChanges = docs
        .filter(d => (d.updatedAt || 0) > lastSyncedAt || !d.updatedAt)
        .map(d => {
          d.updatedAt = ensureTs(d.updatedAt);
          return {
            id: d.id, user_id: userId, title: d.title, content: d.content,
            folder_id: d.folderId || null, hidden: !!d.hidden,
            test_status: d.testStatus || {},
            created_at: d.createdAt || new Date(syncStartTime).toISOString(),
            updated_at: new Date(d.updatedAt).toISOString(),
            deleted_at: d.deletedAt ? new Date(d.deletedAt).toISOString() : null
          };
        });
      if (localChanges.length > 0) {
        await pushInChunks(sb, 'docs', localChanges, 'user_id,id');
        pushCount += localChanges.length;
      }
      const { data: cloudRows, error } = await sb.from('docs').select('*').gt('updated_at', lastSyncIso);
      if (error) throw error;
      (cloudRows || []).forEach(row => {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const existing = docs.find(d => d.id === row.id);
        const lTime = existing?.updatedAt || 0;
        if (cTime > lTime) {
          if (row.deleted_at) docs = docs.filter(d => d.id !== row.id);
          else {
            const updated = {
              id: row.id, title: row.title, content: row.content,
              folderId: row.folder_id, hidden: row.hidden,
              testStatus: row.test_status,
              updatedAt: cTime, createdAt: row.created_at
            };
            if (existing) Object.assign(existing, updated);
            else docs.push(updated);
          }
          pullCount++;
        }
      });
    }

    // ============ USER_PROGRESS (chỉ vocab) ============
    {
      const progressChanges = [];
      const keys = new Set([...Object.keys(fsrsPool.vocab || {}), ...Object.keys(statusDb.vocab || {})]);
      keys.forEach(k => {
        const fsrs = fsrsPool.vocab[k];
        let statTime = statusTimestamps.vocab?.[k] || 0;
        let fsrsTime = fsrs?.updatedAt || 0;
        if (statTime <= 1 && statusDb.vocab[k]) statTime = statusTimestamps.vocab[k] = syncStartTime;
        if (fsrsTime <= 1 && fsrs) fsrsTime = fsrs.updatedAt = syncStartTime;
        const maxTime = Math.max(statTime, fsrsTime);
        if (maxTime > lastSyncedAt) {
          const isFsrs = fsrs && !fsrs.deleted;
          progressChanges.push({
            user_id: userId, item_type: 'vocab', item_key: k,
            level: statusDb.vocab[k] || 1,
            streak: isFsrs ? (fsrs.streak || 0) : 0,
            interval: isFsrs ? (fsrs.interval || 1) : 1,
            next_review: (isFsrs && fsrs.nextReview > 1000000) ? new Date(fsrs.nextReview).toISOString() : null,
            last_review: (isFsrs && fsrs.lastReview > 1000000) ? new Date(fsrs.lastReview).toISOString() : null,
            used_sentences: isFsrs ? (fsrs.usedSentences || []) : [],
            rank: isFsrs ? (fsrs.rank || 9999) : 9999,
            updated_at: new Date(maxTime).toISOString(),
            deleted_at: fsrs?.deleted ? new Date(fsrs.deletedAt || maxTime).toISOString() : null
          });
        }
      });
      if (progressChanges.length > 0) {
        await pushInChunks(sb, 'user_progress', progressChanges, 'user_id,item_type,item_key');
        pushCount += progressChanges.length;
      }
      const { data: cloudRows, error } = await sb.from('user_progress').select('*').gt('updated_at', lastSyncIso);
      if (error) throw error;
      (cloudRows || []).forEach(row => {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const type = row.item_type, key = row.item_key;
        if (!statusDb[type]) statusDb[type] = {};
        if (!statusTimestamps[type]) statusTimestamps[type] = {};
        if (!fsrsPool[type]) fsrsPool[type] = {};
        const lTime = Math.max(statusTimestamps[type]?.[key] || 0, fsrsPool[type]?.[key]?.updatedAt || 0);
        if (cTime > lTime) {
          statusDb[type][key] = row.level;
          statusTimestamps[type][key] = cTime;
          if (row.deleted_at) delete fsrsPool[type][key];
          else if (row.next_review) {
            fsrsPool[type][key] = {
              streak: row.streak, interval: row.interval,
              nextReview: new Date(row.next_review).getTime(),
              lastReview: row.last_review ? new Date(row.last_review).getTime() : 0,
              usedSentences: row.used_sentences || [],
              rank: row.rank, updatedAt: cTime
            };
          } else delete fsrsPool[type][key];
          pullCount++;
        }
      });
    }

    // ============ GRAMMAR ALIAS GROUPS ============
    {
      if (!grammarDb._aliasGroupTimestamps) grammarDb._aliasGroupTimestamps = {};
      const localChanges = Object.entries(grammarDb._aliasGroups || {})
        .filter(([name]) => {
          const ts = grammarDb._aliasGroupTimestamps[name] || 0;
          return ts > lastSyncedAt || !ts;
        })
        .map(([name, tokens]) => {
          grammarDb._aliasGroupTimestamps[name] = ensureTs(grammarDb._aliasGroupTimestamps[name]);
          return {
            name: name, user_id: userId, tokens: tokens || [],
            updated_at: new Date(grammarDb._aliasGroupTimestamps[name]).toISOString(),
            deleted_at: null
          };
        });
      if (localChanges.length > 0) {
        await pushInChunks(sb, 'grammar_alias_groups', localChanges, 'user_id,name');
        pushCount += localChanges.length;
      }
      const { data: cloudRows, error } = await sb.from('grammar_alias_groups').select('*').gt('updated_at', lastSyncIso);
      if (error) throw error;
      (cloudRows || []).forEach(row => {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const lTime = grammarDb._aliasGroupTimestamps[row.name] || 0;
        if (cTime > lTime) {
          if (row.deleted_at) {
            delete grammarDb._aliasGroups[row.name];
            delete grammarDb._aliasGroupTimestamps[row.name];
          } else {
            grammarDb._aliasGroups[row.name] = row.tokens || [];
            grammarDb._aliasGroupTimestamps[row.name] = cTime;
          }
          pullCount++;
        }
      });
    }

    // ============ GRAMMAR PATTERNS ============
    {
      const localChanges = Object.entries(grammarDb._patterns || {})
        .filter(([_, p]) => (p.updatedAt || 0) > lastSyncedAt || !p.updatedAt)
        .map(([id, p]) => {
          p.updatedAt = ensureTs(p.updatedAt);
          const cloud = grammarPatternToCloud(id, p);
          cloud.user_id = userId;
          return cloud;
        });
      if (localChanges.length > 0) {
        await pushInChunks(sb, 'grammar', localChanges, 'user_id,id');
        pushCount += localChanges.length;
      }
      const { data: cloudRows, error } = await sb.from('grammar').select('*').gt('updated_at', lastSyncIso);
      if (error) throw error;
      (cloudRows || []).forEach(row => {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const existing = grammarDb._patterns[row.id];
        const lTime = existing?.updatedAt || 0;
        if (cTime > lTime) {
          if (row.deleted_at) delete grammarDb._patterns[row.id];
          else grammarDb._patterns[row.id] = cloudGrammarToPattern(row);
          pullCount++;
        }
      });
    }

    // ============ SENTENCE CARDS ============
    {
      const localChanges = Object.entries(sentenceDb || {})
        .filter(([_, s]) => (s.updatedAt || 0) > lastSyncedAt || !s.updatedAt)
        .map(([id, s]) => {
          s.updatedAt = ensureTs(s.updatedAt);
          const cloud = sentenceCardToCloud(id, s);
          cloud.user_id = userId;
          return cloud;
        });
      if (localChanges.length > 0) {
        await pushInChunks(sb, 'sentence_cards', localChanges, 'user_id,id');
        pushCount += localChanges.length;
      }
      const { data: cloudRows, error } = await sb.from('sentence_cards').select('*').gt('updated_at', lastSyncIso);
      if (error) throw error;
      (cloudRows || []).forEach(row => {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const existing = sentenceDb[row.id];
        const lTime = existing?.updatedAt || 0;
        if (cTime > lTime) {
          if (row.deleted_at) delete sentenceDb[row.id];
          else sentenceDb[row.id] = cloudSentenceToCard(row);
          pullCount++;
        }
      });
    }

    // ============ GRAMMAR FSRS ============
    {
      const localChanges = Object.entries(grammarFsrsPool || {})
        .filter(([_, item]) => (item.updatedAt || 0) > lastSyncedAt || !item.updatedAt)
        .map(([pid, item]) => {
          item.updatedAt = ensureTs(item.updatedAt);
          const cloud = grammarFsrsToCloud(pid, item);
          cloud.user_id = userId;
          return cloud;
        });
      if (localChanges.length > 0) {
        await pushInChunks(sb, 'grammar_fsrs', localChanges, 'user_id,pattern_id');
        pushCount += localChanges.length;
      }
      const { data: cloudRows, error } = await sb.from('grammar_fsrs').select('*').gt('updated_at', lastSyncIso);
      if (error) throw error;
      (cloudRows || []).forEach(row => {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const lTime = grammarFsrsPool[row.pattern_id]?.updatedAt || 0;
        if (cTime > lTime) {
          if (row.deleted_at) delete grammarFsrsPool[row.pattern_id];
          else grammarFsrsPool[row.pattern_id] = cloudGrammarFsrsToItem(row);
          pullCount++;
        }
      });
    }

    // ============ SENTENCE FSRS ============
    {
      const localChanges = Object.entries(sentenceFsrsPool || {})
        .filter(([_, item]) => (item.updatedAt || 0) > lastSyncedAt || !item.updatedAt)
        .map(([sid, item]) => {
          item.updatedAt = ensureTs(item.updatedAt);
          const cloud = sentenceFsrsToCloud(sid, item);
          cloud.user_id = userId;
          return cloud;
        });
      if (localChanges.length > 0) {
        await pushInChunks(sb, 'sentence_fsrs', localChanges, 'user_id,sentence_id');
        pushCount += localChanges.length;
      }
      const { data: cloudRows, error } = await sb.from('sentence_fsrs').select('*').gt('updated_at', lastSyncIso);
      if (error) throw error;
      (cloudRows || []).forEach(row => {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const lTime = sentenceFsrsPool[row.sentence_id]?.updatedAt || 0;
        if (cTime > lTime) {
          if (row.deleted_at) delete sentenceFsrsPool[row.sentence_id];
          else sentenceFsrsPool[row.sentence_id] = cloudSentenceFsrsToItem(row);
          pullCount++;
        }
      });
    }

    // ============ REBUILD INDEX & SAVE ============
    rebuildGrammarIndex();

    lastSyncedAt = maxCloudTimestamp;
    await idbSet('lastSyncedAt', lastSyncedAt);
    await saveAllData();

    renderReader();
    renderDocList();
    renderVocabTable();
    renderGrammarTable();
    renderSentenceTable();
    renderReviewTables();
    updateBadges();

    const timeElem = document.getElementById('cloud-last-sync-time');
    if (timeElem) {
      timeElem.innerText = `Đã sync: ${new Date(lastSyncedAt).toLocaleTimeString('vi-VN')} (Đẩy: ${pushCount}, Nhận: ${pullCount} mục)`;
    }
    showToast(`✅ Sync delta thành công! (↑ ${pushCount} | ↓ ${pullCount})`, "success");
  } catch (err) {
    console.error("Lỗi sync Supabase:", err);
    showToast("Lỗi đồng bộ: " + err.message, "error");
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// ==================== BACKUP SUB-TABS ====================
function switchBackupSubTab(tab) {
  const fileTabBtn = document.getElementById('subtab-btn-file');
  const cloudTabBtn = document.getElementById('subtab-btn-cloud');
  const fileContent = document.getElementById('subtab-content-file');
  const cloudContent = document.getElementById('subtab-content-cloud');

  if (tab === 'file') {
    fileTabBtn.className = "flex-1 py-2 text-center border-b-2 border-crimson-600 text-crimson-600 transition font-bold";
    cloudTabBtn.className = "flex-1 py-2 text-center border-b-2 border-transparent text-stone-500 hover:text-stone-800 transition";
    fileContent.classList.remove('hidden');
    cloudContent.classList.add('hidden');
  } else {
    cloudTabBtn.className = "flex-1 py-2 text-center border-b-2 border-crimson-600 text-crimson-600 transition font-bold";
    fileTabBtn.className = "flex-1 py-2 text-center border-b-2 border-transparent text-stone-500 hover:text-stone-800 transition";
    cloudContent.classList.remove('hidden');
    fileContent.classList.add('hidden');
    updateSupabaseUI();
  }
}

// ==================== BACKUP MODAL ====================
function openBackupModal() {
  document.getElementById('stat-docs-count').innerText = `${docs.length} bài`;
  document.getElementById('stat-vocab-count').innerText = `${Object.keys(vocabDb).length} từ`;
  const totalFsrsCount = Object.keys(fsrsPool.vocab).length + Object.keys(grammarFsrsPool).length + Object.keys(sentenceFsrsPool).length;
  document.getElementById('stat-fsrs-count').innerText = `${totalFsrsCount} mục`;
  const totalKnown = Object.values(statusDb.vocab || {}).length;
  document.getElementById('stat-status-count').innerText = `${totalKnown} mục`;
  const grammarPatternCount = Object.keys(grammarDb._patterns || {}).length;
  const statGrammarElem = document.getElementById('stat-grammar-count');
  if (statGrammarElem) statGrammarElem.innerText = `${grammarPatternCount} cấu trúc`;
  openModal('modal-backup-restore');
  updateSupabaseUI();
}

function exportFullBackup() {
  const fullBackup = {
    appName: "EnglishRead", version: 1, exportedAt: new Date().toISOString(),
    docs, folders, vocabDb, statusDb, statusTimestamps,
    fsrsPool, grammarFsrsPool, sentenceFsrsPool, fsrsConfig,
    activeDocId, showPinyinRuby, readerFontSize, highlightMode,
    localLastModified, grammarDb,
    sentenceDb,
    grammarAliasGroupTimestamps: grammarDb._aliasGroupTimestamps || {}
  };
  const jsonStr = JSON.stringify(fullBackup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `englishread_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  closeModal('modal-backup-restore');
  showToast("Đã tải về file sao lưu!", "success");
}

function handleRestoreFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const fileReader = new FileReader();
  fileReader.onload = async function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed || (!parsed.docs && !parsed.vocabDb)) {
        throw new Error("File backup không đúng định dạng!");
      }

      const confirmed = confirm("Khôi phục từ file JSON sẽ nạp toàn bộ bài đọc, từ điển, level, FSRS, ngữ pháp và sentence vào máy. Tiếp tục?");
      if (!confirmed) { event.target.value = ''; return; }

      const now = Date.now();
      if (Array.isArray(parsed.docs)) {
        docs = parsed.docs;
        docs.forEach(d => { d.updatedAt = now; });
      }
      if (Array.isArray(parsed.folders)) {
        folders = parsed.folders;
        folders.forEach(f => { f.updatedAt = now; });
      }
      if (parsed.vocabDb && typeof parsed.vocabDb === 'object') {
        vocabDb = parsed.vocabDb;
        Object.keys(vocabDb).forEach(k => { vocabDb[k].updatedAt = now; });
      }
      if (parsed.statusDb && typeof parsed.statusDb === 'object') {
        statusDb = { vocab: parsed.statusDb.vocab || {} };
      }
      statusTimestamps = { vocab: {} };
      Object.keys(statusDb.vocab || {}).forEach(k => { statusTimestamps.vocab[k] = now; });

      if (parsed.fsrsPool && typeof parsed.fsrsPool === 'object') {
        fsrsPool = parsed.fsrsPool;
        if (!fsrsPool.vocab) fsrsPool.vocab = {};
        Object.keys(fsrsPool.vocab).forEach(k => { fsrsPool.vocab[k].updatedAt = now; });
      }
      if (parsed.grammarFsrsPool && typeof parsed.grammarFsrsPool === 'object') {
        grammarFsrsPool = parsed.grammarFsrsPool;
        Object.keys(grammarFsrsPool).forEach(k => { grammarFsrsPool[k].updatedAt = now; });
      } else {
        grammarFsrsPool = {};
      }
      if (parsed.sentenceFsrsPool && typeof parsed.sentenceFsrsPool === 'object') {
        sentenceFsrsPool = parsed.sentenceFsrsPool;
        Object.keys(sentenceFsrsPool).forEach(k => { sentenceFsrsPool[k].updatedAt = now; });
      } else {
        sentenceFsrsPool = {};
      }
      if (parsed.grammarDb) {
        grammarDb = normalizeGrammarDb(parsed.grammarDb);
        if (!grammarDb._aliasGroupTimestamps) grammarDb._aliasGroupTimestamps = {};
        Object.keys(grammarDb._patterns || {}).forEach(id => {
          grammarDb._patterns[id].updatedAt = now;
        });
        Object.keys(grammarDb._aliasGroups || {}).forEach(name => {
          grammarDb._aliasGroupTimestamps[name] = now;
        });
        rebuildGrammarIndex();
      }
      if (parsed.sentenceDb && typeof parsed.sentenceDb === 'object') {
        sentenceDb = parsed.sentenceDb;
        Object.keys(sentenceDb).forEach(id => {
          sentenceDb[id].updatedAt = now;
        });
      } else {
        sentenceDb = {};
      }
      if (parsed.fsrsConfig) {
        fsrsConfig = { ...DEFAULT_FSRS_CONFIG, ...parsed.fsrsConfig };
        if (fsrsConfig.fsrsSteps === undefined) fsrsConfig.fsrsSteps = 4;
      }
      if (parsed.activeDocId && docs.some(d => d.id === parsed.activeDocId)) {
        activeDocId = parsed.activeDocId;
      } else if (docs.length > 0) {
        const alive = docs.find(d => !d.deletedAt);
        if (alive) activeDocId = alive.id;
      }

      touch();
      await saveAllData();
      lastSyncedAt = 0;
      await idbSet('lastSyncedAt', 0);

      closeModal('modal-backup-restore');
      renderReader();
      renderDocList();
      renderVocabTable();
      renderGrammarTable();
      renderSentenceTable();
      renderReviewTables();
      updateBadges();

      alert(`✅ Đã nạp thành công:\n• ${docs.length} bài đọc\n• ${Object.keys(vocabDb).length} từ vựng\n• ${Object.keys(fsrsPool.vocab).length} vocab FSRS\n• ${Object.keys(grammarDb._patterns || {}).length} cấu trúc ngữ pháp\n• ${Object.keys(sentenceDb).length} Sentence Card\n• ${Object.keys(grammarFsrsPool).length} grammar FSRS\n• ${Object.keys(sentenceFsrsPool).length} sentence FSRS`);
    } catch (err) {
      console.error("Lỗi nạp file:", err);
      alert("Lỗi đọc file: " + err.message);
    }
    event.target.value = '';
  };
  fileReader.readAsText(file);
}