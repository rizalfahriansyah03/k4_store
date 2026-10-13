export type ProductCategory = 
  | 'all' 
  | 'beras' 
  | 'minyak' 
  | 'telur' 
  | 'sayur' 
  | 'bumbu' 
  | 'paket';

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  minStockWarning: number;
  image: string;
  description: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'picked_up' 
  | 'in_transit' 
  | 'delivered';

export type PaymentMethod = 
  | 'qris' 
  | 'bca_va' 
  | 'mandiri_va' 
  | 'bri_va' 
  | 'gopay' 
  | 'ovo' 
  | 'cod';

export interface Courier {
  id: string;
  name: string;
  phone: string;
  vehiclePlate: string;
  vehicleType: string;
  rating: number;
  progressPercent: number; // 0 to 100 on map route
}

export interface OrderTimelineItem {
  status: OrderStatus;
  label: string;
  time: string;
  done: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  pointsUsed: number;
  pointsEarned: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid';
  shippingStatus: OrderStatus;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  notes?: string;
  courier: Courier;
  estimatedMinutesRemaining: number;
  createdAt: string;
  timeline: OrderTimelineItem[];
}

export interface LoyaltyAccount {
  points: number;
  tier: 'Sahabat Dapur' | 'Juragan Sembako';
  streakDays: number;
  totalSavings: number;
  history: {
    id: string;
    type: 'earn' | 'redeem';
    amount: number;
    description: string;
    date: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'support' | 'system';
  text: string;
  timestamp: string;
  suggestedReplies?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'loyalty' | 'promo';
  timestamp: string;
  read: boolean;
}

export interface StoreAnalytics {
  dailyRevenue: number;
  todayOrdersCount: number;
  averageOrderValue: number;
  totalProductsCount: number;
  lowStockItemsCount: number;
  salesByHour: { hour: string; revenue: number }[];
  categoryDistribution: { category: string; count: number; percentage: number }[];
}
