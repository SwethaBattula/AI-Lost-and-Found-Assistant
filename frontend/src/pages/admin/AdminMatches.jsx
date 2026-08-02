import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, XCircle, MapPin, User, Image as ImageIcon, Eye, X, Check, Building2, PackageCheck } from 'lucide-react';
import { adminService } from '../../services/adminService';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import Timeline from '../../components/common/Timeline';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { showToast } = useToast();

  const fetchAdminMatches = async () => {
    try {
      setLoading(true);
      const data = await adminService.getMatches();
      setMatches(data);
    } catch (err) {
      console.error('Failed to fetch office matches:', err);
      showToast('Failed to load active supervision cases list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminMatches();
  }, []);

  const handleCollected = async (matchId) => {
    try {
      await adminService.markCollected(matchId);
      showToast('Item marked as Collected! Case Closed and student owner notified.', 'success');
      fetchAdminMatches();
      if (selectedMatch?.id === matchId) setSelectedMatch(null);
    } catch (err) {
      console.error('Collected error:', err);
      showToast('Failed to complete item collection.', 'error');
    }
  };

  const handleReject = async (matchId) => {
    try {
      await adminService.rejectMatch(matchId);
      showToast('Match marked as rejected (Exception Override).', 'info');
      fetchAdminMatches();
      if (selectedMatch?.id === matchId) setSelectedMatch(null);
    } catch (err) {
      console.error('Reject error:', err);
      showToast('Failed to reject match.', 'error');
    }
  };

  const buildImageUrl = (path) => {
    if (!path) return null;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending':
      case 'potential_match':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'waiting_for_pickup':
      case 'ready_for_collection':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'collected':
      case 'confirmed':
      case 'handed_over':
      case 'case_closed':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
      case 'potential_match':
        return 'Potential Match Found';
      case 'waiting_for_pickup':
      case 'ready_for_collection':
        return 'Waiting for Pickup';
      case 'collected':
      case 'confirmed':
      case 'handed_over':
      case 'case_closed':
        return 'Collected (Case Closed)';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Active Cases & Match Supervision</h2>
          <p className="text-slate-400 text-sm">Supervise case lifecycles, verify physical collections, and handle exception overrides</p>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader type="list" count={3} />
      ) : matches.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No active supervision cases"
          description="There are currently no cases in the system."
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

            return (
              <div
                key={match.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-2xl space-y-6"
              >
                {/* Header Case Details & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Case #{match.id} • Overall Match Confidence: <strong className="text-amber-400 text-base">{overallScore}%</strong>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>Text Similarity: <strong className="text-slate-200">{textScore}%</strong></span>
                        <span>Image Similarity: <strong className="text-slate-200">{imageScore}%</strong></span>
                        <span>Description Match: <strong className="text-slate-200">{descScore}%</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl uppercase tracking-wider border ${getStatusBadgeStyle(
                        match.status
                      )}`}
                    >
                      {getStatusLabel(match.status)}
                    </span>

                    <button
                      onClick={() => setSelectedMatch(match)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition flex items-center space-x-1.5"
                    >
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span>Case View</span>
                    </button>

                    <button
                      onClick={() => handleCollected(match.id)}
                      disabled={match.status === 'collected' || match.status === 'confirmed' || match.status === 'case_closed'}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 disabled:opacity-40"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Mark as Collected</span>
                    </button>

                    <button
                      onClick={() => handleReject(match.id)}
                      disabled={match.status === 'rejected'}
                      className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 disabled:opacity-40"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Lost Item */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                        Lost Report
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" /> Owner: <strong className="text-slate-200">{lost?.owner?.full_name || 'N/A'}</strong>
                      </span>
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
                  </div>

                  {/* Found Item */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        Found Report
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" /> Finder (Office View): <strong className="text-slate-200">{found?.finder?.full_name || 'N/A'}</strong>
                      </span>
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Case Details Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Case #{selectedMatch.id} Breakdown & History</h3>
              <button onClick={() => setSelectedMatch(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reusable Timeline Component */}
            <Timeline
              currentStatus={selectedMatch.status}
              timestamps={{
                lost_reported: new Date(selectedMatch.lost_item?.created_at).toLocaleString(),
                found_reported: new Date(selectedMatch.found_item?.created_at).toLocaleString(),
                item_received: new Date(selectedMatch.found_item?.created_at).toLocaleString(),
                potential_match: new Date(selectedMatch.created_at).toLocaleString(),
                owner_notified: new Date(selectedMatch.created_at).toLocaleString(),
                waiting_for_pickup: new Date(selectedMatch.created_at).toLocaleString(),
                collected: selectedMatch.status === 'collected' ? new Date().toLocaleString() : null,
                case_closed: selectedMatch.status === 'collected' ? new Date().toLocaleString() : null,
              }}
            />

            {/* AI Confidence Breakdown */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">AI Confidence Breakdown</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-[11px] text-slate-400">Overall Match</p>
                  <p className="text-lg font-black text-amber-400">{Math.round(selectedMatch.confidence_score * 100)}%</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-[11px] text-slate-400">Text Similarity</p>
                  <p className="text-lg font-bold text-white">{Math.round(selectedMatch.text_similarity * 100)}%</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-[11px] text-slate-400">Image Similarity</p>
                  <p className="text-lg font-bold text-white">{Math.round(selectedMatch.image_similarity * 100)}%</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-[11px] text-slate-400">Description Match</p>
                  <p className="text-lg font-bold text-white">{Math.round(((selectedMatch.text_similarity + selectedMatch.confidence_score) / 2) * 100)}%</p>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleReject(selectedMatch.id)}
                disabled={selectedMatch.status === 'rejected'}
                className="px-5 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition"
              >
                Reject Invalid Match
              </button>
              <button
                onClick={() => handleCollected(selectedMatch.id)}
                disabled={selectedMatch.status === 'collected' || selectedMatch.status === 'confirmed' || selectedMatch.status === 'case_closed'}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-600/20"
              >
                Mark as Collected (Close Case)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMatches;
