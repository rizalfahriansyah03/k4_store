import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Bell, CheckCircle2, AlertTriangle, Gift, X } from 'lucide-react';

export const PushToast: React.FC = () => {
  const { activePushToast, dismissPushToast } = useStore();

  useEffect(() => {
    if (activePushToast) {
      const timer = setTimeout(() => {
        dismissPushToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activePushToast, dismissPushToast]);

  if (!activePushToast) return null;

  const getIcon = () => {
    switch (activePushToast.type) {
      case 'order':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'inventory':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'loyalty':
        return <Gift className="w-5 h-5 text-emerald-700 shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-emerald-600 shrink-0" />;
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white/95 backdrop-blur-md border border-emerald-100 shadow-xl rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-emerald-50 rounded-xl">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-stone-900 truncate">
              {activePushToast.title}
            </h4>
            <span className="text-[11px] text-stone-400 whitespace-nowrap">
              {activePushToast.timestamp}
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            {activePushToast.message}
          </p>
        </div>
        <button
          onClick={dismissPushToast}
          className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const NotificationModal: React.FC = () => {
  const {
    notifications,
    isNotificationOpen,
    setIsNotificationOpen,
    markNotificationsAsRead
  } = useStore();

  if (!isNotificationOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/30 backdrop-blur-xs">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden mt-12 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-700" />
            <h3 className="font-semibold text-stone-900 text-sm">Notifikasi Pesanan & Stok</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markNotificationsAsRead}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-medium px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
            >
              Tandai Dibaca
            </button>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto divide-y divide-stone-100">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              Belum ada notifikasi baru.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 transition-colors ${
                  notif.read ? 'bg-white' : 'bg-emerald-50/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="font-medium text-stone-900">{notif.title}</span>
                  <span className="text-[11px] text-stone-400">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
