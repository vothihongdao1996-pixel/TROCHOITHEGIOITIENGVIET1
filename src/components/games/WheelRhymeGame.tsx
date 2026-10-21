import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, RotateCw } from 'lucide-react';
import { WheelGameRound } from '../../data/zoneGamesData';
import { audioManager } from '../../services/audioManager';

interface Props {
  round: WheelGameRound;
  selectedOnset: string | null;
  selectedRhyme: string | null;
  onSelectOnset: (onset: string) => void;
  onSelectRhyme: (rhyme: string) => void;
  isChecked: boolean;
}

export const WheelRhymeGame: React.FC<Props> = ({
  round,
  selectedOnset,
  selectedRhyme,
  onSelectOnset,
  onSelectRhyme,
  isChecked,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpinRandom = () => {
    if (isChecked || isSpinning) return;
    setIsSpinning(true);
    audioManager.playSoundEffect('click');

    // Spin animation for 600ms then land on target
    setTimeout(() => {
      onSelectOnset(round.onset);
      onSelectRhyme(round.rhyme);
      setIsSpinning(false);
      audioManager.playSoundEffect('correct');
      audioManager.speak(`${round.onset} ${round.rhyme} ${round.targetWord}`);
    }, 600);
  };

  const handleSpeakCombined = () => {
    if (!selectedOnset || !selectedRhyme) return;
    audioManager.speak(`${selectedOnset} ${selectedRhyme}`);
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* 3D Wheel Stage Area */}
      <div className="relative p-6 sm:p-8 bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl border-4 border-amber-300 shadow-inner mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200 text-amber-950 rounded-full text-xs font-black mb-4">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>BÁNH XE GHÉP TIẾNG 3D</span>
        </div>

        <div className="text-sm sm:text-base font-extrabold text-slate-700 mb-6">
          Mục tiêu: Ghép thành tiếng <strong className="text-2xl text-amber-700 mx-1">"{round.targetWord}"</strong> ({round.meaning})
        </div>

        {/* Dual Wheel Visual Container */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 items-center justify-center max-w-md mx-auto my-4">
          {/* Wheel 1: Âm Đầu */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2">
              1. Bánh xe Âm Đầu
            </span>
            <div
              className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full border-6 border-amber-400 bg-white shadow-xl flex items-center justify-center relative transition-transform duration-500 ${
                isSpinning ? 'rotate-360 animate-spin' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-amber-200 border-2 border-amber-400 absolute center z-10 flex items-center justify-center text-xs font-black text-amber-900">
                ⚙️
              </div>
              <span className="text-4xl sm:text-5xl font-black text-amber-900 z-20">
                {selectedOnset || '?'}
              </span>
            </div>

            {/* Selection Chips for Onset */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {round.availableOnsets.map((onset) => (
                <button
                  key={onset}
                  onClick={() => {
                    if (!isChecked) onSelectOnset(onset);
                  }}
                  disabled={isChecked}
                  className={`w-10 h-10 rounded-xl font-black text-lg border-2 transition-all cursor-pointer ${
                    selectedOnset === onset
                      ? 'bg-amber-400 border-amber-600 text-amber-950 scale-110 shadow-md ring-2 ring-amber-300'
                      : 'bg-white border-amber-200 hover:border-amber-400 text-slate-700'
                  }`}
                >
                  {onset}
                </button>
              ))}
            </div>
          </div>

          {/* Wheel 2: Phần Vần */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-orange-900 uppercase tracking-wider mb-2">
              2. Bánh xe Vần
            </span>
            <div
              className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full border-6 border-orange-400 bg-white shadow-xl flex items-center justify-center relative transition-transform duration-500 ${
                isSpinning ? '-rotate-360 animate-spin' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-orange-200 border-2 border-orange-400 absolute center z-10 flex items-center justify-center text-xs font-black text-orange-900">
                ⚙️
              </div>
              <span className="text-4xl sm:text-5xl font-black text-orange-900 z-20">
                {selectedRhyme || '?'}
              </span>
            </div>

            {/* Selection Chips for Rhyme */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {round.availableRhymes.map((rhyme) => (
                <button
                  key={rhyme}
                  onClick={() => {
                    if (!isChecked) onSelectRhyme(rhyme);
                  }}
                  disabled={isChecked}
                  className={`w-10 h-10 rounded-xl font-black text-lg border-2 transition-all cursor-pointer ${
                    selectedRhyme === rhyme
                      ? 'bg-orange-400 border-orange-600 text-orange-950 scale-110 shadow-md ring-2 ring-orange-300'
                      : 'bg-white border-orange-200 hover:border-orange-400 text-slate-700'
                  }`}
                >
                  {rhyme}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Combined Result Output Box */}
        <div className="mt-6 pt-4 border-t-2 border-amber-200 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="p-3 sm:p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-sm flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">Tiếng ghép được:</span>
            <span className="text-3xl sm:text-4xl font-black text-amber-700 tracking-wider">
              {selectedOnset && selectedRhyme ? `${selectedOnset}${selectedRhyme}` : '...'}
            </span>
          </div>

          <button
            onClick={handleSpeakCombined}
            disabled={!selectedOnset || !selectedRhyme}
            className="px-4 py-2.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm flex items-center gap-1.5 border border-amber-400 cursor-pointer disabled:opacity-40"
          >
            <Volume2 className="w-4 h-4 text-amber-800" />
            <span>Phát âm tiếng ghép</span>
          </button>

          {!isChecked && (
            <button
              onClick={handleSpinRandom}
              disabled={isSpinning}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>Xoay bánh xe</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
