import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((_, idx) => (
          <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-xl overflow-hidden p-4 space-y-4 animate-pulse">
            <div className="w-full h-48 bg-slate-700/50 rounded-lg"></div>
            <div className="h-5 bg-slate-700/50 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-700/40 rounded w-full"></div>
              <div className="h-3 bg-slate-700/40 rounded w-5/6"></div>
            </div>
            <div className="pt-2 flex justify-between items-center border-t border-slate-700/50">
              <div className="h-4 bg-slate-700/50 rounded w-1/3"></div>
              <div className="h-8 bg-slate-700/50 rounded-lg w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {items.map((_, idx) => (
          <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-4 w-full">
              <div className="w-12 h-12 bg-slate-700/50 rounded-lg shrink-0"></div>
              <div className="space-y-2 w-1/2">
                <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700/40 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
