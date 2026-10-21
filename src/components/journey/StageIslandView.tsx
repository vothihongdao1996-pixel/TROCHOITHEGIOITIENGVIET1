import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Volume2,
  Volume1,
  Square,
  CheckCircle2,
  Award,
  ChevronRight,
  RotateCcw,
  Star,
  Sparkles,
  Trophy,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { JourneyStage, StudentProfile } from '../../types';
import { MascotBee, MascotTeacher } from '../illustrations/VectorIllustrations';
import { audioManager } from '../../services/audioManager';
import { storageService } from '../../services/storageService';

interface Props {
  stage: JourneyStage;
  activeProfile: StudentProfile;
  onBackToMap: () => void;
  onGoToArena?: () => void;
  onProgressUpdated: () => void;
}

interface ComprehensiveQuestion {
  id: string;
  category: 'chữ cái' | 'âm vần' | 'ghép tiếng' | 'từ ngữ' | 'câu văn';
  question: string;
  speechText: string;
  emoji?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

const QUESTION_BANK: ComprehensiveQuestion[] = [
  {
    id: 'rev-1',
    category: 'chữ cái',
    question: 'Chữ cái nào đứng đầu tiên trong Bảng chữ cái tiếng Việt?',
    speechText: 'Chữ cái nào đứng đầu tiên trong Bảng chữ cái tiếng Việt?',
    options: ['Chữ a', 'Chữ b', 'Chữ c', 'Chữ d'],
    correctIndex: 0,
    explanation: 'Bảng chữ cái tiếng Việt mở đầu bằng con chữ "a".',
    hint: 'Chữ a mở đầu bảng chữ cái con nhé!',
  },
  {
    id: 'rev-2',
    category: 'âm vần',
    question: 'Trong từ "măng non", cả hai tiếng "măng" và "non" đều có âm cuối là âm gì?',
    speechText: 'Trong từ măng non, cả hai tiếng đều kết thúc bằng âm gì?',
    options: ['Âm n', 'Âm c', 'Âm t', 'Âm p'],
    correctIndex: 0,
    explanation: 'Tiếng "măng" có vần ăng (kết thúc ng), tiếng "non" có vần on (kết thúc n). Tiếng "non" mang vần on kết thúc bằng âm n.',
    hint: 'Tiếng non có âm n đứng ở cuối vần con nhé!',
  },
  {
    id: 'rev-3',
    category: 'ghép tiếng',
    question: 'Âm đầu "b" ghép với vần "a" và thanh "sắc" tạo thành tiếng gì?',
    speechText: 'Âm b ghép với vần a và thanh sắc tạo thành tiếng gì?',
    options: ['bá', 'bà', 'bả', 'bạ'],
    correctIndex: 0,
    explanation: 'b - a - ba - sắc - bá. Thanh sắc dốc từ phải lên trên.',
    hint: 'Thanh sắc tạo thành tiếng "bá" con nhé!',
  },
  {
    id: 'rev-4',
    category: 'từ ngữ',
    question: 'Nhìn tranh: 🐱 Đây là con vật gì rất thích bắt chuột?',
    speechText: 'Đây là con vật gì rất thích bắt chuột?',
    emoji: '🐱',
    options: ['con mèo', 'chú chó', 'con lợn', 'chú gà'],
    correctIndex: 0,
    explanation: 'Bức tranh vẽ "con mèo" (m - eo - meo - huyền - mèo) thích trèo cây cau và bắt chuột.',
    hint: 'Tiếng kêu meo meo là của con mèo!',
  },
  {
    id: 'rev-5',
    category: 'câu văn',
    question: 'Trong các câu sau, câu nào viết đúng chuẩn chính tả tiếng Việt?',
    speechText: 'Trong các câu sau, câu nào viết đúng chính tả?',
    options: [
      'Bé đi học ngoan ngoãn.',
      'bé Đi học ngoan ngoãn',
      'Bé đi học ngoan ngoãn',
      'bé đi học ngoan ngoãn.',
    ],
    correctIndex: 0,
    explanation: 'Câu đúng phải viết hoa chữ "Bé" ở đầu câu và kết thúc bằng dấu chấm.',
    hint: 'Chữ cái đầu câu phải viết hoa và cuối câu có dấu chấm con nhé!',
  },
  {
    id: 'rev-6',
    category: 'âm vần',
    question: 'Phân biệt chính tả g / gh: Điền chữ đúng vào chỗ chấm "...ế gỗ"',
    speechText: 'Điền g hay gh vào từ ghế gỗ?',
    options: ['gh (ghế gỗ)', 'g (gế gỗ)'],
    correctIndex: 0,
    explanation: 'Quy tắc: Âm g đứng trước e, ê, i phải viết bằng "gh". Vì vậy viết "ghế gỗ"!',
    hint: 'Đứng trước chữ ê thì phải thêm chữ h thành gh nhé!',
  },
  {
    id: 'rev-7',
    category: 'chữ cái',
    question: 'Chữ in hoa của chữ "d" là chữ nào dưới đây?',
    speechText: 'Chữ in hoa của chữ d là chữ nào?',
    options: ['D', 'Đ', 'B', 'P'],
    correctIndex: 0,
    explanation: 'Chữ "d" thường có chữ in hoa tương ứng là "D".',
    hint: 'Chữ D không có gạch ngang ở cổ con nhé!',
  },
  {
    id: 'rev-8',
    category: 'từ ngữ',
    question: 'Từ nào dưới đây là từ chỉ đồ dùng học tập của học sinh lớp 1?',
    speechText: 'Từ nào dưới đây là từ chỉ đồ dùng học tập?',
    options: ['hộp bút', 'bát cơm', 'chiếc quạt', 'đôi giày'],
    correctIndex: 0,
    explanation: '"Hộp bút" là đồ dùng học tập dùng để đựng bút chì, tẩy và thước kẻ.',
    hint: 'Bé đựng bút chì và thước kẻ vào đâu nào?',
  },
  {
    id: 'rev-9',
    category: 'câu văn',
    question: 'Điền từ còn thiếu vào câu: "Mặt trời mọc ở đằng [ ... ]."',
    speechText: 'Mặt trời mọc ở đằng nào: đông, tây, nam hay bắc?',
    options: ['Đông', 'Tây', 'Nam', 'Bắc'],
    correctIndex: 0,
    explanation: 'Mỗi buổi sớm, mặt trời luôn mọc ở đằng Đông chiếu những tia nắng vàng ấm áp.',
    hint: 'Đằng Đông đón mặt trời thức dậy sớm mai con nhé!',
  },
  {
    id: 'rev-10',
    category: 'ghép tiếng',
    question: 'Tiếng "hoa" trong "bông hoa" được tạo bởi vần gì?',
    speechText: 'Tiếng hoa được tạo bởi vần gì?',
    options: ['vần oa', 'vần ao', 'vần oe', 'vần oi'],
    correctIndex: 0,
    explanation: 'h - oa - hoa. Tiếng "hoa" có âm đầu h và vần "oa".',
    hint: 'Âm o đi trước âm a đọc nối là oa con nhé!',
  },
];

export const StageIslandView: React.FC<Props> = ({
  stage,
  activeProfile,
  onBackToMap,
  onGoToArena,
  onProgressUpdated,
}) => {
  // Test Questions State (Shuffled 10 questions)
  const [questions, setQuestions] = useState<ComprehensiveQuestion[]>(() => {
    return [...QUESTION_BANK].sort(() => Math.random() - 0.5);
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false); // "Ôn tập câu sai" mode
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [isChestOpen, setIsChestOpen] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMascotSpeaking, setIsMascotSpeaking] = useState(false);

  const currentQ = questions[currentIdx];
  const totalQ = questions.length;

  useEffect(() => {
    return () => {
      audioManager.stop();
    };
  }, [currentIdx]);

  const handleSpeak = () => {
    if (!currentQ) return;
    setIsSpeaking(true);
    setIsMascotSpeaking(false);
    audioManager.speak(currentQ.speechText, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleMascotHint = () => {
    if (!currentQ) return;
    setIsMascotSpeaking(true);
    setIsSpeaking(false);
    audioManager.speakOngVang(currentQ.hint, () => {
      setIsMascotSpeaking(false);
    });
  };

  const handleSelectOption = (idx: number) => {
    if (isChecked) return;
    setSelectedOption(idx);
  };

  const handleCheck = () => {
    if (selectedOption === null || isChecked) return;
    const correct = selectedOption === currentQ.correctIndex;
    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      audioManager.playSoundEffect('correct');
      setCorrectCount((prev) => prev + 1);
      audioManager.speakFeedback(true, currentQ.explanation);
    } else {
      audioManager.playSoundEffect('wrong');
      audioManager.speakFeedback(false, currentQ.explanation);
      if (!wrongQuestionIds.includes(currentQ.id)) {
        setWrongQuestionIds((prev) => [...prev, currentQ.id]);
      }
    }
  };

  const handleNext = () => {
    audioManager.stop();
    setIsSpeaking(false);
    setIsMascotSpeaking(false);

    if (currentIdx + 1 < totalQ) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      // Completed test!
      setIsTestFinished(true);

      // Save journey progress for Stage 6
      const starsEarned = Math.round((correctCount / totalQ) * 5) || 3;
      storageService.completeJourneyTask(
        activeProfile.id,
        6,
        'task-6-comprehensive',
        starsEarned,
        1
      );
      onProgressUpdated();

      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      audioManager.playSoundEffect('badge');
      audioManager.speakOngVang(
        `Chúc mừng bé ${activeProfile.name}! Bé đã hoàn thành bài kiểm tra tổng kết trên Đảo Ôn Tập Tiếng Việt!`
      );
    }
  };

  const handleRestartFullTest = () => {
    audioManager.stop();
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setWrongQuestionIds([]);
    setIsReviewMode(false);
    setIsTestFinished(false);
    setIsChestOpen(false);
  };

  const handleStartReviewWrongQuestions = () => {
    audioManager.stop();
    const wrongQs = QUESTION_BANK.filter((q) => wrongQuestionIds.includes(q.id));
    if (wrongQs.length === 0) return;
    setQuestions(wrongQs);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setIsReviewMode(true);
    setIsTestFinished(false);
    setIsChestOpen(false);
  };

  const handleOpenChest = () => {
    setIsChestOpen(true);
    try {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
    audioManager.playSoundEffect('badge');
    audioManager.speakOngVang('Woa! Rương kho báu vàng đã mở! Bé nhận được Huy hiệu Quán Quân Đảo Tiếng Việt!');
  };

  const isPassed = correctCount >= Math.ceil(totalQ * 0.7);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 border-2 border-amber-300 shadow-sm">
        <button
          onClick={onBackToMap}
          className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-800 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Chặng 6: Đảo Ôn Tập Tiếng Việt</span>
          </div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">
            {isReviewMode ? 'Ôn tập câu đã làm sai' : `Bài kiểm tra tổng hợp: Câu ${currentIdx + 1} / ${totalQ}`}
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-300 font-black text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đúng: {correctCount} câu</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-amber-100 h-3 rounded-full overflow-hidden mb-6 border border-amber-300">
        <div
          className="bg-gradient-to-r from-amber-400 via-rose-500 to-red-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
        />
      </div>

      {!isTestFinished ? (
        <div className="relative bg-gradient-to-b from-amber-50/90 via-rose-50/40 to-sky-50/60 rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-xl overflow-hidden">
          {/* Animated Treasure Island Props */}
          <div className="absolute top-2 right-4 text-3xl opacity-30 select-none">🏝️</div>
          <div className="absolute bottom-3 left-4 text-3xl opacity-30 select-none">🪙</div>

          {/* Guide Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 relative z-10">
            <div className="bg-white/90 border-2 border-rose-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <MascotTeacher className="w-11 h-11 shrink-0" />
                <div>
                  <div className="text-xs font-black text-rose-900">🌸 Cô Đào hỗ trợ</div>
                  <div className="text-xs text-slate-600 font-semibold line-clamp-1">
                    {currentQ.question}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSpeak}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 border transition-all cursor-pointer shrink-0 ${
                  isSpeaking
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-rose-100 hover:bg-rose-200 text-rose-900 border-rose-300'
                }`}
              >
                <Volume1 className="w-4 h-4" />
                <span>Nghe cô đọc</span>
              </button>
            </div>

            <div className="bg-white/90 border-2 border-amber-300 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <MascotBee className="w-11 h-11 shrink-0 animate-float" />
                <div>
                  <div className="text-xs font-black text-amber-950">🐝 Ong Vàng mách nhỏ</div>
                  <div className="text-xs text-amber-800 italic line-clamp-1">
                    "{currentQ.hint}"
                  </div>
                </div>
              </div>
              <button
                onClick={handleMascotHint}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 border transition-all cursor-pointer shrink-0 ${
                  isMascotSpeaking
                    ? 'bg-amber-400 text-amber-950 border-amber-500 animate-pulse'
                    : 'bg-amber-200 hover:bg-amber-300 text-amber-950 border-amber-300'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Gợi ý</span>
              </button>
            </div>
          </div>

          {(isSpeaking || isMascotSpeaking) && (
            <div className="flex justify-end mb-3">
              <button
                onClick={() => {
                  audioManager.stop();
                  setIsSpeaking(false);
                  setIsMascotSpeaking(false);
                }}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Dừng âm</span>
              </button>
            </div>
          )}

          {/* Question Plaque */}
          <div className="text-center my-6 relative z-10">
            <div className="inline-block px-3 py-1 bg-amber-200 text-amber-950 rounded-full text-xs font-black mb-2 uppercase">
              Chủ đề: {currentQ.category}
            </div>

            {currentQ.emoji && (
              <div className="text-6xl mb-2">{currentQ.emoji}</div>
            )}

            <h3 className="text-xl sm:text-2xl font-black text-slate-800 max-w-xl mx-auto leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* 4 Interactive Option Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 relative z-10">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'bg-white border-slate-300 text-slate-800 hover:border-amber-400 hover:bg-amber-50';

              if (isChecked) {
                if (idx === currentQ.correctIndex) {
                  btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300 scale-102';
                } else if (isSelected) {
                  btnClass = 'bg-rose-100 border-rose-400 text-rose-900';
                } else {
                  btnClass = 'bg-white/60 border-slate-200 text-slate-400';
                }
              } else if (isSelected) {
                btnClass = 'bg-amber-100 border-amber-500 text-amber-950 ring-4 ring-amber-300 scale-102 shadow-md';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isChecked}
                  className={`p-5 rounded-2xl border-4 font-black text-lg sm:text-xl text-left transition-all cursor-pointer shadow-sm relative ${btnClass}`}
                >
                  <span className="w-8 h-8 rounded-xl bg-amber-200 text-amber-950 font-extrabold text-xs inline-flex items-center justify-center mr-3">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="mt-8 pt-6 border-t-2 border-amber-200/80 flex flex-wrap items-center justify-between gap-4 relative z-10">
            {!isChecked ? (
              <button
                onClick={handleCheck}
                disabled={selectedOption === null}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                  selectedOption !== null
                    ? 'btn-3d-green text-white cursor-pointer hover:brightness-105 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Kiểm tra đáp án</span>
              </button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 w-full sm:w-auto flex-1 ${
                    isCorrect
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                      : 'bg-amber-100 border-amber-400 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{isCorrect ? '🎉' : '💡'}</div>
                    <div className="text-xs sm:text-sm font-semibold">
                      <div className="font-black text-sm">
                        {isCorrect ? 'Chính xác! Bé hiểu bài rất sâu!' : 'Giải thích từ Cô Đào:'}
                      </div>
                      <div>{currentQ.explanation}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => audioManager.speakFeedback(isCorrect, currentQ.explanation)}
                    title="Nghe lại lời nhận xét và giải thích"
                    className={`p-2 rounded-xl flex items-center gap-1 font-bold text-xs shadow-sm transition-all hover:scale-105 cursor-pointer shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Nghe lại</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleNext}
                    className="btn-3d-yellow px-6 py-3 rounded-2xl font-black text-sm text-slate-900 flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>{currentIdx + 1 < totalQ ? 'Câu tiếp theo' : 'Xem kết quả tổng kết'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* End of Test Summary Plaque */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-amber-400 shadow-2xl text-center relative overflow-hidden">
          <div className="text-6xl mb-4 animate-bounce">🏝️👑</div>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-100 text-amber-900 rounded-full text-sm font-black mb-3">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span>KẾT QUẢ BÀI KIỂM TRA ĐẢO ÔN TẬP TIẾNG VIỆT</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-800">
            {isPassed ? 'Xuất Sắc Chinh Phục Đảo Tiếng Việt!' : 'Bé Đã Cố Gắng Hết Mình!'}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-semibold max-w-lg mx-auto mt-2">
            {isPassed
              ? 'Bé đã chứng tỏ sự am hiểu toàn diện về chữ cái, âm vần, ghép tiếng và câu văn tiếng Việt lớp 1!'
              : 'Cô Đào và bạn Ong Vàng luôn ở bên động viên bé. Hãy ôn tập lại các câu sai để ghi nhớ thật sâu nhé!'}
          </p>

          {/* Score Board */}
          <div className="my-8 p-6 bg-amber-50 border-3 border-amber-300 rounded-3xl max-w-md mx-auto grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-500">Số câu đúng</div>
              <div className="text-2xl font-black text-emerald-700">{correctCount} / {totalQ}</div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-xs">
              <Star className="w-10 h-10 text-amber-400 fill-amber-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-500">Sao tích lũy</div>
              <div className="text-2xl font-black text-amber-950">
                +{Math.round((correctCount / totalQ) * 5) || 3} ⭐
              </div>
            </div>
          </div>

          {/* Treasure Chest Interactive Section */}
          <div className="my-8 p-6 bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 rounded-3xl border-3 border-amber-400 max-w-lg mx-auto text-center">
            <div className="text-5xl mb-3 cursor-pointer" onClick={handleOpenChest}>
              {isChestOpen ? '🎁✨' : '🧰'}
            </div>

            {!isChestOpen ? (
              <div>
                <h4 className="font-black text-lg text-amber-950">Rương Kho Báu Đảo Tiếng Việt</h4>
                <p className="text-xs font-semibold text-amber-800 mt-1 mb-3">
                  {isPassed
                    ? 'Bé đã đủ điều kiện nhận phần thưởng! Bấm nút bên dưới để mở rương:'
                    : 'Hãy làm đúng ít nhất 70% số câu để mở khóa rương kho báu nhé!'}
                </p>
                {isPassed && (
                  <button
                    onClick={handleOpenChest}
                    className="btn-3d-yellow px-6 py-2.5 rounded-xl text-slate-900 font-black text-sm cursor-pointer shadow-md"
                  >
                    Mở Rương Kho Báu ➔
                  </button>
                )}
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 rounded-full font-black text-xs mb-2">
                  <Award className="w-4 h-4" />
                  <span>DANH HIỆU CAO QUÝ</span>
                </div>
                <div className="text-2xl font-black text-amber-950">Quán Quân Đảo Tiếng Việt 🏆</div>
                <div className="text-xs font-bold text-amber-800 mt-1">
                  Đã trao tặng vào bộ sưu tập huy hiệu của bé {activeProfile.name}!
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {wrongQuestionIds.length > 0 && !isReviewMode && (
              <button
                onClick={handleStartReviewWrongQuestions}
                className="px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm border-2 border-amber-400 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Ôn tập {wrongQuestionIds.length} câu làm sai</span>
              </button>
            )}

            <button
              onClick={handleRestartFullTest}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm border border-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại bài kiểm tra</span>
            </button>

            <button
              onClick={onBackToMap}
              className="px-5 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-sm cursor-pointer"
            >
              Về bản đồ hành trình
            </button>

            {onGoToArena && (
              <button
                onClick={onGoToArena}
                className="btn-3d-yellow px-7 py-3 rounded-2xl text-slate-900 font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Trophy className="w-5 h-5 text-amber-700" />
                <span>Tiến vào Đấu Trường Tiếng Việt 🏆</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
