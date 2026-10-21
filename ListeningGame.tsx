import React, { useState } from 'react';
import { Volume2, RotateCcw, Square } from 'lucide-react';
import { ListeningQuestion } from '../../types';
import { audioManager } from '../../services/audioManager';

interface Props {
  question: ListeningQuestion;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  isChecked: boolean;
}

export const ListeningGame: React.FC<Props> = ({
  question,
  selectedOption,
  onSelectOption,
  isChecked,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    setIsPlaying(true);
    // Uses single unified "Máy đọc tiếng Việt"
    audioManager.speak(question.audioPrompt, {
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handleStopAudio = () => {
    audioManager.stop();
    setIsPlaying(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {/* Big listening call-to-action button */}
      <div className="my-6 flex flex-col items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayAudio}
            className={`btn-3d-blue inline-flex items-center gap-3 px-8 py-5 rounded-3xl text-white font-black text-xl sm:text-2xl cursor-pointer hover:brightness-110 shadow-lg ${
              isPlaying ? 'animate-pulse' : 'animate-gentle-pulse'
            }`}
          >
            <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 fill-yellow-300" />
            <span>{isPlaying ? 'MÁY ĐANG ĐỌC...' : 'BẤM ĐỂ MÁY ĐỌC ÂM'}</span>
          </button>

          {isPlaying && (
            <button
              onClick={handleStopAudio}
              title="Dừng đọc"
              className="p-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl cursor-pointer"
            >
              <Square className="w-6 h-6 fill-current" />
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm font-bold text-slate-500 mt-2">
          (Con có thể bấm nghe lại nhiều lần nhé!)
        </p>
      </div>

      {/* Secret notice - pedagogical security so answer is not leaked */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 mb-6 text-sky-800 text-sm font-bold inline-block">
        🎧 Đôi tai tinh anh: Chữ hoặc tiếng nào có âm phát ra như vừa nghe?
      </div>

      {/* 4 large choice buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 my-4">
        {question.options.map((option, idx) => {
          let btnStyle = 'bg-white border-4 border-slate-200 text-slate-800 hover:border-sky-400 hover:bg-sky-50';

          if (selectedOption === idx) {
            btnStyle = 'bg-sky-100 border-4 border-sky-500 text-sky-950 shadow-md ring-4 ring-sky-200';
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
              className={`${btnStyle} h-28 sm:h-36 rounded-3xl flex flex-col items-center justify-center font-black text-4xl sm:text-5xl cursor-pointer transition-all active:scale-95`}
            >
              <span className="leading-none">{option}</span>
              <span className="text-xs font-bold text-slate-400 mt-2">
                Đáp án {idx + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
