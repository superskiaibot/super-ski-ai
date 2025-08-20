import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mountain, Menu, X, Shield, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User as UserType } from '../src/types/index';
import { RoleService } from '../src/utils/roleService';

// Import extracted components
import { SkiFieldSidebar } from './admin/skifield/SkiFieldSidebar';
import { Overview } from './admin/skifield/sections/Overview';
import { ResortCustomization } from './admin/skifield/sections/ResortCustomization';
import { TrailManagement } from './admin/skifield/sections/TrailManagement';
import { Analytics } from './admin/skifield/sections/Analytics';
import { Events } from './admin/skifield/sections/Events';

// Import constants and types
import { RESORT_DATA, ADMIN_SECTIONS } from './admin/skifield/constants';
import { SkiFieldAdminDashboardProps } from './admin/skifield/types';

export function SkiFieldAdminDashboard({ currentUser, onClose, selectedSkiFieldId }: SkiFieldAdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Enhanced access control for platform admins
  const isPlatformAdmin = RoleService.isPlatformAdmin(currentUser);
  const isSkiFieldAdmin = RoleService.isSkiFieldAdmin(currentUser);
  const canManageThisField = RoleService.canManageSkiField(currentUser, selectedSkiFieldId || 'default');
  
  // Platform admins have FULL ACCESS to all ski fields (as if they own them)
  const hasFullAccess = isPlatformAdmin || canManageThisField;
  
  // Enhanced logging for platform admin access
  console.log('🏔️ Enhanced SkiFieldAdminDashboard access check:', {
    userEmail: currentUser?.email,
    userRole: currentUser?.role?.type,
    selectedSkiFieldId,
    isPlatformAdmin,
    isSkiFieldAdmin,
    canManageThisField,
    hasFullAccess,
    platformAdminOverride: isPlatformAdmin ? 'FULL ACCESS GRANTED' : 'NOT APPLICABLE'
  });

  // Security check - ensure user has proper access
  if (!hasFullAccess) {
    console.warn('❌ Access denied to ski field admin dashboard:', {
      userRole: currentUser?.role?.type,
      selectedSkiFieldId,
      reason: 'Insufficient permissions'
    });
    
    return (
      <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this ski field admin dashboard.
          </p>
          <Button onClick={onClose} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Map ski field ID to resort data or use default
  const getResortData = () => {
    if (selectedSkiFieldId) {
      // Simple mapping based on ski field ID - in a real app this would come from a database
      const skiFieldMappings: Record<string, typeof RESORT_DATA> = {
        'coronet-peak': {
          ...RESORT_DATA,
          name: 'Coronet Peak',
          location: 'Queenstown, South Island'
        },
        'the-remarkables': {
          ...RESORT_DATA,
          name: 'The Remarkables',
          location: 'Queenstown, South Island'
        },
        'cardrona': {
          ...RESORT_DATA,
          name: 'Cardrona Alpine Resort',
          location: 'Wānaka, South Island'
        },
        'treble-cone': {
          ...RESORT_DATA,
          name: 'Treble Cone',
          location: 'Wānaka, South Island'
        },
        'mt-hutt': {
          ...RESORT_DATA,
          name: 'Mt Hutt',
          location: 'Canterbury, South Island'
        },
        'porters': {
          ...RESORT_DATA,
          name: 'Porters Ski Area',
          location: 'Canterbury, South Island',
          status: 'maintenance' as const
        },
        'craigieburn': {
          ...RESORT_DATA,
          name: 'Craigieburn',
          location: 'Canterbury, South Island'
        },
        'turoa': {
          ...RESORT_DATA,
          name: 'Turoa',
          location: 'Ohakune, North Island'
        },
        'whakapapa': {
          ...RESORT_DATA,
          name: 'Whakapapa',
          location: 'Taupo, North Island'
        },
        'manganui': {
          ...RESORT_DATA,
          name: 'Manganui',
          location: 'Taranaki, North Island',
          status: 'maintenance' as const
        }
      };
      
      return skiFieldMappings[selectedSkiFieldId] || RESORT_DATA;
    }
    return RESORT_DATA;
  };

  const resortData = getResortData();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowMobileSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    // Streamlined content sections - only essential features
    switch (activeSection) {
      case 'overview':
        return <Overview resortData={resortData} />;
      case 'customization':
        return <ResortCustomization resortData={resortData} />;
      case 'trails':
        return <TrailManagement resortData={resortData} />;
      case 'analytics':
        return <Analytics resortData={resortData} />;
      case 'events':
        return <Events resortData={resortData} />;
      default:
        return <Overview resortData={resortData} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobile && showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      <div className="flex h-full">
        {/* Sidebar */}
        <SkiFieldSidebar
          resortData={resortData}
          adminSections={ADMIN_SECTIONS}
          activeSection={activeSection}
          isMobile={isMobile}
          showMobileSidebar={showMobileSidebar}
          onSectionChange={setActiveSection}
          onCloseMobileSidebar={() => setShowMobileSidebar(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Header with Platform Admin Status */}
          <div className="border-b border-border bg-card/95 backdrop-blur-lg">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileSidebar(true)}
                    className="rounded-lg"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                )}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <Mountain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">{ADMIN_SECTIONS.find(s => s.id === activeSection)?.label}</h1>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {ADMIN_SECTIONS.find(s => s.id === activeSection)?.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Enhanced Platform Admin Indicator */}
                {isPlatformAdmin && (
                  <div className="hidden sm:flex items-center space-x-2">
                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 animate-pulse">
                      <Shield className="w-3 h-3 mr-1" />
                      Platform Admin Override
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      Full Access Granted
                    </Badge>
                  </div>
                )}
                
                {/* Regular Ski Field Admin Indicator */}
                {isSkiFieldAdmin && !isPlatformAdmin && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 hidden sm:flex">
                    <Shield className="w-3 h-3 mr-1" />
                    Ski Field Admin
                  </Badge>
                )}
                
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hidden sm:flex">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  {resortData.name} Online
                </Badge>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-xl"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>

            {/* Mobile Platform Admin Indicator */}
            {isPlatformAdmin && isMobile && (
              <div className="px-4 pb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Platform Override
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Full Access
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}