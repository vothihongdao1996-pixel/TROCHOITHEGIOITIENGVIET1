import React from 'react';
import { Sparkles, Play, Award, CheckCircle2 } from 'lucide-react';
import { LEARNING_ZONES } from '../data/learningData';
import { MascotBee } from './illustrations/VectorIllustrations';

interface Props {
  onSelectZone: (zoneId: string) => void;
  onPlayGame: (gameId: number) => void;
}

export const MapIsland: React.FC<Props> = ({ onSelectZone, onPlayGame }) => {
  // Mapping each zone to its featured game ID
  const zoneGameMap: Record<string, number> = {
    'zone-letters': 1,
    'zone-blends': 12,
    'zone-listening': 7,
    'zone-words': 24,
    'zone-reading': 29,
    'zone-arena': 1, // falls back to review
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Map Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border-2 border-amber-300 font-extrabold px-4 py-1.5 rounded-full text-xs sm:text-sm mb-2">
          <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span>Bản Đồ Phiêu Lưu Học Tập</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
          Hành Trình Khám Phá Tiếng Việt Lớp 1
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-medium max-w-xl mx-auto mt-1">
          Theo dấu chân bạn Ong Vàng đi qua 6 vùng đất kỳ thú để học chữ, ghép vần, luyện tai và đọc trơn câu văn!
        </p>
      </div>

      {/* Interactive Path Grid */}
      <div className="relative bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 rounded-3xl p-6 sm:p-10 border-4 border-emerald-300 shadow-lg overflow-hidden">
        {/* Floating clouds & elements */}
        <div className="absolute top-6 left-10 text-3xl opacity-40 select-none">☁️</div>
        <div className="absolute top-16 right-16 text-3xl opacity-40 select-none">☁️</div>
        <div className="absolute bottom-10 left-16 text-2xl opacity-40 select-none">🌿</div>
        <div className="absolute bottom-8 right-20 text-2xl opacity-40 select-none">🌸</div>

        {/* 6 Stations arranged along an engaging pathway */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
          {LEARNING_ZONES.map((zone, idx) => {
            const featuredGameId = zoneGameMap[zone.id];
            const isReadyZone = zone.id !== 'zone-arena';

            return (
              <div
                key={zone.id}
                className="bg-white rounded-3xl p-6 border-4 border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all flex flex-col justify-between group relative"
              >
                {/* Station Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-900 font-black flex items-center justify-center text-sm shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="text-3xl p-2 bg-slate-50 rounded-2xl border border-slate-100 group-hover:scale-110 transition-transform">
                    {zone.icon}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-black text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {zone.vietnameseName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-2 leading-relaxed">
                    {zone.description}
                  </p>
                </div>

                {/* Status & CTA */}
                <div className="mt-6 pt-4 border-t-2 border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {zone.gamesCount} trò chơi
                  </span>

                  {isReadyZone ? (
                    <button
                      onClick={() => onPlayGame(featuredGameId)}
                      className="btn-3d-green px-4 py-2 rounded-xl text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Vào chơi ngay</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-300">
                      Đang hoàn thiện
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mascot guide banner at bottom of map */}
        <div className="mt-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 border-2 border-amber-300 flex items-center gap-4">
          <MascotBee className="w-14 h-14 shrink-0 animate-float" />
          <div className="text-xs sm:text-sm font-bold text-slate-700">
            <span className="font-black text-amber-700">Ong Vàng nhắc nhỏ: </span>
            Bé hãy hoàn thành các trạm từ Trạm 1 đến Trạm 5 trước để tích lũy thật nhiều ngôi sao trước khi bước vào Đấu trường Tiếng Việt nhé!
          </div>
        </div>
      </div>
    </div>
  );
};
