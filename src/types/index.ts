// Core type definitions
export interface User {
  id: string;
  username: string;
  displayName?: string;
  name?: string; // For backward compatibility
  email: string;
  avatar?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  accountType: 'individual' | 'business' | 'team'; // Keep for plan types
  role: AccountRole; // New role-based access control
  isVerified: boolean; // Pro subscription status
  followers?: string[];
  following?: string[];
  friends?: string[]; // New: Array of friend user IDs
  friendRequestsSent?: string[]; // New: Array of user IDs to whom requests were sent
  friendRequestsReceived?: string[]; // New: Array of user IDs from whom requests were received
  groups?: string[]; // Group IDs user is member of
  ownedGroups?: string[]; // Group IDs user is admin of
  location?: {
    latitude: number;
    longitude: number;
    resort?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  preferences?: UserPreferences;
  stats?: UserStats;
  settings?: UserSettings; // Alternative to preferences
  profile?: PublicProfile;
  businessProfile?: BusinessProfile;
}

export interface BusinessProfile {
  companyName: string;
  companyType: 'ski_school' | 'resort' | 'equipment' | 'tour_guide' | 'photographer' | 'other';
  website?: string;
  description: string;
  location: string;
  services: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
  };
  socialMedia: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  };
  isVerified: boolean;
  certifications: string[];
  operatingHours?: string;
  seasonalInfo?: string;
}

export interface UserSettings {
  units: 'metric' | 'imperial';
  privacy: 'public' | 'followers' | 'private';
  notifications: boolean;
  autoShare: boolean;
  theme: 'light' | 'dark';
}

export interface PublicProfile {
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
  isPublic: boolean;
  featuredRuns: string[];
  badges: ProfileBadge[];
  coverImage?: string;
  highlights: ProfileHighlight[];
}

export interface ProfileBadge {
  id: string;
  type: 'verification' | 'season' | 'resort';
  icon: string;
  title: string;
  description?: string;
  color: string;
  earnedAt: Date;
}

export interface ProfileHighlight {
  id: string;
  title: string;
  type: 'run' | 'video';
  thumbnail: string;
  data: any;
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  equipment: Equipment;
  recording: RecordingSettings;
}

export interface RecordingSettings {
  autoLiftDetection: boolean;
  jumpDetection: boolean;
  crashDetection: boolean;
  voiceCoaching: boolean;
  audioFeedback: boolean;
  gpsUpdateRate: number;
  heartRateMonitoring: boolean;
  autoSave: boolean;
  videoRecording: boolean;
  shareByDefault: boolean;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  weather: boolean;
  social: boolean;
  followers: boolean;
  comments: boolean;
  likes: boolean;
}

export interface PrivacySettings {
  shareLocation: boolean;
  shareStats: boolean;
  publicProfile: boolean;
  allowFollowers: boolean;
  allowComments: boolean;
  allowDownloads: boolean;
}

export interface Equipment {
  type: 'alpine' | 'snowboard' | 'telemark' | 'cross_country';
  brand: string;
  model: string;
  length?: number;
  width?: number;
  bindings?: string;
}

export interface UserStats {
  totalDistance: number;
  totalVertical: number;
  totalRuns: number;
  maxSpeed: number;
  averageSpeed: number;
  totalDuration: number;
  favoriteResort: string;
  skillLevel: string;
  totalDays?: number;
  totalVideos?: number;
  totalLikes?: number;
  currentSeason?: SeasonStats;
  allTimeStats?: AllTimeStats;
}

export interface AllTimeStats {
  seasons: number;
  resorts: number;
  countries: number;
  followers: number;
  following: number;
}

export interface SeasonStats {
  distance: number;
  vertical: number;
  runs: number;
  days: number;
  videos: number;
}



