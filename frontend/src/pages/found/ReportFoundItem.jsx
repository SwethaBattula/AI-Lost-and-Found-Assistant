import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckSquare, Search, Sparkles, CheckCircle2, ArrowRight, X, AlertCircle } from 'lucide-react';
import ItemForm from '../../components/common/ItemForm';
import { foundItemService } from '../../services/foundItemService';
import { lostItemService } from '../../services/lostItemService';
import { useToast } from '../../context/ToastContext';

const ReportFoundItem = () => {
  const [loading, setLoading] = useState(false);
  const [showCommunityLookup, setShowCommunityLookup] = useState(false);
  const [communityItems, setCommunityItems] = useState([]);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [selectedLostItem, setSelectedLostItem] = useState(null);

  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if a lost item was passed via navigation state (e.g. from CommunityLostItems page)
  useEffect(() => {
    if (location.state?.prefilledLostItem) {
      setSelectedLostItem(location.state.prefilledLostItem);
      showToast(
        `Pre-filled details from lost report: "${location.state.prefilledLostItem.item_name}".`,
        'info'
      );
    }
  }, [location.state]);

  // Fetch community lost items when lookup modal is opened
  const handleOpenLookup = async () => {
    setShowCommunityLookup(true);
    if (communityItems.length === 0) {
      try {
        setLookupLoading(true);
        const data = await lostItemService.getLostItems(false);
        setCommunityItems(data);
      } catch (err) {
        console.error('Failed to load lost items for lookup:', err);
      } finally {
        setLookupLoading(false);
      }
    }
  };

  const handleSelectLostItem = (item) => {
    setSelectedLostItem(item);
    setShowCommunityLookup(false);
    showToast(`Selected "${item.item_name}". Form pre-filled.`, 'success');
  };

  const clearSelectedLostItem = () => {
    setSelectedLostItem(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await foundItemService.createFoundItem(formData);
      showToast('Found item reported successfully! AI matching sweep triggered.', 'success');
      navigate('/found-items');
    } catch (err) {
      console.error('Failed to report found item:', err);
      const msg = err.response?.data?.detail || 'Failed to submit report. Please try again.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredCommunity = communityItems.filter((item) => {
    const q = lookupQuery.toLowerCase();
    return (
      item.item_name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  const initialFormValues = selectedLostItem
    ? {
        item_name: selectedLostItem.item_name,
        category: selectedLostItem.category,
        description: `Found item matching lost report: ${selectedLostItem.description}`,
        location: selectedLostItem.location,
        date_found: new Date().toISOString(),
      }
    : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Optional Assistant Section */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Did you find an item already reported as lost?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Search community lost items to pre-fill information and link your found report directly!
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenLookup}
            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold transition shrink-0 flex items-center space-x-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Lost Reports</span>
          </button>
        </div>

        {/* Selected Lost Item Banner */}
        {selectedLostItem && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-300">
                  Pre-filled from: <span className="underline">{selectedLostItem.item_name}</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Category: {selectedLostItem.category} • Location: {selectedLostItem.location}
                </p>
              </div>
            </div>
            <button
              onClick={clearSelectedLostItem}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Report Form Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Report Found Item</h2>
            <p className="text-xs text-slate-400">
              Provide details and photos of the item you found
            </p>
          </div>
        </div>

        <ItemForm
          key={selectedLostItem ? selectedLostItem.id : 'new-form'}
          initialValues={initialFormValues}
          type="found"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/found-items')}
          loading={loading}
        />
      </div>

      {/* Community Lookup Modal */}
      {showCommunityLookup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Select Lost Item to Pre-fill</h3>
              <button
                onClick={() => setShowCommunityLookup(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="Search lost items by title, category, location..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-500 outline-none transition text-sm"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {lookupLoading ? (
                <p className="text-sm text-slate-400 text-center py-8">Loading community lost items...</p>
              ) : filteredCommunity.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No matching lost items found.</p>
              ) : (
                filteredCommunity.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-800/60 border border-slate-700/60 hover:border-blue-500 rounded-2xl flex items-center justify-between transition group"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                        {item.item_name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {item.category} • Lost near {item.location}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelectLostItem(item)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition flex items-center space-x-1"
                    >
                      <span>Select</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportFoundItem;
