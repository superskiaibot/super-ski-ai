import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Stop,
  Save,
  Share2,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  SortAsc,
  MapPin,
  Clock,
  Zap,
  Mountain,
  Heart,
  MessageCircle,
  MoreVertical,
  Edit3,
  Star,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { toast } from 'sonner';
import { SavedRun, RunFilter, RunSort, ConfirmationDialog } from '../../src/types';

interface RunManagerProps {
  runs: SavedRun[];
  onSaveRun: (run: Partial<SavedRun>) => void;
  onUpdateRun: (runId: string, updates: Partial<SavedRun>) => void;
  onDeleteRun: (runId: string) => void;
  onShareRun: (runId: string) => void;
  currentUserId: string;
}

export function RunManager({ 
  runs, 
  onSaveRun, 
  onUpdateRun, 
  onDeleteRun, 
  onShareRun,
  currentUserId 
}: RunManagerProps) {
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
  const [filter, setFilter] = useState<RunFilter>({});
  const [sort, setSort] = useState<RunSort>({ field: 'date', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRun, setEditingRun] = useState<SavedRun | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialog | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort runs
  const filteredRuns = runs
    .filter(run => {
      if (searchQuery && !run.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filter.resort && run.resort.id !== filter.resort) return false;
      if (filter.difficulty && !filter.difficulty.includes(run.stats.difficulty)) return false;
      if (filter.type && !filter.type.includes(run.type)) return false;
      if (filter.isPublic !== undefined && run.isPublic !== filter.isPublic) return false;
      if (filter.minDistance && run.stats.distance < filter.minDistance) return false;
      if (filter.maxDistance && run.stats.distance > filter.maxDistance) return false;
      if (filter.minSpeed && run.stats.maxSpeed < filter.minSpeed) return false;
      if (filter.maxSpeed && run.stats.maxSpeed > filter.maxSpeed) return false;
      if (filter.dateRange) {
        const runDate = new Date(run.startTime);
        if (runDate < filter.dateRange.start || runDate > filter.dateRange.end) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sort.field) {
        case 'date':
          aValue = new Date(a.startTime).getTime();
          bValue = new Date(b.startTime).getTime();
          break;
        case 'distance':
          aValue = a.stats.distance;
          bValue = b.stats.distance;
          break;
        case 'speed':
          aValue = a.stats.maxSpeed;
          bValue = b.stats.maxSpeed;
          break;
        case 'vertical':
          aValue = a.stats.vertical;
          bValue = b.stats.vertical;
          break;
        case 'likes':
          aValue = a.likes;
          bValue = b.likes;
          break;
        case 'duration':
          aValue = a.stats.duration;
          bValue = b.stats.duration;
          break;
        default:
          return 0;
      }
      return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const handleDeleteRun = (run: SavedRun) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Run',
      description: `Are you sure you want to delete "${run.name}"? This action cannot be undone and will permanently remove all associated data including videos, photos, and comments.`,
      confirmText: 'Delete Forever',
      cancelText: 'Keep Run',
      type: 'danger',
      onConfirm: () => {
        onDeleteRun(run.id);
        setConfirmDialog(null);
        toast.success('Run deleted successfully');
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const handleBulkDelete = () => {
    if (selectedRuns.length === 0) return;
    
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${selectedRuns.length} Runs`,
      description: `Are you sure you want to delete ${selectedRuns.length} selected runs? This action cannot be undone and will permanently remove all associated data.`,
      confirmText: `Delete ${selectedRuns.length} Runs`,
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        selectedRuns.forEach(runId => onDeleteRun(runId));
        setSelectedRuns([]);
        setConfirmDialog(null);
        toast.success(`${selectedRuns.length} runs deleted successfully`);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const handleToggleVisibility = (run: SavedRun) => {
    const newVisibility = !run.isPublic;
    setConfirmDialog({
      isOpen: true,
      title: newVisibility ? 'Make Run Public' : 'Make Run Private',
      description: newVisibility 
        ? 'This will make your run visible to other users on your profile and in the social feed. Are you sure?'
        : 'This will hide your run from other users. It will only be visible to you.',
      confirmText: newVisibility ? 'Make Public' : 'Make Private',
      cancelText: 'Cancel',
      type: 'info',
      onConfirm: () => {
        onUpdateRun(run.id, { isPublic: newVisibility });
        setConfirmDialog(null);
        toast.success(`Run is now ${newVisibility ? 'public' : 'private'}`);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'black': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'double_black': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Runs</h2>
          <p className="text-muted-foreground">
            Manage your saved ski runs and sessions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedRuns.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedRuns.length})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter & Sort
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search runs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Badge variant="secondary">
          {filteredRuns.length} of {runs.length} runs
        </Badge>
      </div>

      {/* Runs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredRuns.map((run) => (
            <motion.div
              key={run.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group cursor-pointer border-2 border-transparent hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedRuns.includes(run.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRuns([...selectedRuns, run.id]);
                          } else {
                            setSelectedRuns(selectedRuns.filter(id => id !== run.id));
                          }
                        }}
                        className="rounded"
                      />
                      <Badge className={getDifficultyColor(run.stats.difficulty)}>
                        {run.stats.difficulty.replace('_', ' ')}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingRun(run)}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleVisibility(run)}>
                          {run.isPublic ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Make Private
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Make Public
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onShareRun(run.id)}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Run
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteRun(run)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Run
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg truncate">{run.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      {run.isPublic ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      {run.isFeatured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      {run.videos.length > 0 && (
                        <Play className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                  
                  <CardDescription className="flex items-center space-x-4 text-xs">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {run.resort.name}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(run.startTime).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mountain className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{run.stats.distance.toFixed(1)} km</div>
                        <div className="text-xs text-muted-foreground">Distance</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{run.stats.maxSpeed.toFixed(1)} km/h</div>
                        <div className="text-xs text-muted-foreground">Max Speed</div>
                      </div>
                    </div>
                  </div>

                  {/* Social Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {run.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {run.comments.length}
                      </span>
                      <span className="flex items-center">
                        <Share2 className="w-4 h-4 mr-1" />
                        {run.shares}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {run.isPublic && (
                        <Badge variant="outline" className="text-xs">
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {run.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {run.description}
                    </p>
                  )}

                  {/* Tags */}
                  {run.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {run.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {run.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{run.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredRuns.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Mountain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No runs found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || Object.keys(filter).length > 0
              ? 'Try adjusting your search or filters'
              : 'Start recording your first run to see it here'
            }
          </p>
          {!searchQuery && Object.keys(filter).length === 0 && (
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          )}
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <Dialog open={confirmDialog.isOpen} onOpenChange={() => setConfirmDialog(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center space-x-3">
                {confirmDialog.type === 'danger' && (
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                )}
                {confirmDialog.type === 'warning' && (
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                )}
                {confirmDialog.type === 'info' && (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <DialogTitle>{confirmDialog.title}</DialogTitle>
              </div>
            </DialogHeader>
            <DialogDescription className="text-base">
              {confirmDialog.description}
            </DialogDescription>
            <DialogFooter className="flex space-x-2">
              <Button
                variant="outline"
                onClick={confirmDialog.onCancel}
              >
                {confirmDialog.cancelText}
              </Button>
              <Button
                variant={confirmDialog.type === 'danger' ? 'destructive' : 'default'}
                onClick={confirmDialog.onConfirm}
              >
                {confirmDialog.confirmText}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}