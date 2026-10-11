]633;E;for f in index.html js/*.js;6d3682da-0a97-470c-962c-4bd69b78d644]633;C
```javascript: index.html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>EnglishRead - Luyện Đọc Tiếng Anh & Thẩm Định Củng Cố FSRS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="EnglishRead">
  <link rel="manifest" href="manifest.json">
  <link rel="apple-touch-icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' rx='32' fill='%23e11d48'/%3E%3Ctext x='96' y='130' font-size='100' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='bold'%3EEN%3C/text%3E%3C/svg%3E">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            english: ['Merriweather', 'Georgia', 'serif'],
            englishSans: ['Inter', 'system-ui', 'sans-serif']
          },
          colors: {
            crimson: { 50:'#fff1f2',100:'#ffe4e6',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239',900:'#881337' }
          }
        }
      }
    }
  </script>
  <style>
    .lingq-level-1 { background-color: #fef08a !important; border-bottom: 2px solid #eab308 !important; }
    .lingq-level-2 { background-color: #fed7aa !important; border-bottom: 2px solid #f97316 !important; }
    .lingq-level-3 { background-color: #bbf7d0 !important; border-bottom: 2px solid #22c55e !important; }
    .lingq-level-4 { background-color: transparent !important; border-bottom-color: transparent !important; }
    .word-unit { display: inline-flex; align-items: baseline; margin: 0.15rem 0.05rem; padding: 0.12rem 0.25rem; border-radius: 0.375rem; transition: all 0.15s ease; cursor: pointer; user-select: none; -webkit-user-select: none; border-bottom: 2px solid transparent; }
    .word-unit:hover { filter: brightness(0.93); }
    .char-unit { display: inline-block; padding: 0 0.08rem; border-radius: 0.25rem; transition: background-color 0.12s ease; border-bottom: 2px solid transparent; }
    .char-unit:hover { filter: brightness(0.88); outline: 1px solid rgba(0,0,0,0.15); }
    .needs-data { text-decoration: underline wavy #f59e0b 1.5px; }
    .pressing { transform: scale(0.95); filter: brightness(0.85) !important; transition: transform 0.15s ease; }
    .in-test-mode .word-unit { border: 1px dashed rgba(0,0,0,0.15); }
    .test-looked-up { outline: 2px solid #e11d48 !important; background-color: #ffe4e6 !important; }
    body.zen-active { background-color: #fbfbfa; }
    body.zen-active #main-app-header, body.zen-active #reader-controls-bar, body.zen-active #test-mode-banner { display: none !important; }
    body.zen-active main { padding-top: 1.5rem; max-width: 56rem; }
    body.zen-active #reader-card-wrapper { box-shadow: none !important; border-color: transparent !important; background-color: transparent !important; padding-left: 0.5rem; padding-right: 0.5rem; }
    #zen-floating-toggle { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
    #zen-floating-toggle:hover { transform: scale(1.05); }
    .flip-card { perspective: 1000px; }
    .flip-card-inner { transition: transform 0.5s; transform-style: preserve-3d; }
    .flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
    .flip-card-front, .flip-card-back { 
      backface-visibility: hidden; 
      -webkit-backface-visibility: hidden; 
      touch-action: pan-y;
    }
    .flip-card-back { 
      transform: rotateY(180deg); 
      overscroll-behavior: contain;
    }
    .grammar-unit {
      display: inline-flex; align-items: baseline; flex-wrap: wrap;
      padding: 0.1rem 0.35rem; margin: 0 0.05rem;
      border-radius: 0.5rem;
      background: rgba(168, 85, 247, 0.10);
      border-bottom: 2px dashed rgba(168, 85, 247, 0.55);
      cursor: pointer;
      transition: background 0.15s ease, border-color 0.15s ease;
      position: relative;
    }
    .grammar-unit:hover { background: rgba(168, 85, 247, 0.22); border-bottom-color: rgba(168, 85, 247, 0.9); }
    .grammar-unit .word-unit { margin: 0 0.1rem; padding: 0.05rem 0.15rem; }
    .grammar-mode-active .word-unit, .grammar-mode-active .char-unit {
      background-color: transparent !important; border-bottom-color: transparent !important;
    }
    
    .grammar-unit {
      position: relative;
    }
    .grammar-unit[data-pattern-count]:not([data-pattern-count="1"]) {
      background: linear-gradient(
        135deg,
        rgba(168, 85, 247, 0.15) 0%,
        rgba(168, 85, 247, 0.15) 50%,
        rgba(99, 102, 241, 0.15) 50%,
        rgba(99, 102, 241, 0.15) 100%
      ) !important;
      border-bottom-style: double !important;
      border-bottom-width: 3px !important;
      border-bottom-color: rgba(147, 51, 234, 0.8) !important;
    }
    .grammar-count-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: linear-gradient(135deg, #9333ea, #6366f1);
      color: white;
      font-size: 9px;
      font-weight: 800;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(147, 51, 234, 0.5);
      pointer-events: none;
      font-family: 'Inter', sans-serif;
      line-height: 1;
    }
    .grammar-unit::after {
      content: attr(data-pattern-label);
      position: absolute; top: -1.5rem; left: 0;
      background: rgba(88, 28, 135, 0.95); color: #fff;
      font-size: 10px; font-family: 'Inter', sans-serif;
      padding: 0.15rem 0.45rem; border-radius: 0.35rem;
      white-space: nowrap; pointer-events: none;
      opacity: 0; transform: translateY(4px);
      transition: opacity 0.15s, transform 0.15s;
      z-index: 40; max-width: 320px; overflow: hidden; text-overflow: ellipsis;
    }
    .grammar-unit:hover::after { opacity: 1; transform: translateY(0); }
    .word-unit.struct-selected {
      outline: 2px solid #9333ea !important;
      background-color: #f3e8ff !important;
      color: #581c87 !important;
      font-weight: 800 !important;
      transform: scale(1.05);
    }
        .word-unit.struct-anchored {
      outline: 2px dashed #9333ea !important;
      background-color: #f3e8ff !important;
      color: #581c87 !important;
      font-weight: 700 !important;
    }
    .pagination-bar {
      display: flex; align-items: center; justify-content: center;
      gap: 0.5rem; flex-wrap: wrap;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #e7e5e4; border-radius: 1rem;
      margin-bottom: 1rem; backdrop-filter: blur(8px);
    }
    .pagination-bar.sticky-pagination { position: sticky; top: 0; z-index: 20; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .page-btn {
      min-width: 2rem; height: 2rem; padding: 0 0.6rem;
      border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700;
      border: 1px solid #e7e5e4; background: #fff; color: #57534e;
      cursor: pointer; transition: all 0.15s ease;
    }
    .page-btn:hover:not(:disabled) { background: #f5f5f4; color: #1c1917; }
    .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .page-btn.active { background: #e11d48; color: #fff; border-color: #e11d48; box-shadow: 0 2px 6px rgba(225,29,72,0.3); }
    .page-btn.bookmark-active { background: #f59e0b; color: #fff; border-color: #f59e0b; }
    #bookmark-floating-btn {
      position: fixed; right: 1.25rem; bottom: 5rem; z-index: 45;
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.6rem 0.9rem;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #fff; border: none; border-radius: 999px;
      font-size: 0.75rem; font-weight: 700;
      box-shadow: 0 6px 16px rgba(217,119,6,0.4);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
      opacity: 0; pointer-events: none; transform: translateY(10px);
    }
    #bookmark-floating-btn.visible { opacity: 1; pointer-events: auto; transform: translateY(0); }
    #bookmark-floating-btn:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 10px 20px rgba(217,119,6,0.5); }
    #bookmark-floating-btn .bm-label { max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .word-unit.bookmark-highlight { animation: bmPulse 2s ease-in-out infinite; }
    @keyframes bmPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.7); }
      50% { box-shadow: 0 0 0 6px rgba(245,158,11,0); }
    }
    #flashcard-element { touch-action: none; will-change: transform; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease; }
    body.flashcard-open { overflow: hidden !important; touch-action: none !important; overscroll-behavior: none !important; }
    #flashcard-element.swiping { transition: none; }
    #flashcard-element.swipe-left { transform: translateX(-120%) rotate(-20deg); opacity: 0; }
    #flashcard-element.swipe-right { transform: translateX(120%) rotate(20deg); opacity: 0; }
    #flashcard-element.swipe-up { transform: translateY(-120%) scale(0.9); opacity: 0; }
    .swipe-indicator { position: absolute; top: 1.5rem; padding: 0.5rem 1rem; border-radius: 999px; font-weight: 800; font-size: 0.9rem; letter-spacing: 0.05em; opacity: 0; transition: opacity 0.15s ease; pointer-events: none; z-index: 10; }
    .swipe-indicator.forgot { left: 1.5rem; background: rgba(225, 29, 72, 0.95); color: #fff; border: 2px solid #fecdd3; }
    .swipe-indicator.known { right: 1.5rem; background: rgba(5, 150, 105, 0.95); color: #fff; border: 2px solid #a7f3d0; }
    .swipe-indicator.graduate { left: 50%; transform: translateX(-50%); top: 1.5rem; background: rgba(217, 119, 6, 0.95); color: #fff; border: 2px solid #fde68a; }
    .swipe-hint { position: absolute; bottom: 0.75rem; left: 50%; transform: translateX(-50%); font-size: 10px; color: #a8a29e; background: rgba(255,255,255,0.9); padding: 0.25rem 0.75rem; border-radius: 999px; white-space: nowrap; pointer-events: none; z-index: 5; font-weight: 600; }
    body {
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
    .english-article { font-family: 'Merriweather', Georgia, serif; letter-spacing: 0.01em; line-height: 1.8; }
    .english-article .word-unit { font-family: 'Merriweather', Georgia, serif; }
        /* Ẩn khung "Ngữ cảnh" khi là Sentence flashcard */
    #flashcard-element.fc-sentence-mode .fc-sentence-context-box {
      display: none !important;
    }

  </style>
