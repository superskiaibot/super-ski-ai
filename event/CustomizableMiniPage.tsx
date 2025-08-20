import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Building2, 
  Globe, 
  Heart, 
  Mountain, 
  Trophy, 
  TrendingUp, 
  Target, 
  Share2, 
  Eye, 
  Edit,
  Camera,
  Link,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BarChart3,
  Award,
  Star,
  Zap,
  DollarSign,
  Clock,
  ChevronRight,
  ExternalLink,
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

interface MiniPageData {
  type: 'team' | 'business';
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  themeColor: string;
  backgroundImage?: string;
  isPublic: boolean;
  
  // Stats
  totalVertical: number;
  totalMembers: number;
  activeMembers: number;
  totalFundraised: number;
  fundraisingTarget: number;
  rank: number;
  
  // Team/Business specific
  department?: string; // For business teams
  industry?: string; // For businesses
  foundedDate?: string;
  
  // Members/Employees
  members: Array<{
    id: string;
    name: string;
    avatar?: string;
    totalVertical: number;
    fundraised: number;
    role?: 'admin' | 'manager' | 'member' | 'employee';
  }>;
  
  // Recent activity
  recentActivity: Array<{
    id: string;
    type: 'run' | 'donation' | 'achievement' | 'member_join';
    description: string;
    value?: number;
    date: string;
    memberName?: string;
  }>;
  
