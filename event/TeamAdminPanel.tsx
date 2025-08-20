import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Crown, 
  Settings, 
  Share2, 
  Edit,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Trophy,
  Target,
  Heart,
  Mountain,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Award,
  Camera,
  Palette,
  Link,
  Download,
  Eye,
  Plus,
  MoreVertical,
  Shield
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
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

interface TeamMember {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalVertical: number;
  totalRuns: number;
  fundraised: number;
  isActive: boolean;
  lastActivity: string;
  role: 'admin' | 'member';
}

interface TeamStats {
  totalVertical: number;
  totalMembers: number;
  activeMembers: number;
  totalFundraised: number;
  fundraisingTarget: number;
  teamRank: number;
  averageVertical: number;
}

interface TeamAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  teamData: {
    name: string;
    description: string;
    logo?: string;
    website?: string;
    createdDate: string;
    stats: TeamStats;
    members: TeamMember[];
  };
}

export function TeamAdminPanel({ isOpen, onClose, teamData }: TeamAdminPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCustomizePage, setShowCustomizePage] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  const [teamSettings, setTeamSettings] = useState({
    name: teamData.name,
    description: teamData.description,
    website: teamData.website || '',
    isPublic: true,
    allowJoinRequests: true,
    showMemberList: true,
    teamColor: '#3b82f6'
  });

  const stats = teamData.stats;
  const fundraisingProgress = (stats.totalFundraised / stats.fundraisingTarget) * 100;

  const handleAddMember = () => {
    if (newMemberEmail) {
      // In real app, this would send an invitation
      console.log('Inviting member:', newMemberEmail);
      setNewMemberEmail('');
      setShowAddMember(false);
    }
  };

  const handleRemoveMember = (member: TeamMember) => {
    // In real app, this would remove the member
    console.log('Removing member:', member.name);
  };

  const handlePromoteToAdmin = (member: TeamMember) => {
    // In real app, this would promote member to admin
    console.log('Promoting to admin:', member.name);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-7xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Team Admin Panel</h1>
                <p className="text-green-100">Ski For A Cure NZ - {teamData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={() => setShowCustomizePage(true)}
              >
                <Palette className="w-4 h-4 mr-2" />
                Customize Page
              </Button>
              <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
                ×
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-100px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="fundraising">Fundraising</TabsTrigger>
              <TabsTrigger value="page">Team Page</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Team Vertical</p>
                        <p className="text-2xl font-bold text-green-600">
                          {stats.totalVertical.toLocaleString()}m
                        </p>
                      </div>
                      <Mountain className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Team Members</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalMembers}</p>
                        <p className="text-xs text-gray-500">{stats.activeMembers} active</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Fundraised</p>
                        <p className="text-2xl font-bold text-purple-600">
                          ${stats.totalFundraised.toLocaleString()}
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
                        <p className="text-sm text-gray-600">Team Rank</p>
                        <p className="text-2xl font-bold text-orange-600">#{stats.teamRank}</p>
                      </div>
                      <Trophy className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Team Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Vertical per Member</span>
                        <span className="font-bold text-green-600">
                          {Math.round(stats.averageVertical).toLocaleString()}m
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Team Activity Rate</span>
                        <span className="font-bold text-blue-600">
                          {Math.round((stats.activeMembers / stats.totalMembers) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Fundraising Progress</span>
                        <span className="font-bold text-purple-600">
                          {fundraisingProgress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={fundraisingProgress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamData.members
                        .sort((a, b) => b.totalVertical - a.totalVertical)
                        .slice(0, 5)
                        .map((member, index) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={index === 0 ? "default" : "secondary"}
                                className={index === 0 ? "bg-yellow-500" : ""}
                              >
                                #{index + 1}
                              </Badge>
                              <span className="text-sm font-medium">{member.name}</span>
                              {member.role === 'admin' && (
                                <Crown className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <span className="text-sm font-bold text-green-600">
                              {member.totalVertical.toLocaleString()}m
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button onClick={() => setShowAddMember(true)} className="h-20 flex-col gap-2">
                      <UserPlus className="w-6 h-6" />
                      <span className="text-sm">Add Member</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Share2 className="w-6 h-6" />
                      <span className="text-sm">Share Team</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Download className="w-6 h-6" />
                      <span className="text-sm">Export Data</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2"
                      onClick={() => setShowCustomizePage(true)}
                    >
                      <Palette className="w-6 h-6" />
                      <span className="text-sm">Customize</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Team Members</h3>
                  <p className="text-sm text-gray-600">Manage your team roster and permissions</p>
                </div>
                <Button onClick={() => setShowAddMember(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>

              <div className="grid gap-4">
                {teamData.members.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-green-600">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{member.name}</p>
                              {member.role === 'admin' && (
                                <Badge variant="secondary" className="text-xs">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                              <Badge 
                                variant={member.isActive ? "default" : "secondary"}
                                className={`text-xs ${member.isActive ? 'bg-green-500' : 'bg-gray-500'}`}
                              >
                                {member.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <p className="text-xs text-gray-500">
                              Joined {member.joinDate} • Last active {member.lastActivity}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-bold text-green-600">
                              {member.totalVertical.toLocaleString()}m
                            </p>
                            <p className="text-xs text-gray-600">
                              {member.totalRuns} runs
                            </p>
                            <p className="text-xs text-purple-600">
                              ${member.fundraised} raised
                            </p>
                          </div>
                          
                          {member.role !== 'admin' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handlePromoteToAdmin(member)}>
                                  <Crown className="w-4 h-4 mr-2" />
                                  Promote to Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleRemoveMember(member)}
                                >
                                  <UserMinus className="w-4 h-4 mr-2" />
                                  Remove Member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Team Vertical Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {stats.totalVertical.toLocaleString()}m
                      </div>
                      <div className="text-sm text-gray-600">
                        Total team vertical descent
                      </div>
                    </div>
                    <div className="space-y-3">
                      {teamData.members
                        .sort((a, b) => b.totalVertical - a.totalVertical)
                        .map((member, index) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <span className="text-sm">{member.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ 
                                    width: `${(member.totalVertical / Math.max(...teamData.members.map(m => m.totalVertical))) * 100}%` 
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium w-16 text-right">
                                {member.totalVertical.toLocaleString()}m
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Fundraising Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        ${stats.totalFundraised.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        of ${stats.fundraisingTarget.toLocaleString()} target ({fundraisingProgress.toFixed(1)}%)
                      </div>
                      <Progress value={fundraisingProgress} className="h-3" />
                    </div>
                    <div className="space-y-3">
                      {teamData.members
                        .sort((a, b) => b.fundraised - a.fundraised)
                        .map((member, index) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <span className="text-sm">{member.name}</span>
                            <span className="text-sm font-medium text-purple-600">
                              ${member.fundraised.toLocaleString()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Team Progress</CardTitle>
                  <CardDescription>Track your team's collective progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Team progress chart would be displayed here</p>
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
                      Team Fundraising Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button className="w-full" size="lg">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Team Page
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Team Story
                      </Button>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Recent Team Donations</h4>
                      <div className="space-y-3">
                        {[
                          { donor: 'Local Business Co.', amount: 500, member: 'Team General', date: '1 hour ago' },
                          { donor: 'Jennifer Smith', amount: 100, member: 'Alex Chen', date: '3 hours ago' },
                          { donor: 'Mike Johnson', amount: 75, member: 'Sarah Wilson', date: '1 day ago' },
                        ].map((donation, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">{donation.donor}</p>
                              <p className="text-sm text-gray-600">
                                Supporting {donation.member} • {donation.date}
                              </p>
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
                    <CardTitle>Fundraising Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600">Total Raised</p>
                      <p className="text-2xl font-bold text-purple-700">
                        ${stats.totalFundraised.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Team Target</p>
                      <p className="text-2xl font-bold text-blue-700">
                        ${stats.fundraisingTarget.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Progress</p>
                      <p className="text-2xl font-bold text-green-700">
                        {fundraisingProgress.toFixed(0)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="page" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Team Page Customization
                  </CardTitle>
                  <CardDescription>
                    Customize your team's public page to showcase your mission and progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input
                          id="teamName"
                          value={teamSettings.name}
                          onChange={(e) => setTeamSettings(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="teamDescription">Team Description</Label>
                        <Textarea
                          id="teamDescription"
                          value={teamSettings.description}
                          onChange={(e) => setTeamSettings(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="teamWebsite">Team Website</Label>
                        <Input
                          id="teamWebsite"
                          value={teamSettings.website}
                          onChange={(e) => setTeamSettings(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://your-team-website.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="teamColor">Theme Color</Label>
                        <div className="flex items-center gap-3 mt-2">
                          <input
                            type="color"
                            id="teamColor"
                            value={teamSettings.teamColor}
                            onChange={(e) => setTeamSettings(prev => ({ ...prev, teamColor: e.target.value }))}
                            className="w-12 h-10 rounded border"
                          />
                          <Input
                            value={teamSettings.teamColor}
                            onChange={(e) => setTeamSettings(prev => ({ ...prev, teamColor: e.target.value }))}
                            placeholder="#3b82f6"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Team Logo</Label>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          {teamData.logo ? (
                            <div className="flex flex-col items-center gap-3">
                              <img src={teamData.logo} alt="Team logo" className="w-20 h-20 object-cover rounded-lg" />
                              <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Change Logo
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-3">
                              <Upload className="w-12 h-12 text-gray-400" />
                              <div>
                                <Button variant="outline">Upload Team Logo</Button>
                                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 2MB</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Page Settings</Label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Public Team Page</p>
                              <p className="text-sm text-gray-600">Allow public viewing of team page</p>
                            </div>
                            <Switch
                              checked={teamSettings.isPublic}
                              onCheckedChange={(checked) => setTeamSettings(prev => ({ ...prev, isPublic: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Show Member List</p>
                              <p className="text-sm text-gray-600">Display team members publicly</p>
                            </div>
                            <Switch
                              checked={teamSettings.showMemberList}
                              onCheckedChange={(checked) => setTeamSettings(prev => ({ ...prev, showMemberList: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Allow Join Requests</p>
                              <p className="text-sm text-gray-600">Let people request to join your team</p>
                            </div>
                            <Switch
                              checked={teamSettings.allowJoinRequests}
                              onCheckedChange={(checked) => setTeamSettings(prev => ({ ...prev, allowJoinRequests: checked }))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Page
                    </Button>
                    <Button className="flex-1">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Team Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Team Management</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Team Privacy</Label>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="privacy" value="public" defaultChecked />
                            <span className="text-sm">Public - Anyone can view and join</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="privacy" value="invite" />
                            <span className="text-sm">Invite Only - Admin approval required</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="privacy" value="private" />
                            <span className="text-sm">Private - Hidden from public</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <Label>Member Permissions</Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Members can invite others</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Members can edit team page</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Members can post updates</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold text-red-600">Danger Zone</h4>
                    
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <h5 className="font-medium text-red-800 mb-2">Transfer Team Ownership</h5>
                      <p className="text-sm text-red-700 mb-3">
                        Transfer admin rights to another team member. You will become a regular member.
                      </p>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700">
                        Transfer Ownership
                      </Button>
                    </div>

                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <h5 className="font-medium text-red-800 mb-2">Delete Team</h5>
                      <p className="text-sm text-red-700 mb-3">
                        Permanently delete this team and all associated data. This action cannot be undone.
                      </p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete Team
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Team</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this team? This will permanently remove all team data,
                              member associations, and cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                              Delete Team
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      {/* Add Member Dialog */}
      {showAddMember && (
        <div className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Team Member</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddMember(false)}>
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="memberEmail">Email Address</Label>
                <Input
                  id="memberEmail"
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Enter member's email"
                />
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowAddMember(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddMember} className="flex-1">
                  Send Invitation
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}