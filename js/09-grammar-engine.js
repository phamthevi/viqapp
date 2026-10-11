/* ============================================================
 * FILE: 09-grammar-engine.js
 * DOMAIN: Grammar DB normalization, index, detect, match
 * DEPENDS: 00-config, 02-text-utils, 03-state
 * ============================================================ */

function normalizeGrammarDb(raw) {
  if (!raw || typeof raw !== 'object') {
    return { _aliasGroups: {}, _patterns: {} };
  }
  if (!raw._patterns && !raw._aliasGroups) {
    const patterns = {};
    Object.keys(raw).forEach(k => {
      if (raw[k] && typeof raw[k] === 'object') patterns[k] = raw[k];
    });
    return { _aliasGroups: {}, _patterns: patterns };
  }
  return {
    _aliasGroups: raw._aliasGroups || {},
    _patterns: raw._patterns || {}
  };
}

function resolveGroupOrToken(groupOrToken) {
  if (groupOrToken == null) return [];
  if (Array.isArray(groupOrToken)) return groupOrToken;
  const groups = grammarDb._aliasGroups || {};
  if (groups[groupOrToken]) return groups[groupOrToken];
  if (typeof groupOrToken === 'string') return [groupOrToken];
  return [];
}

function registerGrammarAnchor(token, patternId) {
  if (!token) return;
  const words = token.trim().toLowerCase().split(/\s+/).filter(Boolean);
  words.forEach(w => {
    if (!grammarAnchorIndex[w]) grammarAnchorIndex[w] = [];
    if (!grammarAnchorIndex[w].includes(patternId)) {
      grammarAnchorIndex[w].push(patternId);
    }
  });
  if (words.length > 1) {
    const lowerToken = token.trim().toLowerCase();
    if (!grammarAnchorIndex[lowerToken]) grammarAnchorIndex[lowerToken] = [];
    if (!grammarAnchorIndex[lowerToken].includes(patternId)) {
      grammarAnchorIndex[lowerToken].push(patternId);
    }
  }
}

function rebuildGrammarIndex() {
  grammarAnchorIndex = {};
  grammarExpandedList = [];
  const patterns = grammarDb._patterns || {};

  for (const [patternId, p] of Object.entries(patterns)) {
    if (!p || typeof p !== 'object') continue;

    const expanded = {
      patternId,
      type: p.type || 'pair',
      meaning: p.meaning || '',
      notes: p.notes || '',
      level: p.level || '',
      priority: p.priority || 0,
      examples: p.examples || [],
      leftTokens: [],
      rightTokens: [],
      anchorTokens: [],
      chainTokens: []
    };

    if (expanded.type === 'pair') {
      const leftSrc  = p.leftGroup  != null ? p.leftGroup  : p.left;
      const rightSrc = p.rightGroup != null ? p.rightGroup : p.right;
      expanded.leftTokens  = resolveGroupOrToken(leftSrc).filter(Boolean);
      expanded.rightTokens = resolveGroupOrToken(rightSrc).filter(Boolean);
      if (expanded.leftTokens.length === 0 || expanded.rightTokens.length === 0) {
        console.warn(`[Grammar] Pattern "${patternId}" thiếu left/right hợp lệ.`);
        continue;
      }
      expanded.leftTokens.forEach(t  => registerGrammarAnchor(t, patternId));
      expanded.rightTokens.forEach(t => registerGrammarAnchor(t, patternId));

    } else if (expanded.type === 'single') {
      const anchorSrc = p.anchorGroup != null ? p.anchorGroup
                       : p.anchor      != null ? p.anchor
                       : p.anchors;
      expanded.anchorTokens = resolveGroupOrToken(anchorSrc).filter(Boolean);
      if (expanded.anchorTokens.length === 0) {
        console.warn(`[Grammar] Pattern "${patternId}" (single) thiếu anchor.`);
        continue;
      }
      expanded.anchorTokens.forEach(t => registerGrammarAnchor(t, patternId));

    } else if (expanded.type === 'chain') {
      const chainSrc = p.chain || [];
      expanded.chainTokens = chainSrc.map(seg => resolveGroupOrToken(seg)).filter(a => a.length > 0);
      if (expanded.chainTokens.length < 2) {
        console.warn(`[Grammar] Pattern "${patternId}" (chain) cần >=2 neo.`);
        continue;
      }
      expanded.chainTokens[0].forEach(t => registerGrammarAnchor(t, patternId));
    } else {
      continue;
    }

    grammarExpandedList.push(expanded);
  }

  console.log(`[Grammar] Build: ${grammarExpandedList.length} pattern, ${Object.keys(grammarAnchorIndex).length} anchor.`);
}

