import { 
  Activity, 
  BarChart3, 
  TrendingUp, 
  Zap,
  Calendar,
  Clock,
  MapPin,
  Target
} from 'lucide-react';

// Animation timing constants
export const ANIMATION_TIMINGS = {
  ENTER_DURATION: 1200,
  UNLOCK_DURATION: 1000,
  CELEBRATE_DURATION: 800,
  COMPLETE_DURATION: 600,
  // Reduced motion support
  REDUCED_MOTION: {
    ENTER_DURATION: 600,
    UNLOCK_DURATION: 500,
    CELEBRATE_DURATION: 400,
    COMPLETE_DURATION: 300
  },
  // Background particles
  BACKGROUND_PARTICLES: 12,
  PARTICLE_DURATION: 2.5,
  PARTICLE_DELAY_MULTIPLIER: 0.15,
  PARTICLE_REPEAT_DELAY: 3
} as const;

// Floating lock icons configuration - Pro version
export const FLOATING_ICONS_PRO = [
  { icon: Activity, position: { top: '15%', left: '5%' }, delay: 0 },        // Top-left, further out
  { icon: BarChart3, position: { top: '18%', right: '8%' }, delay: 0.1 },   // Top-right, further out  
  { icon: TrendingUp, position: { top: '75%', left: '3%' }, delay: 0.2 },   // Bottom-left, further out
  { icon: Zap, position: { top: '78%', right: '6%' }, delay: 0.3 }          // Bottom-right, further out
] as const;

// Floating lock icons configuration - Event version
export const FLOATING_ICONS_EVENT = [
  { icon: Calendar, position: { top: '15%', left: '5%' }, delay: 0 },       // Top-left, further out
  { icon: Clock, position: { top: '18%', right: '8%' }, delay: 0.1 },       // Top-right, further out  
  { icon: MapPin, position: { top: '75%', left: '3%' }, delay: 0.2 },       // Bottom-left, further out
  { icon: Target, position: { top: '78%', right: '6%' }, delay: 0.3 }       // Bottom-right, further out
] as const;

// Legacy export for backwards compatibility
export const FLOATING_ICONS = FLOATING_ICONS_PRO;

// Animation transition configurations
export const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8
} as const;

export const SMOOTH_TRANSITION_CONFIG = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94]
} as const;

// Animation phases
export type AnimationPhase = 'entering' | 'unlocking' | 'celebrating' | 'complete';

// Box shadow configurations
export const BOX_SHADOWS = {
  CELEBRATING: "0 20px 50px -10px rgba(0, 76, 255, 0.3)",
  DEFAULT: "0 8px 32px -8px rgba(0, 76, 255, 0.2)"
} as const;

// Session storage key
export const SESSION_KEY = 'snowline-tracking-session';

// Crown icon styling
export const CROWN_ICON_STYLE = {
  color: '#ffffff',
  fill: '#ffffff', 
  stroke: '#ffffff'
} as const;

// Lock/Unlock icon styling  
export const LOCK_ICON_STYLE = {
  color: '#ffffff',
  fill: '#ffffff',
  stroke: '#ffffff'
} as const;