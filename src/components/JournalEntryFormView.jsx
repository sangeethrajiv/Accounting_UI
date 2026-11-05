import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Save, X, Plus, Trash2,
  CheckCircle2, ArrowRightLeft, FileText, AlertCircle, CornerUpLeft
} from 'lucide-react';

export default function JournalEntryFormView({
  entry,
  onBack,
  onSave,
  onPost,
  onReverse,
  onCreateNew,
  allEntries = [],
  onSelectEntry,
  t,
  isRtl,
}) {
  const isNew = Boolean(entry?.isNew || !entry?.number || entry?.number === 'New' || entry?.number === 'Draft');
  const [isEditing, setIsEditing] = useState(isNew);
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'other'

  const [formData, setFormData] = useState({
    id: entry?.id || `JE-${Date.now()}`,
    number: entry?.number || (isNew ? t('New Entry', 'قيد جديد') : 'MISC/2026/00042'),
    date: entry?.date || new Date().toISOString().split('T')[0],
    forceDate: entry?.forceDate || entry?.date || new Date().toISOString().split('T')[0],
    reference: entry?.ref || entry?.reference || '',
    journal: entry?.journal || 'Miscellaneous Operations (SAR)',
    partner: entry?.partner || '',
    company: entry?.company || 'Flames of Al-Yamama Hydraulic Co',
    project: entry?.project || 'Hydraulic Workshop Maintenance',
    status: entry?.status || 'Draft', // 'Draft' | 'Posted'
    autoReversalDate: entry?.autoReversalDate || '',
    fiscalYear: entry?.fiscalYear || 'FY 2026',
    items: entry?.items || [
      {
        id: 1,
        account: '113101 — Inventory Valuation Account',
        partner: entry?.partner || 'Ready Mat Industrial Saudi',
        product: 'Hydraulic Chrome Rods 80mm',
        label: entry?.ref || 'Stock receipt valuation entry',
        analytic: 'CC-101 Workshop Operations',
        debit: entry?.total || 34500.0,
        credit: 0.0,
        tax: 'VAT 15%',
      },
      {
        id: 2,
        account: '113901 — Stock Interim Account (Received)',
        partner: entry?.partner || 'Ready Mat Industrial Saudi',
        product: 'Hydraulic Chrome Rods 80mm',
        label: entry?.ref || 'Stock interim matching entry',
        analytic: 'CC-101 Workshop Operations',
        debit: 0.0,
        credit: entry?.total || 34500.0,
        tax: 'VAT 15%',
      },
    ],
  });

  const totalDebit = formData.items.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0);
  const totalCredit = formData.items.reduce((sum, item) => sum + (parseFloat(item.credit) || 0), 0);
  const diff = Math.abs(totalDebit - totalCredit);
  const isBalanced = diff < 0.01;

  const currentIndex = allEntries.findIndex((e) => e.id === entry?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < allEntries.length - 1;

  const handleItemChange = (idx, field, val) => {
    const updated = [...formData.items];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData({ ...formData, items: updated });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: Date.now(),
          account: '112101 — Accounts Receivable',
          partner: formData.partner,
          product: '',
          label: formData.reference || 'Manual Journal Line',
          analytic: 'CC-101 Workshop Operations',
          debit: 0.0,
          credit: 0.0,
          tax: '',
        },
      ],
    });
  };

  const handleRemoveItem = (idx) => {
    if (formData.items.length <= 1) return;
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== idx),
    });
  };

  const handleSave = () => {
    const saved = {
      ...formData,
      total: Math.max(totalDebit, totalCredit),
      isNew: false,
    };
    setFormData(saved);
    setIsEditing(false);
    onSave?.(saved);
  };

  const handlePostEntry = () => {
    if (!isBalanced) {
      alert(t('Cannot post unbalanced entry! Total debit must equal total credit.', 'لا يمكن ترحيل قيد غير متوازن! يجب أن يتساوى المدين مع الدائن.'));
      return;
    }
    const updated = { ...formData, status: 'Posted' };
    setFormData(updated);
    onPost?.(updated);
  };

  const handleReverseEntry = () => {
    const reversedItems = formData.items.map((item) => ({
      ...item,
      id: Date.now() + Math.random(),
      debit: item.credit,
      credit: item.debit,
      label: `Reversal of ${formData.number}: ${item.label}`,
    }));
    const reversal = {
      ...formData,
      id: `REV-${Date.now()}`,
      number: `REV/${formData.number}`,
      reference: `Reversal of ${formData.number}`,
      date: new Date().toISOString().split('T')[0],
      forceDate: new Date().toISOString().split('T')[0],
      items: reversedItems,
      status: 'Draft',
      isNew: false,
    };
    onReverse?.(reversal);
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
              {t('Journal Entries', 'قيود اليومية')}
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700 font-semibold">
              {isNew ? t('New', 'جديد') : formData.number}
            </span>
          </div>

          {/* Action Buttons under Breadcrumb */}
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

        {/* Pager */}
        {!isNew && (
          <div className="flex items-center gap-1 text-xs text-slate-600 bg-white border border-slate-300 rounded px-2 py-1">
            <button
              disabled={!hasPrev}
              onClick={() => onSelectEntry?.(allEntries[currentIndex - 1])}
              className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono px-1 font-semibold">
              {currentIndex >= 0 ? `${currentIndex + 1} / ${allEntries.length}` : '-'}
            </span>
            <button
              disabled={!hasNext}
              onClick={() => onSelectEntry?.(allEntries[currentIndex + 1])}
              className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Odoo Workflow Action Bar (Post / Reverse Entry / Cancel + Draft -> Posted Statusbar) */}
      <div className="bg-white border border-slate-300 rounded-t-lg p-2 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-1.5">
          {formData.status === 'Draft' ? (
            <button
              onClick={handlePostEntry}
              className="px-3.5 py-1 rounded bg-[#2e6b7d] hover:bg-[#235361] text-white font-medium text-xs shadow-2xs transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('Post', 'ترحيل القيد')}</span>
            </button>
          ) : (
            <button
              onClick={handleReverseEntry}
              className="px-3.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs transition cursor-pointer flex items-center gap-1"
            >
              <CornerUpLeft className="w-3.5 h-3.5" />
              <span>{t('Reverse Entry', 'عكس القيد')}</span>
            </button>
          )}

          <button
            onClick={() => {
              if (confirm(t('Cancel this journal entry?', 'هل تريد إلغاء هذا القيد؟'))) {
                setFormData({ ...formData, status: 'Draft' });
              }
            }}
            className="px-3 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs transition cursor-pointer"
          >
            {t('Cancel Entry', 'إلغاء القيد')}
          </button>
        </div>

        {/* Statusbar: Draft -> Posted */}
        <div className="flex items-center text-xs font-semibold">
          <div
            className={`px-4 py-1 transition flex items-center gap-1 border border-r-0 border-slate-300 rounded-l ${
              formData.status === 'Draft'
                ? 'bg-slate-200 text-slate-800 font-bold shadow-inner'
                : 'bg-white text-slate-400'
            }`}
          >
            <span>{t('Unposted (Draft)', 'مسودة غير مرحلة')}</span>
          </div>

          <div
            className={`px-4 py-1 transition flex items-center gap-1 border border-slate-300 rounded-r ${
              formData.status === 'Posted'
                ? 'bg-[#2e6b7d] text-white font-bold shadow-2xs'
                : 'bg-white text-slate-400'
            }`}
          >
            <span>{t('Posted', 'مرحل')}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Form Sheet */}
      <div className="bg-white border-x border-b border-slate-300 rounded-b-lg p-6 shadow-xs space-y-6">
        <div>
          <span className="text-slate-400 font-medium">{t('Journal Entry', 'قيد اليومية')}</span>
          <h2 className="text-xl font-bold text-slate-800">
            {formData.number}
          </h2>
        </div>

        {/* 2-Column Main Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 pt-2">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Journal', 'دفتر اليومية')}</label>
              {isEditing ? (
                <select
                  value={formData.journal}
                  onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                  className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#2e6b7d]"
                >
                  <option value="Customer Invoices (SAR)">Customer Invoices (SAR)</option>
                  <option value="Purchases (SAR)">Purchases (SAR)</option>
                  <option value="Miscellaneous Operations (SAR)">Miscellaneous Operations (SAR)</option>
                  <option value="Bank SAR (Al Rajhi 111101)">Bank SAR (Al Rajhi 111101)</option>
                  <option value="Cash SAR (Workshop 111201)">Cash SAR (Workshop 111201)</option>
                  <option value="Inventory Valuation Journal">Inventory Valuation Journal</option>
                </select>
              ) : (
                <span className="col-span-2 font-medium text-slate-800">{formData.journal}</span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Partner', 'الشريك')}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.partner}
                  onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
                  placeholder={t('Select or enter partner...', 'اسم الشريك...')}
                  className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                />
              ) : (
                <span className="col-span-2 text-slate-800 font-semibold">{formData.partner || '-'}</span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Reference', 'المرجع والبيان')}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder={t('e.g. PO-2026-001 or Workshop Invoice', 'المرجع...')}
                  className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                />
              ) : (
                <span className="col-span-2 text-slate-800">{formData.reference || '-'}</span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Project Details', 'تفاصيل المشروع')}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  placeholder={t('e.g. BARCC Phase 2 Maintenance', 'اسم المشروع...')}
                  className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                />
              ) : (
                <span className="col-span-2 text-slate-700">{formData.project || '-'}</span>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Date', 'التاريخ')}</label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                />
              ) : (
                <span className="col-span-2 font-mono text-slate-800">{formData.date}</span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Force Accounting Date', 'تاريخ القيد الإجباري')}</label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.forceDate}
                  onChange={(e) => setFormData({ ...formData, forceDate: e.target.value })}
                  className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs font-mono text-blue-700 focus:outline-none focus:border-[#2e6b7d]"
                />
              ) : (
                <span className="col-span-2 font-mono font-bold text-blue-700">{formData.forceDate}</span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Company', 'الشركة')}</label>
              {isEditing ? (
                <select
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="col-span-2 border border-slate-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#2e6b7d]"
                >
                  <option value="Flames of Al-Yamama Hydraulic Co">Flames of Al-Yamama Hydraulic Co</option>
                  <option value="Al Yamama Industrial Spare Parts Co">Al Yamama Industrial Spare Parts Co</option>
                  <option value="Al Yamama Heavy Equipment Co">Al Yamama Heavy Equipment Co</option>
                  <option value="Al Yamama Logistics & Fleet Co">Al Yamama Logistics & Fleet Co</option>
                </select>
              ) : (
                <span className="col-span-2 text-slate-800 font-medium">{formData.company}</span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-medium">{t('Fiscal Year', 'السنة المالية')}</label>
              <span className="col-span-2 font-mono text-slate-700">{formData.fiscalYear}</span>
            </div>
          </div>
        </div>

        {/* 4. Tabs: Journal Items | Other Info */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center gap-6 border-b border-slate-300 mb-4">
            <button
              onClick={() => setActiveTab('items')}
              className={`pb-2 text-xs font-bold transition border-b-2 cursor-pointer ${
                activeTab === 'items'
                  ? 'border-[#2e6b7d] text-[#2e6b7d]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('Journal Items', 'عناصر اليومية')}
            </button>
            <button
              onClick={() => setActiveTab('other')}
              className={`pb-2 text-xs font-bold transition border-b-2 cursor-pointer ${
                activeTab === 'other'
                  ? 'border-[#2e6b7d] text-[#2e6b7d]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('Other Info', 'معلومات أخرى')}
            </button>
          </div>

          {activeTab === 'items' && (
            <div className="space-y-3">
              <div className="overflow-x-auto border border-slate-200 rounded-md">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 text-start w-64">{t('Account', 'الحساب')}</th>
                      <th className="py-2.5 px-3 text-start">{t('Partner', 'الشريك')}</th>
                      <th className="py-2.5 px-3 text-start">{t('Product', 'المنتج')}</th>
                      <th className="py-2.5 px-3 text-start">{t('Label', 'البيان')}</th>
                      <th className="py-2.5 px-3 text-start">{t('Analytic Account', 'الحساب التحليلي')}</th>
                      <th className="py-2.5 px-3 text-end w-28">{t('Debit (SAR)', 'مدين')}</th>
                      <th className="py-2.5 px-3 text-end w-28">{t('Credit (SAR)', 'دائن')}</th>
                      <th className="py-2.5 px-3 text-center w-20">{t('Tax', 'الضريبة')}</th>
                      {isEditing && <th className="py-2.5 px-2 text-center w-10"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.account}
                              onChange={(e) => handleItemChange(idx, 'account', e.target.value)}
                              className="w-full border border-slate-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                            />
                          ) : (
                            <span className="font-mono font-medium text-slate-800">{item.account}</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.partner}
                              onChange={(e) => handleItemChange(idx, 'partner', e.target.value)}
                              className="w-full border border-slate-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                            />
                          ) : (
                            <span className="text-slate-700">{item.partner || '-'}</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.product || ''}
                              onChange={(e) => handleItemChange(idx, 'product', e.target.value)}
                              className="w-full border border-slate-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                            />
                          ) : (
                            <span className="text-slate-600">{item.product || '-'}</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
                              className="w-full border border-slate-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                            />
                          ) : (
                            <span className="text-slate-700">{item.label}</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.analytic}
                              onChange={(e) => handleItemChange(idx, 'analytic', e.target.value)}
                              className="w-full border border-slate-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                            />
                          ) : (
                            <span className="text-blue-700 font-medium">{item.analytic}</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-end">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.debit}
                              onChange={(e) => handleItemChange(idx, 'debit', parseFloat(e.target.value) || 0)}
                              className="w-full text-end border border-slate-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                            />
                          ) : (
                            <span className="font-mono font-bold text-slate-900">
                              {Number(item.debit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-end">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.credit}
                              onChange={(e) => handleItemChange(idx, 'credit', parseFloat(e.target.value) || 0)}
                              className="w-full text-end border border-slate-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-[#2e6b7d]"
                            />
                          ) : (
                            <span className="font-mono font-bold text-slate-900">
                              {Number(item.credit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center text-slate-500 font-mono text-[11px]">
                          {item.tax || '-'}
                        </td>
                        {isEditing && (
                          <td className="py-2 px-2 text-center">
                            <button
                              onClick={() => handleRemoveItem(idx)}
                              className="text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  {/* Totals Row */}
                  <tfoot className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={5} className="py-2.5 px-3 text-start">
                        {isEditing && (
                          <button
                            onClick={handleAddItem}
                            className="text-[#2e6b7d] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{t('Add an item', 'إضافة عنصر')}</span>
                          </button>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-end font-mono text-xs">
                        SAR {totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-end font-mono text-xs">
                        SAR {totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td colSpan={isEditing ? 2 : 1} className="py-2.5 px-3 text-center">
                        {isBalanced ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Balanced</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-medium">
                            <AlertCircle className="w-3 h-3" />
                            <span>Diff: {diff.toFixed(2)}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'other' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 text-xs">
              <div className="space-y-3">
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-medium">{t('Auto Reversal Date', 'تاريخ العكس التلقائي')}</span>
                  <span className="col-span-2 text-slate-800 font-mono">{formData.autoReversalDate || t('None (Manual)', 'لا يوجد')}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-medium">{t('Fiscal Lock Date', 'تاريخ إغلاق الفترة')}</span>
                  <span className="col-span-2 text-slate-800 font-mono">2026-09-30 (Hard Lock)</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-medium">{t('ZATCA Tax Impact', 'الأثر الضريبي')}</span>
                  <span className="col-span-2 text-slate-800">Direct GL Entry (Pre-tax clearing)</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-medium">{t('Posting Engine', 'محرك الترحيل')}</span>
                  <span className="col-span-2 text-slate-800">Odoo 12 Double-Entry Real-time Posting</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

