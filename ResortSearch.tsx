import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Mountain,
  Star,
  Filter,
  Grid,
  List,
  Map,
  Navigation,
  Phone,
  Globe,
  Clock,
  Thermometer,
  Wind,
  Snowflake,
  Camera,
  Heart,
  Share2,
  ExternalLink,
  Bookmark,
  Route,
  Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { MapView } from './tracking/MapView';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Resort, User } from '../src/types';

interface ResortDetails extends Resort {
  description?: string;
  elevation?: {
    base: number;
    summit: number;
    vertical: number;
  };
  trails?: {
    total: number;
    beginner: number;
    intermediate: number;
    advanced: number;
    expert: number;
  };
  lifts?: {
    total: number;
    types: string[];
  };
  snowReport?: {
    baseDepth: number;
    newSnow24h: number;
    conditions: string;
    lastUpdated: Date;
  };
  weather?: {
    temperature: {
      high: number;
      low: number;
    };
    conditions: string;
    windSpeed: number;
    visibility: string;
  };
  amenities?: string[];
  contact?: {
    phone: string;
    email: string;
    website: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
  rating: number;
  reviews: number;
  isOpen: boolean;
  season?: {
    opening: string;
    closing: string;
  };
  ticketPrices?: {
    adult: number;
    child: number;
    senior: number;
  };
}

interface ResortSearchProps {
  currentUser: User;
  onSelectResort: (resort: ResortDetails) => void;
  selectedResort?: ResortDetails | null;
}

export function ResortSearch({ currentUser, onSelectResort, selectedResort }: ResortSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [selectedResortDetail, setSelectedResortDetail] = useState<ResortDetails | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock resort data - in real app this would come from API
  const [resorts, setResorts] = useState<ResortDetails[]>([
    {
      id: 'whistler',
      name: 'Whistler Blackcomb',
      location: 'Whistler, BC',
      country: 'Canada',
      website: 'https://whistlerblackcomb.com',
      logo: undefined,
      description: 'One of the largest ski resorts in North America, featuring two massive mountains with over 8,000 acres of skiable terrain.',
      elevation: {
        base: 652,
        summit: 2284,
        vertical: 1632
      },
      trails: {
        total: 200,
        beginner: 20,
        intermediate: 110,
        advanced: 58,
        expert: 12
      },
      lifts: {
        total: 37,
        types: ['Gondola', 'Express Quad', 'Triple Chair', 'Magic Carpet']
      },
      snowReport: {
        baseDepth: 185,
        newSnow24h: 12,
        conditions: 'Powder',
        lastUpdated: new Date()
      },
      weather: {
        temperature: { high: -2, low: -8 },
        conditions: 'Light Snow',
        windSpeed: 15,
        visibility: 'Good'
      },
      amenities: ['Ski School', 'Equipment Rental', 'Dining', 'Shopping', 'Spa', 'Childcare'],
      contact: {
        phone: '+1-604-967-8950',
        email: 'info@whistlerblackcomb.com',
        website: 'https://whistlerblackcomb.com'
      },
      coordinates: {
        latitude: 50.1163,
        longitude: -122.9574
      },
      images: [],
      rating: 4.8,
      reviews: 15420,
      isOpen: true,
      season: {
        opening: 'November 23',
        closing: 'April 28'
      },
      ticketPrices: {
        adult: 159,
        child: 89,
        senior: 135
      }
    },
    {
      id: 'vail',
      name: 'Vail Ski Resort',
      location: 'Vail, Colorado',
      country: 'USA',
      website: 'https://vail.com',
      logo: undefined,
      description: 'America\'s largest ski mountain offering legendary back bowls and pristine groomed runs in the heart of Colorado.',
      elevation: {
        base: 2500,
        summit: 3527,
        vertical: 1027
      },
      trails: {
        total: 195,
        beginner: 18,
        intermediate: 53,
        advanced: 44,
        expert: 80
      },
      lifts: {
        total: 31,
        types: ['Gondola', 'High Speed Quad', 'Fixed Grip Quad', 'Triple Chair']
      },
      snowReport: {
        baseDepth: 142,
        newSnow24h: 8,
        conditions: 'Packed Powder',
        lastUpdated: new Date()
      },
      weather: {
        temperature: { high: -1, low: -12 },
        conditions: 'Partly Cloudy',
        windSpeed: 12,
        visibility: 'Excellent'
      },
      amenities: ['Ski School', 'Equipment Rental', 'Dining', 'Shopping', 'Spa', 'Golf Course'],
      contact: {
        phone: '+1-970-476-9090',
        email: 'info@vail.com',
        website: 'https://vail.com'
      },
      coordinates: {
        latitude: 39.6403,
        longitude: -106.3742
      },
      images: [],
      rating: 4.7,
      reviews: 12890,
      isOpen: true,
      season: {
        opening: 'November 15',
        closing: 'April 21'
      },
      ticketPrices: {
        adult: 239,
        child: 149,
        senior: 199
      }
    },
    {
      id: 'chamonix',
      name: 'Chamonix Mont-Blanc',
      location: 'Chamonix, France',
      country: 'France',
      website: 'https://chamonix.com',
      logo: undefined,
      description: 'The birthplace of extreme skiing, offering legendary off-piste terrain and breathtaking views of Mont Blanc.',
      elevation: {
        base: 1035,
        summit: 3842,
        vertical: 2807
      },
      trails: {
        total: 155,
        beginner: 23,
        intermediate: 62,
        advanced: 45,
        expert: 25
      },
      lifts: {
        total: 47,
        types: ['Cable Car', 'Gondola', 'Express Quad', 'Chairlift']
      },
      snowReport: {
        baseDepth: 195,
        newSnow24h: 25,
        conditions: 'Fresh Powder',
        lastUpdated: new Date()
      },
      weather: {
        temperature: { high: -5, low: -15 },
        conditions: 'Heavy Snow',
        windSpeed: 25,
        visibility: 'Limited'
      },
      amenities: ['Ski School', 'Equipment Rental', 'Dining', 'Shopping', 'Mountaineering', 'Glacier Tours'],
      contact: {
        phone: '+33-4-50-53-22-75',
        email: 'info@chamonix.com',
        website: 'https://chamonix.com'
      },
      coordinates: {
        latitude: 45.9237,
        longitude: 6.8694
      },
      images: [],
      rating: 4.9,
      reviews: 8750,
      isOpen: true,
      season: {
        opening: 'December 2',
        closing: 'May 5'
      },
      ticketPrices: {
        adult: 65,
        child: 55,
        senior: 59
      }
    },
    {
      id: 'st-anton',
      name: 'St. Anton am Arlberg',
      location: 'St. Anton, Austria',
      country: 'Austria',
      website: 'https://stantonamarlberg.com',
      logo: undefined,
      description: 'Legendary resort in the Austrian Alps known for challenging terrain, deep powder, and vibrant après-ski culture.',
      elevation: {
        base: 1304,
        summit: 2811,
        vertical: 1507
      },
      trails: {
        total: 305,
        beginner: 43,
        intermediate: 123,
        advanced: 89,
        expert: 50
      },
      lifts: {
        total: 88,
        types: ['Funicular', 'Cable Car', 'Gondola', 'Express Chairlift']
      },
      snowReport: {
        baseDepth: 168,
        newSnow24h: 18,
        conditions: 'Powder',
        lastUpdated: new Date()
      },
      weather: {
        temperature: { high: -3, low: -11 },
        conditions: 'Snowing',
        windSpeed: 18,
        visibility: 'Good'
      },
      amenities: ['Ski School', 'Equipment Rental', 'Dining', 'Shopping', 'Spa', 'Après-Ski'],
      contact: {
        phone: '+43-5446-22690',
        email: 'info@stantonamarlberg.com',
        website: 'https://stantonamarlberg.com'
      },
      coordinates: {
        latitude: 47.1333,
        longitude: 10.2667
      },
      images: [],
      rating: 4.6,
      reviews: 9840,
      isOpen: true,
      season: {
        opening: 'December 8',
        closing: 'April 28'
      },
      ticketPrices: {
        adult: 72,
        child: 43,
        senior: 65
      }
    }
  ]);

  const countries = ['all', ...new Set(resorts.map(r => r.country))];

  const filteredResorts = resorts.filter(resort => {
    const matchesSearch = resort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resort.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || resort.country === selectedCountry;
    
    return matchesSearch && matchesCountry;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'vertical':
        return (b.elevation?.vertical || 0) - (a.elevation?.vertical || 0);
      case 'trails':
        return (b.trails?.total || 0) - (a.trails?.total || 0);
      default:
        return 0;
    }
  });

