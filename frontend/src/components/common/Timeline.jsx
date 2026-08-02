import React from 'react';
import { Check, Clock, PackageCheck, AlertCircle } from 'lucide-react';

const STAGES = [
  { key: 'lost_reported', label: 'Lost Reported' },
  { key: 'found_reported', label: 'Found Reported' },
  { key: 'item_received', label: 'Item Received at Office' },
  { key: 'potential_match', label: 'AI Match Found' },
  { key: 'owner_notified', label: 'Owner Notified' },
  { key: 'waiting_for_pickup', label: 'Waiting for Pickup' },
  { key: 'collected', label: 'Collected' },
  { key: 'case_closed', label: 'Case Closed' },
];

const getStageIndex = (status) => {
  switch (status) {
    case 'lost_reported':
      return 0;
    case 'found_reported':
      return 1;
    case 'item_received':
      return 2;
    case 'pending':
    case 'potential_match':
      return 4; // AI Match & Owner Notified
    case 'waiting_for_pickup':
    case 'ready_for_collection':
      return 5;
    case 'collected':
      return 6;
    case 'confirmed':
    case 'handed_over':
    case 'case_closed':
      return 7;
    case 'rejected':
    case 'cancelled':
      return -1;
    default:
      return 4;
  }
};

const Timeline = ({ currentStatus, timestamps = {} }) => {
  const activeIdx = getStageIndex(currentStatus);
  const isRejected = currentStatus === 'rejected' || currentStatus === 'cancelled';

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
      <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-400" /> Case Lifecycle Timeline
        </span>
        {isRejected ? (
          <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-md text-[11px] font-bold uppercase">
            {currentStatus}
          </span>
        ) : (
          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[11px] font-bold uppercase">
            Stage {activeIdx + 1} of {STAGES.length}
          </span>
        )}
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {STAGES.map((stage, idx) => {
          const isDone = !isRejected && activeIdx >= idx;
          const isCurrent = !isRejected && activeIdx === idx;
          const timestamp = timestamps[stage.key];

          return (
            <div key={stage.key} className="relative flex items-start justify-between group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  isCurrent
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/50 ring-4 ring-blue-600/20'
                    : isDone
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {isDone ? <Check className="w-3 h-3" /> : idx + 1}
              </div>

              {/* Stage Content */}
              <div>
                <p
                  className={`text-xs font-bold transition ${
                    isCurrent
                      ? 'text-blue-400 text-sm'
                      : isDone
                      ? 'text-slate-200'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </p>
                {timestamp && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{timestamp}</p>
                )}
              </div>

              {isCurrent && (
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                  Current
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
