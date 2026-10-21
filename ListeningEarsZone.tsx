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
  Headphones,
  Award,
  Gift,
  HelpCircle,
  Play,
  Music,
  Check,
} from 'lucide-react';
import { audioManager } from '../../services/audioManager';
import { MascotBee, MascotTeacher } from '../illustrations/VectorIllustrations';

interface Props {
  onBack?: () => void;
  onGoHome?: () => void;
  onPlayGame?: (gameId: number) => void;
}

interface ListeningQuestionItem {
  id: number;
  instruction: string;
  speechText: string;
  displayHint: string;
  options: Array<{ text: string; emoji?: string; isCorrect: boolean }>;
  explanation: string;
}

interface ToneCard {
  toneName: string;
  markSymbol: string;
  pitchDescription: string;
  sampleWords: Array<{ word: string; emoji: string; speech: string }>;
  accentColor: string;
}

const TONE_CARDS: ToneCard[] = [
  {
    toneName: 'Thanh Ngang (Không dấu)',
    markSymbol: '—',
    pitchDescription: 'Giọng đọc đều, cao vừa, không lên không xuống',
    sampleWords: [
      { word: 'ba', emoji: '👨', speech: 'ba' },
      { word: 'hoa', emoji: '🌸', speech: 'hoa' },
      { word: 'xe', emoji: '🚗', speech: 'xe' },
      { word: 'cây', emoji: '🌳', speech: 'cây' },
    ],
    accentColor: 'border-slate-300 bg-slate-50 text-slate-800',
  },
  {
    toneName: 'Thanh Huyền',
    markSymbol: '`',
    pitchDescription: 'Giọng trầm xuống nhẹ nhàng từ cao xuống thấp',
    sampleWords: [
      { word: 'bà', emoji: '👵', speech: 'bà' },
      { word: 'cà', emoji: '🍆', speech: 'cà' },
      { word: 'nhà', emoji: '🏡', speech: 'nhà' },
      { word: 'bò', emoji: '🐮', speech: 'bò' },
    ],
    accentColor: 'border-blue-300 bg-blue-50 text-blue-900',
  },
  {
    toneName: 'Thanh Sắc',
    markSymbol: '´',
    pitchDescription: 'Giọng vút lên cao dứt khoát từ thấp lên cao',
    sampleWords: [
      { word: 'cá', emoji: '🐟', speech: 'cá' },
      { word: 'bé', emoji: '👶', speech: 'bé' },
      { word: 'lá', emoji: '🍃', speech: 'lá' },
      { word: 'nón', emoji: '👒', speech: 'nón' },
    ],
    accentColor: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  },
  {
    toneName: 'Thanh Hỏi',
    markSymbol: '?',
    pitchDescription: 'Giọng hơi lượn: xuống thấp rồi lại vút lên nhẹ',
    sampleWords: [
      { word: 'thỏ', emoji: '🐰', speech: 'thỏ' },
      { word: 'cỏ', emoji: '🌱', speech: 'cỏ' },
      { word: 'hổ', emoji: '🐯', speech: 'hổ' },
      { word: 'khỉ', emoji: '🐒', speech: 'khỉ' },
    ],
    accentColor: 'border-amber-300 bg-amber-50 text-amber-900',
  },
  {
    toneName: 'Thanh Ngã',
    markSymbol: '~',
    pitchDescription: 'Giọng lên cao, hơi gãy ở giữa rồi bật lên tiếp',
    sampleWords: [
      { word: 'gỗ', emoji: '🪵', speech: 'gỗ' },
      { word: 'sữa', emoji: '🥛', speech: 'sữa' },
      { word: 'mũ', emoji: '🧢', speech: 'mũ' },
      { word: 'ngã', emoji: '🤸', speech: 'ngã' },
    ],
    accentColor: 'border-purple-300 bg-purple-50 text-purple-900',
  },
  {
    toneName: 'Thanh Nặng',
    markSymbol: '·',
    pitchDescription: 'Giọng trầm ngắt, hạ xuống thật thấp và dứt nhanh',
    sampleWords: [
      { word: 'mẹ', emoji: '👩', speech: 'mẹ' },
      { word: 'vịt', emoji: '🦆', speech: 'vịt' },
      { word: 'quạt', emoji: '🪭', speech: 'quạt' },
      { word: 'ngựa', emoji: '🐴', speech: 'ngựa' },
    ],
    accentColor: 'border-rose-300 bg-rose-50 text-rose-900',
  },
];

