import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mountain,
  Radio,
  Bell,
  Settings,
  User,
  Menu,
  Signal,
  Battery
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { User as UserType } from '../../types';

interface HeaderProps {
  currentUser: UserType;
  isMobile: boolean;
  isTracking?: boolean;
  onOpenRadio?: () => void;
  notifications?: number;
}

export function Header({ 
  currentUser, 
  isMobile, 
  isTracking = false, 
  onOpenRadio,
  notifications = 3 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Mountain className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              SKI TRACER
            </h1>
            {isTracking && (
              <p className="text-xs text-red-600 font-medium">
                🔴 Recording Active
              </p>
            )}
          </div>
        </Link>

        {/* Center - Status (Mobile) */}
        {isMobile && isTracking && (
          <div className="flex items-center space-x-2 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Recording</span>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Desktop Radio Button */}
          {!isMobile && onOpenRadio && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenRadio}
                className="flex items-center space-x-2 hover:bg-purple-50 hover:border-purple-300"
              >
                <Radio className="w-4 h-4 text-purple-600" />
                <span className="hidden md:inline">Radio</span>
                {/* Active indicator */}
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              </Button>
            </motion.div>
          )}

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-4 h-4 text-xs p-0 flex items-center justify-center"
                >
                  {notifications > 9 ? '9+' : notifications}
                </Badge>
              )}
            </Button>
          </div>

          {/* Status Indicators (Desktop) */}
          {!isMobile && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Signal className="w-4 h-4 text-green-500" />
                <span className="hidden lg:inline">GPS</span>
              </div>
              <div className="flex items-center space-x-1">
                <Battery className="w-4 h-4 text-green-500" />
                <span className="hidden lg:inline">85%</span>
              </div>
            </div>
          )}

          {/* Settings */}
          <Link to="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>

          {/* User Avatar */}
          <Link to="/profile">
            <div className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>
                  {currentUser.displayName?.charAt(0) || currentUser.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {!isMobile && (
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{currentUser.displayName || currentUser.username}</p>
                  <p className="text-xs text-gray-500">@{currentUser.username}</p>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}