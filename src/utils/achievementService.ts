import { Achievement, AchievementProgress, UserAchievements, AchievementNotification } from '../types/achievements';
import { ACHIEVEMENTS, ACHIEVEMENT_POINTS } from '../constants/achievements';
import { SavedRun, User } from '../types';

export class AchievementService {
  private static readonly STORAGE_KEY = 'snowline-achievements';
  private static readonly NOTIFICATIONS_KEY = 'snowline-achievement-notifications';

  static getUserAchievements(userId: string): UserAchievements {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}-${userId}`);
      if (stored) {
        const data = JSON.parse(stored);
        // Ensure dates are properly parsed
        data.unlocked = data.unlocked.map((achievement: any) => ({
          ...achievement,
          unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
        }));
        data.progress = data.progress.map((progress: any) => ({
          ...progress,
          lastUpdated: new Date(progress.lastUpdated)
        }));
        return data;
      }
    } catch (error) {
      console.error('Error loading user achievements:', error);
    }

    return {
      unlocked: [],
      progress: [],
      totalPoints: 0,
      completionRate: 0,
      favoriteCategory: 'distance'
    };
  }

  static saveUserAchievements(userId: string, achievements: UserAchievements): void {
    try {
      localStorage.setItem(`${this.STORAGE_KEY}-${userId}`, JSON.stringify(achievements));
    } catch (error) {
      console.error('Error saving user achievements:', error);
    }
  }

  static checkAchievements(
    user: User, 
    runs: SavedRun[], 
    newRun?: SavedRun
  ): { achievements: UserAchievements; newAchievements: Achievement[] } {
    const userAchievements = this.getUserAchievements(user.id);
    const newAchievements: Achievement[] = [];
    
    // Get user stats
    const stats = this.calculateUserStats(user, runs);
    
    // Check each achievement
    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (userAchievements.unlocked.some(a => a.id === achievement.id)) {
        continue;
      }

      // Check if Pro-only achievement and user is not Pro
      if (achievement.category === 'pro' && !user.isVerified) {
        continue;
      }

      const isUnlocked = this.checkAchievementRequirement(achievement, stats, newRun);
      
      if (isUnlocked) {
        const unlockedAchievement = {
          ...achievement,
          unlockedAt: new Date()
        };
        
        userAchievements.unlocked.push(unlockedAchievement);
        newAchievements.push(unlockedAchievement);
      } else {
        // Update progress
        const progress = this.calculateProgress(achievement, stats, newRun);
        if (progress > 0) {
          const existingProgressIndex = userAchievements.progress.findIndex(
            p => p.achievementId === achievement.id
          );
          
          const progressData: AchievementProgress = {
            achievementId: achievement.id,
            current: progress,
            target: achievement.requirement.value,
            percentage: Math.min(100, (progress / achievement.requirement.value) * 100),
            lastUpdated: new Date()
          };

          if (existingProgressIndex >= 0) {
            userAchievements.progress[existingProgressIndex] = progressData;
          } else {
            userAchievements.progress.push(progressData);
          }
        }
      }
    }

    // Update total points and completion rate
    userAchievements.totalPoints = userAchievements.unlocked.reduce(
      (total, achievement) => total + ACHIEVEMENT_POINTS[achievement.rarity], 
      0
    );
    
    userAchievements.completionRate = (userAchievements.unlocked.length / ACHIEVEMENTS.length) * 100;
    
    // Update favorite category
    userAchievements.favoriteCategory = this.getFavoriteCategory(userAchievements.unlocked);

    // Save achievements
    this.saveUserAchievements(user.id, userAchievements);

    // Save notifications for new achievements
    if (newAchievements.length > 0) {
      this.addAchievementNotifications(user.id, newAchievements);
    }

    return { achievements: userAchievements, newAchievements };
  }

  private static calculateUserStats(user: User, runs: SavedRun[]) {
    const totalDistance = runs.reduce((sum, run) => sum + (run.stats.distance || 0), 0);
    const totalVertical = runs.reduce((sum, run) => sum + (run.stats.vertical || 0), 0);
    const maxSpeed = Math.max(...runs.map(run => run.stats.maxSpeed || 0), 0);
    const totalRuns = runs.length;
    const totalLikes = runs.reduce((sum, run) => sum + (run.likes || 0), 0);
    const sharedRuns = runs.filter(run => run.isPublic).length;
    const uniqueResorts = new Set(runs.map(run => run.resort?.id).filter(Boolean)).size;
    
    // Calculate streaks
    const streak = this.calculateStreak(runs);
    
    // Calculate special conditions
    const freshSnowDays = runs.filter(run => 
      run.weather?.conditions?.toLowerCase().includes('fresh') ||
      run.weather?.conditions?.toLowerCase().includes('powder')
    ).length;
    
    const earlyStarts = runs.filter(run => {
      const hour = run.startTime.getHours();
      return hour < 8;
    }).length;
    
    const lateFinishes = runs.filter(run => {
      const hour = run.endTime.getHours();
      return hour >= 18;
    }).length;
    
    const weatherTypes = new Set(
      runs.map(run => run.weather?.conditions?.toLowerCase()).filter(Boolean)
    ).size;
    
    const queenstownRuns = runs.filter(run => 
      run.resort?.id === 'coronetpeak' || run.resort?.id === 'remarkables'
    ).length;

    return {
      totalDistance,
      totalVertical,
      maxSpeed,
      totalRuns,
      totalLikes,
      sharedRuns,
      uniqueResorts,
      streak,
      freshSnowDays,
      earlyStarts,
      lateFinishes,
      weatherTypes,
      queenstownRuns,
      user
    };
  }

  private static calculateStreak(runs: SavedRun[]): number {
    if (runs.length === 0) return 0;
    
    // Sort runs by date (most recent first)
    const sortedRuns = runs
      .slice()
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    
    let streak = 1;
    let currentDate = new Date(sortedRuns[0].startTime);
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < sortedRuns.length; i++) {
      const runDate = new Date(sortedRuns[i].startTime);
      runDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - runDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        currentDate = runDate;
      } else if (diffDays > 1) {
        break;
      }
      // If diffDays === 0, it's the same day, continue without incrementing streak
    }
    
    return streak;
  }

  private static checkAchievementRequirement(
    achievement: Achievement, 
    stats: any, 
    newRun?: SavedRun
  ): boolean {
    const req = achievement.requirement;
    
    switch (req.type) {
      case 'distance':
        if (req.timeframe === 'single_run' && newRun) {
          return (newRun.stats.distance || 0) >= req.value;
        }
        return stats.totalDistance >= req.value;
        
      case 'speed':
        if (req.timeframe === 'single_run' && newRun) {
          return (newRun.stats.maxSpeed || 0) >= req.value;
        }
        return stats.maxSpeed >= req.value;
        
      case 'vertical':
        if (req.timeframe === 'single_run' && newRun) {
          return (newRun.stats.vertical || 0) >= req.value;
        }
        return stats.totalVertical >= req.value;
        
      case 'runs':
        return stats.totalRuns >= req.value;
        
      case 'social':
        if (req.condition === 'shared_runs') {
          return stats.sharedRuns >= req.value;
        } else if (req.condition === 'total_likes') {
          return stats.totalLikes >= req.value;
        } else if (req.condition === 'single_run_likes' && newRun) {
          return (newRun.likes || 0) >= req.value;
        }
        break;
        
      case 'resorts':
        return stats.uniqueResorts >= req.value;
        
      case 'streak':
        return stats.streak >= req.value;
        
      case 'custom':
        return this.checkCustomRequirement(achievement, stats, newRun);
    }
    
    return false;
  }

  private static checkCustomRequirement(
    achievement: Achievement, 
    stats: any, 
    newRun?: SavedRun
  ): boolean {
    const condition = achievement.requirement.condition;
    const value = achievement.requirement.value;
    
    switch (condition) {
      case 'average_speed':
        if (newRun && achievement.requirement.timeframe === 'single_run') {
          return (newRun.stats.averageSpeed || 0) >= value;
        }
        break;
        
      case 'fresh_snow_days':
        return stats.freshSnowDays >= value;
        
      case 'early_starts':
        return stats.earlyStarts >= value;
        
      case 'late_finishes':
        return stats.lateFinishes >= value;
        
      case 'weather_types':
        return stats.weatherTypes >= value;
        
      case 'queenstown_runs':
        return stats.queenstownRuns >= value;
        
      case 'pro_upgrade':
        return stats.user.isVerified;
        
      case 'analytics_views':
        // This would need to be tracked separately
        return false;
        
      case 'opening_day':
      case 'closing_day':
        // These would need special tracking
        return false;
    }
    
    return false;
  }

  private static calculateProgress(
    achievement: Achievement, 
    stats: any, 
    newRun?: SavedRun
  ): number {
    const req = achievement.requirement;
    
    switch (req.type) {
      case 'distance':
        return req.timeframe === 'single_run' ? 0 : stats.totalDistance;
      case 'speed':
        return req.timeframe === 'single_run' ? 0 : stats.maxSpeed;
      case 'vertical':
        return req.timeframe === 'single_run' ? 0 : stats.totalVertical;
      case 'runs':
        return stats.totalRuns;
      case 'social':
        if (req.condition === 'shared_runs') return stats.sharedRuns;
        if (req.condition === 'total_likes') return stats.totalLikes;
        break;
      case 'resorts':
        return stats.uniqueResorts;
      case 'streak':
        return stats.streak;
      case 'custom':
        return this.getCustomProgress(achievement, stats);
    }
    
    return 0;
  }

  private static getCustomProgress(achievement: Achievement, stats: any): number {
    const condition = achievement.requirement.condition;
    
    switch (condition) {
      case 'fresh_snow_days': return stats.freshSnowDays;
      case 'early_starts': return stats.earlyStarts;
      case 'late_finishes': return stats.lateFinishes;
      case 'weather_types': return stats.weatherTypes;
      case 'queenstown_runs': return stats.queenstownRuns;
      case 'pro_upgrade': return stats.user.isVerified ? 1 : 0;
      default: return 0;
    }
  }

  private static getFavoriteCategory(achievements: Achievement[]): any {
    const categoryCounts = achievements.reduce((counts, achievement) => {
      counts[achievement.category] = (counts[achievement.category] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    return Object.keys(categoryCounts).reduce(
      (a, b) => categoryCounts[a] > categoryCounts[b] ? a : b,
      'distance'
    );
  }

  static addAchievementNotifications(userId: string, achievements: Achievement[]): void {
    try {
      const stored = localStorage.getItem(`${this.NOTIFICATIONS_KEY}-${userId}`);
      const existing: AchievementNotification[] = stored ? JSON.parse(stored) : [];
      
      const newNotifications: AchievementNotification[] = achievements.map(achievement => ({
        achievement,
        timestamp: new Date(),
        isNew: true
      }));
      
      const updated = [...newNotifications, ...existing];
      localStorage.setItem(`${this.NOTIFICATIONS_KEY}-${userId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving achievement notifications:', error);
    }
  }

  static getAchievementNotifications(userId: string): AchievementNotification[] {
    try {
      const stored = localStorage.getItem(`${this.NOTIFICATIONS_KEY}-${userId}`);
      if (stored) {
        const notifications = JSON.parse(stored);
        return notifications.map((notif: any) => ({
          ...notif,
          timestamp: new Date(notif.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading achievement notifications:', error);
    }
    return [];
  }

  static markNotificationsAsRead(userId: string): void {
    try {
      const notifications = this.getAchievementNotifications(userId);
      const updated = notifications.map(notif => ({ ...notif, isNew: false }));
      localStorage.setItem(`${this.NOTIFICATIONS_KEY}-${userId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }

  static clearOldNotifications(userId: string, daysOld: number = 30): void {
    try {
      const notifications = this.getAchievementNotifications(userId);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const filtered = notifications.filter(notif => notif.timestamp > cutoffDate);
      localStorage.setItem(`${this.NOTIFICATIONS_KEY}-${userId}`, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error clearing old notifications:', error);
    }
  }
}