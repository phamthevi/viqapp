/* ============================================================
 * FILE: 16-ai-scan.js
 * DOMAIN: Scan modal, AI prompt generator, JSON import, validate
 * DEPENDS: 03-state, 04-ui-shared, 05-vocab, 09-grammar-engine,
 *          13-sentence-mining
 * ============================================================ */

// ==================== SCAN MODAL ====================
function openScanModal(type) {
  currentScanType = type;
  const titleElem = document.getElementById('scan-modal-title');
  const subElem = document.getElementById('scan-modal-sub');
  const countElem = document.getElementById('missing-count');
  const tagsBox = document.getElementById('missing-tags-container');
  const promptPreview = document.getElementById('ai-prompt-preview');
  document.getElementById('quick-import-json').value = '';
  const activeDocs = docs.filter(d => !d.hidden);
  const combinedText = activeDocs.map(d => d.content).join(' ');
  let missingList = [];

  if (type === 'vocab') {
    titleElem.innerText = "Quét Từ vựng chưa có dữ liệu & Prompt AI";
    subElem.innerText = "Chỉ quét từ chưa có dữ liệu VÀ chưa đánh dấu 'Đã biết'";
    const words = combinedText.split(/\s+/);
    const uniqueWords = Array.from(new Set(words.map(w => cleanEnglishWord(w)).filter(w => w.length > 0)));
    missingList = uniqueWords.filter(word => {
      const isKnown = statusDb.vocab && statusDb.vocab[word] === 4;
      return !isKnown && !vocabDb[word];
    });
  } else if (type === 'grammar') {
    titleElem.innerText = "Quét cấu trúc ngữ pháp CHƯA có trong từ điển";
    subElem.innerText = "Duyệt từng câu, phát hiện các token có tiềm năng ngữ pháp nhưng chưa được khai báo.";
    missingList = scanMissingGrammarPatterns();
  } else if (type === 'sentence') {
    titleElem.innerText = "Quét Sentence Card CHƯA có nghĩa";
    subElem.innerText = "Chỉ quét các Sentence Card có needsData = true (chưa được AI nạp nghĩa).";
    missingList = scanMissingSentenceCards();
  }

  countElem.innerText = missingList.length;
  tagsBox.innerHTML = '';
  if (missingList.length === 0) {
    const label = type === 'vocab' ? 'Từ vựng' : 'Cấu trúc ngữ pháp';
    tagsBox.innerHTML = `<span class="text-emerald-700 text-xs font-semibold py-1">🎉 Tuyệt vời! Không còn ${label} nào cần nạp dữ liệu.</span>`;
    promptPreview.value = "Không có mục nào cần nạp.";
  } else {
    missingList.forEach(item => {
      const span = document.createElement('span');
      span.className = "px-2 py-0.5 bg-white border border-stone-200 rounded text-stone-800 text-xs font-english";
      span.innerText = typeof item === 'string' ? item : (item.label || item.id || JSON.stringify(item));
      tagsBox.appendChild(span);
    });
    promptPreview.value = generateAiPrompt(type, missingList);
  }
  currentMissingList = missingList;
  openModal('modal-scan');
}

