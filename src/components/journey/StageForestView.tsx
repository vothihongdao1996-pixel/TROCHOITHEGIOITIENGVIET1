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
  Trees,
  Sparkles,
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

interface ForestTask {
  id: string;
  stepNumber: number;
  activityName: string;
  instruction: string;
  targetContent: string;
  speechText: string;
  options: { label: string; isCorrect: boolean }[];
  hint: string;
  explanation: string;
  visualTag: string;
  stars: number;
}

const FOREST_TASKS: ForestTask[] = [
  {
    id: 'task-2-1',
    stepNumber: 1,
    activityName: '1. Nhận diện âm/vần',
    instruction: 'Trên cây nấm có vần "an". Bé hãy tìm chiếc lá mang đúng vần "an" nhé!',
    targetContent: 'an',
    speechText: 'Bé hãy tìm chiếc lá có vần a nờ an',
    options: [
      { label: 'an', isCorrect: true },
      { label: 'am', isCorrect: false },
      { label: 'at', isCorrect: false },
      { label: 'ang', isCorrect: false },
    ],
    hint: 'Vần an gồm con chữ a đứng trước và con chữ n đứng sau!',
    explanation: 'Chính xác! Vần "an" gồm âm "a" ghép với âm "n" (a - n - an).',
    visualTag: '🍄 Cây nấm âm vần',
    stars: 1,
  },
  {
    id: 'task-2-2',
    stepNumber: 2,
    activityName: '2. Nghe âm chọn vần phù hợp',
    instruction: 'Bé bấm nút để nghe âm thanh bí mật của sóc nâu và chọn vần đúng:',
    targetContent: '🔊 /oi/',
    speechText: 'oi',
    options: [
      { label: 'ai', isCorrect: false },
      { label: 'oi', isCorrect: true },
      { label: 'ui', isCorrect: false },
      { label: 'ơi', isCorrect: false },
    ],
    hint: 'Âm thanh đọc là o - i - oi, giống như trong tiếng chú "voi"!',
    explanation: 'Tuyệt vời! Âm đọc là /oi/, được tạo bởi âm o đứng trước và âm i đứng sau.',
    visualTag: '🐿️ Sóc nâu phát âm',
    stars: 1,
  },
  {
    id: 'task-2-3',
    stepNumber: 3,
    activityName: '3. Phân biệt âm/vần gần nhau',
    instruction: 'Phân biệt vần: Trong từ "bát ngát", tiếng "bát" và tiếng "ngát" mang vần gì?',
    targetContent: 'bát ngát',
    speechText: 'Trong từ bát ngát, có vần an hay vần at?',
    options: [
      { label: 'vần an', isCorrect: false },
      { label: 'vần at', isCorrect: true },
      { label: 'vần ac', isCorrect: false },
      { label: 'vần ap', isCorrect: false },
    ],
    hint: 'b - at - bat - sắc - bát. Cuối vần là âm t con nhé!',
    explanation: 'Rất giỏi! Tiếng "bát" và "ngát" đều mang vần "at" (a - t - at). Vần "at" kết thúc bằng âm t, khác với vần "an" kết thúc bằng âm n.',
    visualTag: '🌿 Chiếc lá phân biệt',
    stars: 1,
  },
  {
    id: 'task-2-4',
    stepNumber: 4,
    activityName: '4. Chọn tiếng chứa vần mục tiêu',
    instruction: 'Tìm tiếng có chứa vần "ơn" trong các tiếng sau:',
    targetContent: 'Tìm vần: "ơn"',
    speechText: 'Tiếng nào dưới đây chứa vần ơn: sơn, chim, hoa, suối?',
    options: [
      { label: 'hoa', isCorrect: false },
      { label: 'chim', isCorrect: false },
      { label: 'sơn', isCorrect: true },
      { label: 'suối', isCorrect: false },
    ],
    hint: 'Tiếng "sơn" trong "núi non hùng vĩ" hay "màu sơn" có vần ơ - n - ơn!',
    explanation: 'Xuất sắc! Tiếng "sơn" gồm âm đầu s ghép với vần ơn (s - ơn - sơn).',
    visualTag: '🌲 Rừng cây từ ngữ',
    stars: 1,
  },
];

