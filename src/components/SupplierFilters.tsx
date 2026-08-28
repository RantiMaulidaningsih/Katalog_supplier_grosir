import React from 'react';
import { 
  Search, 
  Filter, 
  X, 
  LayoutGrid, 
  Table as TableIcon, 
  SlidersHorizontal,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { FilterOptions, ProductCategory, ViewMode } from '../types';

interface SupplierFiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFilteredCount: number;
  totalAllCount: number;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'Semua Kategori', value: 'all' },
  { label: '🌾 Sembako', value: 'Sembako' },
  { label: '🍿 Makanan Ringan', value: 'Makanan Ringan' },
  { label: '💄 Kecantikan & Kosmetik', value: 'Kecantikan & Kosmetik' },
  { label: '🧼 Kebutuhan Rumah Tangga', value: 'Kebutuhan Rumah Tangga' },
  { label: '🥤 Minuman & Susu', value: 'Minuman & Susu' },
  { label: '🧂 Bumbu & Bahan Dapur', value: 'Bumbu & Bahan Dapur' },
  { label: '📦 Perlengkapan & Plastik', value: 'Perlengkapan & Plastik' },
];

export const SupplierFilters: React.FC<SupplierFiltersProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
  totalAllCount,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.selectedCategory !== 'all' ||
    filters.selectedStatus !== 'all' ||
    filters.selectedPaymentTerm !== 'all' ||
    filters.minPurchaseRange !== 'all';

  const handleResetFilters = () => {
    onFilterChange({
      search: '',
      selectedCategory: 'all',
      selectedStatus: 'all',
      selectedPaymentTerm: 'all',
      minPurchaseRange: 'all',
      sortBy: 'recent',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 mb-6 space-y-4">
      {/* Top Row: Search bar & View switch */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <input
            id="input-search-supplier"
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Cari nama supplier, manager, no HP, kota, atau produk (cth: beras, sabun, biskuit)..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View mode toggle & Sort */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {/* Sort Selector */}
          <div className="relative">
            <select
              id="select-sort-supplier"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
              aria-label="Urutkan daftar supplier"
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-lg pl-3 pr-8 py-2.5 font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
            >
              <option value="recent">Terbaru Ditambahkan</option>
              <option value="name-asc">Nama Perusahaan (A - Z)</option>
              <option value="name-desc">Nama Perusahaan (Z - A)</option>
              <option value="rating-desc">Rating Tertinggi</option>
              <option value="min-asc">Min. Belanja: Terendah</option>
              <option value="min-desc">Min. Belanja: Tertinggi</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View Mode */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            <button
              id="btn-view-grid"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="btn-view-table"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Tabel"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Slider / Wrap */}
      <div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => {
            const active = filters.selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onFilterChange({ selectedCategory: cat.value })}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full font-medium transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Second Row: Secondary Filters (Status, Syarat Bayar, Min. Belanja) */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            id="filter-status"
            value={filters.selectedStatus}
            onChange={(e) => onFilterChange({ selectedStatus: e.target.value })}
            aria-label="Filter status supplier"
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-md px-2.5 py-1.5 font-medium hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Semua Status Kerjasama</option>
            <option value="Mitra Utama">⭐ Mitra Utama</option>
            <option value="Aktif">🟢 Aktif</option>
            <option value="Dalam Penjajakan">🟡 Dalam Penjajakan</option>
            <option value="Cadangan">🟣 Cadangan</option>
            <option value="Non-Aktif">⚪ Non-Aktif</option>
          </select>

          {/* Payment Terms Filter */}
          <select
            id="filter-payment"
            value={filters.selectedPaymentTerm}
            onChange={(e) => onFilterChange({ selectedPaymentTerm: e.target.value })}
            aria-label="Filter syarat pembayaran supplier"
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-md px-2.5 py-1.5 font-medium hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Semua Syarat Pembayaran</option>
            <option value="COD">COD (Bayar di Tempat)</option>
            <option value="Tempo">Ada Fasilitas Tempo (7/14/30 hari)</option>
            <option value="Tunai">Tunai di Muka / Cash</option>
            <option value="Konsinyasi">Konsinyasi</option>
          </select>

          {/* Min Purchase Filter */}
          <select
            id="filter-min-purchase"
            value={filters.minPurchaseRange}
            onChange={(e) => onFilterChange({ minPurchaseRange: e.target.value as FilterOptions['minPurchaseRange'] })}
            aria-label="Filter batas minimal pembelian"
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-md px-2.5 py-1.5 font-medium hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Semua Batas Minimal Belanja</option>
            <option value="under1m">Di Bawah Rp 1 Juta (Ramah Warung)</option>
            <option value="1mTo5m">Rp 1 Juta - Rp 5 Juta (Menengah)</option>
            <option value="above5m">Di Atas Rp 5 Juta (Skala Besar/Pabrik)</option>
          </select>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center px-2.5 py-1.5 text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md font-semibold transition-colors"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Reset Filter
            </button>
          )}
        </div>

        {/* Results Counter */}
        <div className="text-slate-500 font-medium ml-auto">
          Menampilkan <span className="font-bold text-slate-800">{totalFilteredCount}</span> dari {totalAllCount} supplier
        </div>
      </div>
    </div>
  );
};
