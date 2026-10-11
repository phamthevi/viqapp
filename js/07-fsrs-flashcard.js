/* ============================================================
 * FILE: 07-fsrs-flashcard.js
 * DOMAIN: Flashcard session + swipe gesture
 * DEPENDS: 03-state, 04-ui-shared, 06-fsrs-core, 11-grammar-fsrs,
 *          13-sentence-mining, 09-grammar-engine
 * ============================================================ */

function startFlashcardReviewSession() {
  const now = Date.now();
  const dueCards = [];
  const allCards = [];

  Object.keys(fsrsPool.vocab).forEach(w => {
    const item = fsrsPool.vocab[w];
    if (item.deleted) return;
    const card = { type: 'vocab', key: w, ...item };
    allCards.push(card);
    if (item.nextReview <= now) dueCards.push(card);
  });

  Object.keys(grammarFsrsPool).forEach(pid => {
    const item = grammarFsrsPool[pid];
    if (item.deleted) return;
    const card = { type: 'grammar', key: pid, ...item };
    allCards.push(card);
    if (item.nextReview <= now) dueCards.push(card);
  });

  Object.keys(sentenceFsrsPool).forEach(sid => {
    const item = sentenceFsrsPool[sid];
    if (item.deleted) return;
    const card = { type: 'sentence', key: sid, ...item };
    allCards.push(card);
    if (item.nextReview <= now) dueCards.push(card);
  });

  if (dueCards.length === 0) {
    if (allCards.length === 0) {
      showToast("Hiện tại không có mục nào trong bể củng cố!", "info");
      return;
    }
    showConfirmModal("Chưa có thẻ nào đến kỳ hạn. Ôn tập sớm các thẻ đang có?", () => { launchFlashcardDeck(allCards); });
    return;
  }
  launchFlashcardDeck(dueCards);
}

function launchFlashcardDeck(deck) {
  currentFlashcardDeck = [...deck].sort(() => Math.random() - 0.5);
  currentFlashcardIndex = 0;
  openModal('modal-flashcard-session');
  document.body.classList.add('flashcard-open');
  setTimeout(() => {
    initFlashcardSwipe();
    attachModalSwipeHandlers();
  }, 50);
  loadFlashcard(currentFlashcardIndex);
}

function handleFlashcardClick(e) {
  if (Date.now() - lastSwipeTime < 400) return;
  if (e.target.closest('button') || e.target.closest('input')) return;
  toggleFlipFlashcard();
}

function toggleFlipFlashcard() {
  const cardEl = document.getElementById('flashcard-element');
  if (cardEl) cardEl.classList.toggle('flipped');
}

function initFlashcardSwipe() {
  const cardEl = document.getElementById('flashcard-element');
  if (!cardEl) return;
  cardEl.dataset.swipeInit = '1';
  cardEl.addEventListener('contextmenu', (e) => {
    if (e.target.closest('#fc-front-sentence')) return;
    e.preventDefault();
  });
}

function triggerSwipeAction(action) {
  const cardEl = document.getElementById('flashcard-element');
  if (!cardEl) return;
  swipeState.isAnimating = true;
  lastSwipeTime = Date.now();

  ['swipe-ind-forgot', 'swipe-ind-known', 'swipe-ind-graduate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.opacity = '0';
  });

  let animClass = '';
  if (action === 'forgot') animClass = 'swipe-left';
  else if (action === 'known') animClass = 'swipe-right';
  else if (action === 'graduate') animClass = 'swipe-up';

  cardEl.classList.remove('swiping');
  cardEl.style.transform = '';
  cardEl.style.opacity = '';
  cardEl.classList.add(animClass);

  setTimeout(async () => {
    cardEl.classList.remove(animClass);
    swipeState.isAnimating = false;
    swipeState.isLocked = false;
    if (action === 'forgot') await handleFsrsResponse(1);
    else if (action === 'known') await handleFsrsResponse(3);
    else if (action === 'graduate') graduateCurrentFlashcard();
  }, 320);
}

function getUniqueContextSentence(targetItem, key) {
  const allTextDocs = docs.filter(d => !d.hidden);
  const matchedSentences = [];
  const keyClean = cleanEnglishWord(key);
  allTextDocs.forEach(d => {
    const sentences = d.content.split(/[.!?\n]+/);
    sentences.forEach(s => {
      const cleanSent = s.trim();
      if (cleanSent.toLowerCase().includes(keyClean) && cleanSent.length >= 4) matchedSentences.push(cleanSent);
    });
  });
  if (matchedSentences.length === 0) return `I use the word "${key}" every day .`;
  const used = targetItem.usedSentences || [];
  const available = matchedSentences.filter(s => !used.includes(s));
  let chosen = '';
  if (available.length > 0) chosen = available[Math.floor(Math.random() * available.length)];
  else {
    targetItem.usedSentences = [];
    chosen = matchedSentences[Math.floor(Math.random() * matchedSentences.length)];
  }
  if (!targetItem.usedSentences) targetItem.usedSentences = [];
  targetItem.usedSentences.push(chosen);
  return chosen;
}

