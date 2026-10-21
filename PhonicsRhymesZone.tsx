import React, { useState } from 'react';
import {
  Volume2,
  Volume1,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Play,
  Star,
  Lock,
} from 'lucide-react';
import { audioManager } from '../../services/audioManager';
import { MascotBee, MascotTeacher } from '../illustrations/VectorIllustrations';

export interface PhonicsLesson {
  id: string;
  lessonNumber: number;
  title: string;
  subtitle: string;
  category: 'initial' | 'clusters' | 'spelling-rule' | 'rhymes';
  focusItems: Array<{
    display: string;
    soundText: string;
    mouthShape: string;
    sampleWords: Array<{ word: string; meaning: string; speechText: string; emoji?: string }>;
  }>;
  interactiveQuiz: {
    instruction: string;
    promptText: string;
    speechText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    hint: string;
  };
}

export const PHONICS_RHYMES_LESSONS: PhonicsLesson[] = [
  {
    id: 'pr-01',
    lessonNumber: 1,
    title: 'Bài 1: Âm đầu cơ bản b, c, d, đ',
    subtitle: 'Luyện phát âm chuẩn 4 phụ âm đầu và phân biệt nét chữ b - d - đ',
    category: 'initial',
    focusItems: [
      {
        display: 'b',
        soundText: 'bờ',
        mouthShape: 'Hai môi khép lại rồi bật hơi nhẹ tạo âm /bờ/',
        sampleWords: [
          { word: 'bơ', meaning: 'quả bơ béo ngậy', speechText: 'bơ', emoji: '🥑' },
          { word: 'bà', meaning: 'bà hiền từ', speechText: 'bà', emoji: '👵' },
        ],
      },
      {
        display: 'c',
        soundText: 'cờ',
        mouthShape: 'Gốc lưỡi nâng lên chạm vào ngạc mềm rồi hạ xuống',
        sampleWords: [
          { word: 'cá', meaning: 'con cá bơi', speechText: 'cá', emoji: '🐟' },
          { word: 'cờ', meaning: 'lá cờ đỏ', speechText: 'cờ', emoji: '🚩' },
        ],
      },
      {
        display: 'd',
        soundText: 'dờ',
        mouthShape: 'Đầu lưỡi chạm mặt sau răng trên, luồng hơi xát nhẹ qua kẽ răng',
        sampleWords: [
          { word: 'dưa', meaning: 'quả dưa hấu', speechText: 'dưa', emoji: '🍉' },
          { word: 'dê', meaning: 'chú dê núi', speechText: 'dê', emoji: '🐐' },
        ],
      },
      {
        display: 'đ',
        soundText: 'đờ',
        mouthShape: 'Đầu lưỡi chạm lợi trên rồi bật xuống dứt khoát',
        sampleWords: [
          { word: 'đèn', meaning: 'đèn học sáng', speechText: 'đèn', emoji: '💡' },
          { word: 'đá', meaning: 'hòn đá cuội', speechText: 'đá', emoji: '🪨' },
        ],
      },
    ],
    interactiveQuiz: {
      instruction: 'Bé hãy lắng nghe âm thanh và chọn chữ cái có âm tương ứng:',
      promptText: '🔊 Nghe âm: /đờ/',
      speechText: 'đ',
      options: ['b', 'd', 'đ', 'c'],
      correctIndex: 2,
      explanation: 'Âm đọc là /đờ/, tương ứng với chữ "đ" (có dấu gạch ngang trên nét sổ).',
      hint: 'Chữ này có nét gạch ngang ở giữa nét sổ thẳng bên trái con nhé!',
    },
  },
  {
    id: 'pr-02',
    lessonNumber: 2,
    title: 'Bài 2: Âm đầu ghép ch, kh, nh, th, ph',
    subtitle: 'Làm quen các phụ âm ghép 2 chữ cái phổ biến nhất trong sách Tiếng Việt 1',
    category: 'clusters',
    focusItems: [
      {
        display: 'ch',
        soundText: 'chờ',
        mouthShape: 'Đầu lưỡi đặt giữa răng và lợi rồi bật hơi nhẹ nhàng',
        sampleWords: [
          { word: 'chó', meaning: 'chú cún con', speechText: 'chó', emoji: '🐶' },
          { word: 'chim', meaning: 'chú chim non', speechText: 'chim', emoji: '🐦' },
        ],
      },
      {
        display: 'kh',
        soundText: 'khờ',
        mouthShape: 'Mặt lưỡi sau nâng lên sát ngạc mềm tạo tiếng khạc nhẹ',
        sampleWords: [
          { word: 'khỉ', meaning: 'chú khỉ tinh nghịch', speechText: 'khỉ', emoji: '🐵' },
          { word: 'khế', meaning: 'quả khế năm múi', speechText: 'khế', emoji: '⭐' },
        ],
      },
      {
        display: 'nh',
        soundText: 'nhờ',
        mouthShape: 'Mặt lưỡi ép sát ngạc cứng, luồng hơi thoát qua mũi',
        sampleWords: [
          { word: 'nhà', meaning: 'ngôi nhà ấm áp', speechText: 'nhà', emoji: '🏡' },
          { word: 'nho', meaning: 'chùm nho tím', speechText: 'nho', emoji: '🍇' },
        ],
      },
      {
        display: 'th',
        soundText: 'thờ',
        mouthShape: 'Đầu lưỡi chạm lợi hàm trên rồi bật hơi mạnh',
        sampleWords: [
          { word: 'thỏ', meaning: 'chú thỏ trắng', speechText: 'thỏ', emoji: '🐰' },
          { word: 'thuyền', meaning: 'con thuyền trôi', speechText: 'thuyền', emoji: '⛵' },
        ],
      },
    ],
    interactiveQuiz: {
      instruction: 'Tiếng nào dưới đây bắt đầu bằng âm ghép "nh"?',
      promptText: 'Tìm tiếng có âm đầu "nh"',
      speechText: 'Tiếng nào dưới đây bắt đầu bằng âm nh: chó, khỉ, nhà, thỏ?',
      options: ['chó', 'khỉ', 'nhà', 'thỏ'],
      correctIndex: 2,
      explanation: 'Tiếng "nhà" có âm đầu là "nh", vần "a" và thanh huyền: nh - a - nha - huyền - nhà.',
      hint: 'Nơi gia đình em cùng quây quần sinh sống mỗi ngày.',
    },
  },
  {
    id: 'pr-03',
    lessonNumber: 3,
    title: 'Bài 3: Quy tắc chính tả c/k, g/gh, ng/ngh',
    subtitle: 'Nắm vững quy tắc "vàng" viết trước các nguyên âm e, ê, i trong tiếng Việt',
    category: 'spelling-rule',
    focusItems: [
      {
        display: 'k / gh / ngh',
        soundText: 'ca, ghê, nghê',
        mouthShape: 'Luôn đứng trước 3 nguyên âm: e, ê, i',
        sampleWords: [
          { word: 'kẻ vở', meaning: 'viết bằng k vì đi với e', speechText: 'kẻ vở', emoji: '📏' },
          { word: 'ghế gỗ', meaning: 'viết bằng gh vì đi với ê', speechText: 'ghế gỗ', emoji: '🪑' },
          { word: 'nghỉ ngơi', meaning: 'viết bằng ngh vì đi với i', speechText: 'nghỉ ngơi', emoji: '🛌' },
        ],
      },
      {
        display: 'c / g / ng',
        soundText: 'cờ, gờ, ngờ',
        mouthShape: 'Đứng trước các nguyên âm còn lại: a, o, ô, ơ, u, ư...',
        sampleWords: [
          { word: 'con cá', meaning: 'viết bằng c vì đi với a', speechText: 'con cá', emoji: '🐟' },
          { word: 'con gà', meaning: 'viết bằng g vì đi với a', speechText: 'con gà', emoji: '🐔' },
          { word: 'ngôi sao', meaning: 'viết bằng ng vì đi với ô', speechText: 'ngôi sao', emoji: '⭐' },
        ],
      },
    ],
    interactiveQuiz: {
      instruction: 'Điền "c" hay "k" vào chỗ trống để được từ viết đúng chính tả: "...em que"',
      promptText: '[ ? ]em que',
      speechText: 'Điền c hay k vào từ kem que?',
      options: ['k (kem que)', 'c (cem que)'],
      correctIndex: 0,
      explanation: 'Quy tắc: Trước nguyên âm "e" phải viết bằng con chữ "k", do đó viết "kem que" là đúng.',
      hint: 'Đứng trước e, ê, i thì dùng chữ k con nhé!',
    },
  },
  {
    id: 'pr-04',
    lessonNumber: 4,
    title: 'Bài 4: Nhóm vần có âm cuối n: an, at, on, ot',
    subtitle: 'Luyện tai nghe và đánh vần các cặp vần kết thúc bằng âm n (vần mũi) và t (vần tắc)',
    category: 'rhymes',
    focusItems: [
      {
        display: 'an - at',
        soundText: 'a-n-an, a-t-at',
        mouthShape: 'Vần an luồng hơi ra mũi nhẹ; vần at đầu lưỡi chặn luồng hơi dứt khoát',
        sampleWords: [
          { word: 'bàn', meaning: 'cái bàn học', speechText: 'bàn', emoji: '🪵' },
          { word: 'bát', meaning: 'cái bát cơm', speechText: 'bát', emoji: '🥣' },
        ],
      },
      {
        display: 'on - ot',
        soundText: 'o-n-on, o-t-ot',
        mouthShape: 'Môi tròn rồi khép nhẹ với n hoặc bật tắc với t',
        sampleWords: [
          { word: 'nón', meaning: 'chiếc nón lá', speechText: 'nón', emoji: '👒' },
          { word: 'ngọt', meaning: 'vị ngọt dịu', speechText: 'ngọt', emoji: '🍯' },
        ],
      },
    ],
    interactiveQuiz: {
      instruction: 'Tiếng nào dưới đây chứa vần "an"?',
      promptText: 'Tìm tiếng có vần "an"',
      speechText: 'Tiếng nào chứa vần an: quả cam, bạn bè, con cá, chú thỏ?',
      options: ['quả cam', 'bạn bè', 'con cá', 'chú thỏ'],
      correctIndex: 1,
      explanation: 'Tiếng "bạn" có âm đầu b, phần vần là "an" và thanh nặng: b - an - ban - nặng - bạn.',
      hint: 'Bạn bè cùng học tập chan hòa, tiếng bạn có vần an!',
    },
  },
  {
    id: 'pr-05',
    lessonNumber: 5,
    title: 'Bài 5: Nhóm vần có âm cuối m: am, ap, em, ep',
    subtitle: 'Phân biệt vần khép môi am - ap, em - ep qua các từ ngữ đời sống quen thuộc',
    category: 'rhymes',
    focusItems: [
      {
        display: 'am - ap',
        soundText: 'a-m-am, a-p-ap',
        mouthShape: 'Kết thúc bằng cách khép chặt hai môi',
        sampleWords: [
          { word: 'cam', meaning: 'quả cam vàng', speechText: 'cam', emoji: '🍊' },
          { word: 'tháp', meaning: 'tòa tháp cao', speechText: 'tháp', emoji: '🗼' },
        ],
      },
      {
        display: 'em - ep',
        soundText: 'e-m-em, e-p-ep',
        mouthShape: 'Mở rộng miệng sang hai bên rồi khép môi',
        sampleWords: [
          { word: 'tem', meaning: 'con tem thư', speechText: 'tem', emoji: '✉️' },
          { word: 'chép', meaning: 'cá chép đỏ', speechText: 'chép', emoji: '🐟' },
        ],
      },
    ],
    interactiveQuiz: {
      instruction: 'Âm đầu "c" ghép với vần "am" và thanh ngang tạo thành tiếng gì?',
      promptText: 'c + am = [ ? ]',
      speechText: 'Âm c ghép với vần am tạo thành tiếng gì?',
      options: ['cam', 'can', 'cát', 'cáp'],
      correctIndex: 0,
      explanation: 'c - am - cam. Quả cam vàng ngọt mọng nước.',
      hint: 'Loài quả tròn màu cam mọng nước, giàu vitamin C.',
    },
  },
  {
    id: 'pr-06',
    lessonNumber: 6,
    title: 'Bài 6: Nhóm vần đôi: ua, ưa, oi, ai, ơi',
    subtitle: 'Tập ghép vần có nguyên âm đôi và vần kết thúc bằng bán âm i',
    category: 'rhymes',
    focusItems: [
      {
        display: 'ua - ưa',
        soundText: 'u-a-ua, ư-a-ưa',
        mouthShape: 'Chuyển khẩu hình từ hẹp sang mở',
        sampleWords: [
          { word: 'rùa', meaning: 'chú rùa bơi', speechText: 'rùa', emoji: '🐢' },
          { word: 'sữa', meaning: 'sữa thơm ngon', speechText: 'sữa', emoji: '🥛' },
        ],
      },
      {
        display: 'oi - ai - ơi',
        soundText: 'o-i-oi, a-i-ai, ơ-i-ơi',
        mouthShape: 'Nguyên âm trước mở, nguyên âm sau khép miệng thành âm i',
        sampleWords: [
          { word: 'voi', meaning: 'chú voi con', speechText: 'voi', emoji: '🐘' },
          { word: 'mai', meaning: 'hoa mai vàng', speechText: 'mai', emoji: '🌼' },
          { word: 'bơi', meaning: 'bé tập bơi', speechText: 'bơi', emoji: '🏊' },
        ],
      },
    ],
    interactiveQuiz: {
      instruction: 'Trong câu "Bé tập bơi lội", tiếng nào có chứa vần "ơi"?',
      promptText: 'Bé tập bơi lội',
      speechText: 'Trong câu bé tập bơi lội, tiếng nào chứa vần ơi?',
      options: ['Bé', 'tập', 'bơi', 'lội'],
      correctIndex: 2,
      explanation: 'Tiếng "bơi" có âm đầu b và vần ơi: b - ơi - bơi.',
      hint: 'Hoạt động bé bơi dưới nước, tiếng này chứa vần ơi con nhé!',
    },
  },
];

