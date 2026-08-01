import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import ItemForm from '../../components/common/ItemForm';
import { foundItemService } from '../../services/foundItemService';
import { useToast } from '../../context/ToastContext';

const ReportFoundItem = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await foundItemService.createFoundItem(formData);
      showToast('Found item reported successfully! AI matching triggered.', 'success');
      navigate('/found-items');
    } catch (err) {
      console.error('Failed to report found item:', err);
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
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Report Found Item</h2>
            <p className="text-xs text-slate-400">Help return lost belongings to their rightful owners</p>
          </div>
        </div>

        <ItemForm
          type="found"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/found-items')}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ReportFoundItem;
