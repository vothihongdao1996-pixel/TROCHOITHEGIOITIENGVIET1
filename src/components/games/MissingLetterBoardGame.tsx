import React, { useState, useEffect } from 'react';
import { MissingLettersBoardQuestion } from '../../types';
import { VIETNAMESE_29_LETTERS } from '../../data/learningData';
import { HelpCircle, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { audioManager } from '../../services/audioManager';

interface Props {
  question: MissingLettersBoardQuestion;
  userSlots: Record<number, string>; // mapping: slot index -> selected letter
  onUpdateSlots: (slots: Record<number, string>) => void;
  isChecked: boolean;
}

export const MissingLetterBoardGame: React.FC<Props> = ({
  question,
  userSlots,
  onUpdateSlots,
  isChecked,
}) => {
  const [selectedTrayLetter, setSelectedTrayLetter] = useState<string | null>(null);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  // Set the first empty slot as active by default
  useEffect(() => {
    const firstEmpty = question.missingSlots.find((s) => !userSlots[s.index]);
    if (firstEmpty) {
      setActiveSlotIndex(firstEmpty.index);
    }
  }, [question, userSlots]);

  const missingIndexSet = new Set(question.missingSlots.map((s) => s.index));
  const missingSlotMap = new Map(question.missingSlots.map((s) => [s.index, s.correctLetter]));

  // Handling click on a missing slot in the board
  const handleSlotClick = (slotIndex: number) => {
    if (isChecked) return;
    audioManager.playSoundEffect('click');
    if (selectedTrayLetter) {
      // Place the currently selected tray letter into this slot
      const nextSlots = { ...userSlots, [slotIndex]: selectedTrayLetter };
      onUpdateSlots(nextSlots);
      setSelectedTrayLetter(null);
    } else {
      setActiveSlotIndex(slotIndex);
    }
  };

  // Handling click on a letter in the candidate tray
  const handleTrayLetterClick = (letter: string) => {
    if (isChecked) return;
    audioManager.playSoundEffect('click');

    // If a slot is currently highlighted/focused, place this letter directly into it!
    if (activeSlotIndex !== null) {
      const nextSlots = { ...userSlots, [activeSlotIndex]: letter };
      onUpdateSlots(nextSlots);

      // Advance activeSlotIndex to the next empty missing slot
      const nextEmpty = question.missingSlots.find(
        (s) => s.index !== activeSlotIndex && !nextSlots[s.index]
      );
      setActiveSlotIndex(nextEmpty ? nextEmpty.index : null);
      setSelectedTrayLetter(null);
    } else {
      setSelectedTrayLetter((prev) => (prev === letter ? null : letter));
    }
  };

  // Remove letter from slot
  const handleRemoveFromSlot = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isChecked) return;
    audioManager.playSoundEffect('click');
    const nextSlots = { ...userSlots };
    delete nextSlots[slotIndex];
    onUpdateSlots(nextSlots);
    setActiveSlotIndex(slotIndex);
  };

  return (
    <div className="w-full max-w-4xl mx-auto select-none">
      {/* 3D Wooden Interactive Alphabet Board */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-amber-600 shadow-2xl bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 p-4 sm:p-6">
        {/* Title bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b-2 border-amber-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪵</span>
            <div>
              <h3 className="font-black text-sm sm:text-base text-amber-950">
                Bảng 29 Chữ Cái Tiếng Việt Chuẩn GDPT 2018
              </h3>
              <p className="text-xs text-amber-800 font-bold">
                Có {question.missingSlots.length} ô chữ bị ẩn giấu. Con hãy điền chữ vào ô phát sáng!
              </p>
            </div>
          </div>

          <div className="text-xs font-black bg-amber-300 text-amber-950 px-3 py-1 rounded-full shadow-inner">
            Đã điền: {Object.keys(userSlots).length} / {question.missingSlots.length}
          </div>
        </div>

        {/* 29 Alphabet Tiles Grid (5 rows of 6, last row 5) */}
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-2.5 my-2">
          {VIETNAMESE_29_LETTERS.map((letterItem, idx) => {
            const isMissing = missingIndexSet.has(idx);

            if (!isMissing) {
              // Regular letter in board
              return (
                <div
                  key={letterItem.id}
                  className="h-12 sm:h-14 rounded-xl bg-white/95 border-2 border-amber-200 shadow-xs flex flex-col items-center justify-center font-black text-slate-800 transition-all hover:bg-amber-50"
                >
                  <span className="text-xl sm:text-2xl font-black leading-none">
                    {letterItem.lower}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold leading-none mt-0.5">
                    {idx + 1}
                  </span>
                </div>
              );
            }

            // Missing Slot
            const filledLetter = userSlots[idx];
            const isActive = activeSlotIndex === idx;
            const correctLetter = missingSlotMap.get(idx);
            const isCorrectSlot = filledLetter === correctLetter;

            let slotStyle =
              'border-2 border-dashed border-amber-500 bg-amber-100/80 text-amber-900 hover:border-amber-600 hover:bg-amber-200';

            if (isActive) {
              slotStyle =
                'border-3 border-amber-600 bg-amber-300 text-amber-950 ring-4 ring-amber-300/80 animate-pulse';
            }

            if (filledLetter) {
              slotStyle =
                'border-2 border-amber-500 bg-white text-slate-900 shadow-md ring-2 ring-amber-300';
            }

            if (isChecked) {
              if (isCorrectSlot) {
                slotStyle =
                  'border-3 border-emerald-500 bg-emerald-100 text-emerald-950 shadow-md ring-2 ring-emerald-300';
              } else {
                slotStyle =
                  'border-3 border-rose-500 bg-rose-100 text-rose-950 shadow-md ring-2 ring-rose-300';
              }
            }

            return (
              <button
                key={letterItem.id}
                type="button"
                disabled={isChecked}
                onClick={() => handleSlotClick(idx)}
                className={`relative h-12 sm:h-14 rounded-xl flex flex-col items-center justify-center font-black cursor-pointer transition-all ${slotStyle}`}
                title={`Vị trí #${idx + 1}`}
              >
                {filledLetter ? (
                  <>
                    <span className="text-xl sm:text-2xl font-black leading-none">
                      {filledLetter}
                    </span>
                    {!isChecked && (
                      <span
                        onClick={(e) => handleRemoveFromSlot(idx, e)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center shadow-xs"
                        title="Xoá chữ"
                      >
                        ×
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sm font-black text-amber-700 flex items-center gap-0.5">
                    <span>?</span>
                  </span>
                )}
                <span className="text-[10px] text-amber-700/70 font-bold leading-none mt-0.5">
                  #{idx + 1}
                </span>

                {/* Checked badge */}
                {isChecked && (
                  <div className="absolute -top-1 -right-1 text-xs">
                    {isCorrectSlot ? '✅' : '❌'}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Candidate Letter Tray */}
        <div className="mt-5 p-4 rounded-2xl bg-white/90 border-2 border-amber-300 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Khay Chữ Lựa Chọn (Bấm chữ để điền vào ô trống)</span>
            </span>

            {selectedTrayLetter && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Đang chọn chữ: <strong>{selectedTrayLetter}</strong>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 py-1">
            {question.options.map((letter, optIdx) => {
              const isSelected = selectedTrayLetter === letter;

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={isChecked}
                  onClick={() => handleTrayLetterClick(letter)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl font-black text-2xl sm:text-3xl flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md border-3 ${
                    isSelected
                      ? 'bg-amber-400 border-amber-600 text-slate-950 ring-4 ring-amber-300 -translate-y-1'
                      : 'bg-gradient-to-b from-white to-amber-50 border-amber-300 text-slate-800 hover:border-amber-500 hover:bg-amber-100 hover:-translate-y-0.5'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
