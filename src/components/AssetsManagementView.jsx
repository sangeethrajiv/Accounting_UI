import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Save, X, Plus, Play,
  CheckCircle2, Clock, Calendar, AlertCircle, Building2
} from 'lucide-react';

export const INITIAL_ASSETS = [
  {
    id: 'AST-1',
    name: '400-Ton Hydraulic Cylinder Test Bench & Power Pack',
    nameAr: 'منصة اختبار وتجهيز أسطوانات الهيدروليك 400 طن',
    category: 'Workshop Machinery',
    categoryAr: 'آلات ومعدات الورشة',
    grossValue: 420000.0,
    salvageValue: 20000.0,
    depreciableValue: 400000.0,
    residualValue: 266666.67,
    purchaseDate: '2024-01-15',
    method: 'Linear',
    durationMonths: 60, // 5 years
    prorata: true,
    status: 'Running', // 'Draft' | 'Running' | 'Close'
    company: 'Al Yamama Hydraulic Workshop Co.',
    depreciationLines: [
      { year: '2024', date: '2024-12-31', amount: 80000.0, cumulative: 80000.0, residual: 340000.0, status: 'Posted' },
      { year: '2025', date: '2025-12-31', amount: 80000.0, cumulative: 160000.0, residual: 260000.0, status: 'Posted' },
      { year: '2026', date: '2026-12-31', amount: 80000.0, cumulative: 240000.0, residual: 180000.0, status: 'Unposted' },
      { year: '2027', date: '2027-12-31', amount: 80000.0, cumulative: 320000.0, residual: 100000.0, status: 'Unposted' },
      { year: '2028', date: '2028-12-31', amount: 80000.0, cumulative: 400000.0, residual: 20000.0, status: 'Unposted' },
    ]
  },
  {
    id: 'AST-2',
    name: 'Scania R500 Heavy Lowbed Equipment Transporter',
    nameAr: 'شاحنة سكانيا R500 مقطورة لوبد لنقل المعدات الثقيلة',
    category: 'Vehicles & Fleet',
    categoryAr: 'الشاحنات وأسطول النقل',
    grossValue: 680000.0,
    salvageValue: 50000.0,
    depreciableValue: 630000.0,
    residualValue: 504000.0,
    purchaseDate: '2025-03-01',
    method: 'Linear',
    durationMonths: 60,
    prorata: true,
    status: 'Running',
    company: 'Al Yamama Logistics & Fleet Co.',
    depreciationLines: [
      { year: '2025', date: '2025-12-31', amount: 126000.0, cumulative: 126000.0, residual: 554000.0, status: 'Posted' },
      { year: '2026', date: '2026-12-31', amount: 126000.0, cumulative: 252000.0, residual: 428000.0, status: 'Unposted' },
      { year: '2027', date: '2027-12-31', amount: 126000.0, cumulative: 378000.0, residual: 302000.0, status: 'Unposted' },
      { year: '2028', date: '2028-12-31', amount: 126000.0, cumulative: 504000.0, residual: 176000.0, status: 'Unposted' },
      { year: '2029', date: '2029-12-31', amount: 126000.0, cumulative: 630000.0, residual: 50000.0, status: 'Unposted' },
    ]
  },
  {
    id: 'AST-3',
    name: 'CNC 4-Axis Horizontal Cylinder Honing Lathe',
    nameAr: 'مخرطة سي إن سي أفقية لتجويف وتنعيم أسطوانات الهيدروليك',
    category: 'Workshop Machinery',
    categoryAr: 'آلات ومعدات الورشة',
    grossValue: 310000.0,
    salvageValue: 10000.0,
    depreciableValue: 300000.0,
    residualValue: 310000.0,
    purchaseDate: '2026-08-10',
    method: 'Linear',
    durationMonths: 60,
    prorata: true,
    status: 'Draft',
    company: 'Al Yamama Hydraulic Workshop Co.',
    depreciationLines: [
      { year: '2026', date: '2026-12-31', amount: 25000.0, cumulative: 25000.0, residual: 285000.0, status: 'Unposted' },
      { year: '2027', date: '2027-12-31', amount: 60000.0, cumulative: 85000.0, residual: 225000.0, status: 'Unposted' },
      { year: '2028', date: '2028-12-31', amount: 60000.0, cumulative: 145000.0, residual: 165000.0, status: 'Unposted' },
    ]
  }
];

