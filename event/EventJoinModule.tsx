import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Users, Building2, User, ArrowRight, X, Check,
  CreditCard, Clock, Info, ChevronLeft, Copy, AlertCircle,
  Star, Trophy, Target, DollarSign, Shield, Gift, ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';

export interface EventJoinModuleProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinComplete: (data: EventJoinData) => void;
  eventData?: {
    title: string;
    dateRange: string;
    participantCount: number;
    raised: number;
    goal: number;
    isActive: boolean;
  };
  initialMode?: 'individual' | 'team' | 'business';
  showAsModal?: boolean; // true for tracking page modal, false for inline on ski-for-a-cure page
  onRedirectToTracking?: (mode: 'individual' | 'team' | 'business') => void;
}

export interface EventJoinData {
  participationType: 'individual' | 'team' | 'business';
  userInfo: {
    name: string;
    email: string;
  };
  teamInfo?: {
    teamName?: string;
    joinCode?: string;
    action: 'create' | 'join';
  };
  businessInfo?: {
    companyName: string;
    teamSize: number;
  };
  paymentCompleted: boolean;
  donationAmount?: number;
  skiField?: string;
}

type JoinStep = 'selection' | 'details' | 'payment' | 'success';
type ParticipationType = 'individual' | 'team' | 'business';

