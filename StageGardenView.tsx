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
  Flower2,
  Sparkles,
  Link2,
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

type GardenActivityType = 'picture-word' | 'matching-pairs' | 'context-word' | 'distinguish-spelling' | 'fill-sentence';

interface GardenTask {
  id: string;
  stepNumber: number;
  type: GardenActivityType;
  title: string;
  instruction: string;
  speechText: string;
  hint: string;
  explanation: string;
  stars: number;
  // Payload
  picturePayload?: {
    emoji: string;
    label: string;
    options: string[];
    correctIndex: number;
  };
  matchingPayload?: {
    pairs: { id: string; emoji: string; word: string }[];
  };
  contextPayload?: {
    situation: string;
    options: string[];
    correctIndex: number;
  };
  distinguishPayload?: {
    ruleTitle: string;
    options: string[];
    correctIndex: number;
  };
  sentencePayload?: {
    sentenceWithBlank: string;
    options: string[];
    correctIndex: number;
  };
}

const GARDEN_TASKS: GardenTask[] = [
  {
    id: 'task-4-1',
    stepNumber: 1,
    type: 'picture-word',
    title: '1. Nhìn tranh chọn từ phù hợp',
    instruction: 'Bức tranh vẽ loài hoa rực rỡ dưới ánh mặt trời. Hãy chọn từ đúng:',
    speechText: 'Bức tranh vẽ bông hoa hướng dương, bé hãy chọn từ đúng',
    hint: 'Bông hoa màu vàng rực rỡ hướng về mặt trời là hoa hướng dương!',
    explanation: 'Chính xác! "Hoa hướng dương" là từ chỉ loài hoa màu vàng tươi luôn quay về phía mặt trời.',
    stars: 1,
    picturePayload: {
      emoji: '🌻',
      label: 'Hoa hướng về mặt trời',
      options: ['hoa hướng dương', 'hoa sen', 'hoa hồng', 'cây chuối'],
      correctIndex: 0,
    },
  },
  {
    id: 'task-4-2',
    stepNumber: 2,
    type: 'matching-pairs',
    title: '2. Nối tranh với từ tương ứng',
    instruction: 'Bé hãy bấm chọn 1 bức tranh bên trái, rồi bấm từ tương ứng bên phải để nối cặp nhé:',
    speechText: 'Bé hãy nối từng tranh với từ tương ứng: quả táo, chú cún và quyển sách',
    hint: 'Bấm vào quả táo rồi bấm vào từ "quả táo" để nối đôi nhé!',
    explanation: 'Tuyệt vời! Bé đã nối chính xác cả 3 cặp tranh và từ ngữ!',
    stars: 1,
    matchingPayload: {
      pairs: [
        { id: 'pair-1', emoji: '🍎', word: 'quả táo' },
        { id: 'pair-2', emoji: '🐶', word: 'chú cún' },
        { id: 'pair-3', emoji: '📚', word: 'quyển sách' },
      ],
    },
  },
  {
    id: 'task-4-3',
    stepNumber: 3,
    type: 'context-word',
    title: '3. Chọn từ phù hợp với tình huống',
    instruction: 'Tình huống: Khi được bà ngoại tặng cho quả táo ngọt ngào, bé ngoan ngoãn nói gì?',
    speechText: 'Khi được bà ngoại tặng quả táo ngọt ngào, bé ngoan nói gì?',
    hint: 'Khi nhận quà của người lớn, bé luôn nhớ nói lời cảm ơn!',
    explanation: 'Rất ngoan! Lời nói lễ phép của học sinh lớp 1 là: "Cháu cảm ơn bà ạ!"',
    stars: 1,
    contextPayload: {
      situation: '🎁 Bà tặng cho bé một quả táo thơm ngon.',
      options: ['Cháu cảm ơn bà ạ!', 'Chào tạm biệt bà!', 'Cháu xin lỗi bà!'],
      correctIndex: 0,
    },
  },
  {
    id: 'task-4-4',
    stepNumber: 4,
    type: 'distinguish-spelling',
    title: '4. Phân biệt từ dễ nhầm chính tả',
    instruction: 'Quy tắc c / k: Chọn từ viết đúng chính tả tiếng Việt:',
    speechText: 'Quy tắc chính tả c và k: Từ nào viết đúng chính tả: kẻ vở hay cẻ vở?',
    hint: 'Chữ k luôn đi trước các chữ e, ê, i, nên ta viết "kẻ vở"!',
    explanation: 'Chính xác! Theo quy tắc chính tả, âm c đứng trước e, ê, i phải viết bằng "k". Do đó "kẻ vở" là từ đúng.',
    stars: 1,
    distinguishPayload: {
      ruleTitle: 'Đi với âm "e", "ê", "i"',
      options: ['kẻ vở', 'cẻ vở', 'kả nhà', 'cỉ niệm'],
      correctIndex: 0,
    },
  },
  {
    id: 'task-4-5',
    stepNumber: 5,
    type: 'fill-sentence',
    title: '5. Điền từ hoàn thành câu ngắn',
    instruction: 'Chọn từ thích hợp điền vào chỗ chấm: "Mỗi sớm mai, chú gà trống gáy [ ... ] gọi cả xóm thức dậy."',
    speechText: 'Mỗi sớm mai, chú gà trống gáy gì gọi cả xóm thức dậy?',
    hint: 'Tiếng gáy vang của chú gà trống là ò ó o!',
    explanation: 'Rất giỏi! Câu hoàn chỉnh là: "Mỗi sớm mai, chú gà trống gáy ò ó o gọi cả xóm thức dậy."',
    stars: 1,
    sentencePayload: {
      sentenceWithBlank: 'Mỗi sớm mai, chú gà trống gáy [ ... ] gọi cả xóm thức dậy.',
      options: ['ò ó o', 'gâu gâu', 'meo meo', 'chíp chíp'],
      correctIndex: 0,
    },
  },
];