function scanMissingGrammarPatterns() {
  const candidates = [];

  Object.entries(grammarDb._patterns || {}).forEach(([id, p]) => {
    if (!p || typeof p !== 'object') return;

    const hasMeaning = p.meaning && 
                       p.meaning.trim() !== "" && 
                       p.meaning !== "Chờ AI nạp nghĩa...";

    const isMissing = !hasMeaning || p.needsData === true;

    if (!isMissing) return;

    const type = p.type || 'pair';
    const anchorTokens = [];
    let anchorsDetail = { left: [], right: [], anchor: [], chain: [] };

    if (type === 'pair') {
      const leftSrc  = p.leftGroup  !== undefined ? p.leftGroup  : p.left;
      const rightSrc = p.rightGroup !== undefined ? p.rightGroup : p.right;
      const leftArr  = Array.isArray(leftSrc)  ? leftSrc  : (grammarDb._aliasGroups[leftSrc]  || []);
      const rightArr = Array.isArray(rightSrc) ? rightSrc : (grammarDb._aliasGroups[rightSrc] || []);
      anchorsDetail.left  = leftArr.slice();
      anchorsDetail.right = rightArr.slice();
      leftArr.forEach(t => { if (t) anchorTokens.push(String(t).toLowerCase().trim()); });
      rightArr.forEach(t => { if (t) anchorTokens.push(String(t).toLowerCase().trim()); });

    } else if (type === 'single') {
      const src = p.anchorGroup !== undefined ? p.anchorGroup
                : p.anchor !== undefined ? p.anchor
                : p.anchors;
      const arr = Array.isArray(src) ? src : (grammarDb._aliasGroups[src] || []);
      anchorsDetail.anchor = arr.slice();
      arr.forEach(t => { if (t) anchorTokens.push(String(t).toLowerCase().trim()); });

    } else if (type === 'chain') {
      (p.chain || []).forEach(seg => {
        const arr = Array.isArray(seg) ? seg : (grammarDb._aliasGroups[seg] || []);
        anchorsDetail.chain.push(arr.slice());
        arr.forEach(t => { if (t) anchorTokens.push(String(t).toLowerCase().trim()); });
      });
    }

    candidates.push({
      token: id,
      type: type,
      anchors: anchorsDetail,
      anchorTokens,
      sampleSentences: [],
      context: { current: '', prev: '', next: '' },
      count: 0,
      priority: 1,
      label: `[Cần nạp] ${id}`
    });
  });

  candidates.forEach(cand => {
    const pattern = grammarDb._patterns[cand.token];

    if (pattern && pattern.context &&
        (pattern.context.current || pattern.context.prev || pattern.context.next)) {
      cand.context = {
        current: pattern.context.current || '',
        prev:    pattern.context.prev    || '',
        next:    pattern.context.next    || ''
      };
      if (cand.context.current) {
        cand.sampleSentences.push(cand.context.current);
      }
      return;
    }

    if (pattern && Array.isArray(pattern.examples) && pattern.examples.length > 0 &&
        pattern.examples[0] && pattern.examples[0].trim()) {
      cand.context = {
        current: pattern.examples[0].trim(),
        prev: '',
        next: ''
      };
      cand.sampleSentences.push(cand.context.current);
      return;
    }

    if (cand.anchorTokens.length === 0) return;
    const activeDocs = docs.filter(d => !d.hidden && !d.deletedAt);

    for (const d of activeDocs) {
      const lines = d.content.split('\n').map(s => s.trim()).filter(Boolean);
      for (let idx = 0; idx < lines.length; idx++) {
        const lineLower = lines[idx].toLowerCase();
        const hasAnchor = cand.anchorTokens.some(tok =>
          lineLower.includes(tok.toLowerCase())
        );
        if (hasAnchor) {
          cand.sampleSentences.push(lines[idx]);
          if (cand.sampleSentences.length >= 3) break;
          if (!cand.context.current) {
            cand.context.current = lines[idx];
            cand.context.prev = idx > 0 ? lines[idx - 1] : '';
            cand.context.next = idx < lines.length - 1 ? lines[idx + 1] : '';
          }
        }
      }
      if (cand.sampleSentences.length >= 3) break;
    }
  });

  return candidates;
}

function markAllMissingAsKnown() {
  if (currentMissingList.length === 0) return;
  currentMissingList.forEach(item => {
    const key = typeof item === 'string' ? item : (item.token || item);
    statusDb.vocab[key] = 4;
  });
  saveAllData();
  renderReader();
  closeModal('modal-scan');
  showToast(`Đã chuyển toàn bộ ${currentMissingList.length} mục sang trạng thái "Đã biết"!`, "success");
}

function copyMissingItemsOnly() {
  const list = currentMissingList.map(item => typeof item === 'string' ? item : (item.token || ''));
  copyToClipboard(list.join(', '), "Đã sao chép danh sách mục còn thiếu!");
}