export const INITIAL_RENTAL_LEASES = [
  {
    id: 'RNT-1',
    asset: '80-Ton Telescopic Mobile Crane (Kato CR-800)',
    client: 'Neom Bay Infrastructure JV',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    rateMonthly: 45000.0,
    deposit: 15000.0,
    status: 'Active',
    company: 'Al Yamama Heavy Equipment Co.',
  },
  {
    id: 'RNT-2',
    asset: 'Hydraulic Piling Power Pack 350 Bar Unit',
    client: 'Saudi Aramco Mining Div',
    startDate: '2026-10-15',
    endDate: '2027-01-15',
    rateMonthly: 28000.0,
    deposit: 10000.0,
    status: 'Active',
    company: 'Al Yamama Hydraulic Workshop Co.',
  },
  {
    id: 'RNT-3',
    asset: 'Heavy Duty 60-Ton Multi-Axle Lowbed Trailer',
    client: 'Arabian Cement Manufacturing Co.',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    rateMonthly: 18500.0,
    deposit: 5000.0,
    status: 'Returned',
    company: 'Al Yamama Logistics & Fleet Co.',
  }
];

export default function AssetsManagementView({
  viewType = 'assets', // 'assets' | 'rental'
  t,
  isRtl,
}) {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [rentals, setRentals] = useState(INITIAL_RENTAL_LEASES);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeprWizard, setShowDeprWizard] = useState(false);

  // Asset Form View
  if (selectedAsset) {
    const isNew = selectedAsset.isNew;
    return (
      <div className="bg-[#f0f2f5] min-h-screen text-slate-800 text-xs font-sans pb-16 -mx-6 -my-5 p-6 space-y-3">
        {/* Header Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-base text-[#0e7490] font-normal">
              <button
                onClick={() => setSelectedAsset(null)}
                className="hover:underline font-semibold text-[#0e7490] focus:outline-none cursor-pointer"
              >
                {t('Fixed Assets', 'الأصول الثابتة')}
              </button>
              <span className="text-slate-400">/</span>
              <span className="text-slate-700 font-semibold">
                {isNew ? t('New Asset', 'أصل جديد') : selectedAsset.name}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setAssets((prev) => prev.map((a) => (a.id === selectedAsset.id ? selectedAsset : a)));
                      setIsEditing(false);
                    }}
                    className="px-3.5 py-1 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition cursor-pointer"
                  >
                    {t('Save', 'حفظ')}
                  </button>
                  <button
                    onClick={() => {
                      if (isNew) setSelectedAsset(null);
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
        </div>

        {/* Action & Statusbar */}
        <div className="bg-white border border-slate-300 rounded-t-lg p-2 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-1.5">
            {selectedAsset.status === 'Draft' ? (
              <button
                onClick={() => {
                  const updated = { ...selectedAsset, status: 'Running' };
                  setSelectedAsset(updated);
                  setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
                }}
                className="px-3.5 py-1 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition cursor-pointer flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('Confirm Asset', 'تأكيد الأصل وبدء الإهلاك')}</span>
              </button>
            ) : (
              <button
                onClick={() => alert(t('Depreciation board computed and refreshed.', 'تم حساب جدول الإهلاك وتحديثه.'))}
                className="px-3.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs transition cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 text-blue-700" />
                <span>{t('Compute Depreciation', 'احتساب الإهلاك')}</span>
              </button>
            )}

            <button
              onClick={() => setSelectedAsset(null)}
              className="px-3 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs transition cursor-pointer"
            >
              {t('Back to List', 'العودة للقائمة')}
            </button>
          </div>

          <div className="flex items-center text-xs font-semibold">
            <div
              className={`px-4 py-1 border border-r-0 border-slate-300 rounded-l ${
                selectedAsset.status === 'Draft' ? 'bg-slate-200 text-slate-800 font-bold' : 'bg-white text-slate-400'
              }`}
            >
              <span>{t('Draft', 'مسودة')}</span>
            </div>
            <div
              className={`px-4 py-1 border border-r-0 border-slate-300 ${
                selectedAsset.status === 'Running' ? 'bg-[#2e6b7d] text-white font-bold' : 'bg-white text-slate-400'
              }`}
            >
              <span className="text-slate-300 mr-1">›</span>
              <span>{t('Running', 'قيد التشغيل')}</span>
            </div>
            <div
              className={`px-4 py-1 border border-slate-300 rounded-r ${
                selectedAsset.status === 'Close' ? 'bg-slate-700 text-white font-bold' : 'bg-white text-slate-400'
              }`}
            >
              <span className="text-slate-300 mr-1">›</span>
              <span>{t('Closed', 'مغلق')}</span>
            </div>
          </div>
        </div>

        {/* Sheet */}
        <div className="bg-white border-x border-b border-slate-300 rounded-b-lg p-6 shadow-xs space-y-6">
          <div>
            <span className="text-slate-400 font-medium">{selectedAsset.category}</span>
            <h2 className="text-xl font-bold text-slate-800">{selectedAsset.name}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 pt-2">
            <div className="space-y-3">
              <div className="grid grid-cols-3">
                <span className="text-slate-600 font-medium">{t('Category', 'فئة الأصل')}</span>
                <span className="col-span-2 font-semibold text-slate-800">{selectedAsset.category}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-600 font-medium">{t('Gross Value', 'القيمة الإجمالية')}</span>
                <span className="col-span-2 font-mono font-bold text-slate-900">
                  SAR {selectedAsset.grossValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-600 font-medium">{t('Salvage Value', 'القيمة التخريدية')}</span>
                <span className="col-span-2 font-mono text-slate-700">
                  SAR {selectedAsset.salvageValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3">
                <span className="text-slate-600 font-medium">{t('Purchase Date', 'تاريخ الشراء')}</span>
                <span className="col-span-2 font-mono text-slate-700">{selectedAsset.purchaseDate}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-600 font-medium">{t('Depreciation Method', 'طريقة الإهلاك')}</span>
                <span className="col-span-2 font-medium text-slate-800">{selectedAsset.method} (5 Years / 60 Months)</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-600 font-medium">{t('Book Residual Value', 'القيمة الدفترية المتبقية')}</span>
                <span className="col-span-2 font-mono font-bold text-blue-700">
                  SAR {selectedAsset.residualValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Depreciation Board */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('Depreciation Board (جدول إهلاك الأصل)', 'جدول إهلاك الأصل')}
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-md">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 text-start">{t('Fiscal Period', 'الفترة المالية')}</th>
                    <th className="py-2.5 px-4 text-start">{t('Date', 'التاريخ')}</th>
                    <th className="py-2.5 px-4 text-end">{t('Depreciation Amount', 'مبلغ الإهلاك')}</th>
                    <th className="py-2.5 px-4 text-end">{t('Cumulative Depreciation', 'مجمع الإهلاك')}</th>
                    <th className="py-2.5 px-4 text-end">{t('Residual Value', 'القيمة المتبقية')}</th>
                    <th className="py-2.5 px-4 text-center">{t('Status', 'الحالة')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {selectedAsset.depreciationLines?.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2 px-4 font-bold text-slate-800">{line.year}</td>
                      <td className="py-2 px-4 text-slate-600">{line.date}</td>
                      <td className="py-2 px-4 text-end text-slate-800">
                        SAR {line.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-4 text-end text-blue-800 font-semibold">
                        SAR {line.cumulative.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-4 text-end font-bold text-slate-900">
                        SAR {line.residual.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <span
                          className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${
                            line.status === 'Posted'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {line.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View (Assets or Asset Rental)
  return (
    <div className="space-y-4">
      {/* Wizard Modal */}
      {showDeprWizard && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-800">
                {t('Generate Assets Depreciation Entries', 'توليد قيود إهلاك الأصول')}
              </h3>
              <button onClick={() => setShowDeprWizard(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              {t(
                'This wizard computes and posts monthly depreciation entries for all active running assets up to the selected date.',
                'يقوم هذا المعالج باحتساب وترحيل قيود الإهلاك لجميع الأصول النشطة حتى التاريخ المحدد.'
              )}
            </p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">{t('Period End Date', 'تاريخ نهاية الفترة')}</label>
              <input
                type="date"
                defaultValue="2026-10-31"
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2e6b7d]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeprWizard(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium"
              >
                {t('Cancel', 'إلغاء')}
              </button>
              <button
                onClick={() => {
                  alert(t('Depreciation entries generated and posted into Journal Entries!', 'تم توليد قيود الإهلاك وترحيلها بنجاح في قيود اليومية!'));
                  setShowDeprWizard(false);
                }}
                className="px-4 py-1.5 bg-[#2e6b7d] hover:bg-[#235361] text-white rounded text-xs font-semibold"
              >
                {t('Generate & Post', 'توليد وترحيل')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {viewType === 'assets' && (
            <>
              <button
                onClick={() =>
                  setSelectedAsset({
                    id: `AST-${Date.now()}`,
                    name: 'New Asset',
                    category: 'Workshop Machinery',
                    grossValue: 150000.0,
                    salvageValue: 5000.0,
                    residualValue: 150000.0,
                    purchaseDate: new Date().toISOString().split('T')[0],
                    method: 'Linear',
                    status: 'Draft',
                    isNew: true,
                    depreciationLines: [],
                  })
                }
                className="px-3.5 py-1.5 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('Create Asset', 'إضافة أصل جديد')}</span>
              </button>

              <button
                onClick={() => setShowDeprWizard(true)}
                className="px-3 py-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-blue-700" />
                <span>{t('Generate Depreciation Entries', 'توليد قيود الإهلاك')}</span>
              </button>
            </>
          )}

          {viewType === 'rental' && (
            <button
              onClick={() => alert(t('New Lease creation wizard', 'إضافة عقد تأجير جديد'))}
              className="px-3.5 py-1.5 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('New Rental Lease', 'عقد تأجير جديد')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {viewType === 'assets' ? (
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">{t('Asset Name', 'اسم الأصل')}</th>
                <th className="py-3 px-3 text-start">{t('Category', 'الفئة')}</th>
                <th className="py-3 px-3 text-start">{t('Purchase Date', 'تاريخ الشراء')}</th>
                <th className="py-3 px-3 text-end">{t('Gross Value', 'القيمة الإجمالية')}</th>
                <th className="py-3 px-3 text-end">{t('Residual Book Value', 'القيمة الدفترية')}</th>
                <th className="py-3 px-3 text-center">{t('Method', 'طريقة الإهلاك')}</th>
                <th className="py-3 px-4 text-center">{t('Status', 'الحالة')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="hover:bg-blue-50/40 cursor-pointer transition"
                >
                  <td className="py-3 px-4 font-bold text-slate-900">{asset.name}</td>
                  <td className="py-3 px-3 text-slate-600">{asset.category}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{asset.purchaseDate}</td>
                  <td className="py-3 px-3 text-end font-mono font-medium text-slate-800">
                    SAR {asset.grossValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-end font-mono font-bold text-blue-700">
                    SAR {asset.residualValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-600">{asset.method} (5Y)</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        asset.status === 'Running'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {asset.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">{t('Equipment / Asset', 'المعدة / الأصل')}</th>
                <th className="py-3 px-3 text-start">{t('Client / Renter', 'المستأجر')}</th>
                <th className="py-3 px-3 text-start">{t('Lease Period', 'فترة العقد')}</th>
                <th className="py-3 px-3 text-end">{t('Monthly Rate', 'القيمة الشهرية')}</th>
                <th className="py-3 px-3 text-end">{t('Security Deposit', 'مبلغ التأمين')}</th>
                <th className="py-3 px-4 text-center">{t('Status', 'الحالة')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rentals.map((rnt) => (
                <tr key={rnt.id} className="hover:bg-blue-50/40 cursor-pointer transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{rnt.asset}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{rnt.client}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{rnt.startDate} → {rnt.endDate}</td>
                  <td className="py-3 px-3 text-end font-mono font-bold text-slate-900">
                    SAR {rnt.rateMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-end font-mono text-slate-700">
                    SAR {rnt.deposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        rnt.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rnt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

