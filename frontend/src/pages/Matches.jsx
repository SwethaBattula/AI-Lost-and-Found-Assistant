import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Calendar, CheckCircle2, XCircle, Info, RefreshCw, ChevronDown, ChevronUp, PackageCheck } from 'lucide-react';
import { matchService } from '../services/matchService';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import Timeline from '../components/common/Timeline';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  const { showToast } = useToast();

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await matchService.getMatches();
      setMatches(data);
    } catch (err) {
      console.error('Failed to fetch AI matches:', err);
      showToast('Failed to load AI matches. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleTriggerSweep = async () => {
    try {
      setTriggering(true);
      const res = await matchService.triggerMatching();
      showToast(res.message || 'AI matching sweep completed successfully!', 'success');
      fetchMatches();
    } catch (err) {
      console.error('Trigger sweep failed:', err);
      showToast('Failed to execute AI matching sweep.', 'error');
    } finally {
      setTriggering(false);
    }
  };

  const buildImageUrl = (path) => {
    if (!path) return null;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const toggleExpand = (matchId) => {
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Matches</h2>
              <p className="text-xs text-slate-400">
                Automated similarity matches between reported lost and found items
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleTriggerSweep}
          disabled={triggering}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${triggering ? 'animate-spin' : ''}`} />
          <span>{triggering ? 'Scanning...' : 'Trigger AI Match Sweep'}</span>
        </button>
      </div>

      {/* Matches List */}
      {loading ? (
        <SkeletonLoader type="list" count={3} />
      ) : matches.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No AI matches found"
          description="Our multimodal AI matching engine scans regularly. As soon as a match is detected for an item turned in at the Lost & Found Office, you will be notified here."
        />
      ) : (
        <div className="space-y-6">
          {matches.map((match) => {
            const lost = match.lost_item;
            const found = match.found_item;
            const lostImg = buildImageUrl(lost?.image_path);
            const foundImg = buildImageUrl(found?.image_path);

            const overallScore = Math.round(match.confidence_score * 100);
            const textScore = Math.round(match.text_similarity * 100);
            const imageScore = Math.round(match.image_similarity * 100);
            const descScore = Math.round(((match.text_similarity + match.confidence_score) / 2) * 100);
            const isExpanded = expandedMatchId === match.id;

            return (
              <div
                key={match.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl transition hover:border-slate-700"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Overall Match Confidence: <strong className="text-amber-400 text-base">{overallScore}%</strong>
                      </span>
                      <p className="text-xs text-emerald-400 font-medium mt-0.5">
                        Received by Lost & Found Office • Ready for verification & pickup
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(match.id)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700 flex items-center space-x-1.5"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Timeline & AI Breakdown'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Match Cards Comparison (Privacy Preserved) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Your Lost Item */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                      Your Reported Lost Item
                    </span>
                    <div className="flex items-center space-x-4 pt-1">
                      <div className="w-16 h-16 bg-slate-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-800">
                        {lostImg ? (
                          <img src={lostImg} alt={lost?.item_name} className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white leading-tight">{lost?.item_name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" /> Lost at: {lost?.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Matched Found Item at Office */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      Matched Found Item (at Office)
                    </span>
                    <div className="flex items-center space-x-4 pt-1">
                      <div className="w-16 h-16 bg-slate-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-800">
                        {foundImg ? (
                          <img src={foundImg} alt={found?.item_name} className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white leading-tight">{found?.item_name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" /> Turned in from: {found?.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="space-y-6 pt-4 border-t border-slate-800 animate-in fade-in duration-200">
                    {/* Reusable Timeline */}
                    <Timeline
                      currentStatus={match.status}
                      timestamps={{
                        lost_reported: new Date(lost?.created_at).toLocaleString(),
                        found_reported: new Date(found?.created_at).toLocaleString(),
                        item_received: new Date(found?.created_at).toLocaleString(),
                        potential_match: new Date(match.created_at).toLocaleString(),
                        owner_notified: new Date(match.created_at).toLocaleString(),
                        waiting_for_pickup: new Date(match.created_at).toLocaleString(),
                        collected: match.status === 'collected' ? new Date().toLocaleString() : null,
                        case_closed: match.status === 'collected' ? new Date().toLocaleString() : null,
                      }}
                    />

                    {/* AI Confidence Breakdown */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">AI Confidence Breakdown</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <p className="text-[11px] text-slate-400">Overall Match</p>
                          <p className="text-lg font-black text-amber-400">{overallScore}%</p>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <p className="text-[11px] text-slate-400">Text Similarity</p>
                          <p className="text-lg font-bold text-white">{textScore}%</p>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <p className="text-[11px] text-slate-400">Image Similarity</p>
                          <p className="text-lg font-bold text-white">{imageScore}%</p>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <p className="text-[11px] text-slate-400">Description Match</p>
                          <p className="text-lg font-bold text-white">{descScore}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Matches;
