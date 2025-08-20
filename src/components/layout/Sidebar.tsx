import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Mountain, 
  BarChart3, 
  Users, 
  Trophy, 
  User, 
  Settings, 
  Search,
  Navigation,
  Route,
  Globe,
  Radio
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { User as UserType } from '../../types';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
  description?: string;
  isSpecial?: boolean;
  action?: () => void;
}

interface SidebarProps {
  currentUser: UserType;
  onOpenRadio?: () => void;
  isRecording?: boolean;
}

export function Sidebar({ currentUser, onOpenRadio, isRecording }: SidebarProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState('');

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: '/',
      description: 'Overview and analytics'
    },
    {
      id: 'tracking',
      label: 'Track Session',
      icon: Navigation,
      path: '/track',
      description: 'Record your runs'
    },
    {
      id: 'social',
      label: 'Social',
      icon: Users,
      path: '/social',
      badge: '3',
      description: 'Connect with friends'
    },
    {
      id: 'leaderboards',
      label: 'Leaderboards',
      icon: Trophy,
      path: '/leaderboards',
      description: 'Rankings and competitions'
    },
    {
      id: 'resorts',
      label: 'Resorts',
      icon: Mountain,
      path: '/resorts',
      description: 'Find ski resorts'
    },
    {
      id: 'radio',
      label: 'Ski Radio',
      icon: Radio,
      path: '/radio',
      description: 'Communicate on the mountain',
      isSpecial: true,
      action: onOpenRadio
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
      description: 'Your account and stats'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      description: 'App preferences'
    }
  ];

  // Filter navigation items based on search
  const filteredItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavClick = (item: NavigationItem) => {
    if (item.isSpecial && item.action) {
      item.action();
    }
  };

  // Safe display name extraction
  const displayName = currentUser?.displayName || currentUser?.username || 'Skier';
  const userInitials = displayName.split(' ').map(n => n[0]).join('').toUpperCase() || 'S';

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 border-b border-gray-200"
      >
        <div className="flex items-center space-x-3 mb-6">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Mountain className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              SKI TRACER
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Elite Snow Sports Tracking
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          if (item.isSpecial) {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => handleNavClick(item)}
                  className="w-full justify-start h-auto p-4 text-left hover:bg-purple-50 hover:text-purple-700"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <Icon className="w-5 h-5 text-purple-600" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium truncate">{item.label}</span>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      </div>
                      {item.description && (
                        <p className="text-xs truncate mt-0.5 text-gray-500">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Button>
              </motion.div>
            );
          }
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-auto p-4 text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white shadow-md hover:bg-primary/90' 
                      : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium truncate">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            {item.badge}
                          </Badge>
                        )}
                        {item.id === 'tracking' && isRecording && (
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      {item.description && (
                        <p className={`text-xs truncate mt-0.5 ${
                          isActive ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Recording Status */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="p-4 m-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div>
              <p className="font-medium text-red-900">Session Active</p>
              <p className="text-xs text-red-700">GPS tracking in progress</p>
            </div>
          </div>
          <div className="mt-3">
            <Link to="/track">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs border-red-200 text-red-700 hover:bg-red-50"
              >
                View Session
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 border-t border-gray-200"
      >
        <Card className="p-4 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={currentUser?.avatar} alt="Profile" />
              <AvatarFallback className="bg-primary text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{displayName}</p>
              <p className="text-xs text-gray-500">
                {currentUser?.stats?.skillLevel || 'Skier'}
              </p>
            </div>
            <Link to="/settings">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-8 h-8 p-0"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}