function copyGeneratedPrompt() {
  copyToClipboard(document.getElementById('ai-prompt-preview').value, "Đã sao chép Prompt!");
}

// ==================== PROMPT GENERATORS ====================
function generateAiPrompt(type, items) {
  if (type === 'hanzi' || type === 'vocab') {
    const itemKeys = items.map(i => typeof i === 'string' ? i : (i.token || i.word || ''));
    return `You are an expert English linguist and ESL teacher. I'm building a reading-comprehension app and need complete, accurate JSON data for the following English words/phrases.

WORD LIST (${itemKeys.length} items):
${JSON.stringify(itemKeys, null, 2)}

MANDATORY RULES:
1. Each entry MUST include: IPA phonetic transcription, part of speech (POS), Vietnamese meaning, and etymology/memory hook.
2. If a word has MULTIPLE meanings or parts of speech (e.g., "run" as verb and noun), list them numbered 1., 2., 3. in the "meaning" field.
3. For "etymology", explain the word's origin or provide a memory hook in Vietnamese to help learners remember.
4. Include 1-2 example sentences per word in "examples" array (English).
5. ABSOLUTELY NO trailing commas.

OUTPUT FORMAT (valid JSON only, no markdown):
{
  "word": {
    "ipa": "/wɜːrd/",
    "pos": "noun | verb | adj | adv | prep | conj | pron | interj",
    "meaning": "1. Nghĩa tiếng Việt chính\\n2. Nghĩa mở rộng nếu có",
    "logic": "Nguồn gốc từ hoặc mẹo nhớ bằng tiếng Việt",
    "examples": ["Example sentence 1.", "Example sentence 2."],
    "level": "A1 | A2 | B1 | B2 | C1 | C2"
  }
}

IMPORTANT:
- Output ONLY the JSON object, no other text
- Each key is the EXACT word/phrase from the list (lowercase)
- IPA must use standard International Phonetic Alphabet
- Vietnamese meaning must be natural and accurate`;
  } else if (type === 'grammar') {
    return generateGrammarAiPrompt(items);
  } else if (type === 'sentence') {
    return generateSentenceAiPrompt(items);
  }
  return '';
}

function toggleContextDepth(checkbox) {
  useFullSurroundingContext = checkbox.checked;
  const preview = document.getElementById('ai-prompt-preview');
  if (preview && currentScanType === 'grammar') {
    preview.value = generateGrammarAiPrompt(currentMissingList);
  }
}

function saveCustomPromptTemplate() {
  const preview = document.getElementById('ai-prompt-preview');
  if (!preview) return;
  localStorage.setItem('custom_grammar_prompt_tpl', preview.value);
  showToast("Đã lưu mẫu Prompt tùy chỉnh vào máy!", "success");
}

function resetToDefaultPromptTemplate() {
  localStorage.removeItem('custom_grammar_prompt_tpl');
  const preview = document.getElementById('ai-prompt-preview');
  if (preview) preview.value = generateGrammarAiPrompt(currentMissingList, true);
  showToast("Đã khôi phục Prompt mặc định!", "info");
}

