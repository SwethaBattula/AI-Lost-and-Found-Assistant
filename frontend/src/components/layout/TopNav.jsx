import React from 'react';
import { Menu, User, Bell, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROUTE_TITLES = {
  '/': 'Student Dashboard',
  '/lost-items/new': 'Report Lost Item',
  '/lost-items': 'My Lost Items',
  '/community-lost-items': 'Community Lost Items',
  '/i-found-something': 'I Found Something',
  '/found-items/new': 'Report Found Item',
  '/found-items': 'My Found Items',
  '/matches': 'AI Matches',
  '/notifications': 'Notification Alerts',
  '/profile': 'User Profile',
};

const TopNav = ({ setMobileOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const title = ROUTE_TITLES[location.pathname] || 'AI Lost & Found';

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center space-x-3">
        {/* Notifications Icon Button */}
        <Link
          to="/notifications"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition border border-transparent hover:border-slate-800"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
        </Link>

        {/* User Profile Summary */}
        <Link
          to="/profile"
          className="flex items-center space-x-3 p-1.5 pr-3 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
            {user?.full_name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white line-clamp-1">{user?.full_name || 'Student'}</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Student Account
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default TopNav;
