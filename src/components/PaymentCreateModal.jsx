import React, { useState } from 'react';
import {
  X, Save, CheckCircle2, DollarSign, Calendar, CreditCard,
  Landmark, ArrowDownLeft, ArrowUpRight, Repeat, Building2
} from 'lucide-react';

const SAMPLE_PARTNERS = [
  { id: 'p1', nameEn: 'Neom Bay Infrastructure JV', nameAr: 'ائتلاف البنية التحتية خليج نيوم', type: 'customer' },
  { id: 'p2', nameEn: 'Riyadh Metro Construction Corp.', nameAr: 'شركة إنشاءات مترو الرياض', type: 'customer' },
  { id: 'p3', nameEn: 'Saudi Aramco Mining Div', nameAr: 'أرامكو السعودية - قطاع التعدين', type: 'customer' },
  { id: 'p4', nameEn: 'Ready Mat Industrial Saudi', nameAr: 'شركة ريدي مات الصناعية السعودية', type: 'vendor' },
  { id: 'p5', nameEn: 'Bosch Rexroth AG (Germany)', nameAr: 'بوش ريكسروث ألمانيا', type: 'vendor' },
  { id: 'p6', nameEn: 'Dammam Steel & Chrome Shafts Co.', nameAr: 'شركة صلب وكروم الدمام', type: 'vendor' },
  { id: 'p7', nameEn: 'Saudi Customs & ZATCA Port', nameAr: 'الجمارك السعودية وميناء الزكاة', type: 'vendor' },
];

const PAYMENT_JOURNALS = [
  { id: 'rajhi', name: 'Al Rajhi Corporate Bank SAR (111101)' },
  { id: 'riyad', name: 'Riyad Bank Corporate SAR (111102)' },
  { id: 'snb', name: 'SNB National Commercial Bank SAR (111103)' },
  { id: 'petty', name: 'Petty Cash Fund - Hydraulic Workshop (111201)' },
];

