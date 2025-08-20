import React from 'react';
import { Mountain, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { ResortData, AdminSection } from './types';

interface SkiFieldSidebarProps {
  resortData: ResortData;
  adminSections: AdminSection[];
  activeSection: string;
  isMobile: boolean;
  showMobileSidebar: boolean;
  onSectionChange: (sectionId: string) => void;
  onCloseMobileSidebar: () => void;
}

export function SkiFieldSidebar({
  resortData,
  adminSections,
  activeSection,
  isMobile,
  showMobileSidebar,
  onSectionChange,
  onCloseMobileSidebar
}: SkiFieldSidebarProps) {
  return (
    <div className={`
      ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-80' : 'relative w-80'} 
      ${isMobile && !showMobileSidebar ? '-translate-x-full' : 'translate-x-0'}
      transition-transform duration-300 ease-in-out
      bg-card border-r border-border overflow-y-auto
    `}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Mountain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">
              Ski Field Admin
            </h2>
            <p className="text-sm text-muted-foreground">
              {resortData.name}
            </p>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCloseMobileSidebar}
              className="rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Resort Status Indicator */}
        <div className="mt-4 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            resortData.status === 'operational' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`} />
          <span className="text-sm font-medium">
            {resortData.status === 'operational' ? 'Operational' : 'Alert Status'}
          </span>
          <Badge variant="outline" className="text-xs">
            {resortData.operatingHours}
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {adminSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => {
                onSectionChange(section.id);
                if (isMobile) onCloseMobileSidebar();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-left ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{section.label}</div>
                <div className="text-xs opacity-75 truncate">{section.description}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Visitors</span>
            <span className="font-semibold">{resortData.visitors.current.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Capacity</span>
            <span className="font-semibold">{Math.round((resortData.visitors.current / resortData.visitors.capacity) * 100)}%</span>
          </div>
          <Progress 
            value={(resortData.visitors.current / resortData.visitors.capacity) * 100} 
            className="h-2"
          />
        </div>
      </div>
    </div>
  );
}