function renderInteractiveSentence(sentence, targetKey) {
  const container = document.getElementById('fc-front-sentence');
  if (!container || !sentence) return;
  container.innerHTML = '';

  const tokens = sentence.split(/\s+/).filter(t => t !== '');
  const targetClean = cleanEnglishWord(targetKey);

  tokens.forEach(tok => {
    if (!tok) return;
    const cleanTok = cleanEnglishWord(tok);
    if (!cleanTok) {
      const span = document.createElement('span');
      span.className = 'text-stone-500 mx-0.5';
      span.innerText = tok;
      container.appendChild(span);
      container.appendChild(document.createTextNode(' '));
      return;
    }
    const isTarget = cleanTok === targetClean;
    const span = document.createElement('span');
    span.className = 'cursor-pointer hover:bg-amber-100 rounded px-0.5 transition';
    if (isTarget) span.classList.add('text-crimson-600', 'underline', 'font-bold', 'bg-amber-50');
    span.innerText = tok;
    span.addEventListener('click', (e) => {
      e.stopPropagation();
      openVocabCard(cleanTok);
    });
    container.appendChild(span);
    container.appendChild(document.createTextNode(' '));
  });
}

function renderGrammarSentence(sentence, grammarCard) {
  const container = document.getElementById('fc-front-sentence');
  if (!container) return;
  container.innerHTML = '';

  const anchors = (grammarCard.snapshotAnchors || '')
    .split(/[/.]|\s+\.\.\.\s+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  const anchorPhrases = anchors.flatMap(a => a.split(/\s+/));

  const tokens = sentence.split(/\s+/).filter(t => t !== '');
  tokens.forEach(tok => {
    const cleanTok = cleanEnglishWord(tok);
    const isAnchor = cleanTok && anchorPhrases.includes(cleanTok);
    const span = document.createElement('span');
    span.className = 'cursor-pointer hover:bg-purple-100 rounded px-0.5 transition';
    if (isAnchor) span.classList.add('text-purple-700', 'underline', 'font-bold', 'bg-purple-50');
    span.innerText = tok;
    container.appendChild(span);
    container.appendChild(document.createTextNode(' '));
  });
}

function loadFlashcard(index) {
  if (index >= currentFlashcardDeck.length) {
    closeModal('modal-flashcard-session');
    document.body.classList.remove('flashcard-open');
    saveAllData();
    renderReviewTables();
    showToast("🎉 Chúc mừng! Bạn đã hoàn thành toàn bộ lượt thẻ hôm nay!", "success");
    return;
  }
  const card = currentFlashcardDeck[index];
  activeFlashcardItem = card;
  const cardEl = document.getElementById('flashcard-element');
  if (cardEl) {
    cardEl.classList.remove('flipped', 'swiping', 'swipe-left', 'swipe-right', 'swipe-up');
    cardEl.classList.remove('fc-sentence-mode');
    cardEl.style.transform = '';
    cardEl.style.opacity = '';
  }
  ['swipe-ind-forgot', 'swipe-ind-known', 'swipe-ind-graduate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.opacity = '0';
  });
  swipeState.isLocked = false;
  swipeState.isAnimating = false;
  swipeState.active = false;
  document.getElementById('fc-counter-label').innerText = `Thẻ ${index + 1} / ${currentFlashcardDeck.length}`;

  const totalSteps = fsrsConfig.fsrsSteps || 4;
  const stepsLabel = totalSteps >= 999 ? '∞' : totalSteps;
  document.getElementById('fc-streak-indicator').innerText = `Chuỗi: ${card.streak || 0} / ${stepsLabel}`;
  const frontType = document.getElementById('fc-front-type-badge');
  const frontRank = document.getElementById('fc-front-rank-badge');
  const frontText = document.getElementById('fc-front-text');
  frontRank.classList.remove('hidden');

  if (card.type === 'grammar') {
    frontType.innerText = 'Ngữ pháp';
    frontType.className = 'px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold uppercase text-[10px]';
    frontRank.innerText = card.snapshotLevel ? `CEFR ${card.snapshotLevel}` : 'Cấu trúc';
    frontText.innerText = card.snapshotAnchors || card.key;
    frontText.className = 'text-3xl sm:text-4xl font-english font-bold text-purple-900 break-words px-2';

    const sentence = (card.usedSentences && card.usedSentences[0]) || '—';
    renderGrammarSentence(sentence, card);

    document.getElementById('fc-back-pinyin').innerText = card.snapshotLevel || '';
    document.getElementById('fc-back-hanviet').innerText = (card.snapshotType || '').toUpperCase();
    document.getElementById('fc-back-meaning').innerText = card.snapshotMeaning || 'Chưa có nghĩa';
    const logicWrapper = document.getElementById('fc-back-logic-wrapper');
    const logicElem = document.getElementById('fc-back-logic');
    if (card.snapshotNotes) {
      logicWrapper.classList.remove('hidden');
      logicElem.innerText = card.snapshotNotes;
    } else {
      logicWrapper.classList.add('hidden');
    }
  } else if (card.type === 'sentence') {
    if (cardEl) cardEl.classList.add('fc-sentence-mode');

    frontType.innerText = 'Câu';
    frontType.className = 'px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold uppercase text-[10px]';
    frontRank.innerText = `ID ${card.key}`;

    frontText.className = 'text-lg sm:text-xl font-english font-bold text-stone-900 break-words px-2 leading-relaxed text-left';
    frontText.innerHTML = '';

    const anchorList = card.snapshotAnchors || [];
    const anchorTokens = anchorList.flatMap(a => a.toLowerCase().split(/\s+/));
    const tokens = (card.snapshotCurrent || '').split(/\s+/);

    tokens.forEach((tok, i) => {
      const cleanTok = cleanEnglishWord(tok);
      const isAnchor = cleanTok && anchorTokens.includes(cleanTok);
      const span = document.createElement('span');
      if (isAnchor) {
        span.className = 'text-rose-600 underline decoration-2 decoration-rose-400 bg-rose-50 rounded px-0.5';
      }
      span.innerText = tok;
      frontText.appendChild(span);
      if (i < tokens.length - 1) frontText.appendChild(document.createTextNode(' '));
    });

    document.getElementById('fc-back-pinyin').innerText = '';
    document.getElementById('fc-back-hanviet').innerText = `${(card.snapshotAnchors || []).length} neo`;

    const meaningHtml = `
      <div class="font-medium text-stone-100">${card.snapshotMeaning || 'Chưa có nghĩa'}</div>
      ${(card.snapshotAnchors || []).length > 0 ? `
        <div class="mt-2 pt-2 border-t border-white/10 space-y-1">
          ${(card.snapshotAnchors || []).map((a, i) => `
            <div class="text-[11px]">
              <span class="font-mono font-bold text-purple-300">${a}</span>
              <span class="text-stone-300"> → </span>
              <span class="text-stone-200">${(card.snapshotAnchorMeanings || [])[i] || '—'}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
    document.getElementById('fc-back-meaning').innerHTML = meaningHtml;

    const logicWrapper = document.getElementById('fc-back-logic-wrapper');
    if (logicWrapper) logicWrapper.classList.add('hidden');
  } else {
    frontType.innerText = card.key.includes(' ') ? 'Cụm từ' : 'Từ đơn';
    frontType.className = 'px-2.5 py-1 rounded-full bg-stone-100 font-bold uppercase text-[10px]';
    frontRank.innerText = `Rank #${card.rank || getItemRank(card.type, card.key)}`;
    frontText.className = 'text-5xl sm:text-6xl font-english font-bold text-stone-900';
    frontText.innerText = card.key;

    const sentence = getUniqueContextSentence(card, card.key);
    renderInteractiveSentence(sentence, card.key);

    const pinyinElem = document.getElementById('fc-back-pinyin');
    const hanvietElem = document.getElementById('fc-back-hanviet');
    const meaningElem = document.getElementById('fc-back-meaning');
    const logicElem = document.getElementById('fc-back-logic');
    const logicWrapper = document.getElementById('fc-back-logic-wrapper');

    const data = getVocabEntry(card.key) || {};
    pinyinElem.innerText = data.ipa || '--';
    hanvietElem.innerText = data.pos || '';
    meaningElem.innerText = data.meaning || 'Chưa nạp nghĩa';
    if (data.logic) {
      logicWrapper.classList.remove('hidden');
      logicElem.innerText = data.logic;
    } else logicWrapper.classList.add('hidden');
  }
}

function attachModalSwipeHandlers() {
  const modal = document.getElementById('modal-flashcard-session');
  if (!modal || modal.dataset.fullSwipeInit === '1') return;
  modal.dataset.fullSwipeInit = '1';

  let touchStartX = 0, touchStartY = 0;
  let touchCurrentX = 0, touchCurrentY = 0;
  let isDragging = false;
  let startTime = 0;

  function isInsideCard(x, y) {
    const cardEl = document.getElementById('flashcard-element');
    if (!cardEl) return false;
    const rect = cardEl.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  modal.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });
  modal.addEventListener('wheel', (e) => { e.preventDefault(); }, { passive: false });

  modal.addEventListener('touchstart', (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    const t = e.touches[0];
    if (isInsideCard(t.clientX, t.clientY)) { isDragging = false; return; }
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchCurrentX = t.clientX;
    touchCurrentY = t.clientY;
    isDragging = true;
    startTime = Date.now();
    const cardEl = document.getElementById('flashcard-element');
    if (cardEl && swipeState && !swipeState.isAnimating && !swipeState.isLocked) {
      swipeState.active = true;
      swipeState.startX = t.clientX;
      swipeState.startY = t.clientY;
      swipeState.currentX = t.clientX;
      swipeState.currentY = t.clientY;
      swipeState.pointerId = 'touch-' + startTime;
    }
  }, { passive: true });

  modal.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.target.closest('button') || e.target.closest('input')) return;
    const t = e.touches[0];
    touchCurrentX = t.clientX;
    touchCurrentY = t.clientY;
    if (!swipeState.active) return;
    const dx = t.clientX - swipeState.startX;
    const dy = t.clientY - swipeState.startY;
    const cardEl = document.getElementById('flashcard-element');
    if (!cardEl) return;
    swipeState.currentX = t.clientX;
    swipeState.currentY = t.clientY;
    if (Math.abs(dy) > Math.abs(dx) && dy > 0) return;
    let tx = dx, ty = 0;
    if (dy < -30 && Math.abs(dy) > Math.abs(dx)) { tx = dx * 0.3; ty = dy; }
    const damping = 0.85;
    const finalX = (Math.abs(tx) > 40) ? tx * damping : tx;
    const finalY = (Math.abs(ty) > 40) ? ty * damping : ty;
    cardEl.style.transform = `translate(${finalX}px, ${finalY}px) rotate(${finalX * 0.05}deg)`;
    cardEl.style.opacity = String(Math.max(0.3, 1 - Math.abs(finalX) / 500));

    const indForgot = document.getElementById('swipe-ind-forgot');
    const indKnown  = document.getElementById('swipe-ind-known');
    const indGrad   = document.getElementById('swipe-ind-graduate');
    if (indForgot) indForgot.style.opacity = (dx < -30 && Math.abs(dx) > Math.abs(dy)) ? Math.min(1, Math.abs(dx) / SWIPE_THRESHOLD_X) : '0';
    if (indKnown)  indKnown.style.opacity  = (dx >  30 && Math.abs(dx) > Math.abs(dy)) ? Math.min(1, Math.abs(dx) / SWIPE_THRESHOLD_X) : '0';
    if (indGrad)   indGrad.style.opacity   = (dy < -40 && Math.abs(dy) > Math.abs(dx)) ? Math.min(1, Math.abs(dy) / SWIPE_THRESHOLD_Y) : '0';
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const cardEl = document.getElementById('flashcard-element');
    if (!cardEl || !swipeState.active) return;
    swipeState.active = false;
    swipeState.isLocked = true;
    const dx = touchCurrentX - touchStartX;
    const dy = touchCurrentY - touchStartY;
    const duration = Date.now() - startTime;
    const indForgot = document.getElementById('swipe-ind-forgot');
    const indKnown  = document.getElementById('swipe-ind-known');
    const indGrad   = document.getElementById('swipe-ind-graduate');
    const isHorizontal = Math.abs(dx) > Math.abs(dy);
    const isVerticalUp = dy < -SWIPE_THRESHOLD_Y && !isHorizontal;

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && duration < 300) {
      cardEl.style.transform = '';
      cardEl.style.opacity = '';
      if (indForgot) indForgot.style.opacity = '0';
      if (indKnown) indKnown.style.opacity = '0';
      if (indGrad) indGrad.style.opacity = '0';
      swipeState.isLocked = false;
      toggleFlipFlashcard();
      return;
    }

    if (isVerticalUp && indGrad && parseFloat(indGrad.style.opacity || '0') > 0.3) {
      triggerSwipeAction('graduate');
    } else if (isHorizontal && dx <= -SWIPE_THRESHOLD_X) {
      triggerSwipeAction('forgot');
    } else if (isHorizontal && dx >= SWIPE_THRESHOLD_X) {
      triggerSwipeAction('known');
    } else {
      cardEl.style.transform = '';
      cardEl.style.opacity = '';
      if (indForgot) indForgot.style.opacity = '0';
      if (indKnown) indKnown.style.opacity = '0';
      if (indGrad) indGrad.style.opacity = '0';
      swipeState.isLocked = false;
    }
  }, { passive: true });

  modal.addEventListener('touchcancel', () => { isDragging = false; }, { passive: true });
}

