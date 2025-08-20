import { User, SavedRun, UserStats, UserPreferences, PublicProfile, BusinessProfile } from '../types/index';
import { getAllMockUsers } from './mockUsers';

// Mock database - in a real app this would be replaced with actual API calls
let mockDatabase = {
  users: new Map<string, User>(),
  userStats: new Map<string, UserStats>(),
  userRuns: new Map<string, SavedRun[]>(),
  userSessions: new Map<string, any>(),
  userPreferences: new Map<string, UserPreferences>(),
  friendRequests: new Map<string, FriendRequest[]>() // New: Store friend requests
};

// Friend request interface
interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: Date;
  respondedAt?: Date;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: File;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  equipment: any;
  favoriteResort?: string;
  accountType: 'individual' | 'business' | 'team';
  companyName?: string;
  companyType?: string;
  units: 'metric' | 'imperial';
  privacy: 'public' | 'followers' | 'private';
  notifications: boolean;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToMarketing: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UpdateUserData {
  displayName?: string;
  username?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  bio?: string;
  avatar?: string;
  level?: string;
  preferences?: Partial<UserPreferences>;
  profile?: Partial<PublicProfile>;
  businessProfile?: Partial<BusinessProfile>;
  stats?: Partial<UserStats>;
}

export class UserService {
  private static instance: UserService;
  private currentUser: User | null = null;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
      // Initialize mock data when creating the service
      UserService.instance.initializeMockData();
    }
    return UserService.instance;
  }

  /**
   * Initialize mock data for demo purposes
   */
  private initializeMockData(): void {
    console.log('🔄 Initializing mock database with users...');
    
    // Clear existing data
    mockDatabase.users.clear();
    mockDatabase.userRuns.clear();
    
    // Add all mock users to the database
    const allUsers = getAllMockUsers();
    allUsers.forEach(user => {
      mockDatabase.users.set(user.id, user);
      mockDatabase.userRuns.set(user.id, []); // Initialize empty runs array
    });
    
    console.log(`✅ Initialized ${allUsers.length} users in mock database:`, 
      allUsers.map(u => ({ id: u.id, username: u.username, name: u.displayName || u.name }))
    );
  }

  /**
   * Create a new user account
   */
  async createUser(userData: CreateUserData): Promise<{ user: User; success: boolean; message?: string }> {
    try {
      // Simulate API delay
      await this.delay(1500);

      // Check if email already exists
      const existingUser = await this.findUserByEmail(userData.email);
      if (existingUser) {
        return {
          user: null as any,
          success: false,
          message: 'Email already exists'
        };
      }

      // Check if username already exists
      const existingUsername = await this.findUserByUsername(userData.username);
      if (existingUsername) {
        return {
          user: null as any,
          success: false,
          message: 'Username already taken'
        };
      }

      // Create new user
      const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const newUser: User = {
        id: userId,
        username: userData.username,
        displayName: `${userData.firstName} ${userData.lastName}`,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        avatar: undefined, // In real app, upload avatar file to storage
        level: userData.skillLevel,
        accountType: userData.accountType,
        role: {
          type: 'user',
          permissions: [
            'user:track_skiing',
            'user:social_features', 
            'user:view_stats',
            'user:save_runs'
          ],
          isActive: true,
          assignedAt: new Date()
        },
        isVerified: false, // Basic user by default
        followers: [],
        following: [],
        friends: [], // New: Initialize friends array
        friendRequestsSent: [], // New: Initialize friend requests sent
        friendRequestsReceived: [], // New: Initialize friend requests received
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          units: userData.units,
          language: 'en',
          notifications: {
            push: userData.notifications,
            email: userData.notifications,
            weather: userData.notifications,
            social: userData.notifications,
            achievements: userData.notifications,
            followers: userData.notifications,
            comments: userData.notifications,
            likes: userData.notifications
          },
          privacy: {
            shareLocation: userData.privacy !== 'private',
            shareStats: userData.privacy !== 'private',
            publicProfile: userData.privacy === 'public',
            allowFollowers: userData.privacy !== 'private',
            allowComments: userData.privacy !== 'private',
            allowDownloads: false
          },
          equipment: userData.equipment,
          recording: {
            autoLiftDetection: true,
            jumpDetection: false,
            crashDetection: true,
            voiceCoaching: false,
            audioFeedback: true,
            gpsUpdateRate: 2,
            heartRateMonitoring: false,
            autoSave: true,
            videoRecording: false,
            shareByDefault: userData.privacy === 'public'
          }
        },
        profile: {
          displayName: `${userData.firstName} ${userData.lastName}`,
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || '',
          isPublic: userData.privacy === 'public',
          featuredRuns: [],
          badges: [],
          highlights: []
        },
        businessProfile: userData.accountType === 'business' ? {
          companyName: userData.companyName || '',
          companyType: (userData.companyType as any) || 'other',
          website: userData.website,
          description: userData.bio || '',
          location: userData.location || '',
          services: [],
          contactInfo: {
            email: userData.email,
            phone: userData.phone
          },
          socialMedia: {},
          isVerified: false,
          certifications: []
        } : undefined,
        stats: {
          totalDistance: 0,
          totalVertical: 0,
          totalRuns: 0,
          maxSpeed: 0,
          averageSpeed: 0,
          totalDuration: 0,
          favoriteResort: userData.favoriteResort || '',
          skillLevel: userData.skillLevel,
          totalDays: 0,
          totalVideos: 0,
          totalLikes: 0
        }
      };

      // Save to mock database
      mockDatabase.users.set(userId, newUser);
      mockDatabase.userRuns.set(userId, []);

      return {
        user: newUser,
        success: true,
        message: 'Account created successfully'
      };

    } catch (error) {
      console.error('Create user error:', error);
      return {
        user: null as any,
        success: false,
        message: 'Failed to create account'
      };
    }
  }

  /**
   * Authenticate user with email and password
   */
  async loginUser(credentials: LoginCredentials): Promise<{ user: User | null; success: boolean; message?: string }> {
    try {
      // Simulate API delay
      await this.delay(1000);

      // Find user by email
      const user = await this.findUserByEmail(credentials.email);
      if (!user) {
        return {
          user: null,
          success: false,
          message: 'Invalid email or password'
        };
      }

      // In a real app, verify password hash
      // For demo purposes, we'll simulate successful login
      this.currentUser = user;

      return {
        user: user,
        success: true,
        message: 'Login successful'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        user: null,
        success: false,
        message: 'Login failed'
      };
    }
  }

  /**
   * Update user profile information
   */
  async updateUser(userId: string, updates: UpdateUserData): Promise<{ user: User; success: boolean; message?: string }> {
    try {
      // Simulate API delay
      await this.delay(800);

      const user = mockDatabase.users.get(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update user fields
      const updatedUser: User = {
        ...user,
        ...(updates.displayName && { displayName: updates.displayName }),
        ...(updates.username && { username: updates.username }),
        ...(updates.email && { email: updates.email }),
        ...(updates.level && { level: updates.level as any }),
        ...(updates.avatar && { avatar: updates.avatar }),
        updatedAt: new Date(),
        ...(updates.preferences && {
          preferences: {
            ...user.preferences,
            ...updates.preferences
          }
        }),
        ...(updates.profile && {
          profile: {
            ...user.profile,
            ...updates.profile
          }
        }),
        ...(updates.businessProfile && {
          businessProfile: {
            ...user.businessProfile,
            ...updates.businessProfile
          }
        }),
        ...(updates.stats && {
          stats: {
            ...user.stats,
            ...updates.stats
          }
        })
      };

      // Save to mock database
      mockDatabase.users.set(userId, updatedUser);

      // Update current user if it's the same
      if (this.currentUser?.id === userId) {
        this.currentUser = updatedUser;
      }

      return {
        user: updatedUser,
        success: true,
        message: 'Profile updated successfully'
      };

    } catch (error) {
      console.error('Update user error:', error);
      return {
        user: null as any,
        success: false,
        message: 'Failed to update profile'
      };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      // Simulate API delay
      await this.delay(300);

      return mockDatabase.users.get(userId) || null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      const user = await this.getUserById(userId);
      return user?.stats || null;
    } catch (error) {
      console.error('Get user stats error:', error);
      return null;
    }
  }

  /**
   * Update user statistics (called after saving runs)
   */
  async updateUserStats(userId: string, newRun: SavedRun): Promise<void> {
    try {
      const user = mockDatabase.users.get(userId);
      if (!user || !user.stats) return;

      const updatedStats: UserStats = {
        ...user.stats,
        totalRuns: user.stats.totalRuns + 1,
        totalDistance: user.stats.totalDistance + newRun.stats.distance,
        totalVertical: user.stats.totalVertical + newRun.stats.vertical,
        totalDuration: user.stats.totalDuration + newRun.stats.duration,
        maxSpeed: Math.max(user.stats.maxSpeed, newRun.stats.maxSpeed),
        averageSpeed: ((user.stats.averageSpeed * user.stats.totalRuns) + newRun.stats.averageSpeed!) / (user.stats.totalRuns + 1)
      };

      await this.updateUser(userId, { stats: updatedStats });
    } catch (error) {
      console.error('Update user stats error:', error);
    }
  }

  /**
   * Follow/unfollow user
   */
  async toggleFollowUser(currentUserId: string, targetUserId: string): Promise<{ success: boolean; isFollowing: boolean }> {
    try {
      await this.delay(500);

      const currentUser = mockDatabase.users.get(currentUserId);
      const targetUser = mockDatabase.users.get(targetUserId);

      if (!currentUser || !targetUser) {
        console.error('Toggle follow error - users not found:', { 
          currentUserId, 
          targetUserId, 
          currentUserExists: !!currentUser, 
          targetUserExists: !!targetUser,
          availableUsers: Array.from(mockDatabase.users.keys())
        });
        throw new Error('User not found');
      }

      const isCurrentlyFollowing = currentUser.following?.includes(targetUserId) || false;

      if (isCurrentlyFollowing) {
        // Unfollow
        currentUser.following = currentUser.following?.filter(id => id !== targetUserId) || [];
        targetUser.followers = targetUser.followers?.filter(id => id !== currentUserId) || [];
      } else {
        // Follow
        currentUser.following = [...(currentUser.following || []), targetUserId];
        targetUser.followers = [...(targetUser.followers || []), currentUserId];
      }

      // Save changes
      mockDatabase.users.set(currentUserId, currentUser);
      mockDatabase.users.set(targetUserId, targetUser);

      return {
        success: true,
        isFollowing: !isCurrentlyFollowing
      };

    } catch (error) {
      console.error('Toggle follow error:', error);
      return {
        success: false,
        isFollowing: false
      };
    }
  }

  /**
   * Send friend request
   */
  async sendFriendRequest(fromUserId: string, toUserId: string, message?: string): Promise<{ success: boolean; message?: string }> {
    try {
      await this.delay(600);

      const fromUser = mockDatabase.users.get(fromUserId);
      const toUser = mockDatabase.users.get(toUserId);

      if (!fromUser || !toUser) {
        throw new Error('User not found');
      }

      // Check if they're already friends
      if (fromUser.friends?.includes(toUserId)) {
        return {
          success: false,
          message: 'You are already friends with this user'
        };
      }

      // Check if request already exists
      const existingRequest = Array.from(mockDatabase.friendRequests.values())
        .flat()
        .find(req => 
          req.fromUserId === fromUserId && 
          req.toUserId === toUserId && 
          req.status === 'pending'
        );

      if (existingRequest) {
        return {
          success: false,
          message: 'Friend request already sent'
        };
      }

      // Create friend request
      const requestId = 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const friendRequest: FriendRequest = {
        id: requestId,
        fromUserId,
        toUserId,
        message: message || '',
        status: 'pending',
        createdAt: new Date()
      };

      // Store request
      const userRequests = mockDatabase.friendRequests.get(toUserId) || [];
      userRequests.push(friendRequest);
      mockDatabase.friendRequests.set(toUserId, userRequests);

      // Update user arrays
      fromUser.friendRequestsSent = [...(fromUser.friendRequestsSent || []), toUserId];
      toUser.friendRequestsReceived = [...(toUser.friendRequestsReceived || []), fromUserId];

      // Save changes
      mockDatabase.users.set(fromUserId, fromUser);
      mockDatabase.users.set(toUserId, toUser);

      return {
        success: true,
        message: 'Friend request sent successfully'
      };

    } catch (error) {
      console.error('Send friend request error:', error);
      return {
        success: false,
        message: 'Failed to send friend request'
      };
    }
  }

  /**
   * Accept friend request
   */
  async acceptFriendRequest(currentUserId: string, fromUserId: string): Promise<{ success: boolean; message?: string }> {
    try {
      await this.delay(500);

      const currentUser = mockDatabase.users.get(currentUserId);
      const fromUser = mockDatabase.users.get(fromUserId);

      if (!currentUser || !fromUser) {
        throw new Error('User not found');
      }

      // Find the request
      const userRequests = mockDatabase.friendRequests.get(currentUserId) || [];
      const requestIndex = userRequests.findIndex(req => 
        req.fromUserId === fromUserId && 
        req.status === 'pending'
      );

      if (requestIndex === -1) {
        return {
          success: false,
          message: 'Friend request not found'
        };
      }

      // Update request status
      userRequests[requestIndex].status = 'accepted';
      userRequests[requestIndex].respondedAt = new Date();
      mockDatabase.friendRequests.set(currentUserId, userRequests);

      // Add to friends lists
      currentUser.friends = [...(currentUser.friends || []), fromUserId];
      fromUser.friends = [...(fromUser.friends || []), currentUserId];

      // Remove from request arrays
      currentUser.friendRequestsReceived = currentUser.friendRequestsReceived?.filter(id => id !== fromUserId) || [];
      fromUser.friendRequestsSent = fromUser.friendRequestsSent?.filter(id => id !== currentUserId) || [];

      // Also add to following if not already
      if (!currentUser.following?.includes(fromUserId)) {
        currentUser.following = [...(currentUser.following || []), fromUserId];
        fromUser.followers = [...(fromUser.followers || []), currentUserId];
      }
      if (!fromUser.following?.includes(currentUserId)) {
        fromUser.following = [...(fromUser.following || []), currentUserId];
        currentUser.followers = [...(currentUser.followers || []), fromUserId];
      }

      // Save changes
      mockDatabase.users.set(currentUserId, currentUser);
      mockDatabase.users.set(fromUserId, fromUser);

      return {
        success: true,
        message: 'Friend request accepted'
      };

    } catch (error) {
      console.error('Accept friend request error:', error);
      return {
        success: false,
        message: 'Failed to accept friend request'
      };
    }
  }

  /**
   * Decline friend request
   */
  async declineFriendRequest(currentUserId: string, fromUserId: string): Promise<{ success: boolean; message?: string }> {
    try {
      await this.delay(500);

      const currentUser = mockDatabase.users.get(currentUserId);
      const fromUser = mockDatabase.users.get(fromUserId);

      if (!currentUser || !fromUser) {
        throw new Error('User not found');
      }

      // Find the request
      const userRequests = mockDatabase.friendRequests.get(currentUserId) || [];
      const requestIndex = userRequests.findIndex(req => 
        req.fromUserId === fromUserId && 
        req.status === 'pending'
      );

      if (requestIndex === -1) {
        return {
          success: false,
          message: 'Friend request not found'
        };
      }

      // Update request status
      userRequests[requestIndex].status = 'declined';
      userRequests[requestIndex].respondedAt = new Date();
      mockDatabase.friendRequests.set(currentUserId, userRequests);

      // Remove from request arrays
      currentUser.friendRequestsReceived = currentUser.friendRequestsReceived?.filter(id => id !== fromUserId) || [];
      fromUser.friendRequestsSent = fromUser.friendRequestsSent?.filter(id => id !== currentUserId) || [];

      // Save changes
      mockDatabase.users.set(currentUserId, currentUser);
      mockDatabase.users.set(fromUserId, fromUser);

      return {
        success: true,
        message: 'Friend request declined'
      };

    } catch (error) {
      console.error('Decline friend request error:', error);
      return {
        success: false,
        message: 'Failed to decline friend request'
      };
    }
  }

  /**
   * Cancel friend request
   */
  async cancelFriendRequest(currentUserId: string, toUserId: string): Promise<{ success: boolean; message?: string }> {
    try {
      await this.delay(500);

      const currentUser = mockDatabase.users.get(currentUserId);
      const toUser = mockDatabase.users.get(toUserId);

      if (!currentUser || !toUser) {
        throw new Error('User not found');
      }

      // Find and remove the request
      const userRequests = mockDatabase.friendRequests.get(toUserId) || [];
      const requestIndex = userRequests.findIndex(req => 
        req.fromUserId === currentUserId && 
        req.status === 'pending'
      );

      if (requestIndex === -1) {
        return {
          success: false,
          message: 'Friend request not found'
        };
      }

      // Update request status
      userRequests[requestIndex].status = 'cancelled';
      mockDatabase.friendRequests.set(toUserId, userRequests);

      // Remove from request arrays
      currentUser.friendRequestsSent = currentUser.friendRequestsSent?.filter(id => id !== toUserId) || [];
      toUser.friendRequestsReceived = toUser.friendRequestsReceived?.filter(id => id !== currentUserId) || [];

      // Save changes
      mockDatabase.users.set(currentUserId, currentUser);
      mockDatabase.users.set(toUserId, toUser);

      return {
        success: true,
        message: 'Friend request cancelled'
      };

    } catch (error) {
      console.error('Cancel friend request error:', error);
      return {
        success: false,
        message: 'Failed to cancel friend request'
      };
    }
  }

  /**
   * Remove friend
   */
  async removeFriend(currentUserId: string, friendUserId: string): Promise<{ success: boolean; message?: string }> {
    try {
      await this.delay(500);

      const currentUser = mockDatabase.users.get(currentUserId);
      const friendUser = mockDatabase.users.get(friendUserId);

      if (!currentUser || !friendUser) {
        throw new Error('User not found');
      }

      // Remove from friends lists
      currentUser.friends = currentUser.friends?.filter(id => id !== friendUserId) || [];
      friendUser.friends = friendUser.friends?.filter(id => id !== currentUserId) || [];

      // Save changes
      mockDatabase.users.set(currentUserId, currentUser);
      mockDatabase.users.set(friendUserId, friendUser);

      return {
        success: true,
        message: 'Friend removed successfully'
      };

    } catch (error) {
      console.error('Remove friend error:', error);
      return {
        success: false,
        message: 'Failed to remove friend'
      };
    }
  }

  /**
   * Get pending friend requests for a user
   */
  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    try {
      await this.delay(300);
      
      const userRequests = mockDatabase.friendRequests.get(userId) || [];
      return userRequests.filter(req => req.status === 'pending');
    } catch (error) {
      console.error('Get friend requests error:', error);
      return [];
    }
  }

  /**
   * Search users by username or display name
   */
  async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    try {
      await this.delay(400);

      const users = Array.from(mockDatabase.users.values());
      const searchQuery = query.toLowerCase();

      console.log(`🔍 Searching users with query: "${query}"`, {
        totalUsers: users.length,
        userIds: users.map(u => u.id),
        usernames: users.map(u => u.username)
      });

      const results = users
        .filter(user => 
          user.username.toLowerCase().includes(searchQuery) ||
          user.displayName?.toLowerCase().includes(searchQuery) ||
          user.name?.toLowerCase().includes(searchQuery)
        )
        .slice(0, limit);

      console.log(`📋 Search results:`, results.map(u => ({ 
        id: u.id, 
        username: u.username, 
        displayName: u.displayName 
      })));

      return results;

    } catch (error) {
      console.error('Search users error:', error);
      return [];
    }
  }

  /**
   * Get user's social feed
   */
  async getUserFeed(userId: string, page: number = 1, limit: number = 20): Promise<SavedRun[]> {
    try {
      await this.delay(600);

      const user = mockDatabase.users.get(userId);
      if (!user) return [];

      // Get runs from user, friends, and following
      const userIds = [
        userId, 
        ...(user.friends || []),
        ...(user.following || [])
      ];
      
      // Remove duplicates
      const uniqueUserIds = [...new Set(userIds)];
      const allRuns: SavedRun[] = [];

      for (const id of uniqueUserIds) {
        const userRuns = mockDatabase.userRuns.get(id) || [];
        allRuns.push(...userRuns.filter(run => run.isPublic));
      }

      // Sort by date and paginate
      allRuns.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      
      const startIndex = (page - 1) * limit;
      return allRuns.slice(startIndex, startIndex + limit);

    } catch (error) {
      console.error('Get user feed error:', error);
      return [];
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(userId: string, file: File): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      // Simulate file upload
      await this.delay(2000);

      // In a real app, upload to cloud storage and return URL
      const mockUrl = `/avatars/${userId}_${Date.now()}.jpg`;

      await this.updateUser(userId, { avatar: mockUrl });

      return {
        success: true,
        url: mockUrl,
        message: 'Avatar uploaded successfully'
      };

    } catch (error) {
      console.error('Upload avatar error:', error);
      return {
        success: false,
        message: 'Failed to upload avatar'
      };
    }
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string): Promise<{ success: boolean; message?: string }> {
    try {
      await this.delay(1000);

      // Remove from mock database
      mockDatabase.users.delete(userId);
      mockDatabase.userRuns.delete(userId);
      mockDatabase.userStats.delete(userId);
      mockDatabase.userPreferences.delete(userId);
      mockDatabase.friendRequests.delete(userId);

      // Clear current user if it's the same
      if (this.currentUser?.id === userId) {
        this.currentUser = null;
      }

      return {
        success: true,
        message: 'Account deleted successfully'
      };

    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        message: 'Failed to delete account'
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      await this.delay(1500);

      const user = await this.findUserByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Email not found'
        };
      }

      // In a real app, send email with reset link
      return {
        success: true,
        message: 'Password reset email sent'
      };

    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Failed to send reset email'
      };
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Set current user
   */
  setCurrentUser(user: User | null): void {
    this.currentUser = user;
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    this.currentUser = null;
    // Clear any stored tokens/sessions
  }

  // Private helper methods

  private async findUserByEmail(email: string): Promise<User | null> {
    const users = Array.from(mockDatabase.users.values());
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  private async findUserByUsername(username: string): Promise<User | null> {
    const users = Array.from(mockDatabase.users.values());
    return users.find(user => user.username.toLowerCase() === username.toLowerCase()) || null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const userService = UserService.getInstance();

// Helper functions for common operations
export const getCurrentUser = () => userService.getCurrentUser();
export const loginUser = (credentials: LoginCredentials) => userService.loginUser(credentials);
export const createUser = (userData: CreateUserData) => userService.createUser(userData);
export const updateUser = (userId: string, updates: UpdateUserData) => userService.updateUser(userId, updates);
export const getUserById = (userId: string) => userService.getUserById(userId);
export const searchUsers = (query: string, limit?: number) => userService.searchUsers(query, limit);
export const uploadAvatar = (userId: string, file: File) => userService.uploadAvatar(userId, file);

// Friend-related helper functions
export const sendFriendRequest = (fromUserId: string, toUserId: string, message?: string) => 
  userService.sendFriendRequest(fromUserId, toUserId, message);
export const acceptFriendRequest = (currentUserId: string, fromUserId: string) => 
  userService.acceptFriendRequest(currentUserId, fromUserId);
export const declineFriendRequest = (currentUserId: string, fromUserId: string) => 
  userService.declineFriendRequest(currentUserId, fromUserId);
export const cancelFriendRequest = (currentUserId: string, toUserId: string) => 
  userService.cancelFriendRequest(currentUserId, toUserId);
export const removeFriend = (currentUserId: string, friendUserId: string) => 
  userService.removeFriend(currentUserId, friendUserId);
export const getFriendRequests = (userId: string) => 
  userService.getFriendRequests(userId);