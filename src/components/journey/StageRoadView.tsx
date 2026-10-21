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
  BookOpen,
  Sparkles,
  CheckSquare,
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

type RoadActivityType = 'read-syllable' | 'read-word' | 'read-short-sentence' | 'picture-sentence' | 'arrange-sentence';

interface RoadTask {
  id: string;
  stepNumber: number;
  type: RoadActivityType;
  title: string;
  instruction: string;
  speechText: string;
  hint: string;
  explanation: string;
  stars: number;
  // Payload
  readContent?: {
    largeText: string;
    subText?: string;
    emoji?: string;
    levelLabel: string;
  };
  pictureSentencePayload?: {
    emoji: string;
    label: string;
    options: string[];
    correctIndex: number;
  };
  arrangeSentencePayload?: {
    tiles: string[];
    correctSequence: string[];
    targetSentence: string;
  };
}

const ROAD_TASKS: RoadTask[] = [
  {
    id: 'task-5-1',
    stepNumber: 1,
    type: 'read-syllable',
    title: '1. Luyện đọc tiếng (Chữ lớn)',
    instruction: 'Bé hãy đọc to, rõ ràng từng tiếng dưới đây. Bé có thể bấm nút để nghe cô giáo đọc mẫu nhé!',
    speechText: 'Bé, Hoa, Mẹ, Trường',
    hint: 'Mỗi tiếng đều có âm đầu và vần. Bé hãy đọc tròn vành rõ chữ nhé!',
    explanation: 'Bé đã hoàn thành lượt luyện đọc tiếng to, rõ ràng và truyền cảm!',
    stars: 1,
    readContent: {
      largeText: 'BÉ  —  HOA  —  MẸ  —  TRƯỜNG',
      subText: 'Đọc trơn từng tiếng một, giữ hơi thở đều đặn con nhé.',
      levelLabel: 'Cấp độ: Đọc tiếng',
    },
  },
  {
    id: 'task-5-2',
    stepNumber: 2,
    type: 'read-word',
    title: '2. Luyện đọc từ quen thuộc có hình minh họa',
    instruction: 'Bé hãy nhìn tranh và đọc to từ ngữ dưới đây:',
    speechText: 'Dòng sông xanh mát',
    hint: 'Bé đọc d - ong - dong - huyền - dòng, s - ông - sông!',
    explanation: 'Rất tốt! Bé đã đọc trơn từ "Dòng sông xanh mát" rất chuẩn.',
    stars: 1,
    readContent: {
      largeText: 'DÒNG SÔNG XANH MÁT',
      emoji: '🏞️',
      subText: 'Tranh: Dòng sông uốn lượn hiền hòa quanh xóm làng.',
      levelLabel: 'Cấp độ: Đọc từ ngữ',
    },
  },
  {
    id: 'task-5-3',
    stepNumber: 3,
    type: 'read-short-sentence',
    title: '3. Luyện đọc câu ngắn hoàn chỉnh',
    instruction: 'Bé hãy đọc câu văn ngắn, chú ý ngắt nghỉ hơi ở dấu phẩy và dấu chấm nhé:',
    speechText: 'Bé yêu cô giáo và mái trường mến thương.',
    hint: 'Bé đọc liền mạch một hơi đến cuối câu rồi ngắt nghỉ hơi con nhé!',
    explanation: 'Xuất sắc! Bé đã tự tin đọc trọn vẹn câu văn thật ấm áp và truyền cảm.',
    stars: 1,
    readContent: {
      largeText: '“Bé yêu cô giáo và mái trường mến thương.”',
      subText: 'Đọc đúng ngữ điệu câu bày tỏ tình cảm mến thương.',
      levelLabel: 'Cấp độ: Đọc câu đơn',
    },
  },
  {
    id: 'task-5-4',
    stepNumber: 4,
    type: 'picture-sentence',
    title: '4. Chọn câu phù hợp với bức tranh',
    instruction: 'Nhìn bức tranh cả nhà quây quần bên mâm cơm ấm cúng và chọn câu diễn tả đúng:',
    speechText: 'Nhìn bức tranh cả nhà sum vầy và chọn câu miêu tả đúng nhất',
    hint: 'Cả gia đình quây quần bên nhau ăn bữa cơm tối đầm ấm con nhé!',
    explanation: 'Chính xác! Câu "Cả nhà quây quần ăn bữa cơm tối ấm áp." diễn đạt trọn vẹn ý nghĩa của bức tranh.',
    stars: 1,
    pictureSentencePayload: {
      emoji: '🍲👨‍👩‍👧‍👦',
      label: 'Bữa cơm gia đình ấm cúng',
      options: [
        'Cả nhà quây quần ăn bữa cơm tối ấm áp.',
        'Bé đang chạy nhảy một mình ngoài sân.',
        'Chú mèo con đang trèo lên cây cau.',
      ],
      correctIndex: 0,
    },
  },
  {
    id: 'task-5-5',
    stepNumber: 5,
    type: 'arrange-sentence',
    title: '5. Sắp xếp các thẻ từ thành câu đúng',
    instruction: 'Bé hãy bấm các thẻ từ theo đúng thứ tự để tạo thành câu hoàn chỉnh:',
    speechText: 'Bé hãy xếp các thẻ từ thành câu hoàn chỉnh: Bé chăm chỉ học bài',
    hint: 'Bắt đầu bằng từ viết hoa "Bé", tiếp theo là "chăm chỉ", rồi "học bài" và dấu chấm!',
    explanation: 'Tuyệt vời! Câu hoàn chỉnh đúng ngữ pháp tiếng Việt là: "Bé chăm chỉ học bài."',
    stars: 1,
    arrangeSentencePayload: {
      tiles: ['học bài.', 'Bé', 'chăm chỉ'],
      correctSequence: ['Bé', 'chăm chỉ', 'học bài.'],
      targetSentence: 'Bé chăm chỉ học bài.',
    },
  },
];

