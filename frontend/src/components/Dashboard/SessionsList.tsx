import React from 'react';
import { Link } from 'react-router-dom';
import { SkiSessionSummary } from '../../types';

interface SessionsListProps {
  sessions: SkiSessionSummary[];
  showActions?: boolean;
}

const SessionsList: React.FC<SessionsListProps> = ({ sessions, showActions = true }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'Active';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
    
    return `${duration.toFixed(1)}h`;
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-mountain-600">
        No sessions found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="bg-white rounded-lg border border-snow-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-mountain-900">{session.title}</h3>
                {session.is_active && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-mountain-600 mt-1">
                {formatDate(session.start_time)}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-mountain-600">
                <span>📏 {session.total_distance.toFixed(1)} km</span>
                <span>⛰️ {session.total_elevation_gain.toFixed(0)} m</span>
                <span>⚡ {session.max_speed.toFixed(1)} km/h</span>
                <span>⏱️ {formatDuration(session.start_time, session.end_time)}</span>
              </div>
            </div>
            {showActions && (
              <div className="ml-4">
                <Link
                  to={`/sessions/${session.id}`}
                  className="btn-powder text-sm"
                >
                  View Details
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionsList;