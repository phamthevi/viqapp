/* ============================================================
 * FILE: 03-state.js
 * DOMAIN: Toàn bộ biến global state
 * DEPENDS: 00-config.js
 * ============================================================ */

let dbInstance = null;

let docs = [];
let folders = [];
let activeFolderFilter = 'none';
let vocabDb = {};
let statusDb = { vocab: {} };
let activeDocId = null;
let showPinyinRuby = false;
let readerFontSize = 24;
let highlightMode = 'vocab';
let isZenMode = false;
let currentScanType = 'vocab';
let currentImportTarget = 'vocab';
let currentOpenKey = '';
let pageSize = 1000;
let currentPage = 1;
let paginatedDoc = null;
let bookmarks = {};
let includeHiddenInStats = true;

let fsrsPool = { vocab: {} };
let fsrsConfig = { ...DEFAULT_FSRS_CONFIG };
let statusTimestamps = { vocab: {} };
let localLastModified = 0;

let isTestActive = false;
let testSessionLookups = { words: new Set(), manualMarkedKnown: new Set() };

let vcRankList = [];
let totalVcOccurrences = 0;
let vcHideKnown = false;
let vcRankOffset = 1;
let vcShowAllRanks = false;
let vcDisplayLimit = 50;

let currentRankExportFilteredList = [];
let currentFlashcardDeck = [];
let currentFlashcardIndex = 0;
let activeFlashcardItem = null;
let savedFirebaseConfig = null;
let currentMissingList = [];
let patternPreferences = {};

// ==================== GRAMMAR ENGINE STATE ====================
let grammarDb = { _aliasGroups: {}, _patterns: {} };
let grammarAnchorIndex = {};
let grammarExpandedList = [];

// STATE CHO GHÉP NEO
let isStructureSelectMode = false;
let selectedStructureTokens = [];
let structureAnchors = [];

// GRAMMAR FSRS POOL
let grammarFsrsPool = {};

// SENTENCE MINING
let sentenceDb = {};
let sentenceFsrsPool = {};
let useSentenceFullContext = true;

// SYNC
let lastSyncedAt = 0;

// FLASHCARD SWIPE STATE
let lastSwipeTime = 0;
let swipeState = {
  active: false, startX: 0, startY: 0, currentX: 0, currentY: 0,
  pointerId: null, isAnimating: false, isLocked: false
};
const SWIPE_THRESHOLD_X = 90;
const SWIPE_THRESHOLD_Y = 110;

// TOAST
let toastTimeout = null;

// DOCS TREE DRAG
let draggedDocId = null;

// AI SCAN OPTIONS
let useFullSurroundingContext = false;
let customGrammarPromptTemplate = localStorage.getItem('custom_grammar_prompt_tpl') || '';