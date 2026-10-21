import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Volume2,
  Square,
  CheckCircle2,
  Award,
  ChevronRight,
  Volume1,
  Play,
} from 'lucide-react';
import {
  GameMetadata,
  StudentProfile,
  WrongAnswerRecord,
  LetterRecognitionQuestion,
  ListeningQuestion,
  PhonicsBlendQuestion,
  FillRhymeQuestion,
  MatchPairsQuestion,
  SentenceMatchingQuestion,
  UpperLowerPairQuestion,
  MissingLettersBoardQuestion,
  DetectiveLettersQuestion,
  AppleHarvestQuestion,
  LetterMazeQuestion,
} from '../../types';
import {
  GAME_1_QUESTIONS,
  GAME_2_QUESTIONS,
  GAME_3_QUESTIONS,
  GAME_4_QUESTIONS,
  GAME_5_QUESTIONS,
  GAME_6_QUESTIONS,
} from '../../data/learningData';
import {
  GAME_2_UPPER_LOWER_QUESTIONS,
  GAME_3_MISSING_BOARD_QUESTIONS,
  GAME_4_DETECTIVE_QUESTIONS,
  GAME_5_APPLE_HARVEST_QUESTIONS,
  GAME_6_LETTER_MAZE_QUESTIONS,
} from '../../data/zone1GamesData';
import {
  WHEEL_GAME_ROUNDS,
  BOAT_RACE_ROUNDS,
  SCRAMBLE_WORD_ROUNDS,
  LISTEN_PICTURE_ROUNDS,
  TRICKY_SOUND_ROUNDS,
  TONE_RECOGNITION_ROUNDS,
  CATEGORY_WORDS_ROUNDS,
  STORY_SEQUENCE_ROUNDS,
} from '../../data/zoneGamesData';
import {
  GAME_11_QUESTIONS,
  GAME_16_QUESTIONS,
  GAME_18_QUESTIONS,
  GAME_19_QUESTIONS,
  GAME_20_QUESTIONS,
  GAME_21_QUESTIONS,
  GAME_22_QUESTIONS,
  GAME_23_QUESTIONS,
  GAME_25_QUESTIONS,
  GAME_26_QUESTIONS,
  GAME_28_QUESTIONS,
  GAME_31_QUESTIONS,
  GAME_33_QUESTIONS,
  GAME_34_QUESTIONS,
  GAME_35_QUESTIONS,
  GAME_36_QUESTIONS,
  GAME_37_QUESTIONS,
  GAME_38_QUESTIONS,
  GAME_39_QUESTIONS,
  GAME_40_QUESTIONS,
  StandardQuestion,
} from '../../data/extraGamesData';
import { audioManager } from '../../services/audioManager';
import { storageService } from '../../services/storageService';
import { MascotBee } from '../illustrations/VectorIllustrations';
import { LetterPickerGame } from './LetterPickerGame';
import { UpperLowerCaseGame } from './UpperLowerCaseGame';
import { MissingLetterBoardGame } from './MissingLetterBoardGame';
import { DetectiveLettersGame } from './DetectiveLettersGame';
import { AppleHarvestGame } from './AppleHarvestGame';
import { LetterMazeGame } from './LetterMazeGame';
import { ListeningGame } from './ListeningGame';
import { PhonicsBlendGame } from './PhonicsBlendGame';
import { FillRhymeGame } from './FillRhymeGame';
import { MatchPairsGame } from './MatchPairsGame';
import { SentenceMatchingGame } from './SentenceMatchingGame';
import { WheelRhymeGame } from './WheelRhymeGame';
import { BoatRaceGame } from './BoatRaceGame';
import { ScrambleTileGame } from './ScrambleTileGame';
import { ListenPictureGame } from './ListenPictureGame';
import { TrickySoundGame } from './TrickySoundGame';
import { ToneHearingGame } from './ToneHearingGame';
import { CategoryWordGame } from './CategoryWordGame';
import { StorySequenceGame } from './StorySequenceGame';
import { GeneralChoiceGame } from './GeneralChoiceGame';

interface Props {
  game: GameMetadata;
  activeProfile: StudentProfile;
  onBack: () => void;
  onViewReports: () => void;
  onProfileUpdated: () => void;
  onPlayNextGame?: (nextGameId: number) => void;
}

