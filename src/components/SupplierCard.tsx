import React from 'react';
import { 
  Building2, 
  UserCheck, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Globe, 
  CreditCard, 
  Truck, 
  Star, 
  ChevronRight, 
  MoreVertical, 
  ExternalLink,
  Edit2,
  Trash2,
  Package,
  Clock,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { Supplier } from '../types';
import { 
  formatRupiah, 
  getCategoryBadgeColor, 
  getStatusBadgeColor, 
  getWhatsAppLink 
} from '../utils/formatters';

interface SupplierCardProps {
  supplier: Supplier;
  onViewDetail: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
  onToggleCompare: (id: string) => void;
  isCompared: boolean;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  onViewDetail,
  onEdit,
  onDelete,
  onToggleCompare,
  isCompared,
}) => {
  const statusColors = getStatusBadgeColor(supplier.status);
  const waLink = getWhatsAppLink(supplier.phone, supplier.companyName, supplier.managerName);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Section */}
      <div className="p-4 sm:p-5">
        {/* Header: Company Name, Status Badge & Options */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
              {supplier.companyName.replace(/PT\s|CV\s|UD\s/gi, '').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate leading-snug group-hover:text-emerald-700 transition-colors">
                {supplier.companyName}
              </h2>
              <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center font-medium">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                  {supplier.rating.toFixed(1)}
                </span>
                <span>•</span>
                <span className="truncate flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                  {supplier.city}, {supplier.province}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            {/* Status Badge */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusColors.dot}`} />
              {supplier.status}
            </span>
          </div>
        </div>

        {/* Categories Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {supplier.categories.map((cat) => {
            const colors = getCategoryBadgeColor(cat);
            return (
              <span
                key={cat}
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
              >
                {cat}
              </span>
            );
          })}
        </div>

        {/* Manager & Contact Info Box */}
        <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-100 mb-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-slate-700 font-medium truncate">
              <UserCheck className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <span className="truncate">
                {supplier.managerName}
                {supplier.managerTitle ? ` (${supplier.managerTitle})` : ''}
              </span>
            </div>
            
            {/* Direct Quick WhatsApp Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors shrink-0 shadow-2xs"
              title="Chat WhatsApp dengan Manager"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              <span>WA</span>
            </a>
          </div>

          <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60">
            <div className="flex items-center">
              <Phone className="w-3 h-3 text-slate-400 mr-1.5 shrink-0" />
              <span>{supplier.phone}</span>
            </div>
            {supplier.website && (
              <a
                href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
              >
                <Globe className="w-3 h-3 mr-1" />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>

        {/* Minimum Purchase Highlight Card */}
        <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100 mb-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-800 font-medium">Minimal Pembelian (MOQ):</span>
            <span className="text-sm font-bold text-emerald-900">
              {formatRupiah(supplier.minPurchaseAmount)}
            </span>
          </div>
          {supplier.minPurchaseUnitText && (
            <p className="text-[11px] text-emerald-700 mt-1 line-clamp-1">
              {supplier.minPurchaseUnitText}
            </p>
          )}
        </div>

        {/* Payment & Logistics Specs */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
          <div className="flex items-start space-x-1.5">
            <CreditCard className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Syarat Bayar</p>
              <p className="font-semibold text-slate-800 line-clamp-1">
                {supplier.paymentTerms.join(', ')}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-1.5">
            <Truck className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Lead Time Kirim</p>
              <p className="font-semibold text-slate-800 line-clamp-1">
                {supplier.shippingLeadTime}
              </p>
            </div>
          </div>
        </div>

        {/* Sample Products Peek */}
        {supplier.products && supplier.products.length > 0 && (
          <div className="mt-3.5 pt-2.5 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
              <span className="font-medium flex items-center">
                <Package className="w-3 h-3 mr-1 text-slate-400" />
                Pricelist ({supplier.products.length} Produk)
              </span>
              <span className="text-emerald-700 font-semibold cursor-pointer" onClick={() => onViewDetail(supplier)}>
                Lihat Semua
              </span>
            </div>
            <div className="space-y-1">
              {supplier.products.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-slate-700 truncate max-w-[65%] font-medium">
                    {item.name}
                  </span>
                  <span className="text-slate-900 font-bold shrink-0">
                    {formatRupiah(item.wholesalePrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
        {/* Compare Checkbox */}
        <button
          onClick={() => onToggleCompare(supplier.id)}
          className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            isCompared
              ? 'bg-indigo-100 text-indigo-700 font-semibold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
          }`}
          title="Bandingkan supplier ini"
        >
          <Scale className="w-3 h-3 mr-1" />
          <span>{isCompared ? 'Terpilih' : 'Bandingkan'}</span>
        </button>

        {/* Action Group */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onEdit(supplier)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded-md transition-colors"
            title="Edit Data Supplier"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(supplier.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Hapus Supplier"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => onViewDetail(supplier)}
            className="inline-flex items-center px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all shadow-2xs group-hover:bg-emerald-700"
          >
            <span>Detail</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
