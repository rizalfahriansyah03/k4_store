import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart
  } = useStore();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartDrawerOpen) return null;

  const formatRupiah = (num: number) => 'Rp ' + num.toLocaleString('id-ID');
  const freeDeliveryThreshold = 100000;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartTotal);

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                Keranjang Belanja ({cart.length} item)
              </h3>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-emerald-50/70 border-b border-emerald-100/60 text-xs text-stone-700 space-y-1.5">
            {remainingForFreeDelivery === 0 ? (
              <p className="font-medium text-emerald-800 flex items-center gap-1.5">
                🎉 Selamat! Kamu mendapatkan <strong>Gratis Ongkir</strong> pengiriman sembako.
              </p>
            ) : (
              <p>
                Tambah <strong>{formatRupiah(remainingForFreeDelivery)}</strong> lagi untuk klaim <strong>Gratis Ongkir</strong>!
              </p>
            )}
            <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-700 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (cartTotal / freeDeliveryThreshold) * 100)}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <ShoppingBag className="w-12 h-12 text-stone-300" />
                <h4 className="font-semibold text-stone-800 text-sm">
                  Keranjangmu masih kosong
                </h4>
                <p className="text-xs text-stone-500 max-w-xs">
                  Yuk lengkapi kebutuhan dapur harianmu dengan bahan pokok segar dari K4 Store!
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors mt-2"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-3.5 flex items-start gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200/80 bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs text-stone-900 line-clamp-1">
                      {item.product.name}
                    </h5>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {item.product.unit}
                    </div>
                    <div className="text-xs font-bold text-stone-900 tabular-nums mt-1">
                      {formatRupiah(item.product.price * item.quantity)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                      aria-label="Hapus produk"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded text-stone-600 hover:bg-white"
                        aria-label="Kurangi kuantitas"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 rounded text-stone-600 hover:bg-white disabled:opacity-30"
                        aria-label="Tambah kuantitas"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal Belanja</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {formatRupiah(cartTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimasi Ongkir</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {cartTotal >= freeDeliveryThreshold ? (
                      <span className="text-emerald-700">GRATIS</span>
                    ) : (
                      formatRupiah(10000)
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 block">Total Pembayaran</span>
                  <span className="text-base font-extrabold text-stone-900 tabular-nums">
                    {formatRupiah(cartTotal + (cartTotal >= freeDeliveryThreshold ? 0 : 10000))}
                  </span>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                >
                  <span>Lanjut Pembayaran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isCheckoutOpen && (
        <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />
      )}
    </>
  );
};
