import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <footer className="border-t border-stone-200/80 bg-white mt-16 text-xs text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                K4
              </div>
              <span className="font-bold text-stone-900 text-sm">K4 Store</span>
            </div>
            <p className="text-stone-500 leading-relaxed text-[11px]">
              Toko daring penyedia bahan pangan pokok dan sembako berkualitas untuk keluarga. Pengiriman cepat, jaminan produk segar, dan sistem pembayaran aman.
            </p>
          </div>

          {/* Nav Links */}
          <div className="space-y-2">
            <h5 className="font-bold text-stone-900 text-xs">Menu Cepat</h5>
            <ul className="space-y-1.5 text-stone-500">
              <li>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Katalog Sembako Lengkap
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('tracking')}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Pelacakan Kurir Real-Time
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('loyalty')}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Program Loyalitas K4 Poin
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Dasbor Analitik & Stok
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div className="space-y-2">
            <h5 className="font-bold text-stone-900 text-xs">Standar Kualitas</h5>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Semua produk beras, minyak goreng, dan telur melalui inspeksi mutu harian. Sayuran dipanen langsung di pagi hari dari kebun mitra.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Garansi 100% Produk Segar</span>
            </div>
          </div>

          {/* Payment & Delivery */}
          <div className="space-y-2">
            <h5 className="font-bold text-stone-900 text-xs">Pembayaran & Dukungan</h5>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Mendukung QRIS, BCA/Mandiri/BRI Virtual Account, GoPay, dan Bayar di Tempat (COD) tanpa biaya tambahan.
            </p>
            <span className="block text-[11px] text-stone-700 font-semibold pt-1">
              Layanan CS: Setiap Hari (06.00 - 21.00 WIB)
            </span>
          </div>
        </div>

        <div className="border-t border-stone-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
          <span>&copy; {new Date().getFullYear()} K4 Store. Seluruh hak cipta dilindungi.</span>
          <span>Dibuat dengan dedikasi untuk memudahkan belanja pangan keluarga Indonesia</span>
        </div>
      </div>
    </footer>
  );
};
