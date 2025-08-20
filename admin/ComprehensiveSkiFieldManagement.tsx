import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mountain,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  MapPin,
  Users,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  Settings,
  Eye,
  BarChart3,
  CloudSnow,
  Clock,
  Phone,
  Mail,
  Globe,
  Calendar,
  Zap,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Download,
  Upload,
  Database,
  Lock,
  Unlock,
  Shield
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User as UserType } from '../../src/types/index';
import { RoleService } from '../../src/utils/roleService';

interface ComprehensiveSkiFieldManagementProps {
  currentUser: UserType;
  onSelectSkiField?: (skiFieldId: string) => void;
}

interface SkiField {
  id: string;
  name: string;
  location: string;
  region: 'North Island' | 'South Island';
  status: 'operational' | 'closed' | 'maintenance' | 'emergency';
  operatingHours: string;
  lifts: {
    total: number;
    operational: number;
  };
  trails: {
    total: number;
    open: number;
  };
  weather: {
    temperature: number;
    condition: string;
    snowDepth: number;
    visibility: string;
  };
  visitors: {
    current: number;
    capacity: number;
    todaysTotal: number;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  adminAssigned?: string;
  lastUpdate: Date;
  financials: {
    dailyRevenue: number;
    seasonRevenue: number;
    ticketsSold: number;
  };
  safety: {
    incidents: number;
    alertLevel: 'low' | 'medium' | 'high' | 'critical';
    lastInspection: Date;
  };
  systemSettings: {
    apiEnabled: boolean;
    dataSharing: boolean;
    emergencyProtocols: boolean;
    maintenanceMode: boolean;
  };
}

// Comprehensive mock data for all 25+ NZ ski fields
const MOCK_SKI_FIELDS: SkiField[] = [
  // South Island - Queenstown Region
  {
    id: 'coronet-peak',
    name: 'Coronet Peak',
    location: 'Queenstown, South Island',
    region: 'South Island',
    status: 'operational',
    operatingHours: '9:00 AM - 4:00 PM',
    lifts: { total: 6, operational: 6 },
    trails: { total: 28, open: 26 },
    weather: { temperature: -5, condition: 'Fresh Snow', snowDepth: 120, visibility: 'excellent' },
    visitors: { current: 1240, capacity: 1500, todaysTotal: 2100 },
    contact: { phone: '+64 3 442 4620', email: 'info@coronetpeak.co.nz', website: 'coronetpeak.co.nz' },
    adminAssigned: 'Sarah Mitchell',
    lastUpdate: new Date('2024-01-20T08:30:00'),
    financials: { dailyRevenue: 156000, seasonRevenue: 8400000, ticketsSold: 1850 },
    safety: { incidents: 0, alertLevel: 'low', lastInspection: new Date('2024-01-15T10:00:00') },
    systemSettings: { apiEnabled: true, dataSharing: true, emergencyProtocols: true, maintenanceMode: false }
  },
  {
    id: 'the-remarkables',
    name: 'The Remarkables',
    location: 'Queenstown, South Island',
    region: 'South Island',
    status: 'operational',
    operatingHours: '9:00 AM - 4:00 PM',
    lifts: { total: 6, operational: 5 },
    trails: { total: 30, open: 28 },
    weather: { temperature: -3, condition: 'Partly Cloudy', snowDepth: 95, visibility: 'good' },
    visitors: { current: 980, capacity: 1200, todaysTotal: 1650 },
    contact: { phone: '+64 3 442 4615', email: 'info@theremarkables.co.nz', website: 'theremarkables.co.nz' },
    adminAssigned: 'Sarah Mitchell',
    lastUpdate: new Date('2024-01-20T08:15:00'),
    financials: { dailyRevenue: 124000, seasonRevenue: 7200000, ticketsSold: 1420 },
    safety: { incidents: 1, alertLevel: 'low', lastInspection: new Date('2024-01-16T14:00:00') },
    systemSettings: { apiEnabled: true, dataSharing: true, emergencyProtocols: true, maintenanceMode: false }
  },

  // South Island - Central Otago/Wānaka
  {
    id: 'cardrona',
    name: 'Cardrona Alpine Resort',
    location: 'Wānaka, South Island',
    region: 'South Island',
    status: 'operational',
    operatingHours: '8:30 AM - 4:00 PM',
    lifts: { total: 5, operational: 5 },
    trails: { total: 25, open: 23 },
    weather: { temperature: -7, condition: 'Fresh Snow', snowDepth: 140, visibility: 'excellent' },
    visitors: { current: 1450, capacity: 1600, todaysTotal: 2300 },
    contact: { phone: '+64 3 443 7341', email: 'info@cardrona.com', website: 'cardrona.com' },
    adminAssigned: 'James Thompson',
    lastUpdate: new Date('2024-01-20T07:45:00'),
    financials: { dailyRevenue: 184000, seasonRevenue: 11200000, ticketsSold: 2150 },
    safety: { incidents: 0, alertLevel: 'low', lastInspection: new Date('2024-01-18T09:00:00') },
    systemSettings: { apiEnabled: true, dataSharing: true, emergencyProtocols: true, maintenanceMode: false }
  },
  {
    id: 'treble-cone',
    name: 'Treble Cone',
    location: 'Wānaka, South Island',
    region: 'South Island',
    status: 'operational',
    operatingHours: '9:00 AM - 4:00 PM',
    lifts: { total: 4, operational: 3 },
    trails: { total: 22, open: 20 },
    weather: { temperature: -6, condition: 'Light Snow', snowDepth: 110, visibility: 'good' },
    visitors: { current: 680, capacity: 800, todaysTotal: 1100 },
    contact: { phone: '+64 3 443 7443', email: 'info@treblecone.com', website: 'treblecone.com' },
    adminAssigned: 'Michael Chen',
    lastUpdate: new Date('2024-01-20T07:30:00'),
    financials: { dailyRevenue: 89000, seasonRevenue: 4800000, ticketsSold: 980 },
    safety: { incidents: 0, alertLevel: 'low', lastInspection: new Date('2024-01-17T11:30:00') },
    systemSettings: { apiEnabled: true, dataSharing: true, emergencyProtocols: true, maintenanceMode: false }
  },

  // South Island - Canterbury
  {
    id: 'mt-hutt',
    name: 'Mt Hutt',
    location: 'Canterbury, South Island',
    region: 'South Island',
    status: 'operational',
    operatingHours: '9:00 AM - 4:00 PM',
    lifts: { total: 4, operational: 4 },
    trails: { total: 18, open: 16 },
    weather: { temperature: -4, condition: 'Overcast', snowDepth: 85, visibility: 'fair' },
    visitors: { current: 920, capacity: 1100, todaysTotal: 1580 },
    contact: { phone: '+64 3 302 8811', email: 'info@mthutt.co.nz', website: 'mthutt.co.nz' },
    adminAssigned: 'Emma Rodriguez',
    lastUpdate: new Date('2024-01-20T08:00:00'),
    financials: { dailyRevenue: 118000, seasonRevenue: 6500000, ticketsSold: 1320 },
    safety: { incidents: 0, alertLevel: 'low', lastInspection: new Date('2024-01-19T13:00:00') },
    systemSettings: { apiEnabled: true, dataSharing: true, emergencyProtocols: true, maintenanceMode: false }
  },
  {
    id: 'porters',
    name: 'Porters Ski Area',
    location: 'Canterbury, South Island',
    region: 'South Island',
    status: 'maintenance',
    operatingHours: 'Closed for maintenance',
    lifts: { total: 4, operational: 0 },
    trails: { total: 16, open: 0 },
    weather: { temperature: -2, condition: 'Clear', snowDepth: 75, visibility: 'excellent' },
    visitors: { current: 0, capacity: 800, todaysTotal: 0 },
    contact: { phone: '+64 3 318 4002', email: 'info@porters.co.nz', website: 'porters.co.nz' },
    adminAssigned: 'Tom Wilson',
    lastUpdate: new Date('2024-01-20T06:00:00'),
    financials: { dailyRevenue: 0, seasonRevenue: 2100000, ticketsSold: 0 },
    safety: { incidents: 0, alertLevel: 'low', lastInspection: new Date('2024-01-19T15:00:00') },
    systemSettings: { apiEnabled: true, dataSharing: false, emergencyProtocols: true, maintenanceMode: true }
  },
  {
    id: 'craigieburn',
    name: 'Craigieburn',
    location: 'Canterbury, South Island',
    region: 'South Island',
    status: 'operational',
    operatingHours: '9:00 AM - 4:00 PM',
    lifts: { total: 3, operational: 3 },
    trails: { total: 12, open: 10 },
    weather: { temperature: -8, condition: 'Heavy Snow', snowDepth: 160, visibility: 'poor' },
    visitors: { current: 420, capacity: 600, todaysTotal: 680 },
    contact: { phone: '+64 3 318 8711', email: 'info@craigieburn.co.nz', website: 'craigieburn.co.nz' },
    adminAssigned: 'David Kumar',
    lastUpdate: new Date('2024-01-20T07:15:00'),
    financials: { dailyRevenue: 52000, seasonRevenue: 1800000, ticketsSold: 580 },
    safety: { incidents: 0, alertLevel: 'medium', lastInspection: new Date('2024-01-18T10:30:00') },
    systemSettings: { apiEnabled: true, dataSharing: true, emergencyProtocols: true, maintenanceMode: false }
  },

  // North Island
  {
    id: 'turoa',
    name: 'Turoa',
    location: 'Ohakune, North Island',
    region: 'North Island',
    status: 'operational',
    operatingHours: '9:00 AM - 4:00 PM',
    lifts: { total: 9, operational: 8 },
    trails: { total: 30, open: 28 },
    weather: { temperature: -1, condition: 'Light Snow', snowDepth: 180, visibility: 'good' },
    visitors: { current: 1680, capacity: 2000, todaysTotal: 2850 },
    contact: { phone: '+64 7 892 4000', email: 'info@mtruapehu.com', website: 'mtruapehu.com' },
    adminAssigned: 'Lisa Anderson',
    lastUpdate: new Date('2024-01-20T08:45:00'),
    financials: { dailyRevenue: 198000, seasonRevenue: 13500000, ticketsSold: 2640 },
    safety: { incidents: 1, alertLevel: 'low', lastInspection: new Date('2024-01-17T12:00:00') },
    systemSettings: { apiEnabled: true, dataSharing: true, emergencyProtocols: true, maintenanceMode: false }
  },
  {
    id: 'whakapapa',
    name: 'Whakapapa',
    location: 'Taupo, North Island',
    region: 'North Island',
    status: 'operational',
    operatingHours: '9:00 AM - 4:00 PM',
    lifts: { total: 11, operational: 10 },
    trails: { total: 32, open: 30 },
    weather: { temperature: 0, condition: 'Partly Cloudy', snowDepth: 165, visibility: 'excellent' },
    visitors: { current: 1820, capacity: 2200, todaysTotal: 3100 },
    contact: { phone: '+64 7 892 3738', email: 'info@mtruapehu.com', website: 'mtruapehu.com' },
    adminAssigned: 'Lisa Anderson',
    lastUpdate: new Date('2024-01-20T08:20:00'),
    financials: { dailyRevenue: 225000, seasonRevenue: 15800000, ticketsSold: 2890 },
    safety: { incidents: 0, alertLevel: 'low', lastInspection: new Date('2024-01-16T14:30:00') },
    systemSettings: { apiEnabled: true, dataSharing: true, emergencyProtocols: true, maintenanceMode: false }
  },
  {
    id: 'manganui',
    name: 'Manganui',
    location: 'Taranaki, North Island',
    region: 'North Island',
    status: 'closed',
    operatingHours: 'Closed - Off Season',
    lifts: { total: 2, operational: 0 },
    trails: { total: 6, open: 0 },
    weather: { temperature: 8, condition: 'Rain', snowDepth: 0, visibility: 'poor' },
    visitors: { current: 0, capacity: 300, todaysTotal: 0 },
    contact: { phone: '+64 6 759 1144', email: 'info@manganui.co.nz', website: 'manganui.co.nz' },
    adminAssigned: 'Rebecca Taylor',
    lastUpdate: new Date('2024-01-15T16:00:00'),
    financials: { dailyRevenue: 0, seasonRevenue: 180000, ticketsSold: 0 },
    safety: { incidents: 0, alertLevel: 'low', lastInspection: new Date('2023-12-20T10:00:00') },
    systemSettings: { apiEnabled: false, dataSharing: false, emergencyProtocols: false, maintenanceMode: true }
  }
];

export function ComprehensiveSkiFieldManagement({ currentUser, onSelectSkiField }: ComprehensiveSkiFieldManagementProps) {
  const [skiFields, setSkiFields] = useState<SkiField[]>(MOCK_SKI_FIELDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [selectedSkiField, setSelectedSkiField] = useState<SkiField | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSystemOverrideDialog, setShowSystemOverrideDialog] = useState(false);

  // Filter ski fields
  const filteredSkiFields = skiFields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         field.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || field.status === statusFilter;
    const matchesRegion = regionFilter === 'all' || field.region === regionFilter;
    
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const getStatusBadge = (status: SkiField['status']) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Operational</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Maintenance</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Closed</Badge>;
      case 'emergency':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Emergency</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: SkiField['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'maintenance':
        return <Settings className="w-4 h-4 text-yellow-600" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      case 'emergency':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSafetyAlertBadge = (level: SkiField['safety']['alertLevel']) => {
    switch (level) {
      case 'low':
        return <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">Medium Risk</Badge>;
      case 'high':
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs">High Risk</Badge>;
      case 'critical':
        return <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">Critical</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  const handleOverrideSkiField = (field: SkiField, action: string) => {
    setSelectedSkiField(field);
    setShowSystemOverrideDialog(true);
    
    // In a real implementation, this would trigger system overrides
    console.log(`Admin override: ${action} for ${field.name}`);
  };

  const handleEmergencyBroadcast = (field: SkiField) => {
    alert(`Emergency broadcast sent to all users at ${field.name}`);
  };

  const handleForceSync = (field: SkiField) => {
    // Simulate data sync
    setSkiFields(prev => prev.map(f => 
      f.id === field.id 
        ? { ...f, lastUpdate: new Date() }
        : f
    ));
    alert(`Data sync completed for ${field.name}`);
  };

  const skiFieldStats = {
    total: skiFields.length,
    operational: skiFields.filter(f => f.status === 'operational').length,
    maintenance: skiFields.filter(f => f.status === 'maintenance').length,
    closed: skiFields.filter(f => f.status === 'closed').length,
    emergency: skiFields.filter(f => f.status === 'emergency').length,
    totalVisitors: skiFields.reduce((sum, f) => sum + f.visitors.current, 0),
    totalRevenue: skiFields.reduce((sum, f) => sum + f.financials.dailyRevenue, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Ultimate Ski Field Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete control over all New Zealand ski fields and resort operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Ski Field
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-2">
                <Mountain className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{skiFieldStats.total}</p>
              <p className="text-xs text-muted-foreground">Total Fields</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{skiFieldStats.operational}</p>
              <p className="text-xs text-muted-foreground">Operational</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mx-auto mb-2">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{skiFieldStats.maintenance}</p>
              <p className="text-xs text-muted-foreground">Maintenance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{skiFieldStats.closed}</p>
              <p className="text-xs text-muted-foreground">Closed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{skiFieldStats.totalVisitors.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Active Visitors</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">${(skiFieldStats.totalRevenue / 1000).toFixed(0)}k</p>
              <p className="text-xs text-muted-foreground">Daily Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="snowline-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search ski fields..."
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
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="North Island">North Island</SelectItem>
                <SelectItem value="South Island">South Island</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ski Fields List */}
      <div className="space-y-4">
        {filteredSkiFields.map((field) => (
          <Card key={field.id} className="snowline-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Mountain className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{field.name}</h3>
                      {getStatusBadge(field.status)}
                      {getSafetyAlertBadge(field.safety.alertLevel)}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                      {/* Basic Info */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{field.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{field.operatingHours}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Shield className="w-4 h-4" />
                          <span>Admin: {field.adminAssigned || 'Unassigned'}</span>
                        </div>
                      </div>
                      
                      {/* Operations */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Lifts:</span>
                          <span className="font-medium">{field.lifts.operational}/{field.lifts.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Trails:</span>
                          <span className="font-medium">{field.trails.open}/{field.trails.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Visitors:</span>
                          <span className="font-medium">{field.visitors.current}/{field.visitors.capacity}</span>
                        </div>
                      </div>
                      
                      {/* Performance */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="font-medium">${(field.financials.dailyRevenue / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Snow:</span>
                          <span className="font-medium">{field.weather.snowDepth}cm</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Temp:</span>
                          <span className="font-medium">{field.weather.temperature}°C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Platform Admin Direct Access Button (temporary debug) */}
                  {RoleService.isPlatformAdmin(currentUser) && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        console.log(`🏔️ Platform admin opening ski field dashboard for: ${field.name} (${field.id})`);
                        if (onSelectSkiField) {
                          onSelectSkiField(field.id);
                        } else {
                          console.warn('⚠️ onSelectSkiField callback not provided to ComprehensiveSkiFieldManagement');
                        }
                      }}
                      className="rounded-lg bg-primary hover:bg-primary/90"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Admin
                    </Button>
                  )}

                  {/* Quick Action Buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleForceSync(field)}
                    className="rounded-lg"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSkiField(field);
                      setShowDetailsDialog(true);
                    }}
                    className="rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-lg hover:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-1"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-64 z-50"
                      side="bottom"
                      sideOffset={4}
                    >
                      {/* Enhanced platform admin option - ALWAYS show for platform admins */}
                      {RoleService.isPlatformAdmin(currentUser) && (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log(`🏔️ Platform admin opening ski field dashboard for: ${field.name} (${field.id})`);
                              if (onSelectSkiField) {
                                onSelectSkiField(field.id);
                              } else {
                                console.warn('⚠️ onSelectSkiField callback not provided to ComprehensiveSkiFieldManagement');
                              }
                            }}
                            className="bg-primary/5 text-primary hover:bg-primary/10 border border-primary/20 cursor-pointer focus:bg-primary/10"
                          >
                            <Shield className="w-4 h-4 mr-2 text-primary" />
                            Open Admin Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedSkiField(field);
                          setShowDetailsDialog(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedSkiField(field);
                          setShowEditDialog(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Settings
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEmergencyBroadcast(field);
                        }}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 cursor-pointer"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Emergency Broadcast
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOverrideSkiField(field, 'emergency_override');
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        System Override
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedSkiField(field);
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Ski Field
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ski Field Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Mountain className="w-5 h-5 text-primary" />
              <span>{selectedSkiField?.name} - Complete Overview</span>
            </DialogTitle>
            <DialogDescription>
              Comprehensive management view for {selectedSkiField?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSkiField && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Info */}
                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="text-base">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Location:</span>
                        <span className="text-sm font-medium">{selectedSkiField.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Region:</span>
                        <span className="text-sm font-medium">{selectedSkiField.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        {getStatusBadge(selectedSkiField.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Operating Hours:</span>
                        <span className="text-sm font-medium">{selectedSkiField.operatingHours}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Weather */}
                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="text-base">Weather Conditions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Temperature:</span>
                        <span className="text-sm font-medium">{selectedSkiField.weather.temperature}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Condition:</span>
                        <span className="text-sm font-medium">{selectedSkiField.weather.condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Snow Depth:</span>
                        <span className="text-sm font-medium">{selectedSkiField.weather.snowDepth}cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Visibility:</span>
                        <span className="text-sm font-medium capitalize">{selectedSkiField.weather.visibility}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="operations" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="text-base">Lifts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{selectedSkiField.lifts.operational}/{selectedSkiField.lifts.total}</p>
                        <p className="text-sm text-muted-foreground">Operational</p>
                        <Progress 
                          value={(selectedSkiField.lifts.operational / selectedSkiField.lifts.total) * 100} 
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="text-base">Trails</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{selectedSkiField.trails.open}/{selectedSkiField.trails.total}</p>
                        <p className="text-sm text-muted-foreground">Open</p>
                        <Progress 
                          value={(selectedSkiField.trails.open / selectedSkiField.trails.total) * 100} 
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="text-base">Capacity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{Math.round((selectedSkiField.visitors.current / selectedSkiField.visitors.capacity) * 100)}%</p>
                        <p className="text-sm text-muted-foreground">Current Load</p>
                        <Progress 
                          value={(selectedSkiField.visitors.current / selectedSkiField.visitors.capacity) * 100} 
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="financials" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="snowline-card">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">${selectedSkiField.financials.dailyRevenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Today's Revenue</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="snowline-card">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">${(selectedSkiField.financials.seasonRevenue / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-muted-foreground">Season Revenue</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="snowline-card">
                    <CardContent className="p-6 text-center">
                      <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{selectedSkiField.financials.ticketsSold.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Tickets Sold Today</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="safety" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="text-base">Safety Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Alert Level:</span>
                        {getSafetyAlertBadge(selectedSkiField.safety.alertLevel)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Incidents Today:</span>
                        <span className="text-sm font-medium">{selectedSkiField.safety.incidents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Inspection:</span>
                        <span className="text-sm font-medium">
                          {selectedSkiField.safety.lastInspection.toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="text-base">Emergency Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEmergencyBroadcast(selectedSkiField)}
                        className="w-full justify-start border-red-200 hover:bg-red-50"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Emergency Broadcast
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOverrideSkiField(selectedSkiField, 'emergency_stop')}
                        className="w-full justify-start border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Emergency Stop All Lifts
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="text-base">System Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">API Access</p>
                          <p className="text-xs text-muted-foreground">Enable API endpoints</p>
                        </div>
                        <Switch checked={selectedSkiField.systemSettings.apiEnabled} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Data Sharing</p>
                          <p className="text-xs text-muted-foreground">Share data with platform</p>
                        </div>
                        <Switch checked={selectedSkiField.systemSettings.dataSharing} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Emergency Protocols</p>
                          <p className="text-xs text-muted-foreground">Emergency response systems</p>
                        </div>
                        <Switch checked={selectedSkiField.systemSettings.emergencyProtocols} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Maintenance Mode</p>
                          <p className="text-xs text-muted-foreground">Disable public access</p>
                        </div>
                        <Switch checked={selectedSkiField.systemSettings.maintenanceMode} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="text-base">Admin Overrides</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Lock className="w-4 h-4 mr-2" />
                        Override Access Control
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Force Data Refresh
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Reset Configuration
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Zap className="w-4 h-4 mr-2" />
                        System Health Check
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System Override Confirmation */}
      <AlertDialog open={showSystemOverrideDialog} onOpenChange={setShowSystemOverrideDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span>System Override</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to perform a system override on <strong>{selectedSkiField?.name}</strong>.
              <br /><br />
              This action will bypass normal safety checks and could affect operations. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              Confirm Override
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Ski Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedSkiField?.name} from the platform?
              This action cannot be undone and will affect all users and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedSkiField) {
                  setSkiFields(prev => prev.filter(f => f.id !== selectedSkiField.id));
                }
                setShowDeleteDialog(false);
                setSelectedSkiField(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Ski Field
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}