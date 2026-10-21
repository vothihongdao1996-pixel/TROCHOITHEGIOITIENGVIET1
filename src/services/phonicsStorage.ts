import { PhonicsReadingItem, VietnameseLetter } from '../types';
import { INITIAL_PHONICS_ITEMS } from '../data/phonicsData';
import { VIETNAMESE_29_LETTERS } from '../data/learningData';

const PHONICS_STORAGE_KEY = 'viet1_phonics_items_v2';
const LETTERS_STORAGE_KEY = 'viet1_29_letters_v4';

class PhonicsStorageService {
  private items: PhonicsReadingItem[] = [];
  private letters: VietnameseLetter[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadItems();
    this.loadLetters();
  }

  private loadItems() {
    try {
      const data = localStorage.getItem(PHONICS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.items = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Lỗi khi đọc phonics items từ localStorage:', e);
    }
    this.items = [...INITIAL_PHONICS_ITEMS];
    this.saveItems();
  }

  private saveItems() {
    try {
      localStorage.setItem(PHONICS_STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.error('Lỗi khi lưu phonics items vào localStorage:', e);
    }
    this.notifyListeners();
  }

  private loadLetters() {
    try {
      const data = localStorage.getItem(LETTERS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length === 29 && parsed[0]?.soundText) {
          this.letters = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Lỗi khi đọc 29 letters từ localStorage:', e);
    }
    this.letters = [...VIETNAMESE_29_LETTERS];
    this.saveLetters();
  }

  private saveLetters() {
    try {
      localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(this.letters));
    } catch (e) {
      console.error('Lỗi khi lưu 29 letters vào localStorage:', e);
    }
    this.notifyListeners();
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

  // -------------------------
  // Phonics Reading Items
  // -------------------------
  public getItems(): PhonicsReadingItem[] {
    if (!this.items.length) {
      this.loadItems();
    }
    return this.items;
  }

  public addItem(item: Omit<PhonicsReadingItem, 'id' | 'isCustom'>): PhonicsReadingItem {
    const newItem: PhonicsReadingItem = {
      ...item,
      id: 'custom-' + Date.now(),
      isCustom: true,
    };
    this.items.unshift(newItem);
    this.saveItems();
    return newItem;
  }

  public updateItem(id: string, updates: Partial<PhonicsReadingItem>): boolean {
    const index = this.items.findIndex(it => it.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates };
      this.saveItems();
      return true;
    }
    return false;
  }

  public deleteItem(id: string): boolean {
    const initialLen = this.items.length;
    this.items = this.items.filter(it => it.id !== id);
    if (this.items.length !== initialLen) {
      this.saveItems();
      return true;
    }
    return false;
  }

  public toggleTeacherAudit(id: string): boolean {
    const item = this.items.find(it => it.id === id);
    if (item) {
      item.isAuditedByTeacher = !item.isAuditedByTeacher;
      this.saveItems();
      return item.isAuditedByTeacher;
    }
    return false;
  }

  public resetToDefaults() {
    this.items = [...INITIAL_PHONICS_ITEMS];
    this.saveItems();
  }

  // -------------------------
  // 29 Letters Management
  // -------------------------
  public getLetters(): VietnameseLetter[] {
    if (!this.letters.length) {
      this.loadLetters();
    }
    return this.letters;
  }

  public updateLetter(id: number, updates: Partial<VietnameseLetter>): boolean {
    const index = this.letters.findIndex(l => l.id === id);
    if (index !== -1) {
      const merged = { ...this.letters[index], ...updates };
      if (updates.soundText) {
        merged.phonemeSpeechText = updates.soundText;
      } else if (updates.phonemeSpeechText) {
        merged.soundText = updates.phonemeSpeechText;
      }
      this.letters[index] = merged;
      this.saveLetters();
      return true;
    }
    return false;
  }

  public toggleLetterAudit(id: number): boolean {
    const letter = this.letters.find(l => l.id === id);
    if (letter) {
      letter.isAuditedByTeacher = !letter.isAuditedByTeacher;
      this.saveLetters();
      return letter.isAuditedByTeacher;
    }
    return false;
  }

  public batchUpdateLetters(updatedLetters: VietnameseLetter[]) {
    this.letters = [...updatedLetters];
    this.saveLetters();
  }

  public resetLettersToDefaults() {
    this.letters = [...VIETNAMESE_29_LETTERS];
    this.saveLetters();
  }
}

export const phonicsStorage = new PhonicsStorageService();
