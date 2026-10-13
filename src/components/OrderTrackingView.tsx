import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  Package,
  Store,
  Navigation,
  ChevronRight,
  Sparkles,
  Play
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const {
    activeOrder,
    orders,
    setActiveOrder,
    advanceOrderStatus,
    setIsChatOpen,
    setCurrentView
  } = useStore();

  if (!activeOrder && orders.length === 0) {
    return (
      <div className="py-16 text-center space-y-4">
        <Package className="w-12 h-12 text-stone-300 mx-auto" />
        <h3 className="text-base font-bold text-stone-800">
          Belum Ada Pesanan yang Dilacak
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Silakan pesan bahan pokok di katalog terlebih dahulu untuk melihat fitur pelacakan kurir real-time.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
        >
          Belanja Sembako Sekarang
        </button>
      </div>
    );
  }

  const order = activeOrder || orders[0];
  const progressPercent = order.courier.progressPercent;

  // Calculate coordinates along smooth SVG road trajectory
  // Road goes from (80, 240) -> (160, 180) -> (260, 210) -> (380, 120) -> (480, 140) -> (560, 80)
  const getBikeCoords = (pct: number) => {
    const t = pct / 100;
    // Cubic bezier interpolation approximation
    const startX = 80;
    const startY = 240;
    const cp1X = 220;
    const cp1Y = 220;
    const cp2X = 360;
    const cp2Y = 100;
    const endX = 540;
    const endY = 80;

    const x = Math.round(
      Math.pow(1 - t, 3) * startX +
      3 * Math.pow(1 - t, 2) * t * cp1X +
      3 * (1 - t) * Math.pow(t, 2) * cp2X +
      Math.pow(t, 3) * endX
    );

    const y = Math.round(
      Math.pow(1 - t, 3) * startY +
      3 * Math.pow(1 - t, 2) * t * cp1Y +
      3 * (1 - t) * Math.pow(t, 2) * cp2Y +
      Math.pow(t, 3) * endY
    );

    return { x, y };
  };

  const bikePos = getBikeCoords(progressPercent);

  const formatRupiah = (num: number) => 'Rp ' + num.toLocaleString('id-ID');

  const getStatusBadge = () => {
    switch (order.shippingStatus) {
      case 'pending':
        return { text: 'Menunggu Konfirmasi', color: 'bg-amber-100 text-amber-800' };
      case 'processing':
        return { text: 'Sedang Dikemas di Gudang', color: 'bg-blue-100 text-blue-800' };
      case 'picked_up':
        return { text: 'Kurir Menjemput Paket', color: 'bg-indigo-100 text-indigo-800' };
      case 'in_transit':
        return { text: 'Sedang Diantar ke Rumah', color: 'bg-emerald-100 text-emerald-800' };
      case 'delivered':
        return { text: 'Pesanan Selesai / Tiba', color: 'bg-emerald-800 text-white' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="space-y-6 pt-4">
      {/* Header & Order Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Pelacakan Pengiriman Kurir Real-Time
            </h2>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${statusBadge.color}`}>
              {statusBadge.text}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            No. Pesanan: <strong className="text-stone-700">{order.orderNumber}</strong> · Dibuat {order.createdAt}
          </p>
        </div>

        {/* Order switcher if multiple orders */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-stone-500 shrink-0">Pilih Pesanan:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveOrder(o)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  order.id === o.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
                }`}
              >
                {o.orderNumber.split('-')[2] || o.orderNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Map + Delivery Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live SVG Map Viewport (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-[#E8EDE9] rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm aspect-16/10 sm:aspect-16/9 flex flex-col justify-between">
            {/* Interactive Simulated Vector Map */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 620 320"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Map Background Blocks / Land Parcels */}
              <rect width="620" height="320" fill="#E8ECE9" />
              
              {/* City Parks / Green zones */}
              <path d="M 20 20 Q 90 10 120 70 T 30 140 Z" fill="#D3E2D5" />
              <path d="M 320 230 Q 380 200 450 250 T 400 310 Z" fill="#D3E2D5" />
              <path d="M 460 20 Q 520 10 590 60 T 510 110 Z" fill="#D3E2D5" />
              <path d="M 180 20 Q 230 40 220 90 T 150 70 Z" fill="#D3E2D5" />

              {/* River / Canal */}
              <path
                d="M -10 100 Q 140 120 240 180 T 630 260"
                fill="none"
                stroke="#C6D8D5"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* City Street Grid Lines */}
              <path d="M 0 60 L 620 60" stroke="#FFFFFF" strokeWidth="6" />
              <path d="M 0 160 L 620 160" stroke="#FFFFFF" strokeWidth="6" />
              <path d="M 0 260 L 620 260" stroke="#FFFFFF" strokeWidth="5" />
              <path d="M 120 0 L 120 320" stroke="#FFFFFF" strokeWidth="5" />
              <path d="M 260 0 L 260 320" stroke="#FFFFFF" strokeWidth="6" />
              <path d="M 420 0 L 420 320" stroke="#FFFFFF" strokeWidth="6" />
              <path d="M 540 0 L 540 320" stroke="#FFFFFF" strokeWidth="5" />

              {/* Delivery Route Path */}
              <path
                d="M 80 240 C 180 230, 240 210, 320 170 S 440 100, 540 80"
                fill="none"
                stroke="#A7D0BD"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 80 240 C 180 230, 240 210, 320 170 S 440 100, 540 80"
                fill="none"
                stroke="#2E6F56"
                strokeWidth="4"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />

              {/* Origin Marker (Gudang K4 Store) */}
              <g transform="translate(80, 240)">
                <circle r="18" fill="#FFFFFF" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" />
                <circle r="12" fill="#2E6F56" />
                {/* Store Icon */}
                <path d="M -6 -3 L 6 -3 L 7 2 L -7 2 Z" fill="#FFFFFF" />
                <rect x="-6" y="2" width="12" height="5" fill="#FFFFFF" opacity="0.9" />
              </g>

              {/* Destination Marker (Rumah Penerima) */}
              <g transform="translate(540, 80)">
                <circle r="18" fill="#FFFFFF" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" />
                <circle r="12" fill="#E07A5F" />
                {/* House Icon */}
                <path d="M 0 -7 L 7 0 L 5 0 L 5 6 L -5 6 L -5 0 L -7 0 Z" fill="#FFFFFF" />
              </g>

              {/* Dynamic Live Courier Vehicle Marker */}
              <g
                transform={`translate(${bikePos.x}, ${bikePos.y})`}
                className="transition-all duration-700 ease-out"
              >
                {/* Radar pulse effect */}
                <circle r="22" fill="#2E6F56" opacity="0.2">
                  <animate attributeName="r" values="16;28;16" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="16" fill="#1F2923" stroke="#FFFFFF" strokeWidth="2.5" />
                {/* Delivery Bike Icon representation */}
                <circle cx="-5" cy="4" r="3" fill="#FFFFFF" />
                <circle cx="5" cy="4" r="3" fill="#FFFFFF" />
                <path d="M -5 4 L 0 0 L 5 4 M 0 0 L 0 -4 L 3 -4" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
              </g>
            </svg>

            {/* Floating Live Overlay Badges */}
            <div className="relative z-10 p-4 flex items-center justify-between">
              <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-sm border border-stone-200/80 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                    GPS Pelacak Kurir K4
                  </span>
                  <span className="text-xs font-bold text-stone-900 block">
                    {order.shippingStatus === 'delivered' ? 'Telah Tiba di Tujuan' : `${order.estimatedMinutesRemaining} Menit Lagi Tiba`}
                  </span>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xs border border-stone-200/80 text-xs font-bold text-stone-800">
                Jarak: {order.shippingStatus === 'delivered' ? '0 km' : `${((100 - progressPercent) * 0.035).toFixed(1)} km`}
              </div>
            </div>

            {/* Bottom Map Card Info */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-stone-950/40 via-stone-950/20 to-transparent">
              <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-md border border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                    {order.courier.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">
                      {order.courier.name}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      {order.courier.vehiclePlate} · Rating {order.courier.rating} ★
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${order.courier.phone}`}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Telepon</span>
                  </a>
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat Toko/Kurir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Simulation Controller for Reviewers */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Simulasi Pengujian:</strong> Percepat tahapan pengiriman kurir untuk melihat animasi pergerakan rute peta.
              </span>
            </div>
            <button
              onClick={() => advanceOrderStatus(order.id)}
              disabled={order.shippingStatus === 'delivered'}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 disabled:bg-stone-200 disabled:text-stone-400 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Lanjutkan Status Kurir</span>
            </button>
          </div>
        </div>

        {/* Right Column: 5-Stage Timeline & Order Summary */}
        <div className="space-y-6">
          {/* 5-Stage Shipment Timeline */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">
              Status Perjalanan Paket Sembako
            </h3>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {order.timeline.map((step, idx) => {
                return (
                  <div key={idx} className="relative flex items-start gap-3.5 pl-0.5">
                    <div
                      className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        step.done
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-100 text-stone-400 border border-stone-300'
                      }`}
                    >
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <h5 className={`text-xs font-semibold ${step.done ? 'text-stone-900' : 'text-stone-400'}`}>
                          {step.label}
                        </h5>
                        <span className="text-[10px] text-stone-400 whitespace-nowrap">
                          {step.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address & Order Items Summary */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-stone-900">
              Alamat Pengiriman
            </h4>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="font-semibold text-stone-900 block">
                {order.recipientName} ({order.recipientPhone})
              </span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                {order.shippingAddress}
              </p>
              {order.notes && (
                <p className="text-emerald-800 text-[11px] pt-1">
                  Catatan: {order.notes}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-2">
              <h5 className="font-semibold text-stone-900">Daftar Bahan Pokok:</h5>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {order.items.map((it) => (
                  <div key={it.product.id} className="flex justify-between text-stone-600">
                    <span className="truncate pr-2">{it.quantity}x {it.product.name}</span>
                    <span className="font-medium text-stone-900 tabular-nums">
                      {formatRupiah(it.product.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                <span>Total Dibayar:</span>
                <span className="text-emerald-800 text-sm tabular-nums">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
