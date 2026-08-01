import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, PackageSearch, X } from 'lucide-react';
import ItemCard from '../../components/common/ItemCard';
import ItemForm from '../../components/common/ItemForm';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { lostItemService } from '../../services/lostItemService';
import { useToast } from '../../context/ToastContext';

const MyLostItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit & Delete Modal States
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await lostItemService.getLostItems(true); // my_items_only = true
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch lost items:', err);
      showToast('Failed to load your lost items list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEditSubmit = async (payload) => {
    try {
      setActionLoading(true);
      await lostItemService.updateLostItem(editingItem.id, payload);
      showToast('Lost item updated successfully.', 'success');
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      console.error('Failed to update lost item:', err);
      showToast('Failed to update item details.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      await lostItemService.deleteLostItem(deletingItem.id);
      showToast('Lost item deleted successfully.', 'success');
      setDeletingItem(null);
      fetchItems();
    } catch (err) {
      console.error('Failed to delete lost item:', err);
      showToast('Failed to delete item.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.item_name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">My Lost Items</h2>
          <p className="text-slate-400 text-sm">Manage items you have reported as lost</p>
        </div>

        <Link
          to="/lost-items/new"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center space-x-2 text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Lost Item</span>
        </Link>
      </div>

      {/* Live Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, category, description, location..."
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

      {/* Content Area */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title={searchQuery ? 'No matching items found' : 'No lost items reported yet'}
          description={
            searchQuery
              ? `No items matched "${searchQuery}". Try adjusting your search keywords.`
              : 'You have not reported any lost items yet.'
          }
          actionText={searchQuery ? 'Clear Search' : 'Report Lost Item'}
          actionLink={searchQuery ? null : '/lost-items/new'}
          onAction={searchQuery ? () => setSearchQuery('') : null}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              type="lost"
              isOwner={true}
              onEdit={(target) => setEditingItem(target)}
              onDelete={(target) => setDeletingItem(target)}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Edit Lost Item</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ItemForm
              initialValues={editingItem}
              type="lost"
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingItem(null)}
              loading={actionLoading}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingItem}
        title="Delete Lost Item Report"
        message={`Are you sure you want to delete "${deletingItem?.item_name}"? This action cannot be undone.`}
        confirmText="Delete Report"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingItem(null)}
        loading={actionLoading}
      />
    </div>
  );
};

export default MyLostItems;
