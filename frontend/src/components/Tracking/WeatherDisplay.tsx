import React from 'react';
import { WeatherData } from '../../types';

interface WeatherDisplayProps {
  weather: WeatherData | null;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'snow':
        return '❄️';
      case 'thunderstorm':
        return '⛈️';
      case 'drizzle':
        return '🌦️';
      case 'mist':
      case 'fog':
        return '🌫️';
      default:
        return '🌤️';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-mountain-900 mb-3">
        Current Weather
      </h3>
      {weather ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getWeatherIcon(weather.condition)}</span>
            <div>
              <p className="text-2xl font-bold text-mountain-900">
                {Math.round(weather.temperature)}°C
              </p>
              <p className="text-sm text-mountain-600 capitalize">
                {weather.description}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span>💧</span>
              <span className="text-mountain-600">
                {weather.humidity}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span>💨</span>
              <span className="text-mountain-600">
                {weather.wind_speed.toFixed(1)} m/s
              </span>
            </div>
          </div>

          {weather.condition.toLowerCase() === 'snow' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm">
              <div className="flex items-center">
                <span className="mr-2">❄️</span>
                Perfect skiing conditions! Fresh snow is falling.
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-mountain-600">
          Weather data unavailable
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;