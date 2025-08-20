import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Users, 
  Mountain, 
  Settings, 
  AlertTriangle, 
  Database, 
  BarChart3, 
  CreditCard, 
  MessageSquare, 
  Globe, 
  Terminal, 
  Lock, 
  User, 
  UserCheck, 
  Building2, 
  Activity, 
  TrendingUp, 
  Eye, 
  Edit, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Book, 
  HelpCircle, 
  ExternalLink, 
  Copy, 
  Phone, 
  Mail, 
  Clock, 
  Zap,
  Crown,
  Heart,
  Play,
  Pause,
  Stop,
  MonitorSpeaker
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { User as UserType } from '../src/types/index';

interface AdminDocumentationProps {
  currentUser: UserType;
  onClose: () => void;
}

type AdminDocSection = 
  | 'overview'
  | 'access'
  | 'platform-admin'
  | 'skifield-admin'
  | 'emergency'
  | 'user-management'
  | 'system-monitoring'
  | 'best-practices';

export function AdminDocumentation({ currentUser, onClose }: AdminDocumentationProps) {
  const [activeSection, setActiveSection] = useState<AdminDocSection>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Documentation sections configuration
  const adminDocSections = [
    {
      id: 'overview' as AdminDocSection,
      label: 'Admin Overview',
      description: 'Administrative system introduction',
      icon: Shield,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'access' as AdminDocSection,
      label: 'Access & Accounts',
      description: 'Account types and access methods',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'platform-admin' as AdminDocSection,
      label: 'Platform Admin',
      description: 'Master administrative controls',
      icon: Settings,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'skifield-admin' as AdminDocSection,
      label: 'Ski Field Admin',
      description: 'Resort management tools',
      icon: Mountain,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'emergency' as AdminDocSection,
      label: 'Emergency Controls',
      description: 'Crisis management procedures',
      icon: AlertTriangle,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'user-management' as AdminDocSection,
      label: 'User Management',
      description: 'Managing user accounts',
      icon: UserCheck,
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'system-monitoring' as AdminDocSection,
      label: 'System Monitoring',
      description: 'Platform health and analytics',
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'best-practices' as AdminDocSection,
      label: 'Best Practices',
      description: 'Administrative guidelines',
      icon: Book,
      color: 'from-gray-500 to-gray-600'
    }
  ];

  // Collapsible section component
  const CollapsibleSection = ({ title, children, id, defaultOpen = false }: { 
    title: string; 
    children: React.ReactNode; 
    id: string; 
    defaultOpen?: boolean 
  }) => {
    const isExpanded = expandedItems.includes(id) || defaultOpen;
    
    return (
      <div className="border rounded-xl">
        <button
          onClick={() => toggleExpanded(id)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-t-xl"
        >
          <h4 className="font-semibold">{title}</h4>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t"
            >
              <div className="p-4 space-y-4">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Admin Overview Section
  const OverviewSection = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Snowline Admin Management</h1>
          <p className="text-lg text-muted-foreground">Comprehensive guide to administrative controls and features</p>
        </div>
      </div>

      <Card className="snowline-card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Administrative Hierarchy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Normal Users */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Normal Users</h3>
                <p className="text-sm text-blue-700">Basic & Pro skiers</p>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Badge variant="outline" className="bg-blue-50">Basic</Badge>
                  <Badge className="bg-blue-600 text-white">Pro</Badge>
                </div>
                <p className="text-xs text-muted-foreground">2,847 active users</p>
              </div>
            </div>

            {/* Ski Field Admins */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                <Mountain className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Ski Field Admins</h3>
                <p className="text-sm text-green-700">Resort management</p>
              </div>
              <div className="space-y-1 text-sm">
                <Badge className="bg-green-600 text-white">Resort Admin</Badge>
                <p className="text-xs text-muted-foreground">23 ski field admins</p>
              </div>
            </div>

            {/* Platform Admins */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Platform Admins</h3>
                <p className="text-sm text-red-700">Full system control</p>
              </div>
              <div className="space-y-1 text-sm">
                <Badge variant="destructive">Master Admin</Badge>
                <p className="text-xs text-muted-foreground">3 platform admins</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="snowline-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Quick Emergency Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Critical controls for platform administrators during emergencies.
            </p>
            <div className="space-y-2">
              <Button variant="destructive" size="sm" className="w-full justify-start">
                <Lock className="w-4 h-4 mr-2" />
                Emergency Platform Lockdown
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-orange-300 text-orange-700">
                <Pause className="w-4 h-4 mr-2" />
                Pause All GPS Tracking
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-blue-300 text-blue-700">
                <Phone className="w-4 h-4 mr-2" />
                Emergency Contacts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">847</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">68%</div>
                <div className="text-xs text-muted-foreground">Server Load</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">120ms</div>
                <div className="text-xs text-muted-foreground">Response</div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full" onClick={() => setActiveSection('system-monitoring')}>
              View Detailed Monitoring
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Access & Accounts Section
  const AccessSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Admin Access & Account Management</h2>
        <p className="text-muted-foreground">How to access and switch between administrative accounts in Snowline.</p>
      </div>

      <CollapsibleSection title="Demo Admin Accounts" id="demo-accounts" defaultOpen>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-900">
                <Mountain className="w-5 h-5" />
                <span>Lisa Rodriguez - Ski Field Admin</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-sm space-y-1">
                  <div><strong>Username:</strong> coronetadmin</div>
                  <div><strong>Email:</strong> lisa@coronetpeak.co.nz</div>
                  <div><strong>Manages:</strong> Coronet Peak & The Remarkables</div>
                  <div><strong>Role:</strong> <Badge className="bg-green-600 text-white">Resort Administrator</Badge></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-2">Access Features:</h4>
                <ul className="text-sm space-y-1 text-green-800">
                  <li>• Ski field operations management</li>
                  <li>• Lift and trail status updates</li>
                  <li>• Weather station monitoring</li>
                  <li>• Staff scheduling and management</li>
                  <li>• Resort-specific analytics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-900">
                <Shield className="w-5 h-5" />
                <span>Alex Rider - Platform Admin</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-sm space-y-1">
                  <div><strong>Username:</strong> alexrider</div>
                  <div><strong>Email:</strong> alex@snowline.app</div>
                  <div><strong>Access:</strong> Full Platform Control</div>
                  <div><strong>Role:</strong> <Badge variant="destructive">Master Administrator</Badge></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-red-900 mb-2">Full Control Features:</h4>
                <ul className="text-sm space-y-1 text-red-800">
                  <li>• Complete user account management</li>
                  <li>• All ski field administrative oversight</li>
                  <li>• Emergency platform controls</li>
                  <li>• System-wide analytics and monitoring</li>
                  <li>• Billing and revenue management</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="How to Switch Admin Accounts" id="account-switching">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center space-x-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span>Desktop Method</span>
            </h4>
            <ol className="text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">1</span>
                <span>Click the user avatar in the desktop sidebar</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">2</span>
                <span>Select "Switch Account" from the dropdown menu</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">3</span>
                <span>Choose your desired admin account type</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">4</span>
                <span>Admin features will appear automatically</span>
              </li>
            </ol>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-600" />
              <span>Mobile Method</span>
            </h4>
            <ol className="text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">1</span>
                <span>Tap the profile icon in the top navigation</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">2</span>
                <span>Tap your name to open the account switcher</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">3</span>
                <span>Select from available admin accounts</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">4</span>
                <span>Access admin console from the profile menu</span>
              </li>
            </ol>
          </Card>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Admin Console Access</h4>
              <p className="text-sm text-blue-800 mt-1">
                Once logged in as an admin, you'll see "Admin Console" in your profile dropdown menu. 
                Platform admins get full system access, while ski field admins are automatically 
                assigned to their designated resorts.
              </p>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Platform Admin Section
  const PlatformAdminSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Platform Administrator Console</h2>
        <p className="text-muted-foreground">Master control panel with complete authority over the Snowline platform.</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Master Administrator Access</h4>
            <p className="text-sm text-red-800 mt-1">
              Platform administrators have absolute authority over all Snowline systems. Use these controls responsibly 
              and only when necessary for platform operations or emergency situations.
            </p>
          </div>
        </div>
      </div>

      <CollapsibleSection title="Core Administrative Modules" id="platform-modules">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Emergency Controls', icon: AlertTriangle, color: 'red', description: 'Critical system lockdown and recovery' },
            { name: 'User Management', icon: Users, color: 'blue', description: 'Complete user account administration' },
            { name: 'Ski Field Oversight', icon: Mountain, color: 'green', description: 'All resort management and monitoring' },
            { name: 'System Monitoring', icon: BarChart3, color: 'purple', description: 'Platform health and performance' },
            { name: 'Billing & Revenue', icon: CreditCard, color: 'orange', description: 'Financial operations and analytics' },
            { name: 'Developer Tools', icon: Terminal, color: 'gray', description: 'Technical administration and logs' }
          ].map((module, index) => (
            <Card key={index} className={`p-4 border-${module.color}-200 bg-${module.color}-50`}>
              <div className="text-center space-y-3">
                <div className={`w-12 h-12 bg-${module.color}-500 rounded-xl flex items-center justify-center mx-auto`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold text-${module.color}-900`}>{module.name}</h4>
                  <p className={`text-sm text-${module.color}-700 mt-1`}>{module.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="User Management Operations" id="user-operations">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Individual User Controls</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 border rounded-lg">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Activate/Deactivate</div>
                    <div className="text-xs text-muted-foreground">Enable or disable user accounts</div>
                  </div>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
                <div className="flex items-center space-x-3 p-2 border rounded-lg">
                  <Lock className="w-4 h-4 text-red-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Suspend Access</div>
                    <div className="text-xs text-muted-foreground">Temporary account suspension</div>
                  </div>
                  <Button size="sm" variant="outline">Suspend</Button>
                </div>
                <div className="flex items-center space-x-3 p-2 border rounded-lg">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Upgrade/Downgrade</div>
                    <div className="text-xs text-muted-foreground">Change subscription levels</div>
                  </div>
                  <Button size="sm" variant="outline">Modify</Button>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Bulk Operations</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 border rounded-lg">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Mass Communications</div>
                    <div className="text-xs text-muted-foreground">Send announcements to user groups</div>
                  </div>
                  <Button size="sm" variant="outline">Send</Button>
                </div>
                <div className="flex items-center space-x-3 p-2 border rounded-lg">
                  <Download className="w-4 h-4 text-green-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Export User Data</div>
                    <div className="text-xs text-muted-foreground">Generate user reports and analytics</div>
                  </div>
                  <Button size="sm" variant="outline">Export</Button>
                </div>
                <div className="flex items-center space-x-3 p-2 border rounded-lg">
                  <RefreshCw className="w-4 h-4 text-purple-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Data Cleanup</div>
                    <div className="text-xs text-muted-foreground">Remove inactive accounts and data</div>
                  </div>
                  <Button size="sm" variant="outline">Cleanup</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Ski Field Administrative Oversight" id="skifield-oversight">
        <div className="space-y-4">
          <p>Platform administrators have complete oversight of all ski field operations across New Zealand.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Queenstown Region', 'Canterbury Region', 'Otago Region', 
              'Waikato Region', 'Wellington Region', 'Taranaki Region'
            ].map((region, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{region}</h4>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {Math.floor(Math.random() * 8) + 2} Fields
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 500) + 100}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    Manage Region
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'access':
        return <AccessSection />;
      case 'platform-admin':
        return <PlatformAdminSection />;
      case 'skifield-admin':
        return <div className="text-center py-12 text-muted-foreground">Ski Field Admin Documentation - Coming Soon</div>;
      case 'emergency':
        return <div className="text-center py-12 text-muted-foreground">Emergency Procedures Documentation - Coming Soon</div>;
      case 'user-management':
        return <div className="text-center py-12 text-muted-foreground">User Management Guide - Coming Soon</div>;
      case 'system-monitoring':
        return <div className="text-center py-12 text-muted-foreground">System Monitoring Documentation - Coming Soon</div>;
      case 'best-practices':
        return <div className="text-center py-12 text-muted-foreground">Best Practices Guide - Coming Soon</div>;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-background overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r border-border overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Admin Management</h2>
                  <p className="text-sm text-muted-foreground">Administrative guide</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="mt-4">
              <Input
                placeholder="Search admin documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {adminDocSections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all text-left ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{section.label}</div>
                    <div className="text-xs opacity-75 truncate">{section.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-border bg-card/95 backdrop-blur-lg">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  {(() => {
                    const activeDoc = adminDocSections.find(s => s.id === activeSection);
                    const Icon = activeDoc?.icon || Shield;
                    return <Icon className="w-4 h-4 text-white" />;
                  })()}
                </div>
                <div>
                  <h1 className="text-lg font-semibold">
                    {adminDocSections.find(s => s.id === activeSection)?.label || 'Admin Management'}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {adminDocSections.find(s => s.id === activeSection)?.description || 'Administrative documentation'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin Guide
                </Badge>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
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