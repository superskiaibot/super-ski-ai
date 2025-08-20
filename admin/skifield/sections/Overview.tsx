import React from 'react';
import { Users, Activity, MapPin, CloudSnow, Clock, AlertTriangle, CheckCircle, Mountain, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { ResortData } from '../types';

interface OverviewProps {
  resortData: ResortData;
}

export function Overview({ resortData }: OverviewProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resortData.visitors.current.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Current Visitors</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% vs yesterday
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resortData.lifts.operational}/{resortData.lifts.total}</p>
                <p className="text-sm text-muted-foreground">Lifts Operating</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((resortData.lifts.operational / resortData.lifts.total) * 100)}% operational
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resortData.trails.open}/{resortData.trails.total}</p>
                <p className="text-sm text-muted-foreground">Trails Open</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((resortData.trails.open / resortData.trails.total) * 100)}% accessible
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <CloudSnow className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resortData.weather.snowDepth}cm</p>
                <p className="text-sm text-muted-foreground">Snow Depth</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {resortData.weather.condition} • {resortData.weather.temperature}°C
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="snowline-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Lift 6 - Maintenance Complete</p>
                <p className="text-xs text-blue-700">Back Bowls Quad ready for operation</p>
                <p className="text-xs text-blue-600 mt-1">5 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-xl">
              <Mountain className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Trail Grooming Complete</p>
                <p className="text-xs text-green-700">Upper mountain trails refreshed</p>
                <p className="text-xs text-green-600 mt-1">15 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <Users className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-800">Peak Capacity Alert</p>
                <p className="text-xs text-purple-700">Approaching 80% visitor capacity</p>
                <p className="text-xs text-purple-600 mt-1">1 hour ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Active Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">High Wind Warning</p>
                <p className="text-xs text-yellow-700">Ridge areas affected - lift restrictions possible</p>
                <p className="text-xs text-yellow-600 mt-1">Active until 6:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <CloudSnow className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Fresh Snow Alert</p>
                <p className="text-xs text-blue-700">15-20cm expected overnight</p>
                <p className="text-xs text-blue-600 mt-1">Starting 10:00 PM today</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">All Systems Normal</p>
                <p className="text-xs text-green-700">No critical alerts at this time</p>
                <p className="text-xs text-green-600 mt-1">Status: Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}