/* ============================================================
 * FILE: 14-docs-folders.js
 * DOMAIN: Docs & Folders CRUD, folder tree, move, select doc,
 *         smart tokenize (English text normalization)
 * DEPENDS: 02-text-utils, 03-state, 04-ui-shared
 * ============================================================ */

// ==================== DOC LIST ====================
function renderDocList() {
  const container = document.getElementById('doc-list-container');
  const foldersContainer = document.getElementById('folders-grid-container');
  const breadcrumbsContainer = document.getElementById('folder-breadcrumbs-container');
  const folderStatsSummary = document.getElementById('doc-folder-stats-summary');
  const viewTitle = document.getElementById('current-folder-view-title');
  const fileCountSpan = document.getElementById('current-folder-file-count');
  const showHidden = document.getElementById('show-hidden-docs').checked;

  if (breadcrumbsContainer) {
    breadcrumbsContainer.innerHTML = '';
    const totalDocsCount = (showHidden ? docs : docs.filter(d => !d.hidden)).filter(d => !d.deletedAt).length;
    const allBtn = document.createElement('button');
    allBtn.className = `px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${activeFolderFilter === 'all' ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`;
    allBtn.innerHTML = `<span>📚 Tất cả</span><span class="text-[10px] px-1.5 py-0.2 rounded-full ${activeFolderFilter === 'all' ? 'bg-white/20' : 'bg-stone-200'}">${totalDocsCount}</span>`;
    allBtn.onclick = () => { activeFolderFilter = 'all'; renderDocList(); };
    breadcrumbsContainer.appendChild(allBtn);

    const rootDocsCount = (showHidden ? docs : docs.filter(d => !d.hidden)).filter(d => !d.deletedAt && !d.folderId).length;
    const rootBtn = document.createElement('button');
    rootBtn.className = `px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${activeFolderFilter === 'root' ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`;
    rootBtn.innerHTML = `<span>📂 Chưa phân loại</span><span class="text-[10px] px-1.5 py-0.2 rounded-full ${activeFolderFilter === 'root' ? 'bg-white/20' : 'bg-stone-200'}">${rootDocsCount}</span>`;
    rootBtn.onclick = () => { activeFolderFilter = 'root'; renderDocList(); };
    breadcrumbsContainer.appendChild(rootBtn);

    folders.forEach(f => {
      const fDocsCount = (showHidden ? docs : docs.filter(d => !d.hidden)).filter(d => !d.deletedAt && d.folderId === f.id).length;
      const fBtn = document.createElement('button');
      fBtn.className = `px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${activeFolderFilter === f.id ? 'bg-crimson-600 text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`;
      fBtn.innerHTML = `<span>📁 ${f.name}</span><span class="text-[10px] px-1.5 py-0.2 rounded-full ${activeFolderFilter === f.id ? 'bg-white/20' : 'bg-stone-200'}">${fDocsCount}</span>`;
      fBtn.onclick = () => { activeFolderFilter = f.id; renderDocList(); };
      breadcrumbsContainer.appendChild(fBtn);
    });
  }

  if (folderStatsSummary) folderStatsSummary.innerText = `${folders.length} thư mục • ${docs.filter(d => !d.deletedAt).length} bài đọc`;

  const isInsideFolder = activeFolderFilter !== 'all' &&
                         activeFolderFilter !== 'root' &&
                         activeFolderFilter !== 'none';

  if (foldersContainer) {
    if (isInsideFolder) {
      foldersContainer.classList.add('hidden');
    } else {
      foldersContainer.classList.remove('hidden');
      foldersContainer.innerHTML = '';
      if (folders.length === 0) {
        foldersContainer.innerHTML = `<div class="col-span-full py-6 text-center text-stone-400 bg-white rounded-2xl border border-dashed border-stone-300">
          <p class="text-xs font-medium">Chưa có thư mục nào. Bấm <b>📁 + Thư mục</b> để tạo mới.</p>
        </div>`;
      } else {
        folders.forEach(f => {
          const fDocsCount = (showHidden ? docs : docs.filter(d => !d.hidden)).filter(d => !d.deletedAt && d.folderId === f.id).length;
          const card = document.createElement('button');
          card.className = `w-full text-left p-4 rounded-2xl border transition flex items-center justify-between gap-3 bg-white hover:bg-crimson-50/40 hover:border-crimson-300 border-stone-200 shadow-xs group`;
          card.innerHTML = `
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <span class="text-3xl">📁</span>
              <div class="min-w-0 flex-1">
                <p class="font-bold text-sm text-stone-900 truncate group-hover:text-crimson-700">${f.name}</p>
                <p class="text-[11px] text-stone-400 mt-0.5">${fDocsCount} bài đọc</p>
              </div>
            </div>
            <span class="text-stone-300 group-hover:text-crimson-600 text-lg transition">→</span>
          `;
          card.onclick = () => { activeFolderFilter = f.id; renderDocList(); };
          foldersContainer.appendChild(card);
        });
      }
    }
  }

  if (activeFolderFilter === 'none') {
    if (viewTitle) viewTitle.innerText = "Chọn một thư mục để xem bài đọc";
    if (fileCountSpan) fileCountSpan.innerText = '';
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-stone-400 bg-white rounded-2xl border border-dashed border-stone-300">
        <span class="text-5xl block mb-3">📂</span>
        <p class="text-sm font-semibold text-stone-600 mb-1">Chưa chọn thư mục nào</p>
        <p class="text-xs text-stone-500 mb-4">Bấm vào một thư mục ở trên, hoặc chọn <b>📚 Tất cả</b> / <b>📂 Chưa phân loại</b> để xem bài đọc.</p>
        <button onclick="activeFolderFilter='all'; renderDocList();" class="px-4 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold rounded-xl shadow-sm transition">
          📚 Xem tất cả bài đọc
        </button>
      </div>
    `;
    return;
  }

  let backButtonHTML = '';
  if (isInsideFolder) {
    backButtonHTML = `
      <button onclick="activeFolderFilter='all'; renderDocList();"
              class="mb-3 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 border border-stone-200 shadow-xs">
        <span>←</span> Quay lại danh sách thư mục
      </button>
    `;
  }

  let filteredDocs = (showHidden ? docs : docs.filter(d => !d.hidden)).filter(d => !d.deletedAt);
  if (activeFolderFilter === 'root') filteredDocs = filteredDocs.filter(d => !d.folderId);
  else if (activeFolderFilter === 'all') { }
  else filteredDocs = filteredDocs.filter(d => d.folderId === activeFolderFilter);

  if (viewTitle) {
    if (activeFolderFilter === 'all') viewTitle.innerText = "Tất cả bài đọc";
    else if (activeFolderFilter === 'root') viewTitle.innerText = "Bài đọc chưa phân loại";
    else {
      const f = folders.find(x => x.id === activeFolderFilter);
      viewTitle.innerText = f ? `📁 ${f.name}` : "Bài đọc";
    }
  }
  if (fileCountSpan) fileCountSpan.innerText = `(${filteredDocs.length} bài)`;

  container.innerHTML = '';
  if (filteredDocs.length === 0) {
    container.innerHTML = `
      ${backButtonHTML}
      <div class="col-span-full py-16 text-center text-stone-400 bg-white rounded-2xl border border-stone-200">
        <span class="text-3xl block mb-2">📄</span>
        <p class="text-xs font-medium">Chưa có bài đọc nào trong mục này.</p>
      </div>
    `;
    return;
  }

  if (isInsideFolder) {
    const backWrapper = document.createElement('div');
    backWrapper.className = 'col-span-full';
    backWrapper.innerHTML = backButtonHTML;
    container.appendChild(backWrapper);
  }

  filteredDocs.forEach((doc, index) => {
    const card = document.createElement('div');
    card.className = `bg-white p-5 rounded-2xl border ${doc.hidden ? 'border-dashed border-stone-300 opacity-60' : 'border-stone-200/80'} shadow-sm flex flex-col justify-between transition hover:border-stone-300 relative`;
    let testTag = '';
    if (doc.testStatus) {
      if (!doc.testStatus.tested) testTag = '<span class="text-[10px] bg-stone-100 text-stone-600 font-semibold px-2 py-0.5 rounded">Chưa test</span>';
      else if (doc.testStatus.failed) testTag = `<span class="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded">Chưa đạt (${doc.testStatus.corruptionRate.toFixed(1)}%)</span>`;
      else testTag = `<span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Đạt (${doc.testStatus.corruptionRate.toFixed(1)}%)</span>`;
    }
    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-2 mb-2">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-stone-100 text-stone-600">#${index + 1}</span>
              <h3 class="font-bold text-stone-900 text-base font-englishSans truncate">${doc.title}</h3>
            </div>
            <div class="flex items-center gap-2 mt-1">${testTag}${doc.hidden ? '<span class="text-[10px] bg-stone-200 text-stone-600 font-semibold px-2 py-0.5 rounded">Đã ẩn</span>' : ''}</div>
          </div>
        </div>
        <p class="text-stone-500 font-english text-sm line-clamp-3 leading-relaxed mb-4 bg-stone-50 p-2.5 rounded-xl border border-stone-100">${doc.content}</p>
      </div>
      <div class="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
        <span class="text-stone-400 text-[11px]">${new Date(doc.createdAt).toLocaleDateString('vi-VN')}</span>
        <div class="flex items-center gap-1.5">
          <button onclick="readDoc('${doc.id}')" class="px-2.5 py-1 bg-stone-100 hover:bg-crimson-600 hover:text-white rounded-lg text-stone-700 font-medium transition">Đọc bài</button>
          <button onclick="readDoc('${doc.id}'); startTestMode();" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-lg text-rose-700 font-bold transition">Test</button>
          <button onclick="openMoveDocModal('${doc.id}')" class="px-2 py-1 rounded-lg text-stone-600 hover:bg-stone-100 border border-stone-200">Chuyển</button>
          <button onclick="toggleHideDoc('${doc.id}')" class="px-2 py-1 rounded-lg text-stone-600 hover:bg-stone-100">${doc.hidden ? '👁️' : '🙈'}</button>
          <button onclick="openEditDocModal('${doc.id}')" class="px-2 py-1 rounded-lg text-stone-600 hover:bg-stone-100">✏️</button>
          <button onclick="deleteDoc('${doc.id}')" class="px-2 py-1 rounded-lg text-red-500 hover:bg-red-50">🗑️</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function readDoc(id) {
  activeDocId = id;
  idbSet('activeDocId', id);
  currentPage = 1;
  paginatedDoc = null;
  switchTab('reader');
}

function toggleHideDoc(id) {
  const doc = docs.find(d => d.id === id);
  if (doc) { doc.hidden = !doc.hidden; saveAllData(); renderDocList(); }
}

function deleteDoc(id) {
  showConfirmModal("Xóa bài đọc này?", () => {
    const doc = docs.find(d => d.id === id);
    if (doc) {
      doc.deletedAt = Date.now();
      doc.updatedAt = Date.now();
    }
    if (activeDocId === id) {
      const alive = docs.find(d => !d.deletedAt);
      activeDocId = alive ? alive.id : null;
    }
    touch();
    saveAllData();
    renderDocList();
  });
}

function openNewDocModal() {
  document.getElementById('doc-id').value = '';
  document.getElementById('doc-title-input').value = '';
  document.getElementById('doc-content-input').value = '';
  const folderSelect = document.getElementById('doc-folder-select');
  folderSelect.innerHTML = '<option value="">📂 (Thư mục gốc / Chưa phân loại)</option>';
  folders.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.innerText = `📁 ${f.name}`;
    folderSelect.appendChild(opt);
  });
  openModal('modal-doc-editor');
}

function openEditDocModal(id) {
  const doc = docs.find(d => d.id === id);
  if (!doc) return;
  document.getElementById('doc-id').value = doc.id;
  document.getElementById('doc-title-input').value = doc.title;
  document.getElementById('doc-content-input').value = doc.content;
  const folderSelect = document.getElementById('doc-folder-select');
  folderSelect.innerHTML = '<option value="">📂 (Thư mục gốc / Chưa phân loại)</option>';
  folders.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.innerText = `📁 ${f.name}`;
    if (doc.folderId === f.id) opt.selected = true;
    folderSelect.appendChild(opt);
  });
  openModal('modal-doc-editor');
}

function saveDocumentForm(e) {
  e.preventDefault();
  const id = document.getElementById('doc-id').value;
  const title = document.getElementById('doc-title-input').value.trim();
  const content = document.getElementById('doc-content-input').value.trim();
  const folderId = document.getElementById('doc-folder-select').value || null;
  const now = Date.now();
  if (id) {
    const doc = docs.find(d => d.id === id);
    if (doc) { doc.title = title; doc.content = content; doc.folderId = folderId; doc.updatedAt = now; }
  } else {
    const newDoc = {
      id: "doc-" + now, title, content, folderId, hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: now, deletedAt: null,
      testStatus: { tested: false, lastTestDate: null, corruptionRate: 0, failed: false, lockedUntil: null, retested: false, trackedItems: [] }
    };
    docs.push(newDoc);
    activeDocId = newDoc.id;
    if (folderId) activeFolderFilter = folderId;
    else activeFolderFilter = 'root';
  }
  touch();
  saveAllData();
  closeModal('modal-doc-editor');
  renderDocList();
  showToast("Đã lưu bài đọc!", "success");
}

// ==================== SMART TOKENIZE (ENGLISH) ====================
async function callSmartTokenize() {
  const contentEl = document.getElementById('doc-content-input');
  const btn = document.getElementById('btn-hanlp-tokenize');
  if (!contentEl || !btn) return;

  const rawText = contentEl.value.trim();
  if (!rawText) { showToast("Vui lòng dán văn bản tiếng Anh thô vào ô nội dung trước!", "warning"); return; }

  const originalBtnHTML = btn.innerHTML;
  btn.innerHTML = `<span class="animate-spin inline-block">⏳</span> Đang chuẩn hóa...`;
  btn.disabled = true;

  try {
    let preprocessed = rawText;

    preprocessed = preprocessed.replace(/[\u2012\u2013\u2014\u2015\u2212\uFE58\uFE63\uFF0D]/g, ' $& ');
    preprocessed = preprocessed.replace(/-{2,}/g, ' $& ');
    preprocessed = preprocessed.replace(/(^|[\s\(\[\{"'“‘])-(?=[A-Za-z0-9])/g, '$1 - ');
    preprocessed = preprocessed.replace(/([A-Za-z0-9])-(?=[\s\)\]\}"'”’.,!?;:]|$)/g, '$1 - ');
    preprocessed = preprocessed.replace(/([.,!?;:])/g, ' $1 ');
    preprocessed = preprocessed.replace(/([()[\]{}])/g, ' $1 ');
    preprocessed = preprocessed.replace(/(["])/g, ' $1 ');
    preprocessed = preprocessed.replace(/[\u201C\u201D\u2018\u2019]/g, ' $& ');
    preprocessed = preprocessed.replace(/\u2026/g, ' $& ');
    preprocessed = preprocessed.replace(/([\/\\])/g, ' $1 ');
    preprocessed = preprocessed.replace(/([$€£¥%&@#*+=<>|~^])/g, ' $1 ');
    preprocessed = preprocessed.replace(/[ \t\u00A0]+/g, ' ');

    const lines = preprocessed.split('\n');
    const resultLines = lines.map(line =>
      line.trim().replace(/\s+/g, ' ')
    );

    const cleanedLines = [];
    let prevEmpty = false;
    for (const l of resultLines) {
      if (l === '') {
        if (!prevEmpty) cleanedLines.push('');
        prevEmpty = true;
      } else {
        cleanedLines.push(l);
        prevEmpty = false;
      }
    }

    contentEl.value = cleanedLines.join('\n').trim();
    showToast(`✅ Chuẩn hóa thành công!`, "success");
  } catch (err) {
    console.error("Tokenize error:", err);
    showToast("Lỗi chuẩn hóa: " + err.message, "error");
  } finally {
    btn.innerHTML = originalBtnHTML;
    btn.disabled = false;
  }
}

function insertSampleText() {
  document.getElementById('doc-title-input').value = "Greeting & Daily Life";
  document.getElementById('doc-content-input').value = "Hello , my name is John . I am a student and I study English every day . The world is beautiful and I have many friends .";
}

function copySegmentationPrompt() {
  const promptText = `Giúp tôi chuẩn hóa văn bản tiếng Anh sau để dễ đọc trong app học ngôn ngữ:

YÊU CẦU:
1. Mỗi từ tiếng Anh cách nhau bằng ĐÚNG 1 khoảng trắng.
2. Dấu câu ( . , ! ? ; : " ' ) phải được TÁCH RỜI khỏi từ bằng khoảng trắng (ví dụ: "hello , world ." thay vì "hello, world.").
3. Viết hoa đầu câu giữ nguyên.
4. Số và ký hiệu đặc biệt ($, %, &...) tách rời.
5. Giữ nguyên xuống dòng giữa các đoạn.
6. KHÔNG thêm, KHÔNG bớt, KHÔNG sửa nội dung.

VĂN BẢN GỐC:
[DÁN_VĂN_BẢN_TIẾNG_ANH_TẠI_ĐÂY]

CHỈ TRẢ VỀ văn bản đã chuẩn hóa, không giải thích.`;
  copyToClipboard(promptText, "Đã sao chép Prompt chuẩn hóa tiếng Anh!");
}

function openSelectDocModal() {
  document.getElementById('doc-picker-search').value = '';
  renderDocPickerList();
  openModal('modal-select-doc');
}

function filterDocPickerList() {
  renderDocPickerList(document.getElementById('doc-picker-search').value.trim());
}

function renderDocPickerList(query = '') {
  const list = document.getElementById('doc-picker-list');
  list.innerHTML = '';
  const visible = docs.filter(d => !d.hidden && !d.deletedAt && d.title.toLowerCase().includes(query.toLowerCase()));
  if (visible.length === 0) {
    list.innerHTML = `<p class="py-8 text-center text-stone-400 text-xs">Không tìm thấy bài đọc.</p>`;
    return;
  }
  visible.forEach(d => {
    const isCurrent = d.id === activeDocId;
    const item = document.createElement('div');
    item.className = `p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${isCurrent ? 'bg-crimson-50/70 border-crimson-300 text-crimson-900 shadow-sm' : 'bg-white hover:bg-stone-50 border-stone-200/80 text-stone-800'}`;
    item.onclick = () => { activeDocId = d.id; idbSet('activeDocId', activeDocId); closeModal('modal-select-doc'); renderReader(); };
    item.innerHTML = `
      <div class="min-w-0 flex-1">
        <span class="font-bold text-sm truncate">${d.title}</span>
        <p class="text-xs text-stone-500 font-english truncate mt-1">${d.content}</p>
      </div>
    `;
    list.appendChild(item);
  });
}

// ==================== FOLDER TREE ====================
function openFolderTreeModal() {
  renderFolderTreeVertical();
  openModal('modal-folder-tree');
}

function renderFolderTreeVertical() {
  const container = document.getElementById('folder-tree-vertical-container');
  if (!container) return;
  container.innerHTML = '';
  const folderGroups = [
    { id: null, name: "📂 Thư mục gốc (Chưa phân loại)", isRoot: true },
    ...folders.map(f => ({ id: f.id, name: `📁 ${f.name}`, isRoot: false }))
  ];
  folderGroups.forEach(group => {
    const groupCard = document.createElement('div');
    groupCard.className = "bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition";
    const groupDocs = docs.filter(d => !d.deletedAt).filter(d => group.isRoot ? !d.folderId : d.folderId === group.id);
    const headerDiv = document.createElement('div');
    headerDiv.className = "bg-stone-100/80 px-4 py-3 border-b border-stone-200 flex items-center justify-between";
    headerDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="font-bold text-sm text-stone-900">${group.name}</span>
        <span class="text-xs bg-white text-stone-600 px-2 py-0.5 rounded-full font-bold border border-stone-200 shadow-2xs">${groupDocs.length} tệp</span>
      </div>
      <span class="text-[11px] text-stone-400">Kéo ⠿ để đổi vị trí</span>
    `;
    groupCard.appendChild(headerDiv);
    const listContainer = document.createElement('div');
    listContainer.className = "divide-y divide-stone-100 p-2 min-h-[50px]";
    if (groupDocs.length === 0) {
      listContainer.innerHTML = `<p class="text-stone-400 text-xs italic py-3 text-center">Thư mục chưa có bài đọc nào.</p>`;
    } else {
      groupDocs.forEach((doc, idx) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = "flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 cursor-grab active:cursor-grabbing transition duration-150 group border border-transparent hover:border-stone-200";
        itemDiv.draggable = true;
        itemDiv.dataset.docId = doc.id;
        itemDiv.innerHTML = `
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="text-stone-400 group-hover:text-stone-700 select-none p-1 cursor-grab" title="Giữ để kéo thả đổi thứ tự">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
            </div>
            <span class="w-7 h-7 flex-shrink-0 rounded-lg bg-stone-100 group-hover:bg-crimson-50 text-stone-600 group-hover:text-crimson-700 font-mono font-bold text-xs flex items-center justify-center border border-stone-200">#${idx + 1}</span>
            <div class="min-w-0 flex-1">
              <p class="font-bold text-xs sm:text-sm text-stone-900 truncate font-englishSans">${doc.title}</p>
              <p class="text-[11px] text-stone-400 truncate font-english">${doc.content}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 ml-2">
            <button onclick="closeModal('modal-folder-tree'); readDoc('${doc.id}');" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-crimson-600 hover:text-white transition">Đọc bài</button>
          </div>
        `;
        itemDiv.addEventListener('dragstart', (e) => {
          draggedDocId = doc.id;
          itemDiv.classList.add('opacity-40', 'bg-amber-50');
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', doc.id);
        });
        itemDiv.addEventListener('dragend', () => {
          itemDiv.classList.remove('opacity-40', 'bg-amber-50');
          draggedDocId = null;
          document.querySelectorAll('#folder-tree-vertical-container [data-doc-id]').forEach(el => {
            el.classList.remove('border-crimson-500', 'bg-crimson-50/50');
          });
        });
        itemDiv.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          itemDiv.classList.add('border-crimson-500', 'bg-crimson-50/50');
        });
        itemDiv.addEventListener('dragleave', () => {
          itemDiv.classList.remove('border-crimson-500', 'bg-crimson-50/50');
        });
        itemDiv.addEventListener('drop', (e) => {
          e.preventDefault();
          itemDiv.classList.remove('border-crimson-500', 'bg-crimson-50/50');
          const targetDocId = doc.id;
          if (draggedDocId && draggedDocId !== targetDocId) {
            reorderDocuments(draggedDocId, targetDocId, group.id);
          }
        });
        listContainer.appendChild(itemDiv);
      });
    }
    groupCard.appendChild(listContainer);
    container.appendChild(groupCard);
  });
}

