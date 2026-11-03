import React, { useState } from 'react';
import {
  FileSpreadsheet, ExternalLink, AlertTriangle, Save, X, Search, Check,
  Building2, Globe, ShieldCheck, Printer, Mail, Send, DollarSign, Calendar
} from 'lucide-react';

export default function AccountingSettingsView({
  t,
  isRtl,
  onSave,
  onDiscard,
  searchFilter = '',
  hideHeader = false,
}) {
  // State for form controls
  const [localSearch, setLocalSearch] = useState('');
  const activeSearch = (searchFilter !== undefined && searchFilter !== '' ? searchFilter : localSearch).toLowerCase().trim();

  const [apiMode, setApiMode] = useState('Production');
  const [bankThreshold, setBankThreshold] = useState('');
  const [salesTax, setSalesTax] = useState('15% VAT (Sales)');
  const [purchaseTax, setPurchaseTax] = useState('15% VAT (Purchases)');
  const [taxCloud, setTaxCloud] = useState(false);
  const [verifyVat, setVerifyVat] = useState(false);
  const [roundingMethod, setRoundingMethod] = useState('line'); // 'line' | 'global'
  const [euDigitalVat, setEuDigitalVat] = useState(false);
  const [cashBasis, setCashBasis] = useState(false);
  const [currency, setCurrency] = useState('SAR');
  const [autoCurrency, setAutoCurrency] = useState(false);
  const [multiCurrency, setMultiCurrency] = useState(true);
  const [gainLossJournal, setGainLossJournal] = useState('Exchange Difference (SAR)');
  const [followupLevels, setFollowupLevels] = useState(false);
  const [batchPayments, setBatchPayments] = useState(false);
  const [communication, setCommunication] = useState('Based on Invoice Number');
  const [invoiceOnline, setInvoiceOnline] = useState(true);
  const [sepaDirectDebit, setSepaDirectDebit] = useState(false);
  const [sepaQr, setSepaQr] = useState(false);
  const [checks, setChecks] = useState(false);
  const [sepaCredit, setSepaCredit] = useState(false);
  const [autoImport, setAutoImport] = useState(false);
  const [qifImport, setQifImport] = useState(false);
  const [camtImport, setCamtImport] = useState(false);
  const [csvImport, setCsvImport] = useState(false);
  const [ofxImport, setOfxImport] = useState(false);
  const [analyticAccounting, setAnalyticAccounting] = useState(false);
  const [budgetManagement, setBudgetManagement] = useState(false);
  const [analyticTags, setAnalyticTags] = useState(false);
  const [marginAnalysis, setMarginAnalysis] = useState(false);
  const [sendPrint, setSendPrint] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendPost, setSendPost] = useState(false);
  const [subtotalsTaxDisplay, setSubtotalsTaxDisplay] = useState('excluded'); // 'excluded' | 'included'
  const [cashRounding, setCashRounding] = useState(false);
  const [useProductsBills, setUseProductsBills] = useState(true);
  const [warnings, setWarnings] = useState(false);
  const [intrastat, setIntrastat] = useState(false);
  const [assetsManagement, setAssetsManagement] = useState(false);
  const [deferredRevenues, setDeferredRevenues] = useState(false);
  const [automateBillProcessing, setAutomateBillProcessing] = useState(false);

  // Helper Badge for Enterprise
  const EnterpriseBadge = () => (
    <span className="inline-block bg-[#0284C7] text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">
      Enterprise
    </span>
  );

  // Section filter helper
  const matchesSection = (keywords) => {
    if (!activeSearch) return true;
    return keywords.some((kw) => kw.toLowerCase().includes(activeSearch));
  };

  // Little document/spreadsheet icon helper
  const DocIcon = () => (
    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500 inline-block shrink-0" />
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden max-w-[1600px] mx-auto text-slate-800 text-xs">
      {/* Top Action Bar */}
      {!hideHeader && (
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className="px-4 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-2xs transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t('Save', 'حفظ')}</span>
            </button>
            <button
              onClick={onDiscard}
              className="px-4 py-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold transition"
            >
              {t('Discard', 'إلغاء')}
            </button>
            <span className="text-slate-300 mx-2">|</span>
            <span className="font-bold text-slate-700 text-sm">
              {t('Accounting Settings', 'إعدادات المحاسبة')}
            </span>
          </div>

          {/* Quick in-page Search */}
          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-md px-3 py-1 focus-within:border-blue-700 w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t('Search settings...', 'بحث في الإعدادات...')}
              className="w-full bg-transparent text-xs focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Settings Form Body */}
      <div className="divide-y divide-slate-200">
        {/* ===================================================================
            SECTION 1: ZATCA E-INVOICING SETTINGS
           =================================================================== */}
        {matchesSection(['zatca', 'api', 'einvoicing', 'e-invoicing', 'sandbox', 'pre-production', 'production', 'warning', 'onboarding', 'الزكاة', 'فوترة']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200 flex items-center justify-between">
            <span>{t('ZATCA E-Invoicing Settings', 'إعدادات الفوترة الإلكترونية (الزكاة والضريبة)')}</span>
            <span className="text-[10px] text-blue-800 font-mono font-semibold">ZATCA Phase 2</span>
          </div>

          <div className="p-6 space-y-4 max-w-4xl">
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>{t('ZATCA API Integration', 'الربط البرمجي مع هيئة الزكاة (ZATCA API)')}</span>
                <DocIcon />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {t(
                  'You can select the API used for submissions down below. There are three modes available: Sandbox, Pre-Production and Production. Once you have selected the correct API, you can start the Onboarding process by going to the Journals and checking the options under the ZATCA tab.',
                  'يمكنك اختيار بيئة الربط البرمجي أدناه. تتوفر ثلاث بيئات: Sandbox للتجربة، Pre-Production قبل الإنتاج، و Production للإنتاج الفعلي. بعد التحديد يمكنك بدء التأهيل عبر الدفاتر.'
                )}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <label className="font-medium text-slate-700 text-xs w-24">API Mode</label>
              <select
                value={apiMode}
                onChange={(e) => setApiMode(e.target.value)}
                className="border border-slate-300 rounded px-3 py-1.5 bg-white text-xs font-semibold focus:border-blue-700 w-64"
              >
                <option value="Sandbox">Sandbox (Simulation)</option>
                <option value="Pre-Production">Pre-Production (Compliance & Testing)</option>
                <option value="Production">Production (Live ZATCA Clearance)</option>
              </select>
            </div>

            {/* Warning Callout Box */}
            <div className="p-4 rounded-lg bg-[#FEF9C3] border border-[#FDE047] space-y-1">
              <div className="flex items-center gap-2 text-[#92400E] font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
                <span>{t('Warning', 'تحذير هام')}</span>
              </div>
              <p className="text-[11px] text-[#A16207] leading-relaxed">
                {t(
                  'Once you change the submission mode to Production, you cannot change it anymore. Be very careful, as any invoice submitted to ZATCA in Production mode will be accounted for and might lead to Fines & Penalties.',
                  'بمجرد تحويل وضع الإرسال إلى الإنتاج (Production)، لن يمكنك الرجوع عنه. يرجى توخي الحذر الشديد حيث تحتسب أي فاتورة مرسلة قانونياً وقد تترتب عليها غرامات.'
                )}
              </p>
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================
            SECTION 2: SETUP
           =================================================================== */}
        {matchesSection(['setup', 'bank', 'reconciliation', 'threshold', 'matched', 'date', 'التسوية', 'البنكية']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
            <span>{t('Setup', 'الإعداد الأولي')}</span>
          </div>

          <div className="p-6 max-w-4xl space-y-2">
            <div>
              <div className="font-bold text-slate-800">
                {t('Bank Reconciliation Threshold', 'تاريخ حد التسوية البنكية')}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {t(
                  'The payments which have not been matched with a bank statement will not be shown in bank reconciliation data if they were made before this date.',
                  'المدفوعات التي لم تتم تسويتها مع كشف الحساب البنكي لن تظهر في شاشة التسوية إذا تمت قبل هذا التاريخ.'
                )}
              </p>
            </div>
            <div>
              <input
                type="date"
                value={bankThreshold}
                onChange={(e) => setBankThreshold(e.target.value)}
                className="border border-slate-300 rounded px-3 py-1.5 bg-white text-xs w-64 focus:border-blue-700"
              />
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================
            SECTION 3: TAXES
           =================================================================== */}
        {matchesSection(['taxes', 'tax', 'sales tax', 'purchase tax', 'taxcloud', 'vat', 'verify vat', 'rounding', 'eu digital', 'cash basis', 'الضرائب', 'ضريبة']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
            <span>{t('Taxes', 'الضرائب')}</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{t('Default Taxes', 'الضرائب الافتراضية')}</span>
                  <DocIcon />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t('Default taxes applied to local transactions', 'الضرائب الافتراضية المطبقة على المعاملات المحلية')}
                </p>
                <div className="mt-2.5 space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600 w-24 text-[11px]">Sales Tax</span>
                    <select
                      value={salesTax}
                      onChange={(e) => setSalesTax(e.target.value)}
                      className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white w-56"
                    >
                      <option>15% VAT (Sales)</option>
                      <option>0% VAT (Zero-Rated)</option>
                      <option>Exempt from VAT</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600 w-24 text-[11px]">Purchase Tax</span>
                    <select
                      value={purchaseTax}
                      onChange={(e) => setPurchaseTax(e.target.value)}
                      className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white w-56"
                    >
                      <option>15% VAT (Purchases)</option>
                      <option>0% VAT (Zero-Rated)</option>
                      <option>Exempt from VAT</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={taxCloud}
                  onChange={(e) => setTaxCloud(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>TaxCloud</span>
                    <EnterpriseBadge />
                    <DocIcon />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Compute tax rates based on U.S. ZIP codes', 'احتساب معدلات الضريبة بناءً على الرمز البريدي')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={verifyVat}
                  onChange={(e) => setVerifyVat(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{t('Verify VAT Numbers', 'التحقق من الأرقام الضريبية')}</span>
                    <DocIcon />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Verify VAT numbers using the European VIES service', 'التحقق التلقائي عبر خدمة VIES أو الربط الحكومي')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <div className="font-bold text-slate-800">
                  {t('Rounding Method', 'طريقة تقريب الضريبة')}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t('How total tax amount is computed in orders and invoices', 'طريقة حساب إجمالي مبالغ الضريبة في الفواتير')}
                </p>
                <div className="mt-2 space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rounding"
                      checked={roundingMethod === 'line'}
                      onChange={() => setRoundingMethod('line')}
                      className="text-blue-700"
                    />
                    <span>Round per Line</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rounding"
                      checked={roundingMethod === 'global'}
                      onChange={() => setRoundingMethod('global')}
                      className="text-blue-700"
                    />
                    <span>Round Globally</span>
                  </label>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={euDigitalVat}
                  onChange={(e) => setEuDigitalVat(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">
                    {t('EU Digital Goods VAT', 'ضريبة المنتجات الرقمية الأوروبية')}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Apply right VAT rates for digital products sold in EU', 'تطبيق نسب الضريبة للمنتجات الرقمية')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={cashBasis}
                  onChange={(e) => setCashBasis(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{t('Cash Basis', 'المحاسبة على الأساس النقدي')}</span>
                    <DocIcon />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Allow to configure taxes using cash basis', 'السماح باحتساب وتأجيل استحقاق الضرائب للأساس النقدي')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================
            SECTION 4: CURRENCIES
           =================================================================== */}
        {matchesSection(['currencies', 'currency', 'main currency', 'sar', 'exchange', 'rate', 'multi-currency', 'rates', 'gain', 'loss', 'العملات', 'ريال']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
            <span>{t('Currencies', 'العملات')}</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Left */}
            <div className="space-y-5">
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{t('Main Currency', 'العملة الرئيسية للشركة')}</span>
                  <DocIcon />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t('Main currency of your company', 'العملة الرسمية للقوائم المالية للشركة')}
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-slate-600 text-[11px] w-20">Currency</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white w-48 font-semibold"
                  >
                    <option value="SAR">SAR (Saudi Riyal)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={autoCurrency}
                  onChange={(e) => setAutoCurrency(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{t('Automatic Currency Rates', 'تحديث أسعار الصرف آلياً')}</span>
                    <EnterpriseBadge />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Update exchange rates automatically', 'تحديث أسعار صرف العملات الأجنبية دورياً')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={multiCurrency}
                  onChange={(e) => setMultiCurrency(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div className="w-full">
                  <div className="font-bold text-slate-800">
                    {t('Multi-Currencies', 'تعدد العملات')}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t('Record transactions in foreign currencies', 'تسجيل القيود والمعاملات بالعملات الأجنبية')}
                  </p>

                  <div className="mt-2">
                    <a href="#currencies" className="text-blue-700 hover:underline font-semibold flex items-center gap-1 text-[11px]">
                      <span>➜ Activate Other Currencies</span>
                    </a>
                  </div>

                  <div className="mt-3 flex items-center gap-4">
                    <span className="text-slate-600 text-[11px] leading-tight">
                      Exchange Gain or Loss Journal
                    </span>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={gainLossJournal}
                        onChange={(e) => setGainLossJournal(e.target.value)}
                        className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white w-48 font-semibold"
                      >
                        <option>Exchange Difference (SAR)</option>
                        <option>Foreign Exchange Operations</option>
                      </select>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-blue-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================
            SECTION 5: FISCAL PERIODS
           =================================================================== */}
        {matchesSection(['fiscal', 'periods', 'closing', 'year', 'tax periodicity', 'الفترات المالية', 'السنة المالية']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
            <span>{t('Fiscal Periods', 'الفترات المالية والضريبية')}</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div>
              <div className="font-bold text-slate-800">{t('Fiscal Year Closing Date', 'تاريخ نهاية السنة المالية')}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">December 31 (Standard Saudi Calendar)</p>
            </div>
            <div>
              <div className="font-bold text-slate-800">{t('Tax Periodicity', 'دورية الإقرار الضريبي')}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Monthly (Large Enterprise ZATCA)</p>
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================
            SECTION 6: CUSTOMER PAYMENTS
           =================================================================== */}
        {matchesSection(['customer payments', 'customer', 'follow-up', 'batch', 'communication', 'invoice online', 'online payment', 'sepa', 'sdd', 'qr', 'مدفوعات العملاء']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
            <span>{t('Customer Payments', 'مدفوعات العملاء')}</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Left */}
            <div className="space-y-5">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={followupLevels}
                  onChange={(e) => setFollowupLevels(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{t('Follow-up Levels', 'مستويات متابعة التحصيل')}</span>
                    <EnterpriseBadge />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Use follow-up levels and schedule actions', 'تحديد مستويات تذكير العملاء وجدولة الإجراءات')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={batchPayments}
                  onChange={(e) => setBatchPayments(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">
                    {t('Batch Payments', 'الدفعات المجمعة')}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Group payments into a single batch to ease the reconciliation process', 'تجميع الدفعات في دفعة واحدة لتسهيل مطابقة البنك')}
                  </p>
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-800">
                  {t('Communication', 'المرجع والبيان الافتراضي')}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t('Default payment communication on customer invoices', 'طريقة إنشاء البيان المرجعي للدفعات')}
                </p>
                <div className="mt-2">
                  <select
                    value={communication}
                    onChange={(e) => setCommunication(e.target.value)}
                    className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white w-56 font-medium"
                  >
                    <option>Based on Invoice Number</option>
                    <option>Based on Customer ID</option>
                    <option>Free Text Communication</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={invoiceOnline}
                  onChange={(e) => setInvoiceOnline(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">
                    {t('Invoice Online Payment', 'الدفع الإلكتروني للفواتير')}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Let your customers pay their invoices online', 'تمكين العملاء من سداد فواتيرهم أونلاين عبر البوابة')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={sepaDirectDebit}
                  onChange={(e) => setSepaDirectDebit(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>SEPA Direct Debit (SDD)</span>
                    <EnterpriseBadge />
                    <DocIcon />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Collect customer payments in one-click using Euro SEPA Service', 'تحصيل مدفوعات العملاء بنقرة واحدة عبر SEPA')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={sepaQr}
                  onChange={(e) => setSepaQr(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>SEPA QR Code</span>
                    <EnterpriseBadge />
                    <DocIcon />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Add a payment QR code to your invoices', 'إضافة رمز الاستجابة السريع QR للسداد في الفواتير')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================
            SECTION 7: SUPPLIER PAYMENTS
           =================================================================== */}
        {matchesSection(['supplier payments', 'supplier', 'vendor', 'checks', 'cheques', 'sepa', 'sct', 'credit transfer', 'مدفوعات الموردين', 'شيكات']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
            <span>{t('Supplier Payments', 'مدفوعات الموردين')}</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={checks}
                onChange={(e) => setChecks(e.target.checked)}
                className="rounded border-slate-300 text-blue-700 mt-0.5"
              />
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{t('Checks', 'طباعة وإدارة الشيكات')}</span>
                  <EnterpriseBadge />
                  <DocIcon />
                </div>
                <p className="text-[11px] text-slate-500">
                  {t('Print checks to pay your vendors', 'طباعة الشيكات البنكية للموردين وسجل الصرف')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={sepaCredit}
                onChange={(e) => setSepaCredit(e.target.checked)}
                className="rounded border-slate-300 text-blue-700 mt-0.5"
              />
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>SEPA Credit Transfer (SCT)</span>
                  <DocIcon />
                </div>
                <p className="text-[11px] text-slate-500">
                  {t('Pay your bills in one-click using Euro SEPA Service', 'تحويلات الحسابات المباشرة للموردين')}
                </p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================
            SECTION 8: BANK & CASH
           =================================================================== */}
        {matchesSection(['bank', 'cash', 'import', 'statement', 'qif', 'camt', 'csv', 'ofx', 'البنوك', 'النقدية', 'كشوف']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
            <span>{t('Bank & Cash', 'البنوك والنقدية')}</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Left */}
            <div className="space-y-5">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={autoImport}
                  onChange={(e) => setAutoImport(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{t('Automatic Import', 'استيراد الكشوفات تلقائياً')}</span>
                    <EnterpriseBadge />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Import your bank statements automatically', 'استيراد كشوف الحساب البنكي آلياً عبر الربط المصرفي')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={qifImport}
                  onChange={(e) => setQifImport(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>QIF Import</span>
                    <EnterpriseBadge />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Import your bank statements in QIF', 'استيراد كشوف الحساب بصيغة QIF')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={camtImport}
                  onChange={(e) => setCamtImport(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>CAMT Import</span>
                    <EnterpriseBadge />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Import your bank statements in CAMT.053', 'استيراد كشوف الحساب بصيغة CAMT.053 الدولية')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={csvImport}
                  onChange={(e) => setCsvImport(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>CSV Import</span>
                    <EnterpriseBadge />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Import your bank statements in CSV', 'استيراد كشوف الحساب بملفات الإكسل و CSV')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={ofxImport}
                  onChange={(e) => setOfxImport(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>OFX Import</span>
                    <EnterpriseBadge />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Import your bank statements in OFX', 'استيراد كشوف الحساب بصيغة OFX')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================
            SECTION 9: ANALYTICS
           =================================================================== */}
        {matchesSection(['analytics', 'analytic', 'cost center', 'budget', 'tags', 'margin', 'margins', 'المحاسبة التحليلية', 'مراكز التكلفة']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
            <span>{t('Analytics', 'المحاسبة التحليلية ومراكز التكلفة')}</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Left */}
            <div className="space-y-5">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={analyticAccounting}
                  onChange={(e) => setAnalyticAccounting(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">
                    {t('Analytic Accounting', 'المحاسبة التحليلية')}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Track costs & revenues by project, department, etc.', 'تتبع التكاليف والإيرادات بالمشاريع، الأقسام، وورش العمل')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={budgetManagement}
                  onChange={(e) => setBudgetManagement(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{t('Budget Management', 'إدارة الموازنات التقديرية')}</span>
                    <EnterpriseBadge />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Use budgets to compare actual with expected revenues and costs', 'مقارنة الفعلي بالمتوقع للمصروفات والإيرادات')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={analyticTags}
                  onChange={(e) => setAnalyticTags(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">
                    {t('Analytic Tags', 'الوسوم التحليلية')}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Allows to tag analytic entries and to manage analytic distributions', 'توزيع القيد التحليلي على وسوم ومراكز متعددة')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={marginAnalysis}
                  onChange={(e) => setMarginAnalysis(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">
                    {t('Margin Analysis', 'تحليل هوامش الربحية')}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Monitor your product margins from invoices', 'مراقبة هوامش أرباح المنتجات من الفواتير')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================
            SECTION 10: DEFAULT SENDING OPTIONS
           =================================================================== */}
        {matchesSection(['sending', 'default sending', 'print', 'post', 'email', 'mail', 'خيارات الإرسال', 'طباعة']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
            <span>{t('Default Sending Options', 'خيارات الإرسال الافتراضية')}</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={sendPrint}
                  onChange={(e) => setSendPrint(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700"
                />
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{t('Print', 'طباعة الفاتورة')}</span>
                  <DocIcon />
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={sendPost}
                  onChange={(e) => setSendPost(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700"
                />
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{t('Send by Post', 'إرسال بريد عادي')}</span>
                  <DocIcon />
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700"
                />
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{t('Send Email', 'إرسال بالبريد الإلكتروني')}</span>
                  <DocIcon />
                </span>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================
            SECTION 11: INVOICES
           =================================================================== */}
        {matchesSection(['invoices', 'invoice', 'subtotals', 'subtotal', 'tax-excluded', 'tax-included', 'cash rounding', 'vendor bills', 'warnings', 'intrastat', 'الفواتير']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
            <span>{t('Invoices', 'الفواتير')}</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Left */}
            <div className="space-y-5">
              <div>
                <div className="font-bold text-slate-800">
                  {t('Line Subtotals Tax Display', 'عرض مجاميع بنود الفاتورة')}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t('Line subtotals tax display', 'طريقة عرض البند قبل أو شامل الضريبة')}
                </p>
                <div className="mt-2 space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="subtotalDisplay"
                      checked={subtotalsTaxDisplay === 'excluded'}
                      onChange={() => setSubtotalsTaxDisplay('excluded')}
                      className="text-blue-700"
                    />
                    <span>Tax-Excluded</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="subtotalDisplay"
                      checked={subtotalsTaxDisplay === 'included'}
                      onChange={() => setSubtotalsTaxDisplay('included')}
                      className="text-blue-700"
                    />
                    <span>Tax-Included</span>
                  </label>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={cashRounding}
                  onChange={(e) => setCashRounding(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">
                    {t('Cash Rounding', 'تقريب النقدية للهللات')}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Define the smallest coinage of the currency used to pay by cash.', 'تحديد أصغر وحدة نقدية مقبولة في المدفوعات النقدية')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={useProductsBills}
                  onChange={(e) => setUseProductsBills(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">
                    {t('Use products in vendor bills', 'استخدام بنود المنتجات في فواتير الموردين')}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Disable to have a simplified view of vendor bills, without the products.', 'إلغاء التحديد للحصول على عرض مبسط للفواتير بدون سطور المنتجات')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={warnings}
                  onChange={(e) => setWarnings(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">
                    {t('Warnings', 'التنبيهات التحذيرية')}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Get warnings when invoicing specific customers', 'إظهار تنبيهات وتحذيرات ائتمانية عند فوترة عملاء معينين')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={intrastat}
                  onChange={(e) => setIntrastat(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Intrastat</span>
                    <EnterpriseBadge />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Collect information and produce statistics on the trade in goods in Europe with intrastat.', 'جمع الإحصائيات الجمركية للتجارة البينية')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================
            SECTION 12: AUTOMATED ENTRIES
           =================================================================== */}
        {matchesSection(['automated entries', 'assets', 'depreciation', 'deferred revenues', 'contracts', 'القيود المحاسبية التلقائية', 'الأصول']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
            <span>{t('Automated Entries', 'القيود المحاسبية التلقائية')}</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={assetsManagement}
                onChange={(e) => setAssetsManagement(e.target.checked)}
                className="rounded border-slate-300 text-blue-700 mt-0.5"
              />
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{t('Assets Management', 'إدارة الأصول الثابتة التلقائية')}</span>
                  <EnterpriseBadge />
                </div>
                <p className="text-[11px] text-slate-500">
                  {t('Use depreciation boards, automate amortization entries', 'لوحات الإهلاك الآلية وتوليد قيود استهلاك الأصول')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={deferredRevenues}
                onChange={(e) => setDeferredRevenues(e.target.checked)}
                className="rounded border-slate-300 text-blue-700 mt-0.5"
              />
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{t('Deferred Revenues Management', 'إدارة الإيرادات المؤجلة')}</span>
                  <EnterpriseBadge />
                </div>
                <p className="text-[11px] text-slate-500">
                  {t('Automate deferred revenues entries for multi-year contracts', 'توزيع الإيرادات المؤجلة للعقود السنوية ومتعددة السنوات')}
                </p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================
            SECTION 13: AUTOCOMPLETE VENDOR BILLS (OCR + AI)
           =================================================================== */}
        {matchesSection(['autocomplete', 'ocr', 'ai', 'automate', 'bills', 'scanned', 'artificial intelligence', 'المعالجة الذكية', 'ذكاء']) && (
        <div>
          <div className="bg-[#E9EEF4] px-6 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
            <span>{t('Autocomplete Vendor Bills (OCR + AI)', 'المعالجة الذكية لفواتير الموردين (OCR + AI)')}</span>
          </div>

          <div className="p-6">
            <div className="flex items-start gap-2.5 max-w-2xl">
              <input
                type="checkbox"
                checked={automateBillProcessing}
                onChange={(e) => setAutomateBillProcessing(e.target.checked)}
                className="rounded border-slate-300 text-blue-700 mt-0.5"
              />
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{t('Automate Bill Processing', 'أتمتة ومعالجة الفواتير عبر الذكاء الاصطناعي')}</span>
                  <EnterpriseBadge />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  {t(
                    'When receiving an email with a bill, or uploading scanned bills, Odoo will parse them (OCR) and auto-complete (AI) Draft Bills to validate.',
                    'عند استلام بريد بفاتورة أو مسحها ضوئياً، يتم استخراج البيانات آلياً (OCR) وتعبئة مسودة الفاتورة للاعتماد.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* If no section matched search */}
        {activeSearch && (
          <div className="p-12 text-center text-slate-500">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-sm text-slate-700">
              {t('No settings found matching your search', 'لم يتم العثور على إعدادات مطابقة لبحثك')}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono text-blue-700">&ldquo;{activeSearch}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}
