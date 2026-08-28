/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal,
  LayoutGrid, 
  Table as TableIcon, 
  Sparkles,
  ShoppingBag,
  Store,
  Info,
  CheckCircle2
} from 'lucide-react';
import { 
  Supplier, 
  FilterOptions, 
  ViewMode, 
  SupplierProductItem 
} from './types';
import { DEFAULT_SUPPLIERS } from './data/defaultSuppliers';
import { Navbar } from './components/Navbar';
import { SupplierStats } from './components/SupplierStats';
import { SupplierFilters } from './components/SupplierFilters';
import { SupplierCard } from './components/SupplierCard';
import { SupplierTable } from './components/SupplierTable';
import { SupplierDetailModal } from './components/SupplierDetailModal';
import { SupplierFormModal } from './components/SupplierFormModal';
import { SupplierCompareModal } from './components/SupplierCompareModal';
import { ExportImportModal } from './components/ExportImportModal';

const LOCAL_STORAGE_KEY = 'katalog_supplier_grosir_data_v1';

export default function App() {
  // Load initial suppliers from localStorage or defaults
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error reading localStorage:', err);
    }
    return DEFAULT_SUPPLIERS;
  });

  // Save to localStorage on every update
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(suppliers));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }, [suppliers]);

  // Filters & View Mode State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    selectedCategory: 'all',
    selectedStatus: 'all',
    selectedPaymentTerm: 'all',
    minPurchaseRange: 'all',
    sortBy: 'recent',
  });

  // Modals state
  const [selectedSupplierForDetail, setSelectedSupplierForDetail] = useState<Supplier | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // Comparison list
  const [comparedSupplierIds, setComparedSupplierIds] = useState<string[]>([]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Toggle supplier into comparison list
  const handleToggleCompare = (id: string) => {
    if (comparedSupplierIds.includes(id)) {
      setComparedSupplierIds(comparedSupplierIds.filter((item) => item !== id));
    } else {
      if (comparedSupplierIds.length >= 4) {
        showToast('Maksimal membandingkan 4 supplier sekaligus.');
        return;
      }
      setComparedSupplierIds([...comparedSupplierIds, id]);
      showToast('Supplier ditambahkan ke daftar perbandingan.');
    }
  };

  // Delete Supplier handler
  const handleDeleteSupplier = (id: string) => {
    const target = suppliers.find((s) => s.id === id);
    if (!target) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus data supplier "${target.companyName}"?`)) {
      const updated = suppliers.filter((s) => s.id !== id);
      setSuppliers(updated);
      setComparedSupplierIds((prev) => prev.filter((i) => i !== id));
      if (selectedSupplierForDetail?.id === id) {
        setSelectedSupplierForDetail(null);
      }
      showToast(`Supplier ${target.companyName} berhasil dihapus.`);
    }
  };

  // Save Supplier (Create or Edit)
  const handleSaveSupplier = (
    data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    const now = new Date().toISOString();
    if (editId) {
      // Edit existing
      const updatedList = suppliers.map((item) => {
        if (item.id === editId) {
          return {
            ...item,
            ...data,
            updatedAt: now,
          };
        }
        return item;
      });
      setSuppliers(updatedList);
      showToast(`Data supplier "${data.companyName}" berhasil diperbarui.`);

      // Update detail modal if currently open
      if (selectedSupplierForDetail?.id === editId) {
        const updatedTarget = updatedList.find((s) => s.id === editId);
        if (updatedTarget) setSelectedSupplierForDetail(updatedTarget);
      }
    } else {
      // Add new
      const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      setSuppliers([newSupplier, ...suppliers]);
      showToast(`Supplier "${data.companyName}" berhasil ditambahkan ke katalog.`);
    }
  };

  // Update products inside a supplier
  const handleUpdateProducts = (supplierId: string, newProducts: SupplierProductItem[]) => {
    const updatedList = suppliers.map((item) => {
      if (item.id === supplierId) {
        return {
          ...item,
          products: newProducts,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });
    setSuppliers(updatedList);
    if (selectedSupplierForDetail?.id === supplierId) {
      setSelectedSupplierForDetail((prev) => (prev ? { ...prev, products: newProducts } : null));
    }
    showToast('Katalog pricelist produk berhasil diperbarui.');
  };

  // Add order transaction record
  const handleAddOrderRecord = (
    supplierId: string,
    orderNumber: string,
    amount: number,
    itemsCount: number,
    notes: string
  ) => {
    const newRecord = {
      id: `ord-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      orderNumber,
      totalAmount: amount,
      status: 'Selesai' as const,
      itemsCount,
      notes,
    };

    const updatedList = suppliers.map((item) => {
      if (item.id === supplierId) {
        const existingOrders = item.orderHistory || [];
        return {
          ...item,
          orderHistory: [newRecord, ...existingOrders],
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    setSuppliers(updatedList);
    if (selectedSupplierForDetail?.id === supplierId) {
      setSelectedSupplierForDetail((prev) =>
        prev ? { ...prev, orderHistory: [newRecord, ...(prev.orderHistory || [])] } : null
      );
    }
    showToast(`Purchase Order ${orderNumber} berhasil dicatat!`);
  };

  // Filtered & Sorted Suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers
      .filter((s) => {
        // Search query (Company name, manager, phone, city, products)
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchCompany = s.companyName.toLowerCase().includes(query);
          const matchManager = s.managerName.toLowerCase().includes(query);
          const matchPhone = s.phone.includes(query);
          const matchCity = s.city.toLowerCase().includes(query) || s.province.toLowerCase().includes(query);
          const matchProducts = s.products.some((p) => p.name.toLowerCase().includes(query));
          const matchCategories = s.categories.some((c) => c.toLowerCase().includes(query));

          if (!matchCompany && !matchManager && !matchPhone && !matchCity && !matchProducts && !matchCategories) {
            return false;
          }
        }

        // Category filter
        if (filters.selectedCategory !== 'all') {
          if (!s.categories.includes(filters.selectedCategory as any)) {
            return false;
          }
        }

        // Status filter
        if (filters.selectedStatus !== 'all') {
          if (s.status !== filters.selectedStatus) {
            return false;
          }
        }

        // Payment term filter
        if (filters.selectedPaymentTerm !== 'all') {
          const term = filters.selectedPaymentTerm;
          const hasMatchingTerm = s.paymentTerms.some((pt) => pt.toLowerCase().includes(term.toLowerCase()));
          if (!hasMatchingTerm) return false;
        }

        // Min Purchase Range filter
        if (filters.minPurchaseRange !== 'all') {
          if (filters.minPurchaseRange === 'under1m' && s.minPurchaseAmount > 1000000) return false;
          if (filters.minPurchaseRange === '1mTo5m' && (s.minPurchaseAmount <= 1000000 || s.minPurchaseAmount > 5000000)) return false;
          if (filters.minPurchaseRange === 'above5m' && s.minPurchaseAmount <= 5000000) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'name-asc') {
          return a.companyName.localeCompare(b.companyName);
        }
        if (filters.sortBy === 'name-desc') {
          return b.companyName.localeCompare(a.companyName);
        }
        if (filters.sortBy === 'min-asc') {
          return a.minPurchaseAmount - b.minPurchaseAmount;
        }
        if (filters.sortBy === 'min-desc') {
          return b.minPurchaseAmount - a.minPurchaseAmount;
        }
        if (filters.sortBy === 'rating-desc') {
          return b.rating - a.rating;
        }
        // Recent default
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [suppliers, filters]);

  const comparedSuppliersList = useMemo(() => {
    return suppliers.filter((s) => comparedSupplierIds.includes(s.id));
  }, [suppliers, comparedSupplierIds]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-2.5 text-xs sm:text-sm animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        suppliers={suppliers}
        onOpenAddModal={() => {
          setSupplierToEdit(null);
          setIsFormModalOpen(true);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        compareCount={comparedSupplierIds.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* KPI Stats Overview */}
        <SupplierStats
          suppliers={suppliers}
          onSelectCategoryFilter={(cat) => handleFilterChange({ selectedCategory: cat })}
          selectedCategory={filters.selectedCategory}
        />

        {/* Filters & View Switcher */}
        <SupplierFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFilteredCount={filteredSuppliers.length}
          totalAllCount={suppliers.length}
        />

        {/* Catalog Content Area */}
        {filteredSuppliers.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSuppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onViewDetail={(s) => setSelectedSupplierForDetail(s)}
                  onEdit={(s) => {
                    setSupplierToEdit(s);
                    setIsFormModalOpen(true);
                  }}
                  onDelete={handleDeleteSupplier}
                  onToggleCompare={handleToggleCompare}
                  isCompared={comparedSupplierIds.includes(supplier.id)}
                />
              ))}
            </div>
          ) : (
            <SupplierTable
              suppliers={filteredSuppliers}
              onViewDetail={(s) => setSelectedSupplierForDetail(s)}
              onEdit={(s) => {
                setSupplierToEdit(s);
                setIsFormModalOpen(true);
              }}
              onDelete={handleDeleteSupplier}
              onToggleCompare={handleToggleCompare}
              comparedIds={comparedSupplierIds}
            />
          )
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3.5">
              <Store className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Tidak Ada Supplier Ditemukan
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Tidak ada data supplier yang cocok dengan kata kunci atau filter yang Anda pilih. Coba sesuaikan kata pencarian atau reset filter.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() =>
                  handleFilterChange({
                    search: '',
                    selectedCategory: 'all',
                    selectedStatus: 'all',
                    selectedPaymentTerm: 'all',
                    minPurchaseRange: 'all',
                  })
                }
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Reset Filter
              </button>
              <button
                onClick={() => {
                  setSupplierToEdit(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                + Tambah Supplier Baru
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p className="font-medium">
            Katalog Supplier Grosir Indonesia © {new Date().getFullYear()} • Manajemen Distributor & Rantai Pasok Toko
          </p>
          <div className="flex items-center space-x-4">
            <span>Sembako</span>
            <span>•</span>
            <span>Makanan Ringan</span>
            <span>•</span>
            <span>Kosmetik</span>
            <span>•</span>
            <span>Kebutuhan Rumah Tangga</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* Detail Modal */}
      {selectedSupplierForDetail && (
        <SupplierDetailModal
          supplier={selectedSupplierForDetail}
          isOpen={!!selectedSupplierForDetail}
          onClose={() => setSelectedSupplierForDetail(null)}
          onEdit={(s) => {
            setSelectedSupplierForDetail(null);
            setSupplierToEdit(s);
            setIsFormModalOpen(true);
          }}
          onUpdateProducts={handleUpdateProducts}
          onAddOrderRecord={handleAddOrderRecord}
        />
      )}

      {/* Add / Edit Form Modal */}
      {isFormModalOpen && (
        <SupplierFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSupplierToEdit(null);
          }}
          onSave={handleSaveSupplier}
          initialData={supplierToEdit}
        />
      )}

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <SupplierCompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          comparedSuppliers={comparedSuppliersList}
          onRemoveFromCompare={(id) => setComparedSupplierIds(comparedSupplierIds.filter((i) => i !== id))}
          onClearCompare={() => setComparedSupplierIds([])}
          onViewDetail={(s) => {
            setIsCompareModalOpen(false);
            setSelectedSupplierForDetail(s);
          }}
        />
      )}

      {/* Export & Import Modal */}
      {isExportModalOpen && (
        <ExportImportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          suppliers={suppliers}
          onImportSuppliers={(imported) => {
            setSuppliers(imported);
            showToast(`Berhasil memulihkan ${imported.length} data supplier.`);
          }}
          onResetToDefault={() => {
            setSuppliers(DEFAULT_SUPPLIERS);
            showToast('Data supplier direset ke data awal demo.');
          }}
        />
      )}
    </div>
  );
}