export interface SavedRun {
  id: string;
  userId: string;
  sessionId?: string;
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type?: Equipment['type'];
  resort: Resort;
  trail?: Trail;
  weather?: Weather;
  stats: RunStats;
  path?: TrackPoint[];
  isPublic?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  likes: number;
  comments?: Comment[] | number;
  shares: number;
  downloads?: number;
  videos?: RunVideo[];
  photos?: RunPhoto[];
  privacy?: 'public' | 'followers' | 'private';
  isDraft?: boolean; // True if the run is saved as a draft
  sessionDate?: Date; // Original date when the session was recorded (preserves original date even if published later)
  publishedAt?: Date; // Date when the run was published (if different from sessionDate)
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  isDeleted?: boolean;
}

export interface RunStats {
  duration: number;
  distance: number;
  vertical: number;
  maxSpeed: number;
  averageSpeed?: number;
  avgSpeed?: number; // Alternative naming
  maxAltitude?: number;
  minAltitude?: number;
  calories?: number;
  jumps?: number;
  airTime?: number;
  difficulty?: 'green' | 'blue' | 'black' | 'double_black';
}

export interface RunVideo {
  id: string;
  runId: string;
  userId: string;
  url: string;
  thumbnail: string;
  duration: number;
  size: number;
  resolution: string;
  format: string;
  caption?: string;
  timestamp: number; // Position in run when video was recorded
  isHighlight: boolean;
  createdAt: Date;
}

export interface RunPhoto {
  id: string;
  runId: string;
  userId: string;
  url: string;
  thumbnail: string;
  size: number;
  dimensions: { width: number; height: number };
  caption?: string;
  timestamp: number;
  location: { lat: number; lng: number };
  createdAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  type: Equipment['type'];
  resort: Resort;
  weather: Weather;
  stats: SessionStats;
  runs: Run[];
  lifts: Lift[];
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  autoSaved: boolean;
  savedRuns: string[]; // IDs of runs saved from this session
}

export interface SessionStats {
  duration: number;
  activeTime: number;
  liftTime: number;
  distance: number;
  vertical: number;
  maxSpeed: number;
  avgSpeed: number;
  calories: number;
  runs: number;
  jumps: number;
  airTime: number;
}

export interface Run {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  difficulty: 'green' | 'blue' | 'black' | 'double_black';
  distance: number;
  vertical: number;
  maxSpeed: number;
  avgSpeed: number;
  path: TrackPoint[];
  isSaved: boolean;
  savedRunId?: string;
}

export interface Lift {
  id: string;
  name: string;
  type: 'chairlift' | 'gondola' | 'surface' | 'magic_carpet';
  startTime: Date;
  endTime: Date;
  waitTime: number;
  vertical: number;
}

export interface TrackPoint {
  lat: number;
  lng: number;
  elevation: number;
  speed: number;
  timestamp: Date;
  heartRate?: number;
  gForce?: { x: number; y: number; z: number };
}

export interface Resort {
  id: string;
  name: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  elevation?: { base: number; summit: number };
  trails?: Trail[];
  lifts?: LiftInfo[];
  website?: string;
  ticketUrl?: string;
}

export interface Trail {
  id?: string;
  name: string;
  difficulty: Run['difficulty'];
  length?: number;
  vertical?: number;
  status?: 'open' | 'closed' | 'limited';
  conditions?: TrailConditions;
}

export interface LiftInfo {
  id: string;
  name: string;
  type: Lift['type'];
  status: 'open' | 'closed' | 'delayed';
  capacity: number;
  waitTime: number;
}

export interface TrailConditions {
  base: number;
  surface: 'powder' | 'packed' | 'icy' | 'variable';
  groomed: boolean;
  lastGroomed?: Date;
}

export interface Weather {
  temperature: number;
  feelsLike?: number;
  conditions: string;
  windSpeed?: number;
  windDirection?: number;
  visibility?: number | string;
  humidity?: number;
  pressure?: number;
  uvIndex?: number;
  precipitation?: number;
  snowfall?: number;
  alerts?: WeatherAlert[];
}

export interface WeatherAlert {
  type: 'wind' | 'visibility' | 'temperature' | 'avalanche' | 'storm';
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  message: string;
  expiresAt: Date;
}

