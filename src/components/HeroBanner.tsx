import React from 'react';
import { useStore } from '../context/StoreContext';
import { HERO_IMAGE } from '../data/mockProducts';
import { ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryOption {
  id: ProductCategory;
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'Semua Produk' },
  { id: 'beras', label: 'Beras & Gula' },
  { id: 'minyak', label: 'Minyak Goreng' },
  { id: 'telur', label: 'Telur & Protein' },
  { id: 'sayur', label: 'Sayuran Segar' },
  { id: 'bumbu', label: 'Bumbu Dapur' },
  { id: 'paket', label: 'Paket Hemat' }
];

export const HeroBanner: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setCurrentView } = useStore();

  return (
    <div className="space-y-6 pt-4">
      {/* Campaign Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[320px] sm:min-h-[360px] flex items-center shadow-sm">
        {/* Background Image with Measured Contrast Scrim */}
        <img
          src={HERO_IMAGE}
          alt="Bahan pokok dan sembako segar K4 Store"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-xl p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
            <Sparkles className="w-4 h-4" />
            <span>Kebutuhan Dapur Lengkap & Pasti Sampai</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight text-balance">
            Belanja Sembako Sehari-hari Jadi Lebih Tenang & Hemat.
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-md">
            Pesan beras kualitas Cianjur, minyak murni, telur omega, dan sayuran segar langsung ke rumah. Pantau kurir secara real-time dan nikmati poin loyalitas setiap hari.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setSelectedCategory('paket')}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-600 transition-all shadow-md active:scale-95"
            >
              Lihat Paket Hemat Sembako
            </button>
            <button
              onClick={() => setCurrentView('tracking')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-medium transition-all"
            >
              Cek Pelacakan Kurir
            </button>
          </div>
        </div>
      </div>

      {/* Trust Markers Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-1">
        <div className="bg-white border border-stone-200/80 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-stone-900">100% Produk Higienis & Asli</h4>
            <p className="text-[11px] text-stone-500">Kualitas terjamin tanpa bahan kimia pengawet</p>
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-stone-900">Kurir Khusus & Lacak Real-Time</h4>
            <p className="text-[11px] text-stone-500">Estimasi akurat dengan pantauan peta GPS langsung</p>
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-stone-900">Bayar Aman QRIS & COD</h4>
            <p className="text-[11px] text-stone-500">Pilihan bayar fleksibel, tunai di tempat atau instan</p>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
