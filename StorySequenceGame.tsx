import React from 'react';
import { Delete, Sparkles, Volume2 } from 'lucide-react';
import { StorySequenceRound } from '../../data/zoneGamesData';
import { audioManager } from '../../services/audioManager';

interface Props {
  round: StorySequenceRound;
  selectedCardIds: string[];
  onAddCard: (cardId: string) => void;
  onClearCards: () => void;
  isChecked: boolean;
}

export const StorySequenceGame: React.FC<Props> = ({
  round,
  selectedCardIds,
  onAddCard,
  onClearCards,
  isChecked,
}) => {
  const handlePlayNarration = () => {
    audioManager.speak(round.narration);
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Title */}
      <div className="p-5 bg-gradient-to-b from-rose-50 to-pink-50 rounded-3xl border-4 border-rose-300 shadow-md mb-6">
        <div className="text-xs font-black text-rose-800 uppercase tracking-wider mb-1">
          📖 Câu chuyện cổ tích:
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800">
          "{round.storyTitle}"
        </h3>
        <p className="text-xs text-slate-600 font-semibold mt-1">
          Bé hãy sắp xếp các bức tranh theo đúng thứ tự diễn biến của câu chuyện nhé!
        </p>
      </div>

      {/* Ordered Timeline Tray */}
      <div className="my-6">
        <span className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">
          Trình tự câu chuyện bé chọn:
        </span>
        <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-3xl border-4 border-rose-300 shadow-inner min-h-[140px] items-center">
          {[0, 1, 2].map((slotIdx) => {
            const cardId = selectedCardIds[slotIdx];
            const card = round.cards.find((c) => c.id === cardId);

            return (
              <div
                key={slotIdx}
                className="h-28 rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50/50 flex flex-col items-center justify-center p-2 relative overflow-hidden"
              >
                <span className="absolute top-1 left-2 text-[10px] font-black text-rose-400">
                  Bước {slotIdx + 1}
                </span>
                {card ? (
                  <div className="flex flex-col items-center animate-fade-in">
                    <span className="text-3xl mb-1">{card.emoji}</span>
                    <span className="text-[11px] font-black text-slate-800 line-clamp-2 leading-tight">
                      {card.text}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Trống</span>
                )}
              </div>
            );
          })}
        </div>

        {selectedCardIds.length > 0 && !isChecked && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={onClearCards}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Delete className="w-4 h-4" />
              <span>Xóa lựa chọn xếp lại</span>
            </button>
          </div>
        )}
      </div>

      {/* Available Shuffled Cards to Tap */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {round.cards.map((card) => {
          const isSelected = selectedCardIds.includes(card.id);

          return (
            <button
              key={card.id}
              onClick={() => onAddCard(card.id)}
              disabled={isChecked || isSelected}
              className={`p-4 rounded-2xl border-4 text-center transition-all ${
                isSelected
                  ? 'bg-slate-200 border-slate-300 opacity-40 cursor-not-allowed'
                  : 'bg-white hover:bg-rose-50 border-rose-300 cursor-pointer shadow-sm active:scale-95'
              }`}
            >
              <div className="text-4xl mb-2">{card.emoji}</div>
              <div className="text-xs font-black text-slate-800">{card.text}</div>
            </button>
          );
        })}
      </div>

      {/* Narration playback button if checked */}
      {isChecked && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handlePlayNarration}
            className="px-5 py-2.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-950 font-black text-xs sm:text-sm flex items-center gap-2 border border-rose-300 cursor-pointer shadow-xs"
          >
            <Volume2 className="w-4 h-4 text-rose-700" />
            <span>Nghe lại lời kể câu chuyện</span>
          </button>
        </div>
      )}
    </div>
  );
};
