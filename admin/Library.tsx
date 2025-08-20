import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination';
import { 
  Users, 
  Activity, 
  BarChart3, 
  Settings, 
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  MoreHorizontal,
  Lock,
  Shield,
  Crown,
  MapPin,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Zap,
  Mountain,
  Flag,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Bell,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

// Design System Color Tokens for Admin
const adminColors = {
  bg: '#0B1220',
  surface: '#121A2A', 
  elevated: '#172238',
  text: '#E8F0FF',
  muted: '#9DB2CE',
  primary: '#4FB3F6',
  primaryContrast: '#072033',
  success: '#7CFBDD',
  warning: '#FFD166',
  danger: '#FF6B6B',
  border: '#233047',
  focus: '#8BD3FF'
};

// Role and Status Types
type UserRole = 'user' | 'moderator' | 'admin';
type RunStatus = 'public' | 'private' | 'flagged';

interface User {
  id: string;
  display_name: string;
  email: string;
  role: UserRole;
  banned: boolean;
  created_at: string;
  avatar?: string;
}

interface Run {
  id: string;
  user_id: string;
  user_name: string;
  resort: string;
  distance_m: number;
  vert_m: number;
  max_speed_kmh: number;
  status: RunStatus;
  created_at: string;
}

interface Report {
  id: string;
  run_id: string;
  reporter_id: string;
  reason: string;
  resolved: boolean;
  moderator_note?: string;
  created_at: string;
}

// Status Pills Component
export const StatusPill: React.FC<{
  status: RunStatus;
  onClick?: () => void;
  editable?: boolean;
}> = ({ status, onClick, editable = false }) => {
  const getStatusStyles = (status: RunStatus) => {
    switch (status) {
      case 'public':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'private':
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      case 'flagged':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusStyles(status)} ${editable ? 'cursor-pointer' : ''} text-xs px-2 py-1`}
      onClick={editable ? onClick : undefined}
    >
      {status}
      {editable && <ChevronDown className="w-3 h-3 ml-1" />}
    </Badge>
  );
};

// Role Pills Component
export const RolePill: React.FC<{
  role: UserRole;
  onClick?: () => void;
  editable?: boolean;
}> = ({ role, onClick, editable = false }) => {
  const getRoleStyles = (role: UserRole) => {
    switch (role) {
      case 'user':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-3 h-3 mr-1" />;
      case 'moderator':
        return <Shield className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getRoleStyles(role)} ${editable ? 'cursor-pointer hover:bg-opacity-80' : ''} text-xs px-2 py-1 flex items-center`}
      onClick={editable ? onClick : undefined}
    >
      {getRoleIcon(role)}
      {role}
      {editable && <ChevronDown className="w-3 h-3 ml-1" />}
    </Badge>
  );
};

