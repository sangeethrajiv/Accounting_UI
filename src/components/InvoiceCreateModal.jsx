import React, { useState, useEffect } from 'react';
import {
  X, Save, CheckCircle2, Plus, Trash2, QrCode, FileText,
  Building2, Calendar, AlertCircle, CreditCard, Printer
} from 'lucide-react';

const SAMPLE_PARTNERS = [
  { id: 'p1', nameEn: 'Neom Bay Infrastructure JV', nameAr: 'ائتلاف البنية التحتية خليج نيوم', vat: '300554433200003' },
  { id: 'p2', nameEn: 'Riyadh Metro Construction Corp.', nameAr: 'شركة إنشاءات مترو الرياض', vat: '300987654300003' },
  { id: 'p3', nameEn: 'Al-Futtaim Saudi Contracting', nameAr: 'شركة الفطيم للمقاولات السعودية', vat: '300112233400003' },
  { id: 'p4', nameEn: 'Acme Arabia Industrial Corp.', nameAr: 'شركة أكمي العربية الصناعية', vat: '300445566700003' },
  { id: 'p5', nameEn: 'Red Sea Drilling & Marine Services', nameAr: 'خدمات البحر الأحمر للحفر والملاحة', vat: '300778899000003' },
  { id: 'p6', nameEn: 'Al Yamama Hydraulic Workshop Co. (IC)', nameAr: 'شركة ورشة اليمامة للهيدروليك (شركة شقيقة)', vat: '300023456700003' },
  { id: 'p7', nameEn: 'Arabian Cement Manufacturing Co.', nameAr: 'شركة الأسمنت العربية الصناعية', vat: '300665544300003' },
  { id: 'p8', nameEn: 'Al-Tamimi Transport & Fleet Services', nameAr: 'نقليات التميمي وخدمات الأسطول', vat: '300889911200003' },
  { id: 'p9', nameEn: 'Ready Mat Industrial Saudi', nameAr: 'شركة ريدي مات الصناعية السعودية', vat: '300065432100003' },
  { id: 'p10', nameEn: 'Bosch Rexroth AG (Germany)', nameAr: 'بوش ريكسروث ألمانيا', vat: '300054321000003' },
  { id: 'p11', nameEn: 'Dammam Steel & Chrome Shafts Co.', nameAr: 'شركة صلب وكروم الدمام', vat: '300043210900003' },
  { id: 'p12', nameEn: 'Gulf Machinery & Hydraulic Spares', nameAr: 'شركة آليات الخليج وقطع الهيدروليك', vat: '300032109800003' },
];

const ANALYTIC_ACCOUNTS = [
  { id: 'WORKSHOP-OPS', name: 'WORKSHOP-OPS (General Hydraulic Overhaul)' },
  { id: 'CC-101 Workshop Ops', name: 'CC-101 Workshop Ops (Cylinder & Pump Repair)' },
  { id: 'CC-102 Spare Parts', name: 'CC-102 Spare Parts (Parker & Rexroth)' },
  { id: 'CC-201 Heavy Leasing', name: 'CC-201 Heavy Leasing (Cranes & Fleet)' },
  { id: 'CC-301 Distribution', name: 'CC-301 Distribution (Pumps & Valves)' },
  { id: 'CC-401 Fleet Transport', name: 'CC-401 Fleet Transport (Lowbed Logistics)' },
  { id: 'NEOM-HYD-01', name: 'NEOM-HYD-01 (Neom Bay Infrastructure)' },
  { id: 'RY-METRO-04', name: 'RY-METRO-04 (Riyadh Metro Maintenance)' },
  { id: 'ARAMCO-EXP-08', name: 'ARAMCO-EXP-08 (Aramco Site Overhaul)' },
  { id: 'DAMMAM-SRV-02', name: 'DAMMAM-SRV-02 (Eastern Province Spares)' },
];

