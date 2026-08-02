import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  PackageSearch,
  CheckSquare,
  Sparkles,
  Bell,
  User,
  LogOut,
  X,
  Compass,
  Users,
  Compass as FoundIcon,
  Building2,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const studentNavItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Report Lost Item', path: '/lost-items/new', icon: PlusCircle },
    { label: 'My Lost Items', path: '/lost-items', icon: PackageSearch },
    { label: 'Community Lost Items', path: '/community-lost-items', icon: Users },
    { label: 'I Found Something', path: '/i-found-something', icon: FoundIcon },
    { label: 'My Found Items', path: '/found-items', icon: CheckSquare },
    { label: 'Matches', path: '/matches', icon: Sparkles },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const adminNavItems = [
    { label: 'Office Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Active Cases & Matches', path: '/admin/matches', icon: Sparkles },
    { label: 'Office Inventory', path: '/admin/inventory', icon: Package },
    { label: 'Registered Users', path: '/admin/users', icon: Users },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-xl text-white shadow-lg ${
                  user?.role === 'admin'
                    ? 'bg-amber-600 shadow-amber-500/20'
                    : 'bg-blue-600 shadow-blue-500/20'
                }`}
              >
                {user?.role === 'admin' ? <Building2 className="w-5 h-5" /> : <Compass className="w-5 h-5" />}
              </div>
              <span className="font-bold text-white text-base tracking-tight leading-tight">
                {user?.role === 'admin' ? 'Lost & Found Office' : 'AI Lost & Found'}
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/' || item.path === '/admin'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? user?.role === 'admin'
                          ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                          : 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition border border-red-500/20"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
