import React from 'react';
import { PhonicsBlendQuestion } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  question: PhonicsBlendQuestion;
  selectedOption: string | null;
  onSelectOption: (rhyme: string) => void;
  isChecked: boolean;
}

export const PhonicsBlendGame: React.FC<Props> = ({
  question,
  selectedOption,
  onSelectOption,
  isChecked,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {/* Phonics Equation Workshop Display */}
      <div className="bg-amber-50/80 border-4 border-amber-300 rounded-3xl p-6 sm:p-8 my-4 shadow-sm">
        <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
          {/* Initial Consonant Box */}
          <div className="bg-white border-4 border-amber-500 rounded-2xl w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center shadow-md">
            <span className="text-xs font-bold text-amber-700 uppercase">Âm đầu</span>
            <span className="text-4xl sm:text-5xl font-black text-amber-900">
              {question.initialConsonant}
            </span>
          </div>

          <span className="text-4xl font-black text-amber-600">+</span>

          {/* Rhyme Slot / Target Box */}
          <div
            className={`border-4 rounded-2xl w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center transition-all ${
              selectedOption
                ? 'bg-amber-200 border-amber-600 shadow-md ring-4 ring-amber-300'
                : 'bg-white/70 border-dashed border-slate-400'
            }`}
          >
            <span className="text-xs font-bold text-slate-500 uppercase">Vần</span>
            <span className="text-4xl sm:text-5xl font-black text-emerald-800">
              {selectedOption || '?'}
            </span>
          </div>

          <ArrowRight className="w-8 h-8 text-amber-500 hidden sm:block" />

          {/* Resulting Tiếng Box */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-4 border-emerald-600 rounded-2xl px-5 h-24 sm:h-28 flex flex-col items-center justify-center shadow-lg min-w-[100px]">
            <span className="text-xs font-bold text-emerald-100 uppercase">Tiếng tạo thành</span>
            <span className="text-4xl sm:text-5xl font-black tracking-wide">
              {selectedOption ? `${question.initialConsonant}${selectedOption}` : '...'}
            </span>
          </div>
        </div>

        {/* Word meaning display after check */}
        {isChecked && selectedOption === question.correctRhyme && (
          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2 rounded-xl font-black text-base animate-gentle-pulse">
            <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span>Ý nghĩa: {question.wordMeaning}</span>
          </div>
        )}
      </div>

      <p className="text-sm font-bold text-slate-600 mb-4">
        Chọn vần thích hợp bên dưới để ghép vào ô trống:
      </p>

      {/* Rhyme Options */}
      <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
        {question.rhymeOptions.map((rhyme, idx) => {
          let btnStyle = 'bg-white border-4 border-slate-300 text-slate-800 hover:border-amber-400 hover:bg-amber-50';

          if (selectedOption === rhyme) {
            btnStyle = 'bg-amber-100 border-4 border-amber-500 text-amber-950 shadow-md ring-4 ring-amber-200';
          }

          if (isChecked) {
            if (rhyme === question.correctRhyme) {
              btnStyle = 'bg-emerald-100 border-4 border-emerald-500 text-emerald-900 ring-4 ring-emerald-200 shadow-md';
            } else if (selectedOption === rhyme) {
              btnStyle = 'bg-rose-100 border-4 border-rose-400 text-rose-900';
            }
          }

          return (
            <button
              key={idx}
              disabled={isChecked}
              onClick={() => onSelectOption(rhyme)}
              className={`${btnStyle} w-24 h-24 sm:w-28 sm:h-28 rounded-3xl font-black text-4xl sm:text-5xl flex items-center justify-center cursor-pointer transition-all active:scale-95`}
            >
              {rhyme}
            </button>
          );
        })}
      </div>
    </div>
  );
};
