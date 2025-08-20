import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Square,
  MapPin,
  Zap,
  Activity,
  Clock,
  Mountain,
  Thermometer,
  Wind,
  Eye,
  Camera,
  Video,
  Save,
  Share2,
  Settings,
  Target,
  TrendingUp,
  Navigation
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { User, SavedRun, Resort } from '../src/types';

interface RecordingProps {
  currentUser: User;
  runs: SavedRun[];
  resorts: Resort[];
  onSaveRun: (run: SavedRun) => void;
}

type RecordingState = 'idle' | 'recording' | 'paused';

export function Recording({ currentUser, runs, resorts, onSaveRun }: RecordingProps) {
  const [state, setState] = useState<RecordingState>('idle');
  const [isGPSActive, setIsGPSActive] = useState(false);
  const [currentStats, setCurrentStats] = useState({
    distance: 0,
    currentSpeed: 0,
    maxSpeed: 0,
    averageSpeed: 0,
    vertical: 0,
    duration: 0,
    altitude: 0
  });
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveForm, setSaveForm] = useState({
    name: '',
    description: '',
    difficulty: 'blue' as 'green' | 'blue' | 'black' | 'double_black',
    tags: '',
    isPublic: true
  });

  // Refs for intervals
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const gpsInterval = useRef<NodeJS.Timeout | null>(null);

  // Mock GPS coordinates for demo
  const [mockGPSData, setMockGPSData] = useState({
    latitude: 49.1236,
    longitude: -122.9509,
    altitude: 2182,
    accuracy: 5
  });

  const weatherData = {
    temperature: -5,
    conditions: 'Light Snow',
    windSpeed: 12,
    visibility: 'Good'
  };

  // Start GPS tracking
  const startGPS = () => {
    setIsGPSActive(true);
    toast.success('GPS tracking activated');
    
    // Simulate GPS updates
    gpsInterval.current = setInterval(() => {
      setMockGPSData(prev => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.0001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.0001,
        altitude: prev.altitude + (Math.random() - 0.5) * 10,
        accuracy: Math.random() * 5 + 3
      }));
    }, 1000);
  };

  // Stop GPS tracking
  const stopGPS = () => {
    setIsGPSActive(false);
    if (gpsInterval.current) {
      clearInterval(gpsInterval.current);
      gpsInterval.current = null;
    }
  };

  // Start recording
  const startRecording = () => {
    if (!selectedResort) {
      toast.error('Please select a resort first');
      return;
    }

    setState('recording');
    setStartTime(new Date());
    startGPS();
    
    // Simulate recording data updates
    recordingInterval.current = setInterval(() => {
      setCurrentStats(prev => {
        const newDistance = prev.distance + Math.random() * 0.1;
        const newSpeed = Math.random() * 60 + 20; // 20-80 km/h
        const newVertical = prev.vertical + Math.random() * 5;
        const duration = prev.duration + 1;
        
        return {
          distance: newDistance,
          currentSpeed: newSpeed,
          maxSpeed: Math.max(prev.maxSpeed, newSpeed),
          averageSpeed: newDistance / (duration / 3600),
          vertical: newVertical,
          duration,
          altitude: mockGPSData.altitude
        };
      });
    }, 1000);

    toast.success('Recording started');
  };

  // Pause recording
  const pauseRecording = () => {
    setState('paused');
    setPausedTime(prev => prev + (Date.now() - (startTime?.getTime() || 0)));
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    
    toast.info('Recording paused');
  };

  // Resume recording
  const resumeRecording = () => {
    setState('recording');
    setStartTime(new Date());
    
    recordingInterval.current = setInterval(() => {
      setCurrentStats(prev => {
        const newDistance = prev.distance + Math.random() * 0.1;
        const newSpeed = Math.random() * 60 + 20;
        const newVertical = prev.vertical + Math.random() * 5;
        const duration = prev.duration + 1;
        
        return {
          distance: newDistance,
          currentSpeed: newSpeed,
          maxSpeed: Math.max(prev.maxSpeed, newSpeed),
          averageSpeed: newDistance / (duration / 3600),
          vertical: newVertical,
          duration,
          altitude: mockGPSData.altitude
        };
      });
    }, 1000);

    toast.success('Recording resumed');
  };

  // Stop recording
  const stopRecording = () => {
    setState('idle');
    stopGPS();
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }

    // Generate run name if empty
    if (!saveForm.name) {
      const timeStr = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setSaveForm(prev => ({
        ...prev,
        name: `Run at ${selectedResort?.name} ${timeStr}`
      }));
    }

    setIsSaveDialogOpen(true);
    toast.success('Recording stopped');
  };

  // Save run
  const saveRun = () => {
    if (!startTime || !selectedResort) return;

    const newRun: SavedRun = {
      id: `run_${Date.now()}`,
      userId: currentUser.id,
      name: saveForm.name,
      description: saveForm.description,
      startTime: startTime,
      endTime: new Date(),
      resort: selectedResort,
      trail: {
        id: `trail_${Date.now()}`,
        name: saveForm.name,
        difficulty: saveForm.difficulty
      },
      stats: {
        distance: Math.round(currentStats.distance * 10) / 10,
        maxSpeed: Math.round(currentStats.maxSpeed * 10) / 10,
        averageSpeed: Math.round(currentStats.averageSpeed * 10) / 10,
        vertical: Math.round(currentStats.vertical),
        duration: currentStats.duration,
        difficulty: saveForm.difficulty
      },
      gpsTrack: [],
      isPublic: saveForm.isPublic,
      isFeatured: false,
      tags: saveForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      weather: weatherData,
      equipment: {
        skis: 'Rossignol Experience 88',
        boots: 'Lange RX 130',
        bindings: 'Look Pivot 14'
      },
      videos: [],
      photos: [],
      likes: 0,
      comments: [],
      shares: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSaveRun(newRun);
    
    // Reset form and stats
    setCurrentStats({
      distance: 0,
      currentSpeed: 0,
      maxSpeed: 0,
      averageSpeed: 0,
      vertical: 0,
      duration: 0,
      altitude: 0
    });
    setSaveForm({
      name: '',
      description: '',
      difficulty: 'blue',
      tags: '',
      isPublic: true
    });
    setStartTime(null);
    setPausedTime(0);
    setIsSaveDialogOpen(false);

    toast.success('Run saved successfully!');
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      if (gpsInterval.current) {
        clearInterval(gpsInterval.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Record Your Run</h1>
        <p className="text-muted-foreground">
          Track your skiing performance with GPS precision
        </p>
      </motion.div>

      {/* Resort Selection */}
      {!selectedResort && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Select Resort
              </CardTitle>
              <CardDescription>Choose your skiing location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resorts.map((resort) => (
                  <Card
                    key={resort.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedResort(resort)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Mountain className="w-8 h-8 text-primary" />
                        <div>
                          <h4 className="font-semibold">{resort.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {resort.location}, {resort.country}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {selectedResort && (
        <>
          {/* Recording Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  {state === 'idle' && (
                    <Button
                      onClick={startRecording}
                      size="lg"
                      className="w-20 h-20 rounded-full"
                    >
                      <Play className="w-8 h-8" />
                    </Button>
                  )}
                  
                  {state === 'recording' && (
                    <>
                      <Button
                        onClick={pauseRecording}
                        size="lg"
                        variant="outline"
                        className="w-16 h-16 rounded-full"
                      >
                        <Pause className="w-6 h-6" />
                      </Button>
                      <Button
                        onClick={stopRecording}
                        size="lg"
                        variant="destructive"
                        className="w-16 h-16 rounded-full"
                      >
                        <Square className="w-6 h-6" />
                      </Button>
                    </>
                  )}
                  
                  {state === 'paused' && (
                    <>
                      <Button
                        onClick={resumeRecording}
                        size="lg"
                        className="w-16 h-16 rounded-full"
                      >
                        <Play className="w-6 h-6" />
                      </Button>
                      <Button
                        onClick={stopRecording}
                        size="lg"
                        variant="destructive"
                        className="w-16 h-16 rounded-full"
                      >
                        <Square className="w-6 h-6" />
                      </Button>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge 
                      variant={state === 'recording' ? 'default' : state === 'paused' ? 'secondary' : 'outline'}
                    >
                      {state === 'recording' ? 'Recording' : state === 'paused' ? 'Paused' : 'Ready'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GPS:</span>
                    <Badge variant={isGPSActive ? 'default' : 'outline'}>
                      {isGPSActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resort:</span>
                    <span className="text-sm font-medium">{selectedResort.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mx-auto mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold">{formatDuration(currentStats.duration)}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mx-auto mb-2">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold">{currentStats.distance.toFixed(1)} km</div>
                  <div className="text-sm text-muted-foreground">Distance</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 mx-auto mb-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold">{currentStats.currentSpeed.toFixed(1)} km/h</div>
                  <div className="text-sm text-muted-foreground">Current Speed</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 mx-auto mb-2">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold">{currentStats.maxSpeed.toFixed(1)} km/h</div>
                  <div className="text-sm text-muted-foreground">Max Speed</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mx-auto mb-2">
                    <Mountain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold">{currentStats.vertical.toFixed(0)} m</div>
                  <div className="text-sm text-muted-foreground">Vertical</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 mx-auto mb-2">
                    <Navigation className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold">{currentStats.altitude.toFixed(0)} m</div>
                  <div className="text-sm text-muted-foreground">Altitude</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 mx-auto mb-2">
                    <Target className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="text-2xl font-bold">{currentStats.averageSpeed.toFixed(1)} km/h</div>
                  <div className="text-sm text-muted-foreground">Avg Speed</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mx-auto mb-2">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-2xl font-bold">±{mockGPSData.accuracy.toFixed(0)}m</div>
                  <div className="text-sm text-muted-foreground">GPS Accuracy</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Weather & Conditions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  Current Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Thermometer className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <div className="font-semibold">{weatherData.temperature}°C</div>
                    <div className="text-sm text-muted-foreground">Temperature</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 text-gray-500 flex items-center justify-center">❄️</div>
                    <div className="font-semibold">{weatherData.conditions}</div>
                    <div className="text-sm text-muted-foreground">Conditions</div>
                  </div>
                  
                  <div className="text-center">
                    <Wind className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <div className="font-semibold">{weatherData.windSpeed} km/h</div>
                    <div className="text-sm text-muted-foreground">Wind Speed</div>
                  </div>
                  
                  <div className="text-center">
                    <Eye className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <div className="font-semibold">{weatherData.visibility}</div>
                    <div className="text-sm text-muted-foreground">Visibility</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {/* Save Run Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="save-run-description">
          <DialogHeader>
            <DialogTitle>Save Your Run</DialogTitle>
            <DialogDescription id="save-run-description">
              Add details about your skiing session
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="runName">Run Name</Label>
              <Input
                id="runName"
                value={saveForm.name}
                onChange={(e) => setSaveForm({...saveForm, name: e.target.value})}
                placeholder="Epic powder run"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={saveForm.description}
                onChange={(e) => setSaveForm({...saveForm, description: e.target.value})}
                placeholder="Describe your run..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={saveForm.difficulty} onValueChange={(value: any) => setSaveForm({...saveForm, difficulty: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="green">Green Circle</SelectItem>
                  <SelectItem value="blue">Blue Square</SelectItem>
                  <SelectItem value="black">Black Diamond</SelectItem>
                  <SelectItem value="double_black">Double Black Diamond</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={saveForm.tags}
                onChange={(e) => setSaveForm({...saveForm, tags: e.target.value})}
                placeholder="powder, epic, morning (comma separated)"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={saveForm.isPublic}
                onCheckedChange={(checked) => setSaveForm({...saveForm, isPublic: checked})}
              />
              <Label htmlFor="isPublic">Make run public</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRun} disabled={!saveForm.name.trim()}>
              <Save className="w-4 h-4 mr-2" />
              Save Run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}