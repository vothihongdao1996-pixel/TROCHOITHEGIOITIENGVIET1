import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { TrickySoundRound } from '../../data/zoneGamesData';
import { audioManager } from '../../services/audioManager';

interface Props {
  round: TrickySoundRound;
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  isChecked: boolean;
}

export const TrickySoundGame: React.FC<Props> = ({
  round,
  selectedOption,
  onSelectOption,
  isChecked,
}) => {
  const handlePlayVoice = () => {
    audioManager.speak(round.speechText);
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Rule & Audio Header */}
      <div className="p-6 bg-gradient-to-b from-sky-50 to-blue-50 rounded-3xl border-4 border-sky-300 shadow-md mb-6">
        <div className="inline-block px-3 py-1 bg-sky-200 text-sky-900 rounded-full text-xs font-black mb-2">
          {round.ruleTitle}
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-4">
          {round.questionText}
        </h3>

        <button
          onClick={handlePlayVoice}
          className="px-6 py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black text-base sm:text-lg flex items-center gap-2 mx-auto cursor-pointer shadow-md active:scale-95 transition-all"
        >
          <Volume2 className="w-6 h-6 animate-pulse" />
          <span>Nghe phát âm chuẩn</span>
        </button>
      </div>

      {/* 2 or 3 Option Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 max-w-lg mx-auto">
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
              className={`p-6 rounded-3xl border-4 font-black text-2xl sm:text-3xl transition-all cursor-pointer shadow-sm relative ${btnClass}`}
            >
              <span className="w-8 h-8 rounded-xl bg-sky-200 text-sky-900 font-extrabold text-xs flex items-center justify-center absolute top-3 left-3">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="inline-block py-2">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
