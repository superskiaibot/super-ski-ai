import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  X, 
  Crown, 
  Zap, 
  Users, 
  MapPin, 
  Radio, 
  CloudSnow, 
  Shield, 
  Trophy, 
  Mountain, 
  Camera,
  Settings,
  Star,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { User as UserType } from '../src/types/index';

interface PremiumPlansProps {
  currentUser: UserType;
  onUpgrade?: (plan: 'basic' | 'pro') => void;
  onClose?: () => void;
}

export function PremiumPlans({ currentUser, onUpgrade, onClose }: PremiumPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro'>('pro');
  const [isAnnual, setIsAnnual] = useState(true);

  // Check if user is currently on Pro plan
  const isProUser = currentUser?.isVerified || false;

  const basicFeatures = [
    {
      icon: Zap,
      text: "Limited tracking tokens",
      available: true
    },
    {
      icon: MapPin,
      text: "Basic map view",
      available: true
    },
    {
      icon: Trophy,
      text: "Basic analytics",
      available: true
    },
    {
      icon: Mountain,
      text: "Access to Ski For A Cure Events",
      available: true
    },
    {
      icon: Star,
      text: "Free premium for tracking event",
      available: true
    },
    {
      icon: Users,
      text: "Friends",
      available: true
    },
    {
      icon: MapPin,
      text: "Access to all maps",
      available: true
    },
    {
      icon: CloudSnow,
      text: "Basic weather",
      available: true
    },
    {
      icon: Shield,
      text: "Emergency GPS location and radio call to ski patrol",
      available: true
    },
    {
      icon: Trophy,
      text: "Basic achievements",
      available: true
    },
    {
      icon: Settings,
      text: "Access to limited reports",
      available: true
    },
    {
      icon: Camera,
      text: "Limit to 1 post per day",
      available: true
    },
    {
      icon: Users,
      text: "Ski For A Cure chat system for updates, no comments unless email verified",
      available: true
    }
  ];

  const proFeatures = [
    {
      icon: Zap,
      text: "Higher token usage",
      available: true
    },
    {
      icon: Trophy,
      text: "Advanced analytics",
      available: true
    },
    {
      icon: MapPin,
      text: "More map views",
      available: true
    },
    {
      icon: Radio,
      text: "Digital radio",
      available: true
    },
    {
      icon: Users,
      text: "Friends",
      available: true
    },
    {
      icon: CloudSnow,
      text: "All Weather updates",
      available: true
    },
    {
      icon: Users,
      text: "Friends tracking",
      available: true
    },
    {
      icon: Shield,
      text: "Emergency GPS location and radio call to ski patrol",
      available: true
    },
    {
      icon: Trophy,
      text: "Full achievement system",
      available: true
    },
    {
      icon: MapPin,
      text: "See friends skiing on your map with different color location",
      available: true
    },
    {
      icon: Mountain,
      text: "Access to all sports",
      available: true
    },
    {
      icon: Camera,
      text: "Unlimited posts per day",
      available: true
    },
    {
      icon: Settings,
      text: "Custom app icon",
      available: true
    },
    {
      icon: Users,
      text: "Ski For A Cure chat system for updates",
      available: true
    }
  ];

  const handleUpgrade = (plan: 'basic' | 'pro') => {
    if (onUpgrade) {
      onUpgrade(plan);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border snowline-glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Snowline Premium
                </h1>
                <p className="text-sm text-muted-foreground">
                  Choose the perfect plan for your skiing adventures
                </p>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" onClick={onClose} className="rounded-xl">
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Current Plan Status */}
        {isProUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-800">You're a Snowline Pro!</p>
                <p className="text-sm text-green-600">Enjoying all premium features</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Billing Toggle */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !isAnnual 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                isAnnual 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annual
              <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs bg-green-100 text-green-800">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Plans Comparison */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full relative overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mountain className="w-8 h-8 text-gray-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Basic</CardTitle>
                <div className="text-3xl font-bold">
                  Free
                </div>
                <p className="text-sm text-muted-foreground">
                  Perfect for casual skiers getting started
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {basicFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          feature.available 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {feature.available ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          feature.available ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {feature.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6">
                  <Button 
                    variant={!isProUser ? "default" : "outline"}
                    className="w-full rounded-xl"
                    disabled={!isProUser}
                  >
                    {!isProUser ? 'Current Plan' : 'Downgrade to Basic'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full relative overflow-hidden border-primary/20 shadow-2xl">
              {/* Popular Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
                  <Crown className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>

              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Crown className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Pro
                </CardTitle>
                <div className="text-3xl font-bold">
                  ${isAnnual ? '9.99' : '12.99'}
                  <span className="text-base font-normal text-muted-foreground">
                    /{isAnnual ? 'month' : 'month'}
                  </span>
                </div>
                {isAnnual && (
                  <p className="text-sm text-green-600 font-medium">
                    Save $36/year with annual billing
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  For serious skiers who want it all
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {proFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm text-foreground">
                          {feature.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6">
                  <Button 
                    onClick={() => handleUpgrade('pro')}
                    className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg group"
                    disabled={isProUser}
                  >
                    {isProUser ? (
                      'Current Plan'
                    ) : (
                      <>
                        Upgrade to Pro
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  {!isProUser && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Cancel anytime • 7-day free trial
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Why Choose Snowline Pro?</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 rounded-2xl bg-card border shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed insights into your skiing performance with comprehensive analytics and progress tracking.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Social Features</h3>
              <p className="text-sm text-muted-foreground">
                Connect with friends, share unlimited content, and see your crew's location on the mountain.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Radio className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Digital Radio</h3>
              <p className="text-sm text-muted-foreground">
                Stay connected with your group using our built-in digital radio system for seamless communication.
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I switch plans anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Is there a free trial for Pro?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely! We offer a 7-day free trial for Snowline Pro so you can experience all the premium features risk-free.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What happens to my data if I downgrade?</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is always safe with us. If you downgrade, you'll retain access to all your historical data, but some Pro features will be limited.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}