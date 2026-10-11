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

const DEFAULT_FSRS_CONFIG = { rankThreshold: 2500, corruptionThreshold: 5.0, retestDueThreshold: 50.0, fsrsSteps: 4 };