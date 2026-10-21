import React from 'react';
import { Volume2 } from 'lucide-react';
import { ListenPictureRound } from '../../data/zoneGamesData';
import { audioManager } from '../../services/audioManager';

interface Props {
  round: ListenPictureRound;
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  isChecked: boolean;
}

export const ListenPictureGame: React.FC<Props> = ({
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
      {/* Listening Speaker Card */}
      <div className="p-6 bg-gradient-to-b from-sky-50 to-blue-50 rounded-3xl border-4 border-sky-300 shadow-md mb-6">
        <div className="text-xs font-black text-sky-800 uppercase tracking-wider mb-2">
          🎧 Lắng nghe tiếng đọc và tìm bức tranh tương ứng:
        </div>
        <button
          onClick={handlePlayVoice}
          className="px-6 py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black text-base sm:text-lg flex items-center gap-2 mx-auto cursor-pointer shadow-md active:scale-95 transition-all"
        >
          <Volume2 className="w-6 h-6 animate-pulse" />
          <span>Bấm để nghe: "{round.wordToListen}"</span>
        </button>
      </div>

      {/* 4 Picture Cards */}
      <div className="grid grid-cols-2 gap-4 my-6">
        {round.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          let btnClass = 'bg-white border-slate-300 text-slate-800 hover:border-sky-400 hover:bg-sky-50';

          if (isChecked) {
            if (opt.isCorrect) {
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
              className={`p-6 rounded-3xl border-4 flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm relative ${btnClass}`}
            >
              <span className="text-6xl sm:text-7xl mb-2">{opt.emoji}</span>
              <span className="font-black text-lg sm:text-xl text-slate-800">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
