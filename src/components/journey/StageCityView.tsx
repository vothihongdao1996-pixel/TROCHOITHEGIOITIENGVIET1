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
  Building2,
  Sparkles,
  Delete,
} from 'lucide-react';
import { JourneyStage, StudentProfile } from '../../types';
import { MascotBee, MascotTeacher } from '../illustrations/VectorIllustrations';
import { audioManager } from '../../services/audioManager';
import { storageService } from '../../services/storageService';

interface Props {
  stage: JourneyStage;
  activeProfile: StudentProfile;
  onBackToMap: () => void;
  onGoToNextStage?: (nextStageNumber: number) => void;
  onProgressUpdated: () => void;
}

type CityActivityType = 'blend-combine' | 'fill-component' | 'order-tiles' | 'picture-blend' | 'challenge-round';

interface CityTask {
  id: string;
  stepNumber: number;
  type: CityActivityType;
  title: string;
  instruction: string;
  speechText: string;
  hint: string;
  explanation: string;
  stars: number;
  // Payload for specific activity:
  combinePayload?: {
    onset: string;
    rhyme: string;
    tone: string;
    options: string[];
    correctIndex: number;
  };
  fillPayload?: {
    targetWord: string;
    missingSlot: string; // e.g. "[ ? ] + e + thanh nặng"
    options: string[];
    correctIndex: number;
  };
  orderPayload?: {
    tiles: string[];
    targetPhrase: string;
    correctSequence: string[];
  };
  picturePayload?: {
    emoji: string;
    pictureLabel: string;
    options: string[];
    correctIndex: number;
  };
  challengePayload?: {
    questions: {
      question: string;
      options: string[];
      correctIndex: number;
    }[];
  };
}

