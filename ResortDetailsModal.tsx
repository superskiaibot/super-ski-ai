import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Mountain,
  Thermometer,
  Cloud,
  Sun,
  Snowflake,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  AlertTriangle,
  Phone,
  Globe,
  Users,
  Zap,
  Shield,
  Navigation,
  TreePine,
  Eye,
  Award,
  Crown,
  Timer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { resortCustomizationService } from '../src/utils/resortCustomizationService';

interface Resort {
  id: string;
  name: string;
  location: string;
  region: string;
  image: string;
  description: string;
  lifts: number;
  runs: number;
  vertical: number;
  price: number;
  difficulty: {
    beginner: number;
    intermediate: number;
    advanced: number;
    expert: number;
  };
  amenities: string[];
  rating: number;
  reviews: number;
  season: string;
  snowDepth: number;
  operatingHours: {
    weekdays: string;
    weekends: string;
  };
  contactInfo: {
    phone: string;
    website: string;
    address: string;
  };
  pricing?: {
    adult: number;
    child: number;
    senior: number;
    halfDay: number;
  };
}

interface ResortDetailsModalProps {
  resort: Resort | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (resort: Resort) => void;
  currentUser?: any;
  showSelectButton?: boolean;
}

export function ResortDetailsModal({ 
  resort, 
  isOpen, 
  onClose, 
  onSelect,
  showSelectButton = true
}: ResortDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [customData, setCustomData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !resort) return;
    
    console.log('🔧 ResortDetailsModal: Loading customization data for resort:', resort.id);
    loadCustomizationData();
  }, [isOpen, resort?.id]);

  const loadCustomizationData = async () => {
    if (!resort) return;
    
    console.log('🔧 ResortDetailsModal: Attempting to load customization for:', resort.id);
    setIsLoading(true);
    try {
      const response = await resortCustomizationService.getResortData(resort.id);
      console.log('🔧 ResortDetailsModal: Backend response:', response);
      
      if (response.success && response.data && response.data.isCustomized) {
        console.log('✅ ResortDetailsModal: Custom data loaded successfully:', response.data);
        setCustomData(response.data);
      } else {
        console.log('ℹ️ ResortDetailsModal: No custom data found, using default resort data');
      }
    } catch (error) {
      console.error('❌ ResortDetailsModal: Failed to load resort customization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!resort) return null;

  // Use custom data if available, otherwise fall back to original resort data
  const displayData = customData ? {
    ...resort,
    name: customData.name,
    location: customData.location,
    image: customData.image,
    description: customData.description,
    snowDepth: customData.snowDepth
  } : resort;

  const handleSelect = () => {
    onSelect?.(resort);
    onClose();
  };

  // Calculate temperature based on snow depth or use custom temperature
  const temperature = customData ? customData.temperature : 
    Math.max(-15, -3 - (displayData.snowDepth / 25));

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-700 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'considerable': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'high': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'heavy snow':
      case 'fresh snow':
      case 'powder':
        return <Snowflake className="w-5 h-5 text-blue-600" />;
      case 'light snow':
        return <Snowflake className="w-5 h-5 text-blue-500" />;
      case 'partly cloudy':
        return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'bluebird':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-500" />;
    }
  };

  // Resort details data
  const getResortDetails = (resortId: string) => {
    const baseDetails = {
      description: displayData.description || "World-class skiing destination with diverse terrain and exceptional facilities.",
      lifts: { total: resort.lifts || 28, express: 12, gondolas: 3, surface: 13 },
      terrain: {
        beginner: resort.difficulty?.beginner || 25, 
        intermediate: resort.difficulty?.intermediate || 50, 
        advanced: resort.difficulty?.advanced || 25, 
        skiable: 3340,
        longestRun: '11.2 km', 
        baseElevation: 675, 
        summitElevation: 2284
      },
      facilities: resort.amenities || ['Ski School', 'Equipment Rental', 'Restaurants', 'Medical Center', 'Childcare'],
      contact: {
        phone: resort.contactInfo?.phone || '+64 3 442 4620',
        website: resort.contactInfo?.website || 'www.resort.co.nz',
        emergency: '+64 111'
      },
      hours: { 
        lifts: resort.operatingHours?.weekdays || '8:30 AM - 4:00 PM', 
        lastTicket: '3:30 PM' 
      },
      snowReport: { 
        base: Math.floor(displayData.snowDepth * 0.7), 
        summit: displayData.snowDepth, 
        fresh24h: 15, 
        season: displayData.snowDepth + 105 
      },
      highlights: ['Alpine Bowl', 'Glacier Express', 'Peak 2 Peak Gondola', 'Village Chairlift']
    };

    switch (resortId) {
      case 'whistler':
        return {
          ...baseDetails,
          description: displayData.description || "Two massive mountains offering over 8,100 acres of skiable terrain. Home to the 2010 Winter Olympics with legendary alpine bowls.",
          terrain: { ...baseDetails.terrain, skiable: 8171, longestRun: '11 km' },
          highlights: ['Peak 2 Peak Gondola', 'Whistler Village', 'Alpine Bowls', 'Blackcomb Glacier']
        };
      case 'coronetpeak':
        return {
          ...baseDetails,
          description: displayData.description || "New Zealand's premier ski destination with world-class facilities and stunning alpine scenery.",
          terrain: { ...baseDetails.terrain, skiable: 481, longestRun: '2.5 km' },
          highlights: ['Express Quad', 'Rocky Gully', 'Coronet Six', 'Back Bowls']
        };
      default:
        return baseDetails;
    }
  };

  const details = getResortDetails(resort.id);
  const weatherCondition = 'Fresh Snow';
  const riskLevel = 'low';

  // Mobile-optimized tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Mountain },
    { id: 'conditions', label: 'Weather', icon: Thermometer },
    { id: 'terrain', label: 'Terrain', icon: TrendingUp },
    { id: 'info', label: 'Info', icon: Clock }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="
        w-[95vw] max-w-4xl h-[90vh] max-h-[600px] 
        sm:w-[90vw] sm:max-w-2xl sm:h-[85vh] sm:max-h-[700px]
        lg:w-[80vw] lg:max-w-4xl lg:h-[80vh] lg:max-h-[800px]
        p-0 rounded-2xl overflow-hidden
        flex flex-col
        z-50
      ">
        {/* Accessibility Headers - Hidden */}
        <DialogHeader className="sr-only">
          <DialogTitle>{displayData.name} - Resort Details</DialogTitle>
          <DialogDescription>
            Complete information about {displayData.name} including conditions, terrain, and facilities.
          </DialogDescription>
        </DialogHeader>

        {/* Hero Section */}
        <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={displayData.image}
            alt={`${displayData.name} resort view`}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay - EXACT template as specified by user */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Resort information */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 py-4 sm:py-6 text-white">
            <div className="flex items-end justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold truncate">{displayData.name}</h1>
                  <Badge className="bg-white/20 text-white border-white/30 flex-shrink-0 text-xs">
                    <Crown className="w-3 h-3 mr-1 flex-shrink-0" />
                    Premium
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm sm:text-base truncate">{displayData.location}</span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 text-xs sm:text-sm">
                  <div className="text-center sm:text-left">
                    <div className="font-semibold text-base sm:text-lg">{details.terrain.skiable}</div>
                    <div className="text-white/80">Acres</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="font-semibold text-base sm:text-lg">{resort.runs}</div>
                    <div className="text-white/80">Trails</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="font-semibold text-base sm:text-lg">{details.lifts.total}</div>
                    <div className="text-white/80">Lifts</div>
                  </div>
                </div>
              </div>
              
              {/* Weather info */}
              <div className="text-right flex-shrink-0 min-w-0">
                <div className="flex items-center gap-2 mb-1 justify-end">
                  {getWeatherIcon(weatherCondition)}
                  <span className="text-lg sm:text-xl lg:text-2xl font-semibold whitespace-nowrap">{temperature}°C</span>
                </div>
                <div className="text-xs sm:text-sm text-white/90 truncate max-w-24 sm:max-w-none">{weatherCondition}</div>
                <div className="flex items-center gap-1 text-xs text-white/80 mt-1 justify-end">
                  <Eye className="w-3 h-3 flex-shrink-0" />
                  <span className="whitespace-nowrap">Excellent</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white border-0"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            {/* Tabs Navigation */}
            <div className="flex-shrink-0 border-b bg-white px-2 sm:px-4">
              <ScrollArea className="w-full">
                <TabsList className="inline-flex h-auto p-1 bg-transparent w-full sm:w-auto justify-start sm:justify-center">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="
                          flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 
                          text-xs sm:text-sm font-medium rounded-lg
                          data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                          data-[state=inactive]:text-muted-foreground hover:text-foreground
                          transition-all duration-200 min-w-fit whitespace-nowrap
                        "
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </ScrollArea>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1">
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0 space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">About {displayData.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">{details.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Resort Highlights</h4>
                      <div className="flex flex-wrap gap-2">
                        {details.highlights.map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Card className="border-0 bg-gray-50">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-3">
                          <Mountain className="w-6 sm:w-8 h-6 sm:h-8 text-orange-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xl sm:text-2xl font-semibold text-gray-900">{resort.vertical}m</div>
                            <div className="text-xs sm:text-sm text-gray-600">Vertical Drop</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-gray-50">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-3">
                          <Navigation className="w-6 sm:w-8 h-6 sm:h-8 text-green-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xl sm:text-2xl font-semibold text-gray-900">{resort.runs}</div>
                            <div className="text-xs sm:text-sm text-gray-600">Trails Open</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-gray-50">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-3">
                          <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xl sm:text-2xl font-semibold text-gray-900">{details.lifts.total}</div>
                            <div className="text-xs sm:text-sm text-gray-600">Total Lifts</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-gray-50">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-6 sm:w-8 h-6 sm:h-8 text-purple-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xl sm:text-2xl font-semibold text-gray-900">
                              ${resort.price}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">Lift Ticket</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Safety Alert */}
                  <Card className={`${getRiskColor(riskLevel)} border`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-semibold mb-1">Avalanche Risk: {riskLevel.toUpperCase()}</h4>
                          <p className="text-sm">
                            {riskLevel === 'low' && "Safe conditions with minimal avalanche risk."}
                            {riskLevel === 'moderate' && "Increased avalanche danger in specific terrain features."}
                            {riskLevel === 'considerable' && "Dangerous conditions - avoid steep slopes and backcountry."}
                            {riskLevel === 'high' && "Very dangerous conditions - avoid all avalanche terrain."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Button */}
                  {showSelectButton && (
                    <Button
                      onClick={handleSelect}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Mountain className="w-4 h-4 mr-2" />
                      Start Tracking Here
                    </Button>
                  )}

                  {/* Show customization status if applicable */}
                  {customData && customData.isCustomized && (
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs text-green-600 bg-green-50 border-green-200">
                        Custom Content by {customData.name}
                      </Badge>
                    </div>
                  )}
                </TabsContent>

                {/* Weather Tab */}
                <TabsContent value="conditions" className="mt-0 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <Card>
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <Snowflake className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                          Snow Report
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-xl sm:text-2xl font-semibold text-blue-700">{details.snowReport.base}cm</div>
                            <div className="text-xs sm:text-sm text-blue-600">Base Depth</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-xl sm:text-2xl font-semibold text-blue-700">{details.snowReport.summit}cm</div>
                            <div className="text-xs sm:text-sm text-blue-600">Summit Depth</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-xl sm:text-2xl font-semibold text-green-700">{details.snowReport.fresh24h}cm</div>
                            <div className="text-xs sm:text-sm text-green-600">Fresh 24h</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-xl sm:text-2xl font-semibold text-purple-700">{details.snowReport.season}cm</div>
                            <div className="text-xs sm:text-sm text-purple-600">Season Total</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <Thermometer className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600" />
                          Current Weather
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg mb-4">
                          <div className="flex items-center gap-3">
                            {getWeatherIcon(weatherCondition)}
                            <div>
                              <div className="font-semibold">Today</div>
                              <div className="text-sm text-gray-600">{weatherCondition}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-semibold">{temperature}°C</div>
                            <div className="text-sm text-gray-600">Feels like {temperature - 2}°C</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Visibility</span>
                            <span className="font-medium">Excellent</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Wind Speed</span>
                            <span className="font-medium">15 km/h</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Terrain Tab */}
                <TabsContent value="terrain" className="mt-0 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <Card>
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                          Difficulty Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-green-700 font-medium">Beginner</span>
                              <span className="font-semibold">{details.terrain.beginner}%</span>
                            </div>
                            <Progress value={details.terrain.beginner} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-blue-700 font-medium">Intermediate</span>
                              <span className="font-semibold">{details.terrain.intermediate}%</span>
                            </div>
                            <Progress value={details.terrain.intermediate} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-red-700 font-medium">Advanced</span>
                              <span className="font-semibold">{details.terrain.advanced}%</span>
                            </div>
                            <Progress value={details.terrain.advanced} className="h-2" />
                          </div>
                        </div>
                        <Separator />
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <div className="text-2xl sm:text-3xl font-semibold text-primary">{details.terrain.skiable}</div>
                          <div className="text-sm text-gray-600">Total Skiable Acres</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                          Lift Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg sm:text-xl font-semibold text-gray-900">{details.lifts.total}</div>
                            <div className="text-xs text-gray-600">Total Lifts</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg sm:text-xl font-semibold text-gray-900">{details.lifts.express}</div>
                            <div className="text-xs text-gray-600">High Speed</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg sm:text-xl font-semibold text-gray-900">{details.lifts.gondolas}</div>
                            <div className="text-xs text-gray-600">Gondolas</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg sm:text-xl font-semibold text-gray-900">{details.lifts.surface}</div>
                            <div className="text-xs text-gray-600">Surface</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Info Tab */}
                <TabsContent value="info" className="mt-0 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <Card>
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                          Operating Hours
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm sm:text-base">Lifts Open</span>
                          <span className="font-semibold text-sm sm:text-base">{details.hours.lifts}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm sm:text-base">Last Ticket Sale</span>
                          <span className="font-semibold text-sm sm:text-base">{details.hours.lastTicket}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                          Contact
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm sm:text-base">Resort Phone</span>
                          <span className="font-semibold text-sm sm:text-base">{details.contact.phone}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                          <span className="text-sm sm:text-base">Emergency</span>
                          <span className="font-semibold text-red-700 text-sm sm:text-base">{details.contact.emergency}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <Users className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                          Facilities & Services
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {details.facilities.map((facility, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="justify-center p-2 sm:p-3 text-xs sm:text-sm w-full"
                            >
                              {facility}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}