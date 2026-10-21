import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Volume1,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  ArrowLeft,
  Globe,
  Award,
  BookOpen,
  Play,
  Check,
  Layers,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { audioManager } from '../../services/audioManager';

interface Props {
  onBack?: () => void;
  onGoHome?: () => void;
  onPlayGame?: (gameId: number) => void;
}

interface WordMatchingPair {
  id: string;
  word: string;
  emoji: string;
  meaning: string;
}

const MATCHING_ROUNDS: WordMatchingPair[][] = [
  [
    { id: 'p1', word: 'con cá', emoji: '🐟', meaning: 'Loài vật bơi dưới nước' },
    { id: 'p2', word: 'ngôi nhà', emoji: '🏡', meaning: 'Nơi gia đình sinh sống' },
    { id: 'p3', word: 'quả táo', emoji: '🍎', meaning: 'Trái cây ngọt giòn thơm' },
    { id: 'p4', word: 'bông hoa', emoji: '🌸', meaning: 'Hoa tươi thắm sắc hương' },
  ],
  [
    { id: 'p5', word: 'xe đạp', emoji: '🚲', meaning: 'Phương tiện bé đi học' },
    { id: 'p6', word: 'cây nấm', emoji: '🍄', meaning: 'Nấm mọc trong khu rừng' },
    { id: 'p7', word: 'chú thỏ', emoji: '🐰', meaning: 'Thỏ thích ăn cà rốt' },
    { id: 'p8', word: 'đồng hồ', emoji: '⏰', meaning: 'Xem giờ giấc mỗi ngày' },
  ],
];

const SECRET_WINDOWS = [
  { id: 1, word: 'mặt trời', emoji: '☀️', hint: 'Tỏa ánh nắng vàng sưởi ấm vạn vật' },
  { id: 2, word: 'con chim', emoji: '🐦', hint: 'Hót líu lo trên cành cây xanh' },
  { id: 3, word: 'cây bút', emoji: '✏️', hint: 'Dụng cụ giúp bé nắn nót từng nét chữ' },
  { id: 4, word: 'quả dưa', emoji: '🍉', hint: 'Vỏ xanh ruột đỏ, nước ngọt mát' },
];

const FARM_CROPS = [
  { id: 1, name: 'Cà rốt', emoji: '🥕', category: 'Củ', speech: 'củ cà rốt' },
  { id: 2, name: 'Quả cam', emoji: '🍊', category: 'Quả', speech: 'quả cam' },
  { id: 3, name: 'Bắp ngô', emoji: '🌽', category: 'Cây', speech: 'bắp ngô' },
  { id: 4, name: 'Cà chua', emoji: '🍅', category: 'Quả', speech: 'quả cà chua' },
  { id: 5, name: 'Quả dâu', emoji: '🍓', category: 'Quả', speech: 'quả dâu tây' },
  { id: 6, name: 'Nấm rơm', emoji: '🍄', category: 'Nấm', speech: 'nấm rơm' },
];

const THEMED_VOCABULARY = [
  {
    theme: 'Gia đình yêu thương',
    emoji: '👨‍👩‍👧‍👦',
    color: 'border-rose-300 bg-rose-50 text-rose-900',
    words: [
      { word: 'ông bà', emoji: '👵', speech: 'ông bà' },
      { word: 'bố mẹ', emoji: '👨‍🦰', speech: 'bố mẹ' },
      { word: 'anh trai', emoji: '👦', speech: 'anh trai' },
      { word: 'chị gái', emoji: '👧', speech: 'chị gái' },
      { word: 'em bé', emoji: '👶', speech: 'em bé' },
    ],
  },
  {
    theme: 'Trường học thân thương',
    emoji: '🏫',
    color: 'border-blue-300 bg-blue-50 text-blue-900',
    words: [
      { word: 'bút chì', emoji: '✏️', speech: 'bút chì' },
      { word: 'thước kẻ', emoji: '📏', speech: 'thước kẻ' },
      { word: 'sách vở', emoji: '📚', speech: 'sách vở' },
      { word: 'bảng đen', emoji: '📋', speech: 'bảng đen' },
      { word: 'cặp sách', emoji: '🎒', speech: 'cặp sách' },
    ],
  },
  {
    theme: 'Thế giới động vật',
    emoji: '🦁',
    color: 'border-amber-300 bg-amber-50 text-amber-900',
    words: [
      { word: 'chú mèo', emoji: '🐱', speech: 'chú mèo' },
      { word: 'chú cún', emoji: '🐶', speech: 'chú cún' },
      { word: 'con gà', emoji: '🐔', speech: 'con gà' },
      { word: 'chú thỏ', emoji: '🐰', speech: 'chú thỏ' },
      { word: 'chú vịt', emoji: '🦆', speech: 'chú vịt' },
    ],
  },
  {
    theme: 'Cây cối & hoa trái',
    emoji: '🌳',
    color: 'border-emerald-300 bg-emerald-50 text-emerald-900',
    words: [
      { word: 'hoa sen', emoji: '🪷', speech: 'hoa sen' },
      { word: 'hoa cúc', emoji: '🌼', speech: 'hoa cúc' },
      { word: 'cây cam', emoji: '🍊', speech: 'cây cam' },
      { word: 'cây bàng', emoji: '🌳', speech: 'cây bàng' },
      { word: 'trái dừa', emoji: '🥥', speech: 'trái dừa' },
    ],
  },
];

