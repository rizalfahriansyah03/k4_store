import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Plus, Star, AlertCircle, ShoppingBag } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    products,
    selectedCategory,
    searchQuery,
    addToCart,
    setSelectedProductForDetail
  } = useStore();

  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            Pilihan Bahan Pokok & Sembako
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Menampilkan {filteredProducts.length} produk segar berkualitas pilihan dapur
          </p>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center space-y-3">
          <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-sm font-semibold text-stone-800">
            Produk tidak ditemukan
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Coba gunakan kata kunci pencarian lain atau pilih kategori sembako yang berbeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isLowStock = product.stock <= product.minStockWarning;
            const isOutOfStock = product.stock === 0;

            return (
              <div
                key={product.id}
                className="group bg-white border border-stone-200/90 rounded-2xl overflow-hidden hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                {/* Image Container */}
                <div
                  onClick={() => setSelectedProductForDetail(product)}
                  className="relative aspect-4/3 bg-stone-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />

                  {/* Single subtle tag */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                      {product.badge}
                    </span>
                  )}

                  {/* Stock warning tag if low */}
                  {isLowStock && !isOutOfStock && (
                    <span className="absolute top-3 right-3 bg-amber-50 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-amber-200/80">
                      Sisa {product.stock}
                    </span>
                  )}

                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="bg-white text-stone-900 font-bold text-xs px-3 py-1.5 rounded-lg shadow">
                        Habis Terjual
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Container */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Metadata text without pills */}
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <span>{product.unit}</span>
                      <span aria-hidden="true">·</span>
                      <div className="flex items-center gap-0.5 text-amber-600 font-medium">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{product.rating}</span>
                        <span className="text-stone-400">({product.reviewCount})</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => setSelectedProductForDetail(product)}
                      className="font-semibold text-sm text-stone-900 hover:text-emerald-800 transition-colors cursor-pointer line-clamp-2 leading-snug"
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing & Add Action */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-base font-bold text-stone-900 tabular-nums">
                        {formatRupiah(product.price)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-[11px] text-stone-400 line-through tabular-nums">
                          {formatRupiah(product.originalPrice)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      disabled={isOutOfStock}
                      className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                        isOutOfStock
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : 'bg-emerald-800 text-white hover:bg-emerald-900'
                      }`}
                      aria-label={`Tambah ${product.name} ke keranjang`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
