import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, 
  Users, 
  Settings, 
  Map, 
  Shield, 
  Code, 
  Zap, 
  Mountain, 
  Activity, 
  Smartphone, 
  Globe, 
  Database, 
  Heart, 
  Trophy, 
  CreditCard, 
  Terminal, 
  Play, 
  Eye, 
  Lock, 
  Unlock, 
  User, 
  UserCheck, 
  Building2, 
  Search, 
  HelpCircle, 
  FileText, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown,
  X,
  Menu
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { User as UserType } from '../src/types/index';

interface DocumentationProps {
  currentUser: UserType;
  onClose: () => void;
}

type DocSection = 
  | 'overview'
  | 'accounts'
  | 'tracking'
  | 'social'
  | 'admin'
  | 'development'
  | 'api'
  | 'troubleshooting';

export function Documentation({ currentUser, onClose }: DocumentationProps) {
  const [activeSection, setActiveSection] = useState<DocSection>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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
  const docSections = [
    {
      id: 'overview' as DocSection,
      label: 'Getting Started',
      description: 'Application overview and setup',
      icon: Book,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'accounts' as DocSection,
      label: 'User Accounts',
      description: 'Account types and access',
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'tracking' as DocSection,
      label: 'GPS Tracking',
      description: 'Tracking features and usage',
      icon: Map,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'social' as DocSection,
      label: 'Social Features',
      description: 'Community and events',
      icon: Heart,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'admin' as DocSection,
      label: 'Admin Controls',
      description: 'Administrative features',
      icon: Shield,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'development' as DocSection,
      label: 'Development',
      description: 'Technical information',
      icon: Code,
      color: 'from-gray-600 to-gray-700'
    },
    {
      id: 'api' as DocSection,
      label: 'API Reference',
      description: 'Backend and integrations',
      icon: Database,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'troubleshooting' as DocSection,
      label: 'Troubleshooting',
      description: 'Common issues and solutions',
      icon: HelpCircle,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  // Code block component
  const CodeBlock = ({ code, language = 'typescript', copyId }: { code: string; language?: string; copyId: string }) => (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleCopy(code, copyId)}
        className="absolute top-2 right-2 h-8 w-8 p-0 text-gray-400 hover:text-white"
      >
        {copiedText === copyId ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );

  // Collapsible section component
  const CollapsibleSection = ({ title, children, id, defaultOpen = false }: { 
    title: string; 
    children: React.ReactNode; 
    id: string; 
    defaultOpen?: boolean 
  }) => {
    const isExpanded = expandedItems.includes(id) || defaultOpen;
    
    return (
      <div className="border rounded-lg">
        <button
          onClick={() => toggleExpanded(id)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
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

  // Getting Started Section
  const OverviewSection = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto">
          <Mountain className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Snowline Documentation</h1>
          <p className="text-lg text-muted-foreground">Complete guide to New Zealand's premier ski tracking platform</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>Quick Start</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>For Skiers</span>
              </h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Select your account type (Basic or Pro)</li>
                <li>2. Choose your ski field from the resort selector</li>
                <li>3. Start tracking your runs with GPS</li>
                <li>4. Join the Ski For A Cure charity events</li>
                <li>5. Connect with other skiers and share achievements</li>
              </ol>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-600" />
                <span>For Administrators</span>
              </h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Access admin panel with proper credentials</li>
                <li>2. Manage users, ski fields, and events</li>
                <li>3. Monitor system health and analytics</li>
                <li>4. Configure platform settings</li>
                <li>5. Handle emergency situations</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Map className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold">GPS Tracking</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Real-time GPS tracking with 3D terrain visualization and detailed run analytics.
          </p>
          <Button size="sm" variant="outline" onClick={() => setActiveSection('tracking')}>
            Learn More <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <h3 className="font-semibold">Social Features</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Connect with skiers, join charity events, and share your skiing adventures.
          </p>
          <Button size="sm" variant="outline" onClick={() => setActiveSection('social')}>
            Learn More <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold">User Management</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Multiple account types with different access levels and features.
          </p>
          <Button size="sm" variant="outline" onClick={() => setActiveSection('accounts')}>
            Learn More <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Frontend', tech: 'React + TypeScript', icon: Code, color: 'blue' },
              { name: 'Styling', tech: 'Tailwind CSS v4', icon: Smartphone, color: 'green' },
              { name: 'Maps', tech: 'Mapbox GL JS', icon: Globe, color: 'purple' },
              { name: 'Backend', tech: 'Supabase', icon: Database, color: 'orange' }
            ].map((item, index) => (
              <div key={index} className={`p-4 rounded-lg border bg-${item.color}-50 border-${item.color}-200`}>
                <item.icon className={`w-6 h-6 text-${item.color}-600 mb-2`} />
                <h4 className={`font-semibold text-${item.color}-900`}>{item.name}</h4>
                <p className={`text-sm text-${item.color}-700`}>{item.tech}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // User Accounts Section
  const AccountsSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">User Account System</h2>
        <p className="text-muted-foreground">Snowline supports three distinct account types, each with specific access levels and capabilities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <User className="w-5 h-5" />
              <span>Normal User</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Access Levels:</h4>
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Basic (Free)</Badge>
                <Badge className="bg-blue-600 text-white">Pro (Premium)</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Demo Accounts:</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-white rounded border">
                  <strong>Sarah Peterson (Basic)</strong>
                  <br />Username: sarahski
                  <br />Email: sarah@example.com
                </div>
                <div className="p-2 bg-white rounded border">
                  <strong>Mike Chen (Pro)</strong>
                  <br />Username: mikepowder
                  <br />Email: mike@example.com
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Features:</h4>
              <ul className="text-sm space-y-1 text-blue-800">
                <li>• GPS tracking and run recording</li>
                <li>• Social features and friend connections</li>
                <li>• Basic analytics and statistics</li>
                <li>• Charity event participation</li>
                <li>• Pro: Advanced analytics & features</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-900">
              <Mountain className="w-5 h-5" />
              <span>Ski Field Admin</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Access Level:</h4>
              <Badge className="bg-green-600 text-white">Resort Administrator</Badge>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Demo Account:</h4>
              <div className="p-2 bg-white rounded border text-sm">
                <strong>Lisa Rodriguez</strong>
                <br />Username: coronetadmin
                <br />Email: lisa@coronetpeak.co.nz
                <br />Manages: Coronet Peak & The Remarkables
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-green-900 mb-2">Capabilities:</h4>
              <ul className="text-sm space-y-1 text-green-800">
                <li>• Manage specific ski field operations</li>
                <li>• Lift and trail management</li>
                <li>• Weather station monitoring</li>
                <li>• Staff management and scheduling</li>
                <li>• Resort-specific analytics</li>
                <li>• Event management at their resort</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-900">
              <Shield className="w-5 h-5" />
              <span>Platform Admin</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-red-900 mb-2">Access Level:</h4>
              <Badge variant="destructive">Master Administrator</Badge>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-900 mb-2">Demo Account:</h4>
              <div className="p-2 bg-white rounded border text-sm">
                <strong>Alex Rider</strong>
                <br />Username: alexrider
                <br />Email: alex@snowline.app
                <br />Access: Full Platform Control
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-red-900 mb-2">Full Control:</h4>
              <ul className="text-sm space-y-1 text-red-800">
                <li>• Complete user management</li>
                <li>• All ski field oversight</li>
                <li>• System-wide analytics</li>
                <li>• Emergency controls</li>
                <li>• Platform configuration</li>
                <li>• Billing and revenue management</li>
                <li>• Developer tools access</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <CollapsibleSection title="How to Switch Between Accounts" id="account-switching">
        <div className="space-y-4">
          <p>You can easily switch between different account types to test various features:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Mobile Method</span>
              </h4>
              <ol className="text-sm space-y-1">
                <li>1. Tap the profile icon in the bottom navigation</li>
                <li>2. Tap your name/avatar in the top section</li>
                <li>3. Select from available demo accounts</li>
                <li>4. The app will switch immediately</li>
              </ol>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <Settings className="w-4 h-4 text-green-600" />
                <span>Desktop Method</span>
              </h4>
              <ol className="text-sm space-y-1">
                <li>1. Click the user avatar in the sidebar</li>
                <li>2. Click "Switch Account" from the dropdown</li>
                <li>3. Choose your desired account type</li>
                <li>4. All features will update automatically</li>
              </ol>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Account Persistence</h4>
                <p className="text-sm text-blue-800 mt-1">
                  Your selected account and all data will persist across browser sessions. Each account maintains 
                  its own settings, tracking data, and social connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Account Features Comparison" id="feature-comparison">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-3 text-left font-semibold">Feature</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">Basic User</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">Pro User</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">Ski Field Admin</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">Platform Admin</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['GPS Tracking', '✓', '✓', '✓', '✓'],
                ['Basic Analytics', '✓', '✓', '✓', '✓'],
                ['Advanced Analytics', '✗', '✓', '✓', '✓'],
                ['Social Features', '✓', '✓', '✓', '✓'],
                ['Charity Events', '✓', '✓', '✓', '✓'],
                ['Resort Management', '✗', '✗', '✓ (Assigned)', '✓ (All)'],
                ['User Management', '✗', '✗', '✗', '✓'],
                ['System Controls', '✗', '✗', '✗', '✓'],
                ['Emergency Controls', '✗', '✗', '✗', '✓'],
                ['Developer Tools', '✗', '✗', '✗', '✓']
              ].map(([feature, basic, pro, skiAdmin, platformAdmin], index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 p-3 font-medium">{feature}</td>
                  <td className="border border-gray-300 p-3 text-center">
                    {basic === '✓' ? <CheckCircle className="w-4 h-4 text-green-600 mx-auto" /> : 
                     <X className="w-4 h-4 text-red-400 mx-auto" />}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {pro === '✓' ? <CheckCircle className="w-4 h-4 text-green-600 mx-auto" /> : 
                     <X className="w-4 h-4 text-red-400 mx-auto" />}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-sm">
                    {skiAdmin.includes('✓') ? <CheckCircle className="w-4 h-4 text-green-600 mx-auto" /> : 
                     skiAdmin.includes('✗') ? <X className="w-4 h-4 text-red-400 mx-auto" /> : skiAdmin}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-sm">
                    {platformAdmin.includes('✓') ? <CheckCircle className="w-4 h-4 text-green-600 mx-auto" /> : 
                     platformAdmin.includes('✗') ? <X className="w-4 h-4 text-red-400 mx-auto" /> : platformAdmin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>
    </div>
  );

  // GPS Tracking Section
  const TrackingSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">GPS Tracking System</h2>
        <p className="text-muted-foreground">Advanced GPS tracking with real-time analytics and 3D terrain visualization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-green-600" />
              <span>Getting Started</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">1</div>
                <div>
                  <strong>Select Your Resort</strong>
                  <p className="text-sm text-muted-foreground">Choose from 25+ New Zealand ski fields using the resort selector.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">2</div>
                <div>
                  <strong>Enable Location Services</strong>
                  <p className="text-sm text-muted-foreground">Grant GPS permissions when prompted for accurate tracking.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">3</div>
                <div>
                  <strong>Start Tracking</strong>
                  <p className="text-sm text-muted-foreground">Tap the large tracking button to begin recording your session.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">4</div>
                <div>
                  <strong>Monitor Live Stats</strong>
                  <p className="text-sm text-muted-foreground">View real-time speed, distance, and elevation data.</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Live Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-orange-900">Speed</div>
                <div className="text-sm text-orange-700">Real-time km/h</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-blue-900">Time</div>
                <div className="text-sm text-blue-700">Session duration</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Map className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-green-900">Distance</div>
                <div className="text-sm text-green-700">Total kilometers</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mountain className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-purple-900">Elevation</div>
                <div className="text-sm text-purple-700">Vertical meters <Badge variant="secondary" className="text-xs">Pro</Badge></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CollapsibleSection title="Map Features and Controls" id="map-features">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Map Styles</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span><strong>Terrain:</strong> Topographic with elevation lines</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span><strong>Satellite:</strong> High-resolution aerial imagery</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span><strong>Hybrid:</strong> Satellite with terrain overlay</span>
                </li>
              </ul>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <Eye className="w-4 h-4 text-green-600" />
                <span>Interactive Controls</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• Pinch to zoom in/out</li>
                <li>• Drag to pan around the map</li>
                <li>• Two-finger rotate for 3D view</li>
                <li>• Tap fullscreen for immersive mode</li>
                <li>• Real-time GPS position tracking</li>
              </ul>
            </Card>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900">Fullscreen Mode</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  In fullscreen mode, analytics cards are repositioned to the top-left corner for easy access 
                  while maintaining full map visibility. Tap the minimize button to return to normal view.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Tracking Controls and States" id="tracking-controls">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-green-900">LIVE</h4>
                <p className="text-sm text-green-800">Actively recording GPS data and updating analytics in real-time.</p>
              </div>
            </Card>

            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">||</span>
                </div>
                <h4 className="font-semibold text-yellow-900">PAUSED</h4>
                <p className="text-sm text-yellow-800">Tracking paused. Resume anytime to continue recording your session.</p>
              </div>
            </Card>

            <Card className="p-4 border-gray-200 bg-gray-50">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">■</span>
                </div>
                <h4 className="font-semibold text-gray-900">STOPPED</h4>
                <p className="text-sm text-gray-800">Session ended. Data saved and ready to review or share.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Control Actions:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">Start</Button>
                <span className="text-sm">Begin new tracking session</span>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700">Pause</Button>
                <span className="text-sm">Temporarily halt recording</span>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Resume</Button>
                <span className="text-sm">Continue paused session</span>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Button size="sm" variant="destructive">Stop</Button>
                <span className="text-sm">End session and save data</span>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Advanced Pro Features" id="pro-features">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span>Pro Analytics</span>
                <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Detailed elevation tracking and charts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Calorie burn estimation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Advanced run analytics and comparisons</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Historical data and trends</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Export capabilities (GPX, KML)</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Pro Subscription</span>
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-900">$9.99/month</div>
                  <div className="text-sm text-blue-700">Full access to premium features</div>
                  <Button className="w-full mt-3">Upgrade to Pro</Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Pro users get access to advanced analytics, detailed elevation tracking, and priority support.
              </p>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Social Features Section
  const SocialSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Social Features & Community</h2>
        <p className="text-muted-foreground">Connect with fellow skiers and participate in charity events across New Zealand ski fields.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <span>Ski For A Cure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              New Zealand's premier charity ski event supporting cancer research. Join individual, team, or business participation.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-900">Funds Raised</span>
                <span className="text-green-900 font-bold">$124,750</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-900">Participants</span>
                <span className="text-blue-900 font-bold">1,847</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-900">Days Remaining</span>
                <span className="text-purple-900 font-bold">7</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fundraising Progress</span>
                <span>62.4%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-pink-500 to-rose-600 h-2 rounded-full" style={{ width: '62.4%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Friend System</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect with other skiers, share achievements, and compete on leaderboards.
            </p>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Features:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Send and receive friend requests</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>View friends' recent activity</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Compare statistics and achievements</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Share runs and celebrate milestones</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Find Friends
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CollapsibleSection title="Event Participation Types" id="event-participation">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                <User className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-blue-900">Individual</h4>
              <p className="text-sm text-blue-800">Participate as an individual skier with personal fundraising goals.</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Personal fundraising page</li>
                <li>• Individual progress tracking</li>
                <li>• Personal achievement badges</li>
                <li>• Direct donation collection</li>
              </ul>
            </div>
          </Card>

          <Card className="p-4 border-green-200 bg-green-50">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-green-900">Team</h4>
              <p className="text-sm text-green-800">Join or create teams with friends and compete together.</p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Team fundraising goals</li>
                <li>• Collaborative progress tracking</li>
                <li>• Team leaderboards</li>
                <li>• Shared achievements</li>
              </ul>
            </div>
          </Card>

          <Card className="p-4 border-purple-200 bg-purple-50">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-purple-900">Business</h4>
              <p className="text-sm text-purple-800">Corporate sponsorship with company branding and recognition.</p>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Company profile pages</li>
                <li>• Corporate branding</li>
                <li>• Employee participation</li>
                <li>• Sponsor recognition</li>
              </ul>
            </div>
          </Card>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="How to Join Events" id="join-events">
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900">Resort Selection Required</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  Event participation is only available after selecting your ski field. Events are location-specific 
                  and only appear for resorts where they are actively running.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Step-by-Step Process:</h4>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">1</span>
                  <span>Navigate to the Tracking tab and select your ski field</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">2</span>
                  <span>Go to the "Ski For A Cure" tab to see available events</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">3</span>
                  <span>Choose your participation type (Individual/Team/Business)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">4</span>
                  <span>Complete the signup form with your details</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">5</span>
                  <span>Access your event management panel and start fundraising</span>
                </li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">After Signup:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Access to comprehensive admin panel</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Personalized fundraising page</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Progress tracking and analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Team management tools (if applicable)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Event schedule and updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Admin Controls Section
  const AdminSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Administrative Controls</h2>
        <p className="text-muted-foreground">Comprehensive admin tools for platform and ski field management.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-900">
              <Shield className="w-5 h-5" />
              <span>Platform Admin Console</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-red-800">
              Master control panel with absolute authority over the entire Snowline platform.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-red-900">Core Modules:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Emergency Controls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>User Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Ski Field Oversight</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>System Monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Billing & Revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span>Developer Tools</span>
                </div>
              </div>
            </div>

            <div className="bg-red-100 border border-red-300 rounded-lg p-3">
              <h5 className="font-semibold text-red-900 text-sm">Access Method:</h5>
              <p className="text-xs text-red-800 mt-1">
                Desktop: Click profile → "Admin Console"<br />
                Mobile: Profile tab → Account switcher → Alex Rider → Admin options
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-900">
              <Mountain className="w-5 h-5" />
              <span>Ski Field Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-green-800">
              Resort-specific management tools for ski field administrators.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-green-900">Management Areas:</h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Lift Operations & Status</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Trail Management & Conditions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Weather Station Monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Staff Management & Scheduling</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Resort Analytics & Reports</span>
                </div>
              </div>
            </div>

            <div className="bg-green-100 border border-green-300 rounded-lg p-3">
              <h5 className="font-semibold text-green-900 text-sm">Auto-Assignment:</h5>
              <p className="text-xs text-green-800 mt-1">
                Ski field admins are automatically assigned to their designated resorts. 
                Lisa Rodriguez manages Coronet Peak & The Remarkables.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <CollapsibleSection title="Emergency Controls" id="emergency-controls">
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Critical System Controls</h4>
                <p className="text-sm text-red-800 mt-1">
                  Platform admins have access to emergency controls that can immediately affect the entire system. 
                  Use these controls only when absolutely necessary.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4 border-red-200">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-red-900">Platform Lockdown</h4>
                <p className="text-sm text-red-800">Immediately disable all user access to the platform.</p>
                <Button variant="destructive" size="sm" className="w-full">Emergency Lock</Button>
              </div>
            </Card>

            <Card className="p-4 border-orange-200">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">||</span>
                </div>
                <h4 className="font-semibold text-orange-900">Pause Tracking</h4>
                <p className="text-sm text-orange-800">Stop all GPS tracking services platform-wide.</p>
                <Button variant="outline" size="sm" className="w-full border-orange-300 text-orange-700">Pause All</Button>
              </div>
            </Card>

            <Card className="p-4 border-blue-200">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-blue-900">System Recovery</h4>
                <p className="text-sm text-blue-800">Restore platform from last known good state.</p>
                <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-700">Restore</Button>
              </div>
            </Card>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Emergency Contact System:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-red-50 border-red-200">
                <h5 className="font-semibold text-red-900">Primary Incident Response</h5>
                <p className="text-sm text-red-800">+64 21 123 4567</p>
                <Button size="sm" variant="outline" className="mt-2 border-red-300 text-red-700">Call Now</Button>
              </Card>
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h5 className="font-semibold text-blue-900">Technical Emergency</h5>
                <p className="text-sm text-blue-800">+64 21 234 5678</p>
                <Button size="sm" variant="outline" className="mt-2 border-blue-300 text-blue-700">Call Now</Button>
              </Card>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="User Management" id="user-management">
        <div className="space-y-4">
          <p>Platform admins have comprehensive control over all user accounts and permissions.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">User Operations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <span>Activate/deactivate accounts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-red-600" />
                  <span>Suspend user access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Upgrade/downgrade permissions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <span>Manage subscriptions</span>
                </li>
              </ul>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Bulk Operations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Mass user communications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Export user data</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-orange-600" />
                  <span>Analytics and reporting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-gray-600" />
                  <span>Data cleanup operations</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="System Monitoring" id="system-monitoring">
        <div className="space-y-4">
          <p>Real-time monitoring of all platform systems and services.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Server Load', value: '68%', status: 'warning', color: 'yellow' },
              { name: 'Active Users', value: '847', status: 'good', color: 'green' },
              { name: 'Response Time', value: '120ms', status: 'good', color: 'green' },
              { name: 'Uptime', value: '99.9%', status: 'excellent', color: 'blue' }
            ].map((metric, index) => (
              <Card key={index} className="p-3">
                <div className="text-center space-y-2">
                  <div className={`text-lg font-bold text-${metric.color}-600`}>{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.name}</div>
                  <div className={`w-2 h-2 bg-${metric.color}-500 rounded-full mx-auto`}></div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Service Health</h4>
              <div className="space-y-2">
                {[
                  { service: 'GPS Tracking', status: 'Operational' },
                  { service: 'Database', status: 'Healthy' },
                  { service: 'Payment Gateway', status: 'Connected' },
                  { service: 'Email Service', status: 'Operational' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">{item.service}</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">{item.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Recent Alerts</h4>
              <div className="space-y-2">
                <div className="p-2 bg-red-50 rounded border border-red-200">
                  <div className="text-sm font-medium text-red-900">Security Alert</div>
                  <div className="text-xs text-red-700">2 failed admin login attempts</div>
                </div>
                <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                  <div className="text-sm font-medium text-yellow-900">High Server Load</div>
                  <div className="text-xs text-yellow-700">GPS tracking above 70% threshold</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Development Section
  const DevelopmentSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Development Information</h2>
        <p className="text-muted-foreground">Technical details for developers working with the Snowline platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-blue-600" />
              <span>Technology Stack</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm text-blue-900 mb-2">Frontend</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline">React 18</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Tailwind CSS v4</Badge>
                  <Badge variant="outline">Motion/React</Badge>
                  <Badge variant="outline">Shadcn/UI</Badge>
                  <Badge variant="outline">Lucide Icons</Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-green-900 mb-2">Maps & Location</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className="bg-green-50">Mapbox GL JS</Badge>
                  <Badge variant="outline" className="bg-green-50">GPS Web API</Badge>
                  <Badge variant="outline" className="bg-green-50">3D Terrain</Badge>
                  <Badge variant="outline" className="bg-green-50">Real-time Tracking</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-purple-900 mb-2">Backend</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className="bg-purple-50">Supabase</Badge>
                  <Badge variant="outline" className="bg-purple-50">PostgreSQL</Badge>
                  <Badge variant="outline" className="bg-purple-50">Edge Functions</Badge>
                  <Badge variant="outline" className="bg-purple-50">Real-time DB</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-green-600" />
              <span>Project Structure</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock
              code={`snowline/
├── components/          # React components
│   ├── ui/             # Shadcn/UI components
│   ├── tracking/       # GPS & map components
│   ├── social/         # Social features
│   ├── admin/          # Admin interfaces
│   └── event/          # Event management
├── src/
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript definitions
│   ├── utils/          # Utility functions
│   └── constants/      # App constants
└── styles/
    └── globals.css     # Tailwind + custom CSS`}
              copyId="project-structure"
            />
          </CardContent>
        </Card>
      </div>

      <CollapsibleSection title="Environment Setup" id="environment-setup">
        <div className="space-y-4">
          <h4 className="font-semibold">Prerequisites</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Node.js 18+ and npm/yarn</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Mapbox account and access token</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Supabase project (optional for full backend)</span>
            </li>
          </ul>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Installation</h4>
              <CodeBlock
                code={`# Clone the repository
git clone https://github.com/your-org/snowline.git
cd snowline

# Install dependencies
npm install

# Start development server
npm run dev`}
                copyId="installation"
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Mapbox Configuration</h4>
              <CodeBlock
                code={`// src/constants/index.ts
export const MAPBOX_CONFIG = {
  accessToken: 'pk.your_mapbox_token_here',
  style: 'mapbox://styles/mapbox/outdoors-v12',
  center: [168.6626, -45.0302], // Queenstown, NZ
  zoom: 10
};`}
                copyId="mapbox-config"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Component Architecture" id="component-architecture">
        <div className="space-y-4">
          <p>Snowline follows a modular component architecture with clear separation of concerns.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Core Components</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-xs">App.tsx</code> - Main application controller</li>
                <li><code className="text-xs">UnifiedTracking</code> - GPS tracking interface</li>
                <li><code className="text-xs">MapView</code> - 3D map component</li>
                <li><code className="text-xs">LiveStatsCards</code> - Real-time analytics</li>
                <li><code className="text-xs">Social</code> - Community features</li>
              </ul>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Admin Components</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-xs">AdminConsole</code> - Platform admin interface</li>
                <li><code className="text-xs">SkiFieldAdminDashboard</code> - Resort management</li>
                <li><code className="text-xs">UserManagement</code> - User administration</li>
                <li><code className="text-xs">SystemControl</code> - System operations</li>
                <li><code className="text-xs">EmergencyControls</code> - Crisis management</li>
              </ul>
            </li>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Component Example</h4>
            <CodeBlock
              code={`interface TrackingComponentProps {
  currentUser: User;
  isTracking: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  runs: SavedRun[];
}

export function UnifiedTracking({ 
  currentUser, 
  isTracking, 
  onStartTracking,
  onStopTracking,
  runs 
}: TrackingComponentProps) {
  return (
    <div className="snowline-tracking-container">
      <MapView />
      <LiveStatsCards />
      <TrackingControls 
        isTracking={isTracking}
        onStart={onStartTracking}
        onStop={onStopTracking}
      />
    </div>
  );
}`}
              copyId="component-example"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="State Management" id="state-management">
        <div className="space-y-4">
          <p>Snowline uses a combination of React hooks and custom state management for different concerns.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Custom Hooks</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-xs">useAppState</code> - Global application state</li>
                <li><code className="text-xs">useAppHandlers</code> - Event handlers and actions</li>
                <li><code className="text-xs">useLocalStorage</code> - Persistent data storage</li>
                <li><code className="text-xs">useMediaQuery</code> - Responsive design helpers</li>
              </ul>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">State Categories</h4>
              <ul className="space-y-2 text-sm">
                <li>🔹 <strong>User State:</strong> Authentication, profile, preferences</li>
                <li>🔹 <strong>Tracking State:</strong> GPS data, sessions, analytics</li>
                <li>🔹 <strong>UI State:</strong> Navigation, modals, responsive layout</li>
                <li>🔹 <strong>Admin State:</strong> Management interfaces, system status</li>
              </ul>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold mb-2">State Hook Example</h4>
            <CodeBlock
              code={`export function useAppState() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [runs, setRuns] = useState<SavedRun[]>([]);
  
  // Load persisted state
  useEffect(() => {
    const savedUser = localStorage.getItem('snowline_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);
  
  return {
    currentUser,
    setCurrentUser,
    isTracking,
    setIsTracking,
    selectedResort,
    setSelectedResort,
    runs,
    setRuns
  };
}`}
              copyId="state-hook-example"
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Render the main content based on active section
  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'accounts':
        return <AccountsSection />;
      case 'tracking':
        return <TrackingSection />;
      case 'social':
        return <SocialSection />;
      case 'admin':
        return <AdminSection />;
      case 'development':
        return <DevelopmentSection />;
      case 'api':
        return <div className="text-center py-12 text-muted-foreground">API Documentation - Coming Soon</div>;
      case 'troubleshooting':
        return <div className="text-center py-12 text-muted-foreground">Troubleshooting Guide - Coming Soon</div>;
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Book className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Documentation</h2>
                  <p className="text-sm text-muted-foreground">Complete guide</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="mt-4">
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {docSections.map(section => {
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
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  {(() => {
                    const activeSection = docSections.find(s => s.id === activeSection);
                    const Icon = activeSection?.icon || Book;
                    return <Icon className="w-4 h-4 text-white" />;
                  })()}
                </div>
                <div>
                  <h1 className="text-lg font-semibold">
                    {docSections.find(s => s.id === activeSection)?.label || 'Documentation'}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {docSections.find(s => s.id === activeSection)?.description || 'Complete platform guide'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  v2.4.1
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
                {renderMainContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}