export default function PaymentCreateModal({
  isOpen,
  onClose,
  onSave,
  defaultType = 'receive', // 'receive' | 'send' | 'transfer'
  defaultPartner = '',
  defaultAmount = 25000,
  defaultMemo = '',
  t,
  isRtl,
  companies = [],
  activeCompany,
}) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [paymentType, setPaymentType] = useState(defaultType); // 'receive' | 'send' | 'transfer'
  const [partnerName, setPartnerName] = useState(defaultPartner || SAMPLE_PARTNERS[0].nameEn);
  const [amount, setAmount] = useState(defaultAmount);
  const [paymentDate, setPaymentDate] = useState(todayStr);
  const [journal, setJournal] = useState(PAYMENT_JOURNALS[0].name);
  const [paymentMethod, setPaymentMethod] = useState('Electronic Bank Transfer (SARIE / SADAD)');
  const [chequeNo, setChequeNo] = useState(`CHQ-${Math.floor(100000 + Math.random() * 900000)}`);
  const [memo, setMemo] = useState(defaultMemo || 'Settlement for invoice');
  const [companyId, setCompanyId] = useState(activeCompany?.id || (companies[0] ? companies[0].id : 'HYD'));

  const handleFinalSubmit = (submittedStatus) => {
    const comp = companies.find((c) => c.id === companyId) || activeCompany;
    const prefix = paymentType === 'receive' ? 'PAY/IN/2026/' : (paymentType === 'send' ? 'PAY/OUT/2026/' : 'TRANS/2026/');
    const randomSeq = String(Math.floor(1000 + Math.random() * 9000));
    const payNumber = `${prefix}${randomSeq}`;

    const newPayment = {
      id: `PAY-${Date.now()}`,
      number: payNumber,
      paymentType: paymentType,
      partner: partnerName,
      amount: Number(amount) || 0,
      date: paymentDate,
      journal: journal,
      paymentMethod: paymentMethod,
      chequeNo: paymentMethod.includes('Cheque') ? chequeNo : '',
      memo: memo,
      companyId: comp?.id || 'HYD',
      companyName: comp?.nameEn || 'Al Yamama Hydraulic Workshop Co.',
      status: submittedStatus,
    };

    onSave(newPayment);
    onClose();
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Top Control Panel (Odoo 12 Style) */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFinalSubmit('Posted')}
              className="px-3.5 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('Confirm & Post', 'اعتماد وترحيل الدفعة')}</span>
            </button>
            <button
              onClick={() => handleFinalSubmit('Draft')}
              className="px-3.5 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t('Save as Draft', 'حفظ كمسودة')}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition"
            >
              {t('Discard', 'إلغاء')}
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-1 text-[11px] font-semibold text-slate-500">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
              {t('Draft', 'مسودة')}
            </span>
            <span>&rarr;</span>
            <span className="px-2 py-0.5 rounded hover:bg-slate-100 cursor-default">
              {t('Posted', 'معتمد')}
            </span>
            <span>&rarr;</span>
            <span className="px-2 py-0.5 rounded hover:bg-slate-100 cursor-default">
              {t('Reconciled', 'مسوّى')}
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
          {/* Header Title & Payment Type Switcher */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              {paymentType === 'receive'
                ? t('Customer Payment (Receipt Voucher)', 'سند قبض عميل')
                : paymentType === 'send'
                ? t('Supplier Payment (Payment Voucher)', 'سند صرف مورد')
                : t('Internal Transfer', 'تحويل بنكي داخلي')}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {paymentType === 'receive' ? 'PAY/IN/2026/DRAFT' : (paymentType === 'send' ? 'PAY/OUT/2026/DRAFT' : 'TRANS/2026/DRAFT')}
            </h2>
          </div>

          {/* Payment Type Radio Pills */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <label className="font-bold text-slate-800 block text-xs">
              {t('Payment Type *', 'نوع العملية المالية *')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentType('receive')}
                className={`px-3 py-2 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                  paymentType === 'receive'
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>{t('Receive Money (Customer)', 'سند قبض (عميل)')}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('send')}
                className={`px-3 py-2 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                  paymentType === 'send'
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>{t('Send Money (Vendor)', 'سند صرف (مورد)')}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('transfer')}
                className={`px-3 py-2 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                  paymentType === 'transfer'
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Repeat className="w-4 h-4" />
                <span>{t('Internal Transfer', 'تحويل داخلي')}</span>
              </button>
            </div>
          </div>

          {/* Form Meta Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Left */}
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {paymentType === 'receive' ? t('Customer *', 'العميل *') : t('Vendor / Beneficiary *', 'المورد / المستفيد *')}
                </label>
                <select
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-white text-xs font-semibold focus:border-blue-700 focus:outline-none"
                >
                  {SAMPLE_PARTNERS.map((p) => (
                    <option key={p.id} value={p.nameEn}>
                      {isRtl ? `${p.nameAr} (${p.nameEn})` : `${p.nameEn} — ${p.nameAr}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {t('Payment Amount (SAR) *', 'مبلغ الدفعة (ريال سعودي) *')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-slate-300 rounded-md pl-3 pr-14 py-1.5 bg-white font-mono font-bold text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400 pointer-events-none">
                    SAR
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {t('Payment Date *', 'تاريخ الدفعة *')}
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-white text-xs font-semibold focus:border-blue-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {t('Memo / Communication', 'البيان / مرجع الفاتورة')}
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="e.g. Settlement for INV/2026/00006"
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-white text-xs focus:border-blue-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {t('Payment Journal (Bank / Cash) *', 'دفتر الدفع (البنك / الصندوق) *')}
                </label>
                <select
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-white text-xs font-semibold focus:border-blue-700 focus:outline-none"
                >
                  {PAYMENT_JOURNALS.map((j) => (
                    <option key={j.id} value={j.name}>
                      {j.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {t('Payment Method *', 'طريقة السداد *')}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-white text-xs font-semibold focus:border-blue-700 focus:outline-none"
                >
                  <option value="Electronic Bank Transfer (SARIE / SADAD)">Electronic Bank Transfer (SARIE / SADAD / تحويل سريع)</option>
                  <option value="Corporate Cheque">Corporate Cheque (شيك مصرفي معتمد)</option>
                  <option value="Cash / Direct Branch Deposit">Cash / Direct Branch Deposit (إيداع نقدي)</option>
                  <option value="Mada / Credit Card POS">Mada / Credit Card POS (شبكة مدى / بطاقة ائتمانية)</option>
                </select>
              </div>

              {paymentMethod.includes('Cheque') && (
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {t('Cheque Number & Lifecycle Ref', 'رقم الشيك ومرجع دورة الصرف')}
                  </label>
                  <input
                    type="text"
                    value={chequeNo}
                    onChange={(e) => setChequeNo(e.target.value)}
                    placeholder="e.g. CHQ/0049102"
                    className="w-full border border-slate-300 rounded-md px-3 py-1.5 bg-white font-mono text-xs focus:border-blue-700 focus:outline-none"
                  />
                </div>
              )}

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
            </div>
          </div>

          {/* Reconciliation Information Box */}
          <div className="p-3.5 rounded-lg bg-blue-50/80 border border-blue-200 text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-blue-700" />
              <span>{t('Automated GL Posting & Direct Reconciliation', 'الترحيل الآلي لدفتر الأستاذ والتسوية الفورية')}</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              {t(
                'Once confirmed, this payment immediately debits/credits the selected bank journal and balances the customer/vendor account without requiring an external bank statement import.',
                'بمجرد الاعتماد، يتم قيد المبلغ في دفتر البنك وتسوية حساب الشريك آلياً بدون اشتراط كشف حساب بنكي يدوي.'
              )}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            Odoo 12 model: account.payment
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition"
            >
              {t('Cancel', 'إلغاء')}
            </button>
            <button
              onClick={() => handleFinalSubmit('Posted')}
              className="px-4 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition"
            >
              {t('Confirm Payment', 'اعتماد السداد')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

