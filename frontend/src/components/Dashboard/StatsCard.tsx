import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'powder' | 'mountain' | 'snow';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    powder: 'bg-powder-50 border-powder-200 text-powder-600',
    mountain: 'bg-mountain-50 border-mountain-200 text-mountain-600',
    snow: 'bg-snow-50 border-snow-200 text-snow-600'
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-mountain-600">{title}</p>
          <p className="text-3xl font-bold text-mountain-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;