const SOUND_QUESTIONS: ListeningQuestionItem[] = [
  {
    id: 1,
    instruction: 'Bé hãy lắng nghe âm thanh và chọn chữ cái có âm tương ứng:',
    speechText: 'a',
    displayHint: '🔊 Nghe âm đọc nguyên âm đơn đầu tiên trong bảng chữ cái',
    options: [
      { text: 'Chữ a', emoji: '🍎', isCorrect: true },
      { text: 'Chữ c', emoji: '🐟', isCorrect: false },
      { text: 'Chữ b', emoji: '🥑', isCorrect: false },
      { text: 'Chữ o', emoji: '🥚', isCorrect: false },
    ],
    explanation: 'Âm đọc là /a/, tương ứng với chữ a trong quả táo!',
  },
  {
    id: 2,
    instruction: 'Lắng nghe âm đầu và chọn con chữ chính xác:',
    speechText: 'bờ',
    displayHint: '🔊 Nghe âm: /bờ/',
    options: [
      { text: 'Chữ d', emoji: '🍉', isCorrect: false },
      { text: 'Chữ đ', emoji: '💡', isCorrect: false },
      { text: 'Chữ b', emoji: '🥑', isCorrect: true },
      { text: 'Chữ p', emoji: '🔨', isCorrect: false },
    ],
    explanation: 'Đọc âm bờ, tương ứng với con chữ b (nét sổ thẳng bên trái và nét cong kín bên phải phía dưới).',
  },
  {
    id: 3,
    instruction: 'Bé lắng nghe tiếng đọc và chọn bức tranh đúng:',
    speechText: 'con cá',
    displayHint: '🔊 Nghe từ: "con cá"',
    options: [
      { text: 'Con cá', emoji: '🐟', isCorrect: true },
      { text: 'Con gà', emoji: '🐔', isCorrect: false },
      { text: 'Con thỏ', emoji: '🐰', isCorrect: false },
      { text: 'Con vịt', emoji: '🦆', isCorrect: false },
    ],
    explanation: 'Máy đọc phát âm "con cá", loài vật bơi lội dưới làn nước trong xanh!',
  },
  {
    id: 4,
    instruction: 'Lắng nghe tiếng và xác định thanh điệu:',
    speechText: 'quả cà',
    displayHint: '🔊 Tiếng "cà" mang thanh điệu gì?',
    options: [
      { text: 'Thanh sắc (´)', isCorrect: false },
      { text: 'Thanh huyền (`)', isCorrect: true },
      { text: 'Thanh hỏi (?)', isCorrect: false },
      { text: 'Thanh nặng (.)', isCorrect: false },
    ],
    explanation: 'Tiếng "cà" có c - a - ca - huyền - cà, mang thanh huyền!',
  },
  {
    id: 5,
    instruction: 'Quy tắc chính tả: Điền c hay k vào từ "...im chỉ"?',
    speechText: 'kim chỉ',
    displayHint: '🔊 Nghe phát âm: "kim chỉ"',
    options: [
      { text: 'k (kim chỉ)', isCorrect: true },
      { text: 'c (cim chỉ)', isCorrect: false },
    ],
    explanation: 'Quy tắc chính tả: Đứng trước nguyên âm "i" phải viết bằng con chữ "k", nên "kim chỉ" viết bằng k là đúng!',
  },
];

const SECRET_BOX_ITEMS = [
  { sound: 'con mèo', hint: 'Kêu meo meo, bắt chuột rất tài!', answer: 'Con mèo', emoji: '🐱' },
  { sound: 'đồng hồ', hint: 'Kêu tích tắc, nhắc bé dậy sớm đi học!', answer: 'Đồng hồ', emoji: '⏰' },
  { sound: 'bông sen', hint: 'Hoa ngát hương trong đầm nước mùa hạ!', answer: 'Bông sen', emoji: '🪷' },
  { sound: 'con gà trống', hint: 'Gáy ò ó o gọi mặt trời thức giấc!', answer: 'Gà trống', emoji: '🐓' },
  { sound: 'trái dừa', hint: 'Quả trên cao cho nước ngọt lành mát rượi!', answer: 'Trái dừa', emoji: '🥥' },
];

