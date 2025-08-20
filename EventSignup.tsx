import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Building2,
  Heart,
  X,
  Check,
  CheckCircle,
  Calendar,
  Activity,
  Zap,
  Gift,
  DollarSign,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Upload
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { User as UserType } from '../src/types/index';

// Simplified registration types
export type RegistrationType = 'individual' | 'company';

interface EventSignupProps {
  currentUser?: UserType;
  onClose?: () => void;
  onSignupComplete?: (signupData: SignupData) => void;
}

interface SignupData {
  registrationType: RegistrationType;
  donationAmount: number;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  companyInfo?: {
    companyName: string;
    website?: string;
    description?: string;
    logo?: File;
  };
  eventId: string;
}

// Quick donation amounts
const quickAmounts = [25, 50, 100, 250];

// Event info
const eventInfo = {
  id: 'ski-for-cure-2024',
  title: 'Ski For A Cure NZ',
  eventDates: 'December 15-16, 2024'
};

// Registration types
const registrationTypes = [
  {
    type: 'individual' as const,
    title: 'Individual Participant',
    description: 'Join as an individual skier and track your personal skiing for charity',
    icon: User,
    features: [
      'Personal tracking dashboard',
      'Individual fundraising page', 
      'Achievement badges',
      'Social sharing tools'
    ],
    minAmount: 25,
    recommendedAmount: 50
  },
  {
    type: 'company' as const,
    title: 'Company Participation',
    description: 'Register your company and create corporate teams for employees',
    icon: Building2,
    features: [
      'Company admin dashboard',
      'Employee team management',
      'Custom branded page',
      'Corporate sponsorship tools',
      'Company-wide analytics'
    ],
    minAmount: 250,
    recommendedAmount: 500
  }
];

