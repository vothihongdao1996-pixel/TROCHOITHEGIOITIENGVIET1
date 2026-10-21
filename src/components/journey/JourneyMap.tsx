import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Award,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
  Star,
  Info,
  ShieldCheck,
  Home,
  Compass,
} from 'lucide-react';
import { JOURNEY_STAGES } from '../../data/journeyData';
import { JourneyStage, StudentProfile, StudentJourneyProgress } from '../../types';
import { MascotBee, MascotTeacher } from '../illustrations/VectorIllustrations';
import { storageService } from '../../services/storageService';
import { JourneyStagePlayer } from './JourneyStagePlayer';
import { audioManager } from '../../services/audioManager';

interface Props {
  activeProfile: StudentProfile;
  onGoHome: () => void;
  onGoToArena?: () => void;
  onProfileUpdated: () => void;
}

export const JourneyMap: React.FC<Props> = ({
  activeProfile,
  onGoHome,
  onGoToArena,
  onProfileUpdated,
}) => {
  const [progress, setProgress] = useState<StudentJourneyProgress>(() =>
    storageService.getJourneyProgress(activeProfile.id)
  );
  const [activeStage, setActiveStage] = useState<JourneyStage | null>(null);
  const [selectedStageForModal, setSelectedStageForModal] = useState<JourneyStage | null>(null);

  // Sync progress when active student changes
  useEffect(() => {
    setProgress(storageService.getJourneyProgress(activeProfile.id));
  }, [activeProfile.id]);

  const refreshProgress = () => {
    const updated = storageService.getJourneyProgress(activeProfile.id);
    setProgress(updated);
    onProfileUpdated();
  };

  const handleToggleTeacherUnlock = () => {
    const nextState = !progress.isTeacherUnlockedAll;
    storageService.toggleTeacherUnlockAll(activeProfile.id, nextState);
    refreshProgress();
    audioManager.playSoundEffect('correct');
  };

  // Find the highest unlocked stage that is still in progress (or last unlocked)
  const getContinueStageNumber = (): number => {
    for (const stage of JOURNEY_STAGES) {
      const isUnlocked = progress.unlockedStageNumbers.includes(stage.stageNumber) || progress.isTeacherUnlockedAll;
      const tasksDone = progress.completedTaskIds.filter((id) => id.startsWith(`task-${stage.stageNumber}-`)).length;
      if (isUnlocked && tasksDone < stage.tasks.length) {
        return stage.stageNumber;
      }
    }
    return 1;
  };

  const handleStartDiscovery = () => {
    const stage1 = JOURNEY_STAGES[0];
    setActiveStage(stage1);
  };

  const handleContinueJourney = () => {
    const continueNum = getContinueStageNumber();
    const targetStage = JOURNEY_STAGES.find((s) => s.stageNumber === continueNum) || JOURNEY_STAGES[0];
    setActiveStage(targetStage);
  };

  const handleSelectStageToPlay = (stage: JourneyStage) => {
    const isUnlocked = progress.unlockedStageNumbers.includes(stage.stageNumber) || progress.isTeacherUnlockedAll;
    if (isUnlocked) {
      setActiveStage(stage);
      setSelectedStageForModal(null);
    }
  };

  // If a stage is currently being played, render the JourneyStagePlayer
  if (activeStage) {
    return (
      <JourneyStagePlayer
        stage={activeStage}
        activeProfile={activeProfile}
        onBackToMap={() => {
          setActiveStage(null);
          refreshProgress();
        }}
        onGoToNextStage={(nextNum) => {
          const next = JOURNEY_STAGES.find((s) => s.stageNumber === nextNum);
          if (next) {
            setActiveStage(next);
            refreshProgress();
          } else {
            setActiveStage(null);
            refreshProgress();
          }
        }}
        onGoToArena={() => {
          setActiveStage(null);
          if (onGoToArena) onGoToArena();
        }}
        onProgressUpdated={refreshProgress}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Navigation & Action Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 border-3 border-emerald-300 shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
            🗺️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Hành Trình Khám Phá Tiếng Việt
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">
              Học sinh: <span className="text-emerald-700 font-extrabold">{activeProfile.name}</span> • Đã mở {progress.isTeacherUnlockedAll ? '6/6' : `${progress.unlockedStageNumbers.length}/6`} chặng
            </p>
          </div>
        </div>

        {/* 4 Main Action Buttons Required by User Prompt */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={handleStartDiscovery}
            className="btn-3d-green px-4 py-2 rounded-xl text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Bắt đầu khám phá</span>
          </button>

          <button
            onClick={handleContinueJourney}
            className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-900 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Tiếp tục hành trình</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('journey-stages-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 font-bold text-xs sm:text-sm cursor-pointer"
          >
            Chọn chặng
          </button>

          <button
            onClick={onGoHome}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Về trang chủ</span>
          </button>
        </div>
      </div>

      {/* Teacher Mode Control & Local Storage Limit Notification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Teacher Unlock Mode Toggle */}
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              {progress.isTeacherUnlockedAll ? (
                <Unlock className="w-5 h-5 text-emerald-700" />
              ) : (
                <Lock className="w-5 h-5 text-amber-700" />
              )}
            </div>
            <div>
              <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span>Chế độ Giáo viên: Mở khóa tất cả chặng</span>
                {progress.isTeacherUnlockedAll && (
                  <span className="bg-emerald-200 text-emerald-900 text-[10px] px-2 py-0.2 rounded-full font-black">
                    ĐANG BẬT
                  </span>
                )}
              </div>
              <div className="text-xs text-amber-800">
                Cho phép giáo viên tự do chọn bất kỳ chặng nào để giảng dạy trên lớp
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleTeacherUnlock}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer shrink-0 ${
              progress.isTeacherUnlockedAll
                ? 'bg-rose-500 text-white border-rose-600 hover:bg-rose-600'
                : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
            }`}
          >
            {progress.isTeacherUnlockedAll ? 'Khóa lại' : 'Mở khóa tất cả'}
          </button>
        </div>

        {/* Local Storage Notice (Required by user request) */}
        <div className="bg-sky-50/90 border-2 border-sky-300 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <ShieldCheck className="w-9 h-9 text-sky-600 shrink-0" />
          <div className="text-xs text-sky-900">
            <span className="font-black">Lưu trữ cục bộ an toàn: </span>
            Tiến độ hành trình được lưu an toàn trực tiếp trên trình duyệt của máy bạn. Dữ liệu không đồng bộ qua mạng internet nhằm bảo mật tối đa quyền riêng tư của học sinh.
          </div>
        </div>
      </div>

      {/* 3D Animated Adventure Map Island Visual */}
      <div className="relative bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 rounded-3xl p-6 sm:p-10 border-4 border-emerald-400 shadow-xl overflow-hidden mb-10">
        {/* Clouds and atmospheric elements */}
        <div className="absolute top-4 left-8 text-4xl opacity-50 select-none animate-pulse">☁️</div>
        <div className="absolute top-12 right-12 text-3xl opacity-50 select-none animate-pulse">☁️</div>
        <div className="absolute bottom-6 left-12 text-3xl opacity-40 select-none">🌿</div>
        <div className="absolute bottom-4 right-16 text-3xl opacity-40 select-none">🌸</div>

        {/* Character Welcoming Header */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left mb-10 relative z-10">
          <div className="flex items-center gap-2">
            <MascotTeacher className="w-16 h-16 shrink-0 drop-shadow-md" />
            <MascotBee className="w-16 h-16 shrink-0 animate-float drop-shadow-md" />
          </div>
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 border border-emerald-300 rounded-full text-xs font-black text-emerald-800 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Chuyến du hành 6 Vùng Đất Diệu Kỳ</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              Cùng Cô Đào & Ong Vàng Chinh Phục Từng Chặng!
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
              Bé hãy hoàn thành các nhiệm vụ của từng chặng để nhận sao vàng ⭐ và mở khóa chặng tiếp theo nhé!
            </p>
          </div>
        </div>

        {/* 6 Stages Grid (Arranged as sequential adventure milestones) */}
        <div id="journey-stages-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {JOURNEY_STAGES.map((stage) => {
            const isUnlocked = progress.unlockedStageNumbers.includes(stage.stageNumber) || progress.isTeacherUnlockedAll;
            const completedInThisStage = progress.completedTaskIds.filter((id) =>
              id.startsWith(`task-${stage.stageNumber}-`)
            ).length;
            const totalTasks = stage.tasks.length;
            const isCompleted = completedInThisStage >= totalTasks;
            const starsForStage = progress.stageStars[stage.stageNumber] || 0;

            return (
              <div
                key={stage.id}
                className={`rounded-3xl p-6 border-4 flex flex-col justify-between transition-all relative ${
                  isCompleted
                    ? 'bg-white border-emerald-400 shadow-md ring-2 ring-emerald-200'
                    : isUnlocked
                    ? 'bg-white border-amber-400 shadow-lg hover:scale-102 ring-2 ring-amber-200'
                    : 'bg-slate-100/90 border-slate-300 opacity-75'
                }`}
              >
                {/* Top Badge: Number and Status Icon */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-9 h-9 rounded-2xl font-black text-sm flex items-center justify-center shadow-xs ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isUnlocked
                          ? 'bg-amber-400 text-slate-900'
                          : 'bg-slate-300 text-slate-600'
                      }`}>
                        #{stage.stageNumber}
                      </span>
                      <span className="text-2xl">{stage.icon}</span>
                    </div>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-1 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>HOÀN THÀNH</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-black text-xs px-2.5 py-1 rounded-xl">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>SẴN SÀNG</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-600 font-bold text-xs px-2.5 py-1 rounded-xl">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>ĐÃ KHÓA</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg sm:text-xl font-black text-slate-800">
                    {stage.fullName}
                  </h4>

                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                    {stage.subtitle}
                  </p>

                  {/* Progress Indicator */}
                  <div className="mt-4 pt-3 border-t border-slate-200/80">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>Nhiệm vụ: {completedInThisStage} / {totalTasks}</span>
                      <span className="text-amber-700 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {starsForStage} sao
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${(completedInThisStage / totalTasks) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Reward Badge Preview */}
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">Huy hiệu: <strong className="text-slate-800">{stage.badgeAwarded}</strong></span>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedStageForModal(stage)}
                    className="text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Chi tiết</span>
                  </button>

                  {isUnlocked ? (
                    <button
                      onClick={() => handleSelectStageToPlay(stage)}
                      className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-900 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-sm hover:brightness-105 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCompleted ? 'Chơi lại' : 'Vào chặng'}</span>
                    </button>
                  ) : (
                    <div className="text-xs font-bold text-slate-400 italic flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Cần hoàn thành chặng {stage.stageNumber - 1}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Detail Modal */}
      {selectedStageForModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-4 border-amber-300 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-amber-100 rounded-2xl">{selectedStageForModal.icon}</span>
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    {selectedStageForModal.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    Huy hiệu: {selectedStageForModal.badgeAwarded}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStageForModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-4">
              {selectedStageForModal.description}
            </p>

            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3.5 mb-5 text-xs text-emerald-950 font-semibold">
              <div className="font-black text-emerald-900 mb-1">👩‍🏫 Lưu ý sư phạm của giáo viên:</div>
              <div>{selectedStageForModal.teacherGuide}</div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="text-xs font-black text-slate-700">Danh sách nhiệm vụ trong chặng:</div>
              {selectedStageForModal.tasks.map((task, idx) => {
                const isTaskDone = progress.completedTaskIds.includes(task.id);
                return (
                  <div
                    key={task.id}
                    className="p-2.5 rounded-xl border flex items-center justify-between text-xs bg-slate-50 border-slate-200"
                  >
                    <span className="font-extrabold text-slate-700">
                      Nhiệm vụ {idx + 1}: {task.title.replace(/^Nhiệm vụ \d+:\s*/, '')}
                    </span>
                    {isTaskDone ? (
                      <span className="text-emerald-700 font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Đã xong
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold">Chưa làm</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-100">
              <button
                onClick={() => setSelectedStageForModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Đóng
              </button>

              {(progress.unlockedStageNumbers.includes(selectedStageForModal.stageNumber) || progress.isTeacherUnlockedAll) && (
                <button
                  onClick={() => handleSelectStageToPlay(selectedStageForModal)}
                  className="btn-3d-green px-5 py-2.5 rounded-xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Bắt đầu chặng ngay</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
