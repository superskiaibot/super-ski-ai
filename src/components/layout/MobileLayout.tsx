import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mountain, 
  User, 
  Shield, 
  RotateCcw, 
  HelpCircle, 
  Menu, 
  X, 
  MapPin,
  MoreHorizontal 
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { UserSwitcher } from '../../../components/UserSwitcher';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../../components/ui/dropdown-menu';
import { User as UserType } from '../../types/index';
import { NavigationItem, TrackingSessionStatus } from '../../types/app';

interface MobileLayoutProps {
  currentUser: UserType;
  isProUser: boolean;
  hasAdminAccess: boolean;
  roleBadge: any;
  navigationItems: NavigationItem[];
  activeTab: string;
  viewingUserProfile: UserType | null;
  selectedResort: any;
  trackingSessionStatus: TrackingSessionStatus;
  isMobileMenuOpen: boolean;
  isMapFullscreen: boolean;
  onTabChange: (tab: string) => void;
  onUserChange: (user: UserType) => void;
  onChangeResort: () => void;
  onShowUpgrade: () => void;
  onAdminAccess: () => void;
  onViewMyProfile: () => void;
  onShowTutorial: () => void;
  onToggleMobileMenu: () => void;
  children: React.ReactNode;
}

export function MobileLayout({
  currentUser,
  isProUser,
  hasAdminAccess,
  roleBadge,
  navigationItems,
  activeTab,
  viewingUserProfile,
  selectedResort,
  trackingSessionStatus,
  isMobileMenuOpen,
  isMapFullscreen,
  onTabChange,
  onUserChange,
  onChangeResort,
  onShowUpgrade,
  onAdminAccess,
  onViewMyProfile,
  onShowTutorial,
  onToggleMobileMenu,
  children
}: MobileLayoutProps) {
  const primaryNavItems = navigationItems.slice(0, 4);
  const secondaryNavItems = navigationItems.slice(4);

  return (
    <>
      {/* Mobile Header */}
      <div className={`sticky top-0 z-50 ${isMapFullscreen ? 'hidden' : ''}`}>
        <header className="snowline-glass border-b border-border pt-safe">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between min-h-[44px]">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <Mountain className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex items-center gap-2">
                  <h3 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-lg leading-none">
                    Snowline
                  </h3>
                  {isProUser ? (
                    <Badge 
                      variant="secondary" 
                      className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-1"
                    >
                      Pro
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs border-border/50 px-2 py-1">
                      Basic
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 px-2">
                {trackingSessionStatus && (
                  <Badge className={`text-xs px-2 py-1 h-6 ${
                    trackingSessionStatus === 'LIVE' ? 'bg-green-500 text-white animate-pulse' :
                    trackingSessionStatus === 'PAUSED' ? 'bg-yellow-500 text-white' :
                    trackingSessionStatus === 'STOPPED' ? 'bg-gray-500 text-white' : ''
                  }`}>
                    {trackingSessionStatus}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {activeTab === 'tracking' && (
                  <Button
                    onClick={onChangeResort}
                    variant="ghost"
                    size="sm"
                    className="rounded-lg min-h-[40px] min-w-[40px] p-2"
                  >
                    <MapPin className="w-4 h-4" />
                  </Button>
                )}
                {activeTab === 'profile' && viewingUserProfile && (
                  <Button
                    onClick={onViewMyProfile}
                    variant="ghost"
                    size="sm"
                    className="rounded-lg min-h-[40px] min-w-[40px] p-2"
                    title="View My Profile"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleMobileMenu}
                  className="rounded-lg min-h-[40px] min-w-[40px] p-2"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 z-40 p-4 mx-4 rounded-2xl shadow-2xl snowline-glass-strong border-border"
              style={{ top: '100%' }}
            >
              <div className="space-y-2">
                {/* User Switcher for Mobile */}
                <div className="pb-2 mb-2 border-b border-border">
                  <UserSwitcher 
                    currentUser={currentUser}
                    onUserChange={onUserChange}
                  />
                </div>
                
                {navigationItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      data-tutorial={`nav-${item.id}`}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] ${
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

                {activeTab === 'tracking' && (
                  <>
                    <div className="pt-2 border-t border-border" />
                    <button
                      onClick={onChangeResort}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-muted-foreground hover:bg-muted hover:text-foreground min-h-[44px]"
                    >
                      <RotateCcw className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-left text-sm">
                        {selectedResort ? 'Change Resort' : 'Select Resort'}
                      </span>
                    </button>
                  </>
                )}

                {activeTab === 'profile' && viewingUserProfile && (
                  <>
                    <div className="pt-2 border-t border-border" />
                    <button
                      onClick={onViewMyProfile}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-muted-foreground hover:bg-muted hover:text-foreground min-h-[44px]"
                    >
                      <User className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-left text-sm">View My Profile</span>
                    </button>
                    <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        🔍 Viewing: <strong>{viewingUserProfile.displayName || viewingUserProfile.name}</strong>
                      </p>
                    </div>
                  </>
                )}

                <div className="pt-2 border-t border-border">
                  <button
                    onClick={onShowTutorial}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-primary hover:bg-primary/10 hover:text-primary min-h-[44px] bg-primary/5 border border-primary/20"
                  >
                    <HelpCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 text-left text-sm">Tutorial</span>
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                      Always Available
                    </Badge>
                  </button>
                </div>

                {!isProUser && (
                  <div className="pt-2 border-t border-border">
                    <Button
                      onClick={onShowUpgrade}
                      data-tutorial="upgrade-button"
                      className="w-full rounded-xl min-h-[44px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl"
                    >
                      <Mountain className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">Upgrade to Pro</span>
                    </Button>
                  </div>
                )}

                {/* Single Admin Button for Mobile */}
                {hasAdminAccess && (
                  <div className="pt-2 border-t border-border">
                    <button
                      onClick={onAdminAccess}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10 text-primary border border-primary/20 hover:border-primary/30 min-h-[44px]"
                      disabled={!currentUser}
                    >
                      <Shield className="w-5 h-5 flex-shrink-0 text-primary" />
                      <span className="flex-1 text-left text-sm font-medium">Admin Console</span>
                      <Badge variant={roleBadge.variant} className={`text-xs ${roleBadge.color} bg-primary/15 border-primary/30`}>
                        {roleBadge.text}
                      </Badge>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Content */}
      <main className={`min-h-screen ${isMapFullscreen ? '' : activeTab === 'tracking' ? 'pb-nav-mobile-tracking' : 'pb-nav-mobile'} mt-0 pt-0`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 border-t border-border snowline-glass pb-safe ${isMapFullscreen ? 'hidden' : ''}`}>
        <div className="grid grid-cols-5 gap-1 p-2">
          {primaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                data-tutorial={`nav-${item.id}`}
                className={`flex flex-col items-center justify-center space-y-1 p-3 rounded-xl transition-all relative min-h-[44px] ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className={`absolute -top-1 -right-1 min-w-0 h-5 px-2 text-xs ${
                      item.badge === 'LIVE' ? 'animate-pulse bg-green-500' : 
                      item.badge === 'PAUSED' ? 'bg-yellow-500' :
                      item.badge === 'STOPPED' ? 'bg-gray-500' : ''
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex flex-col items-center justify-center space-y-1 p-3 rounded-xl transition-all relative min-h-[44px] ${
                  secondaryNavItems.some(item => activeTab === item.id)
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <MoreHorizontal className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs">More</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              side="top"
              align="center" 
              className="w-64 snowline-glass-strong border-border mb-2"
              sideOffset={8}
            >
              {secondaryNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    data-tutorial={`nav-${item.id}`}
                    className={`flex items-center space-x-3 px-4 py-3 cursor-pointer min-h-[44px] ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 text-sm">{item.label}</span>
                  </DropdownMenuItem>
                );
              })}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={onShowTutorial}
                className="flex items-center space-x-3 px-4 py-3 cursor-pointer min-h-[44px] text-primary hover:text-primary bg-primary/5 hover:bg-primary/10"
              >
                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-sm">Tutorial</span>
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                  Always Available
                </Badge>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}