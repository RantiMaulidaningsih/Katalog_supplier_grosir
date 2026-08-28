import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  FileSpreadsheet, 
  Database, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Supplier } from '../types';
import { exportSuppliersToCSV } from '../utils/formatters';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  onImportSuppliers: (imported: Supplier[]) => void;
  onResetToDefault: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  suppliers,
  onImportSuppliers,
  onResetToDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    exportSuppliersToCSV(suppliers);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(suppliers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_katalog_supplier_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportSuppliers(parsed);
            setImportStatus(`Berhasil mengimpor ${parsed.length} data supplier.`);
            setTimeout(() => {
              setImportStatus(null);
              onClose();
            }, 1500);
          } else {
            alert('Format file JSON tidak valid. Pastikan berisi array data supplier.');
          }
        } catch {
          alert('Gagal membaca file JSON. Pastikan file dalam format JSON yang benar.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Cadangan Data & Ekspor</h2>
              <p className="text-xs text-slate-400">Unduh data atau impor cadangan katalog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          {importStatus && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg flex items-center border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Export CSV / Excel */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 flex items-center">
                <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" />
                Ekspor ke Excel / CSV
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Download seluruh kontak, kategori, alamat & minimal belanja format spreadsheet.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0 shadow-2xs"
            >
              Unduh CSV
            </button>
          </div>

          {/* Export JSON Backup */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 flex items-center">
                <Download className="w-4 h-4 mr-1.5 text-blue-600" />
                Cadangkan JSON (Backup Lengkap)
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Simpan seluruh database supplier beserta pricelist & riwayat PO.
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0 shadow-2xs"
            >
              Unduh JSON
            </button>
          </div>

          {/* Import JSON Backup */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 flex items-center">
                <Upload className="w-4 h-4 mr-1.5 text-purple-600" />
                Pulihkan / Impor JSON
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Unggah file JSON backup yang pernah Anda simpan sebelumnya.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0 shadow-2xs"
            >
              Pilih File
            </button>
          </div>

          {/* Reset to Default Starter Data */}
          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-rose-900 flex items-center">
                <RotateCcw className="w-4 h-4 mr-1.5 text-rose-600" />
                Reset ke Data Contoh Grosir
              </p>
              <p className="text-xs text-rose-700 mt-0.5">
                Muat ulang data contoh supplier sembako, snack, kosmetik & sabun.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin memuat ulang contoh data awal supplier grosir?')) {
                  onResetToDefault();
                  onClose();
                }
              }}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