  const handleSelectResort = (resort: ResortDetails) => {
    onSelectResort(resort);
  };

  const toggleFavorite = (resortId: string) => {
    setFavorites(prev => 
      prev.includes(resortId) 
        ? prev.filter(id => id !== resortId)
        : [...prev, resortId]
    );
  };

  const renderResortCard = (resort: ResortDetails, index: number) => (
    <motion.div
      key={resort.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
            <Mountain className="w-16 h-16 text-blue-600" />
          </div>
          
          <div className="absolute top-2 right-2 flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(resort.id);
              }}
            >
              <Heart className={`w-4 h-4 ${favorites.includes(resort.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Badge 
              variant={resort.isOpen ? 'default' : 'secondary'}
              className="bg-white/80"
            >
              {resort.isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg">{resort.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                {resort.location}, {resort.country}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-medium">{resort.rating}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {resort.reviews.toLocaleString()} reviews
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
            <div className="text-center">
              <div className="font-semibold">{resort.trails?.total}</div>
              <div className="text-muted-foreground">Trails</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{resort.elevation?.vertical}m</div>
              <div className="text-muted-foreground">Vertical</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{resort.lifts?.total}</div>
              <div className="text-muted-foreground">Lifts</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1 text-sm">
              <Snowflake className="w-4 h-4 text-blue-500" />
              <span>{resort.snowReport?.baseDepth}cm base</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span>{resort.weather?.temperature.high}°C</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              className="flex-1" 
              onClick={() => handleSelectResort(resort)}
            >
              Select Resort
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedResortDetail(resort);
              }}
            >
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderResortList = (resort: ResortDetails, index: number) => (
    <motion.div
      key={resort.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
              <Mountain className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{resort.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {resort.location}, {resort.country}
                  </div>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium mr-2">{resort.rating}</span>
                    <Badge variant={resort.isOpen ? 'default' : 'secondary'} className="text-xs">
                      {resort.isOpen ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold">${resort.ticketPrices?.adult}</div>
                  <div className="text-xs text-muted-foreground">Adult Day Pass</div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                <div>
                  <div className="font-semibold">{resort.trails?.total}</div>
                  <div className="text-muted-foreground">Trails</div>
                </div>
                <div>
                  <div className="font-semibold">{resort.elevation?.vertical}m</div>
                  <div className="text-muted-foreground">Vertical</div>
                </div>
                <div>
                  <div className="font-semibold">{resort.snowReport?.baseDepth}cm</div>
                  <div className="text-muted-foreground">Base Depth</div>
                </div>
                <div>
                  <div className="font-semibold">{resort.weather?.temperature.high}°C</div>
                  <div className="text-muted-foreground">High Temp</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button size="sm" onClick={() => handleSelectResort(resort)}>
                Select
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedResortDetail(resort)}
              >
                Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(resort.id)}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(resort.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Discover Ski Resorts</h1>
        <p className="text-muted-foreground">
          Find the perfect mountain for your next skiing adventure
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resorts, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.slice(1).map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Sort by Rating</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="vertical">Sort by Vertical</SelectItem>
                  <SelectItem value="trails">Sort by Trails</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex rounded-lg border">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="rounded-l-none"
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {viewMode === 'map' ? (
          <Card>
            <CardContent className="p-0">
              <div className="h-96">
                <MapView
                  resorts={filteredResorts}
                  selectedResort={selectedResort}
                  onSelectResort={handleSelectResort}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {filteredResorts.length} Resorts Found
              </h2>
              {selectedResort && (
                <Badge variant="outline" className="text-sm">
                  Selected: {selectedResort.name}
                </Badge>
              )}
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResorts.map(renderResortCard)}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResorts.map(renderResortList)}
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Resort Details Dialog */}
      <Dialog open={!!selectedResortDetail} onOpenChange={() => setSelectedResortDetail(null)}>
        {selectedResortDetail && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedResortDetail.name}</h2>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedResortDetail.location}, {selectedResortDetail.country}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span className="font-bold text-lg">{selectedResortDetail.rating}</span>
                  </div>
                  <Badge variant={selectedResortDetail.isOpen ? 'default' : 'secondary'}>
                    {selectedResortDetail.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Resort Image */}
              <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
                <Mountain className="w-24 h-24 text-blue-600" />
              </div>
              
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{selectedResortDetail.description}</p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{selectedResortDetail.trails?.total}</div>
                    <div className="text-sm text-muted-foreground">Total Trails</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{selectedResortDetail.elevation?.vertical}m</div>
                    <div className="text-sm text-muted-foreground">Vertical Drop</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{selectedResortDetail.lifts?.total}</div>
                    <div className="text-sm text-muted-foreground">Lifts</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">${selectedResortDetail.ticketPrices?.adult}</div>
                    <div className="text-sm text-muted-foreground">Adult Day Pass</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Detailed Information */}
              <Tabs defaultValue="conditions" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="conditions">Conditions</TabsTrigger>
                  <TabsTrigger value="trails">Trails</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>
                
                <TabsContent value="conditions" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Snowflake className="w-5 h-5" />
                          Snow Report
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Base Depth:</span>
                          <span className="font-semibold">{selectedResortDetail.snowReport?.baseDepth}cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>New Snow (24h):</span>
                          <span className="font-semibold">{selectedResortDetail.snowReport?.newSnow24h}cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conditions:</span>
                          <span className="font-semibold">{selectedResortDetail.snowReport?.conditions}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Thermometer className="w-5 h-5" />
                          Weather
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>High/Low:</span>
                          <span className="font-semibold">
                            {selectedResortDetail.weather?.temperature.high}°C / {selectedResortDetail.weather?.temperature.low}°C
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conditions:</span>
                          <span className="font-semibold">{selectedResortDetail.weather?.conditions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Wind:</span>
                          <span className="font-semibold">{selectedResortDetail.weather?.windSpeed} km/h</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="trails" className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <Card className="bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedResortDetail.trails?.beginner}</div>
                        <div className="text-sm">Beginner</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedResortDetail.trails?.intermediate}</div>
                        <div className="text-sm">Intermediate</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-gray-600">{selectedResortDetail.trails?.advanced}</div>
                        <div className="text-sm">Advanced</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{selectedResortDetail.trails?.expert}</div>
                        <div className="text-sm">Expert</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="amenities" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedResortDetail.amenities?.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="justify-center p-2">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <span>{selectedResortDetail.contact?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <a 
                        href={selectedResortDetail.contact?.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {selectedResortDetail.contact?.website}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span>Season: {selectedResortDetail.season?.opening} - {selectedResortDetail.season?.closing}</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    handleSelectResort(selectedResortDetail);
                    setSelectedResortDetail(null);
                  }}
                >
                  Select This Resort
                </Button>
                <Button variant="outline" onClick={() => toggleFavorite(selectedResortDetail.id)}>
                  <Heart className={`w-4 h-4 mr-2 ${favorites.includes(selectedResortDetail.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  {favorites.includes(selectedResortDetail.id) ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}