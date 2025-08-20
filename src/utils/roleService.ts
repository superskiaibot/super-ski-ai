import { User, AccountType, AccountRole } from '../types/index';

// Define permission constants
export const PERMISSIONS = {
  // User permissions
  USER_TRACK_SKIING: 'user:track_skiing',
  USER_SOCIAL_FEATURES: 'user:social_features',
  USER_VIEW_STATS: 'user:view_stats',
  USER_SAVE_RUNS: 'user:save_runs',
  
  // Ski Field Admin permissions
  SKI_FIELD_MANAGE_LIFTS: 'ski_field:manage_lifts',
  SKI_FIELD_MANAGE_TRAILS: 'ski_field:manage_trails',
  SKI_FIELD_MANAGE_WEATHER: 'ski_field:manage_weather',
  SKI_FIELD_MANAGE_PRICING: 'ski_field:manage_pricing',
  SKI_FIELD_MANAGE_SAFETY: 'ski_field:manage_safety',
  SKI_FIELD_VIEW_ANALYTICS: 'ski_field:view_analytics',
  SKI_FIELD_MANAGE_EVENTS: 'ski_field:manage_events',
  
  // Platform Admin permissions
  PLATFORM_MANAGE_USERS: 'platform:manage_users',
  PLATFORM_MANAGE_SKI_FIELDS: 'platform:manage_ski_fields',
  PLATFORM_MANAGE_ADMINS: 'platform:manage_admins',
  PLATFORM_VIEW_ANALYTICS: 'platform:view_analytics',
  PLATFORM_MANAGE_SYSTEM: 'platform:manage_system',
  PLATFORM_AUDIT_LOGS: 'platform:audit_logs',
  PLATFORM_MANAGE_CONTENT: 'platform:manage_content',
} as const;

// Default permissions for each account type
export const DEFAULT_PERMISSIONS: Record<AccountType, string[]> = {
  user: [
    PERMISSIONS.USER_TRACK_SKIING,
    PERMISSIONS.USER_SOCIAL_FEATURES,
    PERMISSIONS.USER_VIEW_STATS,
    PERMISSIONS.USER_SAVE_RUNS,
  ],
  ski_field_admin: [
    // Include all user permissions
    ...DEFAULT_PERMISSIONS?.user || [
      PERMISSIONS.USER_TRACK_SKIING,
      PERMISSIONS.USER_SOCIAL_FEATURES,
      PERMISSIONS.USER_VIEW_STATS,
      PERMISSIONS.USER_SAVE_RUNS,
    ],
    // Add ski field admin permissions
    PERMISSIONS.SKI_FIELD_MANAGE_LIFTS,
    PERMISSIONS.SKI_FIELD_MANAGE_TRAILS,
    PERMISSIONS.SKI_FIELD_MANAGE_WEATHER,
    PERMISSIONS.SKI_FIELD_MANAGE_PRICING,
    PERMISSIONS.SKI_FIELD_MANAGE_SAFETY,
    PERMISSIONS.SKI_FIELD_VIEW_ANALYTICS,
    PERMISSIONS.SKI_FIELD_MANAGE_EVENTS,
  ],
  platform_admin: [
    // Include all permissions
    PERMISSIONS.USER_TRACK_SKIING,
    PERMISSIONS.USER_SOCIAL_FEATURES,
    PERMISSIONS.USER_VIEW_STATS,
    PERMISSIONS.USER_SAVE_RUNS,
    PERMISSIONS.SKI_FIELD_MANAGE_LIFTS,
    PERMISSIONS.SKI_FIELD_MANAGE_TRAILS,
    PERMISSIONS.SKI_FIELD_MANAGE_WEATHER,
    PERMISSIONS.SKI_FIELD_MANAGE_PRICING,
    PERMISSIONS.SKI_FIELD_MANAGE_SAFETY,
    PERMISSIONS.SKI_FIELD_VIEW_ANALYTICS,
    PERMISSIONS.SKI_FIELD_MANAGE_EVENTS,
    PERMISSIONS.PLATFORM_MANAGE_USERS,
    PERMISSIONS.PLATFORM_MANAGE_SKI_FIELDS,
    PERMISSIONS.PLATFORM_MANAGE_ADMINS,
    PERMISSIONS.PLATFORM_VIEW_ANALYTICS,
    PERMISSIONS.PLATFORM_MANAGE_SYSTEM,
    PERMISSIONS.PLATFORM_AUDIT_LOGS,
    PERMISSIONS.PLATFORM_MANAGE_CONTENT,
  ],
};

export class RoleService {
  /**
   * Create a default role for a user account type
   */
  static createDefaultRole(accountType: AccountType, assignedSkiFields?: string[]): AccountRole {
    return {
      type: accountType,
      permissions: DEFAULT_PERMISSIONS[accountType],
      assignedSkiFields: accountType === 'ski_field_admin' ? assignedSkiFields : undefined,
      isActive: true,
      assignedAt: new Date(),
    };
  }

  /**
   * Check if a user has a specific permission
   */
  static hasPermission(user: User | null, permission: string): boolean {
    if (!user || !user.role || !user.role.isActive) {
      return false;
    }
    
    return user.role.permissions.includes(permission);
  }

  /**
   * Check if a user has any of the specified permissions
   */
  static hasAnyPermission(user: User | null, permissions: string[]): boolean {
    if (!user || !user.role || !user.role.isActive) {
      return false;
    }
    
    return permissions.some(permission => user.role.permissions.includes(permission));
  }