interface Props {
  onGoHome?: () => void;
  onBack?: () => void;
  onPlayGame?: (gameId: number) => void;
}

export const PhonicsRhymesZone: React.FC<Props> = ({ onGoHome, onBack, onPlayGame }) => {
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['pr-01']);

  // Syllable Blender Tool State
  const [blenderInitial, setBlenderInitial] = useState('b');
  const [blenderRhyme, setBlenderRhyme] = useState('a');
  const [blenderTone, setBlenderTone] = useState<'ngang' | 'huyen' | 'sac' | 'hoi' | 'nga' | 'nang'>('ngang');

  const currentLesson = PHONICS_RHYMES_LESSONS[currentLessonIdx];

  const handleSpeakItem = (text: string) => {
    audioManager.speak(text);
  };

  const getBlendedWord = (initial: string, rhyme: string, tone: string) => {
    // Generate common Grade 1 syllable
    if (initial === 'b' && rhyme === 'a') {
      if (tone === 'huyen') return 'bà';
      if (tone === 'sac') return 'bá';
      if (tone === 'hoi') return 'bả';
      if (tone === 'nga') return 'bã';
      if (tone === 'nang') return 'bạ';
      return 'ba';
    }
    if (initial === 'c' && rhyme === 'a') {
      if (tone === 'huyen') return 'cà';
      if (tone === 'sac') return 'cá';
      if (tone === 'hoi') return 'cả';
      if (tone === 'nga') return 'cã';
      if (tone === 'nang') return 'cạ';
      return 'ca';
    }
    if (initial === 'm' && rhyme === 'e') {
      if (tone === 'huyen') return 'mè';
      if (tone === 'sac') return 'mé';
      if (tone === 'hoi') return 'mẻ';
      if (tone === 'nga') return 'mẽ';
      if (tone === 'nang') return 'mẹ';
      return 'me';
    }
    if (initial === 'b' && rhyme === 'an') {
      if (tone === 'huyen') return 'bàn';
      if (tone === 'sac') return 'bán';
      if (tone === 'hoi') return 'bản';
      if (tone === 'nang') return 'bạn';
      return 'ban';
    }
    return `${initial}${rhyme}`;
  };

  const currentBlended = getBlendedWord(blenderInitial, blenderRhyme, blenderTone);

  const handleCheckQuiz = () => {
    if (selectedOption === null || isChecked) return;
    const correct = selectedOption === currentLesson.interactiveQuiz.correctIndex;
    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      audioManager.playSoundEffect('correct');
      if (!completedLessonIds.includes(currentLesson.id)) {
        setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
      }
      audioManager.speakOngVang('Chính xác! Bé làm bài rất giỏi!');
    } else {
      audioManager.playSoundEffect('wrong');
      audioManager.speakOngVang('Chưa chính xác rồi bé ơi, con hãy nghe lại gợi ý nhé!');
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIdx + 1 < PHONICS_RHYMES_LESSONS.length) {
      setCurrentLessonIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx((prev) => prev - 1);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Khu Vực 2 • Học Âm Và Vần Tiếng Việt</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Xưởng Khám Phá Âm & Vần
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm font-semibold max-w-xl mt-1 leading-relaxed">
            Học chuẩn ngữ âm: nhận diện phụ âm đầu, nguyên âm đơn, các cặp vần đôi và quy tắc chính tả e - ê - i.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer border border-white/30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>5 Khu vực</span>
            </button>
          )}

          {onGoHome && (
            <button
              onClick={onGoHome}
              className="btn-3d-yellow px-5 py-2.5 rounded-2xl text-slate-900 font-black text-xs sm:text-sm cursor-pointer shadow-md shrink-0"
            >
              Về trang chủ
            </button>
          )}
        </div>
      </div>

      {/* Lesson Selector Strip */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 scrollbar-thin">
        {PHONICS_RHYMES_LESSONS.map((lesson, idx) => {
          const isActive = idx === currentLessonIdx;
          const isDone = completedLessonIds.includes(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => {
                setCurrentLessonIdx(idx);
                setSelectedOption(null);
                setIsChecked(false);
                setIsCorrect(false);
              }}
              className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all cursor-pointer border-2 ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
              }`}
            >
              <span>{isDone ? '✅' : '📖'}</span>
              <span>Bài {lesson.lessonNumber}</span>
            </button>
          );
        })}
      </div>

      {/* Main Lesson View Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-300 shadow-lg mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-slate-100 mb-6">
          <div>
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wider">
              Bài {currentLesson.lessonNumber} • Tiến trình GDPT 2018
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-slate-800 mt-0.5">
              {currentLesson.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              {currentLesson.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevLesson}
              disabled={currentLessonIdx === 0}
              className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-black text-slate-600">
              {currentLessonIdx + 1} / {PHONICS_RHYMES_LESSONS.length}
            </span>
            <button
              onClick={handleNextLesson}
              disabled={currentLessonIdx === PHONICS_RHYMES_LESSONS.length - 1}
              className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Focus Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {currentLesson.focusItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-800">
                    {item.display}
                  </span>
                  <button
                    onClick={() => handleSpeakItem(item.soundText)}
                    className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-all cursor-pointer"
                    title={`Bấm nghe âm: ${item.soundText}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs font-bold text-slate-700 bg-white p-2 rounded-xl border border-slate-200 mb-2">
                  <span className="text-slate-400 block text-[10px]">Khẩu hình:</span>
                  <span>{item.mouthShape}</span>
                </div>
              </div>

              {/* Sample Words */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Tiếng mẫu:</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.sampleWords.map((w, wIdx) => (
                    <button
                      key={wIdx}
                      onClick={() => handleSpeakItem(w.speechText)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black cursor-pointer transition-all"
                    >
                      <span>{w.emoji}</span>
                      <span>{w.word}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Practice Quiz */}
        <div className="bg-amber-50/70 border-3 border-amber-300 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-black">
              ⭐ Bài Tập Thực Hành Lớp 1
            </span>
          </div>

          <h4 className="text-base sm:text-lg font-black text-slate-800 mb-2">
            {currentLesson.interactiveQuiz.instruction}
          </h4>

          {/* Prompt Banner */}
          <div className="my-4 p-4 bg-white border-2 border-amber-300 rounded-2xl flex items-center justify-between gap-3">
            <span className="text-xl sm:text-2xl font-black text-slate-800">
              {currentLesson.interactiveQuiz.promptText}
            </span>
            <button
              onClick={() => handleSpeakItem(currentLesson.interactiveQuiz.speechText)}
              className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-900 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Volume2 className="w-4 h-4" />
              <span>Nghe mẫu</span>
            </button>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            {currentLesson.interactiveQuiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let style = 'bg-white border-slate-300 text-slate-800 hover:border-amber-400';

              if (isChecked) {
                if (idx === currentLesson.interactiveQuiz.correctIndex) {
                  style = 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-4 ring-emerald-300 font-black';
                } else if (isSelected) {
                  style = 'bg-rose-100 border-rose-400 text-rose-900';
                }
              } else if (isSelected) {
                style = 'bg-amber-100 border-amber-500 text-amber-950 ring-4 ring-amber-300 font-black';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isChecked && setSelectedOption(idx)}
                  disabled={isChecked}
                  className={`p-4 rounded-2xl border-3 text-center font-black text-xl transition-all cursor-pointer ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Quiz Action */}
          <div className="mt-4 pt-4 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
            {!isChecked ? (
              <button
                onClick={handleCheckQuiz}
                disabled={selectedOption === null}
                className={`px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-1.5 cursor-pointer shadow-md ${
                  selectedOption !== null
                    ? 'btn-3d-green text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kiểm tra đáp án</span>
              </button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs sm:text-sm font-semibold text-slate-700">
                  <span className="font-black text-emerald-700">
                    {isCorrect ? '🎉 Tuyệt vời! ' : '💡 Gợi ý: '}
                  </span>
                  {currentLesson.interactiveQuiz.explanation}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isCorrect && (
                    <button
                      onClick={() => {
                        setSelectedOption(null);
                        setIsChecked(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-200 text-amber-950 font-black text-xs cursor-pointer"
                    >
                      Thử lại
                    </button>
                  )}

                  {currentLessonIdx + 1 < PHONICS_RHYMES_LESSONS.length && (
                    <button
                      onClick={handleNextLesson}
                      className="btn-3d-yellow px-5 py-2.5 rounded-xl text-slate-900 font-black text-xs flex items-center gap-1 cursor-pointer shadow-md"
                    >
                      <span>Bài tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Syllable Blender Workshop Tool */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-lg mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black">
            ⚙️ Máy Ghép Tiếng Tương Tác
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800">
          Ghép Âm Đầu + Vần + Dấu Thanh ➔ Tạo Tiếng Mới
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1 mb-6">
          Học sinh chạm chọn một âm đầu, một vần và một dấu thanh. Máy đọc tiếng Việt sẽ đánh vần và đọc trơn tiếng vừa ghép!
        </p>

        {/* 3 Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Column 1: Âm đầu */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border-2 border-emerald-300">
            <div className="text-xs font-black text-emerald-800 uppercase mb-2">1. Chọn Âm đầu:</div>
            <div className="grid grid-cols-4 gap-2">
              {['b', 'c', 'd', 'đ', 'm', 'n', 'l', 't'].map((init) => (
                <button
                  key={init}
                  onClick={() => {
                    setBlenderInitial(init);
                    audioManager.speak(init);
                  }}
                  className={`p-2.5 rounded-xl border-2 font-black text-lg cursor-pointer transition-all ${
                    blenderInitial === init
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-white hover:bg-emerald-100 text-slate-800 border-slate-200'
                  }`}
                >
                  {init}
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Vần */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border-2 border-amber-300">
            <div className="text-xs font-black text-amber-800 uppercase mb-2">2. Chọn Vần:</div>
            <div className="grid grid-cols-4 gap-2">
              {['a', 'e', 'o', 'u', 'an', 'at', 'am', 'on'].map((rh) => (
                <button
                  key={rh}
                  onClick={() => {
                    setBlenderRhyme(rh);
                    audioManager.speak(rh);
                  }}
                  className={`p-2.5 rounded-xl border-2 font-black text-lg cursor-pointer transition-all ${
                    blenderRhyme === rh
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-white hover:bg-amber-100 text-slate-800 border-slate-200'
                  }`}
                >
                  {rh}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Dấu thanh */}
          <div className="p-4 rounded-2xl bg-sky-50/60 border-2 border-sky-300">
            <div className="text-xs font-black text-sky-800 uppercase mb-2">3. Chọn Dấu thanh:</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ngang', label: 'Ngang (—)' },
                { id: 'huyen', label: 'Huyền (`)' },
                { id: 'sac', label: 'Sắc (´)' },
                { id: 'hoi', label: 'Hỏi (?)' },
                { id: 'nga', label: 'Ngã (~)' },
                { id: 'nang', label: 'Nặng (.)' },
              ].map((tn) => (
                <button
                  key={tn.id}
                  onClick={() => setBlenderTone(tn.id as any)}
                  className={`p-2 rounded-xl border-2 font-bold text-xs cursor-pointer transition-all ${
                    blenderTone === tn.id
                      ? 'bg-sky-600 text-white border-sky-700 shadow-sm font-black'
                      : 'bg-white hover:bg-sky-100 text-slate-800 border-slate-200'
                  }`}
                >
                  {tn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resulting Blended Syllable Display */}
        <div className="p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 rounded-2xl border-3 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-slate-500">Tiếng tạo thành:</div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-800 bg-white px-6 py-2 rounded-2xl border-2 border-emerald-400 shadow-inner">
              {currentBlended}
            </div>
          </div>

          <button
            onClick={() => handleSpeakItem(currentBlended)}
            className="btn-3d-yellow px-6 py-3 rounded-2xl text-slate-900 font-black text-sm flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Volume2 className="w-5 h-5 text-amber-800" />
            <span>Nghe Máy Đọc Tiếng Này</span>
          </button>
        </div>
      </div>

      {/* Linked Games Showcase in Zone 2 */}
      {onPlayGame && (
        <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-slate-800 text-base sm:text-lg flex items-center gap-2">
              <span>🎮 Các trò chơi ghép âm vần sẵn sàng:</span>
            </h4>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Chuẩn GDPT 2018
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 12, title: 'Ghép âm đầu với vần', desc: 'Cấu tạo tiếng: Âm đầu + Vần' },
              { id: 13, title: 'Ghép vần với tranh', desc: 'Nhận diện vần khuyết theo hình' },
              { id: 14, title: 'Bánh xe ghép vần', desc: 'Bánh xe âm đầu và vần 3D' },
              { id: 17, title: 'Xếp chữ thành tiếng', desc: 'Sắp xếp chữ xáo trộn có nghĩa' },
            ].map((gm) => (
              <button
                key={gm.id}
                onClick={() => onPlayGame(gm.id)}
                className="bg-white p-4 rounded-2xl border border-emerald-300 hover:border-emerald-500 hover:shadow-md text-left transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="text-xs font-black text-emerald-700 mb-1">Trò #{gm.id}</div>
                  <div className="font-black text-slate-800 group-hover:text-emerald-700 text-sm">
                    {gm.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{gm.desc}</div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-black text-emerald-600">
                  <Play className="w-3 h-3 fill-current" />
                  <span>Vào chơi ngay ➔</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
