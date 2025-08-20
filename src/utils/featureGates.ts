import { User as UserType } from '../types/index';

export type FeatureKey = 
  | 'advanced_analytics'
  | 'unlimited_posts'
  | 'digital_radio'
  | 'friends_tracking'
  | 'custom_app_icon'
  | 'all_weather_updates'
  | 'unlimited_tokens'
  | 'friends_location_map'
  | 'full_achievements'
  | 'unlimited_reports'
  | 'premium_map_views'
  | 'priority_support'
  | 'video_recording'
  | 'export_data';

export interface FeatureLimits {
  postsPerDay: number;
  trackingTokens: number;
  mapViews: string[];
  analyticsLevel: 'basic' | 'advanced';
  weatherUpdates: 'basic' | 'all';
  achievementSystem: 'basic' | 'full';
  reportsAccess: 'limited' | 'unlimited';
}

export const PLAN_FEATURES: Record<'basic' | 'pro', FeatureLimits> = {
  basic: {
    postsPerDay: 1,
    trackingTokens: 100,
    mapViews: ['standard', 'terrain'],
    analyticsLevel: 'basic',
    weatherUpdates: 'basic',
    achievementSystem: 'basic',
    reportsAccess: 'limited'
  },
  pro: {
    postsPerDay: -1, // unlimited
    trackingTokens: 1000,
    mapViews: ['standard', 'terrain', 'satellite', 'hybrid', '3d'],
    analyticsLevel: 'advanced',
    weatherUpdates: 'all',
    achievementSystem: 'full',
    reportsAccess: 'unlimited'
  }
};

export const PRO_FEATURES: FeatureKey[] = [
  'advanced_analytics',
  'unlimited_posts',
  'digital_radio',
  'friends_tracking',
  'custom_app_icon',
  'all_weather_updates',
  'unlimited_tokens',
  'friends_location_map',
  'full_achievements',
  'unlimited_reports',
  'premium_map_views',
  'priority_support',
  'video_recording',
  'export_data'
];

export function hasFeature(user: UserType | null, feature: FeatureKey): boolean {
  if (!user) return false;
  
  // Pro users get all features
  if (user.isVerified) return true;
  
  // Basic users don't get pro features
  return !PRO_FEATURES.includes(feature);
}

export function getPlanLimits(user: UserType | null): FeatureLimits {
  if (!user) return PLAN_FEATURES.basic;
  
  return user.isVerified ? PLAN_FEATURES.pro : PLAN_FEATURES.basic;
}

export function canUseFeature(
  user: UserType | null, 
  feature: FeatureKey,
  currentUsage?: number,
  limit?: number
): { allowed: boolean; reason?: string } {
  if (!user) {
    return { allowed: false, reason: 'User not authenticated' };
  }

  if (!hasFeature(user, feature)) {
    return { 
      allowed: false, 
      reason: `This feature requires Snowline Pro. Upgrade to unlock ${getFeatureDescription(feature)}.` 
    };
  }

  // Check usage-based limits
  if (currentUsage !== undefined && limit !== undefined && limit > 0) {
    if (currentUsage >= limit) {
      return {
        allowed: false,
        reason: `You've reached your daily limit of ${limit}. Upgrade to Pro for unlimited access.`
      };
    }
  }

  return { allowed: true };
}

export function getFeatureDescription(feature: FeatureKey): string {
  const descriptions: Record<FeatureKey, string> = {
    advanced_analytics: 'detailed performance insights and trends',
    unlimited_posts: 'unlimited daily posts and content sharing',
    digital_radio: 'mountain-wide digital radio communication',
    friends_tracking: 'real-time location sharing with friends',
    custom_app_icon: 'personalized app icon customization',
    all_weather_updates: 'comprehensive weather forecasting',
    unlimited_tokens: 'unlimited GPS tracking tokens',
    friends_location_map: 'friends locations on your map',
    full_achievements: 'complete achievement system',
    unlimited_reports: 'unlimited detailed reports',
    premium_map_views: 'satellite and 3D map views',
    priority_support: '24/7 priority customer support',
    video_recording: 'video recording during runs',
    export_data: 'data export and backup features'
  };
  
  return descriptions[feature] || 'this premium feature';
}

export function getUpgradeMessage(feature: FeatureKey): string {
  const featureDesc = getFeatureDescription(feature);
  return `Upgrade to Snowline Pro to unlock ${featureDesc} and enhance your skiing experience!`;
}

// Track daily usage for features with limits
export class FeatureUsageTracker {
  private static instance: FeatureUsageTracker;
  private usage: Map<string, { date: string; count: number }> = new Map();

  public static getInstance(): FeatureUsageTracker {
    if (!FeatureUsageTracker.instance) {
      FeatureUsageTracker.instance = new FeatureUsageTracker();
    }
    return FeatureUsageTracker.instance;
  }

  private getTodayKey(userId: string, feature: string): string {
    const today = new Date().toISOString().split('T')[0];
    return `${userId}-${feature}-${today}`;
  }

  public getUsage(userId: string, feature: string): number {
    const key = this.getTodayKey(userId, feature);
    const usage = this.usage.get(key);
    
    if (!usage) return 0;
    
    // Check if usage is from today
    const today = new Date().toISOString().split('T')[0];
    if (usage.date !== today) {
      this.usage.delete(key);
      return 0;
    }
    
    return usage.count;
  }

  public incrementUsage(userId: string, feature: string): number {
    const key = this.getTodayKey(userId, feature);
    const today = new Date().toISOString().split('T')[0];
    const current = this.usage.get(key);
    
    const newCount = current ? current.count + 1 : 1;
    this.usage.set(key, { date: today, count: newCount });
    
    return newCount;
  }

  public resetUsage(userId: string, feature: string): void {
    const key = this.getTodayKey(userId, feature);
    this.usage.delete(key);
  }
}