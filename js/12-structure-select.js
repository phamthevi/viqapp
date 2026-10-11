/* ============================================================
 * FILE: 12-structure-select.js
 * DOMAIN: Ghép neo cấu trúc (Structure Select Mode)
 * DEPENDS: 03-state, 04-ui-shared, 09-grammar-engine, 10-grammar-ui,
 *          15-reader (buildPagination, renderReader)
 * ============================================================ */

function toggleStructureSelectMode() {
  isStructureSelectMode = !isStructureSelectMode;
  const toolbar = document.getElementById('floating-struct-toolbar');
  const actionGroup = document.getElementById('struct-action-group');
  const text = document.getElementById('struct-mode-text');

  if (isStructureSelectMode) {
    if (toolbar) toolbar.classList.add('ring-2', 'ring-purple-500', 'bg-stone-900');
    if (actionGroup) {
      actionGroup.classList.remove('hidden');
      actionGroup.classList.add('flex');
    }
    if (text) text.innerText = "Đang chọn...";
    showToast("Chọn các từ liền nhau → bấm 'Gộp neo'. Lặp lại cho các neo khác.", "info");
  } else {
    if (toolbar) toolbar.classList.remove('ring-2', 'ring-purple-500');
    if (actionGroup) {
      actionGroup.classList.add('hidden');
      actionGroup.classList.remove('flex');
    }
    if (text) text.innerText = "Ghép cấu trúc";
    clearSelectedStructureTokens();
    clearAllStructureAnchors();
  }
  updateSelectedStructureUI();
}

function clearSelectedStructureTokens() {
  selectedStructureTokens = [];
  document.querySelectorAll('.word-unit.struct-selected').forEach(el => {
    el.classList.remove('struct-selected');
  });
  updateSelectedStructureUI();
}

function clearAllStructureAnchors() {
  structureAnchors = [];
  document.querySelectorAll('.word-unit.struct-anchored').forEach(el => {
    el.classList.remove('struct-anchored');
    const badge = el.querySelector('.anchor-badge');
    if (badge) badge.remove();
  });
  updateSelectedStructureUI();
}

function findWordElement(lineIdx, tokenIdx) {
  return document.querySelector(
    `.word-unit[data-line-idx="${lineIdx}"][data-token-idx="${tokenIdx}"]`
  );
}

function refreshAnchorBadges() {
  document.querySelectorAll('.word-unit.struct-anchored').forEach(el => {
    const badge = el.querySelector('.anchor-badge');
    if (badge) badge.remove();
    el.classList.remove('struct-anchored');
  });
  structureAnchors.forEach((anchor, idx) => {
    anchor.positions.forEach(pos => {
      const el = findWordElement(anchor.lineIdx, pos);
      if (el) {
        el.classList.add('struct-anchored');
        const badge = document.createElement('sup');
        badge.className = 'anchor-badge';
        badge.innerText = idx + 1;
        badge.style.cssText = `
          position:absolute; top:-6px; right:-6px;
          background:#9333ea; color:#fff;
          font-size:9px; font-weight:800;
          min-width:14px; height:14px; padding:0 3px;
          border-radius:7px; display:flex;
          align-items:center; justify-content:center;
          border:1.5px solid white; font-family:Inter,sans-serif;
        `;
        el.appendChild(badge);
        el.style.position = 'relative';
      }
    });
  });
}

function updateSelectedStructureUI() {
  const el = document.getElementById('struct-selected-count');
  if (el) {
    const selectedCount = selectedStructureTokens.length;
    const anchorCount = structureAnchors.length;
    if (anchorCount > 0) {
      el.innerText = `${anchorCount} neo (đang chọn ${selectedCount})`;
      el.classList.add('text-purple-200');
    } else {
      el.innerText = `${selectedCount} từ`;
      el.classList.remove('text-purple-200');
    }
  }
  const btnGroup = document.getElementById('btn-group-anchor');
  const btnSaveDraft = document.getElementById('btn-save-draft');
  const btnSentence = document.getElementById('btn-sentence-mining');
  const hasAnchors = structureAnchors.length > 0;

  if (btnGroup) {
    btnGroup.disabled = selectedStructureTokens.length === 0;
    btnGroup.classList.toggle('opacity-40', selectedStructureTokens.length === 0);
  }
  if (btnSaveDraft) {
    btnSaveDraft.disabled = !hasAnchors;
    btnSaveDraft.classList.toggle('opacity-40', !hasAnchors);
  }
  if (btnSentence) {
    btnSentence.disabled = !hasAnchors;
    btnSentence.classList.toggle('opacity-40', !hasAnchors);
  }
}

