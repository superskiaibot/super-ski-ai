import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Lock, Unlock, Sparkles } from 'lucide-react';

interface MiniUnlockAnimationProps {
  isLocked: boolean;
  icon?: React.ElementType;
  className?: string;
  onUnlock?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function MiniUnlockAnimation({ 
  isLocked, 
  icon: IconComponent, 
  className = "",
  onUnlock,
  size = 'md'
}: MiniUnlockAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout>();
  const previousLockedRef = useRef(isLocked);

  // Trigger unlock animation when isLocked changes from true to false
  useEffect(() => {
    const wasLocked = previousLockedRef.current;
    const isNowUnlocked = !isLocked;
    
    if (wasLocked && isNowUnlocked && !isAnimating && !hasUnlocked) {
      setIsAnimating(true);
      setShowSparkles(true);
      setHasUnlocked(true);
      onUnlock?.();
      
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Reset animation state after completion
      timerRef.current = setTimeout(() => {
        setIsAnimating(false);
        setShowSparkles(false);
      }, shouldReduceMotion ? 500 : 1200);
    }
    
    previousLockedRef.current = isLocked;
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isLocked, isAnimating, hasUnlocked, onUnlock, shouldReduceMotion]);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  const iconSize = sizeClasses[size];
  
  // Smooth transitions
  const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 25,
    mass: 0.5
  };

  const smoothTransition = {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: shouldReduceMotion ? 0.2 : 0.4
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Main icon with unlock animation */}
      <AnimatePresence mode="wait">
        {isLocked && !isAnimating ? (
          <motion.div
            key="locked"
            initial={{ scale: 1, opacity: 1 }}
            exit={{ 
              scale: shouldReduceMotion ? 0.8 : 0, 
              rotate: shouldReduceMotion ? 45 : 180, 
              opacity: 0 
            }}
            transition={smoothTransition}
          >
            <Lock className={`${iconSize} text-muted-foreground/60`} />
          </motion.div>
        ) : isAnimating ? (
          <motion.div
            key="unlocking"
            initial={{ 
              scale: 0, 
              rotate: shouldReduceMotion ? -45 : -180, 
              opacity: 0 
            }}
            animate={{ 
              scale: shouldReduceMotion ? [0, 1] : [0, 1.3, 1], 
              rotate: 0, 
              opacity: 1 
            }}
            transition={shouldReduceMotion ? smoothTransition : {
              duration: 0.8, 
              ease: [0.34, 1.56, 0.64, 1],
              times: [0, 0.7, 1]
            }}
          >
            <Unlock className={`${iconSize} text-green-600`} />
          </motion.div>
        ) : IconComponent ? (
          <motion.div
            key="unlocked-feature"
            initial={{ 
              scale: 0.8, 
              opacity: 0 
            }}
            animate={{ 
              scale: 1, 
              opacity: 1 
            }}
            transition={springTransition}
          >
            <IconComponent className={`${iconSize} text-foreground`} />
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ 
              scale: 0.8, 
              opacity: 0 
            }}
            animate={{ 
              scale: 1, 
              opacity: 1 
            }}
            transition={springTransition}
          >
            <Unlock className={`${iconSize} text-green-600`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlock burst effect */}
      {isAnimating && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-full h-full rounded-full bg-green-500/15 border border-green-500/30" />
        </motion.div>
      )}

      {/* Sparkle effects - reduced for performance */}
      {showSparkles && !shouldReduceMotion && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ 
                scale: 0, 
                x: 0, 
                y: 0, 
                opacity: 0 
              }}
              animate={{
                scale: [0, 0.8, 0],
                x: Math.cos(i * 120 * Math.PI / 180) * 16,
                y: Math.sin(i * 120 * Math.PI / 180) * 16,
                opacity: [0, 0.8, 0],
                rotate: 90
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.08,
                ease: "easeOut"
              }}
            >
              <Sparkles className="w-2 h-2 text-green-500" />
            </motion.div>
          ))}
        </>
      )}

      {/* Subtle glow effect */}
      {isAnimating && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.2, 1] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 60%)',
            filter: 'blur(3px)'
          }}
        />
      )}
    </div>
  );
}