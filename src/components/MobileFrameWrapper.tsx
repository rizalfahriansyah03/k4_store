import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Navigation,
  Gift,
  Boxes,
  Wifi,
  Battery,
  Signal,
  Smartphone,
  Monitor
} from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({ children }) => {
  const {
    isMobileSimulator,
    setIsMobileSimulator,
    currentView,
    setCurrentView,
    cartItemCount,
    setIsCartDrawerOpen
  } = useStore();

  if (!isMobileSimulator) {
    // Full width responsive web layout
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </main>
    );
  }

  // Smartphone simulator container
  return (
    <div className="py-6 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      {/* Top Banner Notice */}
      <div className="mb-4 flex items-center justify-between gap-4 max-w-sm w-full bg-white border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-600 shadow-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-800" />
          <span>Simulator Native App K4 Store</span>
        </div>
        <button
          onClick={() => setIsMobileSimulator(false)}
          className="text-emerald-800 font-semibold hover:underline flex items-center gap-1"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Layar Penuh</span>
        </button>
      </div>

      {/* Smartphone Hardware Frame */}
      <div className="relative w-full max-w-[390px] h-[812px] bg-stone-900 rounded-[48px] p-3 shadow-2xl ring-12 ring-stone-800/80 flex flex-col overflow-hidden">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 mr-2" />
          <div className="w-2 h-2 rounded-full bg-stone-800" />
        </div>

        {/* Screen Bezel Content */}
        <div className="relative w-full h-full bg-[#FBFBF9] rounded-[38px] overflow-hidden flex flex-col">
          {/* Mobile Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-stone-900 text-[11px] font-bold z-20 shrink-0">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-stone-800">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Scrollable Screen Body */}
          <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-none pb-20">
            {children}
          </div>

          {/* Fixed Ergonomic Bottom Tab Bar (Pattern 1 from Mobile Guidelines) */}
          <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-stone-200/80 grid grid-cols-4 items-center z-30 px-2 pb-1">
            <button
              onClick={() => setCurrentView('shop')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentView === 'shop' ? 'text-emerald-800 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">Belanja</span>
            </button>

            <button
              onClick={() => setCurrentView('tracking')}
              className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
                currentView === 'tracking' ? 'text-emerald-800 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Navigation className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">Lacak Kurir</span>
            </button>

            <button
              onClick={() => setCurrentView('loyalty')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentView === 'loyalty' ? 'text-emerald-800 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Gift className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">K4 Poin</span>
            </button>

            <button
              onClick={() => setCurrentView('admin')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentView === 'admin' ? 'text-emerald-800 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Boxes className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">Inventaris</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