</head>
<body class="bg-stone-50 text-stone-800 min-h-screen flex flex-col font-sans transition-colors duration-200">

  <!-- FLOATING BOOKMARK BUTTON -->
  <button id="bookmark-floating-btn" onclick="jumpToBookmark()" title="Nhảy tới vị trí đánh dấu">
    <span>📍</span>
    <span class="bm-label" id="bm-label-text">Bookmark</span>
    <span onclick="event.stopPropagation(); clearBookmark();" title="Xóa bookmark" class="ml-1 text-white/70 hover:text-white font-bold text-base leading-none px-1">×</span>
  </button>

    <!-- FLOATING HIGHLIGHT MODE TOGGLE -->
  <button id="floating-highlight-toggle" 
          onclick="toggleHighlightMode()"
          class="fixed top-20 right-5 z-40 bg-white/95 backdrop-blur-md hover:bg-white text-stone-800 shadow-lg border border-stone-200 px-3.5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95">
    <span id="floating-hl-icon">📑</span>
    <span id="floating-hl-text">Từ vựng</span>
  </button>

  <header id="main-app-header" class="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm transition-all duration-200">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <span class="w-10 h-10 rounded-xl bg-gradient-to-tr from-crimson-800 to-crimson-600 flex items-center justify-center text-white font-sans text-lg font-black shadow-md shadow-crimson-900/20">EN</span>
        <div>
          <h1 class="font-bold text-lg text-stone-900 tracking-tight leading-none flex items-center gap-2">
            EnglishRead
            <span class="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full">FSRS 3.0</span>
          </h1>
          <p class="text-xs text-stone-500 mt-0.5">Luyện đọc • Thẩm định bài đọc • Củng cố giãn cách</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <nav class="hidden sm:flex items-center bg-stone-100 p-1 rounded-xl text-sm font-medium">
          <button onclick="switchTab('reader')" id="tab-btn-reader" class="px-3.5 py-1.5 rounded-lg transition-all duration-150 bg-white text-crimson-600 font-bold shadow-sm">📖 Đọc bài</button>
          <button onclick="switchTab('review')" id="tab-btn-review" class="px-3.5 py-1.5 rounded-lg transition-all duration-150 text-stone-600 hover:text-stone-900 flex items-center gap-1.5">
            <span>🎯</span> Củng cố FSRS
            <span id="nav-due-badge" class="hidden px-1.5 py-0.2 text-[10px] bg-crimson-600 text-white font-bold rounded-full">0</span>
          </button>
          <button onclick="switchTab('docs')" id="tab-btn-docs" class="px-3.5 py-1.5 rounded-lg transition-all duration-150 text-stone-600 hover:text-stone-900">📚 Tài liệu</button>
          <button onclick="switchTab('vocab')" id="tab-btn-vocab" class="px-3.5 py-1.5 rounded-lg transition-all duration-150 text-stone-600 hover:text-stone-900">📑 Từ vựng</button>
          <button onclick="switchTab('grammar')" id="tab-btn-grammar" class="px-3.5 py-1.5 rounded-lg transition-all duration-150 text-stone-600 hover:text-stone-900 flex items-center gap-1.5">🟣 Ngữ pháp<span id="grammar-count-badge-nav" class="text-[10px] px-1.5 py-0.2 bg-stone-200 text-stone-600 rounded-full">0</span></button>
                 <button onclick="switchTab('sentence')" id="tab-btn-sentence" class="px-3.5 py-1.5 rounded-lg transition-all duration-150 text-stone-600 hover:text-stone-900 flex items-center gap-1.5">📸 Sentence<span id="sentence-count-badge-nav" class="text-[10px] px-1.5 py-0.2 bg-stone-200 text-stone-600 rounded-full">0</span></button>
        </nav>
        <button onclick="openBackupModal()" title="Sao lưu hoặc phục hồi dữ liệu" class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition">
          <svg class="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
          Sao lưu
        </button>
        <input type="file" id="backup-file-input" accept=".json" class="hidden" onchange="handleRestoreFile(event)">
      </div>
    </div>
  </header>

  <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-6 pb-20 sm:pb-6">
    <section id="view-reader" class="space-y-4">
      <div id="test-mode-banner" class="hidden bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white p-4 rounded-2xl shadow-md border border-rose-900/60 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
          <div>
            <h3 class="text-sm font-bold flex items-center gap-2">
              <span>🎯 Đang thẩm định bài đọc</span>
              <span id="test-badge-type" class="text-[10px] bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded-full border border-rose-500/40">Lần đầu</span>
            </h3>
            <p class="text-xs text-rose-200/80">Bấm tra cứu các từ chưa nhớ để ghi nhận củng cố.</p>
          </div>
        </div>
        <div class="flex items-center flex-wrap gap-4 text-xs">
          <div class="bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-3">
            <div><span class="text-stone-400 block text-[10px] uppercase">Từ tra cứu:</span><span id="test-lookup-words-count" class="font-bold text-amber-300 font-mono text-sm">0</span></div>
            <div class="border-l border-white/10 pl-3"><span class="text-stone-400 block text-[10px] uppercase">Khuyết thiếu:</span><span id="test-current-ratio" class="font-bold text-rose-400 font-mono text-sm">0.0%</span></div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="cancelTestMode()" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition">Hủy</button>
            <button onclick="submitPartialTest()" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md transition flex items-center gap-1.5"><span>📝</span> Nộp bài</button>
            <button onclick="finishTestReading()" class="px-4 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold shadow-md transition flex items-center gap-1.5"><span>✔</span> Hoàn thành</button>
          </div>
        </div>
      </div>

      <div id="reader-controls-bar" class="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2">
          <span class="font-bold text-stone-400 uppercase tracking-wider text-[11px]">Bài đọc:</span>
          <button onclick="openSelectDocModal()" id="btn-open-doc-picker" class="flex items-center gap-2 max-w-[220px] sm:max-w-xs bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs sm:text-sm font-semibold rounded-xl px-3 py-1.5 transition text-left shadow-sm group">
            <span class="text-crimson-600 text-base">📖</span>
            <span id="current-doc-btn-title" class="truncate">Chọn bài đọc...</span>
            <svg class="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <button onclick="speakCurrentText()" title="Đọc toàn bộ bài" class="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-crimson-600 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
          </button>
        </div>
        <div class="flex items-center flex-wrap gap-2">
          <button onclick="startTestMode()" id="btn-start-test-mode" class="px-3.5 py-1.5 font-bold rounded-xl bg-gradient-to-r from-rose-600 to-crimson-600 hover:from-rose-700 hover:to-crimson-700 text-white shadow-sm transition flex items-center gap-1.5 active:scale-95">
            <span>🎯</span><span id="btn-start-test-text">Bắt đầu Thẩm định</span>
          </button>
          <div class="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200/80">
            <span class="text-[10px] font-bold text-stone-500 px-2 uppercase">Trang:</span>
            <input type="number" id="page-size-input" min="200" max="5000" step="100" value="1000" onchange="updatePageSize(this.value)" class="w-16 bg-white border border-stone-200 rounded-md px-1.5 py-0.5 text-xs font-mono font-bold text-center focus:ring-2 focus:ring-crimson-600 focus:outline-none">
            <span class="text-[10px] font-bold text-stone-500 px-2">từ/trang</span>
          </div>
          <div class="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200/80">
            <button onclick="adjustFontSize(-2)" class="w-7 h-7 flex items-center justify-center font-bold text-stone-600 hover:text-stone-900 hover:bg-white rounded-md transition text-xs">A-</button>
            <span id="font-size-indicator" class="px-2 font-semibold text-[11px] text-stone-600 select-none min-w-[34px] text-center">24px</span>
            <button onclick="adjustFontSize(2)" class="w-7 h-7 flex items-center justify-center font-bold text-stone-600 hover:text-stone-900 hover:bg-white rounded-md transition text-xs">A+</button>
          </div>
          <button onclick="toggleHighlightMode()" id="btn-toggle-highlight-mode" class="px-3 py-1.5 font-medium rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition flex items-center gap-1.5">
            <span id="highlight-mode-icon">📑</span><span id="highlight-mode-text">Màu: Từ vựng</span>
          </button>
         
          <button onclick="togglePinyinHelper()" id="btn-toggle-pinyin" class="px-3 py-1.5 font-medium rounded-lg border border-stone-200 hover:bg-stone-100 transition">Ẩn/Hiện IPA</button>
          <button onclick="markAllCurrentDocAsKnown()" class="px-3 py-1.5 font-medium rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 border border-stone-200 transition">✔ Thuộc cả bài</button>
          <button onclick="resetCurrentDocToNew()" title="Đánh dấu tất cả từ vựng trong bài này là Mới (trừ mục đang học/sắp thuộc)" class="px-3 py-1.5 font-medium rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 transition flex items-center gap-1.5">🔄 Đánh dấu Mới</button>
          <button onclick="toggleZenMode()" class="px-3 py-1.5 font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 text-white shadow-sm transition flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
            <span>Ẩn taskbar</span>
          </button>
        </div>
      </div>

      <button id="zen-floating-toggle" onclick="toggleZenMode()" class="fixed top-4 right-5 z-50 bg-stone-900/90 hover:bg-stone-900 text-white backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl border border-stone-700 text-xs font-semibold items-center gap-2 transition-all opacity-80 hover:opacity-100 hidden">
        <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        <span>Hiện lại taskbar (ESC)</span>
      </button>

      <div id="reader-card-wrapper" class="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 sm:p-10 min-h-[480px] relative transition-all duration-200">
        <div id="pagination-bar-top" class="pagination-bar sticky-pagination hidden"></div>
        <div class="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
          <h2 id="reader-title" class="text-xl sm:text-2xl font-bold text-stone-900 font-englishSans flex items-center gap-2.5"><span>Tiêu đề bài đọc</span></h2>
          <div class="flex items-center gap-2">
            <span id="doc-test-status-badge" class="hidden text-xs px-2.5 py-1 rounded-full font-bold"></span>
            <span id="reader-status-tag" class="text-xs font-normal text-stone-400 font-sans"></span>
          </div>
        </div>
        <div id="reader-content" class="english-article leading-loose text-2xl text-stone-800 tracking-wide select-none space-y-4"></div>
        <div id="reader-empty" class="hidden flex-col items-center justify-center py-20 text-stone-400">
          <span class="text-5xl mb-3">📄</span>
          <p class="text-stone-600 font-medium">Chưa có bài đọc nào được chọn</p>
          <button onclick="openNewDocModal()" class="mt-4 px-4 py-2 bg-crimson-600 text-white rounded-xl text-sm font-medium">Nạp bài đọc</button>
        </div>
      </div>
      <div id="pagination-bar-bottom" class="pagination-bar mt-4 hidden"></div>
            <!-- FLOATING STRUCTURE TOOLBAR (Luôn bám đáy màn hình) -->
      <div id="floating-struct-toolbar" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-stone-900/95 text-white backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl border border-stone-700 flex items-center gap-3 transition-all duration-200">
        <button id="btn-toggle-struct-mode" onclick="toggleStructureSelectMode()" class="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white transition">
          <span class="text-base">🔗</span>
          <span id="struct-mode-text">Ghép cấu trúc</span>
        </button>
        <div id="struct-action-group" class="hidden items-center gap-2 border-l border-white/20 pl-3">
          <span id="struct-selected-count" class="text-[11px] font-mono text-purple-200">0 từ</span>

          <!-- NÚT MỚI: Gộp neo -->
          <button id="btn-group-anchor" onclick="groupSelectedIntoAnchor()" disabled
                  title="Gộp các từ đang chọn thành 1 neo"
                  class="px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1 opacity-40">
            <span>🔗</span> Gộp neo
          </button>
                    <button id="btn-sentence-mining" onclick="saveSentenceMiningQuick()" disabled
                  title="Tạo Sentence Card từ câu + neo (chống đọc mãi không hiểu)"
                  class="px-3 py-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-full font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1 opacity-40">
            <span>📸</span> Sentence
          </button>

          <button id="btn-save-draft" onclick="saveDraftStructureQuick()" disabled
                  title="Lưu tất cả neo thành cấu trúc chờ AI nạp nghĩa"
                  class="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1 opacity-40">
            <span>⚡</span> Lưu nháp
          </button>

          <button onclick="clearSelectedStructureTokens()" title="Bỏ chọn các từ đang chờ gộp"
                  class="text-stone-400 hover:text-white text-xs px-1.5">✕</button>
          <button onclick="clearAllStructureAnchors()" title="Xóa TẤT CẢ neo đã gộp"
                  class="text-rose-400 hover:text-rose-200 text-xs px-1.5">🗑️</button>
        </div>
      </div>
    </section>

    <section id="view-review" class="hidden space-y-5">
      <div class="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-bold text-stone-900 flex items-center gap-2"><span>🎯</span> Khu vực Củng cố & Luyện tập FSRS</h2>
            <span id="review-total-items-badge" class="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-bold">0 mục</span>
          </div>
          <p class="text-xs text-stone-500 mt-1">Mỗi mục cần <b id="review-steps-label">4 lần liên tiếp</b> nhớ đúng để tốt nghiệp. <button onclick="openFsrsSettingsModal()" class="text-crimson-600 hover:underline font-semibold">Đổi</button></p>
        </div>
        <div class="flex items-center flex-wrap gap-2">
          <button onclick="openFsrsSettingsModal()" class="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 border border-stone-200"><span>⚙️</span> Cài đặt FSRS</button>
          <button onclick="startFlashcardReviewSession()" id="btn-start-flashcard-session" class="px-4 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 active:scale-95"><span>🎴</span> Lướt Flashcard</button>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Cần ôn hôm nay</span><div class="flex items-baseline gap-1.5"><span id="fsrs-stat-due-count" class="text-xl sm:text-2xl font-black text-rose-600">0</span><span class="text-xs text-stone-500">mục</span></div></div>
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Từ vựng củng cố</span><div class="flex items-baseline gap-1.5"><span id="fsrs-stat-hanzi-count" class="text-xl sm:text-2xl font-black text-stone-900">0</span><span class="text-xs text-stone-500">từ</span></div></div>
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Cụm từ củng cố</span><div class="flex items-baseline gap-1.5"><span id="fsrs-stat-vocab-count" class="text-xl sm:text-2xl font-black text-stone-900">0</span><span class="text-xs text-stone-500">cụm</span></div></div>
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Bài đủ điều kiện retest</span><div class="flex items-baseline gap-1.5"><span id="fsrs-stat-ready-docs-count" class="text-xl sm:text-2xl font-black text-emerald-600">0</span><span class="text-xs text-stone-500">bài</span></div></div>
      </div>
           <div class="flex border-b border-stone-200 text-xs font-semibold">
        <button onclick="switchReviewSubTab('hanzi')" id="subtab-review-hanzi" class="py-2.5 px-4 text-crimson-600 border-b-2 border-crimson-600 transition flex items-center gap-1.5 font-bold"><span>📑 Từ đơn</span><span id="badge-subtab-hz" class="px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded-full text-[10px]">0</span></button>
        <button onclick="switchReviewSubTab('vocab')" id="subtab-review-vocab" class="py-2.5 px-4 text-stone-500 hover:text-stone-800 border-b-2 border-transparent transition flex items-center gap-1.5"><span>💬 Cụm từ</span><span id="badge-subtab-vc" class="px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded-full text-[10px]">0</span></button>
        <button onclick="switchReviewSubTab('grammar')" id="subtab-review-grammar" class="py-2.5 px-4 text-stone-500 hover:text-stone-800 border-b-2 border-transparent transition flex items-center gap-1.5"><span>🟣 Ngữ pháp</span><span id="badge-subtab-gm" class="px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded-full text-[10px]">0</span></button>
                <button onclick="switchReviewSubTab('sentence')" id="subtab-review-sentence" class="py-2.5 px-4 text-stone-500 hover:text-stone-800 border-b-2 border-transparent transition flex items-center gap-1.5"><span>📸 Câu</span><span id="badge-subtab-sn" class="px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded-full text-[10px]">0</span></button>
        <button onclick="switchReviewSubTab('docs')" id="subtab-review-docs" class="py-2.5 px-4 text-stone-500 hover:text-stone-800 border-b-2 border-transparent transition flex items-center gap-1.5"><span>📚 Tái thẩm định</span><span id="badge-subtab-docs" class="px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded-full text-[10px]">0</span></button>
      </div>
      <div id="review-subcontent-hanzi" class="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div class="overflow-x-auto max-h-[480px]"><table class="w-full text-left text-sm"><thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium text-xs sticky top-0 z-10"><tr><th class="px-4 py-3 text-center w-16">Rank</th><th class="px-4 py-3">Từ đơn</th><th class="px-4 py-3">Tiến độ</th><th class="px-4 py-3">Trạng thái</th><th class="px-4 py-3">Lần ôn kế</th><th class="px-4 py-3 text-right">Thao tác</th></tr></thead><tbody id="review-hanzi-table-body" class="divide-y divide-stone-100"></tbody></table></div>
      </div>
      <div id="review-subcontent-vocab" class="hidden bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div class="overflow-x-auto max-h-[480px]"><table class="w-full text-left text-sm"><thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium text-xs sticky top-0 z-10"><tr><th class="px-4 py-3 text-center w-16">Rank</th><th class="px-4 py-3">Cụm từ</th><th class="px-4 py-3">Tiến độ</th><th class="px-4 py-3">Trạng thái</th><th class="px-4 py-3">Lần ôn kế</th><th class="px-4 py-3 text-right">Thao tác</th></tr></thead><tbody id="review-vocab-table-body" class="divide-y divide-stone-100"></tbody></table></div>
      </div>
      <div id="review-subcontent-grammar" class="hidden bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden"></div>
            <div id="review-subcontent-grammar" class="hidden bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden"></div>
      <div id="review-subcontent-sentence" class="hidden bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div class="overflow-x-auto max-h-[480px]">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium text-xs sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3">Câu</th>
                <th class="px-4 py-3">Neo</th>
                <th class="px-4 py-3">Tiến độ</th>
                <th class="px-4 py-3">Trạng thái</th>
                <th class="px-4 py-3">Lần ôn kế</th>
                <th class="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody id="review-sentence-table-body" class="divide-y divide-stone-100"></tbody>
          </table>
        </div>
      </div>
      <div id="review-subcontent-docs" class="hidden space-y-3"><div id="ready-retest-docs-list" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div></div>
      <div id="review-subcontent-docs" class="hidden space-y-3"><div id="ready-retest-docs-list" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div></div>
    </section>

    <section id="view-docs" class="hidden space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm">
        <div>
          <h2 class="text-base font-bold text-stone-900 flex items-center gap-2"><span>📁</span> Quản lý Thư mục & Bài đọc</h2>
          <p class="text-xs text-stone-500">Tổ chức bài đọc theo thư mục phân cấp.</p>
        </div>
        <div class="flex items-center flex-wrap gap-2.5">
          <button onclick="copySegmentationPrompt()" class="bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5 border border-amber-200">📋 Prompt chuẩn hóa</button>
          <button onclick="openFolderTreeModal()" class="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5 border border-stone-200">↕️ Xem dạng dọc</button>
          <label class="text-xs text-stone-600 flex items-center gap-1.5 cursor-pointer select-none bg-stone-50 hover:bg-stone-100 px-3 py-2 rounded-xl border border-stone-200">
            <input type="checkbox" id="show-hidden-docs" onchange="renderDocList()" class="rounded text-crimson-600"> Hiện bài ẩn
          </label>
          <button onclick="openFolderEditorModal()" class="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-3.5 py-2 rounded-xl transition border border-stone-200">📁 + Thư mục</button>
          <button onclick="openImportModal('grammar')" class="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition">🟣 Nạp Ngữ pháp</button>
          <button onclick="openNewDocModal()" class="bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition">📄 + Bài đọc</button>
        </div>
      </div>
      <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center flex-wrap gap-1.5" id="folder-breadcrumbs-container"></div>
        <div class="text-stone-400 font-medium" id="doc-folder-stats-summary"></div>
      </div>
      <div id="folders-grid-container" class="space-y-2"></div>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 id="current-folder-view-title" class="text-xs font-bold uppercase tracking-wider text-stone-500">Danh sách bài đọc</h3>
          <span id="current-folder-file-count" class="text-xs text-stone-400 font-medium"></span>
        </div>
        <div id="doc-list-container" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
      </div>
    </section>

    <section id="view-vocab" class="hidden space-y-5">
      <div class="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-bold text-stone-900">Dữ liệu Từ vựng & Xếp hạng Tần suất</h2>
            <span id="vocab-count-badge" class="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">0 từ</span>
          </div>
          <p class="text-xs text-stone-500 mt-1">Đếm số lần xuất hiện lặp lại, xếp hạng rank</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="openRankExportModal('vocab')" class="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-sm transition">Trích xuất Rank</button>
          <button onclick="openScanModal('vocab')" class="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-sm transition">Quét từ & Prompt AI</button>
          <button onclick="markAllAsNew('vocab')" title="Đánh dấu toàn bộ từ vựng là Mới (level 1), trừ những từ đang học (2) và sắp thuộc (3)" class="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-xl transition">🔄 Đánh dấu tất cả Mới</button>
          <button onclick="openImportModal('vocab')" class="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition">📥 Nhập JSON</button>
          <button onclick="openAddVocabModal()" class="px-3 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold rounded-xl transition">+ Thêm từ</button>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Tổng lượt từ</span><div class="flex items-baseline gap-1.5"><span id="vc-stat-total-tokens" class="text-xl sm:text-2xl font-black text-stone-900">0</span><span class="text-xs text-stone-500">lượt</span></div></div>
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Từ phân biệt</span><div class="flex items-baseline gap-1.5"><span id="vc-stat-unique-count" class="text-xl sm:text-2xl font-black text-crimson-600">0</span><span class="text-xs text-stone-500">từ</span></div></div>
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Từ đã biết</span><div class="flex items-baseline gap-1.5"><span id="vc-stat-known-count" class="text-xl sm:text-2xl font-black text-emerald-600">0</span><span class="text-xs text-stone-500">từ</span></div></div>
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Đang hiển thị</span><div class="flex items-baseline gap-1.5"><span id="vc-stat-display-count" class="text-xl sm:text-2xl font-black text-amber-600">0</span><span class="text-xs text-stone-500">từ</span></div></div>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex-1 min-w-[240px]"><input type="text" id="vocab-search-input" oninput="renderVocabTable()" placeholder="Tìm từ, IPA, nghĩa hoặc #1..." class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600"></div>
          <div class="flex items-center flex-wrap gap-2">
            <label class="text-xs text-stone-600 flex items-center gap-1.5 cursor-pointer bg-stone-50 hover:bg-stone-100 px-3 py-2 rounded-xl border border-stone-200 select-none">
              <input type="checkbox" id="vc-include-hidden-stats" checked onchange="toggleIncludeHiddenStats(this.checked)" class="rounded text-crimson-600"> Thống kê cả bài ẩn
            </label>
            <button onclick="toggleHideKnown('vocab')" id="btn-vc-hide-known" class="px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition flex items-center gap-1.5"><span id="vc-hide-known-icon">👁️</span><span id="vc-hide-known-text">Ẩn mục Đã biết</span></button>
            <button onclick="resetRankView('vocab')" class="px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition">Hiện tất cả Rank</button>
          </div>
        </div>
        <div class="pt-2 border-t border-stone-100 flex flex-wrap sm:flex-nowrap items-center gap-3">
          <label class="text-xs font-bold text-stone-600 flex items-center gap-1.5 whitespace-nowrap"><span>🎚️ Kéo xem Rank thấp hơn:</span></label>
          <input type="range" id="vc-rank-slider" min="1" max="100" value="1" oninput="handleRankSlider('vocab', this.value)" class="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-crimson-600">
          <span id="vc-rank-range-display" class="text-xs font-mono font-bold text-crimson-700 bg-crimson-50 px-2.5 py-1 rounded-lg border border-crimson-200 whitespace-nowrap min-w-[125px] text-center">Rank #1 - #50</span>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col">
        <div id="vc-table-scroll-container" onscroll="handleTableScroll('vocab')" class="overflow-x-auto max-h-[520px]">
          <table class="w-full text-left text-sm"><thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium text-xs sticky top-0 z-10"><tr><th class="px-4 py-3 text-center w-20">Xếp hạng</th><th class="px-4 py-3">Từ vựng</th><th class="px-4 py-3">Tần suất</th><th class="px-4 py-3">IPA</th><th class="px-4 py-3">Ý nghĩa</th><th class="px-4 py-3">Từ nguyên</th><th class="px-4 py-3">LingQ</th><th class="px-4 py-3 text-right">Thao tác</th></tr></thead><tbody id="vocab-table-body" class="divide-y divide-stone-100"></tbody></table>
        </div>
        <div id="vc-pagination-bar" class="p-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
          <div class="flex items-center gap-2"><span id="vc-pagination-info" class="font-medium text-stone-700">Đang hiển thị: 0 / 0 từ</span></div>
          <div class="flex items-center gap-2">
            <button onclick="loadMoreItems('vocab')" id="btn-vc-load-more" class="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 font-semibold rounded-lg border border-stone-200 shadow-xs transition">⬇️ Tải thêm 50 từ</button>
            <button onclick="toggleLoadAll('vocab')" id="btn-vc-toggle-all" class="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg shadow-xs transition">⚡ Tải toàn bộ</button>
          </div>
        </div>
      </div>
    </section>

    <section id="view-grammar" class="hidden space-y-5">
      <div class="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-bold text-stone-900">Dữ liệu Ngữ pháp & Cấu trúc</h2>
            <span id="grammar-count-badge" class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">0 cấu trúc</span>
          </div>
          <p class="text-xs text-stone-500 mt-1">Phân loại: pair (cặp liên từ) · single (neo đơn) · chain (nhiều neo)</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="openScanModal('grammar')" class="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-sm transition">Quét ngữ pháp & Prompt AI</button>
          <button onclick="copyGrammarGuidePrompt()" class="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-sm transition">📋 Prompt hướng dẫn định dạng</button>
          <button onclick="openImportModal('grammar')" class="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition">📥 Nhập JSON</button>
          <button onclick="openAddGrammarModal()" class="px-3 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold rounded-xl transition">+ Thêm cấu trúc</button>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Tổng cấu trúc</span><div class="flex items-baseline gap-1.5"><span id="gm-stat-total" class="text-xl sm:text-2xl font-black text-stone-900">0</span><span class="text-xs text-stone-500">cấu trúc</span></div></div>
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Pair</span><div class="flex items-baseline gap-1.5"><span id="gm-stat-pair" class="text-xl sm:text-2xl font-black text-purple-600">0</span><span class="text-xs text-stone-500">cặp</span></div></div>
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Single</span><div class="flex items-baseline gap-1.5"><span id="gm-stat-single" class="text-xl sm:text-2xl font-black text-blue-600">0</span><span class="text-xs text-stone-500">neo</span></div></div>
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Chain</span><div class="flex items-baseline gap-1.5"><span id="gm-stat-chain" class="text-xl sm:text-2xl font-black text-amber-600">0</span><span class="text-xs text-stone-500">chuỗi</span></div></div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex-1 min-w-[240px]"><input type="text" id="grammar-search-input" oninput="renderGrammarTable()" placeholder="Tìm ID, nghĩa, CEFR, hoặc neo..." class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"></div>
          <div class="flex items-center flex-wrap gap-2">
            <select id="grammar-type-filter" onchange="renderGrammarTable()" class="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold">
              <option value="all">Tất cả loại</option>
              <option value="pair">Pair (cặp)</option>
              <option value="single">Single (neo đơn)</option>
              <option value="chain">Chain (chuỗi)</option>
            </select>
            <select id="grammar-level-filter" onchange="renderGrammarTable()" class="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold">
              <option value="all">Tất cả CEFR</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div class="overflow-x-auto max-h-[520px]">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium text-xs sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3 w-16">Loại</th>
                <th class="px-4 py-3 w-24">Mã</th>
                <th class="px-4 py-3">Neo / Cấu trúc</th>
                <th class="px-4 py-3">Nghĩa</th>
                <th class="px-4 py-3 w-16">CEFR</th>
                <th class="px-4 py-3 text-right w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody id="grammar-table-body" class="divide-y divide-stone-100"></tbody>
          </table>
        </div>
      </div>
    </section>
        <section id="view-sentence" class="hidden space-y-5">
      <div class="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-bold text-stone-900">📸 Sentence Mining — Câu khó hiểu</h2>
            <span id="sentence-count-badge" class="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">0 câu</span>
          </div>
          <p class="text-xs text-stone-500 mt-1">Lưu câu + neo → AI nạp nghĩa câu & nghĩa ngữ cảnh của từng neo</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="openScanModal('sentence')" class="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-sm transition">Quét câu & Prompt AI</button>
          <button onclick="openImportModal('sentence')" class="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition">📥 Nhập JSON</button>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Tổng câu</span><div class="flex items-baseline gap-1.5"><span id="sn-stat-total" class="text-xl sm:text-2xl font-black text-stone-900">0</span><span class="text-xs text-stone-500">câu</span></div></div>
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Chờ nạp nghĩa</span><div class="flex items-baseline gap-1.5"><span id="sn-stat-pending" class="text-xl sm:text-2xl font-black text-amber-600">0</span><span class="text-xs text-stone-500">câu</span></div></div>
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Đang trong FSRS</span><div class="flex items-baseline gap-1.5"><span id="sn-stat-in-fsrs" class="text-xl sm:text-2xl font-black text-rose-600">0</span><span class="text-xs text-stone-500">câu</span></div></div>
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm"><span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Tổng neo</span><div class="flex items-baseline gap-1.5"><span id="sn-stat-anchors" class="text-xl sm:text-2xl font-black text-purple-600">0</span><span class="text-xs text-stone-500">neo</span></div></div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm">
        <div class="flex-1"><input type="text" id="sentence-search-input" oninput="renderSentenceTable()" placeholder="Tìm ID, câu, neo, nghĩa..." class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600"></div>
      </div>

      <div class="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div class="overflow-x-auto max-h-[600px]">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium text-xs sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3 w-20">ID</th>
                <th class="px-4 py-3">Câu</th>
                <th class="px-4 py-3 w-48">Neo</th>
                <th class="px-4 py-3">Nghĩa</th>
                <th class="px-4 py-3 w-20">Trạng thái</th>
                <th class="px-4 py-3 text-right w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody id="sentence-table-body" class="divide-y divide-stone-100"></tbody>
          </table>
        </div>
      </div>
    </section>
  </main>

  <nav id="mobile-bottom-nav" class="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-2 py-1.5 flex justify-around items-center z-40 backdrop-blur-md bg-white/90">
    <button onclick="switchTab('reader')" class="flex flex-col items-center text-stone-600 hover:text-crimson-600">
      <span class="text-lg">📖</span>
      <span class="text-[10px] font-medium">Đọc bài</span>
    </button>
    <button onclick="switchTab('review')" class="flex flex-col items-center text-stone-600 hover:text-crimson-600 relative">
      <span class="text-lg">🎯</span>
      <span class="text-[10px] font-medium">Ôn FSRS</span>
    </button>
    <button onclick="switchTab('docs')" class="flex flex-col items-center text-stone-600 hover:text-crimson-600">
      <span class="text-lg">📚</span>
      <span class="text-[10px] font-medium">Tài liệu</span>
    </button>
    <button onclick="switchTab('vocab')" class="flex flex-col items-center text-stone-600 hover:text-crimson-600">
      <span class="text-lg">📑</span>
      <span class="text-[10px] font-medium">Từ vựng</span>
    </button>
    <button onclick="openBackupModal()" class="flex flex-col items-center text-stone-600 hover:text-crimson-600">
      <span class="text-lg">☁️</span>
      <span class="text-[10px] font-medium">Sync</span>
    </button>
  </nav>

  <!-- MODALS -->
  <div id="modal-test-result" class="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
      <div id="test-result-header" class="p-6 text-white text-center">
        <span id="test-result-icon" class="text-5xl block mb-2">📊</span>
        <h3 id="test-result-title" class="text-xl font-bold">Kết quả Thẩm định</h3>
        <p id="test-result-sub" class="text-xs text-white/80 mt-1"></p>
      </div>
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-stone-50 p-3 rounded-2xl border border-stone-200"><span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Khuyết thiếu</span><span id="res-corruption-rate" class="text-xl font-black text-rose-600 font-mono">0%</span></div>
          <div class="bg-stone-50 p-3 rounded-2xl border border-stone-200"><span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Mục tra cứu</span><span id="res-lookedup-count" class="text-xl font-black text-stone-800 font-mono">0</span></div>
          <div class="bg-stone-50 p-3 rounded-2xl border border-stone-200"><span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Nạp FSRS</span><span id="res-fsrs-added-count" class="text-xl font-black text-amber-600 font-mono">0</span></div>
        </div>
        <div id="test-result-feedback" class="p-3.5 rounded-2xl text-xs leading-relaxed"></div>
        <div><span class="text-xs font-bold uppercase text-stone-600 block mb-1.5">Mục nạp vào Bể FSRS:</span><div id="res-queued-items-box" class="bg-stone-50 border border-stone-200 rounded-xl p-3 max-h-[110px] overflow-y-auto flex flex-wrap gap-1.5 text-xs"></div></div>
        <div class="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <button onclick="closeModal('modal-test-result'); switchTab('review');" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition">Đến Tab Củng cố</button>
          <button onclick="closeModal('modal-test-result')" class="px-5 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-bold rounded-xl shadow-sm transition">Đã hiểu</button>
        </div>
      </div>
    </div>
  </div>

  <div id="modal-fsrs-settings" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div class="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
        <h3 class="font-bold text-sm text-stone-900 flex items-center gap-1.5"><span>⚙️</span> Cài đặt Thẩm định & FSRS</h3>
        <button onclick="closeModal('modal-fsrs-settings')" class="text-stone-400 hover:text-stone-700 text-xl leading-none">&times;</button>
      </div>
      <form onsubmit="saveFsrsSettings(event)" class="p-5 space-y-4 text-xs">
        <div>
          <label class="block font-bold uppercase text-stone-600 mb-1">Ngưỡng Rank tối đa:</label>
          <input type="number" id="cfg-rank-threshold" min="100" max="10000" step="100" required class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm font-bold font-mono focus:ring-2 focus:ring-crimson-600 focus:outline-none">
          <p class="text-[11px] text-stone-400 mt-1">Chỉ từ có rank ≤ ngưỡng này mới nạp vào bể FSRS.</p>
        </div>
        <div>
          <label class="block font-bold uppercase text-stone-600 mb-1">Ngưỡng khuyết thiếu tối đa (%):</label>
          <input type="number" id="cfg-corruption-threshold" min="1" max="50" step="0.5" required class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm font-bold font-mono focus:ring-2 focus:ring-crimson-600 focus:outline-none">
        </div>
        <div>
          <label class="block font-bold uppercase text-stone-600 mb-1">Tỉ lệ tới hạn FSRS để mở khóa retest (%):</label>
          <input type="number" id="cfg-retest-due-threshold" min="10" max="90" step="5" required class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm font-bold font-mono focus:ring-2 focus:ring-crimson-600 focus:outline-none">
        </div>
        <div>
          <label class="block font-bold uppercase text-stone-600 mb-1">Số bước tốt nghiệp (streak cần đạt):</label>
          <select id="cfg-fsrs-steps" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm font-bold focus:ring-2 focus:ring-crimson-600 focus:outline-none">
            <option value="4">4 bước (mặc định)</option>
            <option value="5">5 bước</option>
            <option value="6">6 bước</option>
            <option value="999">Vô hạn (không tự tốt nghiệp)</option>
          </select>
          <p class="text-[11px] text-stone-400 mt-1">Với "Vô hạn", thẻ chỉ ra khỏi bể khi bạn bấm "Tốt nghiệp ngay".</p>
        </div>
        <div class="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <button type="button" onclick="closeModal('modal-fsrs-settings')" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl">Hủy</button>
          <button type="submit" class="px-5 py-2 bg-crimson-600 hover:bg-crimson-700 text-white font-bold rounded-xl shadow-sm">Lưu cấu hình</button>
        </div>
      </form>
    </div>
  </div>

  <div id="modal-flashcard-session" class="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden overflow-hidden overscroll-none" style="touch-action: none;">
    <div class="w-full max-w-xl flex flex-col items-center">
      <div class="w-full flex items-center justify-between text-white text-xs mb-3 px-1">
        <div class="flex items-center gap-2">
          <span class="font-bold text-amber-400" id="fc-counter-label">Thẻ 1 / 10</span>
          <span class="text-stone-300">•</span>
          <span id="fc-streak-indicator" class="text-emerald-400 font-bold">Chuỗi: 0 / 4</span>
        </div>
        <button onclick="closeModal('modal-flashcard-session')" class="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold transition">✕ Kết thúc</button>
      </div>
      <div id="flashcard-element" class="flip-card w-full h-[380px] sm:h-[400px] cursor-pointer" onclick="handleFlashcardClick(event)" style="touch-action: none;">
        <div class="flip-card-inner relative w-full h-full text-center">
          <div class="flip-card-front absolute w-full h-full bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl border border-stone-200 select-none">
            <div class="swipe-indicator forgot" id="swipe-ind-forgot">✕ QUÊN</div>
            <div class="swipe-indicator known" id="swipe-ind-known">✓ NHỚ</div>
            <div class="swipe-indicator graduate" id="swipe-ind-graduate">🎓 TỐT NGHIỆP</div>
            <div class="swipe-hint">← Quẹt trái: Quên · Quẹt phải: Nhớ · Quẹt lên: Tốt nghiệp</div>
            <div class="flex items-center justify-between text-stone-400 text-xs">
              <span id="fc-front-type-badge" class="px-2.5 py-1 rounded-full bg-stone-100 font-bold uppercase text-[10px]">Từ đơn</span>
              <span id="fc-front-rank-badge" class="font-mono font-bold text-stone-500">Rank #120</span>
            </div>
                        <div class="my-auto space-y-4">
              <div id="fc-front-text" class="text-5xl sm:text-6xl font-english font-bold text-stone-900">word</div>
              <div class="fc-sentence-context-box bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-stone-700 text-sm sm:text-base font-english leading-relaxed">
                <span class="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-800 block mb-1">Ngữ cảnh (Chống học vẹt):</span>
                <p id="fc-front-sentence" class="font-medium"></p>
              </div>
            </div>
            <p class="text-stone-400 text-xs font-sans hidden sm:block">Bấm thẻ hoặc phím cách để lật · Quẹt để đánh giá</p>
            <p class="text-stone-400 text-xs font-sans sm:hidden">Chạm để lật · Quẹt trái/phải để đánh giá</p>
          </div>
          <div class="flip-card-back absolute w-full h-full bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl border border-stone-800 select-none overflow-y-auto">
            <div class="flex items-center justify-between text-stone-400 text-xs">
              <div class="flex items-center gap-2">
                <span id="fc-back-pinyin" class="text-amber-300 text-xl font-bold font-sans"></span>
                <button type="button" onclick="event.stopPropagation(); speakText(document.getElementById('fc-front-text').innerText)" class="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition">🔊</button>
              </div>
              <span id="fc-back-hanviet" class="text-xs uppercase font-bold text-stone-300"></span>
            </div>
            <div class="my-auto space-y-3 text-left py-2">
              <div><span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Nghĩa tiếng Việt:</span><p id="fc-back-meaning" class="text-sm sm:text-base text-stone-100 font-medium leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10"></p></div>
              <div id="fc-back-logic-wrapper"><span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Từ nguyên & Ghi chú:</span><p id="fc-back-logic" class="text-xs text-stone-300 bg-white/5 p-3 rounded-xl border border-white/10"></p></div>
            </div>
            <div class="space-y-2 pt-2 border-t border-white/10" onclick="event.stopPropagation()">
              <button onclick="graduateCurrentFlashcard()" class="w-full py-2 px-3 bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
                <span>🎓</span> Tốt nghiệp ngay (đuổi khỏi bể)
              </button>
              <div class="grid grid-cols-4 gap-2">
                <button onclick="handleFsrsResponse(1)" class="py-2.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex flex-col items-center"><span>Quên</span><span class="text-[9px] text-rose-200 font-normal">Reset</span></button>
                <button onclick="handleFsrsResponse(2)" class="py-2.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex flex-col items-center"><span>Khó</span><span class="text-[9px] text-amber-200 font-normal">+1 ngày</span></button>
                <button onclick="handleFsrsResponse(3)" class="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex flex-col items-center"><span>Tốt</span><span class="text-[9px] text-emerald-200 font-normal">+1</span></button>
                <button onclick="handleFsrsResponse(4)" class="py-2.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex flex-col items-center"><span>Dễ</span><span class="text-[9px] text-blue-200 font-normal">+1</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="modal-vocab-card" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div class="bg-gradient-to-r from-crimson-800 to-crimson-700 text-white p-5 flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3 id="vc-card-word" class="text-3xl font-english font-bold tracking-wider"></h3>
            <button onclick="speakText(document.getElementById('vc-card-word').innerText)" class="p-1 rounded-full bg-white/10 hover:bg-white/20 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
            </button>
            <span id="vc-card-rank-badge" class="text-xs font-mono font-bold bg-white/15 text-amber-200 border border-white/20 px-2 py-0.5 rounded-lg"></span>
          </div>
          <p id="vc-card-pinyin" class="text-amber-200 text-sm font-medium mt-0.5"></p>
        </div>
        <button onclick="closeModal('modal-vocab-card')" class="text-stone-300 hover:text-white text-2xl p-1">&times;</button>
      </div>
      <div class="bg-stone-100 px-5 py-3 border-b border-stone-200 flex items-center justify-between flex-wrap gap-2">
        <span class="text-xs font-bold text-stone-600 uppercase">Mức độ nhận biết:</span>
        <div class="flex items-center gap-1.5" id="vc-lingq-selector">
          <button onclick="setLingqStatus('vocab', currentOpenKey, 1)" class="px-2.5 py-1 text-xs rounded-lg font-bold bg-yellow-200 hover:bg-yellow-300 text-yellow-900 border border-yellow-400">1: Mới</button>
          <button onclick="setLingqStatus('vocab', currentOpenKey, 2)" class="px-2.5 py-1 text-xs rounded-lg font-bold bg-orange-200 hover:bg-orange-300 text-orange-900 border border-orange-400">2: Đang học</button>
          <button onclick="setLingqStatus('vocab', currentOpenKey, 3)" class="px-2.5 py-1 text-xs rounded-lg font-bold bg-emerald-200 hover:bg-emerald-300 text-emerald-900 border border-emerald-400">3: Gần nhớ</button>
          <button onclick="setLingqStatus('vocab', currentOpenKey, 4)" class="px-3 py-1 text-xs rounded-lg font-bold bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 shadow-sm flex items-center gap-1">✔ Đã biết</button>
        </div>
      </div>
      <div class="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
        <div><h4 class="text-xs uppercase font-bold text-stone-400 mb-1">Ý nghĩa từ vựng:</h4><div id="vc-card-meanings-list" class="text-stone-900 text-sm font-semibold bg-stone-50 p-3 rounded-xl border border-stone-200/60 leading-relaxed space-y-1"></div></div>
        <div><h4 class="text-xs uppercase font-bold text-stone-400 mb-1">Từ nguyên / Mẹo nhớ:</h4><div id="vc-card-logic" class="text-stone-700 text-xs bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 leading-relaxed font-sans"></div></div>
        <div><h4 class="text-xs uppercase font-bold text-stone-400 mb-1">Ví dụ:</h4><div id="vc-card-examples" class="space-y-1.5 text-xs text-stone-700"></div></div>
        <div class="pt-2 flex items-center justify-between border-t border-stone-100">
          <button id="vc-card-edit-btn" class="text-xs font-semibold text-crimson-600 hover:text-crimson-700">✏️ Chỉnh sửa</button>
          <div class="flex items-center gap-2">
            <button id="vc-card-fsrs-btn" onclick="quickAddToFsrs('vocab', currentOpenKey)" class="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-lg transition flex items-center gap-1">🎯 Ném vào FSRS</button>
            <button onclick="closeModal('modal-vocab-card')" class="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="modal-scan" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
      <div class="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
        <div><h3 id="scan-modal-title" class="font-bold text-base text-stone-900">Quét dữ liệu & Prompt AI</h3><p id="scan-modal-sub" class="text-xs text-stone-500">Chỉ quét các mục CHƯA BIẾT</p></div>
        <button onclick="closeModal('modal-scan')" class="text-stone-400 hover:text-stone-700 text-xl">&times;</button>
      </div>
      <div class="p-5 space-y-4 overflow-y-auto flex-1">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase text-stone-600">Mục chưa có dữ liệu (<span id="missing-count" class="text-crimson-600 font-bold">0</span>):</span>
            <div class="flex items-center gap-2">
              <button onclick="markAllMissingAsKnown()" class="text-xs text-emerald-600 hover:underline font-semibold">✔ Đánh dấu "Đã biết"</button>
              <button onclick="copyMissingItemsOnly()" class="text-xs text-crimson-600 hover:underline font-semibold flex items-center gap-1">📋 Sao chép</button>
            </div>
          </div>
          <div id="missing-tags-container" class="bg-stone-50 border border-stone-200 rounded-xl p-3 min-h-[70px] max-h-[120px] overflow-y-auto flex flex-wrap gap-1.5 text-sm"></div>
        </div>
        <div>
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold uppercase text-stone-600">Prompt AI:</span>
              <label class="text-[11px] text-stone-600 flex items-center gap-1 cursor-pointer bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                <input type="checkbox" onchange="toggleContextDepth(this)" class="rounded text-purple-600"> Kèm câu trước & sau (+/-1)
              </label>
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="saveCustomPromptTemplate()" title="Lưu lại prompt bạn tự sửa để dùng cho các lần sau" class="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold rounded transition">💾 Lưu mẫu sửa</button>
              <button onclick="resetToDefaultPromptTemplate()" title="Khôi phục prompt gốc" class="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold rounded transition">🔄 Khôi phục</button>
              <button onclick="copyGeneratedPrompt()" class="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-lg shadow-sm transition">Sao chép</button>
            </div>
          </div>
          <textarea id="ai-prompt-preview" readonly rows="8" class="w-full bg-stone-900 text-stone-100 rounded-xl p-3 text-xs font-mono border border-stone-800 leading-relaxed"></textarea>
        </div>
        <div class="pt-2 border-t border-stone-100">
          <label class="block text-xs font-bold uppercase text-stone-600 mb-1">Dán JSON từ AI:</label>
          <textarea id="quick-import-json" rows="3" placeholder='Dán JSON...' class="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-mono focus:ring-2 focus:ring-crimson-600 focus:outline-none"></textarea>
          <button onclick="applyQuickImport()" class="mt-2 w-full py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold rounded-xl transition">🚀 Nạp JSON</button>
        </div>
      </div>
    </div>
  </div>

  <div id="modal-doc-editor" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div class="p-5 border-b border-stone-200 flex items-center justify-between">
        <h3 id="doc-modal-title" class="font-bold text-base text-stone-900">Thêm bài đọc</h3>
        <button onclick="closeModal('modal-doc-editor')" class="text-stone-400 hover:text-stone-700 text-xl">&times;</button>
      </div>
      <form id="doc-form" onsubmit="saveDocumentForm(event)" class="p-5 space-y-4">
        <input type="hidden" id="doc-id">
        <div><label class="block text-xs font-bold uppercase text-stone-600 mb-1">Tiêu đề</label><input type="text" id="doc-title-input" required placeholder="Ví dụ: A1 - Daily Life" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-crimson-600 focus:outline-none"></div>
        <div><label class="block text-xs font-bold uppercase text-stone-600 mb-1">Thư mục</label><select id="doc-folder-select" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-crimson-600 focus:outline-none font-medium"><option value="">📂 (Gốc)</option></select></div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-bold uppercase text-stone-600">Nội dung (phân cách bằng khoảng trắng)</label>
            <div class="flex items-center gap-3">
              <button type="button" onclick="copySegmentationPrompt()" class="text-xs text-amber-700 hover:underline font-semibold">📋 Prompt chuẩn hóa</button>
              <button type="button" onclick="insertSampleText()" class="text-xs text-crimson-600 hover:underline">Chèn mẫu</button>
            </div>
          </div>
          <textarea id="doc-content-input" rows="8" required placeholder="Ví dụ: Hello , my name is John ." class="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-sm font-english text-base focus:ring-2 focus:ring-crimson-600 focus:outline-none"></textarea>
        </div>
        <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3 space-y-2">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="text-base">🔤</span>
              <div>
                <p class="text-xs font-bold text-emerald-900">Chuẩn hóa văn bản tiếng Anh</p>
                <p class="text-[10px] text-emerald-700">Tách dấu câu rời khỏi từ, chuẩn hóa khoảng trắng. Tiếng Anh đã có sẵn space nên không cần Jieba.</p>
              </div>
            </div>
            <button type="button" onclick="callSmartTokenize()" id="btn-hanlp-tokenize" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95 flex items-center gap-1.5">
              <span>⚡</span> Chuẩn hóa ngay
            </button>
          </div>
          <div id="jieba-load-status" class="text-[10px] text-emerald-700 hidden">
            <span class="inline-block">Không cần Jieba cho tiếng Anh.</span>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal('modal-doc-editor')" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl">Hủy</button>
          <button type="submit" class="px-5 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold rounded-xl shadow-sm">Lưu</button>
        </div>
      </form>
    </div>
  </div>

  <div id="modal-folder-editor" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div class="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
        <h3 id="folder-modal-title" class="font-bold text-sm text-stone-900 flex items-center gap-1.5"><span>📁</span> Tạo thư mục</h3>
        <button onclick="closeModal('modal-folder-editor')" class="text-stone-400 hover:text-stone-700 text-xl leading-none">&times;</button>
      </div>
      <form onsubmit="saveFolderForm(event)" class="p-5 space-y-4">
        <input type="hidden" id="folder-edit-id">
        <div><label class="block text-xs font-bold uppercase text-stone-600 mb-1">Tên thư mục</label><input type="text" id="folder-name-input" required placeholder="Ví dụ: A1 Beginner" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-crimson-600 focus:outline-none"></div>
        <div class="flex items-center justify-end gap-2 pt-1">
          <button type="button" onclick="closeModal('modal-folder-editor')" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl">Hủy</button>
          <button type="submit" class="px-5 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold rounded-xl shadow-sm">Lưu</button>
        </div>
      </form>
    </div>
  </div>

  <div id="modal-move-doc" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div class="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
        <h3 class="font-bold text-sm text-stone-900 flex items-center gap-1.5"><span>📂</span> Chuyển thư mục</h3>
        <button onclick="closeModal('modal-move-doc')" class="text-stone-400 hover:text-stone-700 text-xl leading-none">&times;</button>
      </div>
      <div class="p-5 space-y-4">
        <input type="hidden" id="move-doc-target-id">
        <p class="text-xs text-stone-600">Bài đọc: <b id="move-doc-title" class="text-stone-900 font-englishSans"></b></p>
        <div><label class="block text-xs font-bold uppercase text-stone-600 mb-1">Chọn thư mục:</label><select id="move-doc-select" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-crimson-600 focus:outline-none font-medium"></select></div>
        <div class="flex items-center justify-end gap-2 pt-1">
          <button type="button" onclick="closeModal('modal-move-doc')" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl">Hủy</button>
          <button type="button" onclick="applyMoveDoc()" class="px-5 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold rounded-xl shadow-sm">Xác nhận</button>
        </div>
      </div>
    </div>
  </div>

  <div id="modal-folder-tree" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[88vh]">
      <div class="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
        <div>
          <h3 class="font-bold text-base text-stone-900 flex items-center gap-2"><span>📁</span> Cấu trúc Thư mục & Thứ tự</h3>
          <p class="text-xs text-stone-500 mt-0.5">Kéo thả biểu tượng ⠿ để đổi vị trí</p>
        </div>
        <button onclick="closeModal('modal-folder-tree')" class="text-stone-400 hover:text-stone-700 text-2xl leading-none p-1">&times;</button>
      </div>
      <div id="folder-tree-vertical-container" class="p-4 space-y-4 overflow-y-auto flex-1 bg-stone-50/50"></div>
      <div class="p-3.5 border-t border-stone-200 bg-white flex items-center justify-between">
        <button onclick="openFolderEditorModal()" class="text-xs text-crimson-600 hover:text-crimson-700 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-crimson-50 transition"><span>📁</span> + Thư mục mới</button>
        <button onclick="closeModal('modal-folder-tree')" class="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition">Xong</button>
      </div>
    </div>
  </div>

  <div id="modal-vocab-editor" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div class="p-4 border-b border-stone-200 flex items-center justify-between">
        <h3 id="vocab-modal-title" class="font-bold text-sm text-stone-900">Thêm / Sửa Từ vựng</h3>
        <button onclick="closeModal('modal-vocab-editor')" class="text-stone-400 hover:text-stone-700 text-xl">&times;</button>
      </div>
      <form id="vocab-form" onsubmit="saveVocabForm(event)" class="p-5 space-y-3 max-h-[80vh] overflow-y-auto">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-xs font-bold text-stone-600 mb-1">Từ vựng</label><input type="text" id="vc-input-word" required class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-lg font-english font-bold focus:ring-2 focus:ring-crimson-600 focus:outline-none"></div>
          <div><label class="block text-xs font-bold text-stone-600 mb-1">IPA</label><input type="text" id="vc-input-pinyin" required placeholder="/ˈwɜːrd/" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-crimson-600 focus:outline-none"></div>
        </div>
        <div><label class="block text-xs font-bold text-stone-600 mb-1">Ý nghĩa</label><textarea id="vc-input-meaning" rows="3" required class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-crimson-600 focus:outline-none"></textarea></div>
        <div><label class="block text-xs font-bold text-stone-600 mb-1">Từ nguyên / Mẹo nhớ</label><textarea id="vc-input-logic" rows="2" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-crimson-600 focus:outline-none"></textarea></div>
        <div><label class="block text-xs font-bold text-stone-600 mb-1">Ví dụ (mỗi dòng 1 câu)</label><textarea id="vc-input-examples" rows="2" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-english focus:ring-2 focus:ring-crimson-600 focus:outline-none"></textarea></div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal('modal-vocab-editor')" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl">Hủy</button>
          <button type="submit" class="px-5 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold rounded-xl">Lưu</button>
        </div>
      </form>
    </div>
  </div>

  <div id="modal-grammar-editor" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-purple-200 overflow-hidden">
      <div class="p-4 border-b border-purple-200 flex items-center justify-between bg-purple-50">
        <h3 id="grammar-modal-title" class="font-bold text-sm text-purple-900">Thêm / Sửa Cấu trúc Ngữ pháp</h3>
        <button onclick="closeModal('modal-grammar-editor')" class="text-stone-400 hover:text-stone-700 text-xl">&times;</button>
      </div>
      <form id="grammar-form" onsubmit="saveGrammarForm(event)" class="p-5 space-y-3 max-h-[80vh] overflow-y-auto">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-stone-600 mb-1 flex items-center justify-between">
              <span>Mã số *</span>
              <button type="button" onclick="document.getElementById('gm-input-id').value = generateGrammarId();" 
                      class="text-[10px] text-purple-600 hover:text-purple-800 font-semibold normal-case">🎲 Đổi mã</button>
            </label>
            <input type="text" id="gm-input-id" required placeholder="G0001" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-sm font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-stone-600 mb-1">Loại *</label>
            <select id="gm-input-type" required onchange="onGrammarTypeChange()" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-sm font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none">
              <option value="pair">Pair (cặp liên từ)</option>
              <option value="single">Single (neo đơn)</option>
              <option value="chain">Chain (chuỗi neo)</option>
            </select>
          </div>
        </div>
        <div id="gm-fields-pair">
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-xs font-bold text-stone-600 mb-1">Left Group hoặc Token</label><input type="text" id="gm-input-left" placeholder="concession (group) hoặc although (token)" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"></div>
            <div><label class="block text-xs font-bold text-stone-600 mb-1">Right Group hoặc Token</label><input type="text" id="gm-input-right" placeholder="contrast (group) hoặc but (token)" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"></div>
          </div>
        </div>
        <div id="gm-fields-single" class="hidden">
          <label class="block text-xs font-bold text-stone-600 mb-1">Anchor Group hoặc Token (phân cách bằng dấu phẩy)</label>
          <input type="text" id="gm-input-anchor" placeholder="not only, not just (hoặc tên group)" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none">
        </div>
        <div id="gm-fields-chain" class="hidden">
          <label class="block text-xs font-bold text-stone-600 mb-1">Chain segments (mỗi dòng 1 segment, phân cách bằng dấu phẩy nếu là group/token)</label>
          <textarea id="gm-input-chain" rows="3" placeholder="the&#10;the" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none"></textarea>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div><label class="block text-xs font-bold text-stone-600 mb-1">CEFR Level</label><input type="text" id="gm-input-level" placeholder="B1" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"></div>
          <div><label class="block text-xs font-bold text-stone-600 mb-1">Priority</label><input type="number" id="gm-input-priority" value="10" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-sm font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none"></div>
          <div><label class="block text-xs font-bold text-stone-600 mb-1">Loại hiển thị</label><input type="text" id="gm-input-meaning" placeholder="Mặc dù... nhưng..." required class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"></div>
        </div>
        <div><label class="block text-xs font-bold text-stone-600 mb-1">Nghĩa tiếng Việt *</label><textarea id="gm-input-meaning-full" rows="2" required placeholder="Mặc dù... nhưng..." class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"></textarea></div>
        <div><label class="block text-xs font-bold text-stone-600 mb-1">Ghi chú</label><textarea id="gm-input-notes" rows="2" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"></textarea></div>
        <div><label class="block text-xs font-bold text-stone-600 mb-1">Ví dụ (mỗi dòng 1 câu)</label><textarea id="gm-input-examples" rows="3" placeholder="Although it was cold , I still went out ." class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-english focus:ring-2 focus:ring-purple-600 focus:outline-none"></textarea></div>
        <div class="flex justify-end gap-2 pt-2 border-t border-stone-100">
          <button type="button" onclick="closeModal('modal-grammar-editor')" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl">Hủy</button>
          <button type="submit" class="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl">Lưu</button>
        </div>
      </form>
    </div>
  </div>

  <div id="modal-import" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div class="p-4 border-b border-stone-200 flex items-center justify-between">
        <h3 id="import-modal-title" class="font-bold text-sm text-stone-900">Nhập dữ liệu JSON</h3>
        <button onclick="closeModal('modal-import')" class="text-stone-400 hover:text-stone-700 text-xl">&times;</button>
      </div>
      <div class="p-5 space-y-3">
        <p id="import-modal-desc" class="text-xs text-stone-500"></p>
        <textarea id="import-json-area" rows="8" placeholder="[{ ... }]" class="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-crimson-600 focus:outline-none"></textarea>
        <div class="flex justify-between items-center pt-2">
          <button onclick="exportCurrentData()" class="text-xs text-stone-600 hover:text-stone-900 font-semibold">📤 Tải JSON hiện tại</button>
          <div class="flex gap-2">
            <button onclick="closeModal('modal-import')" class="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl">Hủy</button>
            <button onclick="processGeneralImport()" class="px-5 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold rounded-xl">Nạp</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="modal-backup-restore" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden overflow-y-auto">
    <div class="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div class="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
        <button onclick="closeModal('modal-backup-restore')" title="Quay lại" class="flex-shrink-0 w-10 h-10 mt-2 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-crimson-600 text-stone-700 hover:text-white transition-all duration-150 active:scale-95 shadow-xs mr-3"><svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path></svg></button>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-base text-stone-900">Sao lưu & Khôi phục dữ liệu</h3>
          <p class="text-xs text-stone-500 mt-0.5">Xuất và nạp toàn bộ bài đọc, từ điển và tiến độ FSRS</p>
        </div>
      </div>
      <div class="p-5 space-y-4">
        <div class="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 space-y-1.5 text-xs text-stone-600">
          <div class="flex justify-between"><span>📚 Bài đọc:</span> <b id="stat-docs-count" class="text-stone-900">0</b></div>
          <div class="flex justify-between"><span>📑 Từ vựng:</span> <b id="stat-vocab-count" class="text-stone-900">0</b></div>
          <div class="flex justify-between"><span>🎯 Mục FSRS:</span> <b id="stat-fsrs-count" class="text-stone-900">0</b></div>
          <div class="flex justify-between"><span>🎯 Trạng thái LingQ:</span> <b id="stat-status-count" class="text-stone-900">0</b></div>
          <div class="flex justify-between"><span>🟣 Ngữ pháp:</span> <b id="stat-grammar-count" class="text-stone-900">0</b></div>
        </div>
        <div class="flex border-b border-stone-200 text-xs font-semibold">
          <button type="button" onclick="switchBackupSubTab('file')" id="subtab-btn-file" class="flex-1 py-2 text-center border-b-2 border-crimson-600 text-crimson-600 transition font-bold">📁 File cục bộ</button>
          <button type="button" onclick="switchBackupSubTab('cloud')" id="subtab-btn-cloud" class="flex-1 py-2 text-center border-b-2 border-transparent text-stone-500 hover:text-stone-800 transition">☁️ Đám mây (Supabase)</button>
        </div>
        <div id="subtab-content-file" class="space-y-2.5">
          <button onclick="exportFullBackup()" class="w-full py-3 px-4 bg-crimson-600 hover:bg-crimson-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Tải về file sao lưu (.JSON)
          </button>
          <button onclick="document.getElementById('backup-file-input').click()" class="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold border border-stone-200 transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            Chọn file sao lưu (.JSON) để nạp lại
          </button>
        </div>
        <div id="subtab-content-cloud" class="hidden space-y-3 overflow-y-auto max-h-[60vh] pr-1">
          <div class="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-bold text-amber-900 flex items-center gap-1.5">
                <span id="cloud-status-dot" class="w-2.5 h-2.5 rounded-full bg-stone-300 inline-block"></span>
                <span id="cloud-status-text">Chưa kết nối Supabase</span>
              </span>
            </div>
            <div id="cloud-user-email" class="text-[11px] text-stone-600 truncate hidden">
              Tài khoản: <span id="cloud-user-email-text" class="font-semibold text-stone-800"></span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-bold uppercase tracking-wider text-stone-600">Cấu hình Supabase:</label>
            </div>
            <input type="text" id="sb-url" value="https://wxmzmcopqierhdwnshyr.supabase.co" placeholder="Supabase Project URL" class="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-mono">
            <input type="text" id="sb-anon-key" value="sb_publishable_RiAgCkxK9tZxhuKEqCk2SQ_0LqnO138" placeholder="Supabase Anon Key" class="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-mono">
            <div class="flex justify-end">
              <button type="button" onclick="saveSupabaseConfig()" class="text-xs font-bold text-white bg-stone-800 hover:bg-stone-900 px-3 py-1.5 rounded-xl transition">💾 Lưu khóa</button>
            </div>
          </div>
          <div id="sb-auth-box" class="space-y-2 border-t border-stone-200 pt-2">
            <label class="text-[11px] font-bold uppercase tracking-wider text-stone-600">Tài khoản đồng bộ:</label>
            <input type="email" id="sb-auth-email" placeholder="Email của bạn" class="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs">
            <input type="password" id="sb-auth-pass" placeholder="Mật khẩu" class="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs">
            <div class="flex gap-2">
              <button type="button" onclick="handleSupabaseSignIn()" class="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs">Đăng nhập</button>
              <button type="button" onclick="handleSupabaseSignUp()" class="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs border border-stone-200">Đăng ký</button>
            </div>
          </div>
          <div class="pt-2">
            <button type="button" onclick="syncWithSupabase()" id="btn-cloud-upload" disabled class="w-full py-3 px-4 bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-700 hover:to-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <span>🔄 Đồng bộ Delta 2 chiều (như Anki)</span>
            </button>
          </div>
          <div class="pt-2 border-t border-stone-200 space-y-2">
            <button type="button" onclick="setAllTimestampsToNow()" class="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2">
              <span>⏰</span> Set TOÀN BỘ timestamp = Hôm nay (để đẩy lên cloud)
            </button>
            <p class="text-[10px] text-stone-500 text-center leading-relaxed">
              Gán <code class="bg-stone-100 px-1 rounded">updatedAt = now()</code> cho mọi dữ liệu local.<br>
              Dùng khi muốn ép máy này ghi đè toàn bộ dữ liệu trên cloud.
            </p>
          </div>
          <div id="cloud-last-sync-time" class="text-[11px] text-center text-stone-400 mt-1">Chưa có lượt đồng bộ nào.</div>
          <div class="pt-2 border-t border-stone-200">
            <button type="button" onclick="forceFullResync()" class="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2">
              <span>⚠️</span> Ép đồng bộ lại từ đầu (Force Full Sync)
            </button>
            <p class="text-[10px] text-stone-500 text-center mt-1">Đặt lastSyncedAt = 0, sau đó chạy sync lại toàn bộ.</p>
          </div>
          <div class="pt-2 border-t border-stone-200">
            <button type="button" onclick="forcePullAllFromCloud()" id="btn-force-pull" class="w-full py-3 px-4 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2">
              <span>⬇️</span> FORCE PULL — Kéo TOÀN BỘ từ cloud về
            </button>
            <p class="text-[10px] text-stone-500 text-center mt-1 leading-relaxed">
              Bỏ qua timestamp. Xóa local, kéo hết từ cloud về.<br>
              Dùng khi máy này thiếu dữ liệu và cloud là nguồn đúng.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="modal-select-doc" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
      <div class="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
        <div><h3 class="font-bold text-base text-stone-900 flex items-center gap-2"><span>📚</span> Chọn bài đọc</h3><p class="text-xs text-stone-500 mt-0.5">Nhấp vào bài đọc để bắt đầu</p></div>
        <button onclick="closeModal('modal-select-doc')" class="text-stone-400 hover:text-stone-700 text-2xl leading-none p-1">&times;</button>
      </div>
      <div class="p-3 border-b border-stone-100 bg-white">
        <input type="text" id="doc-picker-search" oninput="filterDocPickerList()" placeholder="🔍 Tìm kiếm..." class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-crimson-600">
      </div>
      <div id="doc-picker-list" class="p-3 sm:p-4 space-y-2 overflow-y-auto flex-1"></div>
      <div class="p-3.5 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
        <button onclick="closeModal('modal-select-doc'); switchTab('docs');" class="text-xs text-crimson-600 hover:text-crimson-700 font-semibold flex items-center gap-1">Quản lý tài liệu →</button>
        <button onclick="closeModal('modal-select-doc')" class="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-xl transition">Đóng</button>
      </div>
    </div>
  </div>

  <div id="modal-rank-export" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
      <div class="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
        <div><h3 id="rank-export-title" class="font-bold text-base text-stone-900 flex items-center gap-2"><span>📊</span> Trích xuất theo Rank</h3><p id="rank-export-sub" class="text-xs text-stone-500 mt-0.5"></p></div>
        <button onclick="closeModal('modal-rank-export')" class="text-stone-400 hover:text-stone-700 text-xl leading-none p-1">&times;</button>
      </div>
      <div class="p-5 space-y-4 overflow-y-auto flex-1">
        <div class="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div><span class="text-xs text-stone-500 font-medium mb-1 block">Từ Rank (#):</span><input type="number" id="rank-export-min" min="1" value="1" oninput="updateRankExportPreview()" class="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold font-mono focus:ring-2 focus:ring-crimson-600 focus:outline-none"></div>
            <div><span class="text-xs text-stone-500 font-medium mb-1 block">Đến Rank (#):</span><input type="number" id="rank-export-max" min="1" value="50" oninput="updateRankExportPreview()" class="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold font-mono focus:ring-2 focus:ring-crimson-600 focus:outline-none"></div>
          </div>
          <div class="pt-2 flex flex-col sm:flex-row gap-3 text-xs text-stone-700">
            <label class="flex items-center gap-1.5 cursor-pointer font-medium select-none"><input type="checkbox" id="rank-export-exclude-known" checked onchange="updateRankExportPreview()" class="rounded text-crimson-600"> Loại bỏ mục Đã biết</label>
            <label class="flex items-center gap-1.5 cursor-pointer font-medium select-none"><input type="checkbox" id="rank-export-only-missing" onchange="updateRankExportPreview()" class="rounded text-crimson-600"> Chỉ lấy mục chưa có</label>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-bold uppercase text-stone-600">Kết quả (<span id="rank-export-count" class="text-crimson-600 font-bold">0</span>):</span>
            <button onclick="copyRankExportItemsOnly()" class="text-xs text-crimson-600 hover:underline font-semibold">📋 Sao chép danh sách</button>
          </div>
          <div id="rank-export-preview-box" class="bg-stone-50 border border-stone-200 rounded-xl p-3 min-h-[80px] max-h-[140px] overflow-y-auto flex flex-wrap gap-1.5 text-sm"></div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-bold uppercase text-stone-600">Prompt AI:</span>
            <button onclick="copyRankExportPrompt()" class="px-2.5 py-1 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-sm transition">Sao chép Prompt</button>
          </div>
          <textarea id="rank-export-prompt-box" readonly rows="5" class="w-full bg-stone-900 text-stone-100 rounded-xl p-3 text-xs font-mono border border-stone-800 leading-relaxed"></textarea>
        </div>
      </div>
      <div class="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
        <button onclick="downloadRankExportJson()" class="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition">💾 Tải JSON</button>
        <button onclick="closeModal('modal-rank-export')" class="px-4 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold rounded-xl transition">Đóng</button>
      </div>
    </div>
  </div>

  <div id="toast-container" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none"></div>

  <!-- SUPABASE SDK -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

  <!-- APP SCRIPTS -->
  <script src="js/00-config.js"></script>
  <script src="js/03-state.js"></script>
  <script src="js/01-storage.js"></script>
  <script src="js/02-text-utils.js"></script>
  <script src="js/04-ui-shared.js"></script>
  <script src="js/05-vocab.js"></script>
  <script src="js/06-fsrs-core.js"></script>
  <script src="js/07-fsrs-flashcard.js"></script>
  <script src="js/08-test-mode.js"></script>
  <script src="js/09-grammar-engine.js"></script>
  <script src="js/10-grammar-ui.js"></script>
  <script src="js/11-grammar-fsrs.js"></script>
  <script src="js/12-structure-select.js"></script>
  <script src="js/13-sentence-mining.js"></script>
  <script src="js/14-docs-folders.js"></script>
  <script src="js/15-reader.js"></script>
  <script src="js/16-ai-scan.js"></script>
  <script src="js/17-backup-sync.js"></script>
  <script src="js/18-bootstrap.js"></script>
</body>
</html>```

```javascript: js/00-config.js
/* ============================================================
 * FILE: 00-config.js
 * DOMAIN: Hằng số & dữ liệu mặc định
 * DEPENDS: (không)
 * ============================================================ */

const DB_NAME = 'EnglishReadIndexedDB_v1';
const DB_VERSION = 1;
const STORE_NAME = 'app_store';

const DEFAULT_VOCAB = {
  "hello": {
    ipa: "/həˈloʊ/",
    pos: "interj",
    meaning: "1. Xin chào\n2. Lời chào thân mật",
    logic: "Từ tiếng Anh cổ 'hal' (khỏe mạnh) + hậu tố chào hỏi. Dùng khi gặp mặt.",
    examples: ["Hello , how are you ?", "She said hello to everyone ."],
    level: "A1"
  },
  "world": {
    ipa: "/wɜːrld/",
    pos: "noun",
    meaning: "1. Thế giới\n2. Toàn cầu",
    logic: "Từ tiếng Anh cổ 'weorold' = wer (người) + eald (tuổi). Nghĩa gốc: 'thời đại của con người'.",
    examples: ["The world is changing fast ."],
    level: "A1"
  },
  "friend": {
    ipa: "/frend/",
    pos: "noun",
    meaning: "1. Bạn bè\n2. Người bạn",
    logic: "Từ tiếng Anh cổ 'freond' - phân từ hiện tại của 'freogan' (yêu thương). Cùng gốc với 'free'.",
    examples: ["She is my best friend ."],
    level: "A1"
  },
  "study": {
    ipa: "/ˈstʌdi/",
    pos: "verb / noun",
    meaning: "1. (v) Học tập\n2. (n) Sự nghiên cứu\n3. (n) Phòng làm việc",
    logic: "Từ tiếng Latin 'studium' (sự nhiệt tình, học tập) -> tiếng Pháp cổ 'estudier'.",
    examples: ["I study English every day .", "The study was published last year ."],
    level: "A2"
  },
  "beautiful": {
    ipa: "/ˈbjuːtɪfl/",
    pos: "adj",
    meaning: "1. Đẹp, xinh đẹp\n2. Tuyệt vời",
    logic: "Beauty (n) + -ful (đầy). Từ tiếng Pháp cổ 'biau' + Latin 'bellus'.",
    examples: ["What a beautiful day !"],
    level: "A2"
  },
  "the": {
    ipa: "/ðə/ /ðiː/",
    pos: "article",
    meaning: "Mạo từ xác định - dùng trước danh từ đã xác định",
    logic: "Từ tiếng Anh cổ 'se' - mạo từ chỉ định. Đọc /ðə/ trước phụ âm, /ðiː/ trước nguyên âm.",
    examples: ["The book is on the table ."],
    level: "A1"
  },
  "a": {
    ipa: "/ə/ /eɪ/",
    pos: "article",
    meaning: "Mạo từ không xác định - dùng trước danh từ đếm được số ít",
    logic: "Rút gọn của 'an' (một). Đọc /ə/ khi yếu, /eɪ/ khi nhấn mạnh.",
    examples: ["I need a pen ."],
    level: "A1"
  },
  "and": {
    ipa: "/ænd/ /ənd/",
    pos: "conj",
    meaning: "Và - liên từ nối",
    logic: "Từ tiếng Anh cổ 'and'. Cùng gốc với tiếng Đức 'und'.",
    examples: ["I like tea and coffee ."],
    level: "A1"
  }
};

const DEFAULT_STATUS = { vocab: { "the": 4, "a": 4, "and": 4 } };

const DEFAULT_DOCS = [{
  id: "doc-1",
  title: "Bài đọc 1: Greeting & Daily Life",
  content: "Hello , my name is John . I am a student . I study English every day . The world is beautiful and I have many friends .",
  hidden: false,
  createdAt: new Date().toISOString(),
  testStatus: { tested: false, lastTestDate: null, corruptionRate: 0, failed: false, lockedUntil: null, retested: false, trackedItems: [] }
}];

const DEFAULT_FSRS_CONFIG = { rankThreshold: 2500, corruptionThreshold: 5.0, retestDueThreshold: 50.0, fsrsSteps: 4 };```

```javascript: js/01-storage.js
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
}```

```javascript: js/02-text-utils.js
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
}```

```javascript: js/03-state.js
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
let customGrammarPromptTemplate = localStorage.getItem('custom_grammar_prompt_tpl') || '';```

```javascript: js/04-ui-shared.js
/* ============================================================
 * FILE: 04-ui-shared.js
 * DOMAIN: Modal, toast, confirm, tab switcher, badge, clipboard
 * DEPENDS: 00-config, 03-state
 * ============================================================ */

function openModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('hidden'); }

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
  if (id === 'modal-flashcard-session') {
    document.body.classList.remove('flashcard-open');
  }
  if (window.__needReaderRerender && (id === 'modal-vocab-card')) {
    window.__needReaderRerender = false;
    if (!document.getElementById('view-reader').classList.contains('hidden')) {
      requestAnimationFrame(() => renderReader());
    }
  }
}

function showToast(message, type = "info") {
  if (toastTimeout) clearTimeout(toastTimeout);
  const container = document.getElementById('toast-container');
  container.innerHTML = '';
  const toast = document.createElement('div');
  const bgColors = { success: 'bg-emerald-800 text-white', error: 'bg-rose-800 text-white', warning: 'bg-amber-700 text-white', info: 'bg-stone-800 text-white' };
  toast.className = `${bgColors[type] || bgColors.info} px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  toastTimeout = setTimeout(() => {
    if (toast.parentNode) toast.remove();
    toastTimeout = null;
  }, 2000);
}

function showConfirmModal(question, onConfirm, onCancel) {
  const existing = document.getElementById('custom-confirm-modal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'custom-confirm-modal';
  modal.className = "fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4";
  modal.innerHTML = `
    <div class="bg-white max-w-sm w-full rounded-2xl p-5 shadow-xl border border-stone-200">
      <p class="text-sm font-semibold text-stone-800 mb-4">${question}</p>
      <div class="flex justify-end gap-2">
        <button id="btn-confirm-cancel" class="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold">Hủy</button>
        <button id="btn-confirm-ok" class="px-3.5 py-1.5 bg-crimson-600 hover:bg-crimson-700 text-white rounded-lg text-xs font-semibold">Đồng ý</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('btn-confirm-cancel').onclick = () => {
    modal.remove();
    if (typeof onCancel === 'function') onCancel();
  };
  document.getElementById('btn-confirm-ok').onclick = () => {
    modal.remove();
    onConfirm();
  };
}

