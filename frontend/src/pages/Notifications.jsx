import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Mail, Clock, Sparkles, CheckCircle2, AlertTriangle, Package, Check, ArrowRight } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndMarkNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotifications();
        setNotifications(data);

        // Mark all notifications as read when opening Notification Center
        const unreadExists = data.some((n) => !n.is_read);
        if (unreadExists) {
          await notificationService.markAllAsRead();
          // Update local state to show marked as read
          setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        showToast('Failed to load notification history.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAndMarkNotifications();
  }, []);

  const handleNotificationClick = (notif) => {
    navigate('/matches');
  };

  const getNotificationTypeDetails = (notif) => {
    const matchStatus = notif.match?.status || 'pending';
    const type = notif.notification_type || 'potential_match';

    if (matchStatus === 'under_review' || type === 'match_under_review') {
      return {
        badgeText: 'Pending Verification',
        badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
        title: notif.title || 'Match Under Review',
        message: notif.message || 'Your potential match is awaiting administrator verification.',
      };
    }

    if (matchStatus === 'ready_for_collection' || type === 'ready_for_collection') {
      return {
        badgeText: 'Ready For Collection',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: <Package className="w-5 h-5 text-emerald-400" />,
        title: notif.title || 'Ready For Collection',
        message: notif.message || 'Your item has been verified. Please collect it from the Lost & Found Office.',
      };
    }

    if (matchStatus === 'confirmed' || type === 'collection_completed') {
      return {
        badgeText: 'Collected',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        icon: <CheckCircle2 className="w-5 h-5 text-blue-400" />,
        title: notif.title || 'Collection Completed',
        message: notif.message || 'Your item has been marked as collected. Thank you for using AI Lost & Found.',
      };
    }

    if (matchStatus === 'rejected') {
      return {
        badgeText: 'Rejected',
        badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
        icon: <Mail className="w-5 h-5 text-red-400" />,
        title: notif.title || 'Match Rejected',
        message: notif.message || 'Potential match evaluated as not a match.',
      };
    }

    // Default: Potential Match Found (Yellow)
    return {
      badgeText: 'Potential Match',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      title: notif.title || 'Potential Match Found',
      message: notif.message || 'A potential match has been identified by our AI matching engine.',
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Notification Center</h2>
          <p className="text-slate-400 text-sm">Real-time match updates, verification alerts, and email logs</p>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader type="list" count={4} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="When a potential match for your lost or found item is identified, alerts will appear here."
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => {
            const details = getNotificationTypeDetails(notif);
            const match = notif.match;
            const confidence = match ? Math.round(match.confidence_score * 100) : 0;

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className="bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/60 rounded-2xl p-5 flex items-start space-x-4 shadow-xl transition cursor-pointer group"
              >
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
                  {details.icon}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                        {details.title}
                      </h4>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-bold rounded-md uppercase tracking-wider border ${details.badgeColor}`}
                      >
                        {details.badgeText}
                      </span>
                    </div>

                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(notif.sent_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">{details.message}</p>

                  {match && (
                    <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>
                        Lost Item: <strong className="text-white">{match.lost_item?.item_name || 'N/A'}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        AI Confidence: <strong className="text-amber-400">{confidence}%</strong>
                      </span>
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition">
                    <span className="flex items-center gap-1">
                      View Match Details <ArrowRight className="w-3.5 h-3.5" />
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
