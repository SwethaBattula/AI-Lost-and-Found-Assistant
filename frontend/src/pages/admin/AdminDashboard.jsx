import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckSquare,
  CheckCircle2,
  XCircle,
  PackageSearch,
  Users,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
        showToast('Failed to load administrator dashboard stats.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Admin Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Administrator Control Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Administrator Dashboard
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Manage system-wide matches, verify item ownership, supervise handover collections, and audit platform users.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/admin/matches"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Review Pending Matches</span>
            </Link>
            <Link
              to="/admin/collections"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-xl transition border border-slate-700 flex items-center space-x-2"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Manage Collections</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Global Statistics Grid */}
      {loading ? (
        <SkeletonLoader type="list" count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Pending Matches</span>
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.pending_matches || 0}</div>
            <p className="text-xs text-slate-500">Awaiting admin verification</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Ready For Collection</span>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.ready_for_collection || 0}</div>
            <p className="text-xs text-slate-500">Verified items awaiting pickup</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Collected Cases</span>
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.collected_cases || 0}</div>
            <p className="text-xs text-slate-500">Successfully returned items</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Rejected Matches</span>
              <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.rejected_matches || 0}</div>
            <p className="text-xs text-slate-500">Evaluated as non-matches</p>
          </div>
        </div>
      )}

      {/* Global Catalog Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
            <PackageSearch className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats?.total_lost_items || 0}</div>
            <div className="text-xs text-slate-400">Total System Lost Items</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats?.total_found_items || 0}</div>
            <div className="text-xs text-slate-400">Total System Found Items</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats?.total_registered_users || 0}</div>
            <div className="text-xs text-slate-400">Total Registered Users</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