function copyToClipboard(text, msg = "Đã sao chép!") {
  if (!text) return;
  const t = document.createElement("textarea");
  t.value = text;
  t.style.position = "fixed";
  document.body.appendChild(t);
  t.select();
  try { document.execCommand('copy'); showToast(msg, "success"); } catch (e) {}
  document.body.removeChild(t);
}

function switchTab(tabId) {
  const tabs = ['reader', 'review', 'docs', 'vocab', 'grammar', 'sentence'];
  tabs.forEach(t => {
    const view = document.getElementById(`view-${t}`);
    const btn = document.getElementById(`tab-btn-${t}`);
    if (!view || !btn) return;
    if (t === tabId) {
      view.classList.remove('hidden');
      btn.className = "px-3.5 py-1.5 rounded-lg transition-all duration-150 bg-white text-crimson-600 font-bold shadow-sm";
    } else {
      view.classList.add('hidden');
      btn.className = "px-3.5 py-1.5 rounded-lg transition-all duration-150 text-stone-600 hover:text-stone-900";
    }
  });
  if (tabId === 'reader') renderReader();
  if (tabId === 'review') renderReviewTables();
  if (tabId === 'docs') renderDocList();
  if (tabId === 'vocab') renderVocabTable();
  if (tabId === 'grammar') renderGrammarTable();
  if (tabId === 'sentence') renderSentenceTable();
}

function switchReviewSubTab(subtab) {
  const tabs = ['hanzi', 'vocab', 'grammar', 'sentence', 'docs'];
  tabs.forEach(t => {
    const btn = document.getElementById(`subtab-review-${t}`);
    const content = document.getElementById(`review-subcontent-${t}`);
    if (!btn || !content) return;
    if (t === subtab) {
      btn.className = "py-2.5 px-4 text-crimson-600 border-b-2 border-crimson-600 transition flex items-center gap-1.5 font-bold";
      content.classList.remove('hidden');
    } else {
      btn.className = "py-2.5 px-4 text-stone-500 hover:text-stone-800 border-b-2 border-transparent transition flex items-center gap-1.5";
      content.classList.add('hidden');
    }
  });
  renderReviewTables();
}

function updateBadges() {
  const vcBadge = document.getElementById('vocab-count-badge');
  if (vcBadge) vcBadge.innerText = `${Object.keys(vocabDb).length} từ`;
  const activeDoc = docs.find(d => d.id === activeDocId && !d.hidden) || docs.find(d => !d.hidden);
  const btnTitle = document.getElementById('current-doc-btn-title');
  if (btnTitle) btnTitle.innerText = activeDoc ? activeDoc.title : '(Chưa chọn bài đọc)';

  const activeVc = Object.values(fsrsPool.vocab).filter(i => !i.deleted);
  const activeGm = Object.values(grammarFsrsPool).filter(i => !i.deleted);
  const activeSn = Object.values(sentenceFsrsPool).filter(i => !i.deleted);
  const totalFsrs = activeVc.length + activeGm.length + activeSn.length;
  const totalPoolElem = document.getElementById('review-total-items-badge');
  if (totalPoolElem) totalPoolElem.innerText = `${totalFsrs} mục`;
  const now = Date.now();
  let dueCount = 0;
  activeVc.forEach(i => { if (i.nextReview <= now) dueCount++; });
  activeGm.forEach(i => { if (i.nextReview <= now) dueCount++; });
  activeSn.forEach(i => { if (i.nextReview <= now) dueCount++; });
  const dueElem = document.getElementById('fsrs-stat-due-count');
  if (dueElem) dueElem.innerText = dueCount;
  const navDue = document.getElementById('nav-due-badge');
  if (navDue) {
    if (dueCount > 0) { navDue.innerText = dueCount; navDue.classList.remove('hidden'); }
    else navDue.classList.add('hidden');
  }
  const hzCountElem = document.getElementById('fsrs-stat-hanzi-count');
  if (hzCountElem) hzCountElem.innerText = activeVc.filter(i => {
    const k = Object.keys(fsrsPool.vocab).find(key => fsrsPool.vocab[key] === i);
    return k && !k.includes(' ');
  }).length;
  const vcCountElem = document.getElementById('fsrs-stat-vocab-count');
  if (vcCountElem) vcCountElem.innerText = activeVc.filter(i => {
    const k = Object.keys(fsrsPool.vocab).find(key => fsrsPool.vocab[key] === i);
    return k && k.includes(' ');
  }).length;

  const readyDocs = docs.filter(d => d.testStatus && d.testStatus.tested && checkDocDueEligibility(d).eligible);
  const readyDocsElem = document.getElementById('fsrs-stat-ready-docs-count');
  if (readyDocsElem) readyDocsElem.innerText = readyDocs.length;

  const stepsLabelEl = document.getElementById('review-steps-label');
  if (stepsLabelEl) {
    const s = fsrsConfig.fsrsSteps || 4;
    stepsLabelEl.innerText = s >= 999 ? 'số lần không giới hạn' : `${s} lần liên tiếp`;
  }
}```

```javascript: js/05-vocab.js
/* ============================================================
 * FILE: 05-vocab.js
 * DOMAIN: Vocab DB, LingQ status, vocab card/table, rank export
 * DEPENDS: 00-config, 02-text-utils, 03-state, 04-ui-shared
 * ============================================================ */

function getLingqStatus(type, key) {
  const k = (key || '').toLowerCase();
  if (statusDb.vocab && statusDb.vocab[k] !== undefined) return statusDb.vocab[k];
  if (statusDb.vocab && statusDb.vocab[key] !== undefined) return statusDb.vocab[key];
  return (vocabDb[k] || vocabDb[key]) ? 2 : 1;
}

function setLingqStatus(type, key, level) {
  const k = (key || '').toLowerCase();
  if (!statusDb.vocab) statusDb.vocab = {};
  statusDb.vocab[k] = level;
  if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
  statusTimestamps.vocab[k] = Date.now();
  touch();

  if (isTestActive) {
    if (level === 4) {
      testSessionLookups.manualMarkedKnown.add(k);
      testSessionLookups.words.delete(k);
    } else {
      testSessionLookups.manualMarkedKnown.delete(k);
    }
    updateTestLiveStats();
  }

  saveAllData();
  closeModal('modal-vocab-card');

  if (!document.getElementById('view-reader').classList.contains('hidden')) {
    requestAnimationFrame(() => renderReader());
  }
}

function updateLingqModalButtons(type, currentLevel) {
  const container = document.getElementById('vc-lingq-selector');
  if (!container) return;
  const buttons = container.querySelectorAll('button');
  buttons.forEach((btn, idx) => {
    if (idx + 1 === currentLevel) btn.classList.add('ring-2', 'ring-crimson-600', 'font-black', 'scale-105');
    else btn.classList.remove('ring-2', 'ring-crimson-600', 'font-black', 'scale-105');
  });
}

function openVocabCard(word) {
  const key = cleanEnglishWord(word);
  const data = getVocabEntry(key);
  const targetWord = (data && data.matchWord) ? data.matchWord : key;
  currentOpenKey = targetWord;

  const level = getLingqStatus('vocab', targetWord);

  if (data && (data.isBaseForm || data.isFuzzy) && data.matchWord !== key) {
    document.getElementById('vc-card-word').innerHTML = `
      ${data.matchWord} 
      <span class="text-[11px] px-2 py-0.5 rounded-full bg-amber-300 text-amber-950 font-sans font-bold">
        Gốc của "${key}"
      </span>
    `;
  } else {
    document.getElementById('vc-card-word').innerText = key;
  }

  document.getElementById('vc-card-pinyin').innerText = data ? (data.ipa || '--') : 'Chưa có IPA';

  const vcRankBadge = document.getElementById('vc-card-rank-badge');
  if (vcRankBadge) {
    const rank = getItemRank('vocab', key);
    const vcEntry = vcRankList.find(x => x.word === key);
    const count = vcEntry ? vcEntry.count : 0;
    if (rank < 9999 && count > 0) vcRankBadge.innerText = `#${rank} · ${count} lần`;
    else vcRankBadge.innerText = 'Không có trong bài';
    vcRankBadge.classList.remove('hidden');
  }

  const logicBox = document.getElementById('vc-card-logic');
  logicBox.innerText = data && data.logic ? data.logic : 'Chưa có phân tích từ nguyên.';

  const meaningsBox = document.getElementById('vc-card-meanings-list');
  meaningsBox.innerHTML = '';
  if (data && data.meaning) {
    data.meaning.split('\n').forEach(l => {
      if (l.trim()) {
        const p = document.createElement('p');
        p.className = "text-stone-900 leading-relaxed";
        p.innerText = l.trim();
        meaningsBox.appendChild(p);
      }
    });
  } else {
    meaningsBox.innerHTML = `<span class="text-stone-500 font-normal">Chưa có dữ liệu nghĩa từ vựng.</span>`;
  }

  const examplesBox = document.getElementById('vc-card-examples');
  examplesBox.innerHTML = '';
  if (data && data.examples && data.examples.length > 0) {
    data.examples.forEach(ex => {
      const p = document.createElement('p');
      p.className = "bg-stone-50 p-2 rounded border border-stone-100 font-english italic";
      p.innerText = ex;
      examplesBox.appendChild(p);
    });
  } else {
    examplesBox.innerHTML = `<span class="text-stone-400 italic">Chưa có ví dụ.</span>`;
  }

  updateLingqModalButtons('vocab', level);
  const editBtn = document.getElementById('vc-card-edit-btn');
  editBtn.innerText = targetWord !== key ? `✏️ Chỉnh sửa từ gốc "${targetWord}"` : '✏️ Chỉnh sửa từ này';
  editBtn.onclick = () => { closeModal('modal-vocab-card'); openAddVocabModal(targetWord); };

  renderGrammarHintInVocabCard(key);

  openModal('modal-vocab-card');
  speakText(key);
}

