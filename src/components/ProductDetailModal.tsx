import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, ShieldCheck, CheckCircle2, MessageSquarePlus, Plus, Minus } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    addToCart,
    addReview,
    currentUser
  } = useStore();

  const [qty, setQty] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser.name);

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;
  const isOutOfStock = product.stock === 0;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview(product.id, reviewRating, reviewComment.trim(), reviewerName.trim());
    setReviewComment('');
    setShowReviewForm(false);
  };

  const formatRupiah = (num: number) => 'Rp ' + num.toLocaleString('id-ID');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between z-10">
          <span className="text-xs font-semibold text-emerald-800">
            Detail Kebutuhan Pokok K4
          </span>
          <button
            onClick={() => setSelectedProductForDetail(null)}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Tutup detail produk"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Visual & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-white/95 text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>{product.unit}</span>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1 text-amber-600 font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.rating}</span>
                    <span className="text-stone-400">({product.reviewCount} ulasan)</span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-stone-900 mt-1 leading-snug">
                  {product.name}
                </h2>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-stone-900 tabular-nums">
                    {formatRupiah(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-stone-400 line-through tabular-nums">
                      {formatRupiah(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-xs text-stone-600">
                  Status Stok:{' '}
                  <span className={`font-semibold ${product.stock <= 10 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {product.stock > 0 ? `${product.stock} unit tersedia di gudang` : 'Habis Terjual'}
                  </span>
                </div>
              </div>

              {/* Purchase Controls */}
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={qty <= 1 || isOutOfStock}
                      className="p-1 rounded-lg text-stone-600 hover:bg-white disabled:opacity-30"
                      aria-label="Kurangi jumlah"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-800">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      disabled={qty >= product.stock || isOutOfStock}
                      className="p-1 rounded-lg text-stone-600 hover:bg-white disabled:opacity-30"
                      aria-label="Tambah jumlah"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product, qty);
                      setSelectedProductForDetail(null);
                    }}
                    disabled={isOutOfStock}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 disabled:bg-stone-200 disabled:text-stone-400 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Masukkan Keranjang ({formatRupiah(product.price * qty)})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2 border-t border-stone-100 pt-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Deskripsi & Standar Mutu
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {product.description}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-stone-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Penyimpanan Bersih & Higienis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Garansi Tukar Jika Tidak Segar</span>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-4 border-t border-stone-100 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Ulasan Pembeli Terverifikasi
                </h3>
                <p className="text-xs text-stone-500">
                  Berdasarkan pengalaman pelanggan asli yang telah berbelanja di K4 Store
                </p>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Tulis Ulasan</span>
              </button>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <form onSubmit={handleAddReview} className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-stone-900">Bagikan Pengalaman Belanjamu</h4>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-600">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-0.5 text-amber-500 focus:outline-none"
                      >
                        <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Nama Anda"
                    required
                    className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Ceritakan kesegaran produk, kemasan, atau kecepatan pengiriman..."
                    rows={3}
                    required
                    className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 shadow-sm"
                  >
                    Kirim Ulasan
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {product.reviews.length === 0 ? (
                <div className="py-6 text-center text-xs text-stone-400">
                  Belum ada ulasan untuk produk ini. Jadilah pembeli pertama yang mengulas!
                </div>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-stone-50/60 rounded-xl border border-stone-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                            Pembeli Terverifikasi
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
