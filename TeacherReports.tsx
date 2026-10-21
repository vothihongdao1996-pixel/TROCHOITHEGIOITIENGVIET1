import React, { useState, useEffect } from 'react';
import {
  Award,
  Sparkles,
  User,
  Trash2,
  Printer,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Database,
  BarChart2,
  Sliders,
  Settings2,
  PlusCircle,
  Users,
  Tv,
  HelpCircle,
  Save,
  RotateCcw,
  Volume2,
  Check,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { StudentProfile, PlaySession, TeacherClassSettings, GRADE_1_CLASSES } from '../types';
import { GRADE_1_LESSONS } from '../data/lessonsData';
import { audioManager } from '../services/audioManager';

interface Props {
  activeProfile: StudentProfile;
  onProfileUpdated: () => void;
  onStartLesson?: (lessonId: string) => void;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
}

export const TeacherReports: React.FC<Props> = ({
  activeProfile,
  onProfileUpdated,
  onStartLesson,
  isPresentationMode = false,
  onTogglePresentationMode,
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'students' | 'settings' | 'questions'>('reports');
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [sessions, setSessions] = useState<PlaySession[]>([]);
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>(activeProfile.id);

  // New Student Form
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('1/1');
  const [newStudentAvatar, setNewStudentAvatar] = useState('bee');

  // Teacher Class Settings State
  const [classSettings, setClassSettings] = useState<TeacherClassSettings>(() => {
    const saved = localStorage.getItem('viet1_teacher_class_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      difficulty: 'normal',
      questionCount: 10,
      isSoundEnabled: true,
      autoPlayAudioPrompt: false,
      fontSizeScale: 'large',
      selectedLessonId: 'bai-1',
    };
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setProfiles(storageService.getProfiles());
    setSessions(storageService.getSessions());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSettings = (newSettings: TeacherClassSettings) => {
    setClassSettings(newSettings);
    localStorage.setItem('viet1_teacher_class_settings', JSON.stringify(newSettings));
    showToast('Đã lưu thiết lập giảng dạy thành công!');
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    storageService.addProfile(newStudentName.trim(), newStudentClass, newStudentAvatar);
    setNewStudentName('');
    const updated = storageService.getProfiles();
    setProfiles(updated);
    onProfileUpdated();
    showToast(`Đã thêm học sinh "${newStudentName.trim()}" (Lớp ${newStudentClass}) vào danh sách!`);
  };

  const handleClearSessions = () => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa toàn bộ lịch sử các lượt chơi trên máy tính này không?')) {
      storageService.clearSessions();
      setSessions([]);
      showToast('Đã xóa sạch lịch sử các lượt chơi.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered sessions
  const studentSessions = selectedStudentFilter === 'all'
    ? sessions
    : sessions.filter((s) => s.studentId === selectedStudentFilter);

  // Aggregate metrics
  const totalCompletedSessions = studentSessions.length;
  const totalStarsGained = studentSessions.reduce((acc, s) => acc + s.starsEarned, 0);
  const totalCorrectAnswers = studentSessions.reduce((acc, s) => acc + s.correctCount, 0);
  const totalQuestionsSum = studentSessions.reduce((acc, s) => acc + s.totalQuestions, 0);
  const accuracyRate = totalQuestionsSum > 0 ? Math.round((totalCorrectAnswers / totalQuestionsSum) * 100) : 0;

  // Aggregate weak questions (nhận diện các câu học sinh thường làm sai)
  const weakQuestions: Array<{ questionText: string; count: number; lastWrongAnswer: string; correctAnswer: string }> = [];
  studentSessions.forEach((s) => {
    s.wrongAnswers.forEach((wa) => {
      const existing = weakQuestions.find((q) => q.questionText === wa.questionText);
      if (existing) {
        existing.count += 1;
      } else {
        weakQuestions.push({
          questionText: wa.questionText,
          count: 1,
          lastWrongAnswer: wa.userAnswer,
          correctAnswer: wa.correctAnswer,
        });
      }
    });
  });

  return (
    <div className={`mx-auto px-4 sm:px-6 py-6 transition-all ${isPresentationMode ? 'max-w-full' : 'max-w-6xl'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white font-black text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-900 border-2 border-indigo-300 font-extrabold px-4 py-1.5 rounded-full text-xs sm:text-sm mb-2">
            <BarChart2 className="w-4 h-4 text-indigo-600" />
            <span>Khu Vực Quản Lý Dành Cho Giáo Viên Lớp 1</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Hồ Sơ Giảng Dạy & Theo Dõi Học Sinh
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            Quản lý học sinh, điều chỉnh độ khó, tổ chức trò chơi trên lớp và theo dõi tiến bộ.
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          {onTogglePresentationMode && (
            <button
              onClick={onTogglePresentationMode}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                isPresentationMode
                  ? 'bg-rose-500 text-white'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
              title="Mở toàn màn hình trình chiếu máy chiếu cho lớp"
            >
              <Tv className="w-4 h-4" />
              <span>{isPresentationMode ? 'Thoát Trình Chiếu' : 'Trình Chiếu Lớp'}</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl bg-white border-2 border-slate-300 hover:border-indigo-500 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>In báo cáo</span>
          </button>
        </div>
      </div>

      {/* 4 Feature Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-slate-200 mb-6 overflow-x-auto pb-1 print:hidden">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Sổ Theo Dõi & Báo Cáo</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh Sách Học Sinh ({profiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Thiết Lập Dạy Học & Trò Chơi</span>
        </button>
      </div>

      {/* TAB 1: BÁO CÁO & SỔ THEO DÕI HỌC TẬP */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Offline Storage Notice */}
          <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 print:hidden">
            <Database className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 font-semibold">
              <strong>Lưu trữ cục bộ an toàn (Local Storage): </strong>
              Toàn bộ dữ liệu điểm số, số sao, câu sai và danh sách học sinh được lưu trữ cục bộ trực tiếp trên trình duyệt của máy tính này. Dữ liệu mang tính riêng tư, bảo mật và không gửi lên máy chủ internet.
            </div>
          </div>

          {/* Student Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border-4 border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-black text-slate-700">Xem báo cáo của học sinh:</span>
              <select
                value={selectedStudentFilter}
                onChange={(e) => setSelectedStudentFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border-2 border-slate-300 text-sm font-bold text-slate-800 bg-white focus:border-indigo-500 focus:outline-hidden"
              >
                <option value="all">Tất cả học sinh ({sessions.length} lượt chơi)</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {sessions.length > 0 && (
              <button
                onClick={handleClearSessions}
                className="px-3.5 py-2 rounded-xl bg-rose-50 border-2 border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa nhật ký</span>
              </button>
            )}
          </div>

          {/* Aggregated Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border-3 border-amber-300 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Sao tích lũy</div>
              <div className="text-3xl font-black text-amber-600 mt-1 flex items-center gap-1.5">
                <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <span>{totalStarsGained}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Từ các bài học và trò chơi</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border-3 border-emerald-300 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Tỷ lệ chính xác</div>
              <div className="text-3xl font-black text-emerald-600 mt-1">
                {accuracyRate}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {totalCorrectAnswers}/{totalQuestionsSum} câu đúng
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border-3 border-sky-300 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Lượt chơi hoàn thành</div>
              <div className="text-3xl font-black text-sky-600 mt-1">
                {totalCompletedSessions}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Đã kiểm tra</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border-3 border-rose-300 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Huy hiệu đạt được</div>
              <div className="text-3xl font-black text-rose-600 mt-1 flex items-center gap-1.5">
                <Award className="w-6 h-6" />
                <span>{activeProfile.badges.length}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Danh hiệu học tập</div>
            </div>
          </div>

          {/* Frequently Missed Items */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>Nội Dung Cần Lưu Ý Kèm Cặp (Các câu học sinh từng chọn sai)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-4">
              Chỉ ra chính xác âm, vần, tiếng hoặc câu nào học sinh lớp 1 cần rèn luyện thêm:
            </p>

            {weakQuestions.length === 0 ? (
              <div className="p-6 text-center bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-emerald-800 font-bold text-sm">
                🎉 Tuyệt vời! Chưa có câu hỏi nào bị làm sai nhiều lần. Học sinh nắm bài rất vững!
              </div>
            ) : (
              <div className="space-y-3">
                {weakQuestions.map((wq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50/50 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-black text-slate-800 text-sm sm:text-base">
                        {wq.questionText}
                      </div>
                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-3">
                        <span className="text-rose-600 font-bold">
                          Học sinh chọn sai: {wq.lastWrongAnswer}
                        </span>
                        <span className="text-emerald-700 font-bold">
                          Đáp án đúng: {wq.correctAnswer}
                        </span>
                      </div>
                    </div>
                    <div className="bg-amber-200 text-amber-900 px-3 py-1 rounded-xl text-xs font-black">
                      Số lần sai: {wq.count}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* History Log Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Nhật Ký Các Lượt Chơi Chi Tiết</span>
            </h3>

            {studentSessions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 font-bold text-sm">
                Chưa có lượt chơi nào được ghi nhận. Hãy bắt đầu một bài học hoặc trò chơi để theo dõi!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-semibold">
                  <thead className="bg-slate-100 text-slate-600 text-xs font-black uppercase">
                    <tr>
                      <th className="p-3 rounded-l-xl">Thời gian</th>
                      <th className="p-3">Học sinh</th>
                      <th className="p-3">Nội dung</th>
                      <th className="p-3 text-center">Đúng / Tổng</th>
                      <th className="p-3 text-center">Sao</th>
                      <th className="p-3 text-right rounded-r-xl">Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentSessions.map((s) => {
                      const student = profiles.find((p) => p.id === s.studentId);
                      const isPerfect = s.correctCount === s.totalQuestions;

                      return (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 text-slate-500 text-xs">{s.date}</td>
                          <td className="p-3 font-bold text-slate-800">
                            {student ? student.name : s.studentId}
                          </td>
                          <td className="p-3 font-black text-emerald-800">
                            {s.gameTitle}
                          </td>
                          <td className="p-3 text-center">
                            <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg text-xs font-black">
                              {s.correctCount}/{s.totalQuestions}
                            </span>
                          </td>
                          <td className="p-3 text-center font-black text-amber-600">
                            ⭐ +{s.starsEarned}
                          </td>
                          <td className="p-3 text-right">
                            {isPerfect ? (
                              <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Xuất sắc</span>
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg">
                                Hoàn thành
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: QUẢN LÝ DANH SÁCH HỌC SINH */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* Add Student Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <span>Thêm Học Sinh Mới Vào Danh Sách Lớp</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-4">
              Thầy/Cô có thể tạo hồ sơ riêng cho từng em để lưu giữ số sao, huy hiệu và theo dõi sự tiến bộ.
            </p>

            <form onSubmit={handleAddStudent} className="flex flex-wrap items-center gap-4">
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Nhập họ tên học sinh (ví dụ: Bảo An, Minh Khang...)"
                className="flex-1 min-w-[240px] px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:outline-hidden"
              />

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-600">Lớp:</span>
                <select
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value)}
                  className="px-3 py-2 rounded-2xl border-2 border-slate-300 text-sm font-bold text-slate-800 bg-white focus:border-emerald-500 focus:outline-hidden cursor-pointer"
                >
                  {GRADE_1_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      Lớp {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-600">Linh vật:</span>
                {['bee', 'rabbit', 'bear', 'cat', 'fox'].map((avatarKey) => (
                  <button
                    key={avatarKey}
                    type="button"
                    onClick={() => setNewStudentAvatar(avatarKey)}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                      newStudentAvatar === avatarKey
                        ? 'bg-amber-300 ring-2 ring-amber-500 scale-110'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {avatarKey === 'bee' ? '🐝' : avatarKey === 'rabbit' ? '🐰' : avatarKey === 'bear' ? '🐻' : avatarKey === 'cat' ? '🐱' : '🦊'}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!newStudentName.trim()}
                className="btn-3d-yellow px-5 py-2.5 rounded-2xl font-black text-sm shadow-md cursor-pointer disabled:opacity-50"
              >
                Thêm học sinh
              </button>
            </form>
          </div>

          {/* Student Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((p) => {
              const isActive = p.id === activeProfile.id;
              const studentSessionCount = sessions.filter((s) => s.studentId === p.id).length;

              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-3xl p-5 border-4 transition-all flex flex-col justify-between ${
                    isActive ? 'border-emerald-500 shadow-md ring-2 ring-emerald-200' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl border-2 border-amber-300">
                      {p.avatar === 'bee' ? '🐝' : p.avatar === 'rabbit' ? '🐰' : p.avatar === 'bear' ? '🐻' : p.avatar === 'cat' ? '🐱' : '🦊'}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-slate-800 text-base">{p.name}</h4>
                        {isActive && (
                          <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                            Đang chọn
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold mt-0.5">
                        Lớp: <strong className="text-emerald-700 font-black">{p.className || '1/1'}</strong> • Tạo: {p.createdDate}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1 text-amber-600 font-black">
                      <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
                      {p.stars} sao
                    </span>

                    <span>{studentSessionCount} lượt chơi</span>

                    {!isActive ? (
                      <button
                        onClick={() => {
                          storageService.setActiveProfile(p.id);
                          onProfileUpdated();
                          showToast(`Đã chuyển sang học sinh "${p.name}"`);
                        }}
                        className="text-emerald-700 hover:text-emerald-800 font-black hover:underline cursor-pointer"
                      >
                        Chọn em này
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-black flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Đang học
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: THIẾT LẬP DẠY HỌC & TRÒ CHƠI */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <span>Cài Đặt Chế Độ Giảng Dạy Trên Lớp</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Điều chỉnh các thông số để phù hợp với thời lượng tiết học và trình độ học sinh của lớp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* 1. Số lượng câu hỏi mỗi trò chơi */}
            <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200">
              <label className="block text-xs font-black uppercase text-slate-600 mb-2">
                1. Số lượng câu hỏi mỗi lượt chơi:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => handleSaveSettings({ ...classSettings, questionCount: count as any })}
                    className={`py-2 rounded-xl font-black text-sm transition-all cursor-pointer ${
                      classSettings.questionCount === count
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                        : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {count} câu
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Tiêu chuẩn khuyến nghị: 10 câu cho luyện tập cá nhân, 5 câu cho thi đua nhanh trên lớp.
              </p>
            </div>

            {/* 2. Độ khó trò chơi */}
            <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200">
              <label className="block text-xs font-black uppercase text-slate-600 mb-2">
                2. Mức độ khó câu hỏi:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'easy', label: 'Dễ' },
                  { key: 'normal', label: 'Vừa' },
                  { key: 'advanced', label: 'Nâng cao' },
                ].map((diff) => (
                  <button
                    key={diff.key}
                    type="button"
                    onClick={() => handleSaveSettings({ ...classSettings, difficulty: diff.key as any })}
                    className={`py-2 rounded-xl font-black text-sm transition-all cursor-pointer ${
                      classSettings.difficulty === diff.key
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                        : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Tự động lọc các câu hỏi có gợi ý trực quan hơn ở mức "Dễ".
              </p>
            </div>

            {/* 3. Cỡ chữ máy chiếu */}
            <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200">
              <label className="block text-xs font-black uppercase text-slate-600 mb-2">
                3. Cỡ chữ hiển thị khi chiếu màn hình lớn:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'normal', label: 'Chuẩn' },
                  { key: 'large', label: 'Lớn' },
                  { key: 'extra-large', label: 'Cực lớn' },
                ].map((sz) => (
                  <button
                    key={sz.key}
                    type="button"
                    onClick={() => handleSaveSettings({ ...classSettings, fontSizeScale: sz.key as any })}
                    className={`py-2 rounded-xl font-black text-sm transition-all cursor-pointer ${
                      classSettings.fontSizeScale === sz.key
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                        : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Học sinh ngồi cuối lớp có thể đọc chữ to rõ ràng khi dùng máy chiếu hoặc bảng tương tác.
              </p>
            </div>

            {/* 4. Tự động đọc câu hỏi */}
            <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-2">
                  4. Âm thanh máy đọc:
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Tự động phát âm thanh câu hỏi</span>
                  <input
                    type="checkbox"
                    checked={classSettings.autoPlayAudioPrompt}
                    onChange={(e) => handleSaveSettings({ ...classSettings, autoPlayAudioPrompt: e.target.checked })}
                    className="w-5 h-5 accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Khi tắt, giáo viên hoặc học sinh sẽ chủ động bấm nút "Nghe âm" khi cần.
              </p>
            </div>
          </div>

          {/* 5. Chọn bài học trọng tâm để tổ chức trên lớp */}
          <div className="p-5 bg-emerald-50/70 rounded-2xl border-2 border-emerald-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-emerald-800 mb-1">
                  5. Chọn bài học tổ chức dạy trên lớp ngay hôm nay:
                </label>
                <select
                  value={classSettings.selectedLessonId}
                  onChange={(e) => handleSaveSettings({ ...classSettings, selectedLessonId: e.target.value })}
                  className="px-3.5 py-2 rounded-xl border-2 border-emerald-400 text-sm font-bold text-slate-800 bg-white focus:outline-hidden"
                >
                  {GRADE_1_LESSONS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.unitTitle}: {l.title}
                    </option>
                  ))}
                </select>
              </div>

              {onStartLesson && (
                <button
                  onClick={() => onStartLesson(classSettings.selectedLessonId)}
                  className="btn-3d-yellow px-5 py-2.5 rounded-2xl font-black text-sm shadow-md cursor-pointer"
                >
                  Bắt đầu bài giảng này ➔
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
