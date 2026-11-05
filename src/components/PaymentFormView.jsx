import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Save, X, CreditCard,
  CheckCircle2, Building2, Calendar, FileText, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';

export default function PaymentFormView({
  payment,
  onBack,
  onSave,
  onPost,
  onReconcile,
  allPayments = [],
  onSelectPayment,
  t,
  isRtl,
}) {
  const isNew = Boolean(payment?.isNew || !payment?.number || payment?.number === 'New');
  const [isEditing, setIsEditing] = useState(isNew);

  const [formData, setFormData] = useState({
    id: payment?.id || `PAY-${Date.now()}`,
    number: payment?.number || (isNew ? t('Draft Payment', 'مسودة دفعة') : 'PAY/IN/2026/00084'),
    paymentType: payment?.paymentType || 'receive', // 'receive' | 'send'
    partner: payment?.partner || '',
    amount: payment?.amount || 0.0,
    date: payment?.date || new Date().toISOString().split('T')[0],
    journal: payment?.journal || 'Al Rajhi Corporate Bank SAR (111101)',
    paymentMethod: payment?.paymentMethod || 'Electronic Bank Transfer (SARIE / SADAD)',
    chequeNo: payment?.chequeNo || '',
    memo: payment?.memo || '',
    companyId: payment?.companyId || 'HYD',
    companyName: payment?.companyName || 'Flames of Al-Yamama Hydraulic Co',
    status: payment?.status || 'Posted', // 'Draft' | 'Posted' | 'Reconciled'
  });

  const currentIndex = allPayments.findIndex((p) => p.id === payment?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < allPayments.length - 1;

  const handleSave = () => {
    const saved = { ...formData, isNew: false };
    setFormData(saved);
    setIsEditing(false);
    onSave?.(saved);
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen text-slate-800 text-xs font-sans pb-16 -mx-6 -my-5 p-6 space-y-3">
      {/* 1. Header & Control Panel */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-base text-[#0e7490] font-normal">
            <button
              onClick={onBack}
              className="hover:underline font-semibold text-[#0e7490] focus:outline-none cursor-pointer"
            >
              {formData.paymentType === 'receive'
                ? t('Customer Payments', 'مدفوعات العملاء')
                : t('Supplier Payments', 'مدفوعات الموردين')}
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700 font-semibold">
              {isNew ? t('New', 'جديد') : formData.number}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition cursor-pointer"
                >
                  {t('Save', 'حفظ')}
                </button>
                <button
                  onClick={() => {
                    if (isNew) onBack();
                    else setIsEditing(false);
                  }}
                  className="px-3.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs transition cursor-pointer"
                >
                  {t('Discard', 'إلغاء')}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-1 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition cursor-pointer"
              >
                {t('Edit', 'تعديل')}
              </button>
            )}
          </div>
        </div>

        {/* Pager */}
        {!isNew && (
          <div className="flex items-center gap-1 text-xs text-slate-600 bg-white border border-slate-300 rounded px-2 py-1">
            <button
              disabled={!hasPrev}
              onClick={() => onSelectPayment?.(allPayments[currentIndex - 1])}
              className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono px-1 font-semibold">
              {currentIndex >= 0 ? `${currentIndex + 1} / ${allPayments.length}` : '-'}
            </span>
            <button
              disabled={!hasNext}
              onClick={() => onSelectPayment?.(allPayments[currentIndex + 1])}
              className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Action & Status Bar */}
      <div className="bg-white border border-slate-300 rounded-t-lg p-2 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-1.5">
          {formData.status === 'Draft' && (
            <button
              onClick={() => {
                const updated = { ...formData, status: 'Posted' };
                setFormData(updated);
                onPost?.(updated);
              }}
              className="px-3.5 py-1 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition cursor-pointer"
            >
              {t('Confirm & Post', 'تأكيد وترحيل')}
            </button>
          )}

          {formData.status === 'Posted' && (
            <button
              onClick={() => {
                const updated = { ...formData, status: 'Reconciled' };
                setFormData(updated);
                onReconcile?.(updated);
              }}
              className="px-3.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-2xs transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('Mark Reconciled', 'تسوية الدفعة')}</span>
            </button>
          )}

          <button
            onClick={onBack}
            className="px-3 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs transition cursor-pointer"
          >
            {t('Cancel', 'إلغاء')}
          </button>
        </div>

        {/* Statusbar */}
        <div className="flex items-center text-xs font-semibold">
          <div
            className={`px-4 py-1 flex items-center gap-1 border border-r-0 border-slate-300 rounded-l ${
              formData.status === 'Draft'
                ? 'bg-slate-200 text-slate-800 font-bold'
                : 'bg-white text-slate-400'
            }`}
          >
            <span>{t('Draft', 'مسودة')}</span>
          </div>

          <div
            className={`px-4 py-1 flex items-center gap-1 border border-r-0 border-slate-300 ${
              formData.status === 'Posted'
                ? 'bg-[#2e6b7d] text-white font-bold'
                : 'bg-white text-slate-400'
            }`}
          >
            <span className="text-slate-300 mr-1">›</span>
            <span>{t('Posted', 'مرحل')}</span>
          </div>

          <div
            className={`px-4 py-1 flex items-center gap-1 border border-slate-300 rounded-r ${
              formData.status === 'Reconciled'
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-white text-slate-400'
            }`}
          >
            <span className="text-slate-300 mr-1">›</span>
            <span>{t('Reconciled', 'مسوى')}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Form Sheet */}
      <div className="bg-white border-x border-b border-slate-300 rounded-b-lg p-6 shadow-xs space-y-6">
        <div>
          <span className="text-slate-400 font-medium">
            {formData.paymentType === 'receive'
              ? t('Customer Payment Voucher', 'سند قبض عميل')
              : t('Supplier Payment Voucher', 'سند صرف مورد')}
          </span>
          <h2 className="text-xl font-bold text-slate-800">{formData.number}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-2">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Payment Type', 'نوع الدفعة')}</label>
              {isEditing ? (
                <div className="col-span-2 flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={formData.paymentType === 'receive'}
                      onChange={() => setFormData({ ...formData, paymentType: 'receive' })}
                    />
                    <span>{t('Receive Money (Inbound)', 'قبض (وارد)')}</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={formData.paymentType === 'send'}
                      onChange={() => setFormData({ ...formData, paymentType: 'send' })}
                    />
                    <span>{t('Send Money (Outbound)', 'صرف (صادر)')}</span>
                  </label>
                </div>
              ) : (
                <span className="col-span-2 font-semibold text-slate-800 flex items-center gap-1.5">
                  {formData.paymentType === 'receive' ? (
                    <>
                      <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                      <span>{t('Receive Money (Customer Inbound)', 'سند قبض عملاء')}</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-4 h-4 text-blue-600" />
                      <span>{t('Send Money (Supplier Outbound)', 'سند صرف موردين')}</span>
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Partner', 'الشريك / المستفيد')}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.partner}
                  onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
                  placeholder="Partner name..."
                  className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                />
              ) : (
                <span className="col-span-2 text-slate-900 font-bold">{formData.partner || '-'}</span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Payment Amount', 'مبلغ الدفعة')}</label>
              {isEditing ? (
                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-40 border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold focus:outline-none focus:border-[#2e6b7d]"
                  />
                  <span className="font-semibold text-slate-600">SAR</span>
                </div>
              ) : (
                <span className="col-span-2 font-mono font-bold text-base text-slate-900">
                  SAR {Number(formData.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Date', 'تاريخ السداد')}</label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                />
              ) : (
                <span className="col-span-2 font-mono text-slate-700">{formData.date}</span>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Payment Journal', 'دفتر سداد / البنك')}</label>
              {isEditing ? (
                <select
                  value={formData.journal}
                  onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                  className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#2e6b7d]"
                >
                  <option value="Al Rajhi Corporate Bank SAR (111101)">Al Rajhi Corporate Bank SAR (111101)</option>
                  <option value="Riyad Bank Corporate SAR (111102)">Riyad Bank Corporate SAR (111102)</option>
                  <option value="SNB National Commercial Bank SAR (111103)">SNB National Commercial Bank SAR (111103)</option>
                  <option value="Workshop Cash Drawer SAR (111201)">Workshop Cash Drawer SAR (111201)</option>
                </select>
              ) : (
                <span className="col-span-2 font-semibold text-slate-800">{formData.journal}</span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Payment Method', 'طريقة السداد')}</label>
              {isEditing ? (
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#2e6b7d]"
                >
                  <option value="Electronic Bank Transfer (SARIE / SADAD)">Electronic Bank Transfer (SARIE / SADAD)</option>
                  <option value="Corporate Cheque">Corporate Cheque</option>
                  <option value="Cash / POS Counter">Cash / POS Counter</option>
                </select>
              ) : (
                <span className="col-span-2 text-slate-800">{formData.paymentMethod}</span>
              )}
            </div>

            {formData.paymentMethod.includes('Cheque') && (
              <div className="grid grid-cols-3 items-center">
                <label className="text-slate-600 font-medium">{t('Cheque Number', 'رقم الشيك')}</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.chequeNo}
                    onChange={(e) => setFormData({ ...formData, chequeNo: e.target.value })}
                    placeholder="CHQ/..."
                    className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#2e6b7d]"
                  />
                ) : (
                  <span className="col-span-2 font-mono font-bold text-blue-700">{formData.chequeNo || '-'}</span>
                )}
              </div>
            )}

            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Memo / Ref', 'البيان والمرجع')}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  placeholder="e.g. Settlement for INV/2026/00012"
                  className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                />
              ) : (
                <span className="col-span-2 text-slate-700">{formData.memo || '-'}</span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Company', 'الشركة')}</label>
              <span className="col-span-2 text-slate-800 font-medium">{formData.companyName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

