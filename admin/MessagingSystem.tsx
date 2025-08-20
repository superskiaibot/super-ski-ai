import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare,
  Send,
  Users,
  Mail,
  Smartphone,
  Bell,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  History,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Separator } from '../ui/separator';
import { User as UserType } from '../../src/types/index';

interface MessagingSystemProps {
  currentUser: UserType;
  userRole: 'platform_admin' | 'resort_admin' | 'event_manager';
  selectedResort: any;
  dateRange: string;
  onScreenChange: (screen: string) => void;
}

interface Message {
  id: string;
  title: string;
  content: string;
  target: string;
  channels: string[];
  recipients: number;
  delivered: number;
  failed: number;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
  author: string;
}

interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  userCount: number;
}

export function MessagingSystem({ 
  currentUser, 
  userRole, 
  selectedResort, 
  dateRange, 
  onScreenChange 
}: MessagingSystemProps) {
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<string>('all_resort');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['in_app']);
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Mock segments data
  const segments: AudienceSegment[] = [
    { id: 'all_resort', name: 'All Resort Users', description: 'All users who have selected this resort', userCount: 1247 },
    { id: 'event_participants', name: 'Event Participants', description: 'Users currently in active events', userCount: 156 },
    { id: 'on_mountain', name: 'Currently On Mountain', description: 'Users currently skiing', userCount: 89 },
    { id: 'high_activity', name: 'High Activity Users', description: 'Users with 20+ km today', userCount: 34 },
    { id: 'powder_hounds', name: 'Powder Hounds Team', description: 'Members of the Powder Hounds team', userCount: 23 }
  ];

  // Mock message history
  const [messageHistory] = useState<Message[]>([
    {
      id: '1',
      title: 'Fresh Powder Alert!',
      content: 'Amazing powder conditions on upper mountain! Get out there and enjoy 20cm of fresh snow.',
      target: 'All Resort Users',
      channels: ['in_app', 'push'],
      recipients: 1247,
      delivered: 1198,
      failed: 49,
      status: 'sent',
      createdAt: '2024-01-20T08:30:00Z',
      sentAt: '2024-01-20T08:32:00Z',
      author: 'Sarah Mitchell'
    },
    {
      id: '2',
      title: 'Event Reminder',
      content: 'Fresh Powder Challenge starts in 30 minutes! Don\'t forget to join the event.',
      target: 'Event Participants',
      channels: ['in_app', 'push', 'sms'],
      recipients: 156,
      delivered: 152,
      failed: 4,
      status: 'sent',
      createdAt: '2024-01-20T07:25:00Z',
      sentAt: '2024-01-20T07:30:00Z',
      author: 'Mike Johnson'
    },
    {
      id: '3',
      title: 'Weather Update',
      content: 'Visibility improving on upper mountain. Chairlift operations resuming normal schedule.',
      target: 'Currently On Mountain',
      channels: ['in_app'],
      recipients: 89,
      delivered: 89,
      failed: 0,
      status: 'sent',
      createdAt: '2024-01-20T11:15:00Z',
      sentAt: '2024-01-20T11:16:00Z',
      author: 'Alex Chen'
    }
  ]);

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const getEstimatedRecipients = () => {
    const segment = segments.find(s => s.id === selectedTarget);
    return segment?.userCount || 0;
  };

  const handleSendMessage = async () => {
    setIsSending(true);
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newMessage: Message = {
      id: Date.now().toString(),
      title: messageTitle,
      content: messageContent,
      target: segments.find(s => s.id === selectedTarget)?.name || 'Unknown',
      channels: selectedChannels,
      recipients: getEstimatedRecipients(),
      delivered: Math.floor(getEstimatedRecipients() * 0.96), // 96% delivery rate
      failed: Math.floor(getEstimatedRecipients() * 0.04),
      status: 'sent',
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      author: currentUser.displayName || currentUser.name
    };

    // In real app, would add to message history
    setIsSending(false);
    setIsConfirmDialogOpen(false);
    
    // Reset form
    setMessageTitle('');
    setMessageContent('');
    setSelectedTarget('all_resort');
    setSelectedChannels(['in_app']);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'in_app': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Bell className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getChannelName = (channel: string) => {
    switch (channel) {
      case 'in_app': return 'In-App';
      case 'push': return 'Push Notification';
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      default: return channel;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-700';
      case 'sending': return 'bg-blue-100 text-blue-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-NZ', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messaging System</h1>
          <p className="text-gray-600 mt-1">
            Send targeted messages to users and participants
          </p>
        </div>
        
        <Badge className="bg-blue-100 text-blue-700">
          {messageHistory.length} message{messageHistory.length !== 1 ? 's' : ''} sent
        </Badge>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Compose Message</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>Message History</span>
          </TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Compose Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Compose New Message</CardTitle>
                  <CardDescription>
                    Create and send a message to your target audience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Message Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Message Title *</Label>
                      <Input
                        id="title"
                        value={messageTitle}
                        onChange={(e) => setMessageTitle(e.target.value)}
                        placeholder="e.g. Fresh Powder Alert!"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Message Content *</Label>
                      <Textarea
                        id="content"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="Write your message here..."
                        rows={4}
                      />
                      <p className="text-sm text-gray-500">
                        {messageContent.length}/500 characters
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Audience Targeting */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="target">Target Audience *</Label>
                      <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          {segments.map(segment => (
                            <SelectItem key={segment.id} value={segment.id}>
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <div className="font-medium">{segment.name}</div>
                                  <div className="text-sm text-gray-500">{segment.description}</div>
                                </div>
                                <Badge variant="outline" className="ml-2">
                                  {segment.userCount}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {getEstimatedRecipients() > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-blue-700">
                          <Target className="w-4 h-4" />
                          <span className="font-medium">
                            Estimated Recipients: {getEstimatedRecipients().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Channel Selection */}
                  <div className="space-y-4">
                    <Label>Delivery Channels *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {['in_app', 'push', 'email', 'sms'].map(channel => (
                        <div
                          key={channel}
                          onClick={() => handleChannelToggle(channel)}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedChannels.includes(channel)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded bg-white border border-gray-200">
                            {getChannelIcon(channel)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{getChannelName(channel)}</div>
                            <div className="text-sm text-gray-500">
                              {channel === 'sms' && 'Additional charges may apply'}
                              {channel === 'email' && 'Requires email consent'}
                              {channel === 'push' && 'Instant notification'}
                              {channel === 'in_app' && 'Always available'}
                            </div>
                          </div>
                          {selectedChannels.includes(channel) && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Send Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          disabled={!messageTitle || !messageContent || selectedChannels.length === 0 || !selectedTarget}
                          className="w-full flex items-center justify-center space-x-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Message Send</DialogTitle>
                          <DialogDescription>
                            Please review your message before sending
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-700">Title</div>
                              <div className="text-gray-900">{messageTitle}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-700">Content</div>
                              <div className="text-gray-900">{messageContent}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-700">Recipients</div>
                              <div className="text-gray-900">
                                {segments.find(s => s.id === selectedTarget)?.name} ({getEstimatedRecipients().toLocaleString()} users)
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-700">Channels</div>
                              <div className="flex space-x-2 mt-1">
                                {selectedChannels.map(channel => (
                                  <Badge key={channel} variant="outline" className="flex items-center space-x-1">
                                    {getChannelIcon(channel)}
                                    <span>{getChannelName(channel)}</span>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-yellow-800">
                                <div className="font-medium">Rate Limiting Notice</div>
                                <div className="mt-1">
                                  Messages are sent in batches to ensure delivery. Large audiences may take several minutes to process.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSendMessage} disabled={isSending}>
                            {isSending ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4 mr-2"
                                >
                                  <Send className="w-4 h-4" />
                                </motion.div>
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send to {getEstimatedRecipients().toLocaleString()} users
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions & Segments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Quick Segments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Segments</CardTitle>
                  <CardDescription>
                    Popular audience targets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {segments.slice(0, 4).map(segment => (
                    <button
                      key={segment.id}
                      onClick={() => setSelectedTarget(segment.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedTarget === segment.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{segment.name}</div>
                          <div className="text-sm text-gray-500">{segment.description}</div>
                        </div>
                        <Badge variant="outline">{segment.userCount}</Badge>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Message Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Templates</CardTitle>
                  <CardDescription>
                    Common message templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: 'Weather Alert', content: 'Weather conditions update on the mountain...' },
                    { title: 'Event Reminder', content: 'Don\'t forget about the upcoming event...' },
                    { title: 'Safety Notice', content: 'Important safety information for all skiers...' },
                    { title: 'Lift Update', content: 'Chairlift operations update...' }
                  ].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setMessageTitle(template.title);
                        setMessageContent(template.content);
                      }}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{template.title}</div>
                      <div className="text-sm text-gray-500 truncate">{template.content}</div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Message History</CardTitle>
                <CardDescription>
                  Previously sent messages and their delivery status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messageHistory.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{message.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(message.status)}>
                                {message.status}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatDateTime(message.sentAt || message.createdAt)}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700">{message.content}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{message.target}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>{message.recipients.toLocaleString()} recipients</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>{message.delivered.toLocaleString()} delivered</span>
                            </div>
                            
                            {message.failed > 0 && (
                              <div className="flex items-center space-x-1">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span>{message.failed} failed</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {message.channels.map(channel => (
                              <Badge key={channel} variant="outline" className="flex items-center space-x-1">
                                {getChannelIcon(channel)}
                                <span>{getChannelName(channel)}</span>
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            Sent by {message.author}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}