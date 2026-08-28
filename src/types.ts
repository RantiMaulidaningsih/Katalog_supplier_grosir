export type ProductCategory = 
  | 'Sembako'
  | 'Makanan Ringan'
  | 'Kecantikan & Kosmetik'
  | 'Kebutuhan Rumah Tangga'
  | 'Minuman & Susu'
  | 'Bumbu & Bahan Dapur'
  | 'Perlengkapan & Plastik'
  | 'Lainnya';

export type SupplierStatus = 'Aktif' | 'Mitra Utama' | 'Dalam Penjajakan' | 'Cadangan' | 'Non-Aktif';

export type PaymentTerm = 'Tunai / Cash' | 'COD (Bayar di Tempat)' | 'Tempo 7 Hari' | 'Tempo 14 Hari' | 'Tempo 30 Hari' | 'Konsinyasi';

export interface SupplierProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  unit: string; // e.g. "Karton (24 pcs)", "Dus", "Karung (25 kg)", "Lusin"
  wholesalePrice: number;
  suggestedRetailPrice?: number;
  minQty?: number;
  sku?: string;
  notes?: string;
}

export interface OrderHistoryRecord {
  id: string;
  date: string;
  orderNumber: string;
  totalAmount: number;
  status: 'Selesai' | 'Dalam Pengiriman' | 'Menunggu Konfirmasi' | 'Dibatalkan';
  itemsCount: number;
  notes?: string;
}

export interface Supplier {
  id: string;
  companyName: string; // Nama Perusahaan (PT/CV/UD/Distributor)
  managerName: string; // Nama Manager / Contact Person
  managerTitle?: string; // e.g. "Area Sales Manager", "Head of Distribution", "Owner"
  phone: string; // No HP / WhatsApp
  alternativePhone?: string; // Telepon Kantor / Sales backup
  email?: string;
  website?: string; // Website / E-katalog / Instagram / Toko Online
  address: string; // Alamat Lengkap
  city: string; // Kota/Kabupaten
  province: string; // Provinsi
  postalCode?: string;
  googleMapsUrl?: string; // Link Google Maps
  
  categories: ProductCategory[]; // Kategori produk
  minPurchaseAmount: number; // Minimal Pembelian dalam Rupiah (e.g. 500000)
  minPurchaseUnitText?: string; // Keterangan minimal beli (e.g. "Min. 5 Karton campur" atau "Min. Rp 1.500.000")
  
  paymentTerms: PaymentTerm[]; // Syarat Pembayaran
  shippingLeadTime: string; // Waktu pengiriman (e.g. "1 - 2 Hari Kerja", "Same Day")
  shippingPolicy: string; // Kebijakan Pengiriman (e.g. "Gratis ongkir min. 2jt area Jabodetabek", "Ekspedisi Cargo")
  distributionArea?: string; // Cakupan wilayah pengiriman
  
  rating: number; // 1 to 5 star rating
  status: SupplierStatus;
  
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  npwp?: string;
  
  products: SupplierProductItem[]; // Daftar produk unggulan & harga grosir
  orderHistory?: OrderHistoryRecord[];
  
  notes?: string; // Catatan khusus (jadwal order, diskon volume, trik negosiasi)
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'grid' | 'table';

export interface FilterOptions {
  search: string;
  selectedCategory: string;
  selectedStatus: string;
  selectedPaymentTerm: string;
  minPurchaseRange: 'all' | 'under1m' | '1mTo5m' | 'above5m';
  sortBy: 'name-asc' | 'name-desc' | 'min-asc' | 'min-desc' | 'rating-desc' | 'recent';
}
