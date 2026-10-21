import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  User,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  X,
  Users,
  PlusCircle,
  Play,
  Edit3,
} from 'lucide-react';
import { GRADE_1_CLASSES, StudentProfile } from '../types';
import { storageService } from '../services/storageService';
import { audioManager } from '../services/audioManager';
import { MascotBee, MascotTeacher } from './illustrations/VectorIllustrations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: StudentProfile;
  onProfileChanged: () => void;
  canClose?: boolean;
}

export const StudentRegisterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activeProfile,
  onProfileChanged,
  canClose = true,
}) => {
  const [fullName, setFullName] = useState(
    activeProfile && !activeProfile.id.startsWith('hs-01') && !activeProfile.id.startsWith('hs-02')
      ? activeProfile.name
      : ''
  );
  const [selectedClass, setSelectedClass] = useState<string>(activeProfile.className || '1/1');
  const [avatar, setAvatar] = useState(activeProfile.avatar || 'bee');
  const [error, setError] = useState('');
  const [isNewStudentMode, setIsNewStudentMode] = useState(false);
  const [allProfiles, setAllProfiles] = useState<StudentProfile[]>([]);

  useEffect(() => {
    if (isOpen) {
      const list = storageService.getProfiles();
      setAllProfiles(list);
      const current = storageService.getActiveProfile();

      // If switching or opening, populate fields
      if (current && !current.id.startsWith('hs-01') && !current.id.startsWith('hs-02')) {
        setFullName(current.name);
        setSelectedClass(current.className || '1/1');
        setAvatar(current.avatar || 'bee');
      } else {
        setFullName('');
        setSelectedClass('1/1');
        setAvatar('bee');
      }
      setError('');
    }
  }, [isOpen, activeProfile.id]);

  if (!isOpen) return null;

  const handleStartLearning = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = fullName.trim();

    // Strict validation: Required, cannot be only spaces, preserves Vietnamese letters
    if (!trimmed) {
      setError('Vui lòng nhập họ và tên của em! (Không chấp nhận để trống hoặc chỉ có khoảng trắng)');
      return;
    }

    if (trimmed.length < 2) {
      setError('Họ và tên của em cần có ít nhất 2 ký tự.');
      return;
    }

    // Verify class is strictly within the 26 allowed classes
    const isValidClass = GRADE_1_CLASSES.includes(selectedClass as any);
    const finalClass = isValidClass ? selectedClass : '1/1';

    // Save profile to localStorage and set active
    const savedProfile = storageService.registerOrSaveStudent(
      trimmed,
      finalClass,
      avatar,
      isNewStudentMode
    );

    // Audio cheering
    audioManager.playSoundEffect('correct');
    audioManager.speakOngVang(
      `Chào mừng bạn ${trimmed} học sinh lớp ${finalClass} bắt đầu học Tiếng Việt nhé!`
    );

    onProfileChanged();
    onClose();
  };

  const handleSwitchToProfile = (profileId: string) => {
    storageService.setActiveProfile(profileId);
    storageService.setHasCompletedStudentSetup(true);
    audioManager.playSoundEffect('click');
    const target = storageService.getActiveProfile();
    audioManager.speakOngVang(
      `Chào mừng bạn ${target.name} lớp ${target.className || '1/1'} quay trở lại học tập!`
    );
    onProfileChanged();
    onClose();
  };

  const handleCreateNewStudentClick = () => {
    setIsNewStudentMode(true);
    setFullName('');
    setSelectedClass('1/1');
    setAvatar('bee');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border-4 border-amber-300 relative my-6">
        {/* Close Button if permitted */}
        {canClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-all cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Mascot & Welcome Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-5 pb-4 border-b-2 border-amber-100">
          <div className="relative shrink-0">
            <MascotBee className="w-14 h-14 sm:w-16 sm:h-16 animate-float" mood="happy" />
            <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
              Lớp 1
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>Thế Giới Tiếng Việt Lớp 1</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1 leading-snug">
              {isNewStudentMode ? 'Thêm Học Sinh Mới' : 'Thông Tin Học Sinh Lớp 1'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">
              Nhập họ tên và chọn lớp để bắt đầu học cùng cô Đào & Ong Vàng
            </p>
          </div>
        </div>

        {/* Form Registration */}
        <form onSubmit={handleStartLearning} className="space-y-4">
          {/* 1. Họ và tên học sinh */}
          <div>
            <label className="block text-xs sm:text-sm font-black text-slate-700 mb-1">
              Họ và tên học sinh <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ví dụ: Nguyễn Văn An, Trần Mai Chi..."
                className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border-2 text-sm sm:text-base font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden transition-all ${
                  error ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 focus:border-emerald-500'
                }`}
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-semibold">
              * Bắt buộc nhập họ tên, giữ nguyên dấu tiếng Việt và không để trống.
            </p>
          </div>

          {/* 2. Chọn lớp từ 1/1 đến 1/26 */}
          <div>
            <label className="block text-xs sm:text-sm font-black text-slate-700 mb-1">
              Chọn lớp học <span className="text-rose-500">*</span> (Danh sách chính xác 26 lớp từ 1/1 đến 1/26):
            </label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 rounded-2xl border-2 border-slate-300 focus:border-emerald-500 bg-white text-sm sm:text-base font-bold text-slate-800 focus:outline-hidden transition-all cursor-pointer"
              >
                {GRADE_1_CLASSES.map((className) => (
                  <option key={className} value={className}>
                    Lớp {className}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Chọn linh vật đại diện */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1.5">
              Chọn linh vật đồng hành cùng em:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'bee', label: 'Ong Vàng', icon: '🐝' },
                { id: 'rabbit', label: 'Thỏ Con', icon: '🐰' },
                { id: 'cat', label: 'Mèo Con', icon: '🐱' },
                { id: 'bear', label: 'Gấu Con', icon: '🐻' },
                { id: 'fox', label: 'Cáo Con', icon: '🦊' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAvatar(item.id)}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
                    avatar === item.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-300 scale-105'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] font-black text-slate-700 mt-1 truncate">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-2 text-rose-700 text-xs sm:text-sm font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Big "Bắt đầu học" Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full btn-3d-yellow py-3.5 sm:py-4 rounded-2xl font-black text-slate-900 text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl hover:brightness-105 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Bắt đầu học</span>
            </button>
          </div>
        </form>

        {/* Existing Saved Students List for 1-Click Change */}
        {allProfiles.length > 0 && (
          <div className="mt-5 pt-4 border-t-2 border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-600 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Hoặc chọn học sinh đã lưu ({allProfiles.length}):</span>
              </span>

              {!isNewStudentMode ? (
                <button
                  type="button"
                  onClick={handleCreateNewStudentClick}
                  className="text-xs font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Nhập bé khác</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsNewStudentMode(false)}
                  className="text-xs font-black text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Quay lại
                </button>
              )}
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {allProfiles.map((p) => {
                const isSelected = p.id === activeProfile.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSwitchToProfile(p.id)}
                    className={`p-2.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">
                        {p.avatar === 'rabbit'
                          ? '🐰'
                          : p.avatar === 'cat'
                          ? '🐱'
                          : p.avatar === 'bear'
                          ? '🐻'
                          : p.avatar === 'fox'
                          ? '🦊'
                          : '🐝'}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-800">
                          {p.name}
                        </div>
                        <div className="text-[11px] font-bold text-emerald-700">
                          Lớp: {p.className || '1/1'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-lg">
                        ⭐ {p.stars}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Đang học
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 hover:text-emerald-700">
                          Chọn em này ➔
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
