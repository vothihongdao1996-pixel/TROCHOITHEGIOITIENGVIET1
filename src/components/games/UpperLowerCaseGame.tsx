import React, { useState } from 'react';
import { UpperLowerPairQuestion } from '../../types';
import { Sparkles, Heart, Castle, Wand2, Flower2 } from 'lucide-react';
import { audioManager } from '../../services/audioManager';

interface Props {
  question: UpperLowerPairQuestion;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  isChecked: boolean;
}

export const UpperLowerCaseGame: React.FC<Props> = ({
  question,
  selectedOption,
  onSelectOption,
  isChecked,
}) => {
  const [draggedOverIdx, setDraggedOverIdx] = useState<number | null>(null);

  // Play sound effect on letter click
  const handleOptionClick = (idx: number) => {
    if (isChecked) return;
    onSelectOption(idx);
    audioManager.playSoundEffect('click');
  };

  return (
    <div className="w-full max-w-4xl mx-auto select-none">
      {/* Fairy Garden 3D Scenery Container */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-emerald-300 shadow-xl bg-gradient-to-b from-sky-200 via-emerald-100 to-emerald-200 p-6 sm:p-8">
        {/* Floating clouds & fairy lights */}
        <div className="absolute top-2 left-6 text-2xl opacity-60 animate-bounce">☁️</div>
        <div className="absolute top-4 right-12 text-3xl opacity-50 animate-pulse">✨</div>
        <div className="absolute bottom-3 left-4 text-2xl opacity-70">🍄</div>
        <div className="absolute bottom-3 right-6 text-2xl opacity-70">🌸</div>
        <div className="absolute top-12 left-1/4 text-xl opacity-40">🦋</div>

        {/* Fairy Castle Header */}
        <div className="flex items-center justify-center gap-2 mb-4 text-emerald-900">
          <Castle className="w-5 h-5 text-emerald-700" />
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs border border-emerald-300">
            Khu Vườn Cổ Tích Chữ Hoa & Chữ Thường
          </span>
          <Wand2 className="w-5 h-5 text-amber-600 animate-spin" />
        </div>

        {/* Central Stage: Giant 3D Upper-Case Flower Card */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative group">
            {/* 3D Glowing Flower Aura */}
            <div className="absolute -inset-3 bg-gradient-to-r from-amber-300 via-rose-300 to-emerald-300 rounded-full blur-md opacity-70 animate-pulse" />

            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-amber-100 via-white to-amber-200 border-6 border-amber-400 shadow-2xl flex flex-col items-center justify-center transform transition-transform hover:scale-105">
              <span className="text-xs font-black uppercase text-amber-700 tracking-wider mb-1">
                Chữ In Hoa
              </span>
              <span className="text-6xl sm:text-7xl font-black text-amber-900 drop-shadow-md">
                {question.targetUpper}
              </span>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-extrabold text-amber-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tìm người bạn thường</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instruction Banner */}
        <div className="text-center my-3">
          <p className="inline-block bg-white/90 backdrop-blur-xs text-slate-800 font-extrabold text-sm sm:text-base px-5 py-1.5 rounded-2xl shadow-xs border border-emerald-200">
            {question.instruction}
          </p>
        </div>

        {/* 4 Fairy Garden Flower Choices */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === question.correctIndex;

            let cardStyle =
              'bg-white/90 border-4 border-emerald-300 hover:border-amber-400 hover:bg-white text-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1';

            if (isSelected) {
              cardStyle =
                'bg-amber-100 border-4 border-amber-500 text-amber-950 shadow-xl ring-4 ring-amber-300 -translate-y-1.5';
            }

            if (isChecked) {
              if (isCorrectOption) {
                cardStyle =
                  'bg-emerald-100 border-4 border-emerald-500 text-emerald-950 shadow-2xl ring-4 ring-emerald-300 animate-gentle-pulse';
              } else if (isSelected) {
                cardStyle =
                  'bg-rose-100 border-4 border-rose-400 text-rose-900 shadow-sm';
              } else {
                cardStyle = 'opacity-50 border-slate-200 bg-white/60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isChecked}
                onClick={() => handleOptionClick(idx)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDraggedOverIdx(idx);
                }}
                onDragLeave={() => setDraggedOverIdx(null)}
                className={`relative rounded-3xl p-5 flex flex-col items-center justify-between cursor-pointer transition-all duration-200 active:scale-95 ${cardStyle}`}
              >
                {/* Flower Icon Top */}
                <div className="w-full flex items-center justify-between text-xs font-black text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Flower2 className="w-3.5 h-3.5" />
                    <span>Cánh #{idx + 1}</span>
                  </span>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>

                {/* Lowercase Letter Big Graphic */}
                <div className="my-2 py-1">
                  <span className="text-5xl sm:text-6xl font-black drop-shadow-xs">
                    {option}
                  </span>
                </div>

                {/* Subtitle / feedback badge */}
                <div className="w-full text-center">
                  <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full">
                    Chữ thường: {option}
                  </span>
                </div>

                {/* Sparkle on correct */}
                {isChecked && isCorrectOption && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg font-black text-xs">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
