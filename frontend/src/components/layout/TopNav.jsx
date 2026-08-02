import React, { useState, useEffect } from 'react';
import { Menu, User, Bell, ShieldCheck, Building2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';

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
  '/admin': 'Lost & Found Office Dashboard',
  '/admin/matches': 'Active Cases & Match Supervision',
  '/admin/inventory': 'Items Currently in Office',
  '/admin/users': 'Registered User Directory',
};

const TopNav = ({ setMobileOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const title = ROUTE_TITLES[location.pathname] || 'AI Lost & Found';

  const fetchUnreadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      const unread = data.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to fetch unread notifications:', err);
    }
  };

  useEffect(() => {
    if (user?.role === 'student') {
      fetchUnreadNotifications();
    }
  }, [location.pathname, user]);

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
        {/* Notifications Icon Button (For Student Role) */}
        {user?.role === 'student' && (
          <Link
            to="/notifications"
            className="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition border border-transparent hover:border-slate-800 flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-rose-600/40 animate-pulse border border-rose-500/50">
                {unreadCount}
              </span>
            )}
          </Link>
        )}

        {/* User Profile Summary */}
        <Link
          to="/profile"
          className="flex items-center space-x-3 p-1.5 pr-3 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition"
        >
          <div
            className={`w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center border ${
              user?.role === 'admin'
                ? 'bg-amber-600/20 text-amber-400 border-amber-500/30'
                : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
            }`}
          >
            {user?.full_name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white line-clamp-1">{user?.full_name || 'User'}</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              {user?.role === 'admin' ? (
                <>
                  <Building2 className="w-3 h-3 text-amber-400" /> Lost & Found Office
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Student Account
                </>
              )}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default TopNav;
