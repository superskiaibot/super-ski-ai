import React, { useState, useEffect } from 'react';
import { 
  Settings,
  Image,
  MapPin,
  Mountain,
  Camera,
  Edit,
  Save,
  Eye,
  Upload,
  Thermometer,
  Snowflake,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  RotateCcw,
  Smartphone,
  Monitor,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/textarea';
import { Label } from '../../../ui/label';
import { Switch } from '../../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Separator } from '../../../ui/separator';
import { ResortData } from '../types';
import { ImageWithFallback } from '../../../figma/ImageWithFallback';
import { ResortDetailsModal } from '../../../ResortDetailsModal';
import { 
  resortCustomizationService, 
  ResortCustomizationData 
} from '../../../../src/utils/resortCustomizationService';

interface ResortCustomizationProps {
  resortData: ResortData;
}

export function ResortCustomization({ resortData }: ResortCustomizationProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAppConnection, setShowAppConnection] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Resort customization data
  const [customizationData, setCustomizationData] = useState<ResortCustomizationData>({
    id: 'coronetpeak',
    name: 'Coronet Peak',
    location: 'Queenstown',
    region: 'South Island, New Zealand',
    image: 'https://images.unsplash.com/photo-1551524164-6cf2ac135c1f?w=800&h=600&fit=crop',
    description: 'New Zealand\'s premier ski destination with world-class facilities and stunning alpine scenery.',
    temperature: -5,
    snowDepth: 75,
    operatingStatus: 'Open',
    customization: {
      heroImage: 'https://images.unsplash.com/photo-1551524164-6cf2ac135c1f?w=800&h=600&fit=crop',
      overlayGradient: 'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
      textColor: 'text-white',
      badgeStyle: 'default'
    },
    isCustomized: false,
    lastUpdated: new Date().toISOString()
  });

  // Load existing data on component mount
  useEffect(() => {
    loadResortData();
  }, []);

  const loadResortData = async () => {
    setIsLoading(true);
    try {
      const response = await resortCustomizationService.getResortData('coronetpeak');
      if (response.success && response.data) {
        // Ensure customization object has all required properties
        const data = {
          ...response.data,
          customization: {
            heroImage: response.data.customization?.heroImage || response.data.image || 'https://images.unsplash.com/photo-1551524164-6cf2ac135c1f?w=800&h=600&fit=crop',
            overlayGradient: response.data.customization?.overlayGradient || 'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
            textColor: response.data.customization?.textColor || 'text-white',
            badgeStyle: response.data.customization?.badgeStyle || 'default'
          }
        };
        setCustomizationData(data);
      }
    } catch (error) {
      console.error('Failed to load resort data:', error);
      setErrorMessage('Failed to load resort data');
    } finally {
      setIsLoading(false);
    }
  };

  // Add demo customization data for Coronet Peak to test the connection
  const createDemoCustomization = async () => {
    try {
      const demoData = {
        id: 'coronetpeak',
        name: 'Coronet Peak - Premium Experience',
        location: 'Queenstown, New Zealand',
        region: 'South Island, New Zealand',
        image: 'https://images.unsplash.com/photo-1551524164-6cf2ac135c1f?w=800&h=600&fit=crop',
        description: 'Experience New Zealand\'s most prestigious alpine destination with world-class facilities, reliable snow conditions, and breathtaking Southern Alps scenery. Customized by Coronet Peak Management.',
        temperature: -8,
        snowDepth: 95,
        operatingStatus: 'Open - Excellent Conditions',
        customization: {
          heroImage: 'https://images.unsplash.com/photo-1551524164-6cf2ac135c1f?w=800&h=600&fit=crop',
          overlayGradient: 'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
          textColor: 'text-white',
          badgeStyle: 'default'
        },
        isCustomized: true,
        lastUpdated: new Date().toISOString()
      };

      console.log('🔧 Creating demo customization for Coronet Peak...');
      const response = await resortCustomizationService.updateResortData('coronetpeak', demoData);
      console.log('🔧 Demo customization response:', response);
      
      if (response.success) {
        setCustomizationData(response.data);
        console.log('✅ Demo customization created successfully!');
      }
    } catch (error) {
      console.error('❌ Failed to create demo customization:', error);
    }
  };

  const handleInputChange = (field: string, value: any, section?: string) => {
    setHasUnsavedChanges(true);
    
    if (section) {
      setCustomizationData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof ResortCustomizationData],
          [field]: value
        }
      }));
    } else {
      setCustomizationData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    setErrorMessage('');

    try {
      const response = await resortCustomizationService.updateResortData(
        customizationData.id,
        customizationData
      );

      if (response.success) {
        setHasUnsavedChanges(false);
        setIsEditing(false);
        setSaveStatus('success');
        
        // Update with server response
        if (response.data) {
          setCustomizationData(response.data);
        }

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      } else {
        setSaveStatus('error');
        setErrorMessage(response.error || 'Failed to save resort data');
      }
    } catch (error) {
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save resort data');
      console.error('Error saving resort data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all customizations? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await resortCustomizationService.resetResortData(customizationData.id);
      if (response.success) {
        // Reload default data
        await loadResortData();
        setHasUnsavedChanges(false);
        setIsEditing(false);
        setSaveStatus('success');
      }
    } catch (error) {
      setErrorMessage('Failed to reset resort data');
      console.error('Error resetting resort data:', error);
    }
  };

  // Convert to ResortDetailsModal format
  const convertToModalFormat = () => {
    // Create a comprehensive resort object that matches the full app experience
    return {
      id: customizationData.id,
      name: customizationData.name,
      location: customizationData.location,
      region: customizationData.region,
      image: customizationData.image,
      description: customizationData.description,
      lifts: 6,
      runs: 28,
      vertical: 481,
      price: 89,
      difficulty: {
        beginner: 25,
        intermediate: 45,
        advanced: 25,
        expert: 5
      },
      amenities: [
        'Ski Rental & Tuning',
        'Ski School',
        'Mountain Restaurant',
        'Free WiFi',
        'Parking',
        'First Aid Station',
        'Equipment Storage',
        'Rental Shop'
      ],
      rating: 4.5,
      reviews: 247,
      season: 'June - October',
      snowDepth: customizationData.snowDepth,
      operatingHours: {
        weekdays: '9:00 AM - 4:00 PM',
        weekends: '8:30 AM - 4:30 PM'
      },
      contactInfo: {
        phone: '+64 3 442 4620',
        website: 'https://www.resort.co.nz',
        address: `${customizationData.location}, New Zealand`
      },
      pricing: {
        adult: 89,
        child: 55,
        senior: 65,
        halfDay: 65
      },
      // Additional properties for full app experience
      country: 'New Zealand',
      weatherCondition: 'Fresh Snow',
      riskLevel: 'low' as const,
      isOpen: true,
      isFavorite: false
    };
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="snowline-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Mountain className="w-5 h-5" />
              <span>Resort Customization Status</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="customization-toggle" className="text-sm font-medium">
                Customized
              </Label>
              <Switch
                id="customization-toggle"
                checked={customizationData.isCustomized}
                disabled
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                customizationData.isCustomized ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <div>
                <p className="font-medium">
                  {customizationData.isCustomized ? 'Customized Resort' : 'Default Template'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {customizationData.isCustomized 
                    ? 'Your resort has custom branding and content' 
                    : 'Using the default Snowline template'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setShowPreview(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Full App Preview
              </Button>
            </div>
          </div>

          {/* Live Connection Demo */}
          <Card className="snowline-card border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">Live in Snowline App</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your customizations appear instantly when users view your resort in the main app. 
                    The exact template design is preserved with your custom data.
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                      onClick={() => setShowAppConnection(true)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View in App
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="rounded-lg"
                      onClick={createDemoCustomization}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Demo Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Status */}
          {saveStatus === 'success' && (
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Changes Saved Successfully</p>
                <p className="text-xs text-green-700">Your resort customizations are now live</p>
              </div>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Save Failed</p>
                <p className="text-xs text-red-700">{errorMessage}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSave}>
                Retry
              </Button>
            </div>
          )}

          {hasUnsavedChanges && (
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">Unsaved Changes</p>
                <p className="text-xs text-yellow-700">Don't forget to save your customizations</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setHasUnsavedChanges(false);
                  loadResortData(); // Reload original data
                }}>
                  Discard
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-yellow-600 hover:bg-yellow-700">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Template Preview */}
      <Card className="snowline-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="w-5 h-5" />
            <span>Current Template Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
            <ImageWithFallback
              src={customizationData.image}
              alt={customizationData.name}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay matching the selected gradient */}
            <div className={`absolute inset-0 ${customizationData.customization.overlayGradient}`} />
            
            {/* Temperature Badge */}
            <div className="absolute top-4 left-4">
              <div className="bg-white/90 rounded-lg px-3 py-1">
                <div className="flex items-center space-x-1">
                  <Thermometer className="w-3 h-3 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-900">{customizationData.temperature}°C</span>
                </div>
              </div>
            </div>

            {/* Snow Depth Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-green-500/90 rounded-lg px-3 py-1">
                <div className="flex items-center space-x-1">
                  <Snowflake className="w-3 h-3 text-white" />
                  <span className="text-white font-semibold text-sm">{customizationData.snowDepth}cm</span>
                </div>
              </div>
            </div>

            {/* Resort Info */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className={customizationData.customization.textColor}>
                <h3 className="text-xl font-bold mb-1">{customizationData.name}</h3>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{customizationData.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              This is exactly how your resort appears in the Snowline app
            </p>
            <div className="mt-3 text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
              Click "Full App Preview" above to see the complete experience with all tabs, weather reports, terrain breakdown, facilities, and contact information - exactly as users see it in the main app.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <Card className="snowline-card">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="resort-name">Resort Name</Label>
              <Input
                id="resort-name"
                value={customizationData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1 rounded-xl"
                placeholder="Enter resort name"
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={customizationData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mt-1 rounded-xl"
                placeholder="City, Region"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={customizationData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-1 rounded-xl"
              rows={4}
              placeholder="Resort description that appears in the mini page"
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                value={customizationData.temperature}
                onChange={(e) => handleInputChange('temperature', Number(e.target.value))}
                className="mt-1 rounded-xl"
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="snow-depth">Snow Depth (cm)</Label>
              <Input
                id="snow-depth"
                type="number"
                value={customizationData.snowDepth}
                onChange={(e) => handleInputChange('snowDepth', Number(e.target.value))}
                className="mt-1 rounded-xl"
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderImages = () => (
    <div className="space-y-6">
      <Card className="snowline-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Image className="w-5 h-5" />
            <span>Hero Image</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video rounded-xl overflow-hidden bg-muted">
            <ImageWithFallback
              src={customizationData.image}
              alt="Resort Hero"
              className="w-full h-full object-cover"
            />
          </div>
          
          {isEditing && (
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={customizationData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="mt-1 rounded-xl"
                placeholder="https://..."
              />
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            Recommended: 800x600px or larger, high quality resort photography
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Resort Customization</h2>
          <p className="text-muted-foreground">Customize how your resort appears in the Snowline app</p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing && (
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              setHasUnsavedChanges(false);
              loadResortData();
            }}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
          
          {customizationData.isCustomized && !isEditing && (
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
          )}
          
          <Button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isSaving || isLoading}
            className={isEditing ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isEditing ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <Edit className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Resort'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading resort data...</span>
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="basic" className="rounded-lg">Basic Info</TabsTrigger>
            <TabsTrigger value="images" className="rounded-lg">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="basic">
            {renderBasicInfo()}
          </TabsContent>

          <TabsContent value="images">
            {renderImages()}
          </TabsContent>
        </Tabs>
      )}

      {/* Preview Modal - Uses exact same ResortDetailsModal with Portal */}
      {(showPreview || showAppConnection) && typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            {showPreview && (
              <ResortDetailsModal
                resort={convertToModalFormat()}
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                showSelectButton={false}
              />
            )}
            
            {showAppConnection && (
              <ResortDetailsModal
                resort={convertToModalFormat()}
                isOpen={showAppConnection}
                onClose={() => setShowAppConnection(false)}
                showSelectButton={true}
              />
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}