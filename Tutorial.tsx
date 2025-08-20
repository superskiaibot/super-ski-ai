import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Activity,
  BarChart3,
  Users,
  Home,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // data-tutorial attribute (optional for mobile-first steps)
  mobileSpecific?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  action?: 'tap' | 'swipe' | 'scroll' | 'none';
  actionText?: string;
  hint?: string;
}

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MOBILE_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'dashboard-tour',
    title: 'Dashboard',
    description: 'View your recent runs, basic stats, and weather conditions.',
    target: 'nav-dashboard',
    icon: Home,
    action: 'none',
    hint: 'Basic: Last 3 runs • Pro: Full history + advanced weather'
  },
  {
    id: 'social-tour',
    title: 'Social Feed',
    description: 'Share your runs and see what other skiers are posting.',
    target: 'nav-social',
    icon: Users,
    action: 'none',
    hint: 'Basic: View feed • Pro: Post videos + live features'
  },
  {
    id: 'tracking-tour',
    title: 'GPS Tracking',
    description: 'Record your skiing with GPS. Track speed, distance, and elevation.',
    target: 'nav-tracking',
    icon: Activity,
    action: 'none',
    hint: 'Basic: Standard GPS • Pro: High-precision + analytics'
  },
  {
    id: 'rankings-tour',
    title: 'Leaderboards',
    description: 'Compare your performance with other skiers in rankings.',
    target: 'nav-leaderboards',
    icon: BarChart3,
    action: 'none',
    hint: 'Basic: Local rankings • Pro: Global + detailed comparisons'
  },
  {
    id: 'profile-settings-tour',
    title: 'Profile & Settings',
    description: 'Manage your profile, preferences, and app settings.',
    target: 'more-menu',
    icon: MoreHorizontal,
    action: 'none',
    hint: 'Basic: Basic profile • Pro: Custom themes + advanced privacy'
  }
];

export function Tutorial({ isOpen, onClose, currentUser, activeTab, onTabChange }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showMainTooltip, setShowMainTooltip] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset tutorial to first step when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setShowMainTooltip(true);
    }
  }, [isOpen]);

  // Handle manual close with reset
  const handleClose = () => {
    onClose();
    setCurrentStep(0); // Reset for next access
  };

  const step = MOBILE_TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === MOBILE_TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  // Mobile-specific highlight for targeted elements
  useEffect(() => {
    if (!isOpen || !step.target) return;

    const highlightElement = () => {
      const element = document.querySelector(`[data-tutorial="${step.target}"]`) as HTMLElement;
      if (element) {
        // Add mobile-specific highlight
        element.style.transition = 'all 0.3s ease-out';
        element.style.transform = 'scale(1.05)';
        element.style.zIndex = '60';
        element.style.position = 'relative';
        element.style.boxShadow = '0 0 0 4px rgba(0, 76, 255, 0.3), 0 0 20px rgba(0, 76, 255, 0.2)';
        element.style.borderRadius = '16px';

        return () => {
          element.style.transform = '';
          element.style.zIndex = '';
          element.style.position = '';
          element.style.boxShadow = '';
          element.style.borderRadius = '';
        };
      }
    };

    const cleanup = highlightElement();
    return cleanup;
  }, [currentStep, step, isOpen, activeTab]);

  const nextStep = () => {
    if (isLastStep) {
      // Mark tutorial as completed - this only prevents auto-showing on app startup
      // Users can still manually access the tutorial anytime via the buttons
      localStorage.setItem('snowline-mobile-tutorial-completed', 'true');
      
      // Close tutorial and return to dashboard
      onClose();
      onTabChange('dashboard');
      
      // Reset step counter for next manual access
      setCurrentStep(0);
    } else {
      const nextStepIndex = currentStep + 1;
      const nextStep = MOBILE_TUTORIAL_STEPS[nextStepIndex];
      
      // Auto-navigate to relevant tabs for each step - Updated order
      if (nextStep.target === 'nav-dashboard') {
        onTabChange('dashboard');
      } else if (nextStep.target === 'nav-social') {
        onTabChange('social');
      } else if (nextStep.target === 'nav-tracking') {
        onTabChange('tracking');
      } else if (nextStep.target === 'nav-leaderboards') {
        onTabChange('leaderboards');
      }
      // Note: more-menu target doesn't need tab change since it's a dropdown
      
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipTutorial = () => {
    // Mark tutorial as completed - this only prevents auto-showing on app startup
    // Users can still manually access the tutorial anytime via the buttons
    localStorage.setItem('snowline-mobile-tutorial-completed', 'true');
    
    // Close tutorial and reset step counter for next manual access
    onClose();
    setCurrentStep(0);
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden" ref={overlayRef}>

      {/* Mobile Tutorial Interface - Bottom Sheet Style */}
      <AnimatePresence mode="wait">
        {showMainTooltip && (
          <motion.div
            key={currentStep}
            initial={{ x: '-100%', rotateY: -15 }}
            animate={{ x: 0, rotateY: 0 }}
            exit={{ x: '100%', rotateY: 15 }}
            transition={{ 
              type: "tween",
              ease: [0.25, 0.46, 0.45, 0.94],
              duration: 0.5
            }}
            className="absolute bottom-20 left-0 right-0 z-10 pb-safe"
          >
            <Card className="mx-3 mb-3 bg-card border-primary/20 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* Header Section */}
                <div className="relative p-4 pb-3">
                  {/* Step Progress Bar */}
                  <div className="absolute top-2 left-4 right-4">
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                        style={{ 
                          width: `${((currentStep + 1) / MOBILE_TUTORIAL_STEPS.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Icon and Title */}
                  <div className="mt-4 flex items-start gap-3">
                    {step.icon && (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md flex-shrink-0">
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground leading-tight mb-1">
                        {step.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        {currentStep + 1}/{MOBILE_TUTORIAL_STEPS.length}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="px-4 pb-3">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {step.description}
                  </p>

                  {/* Hint Section */}
                  {step.hint && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-3">
                      <p className="text-xs text-primary font-medium">
                        💡 {step.hint}
                      </p>
                    </div>
                  )}


                </div>

                {/* Navigation Section */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {!isFirstStep && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={prevStep}
                          className="h-10 px-4 rounded-lg border"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Back
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={skipTutorial}
                        className="h-10 px-3 rounded-lg text-muted-foreground hover:text-foreground text-sm"
                      >
                        Skip
                      </Button>
                    </div>

                    <Button
                      onClick={nextStep}
                      size="sm"
                      className="h-10 px-6 snowline-button-primary rounded-lg font-semibold text-sm"
                    >
                      {isLastStep ? (
                        <>
                          <Zap className="w-4 h-4 mr-1" />
                          Start!
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}