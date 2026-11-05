import React, { useState } from 'react';
import {
  X, Save, CheckCircle2, Building2, User, Phone, Mail, Globe, ShieldCheck, MapPin
} from 'lucide-react';

export default function PartnerCreateModal({
  isOpen,
  onClose,
  onSave,
  t,
  isRtl,
  defaultType = 'vendor', // 'vendor' | 'customer' | 'both'
}) {
  if (!isOpen) return null;

  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [partnerType, setPartnerType] = useState(defaultType);
  const [vatNo, setVatNo] = useState('300');
  const [crNo, setCrNo] = useState('1010');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+966 11 ');
  const [country, setCountry] = useState('Saudi Arabia');
  const [city, setCity] = useState('Riyadh');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameEn.trim()) {
      alert(t('Please enter the partner name in English.', 'يرجى إدخال اسم الشريك بالإنجليزية.'));
      return;
    }

    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-indigo-100 text-indigo-800',
      'bg-emerald-100 text-emerald-800',
      'bg-amber-100 text-amber-800',
      'bg-purple-100 text-purple-800',
    ];

    const newPartner = {
      id: `V-${Date.now()}`,
      name: nameEn,
      nameAr: nameAr || nameEn,
      email: email || 'info@company.sa',
      phone: phone || '+966 11 000 0000',
      country: country,
      city: city,
      vat: vatNo,
      cr: crNo,
      type: partnerType,
      bills: 0,
      rating: 5,
      docs: 1,
      payments: 0,
      poCount: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    onSave(newPartner);
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
        className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col"
      >
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              {t('Odoo 12 res.partner Directory', 'دليل الشركاء والموردين والعملاء')}
            </span>
            <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
              {partnerType === 'vendor'
                ? t('Create New Vendor', 'إنشاء مورد جديد')
                : partnerType === 'customer'
                ? t('Create New Customer', 'إنشاء عميل جديد')
                : t('Create Partner (res.partner)', 'إنشاء شريك جديد')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Partner Type Selector */}
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700">{t('Type:', 'النوع:')}</span>
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
              <input
                type="radio"
                name="partnerType"
                value="vendor"
                checked={partnerType === 'vendor'}
                onChange={() => setPartnerType('vendor')}
                className="text-blue-700"
              />
              <span>{t('Vendor / Supplier', 'مورد')}</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
              <input
                type="radio"
                name="partnerType"
                value="customer"
                checked={partnerType === 'customer'}
                onChange={() => setPartnerType('customer')}
                className="text-blue-700"
              />
              <span>{t('Customer / Client', 'عميل')}</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
              <input
                type="radio"
                name="partnerType"
                value="both"
                checked={partnerType === 'both'}
                onChange={() => setPartnerType('both')}
                className="text-blue-700"
              />
              <span>{t('Both (Vendor & Customer)', 'كلاهما')}</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('Company Name (English) *', 'اسم الشركة (الإنجليزية) *')}
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Saudi Steel Pipes Co."
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-semibold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('Company Name (Arabic)', 'اسم الشركة (العربية)')}
              </label>
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: شركة الأنابيب الفولاذية السعودية"
                dir="rtl"
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('ZATCA Tax VAT Number (15 digits)', 'الرقم الضريبي (15 رقم)')}
              </label>
              <input
                type="text"
                maxLength={15}
                value={vatNo}
                onChange={(e) => setVatNo(e.target.value)}
                placeholder="300000000000003"
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('Commercial Registration (CR #)', 'رقم السجل التجاري')}
              </label>
              <input
                type="text"
                value={crNo}
                onChange={(e) => setCrNo(e.target.value)}
                placeholder="1010000000"
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('Email Address', 'البريد الإلكتروني')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="accounts@partner.sa"
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('Phone Number', 'رقم الهاتف')}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 11 000 0000"
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('Country', 'الدولة')}
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700"
              >
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Germany">Germany</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="United States">United States</option>
                <option value="China">China</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('City / Workshop Branch', 'المدينة / الفرع')}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Riyadh / Jubail / Dammam"
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition"
            >
              {t('Discard', 'إلغاء')}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('Save Partner', 'حفظ الشريك')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

