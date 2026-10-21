import React from 'react';
import { FillRhymeQuestion } from '../../types';
import { PedagogicalIllustration } from '../illustrations/VectorIllustrations';

interface Props {
  question: FillRhymeQuestion;
  selectedOption: string | null;
  onSelectOption: (rhyme: string) => void;
  isChecked: boolean;
}

export const FillRhymeGame: React.FC<Props> = ({
  question,
  selectedOption,
  onSelectOption,
  isChecked,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {/* Central Illustration and Incomplete Word */}
      <div className="bg-white border-4 border-amber-200 rounded-3xl p-6 shadow-md flex flex-col items-center justify-center mb-6">
        <PedagogicalIllustration name={question.imageKey} className="w-40 h-40 sm:w-48 sm:h-48 drop-shadow-sm" />

        <div className="mt-4 flex items-center gap-2 text-3xl sm:text-4xl font-black text-slate-800">
          <span>{question.wordWithBlank.replace('...', '')}</span>
          <span className="bg-amber-100 border-2 border-dashed border-amber-500 text-amber-900 px-4 py-1 rounded-2xl min-w-[70px] inline-block">
            {selectedOption || '...'}
          </span>
        </div>

        {isChecked && (
          <div className="mt-2 text-base font-bold text-emerald-700">
            Từ hoàn chỉnh: <span className="text-xl font-black">{question.fullWord}</span>
          </div>
        )}
      </div>

      <p className="text-sm font-bold text-slate-600 mb-4">
        Chọn vần đúng để điền vào chỗ chấm:
      </p>

      {/* Rhyme Choices */}
      <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
        {question.options.map((option, idx) => {
          let btnStyle = 'bg-white border-4 border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50';

          if (selectedOption === option) {
            btnStyle = 'bg-amber-100 border-4 border-amber-500 text-amber-950 shadow-md ring-4 ring-amber-200';
          }

          if (isChecked) {
            if (option === question.missingRhyme) {
              btnStyle = 'bg-emerald-100 border-4 border-emerald-500 text-emerald-900 ring-4 ring-emerald-200 shadow-md animate-gentle-pulse';
            } else if (selectedOption === option) {
              btnStyle = 'bg-rose-100 border-4 border-rose-400 text-rose-900';
            }
          }

          return (
            <button
              key={idx}
              disabled={isChecked}
              onClick={() => onSelectOption(option)}
              className={`${btnStyle} min-w-[100px] h-20 sm:h-24 px-6 rounded-3xl font-black text-3xl sm:text-4xl flex items-center justify-center cursor-pointer transition-all active:scale-95`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};