  /**
   * Check if a user has all of the specified permissions
   */
  static hasAllPermissions(user: User | null, permissions: string[]): boolean {
    if (!user || !user.role || !user.role.isActive) {
      return false;
    }
    
    return permissions.every(permission => user.role.permissions.includes(permission));
  }

  /**
   * Check if a user is a normal user
   */
  static isUser(user: User | null): boolean {
    return user?.role?.type === 'user' && user.role.isActive;
  }

  /**
   * Check if a user is a ski field admin
   */
  static isSkiFieldAdmin(user: User | null): boolean {
    return user?.role?.type === 'ski_field_admin' && user.role.isActive;
  }

  /**
   * Check if a user is a platform admin
   */
  static isPlatformAdmin(user: User | null): boolean {
    return user?.role?.type === 'platform_admin' && user.role.isActive;
  }

  /**
   * Check if a user has admin access (either ski field admin or platform admin)
   */
  static hasAdminAccess(user: User | null): boolean {
    return this.isSkiFieldAdmin(user) || this.isPlatformAdmin(user);
  }

  /**
   * Check if a user can manage a specific ski field
   */
  static canManageSkiField(user: User | null, skiFieldId: string): boolean {
    if (!user || !user.role || !user.role.isActive) {
      return false;
    }

    // Platform admins can manage all ski fields
    if (this.isPlatformAdmin(user)) {
      return true;
    }

    // Ski field admins can only manage their assigned fields
    if (this.isSkiFieldAdmin(user)) {
      return user.role.assignedSkiFields?.includes(skiFieldId) || false;
    }

    return false;
  }

  /**
   * Check if a platform admin has override access to any ski field
   * This method explicitly handles platform admin override scenarios
   */
  static hasPlatformAdminOverride(user: User | null, skiFieldId?: string): boolean {
    if (!user || !user.role || !user.role.isActive) {
      return false;
    }

    // Platform admins have override access to ALL ski fields
    if (this.isPlatformAdmin(user)) {
      console.log('🔧 Platform admin override granted:', {
        userEmail: user.email,
        skiFieldId: skiFieldId || 'ALL',
        overrideType: 'FULL_ADMIN_ACCESS'
      });
      return true;
    }

    return false;
  }

  /**
   * Get the access level for a user regarding a specific ski field
   */
  static getSkiFieldAccessLevel(user: User | null, skiFieldId: string): 'none' | 'assigned_admin' | 'platform_override' {
    if (!user || !user.role || !user.role.isActive) {
      return 'none';
    }

    // Platform admins get override access
    if (this.isPlatformAdmin(user)) {
      return 'platform_override';
    }

    // Ski field admins get access to their assigned fields only
    if (this.isSkiFieldAdmin(user) && user.role.assignedSkiFields?.includes(skiFieldId)) {
      return 'assigned_admin';
    }

    return 'none';
  }

  /**
   * Get a user's account type display name
   */
  static getAccountTypeDisplayName(accountType: AccountType): string {
    switch (accountType) {
      case 'user':
        return 'User';
      case 'ski_field_admin':
        return 'Ski Field Admin';
      case 'platform_admin':
        return 'Platform Admin';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get a user's role badge info for UI display
   */
  static getRoleBadge(user: User | null): { text: string; color: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
    if (!user || !user.role || !user.role.isActive) {
      return { text: 'User', color: 'text-muted-foreground', variant: 'outline' };
    }

    switch (user.role.type) {
      case 'platform_admin':
        return { text: 'Platform Admin', color: 'text-red-600', variant: 'destructive' };
      case 'ski_field_admin':
        return { text: 'Ski Field Admin', color: 'text-blue-600', variant: 'secondary' };
      case 'user':
      default:
        return { text: user.isVerified ? 'Pro User' : 'User', color: 'text-muted-foreground', variant: user.isVerified ? 'default' : 'outline' };
    }
  }

  /**
   * Upgrade a user to ski field admin
   */
  static upgradeToSkiFieldAdmin(user: User, assignedSkiFields: string[], assignedBy: string): User {
    return {
      ...user,
      role: {
        type: 'ski_field_admin',
        permissions: DEFAULT_PERMISSIONS.ski_field_admin,
        assignedSkiFields,
        isActive: true,
        assignedAt: new Date(),
        assignedBy,
      },
    };
  }

  /**
   * Upgrade a user to platform admin
   */
  static upgradeToPlatformAdmin(user: User, assignedBy: string): User {
    return {
      ...user,
      role: {
        type: 'platform_admin',
        permissions: DEFAULT_PERMISSIONS.platform_admin,
        isActive: true,
        assignedAt: new Date(),
        assignedBy,
      },
    };
  }

  /**
   * Downgrade a user to normal user
   */
  static downgradeToUser(user: User): User {
    return {
      ...user,
      role: {
        type: 'user',
        permissions: DEFAULT_PERMISSIONS.user,
        isActive: true,
        assignedAt: new Date(),
      },
    };
  }

  /**
   * Deactivate a user's role (suspend admin access)
   */
  static deactivateRole(user: User): User {
    return {
      ...user,
      role: {
        ...user.role,
        isActive: false,
      },
    };
  }

  /**
   * Reactivate a user's role
   */
  static reactivateRole(user: User): User {
    return {
      ...user,
      role: {
        ...user.role,
        isActive: true,
      },
    };
  }
}

export default RoleService;