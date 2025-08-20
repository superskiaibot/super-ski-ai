import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Save, 
  RotateCcw, 
  ExternalLink, 
  Upload, 
  X, 
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Lock,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { User as UserType } from '../../src/types/index';

interface ResortSelectionCardProps {
  currentUser: UserType;
  userRole: 'platform_admin' | 'resort_admin' | 'event_manager';
  selectedResort: any;
  dateRange: string;
  onScreenChange: (screen: string) => void;
}

interface ResortConfig {
  title: string;
  subtitle: string;
  heroImage: string;
  tags: string[];
  primaryCta: {
    label: string;
    url: string;
  };
  secondaryCta: {
    label: string;
    url: string;
    enabled: boolean;
  };
  sortWeight: number;
  status: 'open' | 'closed';
  description: string;
}

export function ResortSelectionCard({ 
  currentUser, 
  userRole, 
  selectedResort, 
  dateRange, 
  onScreenChange 
}: ResortSelectionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mock current configuration
  const [config, setConfig] = useState<ResortConfig>({
    title: selectedResort?.name || 'Coronet Peak',
    subtitle: 'Queenstown\'s Premier Ski Experience',
    heroImage: 'https://images.unsplash.com/photo-1551524164-6cf2ac886a3e?w=800&h=450&fit=crop',
    tags: ['Advanced Terrain', 'Night Skiing', 'Snow Making', 'Ski School'],
    primaryCta: {
      label: 'View Conditions',
      url: 'https://coronetpeak.co.nz/conditions'
    },
    secondaryCta: {
      label: 'Buy Lift Pass',
      url: 'https://coronetpeak.co.nz/passes',
      enabled: true
    },
    sortWeight: 1,
    status: 'open',
    description: 'Experience world-class skiing with breathtaking views of Lake Wakatipu and the surrounding mountains.'
  });

  const [newTag, setNewTag] = useState('');

  const handleConfigChange = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
    setSaveSuccess(false);
    
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedConfigChange = (parent: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ResortConfig],
        [field]: value
      }
    }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const addTag = () => {
    if (newTag.trim() && !config.tags.includes(newTag.trim())) {
      setConfig(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      setHasChanges(true);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setConfig(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    setHasChanges(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!config.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!config.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle is required';
    }

    if (!config.heroImage.trim()) {
      newErrors.heroImage = 'Hero image URL is required';
    } else if (!isValidUrl(config.heroImage)) {
      newErrors.heroImage = 'Please enter a valid URL';
    }

    if (!config.primaryCta.label.trim()) {
      newErrors.primaryCtaLabel = 'Primary CTA label is required';
    }

    if (!config.primaryCta.url.trim()) {
      newErrors.primaryCtaUrl = 'Primary CTA URL is required';
    } else if (!isValidUrl(config.primaryCta.url)) {
      newErrors.primaryCtaUrl = 'Please enter a valid URL';
    }

    if (config.secondaryCta.enabled && !config.secondaryCta.url.trim()) {
      newErrors.secondaryCtaUrl = 'Secondary CTA URL is required when enabled';
    } else if (config.secondaryCta.enabled && !isValidUrl(config.secondaryCta.url)) {
      newErrors.secondaryCtaUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    
    // Simulate save API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setHasChanges(false);
    setSaveSuccess(true);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    // Reset to original values (in real app, fetch from API)
    setConfig({
      title: selectedResort?.name || 'Coronet Peak',
      subtitle: 'Queenstown\'s Premier Ski Experience',
      heroImage: 'https://images.unsplash.com/photo-1551524164-6cf2ac886a3e?w=800&h=450&fit=crop',
      tags: ['Advanced Terrain', 'Night Skiing', 'Snow Making', 'Ski School'],
      primaryCta: {
        label: 'View Conditions',
        url: 'https://coronetpeak.co.nz/conditions'
      },
      secondaryCta: {
        label: 'Buy Lift Pass',
        url: 'https://coronetpeak.co.nz/passes',
        enabled: true
      },
      sortWeight: 1,
      status: 'open',
      description: 'Experience world-class skiing with breathtaking views of Lake Wakatipu and the surrounding mountains.'
    });
    setHasChanges(false);
    setErrors({});
    setSaveSuccess(false);
  };

  const canEdit = userRole === 'resort_admin' || userRole === 'platform_admin';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resort Selection Card</h1>
          <p className="text-gray-600 mt-1">
            Configure how your resort appears in the user app
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
          </Button>
          
          {!canEdit && (
            <Badge className="bg-gray-100 text-gray-700 border-gray-200">
              <Lock className="w-3 h-3 mr-1" />
              Read Only
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Update your resort's appearance and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={config.title}
                    onChange={(e) => handleConfigChange('title', e.target.value)}
                    disabled={!canEdit}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.title}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle *</Label>
                  <Input
                    id="subtitle"
                    value={config.subtitle}
                    onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                    disabled={!canEdit}
                    className={errors.subtitle ? 'border-red-500' : ''}
                  />
                  {errors.subtitle && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.subtitle}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={config.description}
                    onChange={(e) => handleConfigChange('description', e.target.value)}
                    disabled={!canEdit}
                    rows={3}
                  />
                </div>
              </div>

              {/* Hero Image */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Hero Image</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="heroImage">Image URL *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="heroImage"
                      value={config.heroImage}
                      onChange={(e) => handleConfigChange('heroImage', e.target.value)}
                      disabled={!canEdit}
                      placeholder="https://example.com/image.jpg"
                      className={errors.heroImage ? 'border-red-500' : ''}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" disabled={!canEdit}>
                            <Upload className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload image (recommended: 16:9 ratio)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {errors.heroImage && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.heroImage}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Recommended: 800x450px (16:9 ratio) for optimal display
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Tags</h3>
                
                <div className="flex flex-wrap gap-2">
                  {config.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      {canEdit && (
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>

                {canEdit && (
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Call-to-Action Buttons */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Call-to-Action Buttons</h3>
                
                {/* Primary CTA */}
                <div className="space-y-2">
                  <Label>Primary CTA *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        value={config.primaryCta.label}
                        onChange={(e) => handleNestedConfigChange('primaryCta', 'label', e.target.value)}
                        disabled={!canEdit}
                        placeholder="Button label"
                        className={errors.primaryCtaLabel ? 'border-red-500' : ''}
                      />
                      {errors.primaryCtaLabel && (
                        <p className="text-xs text-red-600 mt-1">{errors.primaryCtaLabel}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        value={config.primaryCta.url}
                        onChange={(e) => handleNestedConfigChange('primaryCta', 'url', e.target.value)}
                        disabled={!canEdit}
                        placeholder="https://..."
                        className={errors.primaryCtaUrl ? 'border-red-500' : ''}
                      />
                      {errors.primaryCtaUrl && (
                        <p className="text-xs text-red-600 mt-1">{errors.primaryCtaUrl}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Secondary CTA */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Secondary CTA</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="secondaryCta" className="text-sm">Enabled</Label>
                      <Switch
                        id="secondaryCta"
                        checked={config.secondaryCta.enabled}
                        onCheckedChange={(checked) => handleNestedConfigChange('secondaryCta', 'enabled', checked)}
                        disabled={!canEdit}
                      />
                    </div>
                  </div>
                  
                  {config.secondaryCta.enabled && (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={config.secondaryCta.label}
                        onChange={(e) => handleNestedConfigChange('secondaryCta', 'label', e.target.value)}
                        disabled={!canEdit}
                        placeholder="Button label"
                      />
                      <div>
                        <Input
                          value={config.secondaryCta.url}
                          onChange={(e) => handleNestedConfigChange('secondaryCta', 'url', e.target.value)}
                          disabled={!canEdit}
                          placeholder="https://..."
                          className={errors.secondaryCtaUrl ? 'border-red-500' : ''}
                        />
                        {errors.secondaryCtaUrl && (
                          <p className="text-xs text-red-600 mt-1">{errors.secondaryCtaUrl}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Settings</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sortWeight">Sort Weight</Label>
                    <Input
                      id="sortWeight"
                      type="number"
                      value={config.sortWeight}
                      onChange={(e) => handleConfigChange('sortWeight', parseInt(e.target.value) || 0)}
                      disabled={!canEdit}
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-500">Higher numbers appear first</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={config.status}
                      onValueChange={(value) => handleConfigChange('status', value)}
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {canEdit && (
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className="flex items-center space-x-2"
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Save className="w-4 h-4" />
                        </motion.div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={!hasChanges || isSaving}
                    className="flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </Button>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" disabled className="flex items-center space-x-2">
                          <ExternalLink className="w-4 h-4" />
                          <span>View in App</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>No changes to public app layout</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              {/* Success Message */}
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Configuration saved successfully!</span>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview Pane */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Live Preview</span>
                </CardTitle>
                <CardDescription>
                  How this will appear in the user app
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mock User App Card */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                  {/* Hero Image */}
                  <div className="relative h-48 bg-gray-200">
                    {config.heroImage ? (
                      <img
                        src={config.heroImage}
                        alt={config.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="w-8 h-8" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${
                        config.status === 'open' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {config.status === 'open' ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{config.title}</h3>
                      <p className="text-gray-600 mt-1">{config.subtitle}</p>
                    </div>

                    {config.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">{config.description}</p>
                    )}

                    {/* Tags */}
                    {config.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {config.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex space-x-3 pt-2">
                      <Button className="flex-1">
                        {config.primaryCta.label}
                      </Button>
                      {config.secondaryCta.enabled && (
                        <Button variant="outline" className="flex-1">
                          {config.secondaryCta.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preview Notes */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Preview Notes:</p>
                      <ul className="text-xs space-y-1">
                        <li>• This preview shows how your resort card appears to users</li>
                        <li>• Actual display may vary based on user device and app version</li>
                        <li>• Changes only affect the admin configuration, not public app layout</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}