function renderGrammarHintInVocabCard(cleanWord) {
  let hintBox = document.getElementById('vc-grammar-hint-box');
  if (!hintBox) {
    const modalBody = document.querySelector('#modal-vocab-card .p-5.space-y-4');
    if (!modalBody) return;
    hintBox = document.createElement('div');
    hintBox.id = 'vc-grammar-hint-box';
    hintBox.className = 'hidden';
    const footer = modalBody.querySelector('.pt-2.flex.items-center.justify-between');
    if (footer) modalBody.insertBefore(hintBox, footer);
    else modalBody.appendChild(hintBox);
  }
  hintBox.innerHTML = '';
  hintBox.classList.add('hidden');

  const ids = grammarAnchorIndex[cleanWord] || [];
  if (ids.length === 0) return;

  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (!doc) return;

  const bm = bookmarks[doc.id];
  let targetSentence = '';
  if (bm && bm.type === 'vocab' && cleanEnglishWord(bm.word) === cleanWord) {
    const lines = doc.content.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes(cleanWord)) { targetSentence = line.trim(); break; }
    }
  }
  if (!targetSentence) {
    const lines = doc.content.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes(cleanWord)) { targetSentence = line.trim(); break; }
    }
  }
  if (!targetSentence) return;

  const tokens = tokenizeEnglishText(targetSentence);
  const matches = detectGrammarInSentence(tokens).filter(m => {
    const p = grammarDb._patterns[m.patternId];
    if (!p) return false;
    return ids.includes(m.patternId);
  });
  if (matches.length === 0) return;

  hintBox.classList.remove('hidden');
  let html = `<div class="bg-purple-50 border border-purple-200 rounded-xl p-3 space-y-2">
    <p class="text-[10px] uppercase font-bold text-purple-700 flex items-center gap-1.5">
      <span>🟣</span> Từ này thuộc cấu trúc ngữ pháp trong câu:
    </p>
    <p class="text-xs font-english text-stone-700 italic">${targetSentence}</p>
    <div class="space-y-1.5">`;

  matches.forEach(m => {
    const p = grammarDb._patterns[m.patternId];
    const matchedText = tokens.slice(m.start, m.end + 1).join(' ');
    html += `
      <button onclick="closeModal('modal-vocab-card'); openGrammarCard('${m.patternId}', ${JSON.stringify(matchedText).replace(/"/g, '&quot;')})"
              class="w-full text-left flex items-center justify-between gap-2 px-3 py-2 bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50 rounded-lg transition">
        <div class="min-w-0 flex-1">
          <p class="font-mono text-xs font-bold text-purple-800 truncate">${m.patternId}</p>
          <p class="text-[11px] text-stone-600 truncate">${p.meaning || '(chưa có nghĩa)'}</p>
        </div>
        <span class="text-purple-500 text-xs font-bold flex-shrink-0">Xem ngay →</span>
      </button>`;
  });
  html += `</div></div>`;
  hintBox.innerHTML = html;
}

function quickAddToFsrs(type, key) {
  if (!key) return;
  const k = (key || '').toLowerCase();
  const rank = getItemRank('vocab', k);
  const now = Date.now();
  const pool = fsrsPool.vocab;
  const existing = pool[k];

  if (!statusDb.vocab) statusDb.vocab = {};
  const currentLvl = getLingqStatus('vocab', k);
  if (currentLvl !== 3 && currentLvl !== 4) {
    statusDb.vocab[k] = 2;
    if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
    statusTimestamps.vocab[k] = now;
  }

  if (existing) {
    existing.streak = 0;
    existing.nextReview = now;
    existing.interval = 1;
    existing.lastReview = now;
    existing.updatedAt = now;
    existing.rank = rank;
    showToast(`🔄 "${k}" đã được reset trong bể FSRS (streak về 0).`, "info");
  } else {
    pool[k] = {
      streak: 0, interval: 1, nextReview: now, lastReview: now,
      usedSentences: [], rank: rank, updatedAt: now
    };
    showToast(`🎯 Đã ném "${k}" (Rank #${rank}) vào bể FSRS!`, "success");
  }

  touch();
  saveAllData();
  updateBadges();
  closeModal('modal-vocab-card');

  if (!document.getElementById('view-review').classList.contains('hidden')) renderReviewTables();
  if (!document.getElementById('view-reader').classList.contains('hidden')) {
    requestAnimationFrame(() => renderReader());
  }
}

// ==================== VOCAB TABLE ====================
function renderVocabTable() {
  calculateFrequencies();
  const tbody = document.getElementById('vocab-table-body');
  const query = (document.getElementById('vocab-search-input').value || '').trim().toLowerCase();
  tbody.innerHTML = '';

  const items = vcRankList.map(item => ({
    word: item.word, count: item.count, frequency: item.frequency, rank: item.rank,
    ...(getVocabEntry(item.word) || {})
  }));
  const statTotal = document.getElementById('vc-stat-total-tokens');
  const statUnique = document.getElementById('vc-stat-unique-count');
  const statKnown = document.getElementById('vc-stat-known-count');
  const statDisplay = document.getElementById('vc-stat-display-count');
  if (statTotal) statTotal.innerText = totalVcOccurrences.toLocaleString('vi-VN');
  if (statUnique) statUnique.innerText = items.filter(i => i.count > 0).length.toLocaleString('vi-VN');
  if (statKnown) statKnown.innerText = items.filter(i => getLingqStatus('vocab', i.word) === 4).length.toLocaleString('vi-VN');

  let filtered = items.filter(item => {
    const lvl = getLingqStatus('vocab', item.word);
    if (vcHideKnown && lvl === 4) return false;
    if (query.startsWith('#')) {
      const searchRank = parseInt(query.substring(1), 10);
      if (!isNaN(searchRank)) return item.rank === searchRank;
    }
    return item.word.includes(query) || (item.ipa && item.ipa.toLowerCase().includes(query)) || (item.meaning && item.meaning.toLowerCase().includes(query));
  });

  let displayedList = (!vcShowAllRanks && !query) ? filtered.filter(i => i.rank >= vcRankOffset && i.rank < vcRankOffset + vcDisplayLimit) : filtered;
  if (statDisplay) statDisplay.innerText = displayedList.length.toLocaleString('vi-VN');

  displayedList.forEach(item => {
    const word = item.word;
    const lvl = getLingqStatus('vocab', word);
    const tr = document.createElement('tr');
    tr.className = "hover:bg-stone-50 transition";
    tr.innerHTML = `
      <td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded font-mono text-xs font-bold bg-stone-100">#${item.rank}</span></td>
      <td class="px-4 py-3 font-english text-xl font-bold text-stone-900 cursor-pointer hover:text-crimson-600" onclick="openVocabCard('${word}')">${word}</td>
      <td class="px-4 py-3 font-mono text-xs">${item.count} lần (${item.frequency.toFixed(2)}%)</td>
      <td class="px-4 py-3 text-crimson-600 font-medium text-xs">${item.ipa || '--'}</td>
      <td class="px-4 py-3 text-stone-800 text-xs max-w-xs truncate">${item.meaning || '--'}</td>
      <td class="px-4 py-3 text-stone-500 text-xs max-w-sm truncate">${item.logic || '--'}</td>
      <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-xs font-bold lingq-level-${lvl}">Mức ${lvl}</span></td>
      <td class="px-4 py-3 text-right">
        <button onclick="openAddVocabModal('${word}')" class="text-xs text-stone-600 hover:text-crimson-600 mr-2">Sửa</button>
        <button onclick="deleteVocab('${word}')" class="text-xs text-red-500 hover:text-red-700">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleIncludeHiddenStats(checked) {
  includeHiddenInStats = checked;
  idbSet('includeHiddenInStats', includeHiddenInStats);
  calculateFrequencies();
  renderVocabTable();
}

function handleRankSlider(type, value) {
  vcRankOffset = parseInt(value, 10) || 1;
  vcShowAllRanks = false;
  renderVocabTable();
}

function resetRankView(type) {
  vcShowAllRanks = true;
  renderVocabTable();
}

function loadMoreItems(type) {
  vcDisplayLimit += 50;
  renderVocabTable();
}

function toggleLoadAll(type) {
  vcShowAllRanks = !vcShowAllRanks;
  renderVocabTable();
}

function toggleHideKnown(type) {
  vcHideKnown = !vcHideKnown;
  renderVocabTable();
}

function handleTableScroll(type) { /* để trống cho tương thích */ }

function openAddVocabModal(existingWord = null) {
  document.getElementById('vc-input-word').value = existingWord || '';
  document.getElementById('vc-input-word').readOnly = !!existingWord;
  const item = existingWord ? vocabDb[existingWord.toLowerCase()] || vocabDb[existingWord] : null;
  document.getElementById('vc-input-pinyin').value = item ? (item.ipa || '') : '';
  document.getElementById('vc-input-meaning').value = item ? (item.meaning || '') : '';
  document.getElementById('vc-input-logic').value = item ? (item.logic || '') : '';
  document.getElementById('vc-input-examples').value = item && item.examples ? item.examples.join('\n') : '';
  openModal('modal-vocab-editor');
}

function saveVocabForm(e) {
  e.preventDefault();
  const word = document.getElementById('vc-input-word').value.trim().toLowerCase();
  if (!word) return;
  const examplesRaw = document.getElementById('vc-input-examples').value.trim();
  vocabDb[word] = {
    ipa: document.getElementById('vc-input-pinyin').value.trim(),
    meaning: document.getElementById('vc-input-meaning').value.trim(),
    logic: document.getElementById('vc-input-logic').value.trim(),
    examples: examplesRaw ? examplesRaw.split('\n').map(s => s.trim()).filter(Boolean) : [],
    updatedAt: Date.now()
  };
  touch();
  saveAllData();
  closeModal('modal-vocab-editor');
  renderVocabTable();
  showToast(`Đã lưu từ vựng "${word}"`, "success");
}

function deleteVocab(word) {
  showConfirmModal(`Xóa từ vựng "${word}"?`, () => {
    delete vocabDb[word];
    touch();
    saveAllData();
    renderVocabTable();
  });
}

async function markAllAsNew(type) {
  const currentStatus = statusDb.vocab || {};
  const toChange = Object.keys(currentStatus).filter(k => {
    const lvl = currentStatus[k];
    return lvl !== 2 && lvl !== 3;
  });

  const confirmed = await new Promise(resolve => {
    const existing = document.getElementById('danger-confirm-modal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'danger-confirm-modal';
    modal.className = "fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4";
    const requireText = 'RESET VOCAB';
    modal.innerHTML = `
      <div class="bg-white max-w-md w-full rounded-2xl p-5 shadow-2xl border-2 border-rose-300">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">⚠️</span>
          <h3 class="font-bold text-base text-rose-700">CẢNH BÁO NGUY HIỂM</h3>
        </div>
        <div class="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 space-y-2 mb-4">
          <p><b>Hành động này sẽ đánh dấu toàn bộ Từ vựng là "Mới" (level 1).</b></p>
          <p><b>SẼ GIỮ NGUYÊN:</b> level 2 (Đang học) và level 3 (Sắp thuộc).</p>
          <p><b>SẼ ĐỔI VỀ LEVEL 1:</b> ${toChange.length} mục.</p>
          <p class="text-rose-700 font-bold">⚠️ Level 4 (Đã biết) cũng sẽ bị đưa về level 1!</p>
        </div>
        <label class="block text-xs font-bold text-stone-700 mb-1.5">
          Gõ chính xác <span class="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-rose-700">${requireText}</span> để xác nhận:
        </label>
        <input type="text" id="danger-confirm-input" autocomplete="off" spellcheck="false"
               class="w-full bg-stone-50 border-2 border-stone-300 focus:border-rose-500 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none"
               placeholder="Gõ vào đây...">
        <div class="flex justify-end gap-2 mt-4">
          <button id="danger-confirm-cancel" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold">Hủy</button>
          <button id="danger-confirm-ok" disabled class="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold opacity-40 cursor-not-allowed">Xác nhận Reset</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const input = document.getElementById('danger-confirm-input');
    const okBtn = document.getElementById('danger-confirm-ok');
    const cancelBtn = document.getElementById('danger-confirm-cancel');
    input.addEventListener('input', () => {
      if (input.value === requireText) {
        okBtn.disabled = false;
        okBtn.classList.remove('opacity-40', 'cursor-not-allowed');
        okBtn.classList.add('hover:bg-rose-700');
      } else {
        okBtn.disabled = true;
        okBtn.classList.add('opacity-40', 'cursor-not-allowed');
        okBtn.classList.remove('hover:bg-rose-700');
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value === requireText) {
        modal.remove();
        resolve(true);
      }
    });
    cancelBtn.onclick = () => { modal.remove(); resolve(false); };
    okBtn.onclick = () => {
      if (input.value !== requireText) return;
      modal.remove();
      resolve(true);
    };
    setTimeout(() => input.focus(), 100);
  });

  if (!confirmed) return;

  const now = Date.now();
  let changedCount = 0;
  Object.keys(currentStatus).forEach(k => {
    const lvl = currentStatus[k];
    if (lvl === 2 || lvl === 3) return;
    currentStatus[k] = 1;
    if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
    statusTimestamps.vocab[k] = now;
    changedCount++;
  });
  Object.keys(vocabDb).forEach(k => {
    if (currentStatus[k] === undefined) {
      currentStatus[k] = 1;
      if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
      statusTimestamps.vocab[k] = now;
      changedCount++;
    }
  });
  statusDb.vocab = currentStatus;
  touch();
  await saveAllData();
  renderVocabTable();
  if (!document.getElementById('view-reader').classList.contains('hidden')) renderReader();
  showToast(`🔄 Đã đánh dấu ${changedCount} từ vựng là "Mới".`, "success");
}

// ==================== RANK EXPORT ====================
function openRankExportModal(type) {
  calculateFrequencies();
  document.getElementById('rank-export-min').value = 1;
  document.getElementById('rank-export-max').value = 50;
  updateRankExportPreview();
  openModal('modal-rank-export');
}

function updateRankExportPreview() {
  const minRank = parseInt(document.getElementById('rank-export-min').value, 10) || 1;
  const maxRank = parseInt(document.getElementById('rank-export-max').value, 10) || 50;
  const excludeKnown = document.getElementById('rank-export-exclude-known').checked;
  const onlyMissing = document.getElementById('rank-export-only-missing').checked;
  const sourceList = vcRankList;
  currentRankExportFilteredList = sourceList.filter(item => {
    if (item.rank < minRank || item.rank > maxRank) return false;
    const key = item.word;
    if (excludeKnown && getLingqStatus('vocab', key) === 4) return false;
    if (onlyMissing && vocabDb[key]) return false;
    return true;
  });
  document.getElementById('rank-export-count').innerText = currentRankExportFilteredList.length;
  const previewBox = document.getElementById('rank-export-preview-box');
  previewBox.innerHTML = '';
  currentRankExportFilteredList.forEach(item => {
    const tag = document.createElement('span');
    tag.className = "inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-stone-200 rounded-lg text-xs font-english shadow-xs";
    tag.innerHTML = `<span>${item.word}</span><span class="text-[10px] text-stone-400 font-mono">#${item.rank}</span>`;
    previewBox.appendChild(tag);
  });
  const rawItems = currentRankExportFilteredList.map(i => i.word);
  document.getElementById('rank-export-prompt-box').value = generateAiPrompt('vocab', rawItems);
}

function copyRankExportItemsOnly() {
  const raw = currentRankExportFilteredList.map(i => i.word);
  copyToClipboard(raw.join(', '), "Đã sao chép danh sách!");
}

function copyRankExportPrompt() {
  copyToClipboard(document.getElementById('rank-export-prompt-box').value, "Đã sao chép prompt!");
}

function downloadRankExportJson() {
  const payload = { type: 'vocab', items: currentRankExportFilteredList };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rank_export_vocab.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}```

```javascript: js/06-fsrs-core.js
/* ============================================================
 * FILE: 06-fsrs-core.js
 * DOMAIN: FSRS pool, tombstone, review table, settings
 * DEPENDS: 00-config, 02-text-utils, 03-state, 04-ui-shared
 * ============================================================ */

// ==================== FSRS TOMBSTONE HELPERS ====================
function softDeleteFsrsItem(type, key, reason = 'manual') {
  if (!fsrsPool[type] || !fsrsPool[type][key]) return false;
  const now = Date.now();
  fsrsPool[type][key] = {
    ...fsrsPool[type][key],
    deleted: true,
    deletedAt: now,
    updatedAt: now,
    deleteReason: reason
  };
  return true;
}

function cleanupTombstones(maxAgeDays = 30) {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  let cleaned = 0;
  ['vocab'].forEach(type => {
    if (!fsrsPool[type]) return;
    Object.keys(fsrsPool[type]).forEach(key => {
      const item = fsrsPool[type][key];
      if (item.deleted && item.deletedAt && item.deletedAt < cutoff) {
        delete fsrsPool[type][key];
        cleaned++;
      }
    });
  });
  if (cleaned > 0) {
    console.log(`[Cleanup] Đã dọn ${cleaned} tombstone cũ hơn ${maxAgeDays} ngày.`);
  }
  return cleaned;
}

function getActiveFsrsItems(type) {
  if (!fsrsPool[type]) return {};
  const result = {};
  Object.keys(fsrsPool[type]).forEach(key => {
    const item = fsrsPool[type][key];
    if (!item.deleted) result[key] = item;
  });
  return result;
}

function checkDocDueEligibility(doc) {
  if (!doc.testStatus || !doc.testStatus.trackedItems || doc.testStatus.trackedItems.length === 0) {
    return { eligible: true, duePercent: 100 };
  }
  const now = Date.now();
  let totalTracked = 0, totalDue = 0;
  doc.testStatus.trackedItems.forEach(entry => {
    const [type, key] = entry.split(':');
    const pool = fsrsPool.vocab;
    if (pool && pool[key]) {
      totalTracked++;
      if (pool[key].nextReview <= now) totalDue++;
    }
  });
  if (totalTracked === 0) return { eligible: true, duePercent: 100 };
  const duePercent = (totalDue / totalTracked) * 100;
  return { eligible: duePercent >= fsrsConfig.retestDueThreshold, duePercent, totalTracked, totalDue };
}

function applyRetestEffectOnFsrs(doc) {
  const now = Date.now();
  const words = doc.content.trim().split(/\s+/);
  const docWords = new Set();
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned) docWords.add(cleaned);
  });
  docWords.forEach(w => {
    const item = fsrsPool.vocab[w];
    if (item && !item.deleted) {
      if (item.nextReview <= now) {
        item.streak = (item.streak || 0) + 1;
        item.interval = Math.round((item.interval || 1) * 2.2);
        item.nextReview = now + item.interval * 24 * 60 * 60 * 1000;
        item.lastReview = now;
        item.updatedAt = now;
        const targetSteps = fsrsConfig.fsrsSteps || 4;
        if (targetSteps < 999 && item.streak >= targetSteps) {
          softDeleteFsrsItem('vocab', w, 'retest');
        }
      } else {
        item.nextReview += 2 * 24 * 60 * 60 * 1000;
        item.updatedAt = now;
      }
    }
  });
}