export const GamePlayer: React.FC<Props> = ({
  game,
  activeProfile,
  onBack,
  onViewReports,
  onProfileUpdated,
  onPlayNextGame,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [matchPairsMap, setMatchPairsMap] = useState<Record<string, string>>({});
  const [missingSlotsMap, setMissingSlotsMap] = useState<Record<number, string>>({});
  const [detectiveIndices, setDetectiveIndices] = useState<number[]>([]);
  const [selectedOnset, setSelectedOnset] = useState<string | null>(null);
  const [selectedRhyme, setSelectedRhyme] = useState<string | null>(null);
  const [scrambleLetters, setScrambleLetters] = useState<string[]>([]);
  const [categoryIndices, setCategoryIndices] = useState<number[]>([]);
  const [storyCardIds, setStoryCardIds] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [wrongAnswersList, setWrongAnswersList] = useState<WrongAnswerRecord[]>([]);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [isSpeakingContent, setIsSpeakingContent] = useState(false);
  const [isMascotSpeaking, setIsMascotSpeaking] = useState(false);

  // Pick question list based on game.id (1 to 40 fully mapped)
  let questions: any[] = [];
  if (game.id === 1) questions = GAME_1_QUESTIONS;
  else if (game.id === 2) questions = GAME_2_UPPER_LOWER_QUESTIONS;
  else if (game.id === 3) questions = GAME_3_MISSING_BOARD_QUESTIONS;
  else if (game.id === 4) questions = GAME_4_DETECTIVE_QUESTIONS;
  else if (game.id === 5) questions = GAME_5_APPLE_HARVEST_QUESTIONS;
  else if (game.id === 6) questions = GAME_6_LETTER_MAZE_QUESTIONS;
  else if (game.id === 7) questions = GAME_2_QUESTIONS;
  else if (game.id === 8) questions = LISTEN_PICTURE_ROUNDS;
  else if (game.id === 9) questions = TRICKY_SOUND_ROUNDS;
  else if (game.id === 10) questions = TONE_RECOGNITION_ROUNDS;
  else if (game.id === 11) questions = GAME_11_QUESTIONS;
  else if (game.id === 12) questions = GAME_3_QUESTIONS;
  else if (game.id === 13) questions = GAME_4_QUESTIONS;
  else if (game.id === 14) questions = WHEEL_GAME_ROUNDS;
  else if (game.id === 15) questions = BOAT_RACE_ROUNDS;
  else if (game.id === 16) questions = GAME_16_QUESTIONS;
  else if (game.id === 17) questions = SCRAMBLE_WORD_ROUNDS;
  else if (game.id === 18) questions = GAME_18_QUESTIONS;
  else if (game.id === 19) questions = GAME_19_QUESTIONS;
  else if (game.id === 20) questions = GAME_20_QUESTIONS;
  else if (game.id === 21) questions = GAME_21_QUESTIONS;
  else if (game.id === 22) questions = GAME_22_QUESTIONS;
  else if (game.id === 23) questions = GAME_23_QUESTIONS;
  else if (game.id === 24) questions = GAME_5_QUESTIONS;
  else if (game.id === 25) questions = GAME_25_QUESTIONS;
  else if (game.id === 26) questions = GAME_26_QUESTIONS;
  else if (game.id === 27) questions = CATEGORY_WORDS_ROUNDS;
  else if (game.id === 28) questions = GAME_28_QUESTIONS;
  else if (game.id === 29) questions = GAME_6_QUESTIONS;
  else if (game.id === 30) questions = SCRAMBLE_WORD_ROUNDS;
  else if (game.id === 31) questions = GAME_31_QUESTIONS;
  else if (game.id === 32) questions = STORY_SEQUENCE_ROUNDS;
  else if (game.id === 33) questions = GAME_33_QUESTIONS;
  else if (game.id === 34) questions = GAME_34_QUESTIONS;
  else if (game.id === 35) questions = GAME_35_QUESTIONS;
  else if (game.id === 36) questions = GAME_36_QUESTIONS;
  else if (game.id === 37) questions = GAME_37_QUESTIONS;
  else if (game.id === 38) questions = GAME_38_QUESTIONS;
  else if (game.id === 39) questions = GAME_39_QUESTIONS;
  else if (game.id === 40) questions = GAME_40_QUESTIONS;
  else questions = GAME_1_QUESTIONS;

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] || questions[0];

  useEffect(() => {
    return () => {
      audioManager.stop();
    };
  }, [currentIndex]);

  const resetQuestionState = () => {
    setSelectedOption(null);
    setMatchPairsMap({});
    setMissingSlotsMap({});
    setDetectiveIndices([]);
    setSelectedOnset(null);
    setSelectedRhyme(null);
    setScrambleLetters([]);
    setCategoryIndices([]);
    setStoryCardIds([]);
    setIsChecked(false);
    setIsCorrect(false);
    audioManager.stop();
    setIsSpeakingContent(false);
    setIsMascotSpeaking(false);
  };

  const handleRestart = () => {
    audioManager.stop();
    setCurrentIndex(0);
    setStarsEarned(0);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongAnswersList([]);
    setIsGameCompleted(false);
    resetQuestionState();
  };

  // Ong Vàng guidance
  const handleMascotSpeak = () => {
    if (!currentQuestion) return;
    setIsMascotSpeaking(true);
    setIsSpeakingContent(false);
    audioManager.speakOngVang(currentQuestion.mascotTip || 'Con hãy chú ý đọc kỹ câu hỏi nhé!', () => {
      setIsMascotSpeaking(false);
    });
  };

  // Máy đọc tiếng Việt (Listen)
  const handleSpeakContent = () => {
    if (!currentQuestion) return;
    setIsSpeakingContent(true);
    setIsMascotSpeaking(false);
    const textToSpeak = currentQuestion.speechContent || currentQuestion.instruction || currentQuestion.wordToListen || '';
    audioManager.speak(textToSpeak, {
      onEnd: () => {
        setIsSpeakingContent(false);
      },
      onError: () => {
        setIsSpeakingContent(false);
      },
    });
  };

  // Máy đọc tiếng Việt (Replay)
  const handleReplayContent = () => {
    setIsSpeakingContent(true);
    setIsMascotSpeaking(false);
    audioManager.replay(() => {
      setIsSpeakingContent(false);
    });
  };

  // Stop speech
  const handleStopAudio = () => {
    audioManager.stop();
    setIsSpeakingContent(false);
    setIsMascotSpeaking(false);
  };

  // Checking answer
  const handleCheckAnswer = () => {
    if (isChecked) return;

    let correct = false;
    let userAnswerText = '';
    let correctAnswerText = '';

    if (game.id === 1) {
      const q = currentQuestion as LetterRecognitionQuestion;
      correct = selectedOption === q.correctIndex;
      userAnswerText = q.options[selectedOption] || 'Chưa chọn';
      correctAnswerText = q.options[q.correctIndex];
    } else if (game.id === 2) {
      const q = currentQuestion as UpperLowerPairQuestion;
      correct = selectedOption === q.correctIndex;
      userAnswerText = q.options[selectedOption] || 'Chưa chọn';
      correctAnswerText = q.correctLower;
    } else if (game.id === 3) {
      const q = currentQuestion as MissingLettersBoardQuestion;
      let allCorrect = true;
      q.missingSlots.forEach((s) => {
        if (missingSlotsMap[s.index] !== s.correctLetter) {
          allCorrect = false;
        }
      });
      correct = allCorrect;
      userAnswerText = q.missingSlots
        .map((s) => `Vị trí #${s.index + 1}: ${missingSlotsMap[s.index] || 'chưa điền'}`)
        .join(', ');
      correctAnswerText = q.missingSlots
        .map((s) => `Vị trí #${s.index + 1}: ${s.correctLetter}`)
        .join(', ');
    } else if (game.id === 4) {
      const q = currentQuestion as DetectiveLettersQuestion;
      const isMatch =
        detectiveIndices.length === q.correctIndices.length &&
        detectiveIndices.every((idx) => q.correctIndices.includes(idx));
      correct = isMatch;
      userAnswerText =
        detectiveIndices.map((i) => q.items[i]?.letter).join(', ') || 'Chưa soi chữ nào';
      correctAnswerText = q.correctIndices.map((i) => q.items[i]?.letter).join(', ');
    } else if (game.id === 5) {
      const q = currentQuestion as AppleHarvestQuestion;
      correct = selectedOption === q.correctAppleId;
      const chosenApple = q.apples.find((a) => a.id === selectedOption);
      userAnswerText = chosenApple ? `Quả táo chữ "${chosenApple.letter}"` : 'Chưa chọn';
      const rightApple = q.apples.find((a) => a.id === q.correctAppleId);
      correctAnswerText = rightApple ? `Quả táo chữ "${rightApple.letter}"` : '';
    } else if (game.id === 6) {
      const q = currentQuestion as LetterMazeQuestion;
      correct = selectedOption === q.correctGateIndex;
      const chosenGate = q.gates[selectedOption];
      userAnswerText = chosenGate
        ? `Cổng "${chosenGate.letter}" (${chosenGate.direction})`
        : 'Chưa chọn';
      const rightGate = q.gates[q.correctGateIndex];
      correctAnswerText = rightGate
        ? `Cổng "${rightGate.letter}" (${rightGate.direction})`
        : '';
    } else if (game.id === 7) {
      const q = currentQuestion as ListeningQuestion;
      correct = selectedOption === q.correctIndex;
      userAnswerText = q.options[selectedOption] || 'Chưa chọn';
      correctAnswerText = q.options[q.correctIndex];
    } else if (game.id === 8) {
      const opt = currentQuestion.options[selectedOption];
      correct = !!opt?.isCorrect;
      userAnswerText = opt?.text || 'Chưa chọn';
      const rightOpt = currentQuestion.options.find((o: any) => o.isCorrect);
      correctAnswerText = rightOpt?.text || '';
    } else if (game.id === 9) {
      const opt = currentQuestion.options[selectedOption];
      correct = !!opt?.isCorrect;
      userAnswerText = opt?.text || 'Chưa chọn';
      const rightOpt = currentQuestion.options.find((o: any) => o.isCorrect);
      correctAnswerText = rightOpt?.text || '';
    } else if (game.id === 10) {
      const opt = currentQuestion.options[selectedOption];
      correct = !!opt?.isCorrect;
      userAnswerText = opt?.name || 'Chưa chọn';
      const rightOpt = currentQuestion.options.find((o: any) => o.isCorrect);
      correctAnswerText = rightOpt?.name || '';
    } else if (game.id === 12) {
      const q = currentQuestion as PhonicsBlendQuestion;
      correct = selectedOption === q.correctRhyme;
      userAnswerText = selectedOption || 'Chưa chọn';
      correctAnswerText = q.correctRhyme;
    } else if (game.id === 13) {
      const q = currentQuestion as FillRhymeQuestion;
      correct = selectedOption === q.missingRhyme;
      userAnswerText = selectedOption || 'Chưa chọn';
      correctAnswerText = q.missingRhyme;
    } else if (game.id === 14) {
      correct = selectedOnset === currentQuestion.onset && selectedRhyme === currentQuestion.rhyme;
      userAnswerText = selectedOnset && selectedRhyme ? `${selectedOnset}${selectedRhyme}` : 'Chưa xoay';
      correctAnswerText = currentQuestion.targetWord;
    } else if (game.id === 15) {
      const opt = currentQuestion.options[selectedOption];
      correct = !!opt?.isCorrect;
      userAnswerText = opt?.text || 'Chưa chọn';
      const rightOpt = currentQuestion.options.find((o: any) => o.isCorrect);
      correctAnswerText = rightOpt?.text || '';
    } else if (game.id === 17 || game.id === 30) {
      const wordAssembled = scrambleLetters.join('');
      correct = wordAssembled === currentQuestion.correctWord;
      userAnswerText = wordAssembled || 'Chưa ghép';
      correctAnswerText = currentQuestion.correctWord;
    } else if (game.id === 24) {
      const q = currentQuestion as MatchPairsQuestion;
      const totalPairs = q.pairs.length;
      let matchedCount = 0;
      q.pairs.forEach((p) => {
        if (matchPairsMap[p.id] === p.id) {
          matchedCount++;
        }
      });
      correct = matchedCount === totalPairs;
      userAnswerText = `Đúng ${matchedCount}/${totalPairs} cặp`;
      correctAnswerText = `Đúng toàn bộ ${totalPairs} cặp`;
    } else if (game.id === 27) {
      const correctIdxs = currentQuestion.words
        .map((w: any, i: number) => (w.isCorrect ? i : -1))
        .filter((i: number) => i >= 0);
      const isMatch =
        categoryIndices.length === correctIdxs.length &&
        categoryIndices.every((i) => correctIdxs.includes(i));
      correct = isMatch;
      userAnswerText = `Đã chọn ${categoryIndices.length} từ`;
      correctAnswerText = `Đúng toàn bộ ${correctIdxs.length} từ hợp lệ`;
    } else if (game.id === 29) {
      const q = currentQuestion as SentenceMatchingQuestion;
      correct = selectedOption === q.correctIndex;
      userAnswerText = q.sentences[selectedOption] || 'Chưa chọn';
      correctAnswerText = q.sentences[q.correctIndex];
    } else if (game.id === 32) {
      const expectedIds = currentQuestion.cards.map((c: any) => c.id);
      correct =
        storyCardIds.length === expectedIds.length &&
        storyCardIds.every((id, idx) => id === expectedIds[idx]);
      userAnswerText = `Thứ tự: ${storyCardIds.join(' -> ')}`;
      correctAnswerText = `Đúng 3 bước theo diễn biến câu chuyện`;
    } else {
      // Standard Question (Games 11, 16, 18, 19, 20, 21, 22, 23, 25, 26, 28, 31, 33, 34, 35, 36, 37, 38, 39, 40)
      const q = currentQuestion as StandardQuestion;
      correct = selectedOption === q.correctIndex;
      userAnswerText = q.options ? q.options[selectedOption] || 'Chưa chọn' : 'Đã chọn';
      correctAnswerText = q.options ? q.options[q.correctIndex] : 'Đáp án chuẩn';
    }

    const explanationText =
      currentQuestion?.explanation?.trim() ||
      currentQuestion?.narration?.trim() ||
      '';

    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      audioManager.playSoundEffect('correct');
      setStarsEarned((prev) => prev + 1);
      setCorrectCount((prev) => prev + 1);
      // Đọc liền mạch lời nhận xét và nội dung giải thích bằng giọng nữ miền Bắc
      audioManager.speakFeedback(true, explanationText);
    } else {
      audioManager.playSoundEffect('wrong');
      setWrongCount((prev) => prev + 1);
      setWrongAnswersList((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          questionText: currentQuestion.instruction || game.title,
          userAnswer: userAnswerText,
          correctAnswer: correctAnswerText,
        },
      ]);
      // Đọc liền mạch lời nhận xét và nội dung giải thích bằng giọng nữ miền Bắc
      audioManager.speakFeedback(false, explanationText);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      resetQuestionState();
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setIsGameCompleted(true);
    audioManager.stop();
    audioManager.playSoundEffect('badge');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    storageService.recordSession({
      studentId: activeProfile.id,
      gameId: game.id,
      gameTitle: game.title,
      totalQuestions: totalQuestions,
      correctCount: correctCount + (isCorrect ? 0 : 0),
      wrongCount: wrongCount,
      starsEarned: starsEarned,
      durationSeconds: 60,
      wrongAnswers: wrongAnswersList,
    });

    onProfileUpdated();
  };

  // Determine if student can check their answer
  let canCheck = false;
  if (game.id === 3) {
    const q = currentQuestion as MissingLettersBoardQuestion;
    canCheck = !!(q && q.missingSlots && Object.keys(missingSlotsMap).length === q.missingSlots.length);
  } else if (game.id === 4) {
    canCheck = detectiveIndices.length > 0;
  } else if (game.id === 14) {
    canCheck = selectedOnset !== null && selectedRhyme !== null;
  } else if (game.id === 17 || game.id === 30) {
    canCheck = scrambleLetters.length > 0;
  } else if (game.id === 24) {
    canCheck =
      Object.keys(matchPairsMap).length ===
      (currentQuestion as MatchPairsQuestion).pairs.length;
  } else if (game.id === 27) {
    canCheck = categoryIndices.length > 0;
  } else if (game.id === 32) {
    canCheck = storyCardIds.length === (currentQuestion.cards?.length || 3);
  } else {
    canCheck = selectedOption !== null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Game Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border-2 border-amber-200 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioManager.stop();
              onBack();
            }}
            className="p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">40 Trò chơi</span>
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              Trò chơi {game.id}: {game.title}
            </h2>
            <div className="text-xs font-bold text-emerald-600">
              {game.categoryName} • Mục tiêu: {game.targetSkill}
            </div>
          </div>
        </div>

        {/* Progress & Stars */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400">Tiến trình</div>
            <div className="text-base sm:text-lg font-black text-slate-700">
              Câu {currentIndex + 1}/{totalQuestions}
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-100 border-2 border-amber-300 px-3.5 py-1.5 rounded-2xl text-amber-900 font-black text-base shadow-xs">
            <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span>+{starsEarned} Sao</span>
          </div>

          <button
            onClick={handleRestart}
            title="Làm lại từ đầu"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Game Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-md border-4 border-amber-300 relative">
        {/* Unified Audio Control Dock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {/* Mascot Bee Guidance Panel */}
          <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <MascotBee className="w-12 h-12 shrink-0 animate-float" />
              <div>
                <div className="text-xs font-black text-amber-900 flex items-center gap-1">
                  <span>🐝 Ong Vàng nhắc bé</span>
                </div>
                <div className="text-xs text-amber-800 line-clamp-1 italic">
                  "{currentQuestion.mascotTip || 'Con hãy chú ý lắng nghe và quan sát nhé!'}"
                </div>
              </div>
            </div>
            <button
              onClick={handleMascotSpeak}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all cursor-pointer ${
                isMascotSpeaking
                  ? 'bg-amber-400 text-amber-950 border-amber-600 animate-pulse'
                  : 'bg-amber-200 hover:bg-amber-300 text-amber-900 border-amber-400'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Gợi ý</span>
            </button>
          </div>

          {/* Máy Đọc Tiếng Việt Panel */}
          <div className="bg-sky-50/90 border-2 border-sky-300 rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-200 text-sky-800 flex items-center justify-center font-black text-lg shrink-0">
                <Volume1 className="w-6 h-6 text-sky-700" />
              </div>
              <div>
                <div className="text-xs font-black text-sky-900 flex items-center gap-1">
                  <span>🔊 Máy đọc tiếng Việt</span>
                </div>
                <div className="text-xs text-sky-700 font-semibold line-clamp-1">
                  Phát âm chuẩn ngữ âm tiếng Việt
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleSpeakContent}
                title="Bấm để máy đọc nội dung"
                className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1 border transition-all cursor-pointer ${
                  isSpeakingContent
                    ? 'bg-sky-500 text-white border-sky-700 animate-pulse shadow-sm'
                    : 'bg-sky-200 hover:bg-sky-300 text-sky-900 border-sky-400'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe</span>
              </button>

              <button
                onClick={handleReplayContent}
                title="Nghe lại nội dung vừa đọc"
                className="px-2.5 py-2 rounded-xl text-xs font-extrabold bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 transition-all cursor-pointer"
              >
                <span>Nghe lại</span>
              </button>

              {(isSpeakingContent || isMascotSpeaking) && (
                <button
                  onClick={handleStopAudio}
                  title="Dừng đọc"
                  className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Instruction */}
        <div className="text-center mb-4">
          <p className="text-lg sm:text-xl font-black text-slate-800">
            {currentQuestion.instruction}
          </p>
        </div>

        {/* Question Interactive Content Rendered by Specific Game Type */}
        <div className="my-6">
          {game.id === 1 && (
            <LetterPickerGame
              question={currentQuestion as LetterRecognitionQuestion}
              selectedOption={selectedOption}
              onSelectOption={(idx) => setSelectedOption(idx)}
              isChecked={isChecked}
            />
          )}

          {game.id === 2 && (
            <UpperLowerCaseGame
              question={currentQuestion as UpperLowerPairQuestion}
              selectedOption={selectedOption}
              onSelectOption={(idx) => setSelectedOption(idx)}
              isChecked={isChecked}
            />
          )}

          {game.id === 3 && (
            <MissingLetterBoardGame
              question={currentQuestion as MissingLettersBoardQuestion}
              userSlots={missingSlotsMap}
              onUpdateSlots={(slots) => setMissingSlotsMap(slots)}
              isChecked={isChecked}
            />
          )}

          {game.id === 4 && (
            <DetectiveLettersGame
              question={currentQuestion as DetectiveLettersQuestion}
              selectedIndices={detectiveIndices}
              onToggleIndex={(idx) => {
                setDetectiveIndices((prev) =>
                  prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                );
              }}
              isChecked={isChecked}
            />
          )}

          {game.id === 5 && (
            <AppleHarvestGame
              question={currentQuestion as AppleHarvestQuestion}
              selectedAppleId={selectedOption}
              onSelectApple={(id) => setSelectedOption(id)}
              isChecked={isChecked}
            />
          )}

          {game.id === 6 && (
            <LetterMazeGame
              question={currentQuestion as LetterMazeQuestion}
              selectedGateIndex={selectedOption}
              onSelectGate={(gateIdx) => setSelectedOption(gateIdx)}
              isChecked={isChecked}
            />
          )}

          {game.id === 7 && (
            <ListeningGame
              question={currentQuestion as ListeningQuestion}
              selectedOption={selectedOption}
              onSelectOption={(idx) => setSelectedOption(idx)}
              isChecked={isChecked}
            />
          )}

          {game.id === 8 && (
            <ListenPictureGame
              round={currentQuestion}
              selectedOption={selectedOption}
              onSelectOption={(idx) => setSelectedOption(idx)}
              isChecked={isChecked}
            />
          )}

          {game.id === 9 && (
            <TrickySoundGame
              round={currentQuestion}
              selectedOption={selectedOption}
              onSelectOption={(idx) => setSelectedOption(idx)}
              isChecked={isChecked}
            />
          )}

          {game.id === 10 && (
            <ToneHearingGame
              round={currentQuestion}
              selectedOption={selectedOption}
              onSelectOption={(idx) => setSelectedOption(idx)}
              isChecked={isChecked}
            />
          )}

          {game.id === 12 && (
            <PhonicsBlendGame
              question={currentQuestion as PhonicsBlendQuestion}
              selectedOption={selectedOption}
              onSelectOption={(rhyme) => setSelectedOption(rhyme)}
              isChecked={isChecked}
            />
          )}

          {game.id === 13 && (
            <FillRhymeGame
              question={currentQuestion as FillRhymeQuestion}
              selectedOption={selectedOption}
              onSelectOption={(rhyme) => setSelectedOption(rhyme)}
              isChecked={isChecked}
            />
          )}

          {game.id === 14 && (
            <WheelRhymeGame
              round={currentQuestion}
              selectedOnset={selectedOnset}
              selectedRhyme={selectedRhyme}
              onSelectOnset={(onset) => setSelectedOnset(onset)}
              onSelectRhyme={(rhyme) => setSelectedRhyme(rhyme)}
              isChecked={isChecked}
            />
          )}

          {game.id === 15 && (
            <BoatRaceGame
              round={currentQuestion}
              selectedOption={selectedOption}
              onSelectOption={(idx) => setSelectedOption(idx)}
              isChecked={isChecked}
              currentRoundIndex={currentIndex}
              totalRounds={totalQuestions}
            />
          )}

          {(game.id === 17 || game.id === 30) && (
            <ScrambleTileGame
              round={currentQuestion}
              selectedLetters={scrambleLetters}
              onAddLetter={(l) => setScrambleLetters((prev) => [...prev, l])}
              onClearLetters={() => setScrambleLetters([])}
              isChecked={isChecked}
            />
          )}

          {game.id === 24 && (
            <MatchPairsGame
              question={currentQuestion as MatchPairsQuestion}
              userMatches={matchPairsMap}
              onUpdateMatches={(matches) => setMatchPairsMap(matches)}
              isChecked={isChecked}
            />
          )}

          {game.id === 27 && (
            <CategoryWordGame
              round={currentQuestion}
              selectedIndices={categoryIndices}
              onToggleIndex={(idx) => {
                setCategoryIndices((prev) =>
                  prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                );
              }}
              isChecked={isChecked}
            />
          )}

          {game.id === 29 && (
            <SentenceMatchingGame
              question={currentQuestion as SentenceMatchingQuestion}
              selectedOption={selectedOption}
              onSelectOption={(idx) => setSelectedOption(idx)}
              isChecked={isChecked}
            />
          )}

          {game.id === 32 && (
            <StorySequenceGame
              round={currentQuestion}
              selectedCardIds={storyCardIds}
              onAddCard={(cardId) => {
                if (!storyCardIds.includes(cardId)) {
                  setStoryCardIds((prev) => [...prev, cardId]);
                }
              }}
              onClearCards={() => setStoryCardIds([])}
              isChecked={isChecked}
            />
          )}

          {/* Standard Choice Games (11, 16, 18, 19, 20, 21, 22, 23, 25, 26, 28, 31, 33, 34, 35, 36, 37, 38, 39, 40) */}
          {[11, 16, 18, 19, 20, 21, 22, 23, 25, 26, 28, 31, 33, 34, 35, 36, 37, 38, 39, 40].includes(game.id) && (
            <GeneralChoiceGame
              question={currentQuestion as StandardQuestion}
              selectedOption={selectedOption}
              onSelectOption={(idx) => setSelectedOption(idx)}
              isChecked={isChecked}
            />
          )}
        </div>

        {/* Feedback Section (when checked) */}
        {isChecked && (
          <div
            className={`mt-6 p-4 sm:p-5 rounded-3xl border-3 flex items-start gap-4 animate-gentle-pulse ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-amber-50 border-amber-400 text-amber-950'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <HelpCircle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-black text-lg sm:text-xl">
                {isCorrect ? 'Tuyệt vời! Con làm đúng rồi! (+1 ⭐)' : 'Chưa đúng rồi, không sao con nhé!'}
              </div>
              <p className="text-sm font-semibold mt-1">
                {currentQuestion.explanation || currentQuestion.narration || 'Hãy cùng bạn Ong Vàng khám phá câu tiếp theo nhé!'}
              </p>
            </div>
            <button
              onClick={() => audioManager.speakFeedback(isCorrect, currentQuestion.explanation || currentQuestion.narration || '')}
              title="Nghe lại lời nhận xét và giải thích"
              className={`p-2.5 rounded-2xl flex items-center gap-1.5 font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 cursor-pointer shrink-0 ${
                isCorrect
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Nghe lại</span>
            </button>
          </div>
        )}

        {/* Action Controls Footer */}
        <div className="mt-8 flex items-center justify-end gap-3 flex-wrap border-t-2 border-slate-100 pt-4">
          {!isChecked ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!canCheck}
              className="btn-3d-yellow px-8 py-3.5 rounded-2xl text-slate-900 font-black text-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Kiểm Tra Đáp Án
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="btn-3d-green px-8 py-3.5 rounded-2xl text-white font-black text-lg cursor-pointer flex items-center gap-2 hover:brightness-110 shadow-md"
            >
              <span>{currentIndex + 1 < totalQuestions ? 'Câu tiếp theo' : 'Hoàn thành lượt chơi'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      {isGameCompleted && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-yellow-400 text-center animate-gentle-pulse">
            <div className="relative inline-block mb-4">
              <MascotBee className="w-24 h-24 mx-auto animate-float" mood="cheer" />
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-950 p-2 rounded-full shadow-md font-black">
                🏆
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
              Chúc Mừng {activeProfile.name}!
            </h3>
            <p className="text-slate-600 font-bold mb-6">
              Bé đã xuất sắc hoàn thành thử thách <span className="text-emerald-700">"{game.title}"</span>
            </p>

            {/* Scorecard */}
            <div className="grid grid-cols-3 gap-3 bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 mb-6">
              <div>
                <div className="text-xs font-bold text-slate-500">Số câu đúng</div>
                <div className="text-2xl font-black text-emerald-600">{correctCount}/{totalQuestions}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500">Sao nhận được</div>
                <div className="text-2xl font-black text-amber-500">⭐ +{starsEarned}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500">Tỷ lệ chính xác</div>
                <div className="text-2xl font-black text-sky-600">
                  {Math.round((correctCount / totalQuestions) * 100)}%
                </div>
              </div>
            </div>

            {/* Badges won */}
            {correctCount >= 7 && (
              <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 p-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 mb-6 shadow-sm">
                <Award className="w-5 h-5 text-yellow-800" />
                <span>Mở khóa Huy Hiệu: {game.title} Xuất Sắc!</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRestart}
                className="btn-3d-yellow px-5 py-3 rounded-2xl font-black text-slate-900 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại lượt mới</span>
              </button>

              {game.id < 40 && onPlayNextGame && (
                <button
                  onClick={() => {
                    setIsGameCompleted(false);
                    onPlayNextGame(game.id + 1);
                  }}
                  className="btn-3d-green px-5 py-3 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Trò tiếp theo (#{game.id + 1})</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsGameCompleted(false);
                  onBack();
                }}
                className="px-5 py-3 rounded-2xl font-black text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm cursor-pointer border border-slate-300"
              >
                Về danh sách 40 trò
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