const CITY_TASKS: CityTask[] = [
  {
    id: 'task-3-1',
    stepNumber: 1,
    type: 'blend-combine',
    title: '1. Ghép âm đầu với vần tạo tiếng',
    instruction: 'Xưởng ghép chữ: Ghép âm đầu "c" với vần "a" và thanh "huyền" tạo thành tiếng gì?',
    speechText: 'Âm cờ ghép với vần a và thanh huyền tạo thành tiếng gì?',
    hint: 'c - a - ca - huyền - cà, quả cà pháo tím ngát con nhé!',
    explanation: 'Chính xác! Âm đầu "c" ghép với vần "a" và thanh huyền tạo thành tiếng "cà".',
    stars: 1,
    combinePayload: {
      onset: 'c',
      rhyme: 'a',
      tone: 'thanh huyền ( \\ )',
      options: ['ca', 'cá', 'cà', 'cạ'],
      correctIndex: 2,
    },
  },
  {
    id: 'task-3-2',
    stepNumber: 2,
    type: 'fill-component',
    title: '2. Chọn thẻ thành phần còn thiếu',
    instruction: 'Tiếng "mẹ" có vần "e" và thanh nặng. Thẻ âm đầu còn thiếu là thẻ nào?',
    speechText: 'Trong tiếng mẹ, thẻ âm đầu còn thiếu là âm nào?',
    hint: 'Âm đầu đứng trước nhất trong tiếng "mẹ" là âm mờ!',
    explanation: 'Rất giỏi! Tiếng "mẹ" bắt đầu bằng âm đầu "m", ghép với vần "e" và thanh nặng (m - e - me - nặng - mẹ).',
    stars: 1,
    fillPayload: {
      targetWord: 'mẹ',
      missingSlot: '[ ? ]  +  e  +  thanh nặng ( . )  =  mẹ',
      options: ['m', 'b', 'c', 'n'],
      correctIndex: 0,
    },
  },
  {
    id: 'task-3-3',
    stepNumber: 3,
    type: 'order-tiles',
    title: '3. Sắp xếp thẻ theo đúng thứ tự',
    instruction: 'Bé hãy bấm các thẻ chữ cái theo đúng thứ tự để tạo thành từ "ba má":',
    speechText: 'Bé hãy xếp các thẻ chữ cái để tạo thành từ ba má',
    hint: 'Bấm thẻ "ba" trước, rồi bấm thẻ "má" sau nhé!',
    explanation: 'Tuyệt vời! Từ "ba má" được ghép bởi tiếng "ba" đứng trước và tiếng "má" đứng sau.',
    stars: 1,
    orderPayload: {
      tiles: ['má', 'ba'],
      targetPhrase: 'ba má',
      correctSequence: ['ba', 'má'],
    },
  },
  {
    id: 'task-3-4',
    stepNumber: 4,
    type: 'picture-blend',
    title: '4. Chọn tiếng đúng theo tranh minh họa',
    instruction: 'Nhìn bức tranh chiếc xe đạp và chọn tiếng miêu tả đúng nhất:',
    speechText: 'Nhìn bức tranh chiếc xe đạp và chọn tiếng đúng',
    hint: 'Tiếng "xe" gồm âm xờ ghép với âm e con nhé!',
    explanation: 'Xuất sắc! Bức tranh vẽ chiếc xe đạp, tương ứng với tiếng "xe" (x - e - xe).',
    stars: 1,
    picturePayload: {
      emoji: '🚲',
      pictureLabel: 'Chiếc xe đạp',
      options: ['xe', 'bò', 'cá', 'nhà'],
      correctIndex: 0,
    },
  },
  {
    id: 'task-3-5',
    stepNumber: 5,
    type: 'challenge-round',
    title: '5. Thử thách ghép tiếng siêu tốc',
    instruction: 'Bài kiểm tra cuối chặng: Hoàn thành 3 câu ghép tiếng liên tiếp!',
    speechText: 'Thử thách cuối chặng: Bé hãy giải nhanh các câu đố ghép tiếng!',
    hint: 'Hãy chú ý dấu thanh và nguyên âm trong từng câu nhé!',
    explanation: 'Bé đã hoàn thành xuất sắc toàn bộ bài thử thách thành phố ghép tiếng!',
    stars: 1,
    challengePayload: {
      questions: [
        {
          question: 'b + o + thanh sắc = ?',
          options: ['bó', 'bò', 'bỏ', 'bọ'],
          correctIndex: 0,
        },
        {
          question: 'l + a + thanh hỏi = ?',
          options: ['la', 'lá', 'lả', 'lạ'],
          correctIndex: 2,
        },
        {
          question: 'g + a + thanh huyền = ?',
          options: ['gà', 'gá', 'gả', 'gạ'],
          correctIndex: 0,
        },
      ],
    },
  },
];

