import { Product } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_sembako_fresh_1791730215229.jpg';
export const BERAS_IMAGE = '/src/assets/images/product_beras_pandan_1791730233182.jpg';
export const MINYAK_IMAGE = '/src/assets/images/product_minyak_goreng_1791730244429.jpg';
export const SAYUR_IMAGE = '/src/assets/images/product_sayur_segar_1791730254325.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-beras-01',
    name: 'Beras Pandan Wangi Super Cianjur',
    category: 'beras',
    price: 74000,
    originalPrice: 82000,
    unit: '5 kg (Kemasan Vakum)',
    stock: 24,
    minStockWarning: 8,
    image: BERAS_IMAGE,
    description: 'Beras aromatik asli Cianjur dengan butiran pulen alami, tanpa pemutih kimia, serta dipanen dari padi varietas unggul. Sangat cocok untuk sajian nasi hangat keluarga sehari-hari.',
    badge: 'Paling Laris',
    rating: 4.9,
    reviewCount: 142,
    reviews: [
      {
        id: 'rev-b1',
        productId: 'prod-beras-01',
        userName: 'Ibu Ratna Dewi',
        rating: 5,
        comment: 'Berasnya sangat wangi dan pulen! Anak-anak makan jadi lahap sekali. Pengemasan sangat rapi dan rapat.',
        date: 'Kemarin',
        verifiedPurchase: true
      },
      {
        id: 'rev-b2',
        productId: 'prod-beras-01',
        userName: 'Pak Hendra Saputra',
        rating: 5,
        comment: 'Sudah langganan beli di K4 Store. Selalu bersih, tidak ada kutu sama sekali, pengiriman tepat waktu.',
        date: '3 hari lalu',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-minyak-01',
    name: 'Minyak Goreng Kelapa Murni CocoGold',
    category: 'minyak',
    price: 38500,
    originalPrice: 42000,
    unit: '2 Liter Pouch',
    stock: 18,
    minStockWarning: 10,
    image: MINYAK_IMAGE,
    description: 'Minyak goreng kelapa jernih kaya asam laurat, tahan panas tinggi, dan tidak cepat menghitam saat menggoreng. Membuat gorengan lebih renyah dan sehat.',
    badge: 'Bebas Kolesterol',
    rating: 4.8,
    reviewCount: 98,
    reviews: [
      {
        id: 'rev-m1',
        productId: 'prod-minyak-01',
        userName: 'Bu Sisca Amelia',
        rating: 5,
        comment: 'Minyaknya bening banget, dipakai buat goreng pisang dan tempe hasilnya garing dan aromanya gurih.',
        date: '1 hari lalu',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-sayur-01',
    name: 'Paket Sayuran Hijau Organik Segar',
    category: 'sayur',
    price: 16500,
    originalPrice: 19000,
    unit: 'Bayam, Kangkung & Wortel (1 Ikat/Pack)',
    stock: 7, // Intentionally low stock to showcase auto-inventory alert
    minStockWarning: 10,
    image: SAYUR_IMAGE,
    description: 'Dipetik langsung pagi hari dari kebun petani lokal binaan. Sayuran segar bebas pestisida kimia sintetis, kaya serat, zat besi, dan vitamin untuk daya tahan tubuh.',
    badge: 'Stok Menipis',
    rating: 4.9,
    reviewCount: 64,
    reviews: [
      {
        id: 'rev-s1',
        productId: 'prod-sayur-01',
        userName: 'Dina Pratiwi',
        rating: 5,
        comment: 'Segar sekali saat sampai! Daun bayam tidak layu dan wortelnya manis renyah saat dimasak sayur bening.',
        date: '2 hari lalu',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-telur-01',
    name: 'Telur Ayam Negeri Omega-3 Farm Fresh',
    category: 'telur',
    price: 31000,
    originalPrice: 34000,
    unit: '1 kg (± 16 Butir Tray Higienis)',
    stock: 15,
    minStockWarning: 8,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
    description: 'Telur ayam berkhasiat tinggi dengan kuning telur jingga pekat kaya nutrisi DHA & EPA. Dihasilkan dari ayam petelur yang diberi pakan alami bebas antibiotik.',
    badge: 'Kaya DHA',
    rating: 4.9,
    reviewCount: 110,
    reviews: [
      {
        id: 'rev-t1',
        userName: 'Ahmad Fauzi',
        productId: 'prod-telur-01',
        rating: 5,
        comment: 'Kuning telurnya oranye cantik, cangkangnya tebal dan bersih. Tidak ada satu pun yang retak saat sampai!',
        date: '4 hari lalu',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-bumbu-01',
    name: 'Duet Bawang Merah & Putih Brebes Segar',
    category: 'bumbu',
    price: 26000,
    originalPrice: 29000,
    unit: '500 gram (Pilihan Kering Bersih)',
    stock: 22,
    minStockWarning: 6,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    description: 'Bawang merah Brebes berkualitas super berpadu dengan bawang putih kating utuh. Aroma wangi kuat, kering padat, dan tahan lama disimpan di dapur.',
    badge: 'Panen Baru',
    rating: 4.7,
    reviewCount: 52,
    reviews: [
      {
        id: 'rev-bm1',
        productId: 'prod-bumbu-01',
        userName: 'Nur Hidayah',
        rating: 4,
        comment: 'Bawangnya kering dan bagus, tidak kopong. Sangat wangi untuk bumbu tumisan.',
        date: '5 hari lalu',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-paket-01',
    name: 'Paket Sembako Berkah Hemat Mingguan',
    category: 'paket',
    price: 155000,
    originalPrice: 168000,
    unit: 'Beras 5kg + Minyak 2L + Gula 1kg + Telur 1kg',
    stock: 12,
    minStockWarning: 5,
    image: HERO_IMAGE,
    description: 'Solusi belanja praktis keluarga hemat hingga Rp 13.000! Terdiri dari Beras Pandan Wangi 5kg, Minyak Kelapa CocoGold 2L, Telur Omega 1kg, dan Gula Kristal 1kg.',
    badge: 'Diskon Spesial',
    rating: 5.0,
    reviewCount: 89,
    reviews: [
      {
        id: 'rev-p1',
        productId: 'prod-paket-01',
        userName: 'Ibu Maya Lestari',
        rating: 5,
        comment: 'Paket sembako paling worth it! Beli satu paket ini langsung aman stok makan seminggu lebih. Kurirnya sangat ramah.',
        date: 'Hari ini',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-bumbu-02',
    name: 'Cabai Rawit Merah Segar Petik Pagi',
    category: 'bumbu',
    price: 19500,
    originalPrice: 22000,
    unit: '250 gram (Pedas Alami)',
    stock: 9, // Low stock
    minStockWarning: 10,
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    description: 'Cabai rawit merah pedas nendang, dipetik dalam kondisi matang sempurna dari ladang. Batang tangkai masih hijau segar, siap membuat sambal istimewa.',
    badge: 'Ekstra Pedas',
    rating: 4.8,
    reviewCount: 41,
    reviews: [
      {
        id: 'rev-c1',
        productId: 'prod-bumbu-02',
        userName: 'Rudy Hartono',
        rating: 5,
        comment: 'Pedasnya juara! Buat sambal bawang langsung mantap, cabainya tidak ada yang busuk.',
        date: 'Kemarin',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-beras-02',
    name: 'Gula Pasir Kristal Putih Higienis',
    category: 'beras',
    price: 18000,
    originalPrice: 19500,
    unit: '1 kg Kemasan Rapat',
    stock: 35,
    minStockWarning: 10,
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=800&q=80',
    description: 'Gula pasir kristal murni dari tebu alami pilihan. Bersih tanpa ampas, butiran kristal bening seragam, manis alami untuk teh, kopi, dan kue.',
    rating: 4.8,
    reviewCount: 76,
    reviews: [
      {
        id: 'rev-g1',
        productId: 'prod-beras-02',
        userName: 'Tari Wardani',
        rating: 5,
        comment: 'Gula bersih tidak kecoklatan, manisnya pas dan kemasannya tebal tidak bocor.',
        date: '6 hari lalu',
        verifiedPurchase: true
      }
    ]
  }
];