// Map Thumbnail Component
export const MapThumbnail: React.FC<{
  className?: string;
  resort?: string;
  stats?: { distance: number; vert: number };
}> = ({ className = '', resort, stats }) => {
  return (
    <div className={`relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-full h-full opacity-30" viewBox="0 0 100 60">
          <path 
            d="M10,50 Q30,20 50,30 T90,10" 
            stroke="#4FB3F6" 
            strokeWidth="2" 
            fill="none"
            className="drop-shadow-sm"
          />
          <path 
            d="M10,50 Q35,35 60,40 T90,25" 
            stroke="#22c55e" 
            strokeWidth="1.5" 
            fill="none"
            className="opacity-60"
          />
        </svg>
      </div>
      {resort && (
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-xs font-medium text-gray-800">{resort}</span>
        </div>
      )}
      {stats && (
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
          <div className="text-xs font-medium text-gray-800">
            {stats.distance}km • {stats.vert}m
          </div>
        </div>
      )}
    </div>
  );
};

// KPI Stat Card Component
export const StatCard: React.FC<{
  title: string;
  value: string | number;
  delta?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ title, value, delta, icon, trend }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {delta !== undefined && (
              <div className={`flex items-center mt-2 text-sm ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="ml-1">
                  {delta > 0 ? '+' : ''}{delta}%
                </span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Chart Card Component
export const ChartCard: React.FC<{
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, children, actions }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {actions}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

// User Card Component
export const UserCard: React.FC<{
  user: Partial<User>;
  compact?: boolean;
  actions?: React.ReactNode;
}> = ({ user, compact = false, actions }) => {
  return (
    <Card className={compact ? 'p-4' : ''}>
      <CardContent className={compact ? 'p-0' : 'p-6'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{user.display_name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user.role && <RolePill role={user.role} />}
            {actions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Run Card Component
export const RunCard: React.FC<{
  run: Partial<Run>;
  compact?: boolean;
  actions?: React.ReactNode;
}> = ({ run, compact = false, actions }) => {
  return (
    <Card className={compact ? 'p-4' : ''}>
      <CardContent className={compact ? 'p-0' : 'p-6'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapThumbnail className="w-16 h-10 flex-shrink-0" resort={run.resort} />
            <div>
              <p className="font-medium">{run.user_name}</p>
              <p className="text-sm text-muted-foreground">
                {run.distance_m && `${(run.distance_m / 1000).toFixed(1)}km`}
                {run.vert_m && ` • ${run.vert_m}m vert`}
                {run.max_speed_kmh && ` • ${run.max_speed_kmh} km/h`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {run.status && <StatusPill status={run.status} />}
            {actions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Admin Data Table Component
export const AdminDataTable: React.FC<{
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  data: any[];
  loading?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  selectedRows?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  batchActions?: React.ReactNode;
}> = ({ 
  columns, 
  data, 
  loading = false, 
  onSort, 
  sortKey, 
  sortDirection,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  batchActions
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No data found</h3>
          <p className="text-muted-foreground">No records match your current filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {batchActions && selectedRows.length > 0 && (
          <div className="p-4 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedRows.length} selected
              </span>
              <div className="flex space-x-2">
                {batchActions}
              </div>
            </div>
          </div>
        )}
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              {onSelectRow && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length}
                    onChange={onSelectAll}
                    className="rounded border-border"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key} className="font-medium">
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && onSort && (
                      <button
                        onClick={() => onSort(column.key, sortDirection === 'asc' ? 'desc' : 'asc')}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {sortKey === column.key ? (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.id || index} className="hover:bg-muted/50">
                {onSelectRow && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => onSelectRow(row.id)}
                      className="rounded border-border"
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Empty State Component
export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  );
};

// Toast notifications (using sonner)
export { toast } from 'sonner@2.0.3';

// Library Demo Component
export const LibraryDemo: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('primitives');
  
  const sampleUsers: User[] = [
    {
      id: '1',
      display_name: 'Alex Rider',
      email: 'alex@snowline.app',
      role: 'admin',
      banned: false,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      display_name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'moderator',
      banned: false,
      created_at: '2024-01-14T15:30:00Z'
    }
  ];

  const sampleRuns: Run[] = [
    {
      id: '1',
      user_id: '1',
      user_name: 'Alex Rider',
      resort: 'Whistler Blackcomb',
      distance_m: 12300,
      vert_m: 1240,
      max_speed_kmh: 62,
      status: 'public',
      created_at: '2024-01-15T09:30:00Z'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Snowline Admin Design System</h1>
          <p className="text-muted-foreground">Complete component library for the admin console</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="primitives">Primitives</TabsTrigger>
            <TabsTrigger value="data">Data Components</TabsTrigger>
            <TabsTrigger value="charts">Charts & Visualizations</TabsTrigger>
          </TabsList>

          <TabsContent value="primitives" className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
              <div className="flex flex-wrap gap-4 p-6 bg-muted/20 rounded-lg">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Status & Role Pills</h2>
              <div className="space-y-4 p-6 bg-muted/20 rounded-lg">
                <div className="space-x-4">
                  <span className="text-sm font-medium">Status Pills:</span>
                  <StatusPill status="public" />
                  <StatusPill status="private" />
                  <StatusPill status="flagged" />
                  <StatusPill status="public" editable />
                </div>
                <div className="space-x-4">
                  <span className="text-sm font-medium">Role Pills:</span>
                  <RolePill role="user" />
                  <RolePill role="moderator" />
                  <RolePill role="admin" />
                  <RolePill role="admin" editable />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Form Elements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-muted/20 rounded-lg">
                <Input placeholder="Search users..." />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <label htmlFor="notifications" className="text-sm">Enable notifications</label>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="data" className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">KPI Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Active Users (24h)"
                  value="1,234"
                  delta={12}
                  trend="up"
                  icon={<Users className="w-6 h-6 text-primary" />}
                />
                <StatCard
                  title="Runs Today"
                  value="456"
                  delta={-3}
                  trend="down"
                  icon={<Activity className="w-6 h-6 text-green-600" />}
                />
                <StatCard
                  title="Flagged Runs"
                  value="12"
                  delta={0}
                  trend="neutral"
                  icon={<Flag className="w-6 h-6 text-red-600" />}
                />
                <StatCard
                  title="System Health"
                  value="99.9%"
                  icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Cards</h2>
              <div className="space-y-4">
                <UserCard user={sampleUsers[0]} />
                <RunCard run={sampleRuns[0]} />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Map Thumbnails</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MapThumbnail className="aspect-video" resort="Whistler" />
                <MapThumbnail 
                  className="aspect-video" 
                  resort="Vail" 
                  stats={{ distance: 12.3, vert: 1240 }} 
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Table</h2>
              <AdminDataTable
                columns={[
                  { key: 'display_name', label: 'Name', sortable: true },
                  { key: 'email', label: 'Email', sortable: true },
                  { 
                    key: 'role', 
                    label: 'Role', 
                    render: (value) => <RolePill role={value} /> 
                  },
                  { 
                    key: 'banned', 
                    label: 'Status', 
                    render: (value) => value ? 
                      <Badge variant="destructive">Banned</Badge> : 
                      <Badge variant="secondary">Active</Badge>
                  }
                ]}
                data={sampleUsers}
                selectedRows={[]}
                onSelectRow={() => {}}
                batchActions={
                  <div className="space-x-2">
                    <Button size="sm" variant="outline">Ban Selected</Button>
                    <Button size="sm">Make Moderator</Button>
                  </div>
                }
              />
            </section>
          </TabsContent>

          <TabsContent value="charts" className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Chart Cards</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Activity This Week">
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <p className="text-muted-foreground">Chart placeholder - integrate with Recharts</p>
                  </div>
                </ChartCard>
                <ChartCard 
                  title="User Growth" 
                  actions={<Button size="sm" variant="outline">Export</Button>}
                >
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <p className="text-muted-foreground">Chart placeholder - integrate with Recharts</p>
                  </div>
                </ChartCard>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Empty States</h2>
              <div className="bg-muted/20 rounded-lg p-8">
                <EmptyState
                  icon={<Users className="w-8 h-8 text-muted-foreground" />}
                  title="No users found"
                  description="No users match your current filters. Try adjusting your search criteria."
                  action={<Button variant="outline">Clear Filters</Button>}
                />
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LibraryDemo;