export const StageCityView: React.FC<Props> = ({
  stage,
  activeProfile,
  onBackToMap,
  onGoToNextStage,
  onProgressUpdated,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [selectedOrderTiles, setSelectedOrderTiles] = useState<string[]>([]);
  const [challengeQuestionIndex, setChallengeQuestionIndex] = useState(0);
  const [challengeAnswers, setChallengeAnswers] = useState<number[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMascotSpeaking, setIsMascotSpeaking] = useState(false);

  const currentTask = CITY_TASKS[currentStepIndex];
  const totalSteps = CITY_TASKS.length;

  useEffect(() => {
    return () => {
      audioManager.stop();
    };
  }, [currentStepIndex, challengeQuestionIndex]);

  const handleSpeak = () => {
    if (!currentTask) return;
    setIsSpeaking(true);
    setIsMascotSpeaking(false);
    audioManager.speak(currentTask.speechText, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleMascotHint = () => {
    if (!currentTask) return;
    setIsMascotSpeaking(true);
    setIsSpeaking(false);
    audioManager.speakOngVang(currentTask.hint, () => {
      setIsMascotSpeaking(false);
    });
  };

  // Activity 3: Add / remove tile
  const handleAddTile = (tile: string) => {
    if (isChecked) return;
    setSelectedOrderTiles((prev) => [...prev, tile]);
  };

  const handleClearTiles = () => {
    if (isChecked) return;
    setSelectedOrderTiles([]);
  };

  // Activity 5: Challenge sub-question
  const handleSelectChallengeAnswer = (optIdx: number) => {
    if (isChecked) return;
    setSelectedOptionIndex(optIdx);
  };

  const handleCheckAnswer = () => {
    if (isChecked) return;
    let correct = false;

    if (currentTask.type === 'blend-combine' && currentTask.combinePayload) {
      if (selectedOptionIndex === null) return;
      correct = selectedOptionIndex === currentTask.combinePayload.correctIndex;
    } else if (currentTask.type === 'fill-component' && currentTask.fillPayload) {
      if (selectedOptionIndex === null) return;
      correct = selectedOptionIndex === currentTask.fillPayload.correctIndex;
    } else if (currentTask.type === 'order-tiles' && currentTask.orderPayload) {
      if (selectedOrderTiles.length !== currentTask.orderPayload.correctSequence.length) return;
      correct = selectedOrderTiles.every(
        (val, i) => val === currentTask.orderPayload!.correctSequence[i]
      );
    } else if (currentTask.type === 'picture-blend' && currentTask.picturePayload) {
      if (selectedOptionIndex === null) return;
      correct = selectedOptionIndex === currentTask.picturePayload.correctIndex;
    } else if (currentTask.type === 'challenge-round' && currentTask.challengePayload) {
      if (selectedOptionIndex === null) return;
      const q = currentTask.challengePayload.questions[challengeQuestionIndex];
      correct = selectedOptionIndex === q.correctIndex;
    }

    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      audioManager.playSoundEffect('correct');
      audioManager.speakFeedback(true, currentTask.explanation);

      if (currentTask.type === 'challenge-round' && currentTask.challengePayload) {
        setChallengeAnswers((prev) => [...prev, selectedOptionIndex!]);
      } else {
        setStarsEarned((prev) => prev + currentTask.stars);
        storageService.completeJourneyTask(
          activeProfile.id,
          stage.stageNumber,
          currentTask.id,
          currentTask.stars,
          totalSteps
        );
        onProgressUpdated();
      }
    } else {
      audioManager.playSoundEffect('wrong');
      audioManager.speakFeedback(false, currentTask.explanation);
    }
  };

  const handleNextStep = () => {
    audioManager.stop();
    setIsSpeaking(false);
    setIsMascotSpeaking(false);

    if (currentTask.type === 'challenge-round' && currentTask.challengePayload) {
      if (challengeQuestionIndex + 1 < currentTask.challengePayload.questions.length) {
        setChallengeQuestionIndex((prev) => prev + 1);
        setSelectedOptionIndex(null);
        setIsChecked(false);
        setIsCorrect(false);
        return;
      } else {
        // Completed all challenge questions!
        setStarsEarned((prev) => prev + currentTask.stars);
        storageService.completeJourneyTask(
          activeProfile.id,
          stage.stageNumber,
          currentTask.id,
          currentTask.stars,
          totalSteps
        );
        onProgressUpdated();
      }
    }

    if (currentStepIndex + 1 < totalSteps) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setSelectedOrderTiles([]);
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      audioManager.playSoundEffect('badge');
      audioManager.speakOngVang(
        `Chúc mừng bé ${activeProfile.name}! Bé đã trở thành Kỹ Sư Ghép Tiếng xuất sắc!`
      );
    }
  };

  const handleRetry = () => {
    setSelectedOptionIndex(null);
    setSelectedOrderTiles([]);
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 border-2 border-indigo-300 shadow-sm">
        <button
          onClick={onBackToMap}
          className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-800 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-black">
            <Building2 className="w-4 h-4 text-indigo-700" />
            <span>Chặng 3: Thành Phố Ghép Tiếng</span>
          </div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">
            Nhiệm vụ {currentStepIndex + 1} / {totalSteps}: {currentTask.title}
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 font-black text-xs sm:text-sm">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>+{starsEarned} sao</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-indigo-100 h-3 rounded-full overflow-hidden mb-6 border border-indigo-300">
        <div
          className="bg-gradient-to-r from-indigo-500 to-sky-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {!isFinished ? (
        <div className="relative bg-gradient-to-b from-indigo-50/80 via-sky-50 to-amber-50/60 rounded-3xl p-6 sm:p-8 border-4 border-indigo-400 shadow-xl overflow-hidden">
          {/* Animated City Props */}
          <div className="absolute top-2 right-4 text-3xl opacity-20 select-none">🏢</div>
          <div className="absolute bottom-3 left-4 text-3xl opacity-20 select-none">🏠</div>

          {/* Guide Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 relative z-10">
            <div className="bg-white/90 border-2 border-indigo-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <MascotTeacher className="w-11 h-11 shrink-0" />
                <div>
                  <div className="text-xs font-black text-indigo-900">🌸 Cô Đào hướng dẫn</div>
                  <div className="text-xs text-slate-600 font-semibold line-clamp-1">
                    {currentTask.instruction}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSpeak}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 border transition-all cursor-pointer shrink-0 ${
                  isSpeaking
                    ? 'bg-indigo-600 text-white border-indigo-700 animate-pulse'
                    : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border-indigo-300'
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
                    "{currentTask.hint}"
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

          {/* Activity 1: Blend Combine */}
          {currentTask.type === 'blend-combine' && currentTask.combinePayload && (
            <div className="text-center my-6 relative z-10">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-4">
                {currentTask.instruction}
              </h3>
              <div className="inline-flex flex-wrap items-center justify-center gap-3 p-5 sm:p-7 bg-white/95 rounded-3xl border-4 border-indigo-300 shadow-md">
                <span className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 border-3 border-indigo-400 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-indigo-900 shadow-inner">
                  {currentTask.combinePayload.onset}
                </span>
                <span className="text-3xl font-black text-slate-400">+</span>
                <span className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-100 border-3 border-sky-400 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-sky-900 shadow-inner">
                  {currentTask.combinePayload.rhyme}
                </span>
                <span className="text-3xl font-black text-slate-400">+</span>
                <span className="px-4 py-2 bg-amber-100 border-3 border-amber-400 rounded-2xl text-base sm:text-lg font-black text-amber-900">
                  {currentTask.combinePayload.tone}
                </span>
                <span className="text-3xl font-black text-slate-400">=</span>
                <span className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 border-3 border-emerald-400 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-emerald-900 shadow-inner">
                  ?
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {currentTask.combinePayload.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isChecked) setSelectedOptionIndex(idx);
                    }}
                    disabled={isChecked}
                    className={`p-5 rounded-2xl border-4 font-black text-2xl sm:text-3xl transition-all cursor-pointer shadow-sm ${
                      isChecked
                        ? idx === currentTask.combinePayload!.correctIndex
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300'
                          : selectedOptionIndex === idx
                          ? 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-white/60 border-slate-200 text-slate-400'
                        : selectedOptionIndex === idx
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-950 ring-4 ring-indigo-300 scale-102 shadow-md'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Activity 2: Fill Component */}
          {currentTask.type === 'fill-component' && currentTask.fillPayload && (
            <div className="text-center my-6 relative z-10">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-4">
                {currentTask.instruction}
              </h3>
              <div className="inline-block p-6 bg-white/95 rounded-3xl border-4 border-indigo-300 shadow-md">
                <div className="text-2xl sm:text-3xl font-black text-indigo-900 tracking-wider">
                  {currentTask.fillPayload.missingSlot}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {currentTask.fillPayload.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isChecked) setSelectedOptionIndex(idx);
                    }}
                    disabled={isChecked}
                    className={`p-5 rounded-2xl border-4 font-black text-3xl sm:text-4xl transition-all cursor-pointer shadow-sm ${
                      isChecked
                        ? idx === currentTask.fillPayload!.correctIndex
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300'
                          : selectedOptionIndex === idx
                          ? 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-white/60 border-slate-200 text-slate-400'
                        : selectedOptionIndex === idx
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-950 ring-4 ring-indigo-300 scale-102 shadow-md'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Activity 3: Order Tiles (Interactive Tray) */}
          {currentTask.type === 'order-tiles' && currentTask.orderPayload && (
            <div className="text-center my-6 relative z-10">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-2">
                {currentTask.instruction}
              </h3>
              <div className="text-sm font-bold text-slate-500 mb-4">
                Từ mục tiêu: <span className="text-indigo-700 font-black text-lg">"{currentTask.orderPayload.targetPhrase}"</span>
              </div>

              {/* Tray Display */}
              <div className="p-6 bg-white/95 rounded-3xl border-4 border-indigo-300 shadow-inner min-h-[90px] flex items-center justify-center gap-3">
                {selectedOrderTiles.length === 0 ? (
                  <span className="text-slate-400 font-bold italic text-sm sm:text-base">
                    (Bấm các thẻ chữ ở dưới để xếp vào khay này)
                  </span>
                ) : (
                  selectedOrderTiles.map((tile, idx) => (
                    <span
                      key={idx}
                      className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-2xl shadow-md animate-bounce"
                    >
                      {tile}
                    </span>
                  ))
                )}
              </div>

              {/* Reset Tray Button */}
              {selectedOrderTiles.length > 0 && !isChecked && (
                <div className="mt-3 flex justify-center">
                  <button
                    onClick={handleClearTiles}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Delete className="w-4 h-4" />
                    <span>Xóa lựa chọn xếp lại</span>
                  </button>
                </div>
              )}

              {/* Available Tile Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                {currentTask.orderPayload.tiles.map((tile, idx) => {
                  const countInTray = selectedOrderTiles.filter((t) => t === tile).length;
                  const isUsed = countInTray >= 1;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAddTile(tile)}
                      disabled={isChecked || isUsed}
                      className={`px-8 py-4 rounded-2xl border-4 font-black text-2xl sm:text-3xl transition-all shadow-md ${
                        isUsed
                          ? 'bg-slate-200 border-slate-300 text-slate-400 opacity-50 cursor-not-allowed'
                          : 'bg-white hover:bg-amber-100 border-amber-400 text-slate-800 cursor-pointer active:scale-95'
                      }`}
                    >
                      {tile}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Activity 4: Picture Blend */}
          {currentTask.type === 'picture-blend' && currentTask.picturePayload && (
            <div className="text-center my-6 relative z-10">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-4">
                {currentTask.instruction}
              </h3>

              <div className="p-6 bg-white/95 rounded-3xl border-4 border-indigo-300 inline-block shadow-md">
                <div className="text-6xl sm:text-7xl mb-2">{currentTask.picturePayload.emoji}</div>
                <div className="text-xs font-bold text-slate-500">{currentTask.picturePayload.pictureLabel}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {currentTask.picturePayload.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isChecked) setSelectedOptionIndex(idx);
                    }}
                    disabled={isChecked}
                    className={`p-5 rounded-2xl border-4 font-black text-2xl sm:text-3xl transition-all cursor-pointer shadow-sm ${
                      isChecked
                        ? idx === currentTask.picturePayload!.correctIndex
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300'
                          : selectedOptionIndex === idx
                          ? 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-white/60 border-slate-200 text-slate-400'
                        : selectedOptionIndex === idx
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-950 ring-4 ring-indigo-300 scale-102 shadow-md'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Activity 5: Challenge Round */}
          {currentTask.type === 'challenge-round' && currentTask.challengePayload && (
            <div className="text-center my-6 relative z-10">
              <div className="inline-block px-3 py-1 bg-amber-200 text-amber-950 rounded-full text-xs font-black mb-2">
                ⚡ Câu đố {challengeQuestionIndex + 1} / {currentTask.challengePayload.questions.length}
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-4">
                {currentTask.challengePayload.questions[challengeQuestionIndex].question}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {currentTask.challengePayload.questions[challengeQuestionIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectChallengeAnswer(idx)}
                    disabled={isChecked}
                    className={`p-5 rounded-2xl border-4 font-black text-2xl sm:text-3xl transition-all cursor-pointer shadow-sm ${
                      isChecked
                        ? idx === currentTask.challengePayload!.questions[challengeQuestionIndex].correctIndex
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300'
                          : selectedOptionIndex === idx
                          ? 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-white/60 border-slate-200 text-slate-400'
                        : selectedOptionIndex === idx
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-950 ring-4 ring-indigo-300 scale-102 shadow-md'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="mt-8 pt-6 border-t-2 border-indigo-200/80 flex flex-wrap items-center justify-between gap-4 relative z-10">
            {!isChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={
                  currentTask.type === 'order-tiles'
                    ? selectedOrderTiles.length === 0
                    : selectedOptionIndex === null
                }
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                  (currentTask.type === 'order-tiles'
                    ? selectedOrderTiles.length > 0
                    : selectedOptionIndex !== null)
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
                        {isCorrect ? 'Chính xác! Bé ghép tiếng rất chuẩn!' : 'Gợi ý từ Cô Đào:'}
                      </div>
                      <div>{currentTask.explanation}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => audioManager.speakFeedback(isCorrect, currentTask.explanation)}
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
                  {!isCorrect && (
                    <button
                      onClick={handleRetry}
                      className="px-5 py-3 rounded-2xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-sm border-2 border-amber-400 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Thử lại</span>
                    </button>
                  )}

                  <button
                    onClick={handleNextStep}
                    className="btn-3d-yellow px-6 py-3 rounded-2xl font-black text-sm text-slate-900 flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>
                      {currentTask.type === 'challenge-round' &&
                      challengeQuestionIndex + 1 < currentTask.challengePayload!.questions.length
                        ? 'Câu đố tiếp theo'
                        : currentStepIndex + 1 < totalSteps
                        ? 'Nhiệm vụ tiếp theo'
                        : 'Xem tổng kết chặng'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* End of Stage Summary Card */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-indigo-400 shadow-2xl text-center relative overflow-hidden">
          <div className="text-6xl mb-4 animate-bounce">🏙️✨</div>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-100 text-indigo-900 rounded-full text-sm font-black mb-3">
            <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            <span>HOÀN THÀNH CHẶNG 3: THÀNH PHỐ GHÉP TIẾNG</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-800">
            Bé Đã Làm Chủ Kỹ Năng Ghép Tiếng!
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-semibold max-w-lg mx-auto mt-2">
            Bé đã hoàn thành xuất sắc 5 nhiệm vụ: Ghép âm đầu + vần, Tìm thành phần còn thiếu, Xếp thẻ từ, Chọn tiếng theo tranh và Thử thách siêu tốc!
          </p>

          <div className="my-8 p-6 bg-indigo-50 border-3 border-indigo-300 rounded-3xl max-w-md mx-auto grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white rounded-2xl border border-indigo-200 shadow-xs">
              <Award className="w-10 h-10 text-indigo-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-500">Huy hiệu</div>
              <div className="text-sm font-black text-indigo-900">{stage.badgeAwarded}</div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-xs">
              <Star className="w-10 h-10 text-amber-400 fill-amber-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-500">Sao tích lũy</div>
              <div className="text-xl font-black text-amber-950">+{starsEarned} ⭐</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onBackToMap}
              className="px-6 py-3.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-sm cursor-pointer"
            >
              Về bản đồ hành trình
            </button>

            {onGoToNextStage && (
              <button
                onClick={() => onGoToNextStage(4)}
                className="btn-3d-green px-8 py-3.5 rounded-2xl text-white font-black text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Sang Chặng 4: Khu vườn từ ngữ</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
