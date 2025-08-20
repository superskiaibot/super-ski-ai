import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit,
  Trash2,
  Mountain,
  MapPin,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  UserPlus,
  Settings,
  Eye,
  Filter,
  Download,
  Calendar,
  Activity
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { User as UserType } from '../../src/types/index';

interface SkiFieldAdminManagementProps {
  currentUser: UserType;
}

interface SkiFieldAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedResorts: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  createdAt: Date;
  permissions: string[];
  notes?: string;
}

interface Resort {
  id: string;
  name: string;
  location: string;
  status: 'operational' | 'closed' | 'maintenance';
}

// Mock data for demonstration
const MOCK_RESORTS: Resort[] = [
  { id: 'coronet-peak', name: 'Coronet Peak', location: 'Queenstown, South Island', status: 'operational' },
  { id: 'the-remarkables', name: 'The Remarkables', location: 'Queenstown, South Island', status: 'operational' },
  { id: 'cardrona', name: 'Cardrona Alpine Resort', location: 'Wānaka, South Island', status: 'operational' },
  { id: 'treble-cone', name: 'Treble Cone', location: 'Wānaka, South Island', status: 'operational' },
  { id: 'mt-hutt', name: 'Mt Hutt', location: 'Canterbury, South Island', status: 'operational' },
  { id: 'porters', name: 'Porters Ski Area', location: 'Canterbury, South Island', status: 'maintenance' },
  { id: 'craigieburn', name: 'Craigieburn', location: 'Canterbury, South Island', status: 'operational' },
  { id: 'turoa', name: 'Turoa', location: 'Ohakune, North Island', status: 'operational' },
  { id: 'whakapapa', name: 'Whakapapa', location: 'Taupo, North Island', status: 'operational' },
  { id: 'manganui', name: 'Manganui', location: 'Taranaki, North Island', status: 'closed' },
];

const MOCK_SKI_FIELD_ADMINS: SkiFieldAdmin[] = [
  {
    id: 'admin-1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@coronetpeak.co.nz',
    phone: '+64 3 442 4620',
    assignedResorts: ['coronet-peak', 'the-remarkables'],
    status: 'active',
    lastLogin: new Date('2024-01-20T08:30:00'),
    createdAt: new Date('2023-08-15T10:00:00'),
    permissions: ['lift-operations', 'weather-station', 'staff-management', 'visitor-services'],
    notes: 'Senior administrator with extensive mountain operations experience.'
  },
  {
    id: 'admin-2',
    name: 'James Thompson',
    email: 'james.thompson@cardrona.com',
    phone: '+64 3 443 7341',
    assignedResorts: ['cardrona'],
    status: 'active',
    lastLogin: new Date('2024-01-19T14:15:00'),
    createdAt: new Date('2023-09-22T09:30:00'),
    permissions: ['lift-operations', 'weather-station', 'visitor-services'],
    notes: 'Specializes in family-friendly resort operations and safety protocols.'
  },
  {
    id: 'admin-3',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@mthutt.co.nz',
    phone: '+64 3 302 8811',
    assignedResorts: ['mt-hutt', 'porters'],
    status: 'active',
    lastLogin: new Date('2024-01-20T07:45:00'),
    createdAt: new Date('2023-07-10T11:20:00'),
    permissions: ['lift-operations', 'weather-station', 'staff-management', 'safety-protocols'],
    notes: 'Expert in Canterbury region operations and weather monitoring systems.'
  },
  {
    id: 'admin-4',
    name: 'Michael Chen',
    email: 'michael.chen@treblecone.com',
    phone: '+64 3 443 7443',
    assignedResorts: ['treble-cone'],
    status: 'inactive',
    lastLogin: new Date('2024-01-10T16:20:00'),
    createdAt: new Date('2023-11-05T13:45:00'),
    permissions: ['lift-operations', 'weather-station'],
    notes: 'Currently on leave. Access temporarily suspended.'
  },
  {
    id: 'admin-5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@ruapehu.co.nz',
    phone: '+64 7 892 4000',
    assignedResorts: ['turoa', 'whakapapa'],
    status: 'active',
    lastLogin: new Date('2024-01-20T09:10:00'),
    createdAt: new Date('2023-06-18T08:15:00'),
    permissions: ['lift-operations', 'weather-station', 'staff-management', 'visitor-services', 'safety-protocols'],
    notes: 'North Island operations coordinator with volcanic terrain expertise.'
  },
  {
    id: 'admin-6',
    name: 'David Kumar',
    email: 'david.kumar@craigieburn.co.nz',
    phone: '+64 3 318 8711',
    assignedResorts: ['craigieburn'],
    status: 'suspended',
    lastLogin: new Date('2024-01-05T12:30:00'),
    createdAt: new Date('2023-10-12T14:00:00'),
    permissions: ['lift-operations'],
    notes: 'Account suspended pending investigation. Limited access only.'
  },
  {
    id: 'admin-7',
    name: 'Rebecca Taylor',
    email: 'rebecca.taylor@manganui.co.nz',
    phone: '+64 6 759 1144',
    assignedResorts: ['manganui'],
    status: 'inactive',
    lastLogin: new Date('2023-12-15T11:00:00'),
    createdAt: new Date('2023-05-03T16:30:00'),
    permissions: ['weather-station', 'maintenance'],
    notes: 'Seasonal administrator for smaller North Island operations.'
  },
  {
    id: 'admin-8',
    name: 'Tom Wilson',
    email: 'tom.wilson@porters.co.nz',
    phone: '+64 3 318 4002',
    assignedResorts: ['porters'],
    status: 'active',
    lastLogin: new Date('2024-01-19T15:45:00'),
    createdAt: new Date('2023-12-01T10:15:00'),
    permissions: ['lift-operations', 'weather-station', 'maintenance'],
    notes: 'New administrator focusing on equipment maintenance and weather systems.'
  }
];