  // Customization
  showMemberList: boolean;
  showProgressCharts: boolean;
  showRecentActivity: boolean;
  customMessage?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface CustomizableMiniPageProps {
  data: MiniPageData;
  isPreview?: boolean;
  onEdit?: () => void;
}

export function CustomizableMiniPage({ data, isPreview = false, onEdit }: CustomizableMiniPageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    if (data.backgroundImage) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = data.backgroundImage;
    }
  }, [data.backgroundImage]);

  const fundraisingProgress = (data.totalFundraised / data.fundraisingTarget) * 100;
  const topMembers = data.members
    .sort((a, b) => b.totalVertical - a.totalVertical)
    .slice(0, 5);

  const Icon = data.type === 'team' ? Users : Building2;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden"
        style={{
          backgroundColor: data.themeColor,
          backgroundImage: data.backgroundImage && imageLoaded 
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${data.backgroundImage})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Edit button for preview mode */}
        {isPreview && onEdit && (
          <div className="absolute top-4 right-4 z-10">
            <Button onClick={onEdit} variant="secondary" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Page
            </Button>
          </div>
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            {/* Logo */}
            {data.logo ? (
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <img src={data.logo} alt={`${data.name} logo`} className="w-full h-full object-cover rounded-lg" />
              </div>
            ) : (
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Icon className="w-12 h-12 text-white" />
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.name}</h1>
            
            {/* Subtitle */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {data.type === 'team' ? 'Team' : 'Business'} Participant
              </Badge>
              {data.department && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {data.department}
                </Badge>
              )}
              {data.industry && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {data.industry}
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              {data.description}
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{data.totalVertical.toLocaleString()}m</div>
                <div className="text-white/80 text-sm">Total Vertical</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{data.totalMembers}</div>
                <div className="text-white/80 text-sm">
                  {data.type === 'team' ? 'Members' : 'Employees'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">${data.totalFundraised.toLocaleString()}</div>
                <div className="text-white/80 text-sm">Fundraised</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">#{data.rank}</div>
                <div className="text-white/80 text-sm">Ranking</div>
              </div>
            </div>

            {/* Website Link */}
            {data.website && (
              <div className="mt-8">
                <a 
                  href={data.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-colors backdrop-blur-sm"
                >
                  <Globe className="w-5 h-5" />
                  <span>Visit Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Custom Message */}
            {data.customMessage && (
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-lg leading-relaxed">{data.customMessage}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" style={{ color: data.themeColor }} />
                  Our Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fundraising Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Fundraising Goal</span>
                    <span className="text-sm text-gray-600">{fundraisingProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={fundraisingProgress} className="h-3 mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${data.totalFundraised.toLocaleString()} raised</span>
                    <span>${data.fundraisingTarget.toLocaleString()} goal</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Mountain className="w-6 h-6 mx-auto mb-2" style={{ color: data.themeColor }} />
                    <div className="text-2xl font-bold">{data.totalVertical.toLocaleString()}m</div>
                    <div className="text-sm text-gray-600">Total Vertical</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2" style={{ color: data.themeColor }} />
                    <div className="text-2xl font-bold">{data.activeMembers}/{data.totalMembers}</div>
                    <div className="text-sm text-gray-600">Active Participants</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Trophy className="w-6 h-6 mx-auto mb-2" style={{ color: data.themeColor }} />
                    <div className="text-2xl font-bold">#{data.rank}</div>
                    <div className="text-sm text-gray-600">
                      {data.type === 'team' ? 'Team' : 'Corporate'} Rank
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            {data.showMemberList && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" style={{ color: data.themeColor }} />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topMembers.map((member, index) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={index === 0 ? "default" : "secondary"}
                            className={index === 0 ? "bg-yellow-500" : ""}
                          >
                            #{index + 1}
                          </Badge>
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            {member.role && member.role !== 'member' && member.role !== 'employee' && (
                              <Badge variant="outline" className="text-xs">
                                {member.role === 'admin' ? 'Admin' : 'Manager'}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: data.themeColor }}>
                            {member.totalVertical.toLocaleString()}m
                          </p>
                          <p className="text-sm text-gray-600">
                            ${member.fundraised} raised
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            {data.showRecentActivity && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" style={{ color: data.themeColor }} />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.recentActivity.slice(0, 6).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${data.themeColor}20` }}
                        >
                          {activity.type === 'run' && <Mountain className="w-5 h-5" style={{ color: data.themeColor }} />}
                          {activity.type === 'donation' && <Heart className="w-5 h-5" style={{ color: data.themeColor }} />}
                          {activity.type === 'achievement' && <Award className="w-5 h-5" style={{ color: data.themeColor }} />}
                          {activity.type === 'member_join' && <Users className="w-5 h-5" style={{ color: data.themeColor }} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          {activity.memberName && (
                            <p className="text-xs text-gray-600">by {activity.memberName}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {activity.value && (
                            <p className="font-medium" style={{ color: data.themeColor }}>
                              {activity.type === 'donation' ? `$${activity.value}` : `${activity.value}m`}
                            </p>
                          )}
                          <p className="text-xs text-gray-600">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Support Our Cause</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" style={{ backgroundColor: data.themeColor }}>
                  <Heart className="w-4 h-4 mr-2" />
                  Make a Donation
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Our Page
                </Button>
                {data.type === 'team' && (
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Join Our Team
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Participation Rate</span>
                  <span className="font-medium">
                    {Math.round((data.activeMembers / data.totalMembers) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average per {data.type === 'team' ? 'Member' : 'Employee'}</span>
                  <span className="font-medium">
                    {Math.round(data.totalVertical / data.totalMembers).toLocaleString()}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Days Participating</span>
                  <span className="font-medium">
                    {Math.floor(Math.random() * 15) + 5}
                  </span>
                </div>
                {data.foundedDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {data.type === 'team' ? 'Team Created' : 'Founded'}
                    </span>
                    <span className="font-medium">{data.foundedDate}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            {data.socialLinks && Object.keys(data.socialLinks).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connect With Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {data.socialLinks.facebook && (
                      <a 
                        href={data.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Facebook className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">Facebook</span>
                      </a>
                    )}
                    {data.socialLinks.instagram && (
                      <a 
                        href={data.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
                      >
                        <Instagram className="w-4 h-4 text-pink-600" />
                        <span className="text-sm text-pink-700">Instagram</span>
                      </a>
                    )}
                    {data.socialLinks.twitter && (
                      <a 
                        href={data.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Twitter className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Twitter</span>
                      </a>
                    )}
                    {data.socialLinks.linkedin && (
                      <a 
                        href={data.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Linkedin className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">LinkedIn</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium">Ski For A Cure NZ</p>
                    <p className="text-sm text-gray-600">Charity skiing event</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">January 2025</p>
                    <p className="text-sm text-gray-600">Event period</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">New Zealand</p>
                    <p className="text-sm text-gray-600">All ski fields</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-lg font-medium">Ski For A Cure NZ</span>
          </div>
          <p className="text-gray-400 mb-4">
            Join us in making a difference through skiing. Every meter counts!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>Powered by Snowline</span>
            <span>•</span>
            <span>Charity Event 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Demo data for testing
export const mockTeamData: MiniPageData = {
  type: 'team',
  id: 'team-1',
  name: 'Powder Chasers',
  description: 'A group of passionate skiers from Queenstown coming together to support cancer research while doing what we love most - skiing!',
  logo: undefined,
  website: 'https://powderchasers.nz',
  themeColor: '#22c55e',
  isPublic: true,
  totalVertical: 45680,
  totalMembers: 12,
  activeMembers: 10,
  totalFundraised: 8500,
  fundraisingTarget: 15000,
  rank: 3,
  department: 'Community Team',
  members: [
    { id: '1', name: 'Alex Johnson', totalVertical: 12450, fundraised: 2100, role: 'admin' },
    { id: '2', name: 'Sarah Wilson', totalVertical: 10200, fundraised: 1800, role: 'member' },
    { id: '3', name: 'Mike Chen', totalVertical: 9800, fundraised: 1500, role: 'member' },
    { id: '4', name: 'Emma Davis', totalVertical: 8900, fundraised: 1200, role: 'member' },
    { id: '5', name: 'David Lee', totalVertical: 4330, fundraised: 900, role: 'member' }
  ],
  recentActivity: [
    { id: '1', type: 'run', description: 'Completed epic powder run at Coronet Peak', value: 1240, date: '2 hours ago', memberName: 'Alex Johnson' },
    { id: '2', type: 'donation', description: 'Received donation from local supporter', value: 150, date: '5 hours ago' },
    { id: '3', type: 'achievement', description: 'Team reached 40,000m milestone!', date: '1 day ago' },
    { id: '4', type: 'member_join', description: 'New member joined the team', date: '2 days ago', memberName: 'Tom Roberts' }
  ],
  showMemberList: true,
  showProgressCharts: true,
  showRecentActivity: true,
  customMessage: 'We\'re a tight-knit group of skiing enthusiasts who believe in the power of community and giving back. Join us as we carve our way down the mountains while raising funds for cancer research!',
  socialLinks: {
    facebook: 'https://facebook.com/powderchasers',
    instagram: 'https://instagram.com/powderchasers_nz'
  }
};

export const mockBusinessData: MiniPageData = {
  type: 'business',
  id: 'business-1',
  name: 'TechNova Solutions',
  description: 'Leading technology company committed to innovation, employee wellbeing, and community impact. We\'re proud to support Ski For A Cure NZ.',
  logo: undefined,
  website: 'https://technova.co.nz',
  themeColor: '#7c3aed',
  isPublic: true,
  totalVertical: 89450,
  totalMembers: 28,
  activeMembers: 24,
  totalFundraised: 25000,
  fundraisingTarget: 50000,
  rank: 1,
  industry: 'Technology',
  foundedDate: '2019',
  members: [
    { id: '1', name: 'Jennifer Park', totalVertical: 15200, fundraised: 3500, role: 'admin' },
    { id: '2', name: 'Robert Smith', totalVertical: 12800, fundraised: 2800, role: 'manager' },
    { id: '3', name: 'Lisa Zhang', totalVertical: 11500, fundraised: 2200, role: 'employee' },
    { id: '4', name: 'Carlos Rodriguez', totalVertical: 10900, fundraised: 1900, role: 'employee' },
    { id: '5', name: 'Amy Thompson', totalVertical: 9600, fundraised: 1600, role: 'manager' }
  ],
  recentActivity: [
    { id: '1', type: 'run', description: 'Team building ski day at The Remarkables', value: 2840, date: '3 hours ago', memberName: 'Engineering Team' },
    { id: '2', type: 'donation', description: 'Corporate matching donation added', value: 5000, date: '1 day ago' },
    { id: '3', type: 'achievement', description: 'Reached #1 corporate ranking!', date: '2 days ago' },
    { id: '4', type: 'member_join', description: 'New employee joined the program', date: '3 days ago', memberName: 'Mark Foster' }
  ],
  showMemberList: true,
  showProgressCharts: true,
  showRecentActivity: true,
  customMessage: 'At TechNova, we believe in balancing innovation with social responsibility. Our participation in Ski For A Cure NZ reflects our commitment to employee wellness and community support. Together, we\'re not just building better technology - we\'re building a better future.',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/technova-solutions',
    facebook: 'https://facebook.com/technovasolutions',
    twitter: 'https://twitter.com/technova_nz'
  }
};