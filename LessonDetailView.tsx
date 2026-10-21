import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Volume2,
  Square,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  HelpCircle,
  Play,
  ChevronRight,
  ChevronLeft,
  Star,
  BookOpen,
  Eye,
  Smile,
  Maximize2,
  Minimize2,
  Tv,
} from 'lucide-react';
import { LessonTopic, LessonStepKey, StudentProfile } from '../../types';
import { audioManager } from '../../services/audioManager';
import { storageService } from '../../services/storageService';
import { MascotBee, MascotTeacher } from '../illustrations/VectorIllustrations';

interface Props {
  lesson: LessonTopic;
  activeProfile: StudentProfile;
  onBack: () => void;
  onPlayGame: (gameId: number) => void;
  onProfileUpdated: () => void;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
}

const STEP_TABS: Array<{ key: LessonStepKey; number: number; label: string; icon: string }> = [
  { key: 'intro', number: 1, label: 'Khởi động', icon: '🌱' },
  { key: 'recognize', number: 2, label: 'Nhận biết', icon: '👀' },
  { key: 'pronounce', number: 3, label: 'Luyện đọc', icon: '🎧' },
  { key: 'interactive', number: 4, label: 'Tương tác', icon: '✨' },
  { key: 'game', number: 5, label: 'Trò chơi', icon: '🎮' },
  { key: 'practice', number: 6, label: 'Luyện tập', icon: '📝' },
  { key: 'reward', number: 7, label: 'Phần thưởng', icon: '🏆' },
];

