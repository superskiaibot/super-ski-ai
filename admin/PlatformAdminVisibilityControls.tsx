import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Eye,
  EyeOff,
  Shield,
  Clock,
  AlertCircle,
  Info,
  Settings,
  Globe,
  Users,
  CheckCircle,
  Save
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Separator } from '../ui/separator';
import { User as UserType } from '../../src/types/index';

interface PlatformAdminVisibilityControlsProps {
  currentUser: UserType;
  userRole: 'platform_admin' | 'resort_admin' | 'event_manager';
  selectedResort: any;
  dateRange: string;
  onScreenChange: (screen: string) => void;
}

interface VisibilityRule {
  id: string;
  resortName: string;
  eventName?: string;
  participantsVisible: boolean;
  reason: string;
  lastChanged: string;
  changedBy: string;
  affectedUsers: number;
}

interface GlobalAnonymousSettings {
  enabled: boolean;
  duration: string;
  reason: string;
  enabledAt?: string;
  enabledBy?: string;
}

export function PlatformAdminVisibilityControls({ 
  currentUser, 
  userRole, 
  selectedResort, 
  dateRange, 
  onScreenChange 
}: PlatformAdminVisibilityControlsProps) {
  // Only Platform Admin can access this screen
  if (userRole !== 'platform_admin') {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">
            Only Platform Administrators can access visibility controls.
          </p>
        </CardContent>
      </Card>
    );
  }

  const [visibilityRules, setVisibilityRules] = useState<VisibilityRule[]>([
    {
      id: '1',
      resortName: 'Coronet Peak',
      participantsVisible: true,
      reason: 'Standard visibility policy',
      lastChanged: '2024-01-15T10:30:00Z',
      changedBy: 'Platform Admin',
      affectedUsers: 1247
    },
    {
      id: '2',
      resortName: 'The Remarkables',
      participantsVisible: true,
      reason: 'Standard visibility policy',
      lastChanged: '2024-01-15T10:30:00Z',
      changedBy: 'Platform Admin',
      affectedUsers: 892
    },
    {
      id: '3',
      resortName: 'Cardrona Alpine Resort',
      participantsVisible: false,
      reason: 'Privacy review requested by resort management',
      lastChanged: '2024-01-18T14:20:00Z',
      changedBy: 'Platform Admin',
      affectedUsers: 634
    },
    {
      id: '4',
      resortName: 'Treble Cone',
      eventName: 'Winter Championship',
      participantsVisible: false,
      reason: 'Competition privacy requirements',
      lastChanged: '2024-01-19T09:15:00Z',
      changedBy: 'Platform Admin',
      affectedUsers: 156
    }
  ]);

  const [globalAnonymous, setGlobalAnonymous] = useState<GlobalAnonymousSettings>({
    enabled: false,
    duration: '2h',
    reason: ''
  });

  const [newReason, setNewReason] = useState('');
  const [isGlobalDialogOpen, setIsGlobalDialogOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());

  const handleVisibilityToggle = (ruleId: string, visible: boolean, reason: string) => {
    setVisibilityRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { 
            ...rule, 
            participantsVisible: visible,
            reason: reason || rule.reason,
            lastChanged: new Date().toISOString(),
            changedBy: currentUser.displayName || currentUser.name
          }
        : rule
    ));
    
    setPendingChanges(prev => new Set([...prev, ruleId]));
  };

  const handleGlobalAnonymousToggle = () => {
    if (!globalAnonymous.enabled && !newReason.trim()) {
      return; // Require reason when enabling
    }

    setGlobalAnonymous(prev => ({
      ...prev,
      enabled: !prev.enabled,
      reason: newReason || prev.reason,
      enabledAt: !prev.enabled ? new Date().toISOString() : prev.enabledAt,
      enabledBy: !prev.enabled ? currentUser.displayName || currentUser.name : prev.enabledBy
    }));
    
    setIsGlobalDialogOpen(false);
    setNewReason('');
  };

  const savePendingChanges = async () => {
    // Simulate API call to save changes
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPendingChanges(new Set());
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-NZ', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRemainingTime = () => {
    if (!globalAnonymous.enabled || !globalAnonymous.enabledAt) return '';
    
    const enabledTime = new Date(globalAnonymous.enabledAt);
    const durationMs = globalAnonymous.duration === '2h' ? 2 * 60 * 60 * 1000 : 
                     globalAnonymous.duration === '24h' ? 24 * 60 * 60 * 1000 :
                     parseInt(globalAnonymous.duration) * 60 * 60 * 1000;
    
    const endTime = new Date(enabledTime.getTime() + durationMs);
    const now = new Date();
    
    if (endTime <= now) return 'Expired';
    
    const remainingMs = endTime.getTime() - now.getTime();
    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${remainingHours}h ${remainingMinutes}m remaining`;
  };

  const getTotalAffectedUsers = () => {
    return visibilityRules.reduce((sum, rule) => sum + rule.affectedUsers, 0);
  };

  const getHiddenUsers = () => {
    return visibilityRules
      .filter(rule => !rule.participantsVisible)
      .reduce((sum, rule) => sum + rule.affectedUsers, 0);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visibility Controls</h1>
          <p className="text-gray-600 mt-1">
            Manage participant visibility across resorts and events
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className="bg-red-100 text-red-700 border-red-200">
            Platform Administrator Only
          </Badge>
          
          {pendingChanges.size > 0 && (
            <Button onClick={savePendingChanges} className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save {pendingChanges.size} Change{pendingChanges.size !== 1 ? 's' : ''}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{getTotalAffectedUsers().toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{(getTotalAffectedUsers() - getHiddenUsers()).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Visible to Resorts</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <EyeOff className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{getHiddenUsers().toLocaleString()}</div>
            <div className="text-sm text-gray-600">Hidden from Resorts</div>
          </CardContent>
        </Card>
      </div>

      {/* Global Anonymous Mode */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={globalAnonymous.enabled ? 'border-red-200 bg-red-50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-red-600" />
              <span>Global Anonymous Mode</span>
            </CardTitle>
            <CardDescription>
              Force anonymous mode across all resorts temporarily
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {globalAnonymous.enabled ? (
              <div className="space-y-4">
                <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-700 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Global Anonymous Mode Active</span>
                  </div>
                  <div className="text-red-600 text-sm space-y-1">
                    <p>All participants are hidden from resort administrators across all resorts.</p>
                    <p>Duration: {globalAnonymous.duration} ({getRemainingTime()})</p>
                    <p>Enabled by: {globalAnonymous.enabledBy}</p>
                    <p>Reason: {globalAnonymous.reason}</p>
                  </div>
                </div>

                <Button
                  onClick={() => setGlobalAnonymous(prev => ({ ...prev, enabled: false }))}
                  variant="destructive"
                  className="w-full"
                >
                  Disable Global Anonymous Mode
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select
                      value={globalAnonymous.duration}
                      onValueChange={(value) => setGlobalAnonymous(prev => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2h">2 Hours</SelectItem>
                        <SelectItem value="24h">24 Hours</SelectItem>
                        <SelectItem value="72h">72 Hours</SelectItem>
                        <SelectItem value="168h">1 Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Current Status</Label>
                    <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                      Disabled
                    </div>
                  </div>
                </div>

                <AlertDialog open={isGlobalDialogOpen} onOpenChange={setIsGlobalDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Enable Global Anonymous Mode
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Enable Global Anonymous Mode?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will hide ALL participants from resort administrators across the entire platform.
                        This is a significant privacy action that affects all resorts.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="global-reason">Reason for enabling *</Label>
                        <Textarea
                          id="global-reason"
                          value={newReason}
                          onChange={(e) => setNewReason(e.target.value)}
                          placeholder="Please provide a detailed reason for this action..."
                          rows={3}
                        />
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-yellow-800">
                            <div className="font-medium">Impact:</div>
                            <ul className="mt-1 space-y-1">
                              <li>• Resort administrators will only see aggregate data</li>
                              <li>• Individual participant profiles will be hidden</li>
                              <li>• Event leaderboards will show anonymous entries</li>
                              <li>• Duration: {globalAnonymous.duration}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleGlobalAnonymousToggle}
                        disabled={!newReason.trim()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Enable Anonymous Mode
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Resort/Event Specific Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Resort & Event Visibility Rules</CardTitle>
            <CardDescription>
              Configure visibility settings for individual resorts and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visibilityRules.map((rule, index) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`border rounded-lg p-4 transition-colors ${
                    pendingChanges.has(rule.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{rule.resortName}</h4>
                          {rule.eventName && (
                            <p className="text-sm text-gray-600">Event: {rule.eventName}</p>
                          )}
                        </div>
                        
                        <Badge className={rule.participantsVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {rule.participantsVisible ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Visible
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Hidden
                            </>
                          )}
                        </Badge>

                        <Badge variant="outline">
                          {rule.affectedUsers.toLocaleString()} users
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Reason:</strong> {rule.reason}</p>
                        <p><strong>Last changed:</strong> {formatDateTime(rule.lastChanged)} by {rule.changedBy}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm text-gray-600">
                        <div>Participants visible</div>
                        <div>to resort admins</div>
                      </div>
                      
                      <Switch
                        checked={rule.participantsVisible}
                        onCheckedChange={(checked) => {
                          const reason = checked ? 'Standard visibility policy' : 
                                       prompt('Reason for hiding participants:') || rule.reason;
                          handleVisibilityToggle(rule.id, checked, reason);
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Policy Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-blue-900">
              <div className="font-medium mb-2">Visibility Policy Guidelines</div>
              <div className="text-sm space-y-1 text-blue-800">
                <p>• <strong>Visible:</strong> Resort administrators can see individual participant names, profiles, and detailed metrics</p>
                <p>• <strong>Hidden:</strong> Resort administrators only see aggregate statistics and anonymous participant data</p>
                <p>• <strong>Global Anonymous Mode:</strong> Overrides all individual settings and hides participants platform-wide</p>
                <p>• <strong>User Control:</strong> Individual users can always opt out of data sharing regardless of these settings</p>
                <p>• <strong>Audit Trail:</strong> All visibility changes are logged and can be reviewed in the audit log</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}