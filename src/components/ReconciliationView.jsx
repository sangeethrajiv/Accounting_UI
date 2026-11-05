import React, { useState } from 'react';
import {
  CheckCircle2, ArrowRightLeft, Landmark, FileText,
  RefreshCw, Check, AlertCircle, ShieldCheck
} from 'lucide-react';

export default function ReconciliationView({
  t,
  isRtl,
}) {
  const [bankTransactions, setBankTransactions] = useState([
    { id: 'TX-1', date: '2026-10-30', label: 'SARIE Inbound Transfer — Neom Bay JV', bank: 'Al Rajhi Bank (111101)', amount: 150000.0, partner: 'Neom Bay Infrastructure JV', selected: true },
    { id: 'TX-2', date: '2026-10-28', label: 'Direct Deposit — Riyadh Metro Corp', bank: 'Riyad Bank (111102)', amount: 57500.0, partner: 'Riyadh Metro Construction Corp.', selected: false },
    { id: 'TX-3', date: '2026-10-25', label: 'Outbound Supplier Remittance — Bosch Rexroth', bank: 'SNB Bank (111103)', amount: -185000.0, partner: 'Bosch Rexroth AG (Germany)', selected: false },
    { id: 'TX-4', date: '2026-10-22', label: 'Corporate Cheque Clearance #0048912', bank: 'Al Rajhi Bank (111101)', amount: -42500.0, partner: 'Ready Mat Industrial Saudi', selected: false },
  ]);

  const [openEntries, setOpenEntries] = useState([
    { id: 'OP-1', date: '2026-10-30', number: 'PRO/2026/00006', partner: 'Neom Bay Infrastructure JV', due: 150000.0, type: 'Customer Invoice', selected: true },
    { id: 'OP-2', date: '2026-10-28', number: 'INV/2026/00012', partner: 'Riyadh Metro Construction Corp.', due: 37500.0, type: 'Customer Invoice', selected: false },
    { id: 'OP-3', date: '2026-10-28', number: 'BILL/2026/10/0198', partner: 'Bosch Rexroth AG (Germany)', due: 162000.0, type: 'Vendor Bill', selected: false },
    { id: 'OP-4', date: '2026-10-22', number: 'RBILL/2026/10/0001', partner: 'Ready Mat Industrial Saudi', due: 34500.0, type: 'Vendor Bill', selected: false },
  ]);

  const selectedTx = bankTransactions.filter((tx) => tx.selected);
  const selectedOp = openEntries.filter((op) => op.selected);

  const txSum = selectedTx.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const opSum = selectedOp.reduce((sum, op) => sum + op.due, 0);
  const diff = Math.abs(txSum - opSum);
  const isMatch = diff < 0.01 && selectedTx.length > 0 && selectedOp.length > 0;

  const handleToggleTx = (id) => {
    setBankTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, selected: !tx.selected } : tx))
    );
  };

  const handleToggleOp = (id) => {
    setOpenEntries((prev) =>
      prev.map((op) => (op.id === id ? { ...op, selected: !op.selected } : op))
    );
  };

  const handleReconcile = () => {
    if (!isMatch) return;
    alert(t('Reconciliation successful! Entries matched and journal move balanced.', 'تمت التسوية بنجاح! تم ربط المعاملة المصرفية بالفاتورة وترحيل قيد التسوية.'));
    setBankTransactions((prev) => prev.filter((tx) => !tx.selected));
    setOpenEntries((prev) => prev.filter((op) => !op.selected));
  };

  return (
    <div className="space-y-4">
      {/* Reconciliation Summary Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {t('Bank & Payment Manual Reconciliation', 'التسوية اليدوية للبنك والفواتير')}
            </h2>
            <p className="text-xs text-slate-500">
              {t(
                'Match bank statement lines with open customer invoices and vendor bills.',
                'مطابقة حركات كشف الحساب البنكي مع الفواتير المفتوحة للعملاء والموردين.'
              )}
            </p>
          </div>
        </div>

        {/* Selected Totals & Reconcile Button */}
        <div className="flex items-center gap-4">
          <div className="text-xs text-end">
            <span className="text-slate-500 block">{t('Matched Sum:', 'إجمالي المطابقة:')}</span>
            <span className="font-mono font-bold text-slate-800">
              SAR {txSum.toLocaleString('en-US', { minimumFractionDigits: 2 })} / SAR {opSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="text-xs text-end border-l border-slate-200 pl-4">
            <span className="text-slate-500 block">{t('Difference:', 'الفارق:')}</span>
            <span className={`font-mono font-bold ${isMatch ? 'text-emerald-700' : 'text-rose-600'}`}>
              SAR {diff.toFixed(2)}
            </span>
          </div>

          <button
            disabled={!isMatch}
            onClick={handleReconcile}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isMatch
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{t('Reconcile', 'تسوية ومطابقة')}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Matching Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Bank Statement Lines */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-xs text-slate-800">
                {t('Bank Statement Transactions', 'حركات كشف الحساب البنكي')}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {bankTransactions.length} {t('Pending', 'معلقة')}
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {bankTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => handleToggleTx(tx.id)}
                className={`p-3.5 flex items-center justify-between cursor-pointer transition ${
                  tx.selected ? 'bg-blue-50/60 border-l-4 border-blue-700' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-semibold text-xs text-slate-900">{tx.label}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{tx.bank}</span>
                    <span>•</span>
                    <span className="font-mono">{tx.date}</span>
                  </div>
                </div>

                <div className="text-end">
                  <div
                    className={`font-mono font-bold text-xs ${
                      tx.amount > 0 ? 'text-emerald-700' : 'text-slate-800'
                    }`}
                  >
                    SAR {Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {tx.amount > 0 ? t('Inbound Receipt', 'قبض وارد') : t('Outbound Payment', 'صرف صادر')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Open Customer Invoices & Vendor Bills */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2e6b7d]" />
              <h3 className="font-bold text-xs text-slate-800">
                {t('Open Invoices & Vendor Bills', 'فواتير العملاء والموردين المستحقة')}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {openEntries.length} {t('Unsettled', 'غير مسددة')}
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {openEntries.map((op) => (
              <div
                key={op.id}
                onClick={() => handleToggleOp(op.id)}
                className={`p-3.5 flex items-center justify-between cursor-pointer transition ${
                  op.selected ? 'bg-blue-50/60 border-l-4 border-[#2e6b7d]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <span>{op.number}</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {op.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">{op.partner}</div>
                </div>

                <div className="text-end">
                  <div className="font-mono font-bold text-xs text-blue-900">
                    SAR {op.due.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{op.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

