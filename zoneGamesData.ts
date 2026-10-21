/**
 * Dataset for 5 Zones:
 * Zone 2: Xưởng ghép vần (Games 14, 12, 15, 17, 13)
 * Zone 3: Tai nghe tinh (Games 7, 8, 9, 10, 11)
 * Zone 4: Thế giới từ ngữ (Games 24, 27, 25, 30, 26)
 * Zone 5: Vườn đọc sách (Games 33, 29, 31, 32, 34)
 */

// =========================================================================
// ZONE 2: XƯỞNG GHÉP VẦN
// =========================================================================

// Game 14: Bánh xe ghép vần ba - ca - me (10 rounds)
export interface WheelGameRound {
  id: number;
  targetWord: string;
  onset: string;
  rhyme: string;
  tone: string;
  availableOnsets: string[];
  availableRhymes: string[];
  meaning: string;
  speechText: string;
  mascotTip: string;
}

export const WHEEL_GAME_ROUNDS: WheelGameRound[] = [
  {
    id: 1,
    targetWord: 'ba',
    onset: 'b',
    rhyme: 'a',
    tone: 'ngang',
    availableOnsets: ['b', 'c', 'm', 'l'],
    availableRhymes: ['a', 'e', 'o', 'u'],
    meaning: 'người cha thân yêu trong gia đình',
    speechText: 'bờ a ba',
    mascotTip: 'Bé hãy xoay âm b ghép với vần a nhé!',
  },
  {
    id: 2,
    targetWord: 'ca',
    onset: 'c',
    rhyme: 'a',
    tone: 'ngang',
    availableOnsets: ['c', 'd', 't', 'h'],
    availableRhymes: ['a', 'i', 'u', 'e'],
    meaning: 'chiếc ca uống nước xinh xắn',
    speechText: 'cờ a ca',
    mascotTip: 'Xoay âm cờ ghép với vần a con nhé!',
  },
  {
    id: 3,
    targetWord: 'me',
    onset: 'm',
    rhyme: 'e',
    tone: 'ngang',
    availableOnsets: ['m', 'n', 'v', 'b'],
    availableRhymes: ['e', 'o', 'a', 'i'],
    meaning: 'quả me chua ngọt nấu canh',
    speechText: 'mờ e me',
    mascotTip: 'Xoay âm mờ ghép với vần e nào!',
  },
  {
    id: 4,
    targetWord: 'bò',
    onset: 'b',
    rhyme: 'o',
    tone: 'huyền',
    availableOnsets: ['b', 'c', 'd', 'l'],
    availableRhymes: ['o', 'e', 'a', 'u'],
    meaning: 'chú bò vàng gặm cỏ trên đồi',
    speechText: 'bờ o bo huyền bò',
    mascotTip: 'Âm b ghép với vần o và thanh huyền nhé!',
  },
  {
    id: 5,
    targetWord: 'cá',
    onset: 'c',
    rhyme: 'a',
    tone: 'sắc',
    availableOnsets: ['c', 'm', 't', 'b'],
    availableRhymes: ['a', 'o', 'i', 'e'],
    meaning: 'chú cá bơi tung tăng dưới nước',
    speechText: 'cờ a ca sắc cá',
    mascotTip: 'c ghép a thêm thanh sắc thành tiếng cá!',
  },
  {
    id: 6,
    targetWord: 'lá',
    onset: 'l',
    rhyme: 'a',
    tone: 'sắc',
    availableOnsets: ['l', 'n', 'b', 'c'],
    availableRhymes: ['a', 'e', 'u', 'o'],
    meaning: 'chiếc lá cây xanh tươi',
    speechText: 'lờ a la sắc lá',
    mascotTip: 'Âm l ghép với vần a và thanh sắc!',
  },
  {
    id: 7,
    targetWord: 'gà',
    onset: 'g',
    rhyme: 'a',
    tone: 'huyền',
    availableOnsets: ['g', 'h', 'm', 'd'],
    availableRhymes: ['a', 'o', 'e', 'i'],
    meaning: 'chú gà trống gáy vang sớm mai',
    speechText: 'gờ a ga huyền gà',
    mascotTip: 'Âm g ghép với a và thanh huyền!',
  },
  {
    id: 8,
    targetWord: 'nơ',
    onset: 'n',
    rhyme: 'ơ',
    tone: 'ngang',
    availableOnsets: ['n', 'm', 'b', 'c'],
    availableRhymes: ['ơ', 'o', 'a', 'e'],
    meaning: 'chiếc nơ hoa cài trên mái tóc bé',
    speechText: 'nờ ơ nơ',
    mascotTip: 'Âm n ghép với vần ơ xinh xắn con nhé!',
  },
  {
    id: 9,
    targetWord: 'dê',
    onset: 'd',
    rhyme: 'ê',
    tone: 'ngang',
    availableOnsets: ['d', 'đ', 'b', 't'],
    availableRhymes: ['ê', 'e', 'a', 'o'],
    meaning: 'chú dê con tung tăng trên đồng cỏ',
    speechText: 'dờ ê dê',
    mascotTip: 'Âm d ghép với vần ê đội mũ!',
  },
  {
    id: 10,
    targetWord: 'thỏ',
    onset: 'th',
    rhyme: 'o',
    tone: 'hỏi',
    availableOnsets: ['th', 'ch', 'nh', 'kh'],
    availableRhymes: ['o', 'a', 'e', 'u'],
    meaning: 'chú thỏ trắng có đôi tai dài',
    speechText: 'thờ o tho hỏi thỏ',
    mascotTip: 'Âm ghép th ghép với o và thanh hỏi!',
  },
];

// Game 15: Đua thuyền ghép vần an - at (10 rounds)
export interface BoatRaceRound {
  id: number;
  question: string;
  speechText: string;
  consonant: string;
  rhymeTarget: 'an' | 'at';
  correctWord: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  mascotTip: string;
}