export const StageForestView: React.FC<Props> = ({
  stage,
  activeProfile,
  onBackToMap,
  onGoToNextStage,
  onProgressUpdated,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMascotSpeaking, setIsMascotSpeaking] = useState(false);
  const [isPlayingSecretSound, setIsPlayingSecretSound] = useState(false);
  const [secretSoundNotice, setSecretSoundNotice] = useState<string | null>(null);

  const currentTask = FOREST_TASKS[currentStepIndex];
  const totalSteps = FOREST_TASKS.length;

  const isAudioTask =
    !!currentTask &&
    (currentTask.targetContent.includes('🔊') ||
      currentTask.instruction.toLowerCase().includes('nghe âm thanh bí mật'));

  useEffect(() => {
    setIsPlayingSecretSound(false);
    setSecretSoundNotice(null);
    return () => {
      audioManager.stop();
    };
  }, [currentStepIndex]);

  const handlePlaySecretSound = () => {
    if (!currentTask) return;
    setIsPlayingSecretSound(true);
    setSecretSoundNotice(null);
    setIsSpeaking(false);
    setIsMascotSpeaking(false);

    audioManager.speakSecretSound(currentTask.speechText, {
      phonemeHint: currentTask.targetContent,
      onEnd: () => setIsPlayingSecretSound(false),
      onError: (msg) => {
        setIsPlayingSecretSound(false);
        setSecretSoundNotice(msg);
      },
      onNoVietnameseVoice: () => {
        setSecretSoundNotice(
          'Thiết bị chưa có gói giọng đọc tiếng Việt (vi-VN). Hãy bật gói tiếng Việt trên trình duyệt hoặc xem chữ mẫu!'
        );
      },
    });
  };

  const handleSpeakInstruction = () => {
    if (!currentTask) return;
    if (isAudioTask) {
      handlePlaySecretSound();
      return;
    }
    setIsSpeaking(true);
    setIsMascotSpeaking(false);
    setIsPlayingSecretSound(false);
    audioManager.speak(currentTask.speechText, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleMascotHint = () => {
    if (!currentTask) return;
    setIsMascotSpeaking(true);
    setIsSpeaking(false);
    setIsPlayingSecretSound(false);
    audioManager.speakOngVang(currentTask.hint, () => {
      setIsMascotSpeaking(false);
    });
  };

  const handleSelectOption = (idx: number) => {
    if (isChecked) return;
    setSelectedOptionIndex(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOptionIndex === null || isChecked) return;
    const selected = currentTask.options[selectedOptionIndex];
    const correct = selected.isCorrect;

    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      audioManager.playSoundEffect('correct');
      setStarsEarned((prev) => prev + currentTask.stars);
      setCorrectCount((prev) => prev + 1);
      audioManager.speakOngVang('Hoan hô bé! Bé đã chọn rất chính xác!');

      // Save task to storage
      storageService.completeJourneyTask(
        activeProfile.id,
        stage.stageNumber,
        currentTask.id,
        currentTask.stars,
        totalSteps
      );
      onProgressUpdated();
    } else {
      audioManager.playSoundEffect('wrong');
      audioManager.speakOngVang('Chưa đúng rồi bé ơi! Bé hãy nghe lại gợi ý và thử lại nhé!');
    }
  };

  const handleNextStep = () => {
    audioManager.stop();
    setIsSpeaking(false);
    setIsMascotSpeaking(false);

    if (currentStepIndex + 1 < totalSteps) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      audioManager.playSoundEffect('badge');
      audioManager.speakOngVang(
        `Chúc mừng bé ${activeProfile.name}! Bé đã xuất sắc mở đường qua Khu Rừng Âm Và Vần!`
      );
    }
  };

  const handleRetryStep = () => {
    setSelectedOptionIndex(null);
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 border-2 border-emerald-300 shadow-sm">
        <button
          onClick={onBackToMap}
          className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-800 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-black">
            <Trees className="w-4 h-4 text-emerald-700" />
            <span>Chặng 2: Khu Rừng Âm Và Vần</span>
          </div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">
            Hoạt động {currentStepIndex + 1} / {totalSteps}: {currentTask.activityName}
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 font-black text-xs sm:text-sm">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>+{starsEarned} sao</span>
        </div>
      </div>

      {/* Progress Path */}
      <div className="w-full bg-emerald-100 h-3 rounded-full overflow-hidden mb-6 border border-emerald-300">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {!isFinished ? (
        <div className="relative bg-gradient-to-b from-emerald-50 via-teal-50/60 to-amber-50/60 rounded-3xl p-6 sm:p-8 border-4 border-emerald-400 shadow-xl overflow-hidden">
          {/* Animated Forest Props */}
          <div className="absolute top-2 right-4 text-3xl opacity-30 select-none">🌲</div>
          <div className="absolute bottom-3 left-4 text-3xl opacity-30 select-none">🍄</div>
          <div className="absolute top-12 left-4 text-2xl opacity-30 select-none">🦋</div>

          {/* Guide Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 relative z-10">
            <div className="bg-white/90 border-2 border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <MascotTeacher className="w-11 h-11 shrink-0" />
                <div>
                  <div className="text-xs font-black text-emerald-900">🌸 Cô Đào giảng bài</div>
                  <div className="text-xs text-slate-600 font-semibold line-clamp-1">
                    {currentTask.instruction}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSpeakInstruction}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 border transition-all cursor-pointer shrink-0 ${
                  isSpeaking
                    ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
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

          {(isSpeaking || isMascotSpeaking || isPlayingSecretSound) && (
            <div className="flex justify-end mb-3">
              <button
                onClick={() => {
                  audioManager.stop();
                  setIsSpeaking(false);
                  setIsMascotSpeaking(false);
                  setIsPlayingSecretSound(false);
                }}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Dừng giọng đọc</span>
              </button>
            </div>
          )}

          {/* Central Question Display */}
          <div className="text-center my-6 relative z-10">
            <div className="inline-block px-3 py-1 bg-emerald-200 text-emerald-900 rounded-full text-xs font-black mb-2">
              {currentTask.visualTag}
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-800">
              {currentTask.instruction}
            </h3>

            {/* Check if this is an audio listening question */}
            {isAudioTask ? (
              <div className="mt-5 flex flex-col items-center">
                <button
                  type="button"
                  onClick={handlePlaySecretSound}
                  className={`btn-3d-yellow px-8 py-5 sm:px-10 sm:py-6 rounded-3xl font-black text-xl sm:text-2xl text-slate-900 flex items-center justify-center gap-3.5 shadow-xl transition-all cursor-pointer select-none active:scale-95 ${
                    isPlayingSecretSound
                      ? 'ring-4 ring-amber-400 animate-pulse bg-amber-300'
                      : 'hover:brightness-105 animate-gentle-pulse'
                  }`}
                  title="Bấm để nghe âm thanh bí mật (Bé có thể bấm nhiều lần)"
                >
                  <Volume2
                    className={`w-8 h-8 sm:w-10 sm:h-10 text-emerald-800 ${
                      isPlayingSecretSound ? 'animate-bounce text-rose-600' : 'text-amber-950'
                    }`}
                  />
                  <span>
                    {isPlayingSecretSound
                      ? 'Sóc nâu đang phát âm...'
                      : 'Bấm nút để nghe âm bí mật 🔊'}
                  </span>
                </button>

                <div className="mt-2.5 text-xs sm:text-sm font-bold text-slate-500 flex items-center gap-1.5">
                  <span>🐿️ Bé hãy bấm vào nút loa ở trên để nghe âm thanh bí mật của sóc nâu (bấm lại được nhiều lần)</span>
                </div>

                {secretSoundNotice && (
                  <div className="mt-3 p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs sm:text-sm text-amber-900 font-bold max-w-md">
                    {secretSoundNotice}
                  </div>
                )}
              </div>
            ) : (
              /* Visual Board */
              <div className="mt-5 p-6 sm:p-8 bg-white/95 rounded-3xl border-4 border-emerald-300 inline-block min-w-[280px] shadow-md">
                <div className="text-4xl sm:text-6xl font-black text-emerald-700 tracking-wider">
                  {currentTask.targetContent}
                </div>
              </div>
            )}
          </div>

          {/* 4 Interactive Option Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6 relative z-10">
            {currentTask.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;
              let cardStyle = 'bg-white border-slate-300 text-slate-800 hover:border-emerald-400 hover:bg-emerald-50';

              if (isChecked) {
                if (opt.isCorrect) {
                  cardStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300 scale-102';
                } else if (isSelected) {
                  cardStyle = 'bg-rose-100 border-rose-400 text-rose-900';
                } else {
                  cardStyle = 'bg-white/60 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                cardStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300 scale-102 shadow-md';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isChecked}
                  className={`p-5 rounded-2xl border-4 font-black text-2xl sm:text-3xl text-center transition-all cursor-pointer shadow-sm relative ${cardStyle}`}
                >
                  <span className="w-7 h-7 rounded-lg bg-emerald-200/60 text-emerald-900 font-extrabold text-xs flex items-center justify-center absolute top-2 left-2">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="inline-block pt-2">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="mt-8 pt-6 border-t-2 border-emerald-200/80 flex flex-wrap items-center justify-between gap-4 relative z-10">
            {!isChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOptionIndex === null}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                  selectedOptionIndex !== null
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
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3 w-full sm:w-auto flex-1 ${
                    isCorrect
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                      : 'bg-amber-100 border-amber-400 text-amber-950'
                  }`}
                >
                  <div className="text-3xl">{isCorrect ? '🎉' : '💡'}</div>
                  <div className="text-xs sm:text-sm font-semibold">
                    <div className="font-black text-sm">
                      {isCorrect ? 'Chính xác! Bé mở được một lối đi!' : 'Gợi ý từ Cô Đào:'}
                    </div>
                    <div>{currentTask.explanation}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isCorrect && (
                    <button
                      onClick={handleRetryStep}
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
                      {currentStepIndex + 1 < totalSteps ? 'Hoạt động tiếp theo' : 'Xem tổng kết chặng'}
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
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-emerald-400 shadow-2xl text-center relative overflow-hidden">
          <div className="text-6xl mb-4 animate-bounce">🌲✨</div>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 text-emerald-900 rounded-full text-sm font-black mb-3">
            <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>HOÀN THÀNH CHẶNG 2: KHU RỪNG ÂM VÀ VẦN</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-800">
            Bé Đã Vượt Qua Khu Rừng Âm Vần!
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-semibold max-w-lg mx-auto mt-2">
            Bé đã hoàn thành xuất sắc cả 4 hoạt động: Nhận diện âm vần, Nghe âm chọn vần, Phân biệt vần và Tìm tiếng mục tiêu!
          </p>

          <div className="my-8 p-6 bg-emerald-50 border-3 border-emerald-300 rounded-3xl max-w-md mx-auto grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-xs">
              <Award className="w-10 h-10 text-emerald-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-500">Huy hiệu</div>
              <div className="text-sm font-black text-emerald-900">{stage.badgeAwarded}</div>
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
                onClick={() => onGoToNextStage(3)}
                className="btn-3d-green px-8 py-3.5 rounded-2xl text-white font-black text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Sang Chặng 3: Thành phố ghép tiếng</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
