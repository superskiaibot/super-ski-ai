import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Users, 
  UserPlus, 
  UserCheck, 
  Send, 
  MapPin, 
  Mountain, 
  Star,
  Filter,
  SlidersHorizontal,
  X,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { User as UserType } from '../src/types/index';
import { userService } from '../src/utils/userService';

interface UserSearchProps {
  currentUser: UserType;
  onUserSelect: (user: UserType) => void;
  onClose?: () => void;
  className?: string;
}

type FilterType = 'all' | 'beginners' | 'intermediate' | 'advanced' | 'expert' | 'verified' | 'nearby';
type SortType = 'relevance' | 'name' | 'level' | 'recent' | 'mutual_friends';

interface SearchFilters {
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  isVerified?: boolean;
  location?: string;
  hasRuns?: boolean;
}

// Friend status type
type FriendStatus = 'none' | 'following' | 'friend_request_sent' | 'friend_request_received' | 'friends';

export function UserSearch({ currentUser, onUserSelect, onClose, className = '' }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedSort, setSelectedSort] = useState<SortType>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [showFriendRequestDialog, setShowFriendRequestDialog] = useState(false);
  const [selectedUserForRequest, setSelectedUserForRequest] = useState<UserType | null>(null);
  const [friendRequestMessage, setFriendRequestMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const results = await userService.searchUsers(searchQuery, 50);
          // Filter out current user from results
          const filteredResults = results.filter(user => user.id !== currentUser.id);
          setSearchResults(filteredResults);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, currentUser.id]);

  // Get friend status for a user
  const getFriendStatus = useCallback((user: UserType): FriendStatus => {
    const isFriend = currentUser.friends?.includes(user.id) || false;
    const hasRequestSent = currentUser.friendRequestsSent?.includes(user.id) || false;
    const hasRequestReceived = currentUser.friendRequestsReceived?.includes(user.id) || false;
    const isFollowing = currentUser.following?.includes(user.id) || false;

    if (isFriend) return 'friends';
    if (hasRequestSent) return 'friend_request_sent';
    if (hasRequestReceived) return 'friend_request_received';
    if (isFollowing) return 'following';
    return 'none';
  }, [currentUser]);

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...searchResults];

    // Apply filters
    switch (selectedFilter) {
      case 'beginners':
        filtered = filtered.filter(user => user.level === 'beginner');
        break;
      case 'intermediate':
        filtered = filtered.filter(user => user.level === 'intermediate');
        break;
      case 'advanced':
        filtered = filtered.filter(user => user.level === 'advanced');
        break;
      case 'expert':
        filtered = filtered.filter(user => user.level === 'expert');
        break;
      case 'verified':
        filtered = filtered.filter(user => user.isVerified);
        break;
      case 'nearby':
        filtered = filtered.filter(user => 
          user.profile?.location && 
          currentUser.profile?.location &&
          user.profile.location.toLowerCase().includes(currentUser.profile.location.toLowerCase().split(',')[0])
        );
        break;
    }

    // Apply sorting
    switch (selectedSort) {
      case 'name':
        filtered.sort((a, b) => {
          const nameA = a.displayName || a.name || a.username;
          const nameB = b.displayName || b.name || b.username;
          return nameA.localeCompare(nameB);
        });
        break;
      case 'level':
        const levelOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2, 'expert': 3 };
        filtered.sort((a, b) => (levelOrder[b.level || 'beginner'] || 0) - (levelOrder[a.level || 'beginner'] || 0));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'mutual_friends':
        filtered.sort((a, b) => {
          const mutualA = a.friends?.filter(id => currentUser.friends?.includes(id))?.length || 0;
          const mutualB = b.friends?.filter(id => currentUser.friends?.includes(id))?.length || 0;
          return mutualB - mutualA;
        });
        break;
      default:
        // Keep relevance order (search result order)
        break;
    }

    return filtered;
  }, [searchResults, selectedFilter, selectedSort, currentUser]);

  const getInitials = (user: UserType) => {
    const displayName = user.displayName || user.name || user.username;
    const names = displayName.split(' ');
    return names.map(name => name.charAt(0)).join('').slice(0, 2).toUpperCase();
  };

  const handleFriendAction = async (user: UserType, action: 'send_request' | 'accept' | 'decline') => {
    setIsLoading(true);
    try {
      let result;
      switch (action) {
        case 'send_request':
          setSelectedUserForRequest(user);
          setShowFriendRequestDialog(true);
          setIsLoading(false);
          return;
        case 'accept':
          result = await userService.acceptFriendRequest(currentUser.id, user.id);
          break;
        case 'decline':
          result = await userService.declineFriendRequest(currentUser.id, user.id);
          break;
      }
      
      if (result?.success) {
        // Refresh search results to update friend status
        if (searchQuery.trim().length > 0) {
          const results = await userService.searchUsers(searchQuery, 50);
          const filteredResults = results.filter(u => u.id !== currentUser.id);
          setSearchResults(filteredResults);
        }
      }
    } catch (error) {
      console.error('Friend action error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!selectedUserForRequest) return;
    
    setIsLoading(true);
    try {
      const result = await userService.sendFriendRequest(
        currentUser.id, 
        selectedUserForRequest.id, 
        friendRequestMessage
      );
      
      if (result.success) {
        setShowFriendRequestDialog(false);
        setFriendRequestMessage('');
        setSelectedUserForRequest(null);
        
        // Refresh search results
        if (searchQuery.trim().length > 0) {
          const results = await userService.searchUsers(searchQuery, 50);
          const filteredResults = results.filter(u => u.id !== currentUser.id);
          setSearchResults(filteredResults);
        }
      }
    } catch (error) {
      console.error('Send friend request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFriendButton = (user: UserType) => {
    const status = getFriendStatus(user);
    
    switch (status) {
      case 'friends':
        return (
          <Button
            size="sm"
            variant="secondary"
            className="bg-mountain-green/10 text-mountain-green border-mountain-green/30 hover:bg-mountain-green/20"
          >
            <UserCheck className="w-4 h-4 mr-1" />
            Friends
          </Button>
        );
      
      case 'friend_request_sent':
        return (
          <Button
            size="sm"
            variant="secondary"
            className="bg-warning-yellow/10 text-warning-yellow border-warning-yellow/30"
            disabled
          >
            <Send className="w-4 h-4 mr-1" />
            Sent
          </Button>
        );
      
      case 'friend_request_received':
        return (
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              onClick={() => handleFriendAction(user, 'accept')}
              disabled={isLoading}
              className="bg-mountain-green hover:bg-mountain-green/90 text-white"
            >
              Accept
            </Button>
          </div>
        );
      
      case 'following':
        return (
          <Button
            size="sm"
            onClick={() => handleFriendAction(user, 'send_request')}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Add Friend
          </Button>
        );
      
      default:
        return (
          <Button
            size="sm"
            onClick={() => handleFriendAction(user, 'send_request')}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Add Friend
          </Button>
        );
    }
  };

  const getMutualFriendsCount = (user: UserType) => {
    if (!currentUser.friends || !user.friends) return 0;
    return user.friends.filter(friendId => currentUser.friends?.includes(friendId)).length;
  };

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'all': return 'All Users';
      case 'beginners': return 'Beginners';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      case 'expert': return 'Expert';
      case 'verified': return 'Pro Users';
      case 'nearby': return 'Nearby';
      default: return 'All Users';
    }
  };

  const getSortLabel = (sort: SortType) => {
    switch (sort) {
      case 'relevance': return 'Most Relevant';
      case 'name': return 'Name';
      case 'level': return 'Skill Level';
      case 'recent': return 'Recently Joined';
      case 'mutual_friends': return 'Mutual Friends';
      default: return 'Most Relevant';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-glacier-blue via-snow to-powder-gray ${className}`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Find People</h1>
              <p className="text-muted-foreground">Connect with skiers in the Snowline community</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-lg">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <Card className="snowline-card mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by username, name, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-12 text-base rounded-xl border-border focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 animate-spin" />
              )}
            </div>
            
            {/* Filters and Sort */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      <Filter className="w-4 h-4 mr-2" />
                      {getFilterLabel(selectedFilter)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(['all', 'verified', 'beginners', 'intermediate', 'advanced', 'expert', 'nearby'] as FilterType[]).map(filter => (
                      <DropdownMenuItem
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={selectedFilter === filter ? 'bg-primary/10' : ''}
                      >
                        {getFilterLabel(filter)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      {getSortLabel(selectedSort)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(['relevance', 'name', 'level', 'recent', 'mutual_friends'] as SortType[]).map(sort => (
                      <DropdownMenuItem
                        key={sort}
                        onClick={() => setSelectedSort(sort)}
                        className={selectedSort === sort ? 'bg-primary/10' : ''}
                      >
                        {getSortLabel(sort)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {searchQuery.trim() && (
                <div className="text-sm text-muted-foreground">
                  {filteredAndSortedResults.length} result{filteredAndSortedResults.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {searchQuery.trim() === '' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Start typing to find people</h3>
              <p className="text-muted-foreground">
                Search for other skiers by username, name, or location to connect with them
              </p>
            </motion.div>
          )}

          {searchQuery.trim() !== '' && filteredAndSortedResults.length === 0 && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <Search className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </motion.div>
          )}

          {filteredAndSortedResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {filteredAndSortedResults.map((user, index) => {
                const mutualFriendsCount = getMutualFriendsCount(user);
                
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="snowline-card hover:shadow-lg transition-all duration-200 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <Avatar className="w-16 h-16 border-2 border-border shadow-md">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                {getInitials(user)}
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Pro Badge */}
                            {user.isVerified && (
                              <div className="absolute -top-1 -right-1">
                                <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg h-5 w-5 p-0 flex items-center justify-center rounded-full">
                                  <Star className="w-2.5 h-2.5" />
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <h3 
                                  className="font-semibold text-lg text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                                  onClick={() => onUserSelect(user)}
                                >
                                  {user.displayName || user.name}
                                </h3>
                                <p className="text-muted-foreground text-sm">@{user.username}</p>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                {renderFriendButton(user)}
                              </div>
                            </div>

                            {/* User Details */}
                            <div className="mt-3 flex items-center flex-wrap gap-3">
                              {user.level && (
                                <Badge 
                                  variant={
                                    user.level === 'expert' ? 'destructive' :
                                    user.level === 'advanced' ? 'default' :
                                    user.level === 'intermediate' ? 'secondary' : 'outline'
                                  }
                                  className="text-xs"
                                >
                                  {user.level.charAt(0).toUpperCase() + user.level.slice(1)}
                                </Badge>
                              )}
                              
                              {user.profile?.location && (
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  <span>{user.profile.location}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Mountain className="w-3 h-3" />
                                <span>{user.stats?.totalRuns || 0} runs</span>
                              </div>
                              
                              {mutualFriendsCount > 0 && (
                                <div className="flex items-center space-x-1 text-xs text-primary">
                                  <Users className="w-3 h-3" />
                                  <span>{mutualFriendsCount} mutual friend{mutualFriendsCount !== 1 ? 's' : ''}</span>
                                </div>
                              )}
                            </div>

                            {/* Bio */}
                            {user.profile?.bio && (
                              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                                {user.profile.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Friend Request Dialog */}
        <Dialog open={showFriendRequestDialog} onOpenChange={setShowFriendRequestDialog}>
          <DialogContent className="mx-auto max-w-md w-[90vw] sm:w-full snowline-card">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-xl">
                <UserPlus className="w-6 h-6 text-primary" />
                <span>Send Friend Request</span>
              </DialogTitle>
              <DialogDescription className="leading-relaxed pt-4">
                Send a friend request to <span className="font-medium text-foreground">
                  {selectedUserForRequest?.displayName || selectedUserForRequest?.name}
                </span>? 
                You can include an optional message.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <textarea
                value={friendRequestMessage}
                onChange={(e) => setFriendRequestMessage(e.target.value)}
                placeholder="Hi! I'd like to connect and share skiing adventures together."
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                maxLength={200}
              />
              <div className="text-xs text-muted-foreground mt-2 text-right">
                {friendRequestMessage.length}/200
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                onClick={() => setShowFriendRequestDialog(false)}
                disabled={isLoading}
                className="w-full sm:w-auto min-w-24 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendFriendRequest}
                disabled={isLoading}
                className="w-full sm:w-auto min-w-24 bg-primary hover:bg-primary/90 rounded-xl"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}