function detectGrammarInSentence(tokens) {
  if (!tokens?.length) return [];
  if (grammarExpandedList.length === 0) return [];

  const candidateIds = new Set();
  for (const tok of tokens) {
    const cleanTok = cleanEnglishWord(tok);
    const ids = grammarAnchorIndex[cleanTok];
    if (ids) ids.forEach(id => candidateIds.add(id));
  }
  if (candidateIds.size === 0) return [];

  const allMatches = [];
  for (const pid of candidateIds) {
    const pattern = grammarExpandedList.find(p => p.patternId === pid);
    if (!pattern) continue;
    allMatches.push(...matchPattern(tokens, pattern));
  }

  return allMatches.sort((a, b) => a.start - b.start);
}

function findAnchorPhraseInTokens(tokens, anchorPhrase) {
  const words = anchorPhrase.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  for (let i = 0; i <= tokens.length - words.length; i++) {
    const allMatch = words.every((w, k) =>
      cleanEnglishWord(tokens[i + k]) === w
    );
    if (allMatch) {
      return { start: i, end: i + words.length - 1 };
    }
  }
  return null;
}

function matchPattern(tokens, pattern) {
  const matches = [];

  if (pattern.type === 'single') {
    for (let i = 0; i < tokens.length; i++) {
      for (const anchor of pattern.anchorTokens) {
        const hit = findAnchorPhraseInTokens(tokens.slice(i), anchor);
        if (!hit || hit.start !== 0) continue;

        let end = i + hit.end;
        while (end + 1 < tokens.length && !/[.!?]/.test(tokens[end + 1])) end++;

        matches.push({
          patternId: pattern.patternId,
          start: i,
          end,
          tokens: tokens.slice(i, end + 1),
          meta: pattern
        });
      }
    }
    return matches;
  }

  const requiredGroups = [];
  if (pattern.leftTokens.length > 0)  requiredGroups.push(pattern.leftTokens);
  if (pattern.rightTokens.length > 0) requiredGroups.push(pattern.rightTokens);
  pattern.chainTokens.forEach(seg => requiredGroups.push(seg));

  const foundHits = [];
  let allGroupsFound = true;

  for (const group of requiredGroups) {
    let hit = null;
    for (const anchor of group) {
      const found = findAnchorPhraseInTokens(tokens, anchor);
      if (found) { hit = found; break; }
    }
    if (!hit) { allGroupsFound = false; break; }
    foundHits.push(hit);
  }
  if (!allGroupsFound) return matches;

  const start = Math.min(...foundHits.map(h => h.start));
  let end = Math.max(...foundHits.map(h => h.end));
  while (end + 1 < tokens.length && !/[.!?]/.test(tokens[end + 1])) end++;

  matches.push({
    patternId: pattern.patternId,
    start,
    end,
    tokens: tokens.slice(start, end + 1),
    meta: pattern
  });

  return matches;
}

