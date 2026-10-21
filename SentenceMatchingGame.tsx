import React from 'react';
import { SentenceMatchingQuestion } from '../../types';
import { PedagogicalIllustration } from '../illustrations/VectorIllustrations';

interface Props {
  question: SentenceMatchingQuestion;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  isChecked: boolean;
}

export const SentenceMatchingGame: React.FC<Props> = ({
  question,
  selectedOption,
  onSelectOption,
  isChecked,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Picture scene */}
      <div className="bg-white border-4 border-rose-200 rounded-3xl p-6 shadow-md flex flex-col items-center justify-center mb-6">
        <PedagogicalIllustration name={question.imageKey} className="w-64 h-48 sm:w-80 sm:h-56" />
        <p className="text-xs font-bold text-slate-500 mt-2 italic text-center">
          {question.imageAlt}
        </p>
      </div>

      <p className="text-sm sm:text-base font-bold text-slate-700 mb-4 text-center">
        Đọc các câu dưới đây và chọn câu phù hợp nhất với bức tranh:
      </p>

      {/* 3 Sentence Options */}
      <div className="space-y-3.5">
        {question.sentences.map((sentence, idx) => {
          let btnStyle = 'bg-white border-4 border-slate-200 text-slate-800 hover:border-rose-400 hover:bg-rose-50/50';

          if (selectedOption === idx) {
            btnStyle = 'bg-rose-100 border-4 border-rose-500 text-rose-950 shadow-md ring-4 ring-rose-200';
          }

          if (isChecked) {
            if (idx === question.correctIndex) {
              btnStyle = 'bg-emerald-100 border-4 border-emerald-500 text-emerald-950 shadow-lg ring-4 ring-emerald-200 animate-gentle-pulse';
            } else if (selectedOption === idx) {
              btnStyle = 'bg-rose-100 border-4 border-rose-400 text-rose-900';
            }
          }

          return (
            <button
              key={idx}
              disabled={isChecked}
              onClick={() => onSelectOption(idx)}
              className={`${btnStyle} w-full p-4 sm:p-5 rounded-3xl text-left font-black text-lg sm:text-xl flex items-center gap-4 cursor-pointer transition-all active:scale-[0.99]`}
            >
              <span className="w-9 h-9 rounded-2xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1 leading-snug">{sentence}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
