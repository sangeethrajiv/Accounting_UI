import React, { useState } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Percent,
  Download
} from 'lucide-react';

export default function FinancialReportsView({
  t,
  isRtl,
  activeCompany,
  companies = [],
}) {
  const [activeReportTab, setActiveReportTab] = useState('pl'); // 'pl' | 'bs' | 'vat' | 'tb'
  const [period, setPeriod] = useState('Q4 2026 (Oct - Dec)');
  const [expandedSections, setExpandedSections] = useState({
    rev: true,
    cogs: true,
    opex: true,
    assets: true,
    liab: true,
    equity: true,
  });

  const toggleSection = (sec) => {
    setExpandedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  return (
    <div className="space-y-4">
      {/* Top Report Header & Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Report Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'pl', labelEn: 'Profit and Loss (P&L)', labelAr: 'قائمة الأرباح والخسائر' },
            { id: 'bs', labelEn: 'Balance Sheet', labelAr: 'الميزانية العمومية' },
            { id: 'vat', labelEn: 'ZATCA VAT 15% Declaration', labelAr: 'إقرار الزكاة وضريبة القيمة المضافة' },
            { id: 'tb', labelEn: 'Trial Balance', labelAr: 'ميزان المراجعة' },
          ].map((tab) => {
            const isSelected = activeReportTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveReportTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t(tab.labelEn, tab.labelAr)}
              </button>
            );
          })}
        </div>

        {/* Filter Controls & Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer"
            >
              <option value="October 2026">October 2026</option>
              <option value="Q4 2026 (Oct - Dec)">Q4 2026 (Oct - Dec)</option>
              <option value="FY 2026 YTD">FY 2026 YTD</option>
            </select>
          </div>

          <button
            onClick={() => alert(t('Exporting statement to Excel (.xlsx)...', 'جاري تصدير التقرير إلى إكسل...'))}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('Excel', 'إكسل')}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('Print PDF', 'طباعة')}</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: PROFIT AND LOSS (P&L)
         ===================================================================== */}
      {activeReportTab === 'pl' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-6 space-y-6">
          {/* Header Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-slate-200">
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold uppercase text-blue-700">{t('Total Revenue', 'إجمالي الإيرادات')}</span>
              <div className="text-xl font-black text-slate-900 mt-1">SAR 1,425,000.00</div>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 inline-block">↑ +14.2% {t('vs last quarter', 'مقارنة بالربع السابق')}</span>
            </div>
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100">
              <span className="text-[10px] font-bold uppercase text-amber-700">{t('Cost of Sales (COGS)', 'تكلفة المبيعات المباشرة')}</span>
              <div className="text-xl font-black text-slate-900 mt-1">SAR 801,000.00</div>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 inline-block">56.2% {t('of revenue', 'من إجمالي الإيراد')}</span>
            </div>
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold uppercase text-emerald-700">{t('Gross Profit', 'إجمالي الربح')}</span>
              <div className="text-xl font-black text-emerald-800 mt-1">SAR 624,000.00</div>
              <span className="text-[10px] text-emerald-800 font-bold mt-1 inline-block">43.8% {t('Gross Margin', 'هامش الربح الإجمالي')}</span>
            </div>
            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
              <span className="text-[10px] font-bold uppercase text-indigo-700">{t('Net Operating Profit', 'صافي أرباح التشغيل')}</span>
              <div className="text-xl font-black text-indigo-900 mt-1">SAR 349,500.00</div>
              <span className="text-[10px] text-indigo-700 font-bold mt-1 inline-block">24.5% {t('Net Margin', 'هامش صافي الربح')}</span>
            </div>
          </div>

          {/* Statement Detailed Hierarchy */}
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-start">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 text-start">{t('Account Code & Name', 'رمز الحساب والبيان')}</th>
                  <th className="py-2.5 px-4 text-start">{t('Analytic Cost Center', 'مركز التكلفة التحليلي')}</th>
                  <th className="py-2.5 px-4 text-end">{t('Current Period (SAR)', 'الفترة الحالية')}</th>
                  <th className="py-2.5 px-4 text-end">{t('% of Revenue', 'النسبة من الإيراد')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* 1. OPERATING REVENUES */}
                <tr
                  onClick={() => toggleSection('rev')}
                  className="bg-slate-50/80 font-black text-slate-900 cursor-pointer select-none"
                >
                  <td colSpan={2} className="py-2.5 px-4 flex items-center gap-2">
                    {expandedSections.rev ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                    <span>{t('400000 — Operating Revenues (إيرادات التشغيل والمبيعات)', '400000 — إيرادات التشغيل والمبيعات')}</span>
                  </td>
                  <td className="py-2.5 px-4 text-end font-mono">SAR 1,425,000.00</td>
                  <td className="py-2.5 px-4 text-end font-mono">100.0%</td>
                </tr>
                {expandedSections.rev && (
                  <>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-8 text-slate-700">479101 — Hydraulic Testing & Bench Certification</td>
                      <td className="py-2 px-4 text-slate-500 font-mono">CC-101 Workshop Ops</td>
                      <td className="py-2 px-4 text-end font-mono font-semibold">680,000.00</td>
                      <td className="py-2 px-4 text-end font-mono text-slate-500">47.7%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-8 text-slate-700">479102 — Hydraulic Cylinders Overhaul & Rebuild</td>
                      <td className="py-2 px-4 text-slate-500 font-mono">CC-101 Workshop Ops</td>
                      <td className="py-2 px-4 text-end font-mono font-semibold">415,000.00</td>
                      <td className="py-2 px-4 text-end font-mono text-slate-500">29.1%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-8 text-slate-700">479104 — Annual Maintenance Subscriptions (FAY Renewal)</td>
                      <td className="py-2 px-4 text-slate-500 font-mono">CC-101 Workshop Ops</td>
                      <td className="py-2 px-4 text-end font-mono font-semibold">220,000.00</td>
                      <td className="py-2 px-4 text-end font-mono text-slate-500">15.4%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-8 text-slate-700">479105 — Industrial Seals & Fittings Spare Sales</td>
                      <td className="py-2 px-4 text-slate-500 font-mono">CC-102 Spare Parts Inventory</td>
                      <td className="py-2 px-4 text-end font-mono font-semibold">110,000.00</td>
                      <td className="py-2 px-4 text-end font-mono text-slate-500">7.7%</td>
                    </tr>
                  </>
                )}

                {/* 2. COST OF SALES */}
                <tr
                  onClick={() => toggleSection('cogs')}
                  className="bg-slate-50/80 font-black text-slate-900 cursor-pointer select-none"
                >
                  <td colSpan={2} className="py-2.5 px-4 flex items-center gap-2">
                    {expandedSections.cogs ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                    <span>{t('500000 — Cost of Sales & Direct Workshop Expenses (تكلفة المبيعات والتشغيل)', '500000 — تكلفة المبيعات')}</span>
                  </td>
                  <td className="py-2.5 px-4 text-end font-mono text-amber-800">SAR (801,000.00)</td>
                  <td className="py-2.5 px-4 text-end font-mono text-amber-800">56.2%</td>
                </tr>
                {expandedSections.cogs && (
                  <>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-8 text-slate-700">511101 — Hydraulic Spare Parts Procurement (Bosch Rexroth)</td>
                      <td className="py-2 px-4 text-slate-500 font-mono">CC-101 Workshop Ops</td>
                      <td className="py-2 px-4 text-end font-mono font-semibold text-amber-900">(435,000.00)</td>
                      <td className="py-2 px-4 text-end font-mono text-slate-500">30.5%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-8 text-slate-700">511201 — Workshop Direct Technicians & Machinists Salaries</td>
                      <td className="py-2 px-4 text-slate-500 font-mono">CC-101 Workshop Ops</td>
                      <td className="py-2 px-4 text-end font-mono font-semibold text-amber-900">(240,000.00)</td>
                      <td className="py-2 px-4 text-end font-mono text-slate-500">16.8%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-8 text-slate-700">511301 — Hydraulic Oils & Workshop Consumables (Saudi Aramco)</td>
                      <td className="py-2 px-4 text-slate-500 font-mono">CC-101 Workshop Ops</td>
                      <td className="py-2 px-4 text-end font-mono font-semibold text-amber-900">(82,000.00)</td>
                      <td className="py-2 px-4 text-end font-mono text-slate-500">5.8%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-8 text-slate-700">511401 — Allocated Freight & Customs Duty (Landed Cost)</td>
                      <td className="py-2 px-4 text-slate-500 font-mono">CC-104 Landed Costs & Customs</td>
                      <td className="py-2 px-4 text-end font-mono font-semibold text-amber-900">(44,000.00)</td>
                      <td className="py-2 px-4 text-end font-mono text-slate-500">3.1%</td>
                    </tr>
                  </>
                )}

                {/* GROSS PROFIT ROW */}
                <tr className="bg-emerald-50/70 font-black text-emerald-950 text-sm">
                  <td colSpan={2} className="py-3 px-4">{t('GROSS PROFIT (إجمالي الربح)', 'إجمالي الربح')}</td>
                  <td className="py-3 px-4 text-end font-mono">SAR 624,000.00</td>
                  <td className="py-3 px-4 text-end font-mono">43.8%</td>
                </tr>

                {/* 3. OPERATING EXPENSES */}
                <tr
                  onClick={() => toggleSection('opex')}
                  className="bg-slate-50/80 font-black text-slate-900 cursor-pointer select-none"
                >
                  <td colSpan={2} className="py-2.5 px-4 flex items-center gap-2">
                    {expandedSections.opex ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                    <span>{t('600000 — General & Administrative Expenses (المصروفات العمومية والإدارية)', '600000 — المصروفات العمومية')}</span>
                  </td>
                  <td className="py-2.5 px-4 text-end font-mono text-slate-700">SAR (274,500.00)</td>
                  <td className="py-2.5 px-4 text-end font-mono text-slate-700">19.3%</td>
                </tr>
                {expandedSections.opex && (
                  <>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-8 text-slate-700">621101 — Workshop Facility Rent & Electricity</td>
                      <td className="py-2 px-4 text-slate-500 font-mono">CC-General</td>
                      <td className="py-2 px-4 text-end font-mono font-semibold">(125,000.00)</td>
                      <td className="py-2 px-4 text-end font-mono text-slate-500">8.8%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-8 text-slate-700">621201 — Inter-Company Logistics Support (Al Yamama Logistics)</td>
                      <td className="py-2 px-4 text-slate-500 font-mono">CC-103 Logistics Support</td>
                      <td className="py-2 px-4 text-end font-mono font-semibold">(55,500.00)</td>
                      <td className="py-2 px-4 text-end font-mono text-slate-500">3.9%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-8 text-slate-700">621301 — Depreciation on Heavy Test Benches & CNC Lathes</td>
                      <td className="py-2 px-4 text-slate-500 font-mono">CC-Fixed Assets</td>
                      <td className="py-2 px-4 text-end font-mono font-semibold">(48,000.00)</td>
                      <td className="py-2 px-4 text-end font-mono text-slate-500">3.4%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-8 text-slate-700">621401 — ZATCA Cloud Phase 2 Connectivity & SaaS Fees</td>
                      <td className="py-2 px-4 text-slate-500 font-mono">CC-General</td>
                      <td className="py-2 px-4 text-end font-mono font-semibold">(46,000.00)</td>
                      <td className="py-2 px-4 text-end font-mono text-slate-500">3.2%</td>
                    </tr>
                  </>
                )}

                {/* NET PROFIT ROW */}
                <tr className="bg-indigo-900 text-white font-black text-sm">
                  <td colSpan={2} className="py-3 px-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>{t('NET OPERATING PROFIT (صافي أرباح التشغيل)', 'صافي أرباح التشغيل')}</span>
                  </td>
                  <td className="py-3 px-4 text-end font-mono">SAR 349,500.00</td>
                  <td className="py-3 px-4 text-end font-mono">24.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: BALANCE SHEET
         ===================================================================== */}
      {activeReportTab === 'bs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-700">{t('Statement of Financial Position', 'قائمة المركز المالي')}</span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                {t('Al Yamama Balance Sheet — As of October 31, 2026', 'الميزانية العمومية لمجموعة اليمامة')}
              </h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('Balanced & Audited: Assets = Liab + Equity', 'متوازنة ومدققة')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* LEFT: ASSETS */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <h4 className="font-black text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                <span>{t('100000 — TOTAL ASSETS (إجمالي الأصول)', 'إجمالي الأصول')}</span>
                <span className="font-mono text-blue-900">SAR 5,825,000.00</span>
              </h4>

              <div className="space-y-2">
                <div className="font-bold text-slate-700 text-xs">{t('Current Assets (الأصول المتداولة)', 'الأصول المتداولة')}</div>
                <div className="space-y-1 pl-3 text-slate-600">
                  <div className="flex justify-between">
                    <span>111102 — Riyad Bank Corporate Account</span>
                    <span className="font-mono font-bold text-slate-800">1,480,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>111103 — SNB National Commercial Bank</span>
                    <span className="font-mono font-bold text-slate-800">820,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>111201 — Petty Cash Drawer (Workshop)</span>
                    <span className="font-mono font-bold text-slate-800">45,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>112101 — Accounts Receivable (Customer Invoices)</span>
                    <span className="font-mono font-bold text-slate-800">1,630,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>113101 — Spare Parts & Consumables Stock Valuation</span>
                    <span className="font-mono font-bold text-slate-800">750,000.00</span>
                  </div>
                </div>

                <div className="font-bold text-slate-700 text-xs pt-2 border-t border-slate-200">
                  {t('Non-Current / Fixed Assets (الأصول الثابتة)', 'الأصول الثابتة')}
                </div>
                <div className="space-y-1 pl-3 text-slate-600">
                  <div className="flex justify-between">
                    <span>121101 — Heavy Hydraulic Test Benches (600-Ton)</span>
                    <span className="font-mono font-bold text-slate-800">950,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>121201 — CNC Cylinder Honing & Machining Lathes</span>
                    <span className="font-mono font-bold text-slate-800">430,000.00</span>
                  </div>
                  <div className="flex justify-between text-amber-800">
                    <span>121999 — Less: Accumulated Depreciation</span>
                    <span className="font-mono font-bold">(280,000.00)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: LIABILITIES & EQUITY */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <h4 className="font-black text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                <span>{t('200000 & 300000 — LIABILITIES & EQUITY', 'الالتزامات وحقوق الملكية')}</span>
                <span className="font-mono text-blue-900">SAR 5,825,000.00</span>
              </h4>

              <div className="space-y-2">
                <div className="font-bold text-slate-700 text-xs">{t('Current Liabilities (الالتزامات المتداولة)', 'الالتزامات المتداولة')}</div>
                <div className="space-y-1 pl-3 text-slate-600">
                  <div className="flex justify-between">
                    <span>211101 — Accounts Payable (Vendor Bills)</span>
                    <span className="font-mono font-bold text-slate-800">895,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>211201 — Inter-Company Mirror Payables (Logistics)</span>
                    <span className="font-mono font-bold text-slate-800">94,250.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>214101 — ZATCA Output VAT 15% Net Payable</span>
                    <span className="font-mono font-bold text-blue-800">86,250.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>215101 — Accrued Workshop Salaries & Utilities</span>
                    <span className="font-mono font-bold text-slate-800">120,000.00</span>
                  </div>
                </div>

                <div className="font-bold text-slate-700 text-xs pt-2 border-t border-slate-200">
                  {t('Equity (حقوق الملكية)', 'حقوق الملكية')}
                </div>
                <div className="space-y-1 pl-3 text-slate-600">
                  <div className="flex justify-between">
                    <span>311101 — Paid-Up Share Capital</span>
                    <span className="font-mono font-bold text-slate-800">3,500,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>321101 — Retained Earnings from Prior Years</span>
                    <span className="font-mono font-bold text-slate-800">780,000.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>331101 — Current Period Net Operating Income</span>
                    <span className="font-mono">349,500.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: ZATCA VAT 15% DECLARATION (TAX RETURN)
         ===================================================================== */}
      {activeReportTab === 'vat' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">
                {t('ZATCA Tax Return Declaration (Form VAT 15%)', 'إقرار ضريبة القيمة المضافة لهيئة الزكاة والضريبة والجمارك')}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                {t('Flames of Al-Yamama Group — VAT Return for October 2026', 'إقرار الضريبة لمجموعة شعلة اليمامة')}
              </h3>
              <div className="text-xs text-slate-500 mt-0.5">
                <span>{t('VAT Registration Number:', 'الرقم الضريبي للمجموعة:')} </span>
                <span className="font-mono font-bold text-blue-900">310436125600003</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-700 shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-950">{t('ZATCA Phase 2 Verified', 'مطابق للمرحلة الثانية للربط والتكامل')}</div>
                <div className="text-[10px] text-slate-500">{t('Cryptographic Stamp & Cleared QR Checked', 'تم التحقق من الختم الرقمي والرمز')}</div>
              </div>
            </div>
          </div>

          {/* Official ZATCA Declaration Boxes */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-start">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 text-start">{t('Declaration Box / Category', 'بند الإقرار الضريبي')}</th>
                  <th className="py-2.5 px-4 text-end">{t('Amount Subject to VAT (SAR)', 'المبلغ الخاضع للضريبة')}</th>
                  <th className="py-2.5 px-4 text-end">{t('Adjustment (SAR)', 'التعديل')}</th>
                  <th className="py-2.5 px-4 text-end">{t('VAT 15% Amount (SAR)', 'مبلغ الضريبة 15%')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* SALES (OUTPUT TAX) */}
                <tr className="bg-blue-50/50 font-bold text-blue-950">
                  <td colSpan={4} className="py-2 px-4">{t('Part 1: Sales / Output VAT (المبيعات وضريبة المخرجات)', 'المبيعات وضريبة المخرجات')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    Box 1: Standard Rated Sales 15% (Customer Invoices & Subscriptions)
                  </td>
                  <td className="py-2.5 px-4 text-end font-mono">1,425,000.00</td>
                  <td className="py-2.5 px-4 text-end font-mono">0.00</td>
                  <td className="py-2.5 px-4 text-end font-mono font-bold text-blue-900">213,750.00</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    Box 2: Zero-Rated Sales / Exports (GCC Transport Services)
                  </td>
                  <td className="py-2.5 px-4 text-end font-mono">0.00</td>
                  <td className="py-2.5 px-4 text-end font-mono">0.00</td>
                  <td className="py-2.5 px-4 text-end font-mono">0.00</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900">
                  <td className="py-2.5 px-4">{t('Total Output VAT on Sales (إجمالي ضريبة المخرجات)', 'إجمالي ضريبة المخرجات')}</td>
                  <td className="py-2.5 px-4 text-end font-mono">1,425,000.00</td>
                  <td className="py-2.5 px-4 text-end font-mono">0.00</td>
                  <td className="py-2.5 px-4 text-end font-mono font-bold text-blue-900">SAR 213,750.00</td>
                </tr>

                {/* PURCHASES (INPUT TAX) */}
                <tr className="bg-amber-50/50 font-bold text-amber-950">
                  <td colSpan={4} className="py-2 px-4">{t('Part 2: Purchases / Input VAT Recoverable (المشتريات وضريبة المدخلات القابلة للخصم)', 'المشتريات وضريبة المدخلات')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    Box 8: Standard Rated Domestic Purchases 15% (Vendor Bills & Supplies)
                  </td>
                  <td className="py-2.5 px-4 text-end font-mono">680,000.00</td>
                  <td className="py-2.5 px-4 text-end font-mono">0.00</td>
                  <td className="py-2.5 px-4 text-end font-mono font-bold text-amber-900">(102,000.00)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    Box 9: Imports Subject to Customs 15% (Bosch Rexroth Pumps Clearance)
                  </td>
                  <td className="py-2.5 px-4 text-end font-mono">170,000.00</td>
                  <td className="py-2.5 px-4 text-end font-mono">0.00</td>
                  <td className="py-2.5 px-4 text-end font-mono font-bold text-amber-900">(25,500.00)</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900">
                  <td className="py-2.5 px-4">{t('Total Input VAT Recoverable (إجمالي ضريبة المدخلات المستردة)', 'إجمالي ضريبة المدخلات')}</td>
                  <td className="py-2.5 px-4 text-end font-mono">850,000.00</td>
                  <td className="py-2.5 px-4 text-end font-mono">0.00</td>
                  <td className="py-2.5 px-4 text-end font-mono font-bold text-amber-900">SAR (127,500.00)</td>
                </tr>

                {/* NET VAT PAYABLE */}
                <tr className="bg-emerald-900 text-white font-black text-sm">
                  <td colSpan={3} className="py-3 px-4">
                    {t('Box 14: NET VAT PAYABLE TO ZATCA (صافي الضريبة المستحقة السداد لهيئة الزكاة)', 'صافي الضريبة المستحقة لهيئة الزكاة')}
                  </td>
                  <td className="py-3 px-4 text-end font-mono">SAR 86,250.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: TRIAL BALANCE
         ===================================================================== */}
      {activeReportTab === 'tb' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-700">{t('General Ledger Summary', 'ملخص دفتر الأستاذ العام')}</span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">{t('Trial Balance — October 2026', 'ميزان المراجعة')}</h3>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Total Debits SAR 5,825,000.00 = Total Credits SAR 5,825,000.00 ✓
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-start">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 text-start">{t('Account Code', 'رمز الحساب')}</th>
                  <th className="py-2.5 px-4 text-start">{t('Account Name', 'اسم الحساب')}</th>
                  <th className="py-2.5 px-4 text-end">{t('Debit (SAR)', 'مدين')}</th>
                  <th className="py-2.5 px-4 text-end">{t('Credit (SAR)', 'دائن')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="py-2 px-4 font-bold text-blue-900">111102</td>
                  <td className="py-2 px-4 font-sans font-medium text-slate-800">Riyad Bank Corporate Current Account</td>
                  <td className="py-2 px-4 text-end font-bold">1,480,000.00</td>
                  <td className="py-2 px-4 text-end text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-bold text-blue-900">112101</td>
                  <td className="py-2 px-4 font-sans font-medium text-slate-800">Accounts Receivable (Trade Debtors)</td>
                  <td className="py-2 px-4 text-end font-bold">1,630,000.00</td>
                  <td className="py-2 px-4 text-end text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-bold text-blue-900">113101</td>
                  <td className="py-2 px-4 font-sans font-medium text-slate-800">Inventory Stock Valuation (Hydraulic Spares)</td>
                  <td className="py-2 px-4 text-end font-bold">750,000.00</td>
                  <td className="py-2 px-4 text-end text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-bold text-blue-900">121101</td>
                  <td className="py-2 px-4 font-sans font-medium text-slate-800">Hydraulic Machinery & Heavy Test Benches</td>
                  <td className="py-2 px-4 text-end font-bold">1,380,000.00</td>
                  <td className="py-2 px-4 text-end text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-bold text-blue-900">211101</td>
                  <td className="py-2 px-4 font-sans font-medium text-slate-800">Accounts Payable (Trade Creditors)</td>
                  <td className="py-2 px-4 text-end text-slate-400">-</td>
                  <td className="py-2 px-4 text-end font-bold">895,000.00</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-bold text-blue-900">214101</td>
                  <td className="py-2 px-4 font-sans font-medium text-slate-800">ZATCA Output VAT 15% Payable</td>
                  <td className="py-2 px-4 text-end text-slate-400">-</td>
                  <td className="py-2 px-4 text-end font-bold text-blue-800">86,250.00</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-bold text-blue-900">311101</td>
                  <td className="py-2 px-4 font-sans font-medium text-slate-800">Paid-Up Capital & Retained Earnings</td>
                  <td className="py-2 px-4 text-end text-slate-400">-</td>
                  <td className="py-2 px-4 text-end font-bold">4,280,000.00</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-bold text-blue-900">479101</td>
                  <td className="py-2 px-4 font-sans font-medium text-slate-800">Hydraulic Workshop Operating Revenues</td>
                  <td className="py-2 px-4 text-end text-slate-400">-</td>
                  <td className="py-2 px-4 text-end font-bold text-emerald-800">1,425,000.00</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-bold text-blue-900">511101</td>
                  <td className="py-2 px-4 font-sans font-medium text-slate-800">Cost of Goods & Spare Parts Sold</td>
                  <td className="py-2 px-4 text-end font-bold text-amber-800">801,000.00</td>
                  <td className="py-2 px-4 text-end text-slate-400">-</td>
                </tr>
                <tr className="bg-slate-100 font-black text-slate-900">
                  <td colSpan={2} className="py-2.5 px-4 font-sans">{t('TOTAL (الإجمالي المتوازن)', 'الإجمالي المتوازن')}</td>
                  <td className="py-2.5 px-4 text-end font-mono">SAR 5,825,000.00</td>
                  <td className="py-2.5 px-4 text-end font-mono">SAR 5,825,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

