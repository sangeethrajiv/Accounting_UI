import React, { useState } from 'react';
import {
  X, Save, CheckCircle2, AlertCircle, Plus, Trash2, Calendar,
  Building2, BookOpen, Layers
} from 'lucide-react';

const JOURNALS = [
  { id: 'MISC', name: 'General Operations (MISC)' },
  { id: 'Purchases', name: 'Purchases (RBILL)' },
  { id: 'Customer Invoices', name: 'Customer Invoices (INV)' },
  { id: 'Inventory Valuation', name: 'Inventory Valuation (STJ)' },
  { id: 'Al Rajhi Bank (SAR)', name: 'Al Rajhi Bank (SAR)' },
  { id: 'Riyad Bank (SAR)', name: 'Riyad Bank (SAR)' },
  { id: 'Main Cash Box (SAR)', name: 'Main Cash Box (SAR)' },
];

const COMMON_ACCOUNTS = [
  { code: '112101', name: '112101 — Accounts Receivable (Customer Invoices)' },
  { code: '113101', name: '113101 — Inventory Valuation (Hydraulic Spare Parts)' },
  { code: '113901', name: '113901 — Stock Interim Account (Received Goods)' },
  { code: '111101', name: '111101 — Al Rajhi Bank Corporate Account' },
  { code: '111201', name: '111201 — Petty Cash Fund - Workshop' },
  { code: '211101', name: '211101 — Accounts Payable (Vendor Bills)' },
  { code: '214101', name: '214101 — ZATCA Output VAT 15%' },
  { code: '411101', name: '411101 — Workshop Repair & Maintenance Revenue' },
  { code: '479104', name: '479104 — Hydraulic Cylinder Overhaul Services' },
  { code: '510101', name: '510101 — Spare Parts & Consumables Cost' },
  { code: '520101', name: '520101 — Workshop Direct Labor & Technicians' },
];

const ANALYTIC_CENTERS = [
  'CC-101 Workshop Operations',
  'CC-102 Spare Parts Inventory',
  'CC-103 Logistics Support',
  'CC-201 Heavy Equipment Leasing',
  'CC-301 Administrative Overhead',
];

