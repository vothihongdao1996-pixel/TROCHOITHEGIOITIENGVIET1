import React, { useState, useEffect } from 'react';
import { MatchPairsQuestion } from '../../types';
import { PedagogicalIllustration } from '../illustrations/VectorIllustrations';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface Props {
  question: MatchPairsQuestion;
  // userMatches: mapping from word pair ID to selected image pair ID
  userMatches: Record<string, string>;
  onUpdateMatches: (matches: Record<string, string>) => void;
  isChecked: boolean;
}

export const MatchPairsGame: React.FC<Props> = ({
  question,
  userMatches,
  onUpdateMatches,
  isChecked,
}) => {
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [shuffledImages, setShuffledImages] = useState(question.pairs);

  // Shuffle images once per question so they aren't trivially in the same row
  useEffect(() => {
    // Reverse or alternate to guarantee different order
    const copy = [...question.pairs].reverse();
    setShuffledImages(copy);
    setSelectedWordId(null);
  }, [question.id]);

  const handleSelectWord = (pairId: string) => {
    if (isChecked) return;
    setSelectedWordId(pairId);
  };

  const handleSelectImage = (imagePairId: string) => {
    if (isChecked) return;
    if (selectedWordId) {
      // Connect selectedWordId with imagePairId
      const newMatches = { ...userMatches, [selectedWordId]: imagePairId };
      onUpdateMatches(newMatches);
      setSelectedWordId(null);
    }
  };

  const handleClear = () => {
    if (isChecked) return;
    onUpdateMatches({});
    setSelectedWordId(null);
  };

  // Color palette for connected lines/badges
  const pairColors: Record<number, string> = {
    0: 'border-blue-500 bg-blue-50 text-blue-800',
    1: 'border-purple-500 bg-purple-50 text-purple-800',
    2: 'border-amber-500 bg-amber-50 text-amber-800',
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm sm:text-base font-bold text-slate-700">
          Chạm vào <span className="text-emerald-700 font-black">Từ bên trái</span>, sau đó chạm vào <span className="text-sky-700 font-black">Tranh tương ứng bên phải</span>:
        </p>
        {!isChecked && Object.keys(userMatches).length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-100 px-3 py-1.5 rounded-xl transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Nối lại</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: Words */}
        <div className="space-y-4">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 px-2">
            Danh sách từ ngữ
          </div>
          {question.pairs.map((pair, idx) => {
            const isMatched = !!userMatches[pair.id];
            const isSelected = selectedWordId === pair.id;
            let statusClass = 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/50';

            if (isSelected) {
              statusClass = 'border-amber-500 bg-amber-100 ring-4 ring-amber-200';
            } else if (isMatched) {
              const colorIdx = idx % 3;
              statusClass = `${pairColors[colorIdx]} shadow-sm`;
            }

            if (isChecked) {
              const matchedImageId = userMatches[pair.id];
              const isCorrect = matchedImageId === pair.id;
              statusClass = isCorrect
                ? 'border-emerald-500 bg-emerald-100 text-emerald-950 font-black ring-2 ring-emerald-300'
                : 'border-rose-400 bg-rose-50 text-rose-900';
            }

            return (
              <div
                key={pair.id}
                onClick={() => handleSelectWord(pair.id)}
                className={`p-5 rounded-3xl border-4 cursor-pointer transition-all flex items-center justify-between ${statusClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black">{pair.word}</span>
                </div>
                {isMatched && (
                  <span className="text-xs font-black px-2.5 py-1 bg-white/80 rounded-xl shadow-xs">
                    Đã nối ➔
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Pictures */}
        <div className="space-y-4">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 px-2">
            Tranh minh họa
          </div>
          {shuffledImages.map((pair, idx) => {
            // Check if any word is connected to this image
            const connectedWordPairId = Object.keys(userMatches).find(
              (wId) => userMatches[wId] === pair.id
            );
            const isConnected = !!connectedWordPairId;

            let cardStyle = 'border-slate-300 bg-white hover:border-sky-400 hover:bg-sky-50/50';
            if (isConnected) {
              const originalIdx = question.pairs.findIndex((p) => p.id === connectedWordPairId);
              const colorIdx = originalIdx >= 0 ? originalIdx % 3 : 0;
              cardStyle = `${pairColors[colorIdx]} shadow-sm`;
            }

            if (isChecked && connectedWordPairId) {
              const isCorrect = connectedWordPairId === pair.id;
              cardStyle = isCorrect
                ? 'border-emerald-500 bg-emerald-100 ring-2 ring-emerald-300'
                : 'border-rose-400 bg-rose-50';
            }

            return (
              <div
                key={pair.id}
                onClick={() => handleSelectImage(pair.id)}
                className={`p-3 rounded-3xl border-4 cursor-pointer transition-all flex items-center gap-4 ${cardStyle}`}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl flex items-center justify-center p-2 border border-slate-100 shrink-0">
                  <PedagogicalIllustration name={pair.imageKey} className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-bold text-slate-700">
                    {pair.label}
                  </div>
                  {isConnected && (
                    <div className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-white/90 px-2.5 py-1 rounded-xl mt-1.5 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã ghép với một từ</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
