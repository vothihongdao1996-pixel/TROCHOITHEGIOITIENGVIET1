import React from 'react';
import { LetterRecognitionQuestion } from '../../types';

interface Props {
  question: LetterRecognitionQuestion;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  isChecked: boolean;
}

export const LetterPickerGame: React.FC<Props> = ({
  question,
  selectedOption,
  onSelectOption,
  isChecked,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Target letter instruction badge */}
      <div className="text-center mb-6">
        <span className="inline-block bg-amber-100 text-amber-900 border-2 border-amber-300 font-extrabold px-6 py-2 rounded-2xl text-lg sm:text-xl shadow-sm">
          {question.displayPrompt}
        </span>
      </div>

      {/* 4 large child-friendly letter flower buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 my-6">
        {question.options.map((option, idx) => {
          let btnStyle = 'bg-white border-4 border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50';

          if (selectedOption === idx) {
            btnStyle = 'bg-amber-100 border-4 border-amber-500 text-amber-950 shadow-md ring-4 ring-amber-200';
          }

          if (isChecked) {
            if (idx === question.correctIndex) {
              btnStyle = 'bg-emerald-100 border-4 border-emerald-500 text-emerald-900 shadow-lg ring-4 ring-emerald-200 animate-gentle-pulse';
            } else if (selectedOption === idx) {
              btnStyle = 'bg-rose-100 border-4 border-rose-400 text-rose-900';
            }
          }

          return (
            <button
              key={idx}
              disabled={isChecked}
              onClick={() => onSelectOption(idx)}
              className={`${btnStyle} h-28 sm:h-36 rounded-3xl flex flex-col items-center justify-center font-black text-5xl sm:text-6xl cursor-pointer transition-all active:scale-95`}
            >
              <span className="leading-none">{option}</span>
              <span className="text-xs font-bold text-slate-400 mt-2">
                Ô {idx + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
