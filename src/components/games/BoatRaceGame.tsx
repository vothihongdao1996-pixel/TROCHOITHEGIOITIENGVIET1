import React from 'react';
import { BoatRaceRound } from '../../data/zoneGamesData';
import { Flag, Waves } from 'lucide-react';

interface Props {
  round: BoatRaceRound;
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  isChecked: boolean;
  currentRoundIndex: number;
  totalRounds: number;
}

export const BoatRaceGame: React.FC<Props> = ({
  round,
  selectedOption,
  onSelectOption,
  isChecked,
  currentRoundIndex,
  totalRounds,
}) => {
  const boatProgressPercent = Math.min(100, Math.round(((currentRoundIndex + 1) / totalRounds) * 100));

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* River Race Track Scene */}
      <div className="relative p-6 sm:p-8 bg-gradient-to-b from-sky-100 via-sky-200 to-teal-100 rounded-3xl border-4 border-sky-400 shadow-inner mb-6 overflow-hidden">
        {/* Sky and clouds */}
        <div className="flex justify-between items-center text-xs font-black text-sky-800 uppercase tracking-wider mb-2">
          <span>Dòng sông đua thuyền vần an - at</span>
          <span className="flex items-center gap-1">
            <Flag className="w-4 h-4 text-rose-500" />
            <span>Đích đến</span>
          </span>
        </div>

        {/* River Track */}
        <div className="relative bg-gradient-to-r from-blue-400 via-sky-400 to-teal-400 h-28 sm:h-32 rounded-2xl border-3 border-blue-500 shadow-md flex items-center px-4 overflow-hidden">
          {/* Water Waves Animation Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none select-none text-2xl flex items-center justify-around">
            <Waves className="w-8 h-8 animate-pulse text-white" />
            <Waves className="w-8 h-8 animate-pulse text-white" />
            <Waves className="w-8 h-8 animate-pulse text-white" />
          </div>

          {/* Finish Line Ribbon */}
          <div className="absolute right-4 top-0 bottom-0 w-3 bg-repeating-linear-gradient text-white flex flex-col justify-between border-l-2 border-white">
            <span className="text-xl">🏁</span>
            <span className="text-xl">🏁</span>
          </div>

          {/* Player Boat Graphic */}
          <div
            className="absolute transition-all duration-700 ease-out flex flex-col items-center"
            style={{ left: `calc(${boatProgressPercent}% - 50px)` }}
          >
            <div className="text-4xl sm:text-5xl animate-bounce drop-shadow-md select-none">
              🛶
            </div>
            <span className="bg-amber-400 text-slate-900 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-xs border border-amber-600">
              Thuyền của Bé
            </span>
          </div>
        </div>

        {/* Progress percent note */}
        <div className="mt-3 flex justify-between items-center text-xs font-bold text-sky-900">
          <span>Xuất phát</span>
          <span>Tiến độ đua: {boatProgressPercent}%</span>
          <span>Cán đích</span>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="my-6">
        <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-4">
          {round.question}
        </h3>

        {/* Multiple Choice Option Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
          {round.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            let btnClass = 'bg-white border-slate-300 text-slate-800 hover:border-sky-400 hover:bg-sky-50';

            if (isChecked) {
              if (idx === round.correctIndex) {
                btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300 scale-102';
              } else if (isSelected) {
                btnClass = 'bg-rose-100 border-rose-400 text-rose-900';
              } else {
                btnClass = 'bg-white/60 border-slate-200 text-slate-400';
              }
            } else if (isSelected) {
              btnClass = 'bg-sky-100 border-sky-500 text-sky-950 ring-4 ring-sky-300 scale-102 shadow-md';
            }

            return (
              <button
                key={idx}
                onClick={() => {
                  if (!isChecked) onSelectOption(idx);
                }}
                disabled={isChecked}
                className={`p-4 sm:p-5 rounded-2xl border-4 font-black text-xl sm:text-2xl transition-all cursor-pointer shadow-sm ${btnClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
