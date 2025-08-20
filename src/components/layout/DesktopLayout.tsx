import React from 'react';
import { Mountain, User, Shield, RotateCcw } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { UserSwitcher } from '../../../components/UserSwitcher';
import { User as UserType } from '../../types/index';
import { NavigationItem } from '../../types/app';

interface DesktopLayoutProps {
  currentUser: UserType;
  isProUser: boolean;
  hasAdminAccess: boolean;
  roleBadge: any;
  navigationItems: NavigationItem[];
  activeTab: string;
  viewingUserProfile: UserType | null;
  selectedResort: any;
  isMapFullscreen: boolean;
  onTabChange: (tab: string) => void;
  onUserChange: (user: UserType) => void;
  onChangeResort: () => void;
  onShowUpgrade: () => void;
  onAdminAccess: () => void;
  onViewMyProfile: () => void;
  children: React.ReactNode;
}

export function DesktopLayout({
  currentUser,
  isProUser,
  hasAdminAccess,
  roleBadge,
  navigationItems,
  activeTab,
  viewingUserProfile,
  selectedResort,
  isMapFullscreen,
  onTabChange,
  onUserChange,
  onChangeResort,
  onShowUpgrade,
  onAdminAccess,
  onViewMyProfile,
  children
}: DesktopLayoutProps) {
  return (
    <>
      {/* Sidebar with Snowline branding */}
      <div className="w-72 h-screen sticky top-0 flex flex-col border-r bg-card border-border shadow-lg">
        {/* Logo Section with proper Snowline styling */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/30">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Mountain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-xl leading-none mb-1">
                Snowline
              </h2>
              <p className="text-sm text-muted-foreground font-medium leading-tight">
                Ski Tracking & Analytics
              </p>
            </div>
            {isProUser ? (
              <Badge 
                variant="secondary" 
                className="bg-primary/10 text-primary border-primary/20 text-xs"
              >
                Pro
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs border-border/50">
                Basic
              </Badge>
            )}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-border">
          <UserSwitcher 
            currentUser={currentUser}
            onUserChange={onUserChange}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  data-tutorial={`nav-${item.id}`}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px] ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={isActive ? "secondary" : "default"} 
                      className={`text-xs ${
                        item.badge === 'LIVE' ? 'animate-pulse bg-green-500 text-white' : 
                        item.badge === 'PAUSED' ? 'bg-yellow-500 text-white' :
                        item.badge === 'STOPPED' ? 'bg-gray-500 text-white' : ''
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {/* Profile viewing info */}
          {activeTab === 'profile' && viewingUserProfile && (
            <div className="mt-8 pt-4 border-t border-border">
              <div className="space-y-2">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider px-4">
                  Viewing Profile
                </h4>
                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    🔍 <strong>{viewingUserProfile.displayName || viewingUserProfile.name}</strong>
                    <br />
                    <span className="text-blue-600">@{viewingUserProfile.username}</span>
                  </p>
                </div>
                <Button
                  onClick={onViewMyProfile}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl min-h-[44px] justify-start space-x-2 hover:bg-muted"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">View My Profile</span>
                </Button>
              </div>
            </div>
          )}

          {/* Resort Switching Section */}
          {activeTab === 'tracking' && (
            <div className="mt-8 pt-4 border-t border-border">
              <div className="space-y-2">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider px-4">
                  Resort Selection
                </h4>
                <Button
                  onClick={onChangeResort}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl min-h-[44px] justify-start space-x-2 hover:bg-muted"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedResort ? 'Change Resort' : 'Select Resort'}
                  </span>
                </Button>
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="space-y-2">
            {!isProUser && (
              <Button
                onClick={onShowUpgrade}
                data-tutorial="upgrade-button"
                className="w-full rounded-xl min-h-[44px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                <Mountain className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm">Upgrade to Pro</span>
              </Button>
            )}
            {hasAdminAccess && (
              <Button
                onClick={onAdminAccess}
                className="w-full rounded-xl min-h-[44px] justify-start space-x-2 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10 text-primary border border-primary/20 hover:border-primary/30 transition-all duration-200"
                variant="outline"
                disabled={!currentUser}
              >
                <Shield className="w-4 h-4 flex-shrink-0 text-primary" />
                <span className="text-sm flex-1 text-left font-medium">Admin Console</span>
                <Badge variant={roleBadge.variant} className={`text-xs ${roleBadge.color} bg-primary/15 border-primary/30`}>
                  {roleBadge.text}
                </Badge>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${isMapFullscreen ? 'hidden' : ''}`}>
        <main className="h-full">
          {children}
        </main>
      </div>
    </>
  );
}