export const StageRoadView: React.FC<Props> = ({
  stage,
  activeProfile,
  onBackToMap,
  onGoToNextStage,
  onProgressUpdated,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Self-reading check state
  const [isSelfMarkedRead, setIsSelfMarkedRead] = useState(false);

  // Picture-sentence choice
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  // Sentence arranging
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMascotSpeaking, setIsMascotSpeaking] = useState(false);

  const currentTask = ROAD_TASKS[currentStepIndex];
  const totalSteps = ROAD_TASKS.length;

  useEffect(() => {
    return () => {
      audioManager.stop();
    };
  }, [currentStepIndex]);

  const handleSpeakModel = () => {
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

  // Self-mark read handler (Acts as honest self-assessment for reading)
  const handleConfirmSelfRead = () => {
    if (isSelfMarkedRead) return;
    setIsSelfMarkedRead(true);
    setIsChecked(true);
    setIsCorrect(true);
    audioManager.playSoundEffect('correct');
    audioManager.speakOngVang('Bé đọc rất hay! Cô Đào và bạn Ong Vàng khen bé nhé!');
    setStarsEarned((prev) => prev + currentTask.stars);

    storageService.completeJourneyTask(
      activeProfile.id,
      stage.stageNumber,
      currentTask.id,
      currentTask.stars,
      totalSteps
    );
    onProgressUpdated();
  };

  // Arrange word handlers
  const handleAddWord = (word: string) => {
    if (isChecked) return;
    setSelectedWords((prev) => [...prev, word]);
  };

  const handleClearWords = () => {
    if (isChecked) return;
    setSelectedWords([]);
  };

  const handleCheckAnswer = () => {
    if (isChecked) return;
    let correct = false;

    if (currentTask.type === 'picture-sentence' && currentTask.pictureSentencePayload) {
      if (selectedOptionIndex === null) return;
      correct = selectedOptionIndex === currentTask.pictureSentencePayload.correctIndex;
    } else if (currentTask.type === 'arrange-sentence' && currentTask.arrangeSentencePayload) {
      if (selectedWords.length !== currentTask.arrangeSentencePayload.correctSequence.length) return;
      correct = selectedWords.every(
        (w, i) => w === currentTask.arrangeSentencePayload!.correctSequence[i]
      );
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
      audioManager.speakFeedback(true, currentTask.explanation);
    } else {
      audioManager.playSoundEffect('wrong');
      audioManager.speakFeedback(false, currentTask.explanation);
    }
  };

  const handleNextStep = () => {
    audioManager.stop();
    setIsSpeaking(false);
    setIsMascotSpeaking(false);

    if (currentStepIndex + 1 < totalSteps) {
      setCurrentStepIndex((prev) => prev + 1);
      setIsSelfMarkedRead(false);
      setSelectedOptionIndex(null);
      setSelectedWords([]);
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
        `Chúc mừng bé ${activeProfile.name}! Bé đã nhận được Huy hiệu Đại Sứ Đọc Sách!`
      );
    }
  };

  const handleRetry = () => {
    setIsSelfMarkedRead(false);
    setSelectedOptionIndex(null);
    setSelectedWords([]);
    setIsChecked(false);
    setIsCorrect(false);
  };

  const isReadingSelfCheck =
    currentTask.type === 'read-syllable' ||
    currentTask.type === 'read-word' ||
    currentTask.type === 'read-short-sentence';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 border-2 border-purple-300 shadow-sm">
        <button
          onClick={onBackToMap}
          className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-800 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-black">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Chặng 5: Con Đường Luyện Đọc Câu</span>
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
      <div className="w-full bg-purple-100 h-3 rounded-full overflow-hidden mb-6 border border-purple-300">
        <div
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {!isFinished ? (
        <div className="relative bg-gradient-to-b from-purple-50/80 via-indigo-50/50 to-amber-50/60 rounded-3xl p-6 sm:p-8 border-4 border-purple-400 shadow-xl overflow-hidden">
          {/* Animated Reading Boulevard Props */}
          <div className="absolute top-2 right-4 text-3xl opacity-25 select-none">📖</div>
          <div className="absolute bottom-3 left-4 text-3xl opacity-25 select-none">🌳</div>

          {/* Guide Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 relative z-10">
            <div className="bg-white/90 border-2 border-purple-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <MascotTeacher className="w-11 h-11 shrink-0" />
                <div>
                  <div className="text-xs font-black text-purple-900">🌸 Cô Đào đọc mẫu</div>
                  <div className="text-xs text-slate-600 font-semibold line-clamp-1">
                    {currentTask.instruction}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSpeakModel}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 border transition-all cursor-pointer shrink-0 ${
                  isSpeaking
                    ? 'bg-purple-600 text-white border-purple-700 animate-pulse'
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border-purple-300'
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

          {/* Activities 1, 2, 3: Self Reading Check */}
          {isReadingSelfCheck && currentTask.readContent && (
            <div className="text-center my-6 relative z-10">
              <div className="inline-block px-3 py-1 bg-purple-200 text-purple-900 rounded-full text-xs font-black mb-2">
                {currentTask.readContent.levelLabel}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-4">
                {currentTask.instruction}
              </h3>

              {/* Prominent Large Text Reading Plaque */}
              <div className="p-8 sm:p-12 bg-white/95 rounded-3xl border-4 border-purple-300 shadow-md max-w-2xl mx-auto my-4">
                {currentTask.readContent.emoji && (
                  <div className="text-6xl sm:text-7xl mb-4">{currentTask.readContent.emoji}</div>
                )}
                <div className="text-2xl sm:text-4xl font-black text-purple-950 leading-relaxed tracking-wide">
                  {currentTask.readContent.largeText}
                </div>
                {currentTask.readContent.subText && (
                  <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-3 italic">
                    {currentTask.readContent.subText}
                  </div>
                )}
              </div>

              {/* Audio Controls and Honest Self-Marking */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                <button
                  onClick={handleSpeakModel}
                  className="px-5 py-3 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-black text-sm border-2 border-purple-300 flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Volume2 className="w-4 h-4 text-purple-700" />
                  <span>Nghe lại cô đọc mẫu</span>
                </button>

                {!isSelfMarkedRead ? (
                  <button
                    onClick={handleConfirmSelfRead}
                    className="btn-3d-green px-8 py-3.5 rounded-2xl text-white font-black text-base flex items-center gap-2 cursor-pointer shadow-md hover:scale-102"
                  >
                    <CheckSquare className="w-5 h-5" />
                    <span>Em đã đọc xong!</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-black text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Bé đã tự đánh dấu hoàn thành bài đọc!</span>
                  </div>
                )}
              </div>

              <div className="mt-4 text-[11px] font-bold text-slate-500">
                (Lưu ý: Bé tự giác luyện đọc thành tiếng để nâng cao kỹ năng phát âm tiếng Việt)
              </div>
            </div>
          )}

          {/* Activity 4: Picture Sentence Selection */}
          {currentTask.type === 'picture-sentence' && currentTask.pictureSentencePayload && (
            <div className="text-center my-6 relative z-10">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-4">
                {currentTask.instruction}
              </h3>

              <div className="p-6 bg-white/95 rounded-3xl border-4 border-purple-300 inline-block shadow-md max-w-md mb-6">
                <div className="text-6xl sm:text-7xl mb-2">
                  {currentTask.pictureSentencePayload.emoji}
                </div>
                <div className="text-xs font-bold text-slate-500">
                  {currentTask.pictureSentencePayload.label}
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-xl mx-auto">
                {currentTask.pictureSentencePayload.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isChecked) setSelectedOptionIndex(idx);
                    }}
                    disabled={isChecked}
                    className={`p-4 rounded-2xl border-4 font-black text-base sm:text-lg text-left transition-all cursor-pointer shadow-sm ${
                      isChecked
                        ? idx === currentTask.pictureSentencePayload!.correctIndex
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300'
                          : selectedOptionIndex === idx
                          ? 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-white/60 border-slate-200 text-slate-400'
                        : selectedOptionIndex === idx
                        ? 'bg-purple-100 border-purple-500 text-purple-950 ring-4 ring-purple-300 scale-102 shadow-md'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-purple-400 hover:bg-purple-50'
                    }`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-purple-200 text-purple-900 font-extrabold text-xs inline-flex items-center justify-center mr-3">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Activity 5: Arrange Sentence Tiles */}
          {currentTask.type === 'arrange-sentence' && currentTask.arrangeSentencePayload && (
            <div className="text-center my-6 relative z-10">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-2">
                {currentTask.instruction}
              </h3>
              <div className="text-sm font-bold text-slate-500 mb-4">
                Câu mục tiêu: <span className="text-purple-700 font-black text-lg">"{currentTask.arrangeSentencePayload.targetSentence}"</span>
              </div>

              {/* Selected Sentence Tray */}
              <div className="p-6 bg-white/95 rounded-3xl border-4 border-purple-300 shadow-inner min-h-[90px] flex items-center justify-center gap-3">
                {selectedWords.length === 0 ? (
                  <span className="text-slate-400 font-bold italic text-sm sm:text-base">
                    (Bấm các thẻ từ ở dưới để xếp thành câu hoàn chỉnh)
                  </span>
                ) : (
                  selectedWords.map((w, idx) => (
                    <span
                      key={idx}
                      className="px-5 py-3 rounded-2xl bg-purple-600 text-white font-black text-xl shadow-md"
                    >
                      {w}
                    </span>
                  ))
                )}
              </div>

              {/* Reset Tray Button */}
              {selectedWords.length > 0 && !isChecked && (
                <div className="mt-3 flex justify-center">
                  <button
                    onClick={handleClearWords}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Delete className="w-4 h-4" />
                    <span>Xóa xếp lại</span>
                  </button>
                </div>
              )}

              {/* Available Word Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                {currentTask.arrangeSentencePayload.tiles.map((word, idx) => {
                  const countInTray = selectedWords.filter((w) => w === word).length;
                  const isUsed = countInTray >= 1;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAddWord(word)}
                      disabled={isChecked || isUsed}
                      className={`px-6 py-3.5 rounded-2xl border-4 font-black text-xl sm:text-2xl transition-all shadow-md ${
                        isUsed
                          ? 'bg-slate-200 border-slate-300 text-slate-400 opacity-50 cursor-not-allowed'
                          : 'bg-white hover:bg-amber-100 border-amber-400 text-slate-800 cursor-pointer active:scale-95'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="mt-8 pt-6 border-t-2 border-purple-200/80 flex flex-wrap items-center justify-between gap-4 relative z-10">
            {!isReadingSelfCheck ? (
              !isChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={
                    currentTask.type === 'arrange-sentence'
                      ? selectedWords.length === 0
                      : selectedOptionIndex === null
                  }
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                    (currentTask.type === 'arrange-sentence'
                      ? selectedWords.length > 0
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
                          {isCorrect ? 'Chính xác! Bé hiểu câu rất sâu sắc!' : 'Gợi ý từ Cô Đào:'}
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
                        {currentStepIndex + 1 < totalSteps ? 'Nhiệm vụ tiếp theo' : 'Xem tổng kết chặng'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            ) : isSelfMarkedRead ? (
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
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-purple-400 shadow-2xl text-center relative overflow-hidden">
          <div className="text-6xl mb-4 animate-bounce">📖✨</div>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-100 text-purple-900 rounded-full text-sm font-black mb-3">
            <Sparkles className="w-4 h-4 text-purple-600 fill-purple-600" />
            <span>HOÀN THÀNH CHẶNG 5: CON ĐƯỜNG LUYỆN ĐỌC CÂU</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-800">
            Bé Đã Đạt Danh Hiệu Đại Sứ Đọc Sách!
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-semibold max-w-lg mx-auto mt-2">
            Bé đã hoàn thành xuất sắc 5 nhiệm vụ: Luyện đọc tiếng, Luyện đọc từ, Luyện đọc câu ngắn, Chọn câu theo tranh và Sắp xếp thẻ từ thành câu!
          </p>

          <div className="my-8 p-6 bg-purple-50 border-3 border-purple-300 rounded-3xl max-w-md mx-auto grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white rounded-2xl border border-purple-200 shadow-xs">
              <Award className="w-10 h-10 text-purple-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-500">Huy hiệu</div>
              <div className="text-sm font-black text-purple-900">{stage.badgeAwarded}</div>
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
                onClick={() => onGoToNextStage(6)}
                className="btn-3d-green px-8 py-3.5 rounded-2xl text-white font-black text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Tiến tới Chặng 6: Đảo ôn tập Tiếng Việt</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
