import React, { useState, useEffect } from 'react';
import { VietnameseLetter, ReadingSpeed, StudentProfile } from '../types';
import { phonicsStorage } from '../services/phonicsStorage';
import { audioManager } from '../services/audioManager';
import { storageService } from '../services/storageService';
import {
  Volume2,
  Sparkles,
  Info,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Square,
  Edit2,
  Settings,
  Sliders,
  Save,
  RotateCw,
  Search,
  Check,
  GraduationCap,
  Volume1,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Star,
} from 'lucide-react';

export const LETTER_ILLUSTRATIONS: Record<string, { word: string; emoji: string }> = {
  a: { word: 'quả táo', emoji: '🍎' },
  ă: { word: 'mặt trăng', emoji: '🌙' },
  â: { word: 'ấm trà', emoji: '🫖' },
  b: { word: 'quả bơ', emoji: '🥑' },
  c: { word: 'con cá', emoji: '🐟' },
  d: { word: 'quả dưa', emoji: '🍉' },
  đ: { word: 'đèn bàn', emoji: '💡' },
  e: { word: 'quả me', emoji: '🍓' },
  ê: { word: 'ghế gỗ', emoji: '🪑' },
  g: { word: 'con gà', emoji: '🐔' },
  h: { word: 'bông hoa', emoji: '🌸' },
  i: { word: 'kim chỉ', emoji: '🪡' },
  k: { word: 'cây kem', emoji: '🍧' },
  l: { word: 'chiếc lá', emoji: '🍃' },
  m: { word: 'con mèo', emoji: '🐱' },
  n: { word: 'cây nấm', emoji: '🍄' },
  o: { word: 'trứng gà', emoji: '🥚' },
  ô: { word: 'cái ô', emoji: '☂️' },
  ơ: { word: 'lá cờ', emoji: '🚩' },
  p: { word: 'cây búa', emoji: '🔨' },
  q: { word: 'cái quạt', emoji: '🪭' },
  r: { word: 'con rùa', emoji: '🐢' },
  s: { word: 'ngôi sao', emoji: '⭐' },
  t: { word: 'con tàu', emoji: '⛵' },
  u: { word: 'cái bát', emoji: '🥣' },
  ư: { word: 'sư tử', emoji: '🦁' },
  v: { word: 'con voi', emoji: '🐘' },
  x: { word: 'xe đạp', emoji: '🚲' },
  y: { word: 'y tá', emoji: '🩺' },
};

interface Props {
  onPlayLetterGame: () => void;
  activeProfile?: StudentProfile;
}

