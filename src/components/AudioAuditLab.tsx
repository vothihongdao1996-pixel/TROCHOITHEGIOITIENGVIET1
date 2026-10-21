import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Square,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { audioManager } from '../services/audioManager';
import { phonicsStorage } from '../services/phonicsStorage';
import { ReadingSpeed, VietnameseLetter } from '../types';

export const AudioAuditLab: React.FC = () => {
  const [letters, setLetters] = useState<VietnameseLetter[]>(phonicsStorage.getLetters());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [viVoices, setViVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasViVoice, setHasViVoice] = useState(false);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(audioManager.getSelectedVoiceURI());
  const [readingSpeed, setReadingSpeed] = useState<ReadingSpeed>(audioManager.getSpeed());
  const [testText, setTestText] = useState('Chào các bạn nhỏ! Chúng ta cùng học Tiếng Việt nhé!');

  useEffect(() => {
    const updateVoiceList = () => {
      const all = audioManager.getVoices();
      const vi = audioManager.getVietnameseVoices();
      setVoices(all);
      setViVoices(vi);
      setHasViVoice(audioManager.hasVietnameseVoice());
      setSelectedVoiceURI(audioManager.getSelectedVoiceURI());
      setReadingSpeed(audioManager.getSpeed());
      setIsSpeaking(audioManager.isSpeaking());
    };

    updateVoiceList();
    const unsubAudio = audioManager.subscribe(updateVoiceList);
    const unsubPhonics = phonicsStorage.subscribe(() => {
      setLetters(phonicsStorage.getLetters());
    });
    return () => {
      unsubAudio();
      unsubPhonics();
    };
  }, []);

  const handleSpeak = (text: string) => {
    setIsSpeaking(true);
    audioManager.speak(text, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleReplay = () => {
    setIsSpeaking(true);
    audioManager.replay(() => setIsSpeaking(false));
  };

  const handleStop = () => {
    audioManager.stop();
    setIsSpeaking(false);
  };

  const handleSpeedChange = (speed: ReadingSpeed) => {
    audioManager.setSpeed(speed);
    setReadingSpeed(speed);
  };

  const handleVoiceSelect = (uri: string) => {
    audioManager.setSelectedVoice(uri);
    setSelectedVoiceURI(uri);
  };

  // 11 Vietnamese standard vowels for Grade 1
  const vowels = [
    { char: 'a', phoneme: 'Chữ a', sample: 'ba' },
    { char: 'ă', phoneme: 'Chữ á', sample: 'bắt' },
    { char: 'â', phoneme: 'Chữ ớ', sample: 'bấm' },
    { char: 'e', phoneme: 'Chữ e', sample: 'bé' },
    { char: 'ê', phoneme: 'Chữ ê', sample: 'bế' },
    { char: 'i', phoneme: 'Chữ i ngắn', sample: 'bi' },
    { char: 'o', phoneme: 'Chữ o', sample: 'bò' },
    { char: 'ô', phoneme: 'Chữ ô', sample: 'bố' },
    { char: 'ơ', phoneme: 'Chữ ơ', sample: 'bơ' },
    { char: 'u', phoneme: 'Chữ u', sample: 'đu' },
    { char: 'ư', phoneme: 'Chữ ư', sample: 'thư' },
  ];

  // 6 Vietnamese tones
  const tones = [
    { name: 'Thanh ngang (không dấu)', word: 'ba', desc: 'Bình ổn, không dấu', audio: 'Ba' },
    { name: 'Thanh sắc', word: 'bá', desc: 'Lên cao, dấu sắc', audio: 'Bá' },
    { name: 'Thanh huyền', word: 'bà', desc: 'Trầm xuống, dấu huyền', audio: 'Bà' },
    { name: 'Thanh hỏi', word: 'bả', desc: 'Xuống rồi lên, dấu hỏi', audio: 'Bả' },
    { name: 'Thanh ngã', word: 'bã', desc: 'Gãy giọng, dấu ngã', audio: 'Bã' },
    { name: 'Thanh nặng', word: 'bạ', desc: 'Trầm ngắt, dấu nặng', audio: 'Bạ' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-900 border-2 border-sky-300 font-extrabold px-4 py-1.5 rounded-full text-xs sm:text-sm mb-2">
          <Volume2 className="w-4 h-4 text-sky-600" />
          <span>Hệ Thống Âm Thanh Duy Nhất</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
          Máy Đọc Tiếng Việt
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-medium max-w-2xl mx-auto mt-1">
          Sử dụng Web Speech API của trình duyệt với giọng đọc tiếng Việt (vi-VN), hỗ trợ điều chỉnh tốc độ và kiểm tra phát âm.
        </p>
      </div>

      {/* Device & Voice Diagnostics Card */}
      <div className="bg-white rounded-3xl p-6 border-4 border-slate-200 shadow-sm mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {hasViVoice ? (
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-700">
                <AlertTriangle className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="font-black text-base sm:text-lg text-slate-800">
                {hasViVoice
                  ? `Đã phát hiện ${viVoices.length} giọng đọc Tiếng Việt (vi-VN)`
                  : 'Chưa phát hiện giọng Tiếng Việt vi-VN trên thiết bị này'}
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                Tổng số giọng trình duyệt hỗ trợ: {voices.length} giọng
              </div>
            </div>
          </div>

          {/* Action buttons: Replay / Stop */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReplay}
              disabled={!audioManager.getLastSpokenText()}
              className="px-3.5 py-2 bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nghe lại</span>
            </button>
            {isSpeaking && (
              <button
                onClick={handleStop}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Dừng</span>
              </button>
            )}
          </div>
        </div>

        {/* Speed Adjustment: Chậm, Vừa, Nhanh */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-2">
              Điều chỉnh tốc độ đọc của máy:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSpeedChange('slow')}
                className={`py-2.5 rounded-2xl text-xs font-black border-2 transition-all cursor-pointer ${
                  readingSpeed === 'slow'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                }`}
              >
                🐢 Chậm (0.7x)
              </button>
              <button
                type="button"
                onClick={() => handleSpeedChange('normal')}
                className={`py-2.5 rounded-2xl text-xs font-black border-2 transition-all cursor-pointer ${
                  readingSpeed === 'normal'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                }`}
              >
                🚶 Vừa (0.9x)
              </button>
              <button
                type="button"
                onClick={() => handleSpeedChange('fast')}
                className={`py-2.5 rounded-2xl text-xs font-black border-2 transition-all cursor-pointer ${
                  readingSpeed === 'fast'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                }`}
              >
                🏃 Nhanh (1.15x)
              </button>
            </div>
          </div>

          {/* Voice Selector if multiple vi voices available */}
          {viVoices.length > 0 && (
            <div>
              <label className="block text-xs font-black text-slate-700 mb-2">
                Chọn giọng tiếng Việt ưu tiên:
              </label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => handleVoiceSelect(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border-2 border-slate-300 text-xs font-bold text-slate-800 bg-white focus:border-emerald-500 focus:outline-none"
              >
                {viVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Pedagogical disclaimer note */}
        <div className="mt-5 pt-4 border-t border-slate-100 bg-amber-50/70 rounded-2xl p-4 text-xs text-amber-900 font-semibold flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Thông báo giới hạn công nghệ: </strong>
            Máy đọc tiếng Việt sử dụng bộ tổng hợp giọng nói của trình duyệt/thiết bị người dùng. Máy đọc rất tốt các từ ngữ, câu văn tiếng Việt đầy đủ dấu thanh; tuy nhiên đối với các âm đơn lẻ hoặc chữ cái rời rạc, máy đọc tên chữ cái theo chuẩn văn bản. Thầy cô nên làm mẫu khẩu hình trực tiếp trên lớp để học sinh nắm vững nhất.
          </div>
        </div>
      </div>

      {/* Vowel Inspection Grid (11 Nguyên Âm) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-sm mb-8">
        <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
          <span>🌱 Kiểm Tra Máy Đọc 11 Nguyên Âm Tiếng Việt</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6">
          Nhấp vào từng ô để nghe máy đọc phát âm:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
          {vowels.map((v) => (
            <button
              key={v.char}
              onClick={() => handleSpeak(`${v.phoneme}. Ví dụ: ${v.sample}`)}
              className="bg-slate-50 hover:bg-sky-100 border-2 border-slate-300 hover:border-sky-500 p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-95"
            >
              <span className="text-3xl font-black text-slate-800 group-hover:text-sky-800">
                {v.char}
              </span>
              <span className="text-[11px] font-bold text-slate-500 mt-1">
                {v.phoneme}
              </span>
              <Volume2 className="w-3.5 h-3.5 text-sky-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      {/* Tone Inspection Grid (6 Thanh Điệu) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-sm mb-8">
        <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
          <span>🎵 Kiểm Tra Máy Đọc 6 Thanh Điệu Tiếng Việt</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6">
          Thử nghiệm máy đọc âm tiết "ba" qua 6 thanh điệu (ngang, sắc, huyền, hỏi, ngã, nặng):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tones.map((t, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-sky-400 bg-sky-50/30 flex items-center justify-between gap-3"
            >
              <div>
                <div className="text-2xl font-black text-sky-900">{t.word}</div>
                <div className="font-bold text-xs text-slate-700">{t.name}</div>
                <div className="text-[11px] text-slate-500">{t.desc}</div>
              </div>
              <button
                onClick={() => handleSpeak(`${t.name}: ${t.word}.`)}
                className="btn-3d-blue px-3 py-2 rounded-xl text-white font-extrabold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 29 Letters Phonics Inspection (Ưu Tiên Đọc Âm Lớp 1) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span>🔤 Kiểm Tra Âm 29 Chữ Cái (Ưu Tiên Đọc Âm Lớp 1)</span>
          </h3>
          <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl">
            Chuẩn hóa 29 âm đọc
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-5">
          Quy ước bắt buộc: Máy đọc âm theo cách dạy Tiếng Việt lớp 1 (ví dụ: b đọc âm <em>“bờ”</em>, d đọc <em>“dờ”</em>, đ đọc <em>“đờ”</em>, m đọc <em>“mờ”</em>, t đọc <em>“tờ”</em>, k đọc <em>“ca”</em>...), không mặc định đọc tên chữ cái.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {letters.map((l) => (
            <div
              key={l.id}
              className="p-3 bg-slate-50 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl flex flex-col justify-between transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-extrabold text-slate-400">#{l.id}</span>
                {l.isAuditedByTeacher ? (
                  <span title="Đã kiểm tra">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                ) : (
                  <span title="Chưa kiểm tra">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-center gap-2 my-1">
                <span className="text-3xl font-black text-emerald-800">{l.lower}</span>
                <span className="text-2xl font-bold text-slate-600">{l.upper}</span>
              </div>

              <div className="text-center my-1">
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                  Âm: "{l.phonemeSpeechText}"
                </span>
                <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                  Tên: {l.letterName}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => handleSpeak(l.phonemeSpeechText || l.soundText || l.lower)}
                  className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                  title="Nghe âm đọc dùng khi ghép tiếng và đánh vần (bờ, cờ, dờ...)"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe âm: /{l.phonemeSpeechText}/</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSpeak(l.letterNameSpeechText || `Chữ ${l.letterName}`)}
                  className="w-full py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 font-extrabold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                  title="Nghe tên con chữ trong bảng chữ cái (bê, xê, dê...)"
                >
                  <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Tên: {l.letterName}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Text Playground */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 mb-2">
          Thử Nghiệm Văn Bản Bất Kỳ Với Máy Đọc Tiếng Việt
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-3">
          Bấm các câu mẫu chuẩn sư phạm lớp 1 để kiểm tra thực tế:
        </p>

        {/* Quick sample chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { label: 'Luyện âm: "Đây là chữ b."', text: 'Đây là chữ b.' },
            { label: 'Cấu tạo chữ: "Chữ b có nét thẳng..."', text: 'Chữ b có nét thẳng bên trái, bụng tròn bên phải hướng xuống.' },
            { label: 'Ghép tiếng: "B + an = ban"', text: 'B + an = ban.' },
            { label: 'Chính tả: "Điền c hay k"', text: 'Điền c hay k vào chỗ chấm: con cá, cây kem.' },
            { label: 'Tên chữ cái: "Tên chữ cái b là bê"', text: 'Tên chữ cái b là bê.' },
            { label: 'Hoa - thường: "Chữ in hoa B và b thường"', text: 'Chữ in hoa B đi đôi với chữ in thường b.' },
          ].map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTestText(sample.text);
                handleSpeak(sample.text);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 border border-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{sample.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none font-bold text-slate-800 text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleSpeak(testText)}
              className="btn-3d-blue px-5 py-3 rounded-2xl font-black text-white text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Nghe</span>
            </button>
            <button
              onClick={handleReplay}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer"
            >
              Nghe lại
            </button>
            {isSpeaking && (
              <button
                onClick={handleStop}
                className="px-4 py-3 bg-rose-500 text-white font-black text-xs sm:text-sm rounded-2xl hover:bg-rose-600 transition-all cursor-pointer"
              >
                Dừng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
