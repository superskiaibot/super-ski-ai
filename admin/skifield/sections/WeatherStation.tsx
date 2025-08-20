import React from 'react';
import { Thermometer, Wind, Eye, AlertTriangle, CloudSnow } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Separator } from '../../../ui/separator';
import { ResortData } from '../types';

interface WeatherStationProps {
  resortData: ResortData;
}

export function WeatherStation({ resortData }: WeatherStationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Weather Station</h2>
        <p className="text-muted-foreground">Real-time conditions and forecasts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resortData.weather.temperature}°C</p>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-xs text-muted-foreground mt-1">Feels like -8°C</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resortData.weather.windSpeed} km/h</p>
                <p className="text-sm text-muted-foreground">Wind Speed</p>
                <p className="text-xs text-muted-foreground mt-1">Gusts up to 25 km/h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resortData.weather.visibility}</p>
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p className="text-xs text-muted-foreground mt-1">Clear conditions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="snowline-card">
          <CardHeader>
            <CardTitle>Snow Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Base Depth</span>
              <span className="font-semibold">{resortData.weather.snowDepth}cm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">New Snow (24h)</span>
              <span className="font-semibold">{resortData.weather.newSnow}cm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Surface Condition</span>
              <Badge className="bg-blue-100 text-blue-800">{resortData.weather.condition}</Badge>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">24-Hour Forecast</h4>
              <p className="text-sm text-muted-foreground">{resortData.weather.forecast}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardHeader>
            <CardTitle>Weather Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">Wind Advisory</p>
                <p className="text-xs text-yellow-700">High winds expected 2-6 PM</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <CloudSnow className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Snow Alert</p>
                <p className="text-xs text-blue-700">Heavy snow starting 10 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}