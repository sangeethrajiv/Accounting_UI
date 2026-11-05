import React, { useState } from 'react';
import {
  Plus, Search, Edit2, Trash2, CheckCircle2,
  Building2, Landmark, Percent, Clock, Globe
} from 'lucide-react';

export const INITIAL_COA = [
  { code: '111101', name: 'Al Rajhi Corporate Bank SAR', type: 'Bank and Cash', currency: 'SAR', balance: 242592.42 },
  { code: '111201', name: 'Workshop Petty Cash Drawer SAR', type: 'Bank and Cash', currency: 'SAR', balance: 18450.0 },
  { code: '112101', name: 'Accounts Receivable (Trade Debtors)', type: 'Receivable', currency: 'SAR', balance: 92630.5 },
  { code: '113101', name: 'Raw Material Inventory & Hydraulic Parts', type: 'Current Assets', currency: 'SAR', balance: 485000.0 },
  { code: '113901', name: 'Stock Interim Account (Received Goods)', type: 'Current Assets', currency: 'SAR', balance: 34500.0 },
  { code: '121101', name: 'Workshop Machinery & Test Equipment', type: 'Fixed Assets', currency: 'SAR', balance: 730000.0 },
  { code: '121901', name: 'Accumulated Depreciation — Machinery', type: 'Fixed Assets', currency: 'SAR', balance: -240000.0 },
  { code: '211101', name: 'Accounts Payable (Trade Creditors)', type: 'Payable', currency: 'SAR', balance: -93878.27 },
  { code: '214101', name: 'VAT Output Tax Payable (ZATCA 15%)', type: 'Current Liabilities', currency: 'SAR', balance: -45200.0 },
  { code: '214201', name: 'VAT Input Tax Recoverable', type: 'Current Liabilities', currency: 'SAR', balance: 18400.0 },
  { code: '311101', name: 'Share Capital (Al Yamama Partners)', type: 'Equity', currency: 'SAR', balance: -1000000.0 },
  { code: '411101', name: 'Hydraulic Cylinder Repair & Overhaul Revenue', type: 'Income', currency: 'SAR', balance: -650000.0 },
  { code: '411201', name: 'Spare Parts & Seal Kits Trading Revenue', type: 'Income', currency: 'SAR', balance: -320000.0 },
  { code: '511101', name: 'Direct Workshop Labor & Technicians', type: 'Cost of Revenue', currency: 'SAR', balance: 180000.0 },
  { code: '511201', name: 'Raw Materials & Chrome Rods Consumed', type: 'Cost of Revenue', currency: 'SAR', balance: 245000.0 },
];

export const INITIAL_JOURNALS = [
  { id: 'J-1', name: 'Customer Invoices (SAR)', code: 'INV', type: 'Sale', defaultAccount: '411101 Revenue', company: 'Flames of Al-Yamama Hydraulic Co' },
  { id: 'J-2', name: 'Vendor Bills & Expenses', code: 'BILL', type: 'Purchase', defaultAccount: '511201 Direct Cost', company: 'Flames of Al-Yamama Hydraulic Co' },
  { id: 'J-3', name: 'Al Rajhi Corporate Bank SAR', code: 'BNK1', type: 'Bank', defaultAccount: '111101 Bank', company: 'Flames of Al-Yamama Hydraulic Co' },
  { id: 'J-4', name: 'Workshop Cash Register SAR', code: 'CSH1', type: 'Cash', defaultAccount: '111201 Cash Drawer', company: 'Flames of Al-Yamama Hydraulic Co' },
  { id: 'J-5', name: 'Miscellaneous Operations & GL Adjustments', code: 'MISC', type: 'General', defaultAccount: '112101 Receivable', company: 'Flames of Al-Yamama Hydraulic Co' },
  { id: 'J-6', name: 'Inventory Valuation & Landed Cost Journal', code: 'STJ', type: 'General', defaultAccount: '113101 Stock Valuation', company: 'Flames of Al-Yamama Hydraulic Co' },
];

export const INITIAL_TAXES = [
  { id: 'TAX-1', name: 'VAT 15% Standard Rate (ZATCA)', scope: 'Sales & Purchases', rate: 15.0, type: 'Percent', account: '214101 VAT Output / 214201 VAT Input' },
  { id: 'TAX-2', name: 'VAT 0% Zero-Rated (GCC / Export)', scope: 'Sales', rate: 0.0, type: 'Percent', account: '214101 VAT Output' },
  { id: 'TAX-3', name: 'VAT Exempt (Financial / Healthcare)', scope: 'Sales & Purchases', rate: 0.0, type: 'Percent', account: 'None' },
];