export const BOAT_RACE_ROUNDS: BoatRaceRound[] = [
  {
    id: 1,
    question: 'Ghép âm "b" với vần "an" và thanh nặng tạo thành tiếng gì để thuyền tiến lên?',
    speechText: 'bờ ghép an thêm nặng thành tiếng gì?',
    consonant: 'b',
    rhymeTarget: 'an',
    correctWord: 'bạn',
    options: ['bạn', 'bạt', 'bàn', 'bát'],
    correctIndex: 0,
    explanation: 'b - an - ban - nặng - bạn (trong từ bạn bè thân thiết).',
    mascotTip: 'Âm cuối n đi với vần an thành tiếng bạn con nhé!',
  },
  {
    id: 2,
    question: 'Ghép âm "b" với vần "at" và thanh sắc tạo thành tiếng gì?',
    speechText: 'bờ ghép at thêm sắc thành tiếng gì?',
    consonant: 'b',
    rhymeTarget: 'at',
    correctWord: 'bát',
    options: ['bát', 'bán', 'bạc', 'báp'],
    correctIndex: 0,
    explanation: 'b - at - bat - sắc - bát (trong từ cái bát ăn cơm).',
    mascotTip: 'Âm cuối t có tiếng bát ăn cơm xinh xắn!',
  },
  {
    id: 3,
    question: 'Điền vần "an" hay "at": Bé hãy chọn từ đúng "h... múa"?',
    speechText: 'Điền an hay at vào từ hát múa?',
    consonant: 'h',
    rhymeTarget: 'at',
    correctWord: 'hát múa',
    options: ['hát múa', 'hán múa', 'hác múa', 'háp múa'],
    correctIndex: 0,
    explanation: 'h - at - hat - sắc - hát. "Hát múa" có vần at.',
    mascotTip: 'hát múa kết thúc bằng âm t con nhé!',
  },
  {
    id: 4,
    question: 'Điền vần "an" hay "at": Chiếc "b... học" của bé mang vần nào?',
    speechText: 'Chiếc bàn học mang vần an hay vần at?',
    consonant: 'b',
    rhymeTarget: 'an',
    correctWord: 'bàn học',
    options: ['bàn học', 'bạt học', 'bàng học', 'bạc học'],
    correctIndex: 0,
    explanation: 'b - an - ban - huyền - bàn. Cái bàn học có vần an.',
    mascotTip: 'Cái bàn học bằng gỗ có vần an!',
  },
  {
    id: 5,
    question: 'Điền vần "an" hay "at": "Bãi c... vàng" mịn màng bên bờ biển?',
    speechText: 'Bãi cát vàng có vần at hay vần an?',
    consonant: 'c',
    rhymeTarget: 'at',
    correctWord: 'bãi cát',
    options: ['bãi cát', 'bãi cán', 'bãi cáp', 'bãi các'],
    correctIndex: 0,
    explanation: 'c - at - cat - sắc - cát. Bãi cát mang vần at.',
    mascotTip: 'Cát vàng có âm t ở cuối vần!',
  },
  {
    id: 6,
    question: 'Ghép âm "m" với vần "an" và thanh huyền tạo thành tiếng gì?',
    speechText: 'mờ ghép an thêm huyền thành tiếng gì?',
    consonant: 'm',
    rhymeTarget: 'an',
    correctWord: 'màn',
    options: ['màn', 'mát', 'mạn', 'mạt'],
    correctIndex: 0,
    explanation: 'm - an - man - huyền - màn (mắc màn đi ngủ).',
    mascotTip: 'Mắc chiếc màn ngủ ấm áp có vần an!',
  },
  {
    id: 7,
    question: 'Từ "mát mẻ" mang vần "an" hay vần "at"?',
    speechText: 'Gió mát mẻ có vần an hay vần at?',
    consonant: 'm',
    rhymeTarget: 'at',
    correctWord: 'vần at',
    options: ['vần at', 'vần an', 'vần am', 'vần ap'],
    correctIndex: 0,
    explanation: 'm - at - mat - sắc - mát. Tiếng mát mang vần at.',
    mascotTip: 'Làn gió mát lành mang vần at!',
  },
  {
    id: 8,
    question: 'Ghép âm "đ" với vần "an" và thanh huyền: Cây "đ... ghi-ta"?',
    speechText: 'Cây đàn ghi ta có vần gì?',
    consonant: 'đ',
    rhymeTarget: 'an',
    correctWord: 'đàn',
    options: ['đàn', 'đạt', 'đán', 'đát'],
    correctIndex: 0,
    explanation: 'đ - an - đan - huyền - đàn (cây đàn âm vang).',
    mascotTip: 'Cây đàn gảy khúc nhạc vui tươi có vần an!',
  },
  {
    id: 9,
    question: 'Bé học giỏi và "đ... điểm mười" đỏ chói?',
    speechText: 'Đạt điểm mười có vần an hay at?',
    consonant: 'đ',
    rhymeTarget: 'at',
    correctWord: 'đạt',
    options: ['đạt', 'đàn', 'đạn', 'đát'],
    correctIndex: 0,
    explanation: 'đ - at - đat - nặng - đạt (đạt điểm mười).',
    mascotTip: 'Đạt kết quả tốt có âm t ở cuối vần!',
  },
  {
    id: 10,
    question: 'Về đích: Ghép tiếng "l... đường" rợp bóng cây xanh mát?',
    speechText: 'Làn đường rợp bóng cây có vần gì?',
    consonant: 'l',
    rhymeTarget: 'an',
    correctWord: 'làn đường',
    options: ['làn đường', 'lát đường', 'lang đường', 'lạc đường'],
    correctIndex: 0,
    explanation: 'l - an - lan - huyền - làn. Làn đường có vần an.',
    mascotTip: 'Chúc mừng bé đưa thuyền về đích xuất sắc!',
  },
];