// ==================== FSRS REVIEW TABLE ====================
function renderReviewTables() {
  const hzTbody = document.getElementById('review-hanzi-table-body');
  const vcTbody = document.getElementById('review-vocab-table-body');
  const docsContainer = document.getElementById('ready-retest-docs-list');
  const now = Date.now();

  // Từ đơn
  hzTbody.innerHTML = '';
  const hzKeys = Object.keys(fsrsPool.vocab).filter(k => !fsrsPool.vocab[k].deleted && !k.includes(' '));
  hzKeys.sort((a, b) => (fsrsPool.vocab[a].nextReview || 0) - (fsrsPool.vocab[b].nextReview || 0));
  if (hzKeys.length === 0) {
    hzTbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-stone-400">Không có từ đơn nào cần củng cố.</td></tr>`;
  } else {
    hzKeys.forEach(word => {
      const item = fsrsPool.vocab[word];
      const isDue = item.nextReview <= now;
      const tr = document.createElement('tr');
      tr.className = "hover:bg-stone-50 transition";
      tr.innerHTML = `
        <td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded font-mono text-xs bg-stone-100 font-bold">#${item.rank || getItemRank('vocab', word)}</span></td>
        <td class="px-4 py-3 font-english text-xl font-bold text-stone-900 cursor-pointer hover:text-crimson-600" onclick="openVocabCard('${word}')">${word}</td>
        <td class="px-4 py-3"><div class="flex items-center gap-1 flex-wrap">${(() => {
          const totalSteps = fsrsConfig.fsrsSteps || 4;
          if (totalSteps >= 999) {
            return `<span class="w-6 h-6 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center justify-center">${item.streak || 0}</span><span class="text-[10px] text-stone-400 font-mono">/∞</span>`;
          }
          return Array.from({length: totalSteps}, (_, i) => i + 1)
            .map(s => `<span class="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${s <= item.streak ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}">${s}</span>`).join('');
        })()}</div></td><td class="px-4 py-3"><span class="px-2 py-0.5 text-xs font-bold rounded-lg ${isDue ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-600'}">${isDue ? '⚡ Cần ôn' : '⏳ Đang đếm'}</span></td>
        <td class="px-4 py-3 text-xs text-stone-500 font-mono">${new Date(item.nextReview).toLocaleDateString('vi-VN')}</td>
        <td class="px-4 py-3 text-right">
          <button onclick="graduateFsrsItemManually('vocab', '${word}')" class="text-xs text-emerald-600 hover:underline font-semibold mr-2">Tốt nghiệp</button>
          <button onclick="removeFsrsItem('vocab', '${word}')" class="text-xs text-rose-500 hover:underline">Xóa</button>
        </td>
      `;
      hzTbody.appendChild(tr);
    });
  }

  // Cụm từ
  vcTbody.innerHTML = '';
  const vcKeys = Object.keys(fsrsPool.vocab).filter(w => w.includes(' ') && !fsrsPool.vocab[w].deleted);
  vcKeys.sort((a, b) => (fsrsPool.vocab[a].nextReview || 0) - (fsrsPool.vocab[b].nextReview || 0));
  if (vcKeys.length === 0) {
    vcTbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-stone-400">Không có cụm từ nào cần củng cố.</td></tr>`;
  } else {
    vcKeys.forEach(word => {
      const item = fsrsPool.vocab[word];
      const isDue = item.nextReview <= now;
      const tr = document.createElement('tr');
      tr.className = "hover:bg-stone-50 transition";
      tr.innerHTML = `
        <td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded font-mono text-xs bg-stone-100 font-bold">#${item.rank || getItemRank('vocab', word)}</span></td>
        <td class="px-4 py-3 font-english text-lg font-bold text-stone-900 cursor-pointer hover:text-crimson-600" onclick="openVocabCard('${word}')">${word}</td>
        <td class="px-4 py-3"><div class="flex items-center gap-1 flex-wrap">${(() => {
          const totalSteps = fsrsConfig.fsrsSteps || 4;
          if (totalSteps >= 999) {
            return `<span class="w-6 h-6 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center justify-center">${item.streak || 0}</span><span class="text-[10px] text-stone-400 font-mono">/∞</span>`;
          }
          return Array.from({length: totalSteps}, (_, i) => i + 1)
            .map(s => `<span class="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${s <= item.streak ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}">${s}</span>`).join('');
        })()}</div></td><td class="px-4 py-3"><span class="px-2 py-0.5 text-xs font-bold rounded-lg ${isDue ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-600'}">${isDue ? '⚡ Cần ôn' : '⏳ Đang đếm'}</span></td>
        <td class="px-4 py-3 text-xs text-stone-500 font-mono">${new Date(item.nextReview).toLocaleDateString('vi-VN')}</td>
        <td class="px-4 py-3 text-right">
          <button onclick="graduateFsrsItemManually('vocab', '${word}')" class="text-xs text-emerald-600 hover:underline font-semibold mr-2">Tốt nghiệp</button>
          <button onclick="removeFsrsItem('vocab', '${word}')" class="text-xs text-rose-500 hover:underline">Xóa</button>
        </td>
      `;
      vcTbody.appendChild(tr);
    });
  }

  // ========== GRAMMAR FSRS TABLE ==========
  let grammarTbody = document.getElementById('review-grammar-table-body');
  if (!grammarTbody) {
    const grammarSection = document.getElementById('review-subcontent-grammar');
    if (grammarSection) {
      grammarSection.innerHTML = `
        <div class="overflow-x-auto max-h-[480px]">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium text-xs sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3">Cấu trúc</th>
                <th class="px-4 py-3">Tiến độ</th>
                <th class="px-4 py-3">Trạng thái</th>
                <th class="px-4 py-3">Lần ôn kế</th>
                <th class="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody id="review-grammar-table-body" class="divide-y divide-stone-100"></tbody>
          </table>
        </div>`;
      grammarTbody = document.getElementById('review-grammar-table-body');
    }
  }

  if (grammarTbody) {
    grammarTbody.innerHTML = '';
    const grammarKeys = Object.keys(grammarFsrsPool).filter(pid => !grammarFsrsPool[pid].deleted);
    grammarKeys.sort((a, b) => (grammarFsrsPool[a].nextReview || 0) - (grammarFsrsPool[b].nextReview || 0));
    if (grammarKeys.length === 0) {
      grammarTbody.innerHTML = `<tr><td colspan="5" class="px-4 py-8 text-center text-stone-400 text-xs">Chưa có cấu trúc ngữ pháp nào trong bể củng cố.</td></tr>`;
    } else {
      grammarKeys.forEach(pid => {
        const item = grammarFsrsPool[pid];
        const isDue = item.nextReview <= now;
        const tr = document.createElement('tr');
        tr.className = "hover:bg-stone-50 transition";
        tr.innerHTML = `
          <td class="px-4 py-3">
            <span class="font-mono text-xs font-bold text-purple-800 cursor-pointer hover:underline"
                  onclick="openGrammarCard('${pid}', '')">${pid}</span>
            <p class="text-[11px] text-stone-500 truncate max-w-xs">${item.snapshotAnchors || ''}</p>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-1 flex-wrap">
              ${(() => {
                const totalSteps = fsrsConfig.fsrsSteps || 4;
                if (totalSteps >= 999) {
                  return `<span class="w-6 h-6 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center justify-center">${item.streak || 0}</span><span class="text-[10px] text-stone-400 font-mono">/∞</span>`;
                }
                return Array.from({length: totalSteps}, (_, i) => i + 1)
                  .map(s => `<span class="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${s <= item.streak ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}">${s}</span>`).join('');
              })()}
            </div>
          </td>
          <td class="px-4 py-3">
            <span class="px-2 py-0.5 text-xs font-bold rounded-lg ${isDue ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-600'}">
              ${isDue ? '⚡ Cần ôn' : '⏳ Đang đếm'}
            </span>
          </td>
          <td class="px-4 py-3 text-xs text-stone-500 font-mono">${new Date(item.nextReview).toLocaleDateString('vi-VN')}</td>
          <td class="px-4 py-3 text-right">
            <button onclick="graduateGrammarFsrsManually('${pid}')" class="text-xs text-emerald-600 hover:underline font-semibold mr-2">Tốt nghiệp</button>
            <button onclick="removeGrammarFsrsItem('${pid}')" class="text-xs text-rose-500 hover:underline">Xóa</button>
          </td>
        `;
        grammarTbody.appendChild(tr);
      });
    }
  }

  // ========== SENTENCE FSRS TABLE ==========
  const snTbody = document.getElementById('review-sentence-table-body');
  if (snTbody) {
    snTbody.innerHTML = '';
    const snKeys = Object.keys(sentenceFsrsPool).filter(id => !sentenceFsrsPool[id].deleted);
    snKeys.sort((a, b) => (sentenceFsrsPool[a].nextReview || 0) - (sentenceFsrsPool[b].nextReview || 0));
    if (snKeys.length === 0) {
      snTbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-stone-400 text-xs">Chưa có Sentence Card nào trong bể củng cố.</td></tr>`;
    } else {
      snKeys.forEach(id => {
        const item = sentenceFsrsPool[id];
        const isDue = item.nextReview <= now;
        const tr = document.createElement('tr');
        tr.className = "hover:bg-stone-50 transition";
        const anchorsDisplay = (item.snapshotAnchors || []).join(' · ') || '--';
        const currentShort = (item.snapshotCurrent || '').substring(0, 60);
        tr.innerHTML = `
          <td class="px-4 py-3">
            <span class="font-mono text-xs font-bold text-rose-800 cursor-pointer hover:underline"
                  onclick="openSentenceCard('${id}')">${id}</span>
            <p class="text-[11px] text-stone-500 truncate max-w-xs font-english mt-0.5">${currentShort}${(item.snapshotCurrent || '').length > 60 ? '...' : ''}</p>
          </td>
          <td class="px-4 py-3 text-xs text-purple-800 font-mono max-w-xs truncate" title="${anchorsDisplay}">${anchorsDisplay}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-1 flex-wrap">
              ${(() => {
                const totalSteps = fsrsConfig.fsrsSteps || 4;
                if (totalSteps >= 999) {
                  return `<span class="w-6 h-6 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center justify-center">${item.streak || 0}</span><span class="text-[10px] text-stone-400 font-mono">/∞</span>`;
                }
                return Array.from({length: totalSteps}, (_, i) => i + 1)
                  .map(s => `<span class="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${s <= item.streak ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}">${s}</span>`).join('');
              })()}
            </div>
          </td>
          <td class="px-4 py-3">
            <span class="px-2 py-0.5 text-xs font-bold rounded-lg ${isDue ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-600'}">
              ${isDue ? '⚡ Cần ôn' : '⏳ Đang đếm'}
            </span>
          </td>
          <td class="px-4 py-3 text-xs text-stone-500 font-mono">${new Date(item.nextReview).toLocaleDateString('vi-VN')}</td>
          <td class="px-4 py-3 text-right">
            <button onclick="graduateSentenceFsrsManually('${id}')" class="text-xs text-emerald-600 hover:underline font-semibold mr-2">Tốt nghiệp</button>
            <button onclick="removeSentenceFsrsItem('${id}')" class="text-xs text-rose-500 hover:underline">Xóa</button>
          </td>
        `;
        snTbody.appendChild(tr);
      });
    }
  }

  const subSnBadge = document.getElementById('badge-subtab-sn');
  if (subSnBadge) {
    const snCount = Object.keys(sentenceFsrsPool).filter(id => !sentenceFsrsPool[id].deleted).length;
    subSnBadge.innerText = snCount;
  }

  docsContainer.innerHTML = '';
  const readyDocs = docs.filter(d => {
    if (!d.testStatus || !d.testStatus.tested) return false;
    const check = checkDocDueEligibility(d);
    return check.eligible && check.totalTracked > 0;
  });
  if (readyDocs.length === 0) {
    docsContainer.innerHTML = `<div class="col-span-full py-10 text-center text-stone-400 bg-white rounded-2xl border border-stone-200"><span class="text-3xl block mb-2">📚</span><p class="text-xs font-medium text-stone-600">Chưa có bài đọc nào đạt ngưỡng > ${fsrsConfig.retestDueThreshold}%.</p></div>`;
  } else {
    readyDocs.forEach(d => {
      const check = checkDocDueEligibility(d);
      const card = document.createElement('div');
      card.className = "bg-white p-4 rounded-2xl border border-rose-200 shadow-sm flex items-center justify-between gap-3";
      card.innerHTML = `
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="font-bold text-sm text-stone-900 truncate font-englishSans">${d.title}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">${check.duePercent.toFixed(0)}%</span>
          </div>
          <p class="text-xs text-stone-400 mt-0.5">${check.totalDue} / ${check.totalTracked} mục tới hạn</p>
        </div>
        <button onclick="readDoc('${d.id}'); startTestMode();" class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex-shrink-0">Tái thẩm định</button>
      `;
      docsContainer.appendChild(card);
    });
  }

  const subHzBadge = document.getElementById('badge-subtab-hz');
  const subVcBadge = document.getElementById('badge-subtab-vc');
  const subGmBadge = document.getElementById('badge-subtab-gm');
  const subDocsBadge = document.getElementById('badge-subtab-docs');
  if (subHzBadge) subHzBadge.innerText = hzKeys.length;
  if (subVcBadge) subVcBadge.innerText = vcKeys.length;
  if (subGmBadge) {
    const gmCount = Object.keys(grammarFsrsPool).filter(pid => !grammarFsrsPool[pid].deleted).length;
    subGmBadge.innerText = gmCount;
  }
  if (subDocsBadge) subDocsBadge.innerText = readyDocs.length;
}

function graduateFsrsItemManually(type, key) {
  if (fsrsPool[type] && fsrsPool[type][key]) {
    softDeleteFsrsItem(type, key, 'graduated');
    touch();
    saveAllData();
    renderReviewTables();
    updateBadges();
    showToast(`Đã tốt nghiệp mục "${key}"!`, "success");
  }
}

function removeFsrsItem(type, key) {
  showConfirmModal(`Xóa mục "${key}" khỏi danh sách củng cố?`, () => {
    softDeleteFsrsItem(type, key, 'manual');
    touch();
    saveAllData();
    renderReviewTables();
    updateBadges();
    showToast(`Đã xóa "${key}"`, "info");
  });
}

function openFsrsSettingsModal() {
  document.getElementById('cfg-rank-threshold').value = fsrsConfig.rankThreshold || 2500;
  document.getElementById('cfg-corruption-threshold').value = fsrsConfig.corruptionThreshold || 5.0;
  document.getElementById('cfg-retest-due-threshold').value = fsrsConfig.retestDueThreshold || 50.0;
  document.getElementById('cfg-fsrs-steps').value = String(fsrsConfig.fsrsSteps || 4);
  openModal('modal-fsrs-settings');
}

function saveFsrsSettings(e) {
  e.preventDefault();
  fsrsConfig.rankThreshold = parseInt(document.getElementById('cfg-rank-threshold').value, 10) || 2500;
  fsrsConfig.corruptionThreshold = parseFloat(document.getElementById('cfg-corruption-threshold').value) || 5.0;
  fsrsConfig.retestDueThreshold = parseFloat(document.getElementById('cfg-retest-due-threshold').value) || 50.0;
  fsrsConfig.fsrsSteps = parseInt(document.getElementById('cfg-fsrs-steps').value, 10) || 4;
  saveAllData();
  closeModal('modal-fsrs-settings');
  renderReviewTables();
  const label = fsrsConfig.fsrsSteps >= 999 ? "Vô hạn" : `${fsrsConfig.fsrsSteps} bước`;
  showToast(`Đã lưu cấu hình! Số bước tốt nghiệp: ${label}`, "success");
}```

```javascript: js/07-fsrs-flashcard.js
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
}```

```javascript: js/08-test-mode.js
/* ============================================================
 * FILE: 08-test-mode.js
 * DOMAIN: Chế độ thẩm định bài đọc (Test Mode)
 * DEPENDS: 00-config, 02-text-utils, 03-state, 04-ui-shared,
 *          06-fsrs-core, 15-reader
 * ============================================================ */

function startTestMode() {
  const currentDoc = docs.find(d => d.id === activeDocId && !d.hidden);
  if (!currentDoc) { showToast("Vui lòng chọn bài đọc hợp lệ", "warning"); return; }
  const now = Date.now();
  const status = currentDoc.testStatus || {};
  if (status.failed && !status.retested && status.lockedUntil && now < status.lockedUntil) {
    const hoursLeft = Math.ceil((status.lockedUntil - now) / (1000 * 60 * 60));
    showToast(`Bài đọc đang trong thời gian nghỉ tái thẩm định! Vui lòng quay lại sau ${hoursLeft} giờ.`, "warning");
    return;
  }
  if (status.retested) {
    const check = checkDocDueEligibility(currentDoc);
    if (!check.eligible) {
      showToast(`Bài đọc đã đạt thẩm định. Chỉ có thể tái kiểm tra khi trên ${fsrsConfig.retestDueThreshold}% mục củng cố tới kỳ hạn FSRS.`, "info");
      return;
    }
  }
  isTestActive = true;
  testSessionLookups = { words: new Set(), manualMarkedKnown: new Set() };
  const banner = document.getElementById('test-mode-banner');
  const badgeType = document.getElementById('test-badge-type');
  const cardWrapper = document.getElementById('reader-card-wrapper');
  if (banner) banner.classList.remove('hidden');
  if (cardWrapper) cardWrapper.classList.add('in-test-mode');
  if (badgeType) badgeType.innerText = status.tested ? (status.failed ? "Tái thẩm định (Lần 1)" : "Kiểm tra định kỳ") : "Thẩm định lần đầu";
  updateTestLiveStats();
  renderReader();
  showToast("Đã kích hoạt Chế độ Thẩm định!", "info");
}

function cancelTestMode() {
  isTestActive = false;
  testSessionLookups.words.clear();
  testSessionLookups.manualMarkedKnown.clear();
  document.getElementById('test-mode-banner').classList.add('hidden');
  document.getElementById('reader-card-wrapper').classList.remove('in-test-mode');
  renderReader();
  showToast("Đã hủy chế độ thẩm định.", "info");
}

function updateTestLiveStats() {
  if (!isTestActive) return;
  const currentDoc = docs.find(d => d.id === activeDocId);
  if (!currentDoc) return;
  const wordsElem = document.getElementById('test-lookup-words-count');
  const ratioElem = document.getElementById('test-current-ratio');
  const words = currentDoc.content.trim().split(/\s+/);
  const uniqueWordsInDoc = new Set();
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned) uniqueWordsInDoc.add(cleaned);
  });
  const totalDistinct = uniqueWordsInDoc.size;
  const activeLookedWords = Array.from(testSessionLookups.words).filter(w => !testSessionLookups.manualMarkedKnown.has(w));
  const totalLooked = activeLookedWords.length;
  const ratio = totalDistinct > 0 ? (totalLooked / totalDistinct) * 100 : 0;
  if (wordsElem) wordsElem.innerText = activeLookedWords.length;
  if (ratioElem) ratioElem.innerText = `${ratio.toFixed(1)}%`;
}

function registerTestLookup(type, key) {
  if (!isTestActive) return;
  const k = (key || '').toLowerCase();
  testSessionLookups.words.add(k);
  if (!testSessionLookups.manualMarkedKnown.has(k)) {
    if (!statusDb.vocab) statusDb.vocab = {};
    statusDb.vocab[k] = 2;
    if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
    statusTimestamps.vocab[k] = Date.now();
  }
  updateTestLiveStats();
  saveAllData();
}

async function submitPartialTest() {
  const currentDoc = docs.find(d => d.id === activeDocId);
  if (!currentDoc) return;

  const confirmed = await new Promise(resolve => {
    showConfirmModal(
      "Nộp bài giữa chừng? Chỉ các từ bạn ĐÃ tra cứu mới được ghi nhận. Từ chưa tra sẽ giữ nguyên trạng thái.",
      () => resolve(true),
      () => resolve(false)
    );
  });
  if (!confirmed) return;

  const words = currentDoc.content.trim().split(/\s+/);
  const uniqueWordsInDoc = new Set();
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned) uniqueWordsInDoc.add(cleaned);
  });
  const totalDistinct = uniqueWordsInDoc.size;

  const validLookedWords = Array.from(testSessionLookups.words).filter(w => !testSessionLookups.manualMarkedKnown.has(w));
  const queuedToFsrs = [];
  const now = Date.now();
  validLookedWords.forEach(word => {
    const rank = getItemRank('vocab', word);
    if (rank <= fsrsConfig.rankThreshold) {
      if (!fsrsPool.vocab[word]) {
        fsrsPool.vocab[word] = { streak: 0, interval: 1, nextReview: now, lastReview: now, usedSentences: [], rank };
      } else {
        fsrsPool.vocab[word].streak = 0;
        fsrsPool.vocab[word].nextReview = now;
      }
      queuedToFsrs.push({ type: 'vocab', key: word, rank });
    }
  });

  const totalLookedCount = validLookedWords.length;
  const corruptionRate = totalDistinct > 0 ? (totalLookedCount / totalDistinct) * 100 : 0;

  if (!currentDoc.testStatus) {
    currentDoc.testStatus = { tested: false, lastTestDate: null, corruptionRate: 0, failed: false, lockedUntil: null, retested: false, trackedItems: [] };
  }
  currentDoc.testStatus.corruptionRate = corruptionRate;
  currentDoc.testStatus.lastTestDate = now;
  const newTracked = queuedToFsrs.map(x => `${x.type}:${x.key}`);
  const existingTracked = currentDoc.testStatus.trackedItems || [];
  currentDoc.testStatus.trackedItems = Array.from(new Set([...existingTracked, ...newTracked]));

  isTestActive = false;
  document.getElementById('test-mode-banner').classList.add('hidden');
  document.getElementById('reader-card-wrapper').classList.remove('in-test-mode');
  testSessionLookups.words.clear();
  testSessionLookups.manualMarkedKnown.clear();

  await saveAllData();
  renderReader();
  showToast(`📝 Đã nộp bài: ${totalLookedCount} mục tra cứu đã ghi nhận vào FSRS. Từ chưa tra giữ nguyên trạng thái.`, "success");
}

async function finishTestReading() {
  const currentDoc = docs.find(d => d.id === activeDocId);
  if (!currentDoc) return;
  const words = currentDoc.content.trim().split(/\s+/);
  const uniqueWordsInDoc = new Set();
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned) uniqueWordsInDoc.add(cleaned);
  });
  const totalDistinct = uniqueWordsInDoc.size;

  const tsNow = Date.now();
  if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
  uniqueWordsInDoc.forEach(w => {
    if (!testSessionLookups.words.has(w)) {
      const currentStatus = getLingqStatus('vocab', w);
      if (currentStatus !== 4) {
        statusDb.vocab[w] = 4;
        statusTimestamps.vocab[w] = tsNow;
      }
    }
  });

  const validLookedWords = Array.from(testSessionLookups.words).filter(w => !testSessionLookups.manualMarkedKnown.has(w));
  const queuedToFsrs = [];
  const now = Date.now();
  validLookedWords.forEach(word => {
    const rank = getItemRank('vocab', word);
    if (rank <= fsrsConfig.rankThreshold) {
      if (!fsrsPool.vocab[word]) {
        fsrsPool.vocab[word] = { streak: 0, interval: 1, nextReview: now, lastReview: now, usedSentences: [], rank };
      } else {
        fsrsPool.vocab[word].streak = 0;
        fsrsPool.vocab[word].nextReview = now;
      }
      queuedToFsrs.push({ type: 'vocab', key: word, rank });
    }
  });

  const totalLookedCount = validLookedWords.length;
  const corruptionRate = totalDistinct > 0 ? (totalLookedCount / totalDistinct) * 100 : 0;
  const isFailed = corruptionRate > fsrsConfig.corruptionThreshold;
  const wasFailedBefore = currentDoc.testStatus && currentDoc.testStatus.failed;
  const isRetestRun = wasFailedBefore && !currentDoc.testStatus.retested;

  if (isRetestRun) {
    applyRetestEffectOnFsrs(currentDoc);
    currentDoc.testStatus = { tested: true, lastTestDate: now, corruptionRate, failed: isFailed, lockedUntil: null, retested: true, trackedItems: queuedToFsrs.map(x => `${x.type}:${x.key}`) };
  } else {
    currentDoc.testStatus = { tested: true, lastTestDate: now, corruptionRate, failed: isFailed, lockedUntil: isFailed ? (now + 24 * 60 * 60 * 1000) : null, retested: false, trackedItems: queuedToFsrs.map(x => `${x.type}:${x.key}`) };
  }
  isTestActive = false;
  document.getElementById('test-mode-banner').classList.add('hidden');
  document.getElementById('reader-card-wrapper').classList.remove('in-test-mode');
  await saveAllData();
  renderReader();
  showTestResultModal(corruptionRate, isFailed, totalLookedCount, queuedToFsrs, isRetestRun);
}

function showTestResultModal(corruptionRate, isFailed, totalLookedCount, queuedToFsrs, isRetestRun) {
  const header = document.getElementById('test-result-header');
  const icon = document.getElementById('test-result-icon');
  const title = document.getElementById('test-result-title');
  const sub = document.getElementById('test-result-sub');
  const rateElem = document.getElementById('res-corruption-rate');
  const countElem = document.getElementById('res-lookedup-count');
  const fsrsElem = document.getElementById('res-fsrs-added-count');
  const feedback = document.getElementById('test-result-feedback');
  const queuedBox = document.getElementById('res-queued-items-box');
  rateElem.innerText = `${corruptionRate.toFixed(1)}%`;
  countElem.innerText = totalLookedCount;
  fsrsElem.innerText = queuedToFsrs.length;
  queuedBox.innerHTML = '';
  if (queuedToFsrs.length === 0) {
    queuedBox.innerHTML = `<span class="text-stone-400 text-xs italic">Không có mục nào thuộc Rank ≤ ${fsrsConfig.rankThreshold}.</span>`;
  } else {
    queuedToFsrs.forEach(item => {
      const tag = document.createElement('span');
      tag.className = "inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-stone-200 rounded-lg text-xs";
      tag.innerHTML = `<b>${item.key}</b> <span class="text-[10px] text-stone-400">#${item.rank}</span>`;
      queuedBox.appendChild(tag);
    });
  }
  if (isFailed) {
    header.className = "p-6 bg-gradient-to-r from-rose-900 to-crimson-800 text-white text-center";
    icon.innerText = "⚠️";
    title.innerText = "Chưa Đạt Ngưỡng Thẩm Định";
    sub.innerText = `Tỉ lệ khuyết thiếu (${corruptionRate.toFixed(1)}%) vượt quá mức cho phép (${fsrsConfig.corruptionThreshold}%)`;
    feedback.className = "p-3.5 rounded-2xl text-xs leading-relaxed bg-rose-50 border border-rose-200 text-rose-900";
    feedback.innerHTML = `<b>Đã kích hoạt đợt củng cố!</b>${!isRetestRun ? `<br>⏰ Bạn có thể làm lại sau <b>24 giờ nữa</b>.` : `<br>Bài đọc đã hoàn thành đợt tái thẩm định.`}`;
  } else {
    header.className = "p-6 bg-gradient-to-r from-emerald-800 to-teal-700 text-white text-center";
    icon.innerText = "🎉";
    title.innerText = "Thẩm Định Thành Công!";
    sub.innerText = `Tỉ lệ khuyết thiếu đạt chuẩn: ${corruptionRate.toFixed(1)}% (≤ ${fsrsConfig.corruptionThreshold}%)`;
    feedback.className = "p-3.5 rounded-2xl text-xs leading-relaxed bg-emerald-50 border border-emerald-200 text-emerald-900";
    feedback.innerHTML = `<b>Xuất sắc!</b> Toàn bộ các từ chưa tra cứu đã được ghi nhận vào trạng thái <b>Đã biết</b>.`;
  }
  openModal('modal-test-result');
}```

```javascript: js/09-grammar-engine.js
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
}```

```javascript: js/10-grammar-ui.js
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
}```

```javascript: js/11-grammar-fsrs.js
/* ============================================================
 * FILE: 11-grammar-fsrs.js
 * DOMAIN: Grammar FSRS helpers
 * DEPENDS: 03-state, 04-ui-shared, 06-fsrs-core, 09-grammar-engine
 * ============================================================ */

function getGrammarFsrsKey(patternId) {
  return `grammar::${patternId}`;
}

function isGrammarPatternInFsrs(patternId) {
  const item = grammarFsrsPool[patternId];
  return item && !item.deleted;
}

function softDeleteGrammarFsrs(patternId, reason = 'manual') {
  if (!grammarFsrsPool[patternId]) return false;
  const now = Date.now();
  grammarFsrsPool[patternId] = {
    ...grammarFsrsPool[patternId],
    deleted: true,
    deletedAt: now,
    updatedAt: now,
    deleteReason: reason
  };
  return true;
}