function generateGrammarAiPrompt(candidates, forceDefault = false) {
  const savedTpl = localStorage.getItem('custom_grammar_prompt_tpl');
  if (savedTpl && !forceDefault) {
    return savedTpl;
  }

  const normalized = candidates.map(c => {
    if (typeof c === 'string') {
      return { token: c, type: 'pair', anchors: { left: [], right: [] }, anchorTokens: [c], context: {} };
    }
    return c;
  });

  const patternBlocks = normalized.map((c, idx) => {
    const lines = [];
    lines.push(`### Pattern ${idx + 1}: ID = "${c.token}"`);
    lines.push(`- Type: "${c.type || 'pair'}"`);

    if (c.type === 'pair') {
      lines.push(`- Left anchors (neo trái): ${JSON.stringify(c.anchors?.left || [])}`);
      lines.push(`- Right anchors (neo phải): ${JSON.stringify(c.anchors?.right || [])}`);
    } else if (c.type === 'single') {
      lines.push(`- Anchor tokens: ${JSON.stringify(c.anchors?.anchor || c.anchorTokens || [])}`);
    } else if (c.type === 'chain') {
      lines.push(`- Chain segments: ${JSON.stringify(c.anchors?.chain || [])}`);
    }

    if (c.context?.current) {
      lines.push(`- Câu chứa cấu trúc: "${c.context.current}"`);
      if (c.context.prev) lines.push(`- Câu trước: "${c.context.prev}"`);
      if (c.context.next) lines.push(`- Câu sau: "${c.context.next}"`);
    } else if (c.sampleSentences && c.sampleSentences.length > 0) {
      lines.push(`- Câu mẫu 1: "${c.sampleSentences[0]}"`);
      if (c.sampleSentences[1]) lines.push(`- Câu mẫu 2: "${c.sampleSentences[1]}"`);
    }

    return lines.join('\n');
  }).join('\n\n');

  const firstId = normalized[0]?.token || 'G0001';

  return `You are an expert English grammar teacher. I have a list of EXISTING grammar patterns in my database that need metadata filled in.

## CRITICAL RULES

1. **Each pattern ALREADY HAS an ID** (listed below). You MUST use EXACTLY that ID as the JSON key.
2. **DO NOT invent new IDs** like "G0001", "G0002" unless they appear in the list below.
3. **DO NOT skip any pattern** — every ID listed must appear in your output.
4. **The "type" field MUST match** the type given for that pattern.
5. **The anchor arrays** ("left", "right", "anchor", "chain") MUST be filled using the anchor tokens given for that pattern. DO NOT change the anchors.
6. Output ONLY valid JSON, no markdown, no explanation, no trailing commas.

## PATTERNS TO PROCESS (${normalized.length}):

${patternBlocks}

## OUTPUT FORMAT

{
  "_patterns": {
    "${firstId}": {
      "type": "pair | single | chain",
      "left":  ["anchor token 1", "..."],       // ONLY for type=pair
      "right": ["anchor token 1", "..."],       // ONLY for type=pair
      "anchor": ["anchor token"],               // ONLY for type=single
      "chain": [["seg1_token"], ["seg2_token"]],// ONLY for type=chain
      "meaning": "Nghĩa tiếng Việt ngắn gọn",
      "level": "A1 | A2 | B1 | B2 | C1 | C2",
      "priority": 10,
      "notes": "Giải thích ngắn về cách dùng",
      "examples": ["Example sentence 1 .", "Example sentence 2 ."]
    }
  }
}

## FINAL CHECKLIST BEFORE OUTPUT

- [ ] Every ID in the list above appears as a key in "_patterns"
- [ ] No extra IDs were invented
- [ ] Each "type" matches the input type
- [ ] Each anchor array matches the input anchors
- [ ] Output is valid JSON (no trailing commas, no markdown fences)`;
}

