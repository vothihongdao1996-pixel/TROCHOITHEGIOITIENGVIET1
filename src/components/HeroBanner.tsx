import React from 'react';
import { Sparkles, Compass, Play, BookOpen, Volume2, Trophy } from 'lucide-react';
import { StudentProfile } from '../types';
import { MascotBee, MascotTeacher } from './illustrations/VectorIllustrations';
import { audioManager } from '../services/audioManager';

interface Props {
  activeProfile: StudentProfile;
  onStartPlay: () => void;
  onOpenMap: () => void;
  onOpenAlphabet: () => void;
  onOpenPhonics: () => void;
  onOpenGames: () => void;
  onOpenAudioLab: () => void;
  onOpenLessons?: () => void;
  onOpenArena?: () => void;
  onChangeStudent?: () => void;
}

export const HeroBanner: React.FC<Props> = ({
  activeProfile,
  onStartPlay,
  onOpenMap,
  onOpenAlphabet,
  onOpenPhonics,
  onOpenGames,
  onOpenAudioLab,
  onOpenLessons,
  onOpenArena,
  onChangeStudent,
}) => {
  const handleWelcomeVoice = () => {
    audioManager.speakOngVang(
      `Xin chào bạn nhỏ ${activeProfile.name} lớp ${activeProfile.className || '1/1'}! Ong Vàng và cô Đào rất vui được đồng hành cùng con trong Thế Giới Tiếng Việt lớp 1!`
    );
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-700 text-white rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-emerald-400 my-4">
      {/* Background soft playful circles */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Welcome Copy */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-black border border-white/30 text-amber-200">
            <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>Chương trình GDPT 2018 • Bộ Kết nối tri thức</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Chào mừng <span className="text-amber-300">{activeProfile.name}</span>
            {activeProfile.className && (
              <span className="text-emerald-200 text-2xl sm:text-3xl font-black ml-2 inline-block">
                (Lớp {activeProfile.className})
              </span>
            )}{' '}
            đến với Thế Giới Tiếng Việt 1!
          </h2>

          <p className="text-slate-100 text-base sm:text-lg font-medium leading-relaxed max-w-xl">
            Cùng học bảng 29 chữ cái, luyện tai nghe âm, ghép vần, đọc tiếng và chinh phục 40 trò chơi học tập thú vị cùng <strong>cô Đào</strong>, bạn <strong>Ong Vàng</strong> và <strong>Máy đọc tiếng Việt</strong>!
          </p>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center gap-3 bg-emerald-950/40 border border-white/20 px-4 py-2.5 rounded-2xl w-fit">
            <div className="text-xs sm:text-sm font-black text-amber-200 bg-white/10 px-2.5 py-1 rounded-xl border border-white/20">
              🏫 Lớp {activeProfile.className || '1/1'}
            </div>
            <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs sm:text-sm">
              <span>⭐ {activeProfile.stars} Sao tích lũy</span>
            </div>
            <div className="w-px h-4 bg-white/30 hidden sm:block" />
            <div className="text-xs sm:text-sm font-bold text-emerald-200">
              🏅 {activeProfile.badges.length} Huy hiệu
            </div>
            {onChangeStudent && (
              <button
                onClick={onChangeStudent}
                className="text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-900 px-3 py-1 rounded-xl transition-all cursor-pointer shadow-xs ml-auto"
                title="Thay đổi thông tin học sinh hoặc chọn bạn khác"
              >
                Đổi học sinh
              </button>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center">
            <button
              onClick={onStartPlay}
              className="btn-3d-yellow px-7 py-3.5 rounded-2xl font-black text-slate-900 text-base sm:text-lg flex items-center gap-2.5 shadow-lg hover:brightness-105 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current text-slate-900" />
              <span>Chơi ngay Trò 1</span>
            </button>

            {onOpenLessons && (
              <button
                onClick={onOpenLessons}
                className="px-5 py-3.5 rounded-2xl font-black text-slate-900 bg-amber-300 hover:bg-amber-200 border-2 border-amber-400 text-base flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-emerald-800" />
                <span>Bài học GDPT 2018</span>
              </button>
            )}

            <button
              onClick={onOpenPhonics}
              className="btn-3d-green px-5 py-3.5 rounded-2xl font-black text-white text-base flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>Bé Nghe Âm – Đọc Tiếng</span>
            </button>

            <button
              onClick={onOpenAlphabet}
              className="px-5 py-3.5 rounded-2xl font-black text-white bg-white/20 hover:bg-white/30 border-2 border-white/40 text-base flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
            >
              <span className="text-lg font-black">Aa</span>
              <span>29 Chữ cái</span>
            </button>

            <button
              onClick={onOpenMap}
              className="px-5 py-3.5 rounded-2xl font-black text-white bg-white/10 hover:bg-white/25 border-2 border-white/30 text-base flex items-center gap-2 transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5" />
              <span>Hành trình</span>
            </button>

            {onOpenArena && (
              <button
                onClick={onOpenArena}
                className="px-5 py-3.5 rounded-2xl font-black text-slate-900 bg-amber-400 hover:bg-amber-300 border-2 border-amber-500 text-base flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Trophy className="w-5 h-5 text-amber-900" />
                <span>Đấu trường</span>
              </button>
            )}

            <button
              onClick={onOpenGames}
              className="px-5 py-3.5 rounded-2xl font-black text-white bg-white/10 hover:bg-white/25 border-2 border-white/30 text-base flex items-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              <span>40 Trò chơi</span>
            </button>

            <button
              onClick={handleWelcomeVoice}
              title="Bấm để nghe Ong Vàng chào bé"
              className="p-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black transition-all cursor-pointer shadow-md"
            >
              🐝 Nghe Ong Vàng chào
            </button>
          </div>
        </div>

        {/* Right Mascot Visual Presentation */}
        <div className="lg:col-span-5 flex items-center justify-center gap-4 sm:gap-6">
          {/* Teacher Dao Real Portrait Card */}
          <div className="bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-3xl p-4 sm:p-5 text-center flex flex-col items-center hover:scale-105 transition-transform shadow-lg">
            <MascotTeacher className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-md" />
            <div className="mt-2 font-black text-base text-rose-100">Cô Đào</div>
            <div className="text-xs text-slate-200 font-semibold">Đồng hành lớp 1</div>
          </div>

          {/* Mascot Bee Illustration Card */}
          <div className="bg-amber-400/20 backdrop-blur-md border-2 border-amber-300/40 rounded-3xl p-4 sm:p-5 text-center flex flex-col items-center hover:scale-105 transition-transform shadow-lg">
            <MascotBee className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-md animate-float" mood="happy" />
            <div className="mt-2 font-black text-base text-amber-200">Ong Vàng</div>
            <div className="text-xs text-slate-200 font-semibold">Bạn nhỏ động viên</div>
          </div>
        </div>
      </div>
    </div>
  );
};
