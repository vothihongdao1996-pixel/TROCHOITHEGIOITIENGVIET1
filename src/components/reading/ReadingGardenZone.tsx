import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Volume1,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  ArrowLeft,
  BookOpen,
  Award,
  Flower2,
  Play,
  Check,
  HelpCircle,
  MoveRight,
  Smile,
} from 'lucide-react';
import { audioManager } from '../../services/audioManager';
import { MascotBee, MascotTeacher } from '../illustrations/VectorIllustrations';

interface Props {
  onBack?: () => void;
  onGoHome?: () => void;
  onPlayGame?: (gameId: number) => void;
}

interface BlossomFlower {
  id: number;
  word: string;
  emoji: string;
  speech: string;
  meaning: string;
}

const BLOSSOM_FLOWERS: BlossomFlower[] = [
  { id: 1, word: 'hoa sen', emoji: '🪷', speech: 'hoa sen', meaning: 'Loài hoa thơm ngát mùa hè' },
  { id: 2, word: 'mặt trời', emoji: '☀️', speech: 'mặt trời', meaning: 'Tỏa nắng vàng ấm áp' },
  { id: 3, word: 'đám mây', emoji: '☁️', speech: 'đám mây', meaning: 'Mây trắng bồng bềnh trên trời' },
  { id: 4, word: 'dòng suối', emoji: '🌊', speech: 'dòng suối', meaning: 'Nước suối trong veo mát lành' },
  { id: 5, word: 'cây thông', emoji: '🌲', speech: 'cây thông', meaning: 'Thông xanh mướt reo trong gió' },
  { id: 6, word: 'chú chim', emoji: '🐦', speech: 'chú chim', meaning: 'Chim hót líu lo chào ngày mới' },
];

interface FluencySentence {
  id: number;
  text: string;
  speech: string;
  illustration: string;
  highlightWord?: string;
}

const FLUENCY_SENTENCES: FluencySentence[] = [
  {
    id: 1,
    text: 'Bé chăm chỉ học bài.',
    speech: 'Bé chăm chỉ học bài.',
    illustration: '👧📖',
  },
  {
    id: 2,
    text: 'Mẹ đi chợ mua quả cam ngọt.',
    speech: 'Mẹ đi chợ mua quả cam ngọt.',
    illustration: '👩🧺🍊',
  },
  {
    id: 3,
    text: 'Hồ sen nở hoa thơm ngát.',
    speech: 'Hồ sen nở hoa thơm ngát.',
    illustration: '🪷🦆',
  },
  {
    id: 4,
    text: 'Mặt trời mọc đỏ rực rỡ.',
    speech: 'Mặt trời mọc đỏ rực rỡ.',
    illustration: '🌅✨',
  },
  {
    id: 5,
    text: 'Bé yêu cô giáo và mái trường.',
    speech: 'Bé yêu cô giáo và mái trường.',
    illustration: '🏫❤️',
  },
];

interface ComprehensionQuestion {
  id: number;
  passage: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  emoji: string;
}

const COMPREHENSION_QUESTIONS: ComprehensionQuestion[] = [
  {
    id: 1,
    passage: 'Buổi sáng, bé Mai thức dậy sớm, đánh răng rửa mặt rồi vui vẻ đến trường.',
    question: 'Buổi sáng bé Mai đi đâu?',
    options: ['Bé Mai đi chợ', 'Bé Mai đến trường', 'Bé Mai đi sở thú'],
    correctIndex: 1,
    explanation: 'Theo câu văn: "Buổi sáng, bé Mai thức dậy sớm... rồi vui vẻ đến trường".',
    emoji: '🏫',
  },
  {
    id: 2,
    passage: 'Dưới ao làng, những chú vịt con lông vàng óng đang bơi lội tung tăng bên cạnh mẹ.',
    question: 'Chú vịt con có bộ lông màu gì?',
    options: ['Màu trắng', 'Màu vàng óng', 'Màu nâu'],
    correctIndex: 1,
    explanation: 'Câu văn miêu tả: "những chú vịt con lông vàng óng".',
    emoji: '🦆',
  },
  {
    id: 3,
    passage: 'Cây bàng trước sân trường mùa hè xòe tán lá xanh mướt như một chiếc ô khổng lồ.',
    question: 'Tán lá cây bàng mùa hè được so sánh với cái gì?',
    options: ['Chiếc ô khổng lồ', 'Ngôi nhà nhỏ', 'Đám mây trắng'],
    correctIndex: 0,
    explanation: 'Câu văn có hình ảnh: "xòe tán lá xanh mướt như một chiếc ô khổng lồ".',
    emoji: '🌳',
  },
];