export const LessonDetailView: React.FC<Props> = ({
  lesson,
  activeProfile,
  onBack,
  onPlayGame,
  onProfileUpdated,
  isPresentationMode = false,
  onTogglePresentationMode,
}) => {
  const [currentStep, setCurrentStep] = useState<LessonStepKey>('intro');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Step 4: Interactive state
  const [selectedInteractiveIndices, setSelectedInteractiveIndices] = useState<number[]>([]);
  const [interactiveChecked, setInteractiveChecked] = useState(false);

  // Step 6: Practice questions state
  const [practiceQuestionIndex, setPracticeQuestionIndex] = useState(0);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [isPracticeChecked, setIsPracticeChecked] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);

  // Step 7: Reward state
  const [rewardClaimed, setRewardClaimed] = useState(false);

  useEffect(() => {
    return () => {
      audioManager.stop();
    };
  }, [currentStep, practiceQuestionIndex]);

  const handleSpeak = (text: string) => {
    setIsSpeaking(true);
    audioManager.speak(text, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleStopSpeech = () => {
    audioManager.stop();
    setIsSpeaking(false);
  };

  // Step Navigation
  const stepIndex = STEP_TABS.findIndex((s) => s.key === currentStep);
  const canGoPrev = stepIndex > 0;
  const canGoNext = stepIndex < STEP_TABS.length - 1;

  const handleNextStep = () => {
    audioManager.stop();
    if (canGoNext) {
      setCurrentStep(STEP_TABS[stepIndex + 1].key);
    }
  };

  const handlePrevStep = () => {
    audioManager.stop();
    if (canGoPrev) {
      setCurrentStep(STEP_TABS[stepIndex - 1].key);
    }
  };

  // Claim Reward
  const handleClaimReward = () => {
    if (rewardClaimed) return;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    audioManager.playSoundEffect('star');
    audioManager.speak('Chúc mừng con đã xuất sắc hoàn thành bài học hôm nay! Cô Đào và Ong Vàng tặng con 3 sao vàng!');
    storageService.updateProfileStars(activeProfile.id, 3, 'Chăm Học Tiếng Việt 1');
    setRewardClaimed(true);
    onProfileUpdated();
  };

  return (
    <div className={`mx-auto transition-all ${isPresentationMode ? 'max-w-full px-6 py-4' : 'max-w-6xl px-4 sm:px-6 py-6'}`}>
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 sm:p-5 rounded-3xl border-4 border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioManager.stop();
              onBack();
            }}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-all cursor-pointer"
            title="Quay lại danh sách bài học"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-lg uppercase">
                {lesson.unitTitle}
              </span>
              <span className="text-xs text-slate-400 font-bold hidden sm:inline">
                {lesson.bookCurriculum}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">
              {lesson.title}
            </h2>
          </div>
        </div>

        {/* Right side controls: Step pills & Projector Mode button */}
        <div className="flex items-center gap-2">
          {onTogglePresentationMode && (
            <button
              onClick={onTogglePresentationMode}
              className={`px-3.5 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                isPresentationMode
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
              title="Bật/Tắt chế độ trình chiếu màn hình lớn cho lớp học"
            >
              <Tv className="w-4 h-4" />
              <span>{isPresentationMode ? 'Thoát Trình Chiếu' : 'Trình Chiếu Lớp Học'}</span>
            </button>
          )}

          {isSpeaking ? (
            <button
              onClick={handleStopSpeech}
              className="px-3.5 py-2 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Dừng đọc</span>
            </button>
          ) : (
            <button
              onClick={() => handleSpeak(lesson.title)}
              className="px-3.5 py-2 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Đọc tên bài</span>
            </button>
          )}
        </div>
      </div>

      {/* 7-Step Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 sm:p-3 border-3 border-slate-200 shadow-xs mb-6 overflow-x-auto">
        <div className="flex items-center justify-between gap-1 sm:gap-2 min-w-[650px]">
          {STEP_TABS.map((tab) => {
            const isActive = currentStep === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  audioManager.stop();
                  setCurrentStep(tab.key);
                }}
                className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md scale-102 ring-2 ring-emerald-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="text-sm sm:text-base">{tab.icon}</span>
                <span className="hidden md:inline font-extrabold">{tab.number}.</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Content Card */}
      <div className={`bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-md min-h-[460px] flex flex-col justify-between ${isPresentationMode ? 'text-lg sm:text-xl' : ''}`}>
        {/* STEP 1: KHỞI ĐỘNG */}
        {currentStep === 'intro' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌱</span>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-800">
                  Bước 1: Khởi Động & Giới Thiệu Bài Học
                </h3>
                <p className="text-sm sm:text-base text-slate-500 font-medium">
                  Cùng quan sát tranh, nghe bạn Ong Vàng và cô Đào dẫn dắt vào bài mới nhé!
                </p>
              </div>
            </div>

            <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border-3 border-amber-200 flex flex-col md:flex-row items-center gap-6">
              <div className="relative shrink-0">
                <MascotBee className="w-28 h-28 sm:w-36 sm:h-36 animate-float" />
                <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                  Ong Vàng
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border-2 border-amber-300 shadow-xs relative">
                  <div className="text-xs font-black uppercase text-amber-700 tracking-wider mb-1">
                    📖 Lời dẫn của Cô Đào & Ong Vàng
                  </div>
                  <p className="text-base sm:text-lg text-slate-800 font-bold leading-relaxed">
                    "{lesson.introStory}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleSpeak(lesson.introStory)}
                    className="btn-3d-yellow px-5 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Lắng nghe lời dẫn</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <span>Vào Bước 2: Nhận biết</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Trọng tâm bài học */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-200">
                <div className="text-xs font-extrabold text-emerald-700 uppercase">Chữ trọng tâm</div>
                <div className="text-3xl font-black text-emerald-900 mt-1 flex gap-2">
                  {lesson.letters.map((l) => (
                    <span key={l} className="bg-white px-3 py-1 rounded-xl shadow-xs border border-emerald-200">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-sky-50 rounded-2xl p-4 border-2 border-sky-200 sm:col-span-2">
                <div className="text-xs font-extrabold text-sky-700 uppercase">Từ ngữ ứng dụng bài học</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {lesson.sampleWords.map((item) => (
                    <span
                      key={item.word}
                      onClick={() => handleSpeak(item.audioText)}
                      className="bg-white hover:bg-sky-100 text-sky-900 font-black px-3.5 py-1.5 rounded-xl border border-sky-300 shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                      title="Bấm để nghe đọc tiếng này"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>{item.word}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: NHẬN BIẾT */}
        {currentStep === 'recognize' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👀</span>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-800">
                  Bước 2: Nhận Biết Âm, Chữ & Dấu Thanh
                </h3>
                <p className="text-sm sm:text-base text-slate-500 font-medium">
                  Quan sát hình dáng chữ in thường, in hoa và các nét cơ bản tạo thành chữ.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box Chữ cái lớn */}
              <div className="bg-linear-to-b from-teal-50 to-emerald-100 rounded-3xl p-6 sm:p-8 border-3 border-teal-300 flex flex-col items-center justify-center text-center">
                <div className="text-xs font-extrabold uppercase text-teal-700 tracking-wider mb-2">
                  Hình dạng chữ in thường & in hoa
                </div>

                <div className="flex items-baseline justify-center gap-6 my-4">
                  {lesson.letters.map((char, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSpeak(char)}
                      className="group cursor-pointer transform hover:scale-110 transition-transform"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border-4 border-teal-400 shadow-lg flex items-center justify-center text-5xl sm:text-6xl font-black text-emerald-800 group-hover:bg-teal-50">
                        {char}
                      </div>
                      <div className="mt-2 text-xs font-black text-slate-500 flex items-center justify-center gap-1">
                        <Volume2 className="w-3 h-3 text-emerald-600" />
                        <span>Nghe âm</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs sm:text-sm font-bold text-slate-600 bg-white/80 px-4 py-2 rounded-xl border border-teal-200">
                  💡 Nhắc nhở: Chữ in hoa thường đứng đầu câu hoặc dùng để viết tên riêng.
                </div>
              </div>

              {/* Box Từ ngữ minh họa */}
              <div className="bg-amber-50 rounded-3xl p-6 border-3 border-amber-300 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-extrabold uppercase text-amber-700 tracking-wider mb-3">
                    Tiếng và từ chứa âm của bài
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lesson.sampleWords.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSpeak(item.audioText)}
                        className="bg-white hover:bg-amber-100/60 p-3.5 rounded-2xl border-2 border-amber-200 shadow-xs cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xl font-black text-slate-800">{item.word}</div>
                          <div className="text-xs text-slate-500 font-semibold">{item.meaning}</div>
                        </div>
                        <Volume2 className="w-4 h-4 text-amber-600" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-amber-200 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Sang Bước 3: Luyện phát âm</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: HƯỚNG DẪN PHÁT ÂM VÀ LUYỆN ĐỌC */}
        {currentStep === 'pronounce' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎧</span>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-800">
                  Bước 3: Hướng Dẫn Phát Âm & Luyện Đọc
                </h3>
                <p className="text-sm sm:text-base text-slate-500 font-medium">
                  Máy đọc tiếng Việt đọc chuẩn âm (không đọc tên chữ). Con hãy quan sát khẩu hình và đọc theo nhé!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lesson.pronunciationNotes.map((pn, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border-4 border-emerald-300 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                        Âm cần luyện: {pn.sound}
                      </span>
                      <span className="text-xs font-bold text-slate-400">Máy đọc tiếng Việt</span>
                    </div>

                    <div className="text-4xl font-black text-emerald-700 text-center my-4 font-vietnamese">
                      {pn.sound}
                    </div>

                    <div className="bg-emerald-50/70 p-4 rounded-2xl border-2 border-emerald-200">
                      <div className="text-xs font-extrabold text-emerald-800 mb-1 flex items-center gap-1">
                        <Smile className="w-4 h-4 text-emerald-600" />
                        <span>Khẩu hình miệng & cách phát âm:</span>
                      </div>
                      <p className="text-sm sm:text-base text-slate-700 font-bold leading-relaxed">
                        {pn.mouthShape}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => handleSpeak(pn.speechText)}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Nghe âm "{pn.sound}"</span>
                    </button>

                    <button
                      onClick={() => audioManager.replay()}
                      className="px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-sm flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Nghe lại</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <span>Sang Bước 4: Hoạt động tương tác</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: HOẠT ĐỘNG TƯƠNG TÁC TRỰC TIẾP */}
        {currentStep === 'interactive' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✨</span>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-800">
                  Bước 4: Hoạt Động Tương Tác Trực Tiếp
                </h3>
                <p className="text-sm sm:text-base text-slate-500 font-medium">
                  {lesson.interactiveActivity.instruction}
                </p>
              </div>
            </div>

            <div className="bg-sky-50 rounded-3xl p-6 sm:p-8 border-3 border-sky-300">
              <div className="text-center mb-6">
                <span className="inline-block bg-white px-5 py-2 rounded-2xl text-sky-900 font-black text-lg sm:text-xl border-2 border-sky-200 shadow-xs">
                  {lesson.interactiveActivity.prompt}
                </span>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {lesson.interactiveActivity.items.map((item, idx) => {
                  const isSelected = selectedInteractiveIndices.includes(idx);
                  let cardStyle = 'bg-white border-slate-300 hover:border-sky-400 text-slate-800';

                  if (interactiveChecked) {
                    if (item.isCorrect && isSelected) {
                      cardStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300';
                    } else if (!item.isCorrect && isSelected) {
                      cardStyle = 'bg-rose-100 border-rose-500 text-rose-950 ring-2 ring-rose-300';
                    } else if (item.isCorrect && !isSelected) {
                      cardStyle = 'bg-amber-100 border-amber-500 text-amber-950 dashed border-2';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-sky-100 border-sky-500 text-sky-950 ring-2 ring-sky-300 scale-102';
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (interactiveChecked) return;
                        audioManager.playSoundEffect('click');
                        audioManager.speak(item.text);
                        if (isSelected) {
                          setSelectedInteractiveIndices(selectedInteractiveIndices.filter((i) => i !== idx));
                        } else {
                          setSelectedInteractiveIndices([...selectedInteractiveIndices, idx]);
                        }
                      }}
                      className={`p-5 rounded-3xl border-4 text-center cursor-pointer transition-all shadow-sm flex flex-col items-center justify-center gap-1 ${cardStyle}`}
                    >
                      <div className="text-3xl sm:text-4xl font-black">{item.text}</div>
                      <div className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-sky-600" />
                        <span>Bấm để chọn & nghe</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {!interactiveChecked ? (
                  <button
                    onClick={() => {
                      if (selectedInteractiveIndices.length === 0) {
                        alert('Bé hãy bấm chọn ít nhất một tiếng trước khi kiểm tra nhé!');
                        return;
                      }
                      setInteractiveChecked(true);
                      const allSelectedAreCorrect = selectedInteractiveIndices.every(
                        (i) => lesson.interactiveActivity.items[i].isCorrect
                      );
                      if (allSelectedAreCorrect) {
                        audioManager.playSoundEffect('correct');
                      } else {
                        audioManager.playSoundEffect('wrong');
                      }
                    }}
                    className="btn-3d-yellow px-6 py-3 rounded-2xl font-black text-base shadow-md cursor-pointer"
                  >
                    Kiểm tra kết quả
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedInteractiveIndices([]);
                        setInteractiveChecked(false);
                      }}
                      className="px-5 py-2.5 rounded-2xl bg-white border-2 border-slate-300 hover:border-slate-400 font-extrabold text-sm text-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Chọn lại</span>
                    </button>

                    <button
                      onClick={handleNextStep}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all"
                    >
                      <span>Vào Bước 5: Chơi trò chơi củng cố</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: TRÒ CHƠI CỦNG CỐ KIẾN THỨC */}
        {currentStep === 'game' && (
          <div className="space-y-6 animate-fade-in text-center max-w-2xl mx-auto py-4">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">🎮</span>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-800">
                Bước 5: Trò Chơi Củng Cố Bài Học
              </h3>
            </div>

            <p className="text-base text-slate-600 font-medium">
              Ong Vàng đã chuẩn bị một trò chơi hấp dẫn để giúp con ôn luyện bài học này thật vui vẻ!
            </p>

            <div className="bg-linear-to-br from-violet-50 to-indigo-50 rounded-3xl p-8 border-4 border-indigo-200 shadow-md">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white font-black text-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                #{lesson.recommendedGameId}
              </div>

              <h4 className="text-2xl font-black text-slate-800">
                {lesson.recommendedGameTitle}
              </h4>
              <p className="text-sm text-slate-500 font-semibold mt-2">
                Trò chơi củng cố trực tiếp kiến thức của {lesson.unitTitle}.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => onPlayGame(lesson.recommendedGameId)}
                  className="btn-3d-yellow px-6 py-3 rounded-2xl font-black text-base flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Vào chơi ngay</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="px-5 py-3 rounded-2xl bg-white border-2 border-indigo-300 hover:bg-indigo-50 font-black text-sm text-indigo-900 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Chuyển sang Bước 6: Luyện tập</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: PHẦN LUYỆN TẬP VÀ ĐÁNH GIÁ */}
        {currentStep === 'practice' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📝</span>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-emerald-800">
                    Bước 6: Luyện Tập & Đánh Giá
                  </h3>
                  <p className="text-sm sm:text-base text-slate-500 font-medium">
                    Câu hỏi {practiceQuestionIndex + 1} / {lesson.practiceQuestions.length}
                  </p>
                </div>
              </div>

              <div className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
                Điểm: {practiceScore} ⭐
              </div>
            </div>

            {lesson.practiceQuestions[practiceQuestionIndex] && (
              <div className="bg-amber-50/70 rounded-3xl p-6 sm:p-8 border-3 border-amber-300">
                <div className="text-center mb-6">
                  <div className="text-xs font-black uppercase text-amber-700 tracking-wider mb-1">
                    {lesson.practiceQuestions[practiceQuestionIndex].instruction}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-800">
                    {lesson.practiceQuestions[practiceQuestionIndex].questionContent}
                  </h4>

                  {lesson.practiceQuestions[practiceQuestionIndex].audioPrompt && (
                    <button
                      onClick={() => handleSpeak(lesson.practiceQuestions[practiceQuestionIndex].audioPrompt!)}
                      className="mt-3 inline-flex items-center gap-1.5 bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer hover:bg-emerald-700"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Nghe lại câu hỏi</span>
                    </button>
                  )}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                  {lesson.practiceQuestions[practiceQuestionIndex].options.map((opt, optIdx) => {
                    const isSelected = selectedPracticeOption === optIdx;
                    let optStyle = 'bg-white border-slate-300 hover:border-emerald-400 text-slate-800';

                    if (isPracticeChecked) {
                      if (optIdx === lesson.practiceQuestions[practiceQuestionIndex].correctIndex) {
                        optStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300';
                      } else if (isSelected) {
                        optStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                      }
                    } else if (isSelected) {
                      optStyle = 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-300';
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => {
                          if (isPracticeChecked) return;
                          audioManager.playSoundEffect('click');
                          setSelectedPracticeOption(optIdx);
                        }}
                        className={`p-4 rounded-2xl border-3 text-center font-black text-lg sm:text-xl cursor-pointer transition-all shadow-xs ${optStyle}`}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isPracticeChecked && (
                  <div className="mt-6 p-4 rounded-2xl bg-white border-2 border-emerald-200 text-center font-bold text-sm text-slate-700">
                    💡 {lesson.practiceQuestions[practiceQuestionIndex].explanation}
                  </div>
                )}

                {/* Question Actions */}
                <div className="mt-6 flex justify-center gap-3">
                  {!isPracticeChecked ? (
                    <button
                      onClick={() => {
                        if (selectedPracticeOption === null) {
                          alert('Bé hãy chọn một đáp án nhé!');
                          return;
                        }
                        setIsPracticeChecked(true);
                        const isCorrect = selectedPracticeOption === lesson.practiceQuestions[practiceQuestionIndex].correctIndex;
                        if (isCorrect) {
                          audioManager.playSoundEffect('correct');
                          setPracticeScore(practiceScore + 1);
                        } else {
                          audioManager.playSoundEffect('wrong');
                        }
                      }}
                      className="btn-3d-yellow px-6 py-2.5 rounded-2xl font-black text-sm shadow-md cursor-pointer"
                    >
                      Kiểm tra câu này
                    </button>
                  ) : (
                    practiceQuestionIndex < lesson.practiceQuestions.length - 1 ? (
                      <button
                        onClick={() => {
                          setPracticeQuestionIndex(practiceQuestionIndex + 1);
                          setSelectedPracticeOption(null);
                          setIsPracticeChecked(false);
                        }}
                        className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <span>Câu hỏi tiếp theo</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleNextStep}
                        className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>Xem phần thưởng hoàn thành!</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 7: LỜI KHEN VÀ PHẦN THƯỞNG */}
        {currentStep === 'reward' && (
          <div className="space-y-6 animate-fade-in text-center max-w-2xl mx-auto py-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">🏆</span>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-800">
                Bước 7: Lời Khen & Phần Thưởng
              </h3>
            </div>

            <div className="bg-linear-to-b from-amber-50 to-yellow-100 rounded-3xl p-8 border-4 border-amber-300 shadow-xl">
              <div className="relative inline-block mb-4">
                <MascotBee className="w-28 h-28 mx-auto animate-bounce" mood="cheer" />
                <div className="absolute -top-2 -right-2 bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                  Điểm 10
                </div>
              </div>

              <h4 className="text-3xl font-black text-slate-800">
                Hoan Hô {activeProfile.name}!
              </h4>
              <p className="text-base sm:text-lg text-slate-700 font-bold mt-2 leading-relaxed">
                "Con đã rất chăm chỉ và xuất sắc hoàn thành trọn vẹn 7 bước của {lesson.unitTitle} ({lesson.title})! Cô Đào và các bạn rất tự hào về con!"
              </p>

              <div className="my-6 flex items-center justify-center gap-4">
                <div className="bg-white px-5 py-3 rounded-2xl border-2 border-amber-300 shadow-xs flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  <span className="font-black text-xl text-slate-800">+3 Sao Vàng</span>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl border-2 border-emerald-300 shadow-xs flex items-center gap-2">
                  <Award className="w-6 h-6 text-emerald-600" />
                  <span className="font-black text-base text-slate-800">Hoa Điểm 10</span>
                </div>
              </div>

              {!rewardClaimed ? (
                <button
                  onClick={handleClaimReward}
                  className="btn-3d-yellow px-8 py-3.5 rounded-2xl font-black text-lg shadow-xl cursor-pointer transform hover:scale-105 transition-all"
                >
                  🎁 Bấm Nhận Thưởng Ngay
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 font-black px-4 py-2 rounded-xl text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Đã nhận thưởng thành công và lưu vào Sổ học tập!</span>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={onBack}
                      className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Xem các bài học khác</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Navigation: Previous / Next Step */}
        <div className="mt-8 pt-4 border-t-2 border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={!canGoPrev}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              canGoPrev
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'opacity-40 cursor-not-allowed text-slate-400'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Bước trước</span>
          </button>

          <span className="text-xs font-bold text-slate-400">
            Bước {stepIndex + 1} / 7
          </span>

          <button
            onClick={handleNextStep}
            disabled={!canGoNext}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              canGoNext
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'opacity-40 cursor-not-allowed text-slate-400'
            }`}
          >
            <span>Bước tiếp theo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
