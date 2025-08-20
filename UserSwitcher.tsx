import React from 'react';
import { 
  User, 
  Settings, 
  Crown,
  Shield,
  ChevronDown,
  Users,
  Check
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { User as UserType } from '../src/types/index';
import { MOCK_USERS } from '../src/utils/mockUsers';
import { RoleService } from '../src/utils/roleService';

interface UserSwitcherProps {
  currentUser: UserType;
  onUserChange: (user: UserType) => void;
  className?: string;
}

export function UserSwitcher({ currentUser, onUserChange, className = "" }: UserSwitcherProps) {
  const users = Object.values(MOCK_USERS);

  const getUserIcon = (user: UserType) => {
    if (RoleService.isPlatformAdmin(user)) {
      return <Crown className="w-4 h-4 text-yellow-600" />;
    }
    if (RoleService.isSkiFieldAdmin(user)) {
      return <Shield className="w-4 h-4 text-blue-600" />;
    }
    return <User className="w-4 h-4 text-gray-600" />;
  };

  const getUserDescription = (user: UserType) => {
    if (RoleService.isPlatformAdmin(user)) {
      return 'Full platform access';
    }
    if (RoleService.isSkiFieldAdmin(user)) {
      const skiFields = user.role?.managedSkiFields || [];
      return `Manages ${skiFields.length} ski field${skiFields.length !== 1 ? 's' : ''}`;
    }
    return user.isVerified ? 'Pro subscription' : 'Basic subscription';
  };

  const getRoleBadge = (user: UserType) => {
    const roleBadge = RoleService.getRoleBadge(user);
    return (
      <Badge 
        variant={roleBadge.variant as any} 
        className={`text-xs ${roleBadge.color} px-2 py-1`}
      >
        {roleBadge.text}
      </Badge>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-auto p-4 bg-gradient-to-r from-blue-50 to-gray-50 border-gray-200 hover:from-blue-100 hover:to-gray-100 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-md">
                {getUserIcon(currentUser)}
              </div>
              <div className="flex flex-col items-start min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {currentUser.displayName}
                  </span>
                  {getRoleBadge(currentUser)}
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  @{currentUser.username}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="secondary" 
                className="text-xs bg-green-100 text-green-700 border-green-200"
              >
                Demo Mode
              </Badge>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          className="w-96 p-2 snowline-glass-strong border-border"
          sideOffset={8}
        >
          <DropdownMenuLabel className="px-3 py-2">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Switch Demo Account</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Test different user roles and features
            </p>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />

          {users.map((user) => {
            const isSelected = user.id === currentUser.id;
            
            return (
              <DropdownMenuItem
                key={user.id}
                onClick={() => onUserChange(user)}
                className={`flex items-center space-x-3 p-3 cursor-pointer rounded-lg transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-muted'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                  {getUserIcon(user)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium truncate">
                      {user.displayName}
                    </span>
                    {getRoleBadge(user)}
                    {user.isVerified && (
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        Pro
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground truncate">
                      @{user.username}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {getUserDescription(user)}
                    </span>
                  </div>
                </div>
                
                {isSelected && (
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </DropdownMenuItem>
            );
          })}
          
          <DropdownMenuSeparator />
          
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground">
              💡 Each account has different permissions and features. Switch between them to test the full experience.
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}