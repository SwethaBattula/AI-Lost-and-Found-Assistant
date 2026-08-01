import React, { useState, useEffect } from 'react';
import { CheckSquare, CheckCircle2, MapPin, User, Image as ImageIcon, Sparkles } from 'lucide-react';
import { adminService } from '../../services/adminService';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCollections();
      setCollections(data);
    } catch (err) {
      console.error('Failed to fetch collections:', err);
      showToast('Failed to load collections list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleMarkCollected = async (matchId) => {
    try {
      await adminService.collectMatch(matchId);
      showToast('Item marked as Collected! Owner notified.', 'success');
      fetchCollections();
    } catch (err) {
      console.error('Failed to mark collected:', err);
      showToast('Failed to update status to Collected.', 'error');
    }
  };

  const buildImageUrl = (path) => {
    if (!path) return null;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Collection Management</h2>
          <p className="text-slate-400 text-sm">Handover office queue for items verified and ready for student pickup</p>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader type="list" count={3} />
      ) : collections.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No items awaiting collection"
          description="There are currently no approved matches waiting for physical collection."
        />
      ) : (
        <div className="space-y-6">
          {collections.map((match) => {
            const lost = match.lost_item;
            const found = match.found_item;
            const lostImg = buildImageUrl(lost?.image_path);
            const foundImg = buildImageUrl(found?.image_path);

            return (
              <div
                key={match.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-2xl space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-700/50">
                  <div className="space-y-1">
                    <span className="px-3.5 py-1 text-xs font-bold rounded-xl uppercase tracking-wider border bg-emerald-500/20 text-emerald-300 border-emerald-500/30 inline-block">
                      Ready For Collection
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {lost?.item_name} <span className="text-slate-400 font-normal">matched with</span> {found?.item_name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleMarkCollected(match.id)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-500/25 flex items-center space-x-2 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Collected</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-rose-400 uppercase tracking-wider">Owner (Claimant)</span>
                      <span className="text-slate-400"><User className="w-3 h-3 inline mr-1" />{lost?.owner?.full_name}</span>
                    </div>
                    <p><strong>Item:</strong> {lost?.item_name}</p>
                    <p><strong>Contact Email:</strong> {lost?.owner?.email}</p>
                    <p><strong>Lost Location:</strong> {lost?.location}</p>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-400 uppercase tracking-wider">Finder (Turned In)</span>
                      <span className="text-slate-400"><User className="w-3 h-3 inline mr-1" />{found?.finder?.full_name}</span>
                    </div>
                    <p><strong>Item:</strong> {found?.item_name}</p>
                    <p><strong>Contact Email:</strong> {found?.finder?.email}</p>
                    <p><strong>Found Location:</strong> {found?.location}</p>
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

export default AdminCollections;
