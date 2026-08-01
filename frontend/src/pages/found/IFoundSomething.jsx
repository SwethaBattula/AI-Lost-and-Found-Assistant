import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Sparkles, ArrowRight, Compass, Info } from 'lucide-react';

const IFoundSomething = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">I Found Something</h2>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Thank you for helping return a lost item to its owner! What would you like to do?
        </p>
      </div>

      {/* User Guidance Tip Box */}
      <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 rounded-2xl p-5 flex items-start space-x-4 shadow-xl">
        <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-sm">
          <h4 className="font-bold text-blue-300">Tip for Finders:</h4>
          <p className="text-slate-300 leading-relaxed">
            If someone has already reported this item as lost, search the <strong>Community Lost Items</strong> first.
            Linking your report directly improves AI matching accuracy and helps return the item faster.
          </p>
        </div>
      </div>

      {/* Primary Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: Search Community Lost Items (Recommended) */}
        <div
          onClick={() => navigate('/community-lost-items')}
          className="bg-slate-800/80 border-2 border-blue-500/50 hover:border-blue-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition duration-200 cursor-pointer shadow-2xl group relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Recommended
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl w-fit group-hover:scale-110 transition">
              <Search className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition">
                Search Lost Item Reports
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Browse through community lost item reports. If you find a matching report, click <strong>"I Found This Item"</strong> to automatically pre-fill your report!
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-blue-400 font-semibold text-sm group-hover:translate-x-1 transition">
            <span>Search Community Reports</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Option 2: Create Independent Found Report */}
        <div
          onClick={() => navigate('/found-items/new')}
          className="bg-slate-800/60 border border-slate-700/60 hover:border-slate-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition duration-200 cursor-pointer shadow-xl group"
        >
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl w-fit group-hover:scale-110 transition">
              <PlusCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition">
                Create Independent Found Report
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The item is not listed in community reports. Submit a brand-new Found Item report manually and let our AI engine find matches.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-slate-300 font-semibold text-sm group-hover:text-white group-hover:translate-x-1 transition">
            <span>Create Manual Report</span>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IFoundSomething;