export interface SocialPost {
  id: string;
  userId: string;
  user: User;
  type: 'run' | 'video' | 'photo' | 'achievement' | 'text';
  content: string;
  media: PostMedia[];
  runId?: string;
  run?: SavedRun;
  location?: string;
  tags: string[];
  mentions: string[];
  createdAt: Date;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isShared: boolean;
  visibility: 'public' | 'followers' | 'private';
}

export interface PostMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  duration?: number;
  size: number;
  caption?: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  postId?: string;
  runId?: string;
  content: string;
  mentions: string[];
  likes: number;
  replies: Comment[];
  isLiked: boolean;
  createdAt: Date;
  editedAt?: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'distance' | 'vertical' | 'speed' | 'runs' | 'social';
  target: number;
  duration: number; // in days
  reward: Achievement;
  participants: string[];
  startDate: Date;
  endDate: Date;
  leaderboard: LeaderboardEntry[];
}

export interface Leaderboard {
  id: string;
  type: 'speed' | 'distance' | 'vertical' | 'runs' | 'social';
  period: 'daily' | 'weekly' | 'monthly' | 'season' | 'all_time';
  resort?: string;
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  value: number;
  change: number; // position change from last period
  runId?: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// UI State types
export interface AppState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

export interface NavigationState {
  activeTab: string;
  isMobileMenuOpen: boolean;
  breadcrumbs: Breadcrumb[];
}

export interface Breadcrumb {
  label: string;
  href?: string;
  isActive?: boolean;
}

// Component Props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps extends BaseComponentProps {
  title?: string;
  description?: string;
}

// Deletion/Cancellation Confirmation types
export interface ConfirmationDialog {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  type: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

// Run management types
export interface RunFilter {
  resort?: string;
  dateRange?: { start: Date; end: Date };
  difficulty?: string[];
  type?: Equipment['type'][];
  tags?: string[];
  isPublic?: boolean;
  minDistance?: number;
  maxDistance?: number;
  minSpeed?: number;
  maxSpeed?: number;
}

export interface RunSort {
  field: 'date' | 'distance' | 'speed' | 'vertical' | 'likes' | 'duration';
  direction: 'asc' | 'desc';
}

// Group and Chat Types
export interface Group {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'closed';
  category: 'resort' | 'skill_level' | 'location' | 'equipment' | 'social' | 'business' | 'other';
  adminId: string;
  moderators: string[];
  members: string[];
  memberCount: number;
  avatar?: string;
  coverImage?: string;
  rules: string[];
  tags: string[];
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  settings: GroupSettings;
}

export interface GroupSettings {
  allowMemberInvites: boolean;
  requireApproval: boolean;
  allowPosts: boolean;
  allowFiles: boolean;
  allowEvents: boolean;
  muteNewMembers: boolean;
  maxMembers?: number;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  userId: string;
  user: User;
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'run_share' | 'system';
  attachments: MessageAttachment[];
  runId?: string;
  parentMessageId?: string; // For thread replies
  mentions: string[];
  reactions: MessageReaction[];
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  name: string;
  size: number;
  thumbnail?: string;
}

export interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface GroupInvite {
  id: string;
  groupId: string;
  inviterId: string;
  inviteeId?: string;
  inviteeEmail?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface AccountTypeSelection {
  type: 'individual' | 'business' | 'group_admin';
  businessInfo?: Partial<BusinessProfile>;
  groupInfo?: {
    name: string;
    description: string;
    type: Group['type'];
    category: Group['category'];
  };
}

// Enhanced account type system for Snowline
export type AccountType = 'user' | 'ski_field_admin' | 'platform_admin';

export interface AccountRole {
  type: AccountType;
  permissions: string[];
  assignedSkiFields?: string[]; // For ski field admins - which fields they manage
  isActive: boolean;
  assignedAt?: Date;
  assignedBy?: string; // User ID who granted this role
}

// Friend Request types
export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUser?: User; // Populated when fetching
  toUserId: string;
  toUser?: User; // Populated when fetching
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: Date;
  respondedAt?: Date;
}