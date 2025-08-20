import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mountain, ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { SignUpForm } from './SignUpForm';
import { User as UserType } from '../../src/types/index';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface AuthScreenProps {
  onLogin: (user: UserType) => void;
  onClose?: () => void;
  initialMode?: 'login' | 'signup';
}

type AuthMode = 'login' | 'signup' | 'forgot-password';

export function AuthScreen({ onLogin, onClose, initialMode = 'login' }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {};
    if (!loginData.email.trim()) newErrors.email = 'Email is required';
    if (!loginData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!loginData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, create a mock user based on email
      const mockUser: UserType = {
        id: 'user_' + Date.now(),
        username: loginData.email.split('@')[0],
        displayName: loginData.email.split('@')[0].charAt(0).toUpperCase() + loginData.email.split('@')[0].slice(1),
        email: loginData.email,
        avatar: undefined,
        level: 'intermediate',
        accountType: 'individual',
        role: {
          type: 'user',
          permissions: ['user:track_skiing', 'user:social_features', 'user:view_stats', 'user:save_runs'],
          isActive: true,
          assignedAt: new Date()
        },
        isVerified: false,
        followers: [],
        following: [],
        createdAt: new Date(),
        preferences: {
          units: 'metric',
          language: 'en',
          notifications: {
            push: true,
            email: true,
            weather: true,
            social: true,
            achievements: true,
            followers: true,
            comments: true,
            likes: true
          },
          privacy: {
            shareLocation: true,
            shareStats: true,
            publicProfile: true,
            allowFollowers: true,
            allowComments: true,
            allowDownloads: false
          },
          equipment: {
            type: 'alpine',
            brand: '',
            model: ''
          },
          recording: {
            autoLiftDetection: true,
            jumpDetection: false,
            crashDetection: true,
            voiceCoaching: false,
            audioFeedback: true,
            gpsUpdateRate: 2,
            heartRateMonitoring: false,
            autoSave: true,
            videoRecording: false,
            shareByDefault: false
          }
        }
      };

      onLogin(mockUser);
    } catch (error) {
      setErrors({ email: 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (signUpData: any) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user from sign-up data
      const newUser: UserType = {
        id: 'user_' + Date.now(),
        username: signUpData.username,
        displayName: `${signUpData.firstName} ${signUpData.lastName}`,
        name: `${signUpData.firstName} ${signUpData.lastName}`,
        email: signUpData.email,
        avatar: undefined, // In real app, this would be uploaded to storage
        level: signUpData.skillLevel,
        accountType: signUpData.accountType,
        role: {
          type: 'user',
          permissions: ['user:track_skiing', 'user:social_features', 'user:view_stats', 'user:save_runs'],
          isActive: true,
          assignedAt: new Date()
        },
        isVerified: false,
        followers: [],
        following: [],
        createdAt: new Date(),
        preferences: {
          units: signUpData.units,
          language: 'en',
          notifications: {
            push: signUpData.notifications,
            email: signUpData.notifications,
            weather: signUpData.notifications,
            social: signUpData.notifications,
            achievements: signUpData.notifications,
            followers: signUpData.notifications,
            comments: signUpData.notifications,
            likes: signUpData.notifications
          },
          privacy: {
            shareLocation: signUpData.privacy !== 'private',
            shareStats: signUpData.privacy !== 'private',
            publicProfile: signUpData.privacy === 'public',
            allowFollowers: signUpData.privacy !== 'private',
            allowComments: signUpData.privacy !== 'private',
            allowDownloads: false
          },
          equipment: signUpData.equipment,
          recording: {
            autoLiftDetection: true,
            jumpDetection: false,
            crashDetection: true,
            voiceCoaching: false,
            audioFeedback: true,
            gpsUpdateRate: 2,
            heartRateMonitoring: false,
            autoSave: true,
            videoRecording: false,
            shareByDefault: signUpData.privacy === 'public'
          }
        },
        profile: {
          displayName: `${signUpData.firstName} ${signUpData.lastName}`,
          bio: signUpData.bio,
          location: signUpData.location,
          website: signUpData.website,
          isPublic: signUpData.privacy === 'public',
          featuredRuns: [],
          badges: [],
          highlights: []
        },
        businessProfile: signUpData.accountType === 'business' ? {
          companyName: signUpData.companyName || '',
          companyType: signUpData.companyType || 'other',
          website: signUpData.website,
          description: signUpData.bio,
          location: signUpData.location,
          services: [],
          contactInfo: {
            email: signUpData.email,
            phone: signUpData.phone
          },
          socialMedia: {},
          isVerified: false,
          certifications: []
        } : undefined
      };

      onLogin(newUser);
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message and redirect to login
      setMode('login');
      setErrors({});
    } catch (error) {
      setErrors({ email: 'Failed to send reset email' });
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === 'signup') {
    return (
      <SignUpForm
        onSubmit={handleSignUpSubmit}
        onBackToLogin={() => setMode('login')}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-glacier-blue via-snow to-powder-gray flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="snowline-card-elevated">
          <CardHeader className="text-center space-y-4">
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 left-4 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Mountain className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Welcome to Snowline
              </CardTitle>
              <CardDescription className="text-base">
                {mode === 'login' 
                  ? 'Track your skiing adventures with precision GPS technology'
                  : 'Reset your password to continue skiing'
                }
              </CardDescription>
            </div>

            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              New Zealand's #1 Ski Tracking App
            </Badge>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {mode === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="sarah@example.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                        />
                      </div>
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={loginData.rememberMe}
                        onChange={(e) => setLoginData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-muted-foreground">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setMode('forgot-password')}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full snowline-button-primary"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="text-primary hover:underline font-medium"
                      >
                        Sign up for free
                      </button>
                    </p>
                  </div>
                </motion.form>
              )}

              {mode === 'forgot-password' && (
                <motion.form
                  key="forgot-password"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleForgotPasswordSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="Enter your email address"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                        />
                      </div>
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      <p className="text-sm text-muted-foreground">
                        We'll send you a link to reset your password.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full snowline-button-primary"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-sm text-primary hover:underline"
                    >
                      Back to sign in
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Demo Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-white/80 backdrop-blur-sm border border-border/50 rounded-xl"
        >
          <h4 className="text-sm font-medium text-center mb-2">Demo Accounts</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Platform Admin:</strong> alex@snowline.app</p>
            <p><strong>Ski Field Admin:</strong> lisa@coronetpeak.co.nz</p>
            <p><strong>Pro User:</strong> mike@example.com</p>
            <p><strong>Basic User:</strong> sarah@example.com</p>
            <p className="pt-1 text-center"><em>Password: password123</em></p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}