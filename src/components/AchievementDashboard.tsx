import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, Award, Star, Crown, Medal, Target, Zap, Mountain, 
  TrendingUp, Users, MapPin, Calendar, Snowflake, BarChart3,
  Route, Activity, Flame, Heart, Share2, ThumbsUp, Clock,
  Cloud, Sunrise, Moon, CloudSnow, Sunset, Globe, Rocket,
  ChevronLeft, Search, Filter, Lock
} from 'lucide-react';
import { Achievement, AchievementCategory, AchievementRarity, UserAchievements } from '../types/achievements';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_RARITIES } from '../constants/achievements';
import { User } from '../types';

interface AchievementDashboardProps {
  user: User;
  userAchievements: UserAchievements;
  onBack: () => void;
}

const iconMap: Record<string, React.ComponentType> = {
  Trophy, Award, Star, Crown, Medal, Target, Zap, Mountain,
  TrendingUp, Users, MapPin, Calendar, Snowflake, BarChart3,
  Route, Activity, Flame, Heart, Share2, ThumbsUp, Clock,
  Cloud, Sunrise, Moon, CloudSnow, Sunset, Globe, Rocket
};

export const AchievementDashboard: React.FC<AchievementDashboardProps> = ({
  user,
  userAchievements,
  onBack
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter achievements
  const filteredAchievements = ACHIEVEMENTS.filter(achievement => {
    // Category filter
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
      return false;
    }
    
    // Rarity filter
    if (selectedRarity !== 'all' && achievement.rarity !== selectedRarity) {
      return false;
    }
    
    // Search filter
    if (searchQuery && !achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !achievement.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Pro filter - hide Pro achievements if user is not Pro
    if (achievement.category === 'pro' && !user.isVerified) {
      return false;
    }
    
    return true;
  });

  // Separate unlocked and locked achievements
  const unlockedAchievements = filteredAchievements.filter(achievement =>
    userAchievements.unlocked.some(unlocked => unlocked.id === achievement.id)
  );
  
  const lockedAchievements = filteredAchievements.filter(achievement =>
    !userAchievements.unlocked.some(unlocked => unlocked.id === achievement.id)
  );

  const getProgress = (achievementId: string) => {
    return userAchievements.progress.find(p => p.achievementId === achievementId);
  };

  const getUnlockedDate = (achievementId: string) => {
    return userAchievements.unlocked.find(a => a.id === achievementId)?.unlockedAt;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Achievements
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your skiing progress and unlock rewards
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{userAchievements.unlocked.length}</div>
                  <div className="text-blue-100 text-sm">Unlocked</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{userAchievements.totalPoints}</div>
                  <div className="text-purple-100 text-sm">Points</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{Math.round(userAchievements.completionRate)}%</div>
                  <div className="text-green-100 text-sm">Complete</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-3">
                <Medal className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold capitalize">
                    {ACHIEVEMENT_CATEGORIES[userAchievements.favoriteCategory]?.name || 'None'}
                  </div>
                  <div className="text-orange-100 text-sm">Favorite</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as AchievementCategory | 'all')}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* Rarity Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rarity
                  </label>
                  <select
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value as AchievementRarity | 'all')}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Rarities</option>
                    {Object.entries(ACHIEVEMENT_RARITIES).map(([key, rarity]) => (
                      <option key={key} value={key}>{rarity.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Unlocked ({unlockedAchievements.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={true}
                  unlockedDate={getUnlockedDate(achievement.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Locked ({lockedAchievements.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedAchievements.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={false}
                  progress={getProgress(achievement.id)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No achievements found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Achievement Card Component
const AchievementCard: React.FC<{
  achievement: Achievement;
  isUnlocked: boolean;
  progress?: any;
  unlockedDate?: Date;
}> = ({ achievement, isUnlocked, progress, unlockedDate }) => {
  const IconComponent = iconMap[achievement.icon] || Trophy;
  const rarity = ACHIEVEMENT_RARITIES[achievement.rarity];
  const category = ACHIEVEMENT_CATEGORIES[achievement.category];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-200
        ${isUnlocked 
          ? 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800 shadow-lg' 
          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }
      `}
    >
      {/* Unlocked Badge */}
      {isUnlocked && (
        <div className="absolute -top-3 -right-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <Trophy className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      {/* Locked Badge */}
      {!isUnlocked && (
        <div className="absolute -top-3 -right-3">
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center shadow-lg">
            <Lock className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div 
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-white
            ${isUnlocked ? '' : 'grayscale opacity-60'}
          `}
          style={{ backgroundColor: isUnlocked ? rarity.color : '#9ca3af' }}
        >
          <IconComponent className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {achievement.name}
          </h3>
          <div className="flex items-center gap-2">
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: isUnlocked ? rarity.color : '#9ca3af' }}
            >
              {rarity.name}
            </span>
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: isUnlocked ? category.color : '#9ca3af' }}
            >
              {category.name}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className={`text-sm mb-4 ${isUnlocked ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
        {achievement.description}
      </p>

      {/* Progress Bar (for locked achievements) */}
      {!isUnlocked && progress && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progress.percentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${progress.percentage}%`,
                backgroundColor: category.color
              }}
            />
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {progress.current} / {progress.target} {achievement.requirement.unit || ''}
          </div>
        </div>
      )}

      {/* Unlock Date */}
      {isUnlocked && unlockedDate && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Unlocked on {unlockedDate.toLocaleDateString()}
        </div>
      )}

      {/* Points */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className={`text-sm font-medium ${isUnlocked ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
          {rarity.points} points
        </span>
        
        {achievement.rewards && achievement.rewards.length > 0 && (
          <div className="flex items-center gap-1">
            <Star className={`w-4 h-4 ${isUnlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
            <span className={`text-sm ${isUnlocked ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
              +{achievement.rewards.length} reward{achievement.rewards.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};