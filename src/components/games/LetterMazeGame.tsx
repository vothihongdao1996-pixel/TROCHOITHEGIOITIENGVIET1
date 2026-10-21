import React, { useState } from 'react';
import { LetterMazeQuestion, MazeGate } from '../../types';
import { MascotBee } from '../illustrations/VectorIllustrations';
import { Sparkles, MapPin, Compass, ShieldAlert, Award } from 'lucide-react';
import { audioManager } from '../../services/audioManager';

interface Props {
  question: LetterMazeQuestion;
  selectedGateIndex: number | null;
  onSelectGate: (gateIdx: number) => void;
  isChecked: boolean;
}

export const LetterMazeGame: React.FC<Props> = ({
  question,
  selectedGateIndex,
  onSelectGate,
  isChecked,
}) => {
  const [shakingGateIdx, setShakingGateIdx] = useState<number | null>(null);

  const handleGateClick = (idx: number) => {
    if (isChecked) return;
    audioManager.playSoundEffect('click');
    onSelectGate(idx);

    if (idx !== question.correctGateIndex) {
      setShakingGateIdx(idx);
      setTimeout(() => setShakingGateIdx(null), 600);
    }
  };

  const isCorrect = selectedGateIndex === question.correctGateIndex;

  return (
    <div className="w-full max-w-4xl mx-auto select-none">
      {/* 3D Maze Adventure Realm Container */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-amber-500 shadow-2xl bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 p-6 sm:p-8 text-white">
        {/* Magic Forest Atmosphere */}
        <div className="absolute top-2 left-6 text-2xl opacity-60">✨</div>
        <div className="absolute top-6 right-12 text-3xl opacity-50">🌟</div>
        <div className="absolute bottom-4 left-6 text-2xl opacity-60">🍄</div>
        <div className="absolute bottom-4 right-8 text-2xl opacity-60">💎</div>

        {/* Maze Stage & Progress Tracker Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-purple-700/80">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400 animate-spin" />
            <div>
              <h3 className="font-black text-sm sm:text-base text-amber-300">
                Mê Cung Ma Thuật Chữ o – ô – ơ
              </h3>
              <p className="text-xs text-purple-200 font-bold">
                Chặng {question.stage} / 10 • Giúp Ong Vàng mở cổng ma thuật tiến về kho báu
              </p>
            </div>
          </div>

          {/* Stepper Dots (10 stages) */}
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-purple-500/50">
            {Array.from({ length: 10 }).map((_, sIdx) => {
              const stageNum = sIdx + 1;
              const isPast = stageNum < question.stage;
              const isCurrent = stageNum === question.stage;

              return (
                <div
                  key={sIdx}
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                    isPast
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-amber-400 text-slate-950 scale-125 ring-2 ring-amber-200 shadow-md animate-pulse'
                      : 'bg-purple-950/80 text-purple-400 border border-purple-700'
                  }`}
                >
                  {isPast ? '✓' : stageNum}
                </div>
              );
            })}
            <span className="text-base ml-1">👑</span>
          </div>
        </div>

        {/* Interactive 3D Pathway & Character Stage */}
        <div className="relative w-full h-44 sm:h-52 my-3 rounded-2xl bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 border-2 border-purple-600/50 flex flex-col justify-between overflow-hidden shadow-inner p-4">
          {/* Stone Paved Winding Path */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[90%] h-14 bg-gradient-to-r from-amber-200/20 via-amber-100/30 to-amber-200/20 rounded-full border-t-2 border-b-2 border-amber-400/40 blur-[1px]" />
          </div>

          {/* Ong Vàng Character moving along the path */}
          <div
            style={{
              left: `${Math.min(90, 8 + (question.stage - 1) * 8.5)}%`,
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
          >
            <MascotBee className="w-14 h-14 sm:w-16 sm:h-16 animate-bounce drop-shadow-xl" />
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-md -mt-1">
              Ong Vàng
            </span>
          </div>

          {/* Treasure Temple at the end of the road */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 border-2 border-yellow-200 shadow-2xl flex items-center justify-center text-3xl animate-pulse">
              🏆
            </div>
            <span className="text-[10px] font-black text-amber-300 mt-1">
              Kho báu
            </span>
          </div>
        </div>

        {/* Instruction Message */}
        <div className="text-center my-2">
          <p className="inline-block bg-purple-950/90 text-amber-200 font-extrabold text-sm sm:text-base px-5 py-1.5 rounded-2xl border border-amber-400/60 shadow-md">
            Mục tiêu: Mở cánh cổng mang chữ{' '}
            <span className="text-amber-400 text-2xl font-black underline mx-1">
              {question.targetLetter}
            </span>
          </p>
        </div>

        {/* 3 Magical Arch Gates at current junction */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-4">
          {question.gates.map((gate, idx) => {
            const isSelected = selectedGateIndex === idx;
            const isGateCorrect = idx === question.correctGateIndex;
            const isShaking = shakingGateIdx === idx;

            let gateStyle =
              'bg-gradient-to-b from-purple-800 to-indigo-950 border-4 border-purple-500 hover:border-amber-400 hover:brightness-110 text-white shadow-xl';

            if (isSelected) {
              gateStyle =
                'bg-gradient-to-b from-amber-500 to-amber-700 border-4 border-yellow-300 text-slate-950 shadow-2xl ring-4 ring-amber-300/80 scale-102';
            }

            if (isChecked) {
              if (isGateCorrect) {
                gateStyle =
                  'bg-gradient-to-b from-emerald-600 to-teal-800 border-4 border-emerald-300 text-white ring-4 ring-emerald-300 shadow-2xl animate-gentle-pulse';
              } else if (isSelected) {
                gateStyle =
                  'bg-gradient-to-b from-rose-800 to-rose-950 border-4 border-rose-500 text-rose-200';
              } else {
                gateStyle = 'opacity-40 border-purple-900 bg-purple-950/50';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isChecked}
                onClick={() => handleGateClick(idx)}
                className={`relative rounded-t-[50px] rounded-b-2xl p-5 sm:p-6 flex flex-col items-center justify-between cursor-pointer transition-all duration-200 active:scale-95 ${gateStyle} ${
                  isShaking ? 'animate-bounce' : ''
                }`}
              >
                {/* Gate Arched Top Keystone */}
                <div className="w-10 h-6 bg-amber-400/80 rounded-t-lg -mt-3 flex items-center justify-center text-slate-950 font-black text-[10px] shadow-sm">
                  CỔNG
                </div>

                <div className="text-xs font-bold text-purple-200 mt-2">
                  Hướng {gate.direction}
                </div>

                {/* Big Carved Gate Letter (o, ô, or ơ) */}
                <div className="my-3 py-1">
                  <span className="text-6xl sm:text-7xl font-black drop-shadow-lg tracking-normal">
                    {gate.letter}
                  </span>
                </div>

                {/* Gate Status Label */}
                <div className="w-full text-center">
                  <span
                    className={`text-xs font-extrabold px-3 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-amber-300 text-slate-900'
                        : 'bg-black/40 text-purple-300'
                    }`}
                  >
                    {isSelected ? 'Đã chọn mở cổng này' : 'Bấm để mở cổng'}
                  </span>
                </div>

                {/* Checked Badge */}
                {isChecked && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-xl">
                    {isGateCorrect ? '✅' : isSelected ? '❌' : ''}
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