// Game 17: Xếp chữ thành tiếng đúng (10 rounds)
export interface ScrambleWordRound {
  id: number;
  targetWord: string;
  emoji: string;
  scrambledLetters: string[];
  speechText: string;
  hint: string;
  explanation: string;
}

export const SCRAMBLE_WORD_ROUNDS: ScrambleWordRound[] = [
  {
    id: 1,
    targetWord: 'hoa',
    emoji: '🌸',
    scrambledLetters: ['o', 'a', 'h'],
    speechText: 'hờ oa hoa',
    hint: 'Bông hoa tươi thắm tỏa ngát hương thơm.',
    explanation: 'h - oa - hoa. Âm h đứng trước vần oa.',
  },
  {
    id: 2,
    targetWord: 'sách',
    emoji: '📚',
    scrambledLetters: ['ch', 'á', 's'],
    speechText: 'sờ ách sách sắc sách',
    hint: 'Quyển sách bé mang tới trường mỗi ngày.',
    explanation: 's - ách - sách. Âm đầu s, vần ách mang thanh sắc.',
  },
  {
    id: 3,
    targetWord: 'ngôi',
    emoji: '⭐',
    scrambledLetters: ['i', 'ô', 'ng'],
    speechText: 'ngờ ôi ngôi',
    hint: 'Ngôi sao lấp lánh trên bầu trời đêm.',
    explanation: 'ng - ôi - ngôi. Âm đầu ng ghép vần ôi.',
  },
  {
    id: 4,
    targetWord: 'bút',
    emoji: '✏️',
    scrambledLetters: ['t', 'ú', 'b'],
    speechText: 'bờ út bứt sắc bút',
    hint: 'Cây bút chì giúp bé viết nét chữ xinh.',
    explanation: 'b - út - bút. Âm đầu b, vần út mang thanh sắc.',
  },
  {
    id: 5,
    targetWord: 'mèo',
    emoji: '🐱',
    scrambledLetters: ['o', 'è', 'm'],
    speechText: 'mờ eo meo huyền mèo',
    hint: 'Chú mèo con thích bắt chuột.',
    explanation: 'm - èo - mèo. Âm đầu m ghép vần eo thanh huyền.',
  },
  {
    id: 6,
    targetWord: 'cún',
    emoji: '🐶',
    scrambledLetters: ['n', 'ú', 'c'],
    speechText: 'cờ un cun sắc cún',
    hint: 'Chú cún vẫy đuôi mừng rỡ đón chủ.',
    explanation: 'c - ún - cún. Âm đầu c, vần un thanh sắc.',
  },
  {
    id: 7,
    targetWord: 'nhà',
    emoji: '🏠',
    scrambledLetters: ['à', 'nh'],
    speechText: 'nhờ a nha huyền nhà',
    hint: 'Mái nhà ấm áp yêu thương của cả gia đình.',
    explanation: 'nh - à - nhà. Âm ghép nh đứng đầu.',
  },
  {
    id: 8,
    targetWord: 'cây',
    emoji: '🌳',
    scrambledLetters: ['y', 'â', 'c'],
    speechText: 'cờ ây cây',
    hint: 'Cây xanh cho bóng mát xum xuê.',
    explanation: 'c - ây - cây. Âm c ghép vần ây.',
  },
  {
    id: 9,
    targetWord: 'bóng',
    emoji: '🎈',
    scrambledLetters: ['ng', 'ó', 'b'],
    speechText: 'bờ ong bong sắc bóng',
    hint: 'Quả bóng bay nhiều màu sắc rực rỡ.',
    explanation: 'b - óng - bóng. Âm b ghép vần ong thanh sắc.',
  },
  {
    id: 10,
    targetWord: 'trường',
    emoji: '🏫',
    scrambledLetters: ['ờng', 'tr', 'ư'],
    speechText: 'trờ ương trương huyền trường',
    hint: 'Mái trường tiểu học thân yêu của bé.',
    explanation: 'tr - ường - trường. Âm tr ghép vần ương thanh huyền.',
  },
];

// =========================================================================
// ZONE 3: TAI NGHE TINH
// =========================================================================

// Game 8: Nghe tiếng tìm tranh (10 rounds)
export interface ListenPictureRound {
  id: number;
  wordToListen: string;
  speechText: string;
  options: { emoji: string; label: string; isCorrect: boolean }[];
  hint: string;
  explanation: string;
}

