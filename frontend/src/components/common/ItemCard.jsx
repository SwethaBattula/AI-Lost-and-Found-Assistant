import React, { useState } from 'react';
import { MapPin, Calendar, Edit3, Trash2, Eye, Image as ImageIcon, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const ItemCard = ({
  item,
  type = 'lost', // 'lost' or 'found'
  isOwner = false,
  onEdit,
  onDelete,
}) => {
  const [showImageModal, setShowImageModal] = useState(false);

  const rawImagePath = item.image_path;
  const fullImageUrl = rawImagePath
    ? `${API_BASE_URL}${rawImagePath.startsWith('/') ? '' : '/'}${rawImagePath}`
    : null;

  const dateStr = item.date_lost || item.date_found;
  const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'Unknown date';

  return (
    <>
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden hover:border-slate-600 transition group flex flex-col justify-between shadow-xl">
        <div>
          {/* Card Image Banner */}
          <div className="relative w-full h-48 bg-slate-950 overflow-hidden flex items-center justify-center">
            {fullImageUrl ? (
              <img
                src={fullImageUrl}
                alt={item.item_name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300 cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-600 space-y-1">
                <ImageIcon className="w-10 h-10" />
                <span className="text-xs">No image provided</span>
              </div>
            )}
            <span
              className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                type === 'lost'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {type === 'lost' ? 'Lost Item' : 'Found Item'}
            </span>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-white leading-snug line-clamp-1">
                {item.item_name}
              </h3>
              <span className="text-xs bg-slate-700/60 text-slate-300 px-2.5 py-1 rounded-md shrink-0 border border-slate-600/40">
                {item.category}
              </span>
            </div>

            <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
              {item.description}
            </p>

            <div className="space-y-1.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{type === 'lost' ? 'Lost on' : 'Found on'}: {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-700/40 flex items-center justify-between">
          <button
            onClick={() => setShowImageModal(true)}
            disabled={!fullImageUrl}
            className="text-xs text-slate-400 hover:text-blue-400 transition flex items-center space-x-1.5 disabled:opacity-40 disabled:hover:text-slate-400"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Image</span>
          </button>

          {isOwner && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition border border-slate-700"
                title="Edit item"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item)}
                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition border border-red-500/20"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && fullImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-2">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full transition border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[80vh] flex items-center justify-center overflow-hidden rounded-xl">
              <img
                src={fullImageUrl}
                alt={item.item_name}
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 text-center">
              <h4 className="text-white font-medium text-lg">{item.item_name}</h4>
              <p className="text-slate-400 text-xs mt-1">{item.category} • {item.location}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemCard;