interface ScrambleSentenceItem {
  id: number;
  correctWords: string[];
  shuffledWords: string[];
  meaning: string;
  emoji: string;
}

const SCRAMBLE_SENTENCES: ScrambleSentenceItem[] = [
  {
    id: 1,
    correctWords: ['Bé', 'chăm', 'học', 'bài.'],
    shuffledWords: ['học', 'Bé', 'bài.', 'chăm'],
    meaning: 'Nói về sự chăm chỉ học tập của em bé',
    emoji: '📚',
  },
  {
    id: 2,
    correctWords: ['Mẹ', 'nấu', 'cơm', 'ngon.'],
    shuffledWords: ['ngon.', 'Mẹ', 'cơm', 'nấu'],
    meaning: 'Bữa cơm ấm áp mẹ nấu cho cả nhà',
    emoji: '🍲',
  },
  {
    id: 3,
    correctWords: ['Chim', 'hót', 'líu', 'lo.'],
    shuffledWords: ['lo.', 'líu', 'hót', 'Chim'],
    meaning: 'Tiếng chim hót ríu rít trên cành cây',
    emoji: '🐦',
  },
];

export const ReadingGardenZone: React.FC<Props> = ({ onBack, onGoHome, onPlayGame }) => {
  const [activeTab, setActiveTab] = useState<'blossom' | 'fluency' | 'comprehension' | 'scramble'>('fluency');

  // Blossom state
  const [bloomedFlowerIds, setBloomedFlowerIds] = useState<number[]>([]);

  // Fluency sentence index
  const [sentenceIdx, setSentenceIdx] = useState(0);

  // Comprehension state
  const [compIdx, setCompIdx] = useState(0);
  const [selectedCompOption, setSelectedCompOption] = useState<number | null>(null);
  const [isCompChecked, setIsCompChecked] = useState(false);

  // Scramble state
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambleSelectedWords, setScrambleSelectedWords] = useState<string[]>([]);
  const [isScrambleChecked, setIsScrambleChecked] = useState(false);
  const [isScrambleCorrect, setIsScrambleCorrect] = useState(false);

  const currentFluency = FLUENCY_SENTENCES[sentenceIdx];
  const currentComp = COMPREHENSION_QUESTIONS[compIdx];
  const currentScramble = SCRAMBLE_SENTENCES[scrambleIdx];

  const handleBloom = (flower: BlossomFlower) => {
    audioManager.speak(flower.speech);
    if (!bloomedFlowerIds.includes(flower.id)) {
      setBloomedFlowerIds((prev) => [...prev, flower.id]);
      audioManager.playSoundEffect('correct');
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleSpeakSentence = (text: string) => {
    audioManager.speak(text);
  };

  const handleCheckComp = () => {
    if (selectedCompOption === null) return;
    setIsCompChecked(true);
    if (selectedCompOption === currentComp.correctIndex) {
      audioManager.playSoundEffect('correct');
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } else {
      audioManager.playSoundEffect('wrong');
    }
  };

  const handleNextComp = () => {
    if (compIdx + 1 < COMPREHENSION_QUESTIONS.length) {
      setCompIdx((i) => i + 1);
      setSelectedCompOption(null);
      setIsCompChecked(false);
    }
  };

  const handleAddScrambleWord = (word: string) => {
    if (!scrambleSelectedWords.includes(word)) {
      setScrambleSelectedWords((prev) => [...prev, word]);
      audioManager.playSoundEffect('click');
      audioManager.speak(word.replace('.', ''));
    }
  };

  const handleRemoveScrambleWord = (idx: number) => {
    setScrambleSelectedWords((prev) => prev.filter((_, i) => i !== idx));
    audioManager.playSoundEffect('click');
  };

  const handleCheckScramble = () => {
    const isRight =
      scrambleSelectedWords.join(' ') === currentScramble.correctWords.join(' ');
    setIsScrambleChecked(true);
    setIsScrambleCorrect(isRight);

    if (isRight) {
      audioManager.playSoundEffect('correct');
      audioManager.speak(currentScramble.correctWords.join(' '));
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } else {
      audioManager.playSoundEffect('wrong');
    }
  };

  const handleNextScramble = () => {
    setScrambleIdx((i) => (i + 1) % SCRAMBLE_SENTENCES.length);
    setScrambleSelectedWords([]);
    setIsScrambleChecked(false);
    setIsScrambleCorrect(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Zone Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black mb-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Khu Vực 5 • Rèn Luyện Đọc Trơn & Đọc Hiểu Câu</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <span>Vườn Đọc Sách</span>
            <span className="text-3xl">📖</span>
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm font-semibold max-w-xl mt-1 leading-relaxed">
            Luyện đọc trơn tiếng, mở hoa từ ngữ, đọc hiểu câu văn ngắn và sắp xếp câu đúng ngữ pháp tiếng Việt cùng bạn Ong Vàng.
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
              className="btn-3d-yellow px-5 py-2.5 rounded-2xl text-slate-900 font-black text-xs sm:text-sm cursor-pointer shadow-md"
            >
              Về trang chủ
            </button>
          )}
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
        <button
          onClick={() => setActiveTab('fluency')}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border-2 ${
            activeTab === 'fluency'
              ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Luyện Đọc Câu Trơn</span>
        </button>

        <button
          onClick={() => setActiveTab('blossom')}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border-2 ${
            activeTab === 'blossom'
              ? 'bg-pink-600 text-white border-pink-700 shadow-md ring-2 ring-pink-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300'
          }`}
        >
          <Flower2 className="w-4 h-4" />
          <span>Đọc Tiếng Mở Hoa</span>
        </button>

        <button
          onClick={() => setActiveTab('comprehension')}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border-2 ${
            activeTab === 'comprehension'
              ? 'bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-red-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Đọc Hiểu Câu Văn</span>
        </button>

        <button
          onClick={() => setActiveTab('scramble')}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border-2 ${
            activeTab === 'scramble'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
          }`}
        >
          <MoveRight className="w-4 h-4" />
          <span>Sắp Xếp Từ Thành Câu</span>
        </button>
      </div>

      {/* Tab 1: Fluency Reading */}
      {activeTab === 'fluency' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-rose-300 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-slate-100 mb-6">
            <div>
              <div className="text-xs font-black text-rose-700 uppercase">
                Câu Luyện Đọc {sentenceIdx + 1} / {FLUENCY_SENTENCES.length}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                Luyện Đọc Trơn Câu Ngắn Chuẩn GDPT 2018
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSentenceIdx((i) => Math.max(0, i - 1))}
                disabled={sentenceIdx === 0}
                className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black text-slate-600">
                {sentenceIdx + 1} / {FLUENCY_SENTENCES.length}
              </span>
              <button
                onClick={() => setSentenceIdx((i) => Math.min(FLUENCY_SENTENCES.length - 1, i + 1))}
                disabled={sentenceIdx === FLUENCY_SENTENCES.length - 1}
                className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reading Display Area */}
          <div className="bg-gradient-to-br from-rose-50/60 via-amber-50/40 to-white rounded-3xl p-8 sm:p-12 border-3 border-rose-300 text-center my-6 flex flex-col items-center justify-center min-h-[260px] shadow-sm">
            <div className="text-5xl mb-4">{currentFluency.illustration}</div>

            {/* Sentence with huge font, spaced out for grade 1 */}
            <div className="text-3xl sm:text-5xl font-black text-slate-800 tracking-wide leading-relaxed selection:bg-rose-200">
              {currentFluency.text}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleSpeakSentence(currentFluency.speech)}
                className="btn-3d-yellow px-6 py-3 rounded-2xl text-slate-900 font-black text-sm flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Volume2 className="w-5 h-5 text-amber-800" />
                <span>Nghe Máy Đọc Mẫu</span>
              </button>

              <button
                onClick={() => {
                  audioManager.speakOngVang('Bé đọc to, rõ ràng và ngắt nghỉ ở dấu chấm nhé! Bạn giỏi lắm!');
                }}
                className="px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-950 font-black text-sm flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>🐝 Ong Vàng khích lệ</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              💡 Lời khuyên: Học sinh lớp 1 nên đọc to rõ ràng từng tiếng, không vội vàng, nghỉ hơi khi gặp dấu chấm.
            </span>

            {sentenceIdx + 1 < FLUENCY_SENTENCES.length && (
              <button
                onClick={() => setSentenceIdx((i) => i + 1)}
                className="btn-3d-green px-5 py-2.5 rounded-xl text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Blossom Flowers */}
      {activeTab === 'blossom' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-pink-300 shadow-lg text-center">
          <div className="max-w-xl mx-auto mb-6">
            <span className="px-3.5 py-1 bg-pink-100 text-pink-900 rounded-full text-xs font-black">
              🌸 Trò Chơi Đọc Tiếng
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Đọc Tiếng Mở Hoa Rực Rỡ
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Bé hãy đọc to từng tiếng hoặc bấm nghe máy đọc mẫu, nụ hoa sẽ bung nở thật tươi đẹp!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 my-8">
            {BLOSSOM_FLOWERS.map((flower) => {
              const isBloomed = bloomedFlowerIds.includes(flower.id);

              return (
                <div
                  key={flower.id}
                  onClick={() => handleBloom(flower)}
                  className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center justify-between min-h-[220px] cursor-pointer shadow-md ${
                    isBloomed
                      ? 'bg-gradient-to-tr from-rose-100 via-pink-50 to-white border-pink-400 scale-102 ring-4 ring-pink-200'
                      : 'bg-slate-50 hover:bg-pink-50/50 border-slate-200 hover:border-pink-300'
                  }`}
                >
                  <div className={`text-6xl mb-2 transition-transform duration-500 ${isBloomed ? 'scale-125' : 'scale-90 opacity-60'}`}>
                    {isBloomed ? flower.emoji : '🌱'}
                  </div>

                  <div className="font-black text-2xl text-slate-800 mt-1">
                    {flower.word}
                  </div>

                  <div className="text-xs text-slate-500 font-medium mt-1">
                    {flower.meaning}
                  </div>

                  <div className="mt-3">
                    {isBloomed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                        <span>Hoa đã nở</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Chạm để nở hoa</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {bloomedFlowerIds.length === BLOSSOM_FLOWERS.length && (
            <div className="p-4 bg-pink-50 rounded-2xl border border-pink-200 inline-flex items-center gap-2 text-pink-900 font-black text-sm">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>Tuyệt vời! Toàn bộ khu vườn hoa đã nở rộ hương sắc mừng bé học tốt!</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Reading Comprehension */}
      {activeTab === 'comprehension' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-red-300 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-slate-100 mb-6">
            <div>
              <div className="text-xs font-black text-red-700 uppercase">
                Bài {compIdx + 1} / {COMPREHENSION_QUESTIONS.length}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                Đọc Đoạn Văn & Trả Lời Câu Hỏi
              </h3>
            </div>
          </div>

          {/* Passage Box */}
          <div className="bg-red-50/70 border-3 border-red-200 rounded-3xl p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{currentComp.emoji}</span>
              <button
                onClick={() => handleSpeakSentence(currentComp.passage)}
                className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-900 font-black text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe đọc đoạn văn</span>
              </button>
            </div>

            <p className="text-lg sm:text-2xl font-black text-slate-800 leading-relaxed">
              "{currentComp.passage}"
            </p>
          </div>

          {/* Question */}
          <div className="mb-4">
            <h4 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-red-600" />
              <span>{currentComp.question}</span>
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentComp.options.map((opt, idx) => {
              const isSelected = selectedCompOption === idx;
              let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-red-400';

              if (isCompChecked) {
                if (idx === currentComp.correctIndex) {
                  style = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300 font-black';
                } else if (isSelected) {
                  style = 'bg-rose-100 border-rose-400 text-rose-950 font-black';
                }
              } else if (isSelected) {
                style = 'bg-red-100 border-red-500 text-red-950 ring-4 ring-red-300 font-black';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isCompChecked && setSelectedCompOption(idx)}
                  disabled={isCompChecked}
                  className={`w-full p-4 rounded-2xl border-3 text-left font-black text-base sm:text-lg flex items-center justify-between transition-all cursor-pointer ${style}`}
                >
                  <span>{opt}</span>
                  {isCompChecked && idx === currentComp.correctIndex && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            {!isCompChecked ? (
              <button
                onClick={handleCheckComp}
                disabled={selectedCompOption === null}
                className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-md ${
                  selectedCompOption !== null
                    ? 'btn-3d-green text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Kiểm tra đáp án</span>
              </button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs sm:text-sm font-semibold text-slate-700">
                  <span className={selectedCompOption === currentComp.correctIndex ? 'text-emerald-700 font-black' : 'text-amber-700 font-black'}>
                    {selectedCompOption === currentComp.correctIndex ? '🎉 Chính xác! ' : '💡 Giải thích: '}
                  </span>
                  <span>{currentComp.explanation}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {selectedCompOption !== currentComp.correctIndex && (
                    <button
                      onClick={() => {
                        setSelectedCompOption(null);
                        setIsCompChecked(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs cursor-pointer"
                    >
                      Thử lại
                    </button>
                  )}

                  {compIdx + 1 < COMPREHENSION_QUESTIONS.length && (
                    <button
                      onClick={handleNextComp}
                      className="btn-3d-yellow px-5 py-2.5 rounded-xl text-slate-900 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Câu tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Sentence Scramble */}
      {activeTab === 'scramble' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-slate-100 mb-6">
            <div>
              <div className="text-xs font-black text-amber-700 uppercase">
                Bài {scrambleIdx + 1} / {SCRAMBLE_SENTENCES.length}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                Chạm Các Thẻ Từ Để Ghép Thành Câu Đúng
              </h3>
            </div>
            <div className="text-4xl">{currentScramble.emoji}</div>
          </div>

          {/* Constructed Sentence Drop Area */}
          <div className="min-h-[90px] p-5 rounded-3xl border-3 border-dashed border-amber-400 bg-amber-50/50 flex flex-wrap items-center gap-2.5 mb-6">
            {scrambleSelectedWords.length === 0 ? (
              <span className="text-sm font-semibold text-slate-400 italic">
                Chạm vào các thẻ từ ngữ bên dưới để sắp xếp vào đây...
              </span>
            ) : (
              scrambleSelectedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => !isScrambleChecked && handleRemoveScrambleWord(idx)}
                  disabled={isScrambleChecked}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-lg shadow-sm border-2 border-amber-500 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                >
                  <span>{word}</span>
                  {!isScrambleChecked && <span className="text-xs text-amber-900">✕</span>}
                </button>
              ))
            )}
          </div>

          {/* Word Bank Pool */}
          <div className="mb-6">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
              Kho thẻ từ (Chạm để chọn):
            </div>
            <div className="flex flex-wrap gap-3">
              {currentScramble.shuffledWords.map((word, idx) => {
                const isUsed = scrambleSelectedWords.includes(word);

                return (
                  <button
                    key={idx}
                    onClick={() => !isUsed && !isScrambleChecked && handleAddScrambleWord(word)}
                    disabled={isUsed || isScrambleChecked}
                    className={`px-5 py-3 rounded-2xl border-3 font-black text-lg transition-all ${
                      isUsed
                        ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed'
                        : 'bg-white hover:bg-amber-50 border-slate-300 hover:border-amber-400 text-slate-800 shadow-sm cursor-pointer'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            {!isScrambleChecked ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCheckScramble}
                  disabled={scrambleSelectedWords.length !== currentScramble.correctWords.length}
                  className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-md ${
                    scrambleSelectedWords.length === currentScramble.correctWords.length
                      ? 'btn-3d-green text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Kiểm tra câu đã ghép</span>
                </button>

                <button
                  onClick={() => setScrambleSelectedWords([])}
                  className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Xếp lại từ đầu
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs sm:text-sm font-semibold text-slate-700">
                  <span className={isScrambleCorrect ? 'text-emerald-700 font-black' : 'text-amber-700 font-black'}>
                    {isScrambleCorrect ? '🎉 Hoàn toàn chính xác! ' : '💡 Chưa đúng rồi: '}
                  </span>
                  <span>Câu đúng là: "{currentScramble.correctWords.join(' ')}"</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isScrambleCorrect && (
                    <button
                      onClick={() => {
                        setScrambleSelectedWords([]);
                        setIsScrambleChecked(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs cursor-pointer"
                    >
                      Thử lại
                    </button>
                  )}

                  <button
                    onClick={handleNextScramble}
                    className="btn-3d-yellow px-5 py-2.5 rounded-xl text-slate-900 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Câu tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Linked Games Showcase in Zone 5 */}
      {onPlayGame && (
        <div className="mt-8 bg-rose-50 rounded-3xl p-6 border-2 border-rose-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-slate-800 text-base sm:text-lg flex items-center gap-2">
              <span>🎮 Các trò chơi đọc câu & đọc hiểu sẵn sàng:</span>
            </h4>
            <span className="text-xs font-extrabold text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
              Chuẩn GDPT 2018
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 29, title: 'Đọc từ tìm tranh', desc: 'Đọc từ và chọn tranh đúng nghĩa' },
              { id: 30, title: 'Sắp xếp từ thành câu', desc: 'Ghép từ thành câu ngữ pháp chuẩn' },
              { id: 31, title: 'Đọc câu chọn đáp án', desc: 'Đọc hiểu câu văn ngắn' },
              { id: 33, title: 'Đọc tiếng mở hoa', desc: 'Đọc to rõ tiếng để hoa bung nở' },
            ].map((gm) => (
              <button
                key={gm.id}
                onClick={() => onPlayGame(gm.id)}
                className="bg-white p-4 rounded-2xl border border-rose-300 hover:border-rose-500 hover:shadow-md text-left transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="text-xs font-black text-rose-700 mb-1">Trò #{gm.id}</div>
                  <div className="font-black text-slate-800 group-hover:text-rose-700 text-sm">
                    {gm.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{gm.desc}</div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-black text-rose-600">
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
