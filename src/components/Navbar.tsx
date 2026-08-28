import React from 'react';
import { 
  Building2, 
  Plus, 
  Download, 
  Scale, 
  Sparkles,
  Store,
  FileSpreadsheet
} from 'lucide-react';
import { exportSuppliersToCSV } from '../utils/formatters';
import { Supplier } from '../types';

interface NavbarProps {
  suppliers: Supplier[];
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  onOpenCompareModal: () => void;
  compareCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  suppliers,
  onOpenAddModal,
  onOpenExportModal,
  onOpenCompareModal,
  compareCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Store className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Katalog Supplier Grosir
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                  Pusat Grosir & Distributor
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Pencatatan database supplier sembako, snack, kosmetik & kebutuhan rumah tangga
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Compare Button */}
            <button
              id="btn-compare-suppliers"
              onClick={onOpenCompareModal}
              className={`relative inline-flex items-center px-3 py-2 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                compareCount > 0
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Bandingkan Supplier"
            >
              <Scale className="w-4 h-4 mr-1.5" />
              <span className="hidden md:inline">Bandingkan</span>
              {compareCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Quick Export / Backup */}
            <button
              id="btn-export-backup"
              onClick={onOpenExportModal}
              className="inline-flex items-center px-3 py-2 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Ekspor CSV / Cadangan Data"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5 text-slate-600" />
              <span className="hidden sm:inline">Data & Ekspor</span>
            </button>

            {/* Add Supplier Button */}
            <button
              id="btn-add-supplier-main"
              onClick={onOpenAddModal}
              className="inline-flex items-center px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-all duration-150 transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 mr-1.5" />
              <span>Tambah Supplier</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
