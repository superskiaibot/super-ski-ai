import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardStats, SkiSessionSummary } from '../../types';
import { sessionsAPI } from '../../services/api';
import StatsCard from './StatsCard';
import SessionsList from './SessionsList';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<SkiSessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, sessionsData] = await Promise.all([
        sessionsAPI.getDashboardStats(),
        sessionsAPI.getSessions()
      ]);
      
      setStats(statsData);
      setRecentSessions(sessionsData.slice(0, 5)); // Latest 5 sessions
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-snow-gradient flex items-center justify-center">
        <div className="loading-spinner h-12 w-12 border-4 border-powder-200 border-t-powder-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-snow-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mountain-900 mb-2">
            Ski Dashboard
          </h1>
          <p className="text-mountain-600">
            Track your skiing progress and analyze your performance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Link
              to="/tracking"
              className="btn-ski inline-flex items-center"
            >
              🎿 Start New Session
            </Link>
            <Link
              to="/sessions"
              className="btn-powder inline-flex items-center"
            >
              📊 View All Sessions
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Sessions"
              value={stats.total_sessions.toString()}
              icon="🏔️"
              color="powder"
            />
            <StatsCard
              title="Distance"
              value={`${stats.total_distance.toFixed(1)} km`}
              icon="📏"
              color="mountain"
            />
            <StatsCard
              title="Elevation Gain"
              value={`${stats.total_elevation.toFixed(0)} m`}
              icon="⛰️"
              color="snow"
            />
            <StatsCard
              title="Avg Speed"
              value={`${stats.avg_speed.toFixed(1)} km/h`}
              icon="⚡"
              color="powder"
            />
          </div>
        )}

        {/* Recent Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card-ski">
            <h2 className="text-xl font-semibold text-mountain-900 mb-4">
              Recent Sessions
            </h2>
            {recentSessions.length > 0 ? (
              <SessionsList sessions={recentSessions} showActions={false} />
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎿</div>
                <p className="text-mountain-600 mb-4">No sessions yet</p>
                <Link
                  to="/tracking"
                  className="btn-powder"
                >
                  Start Your First Session
                </Link>
              </div>
            )}
          </div>

          {/* Weather & Tips */}
          <div className="card-ski">
            <h2 className="text-xl font-semibold text-mountain-900 mb-4">
              Skiing Tips
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">❄️</div>
                <div>
                  <h3 className="font-semibold text-mountain-800">Fresh Powder</h3>
                  <p className="text-mountain-600 text-sm">
                    Perfect conditions for off-piste skiing. Remember to check avalanche conditions.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🌡️</div>
                <div>
                  <h3 className="font-semibold text-mountain-800">Temperature</h3>
                  <p className="text-mountain-600 text-sm">
                    Dress in layers and stay hydrated even in cold weather.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🥽</div>
                <div>
                  <h3 className="font-semibold text-mountain-800">Safety First</h3>
                  <p className="text-mountain-600 text-sm">
                    Always wear protective gear and ski within your ability level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;