export const StageGardenView: React.FC<Props> = ({
  stage,
  activeProfile,
  onBackToMap,
  onGoToNextStage,
  onProgressUpdated,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  // Matching activity state
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMascotSpeaking, setIsMascotSpeaking] = useState(false);

  const currentTask = GARDEN_TASKS[currentStepIndex];
  const totalSteps = GARDEN_TASKS.length;

  useEffect(() => {
    return () => {
      audioManager.stop();
    };
  }, [currentStepIndex]);

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

  // Matching pair logic
  const handleSelectLeftEmoji = (pairId: string) => {
    if (matchedIds.includes(pairId)) return;
    setSelectedLeftId(pairId);
  };

  const handleSelectRightWord = (pairId: string) => {
    if (!selectedLeftId || matchedIds.includes(pairId)) return;

    if (selectedLeftId === pairId) {
      // Correct match!
      audioManager.playSoundEffect('correct');
      const nextMatched = [...matchedIds, pairId];
      setMatchedIds(nextMatched);
      setSelectedLeftId(null);

      if (nextMatched.length === currentTask.matchingPayload!.pairs.length) {
        setIsChecked(true);
        setIsCorrect(true);
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
      // Wrong match
      audioManager.playSoundEffect('wrong');
      setSelectedLeftId(null);
    }
  };

  const handleCheckAnswer = () => {
    if (isChecked) return;
    let correct = false;

    if (currentTask.type === 'picture-word' && currentTask.picturePayload) {
      if (selectedOptionIndex === null) return;
      correct = selectedOptionIndex === currentTask.picturePayload.correctIndex;
    } else if (currentTask.type === 'context-word' && currentTask.contextPayload) {
      if (selectedOptionIndex === null) return;
      correct = selectedOptionIndex === currentTask.contextPayload.correctIndex;
    } else if (currentTask.type === 'distinguish-spelling' && currentTask.distinguishPayload) {
      if (selectedOptionIndex === null) return;
      correct = selectedOptionIndex === currentTask.distinguishPayload.correctIndex;
    } else if (currentTask.type === 'fill-sentence' && currentTask.sentencePayload) {
      if (selectedOptionIndex === null) return;
      correct = selectedOptionIndex === currentTask.sentencePayload.correctIndex;
    }

    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      audioManager.playSoundEffect('correct');
      setStarsEarned((prev) => prev + currentTask.stars);
      storageService.completeJourneyTask(
        activeProfile.id,
        stage.stageNumber,
        currentTask.id,
        currentTask.stars,
        totalSteps
      );
      onProgressUpdated();
      audioManager.speakOngVang('Hoan hô bé! Bé chọn từ rất thông minh!');
    } else {
      audioManager.playSoundEffect('wrong');
      audioManager.speakOngVang('Chưa đúng rồi bé ơi! Bé hãy thử lại nhé!');
    }
  };

  const handleNextStep = () => {
    audioManager.stop();
    setIsSpeaking(false);
    setIsMascotSpeaking(false);

    if (currentStepIndex + 1 < totalSteps) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setSelectedLeftId(null);
      setMatchedIds([]);
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
        `Chúc mừng bé ${activeProfile.name}! Bé đã nhận được Huy hiệu Nhà Thám Hiểm Từ Ngữ!`
      );
    }
  };

  const handleRetry = () => {
    setSelectedOptionIndex(null);
    setSelectedLeftId(null);
    setMatchedIds([]);
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 border-2 border-rose-300 shadow-sm">
        <button
          onClick={onBackToMap}
          className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-800 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-900 rounded-full text-xs font-black">
            <Flower2 className="w-4 h-4 text-rose-600" />
            <span>Chặng 4: Khu Vườn Từ Ngữ</span>
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
      <div className="w-full bg-rose-100 h-3 rounded-full overflow-hidden mb-6 border border-rose-300">
        <div
          className="bg-gradient-to-r from-rose-400 to-pink-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {!isFinished ? (
        <div className="relative bg-gradient-to-b from-rose-50/80 via-pink-50/50 to-amber-50/60 rounded-3xl p-6 sm:p-8 border-4 border-rose-400 shadow-xl overflow-hidden">
          {/* Animated Garden Props */}
          <div className="absolute top-2 right-4 text-3xl opacity-25 select-none">🌸</div>
          <div className="absolute bottom-3 left-4 text-3xl opacity-25 select-none">🐞</div>

          {/* Guide Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 relative z-10">
            <div className="bg-white/90 border-2 border-rose-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <MascotTeacher className="w-11 h-11 shrink-0" />
                <div>
                  <div className="text-xs font-black text-rose-900">🌸 Cô Đào giải thích</div>
                  <div className="text-xs text-slate-600 font-semibold line-clamp-1">
                    {currentTask.instruction}
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

          {/* Activity 1: Picture Word */}
          {currentTask.type === 'picture-word' && currentTask.picturePayload && (
            <div className="text-center my-6 relative z-10">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-4">
                {currentTask.instruction}
              </h3>
              <div className="p-6 bg-white/95 rounded-3xl border-4 border-rose-300 inline-block shadow-md">
                <div className="text-7xl mb-2">{currentTask.picturePayload.emoji}</div>
                <div className="text-xs font-bold text-slate-500">{currentTask.picturePayload.label}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 max-w-xl mx-auto">
                {currentTask.picturePayload.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isChecked) setSelectedOptionIndex(idx);
                    }}
                    disabled={isChecked}
                    className={`p-4 rounded-2xl border-4 font-black text-xl transition-all cursor-pointer shadow-sm ${
                      isChecked
                        ? idx === currentTask.picturePayload!.correctIndex
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300'
                          : selectedOptionIndex === idx
                          ? 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-white/60 border-slate-200 text-slate-400'
                        : selectedOptionIndex === idx
                        ? 'bg-rose-100 border-rose-500 text-rose-950 ring-4 ring-rose-300 scale-102 shadow-md'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-rose-400 hover:bg-rose-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Activity 2: Interactive Pair Matching */}
          {currentTask.type === 'matching-pairs' && currentTask.matchingPayload && (
            <div className="text-center my-6 relative z-10">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-2">
                {currentTask.instruction}
              </h3>
              <p className="text-xs font-bold text-slate-500 mb-6">
                Đã nối thành công: {matchedIds.length} / {currentTask.matchingPayload.pairs.length} cặp
              </p>

              <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
                {/* Left Column: Picture Emojis */}
                <div className="flex flex-col gap-4">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Tranh vẽ</div>
                  {currentTask.matchingPayload.pairs.map((p) => {
                    const isMatched = matchedIds.includes(p.id);
                    const isSelected = selectedLeftId === p.id;

                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectLeftEmoji(p.id)}
                        disabled={isMatched}
                        className={`p-4 rounded-2xl border-4 text-4xl sm:text-5xl flex items-center justify-center transition-all ${
                          isMatched
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-60 cursor-default'
                            : isSelected
                            ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 scale-105 shadow-md cursor-pointer'
                            : 'bg-white hover:bg-rose-50 border-rose-300 cursor-pointer shadow-sm active:scale-95'
                        }`}
                      >
                        {p.emoji}
                        {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column: Words (Shuffled or displayed) */}
                <div className="flex flex-col gap-4">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Từ ngữ</div>
                  {/* Reverse order slightly to give matching challenge */}
                  {[...currentTask.matchingPayload.pairs].reverse().map((p) => {
                    const isMatched = matchedIds.includes(p.id);

                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectRightWord(p.id)}
                        disabled={isMatched || !selectedLeftId}
                        className={`p-4 rounded-2xl border-4 font-black text-lg sm:text-xl flex items-center justify-center transition-all ${
                          isMatched
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-60 cursor-default'
                            : selectedLeftId
                            ? 'bg-white hover:bg-amber-100 border-amber-400 text-slate-800 cursor-pointer shadow-md'
                            : 'bg-white/80 border-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>{p.word}</span>
                        {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Activity 3: Context Word */}
          {currentTask.type === 'context-word' && currentTask.contextPayload && (
            <div className="text-center my-6 relative z-10">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-4">
                {currentTask.instruction}
              </h3>

              <div className="p-6 bg-white/95 rounded-3xl border-4 border-rose-300 inline-block shadow-md max-w-lg mb-6">
                <div className="text-lg sm:text-xl font-black text-rose-900">
                  {currentTask.contextPayload.situation}
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-md mx-auto">
                {currentTask.contextPayload.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isChecked) setSelectedOptionIndex(idx);
                    }}
                    disabled={isChecked}
                    className={`p-4 rounded-2xl border-4 font-black text-lg sm:text-xl transition-all cursor-pointer shadow-sm ${
                      isChecked
                        ? idx === currentTask.contextPayload!.correctIndex
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300'
                          : selectedOptionIndex === idx
                          ? 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-white/60 border-slate-200 text-slate-400'
                        : selectedOptionIndex === idx
                        ? 'bg-rose-100 border-rose-500 text-rose-950 ring-4 ring-rose-300 scale-102 shadow-md'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-rose-400 hover:bg-rose-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Activity 4: Distinguish Spelling */}
          {currentTask.type === 'distinguish-spelling' && currentTask.distinguishPayload && (
            <div className="text-center my-6 relative z-10">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-4">
                {currentTask.instruction}
              </h3>

              <div className="p-5 bg-white/95 rounded-3xl border-4 border-rose-300 inline-block shadow-md mb-6">
                <div className="text-xs font-black uppercase text-rose-600 mb-1">Gợi ý quy tắc</div>
                <div className="text-2xl font-black text-slate-800">
                  {currentTask.distinguishPayload.ruleTitle}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {currentTask.distinguishPayload.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isChecked) setSelectedOptionIndex(idx);
                    }}
                    disabled={isChecked}
                    className={`p-5 rounded-2xl border-4 font-black text-2xl transition-all cursor-pointer shadow-sm ${
                      isChecked
                        ? idx === currentTask.distinguishPayload!.correctIndex
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300'
                          : selectedOptionIndex === idx
                          ? 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-white/60 border-slate-200 text-slate-400'
                        : selectedOptionIndex === idx
                        ? 'bg-rose-100 border-rose-500 text-rose-950 ring-4 ring-rose-300 scale-102 shadow-md'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-rose-400 hover:bg-rose-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Activity 5: Fill Sentence */}
          {currentTask.type === 'fill-sentence' && currentTask.sentencePayload && (
            <div className="text-center my-6 relative z-10">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-4">
                {currentTask.instruction}
              </h3>

              <div className="p-6 bg-white/95 rounded-3xl border-4 border-rose-300 inline-block shadow-md max-w-xl mb-6">
                <div className="text-xl sm:text-2xl font-black text-slate-800 leading-relaxed">
                  {currentTask.sentencePayload.sentenceWithBlank}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {currentTask.sentencePayload.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isChecked) setSelectedOptionIndex(idx);
                    }}
                    disabled={isChecked}
                    className={`p-5 rounded-2xl border-4 font-black text-xl sm:text-2xl transition-all cursor-pointer shadow-sm ${
                      isChecked
                        ? idx === currentTask.sentencePayload!.correctIndex
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300'
                          : selectedOptionIndex === idx
                          ? 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-white/60 border-slate-200 text-slate-400'
                        : selectedOptionIndex === idx
                        ? 'bg-rose-100 border-rose-500 text-rose-950 ring-4 ring-rose-300 scale-102 shadow-md'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-rose-400 hover:bg-rose-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar (Not needed for matching-pairs if already auto-checked, but displayed for consistency) */}
          <div className="mt-8 pt-6 border-t-2 border-rose-200/80 flex flex-wrap items-center justify-between gap-4 relative z-10">
            {currentTask.type !== 'matching-pairs' ? (
              !isChecked ? (
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
                        {isCorrect ? 'Chính xác! Bé hiểu từ rất sâu sắc!' : 'Gợi ý từ Cô Đào:'}
                      </div>
                      <div>{currentTask.explanation}</div>
                    </div>
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
                        {currentStepIndex + 1 < totalSteps ? 'Nhiệm vụ tiếp theo' : 'Xem tổng kết chặng'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            ) : isChecked ? (
              <div className="w-full flex items-center justify-between">
                <div className="p-4 rounded-2xl border-2 bg-emerald-100 border-emerald-400 text-emerald-950 flex items-center gap-3">
                  <div className="text-3xl">🎉</div>
                  <div className="font-black text-sm">{currentTask.explanation}</div>
                </div>
                <button
                  onClick={handleNextStep}
                  className="btn-3d-yellow px-6 py-3 rounded-2xl font-black text-sm text-slate-900 flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Nhiệm vụ tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* End of Stage Summary Card */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-rose-400 shadow-2xl text-center relative overflow-hidden">
          <div className="text-6xl mb-4 animate-bounce">🌸✨</div>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-100 text-rose-900 rounded-full text-sm font-black mb-3">
            <Sparkles className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>HOÀN THÀNH CHẶNG 4: KHU VƯỜN TỪ NGỮ</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-800">
            Bé Đã Mở Khóa Kho Tàng Từ Ngữ!
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-semibold max-w-lg mx-auto mt-2">
            Bé đã hoàn thành 5 nhiệm vụ xuất sắc: Nhìn tranh chọn từ, Nối cặp tranh - từ, Ứng xử theo tình huống, Phân biệt chính tả c/k và Điền từ vào câu!
          </p>

          <div className="my-8 p-6 bg-rose-50 border-3 border-rose-300 rounded-3xl max-w-md mx-auto grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white rounded-2xl border border-rose-200 shadow-xs">
              <Award className="w-10 h-10 text-rose-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-500">Huy hiệu</div>
              <div className="text-sm font-black text-rose-900">{stage.badgeAwarded}</div>
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
                onClick={() => onGoToNextStage(5)}
                className="btn-3d-green px-8 py-3.5 rounded-2xl text-white font-black text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Sang Chặng 5: Con đường luyện đọc câu</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
