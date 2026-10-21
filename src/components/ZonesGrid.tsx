import React, { useState } from 'react';
import { LEARNING_ZONES, ALL_40_GAMES } from '../data/learningData';
import { Play, Sparkles, CheckCircle2, Clock, ArrowRight, ArrowLeft, BookOpen, Layers } from 'lucide-react';
import { AlphabetGardenView } from './AlphabetGardenView';
import { PhonicsRhymesZone } from './phonics/PhonicsRhymesZone';
import { ListeningEarsZone } from './listening/ListeningEarsZone';
import { WordWorldZone } from './words/WordWorldZone';
import { ReadingGardenZone } from './reading/ReadingGardenZone';
import { MascotBee } from './illustrations/VectorIllustrations';

interface Props {
  onPlayGame: (gameId: number) => void;
  onGoHome?: () => void;
}

export const ZonesGrid: React.FC<Props> = ({ onPlayGame, onGoHome }) => {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);

  // If a specific zone is active, render its full-featured interactive learning space
  if (activeZoneId === 'zone-letters') {
    return (
      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <button
            onClick={() => setActiveZoneId(null)}
            className="px-4 py-2 rounded-2xl bg-white border-2 border-slate-300 hover:border-emerald-400 text-slate-700 font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>Quay lại 5 Khu Vực Học Tập</span>
          </button>
        </div>
        <AlphabetGardenView onPlayLetterGame={() => onPlayGame(1)} />
      </div>
    );
  }

  if (activeZoneId === 'zone-blends') {
    return (
      <PhonicsRhymesZone
        onBack={() => setActiveZoneId(null)}
        onGoHome={onGoHome}
        onPlayGame={onPlayGame}
      />
    );
  }

  if (activeZoneId === 'zone-listening') {
    return (
      <ListeningEarsZone
        onBack={() => setActiveZoneId(null)}
        onGoHome={onGoHome}
        onPlayGame={onPlayGame}
      />
    );
  }

  if (activeZoneId === 'zone-words') {
    return (
      <WordWorldZone
        onBack={() => setActiveZoneId(null)}
        onGoHome={onGoHome}
        onPlayGame={onPlayGame}
      />
    );
  }

  if (activeZoneId === 'zone-reading') {
    return (
      <ReadingGardenZone
        onBack={() => setActiveZoneId(null)}
        onGoHome={onGoHome}
        onPlayGame={onPlayGame}
      />
    );
  }

  // Filter out any unwanted non-pedagogical arena items, ensuring exactly 5 core pedagogical learning zones
  const active5Zones = LEARNING_ZONES.filter((z) => z.id !== 'zone-arena');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Title & Introduction */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border-2 border-emerald-300 font-extrabold px-4 py-1.5 rounded-full text-xs sm:text-sm mb-3">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Hệ Thống Phân Khu Sư Phạm Lớp 1</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">
          5 Khu Vực Học Tập Trọng Tâm
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-semibold max-w-2xl mx-auto mt-2 leading-relaxed">
          Được thiết kế chuẩn hóa bám sát mục tiêu cần đạt của môn Tiếng Việt 1 (Chương trình GDPT 2018), chia thành 5 không gian học tập tương tác toàn diện.
        </p>
      </div>

      {/* 5 Zones Detailed Cards */}
      <div className="space-y-8">
        {active5Zones.map((zone, zIdx) => {
          // Find games in this zone
          const zoneGames = ALL_40_GAMES.filter((g) => g.zoneId === zone.id);
          const readyGames = zoneGames.filter((g) => g.status === 'ready');

          return (
            <div
              key={zone.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-md hover:border-amber-300 transition-all group"
            >
              {/* Zone Header with Direct Entry Button */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b-2 border-slate-100">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="text-4xl sm:text-5xl p-3.5 bg-amber-50 rounded-3xl border-2 border-amber-200 shrink-0 shadow-xs">
                    {zone.icon}
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                      Khu Vực #{zIdx + 1}
                    </div>
                    <h3 className="text-xl sm:text-3xl font-black text-slate-800 mt-0.5">
                      {zone.vietnameseName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1 max-w-xl">
                      {zone.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-xl font-black text-xs border border-emerald-200">
                    {readyGames.length} trò sẵn sàng
                  </div>

                  <button
                    onClick={() => setActiveZoneId(zone.id)}
                    className="btn-3d-green px-5 py-2.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md hover:brightness-105 active:scale-95"
                  >
                    <span>Vào khu vực học tập</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Games Grid within this Zone */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {zoneGames.map((game) => {
                  const isReady = game.status === 'ready';

                  return (
                    <div
                      key={game.id}
                      className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                        isReady
                          ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 hover:shadow-md'
                          : 'border-slate-200 bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-slate-400">
                            Trò #{game.id}
                          </span>
                          {isReady ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>SẴN SÀNG CHƠI</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Đang phát triển</span>
                            </span>
                          )}
                        </div>

                        <h4 className="font-black text-base text-slate-800">
                          {game.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {game.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 truncate max-w-[150px]">
                          {game.targetSkill}
                        </span>

                        {isReady ? (
                          <button
                            onClick={() => onPlayGame(game.id)}
                            className="btn-3d-yellow px-3.5 py-1.5 rounded-xl font-extrabold text-xs text-slate-900 flex items-center gap-1 shadow-xs cursor-pointer hover:brightness-105 active:scale-95"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Chơi ngay</span>
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
        })}
      </div>

      {/* Classroom Pedagogical Tip Footer Banner */}
      <div className="mt-10 bg-amber-50 rounded-3xl p-6 border-3 border-amber-300 flex items-center gap-4">
        <MascotBee className="w-14 h-14 shrink-0" mood="happy" />
        <div>
          <div className="font-black text-sm text-slate-800">
            Lời khuyên từ Cô Đào và Ong Vàng dành cho các bé và thầy cô:
          </div>
          <div className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5 leading-relaxed">
            Học sinh nên đi từ <strong>Khu vực 1 (Vườn chữ cái)</strong> ➔ <strong>Khu vực 2 (Xưởng ghép vần)</strong> ➔ <strong>Khu vực 3 (Tai nghe tinh)</strong> ➔ <strong>Khu vực 4 (Thế giới từ ngữ)</strong> ➔ <strong>Khu vực 5 (Vườn đọc sách)</strong> để nắm chắc kiến thức từ âm vần đến đọc câu trơn tru!
          </div>
        </div>
      </div>
    </div>
  );
};
