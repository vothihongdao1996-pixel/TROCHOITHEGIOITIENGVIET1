import React from 'react';
import { Volume2, CheckCircle2, HelpCircle } from 'lucide-react';
import { StandardQuestion } from '../../data/extraGamesData';
import { audioManager } from '../../services/audioManager';

interface Props {
  question: StandardQuestion;
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  isChecked: boolean;
}

export const GeneralChoiceGame: React.FC<Props> = ({
  question,
  selectedOption,
  onSelectOption,
  isChecked,
}) => {
  const handleSpeakSpeech = () => {
    audioManager.speak(question.speechContent);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Central Interactive 3D Question Card */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl border-4 border-amber-300 shadow-md text-center mb-8 relative">
        {question.emoji && (
          <div className="text-6xl mb-3 animate-bounce">
            {question.emoji}
          </div>
        )}

        <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug mb-4">
          {question.instruction}
        </h3>

        {/* Listen Audio Button */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleSpeakSpeech}
            className="btn-3d-yellow px-5 py-2.5 rounded-2xl text-slate-900 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Volume2 className="w-5 h-5 text-amber-800" />
            <span>Nghe giọng đọc câu hỏi</span>
          </button>
        </div>
      </div>

      {/* 4 Interactive Answer Option Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          const letterLabel = ['A', 'B', 'C', 'D'][idx] || String(idx + 1);

          let tileClass = 'bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/50 shadow-sm';

          if (isChecked) {
            if (idx === question.correctIndex) {
              tileClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300 font-black scale-102 shadow-md';
            } else if (isSelected) {
              tileClass = 'bg-rose-100 border-rose-400 text-rose-950 font-black';
            } else {
              tileClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
            }
          } else if (isSelected) {
            tileClass = 'bg-amber-100 border-amber-500 text-amber-950 ring-4 ring-amber-300 font-black scale-102 shadow-md';
          }

          return (
            <button
              key={idx}
              onClick={() => {
                if (!isChecked) {
                  onSelectOption(idx);
                  audioManager.playSoundEffect('click');
                  audioManager.speak(opt);
                }
              }}
              disabled={isChecked}
              className={`p-5 rounded-3xl border-3 text-left font-black text-base sm:text-lg flex items-center justify-between transition-all cursor-pointer ${tileClass}`}
            >
              <div className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-2xl bg-amber-400/30 text-amber-950 flex items-center justify-center font-black text-sm shrink-0 border border-amber-400/50">
                  {letterLabel}
                </span>
                <span className="leading-snug">{opt}</span>
              </div>

              {isChecked && idx === question.correctIndex && (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
