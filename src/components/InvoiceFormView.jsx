import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Save, X, QrCode,
  CreditCard, CheckCircle2, FileText, Plus, Trash2,
  ChevronDown, ExternalLink
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

  // Editable local state initialized from invoice prop
  const [formData, setFormData] = useState({ ...invoice });

  useEffect(() => {
    setFormData({ ...invoice });
    const isNew = Boolean(
      invoice?.isNew ||
      !invoice?.number ||
      invoice?.number === 'Draft Invoice' ||
      invoice?.number === 'Draft' ||
      invoice?.number === 'New'
    );
    setIsEditing(isNew);
  }, [invoice]);

  if (!invoice) return null;

  const isNewInvoice = Boolean(
    formData.isNew ||
    !formData.number ||
    formData.number === 'Draft Invoice' ||
    formData.number === 'Draft' ||
    formData.number === 'New'
  );

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
      task: '',
      category: '',
      showSeparately: false,
      showLine: false,
      mainQuantityCheck: false,
      partnerType: 'AYH',
      subType: '',
      product: '',
      descEn: '',
      descAr: '',
      account: '479104 Revenue (Workshop)',
      analytic: 'CC-101 Workshop Ops',
      mainQty: 0.0,
      qty: 1,
      uom: 'Units',
      price: 0,
      tax: 15,
      discount: 0.0,
      roundingRequired: false,
    };
    setFormData({
      ...formData,
      lines: [...lines, newLine],
    });
  };

  const handleRemoveLine = (id) => {
    setFormData({
      ...formData,
      lines: lines.filter((l) => l.id !== id),
    });
  };

  const handleSaveEdits = () => {
    const updated = {
      ...formData,
      isNew: false,
      number: isNewInvoice ? 'Draft Invoice' : formData.number,
      taxExcluded,
      total: grandTotal,
      amountDue: formData.status === 'Paid' ? 0 : grandTotal,
    };
    onSave?.(updated);
    setIsEditing(false);
  };

  const handleDiscard = () => {
    if (isNewInvoice) {
      onBack?.();
    } else {
      setFormData({ ...invoice });
      setIsEditing(false);
    }
  };

  const handleValidate = () => {
    const updated = {
      ...formData,
      isNew: false,
      status: 'Posted',
      number: isNewInvoice ? `INV/2026/000${Math.floor(14 + Math.random() * 80)}` : formData.number,
      zatcaStatus: 'CLEARED (QR)',
      taxExcluded,
      total: grandTotal,
      amountDue: grandTotal,
    };
    setFormData(updated);
    onSave?.(updated);
    setIsEditing(false);
  };

  const isProgressive = formData.invoiceSubtype === 'progressive';

  if (isProgressive) {
    return (
      <div className="bg-[#f0f2f5] min-h-screen text-slate-800 text-xs font-sans pb-16 -mx-6 -my-5 p-6 space-y-3">
        {/* 1. TOP BREADCRUMB & CONTROL PANEL */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-base text-[#0e7490] font-normal">
              <button
                onClick={onBack}
                className="hover:underline font-semibold text-[#0e7490] focus:outline-none cursor-pointer"
              >
                {t('Progressive Invoices', 'فواتير الإنجاز')}
              </button>
              <span className="text-slate-400">/</span>
              <span className="text-slate-700 font-semibold">
                {isNewInvoice ? t('New', 'جديد') : (formData.blanketPoNumber || formData.number)}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveEdits}
                    className="px-3.5 py-1 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition cursor-pointer"
                  >
                    {t('Save', 'حفظ')}
                  </button>
                  <button
                    onClick={() => {
                      if (isNewInvoice) onBack();
                      else setIsEditing(false);
                    }}
                    className="px-3.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs transition cursor-pointer"
                  >
                    {t('Discard', 'إلغاء')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3.5 py-1 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition cursor-pointer"
                  >
                    {t('Edit', 'تعديل')}
                  </button>
                  <button
                    onClick={onCreateNew}
                    className="px-3.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs transition cursor-pointer"
                  >
                    {t('Create', 'إنشاء')}
                  </button>
                </>
              )}
            </div>
          </div>

          {!isNewInvoice && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-slate-600 bg-white border border-slate-300 rounded px-2 py-1">
                <button
                  disabled={!hasPrev}
                  onClick={() => onSelectInvoice?.(allInvoices[currentIndex - 1])}
                  className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono px-1 font-semibold">
                  {currentIndex >= 0 ? `${currentIndex + 1} / ${allInvoices.length}` : '-'}
                </span>
                <button
                  disabled={!hasNext}
                  onClick={() => onSelectInvoice?.(allInvoices[currentIndex + 1])}
                  className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. STATUSBAR & ACTIONS */}
        <div className="bg-white border border-slate-300 rounded-t-lg p-2 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-1.5">
            {formData.status === 'Draft' ? (
              <button
                onClick={() => {
                  const updated = { ...formData, status: 'Approved' };
                  setFormData(updated);
                  onSave?.(updated);
                }}
                className="px-3.5 py-1 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs"
              >
                {t('Approve PO', 'اعتماد أمر الشراء')}
              </button>
            ) : (
              <button
                onClick={() => {
                  const updated = { ...formData, status: 'Draft' };
                  setFormData(updated);
                  onSave?.(updated);
                }}
                className="px-3.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs"
              >
                {t('Reset to Draft', 'إعادة للمسودة')}
              </button>
            )}
            <button
              onClick={onBack}
              className="px-3 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs"
            >
              {t('Cancel', 'إلغاء')}
            </button>
          </div>

          <div className="flex items-center text-xs font-semibold">
            <div
              className={`px-4 py-1 flex items-center border border-r-0 border-slate-300 rounded-l ${
                formData.status === 'Draft'
                  ? 'bg-slate-200 text-slate-800 font-bold shadow-inner'
                  : 'bg-white text-slate-400'
              }`}
            >
              <span>{t('Draft', 'مسودة')}</span>
            </div>
            <div
              className={`px-4 py-1 flex items-center border border-l-0 border-slate-300 rounded-r ${
                formData.status !== 'Draft'
                  ? 'bg-slate-200 text-slate-800 font-bold shadow-inner'
                  : 'bg-white text-slate-400'
              }`}
            >
              <span className="text-slate-300 mr-1">›</span>
              <span>{t('Approved', 'معتمد')}</span>
            </div>
          </div>
        </div>

        {/* 3. CARD SHEET (MATCHING SCREENSHOT 4 & 6) */}
        <div className="bg-white border-x border-b border-slate-300 rounded-b-lg shadow-sm p-8 space-y-6">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-slate-900 font-sans">
              {formData.blanketPoNumber || formData.number || 'PO-CC31-112025-00043'}
            </h1>
            {/* Smart Button */}
            <div className="border border-slate-300 rounded-md p-2 bg-slate-50 hover:bg-slate-100 flex items-center gap-2 cursor-pointer shadow-2xs">
              <FileText className="w-5 h-5 text-slate-700" />
              <div className="text-start">
                <div className="font-bold text-slate-900 font-mono text-xs">
                  {(formData.invoicedAmount || 22389.35).toLocaleString('en-US', { minimumFractionDigits: 2 })} SR
                </div>
                <div className="text-[11px] text-slate-600 font-bold">
                  {formData.invoiceCount || 10} Invoices
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3.5 text-xs">
            {/* Left Column */}
            <div className="space-y-3">
              <div className="flex items-center">
                <label className="w-1/3 font-semibold text-slate-700">{t('PO Date', 'تاريخ أمر الشراء')}</label>
                <div className="w-2/3">
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.poDate || formData.invoiceDate || ''}
                      onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                      className="border border-slate-300 rounded px-2.5 py-1 text-xs w-full bg-white"
                    />
                  ) : (
                    <span className="text-slate-800">{formData.poDate || formData.invoiceDate}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-1/3 font-semibold text-slate-700">{t('Customer', 'العميل')}</label>
                <div className="w-2/3">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.customerEn || ''}
                      onChange={(e) => setFormData({ ...formData, customerEn: e.target.value })}
                      className="border border-slate-300 rounded px-2.5 py-1 text-xs w-full bg-[#d9e6f2]"
                    />
                  ) : (
                    <a href="#cust" onClick={(e) => e.preventDefault()} className="text-[#0e7490] hover:underline font-medium">
                      {formData.customerEn}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-1/3 font-semibold text-slate-700">{t('Company', 'الشركة')}</label>
                <div className="w-2/3 text-slate-700">
                  {formData.companyName || 'Flames of Al-Yamama Hydraulic Co'}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div className="flex items-center">
                <label className="w-1/3 font-semibold text-slate-700">{t('Currency', 'العملة')}</label>
                <div className="w-2/3 text-[#0e7490] font-semibold">{formData.currency || 'SAR'}</div>
              </div>

              <div className="flex items-center">
                <label className="w-1/3 font-semibold text-slate-700">{t('PO Total Amount', 'إجمالي أمر الشراء')}</label>
                <div className="w-2/3">
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.poTotalAmount || formData.total || ''}
                      onChange={(e) => setFormData({ ...formData, poTotalAmount: parseFloat(e.target.value) || 0 })}
                      className="border border-slate-300 rounded px-2.5 py-1 text-xs w-full"
                    />
                  ) : (
                    <span className="text-slate-900 font-semibold">
                      {(formData.poTotalAmount || formData.total || 92000).toLocaleString('en-US', { minimumFractionDigits: 2 })} SR
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-1/3 font-semibold text-slate-700">{t('Balance', 'الرصيد المتبقي')}</label>
                <div className="w-2/3 text-slate-900 font-semibold">
                  {(formData.balance || formData.amountDue || 69610.65).toLocaleString('en-US', { minimumFractionDigits: 2 })} SR
                </div>
              </div>

              <div className="flex items-start">
                <label className="w-1/3 font-semibold text-slate-700 pt-1">{t('Description', 'الوصف والبيان')}</label>
                <div className="w-2/3">
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="border border-slate-300 rounded px-2.5 py-1 text-xs w-full"
                    />
                  ) : (
                    <span className="text-slate-700">{formData.description || 'BARCC Annual Maintenance for Hydraulic Service'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f2f5] min-h-screen text-slate-800 text-xs font-sans pb-16 -mx-6 -my-5 p-6 space-y-3">
      {/* 1. TOP BREADCRUMB & CONTROL PANEL (EXACT ODOO SCREENSHOT HEADER) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-3">
        {/* Left: Breadcrumbs & Action Buttons */}
        <div>
          <div className="flex items-center gap-1.5 text-base text-[#0e7490] font-normal">
            <button
              onClick={onBack}
              className="hover:underline font-semibold text-[#0e7490] focus:outline-none cursor-pointer"
              title="Back to list view"
            >
              {breadcrumbCategory}
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700 font-semibold">
              {isNewInvoice ? t('New', 'جديد') : (formData.number || t('Invoice', 'الفاتورة'))}
            </span>
          </div>

          {/* Action Buttons under Breadcrumb (Save / Discard OR Edit / Create) */}
          <div className="flex items-center gap-2 mt-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdits}
                  className="px-3.5 py-1 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition cursor-pointer"
                >
                  {t('Save', 'حفظ')}
                </button>
                <button
                  onClick={handleDiscard}
                  className="px-3.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs transition cursor-pointer"
                >
                  {t('Discard', 'إلغاء')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition cursor-pointer"
                >
                  {t('Edit', 'تعديل')}
                </button>
                <button
                  onClick={onCreateNew}
                  className="px-3.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs transition cursor-pointer"
                >
                  {t('Create', 'إنشاء')}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: Record Pager (Hidden when creating New invoice) */}
        {!isNewInvoice && (
          <div className="flex items-center gap-3">
            {/* Pager (< 1 / 6 >) */}
            <div className="flex items-center gap-1 text-xs text-slate-600 bg-white border border-slate-300 rounded px-2 py-1">
              <button
                disabled={!hasPrev}
                onClick={() => onSelectInvoice?.(allInvoices[currentIndex - 1])}
                className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
                className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Next"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. ODOO WORKFLOW ACTION BAR & STATUSBAR CHEVRONS (MATCHING SCREENSHOT) */}
      <div className="bg-white border border-slate-300 rounded-t-lg p-2 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleValidate}
            className="px-3.5 py-1 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition cursor-pointer"
          >
            {t('Validate', 'اعتماد')}
          </button>

          {isOpen && !isPaid && onRegisterPayment && (
            <button
              onClick={() => onRegisterPayment(formData)}
              className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-2xs transition flex items-center gap-1 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{t('Register Payment', 'تسجيل سداد')}</span>
            </button>
          )}

          <button
            onClick={onBack}
            className="px-3 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs transition cursor-pointer"
          >
            {t('Cancel', 'إلغاء')}
          </button>
        </div>

        {/* Right: Iconic Odoo Triangular Statusbar (Draft ➔ Open ➔ Paid) */}
        <div className="flex items-center text-xs font-semibold">
          <div
            className={`px-4 py-1 transition flex items-center gap-1 border border-r-0 border-slate-300 rounded-l ${
              isDraft
                ? 'bg-slate-200 text-slate-800 font-bold shadow-inner'
                : 'bg-white text-slate-400'
            }`}
          >
            <span>{t('Draft', 'مسودة')}</span>
          </div>

          <div
            className={`px-4 py-1 transition flex items-center gap-1 border-y border-slate-300 ${
              isOpen
                ? 'bg-slate-200 text-slate-800 font-bold shadow-inner'
                : 'bg-white text-slate-400'
            }`}
          >
            <span className="text-slate-300 mr-1">›</span>
            <span>{t('Open', 'مفتوحة')}</span>
          </div>

          <div
            className={`px-4 py-1 transition flex items-center gap-1 border border-l-0 border-slate-300 rounded-r ${
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
            {formData.status === 'Draft' || isNewInvoice ? t('Draft Invoice', 'مسودة فاتورة') : (formData.number || t('Invoice', 'الفاتورة'))}
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
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition cursor-pointer ${
                    formData.isSubscription
                      ? 'bg-[#0e7490]'
                      : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                      formData.isSubscription
                        ? 'translate-x-4'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Customer (Select / Input with #d9e6f2 background) */}
            <div className="flex items-center">
              <label className="w-1/3 font-semibold text-slate-700">
                {t('Customer', 'العميل')}
              </label>
              <div className="w-2/3">
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      list="customer-list"
                      value={formData.customerEn || ''}
                      onChange={(e) => setFormData({ ...formData, customerEn: e.target.value })}
                      placeholder=""
                      className="w-full bg-[#d9e6f2] border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#0e7490]"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2 pointer-events-none" />
                    <datalist id="customer-list">
                      <option value="Neom Bay Infrastructure JV" />
                      <option value="Riyadh Metro Construction Corp." />
                      <option value="Al-Futtaim Saudi Contracting" />
                      <option value="Acme Arabia Industrial Corp." />
                      <option value="Saudi Aramco Mining Div" />
                      <option value="Red Sea Drilling & Marine Services" />
                      <option value="44 Supermarket" />
                      <option value="Ready Mat Industrial Saudi" />
                    </datalist>
                  </div>
                ) : (
                  formData.customerEn ? (
                    <a
                      href="#customer"
                      onClick={(e) => e.preventDefault()}
                      className="text-[#0e7490] hover:underline font-semibold"
                    >
                      {formData.customerEn}
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">-</span>
                  )
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
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.project || ''}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      placeholder=""
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:border-[#0e7490]"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2 pointer-events-none" />
                  </div>
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
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.contactPerson || ''}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder=""
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:border-[#0e7490]"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2 pointer-events-none" />
                  </div>
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
                  <div className="relative">
                    <select
                      value={formData.paymentTerms || ''}
                      onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs bg-white appearance-none focus:outline-none focus:border-[#0e7490]"
                    >
                      <option value=""></option>
                      <option value="Immediate Payment">Immediate Payment (سداد فوري)</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                      <option value="60 Days">60 Days</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2 pointer-events-none" />
                  </div>
                ) : (
                  formData.paymentTerms || '-'
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
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.vendorProjectName || ''}
                    onChange={(e) => setFormData({ ...formData, vendorProjectName: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:border-[#0e7490]"
                  />
                ) : (
                  formData.vendorProjectName || '-'
                )}
              </div>
            </div>

            {/* PR Number */}
            <div className="flex items-center">
              <label className="w-1/3 font-semibold text-slate-700">
                {t('PR Number', 'رقم طلب الشراء (PR)')}
              </label>
              <div className="w-2/3 text-slate-600">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.prNumber || ''}
                    onChange={(e) => setFormData({ ...formData, prNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:border-[#0e7490]"
                  />
                ) : (
                  formData.prNumber || '-'
                )}
              </div>
            </div>

            {/* PO Number */}
            <div className="flex items-center">
              <label className="w-1/3 font-semibold text-slate-700">
                {t('PO Number', 'رقم أمر الشراء (PO)')}
              </label>
              <div className="w-2/3 text-slate-600">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.poNumber || ''}
                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:border-[#0e7490]"
                  />
                ) : (
                  formData.poNumber || '-'
                )}
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
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.invoiceDateTime || ''}
                      onChange={(e) => setFormData({ ...formData, invoiceDateTime: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs font-mono bg-white focus:outline-none focus:border-[#0e7490]"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2 pointer-events-none" />
                  </div>
                ) : (
                  formData.invoiceDateTime || '-'
                )}
              </div>
            </div>

            {/* Invoice Date */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Invoice Date', 'تاريخ الفاتورة')}
              </label>
              <div className="w-3/5 text-slate-700 font-mono">
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.invoiceDate || ''}
                      onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs font-mono bg-white focus:outline-none focus:border-[#0e7490]"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2 pointer-events-none" />
                  </div>
                ) : (
                  formData.invoiceDate || '-'
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Due Date', 'تاريخ الاستحقاق')}
              </label>
              <div className="w-3/5 text-slate-700 font-mono">
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.dueDateText || ''}
                      onChange={(e) => setFormData({ ...formData, dueDateText: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs font-mono bg-white focus:outline-none focus:border-[#0e7490]"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2 pointer-events-none" />
                  </div>
                ) : (
                  formData.dueDateText || '-'
                )}
              </div>
            </div>

            {/* Salesperson */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Salesperson', 'مسؤول المبيعات')}
              </label>
              <div className="w-3/5">
                {isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <select
                        value={formData.salesperson || 'Administrator'}
                        onChange={(e) => setFormData({ ...formData, salesperson: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs bg-white text-slate-800 appearance-none focus:outline-none focus:border-[#0e7490]"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Adithya PL">Adithya PL</option>
                        <option value="Tariq Al-Mansoor">Tariq Al-Mansoor</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2 pointer-events-none" />
                    </div>
                    <div className="w-6 h-6 border border-slate-300 rounded flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer shrink-0">
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <a
                      href="#salesperson"
                      onClick={(e) => e.preventDefault()}
                      className="text-[#0e7490] hover:underline font-semibold"
                    >
                      {formData.salesperson || 'Administrator'}
                    </a>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Equipment Details */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Equipment Details', 'تفاصيل المعدات')}
              </label>
              <div className="w-3/5 text-slate-600">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.equipmentDetails || ''}
                    onChange={(e) => setFormData({ ...formData, equipmentDetails: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:border-[#0e7490]"
                  />
                ) : (
                  formData.equipmentDetails || '-'
                )}
              </div>
            </div>

            {/* Group Task */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Group Task', 'مجموعة المهام')}
              </label>
              <div className="w-3/5 text-slate-700 font-medium">
                {isEditing ? (
                  <div className="relative">
                    <select
                      value={formData.groupTask || 'No Grouping'}
                      onChange={(e) => setFormData({ ...formData, groupTask: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs bg-white text-slate-800 appearance-none focus:outline-none focus:border-[#0e7490]"
                    >
                      <option value="No Grouping">No Grouping</option>
                      <option value="By Category">By Category</option>
                      <option value="By Equipment">By Equipment</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2 pointer-events-none" />
                  </div>
                ) : (
                  formData.groupTask || 'No Grouping'
                )}
              </div>
            </div>

            {/* Source Document */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Source Document', 'المستند المصدري')}
              </label>
              <div className="w-3/5 text-slate-700 font-mono">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.proformaRef || ''}
                    onChange={(e) => setFormData({ ...formData, proformaRef: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs bg-white font-mono focus:outline-none focus:border-[#0e7490]"
                  />
                ) : (
                  formData.proformaRef && formData.proformaRef !== '-' ? formData.proformaRef : '-'
                )}
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
                {isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <select
                        value={formData.salesTeam || 'Sales'}
                        onChange={(e) => setFormData({ ...formData, salesTeam: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs bg-white text-slate-800 appearance-none focus:outline-none focus:border-[#0e7490]"
                      >
                        <option value="Sales">Sales</option>
                        <option value="Hydraulic Workshop">Hydraulic Workshop</option>
                        <option value="Spare Parts">Spare Parts</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2 pointer-events-none" />
                    </div>
                    <div className="w-6 h-6 border border-slate-300 rounded flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer shrink-0">
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <a
                      href="#team"
                      onClick={(e) => e.preventDefault()}
                      className="text-[#0e7490] hover:underline font-semibold"
                    >
                      {formData.salesTeam || 'Sales'}
                    </a>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Currency (Select with #d9e6f2 background) */}
            <div className="flex items-center">
              <label className="w-2/5 font-semibold text-slate-700">
                {t('Currency', 'العملة')}
              </label>
              <div className="w-3/5 font-semibold text-slate-800">
                {isEditing ? (
                  <div className="relative">
                    <select
                      value={formData.currency || 'SAR'}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full bg-[#d9e6f2] border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-semibold appearance-none focus:outline-none focus:border-[#0e7490]"
                    >
                      <option value="SAR">SAR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2 pointer-events-none" />
                  </div>
                ) : (
                  <span className="font-semibold text-slate-800">{formData.currency || 'SAR'}</span>
                )}
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
                className={`px-4 py-2 border-b-2 transition relative cursor-pointer ${
                  activeTab === 'lines'
                    ? 'border-[#0e7490] text-[#0e7490] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{t('Invoice Lines', 'بنود الفاتورة')}</span>
              </button>
              <button
                onClick={() => setActiveTab('other')}
                className={`px-4 py-2 border-b-2 transition cursor-pointer ${
                  activeTab === 'other'
                    ? 'border-[#0e7490] text-[#0e7490] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('Other Info', 'معلومات أخرى')}
              </button>
            </div>
          </div>

          {/* TAB 1: INVOICE LINES TABLE (EXACT MATCH TO ODOO SCREENSHOT) */}
          {activeTab === 'lines' && (
            <div className="pt-3 space-y-3">
              <div className="overflow-x-auto border border-slate-300 rounded bg-white">
                <table className="w-full text-[11px] text-start whitespace-nowrap">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-300 font-bold">
                    <tr>
                      <th className="py-2 px-3 text-start">{t('Main Task', 'المهمة')}</th>
                      <th className="py-2 px-3 text-start">{t('Category', 'الفئة')}</th>
                      <th className="py-2 px-2 text-center">{t('Show Separately', 'عرض منفصل')}</th>
                      <th className="py-2 px-2 text-center">{t('Show Line', 'عرض البند')}</th>
                      <th className="py-2 px-2 text-center">{t('Main Quantity', 'الكمية')}</th>
                      <th className="py-2 px-3 text-start">{t('Partner Number Type', 'رمز الشريك')}</th>
                      <th className="py-2 px-3 text-start">{t('Product SubType', 'النوع الفرعي')}</th>
                      <th className="py-2 px-3 text-start">{t('Product', 'المنتج')}</th>
                      <th className="py-2 px-4 text-start">{t('Product Description', 'الوصف')}</th>
                      <th className="py-2 px-3 text-start">{t('Account', 'الحساب')}</th>
                      <th className="py-2 px-3 text-start">{t('Analytic Account', 'الحساب التحليلي')}</th>
                      <th className="py-2 px-2 text-end">{t('Main Qty', 'الكمية الرئيسية')}</th>
                      <th className="py-2 px-2 text-end">{t('Quantity', 'الكمية')}</th>
                      <th className="py-2 px-2 text-start">{t('Unit of Measure', 'الوحدة')}</th>
                      <th className="py-2 px-3 text-end">{t('Price', 'السعر')}</th>
                      <th className="py-2 px-3 text-center">{t('Taxes', 'الضريبة')}</th>
                      <th className="py-2 px-2 text-end">{t('Discount', 'الخصم')}</th>
                      <th className="py-2 px-4 text-end">{t('Subtotal', 'المجموع')}</th>
                      {isEditing && <th className="py-2 px-2 text-center w-8"></th>}
                    </tr>
                  </thead>
                  {lines.length > 0 && (
                    <tbody className="divide-y divide-slate-200">
                      {lines.map((l) => {
                        const linePrice = Number(l.price) || 0;
                        const lineQty = Number(l.qty) || 1;
                        const lineSubtotal = linePrice * lineQty;

                        return (
                          <tr key={l.id} className="hover:bg-blue-50/20 transition">
                            <td className="py-2 px-3 text-slate-700">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={l.task || ''}
                                  onChange={(e) => handleLineChange(l.id, 'task', e.target.value)}
                                  placeholder=""
                                  className="border border-slate-300 rounded px-1.5 py-0.5 text-xs w-24"
                                />
                              ) : (
                                l.task || '-'
                              )}
                            </td>
                            <td className="py-2 px-3 text-slate-700">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={l.category || ''}
                                  onChange={(e) => handleLineChange(l.id, 'category', e.target.value)}
                                  placeholder=""
                                  className="border border-slate-300 rounded px-1.5 py-0.5 text-xs w-24"
                                />
                              ) : (
                                l.category || '-'
                              )}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="checkbox"
                                checked={l.showSeparately || false}
                                onChange={(e) => isEditing && handleLineChange(l.id, 'showSeparately', e.target.checked)}
                                disabled={!isEditing}
                                className="rounded border-slate-300 w-3.5 h-3.5 text-[#0e7490]"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="checkbox"
                                checked={l.showLine || false}
                                onChange={(e) => isEditing && handleLineChange(l.id, 'showLine', e.target.checked)}
                                disabled={!isEditing}
                                className="rounded border-slate-300 w-3.5 h-3.5 text-[#0e7490]"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="checkbox"
                                checked={l.mainQuantityCheck || false}
                                onChange={(e) => isEditing && handleLineChange(l.id, 'mainQuantityCheck', e.target.checked)}
                                disabled={!isEditing}
                                className="rounded border-slate-300 w-3.5 h-3.5 text-[#0e7490]"
                              />
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-800">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={l.partnerType || ''}
                                  onChange={(e) => handleLineChange(l.id, 'partnerType', e.target.value)}
                                  placeholder=""
                                  className="border border-slate-300 rounded px-1.5 py-0.5 text-xs w-20"
                                />
                              ) : (
                                l.partnerType || '-'
                              )}
                            </td>
                            <td className="py-2 px-3 text-slate-700 max-w-[140px] truncate">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={l.subType || ''}
                                  onChange={(e) => handleLineChange(l.id, 'subType', e.target.value)}
                                  placeholder=""
                                  className="border border-slate-300 rounded px-1.5 py-0.5 text-xs w-28"
                                />
                              ) : (
                                l.subType || '-'
                              )}
                            </td>
                            <td className="py-2 px-3 text-slate-700 max-w-[140px] truncate">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={l.product || ''}
                                  onChange={(e) => handleLineChange(l.id, 'product', e.target.value)}
                                  placeholder=""
                                  className="border border-slate-300 rounded px-1.5 py-0.5 text-xs w-28"
                                />
                              ) : (
                                l.product || '-'
                              )}
                            </td>
                            <td className="py-2 px-4 text-slate-900 font-medium">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={l.descEn || ''}
                                  onChange={(e) => handleLineChange(l.id, 'descEn', e.target.value)}
                                  placeholder=""
                                  className="border border-slate-300 rounded px-2 py-0.5 text-xs w-48"
                                />
                              ) : (
                                l.descEn || '-'
                              )}
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-700">
                              {l.account || '479104 Revenue'}
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
                                  min="0"
                                  step="1"
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
                                  min="0"
                                  step="0.01"
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
                              {isEditing ? (
                                <input
                                  type="number"
                                  min="0"
                                  value={l.discount || 0}
                                  onChange={(e) => handleLineChange(l.id, 'discount', e.target.value)}
                                  className="border border-slate-300 rounded px-1 py-0.5 text-xs w-12 text-end"
                                />
                              ) : (
                                Number(l.discount || 0).toFixed(3)
                              )}
                            </td>
                            <td className="py-2 px-4 text-end font-mono font-bold text-slate-900">
                              <span>{lineSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} SR</span>
                            </td>
                            {isEditing && (
                              <td className="py-2 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLine(l.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                  title="Delete line"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  )}
                </table>

                {/* Sub-table actions: Add a line / Add a section / Add a note */}
                <div className="py-2.5 px-4 bg-white border-t border-slate-200 space-y-2">
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#0e7490]">
                    <button
                      type="button"
                      onClick={handleAddLine}
                      className="hover:underline flex items-center gap-1 text-[#0e7490] cursor-pointer"
                    >
                      <span>{t('Add a line', 'إضافة بند')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddLine}
                      className="hover:underline text-slate-600 cursor-pointer"
                    >
                      {t('Add a section', 'إضافة قسم')}
                    </button>
                    <button
                      type="button"
                      onClick={handleAddLine}
                      className="hover:underline text-slate-600 cursor-pointer"
                    >
                      {t('Add a note', 'إضافة ملاحظة')}
                    </button>
                  </div>

                  {/* Shaded empty placeholder bars matching exact Odoo screenshot */}
                  {lines.length === 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="h-6 w-full bg-[#f1f5f9] rounded-xs border border-slate-100" />
                      <div className="h-6 w-full bg-[#f1f5f9] rounded-xs border border-slate-100" />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Financial Summary Table */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-1 text-xs text-end">
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
                  <strong>
                    {formData.invoiceSubtype === 'cash' ? 'Cash Invoices (SAR)' : 'Customer Invoices (SAR)'}
                  </strong>
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
                  <span className="font-bold text-emerald-700">{formData.zatcaStatus || 'DRAFT (Phase 2)'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t('Force Date (stock_force_date):', 'تاريخ القيد الإجباري:')}</span>
                  <span className="font-mono text-blue-800">{formData.forceDate || '-'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t('UUID:', 'المعرف الفريد:')}</span>
                  <span className="font-mono text-[10px] text-slate-600 truncate max-w-[220px]">
                    {isNewInvoice ? 'Pending generation upon Validate' : '8f94b2c0-7d1e-4b3a-9c5f-12894a6b7e01'}
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
