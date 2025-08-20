import { ANIMATION_TIMINGS } from './constants';

/**
 * Check if user prefers reduced motion
 */
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Gets the appropriate animation timing based on reduced motion preference
 */
export const getAnimationTiming = (shouldReduceMotion: boolean): number[] => {
  if (shouldReduceMotion) {
    return [
      ANIMATION_TIMINGS.REDUCED_MOTION.ENTER_DURATION,
      ANIMATION_TIMINGS.REDUCED_MOTION.ENTER_DURATION + ANIMATION_TIMINGS.REDUCED_MOTION.UNLOCK_DURATION,
      ANIMATION_TIMINGS.REDUCED_MOTION.ENTER_DURATION + ANIMATION_TIMINGS.REDUCED_MOTION.UNLOCK_DURATION + ANIMATION_TIMINGS.REDUCED_MOTION.CELEBRATE_DURATION
    ];
  }
  
  return [
    ANIMATION_TIMINGS.ENTER_DURATION,
    ANIMATION_TIMINGS.ENTER_DURATION + ANIMATION_TIMINGS.UNLOCK_DURATION,
    ANIMATION_TIMINGS.ENTER_DURATION + ANIMATION_TIMINGS.UNLOCK_DURATION + ANIMATION_TIMINGS.CELEBRATE_DURATION
  ];
};

/**
 * Generates a smooth transition configuration with dynamic duration
 */
export const getSmoothTransition = (shouldReduceMotion: boolean) => ({
  type: "tween" as const,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
  duration: shouldReduceMotion ? 0.2 : 0.6
});

/**
 * Generates random positions for background particles
 */
export const generateParticlePosition = () => ({
  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
  y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20
});

/**
 * Determines if a rotation animation should be applied based on reduced motion
 */
export const getRotationValue = (shouldReduceMotion: boolean, phase: string, defaultRotation: number): number => {
  if (shouldReduceMotion) {
    return defaultRotation / 2; // Reduce rotation for accessibility
  }
  return defaultRotation;
};

/**
 * Gets badge styles based on animation phase and active state
 */
export const getBadgeStyles = (isActive: boolean) => ({
  bg: isActive ? 'bg-primary/10' : 'bg-secondary',
  text: isActive ? 'text-primary' : 'text-secondary-foreground',
  border: isActive ? 'border-primary/20' : 'border-border'
});

/**
 * Cleanup timer utility
 */
export const cleanupTimers = (timers: NodeJS.Timeout[]) => {
  timers.forEach(timer => clearTimeout(timer));
  return [];
};

/**
 * Animation phase management utility
 */
export const createAnimationSequence = (
  shouldReduceMotion: boolean,
  onPhaseChange: (phase: string) => void,
  debugLog?: { phase: (phase: string) => void; timing: (timing: number[]) => void }
) => {
  const timing = getAnimationTiming(shouldReduceMotion);
  
  if (debugLog) {
    debugLog.timing(timing);
  }

  const timers: NodeJS.Timeout[] = [];

  const schedulePhases = () => {
    const timer1 = setTimeout(() => {
      if (debugLog) debugLog.phase('unlocking');
      onPhaseChange('unlocking');
    }, timing[0]);

    const timer2 = setTimeout(() => {
      if (debugLog) debugLog.phase('celebrating');
      onPhaseChange('celebrating');
    }, timing[1]);

    const timer3 = setTimeout(() => {
      if (debugLog) debugLog.phase('complete');
      onPhaseChange('complete');
    }, timing[2]);

    return [timer1, timer2, timer3];
  };

  return {
    start: () => {
      if (debugLog) debugLog.phase('entering');
      onPhaseChange('entering');
      return schedulePhases();
    },
    cleanup: cleanupTimers
  };
};