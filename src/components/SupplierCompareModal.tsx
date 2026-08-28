import React from 'react';
import { 
  X, 
  Scale, 
  Star, 
  MessageCircle, 
  Phone, 
  Check, 
  MapPin, 
  CreditCard, 
  Truck,
  Building2
} from 'lucide-react';
import { Supplier } from '../types';
import { formatRupiah, getCategoryBadgeColor, getStatusBadgeColor, getWhatsAppLink } from '../utils/formatters';

interface SupplierCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedSuppliers: Supplier[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onViewDetail: (supplier: Supplier) => void;
}

export const SupplierCompareModal: React.FC<SupplierCompareModalProps> = ({
  isOpen,
  onClose,
  comparedSuppliers,
  onRemoveFromCompare,
  onClearCompare,
  onViewDetail,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Perbandingan Supplier Grosir</h2>
              <p className="text-xs text-slate-400">
                Membandingkan {comparedSuppliers.length} supplier secara berdampingan
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {comparedSuppliers.length > 0 && (
              <button
                onClick={onClearCompare}
                className="px-3 py-1.5 text-xs text-rose-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Hapus Semua Pilihan
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table / Matrix */}
        <div className="p-4 sm:p-6 overflow-x-auto flex-1 text-xs">
          {comparedSuppliers.length === 0 ? (
            <div className="text-center py-16">
              <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-700">Belum ada supplier yang dipilih untuk dibanding</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Centang tombol "Bandingkan" pada kartu atau tabel supplier di katalog untuk menganalisis perbandingan harga & ketentuan.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 bg-slate-100 font-bold text-slate-700 text-left w-48 sticky left-0 z-10 border border-slate-200">
                    Parameter
                  </th>
                  {comparedSuppliers.map((supplier) => (
                    <th
                      key={supplier.id}
                      className="p-3 bg-white font-bold text-slate-900 text-left min-w-[240px] max-w-[280px] border border-slate-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{supplier.companyName}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] mt-1 ${getStatusBadgeColor(supplier.status).bg} ${getStatusBadgeColor(supplier.status).text}`}>
                            {supplier.status}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveFromCompare(supplier.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Hapus dari perbandingan"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Manager & Kontak */}
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-700 sticky left-0 border border-slate-200">
                    Manager & Kontak
                  </td>
                  {comparedSuppliers.map((s) => {
                    const waLink = getWhatsAppLink(s.phone, s.companyName, s.managerName);
                    return (
                      <td key={s.id} className="p-3 border border-slate-200">
                        <p className="font-bold text-slate-900">{s.managerName}</p>
                        <p className="text-slate-500 text-[11px]">{s.managerTitle || 'Manager'}</p>
                        <div className="flex items-center space-x-2 mt-1.5">
                          <span className="font-mono">{s.phone}</span>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold"
                          >
                            WA
                          </a>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Minimal Pembelian */}
                <tr className="bg-emerald-50/30">
                  <td className="p-3 bg-emerald-50 font-bold text-emerald-900 sticky left-0 border border-slate-200">
                    Minimal Pembelian (MOQ)
                  </td>
                  {comparedSuppliers.map((s) => (
                    <td key={s.id} className="p-3 border border-slate-200">
                      <p className="text-sm font-bold text-emerald-900">
                        {formatRupiah(s.minPurchaseAmount)}
                      </p>
                      {s.minPurchaseUnitText && (
                        <p className="text-[11px] text-emerald-700 mt-0.5">{s.minPurchaseUnitText}</p>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Kategori Produk */}
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-700 sticky left-0 border border-slate-200">
                    Kategori Produk
                  </td>
                  {comparedSuppliers.map((s) => (
                    <td key={s.id} className="p-3 border border-slate-200">
                      <div className="flex flex-wrap gap-1">
                        {s.categories.map((c) => {
                          const col = getCategoryBadgeColor(c);
                          return (
                            <span
                              key={c}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${col.bg} ${col.text} ${col.border}`}
                            >
                              {c}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Syarat Pembayaran */}
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-700 sticky left-0 border border-slate-200">
                    Syarat Bayar (TOP)
                  </td>
                  {comparedSuppliers.map((s) => (
                    <td key={s.id} className="p-3 border border-slate-200">
                      <div className="space-y-1">
                        {s.paymentTerms.map((pt) => (
                          <div key={pt} className="flex items-center text-slate-800 font-medium">
                            <Check className="w-3 h-3 text-emerald-600 mr-1 shrink-0" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Lead Time & Kebijakan Ongkir */}
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-700 sticky left-0 border border-slate-200">
                    Pengiriman & Ongkir
                  </td>
                  {comparedSuppliers.map((s) => (
                    <td key={s.id} className="p-3 border border-slate-200 space-y-1">
                      <p className="font-semibold text-slate-900">Lead Time: {s.shippingLeadTime}</p>
                      <p className="text-slate-500 text-[11px]">{s.shippingPolicy || '-'}</p>
                    </td>
                  ))}
                </tr>

                {/* Lokasi Gudang */}
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-700 sticky left-0 border border-slate-200">
                    Lokasi Gudang / Kota
                  </td>
                  {comparedSuppliers.map((s) => (
                    <td key={s.id} className="p-3 border border-slate-200">
                      <p className="font-bold text-slate-800">{s.city}, {s.province}</p>
                      <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">{s.address}</p>
                    </td>
                  ))}
                </tr>

                {/* Rating & Action */}
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-700 sticky left-0 border border-slate-200">
                    Rating & Aksi
                  </td>
                  {comparedSuppliers.map((s) => (
                    <td key={s.id} className="p-3 border border-slate-200">
                      <div className="flex items-center text-amber-500 font-bold mb-2">
                        <Star className="w-4 h-4 fill-amber-400 mr-1" />
                        {s.rating.toFixed(1)} / 5.0
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onViewDetail(s);
                        }}
                        className="w-full px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-center text-xs transition-colors"
                      >
                        Buka Detail
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
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