export const WordWorldZone: React.FC<Props> = ({ onBack, onGoHome, onPlayGame }) => {
  const [activeTab, setActiveTab] = useState<'matching' | 'windows' | 'farm' | 'themes'>('matching');
  const [matchRoundIdx, setMatchRoundIdx] = useState(0);

  // Matching pair state
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedEmojiId, setSelectedEmojiId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  // Windows state
  const [revealedWindowIds, setRevealedWindowIds] = useState<number[]>([]);

  // Farm harvest state
  const [harvestedIds, setHarvestedIds] = useState<number[]>([]);

  const currentPairs = MATCHING_ROUNDS[matchRoundIdx];

  const handleSelectWord = (id: string, text: string) => {
    audioManager.speak(text);
    if (selectedEmojiId) {
      if (id === selectedEmojiId) {
        // Matched!
        setMatchedIds((prev) => [...prev, id]);
        setSelectedWordId(null);
        setSelectedEmojiId(null);
        audioManager.playSoundEffect('correct');
        if (matchedIds.length + 1 === currentPairs.length) {
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        audioManager.playSoundEffect('wrong');
        setSelectedWordId(id);
      }
    } else {
      setSelectedWordId(id);
    }
  };

  const handleSelectEmoji = (id: string, text: string) => {
    audioManager.speak(text);
    if (selectedWordId) {
      if (id === selectedWordId) {
        // Matched!
        setMatchedIds((prev) => [...prev, id]);
        setSelectedWordId(null);
        setSelectedEmojiId(null);
        audioManager.playSoundEffect('correct');
        if (matchedIds.length + 1 === currentPairs.length) {
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        audioManager.playSoundEffect('wrong');
        setSelectedEmojiId(id);
      }
    } else {
      setSelectedEmojiId(id);
    }
  };

  const handleNextMatchRound = () => {
    setMatchRoundIdx((idx) => (idx + 1) % MATCHING_ROUNDS.length);
    setSelectedWordId(null);
    setSelectedEmojiId(null);
    setMatchedIds([]);
  };

  const handleToggleWindow = (id: number, word: string) => {
    if (!revealedWindowIds.includes(id)) {
      setRevealedWindowIds((prev) => [...prev, id]);
      audioManager.speak(word);
      audioManager.playSoundEffect('click');
    }
  };

  const handleHarvestCrop = (crop: typeof FARM_CROPS[0]) => {
    if (!harvestedIds.includes(crop.id)) {
      setHarvestedIds((prev) => [...prev, crop.id]);
      audioManager.playSoundEffect('correct');
      audioManager.speak(crop.speech);
      if (harvestedIds.length + 1 === FARM_CROPS.length) {
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Zone Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black mb-2">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>Khu Vực 4 • Mở Rộng Vốn Từ Ngữ Lớp 1</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <span>Thế Giới Từ Ngữ</span>
            <span className="text-3xl">🌍</span>
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm font-semibold max-w-xl mt-1 leading-relaxed">
            Khám phá kho tàng từ vựng gần gũi qua tranh ảnh thực tế, trò chơi nối từ, mở ô cửa bí mật và nông trại thu hoạch chữ.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer border border-white/30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>5 Khu vực</span>
            </button>
          )}

          {onGoHome && (
            <button
              onClick={onGoHome}
              className="btn-3d-yellow px-5 py-2.5 rounded-2xl text-slate-900 font-black text-xs sm:text-sm cursor-pointer shadow-md"
            >
              Về trang chủ
            </button>
          )}
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
        <button
          onClick={() => setActiveTab('matching')}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border-2 ${
            activeTab === 'matching'
              ? 'bg-violet-600 text-white border-violet-700 shadow-md ring-2 ring-violet-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Nối Từ Với Tranh</span>
        </button>

        <button
          onClick={() => setActiveTab('windows')}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border-2 ${
            activeTab === 'windows'
              ? 'bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Ô Cửa Bí Mật</span>
        </button>

        <button
          onClick={() => setActiveTab('farm')}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border-2 ${
            activeTab === 'farm'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Nông Trại Từ Ngữ</span>
        </button>

        <button
          onClick={() => setActiveTab('themes')}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border-2 ${
            activeTab === 'themes'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Từ Vựng Theo Chủ Đề</span>
        </button>
      </div>

      {/* Tab 1: Word Matching */}
      {activeTab === 'matching' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-violet-300 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-slate-100 mb-6">
            <div>
              <div className="text-xs font-black text-violet-700 uppercase">
                Vòng {matchRoundIdx + 1} / {MATCHING_ROUNDS.length}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                Bé hãy chạm thẻ từ và chạm tranh tương ứng để nối cặp đúng!
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-violet-50 px-4 py-2 rounded-2xl border border-violet-200">
              <span className="text-xs font-black text-slate-600">Đã nối:</span>
              <span className="text-base font-black text-violet-700">
                {matchedIds.length} / {currentPairs.length} cặp
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
            {/* Word Cards Column */}
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                Cột 1: Thẻ từ ngữ
              </div>
              <div className="space-y-3">
                {currentPairs.map((pair) => {
                  const isMatched = matchedIds.includes(pair.id);
                  const isSelected = selectedWordId === pair.id;

                  let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-violet-400 hover:bg-violet-50/50';
                  if (isMatched) {
                    style = 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-80 cursor-default';
                  } else if (isSelected) {
                    style = 'bg-violet-100 border-violet-600 text-violet-950 ring-4 ring-violet-300 font-black';
                  }

                  return (
                    <button
                      key={pair.id}
                      onClick={() => !isMatched && handleSelectWord(pair.id, pair.word)}
                      disabled={isMatched}
                      className={`w-full p-4 rounded-2xl border-3 flex items-center justify-between font-black text-lg transition-all cursor-pointer ${style}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{pair.word}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isMatched ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-slate-400 hover:text-violet-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emoji / Picture Cards Column */}
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                Cột 2: Tranh minh họa
              </div>
              <div className="space-y-3">
                {/* Shuffle or standard render */}
                {[...currentPairs].reverse().map((pair) => {
                  const isMatched = matchedIds.includes(pair.id);
                  const isSelected = selectedEmojiId === pair.id;

                  let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-violet-400 hover:bg-violet-50/50';
                  if (isMatched) {
                    style = 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-80 cursor-default';
                  } else if (isSelected) {
                    style = 'bg-violet-100 border-violet-600 text-violet-950 ring-4 ring-violet-300 font-black';
                  }

                  return (
                    <button
                      key={pair.id}
                      onClick={() => !isMatched && handleSelectEmoji(pair.id, pair.word)}
                      disabled={isMatched}
                      className={`w-full p-4 rounded-2xl border-3 flex items-center justify-between font-black text-lg transition-all cursor-pointer ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{pair.emoji}</span>
                        <span className="text-xs text-slate-500 font-medium">{pair.meaning}</span>
                      </div>
                      {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {matchedIds.length === currentPairs.length && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-black text-emerald-700">
                🎉 Xuất sắc! Bạn đã nối chính xác toàn bộ các từ trong vòng này!
              </span>
              <button
                onClick={handleNextMatchRound}
                className="btn-3d-yellow px-5 py-2.5 rounded-xl text-slate-900 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Chơi vòng tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Secret Windows */}
      {activeTab === 'windows' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-purple-300 shadow-lg text-center">
          <div className="max-w-xl mx-auto mb-6">
            <span className="px-3.5 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-black">
              🪟 Ô Cửa Khám Phá
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Lật Mở Ô Cửa Bí Mật
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Chạm vào từng ô cửa sổ để mở ra bức tranh và từ ngữ bí mật nhé!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
            {SECRET_WINDOWS.map((win) => {
              const isOpen = revealedWindowIds.includes(win.id);

              return (
                <div
                  key={win.id}
                  onClick={() => handleToggleWindow(win.id, win.word)}
                  className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center justify-between min-h-[220px] cursor-pointer shadow-md ${
                    isOpen
                      ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-400 scale-102'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-purple-700 text-white hover:scale-105'
                  }`}
                >
                  {!isOpen ? (
                    <div className="my-auto flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mb-3 shadow-inner">
                        🔒
                      </div>
                      <div className="font-black text-lg">Ô cửa #{win.id}</div>
                      <div className="text-xs opacity-80 mt-1">Chạm để mở nắp</div>
                    </div>
                  ) : (
                    <div className="my-auto flex flex-col items-center text-slate-800">
                      <div className="text-5xl mb-2 animate-bounce">{win.emoji}</div>
                      <div className="text-xl font-black text-purple-900 mt-1">{win.word}</div>
                      <div className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
                        {win.hint}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          audioManager.speak(win.word);
                        }}
                        className="mt-3 p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 flex items-center gap-1 text-xs font-black"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe đọc</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {revealedWindowIds.length === SECRET_WINDOWS.length && (
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 inline-flex items-center gap-2 text-purple-900 font-black text-sm">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Bé đã mở hết 4 ô cửa kỳ diệu! Thật tuyệt vời!</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Word Farm */}
      {activeTab === 'farm' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-300 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-slate-100 mb-6">
            <div>
              <span className="px-3.5 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-black">
                🚜 Nông Trại Vui Vẻ
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-2">
                Thu Hoạch Từ Ngữ Nông Trại
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                Bấm vào các loại củ quả chín mọng để thu hoạch vào giỏ và nghe Máy đọc tiếng Việt phát âm chuẩn!
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
              <span className="text-xs font-black text-slate-600">Giỏ thu hoạch:</span>
              <span className="text-base font-black text-emerald-700">
                {harvestedIds.length} / {FARM_CROPS.length} món
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-6">
            {FARM_CROPS.map((crop) => {
              const isHarvested = harvestedIds.includes(crop.id);

              return (
                <button
                  key={crop.id}
                  onClick={() => handleHarvestCrop(crop)}
                  className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-between min-h-[170px] transition-all cursor-pointer ${
                    isHarvested
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 scale-95 shadow-inner'
                      : 'bg-amber-50/50 hover:bg-amber-100/60 border-amber-300 hover:scale-105 shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-2">{crop.emoji}</div>
                  <div className="font-black text-base text-slate-800">{crop.name}</div>
                  <div className="text-[11px] font-bold text-slate-400">{crop.category}</div>

                  <div className="mt-2 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200">
                    {isHarvested ? '✅ Đã vào giỏ' : '👉 Chạm hái'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Themed Vocabulary */}
      {activeTab === 'themes' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-lg">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              Mở Rộng Vốn Từ Theo 4 Chủ Đề Lớp 1
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Bấm vào từng từ ngữ để nghe máy đọc to rõ và cùng đọc theo nhé!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {THEMED_VOCABULARY.map((themeItem, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border-3 ${themeItem.color}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">{themeItem.emoji}</span>
                  <h4 className="text-lg font-black">{themeItem.theme}</h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {themeItem.words.map((w, wIdx) => (
                    <button
                      key={wIdx}
                      onClick={() => audioManager.speak(w.speech)}
                      className="p-3 rounded-2xl bg-white hover:bg-white/90 text-slate-800 border border-current/20 flex flex-col items-center text-center shadow-xs cursor-pointer transition-transform active:scale-95"
                    >
                      <span className="text-2xl mb-1">{w.emoji}</span>
                      <span className="font-black text-xs sm:text-sm">{w.word}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked Games Showcase in Zone 4 */}
      {onPlayGame && (
        <div className="mt-8 bg-violet-50 rounded-3xl p-6 border-2 border-violet-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-slate-800 text-base sm:text-lg flex items-center gap-2">
              <span>🎮 Các trò chơi từ ngữ sẵn sàng:</span>
            </h4>
            <span className="text-xs font-extrabold text-violet-800 bg-violet-100 px-3 py-1 rounded-full">
              Chuẩn GDPT 2018
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 24, title: 'Nối từ với tranh', desc: 'Đọc từ và nối tranh tương ứng' },
              { id: 25, title: 'Ô cửa bí mật', desc: 'Mở ô cửa giải đố từ ngữ nhận sao' },
              { id: 26, title: 'Tìm từ còn thiếu', desc: 'Chọn từ hoàn thiện câu ngắn' },
              { id: 27, title: 'Tìm từ cùng chủ đề', desc: 'Phân loại từ vựng gia đình, đồ vật' },
            ].map((gm) => (
              <button
                key={gm.id}
                onClick={() => onPlayGame(gm.id)}
                className="bg-white p-4 rounded-2xl border border-violet-300 hover:border-violet-500 hover:shadow-md text-left transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="text-xs font-black text-violet-700 mb-1">Trò #{gm.id}</div>
                  <div className="font-black text-slate-800 group-hover:text-violet-700 text-sm">
                    {gm.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{gm.desc}</div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-black text-violet-600">
                  <Play className="w-3 h-3 fill-current" />
                  <span>Vào chơi ngay ➔</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
