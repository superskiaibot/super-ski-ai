import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone,
  Crown,
  ChevronRight,
  Zap,
  MapPin,
  Activity,
  Users,
  LogOut,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { PremiumPlans } from './PremiumPlans';
import { User as UserType } from '../src/types/index';

interface SettingsPageProps {
  currentUser: UserType;
  onUpdateUser: (updates: Partial<UserType>) => void;
  onShowAdminDocumentation?: () => void;
}

export function SettingsPage({ currentUser, onUpdateUser, onShowAdminDocumentation }: SettingsPageProps) {
  const [showPremiumPlans, setShowPremiumPlans] = useState(false);

  const handleUpdatePreferences = (key: string, value: any) => {
    onUpdateUser({
      preferences: {
        ...currentUser.preferences,
        [key]: value
      }
    });
  };

  const handleUpdateNotifications = (key: string, value: boolean) => {
    onUpdateUser({
      preferences: {
        ...currentUser.preferences,
        notifications: {
          ...currentUser.preferences.notifications,
          [key]: value
        }
      }
    });
  };

  const handleUpdatePrivacy = (key: string, value: any) => {
    onUpdateUser({
      preferences: {
        ...currentUser.preferences,
        privacy: {
          ...currentUser.preferences.privacy,
          [key]: value
        }
      }
    });
  };

  const handleUpgradePlan = (plan: 'basic' | 'pro') => {
    // Handle plan upgrade logic here
    console.log('Upgrading to plan:', plan);
    // For now, just update the user's verified status
    if (plan === 'pro') {
      onUpdateUser({ isVerified: true });
    }
    setShowPremiumPlans(false);
  };

  if (showPremiumPlans) {
    return (
      <PremiumPlans
        currentUser={currentUser}
        onUpgrade={handleUpgradePlan}
        onClose={() => setShowPremiumPlans(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your Snowline experience and manage your account
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Premium Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      currentUser.isVerified 
                        ? 'bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Snowline {currentUser.isVerified ? 'Pro' : 'Basic'}
                        {currentUser.isVerified && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            Active
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {currentUser.isVerified 
                          ? 'Enjoying all premium features'
                          : 'Upgrade to unlock premium features'
                        }
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowPremiumPlans(true)}
                    variant={currentUser.isVerified ? "outline" : "default"}
                    className="rounded-xl"
                  >
                    {currentUser.isVerified ? 'Manage Plan' : 'Upgrade to Pro'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account
                </CardTitle>
                <CardDescription>
                  Manage your personal information and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.displayName || currentUser.name}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <p className="text-sm text-muted-foreground">
                      @{currentUser.username}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Preferences
                </CardTitle>
                <CardDescription>
                  Customize your app experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Units</label>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred measurement system
                      </p>
                    </div>
                    <Select
                      value={currentUser.preferences.units}
                      onValueChange={(value) => handleUpdatePreferences('units', value)}
                    >
                      <SelectTrigger className="w-32 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric</SelectItem>
                        <SelectItem value="imperial">Imperial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Language</label>
                      <p className="text-sm text-muted-foreground">
                        Select your preferred language
                      </p>
                    </div>
                    <Select
                      value={currentUser.preferences.language}
                      onValueChange={(value) => handleUpdatePreferences('language', value)}
                    >
                      <SelectTrigger className="w-32 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Push Notifications</label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={currentUser.preferences.notifications.push}
                      onCheckedChange={(checked) => handleUpdateNotifications('push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={currentUser.preferences.notifications.email}
                      onCheckedChange={(checked) => handleUpdateNotifications('email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Weather Alerts</label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about weather conditions
                      </p>
                    </div>
                    <Switch
                      checked={currentUser.preferences.notifications.weather}
                      onCheckedChange={(checked) => handleUpdateNotifications('weather', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Social Notifications</label>
                      <p className="text-sm text-muted-foreground">
                        Notifications for likes, comments, and follows
                      </p>
                    </div>
                    <Switch
                      checked={currentUser.preferences.notifications.social}
                      onCheckedChange={(checked) => handleUpdateNotifications('social', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Control your privacy and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Public Profile</label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch
                      checked={currentUser.preferences.privacy.publicProfile}
                      onCheckedChange={(checked) => handleUpdatePrivacy('publicProfile', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Share Location</label>
                      <p className="text-sm text-muted-foreground">
                        Allow friends to see your location on the mountain
                      </p>
                    </div>
                    <Switch
                      checked={currentUser.preferences.privacy.shareLocation}
                      onCheckedChange={(checked) => handleUpdatePrivacy('shareLocation', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Share Statistics</label>
                      <p className="text-sm text-muted-foreground">
                        Share your skiing stats with other users
                      </p>
                    </div>
                    <Switch
                      checked={currentUser.preferences.privacy.shareStats}
                      onCheckedChange={(checked) => handleUpdatePrivacy('shareStats', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Help & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Help & Support
                </CardTitle>
                <CardDescription>
                  Get help and provide feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {onShowAdminDocumentation && (
                  <Button 
                    onClick={onShowAdminDocumentation}
                    variant="outline" 
                    className="w-full justify-between rounded-xl border-red-200 hover:bg-red-50"
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-red-600" />
                      <span>Admin Management Guide</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="outline" className="w-full justify-between rounded-xl">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>Help Center</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Contact Support</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between rounded-xl">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Send Feedback</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full rounded-xl">
                    Export Data
                  </Button>
                  <Button variant="outline" className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}