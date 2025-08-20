import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  sparklineData: number[];
  description: string;
  isLoading?: boolean;
  error?: string;
}

export function KpiCard({
  title,
  value,
  change,
  trend,
  sparklineData,
  description,
  isLoading = false,
  error
}: KpiCardProps) {
  // Generate simple SVG sparkline
  const generateSparkline = (data: number[]) => {
    if (data.length === 0) return '';
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const width = 80;
    const height = 20;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} className="flex-shrink-0">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={trend === 'up' ? 'text-green-500' : 'text-red-500'}
        />
      </svg>
    );
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-red-600 font-medium mb-2">Error loading {title}</div>
            <div className="text-sm text-red-500">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              <div className="flex items-center space-x-2">
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {change}
                </span>
              </div>
            </div>

            {/* Value */}
            <div className="text-3xl font-bold text-gray-900">
              {value}
            </div>

            {/* Sparkline and Description */}
            <div className="flex items-end justify-between">
              <div className="text-sm text-gray-500">
                {description}
              </div>
              {sparklineData.length > 0 && (
                <div className="ml-4">
                  {generateSparkline(sparklineData)}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}