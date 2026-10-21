import React from 'react';
import { CategoryWordsRound } from '../../data/zoneGamesData';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  round: CategoryWordsRound;
  selectedIndices: number[];
  onToggleIndex: (idx: number) => void;
  isChecked: boolean;
}

export const CategoryWordGame: React.FC<Props> = ({
  round,
  selectedIndices,
  onToggleIndex,
  isChecked,
}) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Category Theme Card */}
      <div className="p-6 bg-gradient-to-b from-purple-50 to-violet-50 rounded-3xl border-4 border-purple-300 shadow-md mb-6">
        <div className="text-5xl sm:text-6xl mb-2">{round.categoryIcon}</div>
        <div className="text-sm font-black text-purple-700 uppercase tracking-wider mb-1">
          Chủ đề: {round.categoryName}
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-800">
          {round.instruction}
        </h3>
      </div>

      {/* Words Multi-Select Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-6">
        {round.words.map((wordItem, idx) => {
          const isSelected = selectedIndices.includes(idx);
          let btnClass = 'bg-white border-slate-300 text-slate-800 hover:border-purple-400 hover:bg-purple-50';

          if (isChecked) {
            if (wordItem.isCorrect) {
              btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300';
            } else if (isSelected) {
              btnClass = 'bg-rose-100 border-rose-400 text-rose-900';
            } else {
              btnClass = 'bg-white/60 border-slate-200 text-slate-400';
            }
          } else if (isSelected) {
            btnClass = 'bg-purple-100 border-purple-500 text-purple-950 ring-4 ring-purple-300 scale-102 shadow-md';
          }

          return (
            <button
              key={idx}
              onClick={() => {
                if (!isChecked) onToggleIndex(idx);
              }}
              disabled={isChecked}
              className={`p-4 rounded-2xl border-4 font-black text-lg transition-all cursor-pointer shadow-sm flex items-center justify-between ${btnClass}`}
            >
              <span>{wordItem.text}</span>
              {isSelected && (
                <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>
      <div className="text-xs font-bold text-slate-500">
        (Bé có thể bấm chọn nhiều từ cùng thuộc nhóm nhé)
      </div>
    </div>
  );
};
