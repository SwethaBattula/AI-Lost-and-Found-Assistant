import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = PackageSearch,
  title = 'No items found',
  description = 'There are no items to display right now.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-800/40 border border-slate-700/50 rounded-2xl my-6">
      <div className="p-4 bg-slate-800 border border-slate-700 rounded-full text-blue-400 mb-4">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 max-w-md mb-6">{description}</p>
      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition shadow-lg shadow-blue-500/20"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition shadow-lg shadow-blue-500/20"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