export const LISTEN_PICTURE_ROUNDS: ListenPictureRound[] = [
  {
    id: 1,
    wordToListen: 'chú cún',
    speechText: 'chú cún',
    options: [
      { emoji: '🐶', label: 'chú cún', isCorrect: true },
      { emoji: '🐱', label: 'con mèo', isCorrect: false },
      { emoji: '🐔', label: 'chú gà', isCorrect: false },
      { emoji: '🐰', label: 'chú thỏ', isCorrect: false },
    ],
    hint: 'Con vật trông nhà kêu gâu gâu!',
    explanation: 'Chính xác! Âm thanh đọc là "chú cún".',
  },
  {
    id: 2,
    wordToListen: 'quả cam',
    speechText: 'quả cam',
    options: [
      { emoji: '🍊', label: 'quả cam', isCorrect: true },
      { emoji: '🍎', label: 'quả táo', isCorrect: false },
      { emoji: '🍌', label: 'quả chuối', isCorrect: false },
      { emoji: '🍉', label: 'dưa hấu', isCorrect: false },
    ],
    hint: 'Quả hình tròn, màu cam mọng nước nhiều vitamin C.',
    explanation: 'Rất đúng! "Quả cam" tròn mọng.',
  },
  {
    id: 3,
    wordToListen: 'ngôi sao',
    speechText: 'ngôi sao',
    options: [
      { emoji: '⭐', label: 'ngôi sao', isCorrect: true },
      { emoji: '🌙', label: 'mặt trăng', isCorrect: false },
      { emoji: '☀️', label: 'mặt trời', isCorrect: false },
      { emoji: '☁️', label: 'đám mây', isCorrect: false },
    ],
    hint: 'Lấp lánh trên bầu trời đêm 5 cánh vàng.',
    explanation: 'Tuyệt vời! Âm đọc là "ngôi sao".',
  },
  {
    id: 4,
    wordToListen: 'chiếc thuyền',
    speechText: 'chiếc thuyền',
    options: [
      { emoji: '⛵', label: 'chiếc thuyền', isCorrect: true },
      { emoji: '🚗', label: 'xe ô tô', isCorrect: false },
      { emoji: '✈️', label: 'máy bay', isCorrect: false },
      { emoji: '🚂', label: 'tàu hỏa', isCorrect: false },
    ],
    hint: 'Phương tiện lướt sóng trên mặt nước.',
    explanation: 'Chính xác! Đó là "chiếc thuyền".',
  },
  {
    id: 5,
    wordToListen: 'cây bút',
    speechText: 'cây bút',
    options: [
      { emoji: '✏️', label: 'cây bút', isCorrect: true },
      { emoji: '📚', label: 'quyển sách', isCorrect: false },
      { emoji: '📐', label: 'thước kẻ', isCorrect: false },
      { emoji: '🎒', label: 'cặp sách', isCorrect: false },
    ],
    hint: 'Đồ dùng bé cầm để nắn nót từng nét chữ.',
    explanation: 'Đúng rồi! Đó là "cây bút".',
  },
  {
    id: 6,
    wordToListen: 'bông sen',
    speechText: 'bông sen',
    options: [
      { emoji: '🪷', label: 'bông sen', isCorrect: true },
      { emoji: '🌻', label: 'hướng dương', isCorrect: false },
      { emoji: '🌹', label: 'hoa hồng', isCorrect: false },
      { emoji: '🌼', label: 'hoa cúc', isCorrect: false },
    ],
    hint: 'Loài hoa ngát hương trong đầm lầy.',
    explanation: 'Rất giỏi! "Bông sen" hồng ngát hương.',
  },
  {
    id: 7,
    wordToListen: 'mặt trời',
    speechText: 'mặt trời',
    options: [
      { emoji: '☀️', label: 'mặt trời', isCorrect: true },
      { emoji: '🌧️', label: 'cơn mưa', isCorrect: false },
      { emoji: '⚡', label: 'sấm sét', isCorrect: false },
      { emoji: '🌈', label: 'cầu vồng', isCorrect: false },
    ],
    hint: 'Tỏa ánh nắng vàng ấm áp sớm mai.',
    explanation: 'Xuất sắc! Đó là "mặt trời".',
  },
  {
    id: 8,
    wordToListen: 'chú gà',
    speechText: 'chú gà',
    options: [
      { emoji: '🐔', label: 'chú gà', isCorrect: true },
      { emoji: '🦆', label: 'con vịt', isCorrect: false },
      { emoji: '🐦', label: 'chim sâu', isCorrect: false },
      { emoji: '🦉', label: 'cú mèo', isCorrect: false },
    ],
    hint: 'Chú gáy ò ó o mỗi sáng sớm.',
    explanation: 'Chính xác! Đó là "chú gà".',
  },
  {
    id: 9,
    wordToListen: 'quả chuối',
    speechText: 'quả chuối',
    options: [
      { emoji: '🍌', label: 'quả chuối', isCorrect: true },
      { emoji: '🍇', label: 'chùm nho', isCorrect: false },
      { emoji: '🍓', label: 'dâu tây', isCorrect: false },
      { emoji: '🍍', label: 'quả dứa', isCorrect: false },
    ],
    hint: 'Quả dài cong cong màu vàng ngọt ngào.',
    explanation: 'Tuyệt vời! Đó là "quả chuối".',
  },
  {
    id: 10,
    wordToListen: 'chiếc ô',
    speechText: 'chiếc ô',
    options: [
      { emoji: '☂️', label: 'chiếc ô', isCorrect: true },
      { emoji: '👒', label: 'chiếc mũ', isCorrect: false },
      { emoji: '🧤', label: 'đôi găng tay', isCorrect: false },
      { emoji: '🧣', label: 'khăn quàng', isCorrect: false },
    ],
    hint: 'Dùng che nắng che mưa khi ra ngoài phố.',
    explanation: 'Xuất sắc! Đó là "chiếc ô" (cái dù).',
  },
];

// Game 9: Phân biệt âm dễ nhầm (10 rounds)
export interface TrickySoundRound {
  id: number;
  speechText: string;
  ruleTitle: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  mascotTip: string;
}

