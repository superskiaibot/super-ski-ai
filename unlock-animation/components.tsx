import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Crown, Mountain, Calendar, Clock, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AnimationPhase, SPRING_TRANSITION } from './constants';
import { generateParticlePosition, getRotationValue } from './utils';

// Background Particles Component
interface BackgroundParticlesProps {
  shouldReduceMotion: boolean;
  particleCount: number;
  type?: 'pro' | 'event';
}

export function BackgroundParticles({ shouldReduceMotion, particleCount, type = 'pro' }: BackgroundParticlesProps) {
  if (shouldReduceMotion) {
    return null;
  }

  const particleColor = type === 'event' ? 'bg-avalanche-orange/20' : 'bg-primary/20';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(particleCount)].map((_, i) => {
        const position = generateParticlePosition();
        return (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${particleColor} rounded-full`}
            initial={{ 
              x: position.x,
              y: position.y,
              opacity: 0
            }}
            animate={{
              y: -20,
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2.5,
              delay: i * 0.15,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeOut"
            }}
          />
        );
      })}
    </div>
  );
}

// Main Icon Component - Fixed to flip only once
interface MainIconProps {
  animationPhase: AnimationPhase;
  shouldReduceMotion: boolean;
  type?: 'pro' | 'event';
}

export function MainIcon({ animationPhase, shouldReduceMotion, type = 'pro' }: MainIconProps) {
  // Target icon should only appear starting from 'unlocking' phase (single flip)
  const shouldShowTargetIcon = animationPhase === 'unlocking' || animationPhase === 'celebrating' || animationPhase === 'complete';

  // Choose the target icon and styling based on type
  const getTargetIcon = () => {
    if (type === 'event') {
      return <Calendar className="w-14 h-14 text-white drop-shadow-sm" />;
    }
    return <Crown className="w-14 h-14 text-white drop-shadow-sm" />;
  };

  const getBackgroundClass = () => {
    if (type === 'event') {
      return "relative w-24 h-24 rounded-3xl bg-gradient-to-br from-avalanche-orange to-avalanche-orange/70 flex items-center justify-center shadow-2xl border border-black/30 z-20";
    }
    return "relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl border border-black/30 z-20";
  };

  return (
    <div className={getBackgroundClass()}>
      <AnimatePresence mode="wait">
        {animationPhase === 'entering' && (
          <motion.div
            key="main-lock"
            initial={{ scale: 1, rotateY: 0, opacity: 1 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ 
              scale: 0.8,
              rotateY: shouldReduceMotion ? 90 : 180,
              opacity: 0
            }}
            transition={{
              duration: shouldReduceMotion ? 0.4 : 0.6,
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Lock className="w-14 h-14 text-white drop-shadow-sm" />
          </motion.div>
        )}
        
        {shouldShowTargetIcon && (
          <motion.div
            key={`main-${type}`}
            initial={{ 
              scale: 0.8,
              rotateY: shouldReduceMotion ? -90 : -180,
              opacity: 0
            }}
            animate={{ 
              scale: type === 'event' ? [0.8, 1.2, 1.1, 1] : 1,
              rotateY: type === 'event' ? [0, 15, -15, 0] : 0,
              opacity: 1
            }}
            // Fixed: Single transition that happens only once during unlock phase
            transition={{
              duration: shouldReduceMotion ? 0.4 : 0.6,
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {getTargetIcon()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Floating Icon Component - Fixed positioning and z-index
interface FloatingIconProps {
  icon: React.ComponentType<{ className?: string }>;
  position: React.CSSProperties;
  delay: number;
  animationPhase: AnimationPhase;
  shouldReduceMotion: boolean;
}

export function FloatingIcon({ icon: IconComponent, position, delay, animationPhase, shouldReduceMotion }: FloatingIconProps) {
  const shouldShowTargetIcon = animationPhase === 'unlocking' || animationPhase === 'celebrating' || animationPhase === 'complete';

  return (
    <div 
      className="absolute pointer-events-none z-10"
      style={position}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: animationPhase === 'entering' || shouldShowTargetIcon ? 1 : 0,
          opacity: animationPhase === 'entering' || shouldShowTargetIcon ? 1 : 0
        }}
        transition={{
          duration: shouldReduceMotion ? 0.4 : 0.6,
          ease: "easeOut",
          delay: delay
        }}
      >
        <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shadow-lg backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {animationPhase === 'entering' && (
              <motion.div
                key="floating-lock"
                initial={{ scale: 1, rotateY: 0, opacity: 1 }}
                animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                exit={{ 
                  scale: 0.8,
                  rotateY: shouldReduceMotion ? 90 : 180,
                  opacity: 0
                }}
                transition={{
                  duration: shouldReduceMotion ? 0.3 : 0.5,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Lock className="w-6 h-6 text-foreground drop-shadow-sm" />
              </motion.div>
            )}
            
            {shouldShowTargetIcon && (
              <motion.div
                key="floating-target"
                initial={{ 
                  scale: 0.8,
                  rotateY: shouldReduceMotion ? -90 : -180,
                  opacity: 0
                }}
                animate={{ 
                  scale: 1,
                  rotateY: 0,
                  opacity: 1
                }}
                transition={{
                  duration: shouldReduceMotion ? 0.3 : 0.5,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <IconComponent className="w-6 h-6 text-foreground drop-shadow-sm" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Completion Content Component - Reduced spacing for tighter layout
interface CompletionContentProps {
  animationPhase: AnimationPhase;
  onClose: () => void;
  type?: 'pro' | 'event';
}

export function CompletionContent({ animationPhase, onClose, type = 'pro' }: CompletionContentProps) {
  if (animationPhase !== 'celebrating' && animationPhase !== 'complete') {
    return null;
  }

  return (
    <div className="relative z-30">
      <motion.div
        key="complete-text"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={SPRING_TRANSITION}
        className="text-center flex flex-col space-snowline-md"
      >
        {/* Title and description with compact spacing */}
        <div className="flex flex-col space-snowline-sm">
          {type === 'event' ? (
            <>
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="w-16 h-16 bg-gradient-to-br from-avalanche-orange to-avalanche-orange/70 rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <Calendar className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-avalanche-orange to-avalanche-orange/70 bg-clip-text text-transparent leading-tight">
                Event Tracking<br />
                Unlocked!
              </h2>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-avalanche-orange/10 border border-avalanche-orange/20 rounded-full mx-auto"
              >
                <Clock className="w-4 h-4 text-avalanche-orange" />
                <span className="text-sm font-semibold text-avalanche-orange">
                  48 Hours Access
                </span>
              </motion.div>
              
              <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                You now have access to special event tracking features for the next 2 days. Experience enhanced metrics and real-time event analytics!
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-tight">
                Welcome to Snowline<br />
                Pro!
              </h2>
              
              <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                You now have access to advanced analytics, live stats, performance tracking, and all premium features.
              </p>
            </>
          )}
        </div>

        {/* Action button with compact spacing */}
        {animationPhase === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.3,
              ...SPRING_TRANSITION,
              duration: 0.5
            }}
          >
            <Button
              onClick={onClose}
              className={type === 'event' 
                ? "bg-gradient-to-r from-avalanche-orange to-avalanche-orange/80 hover:from-avalanche-orange/90 hover:to-avalanche-orange/70 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl min-h-[48px] px-8"
                : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl min-h-[48px] px-8"
              }
              size="lg"
            >
              {type === 'event' ? (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Try Event Tracking
                </>
              ) : (
                <>
                  <Mountain className="w-4 h-4 mr-2" />
                  Start Exploring Pro Features
                </>
              )}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}