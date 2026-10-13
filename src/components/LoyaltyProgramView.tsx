import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Coins,
  Gift,
  Award,
  Flame,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Ticket,
  Sparkles
} from 'lucide-react';

export const LoyaltyProgramView: React.FC = () => {
  const { loyalty, redeemPoints, currentUser, setCurrentView } = useStore();
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);

  const formatRupiah = (num: number) => 'Rp ' + num.toLocaleString('id-ID');

  const VOUCHERS = [
    {
      id: 'vouch-1',
      title: 'Kupon Diskon Belanja Rp 15.000',
      description: 'Potongan langsung untuk semua jenis sembako & beras',
      pointsNeeded: 1500,
      code: 'K4HEMAT15K'
    },
    {
      id: 'vouch-2',
      title: 'Voucher Bebas Ongkir Kilat',
      description: 'Gratis ongkos kirim kurir instan tanpa minimum belanja',
      pointsNeeded: 1000,
      code: 'K4FREEONGKIR'
    },
    {
      id: 'vouch-3',
      title: 'Diskon Spesial Paket Minyak & Beras Rp 25.000',
      description: 'Khusus pembelian kombo beras Cianjur & minyak CocoGold',
      pointsNeeded: 2500,
      code: 'K4KOMBO25K'
    }
  ];

  const handleRedeemVoucher = (voucher: typeof VOUCHERS[0]) => {
    if (loyalty.points < voucher.pointsNeeded) {
      alert(`Poin kamu belum mencukupi untuk menukar ${voucher.title}. Belanja sembako lagi untuk kumpulkan poin!`);
      return;
    }

    const success = redeemPoints(voucher.pointsNeeded);
    if (success) {
      setClaimSuccess(`Berhasil menukar ${voucher.pointsNeeded} Poin dengan kode voucher: ${voucher.code}`);
      setTimeout(() => setClaimSuccess(null), 4000);
    }
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight">
          Program Loyalitas K4 Poin
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Dapatkan 1 K4 Poin setiap belanja Rp 1.000. Tukarkan dengan potongan harga atau kupon belanja dapur.
        </p>
      </div>

      {claimSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span className="font-semibold">{claimSuccess}</span>
        </div>
      )}

      {/* Member Card & KPI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital Member Card */}
        <div className="relative rounded-3xl p-6 bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 text-white shadow-lg overflow-hidden flex flex-col justify-between min-h-[220px]">
          {/* Subtle Organic Pattern */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-700/30 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">
                Kartu Loyalitas Digital
              </span>
              <span className="text-xs bg-emerald-700/60 px-2.5 py-1 rounded-md text-emerald-100 font-medium">
                {loyalty.tier}
              </span>
            </div>

            <div className="mt-6">
              <span className="text-xs text-emerald-200 block">Total Saldo Poin:</span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums mt-1">
                {loyalty.points.toLocaleString()} <span className="text-lg font-semibold text-emerald-300">Poin</span>
              </div>
              <span className="text-[11px] text-emerald-300 block mt-1">
                Setara dengan {formatRupiah(loyalty.points * 10)} potongan belanja
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-emerald-700/50 text-xs text-emerald-100">
            <span>{currentUser.name}</span>
            <span className="font-mono text-[11px]">MEMBER-K4-2026</span>
          </div>
        </div>

        {/* Loyalty Highlights */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Streak Belanja Dapur</h4>
                <p className="text-[11px] text-stone-500">Konsistensi belanja mingguan</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-stone-900 tabular-nums">
                {loyalty.streakDays} Minggu Beruntun
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Lanjutkan streak belanja untuk dapatkan bonus 500 Poin ganda di akhir bulan!
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Total Hemat Belanja</h4>
                <p className="text-[11px] text-stone-500">Akumulasi potongan yang didapat</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-emerald-800 tabular-nums">
                {formatRupiah(loyalty.totalSavings)}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Dari penukaran poin dan voucher promo sembako di K4 Store.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Redeemable Vouchers Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Ticket className="w-4 h-4 text-emerald-800" />
          <span>Katalog Penukaran Voucher Promo</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VOUCHERS.map((v) => {
            const canRedeem = loyalty.points >= v.pointsNeeded;
            return (
              <div
                key={v.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {v.code}
                    </span>
                    <span className="font-bold text-stone-900 tabular-nums">
                      {v.pointsNeeded.toLocaleString()} Poin
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 leading-snug">
                    {v.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    {v.description}
                  </p>
                </div>

                <button
                  onClick={() => handleRedeemVoucher(v)}
                  disabled={!canRedeem}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                    canRedeem
                      ? 'bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {canRedeem ? 'Tukar Voucher Sekarang' : `Kurang ${(v.pointsNeeded - loyalty.points).toLocaleString()} Poin`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points History List */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900">
          Riwayat Perolehan & Penggunaan Poin
        </h3>

        <div className="divide-y divide-stone-100">
          {loyalty.history.map((h) => (
            <div key={h.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    h.type === 'earn'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {h.type === 'earn' ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h5 className="font-semibold text-stone-900">{h.description}</h5>
                  <span className="text-[11px] text-stone-400">{h.date}</span>
                </div>
              </div>

              <div
                className={`font-bold tabular-nums text-sm ${
                  h.type === 'earn' ? 'text-emerald-700' : 'text-stone-700'
                }`}
              >
                {h.type === 'earn' ? `+${h.amount}` : `-${h.amount}`} Poin
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
