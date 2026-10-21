export type ReadingSpeed = 'slow' | 'normal' | 'fast';

export type PhonicsItemType = 'letter-name' | 'initial-consonant' | 'rhyme' | 'syllable' | 'word';

export interface PhonicsReadingItem {
  id: string;
  type: PhonicsItemType;
  display: string;             // Chữ, vần, tiếng hiển thị, ví dụ: "b", "an", "ba", "con cá"
  subDisplay?: string;          // Ví dụ: chữ hoa "B", hoặc tên chữ "Bê"
  phoneticName: string;         // Phân loại: "Tên chữ cái Bê", "Âm đầu /bờ/", "Vần an"...
  speechText: string;           // Văn bản chính xác cho Máy đọc tiếng Việt phát âm
  sampleSyllable?: string;      // Tiếng mẫu bổ trợ nhận diện (đặc biệt đối với âm đầu khó)
  lessonUnit: string;           // Bài học: "Bài 1", "Bài 2", "Chủ điểm gia đình"...
  isAuditedByTeacher: boolean;  // Giáo viên đã kiểm tra sư phạm
  teacherNote?: string;         // Lưu ý khẩu hình / hướng dẫn sư phạm trên lớp
  isCustom?: boolean;           // Mục do giáo viên thêm mới
}

export interface VietnameseLetter {
  id: number;
  letter: string;                // Chữ cái (in thường): "b", "d", "đ", "k"...
  letterName: string;            // Tên chữ cái: "bê", "dê", "đê", "ca"...
  soundText: string;             // CHỈ ĐỌC ÂM ĐƠN LẺ: "bờ", "dờ", "đờ", "ca", "mờ"... Không đọc tiếng mẫu, từ mẫu
  upper: string;                 // Chữ in hoa: "B", "D", "Đ", "K"...
  lower: string;                 // Chữ in thường: "b", "d", "đ", "k"...
  letterNameSpeechText?: string; // Văn bản đọc tên chữ (khi chọn nghe tên): "chữ bê", "chữ dê"...
  phonemeSound?: string;         // Ký hiệu âm: /bờ/, /dờ/, /đờ/...
  phonemeSpeechText?: string;    // Giữ tương thích alias với soundText
  sampleSyllables?: string[];    // Tiếng mẫu tham khảo (không đọc khi bấm Nghe âm)
  isAuditedByTeacher: boolean;   // Trạng thái giáo viên đã kiểm tra
  teacherNote?: string;          // Lưu ý sư phạm
  machineWarning?: string;       // Cảnh báo: "Giọng máy có thể chưa đọc đúng âm này"
}

export interface LearningZone {
  id: string;
  name: string;
  vietnameseName: string;
  description: string;
  icon: string;
  bgColor: string;
  accentColor: string;
  gamesCount: number;
}

export type GameStatus = 'ready' | 'in-development';

export type GameCategory =
  | 'letter-recognition'
  | 'listening-sound'
  | 'spelling-rhymes'
  | 'tones'
  | 'word-pictures'
  | 'sentence-reading'
  | 'comprehensive-review';

export interface GameMetadata {
  id: number;
  title: string;
  category: GameCategory;
  categoryName: string;
  zoneId: string;
  status: GameStatus;
  description: string;
  targetSkill: string;
  sampleQuestionsCount?: number;
}

// Question types for the 6 active games
export interface BaseQuestion {
  id: number;
  instruction: string;
  mascotTip: string;
  speechContent: string; // Văn bản máy đọc tiếng Việt đọc (speech synthesis text)
}