function graduateCurrentFlashcard() {
  if (!activeFlashcardItem) return;
  const card = activeFlashcardItem;

  if (card.type === 'grammar') {
    if (grammarFsrsPool[card.key] && !grammarFsrsPool[card.key].deleted) {
      softDeleteGrammarFsrs(card.key, 'graduated');
      touch();
      saveAllData();
      updateBadges();
      showToast(`🎓 Đã tốt nghiệp cấu trúc "${card.key}"!`, "success");
    } else {
      showToast(`"${card.key}" không còn trong bể FSRS.`, "info");
    }
  } else if (card.type === 'sentence') {
    if (sentenceFsrsPool[card.key] && !sentenceFsrsPool[card.key].deleted) {
      softDeleteSentenceFsrs(card.key, 'graduated');
      touch();
      saveAllData();
      updateBadges();
      showToast(`🎓 Đã tốt nghiệp câu "${card.key}"!`, "success");
    } else {
      showToast(`"${card.key}" không còn trong bể FSRS.`, "info");
    }
  } else {
    const pool = fsrsPool.vocab;
    if (pool[card.key] && !pool[card.key].deleted) {
      softDeleteFsrsItem('vocab', card.key, 'graduated');
      touch();
      saveAllData();
      updateBadges();
      showToast(`🎓 Đã tốt nghiệp "${card.key}" và đuổi khỏi bể FSRS!`, "success");
    } else {
      showToast(`"${card.key}" không còn trong bể FSRS.`, "info");
    }
  }

  currentFlashcardIndex++;
  loadFlashcard(currentFlashcardIndex);
}

