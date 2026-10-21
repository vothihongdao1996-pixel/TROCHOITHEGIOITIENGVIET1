import React from 'react';
import { Delete, Sparkles } from 'lucide-react';
import { ScrambleWordRound } from '../../data/zoneGamesData';

interface Props {
  round: ScrambleWordRound;
  selectedLetters: string[];
  onAddLetter: (letter: string) => void;
  onClearLetters: () => void;
  isChecked: boolean;
}

export const ScrambleTileGame: React.FC<Props> = ({
  round,
  selectedLetters,
  onAddLetter,
  onClearLetters,
  isChecked,
}) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Visual Cue Card */}
      <div className="p-6 bg-gradient-to-b from-purple-50 to-indigo-50 rounded-3xl border-4 border-indigo-300 shadow-md mb-6">
        <div className="text-6xl sm:text-7xl mb-2">{round.emoji}</div>
        <div className="text-xs font-bold text-slate-500">{round.hint}</div>
      </div>

      {/* Assembly Tray */}
      <div className="my-6">
        <span className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">
          Khay ghép tiếng của bé:
        </span>
        <div className="p-5 sm:p-6 bg-white rounded-3xl border-4 border-indigo-400 shadow-inner min-h-[90px] flex items-center justify-center gap-3">
          {selectedLetters.length === 0 ? (
            <span className="text-slate-400 font-bold italic text-sm sm:text-base">
              (Bấm các thẻ chữ bên dưới theo đúng thứ tự để xếp thành tiếng)
            </span>
          ) : (
            selectedLetters.map((l, idx) => (
              <span
                key={idx}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md animate-bounce"
              >
                {l}
              </span>
            ))
          )}
        </div>

        {selectedLetters.length > 0 && !isChecked && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={onClearLetters}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Delete className="w-4 h-4" />
              <span>Xóa lựa chọn xếp lại</span>
            </button>
          </div>
        )}
      </div>

      {/* Scrambled Tile Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        {round.scrambledLetters.map((letter, idx) => {
          const countInTray = selectedLetters.filter((l) => l === letter).length;
          // Support multiple occurrences if duplicate exists in scrambled
          const totalInRound = round.scrambledLetters.filter((l) => l === letter).length;
          const isUsed = countInTray >= totalInRound;

          return (
            <button
              key={idx}
              onClick={() => onAddLetter(letter)}
              disabled={isChecked || isUsed}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 font-black text-3xl sm:text-4xl transition-all shadow-md flex items-center justify-center ${
                isUsed
                  ? 'bg-slate-200 border-slate-300 text-slate-400 opacity-40 cursor-not-allowed'
                  : 'bg-white hover:bg-amber-100 border-amber-400 text-slate-800 cursor-pointer active:scale-95 hover:scale-105'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};
