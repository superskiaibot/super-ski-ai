import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Building2, 
  User, 
  ChevronRight, 
  Heart, 
  Mountain,
  ArrowLeft,
  Check,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Crown,
  Shield
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';

interface SignupData {
  type: 'individual' | 'team' | 'business';
  name: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  logo?: File;
  description?: string;
  teamName?: string;
  businessName?: string;
  targetAmount?: number;
  isPublic: boolean;
}

interface SkiForACureSignupProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupComplete: (data: SignupData) => void;
  preSelectedType?: 'individual' | 'team' | 'business' | null;
}

export function SkiForACureSignup({ isOpen, onClose, onSignupComplete, preSelectedType }: SkiForACureSignupProps) {
  const [step, setStep] = useState<'select' | 'form' | 'confirmation'>('select');
  const [selectedType, setSelectedType] = useState<'individual' | 'team' | 'business' | null>(null);
  const [signupData, setSignupData] = useState<Partial<SignupData>>({
    isPublic: true
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Handle pre-selected type - skip selection step
  useEffect(() => {
    if (preSelectedType && isOpen) {
      setSelectedType(preSelectedType);
      setSignupData(prev => ({ ...prev, type: preSelectedType }));
      setStep('form'); // Skip directly to form
    } else if (isOpen && !preSelectedType) {
      // Reset to selection step if no pre-selected type
      setStep('select');
      setSelectedType(null);
    }
  }, [preSelectedType, isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setSelectedType(null);
      setSignupData({ isPublic: true });
      setLogoPreview(null);
    }
  }, [isOpen]);

  const signupTypes = [
    {
      type: 'individual' as const,
      title: 'Individual Participant',
      description: 'Join as an individual skier and track your personal vertical descent for charity',
      icon: User,
      features: [
        'Personal tracking dashboard',
        'Individual fundraising page',
        'Achievement badges',
        'Social sharing tools'
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      type: 'team' as const,
      title: 'Team Registration',
      description: 'Create or join a team and compete together for the charity cause',
      icon: Users,
      features: [
        'Team admin dashboard',
        'Member management tools',
        'Customizable team page',
        'Collective fundraising tracking',
        'Team leaderboards'
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      type: 'business' as const,
      title: 'Business Sponsor',
      description: 'Register your business and create corporate teams for employees',
      icon: Building2,
      features: [
        'Business admin console',
        'Employee team management',
        'Custom branded page',
        'Corporate sponsorship tools',
        'Company-wide analytics',
        'Marketing integration'
      ],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const handleTypeSelect = (type: 'individual' | 'team' | 'business') => {
    setSelectedType(type);
    setSignupData(prev => ({ ...prev, type }));
    setStep('form');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSignupData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmation');
  };

  const handleConfirmSignup = () => {
    onSignupComplete(signupData as SignupData);
    onClose();
  };

  const handleBack = () => {
    if (step === 'form') {
      // If there's a pre-selected type, go back to close the modal
      if (preSelectedType) {
        onClose();
      } else {
        // Otherwise go back to type selection
        setStep('select');
      }
    } else if (step === 'confirmation') {
      setStep('form');
    }
  };

  const isTeamOrBusiness = selectedType === 'team' || selectedType === 'business';
  const currentTypeData = signupTypes.find(t => t.type === selectedType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(step !== 'select' || preSelectedType) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-white hover:bg-white/20 -ml-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Ski For A Cure NZ</h1>
                  <p className="text-white/80 text-sm">Charity Event Registration</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm text-white/80">
                {step === 'select' && !preSelectedType && 'Choose your participation type'}
                {(step === 'form' || (step === 'select' && preSelectedType)) && 'Complete your registration'}
                {step === 'confirmation' && 'Confirm your details'}
              </span>
            </div>
            <Progress 
              value={
                step === 'select' && !preSelectedType ? 33 : 
                step === 'form' || (step === 'select' && preSelectedType) ? 66 : 100
              } 
              className="h-2 bg-white/20"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <AnimatePresence mode="wait">
            {step === 'select' && !preSelectedType && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Join the Movement
                  </h2>
                  <p className="text-gray-600">
                    Choose how you'd like to participate in Ski For A Cure NZ
                  </p>
                </div>

                <div className="grid gap-6">
                  {signupTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Card
                        key={type.type}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 ${type.borderColor}`}
                        onClick={() => handleTypeSelect(type.type)}
                      >
                        <CardHeader className={`${type.bgColor} rounded-t-lg`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md`}>
                              <Icon className={`w-6 h-6 ${type.color}`} />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl text-gray-900">{type.title}</CardTitle>
                              <CardDescription className="text-gray-600 mt-1">
                                {type.description}
                              </CardDescription>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {type.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {(step === 'form' || (step === 'select' && preSelectedType)) && currentTypeData && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${currentTypeData.bgColor} flex items-center justify-center`}>
                      <currentTypeData.icon className={`w-5 h-5 ${currentTypeData.color}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{currentTypeData.title}</h2>
                      <p className="text-gray-600 text-sm">Complete your registration details</p>
                    </div>
                  </div>
                  {isTeamOrBusiness && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Admin Access</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        You will become the {selectedType} admin with full management capabilities and a customizable page.
                      </p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={signupData.name || ''}
                          onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={signupData.email || ''}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          required
                          value={signupData.phone || ''}
                          onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+64 21 123 4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          required
                          value={signupData.location || ''}
                          onChange={(e) => setSignupData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="City, Region"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Team/Business Specific Fields */}
                  {isTeamOrBusiness && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {selectedType === 'team' ? <Users className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                          {selectedType === 'team' ? 'Team Details' : 'Business Details'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="orgName">
                              {selectedType === 'team' ? 'Team Name' : 'Business Name'} *
                            </Label>
                            <Input
                              id="orgName"
                              required
                              value={selectedType === 'team' ? signupData.teamName || '' : signupData.businessName || ''}
                              onChange={(e) => setSignupData(prev => ({ 
                                ...prev, 
                                [selectedType === 'team' ? 'teamName' : 'businessName']: e.target.value 
                              }))}
                              placeholder={selectedType === 'team' ? 'Enter team name' : 'Enter business name'}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="website">Website (Optional)</Label>
                            <Input
                              id="website"
                              type="url"
                              value={signupData.website || ''}
                              onChange={(e) => setSignupData(prev => ({ ...prev, website: e.target.value }))}
                              placeholder="https://your-website.com"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="targetAmount">Fundraising Target (NZD)</Label>
                            <Input
                              id="targetAmount"
                              type="number"
                              value={signupData.targetAmount || ''}
                              onChange={(e) => setSignupData(prev => ({ ...prev, targetAmount: parseInt(e.target.value) }))}
                              placeholder="5000"
                            />
                          </div>
                        </div>

                        {/* Logo Upload */}
                        <div>
                          <Label htmlFor="logo">
                            {selectedType === 'team' ? 'Team Logo' : 'Business Logo'} (Optional)
                          </Label>
                          <div className="mt-2">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                {logoPreview ? (
                                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <Upload className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <input
                                  id="logo"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleLogoUpload}
                                  className="hidden"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => document.getElementById('logo')?.click()}
                                >
                                  Choose Logo
                                </Button>
                                <p className="text-sm text-gray-500 mt-1">
                                  PNG, JPG up to 2MB. Square format recommended.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={signupData.description || ''}
                            onChange={(e) => setSignupData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder={`Tell us about your ${selectedType}...`}
                            rows={3}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      {preSelectedType ? 'Cancel' : 'Back'}
                    </Button>
                    <Button type="submit" className="flex-1">
                      Continue to Review
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'confirmation' && currentTypeData && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Ready to Join!
                  </h2>
                  <p className="text-gray-600">
                    Please review your registration details before confirming
                  </p>
                </div>

                <Card>
                  <CardHeader className={`${currentTypeData.bgColor} rounded-t-lg`}>
                    <div className="flex items-center gap-3">
                      <currentTypeData.icon className={`w-6 h-6 ${currentTypeData.color}`} />
                      <div>
                        <CardTitle>{currentTypeData.title}</CardTitle>
                        <CardDescription>Registration Summary</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Name</span>
                        <p className="font-medium">{signupData.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email</span>
                        <p className="font-medium">{signupData.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Phone</span>
                        <p className="font-medium">{signupData.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Location</span>
                        <p className="font-medium">{signupData.location}</p>
                      </div>
                      
                      {isTeamOrBusiness && (
                        <>
                          <div>
                            <span className="text-sm text-gray-500">
                              {selectedType === 'team' ? 'Team Name' : 'Business Name'}
                            </span>
                            <p className="font-medium">
                              {selectedType === 'team' ? signupData.teamName : signupData.businessName}
                            </p>
                          </div>
                          {signupData.website && (
                            <div>
                              <span className="text-sm text-gray-500">Website</span>
                              <p className="font-medium">{signupData.website}</p>
                            </div>
                          )}
                          {signupData.targetAmount && (
                            <div>
                              <span className="text-sm text-gray-500">Fundraising Target</span>
                              <p className="font-medium">NZD ${signupData.targetAmount.toLocaleString()}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {isTeamOrBusiness && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Admin Benefits</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                          <div className="flex items-center gap-2">
                            <Check className="w-3 h-3" />
                            <span>Full management dashboard</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-3 h-3" />
                            <span>Member/employee management</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-3 h-3" />
                            <span>Customizable {selectedType} page</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-3 h-3" />
                            <span>Logo and branding tools</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('form')}
                    className="flex-1"
                  >
                    Edit Details
                  </Button>
                  <Button
                    onClick={handleConfirmSignup}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Confirm Registration
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}