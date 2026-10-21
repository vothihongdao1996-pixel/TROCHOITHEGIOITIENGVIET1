import React, { useState } from 'react';
import { ALL_40_GAMES } from '../data/learningData';
import { GameCategory, GameMetadata } from '../types';
import { Play, Sparkles, CheckCircle2, Clock, Filter, Home, ArrowLeft } from 'lucide-react';

interface Props {
  onPlayGame: (gameId: number) => void;
  onGoHome?: () => void;
}

export const GamesCatalog: React.FC<Props> = ({ onPlayGame, onGoHome }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ready' | GameCategory>('all');

  const categories: Array<{ id: GameCategory; name: string; count: number }> = [
    { id: 'letter-recognition', name: 'Nhận diện chữ cái', count: 6 },
    { id: 'listening-sound', name: 'Nghe & nhận diện âm', count: 5 },
    { id: 'spelling-rhymes', name: 'Ghép vần, ghép tiếng', count: 8 },
    { id: 'tones', name: 'Thanh điệu', count: 4 },
    { id: 'word-pictures', name: 'Đọc từ qua tranh', count: 5 },
    { id: 'sentence-reading', name: 'Đọc câu, hiểu câu', count: 5 },
    { id: 'comprehensive-review', name: 'Ôn tập tổng hợp', count: 7 },
  ];

  const filteredGames = ALL_40_GAMES.filter((g) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'ready') return g.status === 'ready';
    return g.category === selectedFilter;
  });

  const readyCount = ALL_40_GAMES.filter((g) => g.status === 'ready').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header with Go Home button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-900 border-2 border-violet-300 font-extrabold px-4 py-1.5 rounded-full text-xs sm:text-sm mb-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>Kho 40 Trò Chơi Học Tập Tiếng Việt 1</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Toàn Bộ 40 Trò Chơi Giáo Dục Độc Lập
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-semibold max-w-2xl mt-1 leading-relaxed">
            100% gồm 40 trò chơi đã hoạt động thực tế với 10 câu hỏi mẫu mỗi trò, thiết kế đồ họa 3D sinh động, âm thanh tiếng Việt và tích lũy sao thưởng!
          </p>
        </div>

        {onGoHome && (
          <button
            onClick={onGoHome}
            className="btn-3d-yellow px-5 py-2.5 rounded-2xl text-slate-900 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <Home className="w-4 h-4" />
            <span>Về trang chủ</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-violet-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tất cả (40)
        </button>

        <button
          onClick={() => setSelectedFilter('ready')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedFilter === 'ready'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Sẵn sàng chơi ({readyCount})</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedFilter(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === cat.id
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map((game) => {
          const isReady = game.status === 'ready';

          return (
            <div
              key={game.id}
              className={`rounded-3xl p-5 border-4 transition-all flex flex-col justify-between ${
                isReady
                  ? 'bg-white border-emerald-300 shadow-sm hover:shadow-lg hover:border-emerald-500'
                  : 'bg-slate-50/70 border-slate-200 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center">
                    #{game.id}
                  </span>

                  {isReady ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-1 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SẴN SÀNG CHƠI</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold text-xs px-2.5 py-1 rounded-xl">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Đang phát triển</span>
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-emerald-700 mb-1">
                  {game.categoryName}
                </div>
                <h3 className="text-lg font-black text-slate-800 leading-snug">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t-2 border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 truncate max-w-[170px]">
                  Kỹ năng: {game.targetSkill}
                </span>

                {isReady ? (
                  <button
                    onClick={() => onPlayGame(game.id)}
                    className="btn-3d-yellow px-4 py-2 rounded-xl font-black text-xs sm:text-sm text-slate-900 flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Chơi</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400 italic">
                    Sắp ra mắt
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
