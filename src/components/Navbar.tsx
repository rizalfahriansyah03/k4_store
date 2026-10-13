import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Bell, Smartphone, Monitor, Search, Store } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isMobileSimulator,
    setIsMobileSimulator,
    cartItemCount,
    setIsCartDrawerOpen,
    notifications,
    setIsNotificationOpen,
    searchQuery,
    setSearchQuery
  } = useStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-18">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('shop')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-emerald-900 transition-colors">
                K4
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-stone-900 block leading-tight">
                  K4 Store
                </span>
                <span className="text-[11px] text-stone-500 font-medium block">
                  Bahan Pokok & Sembako
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button
              onClick={() => setCurrentView('shop')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                currentView === 'shop'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Katalog Sembako
            </button>

            <button
              onClick={() => setCurrentView('tracking')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                currentView === 'tracking'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Lacak Kurir Live
            </button>

            <button
              onClick={() => setCurrentView('loyalty')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                currentView === 'loyalty'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Program K4 Poin
            </button>

            <button
              onClick={() => setCurrentView('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                currentView === 'admin'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Inventaris & Analitik
            </button>
          </nav>

          {/* Search bar on medium/large screens */}
          {currentView === 'shop' && (
            <div className="hidden lg:flex items-center relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari beras, minyak, telur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-xs rounded-xl border border-transparent focus:border-emerald-600 focus:outline-none transition-all text-stone-800 placeholder-stone-400"
              />
            </div>
          )}

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Device Simulator Toggle */}
            <button
              onClick={() => setIsMobileSimulator(!isMobileSimulator)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isMobileSimulator
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
              }`}
              title={isMobileSimulator ? 'Beralih ke tampilan web lebar' : 'Beralih ke simulator smartphone'}
            >
              {isMobileSimulator ? (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Mode Web</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Simulator HP</span>
                </>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Buka notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-all shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Keranjang</span>
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center">
                {cartItemCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
