import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PackageSearch,
  CheckSquare,
  Sparkles,
  PlusCircle,
  ArrowRight,
  Clock,
  MapPin,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { lostItemService } from '../services/lostItemService';
import { foundItemService } from '../services/foundItemService';
import { matchService } from '../services/matchService';
import SkeletonLoader from '../components/common/SkeletonLoader';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ myLostCount: 0, myFoundCount: 0, myMatchCount: 0 });
  const [myRecentLost, setMyRecentLost] = useState([]);
  const [myRecentFound, setMyRecentFound] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch strictly personal data (my_items_only = true)
        const [myLostData, myFoundData, allMatches] = await Promise.all([
          lostItemService.getLostItems(true),
          foundItemService.getFoundItems(true),
          matchService.getMatches(),
        ]);

        // Filter matches involving the currently logged in user
        const myMatches = allMatches.filter(
          (m) =>
            m.lost_item?.user_id === user?.id ||
            m.found_item?.user_id === user?.id
        );

        setStats({
          myLostCount: myLostData.length,
          myFoundCount: myFoundData.length,
          myMatchCount: myMatches.length,
        });

        setMyRecentLost(myLostData.slice(0, 3));
        setMyRecentFound(myFoundData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load personal dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPersonalDashboardData();
    }
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personal Dashboard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.full_name || 'Student'}!
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Manage your reported lost belongings, registered found items, and view AI matching alerts for your items.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/lost-items/new"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Lost Item</span>
            </Link>
            <Link
              to="/found-items/new"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition border border-slate-700 flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found Item</span>
            </Link>
            <Link
              to="/community-lost-items"
              className="px-5 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm font-medium rounded-xl transition flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Browse Community Lost Items</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Personal Metrics Counter Grid */}
      {loading ? (
        <SkeletonLoader type="list" count={3} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">My Lost Items</span>
              <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                <PackageSearch className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stats.myLostCount}</div>
            <p className="text-xs text-slate-500">Items you have reported lost</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">My Found Items</span>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stats.myFoundCount}</div>
            <p className="text-xs text-slate-500">Items you have registered as found</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">My Matches</span>
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stats.myMatchCount}</div>
            <p className="text-xs text-slate-500">Matches involving your items</p>
          </div>
        </div>
      )}

      {/* Personal Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Recent Lost Reports */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-white text-base">My Recent Lost Reports</h3>
            <Link to="/lost-items" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {myRecentLost.length === 0 ? (
            <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-xl text-center space-y-2">
              <PackageSearch className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400">You haven't reported any lost items yet.</p>
              <Link to="/lost-items/new" className="text-xs text-blue-400 hover:underline inline-block pt-1">
                + Report a lost item
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myRecentLost.map((item) => (
                <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">{item.item_name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-400" /> {item.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> {new Date(item.date_lost).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Recent Found Reports */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-white text-base">My Recent Found Reports</h3>
            <Link to="/found-items" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {myRecentFound.length === 0 ? (
            <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-xl text-center space-y-2">
              <CheckSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400">You haven't reported any found items yet.</p>
              <Link to="/found-items/new" className="text-xs text-blue-400 hover:underline inline-block pt-1">
                + Report a found item
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myRecentFound.map((item) => (
                <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">{item.item_name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-400" /> {item.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> {new Date(item.date_found).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
