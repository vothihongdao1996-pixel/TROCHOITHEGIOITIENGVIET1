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
      // If no voice currently selected, auto-select the best Vietnamese voice
      if (!this.selectedVoiceURI && this.availableVoices.length > 0) {
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

    // 1. If user chose a specific voice, check if it matches
    if (this.selectedVoiceURI) {
      const matched = this.availableVoices.find(v => v.voiceURI === this.selectedVoiceURI);
      if (matched) return matched;
    }

    // 2. Look for Vietnamese voice with lang starting with 'vi'
    const viVoice = this.availableVoices.find(v =>
      v.lang.toLowerCase().replace('_', '-').startsWith('vi')
    );
    if (viVoice) return viVoice;

    // 3. Fallback: match by name containing "Vietnam" or "Tiếng Việt"
    const nameMatch = this.availableVoices.find(v =>
      v.name.toLowerCase().includes('vietnam') || v.name.toLowerCase().includes('tiếng việt')
    );
    if (nameMatch) return nameMatch;

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
        return 0.72;
      case 'fast':
        return 1.15;
      case 'normal':
      default:
        return 0.90;
    }
  }

  /**
   * Normalize single letter sound or phoneme for standard Grade 1 Vietnamese pronunciation.
   * e.g. 'm' -> 'mờ', 'b' -> 'bờ', 'k' -> 'ca', etc.
   */
  public normalizePhoneticSound(input: string): string {
    if (!input) return '';
    const clean = input.trim().toLowerCase().replace(/^\/|\/$/g, '');

    const phonemeMap: Record<string, string> = {
      m: 'mờ',
      b: 'bờ',
      c: 'cờ',
      d: 'dờ',
      đ: 'đờ',
      g: 'gờ',
      h: 'hờ',
      k: 'ca',
      l: 'lờ',
      n: 'nờ',
      o: 'o',
      ô: 'ô',
      ơ: 'ơ',
      p: 'pờ',
      q: 'quờ',
      r: 'rờ',
      s: 'sờ',
      t: 'tờ',
      u: 'u',
      ư: 'ư',
      v: 'vờ',
      x: 'xờ',
      y: 'i',
      ch: 'chờ',
      gh: 'gờ',
      gi: 'gi',
      kh: 'khờ',
      nh: 'nhờ',
      ng: 'ngờ',
      ngh: 'ngờ',
      ph: 'phờ',
      th: 'thờ',
      tr: 'trờ',
      qu: 'quờ',
      ă: 'á',
      â: 'ớ',
    };

    if (phonemeMap[clean]) {
      return phonemeMap[clean];
    }

    return input.trim();
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

    const utterance = new SpeechSynthesisUtterance(text);
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