async function handleFsrsResponse(rating) {
  if (!activeFlashcardItem) return;
  const card = activeFlashcardItem;
  const isGrammar = card.type === 'grammar';
  const isSentence = card.type === 'sentence';
  const poolObj = isGrammar ? grammarFsrsPool[card.key]
                : isSentence ? sentenceFsrsPool[card.key]
                : fsrsPool.vocab[card.key];
  const now = Date.now();

  if (poolObj) {
    if (rating === 1) {
      poolObj.streak = 0;
      poolObj.interval = 0.01;
      poolObj.nextReview = now + 10 * 60 * 1000;
      showToast(`Đã ghi nhận Quên. Chuỗi reset về 0.`, "warning");
    } else {
      poolObj.streak = (poolObj.streak || 0) + 1;
      const multiplier = rating === 2 ? 1.4 : (rating === 3 ? 2.2 : 3.0);
      poolObj.interval = Math.max(1, Math.round((poolObj.interval || 1) * multiplier));
      poolObj.nextReview = now + poolObj.interval * 24 * 60 * 60 * 1000;
      const targetSteps = fsrsConfig.fsrsSteps || 4;
      const isInfinite = targetSteps >= 999;
      if (!isInfinite && poolObj.streak >= targetSteps) {
        if (isGrammar) softDeleteGrammarFsrs(card.key, 'graduated');
        else if (isSentence) softDeleteSentenceFsrs(card.key, 'graduated');
        else softDeleteFsrsItem('vocab', card.key, 'graduated');
        showToast(`🎉 "${card.key}" đã đạt ${targetSteps} lần liên tiếp và TỐT NGHIỆP!`, "success");
        touch();
        await saveAllData();
        updateBadges();
        currentFlashcardIndex++;
        loadFlashcard(currentFlashcardIndex);
        return;
      } else {
        const totalLabel = isInfinite ? '∞' : targetSteps;
        showToast(`Nhớ tốt! Tiến độ: ${poolObj.streak} / ${totalLabel} lần.`, "success");
      }
    }
    poolObj.lastReview = now;
    poolObj.updatedAt = now;
  }
  touch();
  await saveAllData();
  currentFlashcardIndex++;
  loadFlashcard(currentFlashcardIndex);
}