export const TRICKY_SOUND_ROUNDS: TrickySoundRound[] = [
  {
    id: 1,
    speechText: 'kẻ vở',
    ruleTitle: 'Quy tắc c / k',
    questionText: 'Nghe và chọn từ viết đúng chính tả:',
    options: ['kẻ vở', 'cẻ vở'],
    correctIndex: 0,
    explanation: 'Âm c đứng trước e, ê, i phải viết bằng "k". Do đó viết "kẻ vở"!',
    mascotTip: 'Đứng trước chữ e thì phải viết bằng k con nhé!',
  },
  {
    id: 2,
    speechText: 'hoa sen',
    ruleTitle: 'Phân biệt s / x',
    questionText: 'Nghe phát âm và chọn chữ viết đúng tên loài hoa:',
    options: ['hoa sen', 'hoa xen'],
    correctIndex: 0,
    explanation: '"Hoa sen" viết bằng s (sờ mạnh).',
    mascotTip: 'Hoa sen nở trong đầm viết s!',
  },
  {
    id: 3,
    speechText: 'con trâu',
    ruleTitle: 'Phân biệt tr / ch',
    questionText: 'Nghe phát âm con vật giúp bác nông dân cày ruộng:',
    options: ['con trâu', 'con châu'],
    correctIndex: 0,
    explanation: '"Con trâu" viết bằng tr (trờ uốn lưỡi).',
    mascotTip: 'Con trâu ăn cỏ viết tr con nhé!',
  },
  {
    id: 4,
    speechText: 'ghế gỗ',
    ruleTitle: 'Quy tắc g / gh',
    questionText: 'Nghe và chọn từ viết đúng chính tả:',
    options: ['ghế gỗ', 'gế gỗ'],
    correctIndex: 0,
    explanation: 'Âm g đứng trước e, ê, i phải thêm h thành "gh". Viết "ghế gỗ"!',
    mascotTip: 'Đứng trước âm ê thì phải viết gh!',
  },
  {
    id: 5,
    speechText: 'nghe nhạc',
    ruleTitle: 'Quy tắc ng / ngh',
    questionText: 'Nghe và chọn từ đúng theo quy tắc chính tả:',
    options: ['nghe nhạc', 'nge nhạc'],
    correctIndex: 0,
    explanation: 'Âm ng đứng trước e, ê, i phải viết bằng "ngh". Viết "nghe nhạc"!',
    mascotTip: 'Đi với chữ e thì dùng ngh nhé!',
  },
  {
    id: 6,
    speechText: 'quả na',
    ruleTitle: 'Phân biệt l / n',
    questionText: 'Nghe phát âm quả có nhiều mắt thơm ngon:',
    options: ['quả na', 'quả la'],
    correctIndex: 0,
    explanation: '"Quả na" viết bằng n (nờ ngắn).',
    mascotTip: 'Quả na mở mắt đón mùa thu viết n!',
  },
  {
    id: 7,
    speechText: 'chiếc lá',
    ruleTitle: 'Phân biệt l / n',
    questionText: 'Nghe phát âm bộ phận của cây xanh:',
    options: ['chiếc lá', 'chiếc ná'],
    correctIndex: 0,
    explanation: '"Chiếc lá" viết bằng l (lờ cao/lờ dài).',
    mascotTip: 'Chiếc lá xanh tươi viết l cao!',
  },
  {
    id: 8,
    speechText: 'xe đạp',
    ruleTitle: 'Phân biệt s / x',
    questionText: 'Nghe phát âm phương tiện 2 bánh đạp bằng chân:',
    options: ['xe đạp', 'se đạp'],
    correctIndex: 0,
    explanation: '"Xe đạp" viết bằng x (xờ nhẹ).',
    mascotTip: 'Xe đạp bon bon trên đường viết x!',
  },
  {
    id: 9,
    speechText: 'chú chó',
    ruleTitle: 'Phân biệt tr / ch',
    questionText: 'Nghe phát âm người bạn bốn chân trung thành:',
    options: ['chú chó', 'trú tró'],
    correctIndex: 0,
    explanation: '"Chú chó" viết bằng ch.',
    mascotTip: 'Chú chó trông nhà viết ch!',
  },
  {
    id: 10,
    speechText: 'rau dền',
    ruleTitle: 'Phân biệt r / d / gi',
    questionText: 'Nghe phát âm loại rau luộc canh ngọt mát:',
    options: ['rau dền', 'rau rền', 'rau giền'],
    correctIndex: 0,
    explanation: '"Rau dền" viết bằng d (dờ).',
    mascotTip: 'Rau dền đỏ mát ngọt viết d con nhé!',
  },
];

// Game 10: Nghe và nhận biết thanh điệu (10 rounds)
export interface ToneRecognitionRound {
  id: number;
  word: string;
  speechText: string;
  toneName: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  mascotTip: string;
}

