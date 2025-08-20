import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
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
  Shield,
  Briefcase,
  DollarSign,
  Star,
  Zap,
  Gift,
  Megaphone,
  FileText,
  PieChart,
  Users2,
  Building
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

interface BusinessEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  joinDate: string;
  totalVertical: number;
  totalRuns: number;
  fundraised: number;
  isActive: boolean;
  lastActivity: string;
  role: 'admin' | 'manager' | 'employee';
  teamId?: string;
}

interface BusinessTeam {
  id: string;
  name: string;
  department: string;
  managerId: string;
  memberCount: number;
  totalVertical: number;
  totalFundraised: number;
  isActive: boolean;
}

interface BusinessStats {
  totalVertical: number;
  totalEmployees: number;
  activeEmployees: number;
  totalFundraised: number;
  fundraisingTarget: number;
  corporateRank: number;
  averageVertical: number;
  sponsorshipTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalTeams: number;
}

interface BusinessAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  businessData: {
    name: string;
    description: string;
    logo?: string;
    website?: string;
    industry: string;
    size: string;
    createdDate: string;
    stats: BusinessStats;
    employees: BusinessEmployee[];
    teams: BusinessTeam[];
  };
}

export function BusinessAdminPanel({ isOpen, onClose, businessData }: BusinessAdminPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<BusinessEmployee | null>(null);
  
  const [businessSettings, setBusinessSettings] = useState({
    name: businessData.name,
    description: businessData.description,
    website: businessData.website || '',
    industry: businessData.industry,
    isPublic: true,
    allowEmployeeInvites: true,
    showEmployeeList: true,
    corporateColor: '#7c3aed'
  });

  const stats = businessData.stats;
  const fundraisingProgress = (stats.totalFundraised / stats.fundraisingTarget) * 100;

  const sponsorshipBenefits = {
    Bronze: ['Basic company branding', 'Employee team creation', 'Progress tracking'],
    Silver: ['Enhanced branding', 'Priority support', 'Custom themes', 'Advanced analytics'],
    Gold: ['Premium branding', 'Dedicated success manager', 'API access', 'White-label options'],
    Platinum: ['Full custom branding', '24/7 support', 'Custom features', 'Executive reporting']
  };

  const handleAddEmployee = () => {
    if (newEmployeeEmail) {
      console.log('Inviting employee:', newEmployeeEmail);
      setNewEmployeeEmail('');
      setShowAddEmployee(false);
    }
  };

  const handleCreateTeam = () => {
    if (newTeamName) {
      console.log('Creating team:', newTeamName);
      setNewTeamName('');
      setShowCreateTeam(false);
    }
  };

  const handleRemoveEmployee = (employee: BusinessEmployee) => {
    console.log('Removing employee:', employee.name);
  };

  const handlePromoteEmployee = (employee: BusinessEmployee, role: 'manager' | 'admin') => {
    console.log('Promoting employee:', employee.name, 'to', role);
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
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Business Admin Console</h1>
                <p className="text-purple-100">Ski For A Cure NZ - {businessData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30">
                {stats.sponsorshipTier} Sponsor
              </Badge>
              <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
                ×
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-100px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="sponsorship">Sponsorship</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Vertical</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {stats.totalVertical.toLocaleString()}m
                        </p>
                      </div>
                      <Mountain className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Employees</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</p>
                        <p className="text-xs text-gray-500">{stats.activeEmployees} active</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Teams</p>
                        <p className="text-2xl font-bold text-green-600">{stats.totalTeams}</p>
                      </div>
                      <Users2 className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Fundraised</p>
                        <p className="text-2xl font-bold text-orange-600">
                          ${stats.totalFundraised.toLocaleString()}
                        </p>
                      </div>
                      <Heart className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Corp Rank</p>
                        <p className="text-2xl font-bold text-yellow-600">#{stats.corporateRank}</p>
                      </div>
                      <Trophy className="w-8 h-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Corporate Performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Corporate Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Employee Participation</span>
                        <span className="font-bold text-purple-600">
                          {Math.round((stats.activeEmployees / stats.totalEmployees) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Vertical per Employee</span>
                        <span className="font-bold text-blue-600">
                          {Math.round(stats.averageVertical).toLocaleString()}m
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Fundraising Progress</span>
                        <span className="font-bold text-orange-600">
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
                      <Award className="w-5 h-5" />
                      Sponsorship Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <Badge 
                        className={`text-lg px-4 py-2 ${
                          stats.sponsorshipTier === 'Platinum' ? 'bg-purple-100 text-purple-800' :
                          stats.sponsorshipTier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                          stats.sponsorshipTier === 'Silver' ? 'bg-gray-100 text-gray-800' :
                          'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {stats.sponsorshipTier} Sponsor
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {sponsorshipBenefits[stats.sponsorshipTier].map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade Sponsorship
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Department Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Department Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { dept: 'Sales', vertical: 15420, employees: 12, participation: 92 },
                      { dept: 'Marketing', vertical: 12380, employees: 8, participation: 87 },
                      { dept: 'Engineering', vertical: 18900, employees: 15, participation: 80 },
                      { dept: 'Operations', vertical: 9640, employees: 10, participation: 70 },
                    ].map((dept, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary">#{index + 1}</Badge>
                          <div>
                            <p className="font-medium">{dept.dept}</p>
                            <p className="text-sm text-gray-600">
                              {dept.employees} employees • {dept.participation}% participation
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">{dept.vertical.toLocaleString()}m</p>
                          <p className="text-sm text-gray-600">
                            {Math.round(dept.vertical / dept.employees)}m avg
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Corporate Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button onClick={() => setShowAddEmployee(true)} className="h-20 flex-col gap-2">
                      <UserPlus className="w-6 h-6" />
                      <span className="text-sm">Add Employee</span>
                    </Button>
                    <Button onClick={() => setShowCreateTeam(true)} variant="outline" className="h-20 flex-col gap-2">
                      <Plus className="w-6 h-6" />
                      <span className="text-sm">Create Team</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Share2 className="w-6 h-6" />
                      <span className="text-sm">Share Company</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <FileText className="w-6 h-6" />
                      <span className="text-sm">Generate Report</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employees" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Employee Management</h3>
                  <p className="text-sm text-gray-600">Manage your corporate team and permissions</p>
                </div>
                <Button onClick={() => setShowAddEmployee(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </div>

              <div className="grid gap-4">
                {businessData.employees.map((employee) => (
                  <Card key={employee.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-purple-600">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{employee.name}</p>
                              {employee.role === 'admin' && (
                                <Badge variant="secondary" className="text-xs">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                              {employee.role === 'manager' && (
                                <Badge variant="secondary" className="text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Manager
                                </Badge>
                              )}
                              <Badge 
                                variant={employee.isActive ? "default" : "secondary"}
                                className={`text-xs ${employee.isActive ? 'bg-green-500' : 'bg-gray-500'}`}
                              >
                                {employee.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{employee.email}</p>
                            <p className="text-xs text-gray-500">
                              {employee.department} • Joined {employee.joinDate} • Last active {employee.lastActivity}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-bold text-purple-600">
                              {employee.totalVertical.toLocaleString()}m
                            </p>
                            <p className="text-xs text-gray-600">
                              {employee.totalRuns} runs
                            </p>
                            <p className="text-xs text-orange-600">
                              ${employee.fundraised} raised
                            </p>
                          </div>
                          
                          {employee.role !== 'admin' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handlePromoteEmployee(employee, 'manager')}>
                                  <Shield className="w-4 h-4 mr-2" />
                                  Promote to Manager
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePromoteEmployee(employee, 'admin')}>
                                  <Crown className="w-4 h-4 mr-2" />
                                  Promote to Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleRemoveEmployee(employee)}
                                >
                                  <UserMinus className="w-4 h-4 mr-2" />
                                  Remove Employee
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

            <TabsContent value="teams" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Corporate Teams</h3>
                  <p className="text-sm text-gray-600">Organize employees into competitive teams</p>
                </div>
                <Button onClick={() => setShowCreateTeam(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessData.teams.map((team) => (
                  <Card key={team.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <Badge variant={team.isActive ? "default" : "secondary"}>
                          {team.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardDescription>{team.department}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Members</p>
                          <p className="font-bold text-blue-600">{team.memberCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Vertical</p>
                          <p className="font-bold text-purple-600">{team.totalVertical.toLocaleString()}m</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Fundraised</p>
                          <p className="font-bold text-orange-600">${team.totalFundraised.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Average</p>
                          <p className="font-bold text-green-600">
                            {Math.round(team.totalVertical / team.memberCount).toLocaleString()}m
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
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
                      Corporate Vertical Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {stats.totalVertical.toLocaleString()}m
                      </div>
                      <div className="text-sm text-gray-600">
                        Total corporate vertical descent
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Top Departments</h4>
                      {[
                        { dept: 'Engineering', vertical: 18900, color: 'bg-blue-500' },
                        { dept: 'Sales', vertical: 15420, color: 'bg-green-500' },
                        { dept: 'Marketing', vertical: 12380, color: 'bg-orange-500' },
                        { dept: 'Operations', vertical: 9640, color: 'bg-purple-500' }
                      ].map((dept, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                            <span className="text-sm">{dept.dept}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {dept.vertical.toLocaleString()}m
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Corporate Fundraising
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        ${stats.totalFundraised.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        of ${stats.fundraisingTarget.toLocaleString()} target ({fundraisingProgress.toFixed(1)}%)
                      </div>
                      <Progress value={fundraisingProgress} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-purple-600">Corporate Match</p>
                        <p className="font-bold text-purple-700">
                          ${Math.round(stats.totalFundraised * 0.5).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-600">Employee Donations</p>
                        <p className="font-bold text-blue-700">
                          ${Math.round(stats.totalFundraised * 0.5).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Corporate Analytics Dashboard</CardTitle>
                  <CardDescription>Comprehensive view of your organization's participation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Advanced analytics charts would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sponsorship" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Corporate Sponsorship
                  </CardTitle>
                  <CardDescription>
                    Maximize your impact and brand visibility through our sponsorship program
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {(['Bronze', 'Silver', 'Gold', 'Platinum'] as const).map((tier) => (
                      <Card key={tier} className={`${
                        stats.sponsorshipTier === tier ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                      }`}>
                        <CardHeader className="text-center">
                          <CardTitle className={`text-lg ${
                            tier === 'Platinum' ? 'text-purple-600' :
                            tier === 'Gold' ? 'text-yellow-600' :
                            tier === 'Silver' ? 'text-gray-600' :
                            'text-orange-600'
                          }`}>
                            {tier}
                          </CardTitle>
                          <CardDescription className="text-xl font-bold">
                            ${tier === 'Bronze' ? '5,000' : tier === 'Silver' ? '15,000' : tier === 'Gold' ? '50,000' : '100,000'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {sponsorshipBenefits[tier].map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                          {stats.sponsorshipTier === tier ? (
                            <Button disabled className="w-full mt-4">
                              Current Tier
                            </Button>
                          ) : (
                            <Button variant="outline" className="w-full mt-4">
                              Upgrade
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-4">Sponsorship Benefits & ROI</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Megaphone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-blue-600">Brand Exposure</p>
                        <p className="font-bold text-blue-700">50,000+ views</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-green-600">Social Impact</p>
                        <p className="font-bold text-green-700">Direct charity support</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm text-purple-600">Employee Engagement</p>
                        <p className="font-bold text-purple-700">85% participation</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Corporate Branding & Page Customization
                  </CardTitle>
                  <CardDescription>
                    Customize your company's presence in the Ski For A Cure event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={businessSettings.name}
                          onChange={(e) => setBusinessSettings(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="companyDescription">Company Description</Label>
                        <Textarea
                          id="companyDescription"
                          value={businessSettings.description}
                          onChange={(e) => setBusinessSettings(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="companyWebsite">Company Website</Label>
                        <Input
                          id="companyWebsite"
                          value={businessSettings.website}
                          onChange={(e) => setBusinessSettings(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://your-company.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          value={businessSettings.industry}
                          onChange={(e) => setBusinessSettings(prev => ({ ...prev, industry: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="corporateColor">Brand Color</Label>
                        <div className="flex items-center gap-3 mt-2">
                          <input
                            type="color"
                            id="corporateColor"
                            value={businessSettings.corporateColor}
                            onChange={(e) => setBusinessSettings(prev => ({ ...prev, corporateColor: e.target.value }))}
                            className="w-12 h-10 rounded border"
                          />
                          <Input
                            value={businessSettings.corporateColor}
                            onChange={(e) => setBusinessSettings(prev => ({ ...prev, corporateColor: e.target.value }))}
                            placeholder="#7c3aed"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Company Logo</Label>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          {businessData.logo ? (
                            <div className="flex flex-col items-center gap-3">
                              <img src={businessData.logo} alt="Company logo" className="w-24 h-24 object-cover rounded-lg" />
                              <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Change Logo
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-3">
                              <Upload className="w-12 h-12 text-gray-400" />
                              <div>
                                <Button variant="outline">Upload Company Logo</Button>
                                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                                <p className="text-xs text-gray-500">Recommended: 400x400px square</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label>Marketing Assets</Label>
                        <div className="mt-2 space-y-3">
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="w-4 h-4 mr-2" />
                            Download Event Graphics
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Camera className="w-4 h-4 mr-2" />
                            Social Media Kit
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <FileText className="w-4 h-4 mr-2" />
                            Press Release Template
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-4">Corporate Page Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Public Company Page</p>
                            <p className="text-sm text-gray-600">Allow public viewing of company participation</p>
                          </div>
                          <Switch
                            checked={businessSettings.isPublic}
                            onCheckedChange={(checked) => setBusinessSettings(prev => ({ ...prev, isPublic: checked }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Show Employee List</p>
                            <p className="text-sm text-gray-600">Display participating employees publicly</p>
                          </div>
                          <Switch
                            checked={businessSettings.showEmployeeList}
                            onCheckedChange={(checked) => setBusinessSettings(prev => ({ ...prev, showEmployeeList: checked }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Employee Invitations</p>
                            <p className="text-sm text-gray-600">Allow employees to invite colleagues</p>
                          </div>
                          <Switch
                            checked={businessSettings.allowEmployeeInvites}
                            onCheckedChange={(checked) => setBusinessSettings(prev => ({ ...prev, allowEmployeeInvites: checked }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Corporate Page
                    </Button>
                    <Button className="flex-1">
                      Save Branding Changes
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
                    Corporate Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Organization Management</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Employee Access Levels</Label>
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Employees can create teams</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Employees can invite external participants</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Employees can post corporate updates</span>
                            <Switch />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Data & Reporting</Label>
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Weekly progress reports</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Export employee data</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Anonymous participation data</span>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold text-red-600">Danger Zone</h4>
                    
                    <div className="space-y-4">
                      <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                        <h5 className="font-medium text-orange-800 mb-2">Transfer Corporate Account</h5>
                        <p className="text-sm text-orange-700 mb-3">
                          Transfer admin rights to another employee. You will lose admin access.
                        </p>
                        <Button variant="outline" size="sm" className="border-orange-300 text-orange-700">
                          Transfer Account
                        </Button>
                      </div>

                      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <h5 className="font-medium text-red-800 mb-2">Delete Corporate Account</h5>
                        <p className="text-sm text-red-700 mb-3">
                          Permanently delete your corporate participation and all employee data. This action cannot be undone.
                        </p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Delete Corporate Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Corporate Account</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete your corporate account? This will permanently remove all 
                                company data, employee associations, teams, and sponsorship records. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                Delete Corporate Account
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      {/* Add Employee Dialog */}
      {showAddEmployee && (
        <div className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Employee</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddEmployee(false)}>
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="employeeEmail">Employee Email Address</Label>
                <Input
                  id="employeeEmail"
                  type="email"
                  value={newEmployeeEmail}
                  onChange={(e) => setNewEmployeeEmail(e.target.value)}
                  placeholder="employee@company.com"
                />
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowAddEmployee(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddEmployee} className="flex-1">
                  Send Invitation
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Team Dialog */}
      {showCreateTeam && (
        <div className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Corporate Team</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateTeam(false)}>
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                />
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCreateTeam(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam} className="flex-1">
                  Create Team
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}