const PERMISSION_LABELS = {
  'lift-operations': 'Lift Operations',
  'weather-station': 'Weather Station',
  'staff-management': 'Staff Management',
  'visitor-services': 'Visitor Services',
  'safety-protocols': 'Safety Protocols',
  'maintenance': 'Maintenance',
  'pricing': 'Pricing & Tickets',
  'analytics': 'Analytics & Reports'
};

export function SkiFieldAdminManagement({ currentUser }: SkiFieldAdminManagementProps) {
  const [admins, setAdmins] = useState<SkiFieldAdmin[]>(MOCK_SKI_FIELD_ADMINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [resortFilter, setResortFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SkiFieldAdmin | null>(null);

  // New admin form state
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    assignedResorts: [] as string[],
    permissions: [] as string[],
    notes: ''
  });

  // Filter admins based on search and filters
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;
    const matchesResort = resortFilter === 'all' || 
                         admin.assignedResorts.some(resortId => resortId === resortFilter);
    
    return matchesSearch && matchesStatus && matchesResort;
  });

  const getStatusBadge = (status: SkiFieldAdmin['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: SkiFieldAdmin['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      case 'suspended':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getResortName = (resortId: string) => {
    const resort = MOCK_RESORTS.find(r => r.id === resortId);
    return resort ? resort.name : resortId;
  };

  const handleCreateAdmin = () => {
    const admin: SkiFieldAdmin = {
      id: `admin-${Date.now()}`,
      ...newAdmin,
      status: 'active',
      lastLogin: new Date(),
      createdAt: new Date(),
    };
    
    setAdmins(prev => [admin, ...prev]);
    setShowCreateDialog(false);
    setNewAdmin({
      name: '',
      email: '',
      phone: '',
      assignedResorts: [],
      permissions: [],
      notes: ''
    });
  };

  const handleEditAdmin = (admin: SkiFieldAdmin) => {
    setSelectedAdmin(admin);
    setNewAdmin({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      assignedResorts: admin.assignedResorts,
      permissions: admin.permissions,
      notes: admin.notes || ''
    });
    setShowEditDialog(true);
  };

  const handleUpdateAdmin = () => {
    if (!selectedAdmin) return;
    
    setAdmins(prev => prev.map(admin => 
      admin.id === selectedAdmin.id 
        ? { ...admin, ...newAdmin }
        : admin
    ));
    
    setShowEditDialog(false);
    setSelectedAdmin(null);
    setNewAdmin({
      name: '',
      email: '',
      phone: '',
      assignedResorts: [],
      permissions: [],
      notes: ''
    });
  };

  const handleDeleteAdmin = () => {
    if (!selectedAdmin) return;
    
    setAdmins(prev => prev.filter(admin => admin.id !== selectedAdmin.id));
    setShowDeleteDialog(false);
    setSelectedAdmin(null);
  };

  const adminStats = {
    total: admins.length,
    active: admins.filter(a => a.status === 'active').length,
    inactive: admins.filter(a => a.status === 'inactive').length,
    suspended: admins.filter(a => a.status === 'suspended').length
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Ski Field Admin Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage resort administrators and their permissions across all ski fields
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-primary hover:bg-primary/90 shadow-sm"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Admin
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{adminStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{adminStats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{adminStats.inactive}</p>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{adminStats.suspended}</p>
                <p className="text-sm text-muted-foreground">Suspended</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="snowline-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resortFilter} onValueChange={setResortFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by resort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resorts</SelectItem>
                {MOCK_RESORTS.map(resort => (
                  <SelectItem key={resort.id} value={resort.id}>
                    {resort.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admins List */}
      <div className="space-y-4">
        {filteredAdmins.map((admin) => (
          <Card key={admin.id} className="snowline-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{admin.name}</h3>
                      {getStatusBadge(admin.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{admin.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{admin.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Last login: {admin.lastLogin.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2 text-muted-foreground">
                          <Mountain className="w-4 h-4 mt-0.5" />
                          <div>
                            <div className="font-medium text-foreground">Assigned Resorts:</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {admin.assignedResorts.map(resortId => (
                                <Badge key={resortId} variant="outline" className="text-xs">
                                  {getResortName(resortId)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2 text-muted-foreground">
                          <Settings className="w-4 h-4 mt-0.5" />
                          <div>
                            <div className="font-medium text-foreground">Permissions:</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {admin.permissions.map(permission => (
                                <Badge key={permission} variant="secondary" className="text-xs">
                                  {PERMISSION_LABELS[permission] || permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {admin.notes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">{admin.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditAdmin(admin)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Activity className="w-4 h-4 mr-2" />
                      View Activity Log
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setShowDeleteDialog(true);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Admin
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Admin Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Ski Field Admin</DialogTitle>
            <DialogDescription>
              Add a new administrator and assign them to ski fields with specific permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@resort.co.nz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+64 3 xxx xxxx"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Assigned Resorts</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {MOCK_RESORTS.map(resort => (
                  <label key={resort.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdmin.assignedResorts.includes(resort.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewAdmin(prev => ({ 
                            ...prev, 
                            assignedResorts: [...prev.assignedResorts, resort.id] 
                          }));
                        } else {
                          setNewAdmin(prev => ({ 
                            ...prev, 
                            assignedResorts: prev.assignedResorts.filter(id => id !== resort.id) 
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{resort.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                  <label key={key} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdmin.permissions.includes(key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewAdmin(prev => ({ 
                            ...prev, 
                            permissions: [...prev.permissions, key] 
                          }));
                        } else {
                          setNewAdmin(prev => ({ 
                            ...prev, 
                            permissions: prev.permissions.filter(p => p !== key) 
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={newAdmin.notes}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this administrator..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAdmin} disabled={!newAdmin.name || !newAdmin.email}>
              Create Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Ski Field Admin</DialogTitle>
            <DialogDescription>
              Update administrator information and permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@resort.co.nz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+64 3 xxx xxxx"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Assigned Resorts</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {MOCK_RESORTS.map(resort => (
                  <label key={resort.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdmin.assignedResorts.includes(resort.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewAdmin(prev => ({ 
                            ...prev, 
                            assignedResorts: [...prev.assignedResorts, resort.id] 
                          }));
                        } else {
                          setNewAdmin(prev => ({ 
                            ...prev, 
                            assignedResorts: prev.assignedResorts.filter(id => id !== resort.id) 
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{resort.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                  <label key={key} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdmin.permissions.includes(key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewAdmin(prev => ({ 
                            ...prev, 
                            permissions: [...prev.permissions, key] 
                          }));
                        } else {
                          setNewAdmin(prev => ({ 
                            ...prev, 
                            permissions: prev.permissions.filter(p => p !== key) 
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Textarea
                id="edit-notes"
                value={newAdmin.notes}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this administrator..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAdmin} disabled={!newAdmin.name || !newAdmin.email}>
              Update Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Admin Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Ski Field Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedAdmin?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAdmin}>
              Delete Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}