export const TONE_RECOGNITION_ROUNDS: ToneRecognitionRound[] = [
  {
    id: 1,
    word: 'má',
    speechText: 'má',
    toneName: 'Thanh sắc',
    options: ['Thanh sắc ( / )', 'Thanh huyền ( \\ )', 'Thanh hỏi ( ? )', 'Thanh nặng ( . )'],
    correctIndex: 0,
    explanation: 'Tiếng "má" mang thanh sắc, giọng đọc vút lên cao.',
    mascotTip: 'Dấu sắc vút lên từ trái qua phải con nhé!',
  },
  {
    id: 2,
    word: 'bà',
    speechText: 'bà',
    toneName: 'Thanh huyền',
    options: ['Thanh huyền ( \\ )', 'Thanh sắc ( / )', 'Thanh hỏi ( ? )', 'Thanh ngã ( ~ )'],
    correctIndex: 0,
    explanation: 'Tiếng "bà" mang thanh huyền, giọng đọc trầm và xuôi xuống.',
    mascotTip: 'Thanh huyền dốc xuôi nhẹ nhàng!',
  },
  {
    id: 3,
    word: 'thỏ',
    speechText: 'thỏ',
    toneName: 'Thanh hỏi',
    options: ['Thanh hỏi ( ? )', 'Thanh ngã ( ~ )', 'Thanh sắc ( / )', 'Thanh nặng ( . )'],
    correctIndex: 0,
    explanation: 'Tiếng "thỏ" mang thanh hỏi, dấu như chiếc móc câu.',
    mascotTip: 'Dấu hỏi xinh xắn như chiếc móc câu trên đầu chữ o!',
  },
  {
    id: 4,
    word: 'mẹ',
    speechText: 'mẹ',
    toneName: 'Thanh nặng',
    options: ['Thanh nặng ( . )', 'Thanh sắc ( / )', 'Thanh huyền ( \\ )', 'Thanh hỏi ( ? )'],
    correctIndex: 0,
    explanation: 'Tiếng "mẹ" mang thanh nặng, dấu chấm đặt dưới con chữ e.',
    mascotTip: 'Dấu nặng là dấu chấm ở phía dưới con chữ!',
  },
  {
    id: 5,
    word: 'mỡ',
    speechText: 'mỡ',
    toneName: 'Thanh ngã',
    options: ['Thanh ngã ( ~ )', 'Thanh hỏi ( ? )', 'Thanh sắc ( / )', 'Thanh huyền ( \\ )'],
    correctIndex: 0,
    explanation: 'Tiếng "mỡ" mang thanh ngã, lượn sóng như con sóng nhỏ.',
    mascotTip: 'Thanh ngã như dải lụa uốn lượn!',
  },
  {
    id: 6,
    word: 'ba',
    speechText: 'ba',
    toneName: 'Thanh ngang',
    options: ['Thanh ngang (không dấu)', 'Thanh huyền', 'Thanh sắc', 'Thanh nặng'],
    correctIndex: 0,
    explanation: 'Tiếng "ba" mang thanh ngang (thanh không dấu), giọng đọc đều và bằng phẳng.',
    mascotTip: 'Tiếng không có dấu gọi là thanh ngang con nhé!',
  },
  {
    id: 7,
    word: 'cá',
    speechText: 'cá',
    toneName: 'Thanh sắc',
    options: ['Thanh sắc ( / )', 'Thanh huyền ( \\ )', 'Thanh hỏi ( ? )', 'Thanh ngã ( ~ )'],
    correctIndex: 0,
    explanation: 'Tiếng "cá" mang thanh sắc.',
    mascotTip: 'Chú cá bơi tung tăng có thanh sắc!',
  },
  {
    id: 8,
    word: 'cọ',
    speechText: 'cọ',
    toneName: 'Thanh nặng',
    options: ['Thanh nặng ( . )', 'Thanh hỏi ( ? )', 'Thanh huyền ( \\ )', 'Thanh sắc ( / )'],
    correctIndex: 0,
    explanation: 'Tiếng "cọ" mang thanh nặng.',
    mascotTip: 'Cây cọ xòe ô có dấu nặng bên dưới chữ o!',
  },
  {
    id: 9,
    word: 'hổ',
    speechText: 'hổ',
    toneName: 'Thanh hỏi',
    options: ['Thanh hỏi ( ? )', 'Thanh ngã ( ~ )', 'Thanh sắc ( / )', 'Thanh nặng ( . )'],
    correctIndex: 0,
    explanation: 'Tiếng "hổ" mang thanh hỏi.',
    mascotTip: 'Chú hổ chúa sơn lâm mang thanh hỏi!',
  },
  {
    id: 10,
    word: 'gỗ',
    speechText: 'gỗ',
    toneName: 'Thanh ngã',
    options: ['Thanh ngã ( ~ )', 'Thanh hỏi ( ? )', 'Thanh nặng ( . )', 'Thanh huyền ( \\ )'],
    correctIndex: 0,
    explanation: 'Tiếng "gỗ" mang thanh ngã.',
    mascotTip: 'Khúc gỗ rừng sâu mang thanh ngã uốn lượn!',
  },
];

// =========================================================================
// ZONE 4: THẾ GIỚI TỪ NGỮ
// =========================================================================

// Game 27: Tìm từ cùng chủ đề (10 rounds)
export interface CategoryWordsRound {
  id: number;
  categoryName: string;
  categoryIcon: string;
  instruction: string;
  words: { text: string; isCorrect: boolean }[];
  explanation: string;
  mascotTip: string;
}

