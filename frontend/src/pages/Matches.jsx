import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, XCircle, Clock, MapPin, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { matchService } from '../services/matchService';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const { showToast } = useToast();

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await matchService.getMatches(0.0, statusFilter === 'all' ? null : statusFilter);
      setMatches(data);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
      showToast('Failed to load AI matches list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [statusFilter]);

  const handleTriggerMatching = async () => {
    try {
      setTriggering(true);
      const res = await matchService.triggerMatching();
      showToast(res.message || 'AI matching sweep completed successfully.', 'success');
      fetchMatches();
    } catch (err) {
      console.error('Matching sweep error:', err);
      showToast('Failed to execute AI matching sweep.', 'error');
    } finally {
      setTriggering(false);
    }
  };

  const handleUpdateStatus = async (matchId, newStatus) => {
    try {
      await matchService.updateMatchStatus(matchId, newStatus);
      showToast(`Match status updated to '${newStatus}'.`, 'success');
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('Failed to update match status.', 'error');
    }
  };

  const buildImageUrl = (path) => {
    if (!path) return null;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Sweep Trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">AI Matches</h2>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-slate-400 text-sm">Potential matches detected by semantic text and image similarity</p>
        </div>

        <button
          onClick={handleTriggerMatching}
          disabled={triggering}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center space-x-2 text-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${triggering ? 'animate-spin' : ''}`} />
          <span>{triggering ? 'Analyzing Matches...' : 'Run AI Match Sweep'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        {['all', 'pending', 'confirmed', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              statusFilter === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Matches List */}
      {loading ? (
        <SkeletonLoader type="list" count={3} />
      ) : matches.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No AI matches found"
          description="There are currently no potential matches matching your filter options."
          actionText="Run AI Match Sweep"
          onAction={handleTriggerMatching}
        />
      ) : (
        <div className="space-y-6">
          {matches.map((match) => {
            const lost = match.lost_item;
            const found = match.found_item;
            const lostImg = buildImageUrl(lost?.image_path);
            const foundImg = buildImageUrl(found?.image_path);

            return (
              <div
                key={match.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-2xl space-y-6"
              >
                {/* Header Score Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-black text-white">
                          {Math.round(match.confidence_score * 100)}%
                        </span>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                          Overall Match Score
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-400 mt-0.5">
                        <span>Text Sim: <strong className="text-slate-200">{Math.round(match.text_similarity * 100)}%</strong></span>
                        <span>Image Sim: <strong className="text-slate-200">{Math.round(match.image_similarity * 100)}%</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Status Controls */}
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl uppercase tracking-wider ${
                        match.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : match.status === 'rejected'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {match.status}
                    </span>

                    <button
                      onClick={() => handleUpdateStatus(match.id, 'confirmed')}
                      disabled={match.status === 'confirmed'}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-medium transition disabled:opacity-30"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(match.id, 'rejected')}
                      disabled={match.status === 'rejected'}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-medium transition disabled:opacity-30"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Lost Item Side */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                        Lost Item
                      </span>
                      <span className="text-xs text-slate-400">{lost?.category}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-slate-950 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-800">
                        {lostImg ? (
                          <img src={lostImg} alt={lost?.item_name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-white leading-tight">{lost?.item_name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" /> {lost?.location}
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      {lost?.description}
                    </p>
                  </div>

                  {/* Found Item Side */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        Found Item
                      </span>
                      <span className="text-xs text-slate-400">{found?.category}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-slate-950 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-800">
                        {foundImg ? (
                          <img src={foundImg} alt={found?.item_name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-white leading-tight">{found?.item_name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" /> {found?.location}
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      {found?.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Matches;
