/* ============================================================
 * FILE: 10-grammar-ui.js
 * DOMAIN: Grammar table, editor, card, chooser, highlight
 * DEPENDS: 03-state, 04-ui-shared, 09-grammar-engine
 * ============================================================ */

function renderGrammarTable() {
  const tbody = document.getElementById('grammar-table-body');
  if (!tbody) return;
  const query = (document.getElementById('grammar-search-input')?.value || '').trim().toLowerCase();
  const typeFilter = document.getElementById('grammar-type-filter')?.value || 'all';
  const levelFilter = document.getElementById('grammar-level-filter')?.value || 'all';

  const patterns = grammarDb._patterns || {};
  const entries = Object.entries(patterns).map(([id, p]) => ({ id, ...p }));

  const totalEl = document.getElementById('gm-stat-total');
  const pairEl = document.getElementById('gm-stat-pair');
  const singleEl = document.getElementById('gm-stat-single');
  const chainEl = document.getElementById('gm-stat-chain');
  const navBadge = document.getElementById('grammar-count-badge');
  const navHeaderBadge = document.getElementById('grammar-count-badge-nav');
  if (totalEl) totalEl.innerText = entries.length;
  if (pairEl) pairEl.innerText = entries.filter(e => e.type === 'pair').length;
  if (singleEl) singleEl.innerText = entries.filter(e => e.type === 'single').length;
  if (chainEl) chainEl.innerText = entries.filter(e => e.type === 'chain').length;
  if (navBadge) navBadge.innerText = `${entries.length} cấu trúc`;
  if (navHeaderBadge) navHeaderBadge.innerText = entries.length;

  let filtered = entries.filter(e => {
    if (typeFilter !== 'all' && (e.type || 'pair') !== typeFilter) return false;
    if (levelFilter !== 'all' && e.level !== levelFilter) return false;
    if (!query) return true;
    const hay = [
      e.id,
      e.meaning,
      e.notes,
      e.level,
      e.leftGroup, e.rightGroup, e.anchorGroup,
      ...(e.left || []), ...(e.right || []), ...(e.anchor || []),
      ...(e.examples || [])
    ].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(query);
  });

  filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0) || a.id.localeCompare(b.id));

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-stone-400 text-xs">Không có cấu trúc nào khớp bộ lọc.</td></tr>`;
    return;
  }

  const typeBadge = (t) => {
    const map = {
      pair:   { cls: 'bg-purple-100 text-purple-800',  label: 'Pair' },
      single: { cls: 'bg-blue-100 text-blue-800',      label: 'Single' },
      chain:  { cls: 'bg-amber-100 text-amber-800',    label: 'Chain' }
    };
    const m = map[t] || map.pair;
    return `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${m.cls}">${m.label}</span>`;
  };

  filtered.forEach(e => {
    const groups = grammarDb._aliasGroups || {};
    let anchorDisplay = '';
    if (e.type === 'pair') {
      const L = e.leftGroup ? groups[e.leftGroup]?.join(' / ') : (e.left || []).join(' / ');
      const R = e.rightGroup ? groups[e.rightGroup]?.join(' / ') : (e.right || []).join(' / ');
      anchorDisplay = `${L} ... ${R}`;
    } else if (e.type === 'single') {
      anchorDisplay = e.anchorGroup ? (groups[e.anchorGroup]?.join(' / ')) : (e.anchor || []).join(' / ');
    } else if (e.type === 'chain') {
      anchorDisplay = (e.chain || []).map(seg =>
        Array.isArray(seg) ? seg.join('/') : (groups[seg] ? groups[seg].join('/') : seg)
      ).join(' ... ');
    }

    const tr = document.createElement('tr');
    tr.className = "hover:bg-stone-50 transition";
    const idDisplay = e.id.length > 20 ? e.id.slice(0, 18) + '…' : e.id;
    tr.innerHTML = `
      <td class="px-4 py-3">${typeBadge(e.type || 'pair')}</td>
      <td class="px-4 py-3">
        <span class="font-mono text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 cursor-pointer hover:bg-purple-100" 
              title="Nhấn để xem chi tiết" 
              onclick="openGrammarCard('${e.id}', '')">${idDisplay}</span>
      </td>
      <td class="px-4 py-3 font-english text-xs text-stone-700 max-w-[300px] truncate" title="${anchorDisplay}">${anchorDisplay}</td>
      <td class="px-4 py-3 text-xs text-stone-800 max-w-xs truncate">${e.meaning || '--'}</td>
      <td class="px-4 py-3"><span class="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">${e.level || '--'}</span></td>
      <td class="px-4 py-3 text-right whitespace-nowrap">
        <button onclick="openAddGrammarModal('${e.id}')" class="text-xs text-stone-600 hover:text-purple-700 mr-2">Sửa</button>
        <button onclick="deleteGrammar('${e.id}')" class="text-xs text-red-500 hover:text-red-700">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function onGrammarTypeChange() {
  const t = document.getElementById('gm-input-type').value;
  document.getElementById('gm-fields-pair').classList.toggle('hidden', t !== 'pair');
  document.getElementById('gm-fields-single').classList.toggle('hidden', t !== 'single');
  document.getElementById('gm-fields-chain').classList.toggle('hidden', t !== 'chain');
}

function openAddGrammarModal(existingId = null) {
  const title = document.getElementById('grammar-modal-title');
  const idInput = document.getElementById('gm-input-id');
  const typeInput = document.getElementById('gm-input-type');
  const leftInput = document.getElementById('gm-input-left');
  const rightInput = document.getElementById('gm-input-right');
  const anchorInput = document.getElementById('gm-input-anchor');
  const chainInput = document.getElementById('gm-input-chain');
  const levelInput = document.getElementById('gm-input-level');
  const priorityInput = document.getElementById('gm-input-priority');
  const meaningInput = document.getElementById('gm-input-meaning');
  const meaningFullInput = document.getElementById('gm-input-meaning-full');
  const notesInput = document.getElementById('gm-input-notes');
  const examplesInput = document.getElementById('gm-input-examples');

  if (existingId && grammarDb._patterns[existingId]) {
    const p = grammarDb._patterns[existingId];
    title.innerText = `Sửa: ${existingId}`;
    idInput.value = existingId;
    idInput.readOnly = true;
    typeInput.value = p.type || 'pair';
    leftInput.value = p.leftGroup || (p.left || []).join(', ') || '';
    rightInput.value = p.rightGroup || (p.right || []).join(', ') || '';
    anchorInput.value = p.anchorGroup || (p.anchor || []).join(', ') || '';
    chainInput.value = (p.chain || []).map(seg => Array.isArray(seg) ? seg.join(', ') : seg).join('\n');
    levelInput.value = p.level || '';
    priorityInput.value = p.priority || 10;
    meaningInput.value = p.meaning || '';
    meaningFullInput.value = p.meaning || '';
    notesInput.value = p.notes || '';
    examplesInput.value = (p.examples || []).join('\n');
  } else {
    title.innerText = 'Thêm Cấu trúc Ngữ pháp';
    idInput.value = generateGrammarId();
    idInput.readOnly = false;
    typeInput.value = 'pair';
    leftInput.value = ''; rightInput.value = ''; anchorInput.value = '';
    chainInput.value = ''; levelInput.value = ''; priorityInput.value = 10;
    meaningInput.value = ''; meaningFullInput.value = ''; notesInput.value = '';
    examplesInput.value = '';
  }

  onGrammarTypeChange();
  openModal('modal-grammar-editor');
  setTimeout(() => idInput.focus(), 100);
}

function normalizeGrammarToken(raw) {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .trim()
    .replace(/[\-\u2012\u2013\u2014\u2015\u2212\uFE58\uFE63\uFF0D]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function saveGrammarForm(e) {
  e.preventDefault();
  const id = document.getElementById('gm-input-id').value.trim();
  const type = document.getElementById('gm-input-type').value;
  const leftRaw = document.getElementById('gm-input-left').value.trim();
  const rightRaw = document.getElementById('gm-input-right').value.trim();
  const anchorRaw = document.getElementById('gm-input-anchor').value.trim();
  const chainRaw = document.getElementById('gm-input-chain').value.trim();
  const level = document.getElementById('gm-input-level').value.trim();
  const priority = parseInt(document.getElementById('gm-input-priority').value, 10) || 10;
  const meaning = document.getElementById('gm-input-meaning-full').value.trim();
  const notes = document.getElementById('gm-input-notes').value.trim();
  const examples = document.getElementById('gm-input-examples').value.split('\n').map(s => s.trim()).filter(Boolean);

  if (!id) { showToast("Thiếu ID cấu trúc", "warning"); return; }

  const existing = grammarDb._patterns[id] || {};
  const newPattern = { ...existing, type, level, priority, meaning, notes, examples, updatedAt: Date.now() };

  const resolveInput = (raw) => {
    if (!raw) return { group: null, tokens: [] };
    if (grammarDb._aliasGroups[raw]) return { group: raw, tokens: [] };
    return {
      group: null,
      tokens: raw.split(',')
        .map(s => normalizeGrammarToken(s))
        .filter(Boolean)
    };
  };

  if (type === 'pair') {
    const L = resolveInput(leftRaw);
    const R = resolveInput(rightRaw);
    if (L.group) newPattern.leftGroup = L.group;
    else delete newPattern.leftGroup;
    if (R.group) newPattern.rightGroup = R.group;
    else delete newPattern.rightGroup;
    newPattern.left = L.tokens;
    newPattern.right = R.tokens;
    delete newPattern.anchor; delete newPattern.anchorGroup; delete newPattern.chain;
  } else if (type === 'single') {
    const A = resolveInput(anchorRaw);
    if (A.group) newPattern.anchorGroup = A.group;
    else delete newPattern.anchorGroup;
    newPattern.anchor = A.tokens;
    delete newPattern.left; delete newPattern.right;
    delete newPattern.leftGroup; delete newPattern.rightGroup; delete newPattern.chain;
  } else if (type === 'chain') {
    const segs = chainRaw.split('\n').map(s => s.trim()).filter(Boolean);
    newPattern.chain = segs.map(seg => {
      if (grammarDb._aliasGroups[seg]) return seg;
      return seg.split(',')
        .map(s => normalizeGrammarToken(s))
        .filter(Boolean);
    });
    delete newPattern.left; delete newPattern.right;
    delete newPattern.leftGroup; delete newPattern.rightGroup;
    delete newPattern.anchor; delete newPattern.anchorGroup;
  }

  grammarDb._patterns[id] = newPattern;
  rebuildGrammarIndex();
  touch();
  saveAllData();
  closeModal('modal-grammar-editor');
  renderGrammarTable();
  if (!document.getElementById('view-reader').classList.contains('hidden')) renderReader();
  showToast(`Đã lưu cấu trúc "${id}"`, "success");
}

function deleteGrammar(id) {
  showConfirmModal(`Xóa cấu trúc "${id}"?`, () => {
    delete grammarDb._patterns[id];
    rebuildGrammarIndex();
    touch();
    saveAllData();
    renderGrammarTable();
    if (!document.getElementById('view-reader').classList.contains('hidden')) renderReader();
    showToast(`Đã xóa "${id}"`, "info");
  });
}

function applyGrammarHighlightToLine(lineDiv, tokens, wordUnitElements, matches) {
  if (!matches || matches.length === 0) {
    wordUnitElements.forEach(w => { if (w) lineDiv.appendChild(w.el); });
    return;
  }

  const sorted = [...matches].sort((a, b) => a.start - b.start);
  const groups = [];
  let current = { start: sorted[0].start, end: sorted[0].end, patterns: [sorted[0]] };
  for (let i = 1; i < sorted.length; i++) {
    const m = sorted[i];
    if (m.start <= current.end) {
      current.patterns.push(m);
      current.end = Math.max(current.end, m.end);
    } else {
      groups.push(current);
      current = { start: m.start, end: m.end, patterns: [m] };
    }
  }
  groups.push(current);

  let i = 0;
  while (i < tokens.length) {
    const group = groups.find(g => g.start === i);
    if (group) {
      const wrapper = document.createElement('span');
      wrapper.className = 'grammar-unit';
      wrapper.dataset.patternCount = group.patterns.length;
      wrapper.dataset.patternLabel =
        group.patterns.length === 1
          ? group.patterns[0].patternId
          : `⚠ ${group.patterns.length} cấu trúc`;

      for (let k = group.start; k <= group.end; k++) {
        if (wordUnitElements[k]) wrapper.appendChild(wordUnitElements[k].el);
      }

      wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        const matchedText = tokens.slice(group.start, group.end + 1).join(' ');
        if (group.patterns.length === 1) {
          openGrammarCard(group.patterns[0].patternId, matchedText);
        } else {
          openPatternChooser(group.patterns, matchedText);
        }
      });

      if (group.patterns.length > 1) {
        const badge = document.createElement('sup');
        badge.className = 'grammar-count-badge';
        badge.innerText = group.patterns.length;
        wrapper.appendChild(badge);
      }

      lineDiv.appendChild(wrapper);
      i = group.end + 1;
    } else {
      if (wordUnitElements[i]) lineDiv.appendChild(wordUnitElements[i].el);
      i++;
    }
  }
}

function openPatternChooser(patterns, matchedText) {
  let modal = document.getElementById('modal-pattern-chooser');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-pattern-chooser';
    modal.className = 'fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 hidden';
    modal.innerHTML = `
      <div class="bg-white w-full max-w-md rounded-2xl shadow-xl border border-purple-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div class="p-4 border-b border-purple-200 flex items-center justify-between bg-purple-50">
          <h3 class="font-bold text-sm text-purple-900 flex items-center gap-1.5">
            <span>🔍</span> Chọn cấu trúc để tra cứu
          </h3>
          <button onclick="closeModal('modal-pattern-chooser')" 
                  class="text-stone-400 hover:text-stone-700 text-xl leading-none">&times;</button>
        </div>
        <div class="p-3 bg-stone-50 border-b border-stone-200">
          <p class="text-[10px] uppercase font-bold text-stone-500 mb-1">Ngữ cảnh:</p>
          <p class="font-english text-sm font-bold text-stone-800" id="chooser-context"></p>
        </div>
        <div id="chooser-list" class="p-3 space-y-2 overflow-y-auto flex-1"></div>
        <div class="p-3 border-t border-stone-200 bg-stone-50">
          <label class="flex items-center gap-2 text-xs text-stone-600 cursor-pointer select-none">
            <input type="checkbox" id="chooser-remember" class="rounded text-purple-600">
            <span>Ghi nhớ lựa chọn cho lần sau</span>
          </label>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById('chooser-context').innerText = matchedText;

  const list = document.getElementById('chooser-list');
  list.innerHTML = '';

  const sorted = [...patterns].sort((a, b) => {
    const prefA = patternPreferences[a.patternId] || 0;
    const prefB = patternPreferences[b.patternId] || 0;
    if (prefA !== prefB) return prefB - prefA;
    if (a.meta.priority !== b.meta.priority) 
      return (b.meta.priority || 0) - (a.meta.priority || 0);
    if (a.length !== b.length) return a.length - b.length;
    return a.patternId.localeCompare(b.patternId);
  });

  const MAX_CHOICES = 8;
  const displayList = sorted.slice(0, MAX_CHOICES);
  const hasMore = sorted.length > MAX_CHOICES;

  displayList.forEach((p, idx) => {
    const item = document.createElement('button');
    item.className = 'w-full text-left p-3 rounded-xl border border-stone-200 hover:border-purple-400 hover:bg-purple-50 transition group';

    const anchorDisplay = renderAnchorDisplayShort(p.meta);

    item.innerHTML = `
      <div class="flex items-center justify-between gap-2 mb-1.5">
        <span class="font-mono text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex-shrink-0">
          ${idx + 1}. ${p.patternId}
        </span>
        ${p.meta.level ? `<span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 flex-shrink-0">${p.meta.level}</span>` : ''}
      </div>
      <p class="font-english text-sm font-bold text-purple-900 mb-1 line-clamp-2" title="${anchorDisplay.replace(/"/g, '&quot;')}">
        ${anchorDisplay}
      </p>
      <p class="text-xs text-stone-600 mb-1 line-clamp-2">${p.meta.meaning || '(chưa có nghĩa)'}</p>
      <p class="text-[10px] text-stone-400 font-mono">
        ${p.meta.type || p.type || 'pair'} · ${p.length + 1} từ · vị trí ${p.start}-${p.end}
        ${patternPreferences[p.patternId] ? ` · ⭐ đã chọn ${patternPreferences[p.patternId]} lần` : ''}
      </p>
    `;
    item.onclick = () => {
      if (document.getElementById('chooser-remember').checked) {
        patternPreferences[p.patternId] = (patternPreferences[p.patternId] || 0) + 1;
        idbSet('patternPreferences', patternPreferences);
      }
      closeModal('modal-pattern-chooser');
      openGrammarCard(p.patternId, matchedText);
    };
    list.appendChild(item);
  });

  if (hasMore) {
    const more = document.createElement('p');
    more.className = 'text-[11px] text-stone-400 italic text-center pt-2';
    more.innerText = `... và ${sorted.length - MAX_CHOICES} cấu trúc khác (tăng priority hoặc thu hẹp anchor để thấy)`;
    list.appendChild(more);
  }

  openModal('modal-pattern-chooser');
}

function openGrammarCard(patternId, matchedText) {
  const p = grammarDb._patterns[patternId];
  if (!p) { showToast("Không tìm thấy cấu trúc này trong từ điển.", "warning"); return; }

  let modal = document.getElementById('modal-grammar-card');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-grammar-card';
    modal.className = 'fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden';
    modal.innerHTML = `
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div class="p-4 border-b border-purple-200 flex items-center justify-between bg-purple-50">
          <h3 class="font-bold text-sm text-purple-900 flex items-center gap-1.5"><span>🟣</span> Cấu trúc ngữ pháp</h3>
          <button onclick="closeModal('modal-grammar-card')" class="text-stone-400 hover:text-stone-700 text-xl leading-none">&times;</button>
        </div>
        <div id="grammar-card-body" class="p-5 space-y-4 overflow-y-auto"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const groups = grammarDb._aliasGroups || {};
  const leftList  = p.leftGroup  ? (groups[p.leftGroup]  || []).join(' / ')
                  : p.left ? p.left
                  : p.anchorGroup ? (groups[p.anchorGroup] || []).join(' / ') : '';
  const rightList = p.rightGroup ? (groups[p.rightGroup] || []).join(' / ')
                  : p.right ? p.right : '';

  const patternDisplay = (p.type === 'chain')
    ? (p.chain || []).map(seg => {
        if (Array.isArray(seg)) return seg.join('/');
        return groups[seg] ? groups[seg].join('/') : seg;
      }).join(' ... ')
    : `${leftList} ... ${rightList}`;

  const examplesHtml = (p.examples || []).length
    ? `<div>
        <span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Ví dụ:</span>
        <ul class="space-y-1 text-xs font-english">
          ${p.examples.map(e => `<li class="bg-stone-50 p-2 rounded border border-stone-100">${e}</li>`).join('')}
        </ul>
      </div>`
    : '';

  const body = modal.querySelector('#grammar-card-body');
  body.innerHTML = `
    <div>
      <h3 class="font-bold text-lg text-purple-800 flex items-center gap-2">
        <span class="font-mono text-sm bg-purple-100 px-2 py-0.5 rounded">${patternId}</span>
        <span class="text-sm text-stone-500 font-normal">Mã cấu trúc</span>
      </h3>
      <p class="text-xs text-stone-500 mt-1">
        ${p.level ? `<span class="inline-block px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full font-bold mr-1">${p.level}</span>` : ''}
        <span class="uppercase font-semibold">${p.type || 'pair'}</span>
      </p>
    </div>
    <div class="bg-purple-50 border border-purple-200 rounded-xl p-3">
      <span class="text-[10px] uppercase font-bold text-purple-700 block mb-1">Cấu trúc:</span>
      <p class="font-english text-base font-bold text-purple-900">${patternDisplay}</p>
    </div>
    <div class="bg-stone-50 border border-stone-200 rounded-xl p-3">
      <span class="text-[10px] uppercase font-bold text-stone-500 block mb-1">Ngữ cảnh trong bài:</span>
      <p class="font-english text-base">${matchedText}</p>
    </div>
    <div>
      <span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Ý nghĩa:</span>
      <p class="text-sm text-stone-800">${p.meaning || ''}</p>
    </div>
    ${p.notes ? `<div>
      <span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Ghi chú:</span>
      <p class="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">${p.notes}</p>
    </div>` : ''}
    ${examplesHtml}
    <div class="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
      <div class="text-[11px] text-stone-400">
        ${isGrammarPatternInFsrs(patternId) 
          ? `🎯 Đang trong bể FSRS · Chuỗi ${grammarFsrsPool[patternId].streak || 0}`
          : '⚪ Chưa có trong bể FSRS'}
      </div>
      <div class="flex items-center gap-2">
        <button onclick="quickAddGrammarToFsrs('${patternId}', ${JSON.stringify(matchedText || '').replace(/"/g, '&quot;')})"
                class="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-lg transition flex items-center gap-1">
          🎯 Ném vào FSRS
        </button>
        <button onclick="closeModal('modal-grammar-card')" 
                class="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition">
          Đóng
        </button>
      </div>
    </div>
  `;
  openModal('modal-grammar-card');
}

function copyGrammarGuidePrompt() {
  const guide = `You are an English grammar expert. I will give you a list of EXISTING grammar patterns (with IDs already assigned). Fill in the metadata for each.

## CRITICAL RULES

1. Each pattern in my input ALREADY HAS an ID (e.g. "G4721"). You MUST use EXACTLY that ID as the JSON key.
2. DO NOT invent new IDs. DO NOT renumber.
3. DO NOT skip any pattern.
4. The "type" field MUST match the type I provide.
5. The anchor arrays MUST be filled with the anchor tokens I provide.

## INPUT FORMAT (what I will send you)

### Pattern 1: ID = "G4721"
- Type: "pair"
- Left anchors: ["not only"]
- Right anchors: ["but also"]
- Câu chứa cấu trúc: "Not only is he smart but also he is kind ."

### Pattern 2: ID = "G8834"
- Type: "single"
- Anchor tokens: ["in order to"]
- Câu chứa cấu trúc: "I study hard in order to pass the exam ."

## OUTPUT FORMAT (MANDATORY)

{
  "_patterns": {
    "G4721": {
      "type": "pair",
      "left": ["not only"],
      "right": ["but also"],
      "meaning": "Không những... mà còn...",
      "level": "B1",
      "priority": 10,
      "notes": "Nhấn mạnh cả hai vế",
      "examples": ["Not only is he smart but also he is kind ."]
    },
    "G8834": {
      "type": "single",
      "anchor": ["in order to"],
      "meaning": "Để mà...",
      "level": "B1",
      "priority": 10,
      "notes": "Chỉ mục đích",
      "examples": ["I study hard in order to pass the exam ."]
    }
  }
}

## RULES FOR FIELDS

- **type**: only "pair" | "single" | "chain" — MUST match input
- **pair**: needs "left" + "right" arrays (fill with input anchors)
- **single**: needs "anchor" array (fill with input anchors)
- **chain**: needs "chain" array of arrays
- **meaning**: Vietnamese, concise
- **level**: A1 | A2 | B1 | B2 | C1 | C2
- **examples**: English sentences WITH spaces between words
- **priority**: number, default 10
- NO trailing commas
- Output ONLY JSON

## STRUCTURES TO PROCESS
[PASTE THE PATTERN LIST FROM THE SCAN MODAL HERE]`;
  copyToClipboard(guide, "Đã sao chép Prompt hướng dẫn định dạng ngữ pháp!");
}