export const CATEGORY_WORDS_ROUNDS: CategoryWordsRound[] = [
  {
    id: 1,
    categoryName: 'Gia đình thân yêu',
    categoryIcon: '👨‍👩‍👧‍👦',
    instruction: 'Chọn từ chỉ người trong gia đình:',
    words: [
      { text: 'ông bà', isCorrect: true },
      { text: 'cái bàn', isCorrect: false },
      { text: 'bố mẹ', isCorrect: true },
      { text: 'quyển sách', isCorrect: false },
      { text: 'anh chị', isCorrect: true },
    ],
    explanation: 'Các từ chỉ người thân trong gia đình gồm: ông bà, bố mẹ, anh chị.',
    mascotTip: 'Những người yêu thương bé nhất trong một mái nhà!',
  },
  {
    id: 2,
    categoryName: 'Đồ dùng học tập',
    categoryIcon: '🎒',
    instruction: 'Chọn các từ chỉ đồ dùng học tập của bé:',
    words: [
      { text: 'hộp bút', isCorrect: true },
      { text: 'thước kẻ', isCorrect: true },
      { text: 'con gà', isCorrect: false },
      { text: 'vở bài tập', isCorrect: true },
      { text: 'củ khoai', isCorrect: false },
    ],
    explanation: 'Hộp bút, thước kẻ, vở bài tập là đồ dùng học tập quen thuộc.',
    mascotTip: 'Những đồ vật bé mang trong cặp sách tới trường!',
  },
  {
    id: 3,
    categoryName: 'Con vật nuôi',
    categoryIcon: '🐶',
    instruction: 'Chọn các con vật nuôi trong nhà:',
    words: [
      { text: 'chú cún', isCorrect: true },
      { text: 'con mèo', isCorrect: true },
      { text: 'bông hoa', isCorrect: false },
      { text: 'con lợn', isCorrect: true },
      { text: 'chiếc xe', isCorrect: false },
    ],
    explanation: 'Chú cún, con mèo, con lợn là các vật nuôi gần gũi.',
    mascotTip: 'Những con vật đáng yêu nuôi ở trang trại hoặc trong nhà.',
  },
  {
    id: 4,
    categoryName: 'Cây cối & Hoa quả',
    categoryIcon: '🍎',
    instruction: 'Chọn các loài hoa và quả thơm ngon:',
    words: [
      { text: 'quả cam', isCorrect: true },
      { text: 'hoa hồng', isCorrect: true },
      { text: 'cái quạt', isCorrect: false },
      { text: 'quả chuối', isCorrect: true },
      { text: 'đôi giày', isCorrect: false },
    ],
    explanation: 'Quả cam, hoa hồng, quả chuối thuộc chủ đề cây cối hoa quả.',
    mascotTip: 'Cây cối hoa quả cho bóng mát và quả ngọt lành.',
  },
  {
    id: 5,
    categoryName: 'Hoạt động ở trường',
    categoryIcon: '🏫',
    instruction: 'Chọn từ chỉ hoạt động của học sinh ở trường:',
    words: [
      { text: 'đọc sách', isCorrect: true },
      { text: 'viết chữ', isCorrect: true },
      { text: 'chiếc bàn', isCorrect: false },
      { text: 'tập thể dục', isCorrect: true },
      { text: 'ngọn núi', isCorrect: false },
    ],
    explanation: 'Đọc sách, viết chữ, tập thể dục là các việc làm chăm chỉ ở trường.',
    mascotTip: 'Những việc bé làm cùng thầy cô và bạn bè trên lớp.',
  },
  {
    id: 6,
    categoryName: 'Màu sắc rực rỡ',
    categoryIcon: '🎨',
    instruction: 'Chọn các từ chỉ màu sắc:',
    words: [
      { text: 'đỏ tươi', isCorrect: true },
      { text: 'xanh biếc', isCorrect: true },
      { text: 'chạy nhảy', isCorrect: false },
      { text: 'vàng óng', isCorrect: true },
      { text: 'bát cơm', isCorrect: false },
    ],
    explanation: 'Đỏ tươi, xanh biếc, vàng óng là các từ chỉ màu sắc.',
    mascotTip: 'Những màu sắc rực rỡ của hộp bút sáp màu.',
  },
  {
    id: 7,
    categoryName: 'Đồ chơi trẻ em',
    categoryIcon: '🧸',
    instruction: 'Chọn các món đồ chơi đáng yêu:',
    words: [
      { text: 'gấu bông', isCorrect: true },
      { text: 'ô tô đồ chơi', isCorrect: true },
      { text: 'viên phấn', isCorrect: false },
      { text: 'xếp hình', isCorrect: true },
      { text: 'con muỗi', isCorrect: false },
    ],
    explanation: 'Gấu bông, ô tô đồ chơi, xếp hình là đồ chơi bé yêu thích.',
    mascotTip: 'Những món đồ chơi vui nhộn cùng bé giải trí.',
  },
  {
    id: 8,
    categoryName: 'Thời tiết',
    categoryIcon: '⛅',
    instruction: 'Chọn các từ nói về thời tiết thiên nhiên:',
    words: [
      { text: 'nắng ấm', isCorrect: true },
      { text: 'mưa rào', isCorrect: true },
      { text: 'bút chì', isCorrect: false },
      { text: 'gió mát', isCorrect: true },
      { text: 'bàn học', isCorrect: false },
    ],
    explanation: 'Nắng ấm, mưa rào, gió mát miêu tả thời tiết đất trời.',
    mascotTip: 'Hiện tượng nắng mưa gió bão trên bầu trời.',
  },
  {
    id: 9,
    categoryName: 'Phương tiện giao thông',
    categoryIcon: '🚗',
    instruction: 'Chọn các phương tiện đi lại trên đường:',
    words: [
      { text: 'xe đạp', isCorrect: true },
      { text: 'xe buýt', isCorrect: true },
      { text: 'cây táo', isCorrect: false },
      { text: 'máy bay', isCorrect: true },
      { text: 'hạt thóc', isCorrect: false },
    ],
    explanation: 'Xe đạp, xe buýt, máy bay là các phương tiện giao thông.',
    mascotTip: 'Những phương tiện đưa chúng ta đi muôn nơi.',
  },
  {
    id: 10,
    categoryName: 'Nghề nghiệp thân quen',
    categoryIcon: '👩‍🏫',
    instruction: 'Chọn các từ chỉ nghề nghiệp:',
    words: [
      { text: 'cô giáo', isCorrect: true },
      { text: 'bác sĩ', isCorrect: true },
      { text: 'hộp phấn', isCorrect: false },
      { text: 'chú công an', isCorrect: true },
      { text: 'dòng sông', isCorrect: false },
    ],
    explanation: 'Cô giáo, bác sĩ, chú công an là các nghề nghiệp đáng kính.',
    mascotTip: 'Những cô bác làm công việc có ích cho xã hội.',
  },
];

// =========================================================================
// ZONE 5: VƯỜN ĐỌC SÁCH
// =========================================================================

// Game 32: Sắp xếp câu chuyện theo trình tự (10 rounds)
export interface StorySequenceRound {
  id: number;
  storyTitle: string;
  cards: { id: string; stepOrder: number; text: string; emoji: string }[];
  narration: string;
  mascotTip: string;
}

