import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const styles = {
    success: 'bg-slate-900 border-emerald-500/30 text-emerald-100',
    error: 'bg-slate-900 border-red-500/30 text-red-100',
    info: 'bg-slate-900 border-blue-500/30 text-blue-100',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-xl backdrop-blur-md text-sm transition-all duration-200 ${
        styles[type] || styles.info
      }`}
    >
      <div className="flex items-center space-x-3 pr-2">
        {icons[type] || icons.info}
        <span className="font-medium leading-snug">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
