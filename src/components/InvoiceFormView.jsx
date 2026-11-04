import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Edit3, Save, X, Printer, QrCode,
  CreditCard, CheckCircle2, Clock, AlertTriangle, FileText,
  Calendar, Plus, Trash2, Copy, Send, Check, Layers,
  ChevronDown, ExternalLink, ShieldCheck, ArrowRight
} from 'lucide-react';

export default function InvoiceFormView({
  invoice,
  onBack,
  onSave,
  onValidate,
  onRegisterPayment,
  onCreateNew,
  t,
  isRtl,
  allInvoices = [],
  onSelectInvoice,
}) {
  const [activeTab, setActiveTab] = useState('lines'); // 'lines' | 'other'
  const [isEditing, setIsEditing] = useState(false);
  const [printMenuOpen, setPrintMenuOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [showDevTooltip, setShowDevTooltip] = useState(false);

  // Editable local state initialized from invoice prop
  const [formData, setFormData] = useState({ ...invoice });

  useEffect(() => {
    setFormData({ ...invoice });
    setIsEditing(false);
  }, [invoice]);

  if (!invoice) return null;

  // Navigation pager
  const currentIndex = allInvoices.findIndex((inv) => inv.id === invoice.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < allInvoices.length - 1;

  // Calculation helpers
  const lines = formData.lines || [];
  const taxExcluded = lines.reduce(
    (acc, l) => acc + (Number(l.qty) || 0) * (Number(l.price) || 0),
    0
  );
  const vatTotal = taxExcluded * 0.15;
  const grandTotal = taxExcluded + vatTotal;

  // Status mapping to Odoo Draft / Open / Paid
  const currentStatus = formData.status || 'Draft';
  const isDraft = currentStatus === 'Draft';
  const isOpen = currentStatus === 'Posted' || currentStatus === 'Sent' || currentStatus === 'Partially Paid' || currentStatus === 'Proforma';
  const isPaid = currentStatus === 'Paid';

  // Breadcrumb prefix title (e.g. "Cash Invoices" or "Customer Invoices")
  const breadcrumbCategory =
    formData.invoiceSubtype === 'cash'
      ? t('Cash Invoices', 'الفواتير النقدية')
      : formData.invoiceSubtype === 'proforma'
      ? t('Proforma Invoices', 'فواتير البروفرما')
      : formData.invoiceSubtype === 'credit'
      ? t('Credit Invoices', 'فواتير الآجل')
      : formData.invoiceSubtype === 'progressive'
      ? t('Progressive Invoices', 'فواتير الإنجاز')
      : formData.invoiceSubtype === 'refund'
      ? t('Credit Notes', 'إشعارات دائنة')
      : t('Customer Invoices', 'فواتير العملاء');

  const handleLineChange = (id, field, value) => {
    const updatedLines = lines.map((l) =>
      l.id === id ? { ...l, [field]: value } : l
    );
    setFormData({
      ...formData,
      lines: updatedLines,
      taxExcluded,
      total: grandTotal,
    });
  };

  const handleAddLine = () => {
    const newLine = {
      id: Date.now(),
      task: 'Workshop',
      category: 'Maintenance',
      partnerType: 'AYH',
      subType: 'Hydraulic Cylinder Overhaul',
      product: 'Hydraulic Cylinder Overhaul',
      descEn: 'Workshop Cylinder Bench Pressure Testing & Seals',
      descAr: 'فحص ضغط أسطوانة هيدروليكية وتغيير مانعات تسرب',
      account: '479104 Revenue (Workshop)',
      analytic: 'CC-101 Workshop Ops',
      mainQty: 0.0,
      qty: 1,
      uom: 'Units',
      price: 2500,
      tax: 15,
      discount: 0.0,
    };
    setFormData({
      ...formData,
      lines: [...lines, newLine],
    });
  };

  const handleRemoveLine = (id) => {
    if (lines.length <= 1) return;
    setFormData({
      ...formData,
      lines: lines.filter((l) => l.id !== id),
    });
  };

  const handleSaveEdits = () => {
    const updated = {
      ...formData,
      taxExcluded,
      total: grandTotal,
      amountDue: formData.status === 'Paid' ? 0 : grandTotal,
    };
    onSave?.(updated);
    setIsEditing(false);
  };

  const handleDiscard = () => {
    setFormData({ ...invoice });
    setIsEditing(false);
  };

  const handleValidate = () => {
    const updated = {
      ...formData,
      status: 'Posted',
      zatcaStatus: 'CLEARED (QR)',
    };
    setFormData(updated);
    onSave?.(updated);
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen text-slate-800 text-xs font-sans pb-16 -mx-6 -my-5 p-6 space-y-4">
      {/* 1. TOP BREADCRUMB & CONTROL PANEL (EXACT ODOO SCREENSHOT HEADER) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-3">
        {/* Left: Breadcrumbs */}
        <div>
          <div className="flex items-center gap-1.5 text-base text-[#0e7490] font-normal">
            <button
              onClick={onBack}
              className="hover:underline font-semibold text-[#0e7490] focus:outline-none"
              title="Back to list view"
            >
              {breadcrumbCategory}
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700 font-semibold font-mono">
              {formData.number || t('Invoice', 'الفاتورة')}
            </span>
          </div>

          {/* Action Buttons under Breadcrumb */}
          <div className="flex items-center gap-2 mt-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdits}
                  className="px-4 py-1.5 rounded bg-[#0e7490] hover:bg-[#155e75] text-white font-semibold text-xs shadow-2xs transition flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t('Save', 'حفظ')}</span>
                </button>
                <button
                  onClick={handleDiscard}
                  className="px-4 py-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition"
                >
                  {t('Discard', 'إلغاء')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 rounded bg-[#0e7490] hover:bg-[#155e75] text-white font-semibold text-xs shadow-2xs transition"
                >
                  {t('Edit', 'تعديل')}
                </button>
                <button
                  onClick={onCreateNew}
                  className="px-4 py-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition"
                >
                  {t('Create', 'إنشاء')}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: Print / Action dropdowns & Record Pager */}
        <div className="flex items-center gap-3">
          {/* Print Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setPrintMenuOpen(!printMenuOpen);
                setActionMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium flex items-center gap-1 transition"
            >
              <span>{t('Print', 'طباعة')}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            {printMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-30">
                <button
                  onClick={() => {
                    window.print();
                    setPrintMenuOpen(false);
                  }}
                  className="w-full text-start px-3 py-1.5 hover:bg-slate-100 text-xs flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('Invoices / Tax Receipt', 'الفاتورة الضريبية')}</span>
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setPrintMenuOpen(false);
                  }}
                  className="w-full text-start px-3 py-1.5 hover:bg-slate-100 text-xs flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('Proforma Invoice', 'فاتورة بروفرما')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setActionMenuOpen(!actionMenuOpen);
                setPrintMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium flex items-center gap-1 transition"
            >
              <span>{t('Action', 'إجراءات')}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            {actionMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-30">
                <button
                  onClick={() => {
                    alert(t('Invoice duplicated.', 'تم نسخ الفاتورة.'));
                    setActionMenuOpen(false);
                  }}
                  className="w-full text-start px-3 py-1.5 hover:bg-slate-100 text-xs flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('Duplicate', 'نسخ')}</span>
                </button>
                <button
                  onClick={() => {
                    alert(t('ZATCA XML Exported.', 'تم تصدير ملف الزكاة XML.'));
                    setActionMenuOpen(false);
                  }}
                  className="w-full text-start px-3 py-1.5 hover:bg-slate-100 text-xs flex items-center gap-2"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('Download ZATCA XML', 'تحميل XML الزكاة')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Pager (< 1 / 6 >) */}
          <div className="flex items-center gap-1 text-xs text-slate-600 bg-white border border-slate-300 rounded px-2 py-1">
            <button
              disabled={!hasPrev}
              onClick={() => onSelectInvoice?.(allInvoices[currentIndex - 1])}
              className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono px-1 font-semibold">
              {currentIndex >= 0 ? `${currentIndex + 1} / ${allInvoices.length}` : '-'}
            </span>
            <button
              disabled={!hasNext}
              onClick={() => onSelectInvoice?.(allInvoices[currentIndex + 1])}
              className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. ODOO WORKFLOW ACTION BAR & STATUSBAR CHEVRONS (MATCHING SCREENSHOT) */}
      <div className="bg-white border border-slate-300 rounded-t-lg p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5">
          {isDraft && (
            <button
              onClick={handleValidate}
              className="px-3.5 py-1.5 rounded bg-[#0e7490] hover:bg-[#155e75] text-white font-semibold text-xs shadow-2xs transition"
            >
              {t('Validate', 'اعتماد')}
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs transition"
          >
            {t('Preview', 'معاينة')}
          </button>

          <button
            onClick={() => {
              const updated = { ...formData, status: 'Proforma', zatcaStatus: 'Proforma (No XML)' };
              setFormData(updated);
              onSave?.(updated);
            }}
            className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs transition"
          >
            {t('Print Proforma Invoice', 'طباعة بروفرما')}
          </button>

          {isOpen && !isPaid && onRegisterPayment && (
            <button
              onClick={() => onRegisterPayment(formData)}
              className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-2xs transition flex items-center gap-1"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{t('Register Payment', 'تسجيل سداد')}</span>
            </button>
          )}

          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs transition"
          >
            {t('Cancel', 'إلغاء')}
          </button>
        </div>

        {/* Right: Iconic Odoo Triangular Statusbar (Draft ➔ Open ➔ Paid) */}
        <div className="flex items-center text-xs font-semibold">
          <div
            className={`px-4 py-1.5 transition flex items-center gap-1 border border-r-0 border-slate-300 rounded-l ${
              isDraft
                ? 'bg-slate-200 text-slate-800 font-bold shadow-inner'
                : 'bg-white text-slate-400'
            }`}
          >
            <span>{t('Draft', 'مسودة')}</span>
          </div>

          <div
            className={`px-4 py-1.5 transition flex items-center gap-1 border-y border-slate-300 ${
              isOpen
                ? 'bg-slate-200 text-slate-800 font-bold shadow-inner'
                : 'bg-white text-slate-400'
            }`}
          >
            <span className="text-slate-300 mr-1">›</span>
            <span>{t('Open', 'مفتوحة / معتمدة')}</span>
          </div>

          <div
            className={`px-4 py-1.5 transition flex items-center gap-1 border border-l-0 border-slate-300 rounded-r ${
              isPaid
                ? 'bg-emerald-100 text-emerald-800 font-bold'
                : 'bg-white text-slate-400'
            }`}
          >
            <span className="text-slate-300 mr-1">›</span>
            <span>{t('Paid', 'مسددة')}</span>
          </div>
        </div>
      </div>

      {/* 3. THE MAIN ODOO FORM SHEET (PAPER STYLE CARD WITH EXACT SCREENSHOT FIELDS) */}
      <div className="bg-white border-x border-b border-slate-300 rounded-b-lg shadow-sm p-8 space-y-6">
        {/* Document Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {formData.status === 'Draft' ? t('Draft Invoice', 'مسودة فاتورة') : (formData.number || t('Invoice', 'الفاتورة'))}
          </h1>
        </div>

        {/* 2-Column Fields Grid (Exact Match to Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3.5 text-xs">
          {/* Left Column */}
          <div className="space-y-3">
            {/* Subscription Invoice Toggle */}
            <div className="flex items-center">
              <label className="w-1/3 font-semibold text-slate-700">
                {t('Subscription Invoice', 'فاتورة اشتراك دوري')}
              </label>
              <div className="w-2/3">
                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      setFormData({ ...formData, isSubscription: !formData.isSubscription });
                    }
                  }}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition ${
                    formData.isSubscription || formData.invoiceSubtype === 'cash'
                      ? 'bg-[#0e7490]'
                      : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                      formData.isSubscription || formData.invoiceSubtype === 'cash'
                        ? 'translate-x-4'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Customer */}
            <div className="flex items-center">
              <label className="w-1/3 font-semibold text-slate-700">
                {t('Customer', 'العميل')}
              </label>
              <div className="w-2/3">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.customerEn}
                    onChange={(e) => setFormData({ ...formData, customerEn: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs"
                  />
                ) : (
                  <a
                    href="#customer"
                    onClick={(e) => e.preventDefault()}
                    className="text-[#0e7490] hover:underline font-semibold"
                  >
                    {formData.customerEn || '44 Supermarket'}
                  </a>
                )}
              </div>
            </div>

            {/* Project */}
            <div className="flex items-center">
              <label className="w-1/3 font-semibold text-slate-700">
                {t('Project', 'المشروع')}
              </label>
              <div className="w-2/3 text-slate-600">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.project || ''}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    placeholder="Project name..."
                    className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs"
                  />
                ) : (
                  formData.project || '-'
                )}
              </div>
            </div>

            {/* Contact Person */}
            <div className="flex items-center">
              <label className="w-1/3 font-semibold text-slate-700">
                {t('Contact Person', 'الشخص المسؤول')}
              </label>
              <div className="w-2/3 text-slate-600">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Contact person..."
                    className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs"
                  />
                ) : (
                  formData.contactPerson || '-'
                )}
              </div>
            </div>

            {/* Payment Terms */}
            <div className="flex items-center">
              <label className="w-1/3 font-semibold text-slate-700">
                {t('Payment Terms', 'شروط السداد')}
              </label>
              <div className="w-2/3 text-slate-600">
                {isEditing ? (
                  <select
                    value={formData.paymentTerms || (formData.invoiceSubtype === 'cash' ? 'Immediate Payment' : '30 Days')}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs bg-white"
                  >
                    <option value="Immediate Payment">Immediate Payment (سداد فوري)</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                  </select>
                ) : (
                  formData.paymentTerms || (formData.invoiceSubtype === 'cash' ? 'Immediate Payment' : '30 Days')
                )}
              </div>
            </div>

            {/* Show Discount Checkbox */}
            <div className="flex items-center">
              <label className="w-1/3 font-semibold text-slate-700">
                {t('Show Discount', 'إظهار الخصم')}
              </label>
              <div className="w-2/3">
                <input
                  type="checkbox"
                  checked={formData.showDiscount || false}
                  onChange={(e) => isEditing && setFormData({ ...formData, showDiscount: e.target.checked })}
                  disabled={!isEditing}
                  className="rounded border-slate-300 text-[#0e7490] focus:ring-[#0e7490] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Vendor Project Name */}
            <div className="flex items-center">
              <label className="w-1/3 font-semibold text-slate-700">
                {t('Vendor Project Name', 'اسم مشروع المورد')}
              </label>
              <div className="w-2/3 text-slate-600">
                {formData.vendorProjectName || '-'}
              </div>
            </div>

            {/* PR Number */}
            <div className="flex items-center">
              <label className="w-1/3 font-semibold text-slate-700">
                {t('PR Number', 'رقم طلب الشراء (PR)')}
              </label>
              <div className="w-2/3 text-slate-600">
                {formData.prNumber || '-'}
              </div>
            </div>

            {/* PO Number */}
            <div className="flex items-center">
              <label className="w-1/3 font-semibold text-slate-700">
                {t('PO Number', 'رقم أمر الشراء (PO)')}
              </label>
              <div className="w-2/3 text-slate-600">
                {formData.poNumber || '-'}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {/* Invoice Date with Time */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Invoice Date with Time', 'تاريخ ووقت الفاتورة')}
              </label>
              <div className="w-3/5 text-slate-700 font-mono">
                {formData.invoiceDateTime || '06/03/2026 12:46:33'}
              </div>
            </div>

            {/* Invoice Date */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Invoice Date', 'تاريخ الفاتورة')}
              </label>
              <div className="w-3/5 text-slate-700 font-mono">
                {formData.invoiceDate || '06/03/2026'}
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Due Date', 'تاريخ الاستحقاق')}
              </label>
              <div className="w-3/5 text-slate-700 font-mono">
                {formData.dueDateText || '06/03/2026'}
              </div>
            </div>

            {/* Salesperson */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Salesperson', 'مسؤول المبيعات')}
              </label>
              <div className="w-3/5">
                <a
                  href="#salesperson"
                  onClick={(e) => e.preventDefault()}
                  className="text-[#0e7490] hover:underline font-semibold"
                >
                  {formData.salesperson || 'Adithya PL'}
                </a>
              </div>
            </div>

            {/* Equipment Details */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Equipment Details', 'تفاصيل المعدات')}
              </label>
              <div className="w-3/5 text-slate-600">
                {formData.equipmentDetails || '-'}
              </div>
            </div>

            {/* Group Task */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Group Task', 'مجموعة المهام')}
              </label>
              <div className="w-3/5 text-slate-700 font-medium">
                {formData.groupTask || 'No Grouping'}
              </div>
            </div>

            {/* Source Document */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Source Document', 'المستند المصدري')}
              </label>
              <div className="w-3/5 text-slate-700 font-mono">
                {formData.proformaRef && formData.proformaRef !== '-' ? formData.proformaRef : '-'}
              </div>
            </div>

            {/* Company Seal on Invoice Checkbox */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Company Seal on Invoice', 'ختم الشركة على الفاتورة')}
              </label>
              <div className="w-3/5">
                <input
                  type="checkbox"
                  checked={formData.companySeal !== false}
                  onChange={(e) => isEditing && setFormData({ ...formData, companySeal: e.target.checked })}
                  disabled={!isEditing}
                  className="rounded border-slate-300 text-[#0e7490] focus:ring-[#0e7490] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Show Out from Stock Button Checkbox */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Show Out from Stock Button', 'زر الإخراج المخزني')}
              </label>
              <div className="w-3/5">
                <input
                  type="checkbox"
                  checked={formData.showOutStock || false}
                  onChange={(e) => isEditing && setFormData({ ...formData, showOutStock: e.target.checked })}
                  disabled={!isEditing}
                  className="rounded border-slate-300 text-[#0e7490] focus:ring-[#0e7490] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Is Progressive Inv. ? Checkbox */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Is Progressive Inv. ?', 'فاتورة إنجاز مستخلص؟')}
              </label>
              <div className="w-3/5">
                <input
                  type="checkbox"
                  checked={formData.invoiceSubtype === 'progressive'}
                  onChange={(e) => isEditing && setFormData({ ...formData, invoiceSubtype: e.target.checked ? 'progressive' : 'credit' })}
                  disabled={!isEditing}
                  className="rounded border-slate-300 text-[#0e7490] focus:ring-[#0e7490] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Sales Team */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Sales Team', 'فريق المبيعات')}
              </label>
              <div className="w-3/5">
                <a
                  href="#team"
                  onClick={(e) => e.preventDefault()}
                  className="text-[#0e7490] hover:underline font-semibold"
                >
                  {formData.salesTeam || 'Sales'}
                </a>
              </div>
            </div>

            {/* Currency */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Currency', 'العملة')}
              </label>
              <div className="w-3/5 font-semibold text-slate-800">
                SAR
              </div>
            </div>
          </div>
        </div>

        {/* 4. NOTEBOOK TABS (Invoice Lines | Other Info) */}
        <div className="pt-4 border-t border-slate-200 relative">
          <div className="flex items-center justify-between border-b border-slate-300 text-xs font-semibold">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('lines')}
                className={`px-4 py-2 border-b-2 transition relative ${
                  activeTab === 'lines'
                    ? 'border-[#0e7490] text-[#0e7490] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{t('Invoice Lines', 'بنود الفاتورة')}</span>
              </button>
              <button
                onClick={() => setActiveTab('other')}
                className={`px-4 py-2 border-b-2 transition ${
                  activeTab === 'other'
                    ? 'border-[#0e7490] text-[#0e7490] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('Other Info', 'معلومات أخرى')}
              </button>
            </div>

            {/* Developer Mode Inspect Tooltip Trigger (Odoo Debug tooltip from screenshot c08da0d2.jpg) */}
            <button
              type="button"
              onClick={() => setShowDevTooltip(!showDevTooltip)}
              className="text-[11px] text-slate-400 hover:text-[#0e7490] flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-slate-100 transition"
              title="Click to view Odoo technical model metadata"
            >
              <span className="font-mono text-[10px]">invoice_line_ids</span>
              <span className="text-[9px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-mono font-bold">one2many</span>
            </button>
          </div>

          {/* ODOO DEVELOPER MODE FLOATING TOOLTIP (EXACT REPLICA OF USER'S SCREENSHOT c08da0d2.jpg) */}
          {showDevTooltip && (
            <div className="absolute left-1/2 -translate-x-1/2 top-12 z-50 bg-[#16202c] text-slate-200 text-[11px] p-4 rounded-lg shadow-2xl border border-slate-700 font-mono w-[380px] space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between font-bold text-white border-b border-slate-700 pb-1.5 font-sans text-xs">
                <span>Invoice Lines</span>
                <button
                  onClick={() => setShowDevTooltip(false)}
                  className="text-slate-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>
              <div className="pt-1"><span className="text-slate-400">• Field:</span> <span className="text-emerald-400">invoice_line_ids</span></div>
              <div><span className="text-slate-400">• Object:</span> account.invoice</div>
              <div><span className="text-slate-400">• Type:</span> one2many</div>
              <div><span className="text-slate-400">• Widget:</span> section_and_note_one2many</div>
              <div><span className="text-slate-400">• Context:</span> {'{\'type\': type, \'journal_id\': journal_id, \'default_invoice_id\': id}'}</div>
              <div><span className="text-slate-400">• Domain:</span> []</div>
              <div><span className="text-slate-400">• Modifiers:</span> {JSON.stringify({"readonly": [["state", "not in", ["draft"]]]})}</div>
              <div><span className="text-slate-400">• On change:</span> 1</div>
              <div><span className="text-slate-400">• Relation:</span> account.invoice.line</div>
            </div>
          )}

          {/* TAB 1: INVOICE LINES TABLE (EXACT MATCH TO ODOO SCREENSHOT) */}
          {activeTab === 'lines' && (
            <div className="pt-3 space-y-4">
              <div className="overflow-x-auto border border-slate-300 rounded bg-white">
                <table className="w-full text-[11px] text-start whitespace-nowrap">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-300 font-bold">
                    <tr>
                      <th className="py-2.5 px-3 text-start">▾ {t('Main Task', 'المهمة الرئيسية')}</th>
                      <th className="py-2.5 px-3 text-start">{t('Category', 'الفئة')}</th>
                      <th className="py-2.5 px-2 text-center">{t('Show Separately', 'عرض منفصل')}</th>
                      <th className="py-2.5 px-2 text-center">{t('Show Line', 'عرض البند')}</th>
                      <th className="py-2.5 px-2 text-center">{t('Main Quantity', 'الكمية الرئيسية')}</th>
                      <th className="py-2.5 px-3 text-start">{t('Partner Number Type', 'رمز الشريك')}</th>
                      <th className="py-2.5 px-3 text-start">{t('Product SubType', 'النوع الفرعي')}</th>
                      <th className="py-2.5 px-3 text-start">{t('Product', 'المنتج')}</th>
                      <th className="py-2.5 px-4 text-start">{t('Description', 'الوصف')}</th>
                      <th className="py-2.5 px-3 text-start">{t('Account', 'الحساب')}</th>
                      <th className="py-2.5 px-3 text-start">{t('Analytic Account', 'الحساب التحليلي')}</th>
                      <th className="py-2.5 px-2 text-end">{t('Main Qty', 'الكمية')}</th>
                      <th className="py-2.5 px-2 text-end">{t('Quantity', 'الكمية')}</th>
                      <th className="py-2.5 px-2 text-start">{t('Unit of Measure', 'الوحدة')}</th>
                      <th className="py-2.5 px-3 text-end">{t('Price', 'السعر')}</th>
                      <th className="py-2.5 px-3 text-center">{t('Taxes', 'الضريبة')}</th>
                      <th className="py-2.5 px-2 text-end">{t('Discount', 'الخصم')}</th>
                      <th className="py-2.5 px-2 text-center">{t('Rounding Required', 'التقريب')}</th>
                      <th className="py-2.5 px-4 text-end">{t('Subtotal', 'المجموع')}</th>
                      {isEditing && <th className="py-2.5 px-2 text-center"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lines.map((l) => {
                      const linePrice = Number(l.price) || 0;
                      const lineQty = Number(l.qty) || 1;
                      const lineSubtotal = linePrice * lineQty;

                      return (
                        <tr key={l.id} className="hover:bg-blue-50/20 transition">
                          <td className="py-2 px-3 text-slate-700">{l.task || 'Subscription'}</td>
                          <td className="py-2 px-3 text-slate-700">{l.category || 'Subscription'}</td>
                          <td className="py-2 px-2 text-center">
                            <input type="checkbox" className="rounded border-slate-300 w-3.5 h-3.5" />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input type="checkbox" className="rounded border-slate-300 w-3.5 h-3.5" />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input type="checkbox" className="rounded border-slate-300 w-3.5 h-3.5" />
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-800">{l.partnerType || 'FAY'}</td>
                          <td className="py-2 px-3 text-slate-700 max-w-[140px] truncate">
                            {l.subType || l.descEn || 'Annual Service Subscription - 1 Year'}
                          </td>
                          <td className="py-2 px-3 text-slate-700 max-w-[140px] truncate">
                            {l.product || l.descEn || 'Annual Service Subscription - 1 Year'}
                          </td>
                          <td className="py-2 px-4 text-slate-900 font-medium">
                            {isEditing ? (
                              <input
                                type="text"
                                value={l.descEn}
                                onChange={(e) => handleLineChange(l.id, 'descEn', e.target.value)}
                                className="border border-slate-300 rounded px-2 py-0.5 text-xs w-48"
                              />
                            ) : (
                              l.descEn || 'Annual Service Subscription (Renewal)'
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-700">
                            {l.account || '479104 Revenue (Renewal)'}
                          </td>
                          <td className="py-2 px-3 font-mono text-blue-700">
                            {l.analytic || 'CC-101 Workshop Ops'}
                          </td>
                          <td className="py-2 px-2 text-end font-mono text-slate-500">
                            {Number(l.mainQty || 0).toFixed(2)}
                          </td>
                          <td className="py-2 px-2 text-end font-mono font-bold text-slate-900">
                            {isEditing ? (
                              <input
                                type="number"
                                value={l.qty}
                                onChange={(e) => handleLineChange(l.id, 'qty', e.target.value)}
                                className="border border-slate-300 rounded px-1 py-0.5 text-xs w-14 text-end"
                              />
                            ) : (
                              Number(lineQty).toFixed(3)
                            )}
                          </td>
                          <td className="py-2 px-2 text-slate-600">{l.uom || 'Units'}</td>
                          <td className="py-2 px-3 text-end font-mono">
                            {isEditing ? (
                              <input
                                type="number"
                                value={l.price}
                                onChange={(e) => handleLineChange(l.id, 'price', e.target.value)}
                                className="border border-slate-300 rounded px-1 py-0.5 text-xs w-20 text-end"
                              />
                            ) : (
                              linePrice.toFixed(3)
                            )}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full border border-slate-400 bg-white text-slate-700 text-[10px] font-semibold">
                              VAT 15%
                            </span>
                          </td>
                          <td className="py-2 px-2 text-end font-mono text-slate-500">
                            {Number(l.discount || 0).toFixed(3)}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input type="checkbox" className="rounded border-slate-300 w-3.5 h-3.5" />
                          </td>
                          <td className="py-2 px-4 text-end font-mono font-bold text-slate-900">
                            <div className="flex items-center justify-end gap-1.5">
                              <span>{lineSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} SR</span>
                              <FileText className="w-3.5 h-3.5 text-slate-500 inline cursor-pointer hover:text-[#0e7490]" title="Tax & Analytical Breakdown" />
                            </div>
                          </td>
                          {isEditing && (
                            <td className="py-2 px-2 text-center">
                              <button
                                onClick={() => handleRemoveLine(l.id)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add an item links (Odoo section & note links) */}
              {isEditing && (
                <div className="flex items-center gap-4 text-xs font-semibold text-[#0e7490] pt-1">
                  <button
                    onClick={handleAddLine}
                    className="hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('Add a line', 'إضافة بند')}</span>
                  </button>
                  <button
                    onClick={handleAddLine}
                    className="hover:underline text-slate-600"
                  >
                    {t('Add a section', 'إضافة قسم')}
                  </button>
                  <button
                    onClick={handleAddLine}
                    className="hover:underline text-slate-600"
                  >
                    {t('Add a note', 'إضافة ملاحظة')}
                  </button>
                </div>
              )}

              {/* Bottom Financial Summary Table (Odoo 12/14/16 Native Border Style) */}
              <div className="flex justify-end pt-4">
                <div className="w-72 space-y-1.5 text-xs text-end">
                  <div className="flex justify-between py-1 border-b border-slate-200 text-slate-700">
                    <span>{t('Untaxed Amount:', 'المبلغ بدون ضريبة:')}</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {taxExcluded.toLocaleString('en-US', { minimumFractionDigits: 2 })} SR
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 text-slate-700">
                    <span>{t('Taxes (VAT 15%):', 'الضريبة (15%):')}</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {vatTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} SR
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-t-2 border-slate-900 text-sm font-bold text-slate-900">
                    <span>{t('Total:', 'الإجمالي:')}</span>
                    <span className="font-mono text-[#0e7490]">
                      {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} SR
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-dashed border-slate-300 text-xs font-bold text-slate-700">
                    <span>{t('Amount Due:', 'المبلغ المستحق:')}</span>
                    <span className="font-mono">
                      {(formData.status === 'Paid' ? 0 : grandTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })} SR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OTHER INFO */}
          {activeTab === 'other' && (
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
              <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
                <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                  {t('Accounting & Bank Details', 'تفاصيل الحساب البنكي والقيود')}
                </h3>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t('Journal:', 'دفتر اليومية:')}</span>
                  <strong>Customer Invoices (SAR)</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t('Company Bank Account:', 'الحساب البنكي:')}</span>
                  <span className="font-mono">Alinma Bank — SA03 0500 0068 2012 3456 7890</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t('Fiscal Position:', 'الوضع الضريبي:')}</span>
                  <span>Kingdom of Saudi Arabia (Standard 15%)</span>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
                <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                  {t('ZATCA Electronic Invoicing', 'الفوترة الإلكترونية (الزكاة)')}
                </h3>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t('ZATCA Status:', 'حالة الاعتماد:')}</span>
                  <span className="font-bold text-emerald-700">{formData.zatcaStatus || 'CLEARED (QR)'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t('Force Date (stock_force_date):', 'تاريخ القيد الإجباري:')}</span>
                  <span className="font-mono text-blue-800">{formData.forceDate || '2026-10-30'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t('UUID:', 'المعرف الفريد:')}</span>
                  <span className="font-mono text-[10px] text-slate-600 truncate max-w-[220px]">
                    8f94b2c0-7d1e-4b3a-9c5f-12894a6b7e01
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