function detectGrammarForDoc(content) {
  const matchesByLine = {};
  const tokensByLine = {};
  if (!content) return { matchesByLine, tokensByLine };
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) { tokensByLine[idx] = []; matchesByLine[idx] = []; return; }
    const tokens = tokenizeEnglishText(trimmed);
    tokensByLine[idx] = tokens;
    matchesByLine[idx] = detectGrammarInSentence(tokens);
  });
  return { matchesByLine, tokensByLine };
}

// ==================== GRAMMAR ID GENERATOR ====================
function generateGrammarId() {
  const existing = grammarDb._patterns || {};
  let id;
  let attempts = 0;
  const MAX_ATTEMPTS = 100;

  do {
    const num = Math.floor(Math.random() * 9999) + 1;
    id = 'G' + String(num).padStart(4, '0');
    attempts++;
    if (attempts > MAX_ATTEMPTS) {
      id = 'G' + Date.now().toString().slice(-6);
      break;
    }
  } while (existing[id] !== undefined);

  return id;
}

// ==================== GRAMMAR DISPLAY HELPERS ====================
function renderAnchorDisplayShort(meta) {
  if (!meta) return '(chưa có neo)';
  const groups = grammarDb._aliasGroups || {};

  const joinTokens = (tokens) => {
    if (!Array.isArray(tokens) || tokens.length === 0) return '';
    return tokens.join(' / ');
  };

  if (meta.type === 'pair') {
    const L = joinTokens(meta.leftTokens);
    const R = joinTokens(meta.rightTokens);
    if (L && R) return `${L} ... ${R}`;
    if (L) return L;
    if (R) return R;
  }
  if (meta.type === 'single') {
    const A = joinTokens(meta.anchorTokens);
    if (A) return A;
  }
  if (meta.type === 'chain') {
    const segs = (meta.chainTokens || [])
      .map(seg => Array.isArray(seg) ? seg.join(' / ') : String(seg))
      .filter(Boolean);
    if (segs.length > 0) return segs.join(' ... ');
  }

  const dbPattern = grammarDb._patterns[meta.patternId];
  if (dbPattern) {
    const resolveList = (groupName, tokenArr) => {
      if (groupName && groups[groupName]) return groups[groupName].join(' / ');
      if (Array.isArray(tokenArr) && tokenArr.length > 0) return tokenArr.join(' / ');
      return '';
    };
    if (dbPattern.type === 'pair') {
      const L = resolveList(dbPattern.leftGroup, dbPattern.left);
      const R = resolveList(dbPattern.rightGroup, dbPattern.right);
      if (L || R) return `${L} ... ${R}`;
    } else if (dbPattern.type === 'single') {
      const A = resolveList(dbPattern.anchorGroup, dbPattern.anchor);
      if (A) return A;
    } else if (dbPattern.type === 'chain') {
      const segs = (dbPattern.chain || []).map(seg => {
        if (Array.isArray(seg)) return seg.join(' / ');
        if (groups[seg]) return groups[seg].join(' / ');
        return seg;
      }).filter(Boolean);
      if (segs.length > 0) return segs.join(' ... ');
    }
  }

  return '(chưa có neo)';
}

function getGrammarPatternDisplay(p) {
  const groups = grammarDb._aliasGroups || {};
  if (!p) return '';
  if (p.type === 'pair') {
    const L = p.leftGroup ? (groups[p.leftGroup] || []).join(' / ')
            : p.left ? p.left.join(' / ') : '';
    const R = p.rightGroup ? (groups[p.rightGroup] || []).join(' / ')
            : p.right ? p.right.join(' / ') : '';
    return `${L} ... ${R}`;
  } else if (p.type === 'single') {
    return p.anchorGroup ? (groups[p.anchorGroup] || []).join(' / ')
         : p.anchor ? p.anchor.join(' / ') : '';
  } else if (p.type === 'chain') {
    return (p.chain || []).map(seg =>
      Array.isArray(seg) ? seg.join(' / ')
      : (groups[seg] ? groups[seg].join(' / ') : seg)
    ).join(' ... ');
  }
  return '';
}