export const ListeningEarsZone: React.FC<Props> = ({ onBack, onGoHome, onPlayGame }) => {
  const [activeTab, setActiveTab] = useState<'practice' | 'tones' | 'tricky' | 'secret-box'>('practice');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  // Secret box states
  const [boxIdx, setBoxIdx] = useState(0);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [selectedBoxAnswer, setSelectedBoxAnswer] = useState<string | null>(null);

  const currentQ = SOUND_QUESTIONS[questionIdx];

  const handlePlaySound = (text: string) => {
    audioManager.speak(text);
  };

  const handleCheckAnswer = () => {
    if (selectedOptionIdx === null) return;
    const correct = currentQ.options[selectedOptionIdx].isCorrect;
    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      audioManager.playSoundEffect('correct');
      setScore((s) => s + 10);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } else {
      audioManager.playSoundEffect('wrong');
    }
  };

  const handleNextQuestion = () => {
    if (questionIdx + 1 < SOUND_QUESTIONS.length) {
      setQuestionIdx((i) => i + 1);
      setSelectedOptionIdx(null);
      setIsChecked(false);
      setIsCorrect(false);
    }
  };

  const handleRestartQuiz = () => {
    setQuestionIdx(0);
    setSelectedOptionIdx(null);
    setIsChecked(false);
    setIsCorrect(false);
    setScore(0);
  };

  const handleOpenSecretBox = () => {
    setIsBoxOpen(true);
    audioManager.playSoundEffect('click');
    audioManager.speak(SECRET_BOX_ITEMS[boxIdx].sound);
  };

  const handleSelectBoxAnswer = (ans: string) => {
    setSelectedBoxAnswer(ans);
    if (ans === SECRET_BOX_ITEMS[boxIdx].answer) {
      audioManager.playSoundEffect('correct');
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    } else {
      audioManager.playSoundEffect('wrong');
    }
  };

  const handleNextBox = () => {
    setIsBoxOpen(false);
    setSelectedBoxAnswer(null);
    setBoxIdx((i) => (i + 1) % SECRET_BOX_ITEMS.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Zone Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black mb-2">
            <Headphones className="w-3.5 h-3.5 text-sky-300" />
            <span>Khu Vực 3 • Rèn Luyện Thính Giác Ngôn Ngữ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <span>Tai Nghe Tinh</span>
            <span className="text-3xl">🎧</span>
          </h2>
          <p className="text-sky-100 text-xs sm:text-sm font-semibold max-w-xl mt-1 leading-relaxed">
            Luyện tai nghe phân biệt âm đầu, vần, phân biệt âm dễ nhầm và 6 thanh điệu tiếng Việt cùng bạn Ong Vàng và Máy đọc tiếng Việt.
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

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border-2 ${
            activeTab === 'practice'
              ? 'bg-sky-600 text-white border-sky-700 shadow-md ring-2 ring-sky-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Luyện Nghe & Chọn Đúng</span>
        </button>

        <button
          onClick={() => setActiveTab('tones')}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border-2 ${
            activeTab === 'tones'
              ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Khám Phá 6 Thanh Điệu</span>
        </button>

        <button
          onClick={() => setActiveTab('tricky')}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border-2 ${
            activeTab === 'tricky'
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Phân Biệt Âm Dễ Nhầm</span>
        </button>

        <button
          onClick={() => setActiveTab('secret-box')}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border-2 ${
            activeTab === 'secret-box'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-500 group-hover:text-amber-600" />
          <span>Chiếc Hộp Âm Thanh Bí Mật</span>
        </button>
      </div>

      {/* Tab 1: Practice Quiz */}
      {activeTab === 'practice' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-sky-300 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-slate-100 mb-6">
            <div>
              <div className="text-xs font-black text-sky-700 uppercase">
                Câu {questionIdx + 1} / {SOUND_QUESTIONS.length}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                {currentQ.instruction}
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-2xl border border-sky-200">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-black text-slate-700">Điểm số:</span>
              <span className="text-base font-black text-sky-700">{score} điểm</span>
            </div>
          </div>

          {/* Sound Prompt Bar */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-3 border-sky-300 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePlaySound(currentQ.speechText)}
                className="w-14 h-14 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
                title="Bấm để nghe âm thanh mẫu"
              >
                <Volume2 className="w-7 h-7" />
              </button>
              <div>
                <div className="text-xs font-bold text-sky-800">Âm thanh mẫu:</div>
                <div className="text-lg sm:text-xl font-black text-slate-800">
                  {currentQ.displayHint}
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePlaySound(currentQ.speechText)}
              className="btn-3d-yellow px-5 py-2.5 rounded-xl text-slate-900 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Volume1 className="w-4 h-4" />
              <span>Nghe lại âm thanh</span>
            </button>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOptionIdx === idx;
              let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-sky-400 hover:bg-sky-50/50';

              if (isChecked) {
                if (opt.isCorrect) {
                  style = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300 font-black';
                } else if (isSelected) {
                  style = 'bg-rose-100 border-rose-400 text-rose-950 font-black';
                }
              } else if (isSelected) {
                style = 'bg-sky-100 border-sky-500 text-sky-950 ring-4 ring-sky-300 font-black';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isChecked && setSelectedOptionIdx(idx)}
                  disabled={isChecked}
                  className={`p-5 rounded-2xl border-3 text-left font-black text-base sm:text-lg flex items-center justify-between transition-all cursor-pointer ${style}`}
                >
                  <div className="flex items-center gap-3">
                    {opt.emoji && <span className="text-3xl">{opt.emoji}</span>}
                    <span>{opt.text}</span>
                  </div>
                  {isChecked && opt.isCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions & Feedback */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            {!isChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOptionIdx === null}
                className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-md ${
                  selectedOptionIdx !== null
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
                  <span className={isCorrect ? 'text-emerald-700 font-black' : 'text-amber-700 font-black'}>
                    {isCorrect ? '🎉 Chính xác! Bạn giỏi quá! ' : '💡 Lưu ý: '}
                  </span>
                  <span>{currentQ.explanation}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isCorrect && (
                    <button
                      onClick={() => {
                        setSelectedOptionIdx(null);
                        setIsChecked(false);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs cursor-pointer"
                    >
                      Thử lại
                    </button>
                  )}

                  {questionIdx + 1 < SOUND_QUESTIONS.length ? (
                    <button
                      onClick={handleNextQuestion}
                      className="btn-3d-yellow px-5 py-2.5 rounded-xl text-slate-900 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Câu tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleRestartQuiz}
                      className="btn-3d-green px-5 py-2.5 rounded-xl text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Luyện tập lại</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: 6 Tones */}
      {activeTab === 'tones' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-blue-300 shadow-lg">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              6 Thanh Điệu Trong Tiếng Việt Lớp 1
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Bấm vào từng từ mẫu dưới đây để nghe Máy đọc tiếng Việt phát âm rõ ràng cao độ của từng dấu thanh!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TONE_CARDS.map((tone, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-3xl border-3 flex flex-col justify-between shadow-xs ${tone.accentColor}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-black">{tone.markSymbol}</span>
                    <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-white/70 shadow-xs">
                      Dấu #{idx + 1}
                    </span>
                  </div>

                  <h4 className="text-lg font-black">{tone.toneName}</h4>
                  <p className="text-xs font-medium mt-1 mb-4 leading-relaxed opacity-90">
                    {tone.pitchDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-current/15">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-75">
                    Từ mẫu phát âm:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {tone.sampleWords.map((w, wIdx) => (
                      <button
                        key={wIdx}
                        onClick={() => handlePlaySound(w.speech)}
                        className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 border border-current/20 flex items-center justify-between font-black text-sm shadow-xs cursor-pointer transition-transform active:scale-95"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{w.emoji}</span>
                          <span>{w.word}</span>
                        </div>
                        <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Tricky Sounds */}
      {activeTab === 'tricky' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-300 shadow-lg">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              Phân Biệt Cặp Âm & Quy Tắc Chính Tả Dễ Nhầm
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Học sinh lớp 1 thường nhầm lẫn giữa các âm phát âm gần giống hoặc cách viết chính tả. Bấm nghe từng âm để phân biệt!
            </p>
          </div>

          <div className="space-y-4">
            {/* c / k */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black text-amber-800 uppercase">Quy tắc 1</div>
                <h4 className="text-lg font-black text-slate-800">Phân biệt c và k</h4>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>k:</strong> Luôn đứng trước <strong>e, ê, i</strong> (ví dụ: kem, kẻ, kìm). <br />
                  <strong>c:</strong> Đứng trước các nguyên âm còn lại: <strong>a, o, ô, ơ, u, ư</strong> (ví dụ: ca, cô, cờ).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlaySound('kẻ vở, cây kem')}
                  className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-slate-800 font-black text-xs flex items-center gap-1 cursor-pointer hover:bg-amber-100"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>Nghe: kẻ vở, cây kem</span>
                </button>
                <button
                  onClick={() => handlePlaySound('con cá, lá cờ')}
                  className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-slate-800 font-black text-xs flex items-center gap-1 cursor-pointer hover:bg-amber-100"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>Nghe: con cá, lá cờ</span>
                </button>
              </div>
            </div>

            {/* g / gh */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black text-emerald-800 uppercase">Quy tắc 2</div>
                <h4 className="text-lg font-black text-slate-800">Phân biệt g (đơn) và gh (kép)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>gh:</strong> Đi trước <strong>e, ê, i</strong> (ví dụ: ghen, ghế, ghi chép). <br />
                  <strong>g:</strong> Đi trước các nguyên âm còn lại (ví dụ: con gà, gối ôm, gõ cửa).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlaySound('ghế gỗ, ghi bài')}
                  className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-slate-800 font-black text-xs flex items-center gap-1 cursor-pointer hover:bg-emerald-100"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Nghe: ghế gỗ</span>
                </button>
                <button
                  onClick={() => handlePlaySound('con gà, cái gối')}
                  className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-slate-800 font-black text-xs flex items-center gap-1 cursor-pointer hover:bg-emerald-100"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Nghe: con gà</span>
                </button>
              </div>
            </div>

            {/* ng / ngh */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border-2 border-sky-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black text-sky-800 uppercase">Quy tắc 3</div>
                <h4 className="text-lg font-black text-slate-800">Phân biệt ng (đơn) và ngh (kép)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>ngh:</strong> Luôn đi trước <strong>e, ê, i</strong> (ví dụ: con nghé, nghề nghiệp, suy nghĩ). <br />
                  <strong>ng:</strong> Đi trước các nguyên âm còn lại (ví dụ: quả ngô, ngủ ngon, ngà voi).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlaySound('con nghé, nghỉ ngơi')}
                  className="px-3.5 py-2 rounded-xl bg-white border border-sky-300 text-slate-800 font-black text-xs flex items-center gap-1 cursor-pointer hover:bg-sky-100"
                >
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>Nghe: con nghé</span>
                </button>
                <button
                  onClick={() => handlePlaySound('quả ngô, ngà voi')}
                  className="px-3.5 py-2 rounded-xl bg-white border border-sky-300 text-slate-800 font-black text-xs flex items-center gap-1 cursor-pointer hover:bg-sky-100"
                >
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>Nghe: quả ngô</span>
                </button>
              </div>
            </div>

            {/* s / x */}
            <div className="p-5 rounded-2xl bg-purple-50/70 border-2 border-purple-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black text-purple-800 uppercase">Quy tắc 4</div>
                <h4 className="text-lg font-black text-slate-800">Phân biệt s (uốn lưỡi) và x (xát nhẹ)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>s:</strong> Uốn đầu lưỡi về phía vòm họng (ví dụ: bông sen, ngôi sao, sương sớm). <br />
                  <strong>x:</strong> Đầu lưỡi thẳng xát nhẹ qua kẽ răng (ví dụ: xe cộ, quả xoài, xinh xắn).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlaySound('bông sen, ngôi sao')}
                  className="px-3.5 py-2 rounded-xl bg-white border border-purple-300 text-slate-800 font-black text-xs flex items-center gap-1 cursor-pointer hover:bg-purple-100"
                >
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <span>Nghe: bông sen</span>
                </button>
                <button
                  onClick={() => handlePlaySound('xe đạp, xinh xắn')}
                  className="px-3.5 py-2 rounded-xl bg-white border border-purple-300 text-slate-800 font-black text-xs flex items-center gap-1 cursor-pointer hover:bg-purple-100"
                >
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <span>Nghe: xe đạp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Secret Sound Box */}
      {activeTab === 'secret-box' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-lg text-center">
          <div className="max-w-xl mx-auto mb-6">
            <span className="px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black">
              🎁 Trò Chơi Thính Giác Bí Ẩn
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Chiếc Hộp Âm Thanh Bí Mật
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Gõ vào hộp để mở nắp và lắng nghe âm thanh bí mật phát ra từ bên trong!
            </p>
          </div>

          {/* Interactive Box */}
          <div className="py-8 flex flex-col items-center justify-center">
            {!isBoxOpen ? (
              <button
                onClick={handleOpenSecretBox}
                className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <div className="w-36 h-36 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-4 border-4 border-amber-600 shadow-2xl flex items-center justify-center text-6xl animate-bounce">
                  🎁
                </div>
                <div className="mt-4 px-6 py-2.5 rounded-2xl bg-amber-400 text-slate-900 font-black text-sm shadow-md border-2 border-amber-500">
                  👉 Chạm để mở hộp nghe âm thanh
                </div>
              </button>
            ) : (
              <div className="bg-amber-50/80 border-3 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center">
                <div className="text-6xl mb-3 animate-pulse">
                  🔊
                </div>
                <div className="text-sm font-bold text-slate-600 mb-1">Gợi ý từ chiếc hộp:</div>
                <div className="text-lg font-black text-slate-800 mb-4 bg-white p-3 rounded-2xl border border-amber-300">
                  "{SECRET_BOX_ITEMS[boxIdx].hint}"
                </div>

                <button
                  onClick={() => handlePlaySound(SECRET_BOX_ITEMS[boxIdx].sound)}
                  className="btn-3d-yellow px-5 py-2.5 rounded-xl text-slate-900 font-black text-xs sm:text-sm inline-flex items-center gap-1.5 shadow-md cursor-pointer mb-6"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe lại âm thanh</span>
                </button>

                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
                  Đó là âm thanh của từ nào?
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {SECRET_BOX_ITEMS.map((item, idx) => {
                    const isSelected = selectedBoxAnswer === item.answer;
                    const isRight = item.answer === SECRET_BOX_ITEMS[boxIdx].answer;

                    let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-amber-400';
                    if (selectedBoxAnswer) {
                      if (isRight) {
                        btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-300';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => !selectedBoxAnswer && handleSelectBoxAnswer(item.answer)}
                        disabled={!!selectedBoxAnswer}
                        className={`p-3.5 rounded-2xl border-2 font-black text-sm flex items-center gap-2 cursor-pointer transition-all ${btnStyle}`}
                      >
                        <span className="text-xl">{item.emoji}</span>
                        <span>{item.answer}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedBoxAnswer && (
                  <div className="pt-4 border-t border-amber-200 flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-800">
                      {selectedBoxAnswer === SECRET_BOX_ITEMS[boxIdx].answer
                        ? '🎉 Hoan hô! Bạn đoán đúng rồi!'
                        : '💡 Chưa đúng rồi, bạn thử lại ở hộp tiếp theo nhé!'}
                    </span>
                    <button
                      onClick={handleNextBox}
                      className="btn-3d-green px-5 py-2 rounded-xl text-white font-black text-xs cursor-pointer shadow-md"
                    >
                      Mở hộp tiếp theo ➔
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Linked Games Showcase in Zone 3 */}
      {onPlayGame && (
        <div className="mt-8 bg-sky-50 rounded-3xl p-6 border-2 border-sky-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-slate-800 text-base sm:text-lg flex items-center gap-2">
              <span>🎮 Trò chơi luyện tai nghe sẵn sàng:</span>
            </h4>
            <span className="text-xs font-extrabold text-sky-800 bg-sky-100 px-3 py-1 rounded-full">
              Chuẩn GDPT 2018
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 7, title: 'Nghe và chọn chữ', desc: 'Chọn chữ tương ứng với giọng đọc' },
              { id: 8, title: 'Nghe tiếng tìm tranh', desc: 'Nghe từ và liên kết với tranh vẽ' },
              { id: 9, title: 'Phân biệt âm dễ nhầm', desc: 'Quy tắc chính tả c/k, g/gh' },
              { id: 10, title: 'Nhận biết thanh điệu', desc: 'Luyện tai nghe 6 thanh tiếng Việt' },
            ].map((gm) => (
              <button
                key={gm.id}
                onClick={() => onPlayGame(gm.id)}
                className="bg-white p-4 rounded-2xl border border-sky-300 hover:border-sky-500 hover:shadow-md text-left transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="text-xs font-black text-sky-700 mb-1">Trò #{gm.id}</div>
                  <div className="font-black text-slate-800 group-hover:text-sky-700 text-sm">
                    {gm.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{gm.desc}</div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-black text-sky-600">
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
