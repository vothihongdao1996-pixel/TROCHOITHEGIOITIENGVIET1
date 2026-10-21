import React, { useState } from 'react';
import { DetectiveLettersQuestion } from '../../types';
import { Search, Sparkles, Key, CheckCircle2 } from 'lucide-react';
import { audioManager } from '../../services/audioManager';

interface Props {
  question: DetectiveLettersQuestion;
  selectedIndices: number[];
  onToggleIndex: (index: number) => void;
  isChecked: boolean;
}

export const DetectiveLettersGame: React.FC<Props> = ({
  question,
  selectedIndices,
  onToggleIndex,
  isChecked,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleClick = (idx: number) => {
    if (isChecked) return;
    audioManager.playSoundEffect('click');
    onToggleIndex(idx);
  };

  const isCorrectChoice = (idx: number) => question.correctIndices.includes(idx);

  return (
    <div className="w-full max-w-4xl mx-auto select-none">
      {/* 3D Detective Investigation Chamber */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-indigo-500 shadow-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white">
        {/* Background Detective Atmosphere elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_25%,rgba(99,102,241,0.25),transparent_70%)] pointer-events-none" />

        {/* Header HUD: Detective Badge & Treasure Chest */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-indigo-800/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-amber-300">
              🕵️
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-300 tracking-wider">
                <Search className="w-4 h-4 text-amber-400" />
                <span>Thám Tử Chữ Cái Nhí 3D</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Nhiệm vụ: Soi tìm chữ{' '}
                <span className="text-amber-300 text-2xl font-black underline mx-1">
                  {question.targetLetter}
                </span>
              </h3>
            </div>
          </div>

          {/* Treasure Chest Indicator */}
          <div className="flex items-center gap-3 bg-indigo-900/80 px-4 py-2 rounded-2xl border-2 border-indigo-700 shadow-inner">
            <span className="text-3xl animate-bounce">
              {isChecked && selectedIndices.length > 0 ? '💎' : '🗝️'}
            </span>
            <div>
              <div className="text-[11px] font-black uppercase text-indigo-300">
                Rương Kho Báu
              </div>
              <div className="text-xs font-extrabold text-amber-300">
                {selectedIndices.length} / {question.correctIndices.length} chữ đã soi
              </div>
            </div>
          </div>
        </div>

        {/* Detective Rule / Tip Visual Reminder */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xl font-black text-emerald-400 font-vietnamese">b</span>
            <div className="text-[10px] text-slate-300 font-bold">Nét thẳng trái, bụng phải dưới</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xl font-black text-sky-400 font-vietnamese">d</span>
            <div className="text-[10px] text-slate-300 font-bold">Bụng trái dưới, nét thẳng phải</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xl font-black text-rose-400 font-vietnamese">p</span>
            <div className="text-[10px] text-slate-300 font-bold">Chân trái xuống, bụng phải trên</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xl font-black text-amber-400 font-vietnamese">q</span>
            <div className="text-[10px] text-slate-300 font-bold">Bụng trái trên, chân phải xuống</div>
          </div>
        </div>

        {/* The Detective Letter Magnifier Cards Grid */}
        <div className={`grid gap-4 sm:gap-6 my-4 ${
          question.items.length <= 4
            ? 'grid-cols-2 sm:grid-cols-4'
            : 'grid-cols-2 sm:grid-cols-3'
        }`}>
          {question.items.map((item, idx) => {
            const isSelected = selectedIndices.includes(idx);
            const isCorrect = isCorrectChoice(idx);

            let cardStyle =
              'bg-slate-800/90 border-4 border-indigo-700 text-white hover:border-amber-400 hover:bg-slate-700/90 shadow-xl';

            if (isSelected) {
              cardStyle =
                'bg-indigo-700 border-4 border-amber-400 text-amber-200 ring-4 ring-amber-400/50 shadow-2xl scale-102';
            }

            if (isChecked) {
              if (isCorrect) {
                cardStyle =
                  'bg-emerald-800 border-4 border-emerald-400 text-emerald-100 ring-4 ring-emerald-400 shadow-2xl animate-gentle-pulse';
              } else if (isSelected) {
                cardStyle =
                  'bg-rose-900 border-4 border-rose-500 text-rose-100 ring-2 ring-rose-400';
              } else {
                cardStyle = 'opacity-40 border-slate-800 bg-slate-900/60';
              }
            }

            return (
              <button
                key={item.id}
                type="button"
                disabled={isChecked}
                onClick={() => handleClick(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative h-32 sm:h-38 rounded-3xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 ${cardStyle}`}
              >
                {/* Magnifying Glass Indicator icon */}
                <div className="absolute top-2.5 left-3 flex items-center gap-1 text-xs font-bold text-slate-400">
                  <Search className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-indigo-400'}`} />
                  <span className="text-[10px]">Thẻ #{idx + 1}</span>
                </div>

                {/* Big Clear Child-Grade Letter Font */}
                <span className="text-6xl sm:text-7xl font-black tracking-normal select-none drop-shadow-md">
                  {item.letter}
                </span>

                {/* Status indicator on bottom */}
                <div className="mt-1 text-[11px] font-black">
                  {isSelected ? (
                    <span className="text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Đã soi chữ này
                    </span>
                  ) : (
                    <span className="text-slate-400">Bấm để soi</span>
                  )}
                </div>

                {/* Correct / Incorrect marker when checked */}
                {isChecked && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-lg">
                    {isCorrect ? '✅' : isSelected ? '❌' : ''}
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
