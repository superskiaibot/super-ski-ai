import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Clock, Mountain, Zap, MapPin, Eye, EyeOff, FileText, Globe, TrendingUp, Activity, Flame, Crown, Gauge, Route, Lock } from 'lucide-react';
import { MapView } from './MapView';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { TrackingStats, Resort } from './types';
import { formatTime, formatDistance, formatVertical } from './utils';
import { User } from '../../src/types/index';
import { hasFeature } from '../../src/utils/featureGates';

interface SaveRunDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (isDraft?: boolean) => void;
  trackingStats: TrackingStats;
  selectedResort: Resort | null;
  runName: string;
  runDescription: string;
  isPublic: boolean;
  onRunNameChange: (value: string) => void;
  onRunDescriptionChange: (value: string) => void;
  onIsPublicChange: (value: boolean) => void;
  sessionDate?: Date;
  currentUser?: User;
  onUpgrade?: () => void;
  currentLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  trackingData?: Array<{
    latitude: number;
    longitude: number;
    altitude?: number;
    timestamp: Date;
    speed?: number;
  }>;
}

export function SaveRunDialog({
  isOpen,
  onClose,
  onSave,
  trackingStats,
  selectedResort,
  runName,
  runDescription,
  isPublic,
  onRunNameChange,
  onRunDescriptionChange,
  onIsPublicChange,
  sessionDate,
  currentUser,
  onUpgrade,
  currentLocation,
  trackingData
}: SaveRunDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [savingAs, setSavingAs] = useState<'draft' | 'published' | null>(null);

  // Guard against undefined trackingStats
  if (!trackingStats) {
    console.warn('SaveRunDialog: trackingStats is undefined');
    return null;
  }

  // Check if user has Pro features
  const hasProFeatures = currentUser ? hasFeature(currentUser, 'advanced_analytics') : false;

  const handleSave = async (isDraft = false) => {
    setIsSaving(true);
    setSavingAs(isDraft ? 'draft' : 'published');
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(isDraft);
    setIsSaving(false);
    setSavingAs(null);
  };

  // Format date for display
  const displayDate = (sessionDate || new Date()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[96vw] sm:w-full mx-auto max-h-[92vh] overflow-y-auto p-0 border-0 shadow-2xl">
        <div className="relative">
          {/* Hero Map View with Analytics Overlay - Significantly Increased Height */}
          <div className="relative h-[28rem] overflow-hidden rounded-t-xl">
            <MapView
              isTracking={false}
              currentLocation={currentLocation}
              selectedResort={selectedResort}
              trackingData={trackingData}
              mapStyle="hybrid"
            />
            
            {/* Very light gradient overlay for better text visibility without blocking map */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
            
            {/* Resort Info Header */}
            <div className="absolute top-4 left-4 right-4 z-30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-semibold drop-shadow-lg">
                    {selectedResort?.name || 'Mountain Session'}
                  </span>
                </div>
                <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
                  {displayDate}
                </Badge>
              </div>
            </div>

            {/* Compact Analytics Cards Overlay - At bottom for maximum map visibility */}
            <div className="absolute bottom-2 left-3 right-3 z-20">
              <div className="space-y-1.5">
                {/* Main Stats Row - Compact */}
                <div className="grid grid-cols-3 gap-1.5">
                  {/* Speed Card - Compact */}
                  <div className="bg-white/98 backdrop-blur-lg border border-orange-200 rounded-lg p-1.5 text-center shadow-lg">
                    <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-1">
                      <Gauge className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                    <div className="text-orange-600 text-xs font-bold leading-none mb-0.5">
                      {(trackingStats?.maxSpeed || 0).toFixed(1)}
                    </div>
                    <div className="text-orange-600/70 text-[10px] font-medium uppercase tracking-wide leading-none">
                      MAX KM/H
                    </div>
                  </div>
                  
                  {/* Time Card - Compact */}
                  <div className="bg-white/98 backdrop-blur-lg border border-blue-200 rounded-lg p-1.5 text-center shadow-lg">
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-1">
                      <Clock className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                    <div className="text-blue-600 text-xs font-bold leading-none mb-0.5">
                      {formatTime(trackingStats?.duration || 0)}
                    </div>
                    <div className="text-blue-600/70 text-[10px] font-medium uppercase tracking-wide leading-none">
                      TIME
                    </div>
                  </div>
                  
                  {/* Distance Card - Compact */}
                  <div className="bg-white/98 backdrop-blur-lg border border-green-200 rounded-lg p-1.5 text-center shadow-lg">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-1">
                      <Route className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                    <div className="text-green-600 text-xs font-bold leading-none mb-0.5">
                      {formatDistance(trackingStats?.distance || 0)}
                    </div>
                    <div className="text-green-600/70 text-[10px] font-medium uppercase tracking-wide leading-none">
                      DISTANCE
                    </div>
                  </div>
                </div>

                {/* Pro Analytics Row - Show actual cards with locks for basic users */}
                <div className="grid grid-cols-3 gap-1.5">
                  {hasProFeatures ? (
                    <>
                      {/* Vertical Card - Pro User */}
                      <div className="bg-white/98 backdrop-blur-lg border border-purple-200 rounded-lg p-1.5 text-center shadow-lg">
                        <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-1">
                          <Mountain className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                        <div className="text-purple-600 text-xs font-bold leading-none mb-0.5">
                          {formatVertical(trackingStats?.vertical || 0)}
                        </div>
                        <div className="text-purple-600/70 text-[10px] font-medium uppercase tracking-wide leading-none">
                          VERTICAL
                        </div>
                      </div>
                      
                      {/* Average Speed Card - Pro User */}
                      <div className="bg-white/98 backdrop-blur-lg border border-cyan-200 rounded-lg p-1.5 text-center shadow-lg">
                        <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-1">
                          <TrendingUp className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                        <div className="text-cyan-600 text-xs font-bold leading-none mb-0.5">
                          {(trackingStats?.avgSpeed || 0).toFixed(1)}
                        </div>
                        <div className="text-cyan-600/70 text-[10px] font-medium uppercase tracking-wide leading-none">
                          AVG SPEED
                        </div>
                      </div>
                      
                      {/* Calories Card - Pro User */}
                      <div className="bg-white/98 backdrop-blur-lg border border-red-200 rounded-lg p-1.5 text-center shadow-lg">
                        <div className="w-5 h-5 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-1">
                          <Flame className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                        <div className="text-red-600 text-xs font-bold leading-none mb-0.5">
                          {Math.round(trackingStats?.calories || 0)}
                        </div>
                        <div className="text-red-600/70 text-[10px] font-medium uppercase tracking-wide leading-none">
                          CALORIES
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Vertical Card - Basic User (Locked) */}
                      <div className="relative bg-white/80 backdrop-blur-lg border border-gray-300/60 rounded-lg p-1.5 text-center shadow-lg opacity-75">
                        <div className="absolute top-1 right-1 w-3 h-3 bg-gray-500 rounded-full flex items-center justify-center">
                          <Lock className="w-1.5 h-1.5 text-white" strokeWidth={4} />
                        </div>
                        <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-1">
                          <Mountain className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                        <div className="text-gray-500 text-xs font-bold leading-none mb-0.5">
                          ---
                        </div>
                        <div className="text-gray-400/70 text-[10px] font-medium uppercase tracking-wide leading-none">
                          VERTICAL
                        </div>
                        {onUpgrade && (
                          <div 
                            className="absolute inset-0 bg-transparent rounded-lg cursor-pointer"
                            onClick={onUpgrade}
                          />
                        )}
                      </div>
                      
                      {/* Average Speed Card - Basic User (Locked) */}
                      <div className="relative bg-white/80 backdrop-blur-lg border border-gray-300/60 rounded-lg p-1.5 text-center shadow-lg opacity-75">
                        <div className="absolute top-1 right-1 w-3 h-3 bg-gray-500 rounded-full flex items-center justify-center">
                          <Lock className="w-1.5 h-1.5 text-white" strokeWidth={4} />
                        </div>
                        <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-1">
                          <TrendingUp className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                        <div className="text-gray-500 text-xs font-bold leading-none mb-0.5">
                          ---
                        </div>
                        <div className="text-gray-400/70 text-[10px] font-medium uppercase tracking-wide leading-none">
                          AVG SPEED
                        </div>
                        {onUpgrade && (
                          <div 
                            className="absolute inset-0 bg-transparent rounded-lg cursor-pointer"
                            onClick={onUpgrade}
                          />
                        )}
                      </div>
                      
                      {/* Calories Card - Basic User (Locked) */}
                      <div className="relative bg-white/80 backdrop-blur-lg border border-gray-300/60 rounded-lg p-1.5 text-center shadow-lg opacity-75">
                        <div className="absolute top-1 right-1 w-3 h-3 bg-gray-500 rounded-full flex items-center justify-center">
                          <Lock className="w-1.5 h-1.5 text-white" strokeWidth={4} />
                        </div>
                        <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-1">
                          <Flame className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                        <div className="text-gray-500 text-xs font-bold leading-none mb-0.5">
                          ---
                        </div>
                        <div className="text-gray-400/70 text-[10px] font-medium uppercase tracking-wide leading-none">
                          CALORIES
                        </div>
                        {onUpgrade && (
                          <div 
                            className="absolute inset-0 bg-transparent rounded-lg cursor-pointer"
                            onClick={onUpgrade}
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dialog Content */}
          <div className="p-6 space-y-6 bg-white rounded-b-xl">
            {/* Header */}
            <DialogHeader className="space-y-3">
              <DialogTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Save className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-midnight leading-tight">Save Your Run</h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Capture this epic session
                  </p>
                </div>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Save your skiing session with custom name, description, and privacy settings. View your session metrics and choose to publish or save as draft.
              </DialogDescription>
            </DialogHeader>

            {/* Pro Upgrade Prompt for Basic Users */}
            {!hasProFeatures && onUpgrade && (
              <div className="bg-gradient-to-r from-primary/8 to-primary/12 border-2 border-primary/25 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-midnight leading-tight">
                      Unlock Pro Analytics
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight mt-1">
                      Get elevation tracking, detailed speed analysis, calories burned & comprehensive performance insights
                    </p>
                  </div>
                  <Button 
                    onClick={onUpgrade}
                    size="sm"
                    className="flex-shrink-0 h-8 px-4 text-xs font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                  >
                    Upgrade
                  </Button>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Run Name */}
              <div>
                <Label htmlFor="run-name" className="text-sm font-semibold text-midnight">
                  Run Name
                </Label>
                <Input
                  id="run-name"
                  placeholder={`${selectedResort?.name || 'Mountain'} Session`}
                  value={runName}
                  onChange={(e) => onRunNameChange(e.target.value)}
                  className="mt-2 h-10 text-sm border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="run-description" className="text-sm font-semibold text-midnight">
                  Description <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Textarea
                  id="run-description"
                  placeholder="How was the snow? Any epic moments to remember?"
                  value={runDescription}
                  onChange={(e) => onRunDescriptionChange(e.target.value)}
                  className="mt-2 min-h-[80px] resize-none text-sm border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              {/* Publishing Options */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-midnight">Publishing Settings</Label>
                
                {/* Privacy Setting */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-powder-gray/50 to-muted/40 rounded-xl border border-gray-200/70">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-sm ${
                      isPublic 
                        ? 'bg-gradient-to-br from-green-500 to-green-600' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      {isPublic ? (
                        <Globe className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-midnight">Share Publicly</p>
                      <p className="text-xs text-muted-foreground leading-tight">
                        Make this run visible in the social feed
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={onIsPublicChange}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>

                {/* Session Date Info */}
                <div className="p-4 bg-gradient-to-r from-primary/8 to-glacier-blue/30 border border-primary/25 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                      <Clock className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-midnight">Session Recorded</p>
                      <p className="text-sm text-primary font-medium">
                        {(sessionDate || new Date()).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <DialogFooter className="gap-2 pt-4 border-t border-gray-200/50">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 text-sm font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200"
                disabled={isSaving}
              >
                Cancel
              </Button>
              
              {/* Save as Draft Button */}
              <Button
                variant="outline"
                onClick={() => handleSave(true)}
                className="flex-1 h-10 text-sm font-semibold border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-500 rounded-xl transition-all duration-200"
                disabled={isSaving}
              >
                {isSaving && savingAs === 'draft' ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 mr-2"
                    >
                      <FileText className="w-4 h-4" />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Save Draft
                  </>
                )}
              </Button>
              
              {/* Publish Button */}
              <Button
                onClick={() => handleSave(false)}
                className="flex-1 h-10 text-sm font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isSaving}
              >
                {isSaving && savingAs === 'published' ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 mr-2"
                    >
                      <Save className="w-4 h-4" />
                    </motion.div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Publish Run
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}