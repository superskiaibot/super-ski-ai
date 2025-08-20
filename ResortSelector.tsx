import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mountain,
  Search,
  Heart,
  Star,
  Thermometer,
  Eye
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Resort } from './tracking/types';
import { ResortDetailsModal } from './ResortDetailsModal';

interface ResortData {
  id: string;
  name: string;
  location: string;
  country: string;
  rating: number;
  trails: number | string;
  vertical: number | string;
  adultPrice: number | string;
  temperature: number;
  weatherCondition: string;
  riskLevel: 'low' | 'moderate' | 'considerable' | 'high';
  isOpen: boolean;
  isFavorite?: boolean;
}

interface ResortSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResort: (resort: Resort) => void;
  selectedResort?: Resort | null;
}

export function ResortSelector({ isOpen, onClose, onSelectResort, selectedResort }: ResortSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [favorites, setFavorites] = useState<string[]>(['coronetpeak', 'remarkables', 'whakapapa', 'turoa']);
  const [showResortDetails, setShowResortDetails] = useState(false);
  const [selectedResortForDetails, setSelectedResortForDetails] = useState<Resort | null>(null);

  // Debug effect
  React.useEffect(() => {
    console.log('🏔️ ResortSelector mounted/updated - isOpen:', isOpen);
  }, [isOpen]);

  // Helper functions to map resort data
  const getResortImage = (resortId: string): string => {
    const imageMap: Record<string, string> = {
      'coronetpeak': 'https://images.unsplash.com/photo-1551524164-6cf2ac135c1f?w=800&h=600&fit=crop',
      'remarkables': 'https://images.unsplash.com/photo-1551524164-605c4a64e4a4?w=800&h=600&fit=crop',
      'cardrona': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'treblecone': 'https://images.unsplash.com/photo-1606673842245-9d872b20e3b3?w=800&h=600&fit=crop',
      'whakapapa': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'turoa': 'https://images.unsplash.com/photo-1606673842245-9d872b20e3b3?w=800&h=600&fit=crop',
      'mthutt': 'https://images.unsplash.com/photo-1551524164-7c4b7b7b7b4a?w=800&h=600&fit=crop',
      'porters': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    };
    return imageMap[resortId] || 'https://images.unsplash.com/photo-1551524164-6cf2ac135c1f?w=800&h=600&fit=crop';
  };

  const getResortDescription = (resortId: string): string => {
    const descriptionMap: Record<string, string> = {
      'coronetpeak': "New Zealand's premier ski destination with world-class facilities and stunning alpine scenery. Known for reliable snow and excellent groomed runs.",
      'remarkables': "Dramatic mountain skiing with spectacular views over Lake Wakatipu. Features diverse terrain from gentle learning slopes to challenging black runs.",
      'cardrona': "High-altitude skiing with excellent snow reliability and modern facilities. Perfect for families and freestyle enthusiasts with world-class terrain parks.",
      'treblecone': "Home to the longest vertical in the South Island with challenging terrain and breathtaking views. A favorite among advanced skiers and snowboarders.",
      'whakapapa': "New Zealand's largest ski area located on the volcanic slopes of Mt Ruapehu. Offers diverse terrain and stunning volcanic landscape views.",
      'turoa': "The highest and largest ski area in New Zealand with the longest vertical drop. Known for its wide-open spaces and reliable snow conditions.",
      'mthutt': "Canterbury's premier ski destination with excellent snow reliability and modern facilities. Features diverse terrain suitable for all skill levels.",
      'porters': "Canterbury ski field known for its family-friendly atmosphere and excellent learning terrain. Close to Christchurch with reliable snow conditions."
    };
    return descriptionMap[resortId] || "World-class skiing destination with diverse terrain and exceptional facilities.";
  };

  const getResortLifts = (resortId: string): number => {
    const liftMap: Record<string, number> = {
      'coronetpeak': 6,
      'remarkables': 7,
      'cardrona': 11,
      'treblecone': 6,
      'whakapapa': 9,
      'turoa': 9,
      'mthutt': 5,
      'porters': 4
    };
    return liftMap[resortId] || 4;
  };

  const parseTrails = (trails: string): number => {
    if (typeof trails === 'number') return trails;
    const match = trails.match(/(\d+)/);
    return match ? parseInt(match[1]) : 25;
  };

  const getResortDifficulty = (resortId: string) => {
    const difficultyMap: Record<string, any> = {
      'coronetpeak': { beginner: 25, intermediate: 45, advanced: 25, expert: 5 },
      'remarkables': { beginner: 30, intermediate: 40, advanced: 25, expert: 5 },
      'cardrona': { beginner: 35, intermediate: 45, advanced: 15, expert: 5 },
      'treblecone': { beginner: 10, intermediate: 45, advanced: 35, expert: 10 },
      'whakapapa': { beginner: 25, intermediate: 50, advanced: 20, expert: 5 },
      'turoa': { beginner: 20, intermediate: 55, advanced: 20, expert: 5 },
      'mthutt': { beginner: 25, intermediate: 50, advanced: 20, expert: 5 },
      'porters': { beginner: 40, intermediate: 45, advanced: 15, expert: 0 }
    };
    return difficultyMap[resortId] || { beginner: 25, intermediate: 50, advanced: 20, expert: 5 };
  };

  const getResortAmenities = (resortId: string): string[] => {
    const amenitiesMap: Record<string, string[]> = {
      'coronetpeak': ['Ski Rental & Tuning', 'Ski School', 'Mountain Restaurant', 'Free WiFi', 'Parking', 'First Aid Station', 'Equipment Storage', 'Rental Shop'],
      'remarkables': ['Ski School', 'Equipment Rental', 'Multiple Restaurants', 'Childcare', 'Terrain Parks', 'Free Parking', 'Medical Center', 'Retail Store'],
      'cardrona': ['World-Class Terrain Parks', 'Ski & Snowboard School', 'Equipment Rental', 'Multiple Dining Options', 'Childcare', 'First Aid', 'Parking', 'Retail'],
      'treblecone': ['Advanced Terrain', 'Equipment Rental', 'Mountain Cafe', 'First Aid', 'Parking', 'Ski School', 'Pro Shop'],
      'whakapapa': ['Largest Ski Area', 'Ski & Snowboard School', 'Equipment Rental', 'Multiple Restaurants', 'Accommodation', 'Childcare', 'Medical Center', 'Shopping'],
      'turoa': ['Highest Ski Field', 'Ski School', 'Equipment Rental', 'Restaurant & Cafe', 'First Aid', 'Parking', 'Retail Store', 'Accommodation Nearby']
    };
    return amenitiesMap[resortId] || ['Ski School', 'Equipment Rental', 'Restaurant', 'First Aid', 'Parking'];
  };

  // New Zealand ski field data
  const resorts: ResortData[] = [
    // North Island - Commercial
    {
      id: 'whakapapa',
      name: 'Whakapapa (Mt Ruapehu)',
      location: 'Mount Ruapehu, North Island',
      country: 'New Zealand',
      rating: 4,
      trails: '32/36',
      vertical: '675m',
      adultPrice: 89,
      temperature: -2,
      weatherCondition: 'Fresh Snow',
      riskLevel: 'low',
      isOpen: true,
      isFavorite: true
    },
    {
      id: 'turoa',
      name: 'Tūroa (Mt Ruapehu)',
      location: 'Mount Ruapehu, North Island',
      country: 'New Zealand',
      rating: 4,
      trails: '48/52',
      vertical: '722m',
      adultPrice: 89,
      temperature: -3,
      weatherCondition: 'Powder',
      riskLevel: 'low',
      isOpen: true,
      isFavorite: true
    },
    
    // North Island - Club Fields
    {
      id: 'tukino',
      name: 'Tukino (Mt Ruapehu)',
      location: 'Mount Ruapehu, North Island',
      country: 'New Zealand',
      rating: 3,
      trails: 'Club Field',
      vertical: '350m',
      adultPrice: 'Club',
      temperature: -1,
      weatherCondition: 'Partly Cloudy',
      riskLevel: 'moderate',
      isOpen: true
    },
    {
      id: 'manganui',
      name: 'Manganui (Mt Taranaki)',
      location: 'Mount Taranaki, North Island',
      country: 'New Zealand',
      rating: 3,
      trails: 'Club Field',
      vertical: '400m',
      adultPrice: 'Club',
      temperature: 2,
      weatherCondition: 'Variable',
      riskLevel: 'moderate',
      isOpen: false
    },

    // South Island - Canterbury/Arthur's Pass - Commercial
    {
      id: 'mthutt',
      name: 'Mt Hutt',
      location: 'Canterbury, South Island',
      country: 'New Zealand',
      rating: 4,
      trails: '365 hectares',
      vertical: '683m',
      adultPrice: 109,
      temperature: -4,
      weatherCondition: 'Bluebird',
      riskLevel: 'low',
      isOpen: true
    },
    {
      id: 'porters',
      name: 'Porters Alpine Resort',
      location: 'Canterbury, South Island',
      country: 'New Zealand',
      rating: 4,
      trails: '280 hectares',
      vertical: '630m',
      adultPrice: 99,
      temperature: -2,
      weatherCondition: 'Light Snow',
      riskLevel: 'low',
      isOpen: true
    },
    {
      id: 'mtdobson',
      name: 'Mt Dobson',
      location: 'Canterbury, South Island',
      country: 'New Zealand',
      rating: 3,
      trails: '400 hectares',
      vertical: '915m',
      adultPrice: 89,
      temperature: -5,
      weatherCondition: 'Fresh Snow',
      riskLevel: 'moderate',
      isOpen: true
    },
    {
      id: 'roundhill',
      name: 'Roundhill (Tekapo)',
      location: 'Mackenzie, South Island',
      country: 'New Zealand',
      rating: 3,
      trails: '12 trails',
      vertical: '450m',
      adultPrice: 79,
      temperature: -3,
      weatherCondition: 'Clear',
      riskLevel: 'low',
      isOpen: true
    },
    {
      id: 'ohau',
      name: 'Ōhau Snow Fields',
      location: 'Mackenzie, South Island',
      country: 'New Zealand',
      rating: 3,
      trails: '385 hectares',
      vertical: '440m',
      adultPrice: 79,
      temperature: -2,
      weatherCondition: 'Partly Cloudy',
      riskLevel: 'low',
      isOpen: true
    },
    {
      id: 'mtlyford',
      name: 'Mt Lyford',
      location: 'North Canterbury, South Island',
      country: 'New Zealand',
      rating: 3,
      trails: '20 trails',
      vertical: '450m',
      adultPrice: 85,
      temperature: -1,
      weatherCondition: 'Variable',
      riskLevel: 'low',
      isOpen: true
    },

    // South Island - Club Fields
    {
      id: 'hanmersprings',
      name: 'Hanmer Springs Ski Area',
      location: 'North Canterbury, South Island',
      country: 'New Zealand',
      rating: 3,
      trails: 'Club Field',
      vertical: '350m',
      adultPrice: 'Club',
      temperature: 1,
      weatherCondition: 'Cloudy',
      riskLevel: 'low',
      isOpen: true
    },
    {
      id: 'foxpeak',
      name: 'Fox Peak',
      location: 'North Canterbury, South Island',
      country: 'New Zealand',
      rating: 3,
      trails: 'Club Field',
      vertical: '300m',
      adultPrice: 'Club',
      temperature: -1,
      weatherCondition: 'Light Snow',
      riskLevel: 'moderate',
      isOpen: true
    },
    {
      id: 'mtcheeseman',
      name: 'Mt Cheeseman',
      location: 'Canterbury, South Island',
      country: 'New Zealand',
      rating: 3,
      trails: 'Club Field',
      vertical: '450m',
      adultPrice: 'Club',
      temperature: -3,
      weatherCondition: 'Fresh Snow',
      riskLevel: 'moderate',
      isOpen: true
    },
    {
      id: 'brokenriver',
      name: 'Broken River',
      location: 'Canterbury, South Island',
      country: 'New Zealand',
      rating: 3,
      trails: 'Club Field',
      vertical: '400m',
      adultPrice: 'Club',
      temperature: -2,
      weatherCondition: 'Powder',
      riskLevel: 'considerable',
      isOpen: true
    },
    {
      id: 'craigieburn',
      name: 'Craigieburn Valley',
      location: 'Canterbury, South Island',
      country: 'New Zealand',
      rating: 4,
      trails: 'Club Field',
      vertical: '600m',
      adultPrice: 'Club',
      temperature: -4,
      weatherCondition: 'Fresh Snow',
      riskLevel: 'considerable',
      isOpen: true
    },
    {
      id: 'mtolympus',
      name: 'Mt Olympus',
      location: 'Canterbury, South Island',
      country: 'New Zealand',
      rating: 3,
      trails: 'Club Field',
      vertical: '500m',
      adultPrice: 'Club',
      temperature: -3,
      weatherCondition: 'Variable',
      riskLevel: 'moderate',
      isOpen: true
    },
    {
      id: 'templebasin',
      name: 'Temple Basin (Arthur\'s Pass)',
      location: 'Arthur\'s Pass, South Island',
      country: 'New Zealand',
      rating: 4,
      trails: 'Club Field',
      vertical: '450m',
      adultPrice: 'Club',
      temperature: -5,
      weatherCondition: 'Heavy Snow',
      riskLevel: 'considerable',
      isOpen: true
    },
    {
      id: 'awakino',
      name: 'Awakino (Waitaki Valley)',
      location: 'Waitaki Valley, South Island',
      country: 'New Zealand',
      rating: 2,
      trails: 'Club Field',
      vertical: '200m',
      adultPrice: 'Club',
      temperature: 0,
      weatherCondition: 'Cloudy',
      riskLevel: 'low',
      isOpen: false
    },

    // Nelson Lakes
    {
      id: 'rainbow',
      name: 'Rainbow',
      location: 'Nelson Lakes, South Island',
      country: 'New Zealand',
      rating: 3,
      trails: 'Community',
      vertical: '300m',
      adultPrice: 'Community',
      temperature: -1,
      weatherCondition: 'Light Snow',
      riskLevel: 'moderate',
      isOpen: true
    },

    // Otago/Queenstown-Wānaka - Commercial
    {
      id: 'coronetpeak',
      name: 'Coronet Peak',
      location: 'Queenstown, South Island',
      country: 'New Zealand',
      rating: 5,
      trails: '280 hectares',
      vertical: '481m',
      adultPrice: 129,
      temperature: -1,
      weatherCondition: 'Packed Powder',
      riskLevel: 'low',
      isOpen: true,
      isFavorite: true
    },
    {
      id: 'remarkables',
      name: 'The Remarkables',
      location: 'Queenstown, South Island',
      country: 'New Zealand',
      rating: 5,
      trails: '220 hectares',
      vertical: '357m',
      adultPrice: 129,
      temperature: -2,
      weatherCondition: 'Fresh Snow',
      riskLevel: 'low',
      isOpen: true,
      isFavorite: true
    },
    {
      id: 'cardrona',
      name: 'Cardrona Alpine Resort',
      location: 'Wānaka, South Island',
      country: 'New Zealand',
      rating: 5,
      trails: '345 hectares',
      vertical: '600m',
      adultPrice: 129,
      temperature: -3,
      weatherCondition: 'Powder',
      riskLevel: 'low',
      isOpen: true,
      isFavorite: true
    },
    {
      id: 'treblecone',
      name: 'Treble Cone',
      location: 'Wānaka, South Island',
      country: 'New Zealand',
      rating: 5,
      trails: '550 hectares',
      vertical: '700m',
      adultPrice: 129,
      temperature: -4,
      weatherCondition: 'Bluebird',
      riskLevel: 'low',
      isOpen: true,
      isFavorite: true
    },
    {
      id: 'snowfarm',
      name: 'Snow Farm NZ',
      location: 'Wānaka, South Island',
      country: 'New Zealand',
      rating: 3,
      trails: 'Cross Country',
      vertical: 'XC Only',
      adultPrice: 35,
      temperature: -2,
      weatherCondition: 'Groomed',
      riskLevel: 'low',
      isOpen: true
    }
  ];

  const filteredResorts = resorts
    .filter(resort =>
      resort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resort.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          const priceA = typeof a.adultPrice === 'number' ? a.adultPrice : 999;
          const priceB = typeof b.adultPrice === 'number' ? b.adultPrice : 999;
          return priceA - priceB;
        default:
          return 0;
      }
    });

  const toggleFavorite = (resortId: string) => {
    setFavorites(prev =>
      prev.includes(resortId)
        ? prev.filter(id => id !== resortId)
        : [...prev, resortId]
    );
  };

  const handleViewResort = (resort: ResortData) => {
    console.log('🔧 ResortSelector: Viewing resort:', resort.id, resort.name);
    
    // Convert ResortData to full Resort format expected by ResortDetailsModal
    const fullResortData: Resort = {
      id: resort.id,
      name: resort.name,
      location: resort.location,
      region: resort.country, // Map country to region
      image: getResortImage(resort.id),
      description: getResortDescription(resort.id),
      lifts: getResortLifts(resort.id),
      runs: typeof resort.trails === 'string' ? parseTrails(resort.trails) : Number(resort.trails),
      vertical: typeof resort.vertical === 'string' ? parseInt(resort.vertical) : Number(resort.vertical),
      price: typeof resort.adultPrice === 'number' ? resort.adultPrice : 129,
      difficulty: getResortDifficulty(resort.id),
      amenities: getResortAmenities(resort.id),
      rating: resort.rating,
      reviews: Math.floor(Math.random() * 500) + 50, // Generate realistic review count
      season: 'June - October',
      snowDepth: Math.floor(Math.random() * 100) + 50, // Generate realistic snow depth
      operatingHours: {
        weekdays: '9:00 AM - 4:00 PM',
        weekends: '8:30 AM - 4:30 PM'
      },
      contactInfo: {
        phone: '+64 3 442 4620',
        website: `www.${resort.id}.co.nz`,
        address: resort.location
      },
      pricing: {
        adult: typeof resort.adultPrice === 'number' ? resort.adultPrice : 129,
        child: typeof resort.adultPrice === 'number' ? Math.floor(resort.adultPrice * 0.7) : 89,
        senior: typeof resort.adultPrice === 'number' ? Math.floor(resort.adultPrice * 0.8) : 109,
        halfDay: typeof resort.adultPrice === 'number' ? Math.floor(resort.adultPrice * 0.75) : 99
      }
    };

    console.log('🔧 ResortSelector: Converted resort data for modal:', fullResortData);
    setSelectedResortForDetails(fullResortData);
    setShowResortDetails(true);
  };

  const handleSelectResort = (resort: ResortData) => {
    console.log('🏔️ Resort selected:', resort.name);
    // Convert ResortData to Resort type
    const resortToSelect: Resort = {
      id: resort.id,
      name: resort.name,
      location: resort.location,
      isOpen: resort.isOpen,
      temperature: resort.temperature,
      weatherCondition: resort.weatherCondition
    };
    console.log('🏔️ Calling onSelectResort with:', resortToSelect);
    onSelectResort(resortToSelect);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'considerable': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low': return 'low risk';
      case 'moderate': return 'moderate risk';
      case 'considerable': return 'considerable risk';
      case 'high': return 'high risk';
      default: return 'unknown risk';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        console.log('🏔️ Dialog open state changed:', open);
        if (!open) {
          onClose();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Mountain className="w-6 h-6" />
              Choose Resort
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              Select a New Zealand ski field to begin tracking your session. Choose from premier commercial resorts, club fields, and community areas across both North and South Islands.
            </DialogDescription>
          </DialogHeader>

          {/* Search and Sort */}
          <div className="p-6 pb-4 border-b bg-gray-50/50">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search resorts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Sort by Rating</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="price">Sort by Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resort Grid */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredResorts.map((resort, index) => (
                  <motion.div
                    key={resort.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer hover:bg-accent/50"
                      onClick={() => handleSelectResort(resort)}
                    >
                      <CardContent className="p-6">
                        {/* Resort Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{resort.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{resort.location}</p>
                            <div className="flex items-center gap-1 mb-3">
                              {renderStars(resort.rating)}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(resort.id);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  favorites.includes(resort.id)
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-gray-400'
                                }`}
                              />
                            </Button>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewResort(resort);
                                }}
                                className="min-h-[36px] px-4 py-2 text-xs font-medium border-primary/20 text-primary hover:bg-primary/5"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button
                                className="snowline-button-primary min-h-[36px] px-4 py-2 text-xs font-semibold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectResort(resort);
                                }}
                              >
                                Select
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-900">
                              {resort.trails}
                            </div>
                            <div className="text-gray-500">Trails</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {resort.vertical}
                            </div>
                            <div className="text-gray-500">Vertical</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {typeof resort.adultPrice === 'number' ? `$${resort.adultPrice}` : resort.adultPrice}
                            </div>
                            <div className="text-gray-500">Adult</div>
                          </div>
                        </div>

                        {/* Weather and Risk */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm pr-4 min-w-0">
                            <Thermometer className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap">{resort.temperature}°C</span>
                            <span className="text-gray-500 truncate">{resort.weatherCondition}</span>
                          </div>
                          <Badge 
                            className={`text-xs font-medium ${getRiskColor(resort.riskLevel)} flex-shrink-0`}
                            variant="secondary"
                          >
                            {getRiskText(resort.riskLevel)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredResorts.length === 0 && (
              <div className="text-center py-8">
                <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resorts found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Resort Details Modal */}
      <ResortDetailsModal
        isOpen={showResortDetails}
        onClose={() => setShowResortDetails(false)}
        resort={selectedResortForDetails}
      />
    </>
  );
}