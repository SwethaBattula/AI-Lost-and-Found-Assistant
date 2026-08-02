import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Package,
  CheckCircle2,
  PackageSearch,
  CheckSquare,
  Users,
  Building2,
  ArrowRight,
  Clock,
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
        console.error('Failed to fetch office stats:', err);
        showToast('Failed to load Lost & Found Office operational stats.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Office Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Lost & Found Office Supervision</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Lost & Found Office Dashboard
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Supervise physical inventory, monitor automatic AI matches, verify student ownership during collection, and record item handovers.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/admin/matches"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Supervise Active Cases</span>
            </Link>
            <Link
              to="/admin/inventory"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-xl transition border border-slate-700 flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Office Inventory</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Operational Supervision Statistics Grid */}
      {loading ? (
        <SkeletonLoader type="list" count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Active Cases</span>
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.active_cases || 0}</div>
            <p className="text-xs text-slate-500">Ongoing AI match resolution cases</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Items Received</span>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.items_received || 0}</div>
            <p className="text-xs text-slate-500">Physically turned in at office</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Waiting for Pickup</span>
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.waiting_for_pickup || 0}</div>
            <p className="text-xs text-slate-500">Owner notified, awaiting handover</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Closed Cases</span>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.closed_cases || 0}</div>
            <p className="text-xs text-slate-500">Handed over to verified owner</p>
          </div>
        </div>
      )}

      {/* Registry Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
            <PackageSearch className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats?.new_lost_reports || 0}</div>
            <div className="text-xs text-slate-400">Total Lost Item Reports</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats?.new_found_reports || 0}</div>
            <div className="text-xs text-slate-400">Total Found Item Reports</div>
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
