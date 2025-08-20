import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Target, 
  TrendingUp, 
  Heart, 
  Trophy, 
  Settings, 
  Share2, 
  Download,
  Edit,
  Mountain,
  Timer,
  Zap,
  Award,
  Calendar,
  BarChart3,
  DollarSign,
  Camera,
  Instagram,
  Facebook,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

interface IndividualStats {
  totalVertical: number;
  totalRuns: number;
  totalTime: number;
  averageSpeed: number;
  fundraised: number;
  target: number;
  donations: number;
  rank: number;
  personalBest: number;
}

interface IndividualAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  participantData: {
    name: string;
    email: string;
    joinDate: string;
    stats: IndividualStats;
  };
}

export function IndividualAdminPanel({ isOpen, onClose, participantData }: IndividualAdminPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [profileSettings, setProfileSettings] = useState({
    displayName: participantData.name,
    bio: '',
    isPublic: true,
    showLocation: true,
    allowMessages: true
  });

  const stats = participantData.stats;
  const verticalProgress = (stats.totalVertical / 10000) * 100; // Assuming 10km target
  const fundraisingProgress = (stats.fundraised / stats.target) * 100;

  const recentActivity = [
    { date: '2025-01-18', vertical: 1240, runs: 8, duration: 180, resort: 'Coronet Peak' },
    { date: '2025-01-17', vertical: 980, runs: 6, duration: 145, resort: 'The Remarkables' },
    { date: '2025-01-16', vertical: 1560, runs: 10, duration: 220, resort: 'Cardrona' },
    { date: '2025-01-15', vertical: 820, runs: 5, duration: 120, resort: 'Treble Cone' },
  ];

  const achievements = [
    { title: 'First 1000m', description: 'Reached 1000m vertical descent', date: '2025-01-15', icon: Mountain },
    { title: 'Speed Demon', description: 'Achieved 60+ km/h speed', date: '2025-01-16', icon: Zap },
    { title: 'Consistency King', description: '5 days in a row skiing', date: '2025-01-18', icon: Calendar },
    { title: 'Fundraising Hero', description: 'Raised $500 for charity', date: '2025-01-17', icon: Heart },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Individual Admin Panel</h1>
                <p className="text-blue-100">Ski For A Cure NZ - {participantData.name}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
              ×
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-100px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="fundraising">Fundraising</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Vertical</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalVertical}m</p>
                      </div>
                      <Mountain className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Runs</p>
                        <p className="text-2xl font-bold text-green-600">{stats.totalRuns}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Fundraised</p>
                        <p className="text-2xl font-bold text-purple-600">
                          ${stats.fundraised.toLocaleString()}
                        </p>
                      </div>
                      <Heart className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Leaderboard</p>
                        <p className="text-2xl font-bold text-orange-600">#{stats.rank}</p>
                      </div>
                      <Trophy className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Mountain className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{activity.resort}</p>
                            <p className="text-sm text-gray-600">{activity.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{activity.vertical}m</p>
                          <p className="text-sm text-gray-600">{activity.runs} runs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => {
                      const Icon = achievement.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{achievement.title}</p>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {achievement.date}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vertical Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Vertical Descent Progress
                    </CardTitle>
                    <CardDescription>Track your vertical meters toward the 10km goal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {stats.totalVertical.toLocaleString()}m
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        of 10,000m target ({verticalProgress.toFixed(1)}%)
                      </div>
                      <Progress value={verticalProgress} className="h-3" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Personal Best</p>
                        <p className="text-lg font-bold text-green-600">{stats.personalBest}m</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Average per Run</p>
                        <p className="text-lg font-bold text-orange-600">
                          {Math.round(stats.totalVertical / stats.totalRuns)}m
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fundraising Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Fundraising Progress
                    </CardTitle>
                    <CardDescription>Your contribution to the charity cause</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        ${stats.fundraised.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        of ${stats.target.toLocaleString()} target ({fundraisingProgress.toFixed(1)}%)
                      </div>
                      <Progress value={fundraisingProgress} className="h-3" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Donations</p>
                        <p className="text-lg font-bold text-green-600">{stats.donations}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Average Donation</p>
                        <p className="text-lg font-bold text-blue-600">
                          ${Math.round(stats.fundraised / stats.donations)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>Your vertical descent over the past weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart visualization would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fundraising" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Fundraising Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Fundraising Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button className="w-full" size="lg">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Fundraising Page
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Fundraising Story
                      </Button>
                    </div>

                    {/* Recent Donations */}
                    <div>
                      <h4 className="font-semibold mb-3">Recent Donations</h4>
                      <div className="space-y-3">
                        {[
                          { name: 'Sarah Johnson', amount: 50, message: 'Go team! Great cause.', date: '2 hours ago' },
                          { name: 'Mike Chen', amount: 100, message: 'Amazing effort!', date: '1 day ago' },
                          { name: 'Anonymous', amount: 25, message: '', date: '2 days ago' },
                        ].map((donation, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">{donation.name}</p>
                              {donation.message && (
                                <p className="text-sm text-gray-600 italic">"{donation.message}"</p>
                              )}
                              <p className="text-xs text-gray-500">{donation.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">${donation.amount}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600">Total Raised</p>
                      <p className="text-2xl font-bold text-purple-700">${stats.fundraised}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Donors</p>
                      <p className="text-2xl font-bold text-blue-700">{stats.donations}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Target Progress</p>
                      <p className="text-2xl font-bold text-green-700">{fundraisingProgress.toFixed(0)}%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Social Sharing
                    </CardTitle>
                    <CardDescription>Share your progress and inspire others</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <Button variant="outline" className="flex flex-col gap-2 h-auto p-4">
                        <Instagram className="w-6 h-6 text-pink-500" />
                        <span className="text-xs">Instagram</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col gap-2 h-auto p-4">
                        <Facebook className="w-6 h-6 text-blue-500" />
                        <span className="text-xs">Facebook</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col gap-2 h-auto p-4">
                        <MessageSquare className="w-6 h-6 text-green-500" />
                        <span className="text-xs">WhatsApp</span>
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label htmlFor="shareMessage">Custom Message</Label>
                      <Textarea
                        id="shareMessage"
                        placeholder="Share your skiing story and motivation..."
                        className="mt-2"
                      />
                    </div>
                    
                    <Button className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      Create Progress Post
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                    <CardDescription>How others see your participation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {participantData.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{profileSettings.displayName}</p>
                          <p className="text-sm text-gray-600">Individual Participant</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Vertical Descent</p>
                          <p className="font-bold text-blue-600">{stats.totalVertical}m</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Fundraised</p>
                          <p className="font-bold text-purple-600">${stats.fundraised}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Public Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profileSettings.displayName}
                        onChange={(e) => setProfileSettings(prev => ({ ...prev, displayName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value={participantData.email} disabled />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileSettings.bio}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell others about your skiing journey..."
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Privacy Settings</h4>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Public Profile</p>
                        <p className="text-sm text-gray-600">Allow others to see your progress</p>
                      </div>
                      <Switch
                        checked={profileSettings.isPublic}
                        onCheckedChange={(checked) => setProfileSettings(prev => ({ ...prev, isPublic: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Location</p>
                        <p className="text-sm text-gray-600">Display your city/region on profile</p>
                      </div>
                      <Switch
                        checked={profileSettings.showLocation}
                        onCheckedChange={(checked) => setProfileSettings(prev => ({ ...prev, showLocation: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Allow Messages</p>
                        <p className="text-sm text-gray-600">Let other participants message you</p>
                      </div>
                      <Switch
                        checked={profileSettings.allowMessages}
                        onCheckedChange={(checked) => setProfileSettings(prev => ({ ...prev, allowMessages: checked }))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button className="flex-1">
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}