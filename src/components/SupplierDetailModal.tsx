import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  UserCheck, 
  Phone, 
  MessageCircle, 
  Mail, 
  Globe, 
  MapPin, 
  ExternalLink, 
  CreditCard, 
  Truck, 
  Star, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Printer,
  Package,
  TrendingUp,
  Landmark,
  Share2
} from 'lucide-react';
import { Supplier, SupplierProductItem, ProductCategory } from '../types';
import { 
  formatRupiah, 
  getCategoryBadgeColor, 
  getStatusBadgeColor, 
  getWhatsAppLink,
  formatDate 
} from '../utils/formatters';

interface SupplierDetailModalProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (supplier: Supplier) => void;
  onUpdateProducts: (supplierId: string, products: SupplierProductItem[]) => void;
  onAddOrderRecord?: (supplierId: string, orderNumber: string, amount: number, itemsCount: number, notes: string) => void;
}

type TabType = 'overview' | 'catalog' | 'simulator' | 'logistics' | 'orders';

export const SupplierDetailModal: React.FC<SupplierDetailModalProps> = ({
  supplier,
  isOpen,
  onClose,
  onEdit,
  onUpdateProducts,
  onAddOrderRecord,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // New product form states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>(supplier.categories[0] || 'Sembako');
  const [newProdUnit, setNewProdUnit] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdRetailPrice, setNewProdRetailPrice] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdNotes, setNewProdNotes] = useState('');

  // Simulator state: map product ID to ordered quantity
  const [orderQtys, setOrderQtys] = useState<Record<string, number>>({});

  // New Order PO form state
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [poNumber, setPoNumber] = useState('');
  const [poAmount, setPoAmount] = useState('');
  const [poItemsCount, setPoItemsCount] = useState('1');
  const [poNotes, setPoNotes] = useState('');

  if (!isOpen) return null;

  const statusColors = getStatusBadgeColor(supplier.status);
  const waLink = getWhatsAppLink(supplier.phone, supplier.companyName, supplier.managerName);

  const handleCopyBank = () => {
    if (supplier.bankAccountNumber) {
      navigator.clipboard.writeText(`${supplier.bankName} - ${supplier.bankAccountNumber} a.n ${supplier.bankAccountHolder}`);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${supplier.address}, ${supplier.city}, ${supplier.province}`);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Add Product handler
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const newProd: SupplierProductItem = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      unit: newProdUnit || 'Karton / Dus',
      wholesalePrice: parseInt(newProdPrice.replace(/[^0-9]/g, ''), 10) || 0,
      suggestedRetailPrice: newProdRetailPrice ? parseInt(newProdRetailPrice.replace(/[^0-9]/g, ''), 10) : undefined,
      sku: newProdSku,
      notes: newProdNotes,
    };

    const updated = [...supplier.products, newProd];
    onUpdateProducts(supplier.id, updated);

    // Reset
    setNewProdName('');
    setNewProdUnit('');
    setNewProdPrice('');
    setNewProdRetailPrice('');
    setNewProdSku('');
    setNewProdNotes('');
    setIsAddingProduct(false);
  };

  // Delete Product
  const handleDeleteProduct = (productId: string) => {
    const updated = supplier.products.filter((p) => p.id !== productId);
    onUpdateProducts(supplier.id, updated);
  };

  // Calculate Order Simulator Total
  const simTotalAmount = supplier.products.reduce((sum, prod) => {
    const qty = orderQtys[prod.id] || 0;
    return sum + qty * prod.wholesalePrice;
  }, 0);

  const simTotalItems = Object.values(orderQtys).reduce((sum: number, q: number) => sum + (q || 0), 0);
  const isMinPurchaseReached = simTotalAmount >= supplier.minPurchaseAmount;
  const remainingAmount = Math.max(0, supplier.minPurchaseAmount - simTotalAmount);

  // Quick PO submission from simulator
  const handleCreateOrderFromSimulator = () => {
    if (onAddOrderRecord && simTotalAmount > 0) {
      const generatedPO = `PO/${new Date().getFullYear()}/${supplier.companyName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase()}/${Math.floor(1000 + Math.random() * 9000)}`;
      onAddOrderRecord(
        supplier.id,
        generatedPO,
        simTotalAmount,
        simTotalItems,
        'Dibuat otomatis dari kalkulator simulasi pemesanan katalog.'
      );
      setActiveTab('orders');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xl shrink-0">
              {supplier.companyName.replace(/PT\s|CV\s|UD\s/gi, '').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
                  {supplier.companyName}
                </h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors.bg} ${statusColors.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusColors.dot}`} />
                  {supplier.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1.5">
                <span className="flex items-center">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                  Rating {supplier.rating.toFixed(1)} / 5.0
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {supplier.city}, {supplier.province}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">
                  Min. Belanja: {formatRupiah(supplier.minPurchaseAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(supplier)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors hidden sm:block"
            >
              Edit Data
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar (WhatsApp, Call, Web, Google Maps) */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Direct WA Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 mr-1.5" />
              Chat WhatsApp (Langsung)
            </a>

            {/* Direct Call Button */}
            <a
              href={`tel:${supplier.phone}`}
              className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Telepon: {supplier.phone}
            </a>

            {/* Website Link */}
            {supplier.website && (
              <a
                href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-blue-600 font-medium rounded-lg transition-colors"
              >
                <Globe className="w-3.5 h-3.5 mr-1.5" />
                Website / Katalog Online
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}

            {/* Google Maps Link */}
            {supplier.googleMapsUrl && (
              <a
                href={supplier.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                Lokasi di Google Maps
              </a>
            )}
          </div>

          <div className="text-slate-500 text-[11px] hidden md:block">
            Terdaftar sejak: {formatDate(supplier.createdAt)}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="border-b border-slate-200 bg-white px-4 sm:px-6 flex space-x-2 sm:space-x-4 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-2 border-b-2 transition-colors whitespace-nowrap flex items-center ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 mr-1.5" />
            Ringkasan & Profil
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-2 border-b-2 transition-colors whitespace-nowrap flex items-center ${
              activeTab === 'catalog'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4 mr-1.5" />
            Katalog Produk & Pricelist ({supplier.products.length})
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-3 px-2 border-b-2 transition-colors whitespace-nowrap flex items-center ${
              activeTab === 'simulator'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            Kalkulator Order Cepat
            {simTotalAmount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">
                {formatRupiah(simTotalAmount)}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`py-3 px-2 border-b-2 transition-colors whitespace-nowrap flex items-center ${
              activeTab === 'logistics'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="w-4 h-4 mr-1.5" />
            Pengiriman & Syarat Bayar
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-2 border-b-2 transition-colors whitespace-nowrap flex items-center ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 mr-1.5" />
            Riwayat PO ({supplier.orderHistory?.length || 0})
          </button>
        </div>

        {/* Modal Tab Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-6 text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Product Categories */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Kategori Produk yang Disediakan
                </h3>
                <div className="flex flex-wrap gap-2">
                  {supplier.categories.map((cat) => {
                    const colors = getCategoryBadgeColor(cat);
                    return (
                      <span
                        key={cat}
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
                      >
                        {cat}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Grid 2 Columns: Contact Person & Bank Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Person In Charge / Manager */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                    <UserCheck className="w-4 h-4 mr-1.5 text-slate-400" />
                    Penanggung Jawab / Manager
                  </h3>
                  <div>
                    <p className="text-base font-bold text-slate-900">{supplier.managerName}</p>
                    <p className="text-xs text-slate-500">{supplier.managerTitle || 'Sales Manager / Distribusi'}</p>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">WhatsApp / HP:</span>
                      <span className="font-semibold text-slate-800">{supplier.phone}</span>
                    </div>
                    {supplier.alternativePhone && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Telp. Kantor:</span>
                        <span className="text-slate-700">{supplier.alternativePhone}</span>
                      </div>
                    )}
                    {supplier.email && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email Resmi:</span>
                        <span className="text-slate-700">{supplier.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bank Account & NPWP */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                      <Landmark className="w-4 h-4 mr-1.5 text-slate-400" />
                      Rekening Bank Pembayaran
                    </h3>
                    {supplier.bankAccountNumber && (
                      <button
                        onClick={handleCopyBank}
                        className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center font-medium"
                      >
                        {copiedBank ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1" /> Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-1" /> Salin No Rek
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {supplier.bankAccountNumber ? (
                    <div>
                      <p className="text-sm font-bold text-slate-900">{supplier.bankName}</p>
                      <p className="text-base font-mono font-bold text-slate-800 tracking-wider">
                        {supplier.bankAccountNumber}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">a.n. {supplier.bankAccountHolder}</p>
                      {supplier.npwp && (
                        <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">
                          NPWP: <span className="font-mono text-slate-600">{supplier.npwp}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Belum ada data rekening bank yang disimpan.</p>
                  )}
                </div>
              </div>

              {/* Address Box */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                    Alamat Lengkap & Gudang Pengiriman
                  </h3>
                  <button
                    onClick={handleCopyAddress}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center font-medium"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Salin Alamat
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {supplier.address}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span>Kota: <strong className="text-slate-700">{supplier.city}</strong></span>
                  <span>•</span>
                  <span>Provinsi: <strong className="text-slate-700">{supplier.province}</strong></span>
                  {supplier.postalCode && (
                    <>
                      <span>•</span>
                      <span>Kode Pos: <strong className="text-slate-700">{supplier.postalCode}</strong></span>
                    </>
                  )}
                </div>
              </div>

              {/* Notes & Tips Negosiasi */}
              {supplier.notes && (
                <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/80">
                  <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5 flex items-center">
                    <FileText className="w-4 h-4 mr-1.5 text-amber-700" />
                    Catatan Khusus & Ketentuan Pemesanan Rutin
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed whitespace-pre-line">
                    {supplier.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCT CATALOG & PRICELIST */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Daftar Pricelist Produk ({supplier.products.length} Item)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daftar harga grosir, satuan kemasan, dan rekomendasi margin toko
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingProduct(!isAddingProduct)}
                  className="inline-flex items-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Tambah Produk Baru
                </button>
              </div>

              {/* Form Add Product */}
              {isAddingProduct && (
                <form onSubmit={handleSaveProduct} className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Tambah Item Pricelist Baru
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-medium mb-1">Nama Produk *</label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="Cth: Minyak Goreng 2L Pouch (Dus isi 6)"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Kategori</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      >
                        {supplier.categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Satuan Kemasan</label>
                      <input
                        type="text"
                        value={newProdUnit}
                        onChange={(e) => setNewProdUnit(e.target.value)}
                        placeholder="Cth: Karton (24 pcs) / Dus / Bal"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Harga Grosir (Rp) *</label>
                      <input
                        type="number"
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        placeholder="Cth: 195000"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Estimasi Harga Jual Toko (Rp)</label>
                      <input
                        type="number"
                        value={newProdRetailPrice}
                        onChange={(e) => setNewProdRetailPrice(e.target.value)}
                        placeholder="Cth: 220000"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 font-medium mb-1">Catatan / SKU / Varian</label>
                      <input
                        type="text"
                        value={newProdNotes}
                        onChange={(e) => setNewProdNotes(e.target.value)}
                        placeholder="Cth: Tersedia varian original & pedas manis"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                    >
                      Simpan Produk
                    </button>
                  </div>
                </form>
              )}

              {/* Table of Products */}
              {supplier.products.length > 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Nama Produk & Varian</th>
                          <th className="py-3 px-4">Satuan Kemasan</th>
                          <th className="py-3 px-4">Harga Beli Grosir</th>
                          <th className="py-3 px-4">Est. Harga Jual Toko</th>
                          <th className="py-3 px-4">Est. Margin (%)</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {supplier.products.map((item) => {
                          const marginPercent = item.suggestedRetailPrice && item.suggestedRetailPrice > item.wholesalePrice
                            ? Math.round(((item.suggestedRetailPrice - item.wholesalePrice) / item.wholesalePrice) * 100)
                            : 0;

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4">
                                <p className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</p>
                                {item.notes && (
                                  <p className="text-[11px] text-slate-400 mt-0.5">{item.notes}</p>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                                  {item.unit}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-bold text-slate-900 text-sm">
                                  {formatRupiah(item.wholesalePrice)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-slate-600">
                                  {item.suggestedRetailPrice ? formatRupiah(item.suggestedRetailPrice) : '-'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {marginPercent > 0 ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                    <TrendingUp className="w-3 h-3 mr-0.5" />
                                    +{marginPercent}%
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-xs">-</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleDeleteProduct(item.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                  title="Hapus Produk dari Katalog"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-slate-200">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Belum ada produk terdaftar</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Klik tombol "Tambah Produk Baru" untuk mencatat pricelist supplier ini.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDER SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-5">
              {/* Minimum Purchase Progress Bar */}
              <div className={`p-4 rounded-xl border ${isMinPurchaseReached ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Target Minimal Pembelian Supplier:
                    </span>
                    <span className="ml-2 text-sm font-bold text-slate-900">
                      {formatRupiah(supplier.minPurchaseAmount)}
                    </span>
                  </div>
                  <div className="text-xs font-semibold">
                    {isMinPurchaseReached ? (
                      <span className="text-emerald-700 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Syarat Minimum Pembelian Terpenuhi!
                      </span>
                    ) : (
                      <span className="text-amber-800 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Kurang {formatRupiah(remainingAmount)} lagi untuk order
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${isMinPurchaseReached ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{
                      width: `${Math.min(100, Math.round((simTotalAmount / (supplier.minPurchaseAmount || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Product Quantity Selector Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Pilih Jumlah Pesanan per Barang:</span>
                  <button
                    onClick={() => setOrderQtys({})}
                    className="text-slate-500 hover:text-slate-800 font-medium"
                  >
                    Reset Pilihan
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {supplier.products.map((item) => {
                    const currentQty = orderQtys[item.id] || 0;
                    const subtotal = currentQty * item.wholesalePrice;

                    return (
                      <div key={item.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded">{item.unit}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-800">{formatRupiah(item.wholesalePrice)} / satuan</span>
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center space-x-4 self-end sm:self-center">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => {
                                const next = Math.max(0, currentQty - 1);
                                setOrderQtys({ ...orderQtys, [item.id]: next });
                              }}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentQty}
                              onChange={(e) => {
                                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                                setOrderQtys({ ...orderQtys, [item.id]: val });
                              }}
                              className="w-12 text-center text-xs font-bold text-slate-900 focus:outline-none border-x border-slate-200 py-1"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = currentQty + 1;
                                setOrderQtys({ ...orderQtys, [item.id]: next });
                              }}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                            >
                              +
                            </button>
                          </div>

                          <div className="w-28 text-right font-bold text-slate-900 text-sm">
                            {formatRupiah(subtotal)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simulator Footer Summary */}
                <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Total Simulasi Estimasi Pesanan:</p>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                      {formatRupiah(simTotalAmount)}
                    </p>
                    <p className="text-xs text-slate-300">
                      Total {simTotalItems} item/karton dipilih
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={handleCreateOrderFromSimulator}
                      disabled={simTotalAmount === 0}
                      className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                        simTotalAmount > 0
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Catat Jadi PO Pembelian
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOGISTICS & PAYMENT TERMS */}
          {activeTab === 'logistics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Syarat Pembayaran Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                    <CreditCard className="w-4 h-4 mr-1.5 text-slate-400" />
                    Ketentuan Syarat Pembayaran (TOP)
                  </h3>
                  <div className="space-y-2">
                    {supplier.paymentTerms.map((term) => (
                      <div key={term} className="flex items-center space-x-2 text-xs font-semibold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{term}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kebijakan Pengiriman Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                    <Truck className="w-4 h-4 mr-1.5 text-slate-400" />
                    Waktu & Kebijakan Logistik
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Lead Time / Estimasi Tiba:</span>
                      <span className="font-bold text-slate-800 text-sm">{supplier.shippingLeadTime}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Kebijakan Ongkir & Armada:</span>
                      <span className="font-semibold text-slate-800">{supplier.shippingPolicy || 'Armada pabrik / Ekspedisi'}</span>
                    </div>
                    {supplier.distributionArea && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">Cakupan Area Distribusi:</span>
                        <span className="font-semibold text-slate-800">{supplier.distributionArea}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS & PO HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Riwayat Purchase Order (PO)</h3>
                  <p className="text-xs text-slate-500">Catatan transaksi dan riwayat belanja ke supplier ini</p>
                </div>
                <button
                  onClick={() => setIsAddingOrder(!isAddingOrder)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  + Catat PO Baru
                </button>
              </div>

              {isAddingOrder && (
                <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-800">Catat Transaksi / PO Manual</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Nomor PO / Nota</label>
                      <input
                        type="text"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        placeholder="PO/2025/..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Total Belanja (Rp) *</label>
                      <input
                        type="number"
                        value={poAmount}
                        onChange={(e) => setPoAmount(e.target.value)}
                        placeholder="Cth: 4500000"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Jumlah Item / Karton</label>
                      <input
                        type="number"
                        value={poItemsCount}
                        onChange={(e) => setPoItemsCount(e.target.value)}
                        placeholder="10"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 font-medium mb-1">Catatan Order</label>
                      <input
                        type="text"
                        value={poNotes}
                        onChange={(e) => setPoNotes(e.target.value)}
                        placeholder="Cth: Pembayaran tempo 14 hari lunas"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingOrder(false)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddOrderRecord && poAmount) {
                          onAddOrderRecord(
                            supplier.id,
                            poNumber || `PO/${Date.now().toString().slice(-6)}`,
                            parseInt(poAmount, 10) || 0,
                            parseInt(poItemsCount, 10) || 1,
                            poNotes
                          );
                          setIsAddingOrder(false);
                          setPoNumber('');
                          setPoAmount('');
                          setPoNotes('');
                        }
                      }}
                      className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold"
                    >
                      Simpan PO
                    </button>
                  </div>
                </div>
              )}

              {supplier.orderHistory && supplier.orderHistory.length > 0 ? (
                <div className="space-y-2">
                  {supplier.orderHistory.map((ord) => (
                    <div key={ord.id} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-sm">{ord.orderNumber}</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Tanggal: {formatDate(ord.date)} • {ord.itemsCount} Karton/Item
                        </p>
                        {ord.notes && <p className="text-xs text-slate-600 mt-1">{ord.notes}</p>}
                      </div>
                      <div className="text-right sm:self-center">
                        <span className="text-sm font-bold text-slate-900">{formatRupiah(ord.totalAmount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                  Belum ada riwayat PO yang dicatat untuk supplier ini.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500">
            ID: <span className="font-mono text-slate-700">{supplier.id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