function generateSentenceAiPrompt(candidates, forceDefault = false) {
  const savedTpl = localStorage.getItem('custom_sentence_prompt_tpl');
  if (savedTpl && !forceDefault) {
    return savedTpl;
  }

  const normalized = candidates.map(c => {
    if (typeof c === 'string') {
      return {
        token: c,
        type: 'sentence',
        context: { current: c, prev: '', next: '' },
        anchors: [],
        docTitle: ''
      };
    }
    return c;
  });

  const cardBlocks = normalized.map((c, idx) => {
    const lines = [];
    lines.push(`### Card ${idx + 1}: ID = "${c.token}"`);
    if (c.docTitle) lines.push(`- Bài đọc: "${c.docTitle}"`);
    if (c.context?.prev) lines.push(`- Câu trước: "${c.context.prev}"`);
    lines.push(`- Câu chứa cấu trúc: "${c.context?.current || ''}"`);
    if (c.context?.next) lines.push(`- Câu sau: "${c.context.next}"`);
    lines.push(`- Các neo cần giải nghĩa trong ngữ cảnh: ${JSON.stringify(c.anchors || [])}`);
    return lines.join('\n');
  }).join('\n\n');

  const firstId = normalized[0]?.token || 'S0001';
  const firstAnchors = normalized[0]?.anchors || ['anchor 1', 'anchor 2'];

  return `You are an expert English-Vietnamese translator and linguist. I have a list of Sentence Cards extracted from English reading passages. For each card, I need:

1. **sentenceMeaning**: Natural Vietnamese translation of the WHOLE sentence (keep context in mind)
2. **anchorMeanings**: Array of Vietnamese meanings for each anchor phrase, IN THE CONTEXT of this specific sentence (not dictionary meanings)
3. **grammarNote** (optional): A short note about any tricky grammar structure in the sentence

## CARDS TO PROCESS (${normalized.length}):

${cardBlocks}

## OUTPUT FORMAT (valid JSON only, no markdown, no trailing commas):

{
  "_sentences": {
    "${firstId}": {
      "sentenceMeaning": "Nghĩa tiếng Việt tự nhiên của cả câu",
      "anchorMeanings": ${JSON.stringify(firstAnchors.map(a => `Nghĩa ngữ cảnh của "${a}"`))},
      "grammarNote": "Ghi chú ngữ pháp ngắn (nếu có)"
    }
  }
}

## CRITICAL RULES

1. **Each card key MUST be the EXACT ID** given above (e.g. "${firstId}"). DO NOT invent new IDs.
2. **DO NOT skip any card** — every ID listed must appear in your output.
3. **anchorMeanings array MUST have the SAME LENGTH and SAME ORDER as the anchors array** of that card.
4. **sentenceMeaning** must be natural Vietnamese, NOT word-by-word.
5. **anchorMeanings[i]** must reflect how the anchor is used IN THIS SPECIFIC SENTENCE.
6. **grammarNote** is optional.
7. Output ONLY valid JSON, no markdown fences, no explanation.
8. NO trailing commas.`;
}

// ==================== JSON PARSER ====================
function cleanAndParseJson(raw) {
  let clean = raw.trim();
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const firstBrace = clean.indexOf('{');
  const firstBracket = clean.indexOf('[');
  let startIdx = -1;
  if (firstBrace !== -1 && firstBracket !== -1) startIdx = Math.min(firstBrace, firstBracket);
  else if (firstBrace !== -1) startIdx = firstBrace;
  else if (firstBracket !== -1) startIdx = firstBracket;
  if (startIdx !== -1) {
    const lastBrace = clean.lastIndexOf('}');
    const lastBracket = clean.lastIndexOf(']');
    const endIdx = Math.max(lastBrace, lastBracket);
    if (endIdx > startIdx) clean = clean.substring(startIdx, endIdx + 1);
  }
  let sanitized = '';
  let inString = false, escape = false;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (escape) { sanitized += c; escape = false; continue; }
    if (c === '\\') { escape = true; sanitized += c; continue; }
    if (c === '"') { inString = !inString; sanitized += c; continue; }
    if (inString) {
      if (c === '\n') sanitized += '\\n';
      else if (c === '\r') continue;
      else if (c === '\t') sanitized += '\\t';
      else sanitized += c;
    } else sanitized += c;
  }
  let withoutTrailingCommas = '';
  inString = false; escape = false;
  for (let i = 0; i < sanitized.length; i++) {
    const c = sanitized[i];
    if (escape) { withoutTrailingCommas += c; escape = false; continue; }
    if (c === '\\') { escape = true; withoutTrailingCommas += c; continue; }
    if (c === '"') { inString = !inString; withoutTrailingCommas += c; continue; }
    if (!inString && c === ',') {
      let nextIdx = i + 1;
      while (nextIdx < sanitized.length && /\s/.test(sanitized[nextIdx])) nextIdx++;
      if (nextIdx < sanitized.length && (sanitized[nextIdx] === '}' || sanitized[nextIdx] === ']')) continue;
    }
    withoutTrailingCommas += c;
  }
  return JSON.parse(withoutTrailingCommas);
}