// Game 1: Tìm đúng chữ cái
export interface LetterRecognitionQuestion extends BaseQuestion {
  targetLetter: string;
  displayPrompt: string; // e.g. "Tìm chữ 'b' in thường"
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Game 2: Nghe và chọn chữ (Text does NOT reveal the letter to prevent cheating)
export interface ListeningQuestion extends BaseQuestion {
  audioPrompt: string; // Text spoken by TTS, e.g. "Âm dờ" or "Chữ a"
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Game 3: Ghép âm đầu với vần tạo tiếng
export interface PhonicsBlendQuestion extends BaseQuestion {
  initialConsonant: string; // Âm đầu, e.g. "b"
  rhymeOptions: string[];   // Các vần / âm chính, e.g. ["a", "ơ", "e"]
  correctRhyme: string;
  resultingWord: string;    // e.g. "ba"
  wordMeaning: string;      // e.g. "Ba (bố, hoặc số 3)"
  imageKey?: string;
  explanation: string;
}

// Game 4: Điền vần còn thiếu
export interface FillRhymeQuestion extends BaseQuestion {
  wordWithBlank: string;    // e.g. "con c..."
  missingRhyme: string;     // e.g. "ông"
  fullWord: string;         // e.g. "con công"
  options: string[];        // e.g. ["ông", "anh", "ăng"]
  imageKey: string;
  explanation: string;
}

// Game 5: Nối từ với tranh (Multiple pairs per stage)
export interface MatchPair {
  id: string;
  word: string;
  imageKey: string;
  label: string;
}

export interface MatchPairsQuestion extends BaseQuestion {
  pairs: MatchPair[];
  explanation: string;
}

// Game 6: Chọn câu phù hợp với tranh
export interface SentenceMatchingQuestion extends BaseQuestion {
  imageKey: string;
  imageAlt: string;
  sentences: string[];
  correctIndex: number;
  explanation: string;
}

// -------------------------------------------------------------
// NEW INTERFACES FOR ZONE 1 (VƯỜN CHỮ CÁI) 5 GAMES:
// -------------------------------------------------------------

// Game 2: Phân biệt chữ hoa - chữ thường (Vườn cổ tích 3D)
export interface UpperLowerPairQuestion extends BaseQuestion {
  targetUpper: string;       // e.g. "B"
  correctLower: string;      // e.g. "b"
  options: string[];         // e.g. ["b", "d", "p", "q"]
  correctIndex: number;
  explanation: string;
}

// Game 3: Tìm chữ còn thiếu trong bảng chữ cái (Bảng 29 chữ tương tác)
export interface MissingLetterSlot {
  index: number;             // Vị trí trong bảng (0-28)
  correctLetter: string;     // Chữ cái đúng
}

export interface MissingLettersBoardQuestion extends BaseQuestion {
  missingSlots: MissingLetterSlot[]; // Danh sách 3-5 ô chữ bị ẩn
  options: string[];         // Các chữ cái trong khay chọn
  explanation: string;
}

// Game 4: Phân biệt b - d - p - q (Thám tử chữ cái 3D)
export interface DetectiveLettersQuestion extends BaseQuestion {
  targetLetter: 'b' | 'd' | 'p' | 'q';
  instruction: string;
  promptLetter: string;
  items: { id: number; letter: 'b' | 'd' | 'p' | 'q'; size?: string }[];
  correctIndices: number[];  // Vị trí các chữ đúng
  explanation: string;
}

// Game 5: Nhặt táo chữ cái a - ă - ấ (Vườn táo 3D)
export interface AppleItem {
  id: number;
  letter: string;
  xPercent: number;          // Vị trí x trên tán cây (15% - 85%)
  yPercent: number;          // Vị trí y trên tán cây (15% - 75%)
}

export interface AppleHarvestQuestion extends BaseQuestion {
  targetLetter: string;      // Chữ cần nhặt: 'a' | 'ă' | 'â' | 'ấ'
  apples: AppleItem[];
  correctAppleId: number;
  explanation: string;
}

// Game 6: Mê cung chữ o - ô - ơ (Mê cung 3D tương tác)
export interface MazeGate {
  letter: 'o' | 'ô' | 'ơ';
  direction: 'trái' | 'giữa' | 'phải';
}

export interface LetterMazeQuestion extends BaseQuestion {
  stage: number;             // Chặng 1 đến 10
  targetLetter: 'o' | 'ô' | 'ơ';
  gates: MazeGate[];
  correctGateIndex: number;  // 0, 1, hoặc 2
  explanation: string;
}

export const GRADE_1_CLASSES = [
  '1/1', '1/2', '1/3', '1/4', '1/5', '1/6', '1/7', '1/8', '1/9', '1/10',
  '1/11', '1/12', '1/13', '1/14', '1/15', '1/16', '1/17', '1/18', '1/19', '1/20',
  '1/21', '1/22', '1/23', '1/24', '1/25', '1/26'
] as const;

export type Grade1Class = typeof GRADE_1_CLASSES[number];

export interface StudentProfile {
  id: string;
  name: string;
  className?: string; // Lớp: '1/1' đến '1/26'
  avatar: string; // 'bee' | 'rabbit' | 'bear' | 'cat' | 'fox'
  stars: number;
  badges: string[];
  createdDate: string;
}

export interface WrongAnswerRecord {
  questionId: number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
}

export interface PlaySession {
  id: string;
  studentId: string;
  gameId: number;
  gameTitle: string;
  date: string;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  starsEarned: number;
  durationSeconds: number;
  wrongAnswers: WrongAnswerRecord[];
}

// -------------------------------------------------------------
// HỆ THỐNG BÀI HỌC THEO CHƯƠNG TRÌNH GDPT 2018 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
// Chuẩn quy trình 7 bước sư phạm
// -------------------------------------------------------------
export type LessonStepKey =
  | 'intro'         // 1. Giới thiệu bài học bằng hình ảnh sinh động
  | 'recognize'     // 2. Nhận biết âm, chữ, vần hoặc từ ngữ
  | 'pronounce'     // 3. Hướng dẫn phát âm và luyện đọc (Máy đọc tiếng Việt)
  | 'interactive'   // 4. Hoạt động tương tác trực tiếp
  | 'game'          // 5. Trò chơi củng cố kiến thức
  | 'practice'      // 6. Phần luyện tập và đánh giá
  | 'reward';       // 7. Lời khen và phần thưởng sau khi hoàn thành

export interface LessonPracticeQuestion {
  id: number;
  instruction: string;
  questionContent: string;
  audioPrompt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonTopic {
  id: string;
  week: number;
  lessonNumber: number;
  unitTitle: string;        // e.g. "Tuần 1 • Bài 1"
  title: string;            // e.g. "A a - Dấu thanh huyền"
  subtitle: string;         // e.g. "Làm quen với âm /a/, chữ A, a và dấu huyền (\)"
  bookCurriculum: string;   // "Bộ sách Kết nối tri thức với cuộc sống"
  letters: string[];        // Các chữ cái trọng tâm, e.g. ["a", "à"]
  sampleWords: Array<{ word: string; meaning: string; imageKey?: string; audioText: string }>;
  introStory: string;       // Bối cảnh mở đầu bài học vui nhộn
  introImageKey: string;    // Khóa tranh minh họa khởi động
  pronunciationNotes: Array<{
    sound: string;
    mouthShape: string;
    speechText: string;     // Dùng máy đọc chỉ đọc âm
  }>;
  interactiveActivity: {
    instruction: string;
    prompt: string;
    items: Array<{ text: string; isCorrect: boolean; hint: string }>;
  };
  recommendedGameId: number;// Liên kết trò chơi củng cố (ví dụ Game 1, 7, 12...)
  recommendedGameTitle: string;
  practiceQuestions: LessonPracticeQuestion[];
  isCompleted?: boolean;
}

// Cấu hình Chế độ Giảng dạy & Trình chiếu Lớp học của Giáo viên
export interface TeacherClassSettings {
  difficulty: 'easy' | 'normal' | 'advanced';
  questionCount: 5 | 10 | 15 | 20;
  isSoundEnabled: boolean;
  autoPlayAudioPrompt: boolean;
  fontSizeScale: 'normal' | 'large' | 'extra-large'; // Hỗ trợ màn hình máy chiếu
  selectedLessonId: string;
}

// =============================================================
// I. HÀNH TRÌNH KHÁM PHÁ TIẾNG VIỆT
// =============================================================
export type JourneyTaskType = 'letter' | 'rhyme' | 'blend' | 'word' | 'sentence' | 'quiz';

export interface JourneyTask {
  id: string;
  stageNumber: number;
  taskIndex: number;          // 1, 2, 3
  title: string;
  instruction: string;
  type: JourneyTaskType;
  promptContent: string;
  subPrompt?: string;
  speechText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  mascotHint: string;
  rewardStars: number;
}

export interface JourneyStage {
  id: string;
  stageNumber: number;        // 1 to 6
  name: string;               // e.g. "Vương quốc chữ cái"
  fullName: string;           // e.g. "Chặng 1: Vương quốc chữ cái"
  subtitle: string;
  description: string;
  themeColor: string;
  accentBg: string;
  icon: string;
  badgeAwarded: string;
  rewardStars: number;
  teacherGuide: string;
  tasks: JourneyTask[];
}

export interface StudentJourneyProgress {
  studentId: string;
  unlockedStageNumbers: number[];
  completedTaskIds: string[];
  stageStars: Record<number, number>; // stageNumber -> stars earned
  isTeacherUnlockedAll: boolean;
  lastActiveStageNumber: number;
  lastUpdated: string;
}

// =============================================================
// II. ĐẤU TRƯỜNG TIẾNG VIỆT
// =============================================================
export type ArenaMode = 'practice' | 'challenge' | 'review';

export type ArenaQuestionType =
  | 'letter-id'               // 1. Nhận diện chữ cái
  | 'choose-rhyme'            // 2. Chọn âm hoặc vần đúng
  | 'find-word-rhyme'         // 3. Tìm tiếng có âm hoặc vần đã học
  | 'blend-word'              // 4. Ghép chữ thành tiếng
  | 'word-picture'            // 5. Chọn từ phù hợp với hình ảnh
  | 'word-sentence-correct'   // 6. Chọn từ hoặc câu đúng
  | 'fill-missing';           // 7. Điền âm, vần hoặc tiếng còn thiếu

export interface ArenaQuestion {
  id: string;
  type: ArenaQuestionType;
  typeName: string;
  instruction: string;
  prompt: string;
  subPrompt?: string;
  speechText: string;
  imageKey?: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ArenaLeaderboardEntry {
  id: string;
  studentId: string;
  studentName: string;
  avatar: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  mode: ArenaMode;
  timeSpentSeconds: number;
  date: string;
  titleEarned: string;
}

