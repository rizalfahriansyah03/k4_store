import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import {
  X,
  MapPin,
  QrCode,
  CreditCard,
  Wallet,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Gift,
  Coins
} from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const {
    cart,
    cartTotal,
    currentUser,
    loyalty,
    placeOrder,
    setCurrentView
  } = useStore();

  const [recipientName, setRecipientName] = useState(currentUser.name);
  const [recipientPhone, setRecipientPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [notes, setNotes] = useState('Mohon pastikan sayuran dan telur dalam wadah aman');

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qris');
  const [pointsToUse, setPointsToUse] = useState<number>(0);
  const [copiedVA, setCopiedVA] = useState(false);

  const deliveryFee = cartTotal >= 100000 ? 0 : 10000;
  const maxRedeemablePoints = Math.min(loyalty.points, Math.floor(cartTotal / 10));
  const pointsDiscount = pointsToUse * 10;
  const grandTotal = Math.max(0, cartTotal + deliveryFee - pointsDiscount);
  const estimatedEarnedPoints = Math.floor(cartTotal / 1000);

  const formatRupiah = (num: number) => 'Rp ' + num.toLocaleString('id-ID');

  const handleCopyVA = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleConfirmOrder = () => {
    placeOrder(
      selectedMethod,
      address,
      recipientName,
      recipientPhone,
      pointsToUse,
      notes
    );
    onClose();
    setCurrentView('tracking');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">
              Checkout & Pembayaran Aman
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            aria-label="Tutup checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Alamat Pengiriman */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-800" />
                <span>Alamat Pengiriman Sembako</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-stone-600 block mb-1">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-stone-600 block mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-stone-600 block mb-1">
                Alamat Lengkap & Patokan Rumah
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-stone-600 block mb-1">
                Catatan untuk Kurir (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Bel rumah di sebelah pagar hitam, atau titip satpam"
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Program K4 Poin Loyalty */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-800" />
                <span className="text-xs font-bold text-stone-900">
                  Tukar K4 Poin ({loyalty.points.toLocaleString()} Poin Tersedia)
                </span>
              </div>
              <span className="text-[11px] text-emerald-800 font-semibold">
                Hemat {formatRupiah(pointsDiscount)}
              </span>
            </div>

            <p className="text-[11px] text-stone-600">
              1 K4 Poin bernilai Rp 10 potongan belanja langsung tanpa batas minimum.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={maxRedeemablePoints}
                step="50"
                value={pointsToUse}
                onChange={(e) => setPointsToUse(Number(e.target.value))}
                className="flex-1 accent-emerald-800"
              />
              <span className="text-xs font-bold text-stone-900 min-w-[70px] text-right tabular-nums">
                {pointsToUse} Poin
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPointsToUse(0)}
                className="text-[11px] px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-600 hover:text-stone-900"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setPointsToUse(Math.min(maxRedeemablePoints, 500))}
                className="text-[11px] px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-600 hover:text-stone-900"
              >
                Gunakan 500 Poin
              </button>
              <button
                type="button"
                onClick={() => setPointsToUse(maxRedeemablePoints)}
                className="text-[11px] px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-emerald-800 font-medium"
              >
                Gunakan Maksimal
              </button>
            </div>
          </div>

          {/* Section 3: Pilihan Metode Pembayaran Aman */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Pilihan Sistem Pembayaran Aman
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* QRIS */}
              <button
                type="button"
                onClick={() => setSelectedMethod('qris')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedMethod === 'qris'
                    ? 'border-emerald-800 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-800'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <QrCode className="w-5 h-5 mb-2 text-emerald-800" />
                <div>
                  <span className="text-xs font-bold block">QRIS Instan</span>
                  <span className="text-[10px] text-stone-500 block">GoPay, OVO, BCA, Dana</span>
                </div>
              </button>

              {/* Virtual Account BCA */}
              <button
                type="button"
                onClick={() => setSelectedMethod('bca_va')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedMethod === 'bca_va'
                    ? 'border-emerald-800 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-800'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-2 text-emerald-800" />
                <div>
                  <span className="text-xs font-bold block">BCA Virtual Account</span>
                  <span className="text-[10px] text-stone-500 block">Cek Otomatis 24 Jam</span>
                </div>
              </button>

              {/* E-Wallet */}
              <button
                type="button"
                onClick={() => setSelectedMethod('gopay')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedMethod === 'gopay'
                    ? 'border-emerald-800 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-800'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <Wallet className="w-5 h-5 mb-2 text-emerald-800" />
                <div>
                  <span className="text-xs font-bold block">E-Wallet</span>
                  <span className="text-[10px] text-stone-500 block">GoPay & ShopeePay</span>
                </div>
              </button>

              {/* COD */}
              <button
                type="button"
                onClick={() => setSelectedMethod('cod')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedMethod === 'cod'
                    ? 'border-emerald-800 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-800'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <Truck className="w-5 h-5 mb-2 text-emerald-800" />
                <div>
                  <span className="text-xs font-bold block">Bayar di Tempat</span>
                  <span className="text-[10px] text-stone-500 block">COD Tunai ke Kurir</span>
                </div>
              </button>
            </div>

            {/* Payment Method Details / Instructions */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
              {selectedMethod === 'qris' && (
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  {/* Clean SVG QR code representation */}
                  <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-xs shrink-0">
                    <svg className="w-28 h-28" viewBox="0 0 100 100">
                      <rect width="100" height="100" fill="#ffffff" />
                      {/* Outer target 1 */}
                      <rect x="10" y="10" width="28" height="28" fill="#1f2923" />
                      <rect x="14" y="14" width="20" height="20" fill="#ffffff" />
                      <rect x="18" y="18" width="12" height="12" fill="#1f2923" />
                      {/* Outer target 2 */}
                      <rect x="62" y="10" width="28" height="28" fill="#1f2923" />
                      <rect x="66" y="14" width="20" height="20" fill="#ffffff" />
                      <rect x="70" y="18" width="12" height="12" fill="#1f2923" />
                      {/* Outer target 3 */}
                      <rect x="10" y="62" width="28" height="28" fill="#1f2923" />
                      <rect x="14" y="66" width="20" height="20" fill="#ffffff" />
                      <rect x="18" y="70" width="12" height="12" fill="#1f2923" />
                      {/* QR Data Pattern */}
                      <rect x="44" y="14" width="6" height="14" fill="#1f2923" />
                      <rect x="44" y="32" width="12" height="6" fill="#1f2923" />
                      <rect x="20" y="44" width="8" height="8" fill="#1f2923" />
                      <rect x="34" y="44" width="12" height="12" fill="#1f2923" />
                      <rect x="52" y="46" width="8" height="8" fill="#1f2923" />
                      <rect x="66" y="44" width="20" height="6" fill="#1f2923" />
                      <rect x="44" y="64" width="8" height="16" fill="#1f2923" />
                      <rect x="58" y="60" width="14" height="8" fill="#1f2923" />
                      <rect x="62" y="74" width="12" height="12" fill="#1f2923" />
                      <rect x="80" y="64" width="8" height="18" fill="#1f2923" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-stone-900 block">
                      Scan QRIS Menggunakan Aplikasi Bank atau E-Wallet
                    </span>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Kompatibel dengan BCA Mobile, Livin by Mandiri, GoPay, OVO, DANA, LinkAja, dan ShopeePay. Transaksi diproses otomatis secara instan.
                    </p>
                    <span className="text-[11px] text-emerald-800 font-semibold block pt-1">
                      Status: Menunggu Konfirmasi Satu Sentuhan
                    </span>
                  </div>
                </div>
              )}

              {selectedMethod === 'bca_va' && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-900 block">
                    Nomor Virtual Account BCA K4 Store
                  </span>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200">
                    <span className="font-mono text-sm font-bold text-stone-900 tracking-wider">
                      8277 0812 9876 5432
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyVA('8277081298765432')}
                      className="flex items-center gap-1 text-xs font-medium text-emerald-800 hover:text-emerald-900"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedVA ? 'Tersalin!' : 'Salin Nomor'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Batas waktu transfer: 2 jam. Verifikasi pembayaran otomatis dalam 10 detik setelah transaksi berhasil.
                  </p>
                </div>
              )}

              {selectedMethod === 'gopay' && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-stone-900 block">
                    Pembayaran Terintegrasi GoPay / E-Wallet
                  </span>
                  <p className="text-xs text-stone-500">
                    Setelah menekan tombol "Bayar Sekarang", kamu akan langsung terhubung ke aplikasi GoPay dengan saldo terpotong secara aman.
                  </p>
                </div>
              )}

              {selectedMethod === 'cod' && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-stone-900 block">
                    Bayar Tunai di Tempat (Cash on Delivery)
                  </span>
                  <p className="text-xs text-stone-500">
                    Siapkan uang pas sejumlah <strong>{formatRupiah(grandTotal)}</strong> saat kurir K4 tiba di alamat rumah. Tanpa biaya admin tambahan.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Ringkasan Biaya & Loyalty Reward */}
          <div className="border-t border-stone-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Total Pesanan ({cart.length} item sembako)</span>
              <span className="font-semibold text-stone-900 tabular-nums">{formatRupiah(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Ongkos Kirim Kilat</span>
              <span className="font-semibold text-stone-900 tabular-nums">
                {deliveryFee === 0 ? <span className="text-emerald-700">GRATIS</span> : formatRupiah(deliveryFee)}
              </span>
            </div>
            {pointsDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Potongan K4 Poin</span>
                <span className="tabular-nums">- {formatRupiah(pointsDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-200">
              <span>Total Akhir</span>
              <span className="text-base text-emerald-800 tabular-nums">{formatRupiah(grandTotal)}</span>
            </div>

            <div className="bg-emerald-50 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-emerald-900">
              <span className="flex items-center gap-1.5 font-medium">
                <Gift className="w-3.5 h-3.5 text-emerald-700" />
                <span>Poin yang akan diperoleh:</span>
              </span>
              <span className="font-bold">+{estimatedEarnedPoints} K4 Poin</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleConfirmOrder}
            className="w-full py-3.5 rounded-2xl bg-emerald-800 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-900 transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Bayar Sekarang ({formatRupiah(grandTotal)}) & Lacak Pesanan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
