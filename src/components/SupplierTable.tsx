import React from 'react';
import { 
  Star, 
  MessageCircle, 
  Globe, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  Scale, 
  MapPin,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Supplier } from '../types';
import { 
  formatRupiah, 
  getCategoryBadgeColor, 
  getStatusBadgeColor, 
  getWhatsAppLink 
} from '../utils/formatters';

interface SupplierTableProps {
  suppliers: Supplier[];
  onViewDetail: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
  onToggleCompare: (id: string) => void;
  comparedIds: string[];
}

export const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  onViewDetail,
  onEdit,
  onDelete,
  onToggleCompare,
  comparedIds,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4 w-10 text-center">Pilih</th>
              <th className="py-3.5 px-4">Nama Perusahaan & Kota</th>
              <th className="py-3.5 px-4">Manager / Kontak</th>
              <th className="py-3.5 px-4">Kategori Produk</th>
              <th className="py-3.5 px-4">Min. Pembelian</th>
              <th className="py-3.5 px-4">Syarat Bayar & Kirim</th>
              <th className="py-3.5 px-4">Status & Rating</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {suppliers.map((supplier) => {
              const statusColors = getStatusBadgeColor(supplier.status);
              const isCompared = comparedIds.includes(supplier.id);
              const waLink = getWhatsAppLink(supplier.phone, supplier.companyName, supplier.managerName);

              return (
                <tr 
                  key={supplier.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onViewDetail(supplier)}
                >
                  {/* Select for Compare */}
                  <td 
                    className="py-3 px-4 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompare(supplier.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => onToggleCompare(supplier.id)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                  </td>

                  {/* Company Name & Location */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {supplier.companyName.replace(/PT\s|CV\s|UD\s/gi, '').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                          {supplier.companyName}
                        </p>
                        <p className="text-slate-400 text-xs flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                          {supplier.city}, {supplier.province}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Manager & Direct WA */}
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <p className="font-semibold text-slate-800">{supplier.managerName}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-slate-500">{supplier.phone}</span>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-1.5 py-0.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded text-[10px] font-bold"
                        title="Chat WA"
                      >
                        <MessageCircle className="w-3 h-3 mr-0.5" />
                        WA
                      </a>
                    </div>
                  </td>

                  {/* Categories */}
                  <td className="py-3.5 px-4 max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {supplier.categories.map((cat) => {
                        const colors = getCategoryBadgeColor(cat);
                        return (
                          <span
                            key={cat}
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
                          >
                            {cat}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Min Purchase */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 text-sm">
                      {formatRupiah(supplier.minPurchaseAmount)}
                    </p>
                    {supplier.minPurchaseUnitText && (
                      <p className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {supplier.minPurchaseUnitText}
                      </p>
                    )}
                  </td>

                  {/* Payment & Lead Time */}
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-800">
                      {supplier.paymentTerms.join(', ')}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kirim: {supplier.shippingLeadTime}
                    </p>
                  </td>

                  {/* Status & Rating */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColors.bg} ${statusColors.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusColors.dot}`} />
                      {supplier.status}
                    </span>
                    <div className="flex items-center text-amber-500 font-semibold mt-1 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      {supplier.rating.toFixed(1)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onEdit(supplier)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(supplier.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onViewDetail(supplier)}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                        title="Lihat Detail"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
