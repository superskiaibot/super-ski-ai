import React, { useState } from 'react';
import { 
  UserCheck, 
  Users, 
  Clock, 
  Calendar,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Edit,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  Badge as BadgeIcon,
  Briefcase,
  Shield,
  Activity,
  Zap,
  Coffee,
  Wrench,
  Building,
  RadioIcon as RadioIconLucide
} from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Input } from '../../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Switch } from '../../../ui/switch';
import { Progress } from '../../../ui/progress';
import { Separator } from '../../../ui/separator';
import { StaffCard } from '../components/StaffCard';
import { ResortData } from '../types';

interface StaffMember {
  id: string;
  name: string;
  department: string;
  position: string;
  status: 'on-duty' | 'off-duty' | 'break' | 'emergency';
  shiftStart: string;
  shiftEnd: string;
  location: string;
  phone: string;
  email: string;
  certifications: string[];
  emergencyContact: string;
  hoursThisWeek: number;
  performanceRating: number;
  avatar: string;
}

interface StaffManagementProps {
  resortData: ResortData;
}

export function StaffManagement({ resortData }: StaffManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Sample staff data
  const staffMembers: StaffMember[] = [
    {
      id: '1',
      name: 'Jake Thompson',
      department: 'Lift Operations',
      position: 'Senior Lift Operator',
      status: 'on-duty',
      shiftStart: '07:00',
      shiftEnd: '16:00',
      location: 'Express Quad',
      phone: '+64 27 123 4567',
      email: 'jake.t@coronetpeak.nz',
      certifications: ['Lift Operations Level 2', 'First Aid', 'Safety Certification'],
      emergencyContact: 'Sarah Thompson +64 27 123 4568',
      hoursThisWeek: 38,
      performanceRating: 4.8,
      avatar: 'JT'
    },
    {
      id: '2',
      name: 'Emma Rodriguez',
      department: 'Ski Patrol',
      position: 'Lead Ski Patroller',
      status: 'on-duty',
      shiftStart: '08:00',
      shiftEnd: '17:00',
      location: 'Upper Mountain',
      phone: '+64 27 234 5678',
      email: 'emma.r@coronetpeak.nz',
      certifications: ['Ski Patrol Level 3', 'EMT', 'Avalanche Rescue', 'Mountain Weather'],
      emergencyContact: 'Carlos Rodriguez +64 27 234 5679',
      hoursThisWeek: 42,
      performanceRating: 4.9,
      avatar: 'ER'
    },
    {
      id: '3',
      name: 'Mike Chen',
      department: 'Maintenance',
      position: 'Lead Mechanic',
      status: 'break',
      shiftStart: '06:00',
      shiftEnd: '15:00',
      location: 'Maintenance Shop',
      phone: '+64 27 345 6789',
      email: 'mike.c@coronetpeak.nz',
      certifications: ['Mechanical Engineering', 'Lift Maintenance', 'Safety Systems'],
      emergencyContact: 'Lisa Chen +64 27 345 6790',
      hoursThisWeek: 35,
      performanceRating: 4.7,
      avatar: 'MC'
    },
    {
      id: '4',
      name: 'Sophie Williams',
      department: 'Food & Beverage',
      position: 'Café Manager',
      status: 'on-duty',
      shiftStart: '07:30',
      shiftEnd: '16:30',
      location: 'Base Lodge Café',
      phone: '+64 27 456 7890',
      email: 'sophie.w@coronetpeak.nz',
      certifications: ['Food Safety', 'Manager Certification', 'Customer Service'],
      emergencyContact: 'James Williams +64 27 456 7891',
      hoursThisWeek: 40,
      performanceRating: 4.6,
      avatar: 'SW'
    },
    {
      id: '5',
      name: 'Alex Morrison',
      department: 'Administration',
      position: 'Operations Coordinator',
      status: 'on-duty',
      shiftStart: '08:00',
      shiftEnd: '17:00',
      location: 'Admin Office',
      phone: '+64 27 567 8901',
      email: 'alex.m@coronetpeak.nz',
      certifications: ['Business Management', 'Safety Coordination', 'Emergency Response'],
      emergencyContact: 'Taylor Morrison +64 27 567 8902',
      hoursThisWeek: 44,
      performanceRating: 4.8,
      avatar: 'AM'
    },
    {
      id: '6',
      name: 'Ben Parker',
      department: 'Maintenance',
      position: 'Snow Groomer Operator',
      status: 'off-duty',
      shiftStart: '22:00',
      shiftEnd: '06:00',
      location: 'Off Site',
      phone: '+64 27 678 9012',
      email: 'ben.p@coronetpeak.nz',
      certifications: ['Heavy Equipment', 'Snow Grooming', 'Mountain Safety'],
      emergencyContact: 'Kate Parker +64 27 678 9013',
      hoursThisWeek: 48,
      performanceRating: 4.5,
      avatar: 'BP'
    }
  ];

  // Department configurations with icons and colors
  const departments = [
    { 
      id: 'liftOps', 
      name: 'Lift Operations', 
      icon: Activity, 
      color: 'from-blue-500 to-blue-600',
      count: resortData.staff.departments.liftOps,
      description: 'Lift operators and maintenance'
    },
    { 
      id: 'patrol', 
      name: 'Ski Patrol', 
      icon: Shield, 
      color: 'from-red-500 to-red-600',
      count: resortData.staff.departments.patrol,
      description: 'Safety and emergency response'
    },
    { 
      id: 'maintenance', 
      name: 'Maintenance', 
      icon: Wrench, 
      color: 'from-orange-500 to-orange-600',
      count: resortData.staff.departments.maintenance,
      description: 'Equipment and facilities'
    },
    { 
      id: 'food', 
      name: 'Food & Beverage', 
      icon: Coffee, 
      color: 'from-green-500 to-green-600',
      count: resortData.staff.departments.food,
      description: 'Restaurant and lodge services'
    },
    { 
      id: 'admin', 
      name: 'Administration', 
      icon: Building, 
      color: 'from-purple-500 to-purple-600',
      count: resortData.staff.departments.admin,
      description: 'Management and coordination'
    }
  ];

  // Filter staff based on search and department
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || 
                             staff.department.toLowerCase().includes(selectedDepartment.toLowerCase());
    return matchesSearch && matchesDepartment;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Staff Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resortData.staff.total}</p>
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-xs text-blue-600 mt-1">All departments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resortData.staff.onDuty}</p>
                <p className="text-sm text-muted-foreground">On Duty</p>
                <p className="text-xs text-green-600 mt-1">
                  {Math.round((resortData.staff.onDuty / resortData.staff.total) * 100)}% coverage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">On Break</p>
                <p className="text-xs text-yellow-600 mt-1">Expected back soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Off Duty</p>
                <p className="text-xs text-purple-600 mt-1">Next shift starts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown */}
      <Card className="snowline-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>Department Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {departments.map((dept) => {
              const Icon = dept.icon;
              const onDutyCount = Math.floor(dept.count * 0.8);
              
              return (
                <div key={dept.id} className="p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${dept.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{dept.name}</h4>
                      <p className="text-xs text-muted-foreground">{dept.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">On Duty</span>
                      <span className="font-semibold">{onDutyCount}/{dept.count}</span>
                    </div>
                    <Progress value={(onDutyCount / dept.count) * 100} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Staff Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="snowline-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Jake Thompson - Shift Started</p>
                <p className="text-xs text-green-700">Express Quad operations</p>
                <p className="text-xs text-green-600 mt-1">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <UserCheck className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Emma Rodriguez - Check-in</p>
                <p className="text-xs text-blue-700">Patrol briefing completed</p>
                <p className="text-xs text-blue-600 mt-1">15 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <Coffee className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">Mike Chen - Break Started</p>
                <p className="text-xs text-yellow-700">15 minute break - returns 10:45 AM</p>
                <p className="text-xs text-yellow-600 mt-1">5 minutes ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Staff Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Understaffed - Maintenance</p>
                <p className="text-xs text-red-700">Need 1 additional mechanic for PM shift</p>
                <p className="text-xs text-red-600 mt-1">Active alert</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">Overtime Alert</p>
                <p className="text-xs text-yellow-700">Ben Parker approaching 50 hour limit</p>
                <p className="text-xs text-yellow-600 mt-1">Monitor required</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <BadgeIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Certification Renewal</p>
                <p className="text-xs text-blue-700">3 staff members due for renewal this month</p>
                <p className="text-xs text-blue-600 mt-1">Reminder active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStaffList = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search staff members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48 rounded-xl">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name.toLowerCase()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="rounded-xl">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid gap-4">
        {filteredStaff.map((staff) => (
          <StaffCard key={staff.id} staff={staff} />
        ))}
      </div>
    </div>
  );

  const renderScheduling = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Staff Scheduling</h3>
          <p className="text-muted-foreground">Manage shifts and coverage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export Schedule
          </Button>
          <Button className="rounded-xl">
            <Calendar className="w-4 h-4 mr-2" />
            Create Shift
          </Button>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <Card className="snowline-card">
        <CardHeader>
          <CardTitle>Current Week Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px] space-y-2">
              {/* Header */}
              <div className="grid grid-cols-8 gap-2 text-sm font-medium text-muted-foreground">
                <div className="p-3">Staff Member</div>
                <div className="p-2 text-center">Mon</div>
                <div className="p-2 text-center">Tue</div>
                <div className="p-2 text-center">Wed</div>
                <div className="p-2 text-center">Thu</div>
                <div className="p-2 text-center">Fri</div>
                <div className="p-2 text-center">Sat</div>
                <div className="p-2 text-center">Sun</div>
              </div>
              
              {/* Schedule Rows */}
              {staffMembers.slice(0, 5).map((staff) => (
                <div key={staff.id} className="grid grid-cols-8 gap-2 py-2 border-t border-border">
                  <div className="p-3 flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-xs font-semibold">
                      {staff.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{staff.name}</p>
                      <p className="text-xs text-muted-foreground">{staff.department}</p>
                    </div>
                  </div>
                  
                  {/* Days */}
                  {Array.from({ length: 7 }).map((_, dayIndex) => (
                    <div key={dayIndex} className="p-2">
                      <div className={`text-xs text-center py-1 px-2 rounded-lg ${
                        dayIndex < 5 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {dayIndex < 5 ? `${staff.shiftStart}-${staff.shiftEnd}` : 'Off'}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmergencyContacts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Emergency Contacts</h3>
          <p className="text-muted-foreground">Critical contact information and emergency protocols</p>
        </div>
        <Button className="rounded-xl">
          <Phone className="w-4 h-4 mr-2" />
          Emergency Call
        </Button>
      </div>

      {/* Emergency Contact Cards */}
      <div className="grid gap-4">
        {staffMembers.filter(staff => staff.status === 'on-duty' && 
          ['Ski Patrol', 'Administration', 'Lift Operations'].includes(staff.department)
        ).map((staff) => (
          <Card key={staff.id} className="snowline-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold ${
                    staff.department === 'Ski Patrol' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                    staff.department === 'Administration' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                    'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    {staff.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{staff.name}</h4>
                    <p className="text-sm text-muted-foreground">{staff.position}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{staff.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{staff.location}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                        {staff.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <RadioIconLucide className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emergency Protocols */}
      <Card className="snowline-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Emergency Protocols</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <h4 className="font-semibold text-red-800 mb-2">Medical Emergency</h4>
              <p className="text-sm text-red-700 mb-3">Immediate medical attention required</p>
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 rounded-lg">
                Call Emergency Services
              </Button>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h4 className="font-semibold text-yellow-800 mb-2">Lift Emergency</h4>
              <p className="text-sm text-yellow-700 mb-3">Lift evacuation or technical failure</p>
              <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700 rounded-lg">
                Contact Lift Operations
              </Button>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold text-blue-800 mb-2">Weather Alert</h4>
              <p className="text-sm text-blue-700 mb-3">Severe weather conditions</p>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg">
                Activate Weather Protocol
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Staff Management</h2>
          <p className="text-muted-foreground">Manage staff, schedules, and operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="rounded-xl">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="staff" className="text-sm">Staff List</TabsTrigger>
          <TabsTrigger value="scheduling" className="text-sm">Scheduling</TabsTrigger>
          <TabsTrigger value="emergency" className="text-sm">Emergency</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>
        
        <TabsContent value="staff" className="mt-6">
          {renderStaffList()}
        </TabsContent>
        
        <TabsContent value="scheduling" className="mt-6">
          {renderScheduling()}
        </TabsContent>
        
        <TabsContent value="emergency" className="mt-6">
          {renderEmergencyContacts()}
        </TabsContent>
      </Tabs>
    </div>
  );
}