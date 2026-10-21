import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Play,
  Volume2,
  CheckCircle2,
  Star,
  Search,
  Filter,
  ArrowRight,
  Tv,
} from 'lucide-react';
import { LessonTopic } from '../../types';
import { GRADE_1_LESSONS } from '../../data/lessonsData';
import { audioManager } from '../../services/audioManager';

interface Props {
  onSelectLesson: (lesson: LessonTopic) => void;
  onPlayGame: (gameId: number) => void;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
}

export const LessonsCatalogView: React.FC<Props> = ({
  onSelectLesson,
  onPlayGame,
  isPresentationMode = false,
  onTogglePresentationMode,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<'all' | 'hk1' | 'hk2'>('all');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const availableWeeks = Array.from(new Set(GRADE_1_LESSONS.map((l) => l.week))).sort((a, b) => a - b);
  const weeks = availableWeeks.filter((w) => {
    if (selectedSemester === 'hk1') return w <= 18;
    if (selectedSemester === 'hk2') return w >= 19;
    return true;
  });

  const filteredLessons = GRADE_1_LESSONS.filter((lesson) => {
    if (selectedSemester === 'hk1' && lesson.week > 18) return false;
    if (selectedSemester === 'hk2' && lesson.week <= 18) return false;
    if (selectedWeek !== 'all' && lesson.week !== selectedWeek) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = lesson.title.toLowerCase().includes(q);
      const matchUnit = lesson.unitTitle.toLowerCase().includes(q);
      const matchLetters = lesson.letters.some((l) => l.toLowerCase().includes(q));
      const matchWords = lesson.sampleWords.some((w) => w.word.toLowerCase().includes(q));
      return matchTitle || matchUnit || matchLetters || matchWords;
    }
    return true;
  });

  return (
    <div className={`mx-auto px-4 sm:px-6 py-6 transition-all ${isPresentationMode ? 'max-w-full' : 'max-w-7xl'}`}>
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/40 border border-emerald-300/40 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Chương Trình GDPT 2018 • Sách Kết Nối Tri Thức</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Hệ Thống Bài Học Tiếng Việt Lớp 1
            </h2>

            <p className="text-emerald-100 text-xs sm:text-sm font-semibold max-w-2xl mt-1 leading-relaxed">
              Mỗi bài học được thiết kế chuẩn mực theo 7 bước sư phạm: Khởi động ➔ Nhận biết ➔ Luyện phát âm ➔ Tương tác ➔ Trò chơi củng cố ➔ Luyện tập & đánh giá ➔ Nhận thưởng.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onTogglePresentationMode && (
              <button
                onClick={onTogglePresentationMode}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                  isPresentationMode
                    ? 'bg-rose-500 text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-900'
                }`}
                title="Bật chế độ trình chiếu lớp học trên màn hình máy chiếu"
              >
                <Tv className="w-4 h-4" />
                <span>{isPresentationMode ? 'Thoát Trình Chiếu' : 'Trình Chiếu Lớp Học'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        {/* Semester & Week Filter Bar */}
        <div className="mt-6 pt-6 border-t border-emerald-500/50 space-y-3">
          {/* Semester Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-emerald-200 uppercase tracking-wider mr-1">Học kì:</span>
            <button
              onClick={() => {
                setSelectedSemester('all');
                setSelectedWeek('all');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                selectedSemester === 'all'
                  ? 'bg-amber-400 text-slate-900 shadow-sm'
                  : 'bg-emerald-700/60 text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              Cả năm ({GRADE_1_LESSONS.length} bài)
            </button>
            <button
              onClick={() => {
                setSelectedSemester('hk1');
                setSelectedWeek('all');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                selectedSemester === 'hk1'
                  ? 'bg-amber-400 text-slate-900 shadow-sm'
                  : 'bg-emerald-700/60 text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              Học kì I (Âm & Vần • Tuần 1 - 18)
            </button>
            <button
              onClick={() => {
                setSelectedSemester('hk2');
                setSelectedWeek('all');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                selectedSemester === 'hk2'
                  ? 'bg-amber-400 text-slate-900 shadow-sm'
                  : 'bg-emerald-700/60 text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              Học kì II (Chủ điểm & Luyện đọc • Tuần 19 - 35)
            </button>
          </div>

          {/* Week Filter Pills & Search */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs font-black text-emerald-200 uppercase tracking-wider shrink-0 mr-1">Tuần:</span>
              <button
                onClick={() => setSelectedWeek('all')}
                className={`px-3 py-1 rounded-xl font-extrabold text-xs transition-all cursor-pointer shrink-0 ${
                  selectedWeek === 'all'
                    ? 'bg-white text-emerald-800 shadow-sm font-black'
                    : 'bg-emerald-700/60 text-emerald-100 hover:bg-emerald-700'
                }`}
              >
                Tất cả
              </button>

              {weeks.map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeek(w)}
                  className={`px-2.5 py-1 rounded-xl font-extrabold text-xs transition-all cursor-pointer shrink-0 ${
                    selectedWeek === w
                      ? 'bg-white text-emerald-800 shadow-sm font-black ring-2 ring-amber-300'
                      : 'bg-emerald-700/60 text-emerald-100 hover:bg-emerald-700'
                  }`}
                >
                  T{w}
                </button>
              ))}
            </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-emerald-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm chữ, vần, bài học..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-emerald-700/60 border border-emerald-500 text-white placeholder-emerald-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>
      </div>
    </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-3xl p-6 border-4 border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Unit Tag & Book Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-xl">
                  {lesson.unitTitle}
                </span>

                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  7 bước chuẩn
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 group-hover:text-emerald-700 transition-colors">
                {lesson.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {lesson.subtitle}
              </p>

              {/* Target Letters & Sample Words Preview */}
              <div className="my-4 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-800">Chữ/Âm:</span>
                  <div className="flex gap-1.5">
                    {lesson.letters.map((char) => (
                      <span
                        key={char}
                        className="w-7 h-7 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-black text-sm flex items-center justify-center shadow-xs"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-emerald-800">Từ mẫu:</span>
                  {lesson.sampleWords.slice(0, 3).map((w) => (
                    <span
                      key={w.word}
                      className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200"
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions: Start 7-step Lesson or Play Game */}
            <div className="mt-4 pt-4 border-t-2 border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onPlayGame(lesson.recommendedGameId)}
                className="text-xs font-black text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
                title={`Vào chơi nhanh: ${lesson.recommendedGameTitle}`}
              >
                <Play className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Trò chơi #{lesson.recommendedGameId}</span>
              </button>

              <button
                onClick={() => {
                  audioManager.playSoundEffect('click');
                  onSelectLesson(lesson);
                }}
                className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-900 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Học bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border-3 border-dashed border-slate-300">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-lg font-black text-slate-700">Không tìm thấy bài học phù hợp</h4>
          <p className="text-xs text-slate-400 mt-1">Con hãy thử xóa từ khóa tìm kiếm hoặc chọn tất cả các tuần nhé!</p>
        </div>
      )}
    </div>
  );
};
