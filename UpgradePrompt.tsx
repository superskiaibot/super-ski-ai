import React from 'react';
import { motion } from 'motion/react';
import { Crown, Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface UpgradePromptProps {
  feature: string;
  description?: string;
  compact?: boolean;
  onUpgrade?: () => void;
  onDismiss?: () => void;
  showDismiss?: boolean;
  className?: string;
}

export function UpgradePrompt({ 
  feature, 
  description, 
  compact = false, 
  onUpgrade, 
  onDismiss,
  showDismiss = true,
  className = ""
}: UpgradePromptProps) {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 ${className}`}
      >
        {showDismiss && onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-60 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-sm">
            <Crown className="w-4 h-4 text-primary-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-1">
              {feature} requires Pro
            </p>
            {description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>
          
          <Button 
            size="sm" 
            onClick={onUpgrade}
            className="shrink-0 h-8 px-3 text-xs"
          >
            Upgrade
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5">
        {showDismiss && onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="absolute top-4 right-4 h-8 w-8 p-0 opacity-60 hover:opacity-100 z-10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-12 -translate-x-12" />
        
        <CardContent className="relative p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-primary-foreground" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Pro Feature
                </Badge>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Unlock {feature}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description || `Upgrade to Snowline Pro to access ${feature.toLowerCase()} and enhance your skiing experience with premium features.`}
                </p>
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <Button onClick={onUpgrade} className="group">
                  Upgrade to Pro
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface FeatureLockOverlayProps {
  feature: string;
  description?: string;
  onUpgrade?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function FeatureLockOverlay({ 
  feature, 
  description, 
  onUpgrade, 
  children, 
  className = "" 
}: FeatureLockOverlayProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Blurred Content */}
      <div className="filter blur-sm opacity-60 pointer-events-none">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 max-w-sm"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Crown className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <h3 className="font-semibold text-lg mb-2">
            {feature} is a Pro Feature
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {description || `Upgrade to Snowline Pro to unlock ${feature.toLowerCase()} and access all premium features.`}
          </p>
          
          <Button onClick={onUpgrade} className="group">
            Upgrade Now
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

interface UsageLimitPromptProps {
  feature: string;
  currentUsage: number;
  limit: number;
  resetTime?: string;
  onUpgrade?: () => void;
  compact?: boolean;
}

export function UsageLimitPrompt({ 
  feature, 
  currentUsage, 
  limit, 
  resetTime = "tomorrow", 
  onUpgrade,
  compact = false 
}: UsageLimitPromptProps) {
  const remaining = Math.max(0, limit - currentUsage);
  const percentage = (currentUsage / limit) * 100;
  
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-800">
              {remaining > 0 ? `${remaining} ${feature} remaining` : `Daily ${feature} limit reached`}
            </p>
            <p className="text-xs text-amber-600">
              Resets {resetTime}
            </p>
          </div>
          
          <Button size="sm" variant="outline" onClick={onUpgrade}>
            Upgrade
          </Button>
        </div>
        
        <div className="mt-2">
          <div className="w-full bg-amber-200 rounded-full h-1.5">
            <div 
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">
              {remaining > 0 ? 'Usage Limit' : 'Daily Limit Reached'}
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              {remaining > 0 
                ? `You have ${remaining} ${feature} remaining today. Resets ${resetTime}.`
                : `You've reached your daily limit of ${limit} ${feature}. Upgrade for unlimited access.`
              }
            </p>
            
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-amber-600 mb-1">
                  <span>{currentUsage}/{limit}</span>
                  <span>{Math.round(percentage)}%</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
              
              <Button onClick={onUpgrade} size="sm">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}