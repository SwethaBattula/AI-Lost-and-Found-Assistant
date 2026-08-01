import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, X, Filter, CheckCircle2, Image as ImageIcon, Eye } from 'lucide-react';
import { lostItemService } from '../../services/lostItemService';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const CATEGORIES = [
  'All Categories',
  'Wallets & Cards',
  'Electronics & Phones',
  'Keys & Badges',
  'Bags & Luggage',
  'Jewelry & Watches',
  'Clothing & Eyewear',
  'Documents & ID',
  'Other',
];

const CommunityLostItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [locationQuery, setLocationQuery] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunityLostItems = async () => {
      try {
        setLoading(true);
        // my_items_only = false to get all public community lost item reports
        const data = await lostItemService.getLostItems(false);
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch community lost items:', err);
        showToast('Failed to load community lost items.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityLostItems();
  }, []);

  const handleClaimOrReportFound = (item) => {
    // Navigate to Report Found Item page with pre-filled state
    navigate('/found-items/new', { state: { prefilledLostItem: item } });
  };

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    const locQuery = locationQuery.toLowerCase();

    const matchesSearch =
      item.item_name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === 'All Categories' || item.category === selectedCategory;

    const matchesLocation =
      !locQuery || item.location.toLowerCase().includes(locQuery);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Community Lost Items</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Browse lost items reported by community members. If you found one of these items, click "I Found This Item" to connect!
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-11 pr-10 py-3 text-white placeholder-slate-500 outline-none transition text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-11 pr-4 py-3 text-white outline-none transition text-sm appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="relative">
            <MapPin className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Filter by location (e.g., Library)..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-11 pr-10 py-3 text-white placeholder-slate-500 outline-none transition text-sm"
            />
            {locationQuery && (
              <button
                onClick={() => setLocationQuery('')}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <SkeletonLoader type="card" count={6} />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Community Lost Items Found"
          description={
            searchQuery || selectedCategory !== 'All Categories' || locationQuery
              ? 'No items matched your current search filters. Try clearing filters.'
              : 'No community lost items have been reported yet.'
          }
          actionText={
            searchQuery || selectedCategory !== 'All Categories' || locationQuery
              ? 'Reset Filters'
              : null
          }
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All Categories');
            setLocationQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const rawImg = item.image_path;
            const fullImgUrl = rawImg
              ? `${API_BASE_URL}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`
              : null;

            const dateStr = item.date_lost
              ? new Date(item.date_lost).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Unknown';

            return (
              <div
                key={item.id}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden hover:border-slate-600 transition flex flex-col justify-between shadow-xl group"
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative w-full h-48 bg-slate-950 flex items-center justify-center overflow-hidden">
                    {fullImgUrl ? (
                      <img
                        src={fullImgUrl}
                        alt={item.item_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300 cursor-pointer"
                        onClick={() => setPreviewImage({ url: fullImgUrl, title: item.item_name })}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-600 space-y-1">
                        <ImageIcon className="w-10 h-10" />
                        <span className="text-xs">No image uploaded</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                      Lost Item
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-white line-clamp-1">
                        {item.item_name}
                      </h3>
                      <span className="text-xs bg-slate-700/60 text-slate-300 px-2.5 py-1 rounded-md shrink-0 border border-slate-600/40">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="space-y-1.5 pt-2 text-xs text-slate-300">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Lost on: {dateStr}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-900/80 border-t border-slate-700/40 flex items-center justify-between">
                  {fullImgUrl ? (
                    <button
                      onClick={() => setPreviewImage({ url: fullImgUrl, title: item.item_name })}
                      className="text-xs text-slate-400 hover:text-blue-400 transition flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Photo</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">Public Entry</span>
                  )}

                  <button
                    onClick={() => handleClaimOrReportFound(item)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition text-xs shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>I Found This Item</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-2">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full transition border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[80vh] flex items-center justify-center overflow-hidden rounded-xl">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 text-center">
              <h4 className="text-white font-medium text-lg">{previewImage.title}</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityLostItems;
