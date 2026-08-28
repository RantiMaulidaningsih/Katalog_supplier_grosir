import { ProductCategory, Supplier } from '../types';

export const formatRupiah = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const parseRupiahInput = (input: string): number => {
  const clean = input.replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
};

export const formatWhatsAppNumber = (phone: string): string => {
  // Remove non-numeric characters
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.substring(1);
  } else if (clean.startsWith('+62')) {
    clean = clean.substring(1);
  } else if (!clean.startsWith('62') && clean.length > 8) {
    clean = '62' + clean;
  }
  return clean;
};

export const getWhatsAppLink = (phone: string, companyName: string, managerName?: string): string => {
  const cleanNumber = formatWhatsAppNumber(phone);
  const text = encodeURIComponent(
    `Halo ${managerName ? `Bpk/Ibu ${managerName}` : 'Admin'} (${companyName}), saya ingin menanyakan katalog harga grosir terbaru dan syarat pemesanan toko.`
  );
  return `https://wa.me/${cleanNumber}?text=${text}`;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getCategoryBadgeColor = (category: ProductCategory): { bg: string; text: string; border: string } => {
  switch (category) {
    case 'Sembako':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'Makanan Ringan':
      return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    case 'Kecantikan & Kosmetik':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'Kebutuhan Rumah Tangga':
      return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
    case 'Minuman & Susu':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'Bumbu & Bahan Dapur':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'Perlengkapan & Plastik':
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
};

export const getStatusBadgeColor = (status: string): { bg: string; text: string; dot: string } => {
  switch (status) {
    case 'Mitra Utama':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700 font-semibold', dot: 'bg-emerald-500' };
    case 'Aktif':
      return { bg: 'bg-blue-50', text: 'text-blue-700 font-medium', dot: 'bg-blue-500' };
    case 'Dalam Penjajakan':
      return { bg: 'bg-amber-50', text: 'text-amber-700 font-medium', dot: 'bg-amber-500' };
    case 'Cadangan':
      return { bg: 'bg-purple-50', text: 'text-purple-700 font-medium', dot: 'bg-purple-500' };
    case 'Non-Aktif':
      return { bg: 'bg-slate-100', text: 'text-slate-600 font-medium', dot: 'bg-slate-400' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700 font-medium', dot: 'bg-slate-500' };
  }
};

export const exportSuppliersToCSV = (suppliers: Supplier[]) => {
  const headers = [
    'Nama Perusahaan',
    'Manager / Kontak',
    'Jabatan',
    'No HP / WhatsApp',
    'Email',
    'Website',
    'Alamat',
    'Kota',
    'Provinsi',
    'Kategori',
    'Minimal Pembelian (Rp)',
    'Keterangan Min. Beli',
    'Syarat Pembayaran',
    'Lead Time Kirim',
    'Kebijakan Ongkir',
    'Status',
    'Rating',
    'Bank',
    'No Rekening',
    'Atas Nama',
    'Catatan Khusus',
  ];

  const rows = suppliers.map((s) => [
    `"${s.companyName.replace(/"/g, '""')}"`,
    `"${s.managerName.replace(/"/g, '""')}"`,
    `"${(s.managerTitle || '').replace(/"/g, '""')}"`,
    `"${s.phone}"`,
    `"${s.email || ''}"`,
    `"${s.website || ''}"`,
    `"${s.address.replace(/"/g, '""')}"`,
    `"${s.city}"`,
    `"${s.province}"`,
    `"${s.categories.join(', ')}"`,
    s.minPurchaseAmount,
    `"${(s.minPurchaseUnitText || '').replace(/"/g, '""')}"`,
    `"${s.paymentTerms.join('; ')}"`,
    `"${s.shippingLeadTime}"`,
    `"${(s.shippingPolicy || '').replace(/"/g, '""')}"`,
    `"${s.status}"`,
    s.rating,
    `"${s.bankName || ''}"`,
    `"${s.bankAccountNumber || ''}"`,
    `"${s.bankAccountHolder || ''}"`,
    `"${(s.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `katalog_supplier_grosir_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