function exportCurrentData() {
  let data;
  if (currentImportTarget === 'vocab' || currentImportTarget === 'hanzi') data = vocabDb;
  else data = grammarDb;
  const jsonStr = JSON.stringify(data, null, 2);
  document.getElementById('import-json-area').value = jsonStr;
  copyToClipboard(jsonStr, "Đã sao chép dữ liệu JSON hiện tại!");
}

function openImportModal(target) {
  currentImportTarget = target;
  const titleMap = {
    vocab: 'Nhập / Xuất dữ liệu Từ vựng',
    grammar: 'Nhập / Xuất dữ liệu Ngữ pháp',
    sentence: 'Nhập / Xuất dữ liệu Sentence Card'
  };
  const descMap = {
    vocab: 'Dán dữ liệu JSON Từ vựng vào đây:',
    grammar: 'Dán dữ liệu JSON Ngữ pháp vào đây (có _aliasGroups và _patterns):',
    sentence: 'Dán dữ liệu JSON Sentence vào đây (có _sentences):'
  };
  document.getElementById('import-modal-title').innerText = titleMap[target] || titleMap.vocab;
  document.getElementById('import-modal-desc').innerText = descMap[target] || descMap.vocab;
  document.getElementById('import-json-area').value = '';
  openModal('modal-import');
}

// ==================== GRAMMAR JSON IMPORT ====================
function validateGrammarPattern(id, pattern) {
  if (!id || typeof id !== 'string') {
    return { valid: false, reason: 'ID không phải string' };
  }
  if (!/^G\d{4}$/.test(id)) {
    return { valid: false, reason: `ID "${id}" sai format (phải là G + đúng 4 chữ số, VD: G0001)` };
  }
  if (!pattern || typeof pattern !== 'object' || Array.isArray(pattern)) {
    return { valid: false, reason: 'Pattern không phải object' };
  }

  const type = pattern.type;
  if (!type || !['pair', 'single', 'chain'].includes(type)) {
    return { valid: false, reason: `Thiếu hoặc sai "type" (phải là pair/single/chain)` };
  }

  if (!pattern.meaning || typeof pattern.meaning !== 'string' || !pattern.meaning.trim()) {
    return { valid: false, reason: 'Thiếu "meaning"' };
  }

  if (type === 'pair') {
    const hasLeft  = pattern.leftGroup || (Array.isArray(pattern.left)  && pattern.left.length > 0);
    const hasRight = pattern.rightGroup || (Array.isArray(pattern.right) && pattern.right.length > 0);
    if (!hasLeft || !hasRight) {
      return { valid: false, reason: 'Pair cần leftGroup/left VÀ rightGroup/right' };
    }
  } else if (type === 'single') {
    const hasAnchor = pattern.anchorGroup || (Array.isArray(pattern.anchor) && pattern.anchor.length > 0);
    if (!hasAnchor) {
      return { valid: false, reason: 'Single cần anchorGroup hoặc anchor' };
    }
  } else if (type === 'chain') {
    if (!Array.isArray(pattern.chain) || pattern.chain.length < 2) {
      return { valid: false, reason: 'Chain cần mảng "chain" có ít nhất 2 phần tử' };
    }
  }

  return { valid: true };
}

