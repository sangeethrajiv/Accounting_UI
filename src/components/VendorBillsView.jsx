import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  CreditCard,
  Layers,
  ChevronDown,
  ExternalLink,
  X,
  FileCheck2,
  RefreshCw
} from 'lucide-react';

export const INITIAL_VENDOR_BILLS = [
  {
    id: 'VB-1',
    number: 'BILL/2026/10/0198',
    vendorEn: 'Bosch Rexroth AG (Germany)',
    vendorAr: 'بوش ريكسروث ألمانيا',
    billDate: '2026-10-28',
    dueDate: '2026-11-28',
    reference: 'PO-2026-0198 (Axial Piston Pumps)',
    taxExcluded: 140869.57,
    vatAmount: 21130.43,
    total: 162000.0,
    amountDue: 162000.0,
    currency: 'SAR',
    status: 'To Approve', // 'Draft' | 'To Approve' | 'Approved' | 'Posted' | 'Paid'
    isInterCompany: false,
    companyId: 'HYD',
    companyName: 'Flames of Al-Yamama Hydraulic Co',
    costCenter: 'CC-101 Workshop Ops',
    lines: [
      { id: 1, desc: 'A10VSO Series 31 Axial Piston Variable Pump', qty: 4, unitPrice: 28500, tax: 15, total: 131100 },
      { id: 2, desc: 'High-Pressure Hydraulic Proportional Valve Set', qty: 2, unitPrice: 13434.78, tax: 15, total: 30900 },
    ],
    approvers: [
      { role: 'Warehouse Receiving', user: 'Fahad Al-Harbi', status: 'Verified', date: '2026-10-28 14:10' },
      { role: 'Procurement Specialist', user: 'Zaid Al-Ghamdi', status: 'Approved', date: '2026-10-29 09:30' },
      { role: 'Finance Controller', user: 'Tariq Al-Mansoor', status: 'Pending Approval', date: '-' },
    ]
  },
  {
    id: 'VB-2',
    number: 'BILL/2026/10/0312',
    vendorEn: 'Al Yamama Advanced Logistics Services Co',
    vendorAr: 'شركة اليمامة للخدمات اللوجستية المتقدمة (شركة شقيقة)',
    billDate: '2026-10-26',
    dueDate: '2026-11-10',
    reference: 'Mirrored from INV/2026/00005',
    taxExcluded: 13500.0,
    vatAmount: 2025.0,
    total: 15525.0,
    amountDue: 0.0,
    currency: 'SAR',
    status: 'Paid',
    isInterCompany: true,
    companyId: 'HYD',
    companyName: 'Flames of Al-Yamama Hydraulic Co',
    costCenter: 'CC-103 Logistics Support',
    lines: [
      { id: 1, desc: 'Heavy Lowbed Equipment Transport (Dammam Workshop to Jubail Port)', qty: 3, unitPrice: 4500, tax: 15, total: 15525 },
    ],
    approvers: [
      { role: 'Inter-Company Bridge', user: 'System Auto-Mirror', status: 'Reconciled', date: '2026-10-26 11:00' },
      { role: 'Finance Controller', user: 'Tariq Al-Mansoor', status: 'Auto-Approved', date: '2026-10-26 11:05' },
    ]
  },
  {
    id: 'VB-3',
    number: 'BILL/2026/10/0142',
    vendorEn: 'Dammam Steel & Chrome Shafts Co.',
    vendorAr: 'شركة صلب وكروم الدمام',
    billDate: '2026-10-24',
    dueDate: '2026-11-24',
    reference: 'PO-2026-0185 (Induction Rods)',
    taxExcluded: 42500.0,
    vatAmount: 6375.0,
    total: 48875.0,
    amountDue: 48875.0,
    currency: 'SAR',
    status: 'Approved',
    isInterCompany: false,
    companyId: 'HYD',
    companyName: 'Flames of Al-Yamama Hydraulic Co',
    costCenter: 'CC-101 Workshop Ops',
    lines: [
      { id: 1, desc: 'Hardened Chrome-Plated Hydraulic Piston Rod 90mm x 3m', qty: 10, unitPrice: 3200, tax: 15, total: 36800 },
      { id: 2, desc: 'Seamless Cold Drawn Hydraulic Cylinder Tube E355', qty: 5, unitPrice: 2100, tax: 15, total: 12075 },
    ],
    approvers: [
      { role: 'Workshop Supervisor', user: 'Adithya PL', status: 'Verified', date: '2026-10-24 16:00' },
      { role: 'Finance Manager', user: 'Tariq Al-Mansoor', status: 'Approved', date: '2026-10-25 10:15' },
    ]
  },
  {
    id: 'VB-4',
    number: 'BILL/2026/10/0115',
    vendorEn: 'Ready Mat Industrial Saudi',
    vendorAr: 'شركة ريدي مات الصناعية السعودية',
    billDate: '2026-10-22',
    dueDate: '2026-11-05',
    reference: 'PO-2026-0174 (Hydraulic Seal Kits)',
    taxExcluded: 16000.0,
    vatAmount: 2400.0,
    total: 18400.0,
    amountDue: 0.0,
    currency: 'SAR',
    status: 'Paid',
    isInterCompany: false,
    companyId: 'HYD',
    companyName: 'Flames of Al-Yamama Hydraulic Co',
    costCenter: 'CC-102 Spare Parts Inventory',
    lines: [
      { id: 1, desc: 'High-Pressure Polyurethane U-Cup Rod & Piston Seals', qty: 50, unitPrice: 250, tax: 15, total: 14375 },
      { id: 2, desc: 'FKM Viton O-Ring Assortment Kits (High Temp)', qty: 10, unitPrice: 350, tax: 15, total: 4025 },
    ],
    approvers: [
      { role: 'Warehouse Receiving', user: 'Fahad Al-Harbi', status: 'Verified', date: '2026-10-22 11:20' },
      { role: 'Finance Controller', user: 'Tariq Al-Mansoor', status: 'Approved & Paid', date: '2026-10-22 15:45' },
    ]
  },
  {
    id: 'VB-5',
    number: 'BILL/2026/10/0088',
    vendorEn: 'Saudi Aramco Lubricants & Oils',
    vendorAr: 'زيوت ومواد تشحيم أرامكو السعودية',
    billDate: '2026-10-18',
    dueDate: '2026-11-18',
    reference: 'PO-2026-0160 (ISO VG 46/68 Oil)',
    taxExcluded: 30000.0,
    vatAmount: 4500.0,
    total: 34500.0,
    amountDue: 34500.0,
    currency: 'SAR',
    status: 'Posted',
    isInterCompany: false,
    companyId: 'HYD',
    companyName: 'Flames of Al-Yamama Hydraulic Co',
    costCenter: 'CC-101 Workshop Ops',
    lines: [
      { id: 1, desc: 'Industrial Hydraulic Oil ISO VG 46 (208L Barrels)', qty: 12, unitPrice: 1800, tax: 15, total: 24840 },
      { id: 2, desc: 'Heavy Duty Anti-Wear Hydraulic Fluid ISO VG 68', qty: 5, unitPrice: 1680, tax: 15, total: 9660 },
    ],
    approvers: [
      { role: 'Store Keeper', user: 'Fahad Al-Harbi', status: 'Verified', date: '2026-10-18 09:00' },
      { role: 'Finance Controller', user: 'Tariq Al-Mansoor', status: 'Posted to GL', date: '2026-10-18 13:20' },
    ]
  },
  {
    id: 'VB-6',
    number: 'BILL/2026/11/0014',
    vendorEn: 'Saudi Customs & ZATCA Port Clearance',
    vendorAr: 'هيئة الزكاة والضريبة والجمارك - ميناء الملك عبد العزيز',
    billDate: '2026-11-02',
    dueDate: '2026-11-09',
    reference: 'Customs Declaration #8841209',
    taxExcluded: 21000.0,
    vatAmount: 3150.0,
    total: 24150.0,
    amountDue: 24150.0,
    currency: 'SAR',
    status: 'Draft',
    isInterCompany: false,
    companyId: 'HYD',
    companyName: 'Flames of Al-Yamama Hydraulic Co',
    costCenter: 'CC-104 Landed Costs & Customs',
    lines: [
      { id: 1, desc: 'Customs Duty 5% on Imported Hydraulic Valves', qty: 1, unitPrice: 11000, tax: 15, total: 12650 },
      { id: 2, desc: 'Port Handling, Storage & Inspection Fee', qty: 1, unitPrice: 10000, tax: 15, total: 11500 },
    ],
    approvers: [
      { role: 'Customs Broker', user: 'Sami Al-Otaibi', status: 'Drafting', date: '2026-11-02 10:00' },
    ]
  }
];

