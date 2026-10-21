import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Timer,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  Volume2,
  Square,
  CheckCircle2,
  ChevronRight,
  Home,
  ShieldCheck,
  Flame,
  Star,
  Zap,
  Target,
  BookOpen,
} from 'lucide-react';
import { ArenaMode, ArenaQuestion, StudentProfile, ArenaLeaderboardEntry } from '../../types';
import { getQuestionsForArena } from '../../data/arenaData';
import { MascotBee, MascotTeacher } from '../illustrations/VectorIllustrations';
import { audioManager } from '../../services/audioManager';
import { storageService } from '../../services/storageService';

interface Props {
  activeProfile: StudentProfile;
  onGoHome: () => void;
  onProfileUpdated: () => void;
}

export const VietnameseArena: React.FC<Props> = ({
  activeProfile,
  onGoHome,
  onProfileUpdated,
}) => {
  const [currentScreen, setCurrentScreen] = useState<'lobby' | 'playing' | 'result' | 'leaderboard'>('lobby');
  const [selectedMode, setSelectedMode] = useState<ArenaMode>('practice');
  const [questions, setQuestions] = useState<ArenaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState<number>(30); // 30s per question in challenge
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [leaderboard, setLeaderboard] = useState<ArenaLeaderboardEntry[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion: ArenaQuestion | undefined = questions[currentIndex];
  const totalQuestions = questions.length;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
      audioManager.stop();
    };
  }, []);

  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (totalTimerRef.current) clearInterval(totalTimerRef.current);
  };

  // Start new game in chosen mode
  const handleStartGame = (mode: ArenaMode) => {
    audioManager.stop();
    clearAllTimers();

    const qList = getQuestionsForArena(mode, mode === 'review' ? 15 : 10);
    setSelectedMode(mode);
    setQuestions(qList);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
    setScore(0);
    setStars(0);
    setCorrectCount(0);
    setTotalTimeSpent(0);
    setTimerRemaining(30);
    setCurrentScreen('playing');

    // Total elapsed timer
    totalTimerRef.current = setInterval(() => {
      setTotalTimeSpent((prev) => prev + 1);
    }, 1000);

    // If challenge mode, start question countdown
    if (mode === 'challenge') {
      startQuestionTimer();
    }

    audioManager.speakOngVang(`Chào mừng bé đến với Đấu trường Tiếng Việt ở chế độ ${
      mode === 'practice' ? 'Luyện tập' : mode === 'challenge' ? 'Thử thách đếm ngược' : 'Ôn tập tổng hợp'
    }!`);
  };

  const startQuestionTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRemaining(30);

    timerRef.current = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeOut = () => {
    if (isChecked) return;
    setIsChecked(true);
    setIsCorrect(false);
    audioManager.playSoundEffect('wrong');
    audioManager.speakOngVang('Hết thời gian rồi bé ơi! Đừng buồn, cùng chuyển sang câu tiếp theo nhé!');
  };

  const handleSpeakQuestion = () => {
    if (!currentQuestion) return;
    setIsSpeaking(true);
    audioManager.speak(currentQuestion.speechText, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleStopAudio = () => {
    audioManager.stop();
    setIsSpeaking(false);
  };

  // Select option: locked immediately when checked
  const handleSelectOption = (idx: number) => {
    if (isChecked) return;
    setSelectedOption(idx);
  };

  // Check answer
  const handleCheckAnswer = () => {
    if (isChecked || selectedOption === null || !currentQuestion) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const correct = selectedOption === currentQuestion.correctIndex;
    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      audioManager.playSoundEffect('correct');
      // Bonus score for remaining time in challenge mode
      const speedBonus = selectedMode === 'challenge' ? timerRemaining * 5 : 0;
      const earned = currentQuestion.points + speedBonus;
      setScore((prev) => prev + earned);
      setStars((prev) => prev + 1);
      setCorrectCount((prev) => prev + 1);
      audioManager.speakOngVang('Chính xác! Bé được cộng điểm và 1 ngôi sao!');
    } else {
      audioManager.playSoundEffect('wrong');
      audioManager.speakOngVang('Chưa chính xác rồi, hãy đọc kỹ gợi ý nhé bé!');
    }
  };

  // Next Question or Finish Match
  const handleNextQuestion = () => {
    audioManager.stop();
    setIsSpeaking(false);

    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);

      if (selectedMode === 'challenge') {
        startQuestionTimer();
      }
    } else {
      // Finish Match
      clearAllTimers();
      handleFinishMatch();
    }
  };

  const handleFinishMatch = () => {
    setCurrentScreen('result');
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    audioManager.playSoundEffect('badge');

    // Calculate title
    let title = 'Tập Sự Tiếng Việt';
    if (correctCount >= totalQuestions * 0.9) title = 'Đại Kiện Tướng Tiếng Việt';
    else if (correctCount >= totalQuestions * 0.7) title = 'Dũng Sĩ Tiếng Việt';
    else if (correctCount >= totalQuestions * 0.5) title = 'Chiến Binh Chăm Chỉ';

    // Save record to local leaderboard
    storageService.recordArenaResult({
      studentId: activeProfile.id,
      studentName: activeProfile.name,
      avatar: activeProfile.avatar,
      score,
      correctCount,
      totalQuestions,
      mode: selectedMode,
      timeSpentSeconds: totalTimeSpent,
      titleEarned: title,
    });

    onProfileUpdated();
  };

  const handleOpenLeaderboard = () => {
    setLeaderboard(storageService.getArenaLeaderboard());
    setCurrentScreen('leaderboard');
  };

  const handlePlayAgainSameMode = () => {
    handleStartGame(selectedMode);
  };

  const handlePlayDifferentSet = () => {
    handleStartGame(selectedMode);
  };

  // -------------------------------------------------------------
  // RENDER: LOBBY SCREEN
  // -------------------------------------------------------------
  if (currentScreen === 'lobby') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Arena Welcome Banner */}
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl overflow-hidden mb-8 border-4 border-amber-300">
          <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black mb-3 border border-white/30">
                <Flame className="w-4 h-4 text-amber-200 fill-amber-200" />
                <span>Sân Thi Đấu Trí Tuệ Lớp 1</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                ĐẤU TRƯỜNG TIẾNG VIỆT
              </h2>
              <p className="text-amber-100 text-sm sm:text-base font-semibold max-w-xl mt-2 leading-relaxed">
                Nơi các bạn nhỏ cùng tranh tài ghép chữ, nhận diện âm vần, giải đố từ ngữ và rèn luyện phản xạ ngôn ngữ nhanh nhạy!
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <MascotTeacher className="w-20 h-20 drop-shadow-lg" />
              <MascotBee className="w-20 h-20 animate-float drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Current Student Card & Leaderboard Link */}
        <div className="bg-white rounded-2xl p-4 border-2 border-emerald-300 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xl">
              👤
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500">Đấu thủ đang tham gia:</div>
              <div className="text-base font-black text-emerald-800">
                {activeProfile.name} • {activeProfile.stars} ⭐ sao tích lũy
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenLeaderboard}
              className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs sm:text-sm flex items-center gap-1.5 border border-amber-300 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Bảng vàng thành tích</span>
            </button>

            <button
              onClick={onGoHome}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-slate-300 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Về trang chủ</span>
            </button>
          </div>
        </div>

        {/* 3 Arena Game Modes (Required by user prompt) */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-slate-800">
              Chọn Chế Độ Thi Đấu
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Học sinh có thể chọn chế độ phù hợp với tốc độ học tập của mình
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mode 1: Luyện tập */}
            <div className="bg-white rounded-3xl p-6 border-4 border-emerald-300 hover:border-emerald-500 shadow-md flex flex-col justify-between transition-all hover:scale-102">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mb-4 shadow-xs">
                  🎯
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-black mb-2">
                  <span>THÂN THIỆN</span>
                </div>
                <h4 className="text-xl font-black text-slate-800">Chế Độ Luyện Tập</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-2 leading-relaxed">
                  Không giới hạn thời gian. Có phản hồi, hướng dẫn và giải thích sư phạm chi tiết sau mỗi câu hỏi.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Bộ 10 câu hỏi đa dạng</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Không đếm ngược thời gian</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Máy đọc phát âm chuẩn xác</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleStartGame('practice')}
                  className="w-full btn-3d-green py-3 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Vào Luyện Tập</span>
                </button>
              </div>
            </div>

            {/* Mode 2: Thử thách */}
            <div className="bg-white rounded-3xl p-6 border-4 border-amber-400 hover:border-amber-500 shadow-md flex flex-col justify-between transition-all hover:scale-102 ring-2 ring-amber-200">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-3xl mb-4 shadow-xs">
                  ⚡
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-200 text-amber-950 rounded-lg text-xs font-black mb-2">
                  <Flame className="w-3.5 h-3.5 text-amber-700" />
                  <span>KỊCH TÍNH</span>
                </div>
                <h4 className="text-xl font-black text-slate-800">Chế Độ Thử Thách</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-2 leading-relaxed">
                  Đồng hồ đếm ngược 30 giây mỗi câu! Trả lời càng nhanh càng được nhiều điểm thưởng tốc độ.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-amber-600" />
                    <span>Đếm ngược 30 giây / câu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>Cộng điểm thưởng tốc độ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>Ghi danh Bảng Vàng</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleStartGame('challenge')}
                  className="w-full btn-3d-yellow py-3 rounded-2xl text-slate-900 font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Zap className="w-4 h-4" />
                  <span>Vào Thử Thách</span>
                </button>
              </div>
            </div>

            {/* Mode 3: Ôn tập */}
            <div className="bg-white rounded-3xl p-6 border-4 border-indigo-300 hover:border-indigo-500 shadow-md flex flex-col justify-between transition-all hover:scale-102">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center text-3xl mb-4 shadow-xs">
                  📚
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-100 text-indigo-900 rounded-lg text-xs font-black mb-2">
                  <span>TỔNG HỢP</span>
                </div>
                <h4 className="text-xl font-black text-slate-800">Chế Độ Ôn Tập</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-2 leading-relaxed">
                  Bộ 15 câu hỏi bao quát trọn vẹn 7 dạng bài: âm vần, ghép tiếng, quy tắc chính tả, đọc hiểu câu.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>15 câu hỏi tổng hợp</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span>Bao phủ toàn diện GDPT 2018</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-indigo-600" />
                    <span>Nhận sao thưởng dồi dào</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleStartGame('review')}
                  className="w-full px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Vào Ôn Tập</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 7 Question Types Pedagogical Overview */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200">
          <h4 className="text-base font-black text-slate-800 mb-3 flex items-center gap-2">
            <span>🎯</span>
            <span>7 Dạng câu hỏi chuẩn hóa trong Đấu trường:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs font-bold text-slate-700">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-black">1</span>
              <span>Nhận diện chữ cái</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-200 text-emerald-900 flex items-center justify-center text-[10px] font-black">2</span>
              <span>Chọn âm / vần đúng</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-200 text-sky-900 flex items-center justify-center text-[10px] font-black">3</span>
              <span>Tìm tiếng có âm/vần</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-200 text-purple-900 flex items-center justify-center text-[10px] font-black">4</span>
              <span>Ghép chữ thành tiếng</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-200 text-rose-900 flex items-center justify-center text-[10px] font-black">5</span>
              <span>Chọn từ theo hình ảnh</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-200 text-teal-900 flex items-center justify-center text-[10px] font-black">6</span>
              <span>Chọn từ / câu đúng</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 sm:col-span-2">
              <span className="w-6 h-6 rounded-lg bg-orange-200 text-orange-900 flex items-center justify-center text-[10px] font-black">7</span>
              <span>Điền âm, vần, tiếng còn thiếu</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: PLAYING SCREEN
  // -------------------------------------------------------------
  if (currentScreen === 'playing' && currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Arena Scoreboard & Status Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 border-4 border-amber-400 shadow-xl mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Student & Match Mode */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-lg">
                🏆
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400">
                  Đấu trường: <span className="text-amber-300 font-extrabold uppercase">{selectedMode}</span>
                </div>
                <div className="text-sm font-black text-white">
                  Đấu thủ: {activeProfile.name}
                </div>
              </div>
            </div>

            {/* Score & Stars Display LED-style */}
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 border border-amber-400/50 px-4 py-2 rounded-2xl text-center">
                <div className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Điểm số</div>
                <div className="text-2xl font-black text-amber-400 font-mono">{score}</div>
              </div>

              <div className="bg-slate-800 border border-emerald-400/50 px-3 py-2 rounded-2xl text-center">
                <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Đúng</div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  {correctCount}/{totalQuestions}
                </div>
              </div>

              {/* Countdown Timer for Challenge Mode */}
              {selectedMode === 'challenge' && (
                <div className={`px-4 py-2 rounded-2xl text-center border font-mono font-black ${
                  timerRemaining <= 10
                    ? 'bg-rose-900/80 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-800 border-sky-400/50 text-sky-300'
                }`}>
                  <div className="text-[10px] uppercase tracking-widest flex items-center justify-center gap-1">
                    <Timer className="w-3 h-3" />
                    <span>Thời gian</span>
                  </div>
                  <div className="text-2xl">{timerRemaining}s</div>
                </div>
              )}
            </div>

            {/* Exit to Lobby */}
            <button
              onClick={() => {
                clearAllTimers();
                audioManager.stop();
                setCurrentScreen('lobby');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer border border-slate-700"
            >
              Thoát trận
            </button>
          </div>

          {/* Question Progress Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold mb-1.5">
            <span>Câu hỏi {currentIndex + 1} / {totalQuestions}</span>
            <span className="text-amber-400">{currentQuestion.typeName}</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Stadium Arena Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl relative">
          {/* Audio & Mascot Voice Guidance Dock */}
          <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-3 flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <MascotBee className="w-11 h-11 shrink-0 animate-float" />
              <div>
                <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <span>🐝 Ong Vàng cổ vũ:</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                    +{currentQuestion.points} điểm
                  </span>
                </div>
                <div className="text-xs text-amber-800 italic line-clamp-1">
                  "{currentQuestion.hint}"
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleSpeakQuestion}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 border transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-sky-500 text-white border-sky-600 animate-pulse'
                    : 'bg-sky-100 hover:bg-sky-200 text-sky-900 border-sky-300'
                }`}
              >
                <Volume2 className="w-4 h-4 text-sky-700" />
                <span>Nghe đọc</span>
              </button>

              {isSpeaking && (
                <button
                  onClick={handleStopAudio}
                  className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
            </div>
          </div>

          {/* Question Instruction */}
          <div className="text-center my-6">
            <h3 className="text-lg sm:text-2xl font-black text-slate-800">
              {currentQuestion.instruction}
            </h3>

            {/* Big Prominent Prompt Box */}
            <div className="mt-4 p-6 sm:p-8 bg-gradient-to-b from-sky-50 to-amber-50 rounded-3xl border-3 border-amber-300 inline-block min-w-[280px] max-w-full shadow-inner">
              <div className="text-3xl sm:text-5xl font-black text-slate-900 tracking-wider">
                {currentQuestion.prompt}
              </div>
              {currentQuestion.subPrompt && (
                <div className="text-xs sm:text-sm font-extrabold text-amber-700 mt-2">
                  {currentQuestion.subPrompt}
                </div>
              )}
            </div>
          </div>

          {/* Multiple Choice Options (Large buttons, locks once checked) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-amber-50 hover:border-amber-400';

              if (isChecked) {
                if (idx === currentQuestion.correctIndex) {
                  btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-4 ring-emerald-300 scale-102 shadow-md';
                } else if (isSelected) {
                  btnClass = 'bg-rose-100 border-rose-400 text-rose-900';
                } else {
                  btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                btnClass = 'bg-amber-100 border-amber-500 text-amber-950 ring-4 ring-amber-300 scale-102 shadow-md';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isChecked}
                  className={`p-5 rounded-2xl border-4 text-center font-black text-xl sm:text-2xl transition-all cursor-pointer relative group ${btnClass}`}
                >
                  <span className="w-8 h-8 rounded-xl bg-slate-200 group-hover:bg-amber-300 text-slate-800 font-extrabold text-xs flex items-center justify-center absolute top-3 left-3">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="inline-block py-1 px-4">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Action Bar: Check or Next Question */}
          <div className="mt-8 pt-6 border-t-2 border-slate-100 flex flex-wrap items-center justify-between gap-4">
            {!isChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                  selectedOption !== null
                    ? 'btn-3d-green text-white cursor-pointer hover:brightness-105 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Khóa đáp án & Kiểm tra</span>
              </button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 w-full sm:w-auto flex-1 ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    : 'bg-amber-50 border-amber-400 text-amber-900'
                }`}>
                  <div className="text-2xl">{isCorrect ? '🎉' : '💡'}</div>
                  <div className="text-xs sm:text-sm font-semibold">
                    <div className="font-black text-sm">
                      {isCorrect ? 'Chính xác! Bé xuất sắc quá!' : 'Gợi ý giải thích từ cô giáo:'}
                    </div>
                    <div>{currentQuestion.explanation}</div>
                  </div>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="btn-3d-yellow px-7 py-3.5 rounded-2xl font-black text-sm text-slate-900 flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 hover:brightness-105"
                >
                  <span>{currentIndex + 1 < totalQuestions ? 'Câu hỏi tiếp theo' : 'Xem kết quả thi'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: RESULT & SUMMARY SCREEN
  // -------------------------------------------------------------
  if (currentScreen === 'result') {
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    let title = 'Tập Sự Tiếng Việt';
    if (correctCount >= totalQuestions * 0.9) title = 'Đại Kiện Tướng Tiếng Việt';
    else if (correctCount >= totalQuestions * 0.7) title = 'Dũng Sĩ Tiếng Việt';
    else if (correctCount >= totalQuestions * 0.5) title = 'Chiến Binh Chăm Chỉ';

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-amber-400 shadow-2xl text-center relative overflow-hidden">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-100 text-amber-900 rounded-full text-xs sm:text-sm font-black mb-3">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>KẾT THÚC TRẬN ĐẤU TRƯỜNG</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-800">
            {score} ĐIỂM
          </h2>

          <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-900 rounded-xl font-black text-base mt-2 border border-emerald-300">
            Danh hiệu: {title}
          </div>

          <p className="text-slate-600 text-sm sm:text-base font-semibold max-w-md mx-auto mt-3">
            Cô Đào và bạn Ong Vàng khen ngợi tinh thần thi đấu xuất sắc và nỗ lực tuyệt vời của bé {activeProfile.name}!
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <div className="text-xs font-bold text-slate-500">Số câu đúng</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600">
                {correctCount} / {totalQuestions}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <div className="text-xs font-bold text-slate-500">Tỉ lệ chính xác</div>
              <div className="text-xl sm:text-2xl font-black text-sky-600">
                {accuracy}%
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <div className="text-xs font-bold text-slate-500">Thời gian thi</div>
              <div className="text-xl sm:text-2xl font-black text-amber-600">
                {totalTimeSpent}s
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <div className="text-xs font-bold text-slate-500">Sao tích lũy</div>
              <div className="text-xl sm:text-2xl font-black text-purple-600">
                +{stars} ⭐
              </div>
            </div>
          </div>

          {/* 3 Action Buttons Required by User Prompt */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t-2 border-slate-100">
            <button
              onClick={handlePlayAgainSameMode}
              className="btn-3d-yellow px-6 py-3 rounded-2xl text-slate-900 font-black text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại trận này</span>
            </button>

            <button
              onClick={handlePlayDifferentSet}
              className="btn-3d-green px-6 py-3 rounded-2xl text-white font-black text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span>Làm bộ câu hỏi khác</span>
            </button>

            <button
              onClick={handleOpenLeaderboard}
              className="px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm border border-amber-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-700" />
              <span>Xem Bảng vàng</span>
            </button>

            <button
              onClick={onGoHome}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Về trang chủ</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: LEADERBOARD SCREEN (Bảng vàng thành tích)
  // -------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-2xl shadow-sm">
              🏆
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                Bảng Vàng Đấu Trường Tiếng Việt
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                Ghi nhận thành tích thi đấu thực tế của các bạn nhỏ trên máy tính này
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScreen('lobby')}
              className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-900 font-black text-xs sm:text-sm cursor-pointer shadow-xs"
            >
              Vào thi đấu ngay
            </button>

            <button
              onClick={onGoHome}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer"
            >
              Về trang chủ
            </button>
          </div>
        </div>

        {/* Local Storage Privacy Notice (Strict requirement from prompt) */}
        <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-sky-600 shrink-0" />
          <div className="text-xs text-sky-900 leading-relaxed">
            <span className="font-black">Bảo mật thông tin học sinh: </span>
            Bảng thành tích cục bộ được lưu trữ an toàn trên máy của bạn, chỉ dùng dữ liệu thi thật đã lưu và không chia sẻ thông tin cá nhân của học sinh lớp 1 ra bên ngoài.
          </div>
        </div>

        {/* Leaderboard Table */}
        {leaderboard.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-2" />
            <h4 className="text-base font-black text-slate-700">Chưa có kết quả thi nào</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Bé hãy tham gia ngay một trận thi đấu ở Đấu trường để trở thành người đầu tiên vinh danh trên Bảng Vàng nhé!
            </p>
            <button
              onClick={() => handleStartGame('practice')}
              className="btn-3d-green mt-4 px-6 py-2.5 rounded-xl text-white font-black text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Bắt đầu trận đầu tiên</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-black border-b-2 border-slate-200">
                  <th className="py-3 px-4 rounded-l-xl">Hạng</th>
                  <th className="py-3 px-4">Đấu thủ</th>
                  <th className="py-3 px-4">Chế độ</th>
                  <th className="py-3 px-4 text-center">Đúng</th>
                  <th className="py-3 px-4 text-center">Điểm số</th>
                  <th className="py-3 px-4">Danh hiệu</th>
                  <th className="py-3 px-4 rounded-r-xl">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {leaderboard.map((entry, idx) => (
                  <tr key={entry.id} className="hover:bg-amber-50/50 transition-colors">
                    <td className="py-3 px-4">
                      {idx === 0 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-black flex items-center justify-center text-xs shadow-xs">
                          🥇
                        </span>
                      ) : idx === 1 ? (
                        <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black flex items-center justify-center text-xs shadow-xs">
                          🥈
                        </span>
                      ) : idx === 2 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-xs shadow-xs">
                          🥉
                        </span>
                      ) : (
                        <span className="text-slate-400 font-black pl-2">#{idx + 1}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-black text-slate-800">{entry.studentName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase bg-slate-100 text-slate-700">
                        {entry.mode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-black">
                      {entry.correctCount}/{entry.totalQuestions}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-black text-amber-600 text-base">
                      {entry.score}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-black text-indigo-700">{entry.titleEarned}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
