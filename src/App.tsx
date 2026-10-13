import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingView } from './components/OrderTrackingView';
import { LoyaltyProgramView } from './components/LoyaltyProgramView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { LiveChatWidget } from './components/LiveChatWidget';
import { PushToast, NotificationModal } from './components/PushToast';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { currentView } = useStore();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'shop':
        return (
          <>
            <HeroBanner />
            <ProductGrid />
          </>
        );
      case 'tracking':
        return <OrderTrackingView />;
      case 'loyalty':
        return <LoyaltyProgramView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return (
          <>
            <HeroBanner />
            <ProductGrid />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-stone-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <div className="flex-1">
        <MobileFrameWrapper>
          {renderCurrentView()}
        </MobileFrameWrapper>
      </div>

      <Footer />

      {/* Overlays & Interactive Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <NotificationModal />
      <PushToast />
      <LiveChatWidget />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
