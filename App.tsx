/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { AlphabetGardenView } from './components/AlphabetGardenView';
import { BeNgheAmBeDocTieng } from './components/phonics/BeNgheAmBeDocTieng';
import { JourneyMap } from './components/journey/JourneyMap';
import { VietnameseArena } from './components/arena/VietnameseArena';
import { ZonesGrid } from './components/ZonesGrid';
import { GamesCatalog } from './components/GamesCatalog';
import { AudioAuditLab } from './components/AudioAuditLab';
import { TeacherReports } from './components/TeacherReports';
import { LessonsCatalogView } from './components/lessons/LessonsCatalogView';
import { LessonDetailView } from './components/lessons/LessonDetailView';
import { GamePlayer } from './components/games/GamePlayer';
import { storageService } from './services/storageService';
import { audioManager } from './services/audioManager';
import { StudentProfile, GameMetadata, LessonTopic } from './types';
import { ALL_40_GAMES } from './data/learningData';
import { GRADE_1_LESSONS } from './data/lessonsData';
import { MascotBee } from './components/illustrations/VectorIllustrations';
import { StudentRegisterModal } from './components/StudentRegisterModal';
import { Sparkles, Play, ShieldCheck, Heart, Volume2, Tv, X, BookOpen, Trophy, Compass } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'home' | 'lessons' | 'be-nghe-doc' | 'alphabet' | 'map' | 'zones' | 'games' | 'audio-lab' | 'reports' | 'arena'
  >('home');
  const [activeProfile, setActiveProfile] = useState<StudentProfile>(storageService.getActiveProfile());
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(() => !storageService.hasCompletedStudentSetup());
  const [activeGame, setActiveGame] = useState<GameMetadata | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonTopic | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setActiveProfile(storageService.getActiveProfile());

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const refreshProfile = () => {
    setActiveProfile(storageService.getActiveProfile());
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fallback or permission blocked
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleTogglePresentationMode = () => {
    const nextState = !isPresentationMode;
    setIsPresentationMode(nextState);
    if (nextState && !document.fullscreenElement) {
      // Proactively suggest or request fullscreen for optimal classroom display
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const handlePlayGame = (gameId: number) => {
    audioManager.stop();
    const targetGame = ALL_40_GAMES.find((g) => g.id === gameId);
    if (targetGame && targetGame.status === 'ready') {
      setActiveGame(targetGame);
    } else {
      alert(`Trò chơi #${gameId} đang trong quá trình phát triển hoàn thiện. Con hãy thử các trò chơi sẵn sàng nhé!`);
    }
  };

  const handleBackFromGame = () => {
    audioManager.stop();
    setActiveGame(null);
  };

  const handleStartLessonById = (lessonId: string) => {
    audioManager.stop();
    const targetLesson = GRADE_1_LESSONS.find((l) => l.id === lessonId);
    if (targetLesson) {
      setSelectedLesson(targetLesson);
      setCurrentTab('lessons');
      setActiveGame(null);
    }
  };

  return (
    <div className={`min-h-screen bg-[#f0fdf4] text-slate-800 flex flex-col selection:bg-amber-200 ${
      isPresentationMode ? 'text-lg sm:text-xl' : ''
    }`}>
      {/* Presentation Mode Notification Bar */}
      {isPresentationMode && (
        <div className="bg-slate-900 text-white px-4 py-2 border-b-2 border-amber-400 flex items-center justify-between sticky top-0 z-60 shadow-lg text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-black">
            <Tv className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300">Đang ở Chế độ Trình chiếu Lớp học (Tỉ lệ 16:9 • Phóng to chữ)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleFullscreen}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
            >
              {isFullscreen ? 'Thu nhỏ cửa sổ' : 'Toàn màn hình'}
            </button>

            <button
              onClick={handleTogglePresentationMode}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Thoát Trình chiếu</span>
            </button>
          </div>
        </div>
      )}

      {/* Universal Desktop-First Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setActiveGame(null);
          setSelectedLesson(null);
          setCurrentTab(tab as any);
        }}
        activeProfile={activeProfile}
        onProfileChanged={refreshProfile}
        isPresentationMode={isPresentationMode}
        onTogglePresentationMode={handleTogglePresentationMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeGame ? (
          <GamePlayer
            game={activeGame}
            activeProfile={activeProfile}
            onBack={handleBackFromGame}
            onViewReports={() => {
              setActiveGame(null);
              setCurrentTab('reports');
            }}
            onProfileUpdated={refreshProfile}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Hero Banner with Mascots & Welcome Audio */}
                <HeroBanner
                  activeProfile={activeProfile}
                  onStartPlay={() => handlePlayGame(1)}
                  onOpenMap={() => setCurrentTab('map')}
                  onOpenAlphabet={() => setCurrentTab('alphabet')}
                  onOpenPhonics={() => setCurrentTab('be-nghe-doc')}
                  onOpenGames={() => setCurrentTab('games')}
                  onOpenAudioLab={() => setCurrentTab('audio-lab')}
                  onOpenLessons={() => {
                    setSelectedLesson(null);
                    setCurrentTab('lessons');
                  }}
                  onOpenArena={() => setCurrentTab('arena')}
                  onChangeStudent={() => setIsStudentModalOpen(true)}
                />

                {/* 6 Featured Active Games Showcase on Home */}
                <div className="my-10">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sẵn Sàng Trải Nghiệm Ngay</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
                        6 Trò Chơi Trọng Tâm Đang Hoạt Động
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                        Mỗi trò gồm tối thiểu 10 câu hỏi mẫu được chuẩn hóa sư phạm kèm hệ thống Máy đọc tiếng Việt.
                      </p>
                    </div>

                    <button
                      onClick={() => setCurrentTab('games')}
                      className="text-xs sm:text-sm font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Xem toàn bộ 40 trò chơi ➔
                    </button>
                  </div>

                  {/* 6 Ready Game Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ALL_40_GAMES.filter((g) => g.status === 'ready').map((game) => (
                      <div
                        key={game.id}
                        className="bg-white rounded-3xl p-6 border-4 border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shadow-xs">
                              #{game.id}
                            </span>
                            <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-lg">
                              10 câu hỏi mẫu
                            </span>
                          </div>

                          <div className="text-xs font-bold text-emerald-600 mb-1">
                            {game.categoryName}
                          </div>

                          <h4 className="text-xl font-black text-slate-800 group-hover:text-emerald-700 transition-colors">
                            {game.title}
                          </h4>

                          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                            {game.description}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t-2 border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 truncate max-w-[150px]">
                            {game.targetSkill}
                          </span>

                          <button
                            onClick={() => handlePlayGame(game.id)}
                            className="btn-3d-yellow px-4 py-2 rounded-xl text-slate-900 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Vào chơi</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dual Spotlight: Hành Trình Khám Phá & Đấu Trường Tiếng Việt */}
                <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hành Trình Card */}
                  <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 rounded-3xl p-6 sm:p-8 border-4 border-emerald-300 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-sm mb-4">
                        🗺️
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-black mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>6 Chặng Phiêu Lưu Kỳ Thú</span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-800">
                        Hành Trình Khám Phá Tiếng Việt
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-2 leading-relaxed">
                        Cùng Cô Đào và bạn Ong Vàng đi qua 6 vùng đất: Vương quốc chữ cái, Khu rừng âm vần, Thành phố ghép tiếng, Khu vườn từ ngữ, Con đường đọc câu và Đảo ôn tập!
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-emerald-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800">Tích lũy sao & mở chặng</span>
                      <button
                        onClick={() => setCurrentTab('map')}
                        className="btn-3d-green px-5 py-2.5 rounded-xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Mở Bản Đồ Hành Trình ➔</span>
                      </button>
                    </div>
                  </div>

                  {/* Đấu Trường Card */}
                  <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-2xl shadow-sm mb-4">
                        🏆
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black mb-2">
                        <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        <span>3 Chế Độ • Bảng Vàng Thành Tích</span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-800">
                        Đấu Trường Tiếng Việt
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-2 leading-relaxed">
                        Tranh tài kiến thức với 3 chế độ: Luyện tập thân thiện, Thử thách đếm ngược 30s kịch tính và Ôn tập 7 dạng câu hỏi chuẩn GDPT 2018!
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-amber-200 border-t flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800">Bảng LED & điểm số thật</span>
                      <button
                        onClick={() => setCurrentTab('arena')}
                        className="btn-3d-yellow px-5 py-2.5 rounded-xl text-slate-900 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Trophy className="w-4 h-4 text-amber-800" />
                        <span>Vào Đấu Trường Tranh Tài ➔</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'lessons' && (
              selectedLesson ? (
                <LessonDetailView
                  lesson={selectedLesson}
                  activeProfile={activeProfile}
                  onBack={() => setSelectedLesson(null)}
                  onPlayGame={handlePlayGame}
                  onProfileUpdated={refreshProfile}
                  isPresentationMode={isPresentationMode}
                  onTogglePresentationMode={handleTogglePresentationMode}
                />
              ) : (
                <LessonsCatalogView
                  onSelectLesson={(lesson) => setSelectedLesson(lesson)}
                  onPlayGame={handlePlayGame}
                  isPresentationMode={isPresentationMode}
                  onTogglePresentationMode={handleTogglePresentationMode}
                />
              )
            )}

            {currentTab === 'be-nghe-doc' && (
              <BeNgheAmBeDocTieng />
            )}

            {currentTab === 'alphabet' && (
              <AlphabetGardenView
                onPlayLetterGame={() => handlePlayGame(1)}
              />
            )}

            {currentTab === 'map' && (
              <JourneyMap
                activeProfile={activeProfile}
                onGoHome={() => setCurrentTab('home')}
                onGoToArena={() => setCurrentTab('arena')}
                onProfileUpdated={refreshProfile}
              />
            )}

            {currentTab === 'arena' && (
              <VietnameseArena
                activeProfile={activeProfile}
                onGoHome={() => setCurrentTab('home')}
                onProfileUpdated={refreshProfile}
              />
            )}

            {currentTab === 'zones' && (
              <ZonesGrid
                onPlayGame={handlePlayGame}
                onGoHome={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'games' && (
              <GamesCatalog
                onPlayGame={handlePlayGame}
                onGoHome={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'audio-lab' && (
              <AudioAuditLab />
            )}

            {currentTab === 'reports' && (
              <TeacherReports
                activeProfile={activeProfile}
                onProfileUpdated={refreshProfile}
                onStartLesson={handleStartLessonById}
                isPresentationMode={isPresentationMode}
                onTogglePresentationMode={handleTogglePresentationMode}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-amber-200 py-8 px-4 sm:px-6 text-slate-600 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <MascotBee className="w-10 h-10" />
            <div>
              <div className="font-black text-sm text-slate-800">
                THẾ GIỚI TIẾNG VIỆT LỚP 1 – CÙNG HỌC VỚI CÔ ĐÀO
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                Theo định hướng Chương trình GDPT 2018 • Sách Tiếng Việt 1 (Kết nối tri thức với cuộc sống)
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Lưu trữ cục bộ an toàn
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Volume2 className="w-4 h-4 text-sky-600" />
              Máy đọc tiếng Việt (Web Speech API)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              Dành cho học sinh 6–7 tuổi
            </span>
          </div>
        </div>
      </footer>

      {/* Student Registration & Switcher Modal */}
      <StudentRegisterModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        activeProfile={activeProfile}
        onProfileChanged={refreshProfile}
        canClose={storageService.hasCompletedStudentSetup()}
      />
    </div>
  );
}
