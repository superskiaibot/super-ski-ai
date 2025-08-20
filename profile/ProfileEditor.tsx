import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  User, Mail, Phone, MapPin, Globe, Camera, Save, X, 
  Mountain, Settings, Shield, Users, Trophy, Bell,
  Eye, EyeOff, Upload, Edit3, Trash2, Plus
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Slider } from '../ui/slider';
import { User as UserType, Equipment, NotificationSettings, PrivacySettings, RecordingSettings } from '../../src/types/index';

interface ProfileEditorProps {
  user: UserType;
  onSave: (updatedUser: Partial<UserType>) => void;
  onClose: () => void;
  isOwnProfile?: boolean;
}

const newZealandResorts = [
  'Coronet Peak', 'The Remarkables', 'Cardrona Alpine Resort', 'Treble Cone',
  'Mt Hutt', 'Porters Ski Area', 'Temple Basin', 'Craigieburn', 'Mt Olympus',
  'Broken River', 'Mt Cheeseman', 'Mt Dobson', 'Ohau', 'Roundhill', 'Mt Lyford',
  'Hanmer Springs', 'Rainbow Ski Area', 'Awakino', 'Tukino', 'Whakapapa',
  'Turoa', 'Manganui', 'Mt Taranaki'
];

export function ProfileEditor({ user, onSave, onClose, isOwnProfile = true }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    displayName: user.displayName || user.name || '',
    username: user.username || '',
    email: user.email || '',
    phone: user.profile?.phone || '',
    location: user.profile?.location || user.location || '',
    website: user.profile?.website || '',
    bio: user.profile?.bio || '',
    
    // Skiing Information
    level: user.level || 'intermediate',
    equipment: user.preferences?.equipment || {
      type: 'alpine' as const,
      brand: '',
      model: '',
      length: undefined
    },
    favoriteResort: user.stats?.favoriteResort || '',
    
    // Account Settings
    units: user.preferences?.units || 'metric',
    language: user.preferences?.language || 'en',
    
    // Privacy Settings
    privacy: user.preferences?.privacy || {
      shareLocation: true,
      shareStats: true,
      publicProfile: true,
      allowFollowers: true,
      allowComments: true,
      allowDownloads: false
    },
    
    // Notification Settings
    notifications: user.preferences?.notifications || {
      push: true,
      email: true,
      weather: true,
      social: true,
      achievements: true,
      followers: true,
      comments: true,
      likes: true
    },
    
    // Recording Settings
    recording: user.preferences?.recording || {
      autoLiftDetection: true,
      jumpDetection: false,
      crashDetection: true,
      voiceCoaching: false,
      audioFeedback: true,
      gpsUpdateRate: 2,
      heartRateMonitoring: false,
      autoSave: true,
      videoRecording: false,
      shareByDefault: false
    },
    
    // Business Profile (if applicable)
    businessProfile: user.businessProfile || null
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(user.profile?.coverImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedUser: Partial<UserType> = {
        displayName: formData.displayName,
        username: formData.username,
        email: formData.email,
        level: formData.level,
        avatar: avatarPreview || user.avatar,
        preferences: {
          ...user.preferences,
          units: formData.units,
          language: formData.language,
          equipment: formData.equipment,
          privacy: formData.privacy,
          notifications: formData.notifications,
          recording: formData.recording
        },
        profile: {
          ...user.profile,
          displayName: formData.displayName,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          isPublic: formData.privacy.publicProfile,
          coverImage: coverPreview || user.profile?.coverImage,
          featuredRuns: user.profile?.featuredRuns || [],
          badges: user.profile?.badges || [],
          highlights: user.profile?.highlights || []
        },
        stats: {
          ...user.stats,
          favoriteResort: formData.favoriteResort
        },
        businessProfile: formData.businessProfile
      };

      onSave(updatedUser);
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    const names = formData.displayName.split(' ');
    return names.map(name => name.charAt(0)).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <p className="text-sm text-muted-foreground">
                Update your profile information and preferences
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                Unsaved Changes
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full justify-start p-6 pb-0 bg-transparent">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="skiing" className="flex items-center space-x-2">
                  <Mountain className="w-4 h-4" />
                  <span>Skiing</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="recording" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Recording</span>
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6 mt-0">
                  {/* Cover Photo */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Cover Photo</CardTitle>
                      <CardDescription>
                        Choose a cover photo that represents your skiing style
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div 
                          className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl overflow-hidden cursor-pointer group"
                          onClick={() => coverInputRef.current?.click()}
                        >
                          {coverPreview && (
                            <img 
                              src={coverPreview} 
                              alt="Cover" 
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCoverChange}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => coverInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Cover Photo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Avatar and Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Avatar */}
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={avatarPreview || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                              {getInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <button
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                          <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                              id="displayName"
                              value={formData.displayName}
                              onChange={(e) => handleInputChange('displayName', e.target.value)}
                              className={errors.displayName ? 'border-destructive' : ''}
                            />
                            {errors.displayName && <p className="text-sm text-destructive mt-1">{errors.displayName}</p>}
                          </div>
                          
                          <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              value={formData.username}
                              onChange={(e) => handleInputChange('username', e.target.value)}
                              className={errors.username ? 'border-destructive' : ''}
                            />
                            {errors.username && <p className="text-sm text-destructive mt-1">{errors.username}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={errors.email ? 'border-destructive' : ''}
                          />
                          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="Queenstown, NZ"
                          />
                        </div>

                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            placeholder="https://your-website.com"
                            className={errors.website ? 'border-destructive' : ''}
                          />
                          {errors.website && <p className="text-sm text-destructive mt-1">{errors.website}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Tell others about your skiing journey..."
                          className="min-h-20"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="units">Measurement Units</Label>
                          <Select
                            value={formData.units}
                            onValueChange={(value) => handleInputChange('units', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="metric">Metric (km, m, °C)</SelectItem>
                              <SelectItem value="imperial">Imperial (mi, ft, °F)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="language">Language</Label>
                          <Select
                            value={formData.language}
                            onValueChange={(value) => handleInputChange('language', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Skiing Tab */}
                <TabsContent value="skiing" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Skiing Experience</CardTitle>
                      <CardDescription>
                        Share your skiing level and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="level">Skill Level</Label>
                        <Select
                          value={formData.level}
                          onValueChange={(value) => handleInputChange('level', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Beginner</Badge>
                                <span>Green runs, learning turns</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="intermediate">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Intermediate</Badge>
                                <span>Blue runs, parallel turns</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="advanced">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Advanced</Badge>
                                <span>Black runs, all conditions</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="expert">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expert</Badge>
                                <span>Double black, off-piste</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="favoriteResort">Favorite New Zealand Resort</Label>
                        <Select
                          value={formData.favoriteResort}
                          onValueChange={(value) => handleInputChange('favoriteResort', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your favorite resort" />
                          </SelectTrigger>
                          <SelectContent className="max-h-48">
                            {newZealandResorts.map((resort) => (
                              <SelectItem key={resort} value={resort}>
                                {resort}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Equipment</CardTitle>
                      <CardDescription>
                        Tell us about your skiing equipment
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="equipmentType">Equipment Type</Label>
                        <Select
                          value={formData.equipment.type}
                          onValueChange={(value) => handleNestedChange('equipment', 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alpine">Alpine Skiing</SelectItem>
                            <SelectItem value="snowboard">Snowboarding</SelectItem>
                            <SelectItem value="telemark">Telemark</SelectItem>
                            <SelectItem value="cross_country">Cross Country</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="equipmentBrand">Brand</Label>
                          <Input
                            id="equipmentBrand"
                            value={formData.equipment.brand}
                            onChange={(e) => handleNestedChange('equipment', 'brand', e.target.value)}
                            placeholder="Rossignol"
                          />
                        </div>

                        <div>
                          <Label htmlFor="equipmentModel">Model</Label>
                          <Input
                            id="equipmentModel"
                            value={formData.equipment.model}
                            onChange={(e) => handleNestedChange('equipment', 'model', e.target.value)}
                            placeholder="Experience"
                          />
                        </div>

                        <div>
                          <Label htmlFor="equipmentLength">Length (cm)</Label>
                          <Input
                            id="equipmentLength"
                            type="number"
                            value={formData.equipment.length || ''}
                            onChange={(e) => handleNestedChange('equipment', 'length', parseInt(e.target.value) || undefined)}
                            placeholder="160"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Privacy Settings</CardTitle>
                      <CardDescription>
                        Control who can see your information and activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {Object.entries({
                        publicProfile: {
                          title: 'Public Profile',
                          description: 'Allow anyone to view your profile information'
                        },
                        shareLocation: {
                          title: 'Share Location',
                          description: 'Show your current location and resort'
                        },
                        shareStats: {
                          title: 'Share Statistics',
                          description: 'Allow others to see your skiing statistics'
                        },
                        allowFollowers: {
                          title: 'Allow Followers',
                          description: 'Let other users follow your skiing activities'
                        },
                        allowComments: {
                          title: 'Allow Comments',
                          description: 'Let followers comment on your runs and posts'
                        },
                        allowDownloads: {
                          title: 'Allow Downloads',
                          description: 'Let others download your run data'
                        }
                      }).map(([key, { title, description }]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor={key}>{title}</Label>
                            <p className="text-sm text-muted-foreground">{description}</p>
                          </div>
                          <Switch
                            id={key}
                            checked={formData.privacy[key as keyof PrivacySettings]}
                            onCheckedChange={(checked) => handleNestedChange('privacy', key, checked)}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Notification Preferences</CardTitle>
                      <CardDescription>
                        Choose what notifications you want to receive
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {Object.entries({
                        push: {
                          title: 'Push Notifications',
                          description: 'Receive push notifications on your device'
                        },
                        email: {
                          title: 'Email Notifications',
                          description: 'Receive notifications via email'
                        },
                        weather: {
                          title: 'Weather Alerts',
                          description: 'Get notified about weather conditions'
                        },
                        social: {
                          title: 'Social Activity',
                          description: 'Notifications about followers and social interactions'
                        },
                        achievements: {
                          title: 'Achievements',
                          description: 'Get notified when you unlock new achievements'
                        },
                        followers: {
                          title: 'New Followers',
                          description: 'Notifications when someone follows you'
                        },
                        comments: {
                          title: 'Comments',
                          description: 'Notifications about comments on your runs'
                        },
                        likes: {
                          title: 'Likes',
                          description: 'Notifications when someone likes your runs'
                        }
                      }).map(([key, { title, description }]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor={key}>{title}</Label>
                            <p className="text-sm text-muted-foreground">{description}</p>
                          </div>
                          <Switch
                            id={key}
                            checked={formData.notifications[key as keyof NotificationSettings]}
                            onCheckedChange={(checked) => handleNestedChange('notifications', key, checked)}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Recording Tab */}
                <TabsContent value="recording" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recording Settings</CardTitle>
                      <CardDescription>
                        Configure how Snowline tracks your skiing activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* GPS and Tracking */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">GPS & Tracking</h4>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Auto Lift Detection</Label>
                            <p className="text-sm text-muted-foreground">Automatically detect when you're on a lift</p>
                          </div>
                          <Switch
                            checked={formData.recording.autoLiftDetection}
                            onCheckedChange={(checked) => handleNestedChange('recording', 'autoLiftDetection', checked)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>GPS Update Rate</Label>
                          <p className="text-sm text-muted-foreground">
                            How often to record your position (affects battery life)
                          </p>
                          <div className="px-3">
                            <Slider
                              value={[formData.recording.gpsUpdateRate]}
                              onValueChange={([value]) => handleNestedChange('recording', 'gpsUpdateRate', value)}
                              max={5}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>1s (High battery)</span>
                              <span>{formData.recording.gpsUpdateRate}s</span>
                              <span>5s (Low battery)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Detection Features */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Detection Features</h4>
                        
                        {Object.entries({
                          jumpDetection: {
                            title: 'Jump Detection',
                            description: 'Detect and record jumps and airtime'
                          },
                          crashDetection: {
                            title: 'Crash Detection',
                            description: 'Safety feature to detect potential crashes'
                          },
                          heartRateMonitoring: {
                            title: 'Heart Rate Monitoring',
                            description: 'Connect to heart rate monitors for fitness tracking'
                          }
                        }).map(([key, { title, description }]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>{title}</Label>
                              <p className="text-sm text-muted-foreground">{description}</p>
                            </div>
                            <Switch
                              checked={formData.recording[key as keyof RecordingSettings]}
                              onCheckedChange={(checked) => handleNestedChange('recording', key, checked)}
                            />
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Audio & Feedback */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Audio & Feedback</h4>
                        
                        {Object.entries({
                          audioFeedback: {
                            title: 'Audio Feedback',
                            description: 'Hear audio alerts during tracking'
                          },
                          voiceCoaching: {
                            title: 'Voice Coaching',
                            description: 'Receive voice guidance and tips while skiing'
                          }
                        }).map(([key, { title, description }]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>{title}</Label>
                              <p className="text-sm text-muted-foreground">{description}</p>
                            </div>
                            <Switch
                              checked={formData.recording[key as keyof RecordingSettings]}
                              onCheckedChange={(checked) => handleNestedChange('recording', key, checked)}
                            />
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Data & Sharing */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Data & Sharing</h4>
                        
                        {Object.entries({
                          autoSave: {
                            title: 'Auto Save Runs',
                            description: 'Automatically save completed runs'
                          },
                          videoRecording: {
                            title: 'Video Recording',
                            description: 'Record videos during your runs'
                          },
                          shareByDefault: {
                            title: 'Share by Default',
                            description: 'Make new runs public by default'
                          }
                        }).map(([key, { title, description }]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>{title}</Label>
                              <p className="text-sm text-muted-foreground">{description}</p>
                            </div>
                            <Switch
                              checked={formData.recording[key as keyof RecordingSettings]}
                              onCheckedChange={(checked) => handleNestedChange('recording', key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Changes will be saved to your Snowline profile
            </p>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isLoading || !hasChanges}
                className="snowline-button-primary"
              >
                {isLoading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}