export const STORY_SEQUENCE_ROUNDS: StorySequenceRound[] = [
  {
    id: 1,
    storyTitle: 'Mầm cây lớn lên',
    cards: [
      { id: 'c1', stepOrder: 1, text: 'Gieo hạt xuống đất xốp', emoji: '🌱' },
      { id: 'c2', stepOrder: 2, text: 'Hạt nảy mầm vươn lên', emoji: '🌿' },
      { id: 'c3', stepOrder: 3, text: 'Cây nở những bông hoa tươi', emoji: '🌸' },
    ],
    narration: 'Đầu tiên bé gieo hạt, sau đó hạt nảy mầm, cuối cùng nở hoa rực rỡ.',
    mascotTip: 'Bắt đầu từ gieo hạt bé nhỏ con nhé!',
  },
  {
    id: 2,
    storyTitle: 'Chú gà con chào đời',
    cards: [
      { id: 'c1', stepOrder: 1, text: 'Gà mẹ ấp quả trứng tròn', emoji: '🥚' },
      { id: 'c2', stepOrder: 2, text: 'Vỏ trứng nứt ra tí tách', emoji: '🐣' },
      { id: 'c3', stepOrder: 3, text: 'Chú gà con lông vàng chào đời', emoji: '🐥' },
    ],
    narration: 'Gà mẹ ấp trứng, rồi vỏ trứng nứt, chú gà con kêu chíp chíp chào đời.',
    mascotTip: 'Quả trứng tròn có trước con nhé!',
  },
  {
    id: 3,
    storyTitle: 'Bé rửa tay sạch sẽ',
    cards: [
      { id: 'c1', stepOrder: 1, text: 'Lấy xà phòng tạo bọt', emoji: '🧼' },
      { id: 'c2', stepOrder: 2, text: 'Xoa đều hai bàn tay', emoji: '🤲' },
      { id: 'c3', stepOrder: 3, text: 'Rửa sạch dưới vòi nước trong', emoji: '💧' },
    ],
    narration: 'Bé lấy xà phòng, xoa đều rồi xả sạch bọt dưới vòi nước.',
    mascotTip: 'Nhớ xoa xà phòng trước khi xả nước!',
  },
  {
    id: 4,
    storyTitle: 'Một ngày của bé',
    cards: [
      { id: 'c1', stepOrder: 1, text: 'Sớm mai thức dậy đánh răng', emoji: '🪥' },
      { id: 'c2', stepOrder: 2, text: 'Đeo cặp sách vui bước tới trường', emoji: '🎒' },
      { id: 'c3', stepOrder: 3, text: 'Buổi tối ngủ ngoan đúng giờ', emoji: '🛌' },
    ],
    narration: 'Sáng dậy đánh răng, ngày đi học, tối ngủ ngoan.',
    mascotTip: 'Bắt đầu từ sáng sớm mai thức dậy!',
  },
  {
    id: 5,
    storyTitle: 'Bướm xinh biến hình',
    cards: [
      { id: 'c1', stepOrder: 1, text: 'Chú sâu nhỏ bò trên lá', emoji: '🐛' },
      { id: 'c2', stepOrder: 2, text: 'Hóa thành chiếc kén ngủ say', emoji: '🪵' },
      { id: 'c3', stepOrder: 3, text: 'Hóa thành cánh bướm rực rỡ', emoji: '🦋' },
    ],
    narration: 'Từ chú sâu nhỏ thành kén, rồi bay lượn thành cánh bướm xinh.',
    mascotTip: 'Chú sâu bò trên lá là bước đầu tiên!',
  },
  {
    id: 6,
    storyTitle: 'Bé tưới cây hoa',
    cards: [
      { id: 'c1', stepOrder: 1, text: 'Múc nước đầy ô doa nhỏ', emoji: '🪣' },
      { id: 'c2', stepOrder: 2, text: 'Tưới đều lên gốc cây hoa', emoji: '🚿' },
      { id: 'c3', stepOrder: 3, text: 'Bông hoa khoe sắc tươi cười', emoji: '🌻' },
    ],
    narration: 'Múc nước, tưới mát cho cây, cây hoa nở nụ cười tươi.',
    mascotTip: 'Lấy nước trước rồi mới tưới cây con nhé!',
  },
  {
    id: 7,
    storyTitle: 'Làm bánh sinh nhật',
    cards: [
      { id: 'c1', stepOrder: 1, text: 'Trộn bột mì và trứng thơm', emoji: '🥣' },
      { id: 'c2', stepOrder: 2, text: 'Nướng bánh vàng ươm trong lò', emoji: '♨️' },
      { id: 'c3', stepOrder: 3, text: 'Trang trí nến và hát chúc mừng', emoji: '🎂' },
    ],
    narration: 'Trộn bột, nướng bánh rồi thắp nến chúc mừng sinh nhật.',
    mascotTip: 'Bột mì được trộn đầu tiên!',
  },
  {
    id: 8,
    storyTitle: 'Bác nông dân gặt lúa',
    cards: [
      { id: 'c1', stepOrder: 1, text: 'Cấy mạ non xanh mướt ruộng đồng', emoji: '🌾' },
      { id: 'c2', stepOrder: 2, text: 'Lúa chín vàng óng ánh nắng mai', emoji: '☀️' },
      { id: 'c3', stepOrder: 3, text: 'Thu hoạch những bao thóc đầy', emoji: '🚜' },
    ],
    narration: 'Cấy lúa, đợi lúa chín rồi gặt hái thóc vàng.',
    mascotTip: 'Cấy mạ non là bước mở đầu!',
  },
  {
    id: 9,
    storyTitle: 'Chú chim xây tổ',
    cards: [
      { id: 'c1', stepOrder: 1, text: 'Tha từng nhánh cỏ khô về cành', emoji: '🌿' },
      { id: 'c2', stepOrder: 2, text: 'Đan thành chiếc tổ êm ấm', emoji: '🪺' },
      { id: 'c3', stepOrder: 3, text: 'Đẻ những quả trứng tí hon', emoji: '🥚' },
    ],
    narration: 'Tha rơm cỏ, đan tổ ấm, rồi sinh ra trứng chim xinh xắn.',
    mascotTip: 'Chú chim chăm chỉ tha rơm trước!',
  },
  {
    id: 10,
    storyTitle: 'Bé vẽ bức tranh',
    cards: [
      { id: 'c1', stepOrder: 1, text: 'Trải tờ giấy trắng tinh ra bàn', emoji: '📄' },
      { id: 'c2', stepOrder: 2, text: 'Dùng bút chì vẽ nét thân quen', emoji: '✏️' },
      { id: 'c3', stepOrder: 3, text: 'Tô màu rực rỡ tặng cô giáo', emoji: '🖼️' },
    ],
    narration: 'Lấy giấy, vẽ nét chì rồi tô màu sắc tuyệt đẹp tặng cô.',
    mascotTip: 'Chúc mừng bé đã sắp xếp đúng câu chuyện!',
  },
];
