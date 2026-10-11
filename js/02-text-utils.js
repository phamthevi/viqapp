/* ============================================================
 * FILE: 02-text-utils.js
 * DOMAIN: Tokenizer, cleaner, stemming, tần suất, tiện ích câu
 * DEPENDS: 00-config, 03-state
 * ============================================================ */

function tokenizeEnglishText(text) {
  if (!text) return [];
  const normalized = text.replace(/[\u2012\u2013\u2014\u2015\u2212\uFE58\uFE63\uFF0D]/g, ' $& ');
  const tokenRegex = /[A-Za-z]+(?:['’-][A-Za-z]+)*|[0-9]+|[^\sA-Za-z0-9]/g;
  return normalized.match(tokenRegex) || [];
}

function cleanEnglishWord(token) {
  if (!token) return '';
  return (token || '').replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '').toLowerCase();
}

function isEnglishWord(token) {
  const cleaned = cleanEnglishWord(token);
  return cleaned.length > 0 && /^[a-z]+(?:['’-][a-z]+)*$/.test(cleaned);
}

// Alias để code cũ chạy
const isChineseWord = isEnglishWord;
const cleanChineseWord = cleanEnglishWord;

function splitIntoSentences(content) {
  if (!content) return [];
  const marked = content.replace(/([.!?\n])/g, '$1\u0001');
  return marked.split('\u0001').map(s => s.trim()).filter(s => s.length > 0);
}

function getSurroundingSentences(currentDoc, lineIdx) {
  if (!currentDoc || !currentDoc.content) return { current: '', prev: '', next: '', fullContext: '' };
  const lines = currentDoc.content.split('\n').map(l => l.trim()).filter(Boolean);
  const current = lines[lineIdx] || '';
  const prev = lineIdx > 0 ? lines[lineIdx - 1] : '';
  const next = lineIdx < lines.length - 1 ? lines[lineIdx + 1] : '';
  return {
    current,
    prev,
    next,
    fullContext: [prev, current, next].filter(Boolean).join(' ')
  };
}

// ==================== FREQUENCY CALCULATION ====================
function calculateFrequencies() {
  const targetDocs = includeHiddenInStats ? docs : docs.filter(d => !d.hidden);
  const combinedContent = targetDocs.map(d => d.content).join(' ');

  const words = tokenizeEnglishText(combinedContent);
  const vcCounts = {};
  let validWordTokenCount = 0;
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned && cleaned.length > 0) {
      validWordTokenCount++;
      vcCounts[cleaned] = (vcCounts[cleaned] || 0) + 1;
    }
  });
  totalVcOccurrences = validWordTokenCount;
  Object.keys(vocabDb).forEach(w => {
    const key = w.toLowerCase();
    if (vcCounts[key] === undefined) vcCounts[key] = 0;
  });

  vcRankList = Object.keys(vcCounts).map(word => ({
    word, count: vcCounts[word],
    frequency: totalVcOccurrences > 0 ? ((vcCounts[word] / totalVcOccurrences) * 100) : 0
  }));
  vcRankList.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
  vcRankList.forEach((item, idx) => { item.rank = idx + 1; });
}

function getItemRank(type, key) {
  const k = (key || '').toLowerCase();
  const found = vcRankList.find(x => x.word === k);
  return found ? found.rank : 9999;
}

function getCandidateBaseWords(word) {
  if (!word) return [];
  const w = word.toLowerCase().trim();
  const candidates = new Set();

  const noPossessive = w.replace(/['’]s$/i, '').replace(/['’]$/i, '');
  if (noPossessive !== w) candidates.add(noPossessive);

  if (w.endsWith('ies') && w.length > 4) {
    candidates.add(w.slice(0, -3) + 'y');
    candidates.add(w.slice(0, -3) + 'ie');
  }
  if (w.endsWith('es') && w.length > 3) {
    candidates.add(w.slice(0, -2));
    candidates.add(w.slice(0, -1));
  }
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 2) {
    candidates.add(w.slice(0, -1));
  }
  if (w.endsWith('ing') && w.length > 4) {
    const stem = w.slice(0, -3);
    candidates.add(stem);
    candidates.add(stem + 'e');
    if (stem.length > 2 && stem[stem.length - 1] === stem[stem.length - 2]) {
      candidates.add(stem.slice(0, -1));
    }
  }
  if (w.endsWith('ed') && w.length > 3) {
    if (w.endsWith('ied') && w.length > 4) {
      candidates.add(w.slice(0, -3) + 'y');
    }
    candidates.add(w.slice(0, -1));
    candidates.add(w.slice(0, -2));
    const stem = w.slice(0, -2);
    if (stem.length > 2 && stem[stem.length - 1] === stem[stem.length - 2]) {
      candidates.add(stem.slice(0, -1));
    }
  }
  if (w.endsWith('ly') && w.length > 3) {
    candidates.add(w.slice(0, -2));
    if (w.endsWith('ily')) candidates.add(w.slice(0, -3) + 'y');
  }
  if (w.endsWith('er') && w.length > 3) {
    candidates.add(w.slice(0, -2));
    candidates.add(w.slice(0, -1));
  }
  if (w.endsWith('est') && w.length > 4) {
    candidates.add(w.slice(0, -3));
    candidates.add(w.slice(0, -2));
  }

  return Array.from(candidates);
}

function findFuzzyMatchWord(word) {
  if (!word || word.length < 4) return null;
  const w = word.toLowerCase();
  const keys = Object.keys(vocabDb);

  let bestMatch = null;
  let maxCommonPrefix = 0;

  for (const k of keys) {
    let common = 0;
    const minLen = Math.min(w.length, k.length);
    while (common < minLen && w[common] === k[common]) common++;

    if (common >= 4 && common > maxCommonPrefix && (common / w.length) >= 0.65) {
      maxCommonPrefix = common;
      bestMatch = k;
    }
  }
  return bestMatch;
}

function getVocabEntry(word) {
  if (!word) return null;
  const key = word.toLowerCase().trim();

  if (vocabDb[key]) return { ...vocabDb[key], matchWord: key, isDirect: true };
  if (vocabDb[word]) return { ...vocabDb[word], matchWord: word, isDirect: true };

  const candidates = getCandidateBaseWords(key);
  for (const cand of candidates) {
    if (vocabDb[cand]) {
      return { ...vocabDb[cand], matchWord: cand, isBaseForm: true, queryWord: key };
    }
  }

  const fuzzy = findFuzzyMatchWord(key);
  if (fuzzy && vocabDb[fuzzy]) {
    return { ...vocabDb[fuzzy], matchWord: fuzzy, isFuzzy: true, queryWord: key };
  }

  return null;
}