function importGrammarJsonValidated(parsed) {
  const report = {
    total: 0,
    accepted: [],
    rejected: [],
    aliasGroupsMerged: 0
  };

  if (!parsed || typeof parsed !== 'object') {
    report.rejected.push({ id: '(root)', reason: 'JSON gốc không phải object' });
    return report;
  }

  const norm = normalizeGrammarDb(parsed);

  Object.entries(norm._aliasGroups || {}).forEach(([groupName, tokens]) => {
    if (Array.isArray(tokens) && tokens.length > 0) {
      grammarDb._aliasGroups[groupName] = tokens;
      report.aliasGroupsMerged++;
    }
  });

  Object.entries(norm._patterns || {}).forEach(([id, pattern]) => {
    report.total++;

    const check = validateGrammarPattern(id, pattern);
    if (!check.valid) {
      report.rejected.push({ id, reason: check.reason });
      return;
    }

    const exists = grammarDb._patterns[id] !== undefined;

    if (!exists) {
      report.rejected.push({
        id,
        reason: 'ID chưa tồn tại trong DB (chỉ nhận cập nhật pattern đã có)'
      });
      return;
    }

    grammarDb._patterns[id] = {
      ...grammarDb._patterns[id],
      ...pattern,
      needsData: false,
      updatedAt: Date.now()
    };
    report.accepted.push({ id, action: 'overwritten' });
  });

  if (report.accepted.length > 0) {
    rebuildGrammarIndex();
    touch();
    saveAllData();
  }

  return report;
}

// ==================== REPORT MODAL ====================
function showImportReport(report) {
  const totalRejected = report.rejected.length;
  const totalAccepted = report.accepted.length;

  console.log('[Import Report]', report);

  if (totalAccepted === 0 && totalRejected > 0) {
    showToast(`❌ Không nhận được pattern nào. ${totalRejected} mục bị bỏ qua.`, "warning");
  } else if (totalRejected > 0) {
    showToast(`⚠️ Nhận ${totalAccepted}, bỏ qua ${totalRejected}. Xem chi tiết trong "chuồng gà".`, "warning");
  } else if (totalAccepted > 0) {
    showToast(`✅ Đã cập nhật ${totalAccepted} pattern thành công!`, "success");
  } else {
    showToast(`ℹ️ JSON không có pattern nào.`, "info");
  }

  if (totalRejected > 0) {
    showRejectedDetailModal(report);
  }
}

