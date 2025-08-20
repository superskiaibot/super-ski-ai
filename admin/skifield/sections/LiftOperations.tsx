import React from 'react';
import { PlusCircle, Edit, Settings, Power, PowerOff } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Switch } from '../../../ui/switch';
import { Progress } from '../../../ui/progress';
import { ResortData } from '../types';

interface LiftOperationsProps {
  resortData: ResortData;
}

export function LiftOperations({ resortData }: LiftOperationsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Lift Operations</h2>
          <p className="text-muted-foreground">Manage lift status, capacity, and operations</p>
        </div>
        <Button className="rounded-xl">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Maintenance
        </Button>
      </div>

      <div className="grid gap-4">
        {resortData.lifts.details.map((lift) => (
          <Card key={lift.id} className="snowline-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    lift.status === 'operational' 
                      ? 'bg-gradient-to-br from-green-500 to-green-600' 
                      : 'bg-gradient-to-br from-red-500 to-red-600'
                  }`}>
                    {lift.status === 'operational' ? (
                      <Power className="w-6 h-6 text-white" />
                    ) : (
                      <PowerOff className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{lift.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge className={`${
                        lift.status === 'operational' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {lift.status === 'operational' ? 'Operational' : 'Maintenance'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Capacity: {lift.current.toLocaleString()}/{lift.capacity.toLocaleString()}/hr
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Switch 
                    checked={lift.status === 'operational'}
                    disabled={lift.status === 'maintenance'}
                  />
                </div>
              </div>
              
              {lift.status === 'operational' && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Current Load</span>
                    <span>{Math.round((lift.current / lift.capacity) * 100)}%</span>
                  </div>
                  <Progress value={(lift.current / lift.capacity) * 100} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}