import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Sparkles,
  Volume2,
  Volume1,
  Square,
  CheckCircle2,
  Award,
  ChevronRight,
  RotateCcw,
  Star,
  Trophy,
} from 'lucide-react';
import { JourneyStage, JourneyTask, StudentProfile } from '../../types';
import { MascotBee, MascotTeacher } from '../illustrations/VectorIllustrations';
import { audioManager } from '../../services/audioManager';
import { storageService } from '../../services/storageService';
import { StageForestView } from './StageForestView';
import { StageCityView } from './StageCityView';
import { StageGardenView } from './StageGardenView';
import { StageRoadView } from './StageRoadView';
import { StageIslandView } from './StageIslandView';

interface Props {
  stage: JourneyStage;
  activeProfile: StudentProfile;
  onBackToMap: () => void;
  onGoToNextStage?: (nextStageNumber: number) => void;
  onGoToArena?: () => void;
  onProgressUpdated: () => void;
}

export const JourneyStagePlayer: React.FC<Props> = ({
  stage,
  activeProfile,
  onBackToMap,
  onGoToNextStage,
  onGoToArena,
  onProgressUpdated,
}) => {
  // Dedicated interactive views for Stages 2, 3, 4, 5, 6
  if (stage.stageNumber === 2) {
    return (
      <StageForestView
        stage={stage}
        activeProfile={activeProfile}
        onBackToMap={onBackToMap}
        onGoToNextStage={onGoToNextStage}
        onProgressUpdated={onProgressUpdated}
      />
    );
  }

  if (stage.stageNumber === 3) {
    return (
      <StageCityView
        stage={stage}
        activeProfile={activeProfile}
        onBackToMap={onBackToMap}
        onGoToNextStage={onGoToNextStage}
        onProgressUpdated={onProgressUpdated}
      />
    );
  }

  if (stage.stageNumber === 4) {
    return (
      <StageGardenView
        stage={stage}
        activeProfile={activeProfile}
        onBackToMap={onBackToMap}
        onGoToNextStage={onGoToNextStage}
        onProgressUpdated={onProgressUpdated}
      />
    );
  }

  if (stage.stageNumber === 5) {
    return (
      <StageRoadView
        stage={stage}
        activeProfile={activeProfile}
        onBackToMap={onBackToMap}
        onGoToNextStage={onGoToNextStage}
        onProgressUpdated={onProgressUpdated}
      />
    );
  }

  if (stage.stageNumber === 6) {
    return (
      <StageIslandView
        stage={stage}
        activeProfile={activeProfile}
        onBackToMap={onBackToMap}
        onGoToArena={onGoToArena}
        onProgressUpdated={onProgressUpdated}
      />
    );
  }

  // --- STAGE 1: VƯƠNG QUỐC CHỮ CÁI (GIỮ NGUYÊN HOÀN TOÀN) ---
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [taskStarsEarned, setTaskStarsEarned] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMascotSpeaking, setIsMascotSpeaking] = useState(false);
  const [isPlayingSecretSound, setIsPlayingSecretSound] = useState(false);
  const [secretSoundNotice, setSecretSoundNotice] = useState<string | null>(null);
  const [isStageFinished, setIsStageFinished] = useState(false);

  const currentTask: JourneyTask = stage.tasks[currentTaskIndex];
  const totalTasks = stage.tasks.length;

  const isAudioListeningTask =
    !!currentTask &&
    (currentTask.promptContent.includes('🔊') ||
      currentTask.promptContent.toLowerCase().includes('nghe') ||
      currentTask.instruction.toLowerCase().includes('lắng nghe'));

  useEffect(() => {
    setIsPlayingSecretSound(false);
    setSecretSoundNotice(null);
    return () => {
      audioManager.stop();
    };
  }, [currentTaskIndex]);

  const handlePlaySecretSound = () => {
    if (!currentTask) return;
    setIsPlayingSecretSound(true);
    setSecretSoundNotice(null);
    setIsSpeaking(false);
    setIsMascotSpeaking(false);

    audioManager.speakSecretSound(currentTask.speechText, {
      phonemeHint: currentTask.subPrompt || currentTask.promptContent,
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

  const handleSpeakTask = () => {
    if (!currentTask) return;
    if (isAudioListeningTask) {
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

  const handleMascotSpeak = () => {
    if (!currentTask) return;
    setIsMascotSpeaking(true);
    setIsSpeaking(false);
    setIsPlayingSecretSound(false);
    audioManager.speakOngVang(currentTask.mascotHint, () => {
      setIsMascotSpeaking(false);
    });
  };

  const handleStopAudio = () => {
    audioManager.stop();
    setIsSpeaking(false);
    setIsMascotSpeaking(false);
    setIsPlayingSecretSound(false);
  };

  const handleSelectOption = (index: number) => {
    if (isChecked) return; // Prevent changing after checked
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (isChecked || selectedOption === null) return;

    const correct = selectedOption === currentTask.correctAnswerIndex;
    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      audioManager.playSoundEffect('correct');
      setTaskStarsEarned((prev) => prev + currentTask.rewardStars);
      audioManager.speakFeedback(true, currentTask.explanation);

      // Save task progress
      storageService.completeJourneyTask(
        activeProfile.id,
        stage.stageNumber,
        currentTask.id,
        currentTask.rewardStars,
        totalTasks
      );
      onProgressUpdated();
    } else {
      audioManager.playSoundEffect('wrong');
      audioManager.speakFeedback(false, currentTask.explanation);
    }
  };

  const handleNextTask = () => {
    audioManager.stop();
    setIsSpeaking(false);
    setIsMascotSpeaking(false);

    if (currentTaskIndex + 1 < totalTasks) {
      setCurrentTaskIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      // Stage completed!
      setIsStageFinished(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      audioManager.playSoundEffect('badge');
      audioManager.speakOngVang(
        `Chúc mừng bé ${activeProfile.name}! Bé đã xuất sắc vượt qua ${stage.name} và nhận được Huy hiệu ${stage.badgeAwarded}!`
      );
    }
  };

  const handleRetryTask = () => {
    audioManager.stop();
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 border-2 border-emerald-300 shadow-sm">
        <button
          onClick={onBackToMap}
          className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-800 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ Hành Trình</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black">
            <span>{stage.icon}</span>
            <span>Chặng {stage.stageNumber}: {stage.name}</span>
          </div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">
            Nhiệm vụ {currentTaskIndex + 1} / {totalTasks}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 font-black text-xs sm:text-sm">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>+{taskStarsEarned} sao</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentTaskIndex + 1) / totalTasks) * 100}%` }}
        />
      </div>

      {/* Main Task Stage Card */}
      {!isStageFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-lg relative">
          {/* Dual Mascot Voice Guidance Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {/* Cô Đào Guidance */}
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <MascotTeacher className="w-11 h-11 shrink-0" />
                <div>
                  <div className="text-xs font-black text-rose-900">🌸 Cô Đào hướng dẫn</div>
                  <div className="text-xs text-rose-700 font-semibold line-clamp-1">
                    {currentTask.instruction}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSpeakTask}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 border transition-all cursor-pointer shrink-0 ${
                  isSpeaking
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-rose-200 hover:bg-rose-300 text-rose-900 border-rose-300'
                }`}
              >
                <Volume1 className="w-4 h-4" />
                <span>Nghe cô đọc</span>
              </button>
            </div>

            {/* Ong Vàng Gợi ý */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <MascotBee className="w-11 h-11 shrink-0 animate-float" />
                <div>
                  <div className="text-xs font-black text-amber-900">🐝 Ong Vàng mách nhỏ</div>
                  <div className="text-xs text-amber-800 italic line-clamp-1">
                    "{currentTask.mascotHint}"
                  </div>
                </div>
              </div>
              <button
                onClick={handleMascotSpeak}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 border transition-all cursor-pointer shrink-0 ${
                  isMascotSpeaking
                    ? 'bg-amber-400 text-amber-950 border-amber-500 animate-pulse'
                    : 'bg-amber-200 hover:bg-amber-300 text-amber-900 border-amber-300'
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
                onClick={handleStopAudio}
                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Dừng âm</span>
              </button>
            </div>
          )}

          {/* Task Question Banner */}
          <div className="text-center my-6">
            <h3 className="text-lg sm:text-xl font-black text-slate-800">
              {currentTask.instruction}
            </h3>

            {/* Check if this is an audio listening question like Task 1-2 ("🔊 Bấm nút để nghe âm bí mật") */}
            {isAudioListeningTask ? (
              <div className="mt-4 flex flex-col items-center">
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
                      ? 'Đang phát âm bí mật...'
                      : 'Bấm nút để nghe âm bí mật 🔊'}
                  </span>
                </button>

                <div className="mt-2.5 text-xs sm:text-sm font-bold text-slate-500 flex items-center gap-1.5">
                  <span>🎧 Bé hãy bấm vào nút loa ở trên để nghe âm thanh bí mật (bấm lại được nhiều lần)</span>
                </div>

                {secretSoundNotice && (
                  <div className="mt-3 p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs sm:text-sm text-amber-900 font-bold max-w-md">
                    {secretSoundNotice}
                  </div>
                )}
              </div>
            ) : (
              /* Big Prominent Prompt Box */
              <div className="mt-4 p-6 sm:p-8 bg-gradient-to-b from-sky-50 to-emerald-50 rounded-3xl border-3 border-sky-300 inline-block min-w-[260px] max-w-full shadow-inner">
                <div className="text-3xl sm:text-5xl font-black text-sky-800 tracking-wider">
                  {currentTask.promptContent}
                </div>
                {currentTask.subPrompt && (
                  <div className="text-xs sm:text-sm font-extrabold text-sky-600 mt-2">
                    {currentTask.subPrompt}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Multiple Choice Options (Huge 3D Buttons for Grade 1 Students) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {currentTask.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-amber-50 hover:border-amber-400';

              if (isChecked) {
                if (idx === currentTask.correctAnswerIndex) {
                  btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-4 ring-emerald-300 shadow-md scale-102';
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

          {/* Check / Next / Retry Actions */}
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
                <span>Kiểm tra kết quả</span>
              </button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 w-full sm:w-auto flex-1 ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    : 'bg-amber-50 border-amber-400 text-amber-900'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{isCorrect ? '🎉' : '💡'}</div>
                    <div className="text-xs sm:text-sm font-semibold">
                      <div className="font-black text-sm">
                        {isCorrect ? 'Chính xác! Bé giỏi quá!' : 'Gợi ý từ cô giáo:'}
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
                      onClick={handleRetryTask}
                      className="px-5 py-3 rounded-2xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-sm border-2 border-amber-400 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Thử lại</span>
                    </button>
                  )}

                  <button
                    onClick={handleNextTask}
                    className="btn-3d-yellow px-6 py-3 rounded-2xl font-black text-sm text-slate-900 flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>{currentTaskIndex + 1 < totalTasks ? 'Nhiệm vụ tiếp theo' : 'Hoàn thành chặng'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Stage Victory Celebration Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-amber-400 shadow-2xl text-center relative overflow-hidden">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-100 text-amber-900 rounded-full text-sm font-black mb-3">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>XUẤT SẮC CHINH PHỤC CHẶNG {stage.stageNumber}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-800">
            Bé Đã Vượt Qua {stage.name}!
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-semibold max-w-lg mx-auto mt-2">
            Cô Đào và bạn Ong Vàng rất tự hào về tinh thần học tập chăm chỉ và tiến bộ vượt bậc của bé!
          </p>

          <div className="my-8 p-6 bg-amber-50 border-3 border-amber-300 rounded-3xl max-w-md mx-auto flex items-center justify-around">
            <div className="text-center">
              <Award className="w-12 h-12 text-amber-500 mx-auto mb-1" />
              <div className="text-xs font-bold text-amber-800">Huy hiệu đạt được</div>
              <div className="text-base font-black text-amber-950">{stage.badgeAwarded}</div>
            </div>

            <div className="h-12 w-0.5 bg-amber-200" />

            <div className="text-center">
              <Star className="w-12 h-12 text-amber-400 fill-amber-400 mx-auto mb-1 animate-spin" />
              <div className="text-xs font-bold text-amber-800">Sao thưởng tích lũy</div>
              <div className="text-xl font-black text-amber-950">+{stage.rewardStars} ⭐</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onBackToMap}
              className="px-6 py-3.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-sm cursor-pointer"
            >
              Trở về bản đồ hành trình
            </button>

            {stage.stageNumber < 6 && onGoToNextStage && (
              <button
                onClick={() => onGoToNextStage(stage.stageNumber + 1)}
                className="btn-3d-green px-8 py-3.5 rounded-2xl text-white font-black text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Khám phá chặng tiếp theo</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {stage.stageNumber === 6 && onGoToArena && (
              <button
                onClick={onGoToArena}
                className="btn-3d-yellow px-8 py-3.5 rounded-2xl text-slate-900 font-black text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Trophy className="w-5 h-5 text-amber-700" />
                <span>Tiến vào Đấu trường Tiếng Việt 🏆</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
