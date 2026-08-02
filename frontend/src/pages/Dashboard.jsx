import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PackageSearch,
  CheckSquare,
  Sparkles,
  PlusCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { lostItemService } from '../services/lostItemService';
import { foundItemService } from '../services/foundItemService';
import { matchService } from '../services/matchService';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import ImageModal from '../components/common/ImageModal';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    myLostCount: 0,
    myFoundCount: 0,
    myMatchesCount: 0,
  });
  const [recentLost, setRecentLost] = useState([]);
  const [recentFound, setRecentFound] = useState([]);
  const [activeMatchAlert, setActiveMatchAlert] = useState(null);

  // Image Modal state
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [lostData, foundData, matchData] = await Promise.all([
          lostItemService.getLostItems(true),
          foundItemService.getFoundItems(true),
          matchService.getMatches(),
        ]);

        setStats({
          myLostCount: lostData.length,
          myFoundCount: foundData.length,
          myMatchesCount: matchData.length,
        });

        setRecentLost(lostData.slice(0, 3));
        setRecentFound(foundData.slice(0, 3));

        const pendingMatch = matchData.find(
          (m) => m.status === 'pending' || m.status === 'potential_match' || m.status === 'waiting_for_pickup' || m.status === 'ready_for_collection'
        );
        setActiveMatchAlert(pendingMatch || null);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        showToast('Failed to load personal dashboard data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const buildImageUrl = (path) => {
    if (!path) return null;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return (
    <div className="space-y-8">
      {/* Image Preview Modal */}
      <ImageModal
        isOpen={!!selectedImage}
        imageUrl={selectedImage?.url}
        title={selectedImage?.title}
        onClose={() => setSelectedImage(null)}
      />

      {/* Dynamic Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Lost & Found Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {user?.full_name || 'Student'}!
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Report lost belongings, register turned-in items, search community registries, and view automated AI match alerts in real-time.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/lost-items/new"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Lost Item</span>
            </Link>
            <Link
              to="/i-found-something"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition border border-slate-700 flex items-center space-x-2"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>I Found Something</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Active AI Match Alert Card */}
      {activeMatchAlert && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl shrink-0 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                🎉 Good News! Potential Match Found
              </span>
              <h3 className="text-lg font-bold text-white leading-tight">
                Your lost '{activeMatchAlert.lost_item?.item_name}' has been matched!
              </h3>
              <p className="text-xs text-slate-300">
                AI Confidence Score: <strong className="text-amber-400">{Math.round(activeMatchAlert.confidence_score * 100)}%</strong> • Received by Lost & Found Office.
              </p>
            </div>
          </div>

          <Link
            to="/matches"
            className="w-full sm:w-auto px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-amber-600/30 flex items-center justify-center space-x-2 shrink-0"
          >
            <span>View Match Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Personal Statistics Grid */}
      {loading ? (
        <SkeletonLoader type="list" count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl transition hover:border-indigo-500/40">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Lost Reports</span>
              <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                <PackageSearch className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{stats.myLostCount}</div>
            <Link to="/lost-items" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 pt-1">
              <span>View my reports</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl transition hover:border-indigo-500/40">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Found Reports</span>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{stats.myFoundCount}</div>
            <Link to="/found-items" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 pt-1">
              <span>View my turn-ins</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl transition hover:border-indigo-500/40">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Active Matches</span>
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{stats.myMatchesCount}</div>
            <Link to="/matches" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 pt-1">
              <span>View match alerts</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Recent Lost Reports */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PackageSearch className="w-4 h-4 text-rose-400" /> My Recent Lost Reports
            </h3>
            <Link to="/lost-items" className="text-xs font-semibold text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <SkeletonLoader type="list" count={2} />
          ) : recentLost.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No lost reports"
              description="You haven't reported any lost items yet."
              actionLabel="Report Lost Item"
              actionPath="/lost-items/new"
            />
          ) : (
            <div className="space-y-4">
              {recentLost.map((item) => {
                const imgUrl = buildImageUrl(item.image_path);
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center space-x-4 transition hover:border-slate-700"
                  >
                    <div
                      onClick={() => imgUrl && setSelectedImage({ url: imgUrl, title: item.item_name })}
                      className={`w-14 h-14 bg-slate-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-800 ${
                        imgUrl ? 'cursor-pointer hover:opacity-80 transition' : ''
                      }`}
                    >
                      {imgUrl ? (
                        <img src={imgUrl} alt={item.item_name} className="w-full h-full object-cover" />
                      ) : (
                        <PackageSearch className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-bold text-white">{item.item_name}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" /> Lost near {item.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* My Recent Found Reports */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" /> My Recent Found Reports
            </h3>
            <Link to="/found-items" className="text-xs font-semibold text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <SkeletonLoader type="list" count={2} />
          ) : recentFound.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No turned-in items"
              description="You haven't registered any turned-in items yet."
              actionLabel="I Found Something"
              actionPath="/i-found-something"
            />
          ) : (
            <div className="space-y-4">
              {recentFound.map((item) => {
                const imgUrl = buildImageUrl(item.image_path);
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center space-x-4 transition hover:border-slate-700"
                  >
                    <div
                      onClick={() => imgUrl && setSelectedImage({ url: imgUrl, title: item.item_name })}
                      className={`w-14 h-14 bg-slate-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-800 ${
                        imgUrl ? 'cursor-pointer hover:opacity-80 transition' : ''
                      }`}
                    >
                      {imgUrl ? (
                        <img src={imgUrl} alt={item.item_name} className="w-full h-full object-cover" />
                      ) : (
                        <CheckSquare className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-bold text-white">{item.item_name}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" /> Found near {item.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
