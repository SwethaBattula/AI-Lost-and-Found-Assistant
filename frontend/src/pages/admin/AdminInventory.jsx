import React, { useState, useEffect } from 'react';
import { Package, MapPin, User, Calendar, CheckCircle2, Building2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await adminService.getInventory();
      setInventory(data);
    } catch (err) {
      console.error('Failed to fetch office inventory:', err);
      showToast('Failed to load office physical inventory list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const buildImageUrl = (path) => {
    if (!path) return null;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const getStatusBadge = (item) => {
    if (item.status === 'item_received') {
      return (
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold uppercase tracking-wider">
          Item Received at Office
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold uppercase tracking-wider">
        Registered Found Report
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Items Currently in Office</h2>
          <p className="text-slate-400 text-sm">Physical item inventory managed by the Lost & Found Office</p>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader type="list" count={3} />
      ) : inventory.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No items in office inventory"
          description="There are currently no items turned in at the Lost & Found Office."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inventory.map((item) => {
            const imgUrl = buildImageUrl(item.image_path);
            return (
              <div
                key={item.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    {getStatusBadge(item)}
                    <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-slate-950 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-800">
                      {imgUrl ? (
                        <img src={imgUrl} alt={item.item_name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">{item.item_name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" /> Turned in from: {item.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" /> Finder: <strong className="text-slate-200">{item.finder?.full_name || 'Student'}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
