import { ReadingSpeed } from '../types';

class AudioManagerService {
  private isMutedState: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private selectedVoiceURI: string = '';
  private readingSpeed: ReadingSpeed = 'normal';
  private lastSpokenText: string = '';
  private isCurrentlySpeaking: boolean = false;
  private listeners: Array<() => void> = [];

  constructor() {
    // Load persisted preferences
    try {
      const savedMute = localStorage.getItem('viet1_audio_muted');
      if (savedMute !== null) {
        this.isMutedState = savedMute === 'true';
      }
      const savedSpeed = localStorage.getItem('viet1_reading_speed') as ReadingSpeed;
      if (savedSpeed && ['slow', 'normal', 'fast'].includes(savedSpeed)) {
        this.readingSpeed = savedSpeed;
      }
      const savedVoiceURI = localStorage.getItem('viet1_selected_voice');
      if (savedVoiceURI) {
        this.selectedVoiceURI = savedVoiceURI;
      }
    } catch {
      // ignore
    }

    // Initialize voice list
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.updateVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.updateVoices();
      };
    }
  }

  private updateVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices();
      
      // Auto-select best Northern female Vietnamese voice if none selected or if previous was non-optimal
      const currentSelected = this.availableVoices.find(v => v.voiceURI === this.selectedVoiceURI);
      const isMaleVoice = currentSelected && (
        currentSelected.name.toLowerCase().includes('namminh') ||
        currentSelected.name.toLowerCase().includes('male')
      );
      if ((!this.selectedVoiceURI || isMaleVoice) && this.availableVoices.length > 0) {
        const viVoice = this.getVietnameseVoice();
        if (viVoice) {
          this.selectedVoiceURI = viVoice.voiceURI;
        }
      }
      this.notifyListeners();
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn());
  }

  public isMuted(): boolean {
    return this.isMutedState;
  }

  public setMuted(muted: boolean) {
    this.isMutedState = muted;
    try {
      localStorage.setItem('viet1_audio_muted', String(muted));
    } catch {
      // ignore
    }
    if (muted) {
      this.stop();
    }
    this.notifyListeners();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMutedState);
    return this.isMutedState;
  }

  public getSpeed(): ReadingSpeed {
    return this.readingSpeed;
  }

  public setSpeed(speed: ReadingSpeed) {
    this.readingSpeed = speed;
    try {
      localStorage.setItem('viet1_reading_speed', speed);
    } catch {
      // ignore
    }
    this.notifyListeners();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices;
  }

  public getVietnameseVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices.filter(v =>
      v.lang.toLowerCase().replace('_', '-').startsWith('vi')
    );
  }

  public getSelectedVoiceURI(): string {
    return this.selectedVoiceURI;
  }

  public setSelectedVoice(voiceURI: string) {
    this.selectedVoiceURI = voiceURI;
    try {
      localStorage.setItem('viet1_selected_voice', voiceURI);
    } catch {
      // ignore
    }
    this.notifyListeners();
  }

  public getVietnameseVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    if (!this.availableVoices.length) {
      this.availableVoices = window.speechSynthesis.getVoices();
    }

    // 1. If user chose a specific voice manually, verify if it is valid
    if (this.selectedVoiceURI) {
      const matched = this.availableVoices.find(v => v.voiceURI === this.selectedVoiceURI);
      if (matched) return matched;
    }

    // 2. Filter all Vietnamese-supporting voices
    const viVoices = this.availableVoices.filter(v =>
      v.lang.toLowerCase().replace('_', '-').startsWith('vi') ||
      v.name.toLowerCase().includes('vietnam') ||
      v.name.toLowerCase().includes('tiếng việt')
    );

    if (viVoices.length > 0) {
      // Score voices to strictly prioritize gentle Northern Vietnamese female voices
      const scoreVoice = (v: SpeechSynthesisVoice): number => {
        let score = 10;
        const name = v.name.toLowerCase();
        const uri = v.voiceURI.toLowerCase();

        // Microsoft Edge Natural Northern Female (HoaiMy is recognized as the best Northern VN voice)
        if (name.includes('hoaimy') || name.includes('hoài my')) score += 120;
        // Apple macOS / iOS Northern Female voice (Linh)
        if (name.includes('linh')) score += 110;
        // Apple / Microsoft female voice (Mai)
        if (name.includes('mai')) score += 95;
        // Other pleasant female voices (Phuong, Chi, An)
        if (name.includes('phuong') || name.includes('phương') || name.includes('chi') || name.includes('an')) score += 85;

        // Google tiếng Việt (Chrome / Android standard neural female voice)
        if (name.includes('google') || uri.includes('google')) score += 80;

        // Neural natural indicators
        if (name.includes('natural') || uri.includes('natural')) score += 30;
        if (name.includes('online') || uri.includes('online')) score += 15;

        // Female gender indicators
        if (name.includes('female') || name.includes('nữ') || uri.includes('female')) score += 25;

        // Strongly penalize male voices when female voices are available
        if (name.includes('namminh') || name.includes('male') || name.includes('nam') || uri.includes('male')) {
          score -= 60;
        }

        return score;
      };

      const sorted = [...viVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
      return sorted[0];
    }

    return null;
  }

  public hasVietnameseVoice(): boolean {
    return this.getVietnameseVoice() !== null;
  }

  public isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getLastSpokenText(): string {
    return this.lastSpokenText;
  }

  /**
   * Stop any currently active speech synthesis
   */
  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
      this.isCurrentlySpeaking = false;
      this.notifyListeners();
    }
  }

  public isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  private getRateFromSpeed(speed: ReadingSpeed): number {
    switch (speed) {
      case 'slow':
        return 0.75;
      case 'fast':
        return 1.10;
      case 'normal':
      default:
        // 0.88: Tốc độ vừa phải, nhẹ nhàng, rõ ràng, phù hợp cho học sinh lớp 1
        return 0.88;
    }
  }

  /**
   * Bảng ánh xạ âm chuẩn Tiếng Việt lớp 1 (GDPT 2018 / Bộ sách Kết nối tri thức với cuộc sống)
   * Khi luyện đọc âm, ghép tiếng và đánh vần: ĐỌC ĐÚNG ÂM, KHÔNG ĐỌC TÊN CHỮ CÁI!
   */
  public readonly PHONEME_CONSONANT_MAP: Record<string, string> = {
    b: 'bờ',
    c: 'cờ',
    d: 'dờ',
    đ: 'đờ',
    g: 'gờ',
    gh: 'gờ',
    gi: 'gi',
    h: 'hờ',
    k: 'ca',
    l: 'lờ',
    m: 'mờ',
    n: 'nờ',
    p: 'pờ',
    ph: 'phờ',
    q: 'cu',
    qu: 'quờ',
    r: 'rờ',
    s: 'sờ',
    t: 'tờ',
    th: 'thờ',
    tr: 'trờ',
    v: 'vờ',
    x: 'xờ',
    ch: 'chờ',
    kh: 'khờ',
    nh: 'nhờ',
    ng: 'ngờ',
    ngh: 'ngờ',
  };

  public readonly VOWEL_SOUND_MAP: Record<string, string> = {
    a: 'a',
    ă: 'á',
    â: 'ớ',
    e: 'e',
    ê: 'ê',
    i: 'i',
    o: 'o',
    ô: 'ô',
    ơ: 'ơ',
    u: 'u',
    ư: 'ư',
    y: 'i',
  };

  public readonly LETTER_NAME_MAP: Record<string, string> = {
    a: 'chữ a',
    ă: 'chữ á',
    â: 'chữ ớ',
    b: 'chữ bê',
    c: 'chữ xê',
    d: 'chữ dê',
    đ: 'chữ đê',
    e: 'chữ e',
    ê: 'chữ ê',
    g: 'chữ giê',
    h: 'chữ hát',
    i: 'chữ i ngắn',
    k: 'chữ ca',
    l: 'chữ e lờ',
    m: 'chữ e mờ',
    n: 'chữ e nờ',
    o: 'chữ o',
    ô: 'chữ ô',
    ơ: 'chữ ơ',
    p: 'chữ pê',
    q: 'chữ quy',
    r: 'chữ e rờ',
    s: 'chữ ét xì',
    t: 'chữ tê',
    u: 'chữ u',
    ư: 'chữ ư',
    v: 'chữ vê',
    x: 'chữ ích xì',
    y: 'chữ i dài',
  };

  /**
   * Chuẩn hóa âm đọc đơn lẻ hoặc phiên âm tiếng Việt lớp 1
   */
  public normalizePhoneticSound(input: string): string {
    if (!input) return '';
    const clean = input.trim().toLowerCase().replace(/^\/|\/$/g, '');
    if (this.PHONEME_CONSONANT_MAP[clean]) {
      return this.PHONEME_CONSONANT_MAP[clean];
    }
    if (this.VOWEL_SOUND_MAP[clean]) {
      return this.VOWEL_SOUND_MAP[clean];
    }
    return input.trim();
  }

  /**
   * Bộ xử lý phát âm chuẩn sư phạm Tiếng Việt lớp 1 cho toàn bộ ứng dụng
   * - Phân biệt rõ Tên chữ cái (bê, xê, dê, đê...) và Âm chữ cái (bờ, cờ, dờ, đờ...)
   * - Tự động phát hiện ngữ cảnh âm đầu, âm chính, âm cuối, đánh vần, ghép tiếng
   * - Ngắt nhịp bằng dấu phẩy diễn cảm, rõ ràng, phù hợp học sinh lớp 1
   */
  /**
   * Bộ xử lý phát âm chuẩn sư phạm Tiếng Việt lớp 1 cho toàn bộ ứng dụng
   * (Chương trình GDPT 2018 / Bộ sách Tiếng Việt 1 - Kết nối tri thức với cuộc sống)
   * - Phân biệt rõ Tên chữ cái (bê, xê, dê, đê...) và Âm chữ cái (bờ, cờ, dờ, đờ...)
   * - Đặc biệt xử lý phần giải thích đáp án:
   *   Ví dụ: "Đây là chữ b." -> Giọng đọc chuẩn: "Đây là chữ bờ. Con hãy đọc: bờ."
   *   "Chữ b có nét thẳng..." -> "Chữ bờ có nét thẳng..."
   *   "B + an = ban" -> "bờ cộng an, bằng ban"
   *   "Điền c hay k" -> "Điền cờ hay ca"
   *   "Tên chữ cái b là bê" -> Đọc đúng tên chữ bê
   * - Tách riêng hiển thị và văn bản gửi đến Web Speech API, đảm bảo tự nhiên, không ngắt quãng.
   */
  public preparePhoneticSpeech(raw: string): string {
    if (!raw) return '';
    let text = raw
      .replace(/[⭐🏆💡🎉✨👏❤️🔔🏅]/g, '')
      .replace(/\(\+1\s*⭐?\)/g, '')
      .trim();

    // 1. Nếu văn bản truyền vào là chữ/âm đơn lẻ (khi bấm nghe thẻ chữ/âm đầu)
    const single = text.trim().toLowerCase().replace(/^\/|\/$/g, '');
    if (this.PHONEME_CONSONANT_MAP[single]) {
      return this.PHONEME_CONSONANT_MAP[single];
    }
    if (this.VOWEL_SOUND_MAP[single]) {
      return this.VOWEL_SOUND_MAP[single];
    }

    // 2. Ký hiệu phiên âm giữa dấu gạch chéo: /bờ/ -> bờ, /cờ/ -> cờ, /a/ -> a...
    text = text.replace(/\/([a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]+)\//g, (_, p1) => {
      const low = p1.toLowerCase();
      if (this.PHONEME_CONSONANT_MAP[low]) return this.PHONEME_CONSONANT_MAP[low];
      if (this.VOWEL_SOUND_MAP[low]) return this.VOWEL_SOUND_MAP[low];
      return p1;
    });

    // 3. Yêu cầu sư phạm đặc biệt: "Đây là chữ b." -> "Đây là chữ bờ. Con hãy đọc: bờ."
    text = text.replace(/(đây\s+là\s+(?:chữ|con\s+chữ|âm|âm\s+đầu))\s+([a-zđA-ZĐ]{1,3})(?=\.|\s*$)/gi, (_, prefix, char) => {
      const low = char.toLowerCase();
      const sound = this.PHONEME_CONSONANT_MAP[low] || this.VOWEL_SOUND_MAP[low] || char;
      return `${prefix} ${sound}. Con hãy đọc: ${sound}`;
    });

    // 4. Ngữ cảnh gọi tên chữ cái chuẩn: "tên chữ cái b là bê", "tên chữ b", "tên con chữ b"
    text = text.replace(/(tên\s+chữ\s+cái|tên\s+chữ|tên\s+con\s+chữ)\s+([a-zđA-ZĐ]{1,2})\b/gi, (_, prefix, char) => {
      const low = char.toLowerCase();
      const mapped = this.LETTER_NAME_MAP[low];
      if (mapped) {
        return `${prefix} ${mapped.replace(/^chữ\s+/i, '')}`;
      }
      return `${prefix} ${char}`;
    });

    // Ngữ cảnh tên chữ hoa - chữ thường: "Chữ in hoa B đi đôi với chữ in thường b"
    text = text.replace(/chữ\s+(?:in\s+)?(hoa|thường)\s+([a-zđA-ZĐ])\b/gi, (_, kind, char) => {
      const low = char.toLowerCase();
      const mapped = this.LETTER_NAME_MAP[low];
      const name = mapped ? mapped.replace(/^chữ\s+/i, '') : char;
      return `chữ ${kind} ${name}`;
    });

    // 5. Phép ghép tiếng dạng "+": "B + an = ban", "B + iên + hỏi = biển", "g + à = gà"
    text = text.replace(/(?:^|\s)([a-zđA-ZĐ]+)\s*\+\s*([a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]+)(?:\s*\+\s*([^\s=\?]+))?(?:\s*=\s*([a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]+))?/g, (_, p1, p2, p3, p4) => {
      const sound1 = this.PHONEME_CONSONANT_MAP[p1.toLowerCase()] || p1;
      let res = ` ${sound1} cộng ${p2}`;
      if (p3) {
        const cleanP3 = p3.replace(/thanh\s*/i, '').trim();
        res += `, thêm thanh ${cleanP3}`;
      }
      if (p4) {
        res += `, bằng ${p4}`;
      }
      return res;
    });

    // 6. Chuỗi đánh vần dấu gạch nối: "b - a - ba", "c - a - ca - sắc - cá"
    text = text.replace(/(?:^|\s)([a-zđA-ZĐ]+)\s*-\s*([a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]+)\s*-\s*([a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]+)(?:\s*-\s*([a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]+)\s*-\s*([a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]+))?/g, (_, p1, p2, p3, p4, p5) => {
      const sound1 = this.PHONEME_CONSONANT_MAP[p1.toLowerCase()] || p1;
      let res = ` ${sound1}, ${p2}, ${p3}`;
      if (p4 && p5) {
        res += `, ${p4}, ${p5}`;
      }
      return res;
    });

    // 7. Quy tắc chính tả & câu hỏi lựa chọn: "Điền c hay k", "gh đứng trước e, ê, i"
    text = text.replace(/(điền|chọn|phân\s+biệt)\s+([a-zđA-ZĐ]+)\s+hay\s+([a-zđA-ZĐ]+)/gi, (_, verb, w1, w2) => {
      const low1 = w1.toLowerCase();
      const low2 = w2.toLowerCase();
      if (low1 === 'g' && low2 === 'gh') return `${verb} gờ đơn hay gờ kép`;
      if (low1 === 'ng' && low2 === 'ngh') return `${verb} ngờ đơn hay ngờ kép`;
      const s1 = this.PHONEME_CONSONANT_MAP[low1] || w1;
      const s2 = this.PHONEME_CONSONANT_MAP[low2] || w2;
      return `${verb} ${s1} hay ${s2}`;
    });

    text = text.replace(/(^|[\s,;])([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ]|ch|kh|nh|ng|ngh|ph|th|tr|qu|gh|gi)\s+(ghép\s+với|đứng\s+trước|đứng\s+sau|đi\s+với|đi\s+sau|kết\s+hợp\s+với|luôn\s+viết\s+bằng)/gi, (_, punc, init, verb) => {
      const low = init.toLowerCase();
      let s = this.PHONEME_CONSONANT_MAP[low] || init;
      if (low === 'gh') s = 'gờ kép';
      if (low === 'ngh') s = 'ngờ kép';
      if (low === 'g') s = 'gờ đơn';
      if (low === 'ng') s = 'ngờ đơn';
      return `${punc}${s} ${verb}`;
    });

    // 8. Chữ hoặc âm đặt trong ngoặc kép: âm "b", con chữ "a", vần "ông", tiếng "ba"
    text = text.replace(/(âm|âm\s+đầu|âm\s+chính|âm\s+cuối|âm\s+đệm|phụ\s+âm\s+đầu|phụ\s+âm|nguyên\s+âm\s+chính|nguyên\s+âm|âm\s+ghép|chữ|con\s+chữ|chữ\s+cái)\s*["“”„]([a-zđA-ZĐ]{1,3})["“”„]/gi, (_, prefix, letter) => {
      const low = letter.toLowerCase();
      if (this.PHONEME_CONSONANT_MAP[low]) return `${prefix} ${this.PHONEME_CONSONANT_MAP[low]}`;
      if (this.VOWEL_SOUND_MAP[low]) return `${prefix} ${this.VOWEL_SOUND_MAP[low]}`;
      return `${prefix} ${letter}`;
    });

    // 9. Ngữ cảnh âm và chữ đứng liền kề:
    // "chữ b", "chữ c", "chữ d", "con chữ b", "âm b", "phụ âm đầu s", "âm cuối n", "đáp án là b", "chọn chữ b"
    const phonemePrefixes = [
      'phụ\\s+âm\\s+đầu',
      'phụ\\s+âm',
      'âm\\s+đầu',
      'nguyên\\s+âm\\s+chính',
      'nguyên\\s+âm',
      'âm\\s+chính',
      'âm\\s+cuối',
      'âm\\s+đệm',
      'âm\\s+ghép',
      'kết\\s+thúc\\s+bằng\\s+âm',
      'bắt\\s+đầu\\s+bằng\\s+âm',
      'chứa\\s+âm',
      'ghép\\s+âm',
      'với\\s+âm',
      'có\\s+âm',
      'đáp\\s+án\\s+là',
      'đáp\\s+án\\s+đúng\\s+là',
      'chọn\\s+chữ',
      'chọn\\s+con\\s+chữ',
      'chọn\\s+đáp\\s+án',
      'chữ\\s+cái',
      'con\\s+chữ',
      'chữ',
      'âm',
    ].join('|');

    const phonemeRegex = new RegExp(`(${phonemePrefixes})\\s+([a-zđA-ZĐ]{1,3})(?=[\\s,;.!?:)"“”»]|$)`, 'gi');
    text = text.replace(phonemeRegex, (match, prefix, letter) => {
      const low = letter.toLowerCase();
      // Không biến đổi nếu là các từ tiếng Việt thông dụng
      if (['chính', 'đầu', 'cuối', 'đệm', 'thanh', 'vang', 'đôi', 'mũi', 'hưởng', 'hoa', 'thường', 'nhật', 'kết', 'nối'].includes(low)) {
        return match;
      }
      if (this.PHONEME_CONSONANT_MAP[low]) {
        return `${prefix} ${this.PHONEME_CONSONANT_MAP[low]}`;
      }
      if (this.VOWEL_SOUND_MAP[low]) {
        return `${prefix} ${this.VOWEL_SOUND_MAP[low]}`;
      }
      return match;
    });

    // 10. Liệt kê các chữ cách nhau bằng dấu phẩy: "là ă, b, c.", "là d, đ, e."
    text = text.replace(/([,:]\s*)([b-df-hj-np-tv-zđăâ])(?=[,.\s]|$)/gi, (m, prefix, letter) => {
      const low = letter.toLowerCase();
      if (this.PHONEME_CONSONANT_MAP[low]) {
        return `${prefix}${this.PHONEME_CONSONANT_MAP[low]}`;
      }
      if (this.VOWEL_SOUND_MAP[low]) {
        return `${prefix}${this.VOWEL_SOUND_MAP[low]}`;
      }
      return m;
    });

    // 11. Làm sạch giải thích lặp âm: âm cờ (cờ) -> âm cờ
    text = text
      .replace(/âm\s+cờ\s*\(cờ\)/gi, 'âm cờ')
      .replace(/âm\s+bờ\s*\(bờ\)/gi, 'âm bờ')
      .replace(/âm\s+dờ\s*\(dờ\)/gi, 'âm dờ')
      .replace(/âm\s+đờ\s*\(đờ\)/gi, 'âm đờ')
      .replace(/âm\s+sờ\s*\(sờ\)/gi, 'âm sờ')
      .replace(/âm\s+xờ\s*\(xờ\)/gi, 'âm xờ');

    // 12. Xóa dấu ngoặc kép còn lại, chuẩn hóa dấu nối và khoảng trắng
    text = text
      .replace(/["“”„»«]/g, '')
      .replace(/\s+-\s+/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();

    return text;
  }

  /**
   * Single unified entry point: "Máy đọc tiếng Việt"
   * Cancels any prior speech to prevent overlap.
   */
  public speak(
    text: string,
    options?: {
      pitch?: number;
      speed?: ReadingSpeed;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    }
  ): boolean {
    if (this.isMutedState) {
      if (options?.onEnd) options.onEnd();
      return false;
    }

    if (!this.isSpeechSupported()) {
      console.warn('Trình duyệt không hỗ trợ Web Speech API.');
      if (options?.onError) options.onError('Trình duyệt không hỗ trợ Web Speech API.');
      return false;
    }

    if (!text || !text.trim()) {
      if (options?.onEnd) options.onEnd();
      return false;
    }

    this.lastSpokenText = text;

    // Refresh voices if empty
    if (this.availableVoices.length === 0 && typeof window !== 'undefined') {
      this.availableVoices = window.speechSynthesis.getVoices();
    }

    // Clean up old utterance handlers to avoid duplicate onend/onerror triggers
    if (this.currentUtterance) {
      this.currentUtterance.onstart = null;
      this.currentUtterance.onend = null;
      this.currentUtterance.onerror = null;
    }

    const wasSpeaking = window.speechSynthesis.speaking;
    if (wasSpeaking) {
      window.speechSynthesis.cancel();
    }

    // Always ensure speechSynthesis is resumed (handles Chrome pause bug)
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const speechText = this.preparePhoneticSpeech(text);
    const utterance = new SpeechSynthesisUtterance(speechText);
    const selectedVoice = this.getVietnameseVoice();

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = 'vi-VN';
    }

    // Speed & pitch setup
    const effectiveSpeed = options?.speed || this.readingSpeed;
    utterance.rate = this.getRateFromSpeed(effectiveSpeed);
    utterance.pitch = options?.pitch ?? 1.0;

    let hasEnded = false;
    const safeEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      this.currentUtterance = null;
      this.isCurrentlySpeaking = false;
      this.notifyListeners();
      if (options?.onEnd) options.onEnd();
    };

    const safeError = (e: unknown) => {
      if (hasEnded) return;
      hasEnded = true;
      this.currentUtterance = null;
      this.isCurrentlySpeaking = false;
      this.notifyListeners();
      if (options?.onError) options.onError(e);
      else if (options?.onEnd) options.onEnd();
    };

    utterance.onstart = () => {
      this.isCurrentlySpeaking = true;
      this.notifyListeners();
    };

    utterance.onend = safeEnd;
    utterance.onerror = safeError;

    this.currentUtterance = utterance;

    // Execute speak with small delay if we just cancelled to prevent Chromium race condition
    const executeSpeak = () => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        this.isCurrentlySpeaking = false;
        this.notifyListeners();
        console.error('Lỗi khi gọi SpeechSynthesis:', e);
        safeError(e);
      }
    };

    if (wasSpeaking) {
      setTimeout(executeSpeak, 25);
    } else {
      executeSpeak();
    }

    return true;
  }

  /**
   * Specifically for Journey and Games secret sounds:
   * 1. Guarantees 0ms auditory click/cue feedback via Web Audio API so student knows it was pressed.
   * 2. Automatically un-mutes if currently muted.
   * 3. Resumes SpeechSynthesis and AudioContext (satisfies browser user gesture requirement).
   * 4. Normalizes phoneme text (e.g. 'm' -> 'mờ') so it pronounces accurately in Vietnamese.
   * 5. Informs caller if Vietnamese voice is missing, without ever staying silent.
   */
  public speakSecretSound(
    sound: string,
    options?: {
      phonemeHint?: string;
      onEnd?: () => void;
      onError?: (errMsg: string) => void;
      onNoVietnameseVoice?: () => void;
    }
  ): boolean {
    if (this.isMutedState) {
      this.setMuted(false);
    }

    // 1. Instantaneous feedback tone via AudioContext
    this.playSoundEffect('star');

    // 2. Ensure AudioContext & SpeechSynthesis are resumed
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }

    // 3. Normalize phoneme
    const textToSpeak = this.normalizePhoneticSound(sound);

    // 4. Check if Vietnamese voice is available
    const hasVi = this.hasVietnameseVoice();
    if (!hasVi) {
      if (options?.onNoVietnameseVoice) {
        options.onNoVietnameseVoice();
      }
      if (options?.onError) {
        options.onError(
          'Thiết bị chưa có gói giọng đọc tiếng Việt (vi-VN). Hãy bật gói tiếng Việt trên trình duyệt hoặc xem chữ mẫu!'
        );
      }
    }

    // 5. Speak after brief cue delay (150ms) so chime and voice blend pleasantly
    setTimeout(() => {
      this.speak(textToSpeak, {
        speed: 'slow',
        pitch: 1.05,
        onEnd: options?.onEnd,
        onError: (err) => {
          if (options?.onError) {
            options.onError('Không thể phát âm thanh. Bé hãy bấm thử lại hoặc nghe gợi ý!');
          } else if (options?.onEnd) {
            options.onEnd();
          }
        },
      });
    }, 150);

    return true;
  }

  /**
   * Replay the last spoken text using current settings
   */
  public replay(onEnd?: () => void): boolean {
    if (!this.lastSpokenText) return false;
    return this.speak(this.lastSpokenText, { onEnd });
  }

  /**
   * Helper for Ong Vàng dialogue (same engine, friendlier pitch)
   */
  public speakOngVang(text: string, onEnd?: () => void): boolean {
    return this.speak(text, { pitch: 1.25, onEnd });
  }

  /**
   * Chuẩn hóa văn bản nhận xét và giải thích đáp án trước khi đọc qua Web Speech API
   * Loại bỏ ký tự đặc biệt, dấu ngoặc kép, emoji và thay thế dấu nối trong đánh vần
   * bằng dấu phẩy để ngắt nhịp tự nhiên, diễn cảm, rõ ràng cho học sinh lớp 1.
   */
  public cleanTextForSpeech(text: string): string {
    if (!text) return '';
    return this.preparePhoneticSpeech(text);
  }

  /**
   * Đọc lời nhận xét và toàn bộ phần giải thích đáp án đang hiển thị trên màn hình
   * Ghép lời nhận xét và nội dung giải thích thành 1 lượt đọc liên tục duy nhất,
   * tránh tình trạng lời đọc sau ngắt lời đọc trước.
   * Sử dụng giọng nữ tiếng Việt miền Bắc, nhẹ nhàng, rõ ràng, tốc độ vừa phải cho học sinh lớp 1.
   */
  public speakFeedback(
    isCorrect: boolean,
    explanation: string,
    options?: { onEnd?: () => void }
  ): boolean {
    const cleanExplanation = this.cleanTextForSpeech(explanation);
    const prefix = isCorrect
      ? 'Tuyệt vời! Con làm đúng rồi!'
      : 'Chưa đúng rồi, không sao con nhé!';

    const fullText = cleanExplanation
      ? `${prefix} ${cleanExplanation}`
      : prefix;

    // Khoảng hoãn 180ms để hiệu ứng âm thanh (chime) kịp vang lên trước khi bắt đầu đọc lời giải
    setTimeout(() => {
      this.speak(fullText, {
        pitch: 1.05,
        speed: 'normal',
        onEnd: options?.onEnd,
      });
    }, 180);

    return true;
  }

  /**
   * Web Audio API synthesized sound effects
   */
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playSoundEffect(type: 'correct' | 'wrong' | 'click' | 'star' | 'badge') {
    if (this.isMutedState) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      if (type === 'correct') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.32);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'star') {
        const freqs = [659.25, 880, 1174.66, 1318.51, 1567.98];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);

          gain.gain.setValueAtTime(0.15, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.4);
        });
      } else if (type === 'badge') {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);

          gain.gain.setValueAtTime(0.25, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.5);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.55);
        });
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch {
      // AudioContext unavailable
    }
  }
}

export const audioManager = new AudioManagerService();
