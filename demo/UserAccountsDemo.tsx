import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mountain, Users, Settings, UserPlus, LogIn, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AuthScreen } from '../auth/AuthScreen';
import { Profile } from '../Profile';
import { User as UserType } from '../../src/types/index';
import { MOCK_USERS } from '../../src/utils/mockUsers';

export function UserAccountsDemo() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'auth' | 'profile'>('welcome');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    setCurrentScreen('profile');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('welcome');
  };

  const handleUpdateProfile = (updates: Partial<UserType>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const demoUsers = Object.values(MOCK_USERS);

  if (currentScreen === 'profile' && currentUser) {
    return (
      <div className="relative">
        {/* Logout Button */}
        <div className="fixed top-4 right-4 z-50">
          <Button onClick={handleLogout} variant="outline" className="bg-white/90 backdrop-blur-sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        
        <Profile
          user={currentUser}
          currentUser={currentUser}
          isOwnProfile={true}
          runs={[]} // In real app, this would be fetched
          onUpdateProfile={handleUpdateProfile}
        />
      </div>
    );
  }

  if (currentScreen === 'auth') {
    return (
      <AuthScreen
        onLogin={handleLogin}
        onClose={() => setCurrentScreen('welcome')}
        initialMode={authMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-glacier-blue via-snow to-powder-gray flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <Card className="snowline-card-elevated">
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl">
                <Mountain className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            
            <div>
              <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Snowline User Accounts & Profiles
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Comprehensive user management system with authentication, profiles, and preferences
              </CardDescription>
            </div>

            <div className="flex justify-center space-x-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Authentication System
              </Badge>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                Profile Management
              </Badge>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                Social Features
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Feature Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <UserPlus className="w-5 h-5 mr-2 text-primary" />
                    Sign Up Flow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    4-step registration process with personal info, skiing preferences, and privacy settings
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Account details & validation</li>
                    <li>• Profile information & avatar</li>
                    <li>• Skiing level & equipment</li>
                    <li>• Preferences & legal agreements</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2 border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-600" />
                    Profile Editor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Comprehensive profile management with tabbed interface for all user data
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Personal & contact information</li>
                    <li>• Skiing experience & equipment</li>
                    <li>• Privacy & notification settings</li>
                    <li>• Recording & tracking preferences</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2 border-blue-500/20 bg-blue-500/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Social Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Rich social profile with stats, runs, achievements, and following system
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Public/private profile options</li>
                    <li>• Followers & following management</li>
                    <li>• Run sharing & statistics</li>
                    <li>• Achievement system integration</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Demo Actions */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Try the System</h3>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => {
                      setAuthMode('signup');
                      setCurrentScreen('auth');
                    }}
                    className="snowline-button-primary"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Try Sign Up Flow
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setAuthMode('login');
                      setCurrentScreen('auth');
                    }}
                    variant="outline"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Try Login
                  </Button>
                </div>
              </div>

              {/* Demo User Profiles */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-center">Or explore with demo accounts:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {demoUsers.map((user) => (
                    <Card 
                      key={user.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow border border-border/50 hover:border-primary/20"
                      onClick={() => handleLogin(user)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <h5 className="font-medium text-sm">{user.displayName || user.name}</h5>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                        <div className="flex justify-center mt-2">
                          <Badge 
                            variant={user.isVerified ? "default" : "outline"}
                            className="text-xs"
                          >
                            {user.role?.type === 'platform_admin' ? 'Platform Admin' :
                             user.role?.type === 'ski_field_admin' ? 'Field Admin' :
                             user.isVerified ? 'Pro User' : 'Basic User'
                            }
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h4 className="font-medium mb-4 text-center">System Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h5 className="font-medium text-primary">Authentication</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Multi-step registration with validation</li>
                    <li>• Email & password authentication</li>
                    <li>• Password reset functionality</li>
                    <li>• Remember me & session management</li>
                    <li>• Account type selection (Individual/Business/Team)</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-primary">Profile Management</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Complete profile editor with tabs</li>
                    <li>• Avatar & cover photo upload</li>
                    <li>• Skiing preferences & equipment</li>
                    <li>• Privacy & notification controls</li>
                    <li>• Recording & tracking settings</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-primary">Social Features</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Follow/unfollow users</li>
                    <li>• Public/private profile options</li>
                    <li>• Run sharing & statistics display</li>
                    <li>• Social stats (followers, following)</li>
                    <li>• Activity feed & run history</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-primary">Data Management</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Comprehensive user statistics</li>
                    <li>• Skiing metrics tracking</li>
                    <li>• Equipment & preferences storage</li>
                    <li>• Contact details & verification</li>
                    <li>• Business profile support</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Built with React, TypeScript, and Snowline design system</p>
              <p className="mt-1">Includes role-based access control and comprehensive user management</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}