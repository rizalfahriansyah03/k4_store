import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  DollarSign,
  Plus,
  RefreshCw,
  CheckCircle2,
  BarChart3,
  Boxes
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { products, restockProduct, analytics } = useStore();
  const [restockAmount, setRestockAmount] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<'inventory' | 'sales'>('inventory');

  const formatRupiah = (num: number) => 'Rp ' + num.toLocaleString('id-ID');

  const lowStockProducts = products.filter((p) => p.stock <= p.minStockWarning);

  return (
    <div className="space-y-6 pt-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Dasbor Analitik & Manajemen Inventaris Otomatis
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Laporan penjualan harian terpadu dan pemantauan stok sembako secara real-time.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Manajemen Stok ({lowStockProducts.length} Kritis)
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sales'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Laporan Penjualan Real-Time
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span>Omzet Penjualan Hari Ini</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl font-extrabold text-stone-900 tabular-nums">
            {formatRupiah(analytics.dailyRevenue)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            +18.4% dari kemarin
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span>Total Pesanan Selesai</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl font-extrabold text-stone-900 tabular-nums">
            {analytics.todayOrdersCount} Transaksi
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Rata-rata {formatRupiah(analytics.averageOrderValue)} / pesanan
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span>Katalog Bahan Pokok</span>
            <Boxes className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl font-extrabold text-stone-900 tabular-nums">
            {products.length} SKU Aktif
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Seluruh kategori siap kirim
          </div>
        </div>

        <div className={`border rounded-2xl p-4 shadow-xs ${
          lowStockProducts.length > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-stone-200/90'
        }`}>
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span>Peringatan Stok Menipis</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockProducts.length > 0 ? 'text-amber-600' : 'text-stone-400'}`} />
          </div>
          <div className={`text-xl font-extrabold tabular-nums ${
            lowStockProducts.length > 0 ? 'text-amber-800' : 'text-stone-900'
          }`}>
            {lowStockProducts.length} Produk Kritis
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Ambang batas otomatis &lt; 10 unit
          </div>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        /* Inventory Management Section */
        <div className="space-y-6">
          {/* Low stock alert banner */}
          {lowStockProducts.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong>Sistem Otomatis Mendeteksi {lowStockProducts.length} Produk Segera Habis:</strong>{' '}
                  {lowStockProducts.map(p => `${p.name} (sisa ${p.stock})`).join(', ')}.
                </div>
              </div>
              <button
                onClick={() => {
                  lowStockProducts.forEach(p => restockProduct(p.id, 15));
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-800 text-white font-semibold text-xs hover:bg-amber-900 whitespace-nowrap self-start sm:self-auto transition-colors shadow-xs"
              >
                Restock Semua (+15 Unit)
              </button>
            </div>
          )}

          {/* Product Inventory Table */}
          <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Daftar Stok Bahan Pokok & Sembako
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Stok otomatis berkurang saat pembeli melakukan pemesanan (checkout).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 hidden sm:inline">Tambah Stok Cepat:</span>
                <select
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="text-xs px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
                >
                  <option value={10}>+10 Unit</option>
                  <option value={20}>+20 Unit</option>
                  <option value={50}>+50 Unit</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-stone-100">
                <thead className="bg-stone-50/70 text-stone-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Produk Sembako</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Harga Satuan</th>
                    <th className="py-3 px-4">Status & Sisa Stok</th>
                    <th className="py-3 px-4 text-right">Aksi Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((prod) => {
                    const isLow = prod.stock <= prod.minStockWarning;
                    const isOut = prod.stock === 0;

                    return (
                      <tr key={prod.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block">{prod.name}</span>
                            <span className="text-[11px] text-stone-500 block">{prod.unit}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 uppercase text-[11px] font-semibold text-stone-500">
                          {prod.category}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-stone-900 tabular-nums">
                          {formatRupiah(prod.price)}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 tabular-nums text-sm">
                              {prod.stock} unit
                            </span>
                            {isOut ? (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                                Habis
                              </span>
                            ) : isLow ? (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Kritis (&lt; {prod.minStockWarning})
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                Aman
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => restockProduct(prod.id, restockAmount)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition-all text-xs inline-flex items-center gap-1 shadow-xs active:scale-95"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Restock +{restockAmount}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Real-Time Sales Analytics Report */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hourly Sales Bar Chart */}
            <div className="lg:col-span-2 bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    Grafik Penjualan Per Jam (Hari Ini)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Aktivitas transaksi puncak terjadi pada pagi dan sore hari menjelang waktu masak.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <BarChart3 className="w-4 h-4" />
                  <span>Real-Time</span>
                </div>
              </div>

              {/* Clean SVG Bar Chart */}
              <div className="pt-4">
                <div className="h-48 flex items-end justify-between gap-3 px-2 border-b border-stone-200">
                  {analytics.salesByHour.map((item, idx) => {
                    const maxRevenue = 1400000;
                    const heightPercent = (item.revenue / maxRevenue) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-semibold text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums whitespace-nowrap">
                          {formatRupiah(item.revenue)}
                        </span>
                        <div
                          className="w-full max-w-[48px] bg-emerald-800 hover:bg-emerald-700 rounded-t-lg transition-all duration-300"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[11px] font-medium text-stone-600 mt-2">
                          {item.hour}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category Sales Distribution */}
            <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-sm">
                Distribusi Kategori Terlaris
              </h3>
              
              <div className="space-y-3 pt-2">
                {analytics.categoryDistribution.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-stone-800">{cat.category}</span>
                      <span className="font-bold text-stone-900 tabular-nums">{cat.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-700 rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500">
                💡 Beras & Minyak Goreng menyumbang lebih dari 60% total perputaran omzet bulanan.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