function quickAddGrammarToFsrs(patternId, exampleSentence) {
  if (!patternId) return;
  const p = grammarDb._patterns[patternId];
  if (!p) { showToast("Không tìm thấy cấu trúc này!", "warning"); return; }

  const now = Date.now();
  const existing = grammarFsrsPool[patternId];
  const exampleClean = (exampleSentence || '').trim();

  if (existing && !existing.deleted) {
    existing.streak = 0;
    existing.nextReview = now;
    existing.interval = 1;
    existing.lastReview = now;
    existing.updatedAt = now;
    if (exampleClean) existing.usedSentences = [exampleClean];
    showToast(`🔄 "${patternId}" đã được reset trong bể FSRS ngữ pháp.`, "info");
  } else {
    grammarFsrsPool[patternId] = {
      streak: 0,
      interval: 1,
      nextReview: now,
      lastReview: now,
      usedSentences: exampleClean ? [exampleClean] : (p.examples || []).slice(0, 1),
      updatedAt: now,
      deleted: false,
      deletedAt: 0,
      rank: 0,
      snapshotType: p.type || 'pair',
      snapshotMeaning: p.meaning || '',
      snapshotLevel: p.level || '',
      snapshotNotes: p.notes || '',
      snapshotAnchors: getGrammarPatternDisplay(p)
    };
    showToast(`🎯 Đã ném cấu trúc "${patternId}" vào bể FSRS ngữ pháp!`, "success");
  }

  touch();
  saveAllData();
  updateBadges();
  closeModal('modal-grammar-card');
  if (!document.getElementById('view-review').classList.contains('hidden')) {
    renderReviewTables();
  }
}

function graduateGrammarFsrsManually(patternId) {
  if (grammarFsrsPool[patternId]) {
    softDeleteGrammarFsrs(patternId, 'graduated');
    touch();
    saveAllData();
    renderReviewTables();
    updateBadges();
    showToast(`Đã tốt nghiệp cấu trúc "${patternId}"!`, "success");
  }
}

function removeGrammarFsrsItem(patternId) {
  showConfirmModal(`Xóa cấu trúc "${patternId}" khỏi danh sách củng cố?`, () => {
    softDeleteGrammarFsrs(patternId, 'manual');
    touch();
    saveAllData();
    renderReviewTables();
    updateBadges();
    showToast(`Đã xóa "${patternId}"`, "info");
  });
}```

```javascript: js/12-structure-select.js
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
}```

```javascript: js/13-sentence-mining.js
/* ============================================================
 * FILE: 13-sentence-mining.js
 * DOMAIN: Sentence Mining (DB, FSRS, table, card, import)
 * DEPENDS: 03-state, 04-ui-shared, 06-fsrs-core
 * ============================================================ */

function generateSentenceId() {
  const existing = sentenceDb || {};
  let id;
  let attempts = 0;
  const MAX_ATTEMPTS = 100;

  do {
    const num = Math.floor(Math.random() * 9999) + 1;
    id = 'S' + String(num).padStart(4, '0');
    attempts++;
    if (attempts > MAX_ATTEMPTS) {
      id = 'S' + Date.now().toString().slice(-6);
      break;
    }
  } while (existing[id] !== undefined);

  return id;
}

function softDeleteSentenceFsrs(sentenceId, reason = 'manual') {
  if (!sentenceFsrsPool[sentenceId]) return false;
  const now = Date.now();
  sentenceFsrsPool[sentenceId] = {
    ...sentenceFsrsPool[sentenceId],
    deleted: true,
    deletedAt: now,
    updatedAt: now,
    deleteReason: reason
  };
  return true;
}

function graduateSentenceFsrsManually(sentenceId) {
  if (sentenceFsrsPool[sentenceId]) {
    softDeleteSentenceFsrs(sentenceId, 'graduated');
    touch();
    saveAllData();
    renderReviewTables();
    updateBadges();
    showToast(`Đã tốt nghiệp Sentence "${sentenceId}"!`, "success");
  }
}

function removeSentenceFsrsItem(sentenceId) {
  showConfirmModal(`Xóa Sentence "${sentenceId}" khỏi danh sách củng cố?`, () => {
    softDeleteSentenceFsrs(sentenceId, 'manual');
    touch();
    saveAllData();
    renderReviewTables();
    updateBadges();
    showToast(`Đã xóa "${sentenceId}"`, "info");
  });
}

function validateSentenceCard(id, card) {
  if (!id || typeof id !== 'string') {
    return { valid: false, reason: 'ID không phải string' };
  }
  if (!/^S\d{4}$/.test(id)) {
    return { valid: false, reason: `ID "${id}" sai format (phải là S + đúng 4 chữ số, VD: S0001)` };
  }
  if (!card || typeof card !== 'object' || Array.isArray(card)) {
    return { valid: false, reason: 'Card không phải object' };
  }
  if (!card.sentenceMeaning || typeof card.sentenceMeaning !== 'string' || !card.sentenceMeaning.trim()) {
    return { valid: false, reason: 'Thiếu "sentenceMeaning"' };
  }
  if (!Array.isArray(card.anchorMeanings)) {
    return { valid: false, reason: 'Thiếu hoặc sai "anchorMeanings" (phải là array)' };
  }
  return { valid: true };
}

function importSentenceJsonValidated(parsed) {
  const report = {
    total: 0,
    accepted: [],
    rejected: []
  };

  if (!parsed || typeof parsed !== 'object') {
    report.rejected.push({ id: '(root)', reason: 'JSON gốc không phải object' });
    return report;
  }

  const sentences = parsed._sentences || parsed;
  if (!sentences || typeof sentences !== 'object') {
    report.rejected.push({ id: '(root)', reason: 'Thiếu "_sentences" hoặc không phải object' });
    return report;
  }

  Object.entries(sentences).forEach(([id, card]) => {
    report.total++;

    const check = validateSentenceCard(id, card);
    if (!check.valid) {
      report.rejected.push({ id, reason: check.reason });
      return;
    }

    const existing = sentenceDb[id];
    if (!existing) {
      report.rejected.push({
        id,
        reason: 'ID chưa tồn tại trong DB (chỉ nhận cập nhật card đã có)'
      });
      return;
    }

    const expected = (existing.anchors || []).length;
    const received = card.anchorMeanings.length;
    if (expected !== received) {
      report.rejected.push({
        id,
        reason: `anchorMeanings có ${received} phần tử, nhưng card có ${expected} neo. Bỏ qua để tránh lệch.`
      });
      return;
    }

    sentenceDb[id] = {
      ...existing,
      sentenceMeaning: card.sentenceMeaning.trim(),
      anchorMeanings: card.anchorMeanings.map(m => String(m || '').trim()),
      grammarNote: (card.grammarNote || '').trim(),
      needsData: false,
      updatedAt: Date.now()
    };

    if (sentenceFsrsPool[id] && !sentenceFsrsPool[id].deleted) {
      sentenceFsrsPool[id].snapshotMeaning = sentenceDb[id].sentenceMeaning;
      sentenceFsrsPool[id].snapshotAnchorMeanings = sentenceDb[id].anchorMeanings;
      sentenceFsrsPool[id].updatedAt = Date.now();
    }

    report.accepted.push({ id, action: 'overwritten' });
  });

  if (report.accepted.length > 0) {
    touch();
    saveAllData();
  }

  return report;
}

// ==================== SENTENCE TABLE RENDER ====================
function renderSentenceTable() {
  const tbody = document.getElementById('sentence-table-body');
  if (!tbody) return;

  const query = (document.getElementById('sentence-search-input')?.value || '').trim().toLowerCase();
  const entries = Object.entries(sentenceDb || {}).map(([id, s]) => ({ id, ...s }));

  const totalEl = document.getElementById('sn-stat-total');
  const pendingEl = document.getElementById('sn-stat-pending');
  const inFsrsEl = document.getElementById('sn-stat-in-fsrs');
  const anchorsEl = document.getElementById('sn-stat-anchors');
  const navBadge = document.getElementById('sentence-count-badge-nav');
  const headerBadge = document.getElementById('sentence-count-badge');

  const pendingCount = entries.filter(e => e.needsData).length;
  const inFsrsCount = Object.keys(sentenceFsrsPool || {}).filter(id => !sentenceFsrsPool[id].deleted).length;
  const totalAnchors = entries.reduce((sum, e) => sum + (e.anchors?.length || 0), 0);

  if (totalEl) totalEl.innerText = entries.length;
  if (pendingEl) pendingEl.innerText = pendingCount;
  if (inFsrsEl) inFsrsEl.innerText = inFsrsCount;
  if (anchorsEl) anchorsEl.innerText = totalAnchors;
  if (navBadge) navBadge.innerText = entries.length;
  if (headerBadge) headerBadge.innerText = `${entries.length} câu`;

  let filtered = entries.filter(e => {
    if (!query) return true;
    const hay = [
      e.id, e.current, e.prev, e.next, e.sentenceMeaning,
      ...(e.anchors || []), ...(e.anchorMeanings || []), e.grammarNote
    ].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(query);
  });

  filtered.sort((a, b) => {
    if (a.needsData !== b.needsData) return a.needsData ? -1 : 1;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-stone-400 text-xs">Chưa có Sentence Card nào. Vào tab Đọc → bật "Ghép cấu trúc" → chọn neo → bấm 📸 Sentence.</td></tr>`;
    return;
  }

  filtered.forEach(s => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-stone-50 transition";

    const anchorsDisplay = (s.anchors || []).join(' · ') || '--';
    const meaningDisplay = s.needsData
      ? `<span class="text-amber-600 text-xs italic">Chờ AI nạp nghĩa...</span>`
      : `<span class="text-stone-800 text-xs">${(s.sentenceMeaning || '').substring(0, 80)}${(s.sentenceMeaning || '').length > 80 ? '...' : ''}</span>`;

    const statusBadge = s.needsData
      ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">Chờ nạp</span>`
      : `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">Sẵn sàng</span>`;

    const inFsrs = sentenceFsrsPool[s.id] && !sentenceFsrsPool[s.id].deleted;
    const fsrsBadge = inFsrs ? `<span class="ml-1 text-[10px] text-rose-600" title="Đang trong FSRS">🎯</span>` : '';

    tr.innerHTML = `
      <td class="px-4 py-3">
        <span class="font-mono text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 cursor-pointer hover:bg-rose-100"
              onclick="openSentenceCard('${s.id}')">${s.id}</span>
      </td>
      <td class="px-4 py-3 font-english text-xs text-stone-700 max-w-md">
        <p class="line-clamp-2" title="${(s.current || '').replace(/"/g, '&quot;')}">${s.current || '--'}</p>
        <p class="text-[10px] text-stone-400 mt-0.5">Từ: ${s.docTitle || '--'}</p>
      </td>
      <td class="px-4 py-3 text-xs text-purple-800 font-mono">${anchorsDisplay}</td>
      <td class="px-4 py-3">${meaningDisplay}</td>
      <td class="px-4 py-3">${statusBadge}${fsrsBadge}</td>
      <td class="px-4 py-3 text-right whitespace-nowrap">
        <button onclick="openSentenceCard('${s.id}')" class="text-xs text-stone-600 hover:text-rose-700 mr-2">Xem</button>
        <button onclick="deleteSentenceCard('${s.id}')" class="text-xs text-red-500 hover:text-red-700">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==================== SENTENCE CARD MODAL ====================
function openSentenceCard(sentenceId) {
  const s = sentenceDb[sentenceId];
  if (!s) { showToast("Không tìm thấy Sentence Card!", "warning"); return; }

  let modal = document.getElementById('modal-sentence-card');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-sentence-card';
    modal.className = 'fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden';
    modal.innerHTML = `
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-rose-200 overflow-hidden flex flex-col max-h-[88vh]">
        <div class="p-4 border-b border-rose-200 flex items-center justify-between bg-rose-50">
          <h3 class="font-bold text-sm text-rose-900 flex items-center gap-1.5"><span>📸</span> Sentence Card</h3>
          <button onclick="closeModal('modal-sentence-card')" class="text-stone-400 hover:text-stone-700 text-xl leading-none">&times;</button>
        </div>
        <div id="sentence-card-body" class="p-5 space-y-4 overflow-y-auto"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const anchorMeaningsHtml = (s.anchors || []).map((anchor, idx) => {
    const meaning = (s.anchorMeanings || [])[idx] || '';
    return `
      <div class="flex items-start gap-2 bg-purple-50 border border-purple-200 rounded-lg p-2.5">
        <span class="font-mono text-xs font-bold text-purple-800 bg-white px-2 py-0.5 rounded border border-purple-300 flex-shrink-0">${anchor}</span>
        <span class="text-xs text-stone-700 flex-1">${meaning || '<i class="text-stone-400">Chưa có nghĩa</i>'}</span>
      </div>
    `;
  }).join('');

  const body = modal.querySelector('#sentence-card-body');
  body.innerHTML = `
    <div>
      <h3 class="font-bold text-lg text-rose-800 flex items-center gap-2">
        <span class="font-mono text-sm bg-rose-100 px-2 py-0.5 rounded">${s.id}</span>
        <span class="text-sm text-stone-500 font-normal">Sentence Card</span>
      </h3>
      <p class="text-xs text-stone-500 mt-1">
        Từ bài: <b>${s.docTitle || '--'}</b>
        ${s.needsData ? '<span class="ml-2 text-amber-600 font-bold">⚠️ Chờ nạp nghĩa</span>' : '<span class="ml-2 text-emerald-600 font-bold">✓ Sẵn sàng</span>'}
      </p>
    </div>
    <div class="bg-amber-50/60 border border-amber-200 rounded-xl p-3 space-y-2">
      <span class="text-[10px] uppercase font-bold text-amber-800 block">Ngữ cảnh:</span>
      ${s.prev ? `<p class="text-xs text-stone-500 italic line-clamp-2">${s.prev}</p>` : ''}
      <p class="font-english text-base font-bold text-stone-900">${s.current}</p>
      ${s.next ? `<p class="text-xs text-stone-500 italic line-clamp-2">${s.next}</p>` : ''}
    </div>
    <div>
      <span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Nghĩa câu:</span>
      <p class="text-sm text-stone-800">${s.sentenceMeaning || '<i class="text-stone-400">Chưa có nghĩa</i>'}</p>
    </div>
    <div>
      <span class="text-[10px] uppercase font-bold text-stone-400 block mb-1.5">Neo trong câu (${(s.anchors || []).length}):</span>
      <div class="space-y-1.5">${anchorMeaningsHtml || '<i class="text-stone-400 text-xs">Không có neo</i>'}</div>
    </div>
    ${s.grammarNote ? `
    <div>
      <span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Ghi chú ngữ pháp:</span>
      <p class="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">${s.grammarNote}</p>
    </div>` : ''}
    <div class="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
      <div class="text-[11px] text-stone-400">
        ${sentenceFsrsPool[s.id] && !sentenceFsrsPool[s.id].deleted
          ? `🎯 Trong FSRS · Chuỗi ${sentenceFsrsPool[s.id].streak || 0}`
          : '⚪ Chưa có trong FSRS'}
      </div>
      <div class="flex items-center gap-2">
        <button onclick="speakText(${JSON.stringify(s.current).replace(/"/g, '&quot;')})"
                class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition">🔊 Đọc câu</button>
        <button onclick="addSentenceToFsrs('${s.id}')"
                class="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-lg transition flex items-center gap-1">🎯 Ném vào FSRS</button>
        <button onclick="closeModal('modal-sentence-card')"
                class="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition">Đóng</button>
      </div>
    </div>
  `;
  openModal('modal-sentence-card');
}

function deleteSentenceCard(sentenceId) {
  showConfirmModal(`Xóa Sentence Card "${sentenceId}"?`, () => {
    delete sentenceDb[sentenceId];
    if (sentenceFsrsPool[sentenceId]) {
      softDeleteSentenceFsrs(sentenceId, 'parent_deleted');
    }
    touch();
    saveAllData();
    renderSentenceTable();
    updateBadges();
    showToast(`Đã xóa "${sentenceId}"`, "info");
  });
}

function addSentenceToFsrs(sentenceId) {
  const s = sentenceDb[sentenceId];
  if (!s) { showToast("Không tìm thấy Sentence Card!", "warning"); return; }
  if (s.needsData) { showToast("Vui lòng nạp nghĩa trước khi ném vào FSRS!", "warning"); return; }

  const now = Date.now();
  const existing = sentenceFsrsPool[sentenceId];

  if (existing && !existing.deleted) {
    existing.snapshotCurrent = s.current;
    existing.snapshotPrev = s.prev || '';
    existing.snapshotNext = s.next || '';
    existing.snapshotMeaning = s.sentenceMeaning || '';
    existing.snapshotAnchors = s.anchors || [];
    existing.snapshotAnchorMeanings = s.anchorMeanings || [];
    existing.updatedAt = now;
    showToast(`♻️ "${sentenceId}" đã có trong FSRS, chỉ cập nhật lại snapshot.`, "info");
  } else {
    sentenceFsrsPool[sentenceId] = {
      streak: 0,
      interval: 1,
      nextReview: now,
      lastReview: now,
      updatedAt: now,
      deleted: false,
      deletedAt: 0,
      snapshotCurrent: s.current,
      snapshotPrev: s.prev || '',
      snapshotNext: s.next || '',
      snapshotMeaning: s.sentenceMeaning || '',
      snapshotAnchors: s.anchors || [],
      snapshotAnchorMeanings: s.anchorMeanings || []
    };
    showToast(`🎯 Đã ném "${sentenceId}" vào bể FSRS!`, "success");
  }

  touch();
  saveAllData();
  updateBadges();
  renderSentenceTable();
  closeModal('modal-sentence-card');
}

// ==================== SCAN MISSING SENTENCE CARDS ====================
function scanMissingSentenceCards() {
  const candidates = [];

  Object.entries(sentenceDb || {}).forEach(([id, s]) => {
    const isMissing =
      s.needsData === true ||
      !s.sentenceMeaning ||
      !s.sentenceMeaning.trim();

    if (!isMissing) return;

    candidates.push({
      token: id,
      type: 'sentence',
      context: {
        current: s.current || '',
        prev: s.prev || '',
        next: s.next || ''
      },
      anchors: s.anchors || [],
      anchorMeanings: s.anchorMeanings || [],
      docTitle: s.docTitle || '',
      docId: s.docId || '',
      label: `[Cần nạp] ${id}`,
      needsData: true
    });
  });

  candidates.sort((a, b) => {
    const ta = sentenceDb[a.token]?.createdAt || 0;
    const tb = sentenceDb[b.token]?.createdAt || 0;
    return tb - ta;
  });

  return candidates;
}```

```javascript: js/14-docs-folders.js
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
}```

```javascript: js/15-reader.js
/* ============================================================
 * FILE: 15-reader.js
 * DOMAIN: Reader render, pagination, bookmark, TTS, zen, font
 * DEPENDS: 02-text-utils, 03-state, 04-ui-shared, 09-grammar-engine,
 *          10-grammar-ui, 12-structure-select
 * ============================================================ */

// ==================== RENDER READER ====================
function renderReader() {
  const container = document.getElementById('reader-content');
  const emptyState = document.getElementById('reader-empty');
  const titleElem = document.getElementById('reader-title');
  const statusTag = document.getElementById('reader-status-tag');
  const testBadge = document.getElementById('doc-test-status-badge');
  const btnStartTest = document.getElementById('btn-start-test-text');
  updateBadges();
  const modeBtnText = document.getElementById('highlight-mode-text');
  const modeBtnIcon = document.getElementById('highlight-mode-icon');
  const floatBtnText = document.getElementById('floating-hl-text');
  const floatBtnIcon = document.getElementById('floating-hl-icon');
  if (highlightMode === 'vocab') {
    if (modeBtnIcon) modeBtnIcon.innerText = '📑';
    if (modeBtnText) modeBtnText.innerText = 'Màu: Từ vựng';
    if (floatBtnIcon) floatBtnIcon.innerText = '📑';
    if (floatBtnText) floatBtnText.innerText = 'Từ vựng';
  } else {
    if (modeBtnIcon) modeBtnIcon.innerText = '🟣';
    if (modeBtnText) modeBtnText.innerText = 'Màu: Ngữ pháp';
    if (floatBtnIcon) floatBtnIcon.innerText = '🟣';
    if (floatBtnText) floatBtnText.innerText = 'Ngữ pháp';
  }
  if (container) container.style.fontSize = `${readerFontSize}px`;
  const indicator = document.getElementById('font-size-indicator');
  if (indicator) indicator.innerText = `${readerFontSize}px`;
  const currentDoc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt) || docs.find(d => !d.hidden && !d.deletedAt);
  if (!currentDoc) {
    container.innerHTML = '';
    container.classList.add('hidden');
    emptyState.classList.remove('hidden');
    titleElem.querySelector('span').innerText = 'Chưa chọn bài đọc';
    statusTag.innerText = '';
    if (testBadge) testBadge.classList.add('hidden');
    return;
  }
  activeDocId = currentDoc.id;
  idbSet('activeDocId', activeDocId);
  container.classList.remove('hidden');
  emptyState.classList.add('hidden');
  titleElem.querySelector('span').innerText = currentDoc.title;
  statusTag.innerText = `Độ dài: ${currentDoc.content.replace(/\s+/g, '').length} ký tự`;
  if (testBadge && currentDoc.testStatus) {
    testBadge.classList.remove('hidden');
    const st = currentDoc.testStatus;
    if (!st.tested) {
      testBadge.className = "text-xs px-2.5 py-0.5 rounded-full font-bold bg-stone-100 text-stone-600 border border-stone-200";
      testBadge.innerText = "Chưa thẩm định";
      if (btnStartTest) btnStartTest.innerText = "Bắt đầu Thẩm định";
    } else if (st.failed) {
      testBadge.className = "text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 border border-rose-300";
      testBadge.innerText = `Chưa đạt (${st.corruptionRate.toFixed(1)}%)`;
      if (btnStartTest) btnStartTest.innerText = "Tái thẩm định";
    } else {
      testBadge.className = "text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300";
      testBadge.innerText = `Đạt chuẩn (${st.corruptionRate.toFixed(1)}%)`;
      if (btnStartTest) btnStartTest.innerText = "Thẩm định lại";
    }
  }
  container.innerHTML = '';

  if (highlightMode === 'grammar') container.classList.add('grammar-mode-active');
  else container.classList.remove('grammar-mode-active');

  if (!paginatedDoc || paginatedDoc.docId !== currentDoc.id) {
    paginatedDoc = buildPagination(currentDoc);
    currentPage = 1;
  }
  if (currentPage > paginatedDoc.pages.length) currentPage = paginatedDoc.pages.length;
  if (currentPage < 1) currentPage = 1;
  const pageData = getCurrentPageLines();
  if (!pageData) { renderPaginationBar(); return; }
  const lines = pageData.lines;
  const pageContent = lines.join('\n');
  const grammarResult = (highlightMode === 'grammar')
    ? detectGrammarForDoc(pageContent)
    : { matchesByLine: {}, tokensByLine: {} };

  lines.forEach((line, lineIdx) => {
    if (!line.trim()) {
      const br = document.createElement('div');
      br.className = "h-4";
      container.appendChild(br);
      return;
    }
    const lineDiv = document.createElement('div');
    lineDiv.className = "flex flex-wrap items-baseline";

    const tokens = grammarResult.tokensByLine[lineIdx] || tokenizeEnglishText(line.trim());

    const wordUnitElements = tokens.map((word, tokenIdx) => {
      if (!word) return null;
      const cleanWord = cleanEnglishWord(word);
      const isEnglish = cleanWord.length > 0;

      if (!isEnglish) {
        const punctSpan = document.createElement('span');
        punctSpan.className = "text-stone-500 mx-1";
        punctSpan.innerText = word;
        return { type: 'punct', el: punctSpan };
      }

      const vocabEntry = getVocabEntry(cleanWord);
      let vocabLvl = getLingqStatus('vocab', cleanWord);
      if (vocabLvl === 1 && vocabEntry && vocabEntry.matchWord && vocabEntry.matchWord !== cleanWord) {
        const baseLvl = getLingqStatus('vocab', vocabEntry.matchWord);
        if (baseLvl > 1) vocabLvl = baseLvl;
      }

      const wordUnit = document.createElement('span');

      if (highlightMode === 'vocab' || highlightMode === 'grammar') {
        wordUnit.className = `word-unit lingq-level-${vocabLvl}`;
        if (vocabLvl < 4 && !vocabEntry) wordUnit.classList.add('needs-data');
      } else {
        wordUnit.className = `word-unit lingq-level-4`;
      }
      wordUnit.dataset.word = cleanWord;

      if (isTestActive && testSessionLookups.words.has(cleanWord)
          && !testSessionLookups.manualMarkedKnown.has(cleanWord)) {
        wordUnit.classList.add('test-looked-up');
      }

      if (showPinyinRuby && vocabEntry && vocabEntry.ipa) {
        const displayIpa = vocabEntry.ipa.split('/').filter(Boolean)[0] || vocabEntry.ipa;
        wordUnit.innerHTML = `<ruby>${word}<rt class="text-[10px] font-sans font-normal text-stone-500">${displayIpa}</rt></ruby>`;
      } else {
        wordUnit.innerText = word;
      }

      attachWordInteractions(wordUnit, cleanWord, lineIdx, tokenIdx);
      return { type: 'word', el: wordUnit };
    });

    const lineMatches = grammarResult.matchesByLine[lineIdx] || [];
    if (highlightMode === 'grammar' && lineMatches.length > 0) {
      applyGrammarHighlightToLine(lineDiv, tokens, wordUnitElements, lineMatches);
    } else {
      wordUnitElements.forEach(w => { if (w) lineDiv.appendChild(w.el); });
    }

    container.appendChild(lineDiv);
  });
  renderPaginationBar();
  updateBookmarkButton();
  updatePageSizeInput();
}