export default function VendorBillsView({
  t,
  isRtl,
  activeCompany,
  onRegisterPayment,
  bills: externalBills,
  onUpdateBills,
  onCreateNewBill,
}) {
  const [internalBills, setInternalBills] = useState(INITIAL_VENDOR_BILLS);
  const bills = externalBills || internalBills;
  const setBills = onUpdateBills || setInternalBills;
  const [activeChip, setActiveChip] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);

  // Filter bills
  const filteredBills = bills.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      b.number.toLowerCase().includes(q) ||
      b.vendorEn.toLowerCase().includes(q) ||
      b.vendorAr.includes(searchQuery) ||
      b.reference.toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (activeChip === 'All') return true;
    if (activeChip === 'To Approve') return b.status === 'To Approve';
    if (activeChip === 'Approved') return b.status === 'Approved';
    if (activeChip === 'Posted') return b.status === 'Posted';
    if (activeChip === 'Paid') return b.status === 'Paid';
    if (activeChip === 'Inter-Company') return b.isInterCompany;
    return true;
  });

  // Action handlers demonstrating 3-tier approvals
  const handleRequestApproval = (billId) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'To Approve' } : b))
    );
    if (selectedBill?.id === billId) {
      setSelectedBill((prev) => ({ ...prev, status: 'To Approve' }));
    }
  };

  const handleApproveBill = (billId) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'Approved' } : b))
    );
    if (selectedBill?.id === billId) {
      setSelectedBill((prev) => ({ ...prev, status: 'Approved' }));
    }
  };

  const handlePostToGL = (billId) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'Posted' } : b))
    );
    if (selectedBill?.id === billId) {
      setSelectedBill((prev) => ({ ...prev, status: 'Posted' }));
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Draft':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            {t('Draft', 'مسودة')}
          </span>
        );
      case 'To Approve':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 justify-center">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>{t('To Approve', 'بانتظار الاعتماد')}</span>
          </span>
        );
      case 'Approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1 justify-center">
            <ShieldCheck className="w-3 h-3 text-blue-700" />
            <span>{t('Approved', 'معتمد')}</span>
          </span>
        );
      case 'Posted':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 justify-center">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>{t('Posted to GL', 'مرحل لدفتر الأستاذ')}</span>
          </span>
        );
      case 'Paid':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-900 border border-teal-300 flex items-center gap-1 justify-center">
            <CheckCircle2 className="w-3 h-3 text-teal-800" />
            <span>{t('Paid', 'مسدد')}</span>
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'All', labelEn: 'All Bills', labelAr: 'كافة الفواتير', count: bills.length },
            { id: 'To Approve', labelEn: 'To Approve', labelAr: 'بانتظار الاعتماد', count: bills.filter((b) => b.status === 'To Approve').length, highlight: true },
            { id: 'Approved', labelEn: 'Approved', labelAr: 'معتمدة', count: bills.filter((b) => b.status === 'Approved').length },
            { id: 'Posted', labelEn: 'Posted', labelAr: 'مرحلة', count: bills.filter((b) => b.status === 'Posted').length },
            { id: 'Paid', labelEn: 'Paid', labelAr: 'مسددة', count: bills.filter((b) => b.status === 'Paid').length },
            { id: 'Inter-Company', labelEn: 'Inter-Company Mirror', labelAr: 'فواتير الشركات الشقيقة', count: bills.filter((b) => b.isInterCompany).length },
          ].map((chip) => {
            const isSelected = activeChip === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveChip(chip.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : chip.highlight && chip.count > 0
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{t(chip.labelEn, chip.labelAr)}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input & New Bill Button */}
        <div className="flex items-center gap-2">
          {onCreateNewBill && (
            <button
              onClick={onCreateNewBill}
              className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('New Bill', 'فاتورة جديدة')}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus-within:border-blue-700 focus-within:bg-white w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search vendor, bill #, PO...', 'بحث عن مورد، رقم فاتورة...')}
              className="bg-transparent text-xs text-slate-700 focus:outline-none w-full"
            />
            {searchQuery && (
              <X
                onClick={() => setSearchQuery('')}
                className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Vendor Bills Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">{t('Bill Number', 'رقم الفاتورة')}</th>
                <th className="py-3 px-3 text-start">{t('Vendor Name', 'اسم المورد')}</th>
                <th className="py-3 px-3 text-start">{t('Bill Date', 'تاريخ الفاتورة')}</th>
                <th className="py-3 px-3 text-start">{t('Due Date', 'تاريخ الاستحقاق')}</th>
                <th className="py-3 px-3 text-start">{t('PO / Inter-Company Ref', 'مرجع الشراء / الربط الداخلي')}</th>
                <th className="py-3 px-3 text-end">{t('Untaxed', 'بدون ضريبة')}</th>
                <th className="py-3 px-3 text-end">{t('Total (SAR)', 'الإجمالي')}</th>
                <th className="py-3 px-3 text-end">{t('Amount Due', 'المستحق')}</th>
                <th className="py-3 px-3 text-center">{t('Approval & GL Status', 'حالة الاعتماد والترحيل')}</th>
                <th className="py-3 px-4 text-center">{t('Quick Demo Action', 'إجراء العرض السريع')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((bill) => (
                <tr
                  key={bill.id}
                  onClick={() => setSelectedBill(bill)}
                  className="hover:bg-blue-50/40 cursor-pointer transition"
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>{bill.number}</span>
                    {bill.isInterCompany && (
                      <span className="text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200 px-1.5 py-0.2 rounded-full">
                        {t('Auto IC', 'ربط آلي')}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">
                    <div>{t(bill.vendorEn, bill.vendorAr)}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{bill.costCenter}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono">{bill.billDate}</td>
                  <td className="py-3 px-3 text-slate-600 font-mono">{bill.dueDate}</td>
                  <td className="py-3 px-3 text-slate-700">
                    <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {bill.reference}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-end font-mono text-slate-600">
                    SAR {bill.taxExcluded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-end font-mono font-bold text-slate-900">
                    SAR {bill.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-end font-mono font-bold">
                    <span className={bill.amountDue > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                      SAR {bill.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">{renderStatusBadge(bill.status)}</td>
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    {bill.status === 'Draft' && (
                      <button
                        onClick={() => handleRequestApproval(bill.id)}
                        className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold shadow-2xs transition"
                      >
                        {t('Request Approval', 'طلب اعتماد')}
                      </button>
                    )}
                    {bill.status === 'To Approve' && (
                      <button
                        onClick={() => handleApproveBill(bill.id)}
                        className="px-2.5 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-bold shadow-2xs transition"
                      >
                        {t('Approve Bill', 'اعتماد الفاتورة')}
                      </button>
                    )}
                    {bill.status === 'Approved' && (
                      <button
                        onClick={() => handlePostToGL(bill.id)}
                        className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold shadow-2xs transition"
                      >
                        {t('Post to Ledger', 'ترحيل للأستاذ')}
                      </button>
                    )}
                    {bill.status === 'Posted' && onRegisterPayment && (
                      <button
                        onClick={() =>
                          onRegisterPayment({
                            type: 'send',
                            partner: bill.vendorEn,
                            amount: bill.amountDue,
                            memo: `Payment for ${bill.number}`,
                            billId: bill.id,
                          })
                        }
                        className="px-2.5 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold shadow-2xs transition flex items-center gap-1 mx-auto"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>{t('Pay Bill', 'سداد الفاتورة')}</span>
                      </button>
                    )}
                    {bill.status === 'Paid' && (
                      <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {t('Fully Settled', 'مسددة بالكامل')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal / Drawer for Selected Bill */}
      {selectedBill && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          onClick={() => setSelectedBill(null)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">
                  {t('Vendor Bill Inspection', 'مراجعة وتدقيق فاتورة المورد')}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
                  <span>{selectedBill.number}</span>
                  {renderStatusBadge(selectedBill.status)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBill(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Partner & Cost Center */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('Vendor', 'المورد')}</span>
                  <span className="font-bold text-slate-900 text-sm">{t(selectedBill.vendorEn, selectedBill.vendorAr)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('Cost Center / Analytic', 'مركز التكلفة التحليلي')}</span>
                  <span className="font-mono font-bold text-blue-800">{selectedBill.costCenter}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('Reference / PO', 'أمر الشراء المرتبط')}</span>
                  <span className="font-mono text-slate-700">{selectedBill.reference}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('Bill Date', 'تاريخ الفاتورة')}</span>
                  <span className="font-mono text-slate-700">{selectedBill.billDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('Due Date', 'تاريخ الاستحقاق')}</span>
                  <span className="font-mono text-slate-700">{selectedBill.dueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('Total Amount', 'إجمالي الفاتورة')}</span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    SAR {selectedBill.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* 3-Tier Approval Audit Timeline */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>{t('3-Tier Approval Audit Trail', 'سجل مسار الموافقات والصلاحيات (3-Tier)')}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {selectedBill.approvers.map((appr, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">{appr.role}</div>
                      <div className="font-bold text-slate-800">{appr.user}</div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className={`font-semibold px-1.5 py-0.2 rounded ${
                            appr.status.includes('Approved') || appr.status.includes('Verified') || appr.status.includes('Reconciled')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {appr.status}
                        </span>
                        <span className="text-slate-400 font-mono">{appr.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Line Items */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 text-start">{t('Product / Service Description', 'البيان والمنتج')}</th>
                      <th className="py-2 px-3 text-center">{t('Qty', 'الكمية')}</th>
                      <th className="py-2 px-3 text-end">{t('Unit Price', 'السعر')}</th>
                      <th className="py-2 px-3 text-center">{t('VAT %', 'الضريبة')}</th>
                      <th className="py-2 px-3 text-end">{t('Total (SAR)', 'الإجمالي')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedBill.lines.map((l) => (
                      <tr key={l.id}>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{l.desc}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{l.qty}</td>
                        <td className="py-2.5 px-3 text-end font-mono">
                          {l.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">{l.tax}%</td>
                        <td className="py-2.5 px-3 text-end font-mono font-bold text-slate-900">
                          {l.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>{t('Untaxed Amount:', 'المبلغ الخاضع للضريبة:')}</span>
                    <span className="font-mono font-bold">
                      SAR {selectedBill.taxExcluded.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t('VAT 15% (Input Recoverable):', 'ضريبة القيمة المضافة 15%:')}</span>
                    <span className="font-mono font-bold text-blue-700">
                      SAR {selectedBill.vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="border-t border-slate-300 pt-1.5 flex justify-between font-black text-slate-900 text-sm">
                    <span>{t('Total Payable:', 'المبلغ الإجمالي:')}</span>
                    <span className="font-mono">
                      SAR {selectedBill.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedBill.status === 'Draft' && (
                  <button
                    onClick={() => handleRequestApproval(selectedBill.id)}
                    className="px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition"
                  >
                    {t('Submit for 3-Tier Approval', 'إرسال للاعتماد')}
                  </button>
                )}
                {selectedBill.status === 'To Approve' && (
                  <button
                    onClick={() => handleApproveBill(selectedBill.id)}
                    className="px-3.5 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('Approve as Finance Manager', 'اعتماد المدير المالي')}</span>
                  </button>
                )}
                {selectedBill.status === 'Approved' && (
                  <button
                    onClick={() => handlePostToGL(selectedBill.id)}
                    className="px-3.5 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>{t('Post to General Ledger', 'ترحيل إلى دفتر الأستاذ العام')}</span>
                  </button>
                )}
                {selectedBill.status === 'Posted' && onRegisterPayment && (
                  <button
                    onClick={() => {
                      setSelectedBill(null);
                      onRegisterPayment({
                        type: 'send',
                        partner: selectedBill.vendorEn,
                        amount: selectedBill.amountDue,
                        memo: `Payment for ${selectedBill.number}`,
                        billId: selectedBill.id,
                      });
                    }}
                    className="px-3.5 py-1.5 rounded-md bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{t('Register Payment Voucher', 'تسجيل سند الصرف')}</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedBill(null)}
                className="px-4 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition"
              >
                {t('Close', 'إغلاق')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