function showRejectedDetailModal(report) {
  const existing = document.getElementById('modal-import-rejected');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-import-rejected';
  modal.className = "fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4";
  modal.innerHTML = `
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-amber-200 overflow-hidden flex flex-col max-h-[80vh]">
      <div class="p-4 border-b border-amber-200 bg-amber-50 flex items-center justify-between">
        <div>
          <h3 class="font-bold text-sm text-amber-900 flex items-center gap-1.5">
            <span>🐔</span> Chuồng gà — ${report.rejected.length} mục bị bỏ qua
          </h3>
          <p class="text-[11px] text-amber-700 mt-0.5">
            Đã nhận ${report.accepted.length} pattern hợp lệ
          </p>
        </div>
        <button onclick="document.getElementById('modal-import-rejected').remove()"
                class="text-stone-400 hover:text-stone-700 text-xl leading-none">&times;</button>
      </div>
      <div class="p-4 overflow-y-auto flex-1 space-y-2">
        ${report.rejected.map(r => `
          <div class="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">${r.id}</span>
            </div>
            <p class="text-xs text-stone-700">${r.reason}</p>
          </div>
        `).join('')}
      </div>
      <div class="p-3 border-t border-stone-200 bg-stone-50 flex justify-between items-center">
        <button onclick="copyRejectedReport()"
                class="text-xs text-stone-600 hover:text-stone-900 font-semibold px-3 py-1.5 rounded-lg hover:bg-stone-200 transition">
          📋 Sao chép báo cáo
        </button>
        <button onclick="document.getElementById('modal-import-rejected').remove()"
                class="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition">
          Đóng
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  window.__lastImportReport = report;
}

function copyRejectedReport() {
  const report = window.__lastImportReport;
  if (!report) return;
  let text = `BÁO CÁO NẠP JSON GRAMMAR\n`;
  text += `Tổng: ${report.total}\n`;
  text += `Nhận: ${report.accepted.length}\n`;
  text += `Bỏ qua: ${report.rejected.length}\n\n`;
  text += `--- MỤC BỊ BỎ QUA ---\n`;
  report.rejected.forEach(r => {
    text += `${r.id}: ${r.reason}\n`;
  });
  copyToClipboard(text, "Đã sao chép báo cáo!");
}

// ==================== MAIN IMPORT HANDLERS ====================
function applyQuickImport() {
  const raw = document.getElementById('quick-import-json').value.trim();
  if (!raw) {
    showToast("Vui lòng dán dữ liệu JSON trước khi nạp", "warning");
    return;
  }

  try {
    const parsed = cleanAndParseJson(raw);
    let count = 0;

    if (currentScanType === 'vocab' || currentScanType === 'hanzi') {
      if (Array.isArray(parsed)) {
        parsed.forEach(item => {
          const w = (item.word || item.vocab || item.ci || item.char || '').toLowerCase();
          if (w) {
            vocabDb[w] = {
              ipa: item.ipa || item.pinyin || '',
              pos: item.pos || '',
              meaning: item.meaning || '',
              logic: item.logic || '',
              examples: item.examples || [],
              level: item.level || '',
              updatedAt: Date.now()
            };
            count++;
          }
        });
      } else {
        Object.keys(parsed).forEach(k => {
          const key = k.toLowerCase();
          vocabDb[key] = { ...parsed[k], updatedAt: Date.now() };
          count++;
        });
      }
      renderVocabTable();
      touch();
      saveAllData();
      closeModal('modal-scan');
      if (!document.getElementById('view-reader').classList.contains('hidden')) renderReader();
      showToast(`Đã nạp thành công ${count} mục từ vựng!`, "success");

    } else if (currentScanType === 'grammar') {
      const report = importGrammarJsonValidated(parsed);
      renderGrammarTable();
      closeModal('modal-scan');
      if (!document.getElementById('view-reader').classList.contains('hidden')) renderReader();
      showImportReport(report);

    } else if (currentScanType === 'sentence') {
      const report = importSentenceJsonValidated(parsed);
      renderSentenceTable();
      closeModal('modal-scan');
      if (!document.getElementById('view-reader').classList.contains('hidden')) renderReader();
      showImportReport(report);
    }

  } catch (err) {
    showToast("Lỗi phân tích JSON: " + err.message, "error");
    console.error(err);
  }
}

function processGeneralImport() {
  const raw = document.getElementById('import-json-area').value.trim();
  if (!raw) {
    showToast("Vui lòng dán dữ liệu JSON trước khi nạp", "warning");
    return;
  }

  try {
    const parsed = cleanAndParseJson(raw);
    let count = 0;

    if (currentImportTarget === 'vocab' || currentImportTarget === 'hanzi') {
      if (Array.isArray(parsed)) {
        parsed.forEach(item => {
          const w = (item.word || item.vocab || '').toLowerCase();
          if (w) {
            vocabDb[w] = {
              ipa: item.ipa || item.pinyin || '',
              pos: item.pos || '',
              meaning: item.meaning || '',
              logic: item.logic || '',
              examples: item.examples || [],
              level: item.level || '',
              updatedAt: Date.now()
            };
            count++;
          }
        });
      } else {
        Object.keys(parsed).forEach(k => {
          const key = k.toLowerCase();
          vocabDb[key] = { ...parsed[k], updatedAt: Date.now() };
          count++;
        });
      }
      renderVocabTable();
      touch();
      saveAllData();
      closeModal('modal-import');
      if (!document.getElementById('view-reader').classList.contains('hidden')) renderReader();
      showToast(`Đã nạp thành công ${count} mục từ vựng!`, "success");

    } else if (currentImportTarget === 'grammar') {
      const report = importGrammarJsonValidated(parsed);
      renderGrammarTable();
      closeModal('modal-import');
      if (!document.getElementById('view-reader').classList.contains('hidden')) renderReader();
      showImportReport(report);

    } else if (currentImportTarget === 'sentence') {
      const report = importSentenceJsonValidated(parsed);
      renderSentenceTable();
      closeModal('modal-import');
      if (!document.getElementById('view-reader').classList.contains('hidden')) renderReader();
      showImportReport(report);
    }

  } catch (err) {
    showToast("JSON không hợp lệ: " + err.message, "error");
    console.error(err);
  }
}