// ==================== PAGINATION ENGINE ====================
function buildPagination(doc) {
  if (!doc || !doc.content) return { docId: null, pages: [] };
  const lines = doc.content.split('\n');
  const pages = [];
  let curLines = [];
  let curCount = 0;
  const countWords = (str) => (str.match(/[A-Za-z]+/g) || []).length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const c = countWords(line);
    if (curCount + c > pageSize && curLines.length > 0) {
      pages.push({ lines: curLines.slice(), charCount: curCount });
      curLines = []; curCount = 0;
    }
    curLines.push(line);
    curCount += c;
  }
  if (curLines.length > 0) pages.push({ lines: curLines.slice(), charCount: curCount });
  return { docId: doc.id, pages };
}

function getCurrentPageLines() {
  if (!paginatedDoc || !paginatedDoc.pages.length) return null;
  return paginatedDoc.pages[Math.min(currentPage - 1, paginatedDoc.pages.length - 1)];
}

function renderPaginationBar() {
  const topBar = document.getElementById('pagination-bar-top');
  const bottomBar = document.getElementById('pagination-bar-bottom');
  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (!doc || !paginatedDoc || paginatedDoc.pages.length <= 1) {
    if (topBar) topBar.classList.add('hidden');
    if (bottomBar) bottomBar.classList.add('hidden');
    return;
  }
  if (topBar) topBar.classList.remove('hidden');
  if (bottomBar) bottomBar.classList.remove('hidden');

  const total = paginatedDoc.pages.length;
  const bm = bookmarks[doc.id];
  let html = `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="gotoPage(${currentPage - 1})">‹ Trước</button>`;
  const show = [];
  if (total <= 7) { for (let i = 1; i <= total; i++) show.push(i); }
  else {
    show.push(1);
    let s = Math.max(2, currentPage - 2), e = Math.min(total - 1, currentPage + 2);
    if (s > 2) show.push('...');
    for (let i = s; i <= e; i++) show.push(i);
    if (e < total - 1) show.push('...');
    show.push(total);
  }
  show.forEach(p => {
    if (p === '...') html += `<span class="px-1 text-stone-400 text-xs font-bold">…</span>`;
    else {
      const isBm = bm && bm.page === p;
      html += `<button class="page-btn ${p === currentPage ? 'active' : ''} ${isBm && p !== currentPage ? 'bookmark-active' : ''}" onclick="gotoPage(${p})">${p}${isBm ? '📍' : ''}</button>`;
    }
  });
  html += `<button class="page-btn" ${currentPage === total ? 'disabled' : ''} onclick="gotoPage(${currentPage + 1})">Sau ›</button>`;
  const info = paginatedDoc.pages[currentPage - 1];
  html += `<span class="text-[10px] font-mono text-stone-500 ml-2 px-2 py-1 bg-stone-100 rounded-md">${info.charCount} từ</span>`;
  if (topBar) topBar.innerHTML = html;
  if (bottomBar) bottomBar.innerHTML = html;
}

function gotoPage(p) {
  if (!paginatedDoc) return;
  currentPage = Math.max(1, Math.min(p, paginatedDoc.pages.length));
  renderReader();
  const w = document.getElementById('reader-card-wrapper');
  if (w) window.scrollTo({ top: w.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
}

function updatePageSize(val) {
  const n = parseInt(val, 10);
  if (isNaN(n) || n < 200) { showToast("Tối thiểu 200 từ", "warning"); return; }
  if (n > 5000) { showToast("Tối đa 5000 từ", "warning"); return; }
  pageSize = n;
  idbSet('pageSize', pageSize);
  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (doc) { paginatedDoc = buildPagination(doc); currentPage = 1; renderReader(); }
  showToast(`Đã đổi thành ${pageSize} từ/trang`, "success");
}

function updatePageSizeInput() {
  const inp = document.getElementById('page-size-input');
  if (inp) inp.value = pageSize;
}

// ==================== BOOKMARK ENGINE ====================
function saveBookmark(type, key) {
  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (!doc) return;
  bookmarks[doc.id] = { type, word: key, page: currentPage, timestamp: Date.now() };
  idbSet('bookmarks', bookmarks);
  updateBookmarkButton();
}

function updateBookmarkButton() {
  const btn = document.getElementById('bookmark-floating-btn');
  const label = document.getElementById('bm-label-text');
  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (!btn) return;
  const bm = doc ? bookmarks[doc.id] : null;
  if (bm) {
    btn.classList.add('visible');
    if (label) label.innerText = bm.word;
  } else btn.classList.remove('visible');
}

function jumpToBookmark() {
  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (!doc) return;
  const bm = bookmarks[doc.id];
  if (!bm) { showToast("Chưa có bookmark", "info"); return; }
  if (bm.page !== currentPage) { currentPage = bm.page; renderReader(); }
  setTimeout(() => {
    const el = document.querySelector(`.word-unit[data-word="${bm.word}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bookmark-highlight');
      setTimeout(() => el.classList.remove('bookmark-highlight'), 3000);
      showToast(`📍 Đã nhảy tới "${bm.word}"`, "success");
    } else showToast(`Không tìm thấy "${bm.word}"`, "warning");
  }, 250);
}

function clearBookmark() {
  const doc = docs.find(d => d.id === activeDocId && !d.hidden && !d.deletedAt);
  if (!doc || !bookmarks[doc.id]) return;
  delete bookmarks[doc.id];
  idbSet('bookmarks', bookmarks);
  updateBookmarkButton();
  showToast("Đã xóa bookmark", "info");
}

// ==================== TTS ====================
function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
                 || voices.find(v => v.lang === 'en-US')
                 || voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
    window.speechSynthesis.speak(utterance);
  } catch (err) {}
}

function speakCurrentText() {
  const currentDoc = docs.find(d => d.id === activeDocId);
  if (currentDoc) { speakText(currentDoc.content); showToast("Đang phát âm bài đọc tiếng Anh...", "info"); }
}

function adjustFontSize(delta) {
  readerFontSize = Math.max(16, Math.min(48, readerFontSize + delta));
  idbSet('readerFontSize', readerFontSize);
  renderReader();
}

function toggleZenMode() {
  isZenMode = !isZenMode;
  const floatingBtn = document.getElementById('zen-floating-toggle');
  if (isZenMode) {
    document.body.classList.add('zen-active');
    if (floatingBtn) { floatingBtn.classList.remove('hidden'); floatingBtn.classList.add('flex'); }
  } else {
    document.body.classList.remove('zen-active');
    if (floatingBtn) { floatingBtn.classList.add('hidden'); floatingBtn.classList.remove('flex'); }
  }
}

function togglePinyinHelper() {
  showPinyinRuby = !showPinyinRuby;
  idbSet('showPinyinRuby', showPinyinRuby);
  renderReader();
}

function toggleHighlightMode() {
  if (highlightMode === 'vocab') highlightMode = 'grammar';
  else highlightMode = 'vocab';
  idbSet('highlightMode', highlightMode);
  renderReader();
}

function markAllCurrentDocAsKnown() {
  const currentDoc = docs.find(d => d.id === activeDocId && !d.hidden);
  if (!currentDoc) return;

  const words = currentDoc.content.trim().split(/\s+/);
  const uniqueVocab = new Set();
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned) uniqueVocab.add(cleaned);
  });

  let willChange = 0;
  uniqueVocab.forEach(w => { if (getLingqStatus('vocab', w) === 1) willChange++; });

  showConfirmModal(
    `Đánh dấu "Đã biết" (level 4) cho tất cả mục đang ở level 1 (Mới) trong bài này?\n\n` +
    `SẼ GIỮ NGUYÊN:\n` +
    `• Level 2 (Đang học)\n` +
    `• Level 3 (Sắp thuộc)\n` +
    `• Level 4 (Đã biết)\n\n` +
    `Sẽ đổi sang "Đã biết": ${willChange} mục.`,
    async () => {
      const now = Date.now();
      let changedCount = 0;
      uniqueVocab.forEach(word => {
        const lvl = getLingqStatus('vocab', word);
        if (lvl === 1) {
          statusDb.vocab[word] = 4;
          if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
          statusTimestamps.vocab[word] = now;
          changedCount++;
        }
      });
      touch();
      await saveAllData();
      renderReader();
      showToast(`✅ Đã đánh dấu ${changedCount} mục "Mới" thành "Đã biết".`, "success");
    }
  );
}

function resetCurrentDocToNew() {
  const currentDoc = docs.find(d => d.id === activeDocId && !d.hidden);
  if (!currentDoc) { showToast("Vui lòng chọn một bài đọc hợp lệ!", "warning"); return; }

  const words = currentDoc.content.trim().split(/\s+/);
  const uniqueVocab = new Set();
  words.forEach(w => {
    const cleaned = cleanEnglishWord(w);
    if (cleaned) uniqueVocab.add(cleaned);
  });
  const totalItems = uniqueVocab.size;

  showConfirmModal(
    `Đánh dấu toàn bộ từ vựng trong bài này là "Mới"?\n\n` +
    `SẼ GIỮ NGUYÊN:\n` +
    `• Mục đang ở mức 2 (Đang học)\n` +
    `• Mục đang ở mức 3 (Sắp thuộc)\n\n` +
    `Tổng số mục sẽ xét: ${totalItems}`,
    async () => {
      const now = Date.now();
      let changedCount = 0;
      uniqueVocab.forEach(word => {
        const currentLvl = getLingqStatus('vocab', word);
        if (currentLvl !== 2 && currentLvl !== 3) {
          statusDb.vocab[word] = 1;
          if (!statusTimestamps.vocab) statusTimestamps.vocab = {};
          statusTimestamps.vocab[word] = now;
          changedCount++;
        }
      });
      touch();
      await saveAllData();
      renderReader();
      showToast(`🔄 Đã đánh dấu ${changedCount} mục trong bài là "Mới".`, "success");
    }
  );
}```

```javascript: js/16-ai-scan.js
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
}```

```javascript: js/17-backup-sync.js
/* ============================================================
 * FILE: 17-backup-sync.js
 * DOMAIN: Backup/Restore JSON, SupabaseSync, delta sync
 * DEPENDS: 01-storage, 03-state, 04-ui-shared
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
  });
  if (count > 0) console.log(`[Backfill] Đã gán timestamp giả cho ${count} mục cũ.`);
  return count;
}

async function setAllTimestampsToNow() {
  const ok = confirm(
    "⚠️ CẢNH BÁO NGUY HIỂM\n\n" +
    "Hành động này sẽ:\n" +
    "• Gán updatedAt = THỜI ĐIỂM HIỆN TẠI cho TOÀN BỘ dữ liệu local\n" +
    "• Bao gồm: bài đọc, thư mục, từ vựng, FSRS, ngữ pháp\n" +
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
    let pullStats = { docs: 0, folders: 0, vocab: 0, progress: 0 };
    const PAGE_SIZE = 1000;

    // FOLDERS
    const { data: cloudFolders, error: errF } = await sb.from('folders').select('*');
    if (errF) throw errF;
    if (cloudFolders) {
      folders = cloudFolders.filter(row => !row.deleted_at).map(row => ({
        id: row.id, name: row.name,
        createdAt: row.created_at,
        updatedAt: new Date(row.updated_at).getTime(),
        deletedAt: row.deleted_at ? new Date(row.deleted_at).getTime() : null
      }));
      pullStats.folders = folders.length;
    }

    // VOCAB
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

    // DOCS
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

    // USER_PROGRESS
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

    if (!docs.find(d => d.id === activeDocId)) {
      activeDocId = docs.length > 0 ? docs[0].id : null;
    }

    lastSyncedAt = Date.now();
    await idbSet('lastSyncedAt', lastSyncedAt);
    await saveAllData();
    renderReader();
    renderDocList();
    renderVocabTable();
    renderReviewTables();
    updateBadges();

    const summary = 
      `✅ Đã kéo toàn bộ từ cloud:\n\n` +
      `📚 Bài đọc: ${pullStats.docs}\n` +
      `📁 Thư mục: ${pullStats.folders}\n` +
      `📑 Từ vựng: ${pullStats.vocab}\n` +
      `🎯 Tiến độ/FSRS: ${pullStats.progress}`;
    alert(summary);
    showToast(`✅ Đã kéo ${pullStats.vocab} từ từ cloud!`, "success");
  } catch (err) {
    console.error("❌ Lỗi Force Pull All:", err);
    alert("❌ LỖI KÉO DỮ LIỆU:\n\n" + err.message);
    showToast("Lỗi kéo dữ liệu: " + err.message, "error");
  } finally {
    if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
  }
}

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

    // FOLDERS
    const localFolderChanges = folders
      .filter(f => (f.updatedAt || 0) > lastSyncedAt || !f.updatedAt)
      .map(f => {
        f.updatedAt = ensureTs(f.updatedAt);
        return {
          id: f.id, user_id: user.id, name: f.name,
          created_at: f.createdAt || new Date(syncStartTime).toISOString(),
          updated_at: new Date(f.updatedAt).toISOString(),
          deleted_at: f.deletedAt ? new Date(f.deletedAt).toISOString() : null
        };
      });
    if (localFolderChanges.length > 0) {
      const { error } = await sb.from('folders').upsert(localFolderChanges, { onConflict: 'user_id,id' });
      if (error) throw error;
      pushCount += localFolderChanges.length;
    }
    const { data: cloudFolders, error: errFolders } = await sb.from('folders').select('*').gt('updated_at', lastSyncIso);
    if (errFolders) throw errFolders;
    if (cloudFolders) {
      for (const row of cloudFolders) {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const existing = folders.find(f => f.id === row.id);
        const lTime = existing?.updatedAt || 0;
        if (cTime > lTime) {
          if (row.deleted_at) folders = folders.filter(f => f.id !== row.id);
          else {
            const updatedF = { id: row.id, name: row.name, createdAt: row.created_at, updatedAt: cTime };
            if (existing) Object.assign(existing, updatedF);
            else folders.push(updatedF);
          }
          pullCount++;
        }
      }
    }

    // VOCAB
    const localVocabChanges = Object.entries(vocabDb)
      .filter(([_, item]) => (item.updatedAt || 0) > lastSyncedAt || !item.updatedAt)
      .map(([word, item]) => {
        item.updatedAt = ensureTs(item.updatedAt);
        return {
          id: word, user_id: user.id,
          ipa: item.ipa || '',
          pos: item.pos || '',
          meaning: item.meaning || '',
          logic: item.logic || '',
          examples: item.examples || [],
          level_cefr: item.level || '',
          updated_at: new Date(item.updatedAt).toISOString(),
          deleted_at: item.deletedAt ? new Date(item.deletedAt).toISOString() : null
        };
      });
    if (localVocabChanges.length > 0) {
      const CHUNK = 200;
      for (let i = 0; i < localVocabChanges.length; i += CHUNK) {
        const batch = localVocabChanges.slice(i, i + CHUNK);
        const { error } = await sb.from('vocab').upsert(batch, { onConflict: 'user_id,id' });
        if (error) throw error;
      }
      pushCount += localVocabChanges.length;
    }
    const { data: cloudVocab, error: errVocab } = await sb.from('vocab').select('*').gt('updated_at', lastSyncIso);
    if (errVocab) throw errVocab;
    if (cloudVocab) {
      for (const row of cloudVocab) {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const lTime = vocabDb[row.id]?.updatedAt || 0;
        if (cTime > lTime) {
          if (row.deleted_at) delete vocabDb[row.id];
          else {
            vocabDb[row.id] = {
              ipa: row.ipa || row.pinyin || '',
              pos: row.pos || '',
              meaning: row.meaning || '',
              logic: row.logic || '',
              examples: row.examples || [],
              level: row.level_cefr || '',
              updatedAt: cTime
            };
          }
          pullCount++;
        }
      }
    }

    // DOCS
    const localDocChanges = docs
      .filter(d => (d.updatedAt || 0) > lastSyncedAt || !d.updatedAt)
      .map(d => {
        d.updatedAt = ensureTs(d.updatedAt);
        return {
          id: d.id, user_id: user.id, title: d.title, content: d.content,
          folder_id: d.folderId || null, hidden: !!d.hidden,
          test_status: d.testStatus || {},
          updated_at: new Date(d.updatedAt).toISOString(),
          deleted_at: d.deletedAt ? new Date(d.deletedAt).toISOString() : null
        };
      });
    if (localDocChanges.length > 0) {
      const { error } = await sb.from('docs').upsert(localDocChanges, { onConflict: 'user_id,id' });
      if (error) throw error;
      pushCount += localDocChanges.length;
    }
    const { data: cloudDocs, error: errDocs } = await sb.from('docs').select('*').gt('updated_at', lastSyncIso);
    if (errDocs) throw errDocs;
    if (cloudDocs) {
      for (const row of cloudDocs) {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const existing = docs.find(d => d.id === row.id);
        const lTime = existing?.updatedAt || 0;
        if (cTime > lTime) {
          if (row.deleted_at) docs = docs.filter(d => d.id !== row.id);
          else {
            const updatedItem = {
              id: row.id, title: row.title, content: row.content,
              folderId: row.folder_id, hidden: row.hidden,
              testStatus: row.test_status, updatedAt: cTime, createdAt: row.created_at
            };
            if (existing) Object.assign(existing, updatedItem);
            else docs.push(updatedItem);
          }
          pullCount++;
        }
      }
    }

    // USER_PROGRESS
    const progressChanges = [];
    const collectProgress = (type, pool, statusDict, tsDict) => {
      const keys = new Set([...Object.keys(pool || {}), ...Object.keys(statusDict || {})]);
      keys.forEach(k => {
        const fsrs = pool[k];
        let statTime = tsDict[k] || 0;
        let fsrsTime = fsrs?.updatedAt || 0;
        if (statTime <= 1 && statusDict[k]) statTime = tsDict[k] = syncStartTime;
        if (fsrsTime <= 1 && fsrs) fsrsTime = fsrs.updatedAt = syncStartTime;
        const maxTime = Math.max(statTime, fsrsTime);
        if (maxTime > lastSyncedAt) {
          const isActualFsrs = fsrs && !fsrs.deleted;
          const nextReviewIso = (isActualFsrs && fsrs.nextReview > 1000000) ? new Date(fsrs.nextReview).toISOString() : null;
          const lastReviewIso = (isActualFsrs && fsrs.lastReview > 1000000) ? new Date(fsrs.lastReview).toISOString() : null;
          progressChanges.push({
            user_id: user.id, item_type: type, item_key: k,
            level: statusDict[k] || 1,
            streak: isActualFsrs ? (fsrs.streak || 0) : 0,
            interval: isActualFsrs ? (fsrs.interval || 1) : 1,
            next_review: nextReviewIso, last_review: lastReviewIso,
            used_sentences: isActualFsrs ? (fsrs.usedSentences || []) : [],
            rank: isActualFsrs ? (fsrs.rank || 9999) : 9999,
            updated_at: new Date(maxTime).toISOString(),
            deleted_at: fsrs?.deleted ? new Date(fsrs.deletedAt || maxTime).toISOString() : null
          });
        }
      });
    };
    collectProgress('vocab', fsrsPool.vocab, statusDb.vocab, statusTimestamps.vocab);

    if (progressChanges.length > 0) {
      const CHUNK_SIZE = 200;
      for (let i = 0; i < progressChanges.length; i += CHUNK_SIZE) {
        const batch = progressChanges.slice(i, i + CHUNK_SIZE);
        const { error: batchErr } = await sb.from('user_progress').upsert(batch, { onConflict: 'user_id,item_type,item_key' });
        if (batchErr) throw batchErr;
      }
      pushCount += progressChanges.length;
    }

    const { data: cloudProg, error: errProg } = await sb.from('user_progress').select('*').gt('updated_at', lastSyncIso);
    if (errProg) throw errProg;
    if (cloudProg) {
      for (const row of cloudProg) {
        const cTime = new Date(row.updated_at).getTime();
        if (cTime > maxCloudTimestamp) maxCloudTimestamp = cTime;
        const type = row.item_type;
        const key = row.item_key;
        if (!statusDb[type]) statusDb[type] = {};
        if (!statusTimestamps[type]) statusTimestamps[type] = {};
        if (!fsrsPool[type]) fsrsPool[type] = {};
        const currentLvlTime = statusTimestamps[type]?.[key] || 0;
        const currentFsrsTime = fsrsPool[type]?.[key]?.updatedAt || 0;
        if (cTime > Math.max(currentLvlTime, currentFsrsTime)) {
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
          } else {
            delete fsrsPool[type][key];
          }
          pullCount++;
        }
      }
    }

    lastSyncedAt = maxCloudTimestamp;
    await idbSet('lastSyncedAt', lastSyncedAt);
    await saveAllData();
    renderReader();
    renderDocList();
    renderVocabTable();
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
  const totalFsrsCount = Object.keys(fsrsPool.vocab).length + Object.keys(grammarFsrsPool).length;
  document.getElementById('stat-fsrs-count').innerText = `${totalFsrsCount} mục (vocab + grammar)`;
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
    fsrsPool, grammarFsrsPool, fsrsConfig,
    activeDocId, showPinyinRuby, readerFontSize, highlightMode,
    localLastModified, grammarDb
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

      const confirmed = confirm("Khôi phục từ file JSON sẽ nạp toàn bộ bài đọc, từ điển, level và FSRS vào máy. Tiếp tục?");
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

      if (parsed.grammarFsrsPool && typeof parsed.grammarFsrsPool === 'object') {
        grammarFsrsPool = parsed.grammarFsrsPool;
        Object.keys(grammarFsrsPool).forEach(k => { grammarFsrsPool[k].updatedAt = now; });
      } else {
        grammarFsrsPool = {};
      }
      if (parsed.grammarDb) {
        grammarDb = normalizeGrammarDb(parsed.grammarDb);
        rebuildGrammarIndex();
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
      renderReviewTables();
      updateBadges();

      alert(`✅ Đã nạp thành công: ${docs.length} bài đọc, ${Object.keys(vocabDb).length} từ vựng, ${Object.keys(fsrsPool.vocab).length} mục FSRS!`);
    } catch (err) {
      console.error("Lỗi nạp file:", err);
      alert("Lỗi đọc file: " + err.message);
    }
    event.target.value = '';
  };
  fileReader.readAsText(file);
}```

```javascript: js/18-bootstrap.js
/* ============================================================
 * FILE: 18-bootstrap.js
 * DOMAIN: Khởi động app (DOMContentLoaded)
 * DEPENDS: mọi file khác
 * ============================================================ */

window.addEventListener('DOMContentLoaded', async () => {
  await initData();
  cleanupTombstones(30);
  await saveAllData();
  renderReader();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isZenMode) toggleZenMode();
    if (e.code === 'Space' && !document.getElementById('modal-flashcard-session').classList.contains('hidden')) {
      e.preventDefault();
      toggleFlipFlashcard();
    }
  });
});```
