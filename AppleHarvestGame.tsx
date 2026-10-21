import React, { useState } from 'react';
import { AppleHarvestQuestion, AppleItem } from '../../types';
import { MascotBee } from '../illustrations/VectorIllustrations';
import { Volume2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { audioManager } from '../../services/audioManager';

interface Props {
  question: AppleHarvestQuestion;
  selectedAppleId: number | null;
  onSelectApple: (id: number) => void;
  isChecked: boolean;
}

export const AppleHarvestGame: React.FC<Props> = ({
  question,
  selectedAppleId,
  onSelectApple,
  isChecked,
}) => {
  const [shakingAppleId, setShakingAppleId] = useState<number | null>(null);

  const handleAppleClick = (apple: AppleItem) => {
    if (isChecked) return;
    audioManager.playSoundEffect('click');
    onSelectApple(apple.id);

    if (apple.id !== question.correctAppleId) {
      setShakingAppleId(apple.id);
      setTimeout(() => setShakingAppleId(null), 600);
    }
  };

  const isCorrect = selectedAppleId === question.correctAppleId;

  return (
    <div className="w-full max-w-4xl mx-auto select-none">
      {/* 3D Apple Orchard Scenery Container */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-emerald-400 shadow-2xl bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 p-6 sm:p-8">
        {/* Sunny Orchard Sky with Sun & Fluffy Clouds */}
        <div className="absolute top-3 left-6 text-3xl animate-pulse">☀️</div>
        <div className="absolute top-4 right-10 text-2xl opacity-70">☁️</div>
        <div className="absolute top-10 left-1/3 text-xl opacity-60">☁️</div>

        {/* Orchard Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-2 border-b border-emerald-300/60">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍎</span>
            <div>
              <h3 className="font-black text-sm sm:text-base text-emerald-950">
                Vườn Táo Chữ Cái a – ă – â – ấ
              </h3>
              <p className="text-xs text-emerald-800 font-bold">
                Mục tiêu: Nhặt quả táo mang chữ{' '}
                <span className="text-rose-600 text-lg font-black bg-white px-2 py-0.5 rounded-lg border border-rose-300 shadow-xs">
                  {question.targetLetter}
                </span>{' '}
                vào giỏ!
              </p>
            </div>
          </div>

          <div className="bg-emerald-500/10 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-xl text-xs font-black">
            Nông trại chữ cái
          </div>
        </div>

        {/* The 3D Apple Tree Stage */}
        <div className="relative w-full h-[320px] sm:h-[380px] my-4 rounded-3xl bg-gradient-to-b from-sky-100/60 via-emerald-100/40 to-emerald-200/80 border-2 border-emerald-300/50 flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Tree Canopy Vector Background */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[92%] sm:w-[85%] h-[240px] sm:h-[280px] bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 rounded-[60px] sm:rounded-[80px] shadow-2xl border-4 border-emerald-600/40">
            {/* Texture leaves & highlights */}
            <div className="absolute top-4 left-6 w-20 h-20 rounded-full bg-emerald-300/40 blur-md pointer-events-none" />
            <div className="absolute top-12 right-12 w-28 h-28 rounded-full bg-emerald-300/30 blur-lg pointer-events-none" />
            <div className="absolute bottom-6 left-1/3 w-32 h-16 rounded-full bg-emerald-700/40 blur-md pointer-events-none" />
          </div>

          {/* Tree Trunk */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-24 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-t-2xl shadow-lg border-2 border-amber-950/30" />

          {/* Hanging Apples on the tree */}
          <div className="absolute inset-0 pointer-events-auto">
            {question.apples.map((apple) => {
              const isSelected = selectedAppleId === apple.id;
              const isShaking = shakingAppleId === apple.id;
              const isAppleCorrect = apple.id === question.correctAppleId;

              // If checked and correct, apple falls into basket!
              const isFalling = isChecked && isAppleCorrect;

              return (
                <div
                  key={apple.id}
                  style={{
                    position: 'absolute',
                    left: isFalling ? '25%' : `${apple.xPercent}%`,
                    top: isFalling ? '78%' : `${apple.yPercent}%`,
                    transform: isFalling
                      ? 'translate(-50%, -50%) scale(0.9)'
                      : 'translate(-50%, -50%)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  className={`z-20 ${isShaking ? 'animate-bounce' : ''}`}
                >
                  <button
                    type="button"
                    disabled={isChecked}
                    onClick={() => handleAppleClick(apple)}
                    className={`group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 shadow-xl ${
                      isSelected
                        ? 'ring-4 ring-amber-300 scale-110 shadow-2xl'
                        : 'hover:scale-105'
                    } ${
                      isChecked && isAppleCorrect
                        ? 'bg-gradient-to-b from-rose-400 via-rose-500 to-rose-700 ring-4 ring-emerald-300 animate-pulse'
                        : 'bg-gradient-to-b from-rose-400 via-red-500 to-rose-700 border-2 border-rose-300'
                    }`}
                  >
                    {/* Apple Leaf & Stem */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center">
                      <div className="w-1.5 h-3 bg-amber-900 rounded-sm" />
                      <div className="w-3.5 h-2 bg-emerald-400 rounded-full -rotate-45 -ml-1 border border-emerald-600" />
                    </div>

                    {/* Apple Highlight reflection */}
                    <div className="absolute top-2 left-2.5 w-3.5 h-3.5 bg-white/50 rounded-full blur-[1px] pointer-events-none" />

                    {/* Big Sharp Vietnamese Letter with accents */}
                    <span className="text-2xl sm:text-3xl font-black text-white drop-shadow-md select-none mt-1">
                      {apple.letter}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Ground: Mascot Ong Vàng with Basket */}
          <div className="absolute bottom-2 left-4 sm:left-12 flex items-end gap-3 z-30 pointer-events-none">
            <MascotBee className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md animate-bounce" />
            {/* 3D Woven Basket */}
            <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-b-3xl rounded-t-md bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 border-3 border-amber-800 shadow-xl flex items-center justify-center">
              <span className="text-xs font-black text-amber-950 drop-shadow-xs">
                🧺 Giỏ táo
              </span>
              {selectedAppleId && (
                <div className="absolute -top-3 right-2 text-lg">🍎</div>
              )}
            </div>
          </div>
        </div>

        {/* Selection Status Prompt */}
        <div className="text-center mt-2">
          {selectedAppleId ? (
            <span className="inline-block bg-white text-emerald-950 font-extrabold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-xs border border-emerald-200">
              Đã chọn quả táo mang chữ:{' '}
              <strong className="text-rose-600 text-base">
                {question.apples.find((a) => a.id === selectedAppleId)?.letter}
              </strong>
            </span>
          ) : (
            <span className="text-xs sm:text-sm font-bold text-emerald-800">
              👈 Bấm vào một quả táo trên cây để hái vào giỏ nhé!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
