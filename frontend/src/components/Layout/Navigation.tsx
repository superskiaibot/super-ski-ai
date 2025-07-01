import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg border-b border-snow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-powder-600">🎿 Super Ski AI</div>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link
                to="/tracking"
                className={`nav-link ${isActive('/tracking') ? 'active' : ''}`}
              >
                Live Tracking
              </Link>
              <Link
                to="/sessions"
                className={`nav-link ${isActive('/sessions') ? 'active' : ''}`}
              >
                My Sessions
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-mountain-600">Welcome, {user.email}</span>
            <button
              onClick={logout}
              className="btn-powder text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;