function reorderDocuments(sourceId, targetId, folderId) {
  const sourceIndex = docs.findIndex(d => d.id === sourceId);
  const targetIndex = docs.findIndex(d => d.id === targetId);
  if (sourceIndex === -1 || targetIndex === -1) return;
  docs[sourceIndex].folderId = folderId || null;
  const [movedDoc] = docs.splice(sourceIndex, 1);
  const newTargetIndex = docs.findIndex(d => d.id === targetId);
  docs.splice(newTargetIndex, 0, movedDoc);
  saveAllData();
  renderFolderTreeVertical();
  renderDocList();
  showToast(`Đã cập nhật thứ tự bài đọc "${movedDoc.title}"!`, "success");
}

function openFolderEditorModal(folderId = null) {
  const titleElem = document.getElementById('folder-modal-title');
  const idInput = document.getElementById('folder-edit-id');
  const nameInput = document.getElementById('folder-name-input');
  if (folderId) {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;
    titleElem.innerHTML = `<span>📁</span> Đổi tên thư mục`;
    idInput.value = folder.id;
    nameInput.value = folder.name;
  } else {
    titleElem.innerHTML = `<span>📁</span> Tạo thư mục mới`;
    idInput.value = '';
    nameInput.value = '';
  }
  openModal('modal-folder-editor');
  setTimeout(() => nameInput.focus(), 100);
}

function saveFolderForm(e) {
  e.preventDefault();
  const id = document.getElementById('folder-edit-id').value;
  const name = document.getElementById('folder-name-input').value.trim();
  if (!name) return;
  if (id) {
    const folder = folders.find(f => f.id === id);
    if (folder) folder.name = name;
  } else {
    const newFolder = { id: "folder-" + Date.now(), name, createdAt: new Date().toISOString() };
    folders.push(newFolder);
    activeFolderFilter = newFolder.id;
  }
  saveAllData();
  closeModal('modal-folder-editor');
  renderDocList();
  showToast("Đã lưu thư mục!", "success");
}

function deleteFolder(folderId) {
  const folder = folders.find(f => f.id === folderId);
  if (!folder) return;
  showConfirmModal(`Xóa thư mục "${folder.name}"? Các bài đọc sẽ về Thư mục gốc.`, () => {
    docs.forEach(d => { if (d.folderId === folderId) d.folderId = null; });
    folders = folders.filter(f => f.id !== folderId);
    if (activeFolderFilter === folderId) activeFolderFilter = 'none';
    saveAllData();
    renderDocList();
  });
}

function openMoveDocModal(docId) {
  const doc = docs.find(d => d.id === docId);
  if (!doc) return;
  document.getElementById('move-doc-target-id').value = doc.id;
  document.getElementById('move-doc-title').innerText = doc.title;
  const select = document.getElementById('move-doc-select');
  select.innerHTML = '<option value="">📂 (Thư mục gốc / Chưa phân loại)</option>';
  folders.forEach(f => {
    const isCurrent = doc.folderId === f.id;
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.innerText = `📁 ${f.name}${isCurrent ? ' (Hiện tại)' : ''}`;
    if (isCurrent) opt.selected = true;
    select.appendChild(opt);
  });
  openModal('modal-move-doc');
}

function applyMoveDoc() {
  const docId = document.getElementById('move-doc-target-id').value;
  const targetFolderId = document.getElementById('move-doc-select').value || null;
  const doc = docs.find(d => d.id === docId);
  if (doc) {
    doc.folderId = targetFolderId;
    saveAllData();
    closeModal('modal-move-doc');
    renderDocList();
    showToast("Đã chuyển bài đọc!", "success");
  }
}