export function EventSignup({ currentUser, onClose, onSignupComplete }: EventSignupProps) {
  const [step, setStep] = useState<'select' | 'form' | 'success'>('select');
  const [selectedType, setSelectedType] = useState<RegistrationType | null>(null);
  const [donationAmount, setDonationAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Form data
  const [personalInfo, setPersonalInfo] = useState({
    name: currentUser?.displayName || currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    location: ''
  });
  
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    website: '',
    description: '',
    logo: undefined as File | undefined
  });

  const selectedTypeData = registrationTypes.find(t => t.type === selectedType);
  const finalDonationAmount = isCustomAmount ? parseFloat(customAmount) || 0 : donationAmount;
  const minAmount = selectedTypeData?.minAmount || 25;

  const handleTypeSelect = (type: RegistrationType) => {
    setSelectedType(type);
    const typeData = registrationTypes.find(t => t.type === type);
    setDonationAmount(typeData?.recommendedAmount || 50);
    setIsCustomAmount(false);
    setCustomAmount('');
    setStep('form');
  };

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount);
    setIsCustomAmount(false);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setCustomAmount(numericValue);
    setIsCustomAmount(true);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCompanyInfo(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType || finalDonationAmount < minAmount || !personalInfo.name || !personalInfo.email) return;
    
    if (selectedType === 'company' && !companyInfo.companyName) return;

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const signupData: SignupData = {
        registrationType: selectedType,
        donationAmount: finalDonationAmount,
        personalInfo,
        ...(selectedType === 'company' && { companyInfo }),
        eventId: eventInfo.id
      };
      
      onSignupComplete?.(signupData);
      setStep('success');
      
      setTimeout(() => {
        onClose?.();
      }, 3000);
      
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedType && 
    finalDonationAmount >= minAmount && 
    personalInfo.name && 
    personalInfo.email && 
    personalInfo.phone && 
    personalInfo.location &&
    (selectedType === 'individual' || companyInfo.companyName);

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
              className="w-16 h-16 mx-auto bg-gradient-to-br from-mountain-green to-green-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-midnight">Welcome to Ski For A Cure!</h3>
              <p className="text-muted-foreground">
                Thank you for your <span className="font-bold text-avalanche-orange">${finalDonationAmount}</span> contribution! 
                {selectedType === 'company' ? ' Your company ' : ' You '}now have access to Event Tracking features.
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-ultra-ice-blue/10 to-primary/15 border-2 border-ultra-ice-blue/30 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-ultra-ice-blue" />
                <span className="font-bold text-ultra-ice-blue">Event Tracking Unlocked</span>
                <Badge className="bg-mountain-green text-white px-2 py-1 text-xs">48 Hours</Badge>
              </div>
              <div className="text-sm text-ultra-ice-blue/80 flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Active during {eventInfo.eventDates}</span>
              </div>
            </div>
            
            <Button 
              onClick={onClose} 
              className="w-full h-12 bg-gradient-to-r from-ultra-ice-blue to-primary hover:from-ultra-ice-blue/90 hover:to-primary/90 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Activity className="w-4 h-4 mr-2" />
              Start Event Tracking
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <Card className="w-full max-w-2xl bg-white shadow-2xl border-0 rounded-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-ultra-ice-blue to-primary text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step === 'form' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('select')}
                  className="text-white hover:bg-white/10 -ml-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">{eventInfo.title}</CardTitle>
                  <p className="text-white/90 text-sm">{eventInfo.eventDates}</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 rounded-lg p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <AnimatePresence mode="wait">
            {step === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-midnight mb-2">
                    Choose Your Participation
                  </h2>
                  <p className="text-muted-foreground">
                    Select how you'd like to join Ski For A Cure NZ
                  </p>
                </div>

                <div className="grid gap-4">
                  {registrationTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Card
                        key={type.type}
                        className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 border-gray-200 hover:border-ultra-ice-blue"
                        onClick={() => handleTypeSelect(type.type)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-ultra-ice-blue/10 flex items-center justify-center">
                              <Icon className="w-6 h-6 text-ultra-ice-blue" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-midnight mb-1">{type.title}</h3>
                              <p className="text-muted-foreground text-sm mb-3">{type.description}</p>
                              
                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="outline" className="text-xs">
                                  Min: ${type.minAmount}
                                </Badge>
                                <Badge className="bg-ultra-ice-blue text-white text-xs">
                                  Recommended: ${type.recommendedAmount}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {type.features.map((feature, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Check className="w-3 h-3 text-mountain-green flex-shrink-0" />
                                    <span className="text-xs text-muted-foreground">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 'form' && selectedTypeData && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-ultra-ice-blue/10 flex items-center justify-center">
                    <selectedTypeData.icon className="w-5 h-5 text-ultra-ice-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-midnight">{selectedTypeData.title}</h2>
                    <p className="text-muted-foreground text-sm">Complete your registration</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Donation Amount */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-midnight">Contribution Amount</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleAmountSelect(amount)}
                          disabled={amount < minAmount}
                          className={`p-3 border-2 rounded-xl transition-all font-semibold min-h-[44px] ${
                            donationAmount === amount && !isCustomAmount
                              ? 'border-ultra-ice-blue bg-ultra-ice-blue/10 text-ultra-ice-blue'
                              : amount < minAmount
                              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                              : 'border-gray-200 hover:border-ultra-ice-blue/50 hover:bg-ultra-ice-blue/5'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground">Custom Amount (Min: ${minAmount})</Label>
                      <div className="flex items-center mt-1">
                        <span className="text-lg font-semibold text-muted-foreground mr-2">$</span>
                        <Input
                          type="text"
                          placeholder={`${minAmount} or more`}
                          value={customAmount}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          className="flex-1 h-10 border-2 rounded-lg focus:border-ultra-ice-blue"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-midnight flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Personal Information
                    </Label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-xs text-muted-foreground">Full Name *</Label>
                        <Input
                          id="name"
                          value={personalInfo.name}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                          placeholder="Your full name"
                          className="mt-1 h-10 border-2 rounded-lg focus:border-ultra-ice-blue"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-xs text-muted-foreground">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="mt-1 h-10 border-2 rounded-lg focus:border-ultra-ice-blue"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-xs text-muted-foreground">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                          placeholder="+64 21 123 4567"
                          className="mt-1 h-10 border-2 rounded-lg focus:border-ultra-ice-blue"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="location" className="text-xs text-muted-foreground">Location *</Label>
                        <Input
                          id="location"
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                          placeholder="City, Region"
                          className="mt-1 h-10 border-2 rounded-lg focus:border-ultra-ice-blue"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  {selectedType === 'company' && (
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-midnight flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Company Information
                      </Label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Label htmlFor="companyName" className="text-xs text-muted-foreground">Company Name *</Label>
                          <Input
                            id="companyName"
                            value={companyInfo.companyName}
                            onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                            placeholder="Your company name"
                            className="mt-1 h-10 border-2 rounded-lg focus:border-ultra-ice-blue"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="website" className="text-xs text-muted-foreground">Website</Label>
                          <Input
                            id="website"
                            type="url"
                            value={companyInfo.website}
                            onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                            placeholder="https://company.com"
                            className="mt-1 h-10 border-2 rounded-lg focus:border-ultra-ice-blue"
                          />
                        </div>

                        <div>
                          <Label htmlFor="logo" className="text-xs text-muted-foreground">Company Logo</Label>
                          <div className="mt-1 flex items-center gap-3">
                            <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                              {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <Upload className="w-4 h-4 text-gray-400" />
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
                                size="sm"
                                onClick={() => document.getElementById('logo')?.click()}
                                className="text-xs"
                              >
                                Choose Logo
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description" className="text-xs text-muted-foreground">Company Description</Label>
                        <Textarea
                          id="description"
                          value={companyInfo.description}
                          onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                          placeholder="Tell us about your company..."
                          rows={3}
                          className="mt-1 border-2 rounded-lg focus:border-ultra-ice-blue"
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={!isFormValid || isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-ultra-ice-blue to-primary hover:from-ultra-ice-blue/90 hover:to-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 mr-2"
                          >
                            <DollarSign className="w-4 h-4" />
                          </motion.div>
                          Processing Registration...
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 mr-2" />
                          Register & Contribute ${finalDonationAmount || 0}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-3">
                      Your contribution helps make skiing accessible to everyone in our community.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}