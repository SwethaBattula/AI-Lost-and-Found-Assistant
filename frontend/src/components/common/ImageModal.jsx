import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

const ImageModal = ({ isOpen, imageUrl, title, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl space-y-4 p-4 relative"
      >
        <div className="flex justify-between items-center px-2 pt-1 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
            <ZoomIn className="w-4 h-4" />
            <span className="text-white">{title || 'Image Preview'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full max-h-[75vh] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
          <img
            src={imageUrl}
            alt={title || 'Enlarged Preview'}
            className="max-w-full max-h-[75vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