function groupSelectedIntoAnchor() {
  if (selectedStructureTokens.length === 0) {
    showToast("Vui lòng chọn ít nhất 1 từ để gộp neo!", "warning");
    return;
  }

  const sorted = [...selectedStructureTokens].sort((a, b) => {
    if (a.lineIdx !== b.lineIdx) return a.lineIdx - b.lineIdx;
    return a.tokenIdx - b.tokenIdx;
  });

  const isConsecutive = sorted.every((item, i) => {
    if (i === 0) return true;
    const prev = sorted[i - 1];
    return item.lineIdx === prev.lineIdx && item.tokenIdx === prev.tokenIdx + 1;
  });

  if (!isConsecutive) {
    showToast("Các từ trong 1 neo phải LIỀN NHAU (không có từ khác xen giữa).", "warning");
    return;
  }

  const newAnchor = {
    id: `anchor-${Date.now()}-${structureAnchors.length}`,
    words: sorted.map(t => t.word),
    rawWords: sorted.map(t => t.rawWord),
    lineIdx: sorted[0].lineIdx,
    positions: sorted.map(t => t.tokenIdx),
    startPos: sorted[0].tokenIdx,
    endPos: sorted[sorted.length - 1].tokenIdx
  };

  const overlap = structureAnchors.find(a =>
    a.lineIdx === newAnchor.lineIdx &&
    !(newAnchor.endPos < a.startPos || newAnchor.startPos > a.endPos)
  );
  if (overlap) {
    showToast("Neo này chồng lấn với neo đã gộp trước đó!", "warning");
    return;
  }

  structureAnchors.push(newAnchor);

  sorted.forEach(t => {
    const el = findWordElement(t.lineIdx, t.tokenIdx);
    if (el) el.classList.remove('struct-selected');
  });

  structureAnchors.sort((a, b) => {
    if (a.lineIdx !== b.lineIdx) return a.lineIdx - b.lineIdx;
    return a.startPos - b.startPos;
  });
  refreshAnchorBadges();

  selectedStructureTokens = [];
  updateSelectedStructureUI();
  showToast(`✅ Đã gộp neo ${structureAnchors.length}: "${newAnchor.words.join(' ')}"`, "success");
}

function analyzeSelectedStructure() {
  if (structureAnchors.length === 0) return null;

  const sorted = [...structureAnchors].sort((a, b) => {
    if (a.lineIdx !== b.lineIdx) return a.lineIdx - b.lineIdx;
    return a.startPos - b.startPos;
  });

  let type;
  if (sorted.length === 1) type = 'single';
  else if (sorted.length === 2) type = 'pair';
  else type = 'chain';

  const allWords = sorted.flatMap(a => a.words);
  const id = null;

  const currentDoc = docs.find(d => d.id === activeDocId);
  const targetLineIdx = sorted[0].lineIdx || 0;
  const context = getSurroundingSentences(currentDoc, targetLineIdx);

  return {
    id,
    type,
    anchors: sorted.map(a => ({
      words: a.words,
      rawWords: a.rawWords,
      lineIdx: a.lineIdx,
      startPos: a.startPos,
      endPos: a.endPos
    })),
    context,
    _anchorCount: sorted.length,
    _totalWords: allWords.length
  };
}

function buildContextForAnchors(doc, anchors) {
  const empty = { current: '', prev: '', next: '', pageIndex: 0 };
  if (!doc || !anchors || anchors.length === 0) return empty;
  if (!paginatedDoc || paginatedDoc.docId !== doc.id) {
    paginatedDoc = buildPagination(doc);
  }

  const sorted = [...anchors].sort((a, b) => {
    if (a.lineIdx !== b.lineIdx) return a.lineIdx - b.lineIdx;
    return a.startPos - b.startPos;
  });
  const firstAnchor = sorted[0];
  const pageIndex = Math.max(0, Math.min(currentPage - 1, paginatedDoc.pages.length - 1));
  const pageLines = paginatedDoc.pages[pageIndex]?.lines || [];

  const lineIdx = firstAnchor.lineIdx;
  if (lineIdx < 0 || lineIdx >= pageLines.length) return { ...empty, pageIndex };

  return {
    current: (pageLines[lineIdx] || '').trim(),
    prev: lineIdx > 0 ? (pageLines[lineIdx - 1] || '').trim() : '',
    next: lineIdx < pageLines.length - 1 ? (pageLines[lineIdx + 1] || '').trim() : '',
    pageIndex
  };
}

function saveDraftStructureQuick() {
  const data = analyzeSelectedStructure();
  if (!data) {
    showToast("Vui lòng gộp ít nhất 1 neo trước khi lưu!", "warning");
    return;
  }

  const newId = generateGrammarId();
  const currentDoc = docs.find(d => d.id === activeDocId);
  const savedContext = buildContextForAnchors(currentDoc, structureAnchors);

  const newPattern = {
    type: data.type,
    meaning: "Chờ AI nạp nghĩa...",
    notes: `Tạo từ bài đọc. ${data._anchorCount} neo, ${data._totalWords} từ.`,
    level: "B1",
    priority: 15,
    needsData: true,
    context: savedContext,
    examples: savedContext.current ? [savedContext.current] : [],
    updatedAt: Date.now()
  };

  if (data.type === 'single') {
    const anchorPhrase = data.anchors[0].words.join(' ');
    newPattern.anchor = [anchorPhrase];
  } else if (data.type === 'pair') {
    const leftPhrase = data.anchors[0].words.join(' ');
    const rightPhrase = data.anchors[1].words.join(' ');
    newPattern.left = [leftPhrase];
    newPattern.right = [rightPhrase];
  } else if (data.type === 'chain') {
    newPattern.chain = data.anchors.map(a => [a.words.join(' ')]);
  }

  grammarDb._patterns[newId] = newPattern;
  rebuildGrammarIndex();
  touch();
  saveAllData();

  toggleStructureSelectMode();
  renderReader();
  showToast(`⚡ Đã lưu nháp mã "${newId}" (${data.type}, ${data._anchorCount} neo). AI sẽ xử lý ở tab Ngữ pháp!`, "success");
}

