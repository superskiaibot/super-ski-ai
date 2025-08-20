export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  requirement: AchievementRequirement;
  rewards?: AchievementReward[];
  unlockedAt?: Date;
  progress?: number; // 0-100
}

export type AchievementCategory = 
  | 'distance' 
  | 'speed' 
  | 'vertical' 
  | 'social' 
  | 'resort' 
  | 'streak' 
  | 'special' 
  | 'seasonal'
  | 'pro';

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface AchievementRequirement {
  type: 'distance' | 'speed' | 'vertical' | 'runs' | 'resorts' | 'social' | 'streak' | 'custom';
  value: number;
  unit?: string;
  condition?: string;
  timeframe?: 'single_run' | 'total' | 'daily' | 'weekly' | 'monthly' | 'seasonal';
}

export interface AchievementReward {
  type: 'badge' | 'title' | 'theme' | 'feature';
  value: string;
  description: string;
}

export interface AchievementProgress {
  achievementId: string;
  current: number;
  target: number;
  percentage: number;
  lastUpdated: Date;
}

export interface UserAchievements {
  unlocked: Achievement[];
  progress: AchievementProgress[];
  totalPoints: number;
  completionRate: number;
  favoriteCategory: AchievementCategory;
}

export interface AchievementNotification {
  achievement: Achievement;
  timestamp: Date;
  isNew: boolean;
}