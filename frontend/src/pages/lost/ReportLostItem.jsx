import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import ItemForm from '../../components/common/ItemForm';
import { lostItemService } from '../../services/lostItemService';
import { useToast } from '../../context/ToastContext';

const ReportLostItem = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await lostItemService.createLostItem(formData);
      showToast('Lost item reported successfully! AI matching triggered.', 'success');
      navigate('/lost-items');
    } catch (err) {
      console.error('Failed to report lost item:', err);
      const msg = err.response?.data?.detail || 'Failed to submit report. Please try again.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl">
            <PackageSearch className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Report Lost Item</h2>
            <p className="text-xs text-slate-400">Provide accurate details and photos to help identify matches</p>
          </div>
        </div>

        <ItemForm
          type="lost"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/lost-items')}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ReportLostItem;