export const AlphabetGardenView: React.FC<Props> = ({ onPlayLetterGame, activeProfile }) => {
  const [letters, setLetters] = useState<VietnameseLetter[]>(phonicsStorage.getLetters());
  const [selectedLetter, setSelectedLetter] = useState<VietnameseLetter>(
    letters[0] || phonicsStorage.getLetters()[0]
  );
  const [currentlySpeakingLetterId, setCurrentlySpeakingLetterId] = useState<number | null>(null);
  const [currentSpokenText, setCurrentSpokenText] = useState<string>('');
  const [currentSpokenMode, setCurrentSpokenMode] = useState<'phoneme' | 'name' | 'sample' | null>(null);

  // Tab switch: Student View vs Teacher Management Table
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');

  // Teacher Management Table filters & edit states
  const [searchQuery, setSearchQuery] = useState('');
  const [auditFilter, setAuditFilter] = useState<'all' | 'audited' | 'unaudited'>('all');
  const [editingLetter, setEditingLetter] = useState<VietnameseLetter | null>(null);
  const [editPhonemeText, setEditPhonemeText] = useState('');
  const [editTeacherAudited, setEditTeacherAudited] = useState(false);
  const [editTeacherNote, setEditTeacherNote] = useState('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Synthesizer speed
  const [readingSpeed, setReadingSpeed] = useState<ReadingSpeed>(audioManager.getSpeed());

  // Student learning tracking (Đã học / Đang học / Chưa học)
  const [learnedLetterIds, setLearnedLetterIds] = useState<number[]>(() =>
    storageService.getLearnedLetterIds(activeProfile?.id || 'hs-01')
  );
  const [studentFilter, setStudentFilter] = useState<'all' | 'learned' | 'unlearned'>('all');
  const [isZoomDetailOpen, setIsZoomDetailOpen] = useState(true);

  useEffect(() => {
    setLearnedLetterIds(storageService.getLearnedLetterIds(activeProfile?.id || 'hs-01'));
  }, [activeProfile?.id]);

  const handlePrevLetter = () => {
    const currentIdx = letters.findIndex((l) => l.id === selectedLetter.id);
    const prevIdx = currentIdx > 0 ? currentIdx - 1 : letters.length - 1;
    const target = letters[prevIdx];
    setSelectedLetter(target);
    handleSpeakPhoneme(target);
  };

  const handleNextLetter = () => {
    const currentIdx = letters.findIndex((l) => l.id === selectedLetter.id);
    const nextIdx = currentIdx < letters.length - 1 ? currentIdx + 1 : 0;
    const target = letters[nextIdx];
    setSelectedLetter(target);
    handleSpeakPhoneme(target);
  };

  const handleToggleLearnedStatus = (letterId: number) => {
    const isNowLearned = storageService.toggleLetterLearned(activeProfile?.id || 'hs-01', letterId);
    setLearnedLetterIds(storageService.getLearnedLetterIds(activeProfile?.id || 'hs-01'));
    triggerToast(
      isNowLearned
        ? `Đã đánh dấu chữ "${selectedLetter.lower}" là ĐÃ HỌC (+1 ⭐)!`
        : `Đã chuyển chữ "${selectedLetter.lower}" về trạng thái ĐANG HỌC.`
    );
  };

  const reloadLetters = () => {
    const list = phonicsStorage.getLetters();
    setLetters(list);
    // keep selected letter in sync
    setSelectedLetter((prev) => {
      if (!prev) return list[0];
      const found = list.find((l) => l.id === prev.id);
      return found || list[0];
    });
  };

  useEffect(() => {
    reloadLetters();
    const unsubStorage = phonicsStorage.subscribe(reloadLetters);
    const unsubAudio = audioManager.subscribe(() => {
      setReadingSpeed(audioManager.getSpeed());
      if (!audioManager.isSpeaking()) {
        setCurrentlySpeakingLetterId(null);
        setCurrentSpokenMode(null);
      }
    });

    return () => {
      unsubStorage();
      unsubAudio();
      audioManager.stop();
    };
  }, []);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // 1. Primary Action: NGHE ÂM CỦA CHỮ CÁI (ví dụ: b -> "bờ", d -> "dờ", đ -> "đờ", k -> "ca"...)
  const handleSpeakPhoneme = (letter: VietnameseLetter) => {
    const textToSpeak = letter.phonemeSpeechText || letter.soundText || letter.lower;
    setSelectedLetter(letter);
    setCurrentlySpeakingLetterId(letter.id);
    setCurrentSpokenMode('phoneme');
    setCurrentSpokenText(textToSpeak);

    audioManager.speak(textToSpeak, {
      onEnd: () => {
        setCurrentlySpeakingLetterId(null);
        setCurrentSpokenMode(null);
      },
      onError: () => {
        setCurrentlySpeakingLetterId(null);
        setCurrentSpokenMode(null);
      },
    });
  };

  // 2. Secondary Action: NGHE TÊN CHỮ CÁI (ví dụ: "chữ bê", "chữ dê"...)
  const handleSpeakLetterName = (e: React.MouseEvent, letter: VietnameseLetter) => {
    e.stopPropagation();
    setSelectedLetter(letter);
    setCurrentlySpeakingLetterId(letter.id);
    setCurrentSpokenMode('name');
    setCurrentSpokenText(letter.letterNameSpeechText || `Chữ ${letter.letterName}`);

    audioManager.speak(letter.letterNameSpeechText || `Chữ ${letter.letterName}`, {
      onEnd: () => {
        setCurrentlySpeakingLetterId(null);
        setCurrentSpokenMode(null);
      },
      onError: () => {
        setCurrentlySpeakingLetterId(null);
        setCurrentSpokenMode(null);
      },
    });
  };

  // 3. Sample word action (ví dụ: da, de, di)
  const handleSpeakSampleWord = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    setCurrentSpokenMode('sample');
    setCurrentSpokenText(word);
    audioManager.speak(word, {
      onEnd: () => setCurrentSpokenMode(null),
      onError: () => setCurrentSpokenMode(null),
    });
  };

  const handleReplay = () => {
    if (selectedLetter) {
      if (currentSpokenMode === 'name') {
        handleSpeakLetterName({ stopPropagation: () => {} } as any, selectedLetter);
      } else {
        handleSpeakPhoneme(selectedLetter);
      }
    } else {
      audioManager.replay();
    }
  };

  const handleStop = () => {
    audioManager.stop();
    setCurrentlySpeakingLetterId(null);
    setCurrentSpokenMode(null);
  };

  const handleSpeedChange = (speed: ReadingSpeed) => {
    audioManager.setSpeed(speed);
    setReadingSpeed(speed);
  };

  // Teacher edit drawer/modal
  const handleOpenEdit = (letter: VietnameseLetter) => {
    setEditingLetter(letter);
    setEditPhonemeText(letter.phonemeSpeechText || letter.soundText || '');
    setEditTeacherAudited(letter.isAuditedByTeacher);
    setEditTeacherNote(letter.teacherNote || '');
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingLetter || !editPhonemeText.trim()) return;

    phonicsStorage.updateLetter(editingLetter.id, {
      phonemeSpeechText: editPhonemeText.trim(),
      isAuditedByTeacher: editTeacherAudited,
      teacherNote: editTeacherNote.trim(),
    });

    triggerToast(`Đã lưu âm đọc chữ "${editingLetter.lower} / ${editingLetter.upper}" thành "${editPhonemeText.trim()}".`);
    setEditingLetter(null);
    reloadLetters();
  };

  // Inline row edit in teacher table
  const handleInlinePhonemeChange = (id: number, newText: string) => {
    phonicsStorage.updateLetter(id, { phonemeSpeechText: newText });
    reloadLetters();
  };

  const handleToggleAudit = (id: number) => {
    const nextState = phonicsStorage.toggleLetterAudit(id);
    triggerToast(`Chữ đã chuyển sang trạng thái: ${nextState ? 'Đã kiểm tra' : 'Chưa kiểm tra'}.`);
    reloadLetters();
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        'Khôi phục toàn bộ văn bản phát âm 29 chữ cái về quy ước chuẩn lớp 1 (ví dụ b -> bờ, d -> dờ, đ -> đờ, k -> ca, m -> mờ...)?'
      )
    ) {
      phonicsStorage.resetLettersToDefaults();
      reloadLetters();
      triggerToast('Đã khôi phục dữ liệu phát âm 29 chữ cái về mặc định chuẩn GDPT 2018.');
    }
  };

  // Filtered letters for teacher table
  const filteredLetters = letters.filter((l) => {
    if (auditFilter === 'audited' && !l.isAuditedByTeacher) return false;
    if (auditFilter === 'unaudited' && l.isAuditedByTeacher) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchChar = l.lower.toLowerCase().includes(q) || l.upper.toLowerCase().includes(q);
      const matchName = l.letterName.toLowerCase().includes(q);
      const matchPhoneme = (l.phonemeSpeechText || l.soundText || '').toLowerCase().includes(q);
      return matchChar || matchName || matchPhoneme;
    }
    return true;
  });

  const auditedCount = letters.filter((l) => l.isAuditedByTeacher).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white font-extrabold px-5 py-3 rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-center gap-2 animate-bounce text-sm">
          <Check className="w-5 h-5 text-emerald-200" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Main Page Title & Mode Switch */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border-2 border-emerald-300 font-extrabold px-4 py-1.5 rounded-full text-xs sm:text-sm mb-2 shadow-xs">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Vườn Chữ Cái • Lớp 1</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          Bảng 29 Chữ Cái: Ưu Tiên Luyện Đọc Âm
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-2xl mx-auto mt-1">
          Hệ thống ưu tiên phát âm theo âm học tiếng Việt lớp 1 (ví dụ: chữ <strong>b</strong> đọc <em>“bờ”</em>, chữ <strong>d</strong> đọc <em>“dờ”</em>, chữ <strong>đ</strong> đọc <em>“đờ”</em>, chữ <strong>m</strong> đọc <em>“mờ”</em>, chữ <strong>t</strong> đọc <em>“tờ”</em>, chữ <strong>k</strong> đọc <em>“ca”</em>...).
        </p>

        {/* Tab switcher: Student View vs Teacher Management View */}
        <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl gap-2 mt-4 border-2 border-slate-300">
          <button
            onClick={() => setActiveTab('student')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dành Cho Học Sinh (Luyện Đọc Âm)</span>
          </button>

          <button
            onClick={() => setActiveTab('teacher')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Khu Vực Giáo Viên (Quản Lý Dữ Liệu 29 Âm)</span>
            <span className="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full font-black">
              {auditedCount}/29
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. GIAO DIỆN HỌC SINH (STUDENT VIEW)                     */}
      {/* ======================================================== */}
      {activeTab === 'student' && (
        <>
          {/* Spotlight Selected Letter Card */}
          {/* Spotlight Selected Letter Card */}
          {selectedLetter && (
            <div id="letter-zoom-card" className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-400 shadow-xl mb-8 relative overflow-hidden">
              {/* Top Navigation & Status Bar inside Zoom Card */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b-2 border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevLetter}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-300 font-extrabold text-xs flex items-center gap-1 cursor-pointer transition-all"
                    title="Chuyển sang chữ cái đứng trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Chữ trước</span>
                  </button>

                  <button
                    onClick={handleNextLetter}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-300 font-extrabold text-xs flex items-center gap-1 cursor-pointer transition-all"
                    title="Chuyển sang chữ cái tiếp theo"
                  >
                    <span>Chữ sau</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-bold text-slate-400 pl-1">
                    #{selectedLetter.id} / 29
                  </span>
                </div>

                {/* Learning Status Pill & Mark Learned Toggle */}
                <div className="flex items-center gap-2.5">
                  {learnedLetterIds.includes(selectedLetter.id) ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ĐÃ HỌC XONG</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-black text-xs border border-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>ĐANG HỌC</span>
                    </span>
                  )}

                  <button
                    onClick={() => handleToggleLearnedStatus(selectedLetter.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1 ${
                      learnedLetterIds.includes(selectedLetter.id)
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        : 'btn-3d-green text-white shadow-xs'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{learnedLetterIds.includes(selectedLetter.id) ? 'Đã học (Bấm để hủy)' : 'Đánh dấu đã học (+1 ⭐)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById('alphabet-grid-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer border border-slate-200"
                  >
                    Trở về danh sách bảng chữ ➔
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left: Giant Letter Display (Lower & Upper) */}
                <div className="lg:col-span-4 flex items-center gap-5 text-center sm:text-left">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-emerald-50 border-4 border-emerald-300 flex items-center justify-center shadow-inner shrink-0">
                    <span className="text-6xl sm:text-7xl font-black text-emerald-800 leading-none font-vietnamese">
                      {selectedLetter.lower}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-400">Chữ cái tiếng Việt</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-slate-800 font-vietnamese">
                        Chữ {selectedLetter.upper}
                      </span>
                      <span className="text-xs font-bold text-slate-500">(in hoa)</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                      Tên con chữ: <strong className="text-slate-800">{selectedLetter.letterName}</strong>
                    </div>

                    {/* Example Illustration Card */}
                    {LETTER_ILLUSTRATIONS[selectedLetter.lower] && (
                      <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 shadow-2xs">
                        <span className="text-xl">{LETTER_ILLUSTRATIONS[selectedLetter.lower].emoji}</span>
                        <span>Ví dụ: <strong className="text-amber-950 font-black">{LETTER_ILLUSTRATIONS[selectedLetter.lower].word}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Center & Right: Audio Action Deck (Nghe âm nổi bật nhất, Nghe lại, Dừng) */}
                <div className="lg:col-span-8 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-center">
                  {/* Status Banner */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                        currentlySpeakingLetterId === selectedLetter.id
                          ? 'bg-emerald-500 text-white shadow-md animate-pulse'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      <Volume2 className="w-4 h-4 shrink-0" />
                      <span>
                        {currentlySpeakingLetterId === selectedLetter.id
                          ? currentSpokenMode === 'name'
                            ? `Đang đọc: Tên chữ "${selectedLetter.letterName}"`
                            : `Đang đọc: Âm /${selectedLetter.phonemeSpeechText}/`
                          : `Ưu tiên phát âm đơn lẻ: /${selectedLetter.phonemeSpeechText}/`}
                      </span>
                    </div>

                    {/* Speed indicator */}
                    <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                      <span>Tốc độ:</span>
                      <span className="text-emerald-700">
                        {readingSpeed === 'slow' ? 'Chậm' : readingSpeed === 'fast' ? 'Nhanh' : 'Vừa'}
                      </span>
                    </div>
                  </div>

                  {/* Primary & Control Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* NÚT CHÍNH: NGHE ÂM CHỮ CÁI (Chỉ đọc âm đơn lẻ /bờ/, /dờ/...) */}
                    <button
                      onClick={() => handleSpeakPhoneme(selectedLetter)}
                      className={`flex-1 py-3.5 px-6 rounded-2xl text-base sm:text-lg font-black flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                        currentlySpeakingLetterId === selectedLetter.id && currentSpokenMode === 'phoneme'
                          ? 'btn-3d-green text-white ring-4 ring-emerald-300 animate-pulse'
                          : 'btn-3d-green text-white hover:brightness-105'
                      }`}
                    >
                      <Volume2 className="w-6 h-6 fill-current" />
                      <span>🔊 Nghe âm "{selectedLetter.phonemeSpeechText}"</span>
                    </button>

                    {/* Nút Nghe lại */}
                    <button
                      onClick={handleReplay}
                      title="Nghe lại âm vừa đọc"
                      className="py-3 px-4 rounded-2xl text-xs sm:text-sm font-black bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Nghe lại</span>
                    </button>

                    {/* Nút Dừng */}
                    {currentlySpeakingLetterId !== null && (
                      <button
                        onClick={handleStop}
                        title="Dừng đọc ngay"
                        className="py-3 px-4 rounded-2xl text-xs sm:text-sm font-black bg-rose-500 hover:bg-rose-600 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs animate-gentle-pulse"
                      >
                        <Square className="w-4 h-4 fill-current" />
                        <span>Dừng</span>
                      </button>
                    )}
                  </div>

                  {/* Secondary Notice */}
                  <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <button
                      onClick={(e) => handleSpeakLetterName(e, selectedLetter)}
                      title="Chỉ bấm khi cần nghe tên gọi của con chữ trong bảng chữ cái"
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Volume1 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Nút phụ: Nghe tên chữ "{selectedLetter.letterName}"</span>
                    </button>

                    <span className="italic">
                      * Chức năng Nghe âm chỉ đọc đúng âm của chữ cái, không tự thêm từ minh họa.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of 29 Vietnamese Letters */}
          <div id="alphabet-grid-section" className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-800">
                  Bảng 29 Chữ Cái Tiếng Việt
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Bấm vào từng chữ để phóng to xem chi tiết và máy đọc ngay âm của chữ đó.
                </p>
              </div>

              {/* Status Filters for Students (Tất cả, Đã học, Chưa học) */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setStudentFilter('all')}
                    className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                      studentFilter === 'all'
                        ? 'bg-emerald-600 text-white font-black shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tất cả (29)
                  </button>
                  <button
                    onClick={() => setStudentFilter('learned')}
                    className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                      studentFilter === 'learned'
                        ? 'bg-emerald-600 text-white font-black shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Đã học ({learnedLetterIds.length})
                  </button>
                  <button
                    onClick={() => setStudentFilter('unlearned')}
                    className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                      studentFilter === 'unlearned'
                        ? 'bg-amber-500 text-white font-black shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Chưa học ({29 - learnedLetterIds.length})
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
              {letters
                .filter((l) => {
                  if (studentFilter === 'learned') return learnedLetterIds.includes(l.id);
                  if (studentFilter === 'unlearned') return !learnedLetterIds.includes(l.id);
                  return true;
                })
                .map((letter) => {
                  const isSelected = selectedLetter?.id === letter.id;
                  const isSpeakingThis = currentlySpeakingLetterId === letter.id;
                  const isLearned = learnedLetterIds.includes(letter.id);
                  const illustration = LETTER_ILLUSTRATIONS[letter.lower];

                  return (
                    <div
                      key={letter.id}
                      onClick={() => {
                        setSelectedLetter(letter);
                        setIsZoomDetailOpen(true);
                        handleSpeakPhoneme(letter);
                      }}
                      className={`p-4 rounded-3xl border-3 cursor-pointer transition-all flex flex-col justify-between group relative select-none ${
                        isSpeakingThis
                          ? 'bg-emerald-100 border-emerald-500 shadow-lg ring-4 ring-emerald-200 scale-102'
                          : isSelected
                          ? 'bg-emerald-50/80 border-emerald-400 shadow-md ring-2 ring-emerald-200'
                          : isLearned
                          ? 'bg-white border-emerald-200 hover:border-emerald-300'
                          : 'bg-white border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      {/* Header: order number & status badge */}
                      <div className="flex items-center justify-between text-xs font-black mb-1">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[11px]">
                          #{letter.id}
                        </span>

                        {isLearned ? (
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Đã học
                          </span>
                        ) : isSelected ? (
                          <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                            Đang học
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">
                            Chưa học
                          </span>
                        )}
                      </div>

                      {/* Large Letter Display (Lower & Upper) */}
                      <div className="flex items-baseline justify-center gap-2.5 my-2">
                        <span className="text-4xl sm:text-5xl font-black text-emerald-800 font-vietnamese">
                          {letter.lower}
                        </span>
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-600 font-vietnamese">
                          {letter.upper}
                        </span>
                      </div>

                      {/* Simple Illustration Hint */}
                      {illustration && (
                        <div className="text-center text-[11px] font-bold text-slate-500 mb-1 flex items-center justify-center gap-1">
                          <span>{illustration.emoji}</span>
                          <span className="truncate">{illustration.word}</span>
                        </div>
                      )}

                      {/* Phoneme Label (Highlight) */}
                      <div className="text-center my-1">
                        <div className="text-xs font-black text-slate-800 bg-emerald-100/70 border border-emerald-200 py-0.5 px-2 rounded-xl">
                          Âm: <span className="text-emerald-800 font-black">"{letter.phonemeSpeechText}"</span>
                        </div>
                      </div>

                      {/* Primary Button: NGHE ÂM */}
                      <div className="mt-2 space-y-1">
                        <button
                          type="button"
                          className={`w-full py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer ${
                            isSpeakingThis
                              ? 'bg-emerald-600 text-white animate-pulse'
                              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isSpeakingThis ? 'Đang đọc...' : 'Nghe âm'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 2. KHU VỰC GIÁO VIÊN / QUẢN LÝ DỮ LIỆU ĐỌC ÂM (TEACHER)  */}
      {/* ======================================================== */}
      {activeTab === 'teacher' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-200 shadow-lg mb-8">
          {/* Header of Teacher section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-900 px-3 py-1 rounded-xl text-xs font-black mb-1">
                <GraduationCap className="w-4 h-4 text-indigo-700" />
                <span>Bảng Dữ Liệu Riêng Cho Đủ 29 Chữ Cái Tiếng Việt</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                Quản Lý & Kiểm Tra Văn Bản Đọc Âm Lớp 1
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Không tự động lấy tên chữ cái làm nội dung đọc âm. Thầy cô có thể nghe thử, chỉnh sửa văn bản đọc âm (ví dụ k đọc 'ca' hay 'cờ') và lưu trực tiếp.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleResetToDefaults}
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Đặt lại về mặc định</span>
              </button>

              <button
                onClick={() => triggerToast('Dữ liệu phát âm 29 chữ cái đã được lưu trong trình duyệt!')}
                className="btn-3d-green px-4 py-2 rounded-xl text-xs font-black text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu tất cả thay đổi</span>
              </button>
            </div>
          </div>

          {/* Teacher Controls: Search & Audit Filter */}
          <div className="my-5 flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {/* Search Box */}
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-300 w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm chữ, tên chữ, văn bản đọc âm..."
                className="text-xs font-bold text-slate-800 bg-transparent w-full focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 text-xs font-black"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Audit Status Filter */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setAuditFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  auditFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả 29 chữ
              </button>
              <button
                onClick={() => setAuditFilter('audited')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  auditFilter === 'audited'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đã kiểm tra ({auditedCount})
              </button>
              <button
                onClick={() => setAuditFilter('unaudited')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  auditFilter === 'unaudited'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chưa kiểm tra ({29 - auditedCount})
              </button>
            </div>
          </div>

          {/* 5-Column Pedagogical Table for 29 Letters */}
          <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-black uppercase tracking-wider border-b-2 border-slate-200 text-[11px]">
                  <th className="py-3.5 px-3">STT</th>
                  <th className="py-3.5 px-3">Chữ in thường</th>
                  <th className="py-3.5 px-3">Chữ in hoa</th>
                  <th className="py-3.5 px-4">Tên chữ cái</th>
                  <th className="py-3.5 px-4">Văn bản dùng để máy đọc âm</th>
                  <th className="py-3.5 px-4">Trạng thái giáo viên</th>
                  <th className="py-3.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLetters.map((l) => {
                  const isSpeakingThis = currentlySpeakingLetterId === l.id;

                  return (
                    <tr
                      key={l.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isSpeakingThis ? 'bg-emerald-50/80 font-bold' : ''
                      }`}
                    >
                      {/* STT */}
                      <td className="py-3 px-3 font-extrabold text-slate-400">
                        #{l.id}
                      </td>

                      {/* 1. Chữ in thường */}
                      <td className="py-3 px-3">
                        <span className="text-2xl font-black text-emerald-800 font-vietnamese">
                          {l.lower}
                        </span>
                      </td>

                      {/* 2. Chữ in hoa */}
                      <td className="py-3 px-3">
                        <span className="text-xl font-extrabold text-slate-700 font-vietnamese">
                          {l.upper}
                        </span>
                      </td>

                      {/* 3. Tên chữ cái */}
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                          {l.letterName}
                        </span>
                      </td>

                      {/* 4. Văn bản dùng để máy đọc âm (Editable) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={l.phonemeSpeechText}
                            onChange={(e) => handleInlinePhonemeChange(l.id, e.target.value)}
                            className="w-28 sm:w-36 px-2.5 py-1.5 rounded-xl border-2 border-slate-300 font-black text-sm text-emerald-800 bg-white focus:border-indigo-500 focus:outline-none"
                            placeholder="Nhập âm..."
                          />

                          {/* Quick audio preview button */}
                          <button
                            type="button"
                            onClick={() => handleSpeakPhoneme(l)}
                            title={`Thử nghe âm: "${l.phonemeSpeechText}"`}
                            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                              isSpeakingThis
                                ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          {/* Quick preset for Letter K */}
                          {l.lower === 'k' && (
                            <div className="hidden sm:flex items-center gap-1 text-[10px]">
                              <button
                                type="button"
                                onClick={() => handleInlinePhonemeChange(l.id, 'ca')}
                                className="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-indigo-200 font-extrabold text-slate-700"
                              >
                                'ca'
                              </button>
                              <button
                                type="button"
                                onClick={() => handleInlinePhonemeChange(l.id, 'cờ')}
                                className="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-indigo-200 font-extrabold text-slate-700"
                              >
                                'cờ'
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 5. Trạng thái giáo viên đã kiểm tra */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleAudit(l.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                            l.isAuditedByTeacher
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                          }`}
                        >
                          {l.isAuditedByTeacher ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Đã kiểm tra</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                              <span>Chưa kiểm tra</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(l)}
                          title="Mở chi tiết chỉnh sửa"
                          className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <span>
              * Thầy cô có thể sửa trực tiếp trong bảng; mỗi thay đổi được lưu ngay tức thì vào trình duyệt.
            </span>
            <span>
              Tổng số chữ cái hiển thị: <strong>{filteredLetters.length}/29</strong>
            </span>
          </div>
        </div>
      )}

      {/* Teacher Edit Modal for Letter Phoneme Speech Text */}
      {editingLetter && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-indigo-400 animate-gentle-pulse">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-800">
                  Cấu Hình Âm Đọc: Chữ "{editingLetter.lower} / {editingLetter.upper}"
                </h3>
              </div>
              <button
                onClick={() => setEditingLetter(null)}
                className="text-slate-400 hover:text-slate-600 font-black p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block font-black text-slate-700 mb-1">
                  Văn bản dùng để máy đọc âm (Ưu tiên đọc âm, không đọc tên chữ):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editPhonemeText}
                    onChange={(e) => setEditPhonemeText(e.target.value)}
                    placeholder="Ví dụ: bờ, dờ, đờ, cờ, mờ, ca..."
                    className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-300 font-black text-sm text-emerald-800 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => audioManager.speak(editPhonemeText)}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Thử</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  * Ví dụ: Với chữ b, nhập <strong>bờ</strong> (thay vì "bê"); với chữ d, nhập <strong>dờ</strong> (thay vì "dê"); với chữ k, có thể nhập <strong>ca</strong> hoặc <strong>cờ</strong>.
                </p>
              </div>

              <div>
                <label className="block font-black text-slate-700 mb-1">
                  Tên chữ cái chuẩn:
                </label>
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700 font-bold">
                  {editingLetter.letterName} (Dùng khi học tên gọi con chữ trong bảng)
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 mb-1">
                  Lưu ý sư phạm / Hướng dẫn khẩu hình:
                </label>
                <input
                  type="text"
                  value={editTeacherNote}
                  onChange={(e) => setEditTeacherNote(e.target.value)}
                  placeholder="Ghi chú khẩu hình miệng..."
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-slate-800 font-medium focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-letter-audit"
                  checked={editTeacherAudited}
                  onChange={(e) => setEditTeacherAudited(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                />
                <label htmlFor="chk-letter-audit" className="font-black text-slate-800 cursor-pointer">
                  Giáo viên xác nhận âm đọc này đã được kiểm tra đạt yêu cầu sư phạm
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLetter(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="btn-3d-green px-5 py-2 text-white font-black rounded-xl cursor-pointer"
                >
                  Lưu cấu hình âm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CTA to Practice with Letter Game */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-md mt-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-black">
            Bé Đã Luyện Đọc Đúng Các Âm Chữ Cái Chưa?
          </h3>
          <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1">
            Cùng thử sức ngay với Trò chơi 1: <strong>Tìm đúng chữ cái</strong> để nhận diện mặt chữ và tích lũy thật nhiều ngôi sao nhé!
          </p>
        </div>

        <button
          onClick={onPlayLetterGame}
          className="btn-3d-yellow px-6 py-3 rounded-2xl font-black text-slate-900 text-sm sm:text-base flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Vào chơi Trò 1</span>
        </button>
      </div>
    </div>
  );
};