const parseDateToYmd = (dateVal, fallback) => {
  if (!dateVal) return fallback;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) return dateVal;
  const months = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };
  const parts = String(dateVal).trim().split(/\s+/);
  if (parts.length >= 2) {
    const mStr = parts[0].toLowerCase().slice(0, 3);
    const day = parts[1].replace(/\D/g, '').padStart(2, '0');
    if (months[mStr] && day) {
      return `2026-${months[mStr]}-${day}`;
    }
  }
  return fallback;
};

export default function InvoiceCreateModal({
  isOpen,
  onClose,
  onSave,
  type = 'customer', // 'customer' | 'vendor'
  t,
  isRtl,
  companies = [],
  activeCompany,
  invoice = null,
  onRegisterPayment,
}) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [partnerName, setPartnerName] = useState(SAMPLE_PARTNERS[0].nameEn);
  const [partnerVat, setPartnerVat] = useState(SAMPLE_PARTNERS[0].vat);
  const [companyId, setCompanyId] = useState(activeCompany?.id || (companies[0] ? companies[0].id : 'HYD'));
  const [invoiceDate, setInvoiceDate] = useState(todayStr);
  const [paymentTerms, setPaymentTerms] = useState('30 Days');
  const [proformaRef, setProformaRef] = useState(`SO-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [forceDate, setForceDate] = useState(todayStr);
  const [journal, setJournal] = useState(type === 'vendor' ? 'Vendor Bills (SAR)' : 'Customer Invoices (SAR)');
  const [status, setStatus] = useState('Draft');
  const [invNumber, setInvNumber] = useState('');
  const [invoiceSubtype, setInvoiceSubtype] = useState('credit');

  // Line items state
  const [lines, setLines] = useState([
    {
      id: 1,
      descEn: type === 'vendor' ? 'OEM Hydraulic Pump Overhaul Kit' : 'Bosch Rexroth A4VG250 Hydraulic Cylinder Overhaul',
      descAr: type === 'vendor' ? 'طقم إصلاح مضخة هيدروليك أصلية' : 'توضيب أسطوانة هيدروليك بوش ريكسروث',
      analytic: 'WORKSHOP-OPS',
      qty: 1,
      price: type === 'vendor' ? 12500 : 25000,
    },
  ]);

  // Sync state when invoice changes or modal opens
  useEffect(() => {
    if (invoice) {
      setPartnerName(invoice.customerEn || SAMPLE_PARTNERS[0].nameEn);
      setPartnerVat(invoice.vatNo || SAMPLE_PARTNERS[0].vat);
      setCompanyId(invoice.companyId || (companies[0]?.id || 'HYD'));
      setInvoiceDate(parseDateToYmd(invoice.invoiceDate || invoice.date, todayStr));
      setForceDate(invoice.forceDate || todayStr);
      setPaymentTerms(
        invoice.invoiceSubtype === 'cash'
          ? 'Immediate'
          : invoice.dueDateText?.includes('15')
          ? '15 Days'
          : '30 Days'
      );
      setProformaRef(invoice.proformaRef && invoice.proformaRef !== '-' ? invoice.proformaRef : `SO-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setJournal(invoice.type === 'vendor' ? 'Vendor Bills (SAR)' : 'Customer Invoices (SAR)');
      setStatus(invoice.status || 'Draft');
      setInvNumber(invoice.number || '');
      setInvoiceSubtype(invoice.invoiceSubtype || (type === 'vendor' ? 'vendor' : 'credit'));
      if (invoice.lines && invoice.lines.length > 0) {
        setLines(
          invoice.lines.map((l, idx) => ({
            id: l.id || Date.now() + idx,
            descEn: l.descEn || '',
            descAr: l.descAr || '',
            analytic: l.analytic || 'WORKSHOP-OPS',
            qty: Number(l.qty) || 1,
            price: Number(l.price) || 0,
          }))
        );
      }
    } else {
      // Clean new invoice state
      setPartnerName(SAMPLE_PARTNERS[0].nameEn);
      setPartnerVat(SAMPLE_PARTNERS[0].vat);
      setCompanyId(activeCompany?.id || (companies[0] ? companies[0].id : 'HYD'));
      setInvoiceDate(todayStr);
      setForceDate(todayStr);
      setPaymentTerms('30 Days');
      setProformaRef(`SO-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setJournal(type === 'vendor' ? 'Vendor Bills (SAR)' : 'Customer Invoices (SAR)');
      setStatus('Draft');
      setInvNumber('');
      setInvoiceSubtype(type === 'vendor' ? 'vendor' : 'credit');
      setLines([
        {
          id: 1,
          descEn: type === 'vendor' ? 'OEM Hydraulic Pump Overhaul Kit' : 'Bosch Rexroth A4VG250 Hydraulic Cylinder Overhaul',
          descAr: type === 'vendor' ? 'طقم إصلاح مضخة هيدروليك أصلية' : 'توضيب أسطوانة هيدروليك بوش ريكسروث',
          analytic: 'WORKSHOP-OPS',
          qty: 1,
          price: type === 'vendor' ? 12500 : 25000,
        },
      ]);
    }
  }, [invoice, isOpen, type, activeCompany]);

  const handlePartnerChange = (e) => {
    const selected = SAMPLE_PARTNERS.find((p) => p.nameEn === e.target.value);
    if (selected) {
      setPartnerName(selected.nameEn);
      setPartnerVat(selected.vat);
    } else {
      setPartnerName(e.target.value);
    }
  };

  const handleAddLine = () => {
    setLines([
      ...lines,
      {
        id: Date.now(),
        descEn: 'High-Pressure Hydraulic Seal Kit & Chrome Plating',
        descAr: 'طقم سدادات ضغط عالي وطلاء كروم صلب',
        analytic: 'WORKSHOP-OPS',
        qty: 1,
        price: 5000,
      },
    ]);
  };

  const handleRemoveLine = (id) => {
    if (lines.length === 1) return;
    setLines(lines.filter((l) => l.id !== id));
  };

  const handleLineChange = (id, field, value) => {
    setLines(
      lines.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  // Calculations
  const taxExcluded = lines.reduce((acc, l) => acc + (Number(l.qty) || 0) * (Number(l.price) || 0), 0);
  const vatAmount = taxExcluded * 0.15;
  const totalAmount = taxExcluded + vatAmount;

  const handleFinalSubmit = (submittedStatus) => {
    const comp = companies.find((c) => c.id === companyId) || activeCompany;
    const finalNumber =
      invNumber ||
      (invoice ? invoice.number : null) ||
      `${type === 'vendor' ? 'RBILL/2026/11/' : 'INV/2026/11/'}${String(Math.floor(100 + Math.random() * 900))}`;

    const savedInvoice = {
      ...(invoice || {}),
      id: invoice ? invoice.id : `INV-${Date.now()}`,
      number: finalNumber,
      proformaRef: proformaRef || finalNumber,
      customerEn: partnerName,
      customerAr: SAMPLE_PARTNERS.find((p) => p.nameEn === partnerName)?.nameAr || (invoice?.customerAr || partnerName),
      vatNo: partnerVat,
      invoiceDate: invoiceDate,
      date: invoiceDate,
      forceDate: forceDate,
      companyId: comp?.id || 'HYD',
      companyName: comp?.nameEn || 'Al Yamama Hydraulic Workshop Co.',
      status: submittedStatus || status,
      zatcaStatus:
        (submittedStatus || status) === 'Posted'
          ? 'CLEARED (QR)'
          : (submittedStatus || status) === 'Proforma'
          ? 'Proforma (No XML)'
          : (submittedStatus || status) === 'Paid'
          ? 'CLEARED (QR)'
          : 'Not Submitted',
      lines: lines.map((l) => ({
        ...l,
        qty: Number(l.qty) || 1,
        price: Number(l.price) || 0,
      })),
      taxExcluded: taxExcluded,
      total: totalAmount,
      amountDue: (submittedStatus || status) === 'Paid' ? 0 : totalAmount,
      invoiceSubtype: invoiceSubtype,
      type: type || invoice?.type || 'customer',
    };

    onSave(savedInvoice);
    onClose();
  };

  // Helper for subtitle display
  const getSubtitle = () => {
    if (invoice) {
      if (invoiceSubtype === 'cash') return t('CASH CUSTOMER INVOICE', 'فاتورة مبيعات نقدية');
      if (invoiceSubtype === 'credit') return t('CREDIT CUSTOMER INVOICE', 'فاتورة مبيعات آجل');
      if (invoiceSubtype === 'proforma') return t('PROFORMA INVOICE', 'فاتورة مبدئية (بروفرما)');
      if (invoiceSubtype === 'progressive') return t('PROGRESSIVE INVOICE', 'فاتورة إنجاز (مستخلص)');
      if (invoiceSubtype === 'refund') return t('CREDIT NOTE (REFUND)', 'إشعار دائن (مرتجع)');
      return type === 'vendor' ? t('VENDOR BILL', 'فاتورة مشتريات') : t('CUSTOMER INVOICE', 'فاتورة مبيعات');
    }
    return type === 'vendor' ? t('NEW VENDOR BILL', 'فاتورة مشتريات جديدة') : t('NEW CUSTOMER INVOICE', 'فاتورة مبيعات جديدة');
  };

  // Helper for status bar active step
  const isDraftStep = status === 'Draft';
  const isProformaStep = status === 'Proforma';
  const isPostedStep = status === 'Posted' || status === 'Paid' || status === 'Sent' || status === 'Partially Paid';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Top Control Panel (Odoo 12 Style Action Bar) */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFinalSubmit('Draft')}
              className="px-3.5 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t('Save as Draft', 'حفظ كمسودة')}</span>
            </button>
            <button
              onClick={() => handleFinalSubmit('Posted')}
              className="px-3.5 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('Validate & Clear ZATCA', 'اعتماد وختم الزكاة')}</span>
            </button>
            <button
              onClick={() => handleFinalSubmit('Proforma')}
              className="px-3 py-1.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-xs transition"
            >
              {t('Issue as Proforma', 'إصدار كبروفرما')}
            </button>
            {invoice && invoice.status !== 'Paid' && onRegisterPayment && (
              <button
                onClick={() => onRegisterPayment(invoice)}
                className="px-3 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t('Register Payment', 'تسجيل سداد')}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition"
            >
              {t('Discard', 'إلغاء')}
            </button>
          </div>

          {/* Workflow Status Bar (Odoo 12 Statusbar) */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-1 text-[11px] font-semibold text-slate-500">
            <span
              onClick={() => setStatus('Draft')}
              className={`px-2.5 py-1 rounded cursor-pointer transition ${
                isDraftStep
                  ? 'bg-blue-100 text-blue-800 font-bold'
                  : 'hover:bg-slate-100'
              }`}
            >
              {t('Draft', 'مسودة')}
            </span>
            <span>&rarr;</span>
            <span
              onClick={() => setStatus('Proforma')}
              className={`px-2.5 py-1 rounded cursor-pointer transition ${
                isProformaStep
                  ? 'bg-indigo-100 text-indigo-800 font-bold'
                  : 'hover:bg-slate-100'
              }`}
            >
              {t('Proforma', 'بروفرما')}
            </span>
            <span>&rarr;</span>
            <span
              onClick={() => setStatus('Posted')}
              className={`px-2.5 py-1 rounded cursor-pointer transition ${
                isPostedStep
                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                  : 'hover:bg-slate-100'
              }`}
            >
              {status === 'Paid' ? t('Paid', 'مسدد') : t('Posted / Paid', 'معتمد / مسدد')}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1">
          {/* Header & Title */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                {getSubtitle()}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {invNumber || (invoice ? invoice.number : (type === 'vendor' ? 'RBILL/2026/11/DRAFT' : 'INV/2026/11/DRAFT'))}
              </h2>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-2.5">
              <QrCode className="w-8 h-8 text-blue-800" />
              <div>
                <div className="font-bold text-blue-950 text-xs">
                  {status === 'Posted' || invoice?.zatcaStatus?.includes('CLEARED')
                    ? 'ZATCA Phase 2: CLEARED (QR)'
                    : 'ZATCA Phase 2 E-Invoice'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {status === 'Posted' || invoice?.zatcaStatus?.includes('CLEARED')
                    ? 'Standard Tax Invoice Ready & Verified'
                    : 'Standard & Simplified Tax Invoice Ready'}
                </div>
              </div>
            </div>
          </div>

          {/* Form Meta Fields (2-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Left Column */}
            <div className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {type === 'vendor' ? t('Vendor / Partner *', 'المورد / الشريك *') : t('Customer / Partner *', 'العميل / الشريك *')}
                </label>
                <select
                  value={partnerName}
                  onChange={handlePartnerChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-white text-xs font-semibold focus:border-blue-700 focus:outline-none"
                >
                  {/* Ensure current partnerName is always an option even if custom */}
                  {!SAMPLE_PARTNERS.some((p) => p.nameEn === partnerName) && partnerName && (
                    <option value={partnerName}>{partnerName}</option>
                  )}
                  {SAMPLE_PARTNERS.map((p) => (
                    <option key={p.id} value={p.nameEn}>
                      {isRtl ? `${p.nameAr} (${p.nameEn})` : `${p.nameEn} — ${p.nameAr}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {t('Partner VAT Number', 'الرقم الضريبي للشريك')}
                </label>
                <input
                  type="text"
                  value={partnerVat}
                  onChange={(e) => setPartnerVat(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-slate-50 font-mono text-xs focus:border-blue-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {t('Payment Terms', 'شروط السداد')}
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-white text-xs focus:border-blue-700 focus:outline-none"
                >
                  <option value="Immediate">Immediate Payment (سداد فوري عند الاستلام)</option>
                  <option value="15 Days">15 Days (15 يوماً من الفوترة)</option>
                  <option value="30 Days">30 Days (30 يوماً - آجل)</option>
                  <option value="60 Days">60 Days (60 يوماً - كبار العملاء)</option>
                  <option value="End of Following Month">End of Following Month (نهاية الشهر التالي)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {t('Source Document / Proforma Ref', 'المرجع / أمر البيع أو الشراء')}
                </label>
                <input
                  type="text"
                  value={proformaRef}
                  onChange={(e) => setProformaRef(e.target.value)}
                  placeholder="e.g. SO-2026-0412"
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-white font-mono text-xs focus:border-blue-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {t('Invoice Date *', 'تاريخ الفاتورة *')}
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-white text-xs font-semibold focus:border-blue-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {t('Accounting Date (Force Date)', 'التاريخ المحاسبي (Force Date)')}
                </label>
                <input
                  type="date"
                  value={forceDate}
                  onChange={(e) => setForceDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-white text-xs focus:border-blue-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {t('Company *', 'الشركة التابعة *')}
                </label>
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-white text-xs font-semibold focus:border-blue-700 focus:outline-none"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {t(c.nameEn, c.nameAr)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {t('Journal & Currency', 'دفتر اليومية والعملة')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                    className="col-span-2 border border-slate-300 rounded-md px-3 py-1.5 bg-slate-50 text-xs font-medium"
                  />
                  <input
                    type="text"
                    value="SAR"
                    disabled
                    className="border border-slate-300 rounded-md px-3 py-1.5 bg-slate-100 text-center font-bold text-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lines Table Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {t('Invoice Line Items', 'بنود وسطور الفاتورة')}
              </h3>
              <button
                type="button"
                onClick={handleAddLine}
                className="px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('Add a line', 'إضافة بند جديد')}</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 text-start">{t('Product / Description', 'المنتج / البيان')}</th>
                    <th className="py-2.5 px-3 text-start w-48">{t('Analytic Account', 'الحساب التحليلي')}</th>
                    <th className="py-2.5 px-2 text-center w-20">{t('Qty', 'الكمية')}</th>
                    <th className="py-2.5 px-3 text-end w-28">{t('Unit Price', 'السعر')}</th>
                    <th className="py-2.5 px-2 text-center w-20">{t('Taxes', 'الضريبة')}</th>
                    <th className="py-2.5 px-3 text-end w-28">{t('Subtotal', 'المجموع')}</th>
                    <th className="py-2.5 px-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map((line) => {
                    const lineSubtotal = (Number(line.qty) || 0) * (Number(line.price) || 0);
                    return (
                      <tr key={line.id} className="hover:bg-slate-50/60">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={line.descEn}
                            onChange={(e) => handleLineChange(line.id, 'descEn', e.target.value)}
                            className="w-full border border-slate-200 focus:border-blue-700 rounded px-2 py-1 text-xs"
                            placeholder="Description..."
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={line.analytic}
                            onChange={(e) => handleLineChange(line.id, 'analytic', e.target.value)}
                            className="w-full border border-slate-200 focus:border-blue-700 rounded px-2 py-1 text-xs bg-white"
                          >
                            {!ANALYTIC_ACCOUNTS.some((a) => a.id === line.analytic) && line.analytic && (
                              <option value={line.analytic}>{line.analytic}</option>
                            )}
                            {ANALYTIC_ACCOUNTS.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            min="1"
                            value={line.qty}
                            onChange={(e) => handleLineChange(line.id, 'qty', e.target.value)}
                            className="w-full border border-slate-200 focus:border-blue-700 rounded px-1.5 py-1 text-xs text-center font-bold"
                          />
                        </td>
                        <td className="py-2 px-3 text-end">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.price}
                            onChange={(e) => handleLineChange(line.id, 'price', e.target.value)}
                            className="w-full border border-slate-200 focus:border-blue-700 rounded px-2 py-1 text-xs text-end font-bold"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[10px] font-bold">
                            15%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-end font-mono font-bold text-slate-800">
                          {lineSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveLine(line.id)}
                            disabled={lines.length === 1}
                            className={`p-1 rounded ${lines.length === 1 ? 'text-slate-300' : 'text-slate-400 hover:text-rose-600'}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Totals and Notes */}
          <div className="flex flex-wrap items-start justify-between gap-6 pt-4 border-t border-slate-200">
            <div className="max-w-md text-slate-500 text-[11px] space-y-1">
              <div className="font-bold text-slate-700">
                {t('ZATCA e-Invoicing Compliance Note:', 'ملاحظة الامتثال للفوترة الإلكترونية (هيئة الزكاة):')}
              </div>
              <p>
                {t(
                  'Validating this invoice will generate standard UBL 2.1 XML, calculate SHA-256 hash, and produce cryptographic stamp for ZATCA Fatoora clearance.',
                  'اعتماد هذه الفاتورة ينشئ كود UBL 2.1 المعتمد مع بصمة التشفير وتوليد الختم الرقمي لمطابقة متطلبات هيئة الزكاة والضريبة والجمارك.'
                )}
              </p>
            </div>

            <div className="w-72 bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t('Untaxed Amount:', 'المبلغ الخاضع للضريبة:')}</span>
                <span className="font-mono font-semibold">
                  SAR {taxExcluded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t('VAT 15% (ZATCA):', 'ضريبة القيمة المضافة 15%:')}</span>
                <span className="font-mono font-semibold text-blue-700">
                  SAR {vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-300 text-sm font-extrabold text-slate-900">
                <span>{t('Total Amount Due:', 'إجمالي المبلغ المستحق:')}</span>
                <span className="font-mono text-blue-900">
                  SAR {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            Odoo 12 model: account.invoice ({type === 'vendor' ? 'in_invoice' : 'out_invoice'})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition"
            >
              {t('Cancel', 'إلغاء')}
            </button>
            <button
              onClick={() => handleFinalSubmit(status === 'Draft' ? 'Draft' : 'Posted')}
              className="px-4 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition"
            >
              {invoice ? t('Validate & Save', 'اعتماد وحفظ الفاتورة') : t('Validate & Save', 'اعتماد وحفظ الفاتورة')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
