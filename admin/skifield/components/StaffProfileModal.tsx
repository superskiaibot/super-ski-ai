import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar,
  Badge as BadgeIcon,
  Edit,
  Save,
  AlertTriangle,
  CheckCircle,
  Star
} from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Separator } from '../../../ui/separator';
import { Switch } from '../../../ui/switch';

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

interface StaffProfileModalProps {
  staff: StaffMember;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (staff: StaffMember) => void;
}

export function StaffProfileModal({ staff, isOpen, onClose, onSave }: StaffProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStaff, setEditedStaff] = useState(staff);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave?.(editedStaff);
    setIsEditing(false);
  };

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

  return (
    <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4">
      <Card className="snowline-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-card border-b border-border z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getDepartmentColor(editedStaff.department)} flex items-center justify-center text-white font-semibold`}>
                {editedStaff.avatar}
              </div>
              <div>
                <CardTitle className="text-xl">{editedStaff.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{editedStaff.position}</p>
              </div>
              <Badge className={`${getStatusColor(editedStaff.status)}`}>
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  editedStaff.status === 'on-duty' ? 'bg-green-500 animate-pulse' : ''
                }`} />
                {editedStaff.status.replace('-', ' ')}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="rounded-lg">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="rounded-lg">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} className="rounded-lg">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-lg">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedStaff.phone}
                    onChange={(e) => setEditedStaff(prev => ({ ...prev, phone: e.target.value }))}
                    className="rounded-xl mt-1"
                  />
                ) : (
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{editedStaff.phone}</span>
                  </div>
                )}\n              </div>\n              <div>\n                <Label htmlFor="email">Email Address</Label>\n                {isEditing ? (\n                  <Input\n                    id="email"\n                    type="email"\n                    value={editedStaff.email}\n                    onChange={(e) => setEditedStaff(prev => ({ ...prev, email: e.target.value }))}\n                    className="rounded-xl mt-1"\n                  />\n                ) : (\n                  <div className="flex items-center space-x-2 mt-1">\n                    <Mail className="w-4 h-4 text-muted-foreground" />\n                    <span>{editedStaff.email}</span>\n                  </div>\n                )}\n              </div>\n            </div>\n          </div>\n\n          <Separator />\n\n          {/* Work Information */}\n          <div>\n            <h3 className="font-semibold mb-4 flex items-center">\n              <Clock className="w-4 h-4 mr-2" />\n              Work Information\n            </h3>\n            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">\n              <div>\n                <Label htmlFor="department">Department</Label>\n                {isEditing ? (\n                  <Select value={editedStaff.department} onValueChange={(value) => setEditedStaff(prev => ({ ...prev, department: value }))}>\n                    <SelectTrigger className="rounded-xl mt-1">\n                      <SelectValue />\n                    </SelectTrigger>\n                    <SelectContent>\n                      <SelectItem value="Lift Operations">Lift Operations</SelectItem>\n                      <SelectItem value="Ski Patrol">Ski Patrol</SelectItem>\n                      <SelectItem value="Maintenance">Maintenance</SelectItem>\n                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>\n                      <SelectItem value="Administration">Administration</SelectItem>\n                    </SelectContent>\n                  </Select>\n                ) : (\n                  <p className="mt-1">{editedStaff.department}</p>\n                )}\n              </div>\n              <div>\n                <Label htmlFor="position">Position</Label>\n                {isEditing ? (\n                  <Input\n                    id="position"\n                    value={editedStaff.position}\n                    onChange={(e) => setEditedStaff(prev => ({ ...prev, position: e.target.value }))}\n                    className="rounded-xl mt-1"\n                  />\n                ) : (\n                  <p className="mt-1">{editedStaff.position}</p>\n                )}\n              </div>\n              <div>\n                <Label htmlFor="location">Current Location</Label>\n                {isEditing ? (\n                  <Input\n                    id="location"\n                    value={editedStaff.location}\n                    onChange={(e) => setEditedStaff(prev => ({ ...prev, location: e.target.value }))}\n                    className="rounded-xl mt-1"\n                  />\n                ) : (\n                  <div className="flex items-center space-x-2 mt-1">\n                    <MapPin className="w-4 h-4 text-muted-foreground" />\n                    <span>{editedStaff.location}</span>\n                  </div>\n                )}\n              </div>\n              <div>\n                <Label htmlFor="hours">Hours This Week</Label>\n                <div className="flex items-center space-x-2 mt-1">\n                  <span className="font-semibold">{editedStaff.hoursThisWeek}h</span>\n                  {editedStaff.hoursThisWeek > 45 && (\n                    <Badge variant="destructive" className="text-xs">\n                      <AlertTriangle className="w-3 h-3 mr-1" />\n                      Overtime Risk\n                    </Badge>\n                  )}\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <Separator />\n\n          {/* Certifications */}\n          <div>\n            <h3 className="font-semibold mb-4 flex items-center">\n              <BadgeIcon className="w-4 h-4 mr-2" />\n              Certifications & Training\n            </h3>\n            <div className="space-y-3">\n              {editedStaff.certifications.map((cert, index) => (\n                <div key={index} className="flex items-center space-x-3 p-3 border border-border rounded-xl">\n                  <CheckCircle className="w-5 h-5 text-green-600" />\n                  <div className="flex-1">\n                    <p className="font-medium text-sm">{cert}</p>\n                    <p className="text-xs text-muted-foreground">Valid until Dec 2024</p>\n                  </div>\n                  <Badge variant="outline" className="text-xs">Active</Badge>\n                </div>\n              ))}\n              {isEditing && (\n                <Button variant="outline" size="sm" className="w-full rounded-xl">\n                  <BadgeIcon className="w-4 h-4 mr-2" />\n                  Add Certification\n                </Button>\n              )}\n            </div>\n          </div>\n\n          <Separator />\n\n          {/* Performance Metrics */}\n          <div>\n            <h3 className="font-semibold mb-4 flex items-center">\n              <Star className="w-4 h-4 mr-2" />\n              Performance Metrics\n            </h3>\n            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">\n              <div className="text-center">\n                <p className="text-2xl font-bold text-green-600">{editedStaff.performanceRating}</p>\n                <p className="text-sm text-muted-foreground">Overall Rating</p>\n                <div className="flex justify-center space-x-1 mt-1">\n                  {Array.from({ length: 5 }).map((_, i) => (\n                    <div\n                      key={i}\n                      className={`w-2 h-2 rounded-full ${\n                        i < Math.floor(editedStaff.performanceRating) ? 'bg-yellow-400' : 'bg-gray-200'\n                      }`}\n                    />\n                  ))}\n                </div>\n              </div>\n              <div className="text-center">\n                <p className="text-2xl font-bold text-blue-600">98%</p>\n                <p className="text-sm text-muted-foreground">Attendance Rate</p>\n                <Badge variant="outline" className="text-xs mt-1">Excellent</Badge>\n              </div>\n              <div className="text-center">\n                <p className="text-2xl font-bold text-purple-600">127</p>\n                <p className="text-sm text-muted-foreground">Days Employed</p>\n                <Badge variant="outline" className="text-xs mt-1">4 months</Badge>\n              </div>\n            </div>\n          </div>\n\n          <Separator />\n\n          {/* Emergency Contact */}\n          <div>\n            <h3 className="font-semibold mb-4 flex items-center">\n              <AlertTriangle className="w-4 h-4 mr-2" />\n              Emergency Contact\n            </h3>\n            <div>\n              <Label htmlFor="emergencyContact">Emergency Contact Information</Label>\n              {isEditing ? (\n                <Input\n                  id="emergencyContact"\n                  value={editedStaff.emergencyContact}\n                  onChange={(e) => setEditedStaff(prev => ({ ...prev, emergencyContact: e.target.value }))}\n                  className="rounded-xl mt-1"\n                  placeholder="Name and phone number"\n                />\n              ) : (\n                <div className="flex items-center space-x-2 mt-1">\n                  <Phone className="w-4 h-4 text-muted-foreground" />\n                  <span>{editedStaff.emergencyContact}</span>\n                </div>\n              )}\n            </div>\n          </div>\n\n          {/* Action Buttons */}\n          <div className="flex justify-end space-x-2 pt-4 border-t border-border">\n            <Button variant="outline" className="rounded-xl">\n              <Phone className="w-4 h-4 mr-2" />\n              Call Staff\n            </Button>\n            <Button variant="outline" className="rounded-xl">\n              <Mail className="w-4 h-4 mr-2" />\n              Send Message\n            </Button>\n            {staff.department === 'Ski Patrol' && (\n              <Button className="rounded-xl bg-red-600 hover:bg-red-700">\n                <AlertTriangle className="w-4 h-4 mr-2" />\n                Emergency Response\n              </Button>\n            )}\n          </div>\n        </CardContent>\n      </Card>\n    </div>\n  );\n}