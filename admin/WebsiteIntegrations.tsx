import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Key, 
  Globe, 
  Database,
  Copy,
  RotateCcw,
  TestTube,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Zap,
  Clock,
  Activity,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
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
import { User as UserType } from '../../src/types/index';

interface WebsiteIntegrationsProps {
  currentUser: UserType;
  userRole: 'platform_admin' | 'resort_admin' | 'event_manager';
  selectedResort: any;
  dateRange: string;
  onScreenChange: (screen: string) => void;
}

interface ApiKeyData {
  key: string;
  maskedKey: string;
  lastRotated: string;
  status: 'active' | 'expired' | 'revoked';
}

interface WebhookData {
  url: string;
  status: 'connected' | 'failed' | 'pending';
  lastCall: string;
  lastError?: string;
}

interface DataSource {
  id: string;
  name: string;
  provider: string;
  enabled: boolean;
  status: 'connected' | 'error' | 'pending';
  lastSync: string;
  latency?: number;
  errorCount: number;
}

export function WebsiteIntegrations({ 
  currentUser, 
  userRole, 
  selectedResort, 
  dateRange, 
  onScreenChange 
}: WebsiteIntegrationsProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isRotatingKey, setIsRotatingKey] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<'success' | 'error' | null>(null);
  const [copiedApiKey, setCopiedApiKey] = useState(false);

  // Mock data
  const [apiKeyData] = useState<ApiKeyData>({
    key: 'sk_live_4Kz8vN2pL9mB6xQ3yR1jH7sE5tW9nF2a',
    maskedKey: 'sk_live_****************************nF2a',
    lastRotated: '2024-01-15T10:30:00Z',
    status: 'active'
  });

  const [webhookData, setWebhookData] = useState<WebhookData>({
    url: 'https://api.coronetpeak.co.nz/snowline/webhook',
    status: 'connected',
    lastCall: '2024-01-20T14:25:00Z'
  });

  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: 'weather',
      name: 'Weather Data',
      provider: 'MetService NZ',
      enabled: true,
      status: 'connected',
      lastSync: '2024-01-20T14:30:00Z',
      latency: 125,
      errorCount: 0
    },
    {
      id: 'snow-report',
      name: 'Snow Report',
      provider: 'Internal Sensors',
      enabled: true,
      status: 'connected',
      lastSync: '2024-01-20T14:28:00Z',
      latency: 89,
      errorCount: 0
    },
    {
      id: 'lift-status',
      name: 'Lift Status',
      provider: 'Lift Operations',
      enabled: true,
      status: 'error',
      lastSync: '2024-01-20T12:15:00Z',
      latency: undefined,
      errorCount: 3
    },
    {
      id: 'trail-conditions',
      name: 'Trail Conditions',
      provider: 'Ski Patrol',
      enabled: false,
      status: 'pending',
      lastSync: '2024-01-19T16:45:00Z',
      latency: undefined,
      errorCount: 0
    }
  ]);

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKeyData.key);
      setCopiedApiKey(true);
      setTimeout(() => setCopiedApiKey(false), 2000);
    } catch (err) {
      console.error('Failed to copy API key');
    }
  };

  const rotateApiKey = async () => {
    setIsRotatingKey(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRotatingKey(false);
    // In real app, would update the key data
  };

  const testWebhookConnection = async () => {
    setIsTestingWebhook(true);
    setWebhookTestResult(null);
    
    // Simulate webhook test
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Random success/failure for demo
    const success = Math.random() > 0.3;
    setWebhookTestResult(success ? 'success' : 'error');
    setIsTestingWebhook(false);
    
    if (!success) {
      setWebhookData(prev => ({
        ...prev,
        status: 'failed',
        lastError: 'Connection timeout after 5 seconds'
      }));
    } else {
      setWebhookData(prev => ({
        ...prev,
        status: 'connected',
        lastCall: new Date().toISOString(),
        lastError: undefined
      }));
    }
  };

  const toggleDataSource = (id: string, enabled: boolean) => {
    setDataSources(prev => prev.map(source => 
      source.id === id ? { ...source, enabled } : source
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-green-100 text-green-700';
      case 'error':
      case 'failed':
      case 'expired':
      case 'revoked':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Integrations</h1>
          <p className="text-gray-600 mt-1">
            Manage API keys, webhooks, and data source connections
          </p>
        </div>
        
        <Badge className={`${
          dataSources.filter(ds => ds.enabled && ds.status === 'connected').length === dataSources.filter(ds => ds.enabled).length
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {dataSources.filter(ds => ds.enabled && ds.status === 'connected').length} / {dataSources.filter(ds => ds.enabled).length} Connected
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Key Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-blue-600" />
                <span>API Key</span>
              </CardTitle>
              <CardDescription>
                Your API key for integrating with Snowline services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Key Display */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Current API Key</Label>
                  <Badge className={getStatusColor(apiKeyData.status)}>
                    {apiKeyData.status}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    value={showApiKey ? apiKeyData.key : apiKeyData.maskedKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyApiKey}
                    className={copiedApiKey ? 'bg-green-50 border-green-200' : ''}
                  >
                    {copiedApiKey ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="text-sm text-gray-500">
                  Last rotated: {formatTimeAgo(apiKeyData.lastRotated)}
                </div>
              </div>

              {/* API Key Actions */}
              <div className="space-y-3">
                <Separator />
                <div className="flex space-x-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex items-center space-x-2"
                        disabled={isRotatingKey}
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Rotate Key</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Rotate API Key?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will generate a new API key and invalidate the current one. 
                          Make sure to update all your integrations with the new key.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={rotateApiKey}>
                          {isRotatingKey ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Rotating...
                            </>
                          ) : (
                            'Rotate Key'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2"
                    onClick={() => window.open('https://docs.snowline.app/api', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Docs</span>
                  </Button>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Recent Usage</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Requests (24h)</div>
                    <div className="font-semibold">1,247</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Rate Limit</div>
                    <div className="font-semibold">5,000/hour</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Webhook Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-green-600" />
                <span>Webhook</span>
              </CardTitle>
              <CardDescription>
                Receive real-time updates about ski conditions and events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Webhook URL */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Webhook URL</Label>
                  <Badge className={getStatusColor(webhookData.status)}>
                    {webhookData.status}
                  </Badge>
                </div>
                
                <Input
                  value={webhookData.url}
                  onChange={(e) => setWebhookData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://your-domain.com/webhook"
                />

                {webhookData.lastError && (
                  <div className="flex items-start space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Connection Error</div>
                      <div>{webhookData.lastError}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Test Connection */}
              <div className="space-y-3">
                <Separator />
                <Button
                  onClick={testWebhookConnection}
                  disabled={isTestingWebhook}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  {isTestingWebhook ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Testing Connection...</span>
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4" />
                      <span>Test Connection</span>
                    </>
                  )}
                </Button>

                {webhookTestResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center space-x-2 p-3 rounded-lg ${
                      webhookTestResult === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {webhookTestResult === 'success' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {webhookTestResult === 'success' 
                        ? 'Connection successful!' 
                        : 'Connection failed'}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Connection Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Connection Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Call:</span>
                    <span>{formatTimeAgo(webhookData.lastCall)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Time:</span>
                    <span>142ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Success Rate:</span>
                    <span className="text-green-600">99.2%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Data Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-purple-600" />
              <span>Data Sources</span>
            </CardTitle>
            <CardDescription>
              External data feeds and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataSources.map((source, index) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={source.enabled}
                        onCheckedChange={(checked) => toggleDataSource(source.id, checked)}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{source.name}</div>
                        <div className="text-sm text-gray-500">{source.provider}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Status Info */}
                    <div className="text-right text-sm">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(source.status)}>
                          {source.status}
                        </Badge>
                        {source.latency && (
                          <span className="text-gray-500">{source.latency}ms</span>
                        )}
                      </div>
                      <div className="text-gray-500 mt-1">
                        {formatTimeAgo(source.lastSync)}
                      </div>
                    </div>

                    {/* Error Count */}
                    {source.errorCount > 0 && (
                      <Badge className="bg-red-100 text-red-700">
                        {source.errorCount} error{source.errorCount > 1 ? 's' : ''}
                      </Badge>
                    )}

                    {/* Status Indicator */}
                    <div className="flex items-center space-x-2">
                      {source.status === 'connected' && source.enabled && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <Activity className="w-4 h-4" />
                        </div>
                      )}
                      {source.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      {source.status === 'pending' && (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Data Sources Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    {dataSources.filter(ds => ds.enabled && ds.status === 'connected').length}
                  </div>
                  <div className="text-sm text-green-600">Active Connections</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">
                    {dataSources.reduce((sum, ds) => sum + ds.errorCount, 0)}
                  </div>
                  <div className="text-sm text-red-600">Total Errors (24h)</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">
                    {Math.round(dataSources.filter(ds => ds.latency).reduce((sum, ds) => sum + (ds.latency || 0), 0) / dataSources.filter(ds => ds.latency).length)}ms
                  </div>
                  <div className="text-sm text-blue-600">Avg Response Time</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}