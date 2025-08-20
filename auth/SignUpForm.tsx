import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, User, Mail, Phone, Lock, Mountain, ChevronDown, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User as UserType, Equipment } from '../../src/types/index';

interface SignUpFormData {
  // Basic Information
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  
  // Profile Information
  bio: string;
  location: string;
  website: string;
  avatar?: File;
  
  // Skiing Information
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  equipment: Partial<Equipment>;
  favoriteResort: string;
  
  // Account Type
  accountType: 'individual' | 'business' | 'team';
  
  // Business Profile (if applicable)
  companyName?: string;
  companyType?: 'ski_school' | 'resort' | 'equipment' | 'tour_guide' | 'photographer' | 'other';
  
  // Preferences
  units: 'metric' | 'imperial';
  privacy: 'public' | 'followers' | 'private';
  notifications: boolean;
  
  // Legal
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToMarketing: boolean;
}

interface SignUpFormProps {
  onSubmit: (userData: SignUpFormData) => void;
  onBackToLogin: () => void;
  isLoading?: boolean;
}

const newZealandResorts = [
  'Coronet Peak', 'The Remarkables', 'Cardrona Alpine Resort', 'Treble Cone',
  'Mt Hutt', 'Porters Ski Area', 'Temple Basin', 'Craigieburn', 'Mt Olympus',
  'Broken River', 'Mt Cheeseman', 'Mt Dobson', 'Ohau', 'Roundhill', 'Mt Lyford',
  'Hanmer Springs', 'Rainbow Ski Area', 'Awakino', 'Tukino', 'Whakapapa',
  'Turoa', 'Manganui', 'Mt Taranaki'
];

export function SignUpForm({ onSubmit, onBackToLogin, isLoading = false }: SignUpFormProps) {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bio: '',
    location: '',
    website: '',
    skillLevel: 'intermediate',
    equipment: {
      type: 'alpine',
      brand: '',
      model: '',
      length: undefined
    },
    favoriteResort: '',
    accountType: 'individual',
    units: 'metric',
    privacy: 'public',
    notifications: true,
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToMarketing: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});

  const totalSteps = 4;

  const handleInputChange = (field: keyof SignUpFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleEquipmentChange = (field: keyof Equipment, value: any) => {
    setFormData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [field]: value
      }
    }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (step === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
      if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep) && currentStep === totalSteps) {
      onSubmit(formData);
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Account Details';
      case 2: return 'Profile Information';
      case 3: return 'Skiing Preferences';
      case 4: return 'Preferences & Terms';
      default: return 'Sign Up';
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Create your Snowline account with basic information';
      case 2: return 'Tell us about yourself and customize your profile';
      case 3: return 'Share your skiing experience and equipment preferences';
      case 4: return 'Set your preferences and agree to our terms';
      default: return 'Join the Snowline community';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-glacier-blue via-snow to-powder-gray flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="snowline-card-elevated">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Mountain className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Join Snowline
              </CardTitle>
              <CardDescription className="text-base">
                {getStepDescription(currentStep)}
              </CardDescription>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      i + 1 <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-all ${
                        i + 1 < currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold">{getStepTitle(currentStep)}</h3>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Account Details */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="Sarah"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`pl-10 ${errors.firstName ? 'border-destructive' : ''}`}
                        />
                      </div>
                      {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Peterson"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={errors.lastName ? 'border-destructive' : ''}
                      />
                      {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="sarahski"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={errors.username ? 'border-destructive' : ''}
                    />
                    {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="sarah@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+64 21 123 4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Profile Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Avatar Upload */}
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={avatarPreview || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                          {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <Label htmlFor="avatar" className="cursor-pointer">
                          <div className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Upload Photo</span>
                          </div>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about your skiing journey..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="min-h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Queenstown, NZ"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://your-website.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select
                      value={formData.accountType}
                      onValueChange={(value) => handleInputChange('accountType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual Skier</SelectItem>
                        <SelectItem value="business">Business/Professional</SelectItem>
                        <SelectItem value="team">Team/Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.accountType === 'business' && (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          placeholder="Alpine Ski School"
                          value={formData.companyName || ''}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyType">Company Type</Label>
                        <Select
                          value={formData.companyType}
                          onValueChange={(value) => handleInputChange('companyType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select company type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ski_school">Ski School</SelectItem>
                            <SelectItem value="resort">Ski Resort</SelectItem>
                            <SelectItem value="equipment">Equipment Rental</SelectItem>
                            <SelectItem value="tour_guide">Tour Guide</SelectItem>
                            <SelectItem value="photographer">Photographer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Skiing Preferences */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="skillLevel">Skill Level</Label>
                    <Select
                      value={formData.skillLevel}
                      onValueChange={(value) => handleInputChange('skillLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Beginner</Badge>
                            <span>Green runs, pizza turns</span>
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

                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium">Equipment Preferences</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="equipmentType">Equipment Type</Label>
                      <Select
                        value={formData.equipment.type}
                        onValueChange={(value) => handleEquipmentChange('type', value)}
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="equipmentBrand">Brand (Optional)</Label>
                        <Input
                          id="equipmentBrand"
                          placeholder="Rossignol"
                          value={formData.equipment.brand || ''}
                          onChange={(e) => handleEquipmentChange('brand', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="equipmentLength">Length (Optional)</Label>
                        <Input
                          id="equipmentLength"
                          type="number"
                          placeholder="160"
                          value={formData.equipment.length || ''}
                          onChange={(e) => handleEquipmentChange('length', parseInt(e.target.value) || undefined)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
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
                </motion.div>
              )}

              {/* Step 4: Preferences & Terms */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium">App Preferences</h4>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="units">Measurement Units</Label>
                        <p className="text-sm text-muted-foreground">Choose metric or imperial units</p>
                      </div>
                      <Select
                        value={formData.units}
                        onValueChange={(value) => handleInputChange('units', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="metric">Metric</SelectItem>
                          <SelectItem value="imperial">Imperial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="privacy">Default Privacy</Label>
                        <p className="text-sm text-muted-foreground">Who can see your runs by default</p>
                      </div>
                      <Select
                        value={formData.privacy}
                        onValueChange={(value) => handleInputChange('privacy', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="followers">Followers</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications about runs and social activity</p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={formData.notifications}
                        onCheckedChange={(checked) => handleInputChange('notifications', checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Legal Agreements</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Switch
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor="agreeToTerms" className="cursor-pointer">
                            I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a>
                          </Label>
                          {errors.agreeToTerms && <p className="text-sm text-destructive mt-1">{errors.agreeToTerms}</p>}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Switch
                          id="agreeToPrivacy"
                          checked={formData.agreeToPrivacy}
                          onCheckedChange={(checked) => handleInputChange('agreeToPrivacy', checked)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor="agreeToPrivacy" className="cursor-pointer">
                            I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                          </Label>
                          {errors.agreeToPrivacy && <p className="text-sm text-destructive mt-1">{errors.agreeToPrivacy}</p>}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Switch
                          id="agreeToMarketing"
                          checked={formData.agreeToMarketing}
                          onCheckedChange={(checked) => handleInputChange('agreeToMarketing', checked)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor="agreeToMarketing" className="cursor-pointer">
                            I agree to receive marketing communications (optional)
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="w-24"
                  >
                    Previous
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onBackToLogin}
                    className="w-24"
                  >
                    Back
                  </Button>
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-24 snowline-button-primary"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-32 snowline-button-primary"
                  >
                    {isLoading ? 'Creating...' : 'Create Account'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}