import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
  LoyaltyAccount,
  ChatMessage,
  NotificationItem,
  StoreAnalytics,
  Review
} from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

interface StoreContextType {
  // Navigation & Frame
  currentView: 'shop' | 'tracking' | 'loyalty' | 'admin' | 'orders';
  setCurrentView: (view: 'shop' | 'tracking' | 'loyalty' | 'admin' | 'orders') => void;
  isMobileSimulator: boolean;
  setIsMobileSimulator: (val: boolean) => void;
  
  // Products & Inventory
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (prod: Product | null) => void;
  restockProduct: (productId: string, amount: number) => void;
  addReview: (productId: string, rating: number, comment: string, userName: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  
  // Orders & Courier Tracking
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (
    paymentMethod: PaymentMethod,
    address: string,
    recipientName: string,
    recipientPhone: string,
    pointsUsed: number,
    notes?: string
  ) => Order;
  advanceOrderStatus: (orderId: string) => void;
  
  // Loyalty Program
  loyalty: LoyaltyAccount;
  redeemPoints: (amount: number) => boolean;
  
  // Live Chat
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  sendChatMessage: (text: string) => void;
  unreadChatCount: number;
  
  // Notifications & Push Alerts
  notifications: NotificationItem[];
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  markNotificationsAsRead: () => void;
  activePushToast: NotificationItem | null;
  dismissPushToast: () => void;
  
  // Store Analytics
  analytics: StoreAnalytics;
  
  // User Profile
  currentUser: {
    name: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
  };
  updateUserProfile: (profile: { name: string; phone: string; address: string }) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const DEFAULT_COURIER = {
  id: 'cour-01',
  name: 'Rian Pratama',
  phone: '0812-3456-7890',
  vehiclePlate: 'B 4829 KTR (Honda Beat Cargo)',
  vehicleType: 'Kurir Kilat K4 Store',
  rating: 4.9,
  progressPercent: 20
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Display Frame
  const [currentView, setCurrentView] = useState<'shop' | 'tracking' | 'loyalty' | 'admin' | 'orders'>('shop');
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(false);

  // Products state (stored in memory & sync with localStorage if available)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('k4_store_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_PRODUCTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('k4_store_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [];
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  // User Profile
  const [currentUser, setCurrentUser] = useState({
    name: 'Siti Rahmawati',
    email: 'siti.rahmawati@gmail.com',
    phone: '0812-9876-5432',
    address: 'Jl. Melati Indah No. 14, RT 03/RW 05, Kebayoran Baru, Jakarta Selatan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  });

  // Loyalty Program
  const [loyalty, setLoyalty] = useState<LoyaltyAccount>(() => {
    const saved = localStorage.getItem('k4_store_loyalty');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      points: 2450,
      tier: 'Sahabat Dapur',
      streakDays: 4,
      totalSavings: 45000,
      history: [
        { id: 'lh-1', type: 'earn', amount: 350, description: 'Belanja Sembako Mingguan', date: 'Kemarin' },
        { id: 'lh-2', type: 'redeem', amount: 500, description: 'Potongan Diskon Belanja', date: '3 hari lalu' },
        { id: 'lh-3', type: 'earn', amount: 600, description: 'Bonus Belanja Pertama', date: 'Minggu lalu' }
      ]
    };
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Selamat Datang di K4 Store!',
      message: 'Dapatkan 1 K4 Poin setiap belanja Rp 1.000 untuk ditukar voucher diskon belanja berikutnya.',
      type: 'loyalty',
      timestamp: 'Baru saja',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Peringatan Stok Menipis',
      message: 'Paket Sayuran Hijau Organik tersisa kurang dari 10 unit di gudang.',
      type: 'inventory',
      timestamp: '1 jam lalu',
      read: false
    }
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activePushToast, setActivePushToast] = useState<NotificationItem | null>(null);

  // Helper trigger push toast
  const triggerPushToast = (item: NotificationItem) => {
    setNotifications(prev => [item, ...prev]);
    setActivePushToast(item);
  };

  const dismissPushToast = () => {
    setActivePushToast(null);
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('k4_store_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    // Initial sample active order for instantaneous live tracking experience
    const sampleOrder: Order = {
      id: 'ord-sample-01',
      orderNumber: 'K4-20261011-889',
      items: [
        { product: INITIAL_PRODUCTS[0], quantity: 1 },
        { product: INITIAL_PRODUCTS[1], quantity: 1 }
      ],
      subtotal: 112500,
      deliveryFee: 10000,
      discount: 10000,
      pointsUsed: 500,
      pointsEarned: 112,
      total: 107500,
      paymentMethod: 'qris',
      paymentStatus: 'paid',
      shippingStatus: 'in_transit',
      recipientName: 'Siti Rahmawati',
      recipientPhone: '0812-9876-5432',
      shippingAddress: 'Jl. Melati Indah No. 14, RT 03/RW 05, Kebayoran Baru, Jakarta Selatan',
      notes: 'Tolong titip di pos satpam bila tidak ada orang',
      courier: {
        id: 'cour-01',
        name: 'Rian Pratama',
        phone: '0812-3456-7890',
        vehiclePlate: 'B 4829 KTR',
        vehicleType: 'Honda Beat Cargo (Box Termal)',
        rating: 4.9,
        progressPercent: 65
      },
      estimatedMinutesRemaining: 12,
      createdAt: '15 menit yang lalu',
      timeline: [
        { status: 'pending', label: 'Pesanan Diterima & Terbayar', time: '14:20 WIB', done: true },
        { status: 'processing', label: 'Diproses & Dikemas di Gudang K4', time: '14:24 WIB', done: true },
        { status: 'picked_up', label: 'Paket Diambil oleh Kurir Rian', time: '14:30 WIB', done: true },
        { status: 'in_transit', label: 'Kurir Menuju Alamat Penerima', time: '14:35 WIB', done: true },
        { status: 'delivered', label: 'Pesanan Tiba & Diterima', time: 'Perkiraan 14:48 WIB', done: false }
      ]
    };
    return [sampleOrder];
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => orders[0] || null);

  // Live Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'cm-1',
      sender: 'support',
      text: 'Halo Kak Siti! Selamat datang di K4 Care. Ada yang bisa kami bantu seputar stok sembako atau pengiriman hari ini?',
      timestamp: '14:25',
      suggestedReplies: [
        'Kapan pesanan saya sampai?',
        'Apakah beras Cianjur ready stok?',
        'Bagaimana cara pakai K4 Poin?'
      ]
    }
  ]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(1);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('k4_store_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('k4_store_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('k4_store_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('k4_store_loyalty', JSON.stringify(loyalty));
  }, [loyalty]);

  // Cart calculations
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      triggerPushToast({
        id: 'toast-' + Date.now(),
        title: 'Stok Habis',
        message: `${product.name} saat ini sedang kosong. Silakan pantau saat restock.`,
        type: 'inventory',
        timestamp: 'Baru saja',
        read: false
      });
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: newQty } : i);
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });

    triggerPushToast({
      id: 'toast-' + Date.now(),
      title: 'Ditambahkan ke Keranjang',
      message: `${quantity}x ${product.name} berhasil masuk keranjang.`,
      type: 'order',
      timestamp: 'Baru saja',
      read: false
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    const maxStock = product ? product.stock : 999;
    const finalQty = Math.min(quantity, maxStock);
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: finalQty } : i));
  };

  const clearCart = () => setCart([]);

  // Restock handler (Admin)
  const restockProduct = (productId: string, amount: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = p.stock + amount;
        return { ...p, stock: newStock };
      }
      return p;
    }));

    const prod = products.find(p => p.id === productId);
    triggerPushToast({
      id: 'toast-' + Date.now(),
      title: 'Restock Berhasil',
      message: `Berhasil menambahkan ${amount} unit ke stok ${prod?.name || 'produk'}.`,
      type: 'inventory',
      timestamp: 'Baru saja',
      read: false
    });
  };

  // Add Review
  const addReview = (productId: string, rating: number, comment: string, userName: string) => {
    const newRev: Review = {
      id: 'rev-' + Date.now(),
      productId,
      userName: userName || currentUser.name,
      rating,
      comment,
      date: 'Baru saja',
      verifiedPurchase: true
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedReviews = [newRev, ...p.reviews];
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...p,
          reviews: updatedReviews,
          rating: Number(avg.toFixed(1)),
          reviewCount: updatedReviews.length
        };
      }
      return p;
    }));

    if (selectedProductForDetail && selectedProductForDetail.id === productId) {
      setSelectedProductForDetail(prev => {
        if (!prev) return null;
        const updatedReviews = [newRev, ...prev.reviews];
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...prev,
          reviews: updatedReviews,
          rating: Number(avg.toFixed(1)),
          reviewCount: updatedReviews.length
        };
      });
    }

    triggerPushToast({
      id: 'toast-' + Date.now(),
      title: 'Ulasan Terkirim',
      message: 'Terima kasih telah berbagi ulasan produk bahan pokok kami!',
      type: 'order',
      timestamp: 'Baru saja',
      read: false
    });
  };

  // Place Order Handler with automated inventory deduction
  const placeOrder = (
    paymentMethod: PaymentMethod,
    address: string,
    recipientName: string,
    recipientPhone: string,
    pointsUsed: number,
    notes?: string
  ): Order => {
    const subtotal = cartTotal;
    const deliveryFee = subtotal >= 100000 ? 0 : 10000;
    const pointsDiscount = Math.min(pointsUsed * 10, subtotal); // 1 point = Rp 10
    const finalTotal = Math.max(0, subtotal + deliveryFee - pointsDiscount);
    const earnedPoints = Math.floor(subtotal / 1000); // 1 point per Rp 1.000

    // Deduct stock automatically
    setProducts(prev => prev.map(prod => {
      const inCart = cart.find(c => c.product.id === prod.id);
      if (inCart) {
        const remaining = Math.max(0, prod.stock - inCart.quantity);
        return { ...prod, stock: remaining };
      }
      return prod;
    }));

    // Update Loyalty account
    setLoyalty(prev => {
      const newPoints = prev.points - pointsUsed + earnedPoints;
      const historyItem = {
        id: 'lh-' + Date.now(),
        type: 'earn' as const,
        amount: earnedPoints,
        description: `Poin dari Belanja Sembako K4`,
        date: 'Baru saja'
      };
      return {
        ...prev,
        points: Math.max(0, newPoints),
        totalSavings: prev.totalSavings + pointsDiscount,
        history: [historyItem, ...prev.history]
      };
    });

    const now = new Date();
    const orderNumber = `K4-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      items: [...cart],
      subtotal,
      deliveryFee,
      discount: pointsDiscount,
      pointsUsed,
      pointsEarned: earnedPoints,
      total: finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
      shippingStatus: 'processing',
      recipientName: recipientName || currentUser.name,
      recipientPhone: recipientPhone || currentUser.phone,
      shippingAddress: address || currentUser.address,
      notes,
      courier: {
        ...DEFAULT_COURIER,
        progressPercent: 20
      },
      estimatedMinutesRemaining: 25,
      createdAt: 'Baru saja',
      timeline: [
        { status: 'pending', label: 'Pesanan Diterima & Diverifikasi', time: 'Baru saja', done: true },
        { status: 'processing', label: 'Diproses & Dikemas di Gudang', time: 'Sedang dikemas', done: true },
        { status: 'picked_up', label: 'Kurir K4 Siap Menjemput', time: 'Menunggu', done: false },
        { status: 'in_transit', label: 'Kurir Menuju Alamat', time: 'Estimasi 20 mnt', done: false },
        { status: 'delivered', label: 'Pesanan Diterima', time: 'Estimasi 30 mnt', done: false }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    setIsCartDrawerOpen(false);

    // Push notification
    triggerPushToast({
      id: 'toast-' + Date.now(),
      title: 'Pesanan Berhasil Dibuat!',
      message: `No. ${newOrder.orderNumber}. Kamu mendapatkan +${earnedPoints} K4 Poin!`,
      type: 'order',
      timestamp: 'Baru saja',
      read: false
    });

    return newOrder;
  };

  // Advance Order Status Simulator (Step Progression)
  const advanceOrderStatus = (orderId: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;

      let nextStatus: OrderStatus = ord.shippingStatus;
      let nextProgress = ord.courier.progressPercent;
      let nextMinutes = ord.estimatedMinutesRemaining;

      if (ord.shippingStatus === 'pending') {
        nextStatus = 'processing';
        nextProgress = 30;
        nextMinutes = 20;
      } else if (ord.shippingStatus === 'processing') {
        nextStatus = 'picked_up';
        nextProgress = 45;
        nextMinutes = 15;
      } else if (ord.shippingStatus === 'picked_up') {
        nextStatus = 'in_transit';
        nextProgress = 75;
        nextMinutes = 8;
      } else if (ord.shippingStatus === 'in_transit') {
        nextStatus = 'delivered';
        nextProgress = 100;
        nextMinutes = 0;
      }

      const updatedTimeline = ord.timeline.map(t => {
        if (t.status === nextStatus) return { ...t, done: true, time: 'Baru saja' };
        return t;
      });

      const updatedOrder: Order = {
        ...ord,
        shippingStatus: nextStatus,
        paymentStatus: nextStatus === 'delivered' ? 'paid' : ord.paymentStatus,
        estimatedMinutesRemaining: nextMinutes,
        courier: {
          ...ord.courier,
          progressPercent: nextProgress
        },
        timeline: updatedTimeline
      };

      if (activeOrder?.id === orderId) {
        setActiveOrder(updatedOrder);
      }

      // Notification
      const statusLabels: Record<OrderStatus, string> = {
        pending: 'Pesanan Menunggu Konfirmasi',
        processing: 'Pesanan Sedang Dikemas',
        picked_up: 'Kurir Telah Mengambil Paket',
        in_transit: 'Kurir Sedang Dalam Perjalanan ke Alamatmu',
        delivered: 'Pesanan Telah Tiba! Selamat Menikmati Bahan Pokok Segar'
      };

      triggerPushToast({
        id: 'toast-' + Date.now(),
        title: 'Update Pengiriman Pesanan',
        message: `${ord.orderNumber}: ${statusLabels[nextStatus]}`,
        type: 'order',
        timestamp: 'Baru saja',
        read: false
      });

      return updatedOrder;
    }));
  };

  const redeemPoints = (amount: number): boolean => {
    if (loyalty.points < amount) return false;
    setLoyalty(prev => ({
      ...prev,
      points: prev.points - amount,
      history: [
        {
          id: 'lh-' + Date.now(),
          type: 'redeem',
          amount,
          description: 'Penukaran Voucher Belanja',
          date: 'Baru saja'
        },
        ...prev.history
      ]
    }));
    return true;
  };

  // Chat message sending with automatic intelligent CS replies
  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: 'cm-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Intelligent auto-response from CS "K4 Care"
    setTimeout(() => {
      let reply = 'Terima kasih telah menghubungi K4 Care! Tim kami siap memastikan kebutuhan dapur Anda tiba tepat waktu dan segar.';
      const lower = text.toLowerCase();

      if (lower.includes('kapan') || lower.includes('sampai') || lower.includes('kurir') || lower.includes('lacak')) {
        reply = activeOrder
          ? `Pesanan Kak Siti (${activeOrder.orderNumber}) saat ini sedang diantar oleh kurir ${activeOrder.courier.name}. Perkiraan tiba dalam ${activeOrder.estimatedMinutesRemaining} menit lagi. Kakak bisa melihat lokasinya secara live di tab "Lacak Kurir"!`
          : 'Untuk memeriksa status pengiriman, silakan buka menu "Lacak Pesanan" untuk melihat pergerakan kurir secara real-time di peta.';
      } else if (lower.includes('beras') || lower.includes('stok') || lower.includes('ready')) {
        reply = 'Beras Pandan Wangi Cianjur super kami ready stok dengan kualitas terbaik dan kemasan vakum rapat bebas kutu. Pesan sekarang untuk dikirim hari ini juga!';
      } else if (lower.includes('poin') || lower.includes('voucher') || lower.includes('diskon')) {
        reply = 'Setiap transaksi Rp 1.000 menghasilkan 1 K4 Poin. Poin bisa langsung dipotongkan di halaman checkout saat memilih metode pembayaran untuk diskon belanja instan.';
      } else if (lower.includes('cod') || lower.includes('bayar di tempat')) {
        reply = 'K4 Store menyediakan metode pembayaran Bayar di Tempat (COD) tanpa biaya tambahan! Cukup bayar tunai kepada kurir saat barang sembako diterima.';
      }

      const csMsg: ChatMessage = {
        id: 'cm-' + (Date.now() + 1),
        sender: 'support',
        text: reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, csMsg]);
      setUnreadChatCount(prev => prev + 1);
    }, 800);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateUserProfile = (profile: { name: string; phone: string; address: string }) => {
    setCurrentUser(prev => ({ ...prev, ...profile }));
    triggerPushToast({
      id: 'toast-' + Date.now(),
      title: 'Profil Diperbarui',
      message: 'Data alamat dan kontak penerima berhasil disimpan.',
      type: 'loyalty',
      timestamp: 'Baru saja',
      read: false
    });
  };

  // Analytics derivation
  const analytics: StoreAnalytics = {
    dailyRevenue: orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 3850000),
    todayOrdersCount: orders.length + 28,
    averageOrderValue: 125000,
    totalProductsCount: products.length,
    lowStockItemsCount: products.filter(p => p.stock <= p.minStockWarning).length,
    salesByHour: [
      { hour: '07:00', revenue: 420000 },
      { hour: '09:00', revenue: 890000 },
      { hour: '11:00', revenue: 1150000 },
      { hour: '13:00', revenue: 760000 },
      { hour: '15:00', revenue: 630000 },
      { hour: '17:00', revenue: 980000 }
    ],
    categoryDistribution: [
      { category: 'Beras & Karbo', count: 48, percentage: 38 },
      { category: 'Minyak & Lemak', count: 32, percentage: 25 },
      { category: 'Telur & Protein', count: 24, percentage: 19 },
      { category: 'Sayur Segar', count: 15, percentage: 12 },
      { category: 'Bumbu Dapur', count: 8, percentage: 6 }
    ]
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        isMobileSimulator,
        setIsMobileSimulator,
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProductForDetail,
        setSelectedProductForDetail,
        restockProduct,
        addReview,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        advanceOrderStatus,
        loyalty,
        redeemPoints,
        chatMessages,
        isChatOpen,
        setIsChatOpen,
        sendChatMessage,
        unreadChatCount,
        notifications,
        isNotificationOpen,
        setIsNotificationOpen,
        markNotificationsAsRead,
        activePushToast,
        dismissPushToast,
        analytics,
        currentUser,
        updateUserProfile
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
