import React, { useState } from 'react';
import { PhonicsReadingItem, PhonicsItemType, ReadingSpeed } from '../../types';
import { phonicsStorage } from '../../services/phonicsStorage';
import { audioManager } from '../../services/audioManager';
import {
  X,
  Volume2,
  Square,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const TeacherPhonicsEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [items, setItems] = useState<PhonicsReadingItem[]>(phonicsStorage.getItems());
  const [editingItem, setEditingItem] = useState<PhonicsReadingItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states
  const [formType, setFormType] = useState<PhonicsItemType>('initial-consonant');
  const [formDisplay, setFormDisplay] = useState('');
  const [formSubDisplay, setFormSubDisplay] = useState('');
  const [formPhoneticName, setFormPhoneticName] = useState('');
  const [formSpeechText, setFormSpeechText] = useState('');
  const [formSampleSyllable, setFormSampleSyllable] = useState('');
  const [formLessonUnit, setFormLessonUnit] = useState('Bài 1: Làm quen');
  const [formIsAudited, setFormIsAudited] = useState(false);
  const [formTeacherNote, setFormTeacherNote] = useState('');

  // Audio test states
  const [isTestingSpeech, setIsTestingSpeech] = useState(false);
  const [testSpeed, setTestSpeed] = useState<ReadingSpeed>(audioManager.getSpeed());

  if (!isOpen) return null;

  const refreshList = () => {
    setItems(phonicsStorage.getItems());
  };

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setEditingItem(null);
    setFormType('initial-consonant');
    setFormDisplay('');
    setFormSubDisplay('');
    setFormPhoneticName('');
    setFormSpeechText('');
    setFormSampleSyllable('');
    setFormLessonUnit('Bài 1: Làm quen');
    setFormIsAudited(true);
    setFormTeacherNote('');
  };

  const handleStartEdit = (item: PhonicsReadingItem) => {
    setIsCreatingNew(false);
    setEditingItem(item);
    setFormType(item.type);
    setFormDisplay(item.display);
    setFormSubDisplay(item.subDisplay || '');
    setFormPhoneticName(item.phoneticName);
    setFormSpeechText(item.speechText);
    setFormSampleSyllable(item.sampleSyllable || '');
    setFormLessonUnit(item.lessonUnit);
    setFormIsAudited(item.isAuditedByTeacher);
    setFormTeacherNote(item.teacherNote || '');
  };

  const handleCancelForm = () => {
    setIsCreatingNew(false);
    setEditingItem(null);
    audioManager.stop();
    setIsTestingSpeech(false);
  };

  const handleTestSpeech = (text: string) => {
    if (!text.trim()) return;
    setIsTestingSpeech(true);
    audioManager.speak(text, {
      speed: testSpeed,
      onEnd: () => setIsTestingSpeech(false),
      onError: () => setIsTestingSpeech(false),
    });
  };

  const handleStopTestSpeech = () => {
    audioManager.stop();
    setIsTestingSpeech(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDisplay.trim() || !formSpeechText.trim()) {
      alert('Vui lòng điền nội dung hiển thị và câu văn bản máy đọc.');
      return;
    }

    if (isCreatingNew) {
      phonicsStorage.addItem({
        type: formType,
        display: formDisplay.trim(),
        subDisplay: formSubDisplay.trim() || undefined,
        phoneticName: formPhoneticName.trim() || formDisplay.trim(),
        speechText: formSpeechText.trim(),
        sampleSyllable: formSampleSyllable.trim() || undefined,
        lessonUnit: formLessonUnit.trim() || 'Bài tự chọn',
        isAuditedByTeacher: formIsAudited,
        teacherNote: formTeacherNote.trim() || undefined,
      });
    } else if (editingItem) {
      phonicsStorage.updateItem(editingItem.id, {
        type: formType,
        display: formDisplay.trim(),
        subDisplay: formSubDisplay.trim() || undefined,
        phoneticName: formPhoneticName.trim() || formDisplay.trim(),
        speechText: formSpeechText.trim(),
        sampleSyllable: formSampleSyllable.trim() || undefined,
        lessonUnit: formLessonUnit.trim() || 'Bài tự chọn',
        isAuditedByTeacher: formIsAudited,
        teacherNote: formTeacherNote.trim() || undefined,
      });
    }

    refreshList();
    handleCancelForm();
    onSaved();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Thầy/Cô có chắc chắn muốn xóa "${name}" khỏi danh mục luyện đọc?`)) {
      phonicsStorage.deleteItem(id);
      refreshList();
      onSaved();
    }
  };

  const handleToggleAudit = (id: string) => {
    phonicsStorage.toggleTeacherAudit(id);
    refreshList();
    onSaved();
  };

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục danh mục về bộ dữ liệu mặc định của chương trình? Các mục tự tạo có thể bị làm mới.')) {
      phonicsStorage.resetToDefaults();
      refreshList();
      onSaved();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border-4 border-indigo-400 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <Sliders className="w-6 h-6 text-indigo-600" />
              <span>Quản Lý Dữ Liệu Luyện Đọc Dành Cho Giáo Viên</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
              Tùy chỉnh nội dung chữ, âm, vần, tiếng, từ và xem trước văn bản phát âm của Máy đọc tiếng Việt.
            </p>
          </div>
          <button
            onClick={() => {
              audioManager.stop();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl font-black text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          {/* Pedagogical disclaimer on teacher audit */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-xs text-amber-900 font-semibold flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Nguyên tắc sư phạm quan trọng: </strong>
              Việc giáo viên đánh dấu <em>"Đã kiểm tra về mặt sư phạm"</em> có ý nghĩa xác nhận văn bản và phương pháp tiếng mẫu là phù hợp theo SGK lớp 1. Đánh dấu này <strong>không đồng nghĩa</strong> với việc khẳng định giọng máy phát âm chuẩn tuyệt đối ở mức ngữ âm học người thật. Đối với các phụ âm khó, hãy sử dụng tiếng mẫu đi kèm.
            </div>
          </div>

          {/* Form for Creating or Editing Item */}
          {(isCreatingNew || editingItem) ? (
            <form onSubmit={handleSaveForm} className="bg-indigo-50/70 border-3 border-indigo-300 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-indigo-950">
                  {isCreatingNew ? 'Thêm mục luyện đọc mới' : `Chỉnh sửa mục: ${editingItem?.display}`}
                </h3>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Hủy bỏ
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Content Type */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Loại nội dung:
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as PhonicsItemType)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-xs bg-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="letter-name">Tên chữ cái</option>
                    <option value="initial-consonant">Âm đầu</option>
                    <option value="rhyme">Vần</option>
                    <option value="syllable">Tiếng</option>
                    <option value="word">Từ ngữ</option>
                  </select>
                </div>

                {/* Lesson Unit */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Bài học / Chủ điểm:
                  </label>
                  <input
                    type="text"
                    value={formLessonUnit}
                    onChange={(e) => setFormLessonUnit(e.target.value)}
                    placeholder="Ví dụ: Bài 2: Âm b, c"
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-xs bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Display Char/Word */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Hiển thị trên thẻ (Chữ / Vần / Tiếng / Từ):
                  </label>
                  <input
                    type="text"
                    value={formDisplay}
                    onChange={(e) => setFormDisplay(e.target.value)}
                    placeholder="Ví dụ: b, an, ba, con cá..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                {/* SubDisplay */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Thông tin phụ (Chữ hoa / Ghi chú):
                  </label>
                  <input
                    type="text"
                    value={formSubDisplay}
                    onChange={(e) => setFormSubDisplay(e.target.value)}
                    placeholder="Ví dụ: B, Thanh huyền, a-n-an..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-xs bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Phonetic Name */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Tên gọi phân loại:
                  </label>
                  <input
                    type="text"
                    value={formPhoneticName}
                    onChange={(e) => setFormPhoneticName(e.target.value)}
                    placeholder="Ví dụ: Âm đầu b, Tên chữ cái Bê..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-xs bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Sample Syllable */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Tiếng mẫu nhận diện (Đặc biệt cho âm đầu khó):
                  </label>
                  <input
                    type="text"
                    value={formSampleSyllable}
                    onChange={(e) => setFormSampleSyllable(e.target.value)}
                    placeholder="Ví dụ: ba, ca, chó, thỏ..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-xs bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Exact Speech Text for Machine */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Văn bản máy đọc tiếng Việt sẽ phát âm (Speech Text):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formSpeechText}
                    onChange={(e) => setFormSpeechText(e.target.value)}
                    placeholder="Ví dụ: Âm bờ trong tiếng ba: ba."
                    className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleTestSpeech(formSpeechText)}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Nghe thử</span>
                  </button>
                  {isTestingSpeech && (
                    <button
                      type="button"
                      onClick={handleStopTestSpeech}
                      className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Dừng</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  * Nhập chính xác văn bản tiếng Việt có dấu. Đối với âm đầu khó phát âm đứng một mình, cấu trúc khuyến nghị: <code>Âm [tên âm] trong tiếng [tiếng mẫu]: [tiếng mẫu]</code>.
                </p>
              </div>

              {/* Teacher Pedagogy Note */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Lưu ý khẩu hình / Ghi chú sư phạm:
                </label>
                <input
                  type="text"
                  value={formTeacherNote}
                  onChange={(e) => setFormTeacherNote(e.target.value)}
                  placeholder="Ví dụ: Khẩu hình hai môi khép nhẹ rồi bật hơi. Giáo viên làm mẫu trực tiếp."
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 font-medium text-xs bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Audit Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-audit"
                  checked={formIsAudited}
                  onChange={(e) => setFormIsAudited(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="chk-audit" className="text-xs font-black text-slate-800 cursor-pointer">
                  Đánh dấu đã kiểm tra về mặt sư phạm (Nội dung đúng theo chương trình lớp 1)
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-indigo-200">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-3d-green px-5 py-2 text-xs font-black text-white rounded-xl cursor-pointer"
                >
                  Lưu mục luyện đọc
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleStartCreate}
                className="btn-3d-yellow px-4 py-2.5 rounded-2xl text-slate-900 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm mục luyện đọc mới</span>
              </button>

              <button
                onClick={handleResetDefaults}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 underline cursor-pointer"
              >
                Khôi phục danh mục chuẩn GDPT 2018
              </button>
            </div>
          )}

          {/* Current Items Table */}
          <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 overflow-hidden">
            <div className="p-3 bg-slate-100 font-black text-xs text-slate-700 flex justify-between items-center">
              <span>Danh mục đang có ({items.length} mục)</span>
              <span className="text-[11px] font-normal text-slate-500">
                (Bấm nút loa để nghe máy đọc trước)
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-200">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="p-3 hover:bg-white transition-colors flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-white border border-slate-300 font-black text-base flex items-center justify-center text-slate-800 shrink-0 shadow-xs">
                      {it.display}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <span>{it.phoneticName}</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                          {it.type}
                        </span>
                        {it.isAuditedByTeacher ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Đã duyệt
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Chưa duyệt
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                        Máy đọc: <code className="text-indigo-700 font-bold">{it.speechText}</code>
                      </div>
                    </div>
                  </div>

                  {/* Actions for this item */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleTestSpeech(it.speechText)}
                      title="Nghe máy đọc"
                      className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleAudit(it.id)}
                      title="Chuyển trạng thái duyệt"
                      className="p-2 rounded-xl bg-slate-200 hover:bg-emerald-100 text-slate-700 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStartEdit(it)}
                      title="Chỉnh sửa mục này"
                      className="p-2 rounded-xl bg-slate-200 hover:bg-indigo-100 text-slate-700 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(it.id, it.display)}
                      title="Xóa mục này"
                      className="p-2 rounded-xl bg-slate-200 hover:bg-rose-100 text-slate-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-semibold">
            Dữ liệu được lưu trữ an toàn trong trình duyệt của giáo viên.
          </span>
          <button
            onClick={() => {
              audioManager.stop();
              onClose();
            }}
            className="btn-3d-green px-5 py-2 text-white font-black text-xs rounded-xl cursor-pointer"
          >
            Đóng bảng quản lý
          </button>
        </div>
      </div>
    </div>
  );
};