function saveSentenceMiningQuick() {
  if (structureAnchors.length === 0) {
    showToast("Vui lòng gộp ít nhất 1 neo trong câu trước khi lưu Sentence Card!", "warning");
    return;
  }

  const currentDoc = docs.find(d => d.id === activeDocId);
  if (!currentDoc) {
    showToast("Không tìm thấy bài đọc hiện tại!", "warning");
    return;
  }

  const savedContext = buildContextForAnchors(currentDoc, structureAnchors);

  if (!savedContext.current) {
    showToast("Không tìm thấy câu chứa neo. Vui lòng chọn lại neo!", "warning");
    return;
  }

  const sortedAnchors = [...structureAnchors].sort((a, b) => {
    if (a.lineIdx !== b.lineIdx) return a.lineIdx - b.lineIdx;
    return a.startPos - b.startPos;
  });
  const anchorPhrases = sortedAnchors.map(a => a.words.join(' '));

  const newId = generateSentenceId();
  const now = Date.now();

  const newCard = {
    id: newId,
    current: savedContext.current,
    prev: useSentenceFullContext ? savedContext.prev : '',
    next: useSentenceFullContext ? savedContext.next : '',
    pageIndex: savedContext.pageIndex,
    docId: currentDoc.id,
    docTitle: currentDoc.title,
    anchors: anchorPhrases,
    sentenceMeaning: '',
    anchorMeanings: [],
    grammarNote: '',
    needsData: true,
    createdAt: now,
    updatedAt: now
  };

  sentenceDb[newId] = newCard;

  sentenceFsrsPool[newId] = {
    streak: 0,
    interval: 1,
    nextReview: now,
    lastReview: now,
    updatedAt: now,
    deleted: false,
    deletedAt: 0,
    snapshotCurrent: newCard.current,
    snapshotPrev: newCard.prev || '',
    snapshotNext: newCard.next || '',
    snapshotMeaning: '',
    snapshotAnchors: newCard.anchors,
    snapshotAnchorMeanings: []
  };

  touch();
  saveAllData();

  toggleStructureSelectMode();
  renderReader();

  showToast(`📸 Đã tạo Sentence Card "${newId}" (${anchorPhrases.length} neo) và ném vào FSRS!`, "success");
}

function createStructureFromSelected(openModalToEdit = false) {
  const data = analyzeSelectedStructure();
  if (!data) {
    showToast("Vui lòng gộp ít nhất 1 neo trước!", "warning");
    return;
  }

  openAddGrammarModal();
  document.getElementById('gm-input-id').value = generateGrammarId();
  document.getElementById('gm-input-type').value = data.type;
  onGrammarTypeChange();

  if (data.type === 'single') {
    document.getElementById('gm-input-anchor').value = data.anchors[0].words.join(' ');
  } else if (data.type === 'pair') {
    document.getElementById('gm-input-left').value = data.anchors[0].words.join(' ');
    document.getElementById('gm-input-right').value = data.anchors[1].words.join(' ');
  } else if (data.type === 'chain') {
    document.getElementById('gm-input-chain').value = data.anchors.map(a => a.words.join(' ')).join('\n');
  }

  const exInput = document.getElementById('gm-input-examples');
  if (exInput) exInput.value = data.context.current;

  const noteInput = document.getElementById('gm-input-notes');
  if (noteInput && data.context.prev) {
    noteInput.value = `Trước: ${data.context.prev}\nSau: ${data.context.next}`;
  }

  toggleStructureSelectMode();
}

function attachWordInteractions(element, word, lineIdx, tokenIdx) {
  element.dataset.lineIdx = lineIdx;
  element.dataset.tokenIdx = tokenIdx;

  element.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isStructureSelectMode) {
      const clean = cleanEnglishWord(word);
      const foundIdx = selectedStructureTokens.findIndex(
        item => item.lineIdx === lineIdx && item.tokenIdx === tokenIdx
      );
      if (foundIdx !== -1) {
        selectedStructureTokens.splice(foundIdx, 1);
        element.classList.remove('struct-selected');
      } else {
        selectedStructureTokens.push({
          word: clean,
          rawWord: word,
          lineIdx: lineIdx,
          tokenIdx: tokenIdx
        });
        element.classList.add('struct-selected');
      }
      updateSelectedStructureUI();
      return;
    }

    if (isTestActive) registerTestLookup('vocab', word);
    saveBookmark('vocab', word);
    openVocabCard(word);
  });
  element.addEventListener('contextmenu', (e) => { e.preventDefault(); });
}