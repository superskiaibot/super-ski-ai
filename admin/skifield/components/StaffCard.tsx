import React from 'react';
import { Phone, MapPin, Edit, Settings, RadioIcon as RadioIconLucide } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';

interface StaffMember {
  id: string;
  name: string;
  department: string;
  position: string;
  status: 'on-duty' | 'off-duty' | 'break' | 'emergency';
  shiftStart: string;
  shiftEnd: string;
  location: string;
  phone: string;
  email: string;
  certifications: string[];
  emergencyContact: string;
  hoursThisWeek: number;
  performanceRating: number;
  avatar: string;
}

interface StaffCardProps {
  staff: StaffMember;
  variant?: 'default' | 'compact' | 'emergency';
  showActions?: boolean;
  onCall?: () => void;
  onEdit?: () => void;
  onRadio?: () => void;
}

export function StaffCard({ 
  staff, 
  variant = 'default', 
  showActions = true,
  onCall,
  onEdit,
  onRadio 
}: StaffCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-duty': return 'bg-green-100 text-green-800 border-green-200';
      case 'break': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department.toLowerCase()) {
      case 'ski patrol': return 'from-red-500 to-red-600';
      case 'lift operations': return 'from-blue-500 to-blue-600';
      case 'maintenance': return 'from-orange-500 to-orange-600';
      case 'food & beverage': return 'from-green-500 to-green-600';
      case 'administration': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getDepartmentColor(staff.department)} flex items-center justify-center text-white text-xs font-semibold`}>
          {staff.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{staff.name}</p>
          <p className="text-xs text-muted-foreground truncate">{staff.position}</p>
        </div>
        <Badge className={`text-xs ${getStatusColor(staff.status)}`}>
          {staff.status.replace('-', ' ')}
        </Badge>
        {showActions && (
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-lg" onClick={onCall}>
            <Phone className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'emergency') {
    return (
      <Card className="snowline-card border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getDepartmentColor(staff.department)} flex items-center justify-center text-white font-semibold`}>
                {staff.avatar}
              </div>
              <div>
                <h4 className="font-semibold">{staff.name}</h4>
                <p className="text-sm text-muted-foreground">{staff.position}</p>
                <div className="flex items-center space-x-4 mt-1 text-xs">
                  <span className="flex items-center text-muted-foreground">
                    <Phone className="w-3 h-3 mr-1" />
                    {staff.phone}
                  </span>
                  <span className="flex items-center text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {staff.location}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(staff.status)}`}>
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  staff.status === 'on-duty' ? 'bg-green-500 animate-pulse' : ''
                }`} />
                {staff.status.replace('-', ' ')}
              </Badge>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 rounded-lg text-xs px-3">
                Emergency Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="snowline-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getDepartmentColor(staff.department)} flex items-center justify-center text-white font-semibold`}>
              {staff.avatar}
            </div>
            
            {/* Staff Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-lg">{staff.name}</h3>
                <Badge className={`${getStatusColor(staff.status)}`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    staff.status === 'on-duty' ? 'bg-green-500 animate-pulse' : ''
                  }`} />
                  {staff.status.replace('-', ' ')}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">{staff.position}</p>
                  <p className="text-muted-foreground">{staff.department}</p>
                </div>
                <div>
                  <p className="font-medium">Shift: {staff.shiftStart} - {staff.shiftEnd}</p>
                  <p className="text-muted-foreground flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {staff.location}
                  </p>
                </div>
                <div>
                  <p className="font-medium">{staff.hoursThisWeek}h this week</p>
                  <p className="text-muted-foreground flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {staff.phone}
                  </p>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-1 mt-3">
                {staff.certifications.slice(0, 3).map((cert, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
                {staff.certifications.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{staff.certifications.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="rounded-lg" onClick={onCall}>
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg" onClick={onRadio}>
                <RadioIconLucide className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}