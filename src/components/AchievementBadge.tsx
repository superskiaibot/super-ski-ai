import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, Award, Star, Crown, Medal, Target, Zap, Mountain, 
  TrendingUp, Users, MapPin, Calendar, Snowflake, BarChart3,
  Route, Activity, Flame, Heart, Share2, ThumbsUp, Clock,
  Cloud, Sunrise, Moon, CloudSnow, Sunset, Globe, Rocket
} from 'lucide-react';
import { Achievement } from '../types/achievements';
import { ACHIEVEMENT_RARITIES } from '../constants/achievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  animate?: boolean;
  className?: string;
}

const iconMap: Record<string, React.ComponentType> = {
  Trophy, Award, Star, Crown, Medal, Target, Zap, Mountain,
  TrendingUp, Users, MapPin, Calendar, Snowflake, BarChart3,
  Route, Activity, Flame, Heart, Share2, ThumbsUp, Clock,
  Cloud, Sunrise, Moon, CloudSnow, Sunset, Globe, Rocket
};

const sizeConfig = {
  sm: {
    container: 'w-8 h-8',
    icon: 'w-4 h-4',
    tooltip: 'text-xs'
  },
  md: {
    container: 'w-12 h-12',
    icon: 'w-6 h-6',
    tooltip: 'text-sm'
  },
  lg: {
    container: 'w-16 h-16',
    icon: 'w-8 h-8',
    tooltip: 'text-base'
  }
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'md',
  showTooltip = true,
  animate = true,
  className = ''
}) => {
  const IconComponent = iconMap[achievement.icon] || Trophy;
  const rarity = ACHIEVEMENT_RARITIES[achievement.rarity];
  const config = sizeConfig[size];

  const badge = (
    <motion.div
      initial={animate ? { scale: 0, rotate: -180 } : false}
      animate={animate ? { scale: 1, rotate: 0 } : {}}
      whileHover={animate ? { scale: 1.1 } : {}}
      whileTap={animate ? { scale: 0.95 } : {}}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 300
      }}
      className={`
        ${config.container} rounded-xl flex items-center justify-center text-white 
        shadow-lg border-2 border-white dark:border-gray-800 cursor-pointer
        ${className}
      `}
      style={{ backgroundColor: rarity.color }}
    >
      <IconComponent className={config.icon} />
      
      {/* Rarity glow effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-30 blur-md -z-10"
        style={{ backgroundColor: rarity.color }}
      />
    </motion.div>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <div className="relative group">
      {badge}
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="bg-black text-white rounded-lg p-3 shadow-xl min-w-max max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <IconComponent className="w-4 h-4" />
            <span className="font-semibold">{achievement.name}</span>
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: rarity.color }}
            >
              {rarity.name}
            </span>
          </div>
          <p className={`text-gray-300 ${config.tooltip}`}>
            {achievement.description}
          </p>
          {achievement.unlockedAt && (
            <p className="text-gray-400 text-xs mt-1">
              Unlocked {achievement.unlockedAt.toLocaleDateString()}
            </p>
          )}
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Achievement Grid Component for profiles
export const AchievementGrid: React.FC<{
  achievements: Achievement[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  onViewAll?: () => void;
}> = ({ achievements, maxDisplay = 8, size = 'md', onViewAll }) => {
  const displayAchievements = achievements.slice(0, maxDisplay);
  const remainingCount = Math.max(0, achievements.length - maxDisplay);

  return (
    <div className="flex flex-wrap gap-2">
      {displayAchievements.map(achievement => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size={size}
          animate={false}
        />
      ))}
      
      {remainingCount > 0 && onViewAll && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className={`
            ${sizeConfig[size].container} rounded-xl flex items-center justify-center
            bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400
            hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors
            border-2 border-dashed border-gray-300 dark:border-gray-600
          `}
        >
          <span className="text-xs font-medium">+{remainingCount}</span>
        </motion.button>
      )}
    </div>
  );
};

// Recent Achievement Component
export const RecentAchievement: React.FC<{
  achievement: Achievement;
  timeAgo: string;
}> = ({ achievement, timeAgo }) => {
  const IconComponent = iconMap[achievement.icon] || Trophy;
  const rarity = ACHIEVEMENT_RARITIES[achievement.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
        style={{ backgroundColor: rarity.color }}
      >
        <IconComponent className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white truncate">
          {achievement.name}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {timeAgo}
        </p>
      </div>
      
      <div className="flex items-center gap-1 text-yellow-500">
        <Star className="w-4 h-4" />
        <span className="text-sm font-medium">+{rarity.points}</span>
      </div>
    </motion.div>
  );
};