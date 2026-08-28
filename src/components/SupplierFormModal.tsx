import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  UserCheck, 
  Phone, 
  MapPin, 
  CreditCard, 
  Globe, 
  Truck, 
  Star, 
  FileText, 
  Plus, 
  Trash2,
  Check
} from 'lucide-react';
import { 
  Supplier, 
  ProductCategory, 
  PaymentTerm, 
  SupplierStatus, 
  SupplierProductItem 
} from '../types';
import { parseRupiahInput, formatRupiah } from '../utils/formatters';

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => void;
  initialData?: Supplier | null;
}

const AVAILABLE_CATEGORIES: ProductCategory[] = [
  'Sembako',
  'Makanan Ringan',
  'Kecantikan & Kosmetik',
  'Kebutuhan Rumah Tangga',
  'Minuman & Susu',
  'Bumbu & Bahan Dapur',
  'Perlengkapan & Plastik',
  'Lainnya',
];

const AVAILABLE_PAYMENT_TERMS: PaymentTerm[] = [
  'COD (Bayar di Tempat)',
  'Tempo 7 Hari',
  'Tempo 14 Hari',
  'Tempo 30 Hari',
  'Tunai / Cash',
  'Konsinyasi',
];

const PROVINCES_INDONESIA = [
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'Banten',
  'DI Yogyakarta',
  'Bali',
  'Sumatera Utara',
  'Sumatera Barat',
  'Sumatera Selatan',
  'Lampung',
  'Riau',
  'Kalimantan Barat',
  'Kalimantan Timur',
  'Sulawesi Selatan',
  'Lainnya',
];

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const isEditing = !!initialData;

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerTitle, setManagerTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [alternativePhone, setAlternativePhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('DKI Jakarta');
  const [postalCode, setPostalCode] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  const [categories, setCategories] = useState<ProductCategory[]>(['Sembako']);
  const [minPurchaseAmount, setMinPurchaseAmount] = useState<number>(1000000);
  const [minPurchaseAmountRaw, setMinPurchaseAmountRaw] = useState('1000000');
  const [minPurchaseUnitText, setMinPurchaseUnitText] = useState('');

  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>(['COD (Bayar di Tempat)', 'Tunai / Cash']);
  const [shippingLeadTime, setShippingLeadTime] = useState('1 - 2 Hari Kerja');
  const [shippingPolicy, setShippingPolicy] = useState('');
  const [distributionArea, setDistributionArea] = useState('');

  const [rating, setRating] = useState(4.8);
  const [status, setStatus] = useState<SupplierStatus>('Aktif');

  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountHolder, setBankAccountHolder] = useState('');
  const [npwp, setNpwp] = useState('');
  const [notes, setNotes] = useState('');

  // Initial products
  const [products, setProducts] = useState<SupplierProductItem[]>([]);

  // Load initialData when editing
  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName);
      setManagerName(initialData.managerName);
      setManagerTitle(initialData.managerTitle || '');
      setPhone(initialData.phone);
      setAlternativePhone(initialData.alternativePhone || '');
      setEmail(initialData.email || '');
      setWebsite(initialData.website || '');
      setAddress(initialData.address);
      setCity(initialData.city);
      setProvince(initialData.province);
      setPostalCode(initialData.postalCode || '');
      setGoogleMapsUrl(initialData.googleMapsUrl || '');
      setCategories(initialData.categories);
      setMinPurchaseAmount(initialData.minPurchaseAmount);
      setMinPurchaseAmountRaw(initialData.minPurchaseAmount.toString());
      setMinPurchaseUnitText(initialData.minPurchaseUnitText || '');
      setPaymentTerms(initialData.paymentTerms);
      setShippingLeadTime(initialData.shippingLeadTime);
      setShippingPolicy(initialData.shippingPolicy || '');
      setDistributionArea(initialData.distributionArea || '');
      setRating(initialData.rating);
      setStatus(initialData.status);
      setBankName(initialData.bankName || '');
      setBankAccountNumber(initialData.bankAccountNumber || '');
      setBankAccountHolder(initialData.bankAccountHolder || '');
      setNpwp(initialData.npwp || '');
      setNotes(initialData.notes || '');
      setProducts(initialData.products || []);
    } else {
      // Reset defaults for new supplier
      setCompanyName('');
      setManagerName('');
      setManagerTitle('Sales Manager');
      setPhone('');
      setAlternativePhone('');
      setEmail('');
      setWebsite('');
      setAddress('');
      setCity('Jakarta');
      setProvince('DKI Jakarta');
      setPostalCode('');
      setGoogleMapsUrl('');
      setCategories(['Sembako']);
      setMinPurchaseAmount(1500000);
      setMinPurchaseAmountRaw('1500000');
      setMinPurchaseUnitText('Min. 10 karton / dus');
      setPaymentTerms(['COD (Bayar di Tempat)', 'Tunai / Cash']);
      setShippingLeadTime('1 - 2 Hari Kerja');
      setShippingPolicy('Gratis ongkir via armada distributor');
      setDistributionArea('Jabodetabek');
      setRating(4.8);
      setStatus('Aktif');
      setBankName('BCA (Bank Central Asia)');
      setBankAccountNumber('');
      setBankAccountHolder('');
      setNpwp('');
      setNotes('');
      setProducts([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleCategory = (cat: ProductCategory) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  const togglePaymentTerm = (term: PaymentTerm) => {
    if (paymentTerms.includes(term)) {
      if (paymentTerms.length > 1) {
        setPaymentTerms(paymentTerms.filter((t) => t !== term));
      }
    } else {
      setPaymentTerms([...paymentTerms, term]);
    }
  };

  const handleMinPurchaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setMinPurchaseAmountRaw(raw);
    setMinPurchaseAmount(raw ? parseInt(raw, 10) : 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !managerName.trim() || !phone.trim()) {
      alert('Mohon isi nama perusahaan, nama manager, dan nomor HP/WhatsApp.');
      return;
    }

    const supplierPayload: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'> = {
      companyName: companyName.trim(),
      managerName: managerName.trim(),
      managerTitle: managerTitle.trim() || undefined,
      phone: phone.trim(),
      alternativePhone: alternativePhone.trim() || undefined,
      email: email.trim() || undefined,
      website: website.trim() || undefined,
      address: address.trim() || 'Alamat belum diatur',
      city: city.trim() || 'Jakarta',
      province,
      postalCode: postalCode.trim() || undefined,
      googleMapsUrl: googleMapsUrl.trim() || undefined,
      categories,
      minPurchaseAmount,
      minPurchaseUnitText: minPurchaseUnitText.trim() || undefined,
      paymentTerms,
      shippingLeadTime,
      shippingPolicy: shippingPolicy.trim() || 'Pengiriman reguler armada distributor',
      distributionArea: distributionArea.trim() || undefined,
      rating,
      status,
      bankName: bankName.trim() || undefined,
      bankAccountNumber: bankAccountNumber.trim() || undefined,
      bankAccountHolder: bankAccountHolder.trim() || undefined,
      npwp: npwp.trim() || undefined,
      products,
      notes: notes.trim() || undefined,
    };

    onSave(supplierPayload, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isEditing ? 'Edit Data Supplier Grosir' : 'Tambah Supplier Grosir Baru'}
              </h2>
              <p className="text-xs text-slate-400">
                Lengkapi data perusahaan, manager, kategori barang, minimal belanja & kontak
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form id="supplier-form" onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
          {/* SECTION 1: PROFIL PERUSAHAAN & KONTAK */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center pb-2 border-b border-slate-200">
              <Building2 className="w-4 h-4 mr-1.5 text-emerald-600" />
              1. Identitas Perusahaan & Manager
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Perusahaan / Distributor / Pabrik <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Cth: PT Berkah Pangan Mandiri / CV Snack Nusantara"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Manager / Contact Person <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="Cth: Hendra Gunawan / Budi Santoso"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jabatan / Posisi Manager
                </label>
                <input
                  type="text"
                  value={managerTitle}
                  onChange={(e) => setManagerTitle(e.target.value)}
                  placeholder="Cth: Area Sales Manager / Kepala Gudang"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor HP / WhatsApp (Pemesanan) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Cth: 081288992341"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs sm:text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Telepon Kantor / Alternatif
                </label>
                <input
                  type="text"
                  value={alternativePhone}
                  onChange={(e) => setAlternativePhone(e.target.value)}
                  placeholder="Cth: 021-58902233"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs sm:text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Perusahaan
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Cth: order@supplier.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Website / E-Katalog / IG Toko
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Cth: https://supplier.co.id atau @distributor_sembako"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: KATEGORI PRODUK & MINIMAL PEMBELIAN */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center pb-2 border-b border-slate-200">
              <CreditCard className="w-4 h-4 mr-1.5 text-emerald-600" />
              2. Kategori Produk & Batas Minimal Order
            </h3>

            {/* Product Category Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pilih Kategori Produk yang Disediakan (Bisa lebih dari 1) <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_CATEGORIES.map((cat) => {
                  const isSelected = categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 mr-1" />}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Min Purchase & MOQ description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nominal Minimal Pembelian (Rp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={minPurchaseAmountRaw ? formatRupiah(parseInt(minPurchaseAmountRaw, 10)) : ''}
                    onChange={handleMinPurchaseChange}
                    placeholder="Rp 1.000.000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs sm:text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Tambahan Min. Beli (Satuan Karton/Dus/Kg)
                </label>
                <input
                  type="text"
                  value={minPurchaseUnitText}
                  onChange={(e) => setMinPurchaseUnitText(e.target.value)}
                  placeholder="Cth: Min. 5 karton campur atau 10 karung beras"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SYARAT PEMBAYARAN & LOGISTIK */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center pb-2 border-b border-slate-200">
              <Truck className="w-4 h-4 mr-1.5 text-emerald-600" />
              3. Syarat Pembayaran & Pengiriman
            </h3>

            {/* Payment Terms */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pilihan Syarat Pembayaran (TOP) <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_PAYMENT_TERMS.map((term) => {
                  const isSelected = paymentTerms.includes(term);
                  return (
                    <button
                      key={term}
                      type="button"
                      onClick={() => togglePaymentTerm(term)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 mr-1" />}
                      {term}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Waktu Pengiriman (Lead Time)
                </label>
                <select
                  value={shippingLeadTime}
                  onChange={(e) => setShippingLeadTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm font-medium"
                >
                  <option value="Same Day (Hari yang Sama)">Same Day (Hari yang Sama)</option>
                  <option value="1 - 2 Hari Kerja">1 - 2 Hari Kerja</option>
                  <option value="2 - 3 Hari Kerja">2 - 3 Hari Kerja</option>
                  <option value="3 - 5 Hari Kerja (Luar Kota)">3 - 5 Hari Kerja (Luar Kota)</option>
                  <option value="Jadwal Mingguan Tetap">Jadwal Mingguan Tetap</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Kemitraan Supplier
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SupplierStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm font-medium"
                >
                  <option value="Mitra Utama">⭐ Mitra Utama (Prioritas)</option>
                  <option value="Aktif">🟢 Aktif</option>
                  <option value="Dalam Penjajakan">🟡 Dalam Penjajakan</option>
                  <option value="Cadangan">🟣 Cadangan (Backup)</option>
                  <option value="Non-Aktif">⚪ Non-Aktif</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kebijakan Pengiriman & Free Ongkir
                </label>
                <input
                  type="text"
                  value={shippingPolicy}
                  onChange={(e) => setShippingPolicy(e.target.value)}
                  placeholder="Cth: Gratis ongkir min. belanja Rp 3.000.000 area Jabodetabek via truk box pabrik"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: ALAMAT LENGKAP & GUDANG */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center pb-2 border-b border-slate-200">
              <MapPin className="w-4 h-4 mr-1.5 text-emerald-600" />
              4. Alamat Lengkap & Lokasi Gudang
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Lengkap / Kompleks Pergudangan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Cth: Kawasan Industri MM2100 Blok H No. 8, Jl. Raya Cikarang"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kota / Kabupaten <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Cth: Tangerang / Surabaya"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Provinsi
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm"
                >
                  {PROVINCES_INDONESIA.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Cth: 15211"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Google Maps Lokasi Gudang
                </label>
                <input
                  type="text"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: REKENING BANK & CATATAN */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center pb-2 border-b border-slate-200">
              <FileText className="w-4 h-4 mr-1.5 text-emerald-600" />
              5. Rekening Bank, NPWP & Catatan Khusus
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Bank
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Cth: BCA / Mandiri / BRI"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="Cth: 8720192881"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Atas Nama Rekening
                </label>
                <input
                  type="text"
                  value={bankAccountHolder}
                  onChange={(e) => setBankAccountHolder(e.target.value)}
                  placeholder="Cth: PT BERKAH PANGAN"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Khusus / Jadwal Order / Trik Negosiasi
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Cth: Order setiap Selasa sebelum jam 3 sore. Diberikan potongan 2.5% jika order di atas Rp 10.000.000."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            form="supplier-form"
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-all"
          >
            {isEditing ? 'Simpan Perubahan' : 'Tambah Supplier ke Katalog'}
          </button>
        </div>
      </div>
    </div>
  );
};
