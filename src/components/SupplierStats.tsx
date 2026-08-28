import React from 'react';
import { 
  Building, 
  ShoppingBag, 
  CreditCard, 
  Award, 
  TrendingUp, 
  MapPin 
} from 'lucide-react';
import { Supplier } from '../types';
import { formatRupiah } from '../utils/formatters';

interface SupplierStatsProps {
  suppliers: Supplier[];
  onSelectCategoryFilter: (cat: string) => void;
  selectedCategory: string;
}

export const SupplierStats: React.FC<SupplierStatsProps> = ({
  suppliers,
  onSelectCategoryFilter,
  selectedCategory,
}) => {
  const totalSuppliers = suppliers.length;
  const primaryPartners = suppliers.filter((s) => s.status === 'Mitra Utama').length;
  
  const avgMinPurchase = totalSuppliers > 0 
    ? Math.round(suppliers.reduce((acc, s) => acc + s.minPurchaseAmount, 0) / totalSuppliers)
    : 0;

  // Category counts
  const categoryCountMap: Record<string, number> = {};
  suppliers.forEach((s) => {
    s.categories.forEach((cat) => {
      categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
    });
  });

  const topCategories = Object.entries(categoryCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Stat 1: Total Supplier */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Supplier Grosir
          </p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {totalSuppliers}
            </span>
            <span className="text-xs text-slate-500 font-medium">pabrik / distributor</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {suppliers.filter((s) => s.status === 'Aktif' || s.status === 'Mitra Utama').length} Aktif Melayani
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Building className="w-6 h-6" />
        </div>
      </div>

      {/* Stat 2: Mitra Utama & Verifikasi */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Mitra Prioritas / Utama
          </p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {primaryPartners}
            </span>
            <span className="text-xs text-slate-500 font-medium">supplier</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Syarat bayar tempo & rating 4.8+
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Award className="w-6 h-6" />
        </div>
      </div>

      {/* Stat 3: Rata-rata Minimal Belanja */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Rata-rata Min. Pembelian
          </p>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">
              {formatRupiah(avgMinPurchase)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Batas ambang order grosir
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <CreditCard className="w-6 h-6" />
        </div>
      </div>

      {/* Stat 4: Kategori Terpopuler */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Kategori Produk Utama
        </p>
        <div className="flex flex-wrap gap-1.5">
          {topCategories.map(([category, count]) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategoryFilter(isSelected ? 'all' : category)}
                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{category}</span>
                <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