export default function JournalEntryCreateModal({
  isOpen,
  onClose,
  onSave,
  t,
  isRtl,
  companies = [],
  activeCompany,
}) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [forceDate, setForceDate] = useState(todayStr);
  const [journal, setJournal] = useState(JOURNALS[0].name);
  const [companyId, setCompanyId] = useState(activeCompany?.id || (companies[0]?.id || 'HYD'));
  const [reference, setReference] = useState('Manual GL Adjustment / Cost Allocation');
  const [partner, setPartner] = useState('Al Yamama Hydraulic Workshop');

  const [lines, setLines] = useState([
    {
      id: 1,
      account: COMMON_ACCOUNTS[1].name,
      partner: 'Bosch Rexroth AG (Germany)',
      analytic: ANALYTIC_CENTERS[0],
      debit: 25000,
      credit: 0,
    },
    {
      id: 2,
      account: COMMON_ACCOUNTS[5].name,
      partner: 'Bosch Rexroth AG (Germany)',
      analytic: ANALYTIC_CENTERS[0],
      debit: 0,
      credit: 25000,
    },
  ]);

  const totalDebits = lines.reduce((acc, l) => acc + (Number(l.debit) || 0), 0);
  const totalCredits = lines.reduce((acc, l) => acc + (Number(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01 && totalDebits > 0;
  const difference = Math.abs(totalDebits - totalCredits);

  const handleAddLine = () => {
    setLines([
      ...lines,
      {
        id: Date.now(),
        account: COMMON_ACCOUNTS[0].name,
        partner: partner,
        analytic: ANALYTIC_CENTERS[0],
        debit: 0,
        credit: 0,
      },
    ]);
  };

  const handleRemoveLine = (id) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((l) => l.id !== id));
  };

  const handleLineChange = (id, field, value) => {
    setLines(
      lines.map((l) => {
        if (l.id !== id) return l;
        if (field === 'debit' && Number(value) > 0) {
          return { ...l, debit: Number(value), credit: 0 };
        }
        if (field === 'credit' && Number(value) > 0) {
          return { ...l, credit: Number(value), debit: 0 };
        }
        return { ...l, [field]: value };
      })
    );
  };

  const handlePost = (status = 'Posted') => {
    if (!isBalanced && status === 'Posted') {
      alert(t('Cannot post unbalanced journal entry. Total debits must equal total credits.', 'لا يمكن ترحيل قيد غير متوازن. يجب أن تتساوى المدينات مع الدائنات.'));
      return;
    }

    const comp = companies.find((c) => c.id === companyId) || activeCompany;
    const prefix = journal.includes('Purchases')
      ? 'RBILL'
      : journal.includes('Invoices')
      ? 'INV'
      : journal.includes('Bank')
      ? 'BNK1'
      : journal.includes('Cash')
      ? 'CSH1'
      : 'MISC';

    const newJe = {
      id: `JE-${Date.now()}`,
      date: date,
      forceDate: forceDate,
      number: `${prefix}/2026/11/${Math.floor(100 + Math.random() * 900)}`,
      partner: partner,
      ref: reference,
      journal: journal,
      company: comp?.nameEn || 'Flames of Al-Yamama Hydraulic Co',
      companyId: comp?.id || 'HYD',
      total: totalDebits,
      status: status,
      lines: lines,
    };

    onSave(newJe);
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
        className="bg-white rounded-xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePost('Posted')}
              disabled={!isBalanced}
              className={`px-3.5 py-1.5 rounded-md text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5 ${
                isBalanced
                  ? 'bg-blue-700 hover:bg-blue-800'
                  : 'bg-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('Post to General Ledger', 'ترحيل لدفتر الأستاذ')}</span>
            </button>
            <button
              onClick={() => handlePost('Draft')}
              className="px-3.5 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t('Save as Draft', 'حفظ كمسودة')}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isBalanced ? (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('Balanced (Debits = Credits)', 'القيد متوازن')}</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{t('Difference:', 'الفارق:')} SAR {difference.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </span>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              {t('New Journal Entry (Odoo 12 account.move)', 'إنشاء قيد يومية جديد')}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              {reference || t('Draft Journal Entry', 'مسودة قيد يومية')}
            </h2>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('Journal', 'دفتر اليومية')}
              </label>
              <select
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700"
              >
                {JOURNALS.map((j) => (
                  <option key={j.id} value={j.name}>{j.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('Accounting Date', 'تاريخ القيد')}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('Force Accounting Date (stock_force_date)', 'تاريخ الترحيل الإجباري')}
              </label>
              <input
                type="date"
                value={forceDate}
                onChange={(e) => setForceDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-mono text-blue-800 font-semibold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('Company Entity', 'الشركة')}
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{t(c.nameEn, c.nameAr)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('Reference / Description', 'المرجع والبيان')}
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. Workshop Cylinder Seals Adjustment"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('Partner / Counterparty', 'الشريك / الطرف المقابل')}
              </label>
              <input
                type="text"
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                placeholder="Partner name..."
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          {/* Balanced Journal Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                <span>{t('Journal Lines (account.move.line)', 'بنود القيد المحاسبي')}</span>
              </h3>
              <button
                type="button"
                onClick={handleAddLine}
                className="text-blue-700 hover:text-blue-900 font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('Add an Account Line', 'إضافة حساب جديد')}</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-2.5 px-3 text-start w-1/3">{t('Account', 'الحساب')}</th>
                    <th className="py-2.5 px-3 text-start">{t('Partner', 'الشريك')}</th>
                    <th className="py-2.5 px-3 text-start">{t('Analytic Account', 'مركز التكلفة')}</th>
                    <th className="py-2.5 px-3 text-end w-28">{t('Debit (SAR)', 'مدين')}</th>
                    <th className="py-2.5 px-3 text-end w-28">{t('Credit (SAR)', 'دائن')}</th>
                    <th className="py-2.5 px-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map((l) => (
                    <tr key={l.id} className="hover:bg-blue-50/20">
                      <td className="py-2 px-3">
                        <select
                          value={l.account}
                          onChange={(e) => handleLineChange(l.id, 'account', e.target.value)}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:border-blue-700 focus:outline-none"
                        >
                          {COMMON_ACCOUNTS.map((acc) => (
                            <option key={acc.code} value={acc.name}>{acc.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={l.partner}
                          onChange={(e) => handleLineChange(l.id, 'partner', e.target.value)}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:border-blue-700 focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={l.analytic}
                          onChange={(e) => handleLineChange(l.id, 'analytic', e.target.value)}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:border-blue-700 focus:outline-none"
                        >
                          {ANALYTIC_CENTERS.map((ac) => (
                            <option key={ac} value={ac}>{ac}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3 text-end">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={l.debit || ''}
                          onChange={(e) => handleLineChange(l.id, 'debit', e.target.value)}
                          placeholder="0.00"
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-end font-mono font-semibold focus:border-blue-700 focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-3 text-end">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={l.credit || ''}
                          onChange={(e) => handleLineChange(l.id, 'credit', e.target.value)}
                          placeholder="0.00"
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-end font-mono font-semibold focus:border-blue-700 focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(l.id)}
                          disabled={lines.length <= 2}
                          className="text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                  <tr>
                    <td colSpan={3} className="py-2.5 px-3 text-end text-slate-700">
                      {t('Total (SAR):', 'الإجمالي:')}
                    </td>
                    <td className="py-2.5 px-3 text-end font-mono text-slate-900 text-xs">
                      SAR {totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-end font-mono text-slate-900 text-xs">
                      SAR {totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition"
          >
            {t('Cancel', 'إلغاء')}
          </button>
          <button
            type="button"
            onClick={() => handlePost('Posted')}
            disabled={!isBalanced}
            className={`px-4 py-1.5 rounded-md text-white font-semibold text-xs shadow-xs transition ${
              isBalanced
                ? 'bg-blue-700 hover:bg-blue-800'
                : 'bg-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            {t('Post Entry', 'ترحيل القيد')}
          </button>
        </div>
      </div>
    </div>
  );
}

