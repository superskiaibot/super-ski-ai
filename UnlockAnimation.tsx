import React, { useState, useEffect, useReducer } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, BarChart3, TrendingUp, Zap, X } from 'lucide-react';
import { Button } from './ui/button';
import { 
  MainIcon, 
  FloatingIcon, 
  CompletionContent,
  BackgroundParticles
} from './unlock-animation/components';
import { 
  AnimationPhase,
  ANIMATION_TIMINGS,
  FLOATING_ICONS_PRO,
  FLOATING_ICONS_EVENT,
  SPRING_TRANSITION
} from './unlock-animation/constants';
import { shouldReduceMotion as checkReduceMotion } from './unlock-animation/utils';

interface UnlockAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'pro' | 'event';
}

export function UnlockAnimation({ isOpen, onClose, type = 'pro' }: UnlockAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('entering');
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Animation phase progression
  useEffect(() => {
    if (!isOpen) {
      setAnimationPhase('entering');
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Enter phase - show lock icons
    timers.push(setTimeout(() => {
      setAnimationPhase('unlocking');
    }, ANIMATION_TIMINGS.ENTER_DURATION));

    // Phase 2: Unlocking phase - flip to target icons
    timers.push(setTimeout(() => {
      setAnimationPhase('celebrating');
    }, ANIMATION_TIMINGS.ENTER_DURATION + ANIMATION_TIMINGS.UNLOCK_DURATION));

    // Phase 3: Celebration phase - show completion content
    timers.push(setTimeout(() => {
      setAnimationPhase('complete');
    }, ANIMATION_TIMINGS.ENTER_DURATION + ANIMATION_TIMINGS.UNLOCK_DURATION + ANIMATION_TIMINGS.CELEBRATE_DURATION));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isOpen]);

  // Handle close with cleanup
  const handleClose = () => {
    setAnimationPhase('entering');
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && animationPhase === 'complete') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, animationPhase]);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="unlock-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed inset-0 ${type === 'event' ? 'bg-gradient-to-br from-orange-50/95 via-white/95 to-red-50/95' : 'bg-white/95'} backdrop-blur-md flex items-center justify-center p-4 z-[100]`}
        onClick={(e) => {
          if (e.target === e.currentTarget && animationPhase === 'complete') {
            handleClose();
          }
        }}
      >
        {/* Background Particles - Lowest layer */}
        <BackgroundParticles 
          shouldReduceMotion={shouldReduceMotion}
          particleCount={shouldReduceMotion ? 6 : 12}
          type={type}
        />

        {/* Main Animation Container - Organized layers */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={SPRING_TRANSITION}
          className="relative max-w-md w-full mx-auto"
        >
          {/* Floating Icons Layer - z-10 */}
          <div className="relative w-80 h-80 mx-auto mb-8">
            {(type === 'event' ? FLOATING_ICONS_EVENT : FLOATING_ICONS_PRO).map((iconConfig, index) => (
              <FloatingIcon
                key={`floating-${index}`}
                icon={iconConfig.icon}
                position={iconConfig.position}
                delay={iconConfig.delay}
                animationPhase={animationPhase}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}

            {/* Main Icon Layer - z-20 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <MainIcon 
                animationPhase={animationPhase}
                shouldReduceMotion={shouldReduceMotion}
                type={type}
              />
            </div>
          </div>

          {/* Completion Content Layer - z-30 */}
          <CompletionContent 
            animationPhase={animationPhase}
            onClose={handleClose}
            type={type}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}