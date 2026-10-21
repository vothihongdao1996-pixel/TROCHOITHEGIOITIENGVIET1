import React from 'react';
import { Volume2 } from 'lucide-react';
import { ToneRecognitionRound } from '../../data/zoneGamesData';
import { audioManager } from '../../services/audioManager';

interface Props {
  round: ToneRecognitionRound;
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  isChecked: boolean;
}

export const ToneHearingGame: React.FC<Props> = ({
  round,
  selectedOption,
  onSelectOption,
  isChecked,
}) => {
  const handlePlayToneVoice = () => {
    audioManager.speak(round.speechText);
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Sound Speaker Plaque */}
      <div className="p-6 bg-gradient-to-b from-sky-50 to-blue-50 rounded-3xl border-4 border-sky-300 shadow-md mb-6">
        <div className="text-xs font-black text-sky-800 uppercase tracking-wider mb-2">
          Lắng nghe tiếng và chọn dấu thanh tương ứng:
        </div>
        <div className="text-4xl sm:text-5xl font-black text-sky-900 my-2">
          "{round.word}"
        </div>
        <button
          onClick={handlePlayToneVoice}
          className="mt-3 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 mx-auto cursor-pointer shadow-md active:scale-95 transition-all"
        >
          <Volume2 className="w-5 h-5 animate-pulse" />
          <span>Nghe lại phát âm</span>
        </button>
      </div>

      {/* 4 Tone Option Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {round.options.map((opt, idx) => {
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
              className={`p-5 rounded-2xl border-4 font-black text-xl sm:text-2xl transition-all cursor-pointer shadow-sm relative ${btnClass}`}
            >
              <span className="w-7 h-7 rounded-lg bg-sky-200 text-sky-900 font-extrabold text-xs flex items-center justify-center absolute top-2 left-2">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="inline-block py-1 px-3">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
