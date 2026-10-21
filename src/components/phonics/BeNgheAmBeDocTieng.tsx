import React, { useState, useEffect } from 'react';
import { PhonicsItemType, PhonicsReadingItem, ReadingSpeed } from '../../types';
import { phonicsStorage } from '../../services/phonicsStorage';
import { audioManager } from '../../services/audioManager';
import { TeacherPhonicsEditorModal } from '../teacher/TeacherPhonicsEditorModal';
import { MascotBee } from '../illustrations/VectorIllustrations';
import {
  Volume2,
  Square,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Settings,
  BookOpen,
  Filter,
} from 'lucide-react';

export const BeNgheAmBeDocTieng: React.FC = () => {
  const [selectedType, setSelectedType] = useState<PhonicsItemType>('initial-consonant');
  const [selectedLesson, setSelectedLesson] = useState<string>('all');
  const [items, setItems] = useState<PhonicsReadingItem[]>([]);
  const [activeItem, setActiveItem] = useState<PhonicsReadingItem | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState<ReadingSpeed>(audioManager.getSpeed());
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const loadData = () => {
    setItems(phonicsStorage.getItems());
  };

  useEffect(() => {
    loadData();
    const unsubStorage = phonicsStorage.subscribe(loadData);
    const unsubAudio = audioManager.subscribe(() => {
      setReadingSpeed(audioManager.getSpeed());
      setIsSpeaking(audioManager.isSpeaking());
    });

    return () => {
      unsubStorage();
      unsubAudio();
      audioManager.stop();
    };
  }, []);

  const handleSpeedChange = (speed: ReadingSpeed) => {
    audioManager.setSpeed(speed);
    setReadingSpeed(speed);
  };

  const handleSpeakItem = (item: PhonicsReadingItem) => {
    setActiveItem(item);
    setIsSpeaking(true);
    audioManager.speak(item.speechText, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleReplay = () => {
    if (activeItem) {
      handleSpeakItem(activeItem);
    } else {
      audioManager.replay(() => setIsSpeaking(false));
    }
  };

  const handleStop = () => {
    audioManager.stop();
    setIsSpeaking(false);
  };

  const handleMascotGuidance = () => {
    let msg = '';
    if (selectedType === 'letter-name') {
      msg = 'Con hãy bấm vào từng chữ để nghe tên chữ cái nhé! Nhớ phân biệt tên chữ với âm khi học ghép vần!';
    } else if (selectedType === 'initial-consonant') {
      msg = 'Khi học âm đầu, con hãy lắng nghe tiếng mẫu để nhận biết âm đầu thật chính xác nhé!';
    } else if (selectedType === 'rhyme') {
      msg = 'Mỗi vần tiếng Việt đều rất thú vị, con nghe máy đọc rồi đánh vần theo nào!';
    } else if (selectedType === 'syllable') {
      msg = 'Ghép âm đầu với vần và dấu thanh ta sẽ được các tiếng thật hay đó con!';
    } else {
      msg = 'Từ ngữ quanh ta có biết bao điều kỳ diệu, con cùng đọc to từ ngữ với bạn Ong Vàng nhé!';
    }
    audioManager.speakOngVang(msg);
  };

  // Filter items
  const filteredItems = items.filter((it) => {
    if (it.type !== selectedType) return false;
    if (selectedLesson !== 'all' && it.lessonUnit !== selectedLesson) return false;
    return true;
  });

  // Unique lessons for selected type
  const availableLessons = Array.from(
    new Set(items.filter((it) => it.type === selectedType).map((it) => it.lessonUnit))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Zone Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border-2 border-amber-300 font-extrabold px-4 py-1.5 rounded-full text-xs sm:text-sm mb-2 shadow-xs">
          <Sparkles className="w-4 h-4 text-yellow-600 fill-yellow-600" />
          <span>Máy Đọc Âm Tiếng Việt Lớp 1</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          Bé Nghe Âm – Bé Đọc Tiếng
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-medium max-w-2xl mx-auto mt-1">
          Luyện nghe và phát âm chuẩn mực 5 nội dung cốt lõi: <strong>Tên chữ cái</strong>, <strong>Âm đầu</strong> (kèm tiếng mẫu), <strong>Vần</strong>, <strong>Tiếng</strong> và <strong>Từ ngữ</strong>.
        </p>
      </div>

      {/* Top Synthesizer Control Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-4 border-slate-200 shadow-md mb-8 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Speed selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-slate-700">Tốc độ đọc:</span>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => handleSpeedChange('slow')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                readingSpeed === 'slow'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chậm
            </button>
            <button
              onClick={() => handleSpeedChange('normal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                readingSpeed === 'normal'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vừa
            </button>
            <button
              onClick={() => handleSpeedChange('fast')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                readingSpeed === 'fast'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nhanh
            </button>
          </div>
        </div>

        {/* Center: Audio Action Buttons */}
        <div className="flex items-center gap-2">
          {activeItem && (
            <button
              onClick={() => handleSpeakItem(activeItem)}
              className="btn-3d-blue px-4 py-2 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Nghe: {activeItem.display}</span>
            </button>
          )}

          <button
            onClick={handleReplay}
            title="Nghe lại nội dung vừa đọc"
            className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Nghe lại</span>
          </button>

          {isSpeaking && (
            <button
              onClick={handleStop}
              className="px-3.5 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Dừng</span>
            </button>
          )}

          <button
            onClick={handleMascotGuidance}
            className="px-3.5 py-2 rounded-2xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-xs flex items-center gap-1.5 border border-amber-400 cursor-pointer"
          >
            <MascotBee className="w-5 h-5 shrink-0" />
            <span>Ong Vàng hướng dẫn</span>
          </button>
        </div>

        {/* Right: Teacher tool trigger */}
        <button
          onClick={() => setIsTeacherModalOpen(true)}
          className="px-4 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-indigo-300 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Settings className="w-4 h-4 text-indigo-600" />
          <span>Khu vực Giáo viên</span>
        </button>
      </div>

      {/* 5 Main Learning Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-6">
        {[
          { type: 'letter-name', label: '1. Tên chữ cái (29)', icon: '🔤', desc: 'A, Bê, Xê, Dê...' },
          { type: 'initial-consonant', label: '2. Âm đầu', icon: '🗣️', desc: 'b, c, d, đ, ch, nh...' },
          { type: 'rhyme', label: '3. Vần', icon: '🧩', desc: 'an, at, en, ong...' },
          { type: 'syllable', label: '4. Tiếng', icon: '🔔', desc: 'ba, cá, sen, mẹ...' },
          { type: 'word', label: '5. Từ ngữ', icon: '🌟', desc: 'con cá, ngôi nhà...' },
        ].map((tab) => (
          <button
            key={tab.type}
            onClick={() => {
              setSelectedType(tab.type as PhonicsItemType);
              setSelectedLesson('all');
              audioManager.stop();
            }}
            className={`p-3.5 rounded-3xl border-3 text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedType === tab.type
                ? 'bg-emerald-600 border-emerald-700 text-white shadow-md ring-4 ring-emerald-200'
                : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">{tab.icon}</span>
              {selectedType === tab.type && (
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              )}
            </div>
            <div className="font-black text-xs sm:text-sm leading-snug">{tab.label}</div>
            <div className={`text-[11px] truncate mt-0.5 ${selectedType === tab.type ? 'text-emerald-100' : 'text-slate-400'}`}>
              {tab.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Pedagogical Distinction Box for Selected Type */}
      <div className="bg-amber-50 border-3 border-amber-300 rounded-3xl p-5 mb-8 shadow-sm flex flex-col md:flex-row items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-black">
          <Info className="w-6 h-6 text-amber-700" />
        </div>
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
          {selectedType === 'letter-name' && (
            <>
              <div className="font-black text-amber-900 text-sm sm:text-base">
                Quy ước sư phạm: Tên chữ cái tiếng Việt
              </div>
              <p>
                • <strong>Tên chữ cái</strong> dùng để gọi tên chính thức của con chữ trong bảng (ví dụ: chữ <em>b</em> gọi tên là <em>Bê</em>, chữ <em>c</em> gọi tên là <em>Xê</em>).
              </p>
              <p>
                • <strong>Lưu ý:</strong> Khi dạy học đọc và ghép vần, học sinh sử dụng âm đầu (ví dụ: /bờ/, /cờ/), không dùng tên chữ "Bê", "Xê" làm âm đọc.
              </p>
            </>
          )}

          {selectedType === 'initial-consonant' && (
            <>
              <div className="font-black text-amber-900 text-sm sm:text-base">
                Phương pháp sư phạm: Nhận diện âm đầu qua Tiếng Mẫu
              </div>
              <p>
                • <strong>Âm đầu không thể phát âm trơ trọi:</strong> Khi một phụ âm đứng riêng lẻ, máy đọc không thể tách rời luồng hơi âm vị một cách tự nhiên mà không tạo thành tên chữ hoặc âm lai tạp.
              </p>
              <p>
                • <strong>Giải pháp chuẩn SGK lớp 1:</strong> Máy đọc sử dụng <strong>Tiếng Mẫu chuẩn</strong> để học sinh nghe và phân tích âm đầu (ví dụ: muốn nhận diện âm đầu <em>b</em>, học sinh nghe tiếng mẫu: <em>"Âm bờ trong tiếng ba: ba"</em>). Thầy cô làm mẫu khẩu hình trực tiếp trên lớp.
              </p>
            </>
          )}

          {selectedType === 'rhyme' && (
            <>
              <div className="font-black text-amber-900 text-sm sm:text-base">
                Quy ước sư phạm: Vần trong tiếng Việt
              </div>
              <p>
                • Vần giữ nguyên các con chữ và dấu tiếng Việt (ví dụ: <em>an, at, en, ong, iên, uông...</em>). Máy đọc phát âm tên vần và phân tích các âm hợp thành.
              </p>
            </>
          )}

          {selectedType === 'syllable' && (
            <>
              <div className="font-black text-amber-900 text-sm sm:text-base">
                Quy ước sư phạm: Cấu tạo tiếng và Thanh điệu
              </div>
              <p>
                • Tiếng tạo thành từ sự kết hợp giữa âm đầu, vần và dấu thanh (ví dụ: <em>ba, bà, bá, bả, bã, bạ...</em>). Học sinh nghe rõ dấu thanh và đọc trơn tiếng có nghĩa.
              </p>
            </>
          )}

          {selectedType === 'word' && (
            <>
              <div className="font-black text-amber-900 text-sm sm:text-base">
                Quy ước sư phạm: Từ ngữ quen thuộc lớp 1
              </div>
              <p>
                • Đọc tự nhiên, tròn vành rõ chữ các từ ngữ quen thuộc đời sống (ví dụ: <em>con cá, ngôi nhà, bông sen, xe đạp...</em>).
              </p>
            </>
          )}
        </div>
      </div>

      {/* Filter by Lesson Unit (if applicable) */}
      {availableLessons.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <span className="text-xs font-black text-slate-500 whitespace-nowrap flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Lọc bài:
          </span>
          <button
            onClick={() => setSelectedLesson('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
              selectedLesson === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất cả ({items.filter((it) => it.type === selectedType).length})
          </button>
          {availableLessons.map((lesson) => (
            <button
              key={lesson}
              onClick={() => setSelectedLesson(lesson)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                selectedLesson === lesson
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {lesson}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Reading Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
        {filteredItems.map((item) => {
          const isItemActive = activeItem?.id === item.id;

          return (
            <div
              key={item.id}
              onClick={() => handleSpeakItem(item)}
              className={`p-5 rounded-3xl border-3 cursor-pointer transition-all flex flex-col justify-between group relative select-none ${
                isItemActive
                  ? 'bg-sky-100 border-sky-500 shadow-md ring-4 ring-sky-200 scale-102'
                  : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md'
              }`}
            >
              {/* Top tag: subDisplay + teacher audit check */}
              <div className="flex items-center justify-between text-[11px] font-black text-slate-400 mb-2">
                <span className="text-slate-600 font-bold">{item.subDisplay || item.lessonUnit}</span>
                {item.isAuditedByTeacher && (
                  <span title="Nội dung đã được giáo viên kiểm tra sư phạm" className="text-emerald-600 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Main Display Element */}
              <div className="my-3 text-center">
                <span className="text-4xl sm:text-5xl font-black text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {item.display}
                </span>
                <div className="text-xs font-bold text-slate-500 mt-1">
                  {item.phoneticName}
                </div>
              </div>

              {/* Sample syllable indicator if present */}
              {item.sampleSyllable && (
                <div className="bg-amber-50 text-amber-900 px-2 py-1 rounded-xl text-[11px] font-bold text-center border border-amber-200 mb-2">
                  Tiếng mẫu: <strong>{item.sampleSyllable}</strong>
                </div>
              )}

              {/* Listen button */}
              <button
                type="button"
                className={`w-full py-2 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isItemActive
                    ? 'btn-3d-blue text-white shadow-xs'
                    : 'bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-700'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isItemActive ? 'Đang đọc...' : 'Nghe máy đọc'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Teacher Editor Modal */}
      <TeacherPhonicsEditorModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onSaved={loadData}
      />
    </div>
  );
};
