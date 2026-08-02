import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowRight, PackageSearch, Filter, Sparkles } from 'lucide-react';
import { lostItemService } from '../../services/lostItemService';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ImageModal from '../../components/common/ImageModal';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const CATEGORIES = [
  'All',
  'Electronics',
  'Keys',
  'Wallets & Cards',
  'Clothing & Bags',
  'Documents & Books',
  'Jewelry & Accessories',
  'Others',
];

const CommunityLostItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCommunityLostItems = async () => {
      try {
        setLoading(true);
        const data = await lostItemService.getLostItems(false);
        setItems(data);
      } catch (err) {
        console.error('Failed to load community lost items:', err);
        showToast('Failed to load community lost reports.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityLostItems();
  }, []);

  const handleFoundMatchClick = (item) => {
    navigate('/found-items/new', {
      state: { prefilledLostItem: item },
    });
  };

  const buildImageUrl = (path) => {
    if (!path) return null;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const filteredItems = items.filter((item) => {
    const matchesQuery =
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Image Preview Modal */}
      <ImageModal
        isOpen={!!selectedImage}
        imageUrl={selectedImage?.url}
        title={selectedImage?.title}
        onClose={() => setSelectedImage(null)}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <PackageSearch className="w-3.5 h-3.5" />
            <span>Public Catalog</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Community Lost Items</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
            Browse all active lost item reports submitted by students across campus. If you found any of these items, click "I Found This" to report and pre-fill details!
          </p>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xl">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, locations, or descriptions..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 outline-none transition text-sm"
          />
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <SkeletonLoader type="grid" count={6} />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No lost reports found"
          description="There are currently no reported lost items matching your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const imgUrl = buildImageUrl(item.image_path);
            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition hover:border-slate-700"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md text-[11px] font-bold uppercase tracking-wider">
                      Lost Report
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      {item.category}
                    </span>
                  </div>

                  {/* Item Image Preview */}
                  <div
                    onClick={() => imgUrl && setSelectedImage({ url: imgUrl, title: item.item_name })}
                    className={`w-full h-44 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 ${
                      imgUrl ? 'cursor-pointer group relative' : ''
                    }`}
                  >
                    {imgUrl ? (
                      <>
                        <img
                          src={imgUrl}
                          alt={item.item_name}
                          className="w-full h-full object-cover transition group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                          Click to enlarge
                        </div>
                      </>
                    ) : (
                      <PackageSearch className="w-10 h-10 text-slate-700" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white leading-tight">{item.item_name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Lost near {item.location}
                    </p>
                  </div>

                  <p className="text-slate-300 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(item.date_lost).toLocaleDateString()}
                    </span>
                    <span>Reporter: {item.owner?.full_name || 'Student'}</span>
                  </div>

                  <button
                    onClick={() => handleFoundMatchClick(item)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>I Found This Item</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommunityLostItems;
