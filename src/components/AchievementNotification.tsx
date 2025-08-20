import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Award, Star, Crown, Medal, Target, Zap, Mountain, 
  TrendingUp, Users, MapPin, Calendar, Snowflake, BarChart3,
  Route, Activity, Flame, Heart, Share2, ThumbsUp, Clock,
  Cloud, Sunrise, Moon, CloudSnow, Sunset, Globe, Rocket
} from 'lucide-react';
import { Achievement } from '../types/achievements';
import { ACHIEVEMENT_RARITIES } from '../constants/achievements';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  duration?: number;
}

const iconMap: Record<string, React.ComponentType> = {
  Trophy, Award, Star, Crown, Medal, Target, Zap, Mountain,
  TrendingUp, Users, MapPin, Calendar, Snowflake, BarChart3,
  Route, Activity, Flame, Heart, Share2, ThumbsUp, Clock,
  Cloud, Sunrise, Moon, CloudSnow, Sunset, Globe, Rocket
};

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const IconComponent = iconMap[achievement.icon] || Trophy;
  const rarity = ACHIEVEMENT_RARITIES[achievement.rarity];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0, 
            scale: 0.8, 
            y: -50,
            rotateX: -90
          }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            rotateX: 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.9, 
            y: -20,
            transition: { duration: 0.3 }
          }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 300,
            duration: 0.6
          }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] max-w-md w-full mx-4"
        >
          <motion.div
            initial={{ boxShadow: `0 0 0 0 ${rarity.color}40` }}
            animate={{ 
              boxShadow: [
                `0 0 0 0 ${rarity.color}40`,
                `0 0 0 20px ${rarity.color}00`,
                `0 0 0 0 ${rarity.color}40`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl border-2 p-6 shadow-2xl"
            style={{ borderColor: rarity.color }}
          >
            {/* Celebration particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    x: '50%',
                    y: '50%'
                  }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: rarity.color }}
                />
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-gray-600 dark:text-gray-400 text-lg">×</span>
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ 
                  type: "spring",
                  damping: 10,
                  stiffness: 200,
                  delay: 0.3
                }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: rarity.color }}
              >
                <IconComponent className="w-8 h-8" />
              </motion.div>
              
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm font-medium mb-1"
                  style={{ color: rarity.color }}
                >
                  Achievement Unlocked!
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl font-bold text-gray-900 dark:text-white mb-1"
                >
                  {achievement.name}
                </motion.h3>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2"
                >
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: rarity.color }}
                  >
                    {rarity.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    +{rarity.points} points
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-gray-700 dark:text-gray-300 mb-4"
            >
              {achievement.description}
            </motion.p>

            {/* Rewards */}
            {achievement.rewards && achievement.rewards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="border-t border-gray-200 dark:border-gray-700 pt-4"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Rewards:
                </div>
                <div className="space-y-1">
                  {achievement.rewards.map((reward, index) => (
                    <div 
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" style={{ color: rarity.color }} />
                      {reward.description}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Progress indicator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 rounded-b-2xl origin-left"
              style={{ backgroundColor: rarity.color }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Achievement notification manager
export const AchievementNotificationManager: React.FC<{
  achievements: Achievement[];
  onClearAll: () => void;
}> = ({ achievements, onClearAll }) => {
  const [visibleAchievements, setVisibleAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Show achievements one by one with delay
    achievements.forEach((achievement, index) => {
      setTimeout(() => {
        setVisibleAchievements(prev => [...prev, achievement]);
      }, index * 1000); // 1 second delay between each
    });
  }, [achievements]);

  const handleClose = (achievementId: string) => {
    setVisibleAchievements(prev => prev.filter(a => a.id !== achievementId));
    
    // If all notifications are closed, call onClearAll
    if (visibleAchievements.length === 1) {
      onClearAll();
    }
  };

  return (
    <>
      {visibleAchievements.map(achievement => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onClose={() => handleClose(achievement.id)}
          duration={6000}
        />
      ))}
    </>
  );
};