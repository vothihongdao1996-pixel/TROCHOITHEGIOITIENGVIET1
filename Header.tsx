import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Award,
  BookOpen,
  Map,
  Home,
  Grid,
  Sliders,
  Settings2,
  X,
  Tv,
  Maximize2,
  Minimize2,
  GraduationCap,
  Trophy,
  Users,
} from 'lucide-react';
import { audioManager } from '../services/audioManager';
import { storageService } from '../services/storageService';
import { StudentProfile, ReadingSpeed } from '../types';
import { MascotBee } from './illustrations/VectorIllustrations';
import { StudentRegisterModal } from './StudentRegisterModal';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeProfile: StudentProfile;
  onProfileChanged: () => void;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onOpenStudentModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activeProfile,
  onProfileChanged,
  isPresentationMode = false,
  onTogglePresentationMode,
  isFullscreen = false,
  onToggleFullscreen,
  onOpenStudentModal,
}) => {
  const [isMuted, setIsMuted] = useState(audioManager.isMuted());
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showVoiceSettingsModal, setShowVoiceSettingsModal] = useState(false);
  const [allProfiles, setAllProfiles] = useState<StudentProfile[]>([]);
  const [newProfileName, setNewProfileName] = useState('');
  const [newAvatar, setNewAvatar] = useState('bee');

  // Voice synthesizer states
  const [readingSpeed, setReadingSpeed] = useState<ReadingSpeed>(audioManager.getSpeed());
  const [vietnameseVoices, setVietnameseVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(audioManager.getSelectedVoiceURI());
  const [hasViVoice, setHasViVoice] = useState<boolean>(audioManager.hasVietnameseVoice());

  useEffect(() => {
    setAllProfiles(storageService.getProfiles());
    const syncVoice = () => {
      setIsMuted(audioManager.isMuted());
      setReadingSpeed(audioManager.getSpeed());
      setVietnameseVoices(audioManager.getVietnameseVoices());
      setSelectedVoiceURI(audioManager.getSelectedVoiceURI());
      setHasViVoice(audioManager.hasVietnameseVoice());
    };

    syncVoice();
    const unsub = audioManager.subscribe(syncVoice);
    return unsub;
  }, []);

  const handleToggleMute = () => {
    const newState = audioManager.toggleMute();
    setIsMuted(newState);
    if (!newState) {
      audioManager.playSoundEffect('click');
    }
  };

  const handleSpeedChange = (speed: ReadingSpeed) => {
    audioManager.setSpeed(speed);
    setReadingSpeed(speed);
    audioManager.playSoundEffect('click');
  };

  const handleVoiceSelect = (uri: string) => {
    audioManager.setSelectedVoice(uri);
    setSelectedVoiceURI(uri);
    audioManager.playSoundEffect('click');
  };

  const handleTestVoice = () => {
    audioManager.speak('Xin chào các bạn! Đây là Máy đọc tiếng Việt.');
  };

  const handleSelectProfile = (id: string) => {
    storageService.setActiveProfile(id);
    onProfileChanged();
    setShowProfileModal(false);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    storageService.addProfile(newProfileName.trim(), newAvatar);
    setNewProfileName('');
    setAllProfiles(storageService.getProfiles());
    onProfileChanged();
    setShowProfileModal(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b-4 border-amber-300 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div
          onClick={() => {
            audioManager.stop();
            setCurrentTab('home');
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative">
            <MascotBee className="w-11 h-11 transform group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-white">
              Lớp 1
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-emerald-700 tracking-tight leading-tight group-hover:text-emerald-800">
              THẾ GIỚI TIẾNG VIỆT 1
            </h1>
            <p className="text-xs font-bold text-amber-600 flex items-center gap-1">
              <span>🌸 Cùng học với cô Đào & Ong Vàng</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs Desktop-First */}
        <nav className="flex items-center flex-wrap gap-1 sm:gap-2">
          <button
            onClick={() => {
              audioManager.stop();
              setCurrentTab('home');
            }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'home'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </button>

          <button
            onClick={() => {
              audioManager.stop();
              setCurrentTab('lessons');
            }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'lessons'
                ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-300'
                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Bài học</span>
          </button>

          <button
            onClick={() => {
              audioManager.stop();
              setCurrentTab('be-nghe-doc');
            }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'be-nghe-doc'
                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>Bé Nghe & Đọc</span>
          </button>

          <button
            onClick={() => {
              audioManager.stop();
              setCurrentTab('alphabet');
            }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'alphabet'
                ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-300'
                : 'text-slate-700 hover:bg-teal-50 hover:text-teal-700'
            }`}
          >
            <span className="text-base font-black">Aa</span>
            <span>29 Chữ cái</span>
          </button>

          <button
            onClick={() => {
              audioManager.stop();
              setCurrentTab('map');
            }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'map'
                ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-300'
                : 'text-slate-700 hover:bg-sky-50 hover:text-sky-700'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Hành trình</span>
          </button>

          <button
            onClick={() => {
              audioManager.stop();
              setCurrentTab('zones');
            }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'zones'
                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>5 Khu vực</span>
          </button>

          <button
            onClick={() => {
              audioManager.stop();
              setCurrentTab('games');
            }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'games'
                ? 'bg-violet-600 text-white shadow-sm ring-2 ring-violet-300'
                : 'text-slate-700 hover:bg-violet-50 hover:text-violet-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>40 Trò chơi</span>
          </button>

          <button
            onClick={() => {
              audioManager.stop();
              setCurrentTab('arena');
            }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'arena'
                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500 group-hover:text-amber-600" />
            <span>Đấu trường</span>
          </button>

          <button
            onClick={() => {
              audioManager.stop();
              setCurrentTab('reports');
            }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'reports'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Báo cáo</span>
          </button>
        </nav>

        {/* Audio Controls and Student Profile Badge */}
        <div className="flex items-center gap-2">
          {/* Máy đọc tiếng Việt Settings Button */}
          <button
            onClick={() => setShowVoiceSettingsModal(true)}
            title="Cài đặt Máy đọc tiếng Việt (Tốc độ đọc & Giọng đọc)"
            className="px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border-2 border-emerald-400 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-emerald-700" />
            <span className="hidden lg:inline">Máy đọc tiếng Việt</span>
            <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded-md font-extrabold">
              {readingSpeed === 'slow' ? 'Chậm' : readingSpeed === 'fast' ? 'Nhanh' : 'Vừa'}
            </span>
          </button>

          {/* Classroom Projector Mode Button */}
          {onTogglePresentationMode && (
            <button
              onClick={onTogglePresentationMode}
              title={isPresentationMode ? 'Thoát Chế độ Trình chiếu Lớp học' : 'Bật Chế độ Trình chiếu Lớp học (Màn hình lớn máy chiếu)'}
              className={`px-2.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all border-2 cursor-pointer ${
                isPresentationMode
                  ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span className="hidden xl:inline">{isPresentationMode ? 'Thoát Trình Chiếu' : 'Trình Chiếu'}</span>
            </button>
          )}

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Toàn màn hình máy chiếu'}
              className="p-2 rounded-xl font-bold transition-all border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer hidden sm:flex"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {/* Global Mute Button */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Đang tắt tiếng (Bấm để bật)' : 'Đang bật tiếng (Bấm để tắt)'}
            className={`p-2 rounded-xl font-bold transition-all border-2 cursor-pointer ${
              isMuted
                ? 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                : 'bg-emerald-100 text-emerald-700 border-emerald-400 hover:bg-emerald-200 animate-gentle-pulse'
            }`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Student Profile Quick View & Change Student Button */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-extrabold p-1 sm:px-2.5 sm:py-1 rounded-2xl border-b-2 border-amber-600 shadow-sm">
            <button
              onClick={() => {
                if (onOpenStudentModal) onOpenStudentModal();
                else setShowProfileModal(true);
              }}
              title="Xem thông tin học sinh"
              className="flex items-center gap-2 cursor-pointer hover:opacity-95 text-left"
            >
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm shadow-inner shrink-0">
                {activeProfile.avatar === 'rabbit' ? '🐰' : activeProfile.avatar === 'cat' ? '🐱' : activeProfile.avatar === 'bear' ? '🐻' : activeProfile.avatar === 'fox' ? '🦊' : '🐝'}
              </div>
              <div className="leading-tight">
                <span className="text-xs sm:text-sm font-black max-w-[85px] sm:max-w-[130px] truncate block">
                  {activeProfile.name}
                </span>
                <span className="text-[10px] font-black text-amber-950 bg-amber-200/90 px-1.5 py-0.2 rounded-sm inline-block">
                  Lớp {activeProfile.className || '1/1'}
                </span>
              </div>
              <div className="hidden sm:flex items-center text-xs bg-amber-600/30 px-1.5 py-0.5 rounded-md text-amber-950 font-black ml-0.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200 mr-0.5" />
                <span>{activeProfile.stars}</span>
              </div>
            </button>

            {/* Direct Change Student Button */}
            <button
              onClick={() => {
                if (onOpenStudentModal) onOpenStudentModal();
                else setShowProfileModal(true);
              }}
              title="Đổi học sinh hoặc nhập học sinh mới"
              className="px-2 py-1 bg-white/90 hover:bg-white text-slate-900 text-xs font-black rounded-xl border border-amber-400/80 transition-all cursor-pointer flex items-center gap-1 shadow-xs ml-1"
            >
              <Users className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden lg:inline">Đổi học sinh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Voice Synthesizer Settings Modal */}
      {showVoiceSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-emerald-400">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-6 h-6 text-emerald-600" />
                <h2 className="text-lg font-black text-slate-800">
                  Cài Đặt Máy Đọc Tiếng Việt
                </h2>
              </div>
              <button
                onClick={() => setShowVoiceSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black p-1 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Speech synthesis diagnosis */}
            <div className="mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <span>Trạng thái: </span>
                {hasViVoice ? (
                  <span className="text-emerald-700 font-black">Đã có giọng Tiếng Việt (vi-VN)</span>
                ) : (
                  <span className="text-amber-700 font-black">Dùng giọng mặc định hệ thống</span>
                )}
              </div>
              {!hasViVoice && (
                <p className="text-slate-500 mt-1">
                  Nếu trình duyệt chưa cài đặt giọng vi-VN, bạn có thể kiểm tra cài đặt ngôn ngữ trình duyệt hoặc hệ điều hành để thêm gói giọng tiếng Việt.
                </p>
              )}
            </div>

            {/* Voice Selection (if multiple Vietnamese voices) */}
            {vietnameseVoices.length > 1 && (
              <div className="mb-4">
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Chọn giọng đọc tiếng Việt:
                </label>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => handleVoiceSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-xs font-bold text-slate-800 bg-white"
                >
                  {vietnameseVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Speed Adjustment: Chậm, Vừa, Nhanh */}
            <div className="mb-6">
              <label className="block text-xs font-black text-slate-700 mb-2">
                Tốc độ máy đọc:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSpeedChange('slow')}
                  className={`py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    readingSpeed === 'slow'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  🐢 Chậm
                </button>
                <button
                  type="button"
                  onClick={() => handleSpeedChange('normal')}
                  className={`py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    readingSpeed === 'normal'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  🚶 Vừa (Mặc định)
                </button>
                <button
                  type="button"
                  onClick={() => handleSpeedChange('fast')}
                  className={`py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    readingSpeed === 'fast'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  🏃 Nhanh
                </button>
              </div>
            </div>

            {/* Test Listen & Close */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleTestVoice}
                className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Thử đọc mẫu</span>
              </button>

              <button
                type="button"
                onClick={() => setShowVoiceSettingsModal(false)}
                className="btn-3d-green px-5 py-2 text-white font-black text-xs rounded-xl cursor-pointer"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Register & Switcher Modal */}
      {showProfileModal && (
        <StudentRegisterModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          activeProfile={activeProfile}
          onProfileChanged={onProfileChanged}
          canClose={true}
        />
      )}
    </header>
  );
};
