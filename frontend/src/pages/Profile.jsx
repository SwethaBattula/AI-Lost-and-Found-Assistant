import React from 'react';
import { User, Mail, Calendar, ShieldCheck, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">User Profile</h2>
        <p className="text-slate-400 text-sm">Account details and verified credentials</p>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        {/* User Card Header */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-700/50">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center font-bold text-3xl shadow-xl shadow-blue-600/30">
            {user?.full_name?.charAt(0).toUpperCase() || <User className="w-10 h-10" />}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-xl font-bold text-white">{user?.full_name || 'User'}</h3>
            <p className="text-sm text-slate-400">{user?.email || 'N/A'}</p>
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* Profile Information List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <User className="w-4 h-4 text-blue-400" />
              <span>Full Name</span>
            </div>
            <p className="text-base font-semibold text-white">{user?.full_name || 'N/A'}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Email Address</span>
            </div>
            <p className="text-base font-semibold text-white">{user?.email || 'N/A'}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <Hash className="w-4 h-4 text-blue-400" />
              <span>User ID</span>
            </div>
            <p className="text-base font-semibold text-white">#{user?.id || 'N/A'}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Member Since</span>
            </div>
            <p className="text-base font-semibold text-white">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