export function EventJoinModule({
  isOpen,
  onClose,
  onJoinComplete,
  eventData,
  initialMode,
  showAsModal = true,
  onRedirectToTracking
}: EventJoinModuleProps) {
  const [currentStep, setCurrentStep] = useState<JoinStep>('selection');
  const [selectedType, setSelectedType] = useState<ParticipationType | null>(initialMode || null);
  const [teamAction, setTeamAction] = useState<'create' | 'join'>('create');
  const [isLoading, setIsLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [selectedDonationAmount, setSelectedDonationAmount] = useState<number | null>(null);
  const [customDonationAmount, setCustomDonationAmount] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    teamName: '',
    joinCode: '',
    companyName: '',
    teamSize: 1,
    donationAmount: 0
  });

  // Mock event data if not provided
  const defaultEventData = {
    title: 'Ski for a Cure Global 2025',
    dateRange: '30th-31st August 2025',
    participantCount: 2847,
    raised: 285000,
    goal: 500000,
    isActive: true
  };

  const event = eventData || defaultEventData;

  // Donation amount options - with $ symbols
  const donationOptions = [
    { amount: 5, label: '$5' },
    { amount: 10, label: '$10' },
    { amount: 25, label: '$25' }
  ];

  const resetForm = () => {
    setCurrentStep('selection');
    setSelectedType(initialMode || null);
    setTeamAction('create');
    setFormData({
      name: '',
      email: '',
      teamName: '',
      joinCode: '',
      companyName: '',
      teamSize: 1,
      donationAmount: 0
    });
    setSelectedDonationAmount(null);
    setCustomDonationAmount('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTypeSelection = (type: ParticipationType) => {
    setSelectedType(type);
    
    // If on Ski for a Cure page, redirect to Tracking
    if (!showAsModal && onRedirectToTracking) {
      onRedirectToTracking(type);
      return;
    }
    
    setCurrentStep('details');
  };

  const handleDetailsSubmit = () => {
    if (!selectedType) return;

    // Validate required fields
    if (!formData.name || !formData.email) {
      return;
    }

    if (selectedType === 'team') {
      if (teamAction === 'create' && !formData.teamName) {
        return;
      }
      if (teamAction === 'join' && !formData.joinCode) {
        return;
      }
    }

    if (selectedType === 'business' && (!formData.companyName || formData.teamSize < 1)) {
      return;
    }

    setCurrentStep('payment');
  };

  const handleDonationSelect = (amount: number) => {
    setSelectedDonationAmount(amount);
    setFormData(prev => ({ ...prev, donationAmount: amount }));
    setCustomDonationAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomDonationAmount(value);
    const numericValue = parseInt(value) || 0;
    setSelectedDonationAmount(null);
    setFormData(prev => ({ ...prev, donationAmount: numericValue }));
  };

  const handlePaymentSubmit = async () => {
    if (!selectedType) return;

    // Validation: Donation is now compulsory
    if (formData.donationAmount <= 0) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const joinData: EventJoinData = {
        participationType: selectedType,
        userInfo: {
          name: formData.name,
          email: formData.email
        },
        paymentCompleted: true,
        donationAmount: formData.donationAmount
      };

      if (selectedType === 'team') {
        joinData.teamInfo = {
          action: teamAction,
          ...(teamAction === 'create' ? { teamName: formData.teamName } : { joinCode: formData.joinCode })
        };
      }

      if (selectedType === 'business') {
        joinData.businessInfo = {
          companyName: formData.companyName,
          teamSize: formData.teamSize
        };
      }

      setCurrentStep('success');
      
      // Complete join after success screen
      setTimeout(() => {
        onJoinComplete(joinData);
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTeamCode = () => {
    return `SNOW25${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

  const renderSelectionStep = () => (
    <div className="space-y-6 p-6">
      {/* Header - Matching Social Page Design Exactly */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-ultra-ice-blue/10 flex items-center justify-center">
          <Heart className="w-5 h-5 text-ultra-ice-blue" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-midnight">Join Ski For A Cure NZ</h2>
          <p className="text-muted-foreground text-sm">Choose how you'd like to participate in the charity event</p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">{event.dateRange}</p>
        </div>
      </div>

      {/* Participation Options - Exact Match to Social Page */}
      <div className="space-y-3">
        {/* Individual */}
        <button
          onClick={() => handleTypeSelection('individual')}
          className="w-full p-4 rounded-2xl border border-border bg-background hover:border-ultra-ice-blue/50 transition-colors duration-200 text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-mountain-green/10 flex items-center justify-center">
                <User className="w-5 h-5 text-mountain-green" />
              </div>
              <div>
                <h3 className="font-semibold text-midnight">Individual</h3>
                <p className="text-sm text-muted-foreground">Join as a solo participant</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-ultra-ice-blue transition-colors" />
          </div>
        </button>

        {/* Team */}
        <button
          onClick={() => handleTypeSelection('team')}
          className="w-full p-4 rounded-2xl border border-border bg-background hover:border-ultra-ice-blue/50 transition-colors duration-200 text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-ultra-ice-blue/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-ultra-ice-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-midnight">Team</h3>
                <p className="text-sm text-muted-foreground">Create or join a team</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-ultra-ice-blue transition-colors" />
          </div>
        </button>

        {/* Business */}
        <button
          onClick={() => handleTypeSelection('business')}
          className="w-full p-4 rounded-2xl border border-border bg-background hover:border-ultra-ice-blue/50 transition-colors duration-200 text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-avalanche-orange/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-avalanche-orange" />
              </div>
              <div>
                <h3 className="font-semibold text-midnight">Business</h3>
                <p className="text-sm text-muted-foreground">Corporate participation</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-ultra-ice-blue transition-colors" />
          </div>
        </button>
      </div>

      {/* Footer note */}
      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">
          Registration is required to access tracking features
        </p>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCurrentStep('selection')}
          className="rounded-xl hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-xl font-semibold text-midnight">
            {selectedType === 'individual' && 'Individual Registration'}
            {selectedType === 'team' && 'Team Registration'}
            {selectedType === 'business' && 'Business Registration'}
          </h3>
          <p className="text-muted-foreground">Enter your details to continue</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-midnight">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              className="rounded-xl border-2 focus:border-primary h-12 px-4"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-midnight">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              className="rounded-xl border-2 focus:border-primary h-12 px-4"
            />
          </div>
        </div>

        {/* Team-specific fields */}
        {selectedType === 'team' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={teamAction === 'create' ? 'default' : 'outline'}
                onClick={() => setTeamAction('create')}
                className="rounded-xl h-12 font-semibold"
              >
                Create Team
              </Button>
              <Button
                variant={teamAction === 'join' ? 'default' : 'outline'}
                onClick={() => setTeamAction('join')}
                className="rounded-xl h-12 font-semibold"
              >
                Join with Code
              </Button>
            </div>

            {teamAction === 'create' && (
              <div className="space-y-3">
                <Label htmlFor="teamName" className="text-sm font-semibold text-midnight">Team Name *</Label>
                <Input
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                  placeholder="Enter team name"
                  className="rounded-xl border-2 focus:border-primary h-12 px-4"
                />
                {formData.teamName && (
                  <div className="mt-4 p-4 bg-ultra-ice-blue/5 rounded-xl border border-ultra-ice-blue/20">
                    <p className="text-sm font-semibold text-midnight mb-2">Your Team Code:</p>
                    <div className="flex items-center space-x-3">
                      <code className="bg-ultra-ice-blue text-white px-4 py-2 rounded-xl font-bold text-lg">
                        {generateTeamCode()}
                      </code>
                      <Button size="sm" variant="ghost" className="rounded-xl">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Share this code with team members</p>
                  </div>
                )}
              </div>
            )}

            {teamAction === 'join' && (
              <div className="space-y-2">
                <Label htmlFor="joinCode" className="text-sm font-semibold text-midnight">Team Join Code *</Label>
                <Input
                  id="joinCode"
                  value={formData.joinCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, joinCode: e.target.value.toUpperCase() }))}
                  placeholder="SNOW25XXXXXX"
                  className="rounded-xl border-2 focus:border-primary h-12 px-4 font-mono"
                />
              </div>
            )}
          </div>
        )}

        {/* Business-specific fields */}
        {selectedType === 'business' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-semibold text-midnight">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter company name"
                className="rounded-xl border-2 focus:border-primary h-12 px-4"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teamSize" className="text-sm font-semibold text-midnight">Expected Team Size *</Label>
              <Select
                value={formData.teamSize.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, teamSize: parseInt(value) }))}
              >
                <SelectTrigger className="rounded-xl border-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(20)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1} {i === 0 ? 'person' : 'people'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <Button 
        onClick={handleDetailsSubmit}
        className="w-full rounded-xl h-12 text-lg font-semibold bg-primary hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200"
        disabled={!formData.name || !formData.email || 
          (selectedType === 'team' && teamAction === 'create' && !formData.teamName) ||
          (selectedType === 'team' && teamAction === 'join' && !formData.joinCode) ||
          (selectedType === 'business' && (!formData.companyName || formData.teamSize < 1))
        }
      >
        Continue to Payment
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="bg-white">
      {/* Header - EXACT match to Ski For A Cure donation modal */}
      <div className="text-center pt-8 pb-6 px-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCurrentStep('details')}
          className="absolute left-4 top-4 rounded-full h-8 w-8 p-0 hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Make a difference</h2>
        <p className="text-gray-600 text-base leading-relaxed max-w-xs mx-auto">
          Every dollar helps support cancer research and patient care
        </p>
      </div>

      <div className="px-6 pb-6">
        {/* Donation Amount Selection - Compulsory with $ symbols */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">Select donation amount</h3>
          <p className="text-sm text-gray-600 mb-4 text-center">A donation is required to participate</p>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {donationOptions.map((option) => (
              <button
                key={option.amount}
                onClick={() => handleDonationSelect(option.amount)}
                className={`p-4 rounded-2xl border-2 transition-all text-center ${
                  selectedDonationAmount === option.amount 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-2xl font-bold text-gray-900">{option.label}</div>
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or enter custom amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
              <Input
                type="number"
                value={customDonationAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="0"
                className="text-center font-semibold rounded-xl border-2 border-gray-200 focus:border-blue-500 h-12 pl-8"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Your Impact Section - Updated with $ symbols */}
        <div className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 text-center">Your impact</h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <span>$5 funds essential research materials</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <span>$10 supports 1 hour of lab research</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <span>$25 helps fund patient care programs</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <span>$50+ contributes to breakthrough research</span>
            </div>
          </div>
        </div>

        {/* Total Display - Show selected donation amount */}
        {formData.donationAmount > 0 && (
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-6">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span className="text-gray-900">Your donation</span>
              <span className="text-blue-600">${formData.donationAmount}</span>
            </div>
          </div>
        )}

        {/* Error message if no donation selected */}
        {formData.donationAmount <= 0 && (
          <div className="bg-red-50 rounded-2xl p-4 border border-red-200 mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Please select a donation amount to continue</span>
            </div>
          </div>
        )}
      </div>

      {/* Trust Indicators - EXACT copy from Ski For A Cure page */}
      <div className="bg-green-50 border-t border-green-200 px-6 py-4">
        <div className="flex items-center justify-center gap-6 text-xs text-green-700">
          <div className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span className="font-medium">Tax deductible</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-green-700" />
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span className="font-medium">Secure payment</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-green-700" />
          <div className="flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            <span className="font-medium">Instant receipt</span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className="p-6 pt-4">
        <Button 
          onClick={handlePaymentSubmit}
          className="w-full rounded-2xl h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={isLoading || formData.donationAmount <= 0}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
              Processing...
            </div>
          ) : formData.donationAmount > 0 ? (
            `Complete donation - $${formData.donationAmount}`
          ) : (
            'Select donation amount'
          )}
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-8 p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-24 h-24 bg-gradient-to-br from-mountain-green to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl"
      >
        <Check className="h-12 w-12 text-white" />
      </motion.div>

      <div>
        <h3 className="text-2xl font-semibold text-midnight mb-3">Welcome to Ski for a Cure!</h3>
        <p className="text-muted-foreground text-lg">
          You've successfully joined as <span className="font-semibold text-ultra-ice-blue">{selectedType}</span>. 
          Get ready to make a difference on the slopes!
        </p>
        <p className="text-sm text-muted-foreground mt-2">{event.dateRange}</p>
      </div>

      {selectedType === 'team' && teamAction === 'create' && (
        <Card className="bg-gradient-to-r from-ultra-ice-blue to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <h4 className="font-semibold text-lg mb-3">Your Team Code</h4>
            <div className="text-2xl font-bold font-mono mb-3">{generateTeamCode()}</div>
            <p className="text-white/90">Share this code with your team members so they can join!</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <Trophy className="h-8 w-8 text-avalanche-orange mx-auto" />
        <p className="text-muted-foreground">
          Event features unlocked! You can now access all tracking functionality.
        </p>
      </div>
    </div>
  );

  const content = (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 'selection' && renderSelectionStep()}
          {currentStep === 'details' && renderDetailsStep()}
          {currentStep === 'payment' && renderPaymentStep()}
          {currentStep === 'success' && renderSuccessStep()}
        </motion.div>
      </AnimatePresence>

      {/* About Modal */}
      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">About Ski for a Cure</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              Join thousands of skiers worldwide in raising funds for cancer research and patient support programs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>Every meter you ski helps fund groundbreaking research and provides vital support to cancer patients and their families.</p>
            <p>Track your progress, compete with friends, and be part of a global movement making a real difference.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Donate Modal */}
      <Dialog open={showDonate} onOpenChange={setShowDonate}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Make a Donation</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              Support the cause with an additional donation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>Your donation goes directly to cancer research and patient care programs.</p>
            <p>You can add a donation during the registration process or make a standalone donation.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (showAsModal) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border-0 p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>
              Join {event.title}
            </DialogTitle>
            <DialogDescription>
              Choose your participation type and complete registration for the event
            </DialogDescription>
          </DialogHeader>
          {/* Show close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full h-8 w-8 p-0 hover:bg-gray-100 z-50"
          >
            <X className="h-4 w-4" />
          </Button>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="max-w-lg mx-auto snowline-card">
      <CardContent className="p-0">
        {content}
      </CardContent>
    </Card>
  );
}