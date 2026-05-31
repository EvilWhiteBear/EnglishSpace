import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WORDS } from '@/constants/lessonData';

export interface UserProfile {
  name: string;
  goal: string; // work / travel / series / communication / other
  dailyTime: number; // minutes
  previousAttempt: string;
  specialNeeds: string; // dyslexia / adhd / memory / none
  onboardingDone: boolean;
  createdAt: string;
}

export interface WordProgress {
  wordId: string;
  confidence: number; // 0 = unknown, 1 = learning, 2 = known
  reviewCount: number;
  lastSeen: string;
  nextReview: string;
}

export interface UserStats {
  streak: number;
  lastStudyDate: string;
  totalWords: number;
  learnedWords: number;
  totalMinutes: number;
  completedLessons: string[];
  wordProgress: Record<string, WordProgress>;
}

interface UserContextType {
  profile: UserProfile | null;
  stats: UserStats;
  isLoading: boolean;
  saveProfile: (profile: UserProfile) => Promise<void>;
  updateStats: (updates: Partial<UserStats>) => Promise<void>;
  updateWordProgress: (wordId: string, confidence: number) => Promise<void>;
  completeLesson: (lessonId: string) => Promise<void>;
  getLearnedWords: () => WordProgress[];
}

const defaultStats: UserStats = {
  streak: 0,
  lastStudyDate: '',
  totalWords: WORDS.length,
  learnedWords: 0,
  totalMinutes: 0,
  completedLessons: [],
  wordProgress: {},
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, statsData] = await Promise.all([
        AsyncStorage.getItem('user_profile'),
        AsyncStorage.getItem('user_stats'),
      ]);
      if (profileData) setProfile(JSON.parse(profileData));
      if (statsData) {
        const parsed = JSON.parse(statsData);
        setStats({ ...defaultStats, ...parsed });
      }
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    await AsyncStorage.setItem('user_profile', JSON.stringify(newProfile));
  };

  const updateStats = async (updates: Partial<UserStats>) => {
    const newStats = { ...stats, ...updates };

    // Streak logic
    const today = new Date().toDateString();
    if (newStats.lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (stats.lastStudyDate === yesterday.toDateString()) {
        newStats.streak = (stats.streak || 0) + 1;
      } else if (stats.lastStudyDate !== today) {
        newStats.streak = 1;
      }
      newStats.lastStudyDate = today;
    }

    setStats(newStats);
    await AsyncStorage.setItem('user_stats', JSON.stringify(newStats));
  };

  const updateWordProgress = async (wordId: string, confidence: number) => {
    const today = new Date().toISOString();
    const nextReviewDays = confidence === 2 ? 7 : confidence === 1 ? 3 : 1;
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + nextReviewDays);

    const existing = stats.wordProgress[wordId];
    const updated: WordProgress = {
      wordId,
      confidence,
      reviewCount: (existing?.reviewCount || 0) + 1,
      lastSeen: today,
      nextReview: nextReview.toISOString(),
    };

    const newProgress = { ...stats.wordProgress, [wordId]: updated };
    const learnedCount = Object.values(newProgress).filter(w => w.confidence >= 1).length;

    const newStats = {
      ...stats,
      wordProgress: newProgress,
      learnedWords: learnedCount,
    };
    setStats(newStats);
    await AsyncStorage.setItem('user_stats', JSON.stringify(newStats));
  };

  const completeLesson = async (lessonId: string) => {
    if (stats.completedLessons.includes(lessonId)) return;
    const newCompleted = [...stats.completedLessons, lessonId];
    await updateStats({
      completedLessons: newCompleted,
      totalMinutes: stats.totalMinutes + 10,
    });
  };

  const getLearnedWords = () => {
    return Object.values(stats.wordProgress).filter(w => w.confidence >= 1);
  };

  return (
    <UserContext.Provider value={{
      profile, stats, isLoading,
      saveProfile, updateStats, updateWordProgress, completeLesson, getLearnedWords,
    }}>
      {children}
    </UserContext.Provider>
  );
}
