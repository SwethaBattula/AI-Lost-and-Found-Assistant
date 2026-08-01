import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 text-center">
      <div className="space-y-6 max-w-md bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl">
        <div className="inline-flex p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl">
          <Compass className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tight text-white">404</h1>
          <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            The page you are searching for does not exist or has been moved.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition shadow-lg shadow-blue-500/25 text-sm w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