export const INITIAL_TERMS = [
  { id: 'TRM-1', name: 'Immediate Payment (سداد فوري)', days: 0, description: 'Due upon invoice validation' },
  { id: 'TRM-2', name: '15 Days Net', days: 15, description: 'Payment due 15 days after invoice date' },
  { id: 'TRM-3', name: '30 Days Net', days: 30, description: 'Payment due 30 days after invoice date' },
  { id: 'TRM-4', name: '60 Days Corporate Terms', days: 60, description: 'Aramco & BARCC construction contract terms' },
  { id: 'TRM-5', name: 'End of Following Month (نهاية الشهر التالي)', days: 45, description: 'Due at the end of the next calendar month' },
];

export default function ConfigurationViews({
  subView = 'coa', // 'coa' | 'journals' | 'taxes' | 'terms' | 'currencies'
  t,
  isRtl,
}) {
  const [coaList, setCoaList] = useState(INITIAL_COA);
  const [journals, setJournals] = useState(INITIAL_JOURNALS);
  const [taxes, setTaxes] = useState(INITIAL_TAXES);
  const [terms, setTerms] = useState(INITIAL_TERMS);
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-4">
      {/* Top Action Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(t('New record creation wizard', 'إضافة سجل جديد'))}
            className="px-3.5 py-1.5 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>
              {subView === 'coa' && t('Create Account', 'إضافة حساب جديد')}
              {subView === 'journals' && t('Create Journal', 'إضافة دفتر يومية')}
              {subView === 'taxes' && t('Create Tax', 'إضافة ضريبة')}
              {subView === 'terms' && t('Create Payment Term', 'إضافة شرط دفع')}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs w-64">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search...', 'بحث...')}
            className="w-full bg-transparent focus:outline-none text-slate-700"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* CHART OF ACCOUNTS */}
        {subView === 'coa' && (
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">{t('Code', 'رمز الحساب')}</th>
                <th className="py-3 px-3 text-start">{t('Account Name', 'اسم الحساب')}</th>
                <th className="py-3 px-3 text-start">{t('Type', 'نوع الحساب')}</th>
                <th className="py-3 px-3 text-center">{t('Currency', 'العملة')}</th>
                <th className="py-3 px-4 text-end">{t('Current Balance (SAR)', 'الرصيد الحالي')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coaList
                .filter(
                  (a) =>
                    !search ||
                    a.code.includes(search) ||
                    a.name.toLowerCase().includes(search.toLowerCase()) ||
                    a.type.toLowerCase().includes(search.toLowerCase())
                )
                .map((a) => (
                  <tr key={a.code} className="hover:bg-blue-50/40 cursor-pointer transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-800">{a.code}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{a.name}</td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium text-slate-700">
                        {a.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{a.currency}</td>
                    <td className="py-3 px-4 text-end font-mono font-bold text-slate-900">
                      {a.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* JOURNALS */}
        {subView === 'journals' && (
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">{t('Journal Name', 'اسم اليومية')}</th>
                <th className="py-3 px-3 text-start">{t('Type', 'النوع')}</th>
                <th className="py-3 px-3 text-start">{t('Short Code', 'الرمز')}</th>
                <th className="py-3 px-3 text-start">{t('Default Account', 'الحساب الافتراضي')}</th>
                <th className="py-3 px-4 text-start">{t('Company', 'الشركة')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {journals
                .filter((j) => !search || j.name.toLowerCase().includes(search.toLowerCase()))
                .map((j) => (
                  <tr key={j.id} className="hover:bg-blue-50/40 cursor-pointer transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{j.name}</td>
                    <td className="py-3 px-3 text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        {j.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{j.code}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{j.defaultAccount}</td>
                    <td className="py-3 px-4 text-slate-600">{j.company}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* TAXES */}
        {subView === 'taxes' && (
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">{t('Tax Name', 'اسم الضريبة')}</th>
                <th className="py-3 px-3 text-start">{t('Tax Scope', 'نطاق التطبيق')}</th>
                <th className="py-3 px-3 text-center">{t('Rate (%)', 'النسبة')}</th>
                <th className="py-3 px-4 text-start">{t('Tax Account', 'حساب الضريبة')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {taxes.map((tx) => (
                <tr key={tx.id} className="hover:bg-blue-50/40 cursor-pointer transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{tx.name}</td>
                  <td className="py-3 px-3 text-slate-700">{tx.scope}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-blue-700">{tx.rate}%</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{tx.account}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PAYMENT TERMS */}
        {subView === 'terms' && (
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">{t('Payment Term', 'شرط الدفع')}</th>
                <th className="py-3 px-3 text-start">{t('Days', 'الأيام')}</th>
                <th className="py-3 px-4 text-start">{t('Description / Rule', 'الوصف والقاعدة')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {terms.map((trm) => (
                <tr key={trm.id} className="hover:bg-blue-50/40 cursor-pointer transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{trm.name}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{trm.days} days</td>
                  <td className="py-3 px-4 text-slate-600">{trm.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

