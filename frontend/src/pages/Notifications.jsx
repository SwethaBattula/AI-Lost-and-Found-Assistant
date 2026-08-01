import React, { useState, useEffect } from 'react';
import { Bell, Mail, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        showToast('Failed to load notification history.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Notifications</h2>
        <p className="text-slate-400 text-sm">System notifications and match alert email logs</p>
      </div>

      {loading ? (
        <SkeletonLoader type="list" count={3} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="When a potential match for your item is found, email notifications and alerts will appear here."
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => {
            const match = notif.match;
            const lostName = match?.lost_item?.item_name || 'Lost Item';
            const foundName = match?.found_item?.item_name || 'Found Item';

            return (
              <div
                key={notif.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 flex items-start space-x-4 shadow-xl"
              >
                <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-semibold text-white">
                      Potential Match Notification Alert
                    </h4>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(notif.sent_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Match evaluated between <strong className="text-white">"{lostName}"</strong> and <strong className="text-white">"{foundName}"</strong> with confidence score <strong className="text-amber-400">{Math.round((match?.confidence_score || 0) * 100)}%</strong>.
                  </p>

                  <div className="pt-2 flex items-center space-x-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Email Sent Successfully
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
