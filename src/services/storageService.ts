import { StudentProfile, PlaySession, StudentJourneyProgress, ArenaLeaderboardEntry } from '../types';

const PROFILES_KEY = 'viet1_profiles_v1';
const ACTIVE_PROFILE_KEY = 'viet1_active_profile_v1';
const SESSIONS_KEY = 'viet1_sessions_v1';

export const DEFAULT_PROFILES: StudentProfile[] = [
  {
    id: 'hs-01',
    name: 'Bé Bắp Vàng',
    className: '1/1',
    avatar: 'bee',
    stars: 12,
    badges: ['Nhận diện Chữ Giỏi', 'Tai Nghe Tinh Anh'],
    createdDate: '2026-10-15',
  },
  {
    id: 'hs-02',
    name: 'Bé Thỏ Bông',
    className: '1/2',
    avatar: 'rabbit',
    stars: 8,
    badges: ['Xưởng Ghép Vần Nhí'],
    createdDate: '2026-10-16',
  },
];

const HAS_REGISTERED_KEY = 'viet1_has_registered_student_v1';

class StorageService {
  public getProfiles(): StudentProfile[] {
    try {
      const data = localStorage.getItem(PROFILES_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            ...p,
            className: p.className || '1/1',
          }));
        }
      }
    } catch (e) {
      console.warn('Could not read profiles from localStorage:', e);
    }
    // Default initial profiles
    this.saveProfiles(DEFAULT_PROFILES);
    return DEFAULT_PROFILES;
  }

  public saveProfiles(profiles: StudentProfile[]) {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to save profiles to localStorage:', e);
    }
  }

  public getActiveProfile(): StudentProfile {
    const profiles = this.getProfiles();
    try {
      const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
      if (activeId) {
        const found = profiles.find((p) => p.id === activeId);
        if (found) {
          if (!found.className) found.className = '1/1';
          return found;
        }
      }
    } catch {
      // ignore
    }
    const defaultProfile = profiles[0] || DEFAULT_PROFILES[0];
    this.setActiveProfile(defaultProfile.id);
    return defaultProfile;
  }

  public setActiveProfile(profileId: string) {
    try {
      localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
    } catch {
      // ignore
    }
  }

  public hasCompletedStudentSetup(): boolean {
    try {
      return localStorage.getItem(HAS_REGISTERED_KEY) === 'true';
    } catch {
      return false;
    }
  }

  public setHasCompletedStudentSetup(completed: boolean = true) {
    try {
      localStorage.setItem(HAS_REGISTERED_KEY, completed ? 'true' : 'false');
    } catch {
      // ignore
    }
  }

  public addProfile(name: string, className: string = '1/1', avatar: string = 'bee'): StudentProfile {
    const profiles = this.getProfiles();
    const newProfile: StudentProfile = {
      id: 'hs-' + Date.now().toString().slice(-6),
      name: name.trim() || 'Học sinh mới',
      className: className || '1/1',
      avatar: avatar || 'bee',
      stars: 0,
      badges: [],
      createdDate: new Date().toISOString().split('T')[0],
    };
    profiles.push(newProfile);
    this.saveProfiles(profiles);
    this.setActiveProfile(newProfile.id);
    this.setHasCompletedStudentSetup(true);
    return newProfile;
  }

  public updateProfile(
    profileId: string,
    updates: Partial<Pick<StudentProfile, 'name' | 'className' | 'avatar'>>
  ): StudentProfile | null {
    const profiles = this.getProfiles();
    const target = profiles.find((p) => p.id === profileId);
    if (target) {
      if (updates.name !== undefined) target.name = updates.name.trim();
      if (updates.className !== undefined) target.className = updates.className;
      if (updates.avatar !== undefined) target.avatar = updates.avatar;
      this.saveProfiles(profiles);
      this.setHasCompletedStudentSetup(true);
      return target;
    }
    return null;
  }

  public registerOrSaveStudent(
    name: string,
    className: string,
    avatar: string,
    isNew: boolean = false
  ): StudentProfile {
    const trimmedName = name.trim();
    const validClass = className || '1/1';
    const validAvatar = avatar || 'bee';

    if (isNew) {
      return this.addProfile(trimmedName, validClass, validAvatar);
    }

    const activeProfile = this.getActiveProfile();
    // If current profile is default starter profile, we can update it or create new
    if (activeProfile && !activeProfile.id.startsWith('hs-01') && !activeProfile.id.startsWith('hs-02')) {
      const updated = this.updateProfile(activeProfile.id, {
        name: trimmedName,
        className: validClass,
        avatar: validAvatar,
      });
      if (updated) return updated;
    }

    // Otherwise create dedicated profile for this student
    return this.addProfile(trimmedName, validClass, validAvatar);
  }

  public updateProfileStars(profileId: string, addedStars: number, newBadge?: string) {
    const profiles = this.getProfiles();
    const target = profiles.find((p) => p.id === profileId);
    if (target) {
      target.stars += addedStars;
      if (newBadge && !target.badges.includes(newBadge)) {
        target.badges.push(newBadge);
      }
      this.saveProfiles(profiles);
    }
  }

  // Play sessions
  public getSessions(): PlaySession[] {
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read play sessions:', e);
    }
    return [];
  }

  public recordSession(session: Omit<PlaySession, 'id' | 'date'>) {
    const sessions = this.getSessions();
    const newRecord: PlaySession = {
      ...session,
      id: 'sess-' + Date.now(),
      date: new Date().toLocaleString('vi-VN'),
    };
    sessions.unshift(newRecord);
    // Limit to latest 100 sessions to avoid exceeding storage
    if (sessions.length > 100) sessions.pop();

    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save session to localStorage:', e);
    }

    // Award badge if high score
    let earnedBadge: string | undefined = undefined;
    if (session.correctCount >= session.totalQuestions) {
      if (session.gameId === 1) earnedBadge = 'Vua Chữ Cái';
      else if (session.gameId === 7) earnedBadge = 'Đôi Tai Vàng';
      else if (session.gameId === 12) earnedBadge = 'Bậc Thầy Ghép Vần';
      else if (session.gameId === 13) earnedBadge = 'Thần Đồng Điền Vần';
      else if (session.gameId === 24) earnedBadge = 'Họa Sĩ Từ Ngữ';
      else if (session.gameId === 29) earnedBadge = 'Độc Giả Nhí Tài Ba';
    }

    this.updateProfileStars(session.studentId, session.starsEarned, earnedBadge);
    return newRecord;
  }

  public clearSessions() {
    try {
      localStorage.removeItem(SESSIONS_KEY);
    } catch {
      // ignore
    }
  }

  // =============================================================
  // LETTER LEARNING STATUS STORAGE (Chữ đã học / đang học / chưa học)
  // =============================================================
  public getLearnedLetterIds(studentId: string): number[] {
    const key = `viet1_learned_letters_${studentId}`;
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    // Default initial: first 5 letters marked learned (a, ă, â, b, c)
    const initial = [1, 2, 3, 4, 5];
    this.saveLearnedLetterIds(studentId, initial);
    return initial;
  }

  public saveLearnedLetterIds(studentId: string, ids: number[]) {
    const key = `viet1_learned_letters_${studentId}`;
    try {
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }

  public toggleLetterLearned(studentId: string, letterId: number): boolean {
    const current = this.getLearnedLetterIds(studentId);
    let next: number[];
    let isNowLearned = false;
    if (current.includes(letterId)) {
      next = current.filter((id) => id !== letterId);
      isNowLearned = false;
    } else {
      next = [...current, letterId];
      isNowLearned = true;
      this.updateProfileStars(studentId, 1);
    }
    this.saveLearnedLetterIds(studentId, next);
    return isNowLearned;
  }

  // =============================================================
  // READING PRACTICE PROGRESS STORAGE (Luyện đọc)
  // =============================================================
  public getReadingPracticeProgress(studentId: string): string[] {
    const key = `viet1_reading_tasks_${studentId}`;
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  }

  public markReadingTaskDone(studentId: string, taskId: string): boolean {
    const current = this.getReadingPracticeProgress(studentId);
    if (!current.includes(taskId)) {
      current.push(taskId);
      try {
        localStorage.setItem(`viet1_reading_tasks_${studentId}`, JSON.stringify(current));
      } catch {
        // ignore
      }
      this.updateProfileStars(studentId, 1);
      return true;
    }
    return false;
  }

  // =============================================================
  // JOURNEY PROGRESS STORAGE
  // =============================================================
  public getJourneyProgress(studentId: string): StudentJourneyProgress {
    const key = `viet1_journey_${studentId}`;
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && Array.isArray(parsed.unlockedStageNumbers)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read journey progress:', e);
    }
    // Default initial progress: Stage 1 is unlocked
    const initial: StudentJourneyProgress = {
      studentId,
      unlockedStageNumbers: [1],
      completedTaskIds: [],
      stageStars: {},
      isTeacherUnlockedAll: false,
      lastActiveStageNumber: 1,
      lastUpdated: new Date().toISOString(),
    };
    this.saveJourneyProgress(initial);
    return initial;
  }

  public saveJourneyProgress(progress: StudentJourneyProgress) {
    const key = `viet1_journey_${progress.studentId}`;
    try {
      localStorage.setItem(key, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save journey progress:', e);
    }
  }

  public completeJourneyTask(
    studentId: string,
    stageNumber: number,
    taskId: string,
    taskStars: number,
    totalTasksInStage: number = 3
  ): { nextUnlocked: boolean; stageCompleted: boolean } {
    const progress = this.getJourneyProgress(studentId);
    let nextUnlocked = false;
    let stageCompleted = false;

    if (!progress.completedTaskIds.includes(taskId)) {
      progress.completedTaskIds.push(taskId);
    }

    const currentStars = progress.stageStars[stageNumber] || 0;
    progress.stageStars[stageNumber] = Math.max(currentStars, (progress.stageStars[stageNumber] || 0) + taskStars);

    // Check if all tasks in this stage are done
    // Stage tasks IDs follow format `task-${stageNumber}-*`
    const tasksDoneInThisStage = progress.completedTaskIds.filter((id) =>
      id.startsWith(`task-${stageNumber}-`)
    ).length;

    if (tasksDoneInThisStage >= totalTasksInStage) {
      stageCompleted = true;
      const nextStage = stageNumber + 1;
      if (nextStage <= 6 && !progress.unlockedStageNumbers.includes(nextStage)) {
        progress.unlockedStageNumbers.push(nextStage);
        nextUnlocked = true;
      }
    }

    progress.lastActiveStageNumber = stageNumber;
    progress.lastUpdated = new Date().toISOString();
    this.saveJourneyProgress(progress);

    // Also credit student profile stars
    this.updateProfileStars(studentId, taskStars);

    return { nextUnlocked, stageCompleted };
  }

  public toggleTeacherUnlockAll(studentId: string, unlockAll: boolean) {
    const progress = this.getJourneyProgress(studentId);
    progress.isTeacherUnlockedAll = unlockAll;
    if (unlockAll) {
      progress.unlockedStageNumbers = [1, 2, 3, 4, 5, 6];
    }
    progress.lastUpdated = new Date().toISOString();
    this.saveJourneyProgress(progress);
  }

  // =============================================================
  // ARENA LEADERBOARD & RECORD STORAGE
  // =============================================================
  public getArenaLeaderboard(): ArenaLeaderboardEntry[] {
    const key = 'viet1_arena_records_v1';
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read arena records:', e);
    }
    return [];
  }

  public recordArenaResult(entry: Omit<ArenaLeaderboardEntry, 'id' | 'date'>): ArenaLeaderboardEntry {
    const records = this.getArenaLeaderboard();
    const newEntry: ArenaLeaderboardEntry = {
      ...entry,
      id: 'arena-' + Date.now(),
      date: new Date().toLocaleString('vi-VN'),
    };
    records.unshift(newEntry);
    // Keep top 50 records sorted by score descending
    records.sort((a, b) => b.score - a.score);
    if (records.length > 50) records.pop();

    try {
      localStorage.setItem('viet1_arena_records_v1', JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save arena record:', e);
    }

    // Award student profile stars based on score
    const earnedStars = Math.max(1, Math.floor(entry.score / 200));
    this.updateProfileStars(entry.studentId, earnedStars, entry.titleEarned);

    return newEntry;
  }
}

export const storageService = new StorageService();
