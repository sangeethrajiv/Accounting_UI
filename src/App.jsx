import React, { useState, useMemo } from 'react';
import {
  Building2, Globe, FileText, CreditCard, BookOpen, PieChart, ShieldCheck,
  ArrowRightLeft, CheckCircle2, Clock, AlertTriangle, Printer, Plus,
  Search, Filter, ChevronDown, ChevronRight, ChevronLeft, Eye, Download,
  Lock, Unlock, Layers, Truck, Package, DollarSign, Landmark, Receipt,
  FileSpreadsheet, Check, X, ArrowUpRight, History, QrCode, FileCheck,
  HelpCircle, Users, Briefcase, Calculator, Calendar, PanelLeftClose,
  PanelLeftOpen, Settings, Bell, MessageSquare, Upload, MoreVertical,
  List, LayoutGrid, BarChart3, Table2, Star, ShoppingCart, Edit3,
  Phone, Mail, Smartphone, User, LogOut, Keyboard, CheckSquare, Square,
  Wrench, Repeat, Headphones, Save
} from 'lucide-react';
import AccountingSettingsView from './components/AccountingSettingsView.jsx';
import InvoiceCreateModal from './components/InvoiceCreateModal.jsx';
import PaymentCreateModal from './components/PaymentCreateModal.jsx';
import InvoiceFormView from './components/InvoiceFormView.jsx';

// --- SAUDI GROUP COMPANIES (1 PARENT HQ + 5 OPERATING COMPANIES) ---
const COMPANIES = [
  { id: 'HYD', code: 'AYH', nameEn: 'Al Yamama Hydraulic Workshop Co.', nameAr: 'شركة ورشة اليمامة للهيدروليك', cityEn: 'Riyadh', vat: '300023456700003', isParent: false },
  { id: 'PARENT', code: 'FAY', nameEn: 'Flames of Al Yamama Trading Co. (HQ)', nameAr: 'شركة شعلة اليمامة للتجارة (المركز الرئيسي)', cityEn: 'Riyadh HQ', vat: '300012345600003', isParent: true },
  { id: 'HVY', code: 'AYE', nameEn: 'Al Yamama Heavy Equipment Co.', nameAr: 'شركة اليمامة للمعدات الثقيلة', cityEn: 'Dammam', vat: '300034567800003', isParent: false },
  { id: 'IND', code: 'AYS', nameEn: 'Al Yamama Industrial Spare Parts Co.', nameAr: 'شركة اليمامة لقطع الغيار الصناعية', cityEn: 'Jeddah', vat: '300045678900003', isParent: false },
  { id: 'LOG', code: 'AYL', nameEn: 'Al Yamama Logistics & Fleet Co.', nameAr: 'شركة اليمامة للخدمات اللوجستية والأسطول', cityEn: 'Jubail', vat: '300056789000003', isParent: false },
  { id: 'INS', code: 'AYI', nameEn: 'Al Yamama Contracting & Installation Co.', nameAr: 'شركة اليمامة للمقاولات والتركيبات', cityEn: 'Neom / Tabuk', vat: '300067890100003', isParent: false },
];

// --- CLEAN LEFT SIDEBAR MAIN ERP MODULES (STRICTLY ICON + NAME ONLY) ---
const ERP_MODULES = [
  { id: 'accounting', nameEn: 'Accounting', nameAr: 'المحاسبة', icon: Calculator, targetView: 'dashboard' },
  { id: 'sales', nameEn: 'Sales', nameAr: 'المبيعات', icon: ShoppingCart, targetView: 'module_overview' },
  { id: 'purchase', nameEn: 'Purchase', nameAr: 'المشتريات', icon: Truck, targetView: 'module_overview' },
  { id: 'inventory', nameEn: 'Inventory', nameAr: 'المخزون', icon: Package, targetView: 'module_overview' },
  { id: 'subscriptions', nameEn: 'Subscriptions', nameAr: 'الاشتراكات', icon: Repeat, targetView: 'module_overview' },
  { id: 'helpdesk', nameEn: 'Helpdesk', nameAr: 'الدعم والتركيبات', icon: Headphones, targetView: 'module_overview' },
];

// --- CROSS-MODULE SUMMARY DATA (HOW OTHER MODULES END IN THE GENERAL LEDGER) ---
const MODULE_SUMMARIES = {
  sales: {
    titleEn: 'Sales Orders & Quotations',
    titleAr: 'أوامر وعروض أسعار المبيعات',
    subtitleEn: 'Confirmed Sales Orders generate Proforma or ZATCA Phase 2 Customer Invoices in the General Ledger.',
    subtitleAr: 'أوامر البيع المؤكدة تنشئ فواتير بروفرما أو فواتير ضريبية معتمدة من هيئة الزكاة في دفتر الأستاذ العام.',
    targetAccountingView: 'invoices',
    targetButtonEn: 'Open Linked Customer Invoices',
    targetButtonAr: 'فتح فواتير العملاء المرتبطة',
    rows: [
      { id: 'SO-2026-0412', date: 'Oct 30', partnerEn: 'Neom Bay Infrastructure JV', partnerAr: 'ائتلاف البنية التحتية خليج نيوم', descEn: '80-Ton Telescopic Crane Rental', amount: 166750.00, glRef: 'PRO/2026/00006', status: 'Proforma Issued' },
      { id: 'SO-2026-0409', date: 'Oct 29', partnerEn: 'Riyadh Metro Construction Corp.', partnerAr: 'شركة إنشاءات مترو الرياض', descEn: '400-Ton Hydraulic Cylinder Overhaul', amount: 57500.00, glRef: 'INV/2026/00012', status: 'Invoiced (ZATCA QR)' },
      { id: 'SO-2026-0404', date: 'Oct 28', partnerEn: 'Acme Arabia Industrial Corp.', partnerAr: 'شركة أكمي العربية الصناعية', descEn: 'Bosch Rexroth Axial Piston Pump', amount: 40560.50, glRef: 'INV/2026/00010', status: 'Posted to GL' },
    ],
  },
  purchase: {
    titleEn: 'Purchase Orders & Vendor Contracts',
    titleAr: 'أوامر الشراء وعقود الموردين',
    subtitleEn: 'Purchase Orders and Inter-Company orders post Vendor Bills and Landed Costs directly to Accounts Payable.',
    subtitleAr: 'أوامر الشراء وطلبات الشركات الشقيقة تنشئ فواتير الموردين والتكاليف الإضافية في حسابات الدائنين.',
    targetAccountingView: 'bills',
    targetButtonEn: 'Open Linked Vendor Bills',
    targetButtonAr: 'فتح فواتير الموردين المرتبطة',
    rows: [
      { id: 'PO-2026-0198', date: 'Oct 30', partnerEn: 'Bosch Rexroth AG (Germany)', partnerAr: 'بوش ريكسروث ألمانيا', descEn: 'Hydraulic Pumps Batch + Customs Landed Cost', amount: 162000.00, glRef: 'RBILL/2026/10/0001', status: 'Bill Posted' },
      { id: 'PO-2026-0192', date: 'Oct 26', partnerEn: 'Al Yamama Logistics & Fleet Co. (IC)', partnerAr: 'شركة اليمامة للخدمات اللوجستية (شركة شقيقة)', descEn: 'Lowbed Heavy Equipment Transport', amount: 15525.00, glRef: 'BILL/2026/10/0312', status: 'Auto IC Bill' },
    ],
  },
  inventory: {
    titleEn: 'Inventory Transfers & Stock Valuation (stock_force_date)',
    titleAr: 'حركات المخزون والتقييم المحاسبي الآلي',
    subtitleEn: 'Product Category accounts (Stock Input, Output, Valuation) and stock_force_date automatically generate GL entries.',
    subtitleAr: 'حسابات فئات المنتجات وتاريخ القيد المخزني تنشئ قيود تقييم المخزون آلياً في المحاسبة.',
    targetAccountingView: 'product_categories',
    targetButtonEn: 'Configure Product Category GL Accounts',
    targetButtonAr: 'إعداد حسابات فئات المخزون',
    rows: [
      { id: 'WH/IN/0089', date: 'Oct 30 (Force: Oct 25)', partnerEn: 'Bosch Rexroth AG (Germany)', partnerAr: 'بوش ريكسروث ألمانيا', descEn: 'Automated Stock Receipt Valuation + Landed Cost', amount: 176500.00, glRef: 'STJ/2026/10/0006', status: 'GL Posted' },
      { id: 'WH/OUT/0214', date: 'Oct 28 (Force: Oct 25)', partnerEn: 'Riyadh Metro Construction Corp.', partnerAr: 'شركة إنشاءات مترو الرياض', descEn: 'COGS Delivery Valuation Entry', amount: 28400.00, glRef: 'STJ/2026/10/0004', status: 'GL Posted' },
    ],
  },
  subscriptions: {
    titleEn: 'Recurring Maintenance Subscriptions',
    titleAr: 'عقود واشتراكات الصيانة الدورية',
    subtitleEn: 'Scheduled hydraulic maintenance contracts auto-generate recurring draft/proforma invoices for review.',
    subtitleAr: 'عقود الصيانة الدورية تنشئ فواتير دورية تلقائياً للمراجعة والاعتماد.',
    targetAccountingView: 'invoices',
    targetButtonEn: 'View Subscription Invoices',
    targetButtonAr: 'عرض فواتير الاشتراكات',
    rows: [
      { id: 'SUB-2026-0041', date: 'Monthly (Nov 01)', partnerEn: 'Al-Futtaim Saudi Contracting', partnerAr: 'شركة الفطيم للمقاولات السعودية', descEn: 'Annual Fleet Hydraulic Preventive Maintenance', amount: 20700.00, glRef: 'INV/2026/00011', status: 'Recurring Active' },
    ],
  },
  helpdesk: {
    titleEn: 'Helpdesk Tickets & Field Installations',
    titleAr: 'تذاكر الدعم الفني والتركيبات الميدانية',
    subtitleEn: 'Field installation timesheets and spare-part replacements post analytic cost-centre expenses and customer invoices.',
    subtitleAr: 'تركيبات المواقع وقطع الغيار ترحل على مراكز التكلفة التحليلية وفواتير العملاء.',
    targetAccountingView: 'journal_entries',
    targetButtonEn: 'View Analytic Journal Entries',
    targetButtonAr: 'عرض القيود التحليلية',
    rows: [
      { id: 'TKT-2026-0882', date: 'Oct 29', partnerEn: 'Red Sea Drilling & Marine Services', partnerAr: 'خدمات البحر الأحمر للحفر والملاحة', descEn: 'On-Site Marine Winch Hydraulic Rebuild (CC-101)', amount: 48012.50, glRef: 'INV/2026/00008', status: 'Billed & Closed' },
    ],
  },
};

// --- DEMO CUSTOMER INVOICES & PROFORMA INVOICES (MATCHING SCREENSHOT 9 & ODOO 12) ---
const INITIAL_INVOICES = [
  {
    id: 'INV-1',
    number: 'PRO/2026/00006',
    proformaRef: 'PRO/2026/00006',
    customerEn: 'Neom Bay Infrastructure JV',
    customerAr: 'ائتلاف البنية التحتية خليج نيوم',
    vatNo: '300554433200003',
    invoiceDate: 'Oct 30',
    forceDate: '2026-10-30',
    dueDateText: 'In 15 days',
    dueDateType: 'normal',
    taxExcluded: 145000.00,
    total: 166750.00,
    amountDue: 166750.00,
    currency: 'SAR',
    zatcaStatus: 'Proforma (No XML)',
    status: 'Proforma',
    invoiceSubtype: 'proforma',
    subtypeLabelEn: 'Proforma Invoice',
    subtypeLabelAr: 'فاتورة مبدئية (بروفرما)',
    companyId: 'HVY',
    companyName: 'Al Yamama Heavy Equipment Co.',
    lines: [
      { id: 1, descEn: '80-Ton Telescopic Crane Mobilization & Rental', descAr: 'تأجير وتجهيز رافعة تلسكوبية 80 طن', analytic: 'CC-201 Heavy Leasing', qty: 1, price: 145000, tax: 15 }
    ]
  },
  {
    id: 'INV-2',
    number: 'INV/2026/00012',
    proformaRef: 'PRO/2026/00004',
    customerEn: 'Riyadh Metro Construction Corp.',
    customerAr: 'شركة إنشاءات مترو الرياض',
    vatNo: '300987654300003',
    invoiceDate: 'Oct 30',
    forceDate: '2026-10-25',
    dueDateText: 'Today',
    dueDateType: 'warning',
    taxExcluded: 50000.00,
    total: 57500.00,
    amountDue: 37500.00,
    currency: 'SAR',
    zatcaStatus: 'CLEARED (QR)',
    status: 'Partially Paid',
    invoiceSubtype: 'credit',
    subtypeLabelEn: 'Credit Invoice',
    subtypeLabelAr: 'فاتورة آجل',
    companyId: 'HYD',
    companyName: 'Al Yamama Hydraulic Workshop Co.',
    lines: [
      { id: 1, descEn: 'Overhaul 400-Ton Hydraulic Cylinder & Seal Kit', descAr: 'عمرة أسطوانة هيدروليك 400 طن مع طقم مانعات تسرب', analytic: 'CC-101 Workshop Ops', qty: 2, price: 20500, tax: 15 },
      { id: 2, descEn: 'High-Pressure Parker Seal Kit & Calibration', descAr: 'طقم مانعات تسرب ضغط عالي ومعايرة', analytic: 'CC-102 Spare Parts', qty: 2, price: 4500, tax: 15 }
    ]
  },
  {
    id: 'INV-3',
    number: 'INV/2026/00011',
    proformaRef: '',
    customerEn: '44 Supermarket',
    customerAr: 'سوبرماركت 44',
    vatNo: '300112233400003',
    invoiceDate: '06/03/2026',
    invoiceDateTime: '06/03/2026 12:46:33',
    forceDate: '2026-03-06',
    dueDateText: '06/03/2026',
    dueDateType: 'normal',
    taxExcluded: 975.00,
    total: 1121.25,
    amountDue: 1121.25,
    currency: 'SAR',
    zatcaStatus: 'CLEARED (QR)',
    status: 'Draft',
    invoiceSubtype: 'cash',
    subtypeLabelEn: 'Cash Invoice',
    subtypeLabelAr: 'فاتورة نقدية',
    companyId: 'HYD',
    companyName: 'Al Yamama Hydraulic Workshop Co.',
    isSubscription: true,
    salesperson: 'Adithya PL',
    groupTask: 'No Grouping',
    companySeal: true,
    showOutStock: false,
    salesTeam: 'Sales',
    lines: [
      {
        id: 1,
        task: 'Subscription',
        category: 'Subscription',
        showSeparately: false,
        showLine: false,
        mainQuantityCheck: false,
        partnerType: 'FAY',
        subType: 'Annual Service Subscription - 1 Year',
        product: 'Annual Service Subscription - 1 Year',
        descEn: 'Annual Service Subscription (Renewal)',
        descAr: 'اشتراك صيانة سنوي (تجديد)',
        account: '479104 Revenue (Renewal)',
        analytic: 'CC-101 Workshop Ops',
        mainQty: 0.0,
        qty: 3,
        uom: 'Units',
        price: 325,
        tax: 15,
        discount: 0.0,
        roundingRequired: false,
      }
    ]
  },
  {
    id: 'INV-4',
    number: 'INV/2026/00010',
    proformaRef: 'PRO/2026/00002',
    customerEn: 'Acme Arabia Industrial Corp.',
    customerAr: 'شركة أكمي العربية الصناعية',
    vatNo: '300445566700003',
    invoiceDate: 'Oct 28',
    forceDate: '2026-10-28',
    dueDateText: 'In 4 weeks',
    dueDateType: 'normal',
    taxExcluded: 35270.00,
    total: 40560.50,
    amountDue: 40560.50,
    currency: 'SAR',
    zatcaStatus: 'CLEARED (QR)',
    status: 'Posted',
    invoiceSubtype: 'credit',
    subtypeLabelEn: 'Credit Invoice',
    subtypeLabelAr: 'فاتورة آجل',
    companyId: 'IND',
    companyName: 'Al Yamama Industrial Spare Parts Co.',
    lines: [
      { id: 1, descEn: 'Bosch Rexroth Axial Piston Pump A4VG125', descAr: 'مضخة مكبسية محورية بوش ريكسروث', analytic: 'CC-301 Distribution', qty: 1, price: 35270, tax: 15 }
    ]
  },
  {
    id: 'INV-5',
    number: 'INV/2026/00008',
    proformaRef: '-',
    customerEn: 'Red Sea Drilling & Marine Services',
    customerAr: 'خدمات البحر الأحمر للحفر والملاحة',
    vatNo: '300778899000003',
    invoiceDate: 'Oct 25',
    forceDate: '2026-10-22',
    dueDateText: '2 days ago',
    dueDateType: 'danger',
    taxExcluded: 41750.00,
    total: 48012.50,
    amountDue: 48012.50,
    currency: 'SAR',
    zatcaStatus: 'CLEARED (QR)',
    status: 'Posted',
    invoiceSubtype: 'credit',
    subtypeLabelEn: 'Credit Invoice',
    subtypeLabelAr: 'فاتورة آجل',
    companyId: 'HYD',
    companyName: 'Al Yamama Hydraulic Workshop Co.',
    lines: [
      { id: 1, descEn: 'Marine Winch Hydraulic Motor Rebuild', descAr: 'تجديد محرك ونش بحري هيدروليكي', analytic: 'CC-101 Workshop Ops', qty: 1, price: 41750, tax: 15 }
    ]
  },
  {
    id: 'INV-6',
    number: 'INV/2026/00005',
    proformaRef: 'PRO/2026/00001',
    customerEn: 'Al Yamama Hydraulic Workshop Co. (IC)',
    customerAr: 'شركة ورشة اليمامة للهيدروليك (شركة شقيقة)',
    vatNo: '300023456700003',
    invoiceDate: 'Oct 20',
    forceDate: '2026-10-20',
    dueDateText: 'Paid on Oct 26',
    dueDateType: 'normal',
    taxExcluded: 13500.00,
    total: 15525.00,
    amountDue: 0.00,
    currency: 'SAR',
    zatcaStatus: 'CLEARED (QR)',
    status: 'Paid',
    invoiceSubtype: 'credit',
    subtypeLabelEn: 'Inter-Company Invoice',
    subtypeLabelAr: 'فاتورة شركات شقيقة',
    companyId: 'LOG',
    companyName: 'Al Yamama Logistics & Fleet Co.',
    lines: [
      { id: 1, descEn: 'Inter-Company Heavy Lowbed Transport (Dammam to Riyadh)', descAr: 'نقل مقطورة لوبد بين الشركات الشقيقة', analytic: 'CC-401 Fleet Transport', qty: 3, price: 4500, tax: 15 }
    ]
  },
  {
    id: 'INV-7',
    number: 'RINV/2026/00002',
    proformaRef: 'CN-REF-0008',
    customerEn: 'Arabian Cement Manufacturing Co.',
    customerAr: 'شركة الأسمنت العربية الصناعية',
    vatNo: '300665544300003',
    invoiceDate: 'Oct 18',
    forceDate: '2026-10-18',
    dueDateText: '3 days ago',
    dueDateType: 'danger',
    taxExcluded: 6800.00,
    total: 7820.00,
    amountDue: 0.00,
    currency: 'SAR',
    zatcaStatus: 'CLEARED (Credit Note)',
    status: 'Paid',
    invoiceSubtype: 'refund',
    subtypeLabelEn: 'Credit Note',
    subtypeLabelAr: 'إشعار دائن',
    companyId: 'IND',
    companyName: 'Al Yamama Industrial Spare Parts Co.',
    lines: [
      { id: 1, descEn: 'Credit Note — Directional Control Valve Return', descAr: 'إشعار دائن — مرتجع صمام تحكم توجيهي', analytic: 'CC-102 Spare Parts', qty: 1, price: 6800, tax: 15 }
    ]
  },
  {
    id: 'INV-8',
    number: 'PRG/2026/00003',
    proformaRef: 'CNTR-RMC-2026',
    customerEn: 'Riyadh Metro Construction Corp.',
    customerAr: 'شركة إنشاءات مترو الرياض',
    vatNo: '300987654300003',
    invoiceDate: 'Oct 29',
    forceDate: '2026-10-29',
    dueDateText: 'In 30 days',
    dueDateType: 'normal',
    taxExcluded: 85000.00,
    total: 97750.00,
    amountDue: 97750.00,
    currency: 'SAR',
    zatcaStatus: 'CLEARED (Progressive)',
    status: 'Posted',
    invoiceSubtype: 'progressive',
    subtypeLabelEn: 'Progressive Invoice',
    subtypeLabelAr: 'فاتورة إنجاز (مستخلص)',
    companyId: 'HYD',
    companyName: 'Al Yamama Hydraulic Workshop Co.',
    lines: [
      { id: 1, descEn: 'Progressive Claim #3 — Station TBM Hydraulic Jacks Overhaul', descAr: 'مستخلص إنجاز رقم 3 — صيانة رافعات دروع الحفر لمترو الرياض', analytic: 'CC-101 Workshop Ops', qty: 1, price: 85000, tax: 15 }
    ]
  },
  {
    id: 'INV-9',
    number: 'INV/2026/00015',
    proformaRef: '-',
    customerEn: 'Al-Tamimi Transport & Fleet Services',
    customerAr: 'نقليات التميمي وخدمات الأسطول',
    vatNo: '300889911200003',
    invoiceDate: 'Oct 30',
    forceDate: '2026-10-30',
    dueDateText: 'Paid',
    dueDateType: 'normal',
    taxExcluded: 7500.00,
    total: 8625.00,
    amountDue: 0.00,
    currency: 'SAR',
    zatcaStatus: 'CLEARED (QR)',
    status: 'Paid',
    invoiceSubtype: 'cash',
    subtypeLabelEn: 'Cash Invoice',
    subtypeLabelAr: 'فاتورة نقدية',
    companyId: 'HYD',
    companyName: 'Al Yamama Hydraulic Workshop Co.',
    lines: [
      { id: 1, descEn: 'Workshop Counter Cash Sale — High-Pressure Hoses & Parker Fittings', descAr: 'بيع نقدي كاونتر الورشة — ليات ضغط عالي وتوصيلات باركر', analytic: 'CC-102 Spare Parts', qty: 5, price: 1500, tax: 15 }
    ]
  }
];

// --- DEMO JOURNAL ENTRIES (MATCHING SCREENSHOTS 1, 3, 7) ---
const JOURNAL_ENTRIES_LIST = [
  { id: 'JE-101', date: 'Oct 30', forceDate: '2026-10-30', number: 'RBILL/2026/10/0001', partner: 'Ready Mat Industrial Saudi', ref: 'Vendor Bill — Hydraulic Chrome Rods', journal: 'Purchases', company: 'Al Yamama Hydraulic Workshop Co.', companyId: 'HYD', total: 34500.00, status: 'Posted', type: 'PURCHASE' },
  { id: 'JE-102', date: 'Oct 30', forceDate: '2026-10-25', number: 'STJ/2026/10/0006', partner: 'Bosch Rexroth AG (Germany)', ref: 'WH/IN/0089 Auto Stock Valuation (stock_force_date: Oct 25)', journal: 'Inventory Valuation', company: 'Al Yamama Industrial Spare Parts Co.', companyId: 'IND', total: 162000.00, status: 'Posted', type: 'INVENTORY' },
  { id: 'JE-103', date: 'Oct 30', forceDate: '2026-10-25', number: 'LCJ/2026/10/0005', partner: 'Saudi Customs & ZATCA Port', ref: 'Landed Cost Allocation on WH/IN/0089 (BAYAN-4491)', journal: 'Inventory Valuation', company: 'Al Yamama Industrial Spare Parts Co.', companyId: 'IND', total: 14500.00, status: 'Posted', type: 'INVENTORY' },
  { id: 'JE-104', date: 'Oct 29', forceDate: '2026-10-29', number: 'PBNK1/2026/00002', partner: 'Riyadh Metro Construction Corp.', ref: 'Customer Receipt Partially Reconciled to INV/2026/00012', journal: 'Al Rajhi Bank (SAR)', company: 'Al Yamama Hydraulic Workshop Co.', companyId: 'HYD', total: 20000.00, status: 'Posted', type: 'BANK' },
  { id: 'JE-105', date: 'Oct 29', forceDate: '2026-10-29', number: 'PBNK1/2026/00001', partner: 'Dammam Steel & Chrome Shafts', ref: 'Outbound Cheque #0048912 Cleared', journal: 'Al Rajhi Bank (SAR)', company: 'Al Yamama Hydraulic Workshop Co.', companyId: 'HYD', total: 42500.00, status: 'Posted', type: 'BANK' },
  { id: 'JE-106', date: 'Oct 28', forceDate: '2026-10-28', number: 'MISC/2026/10/0004', partner: 'Workshop Asset Register', ref: 'Monthly Depreciation — CNC Honing & Lathe Machine', journal: 'Miscellaneous Operations', company: 'Al Yamama Hydraulic Workshop Co.', companyId: 'HYD', total: 3000.00, status: 'Posted', type: 'MISC' },
  { id: 'JE-107', date: 'Oct 28', forceDate: '2026-10-28', number: 'MISC/2026/10/0003', partner: 'Gulf Drilling Logistics (USD)', ref: 'Realized Foreign Exchange Gain on USD Settlement', journal: 'Exchange Difference', company: 'Al Yamama Industrial Spare Parts Co.', companyId: 'IND', total: 144.00, status: 'Posted', type: 'FX' },
  { id: 'JE-108', date: 'Oct 28', forceDate: '2026-10-25', number: 'INV/2026/00012', partner: 'Riyadh Metro Construction Corp.', ref: 'ZATCA Cleared Tax Invoice (PO-RMC-8821)', journal: 'Sales', company: 'Al Yamama Hydraulic Workshop Co.', companyId: 'HYD', total: 57500.00, status: 'Posted', type: 'SALE' },
  { id: 'JE-109', date: 'Oct 28', forceDate: '2026-10-28', number: 'INV/2026/00010', partner: 'Acme Arabia Industrial Corp.', ref: 'AGR-2026-881', journal: 'Sales', company: 'Al Yamama Industrial Spare Parts Co.', companyId: 'IND', total: 40560.50, status: 'Posted', type: 'SALE' },
  { id: 'JE-110', date: 'Oct 26', forceDate: '2026-10-26', number: 'BILL/2026/10/0312', partner: 'Al Yamama Logistics & Fleet Co. (IC)', ref: 'Auto Inter-Company Mirror Bill from INV/2026/00005', journal: 'Inter-Company Purchases', company: 'Al Yamama Hydraulic Workshop Co.', companyId: 'HYD', total: 15525.00, status: 'Posted', type: 'IC' },
  { id: 'JE-111', date: 'Oct 26', forceDate: '2026-10-26', number: 'CSH1/2026/00004', partner: 'Workshop Counter Sales', ref: 'Cash Workshop Seal Replacements', journal: 'Main Cash Box (SAR)', company: 'Al Yamama Hydraulic Workshop Co.', companyId: 'HYD', total: 6800.00, status: 'Posted', type: 'CASH' },
];

// --- DEMO VENDORS DIRECTORY (MATCHING SCREENSHOT 8) ---
const VENDORS_DIRECTORY = [
  { id: 'V-1', name: 'Ready Mat Industrial Saudi', email: 'finance@readymat.sa', phone: '+966 11 498 6126', country: 'Saudi Arabia', bills: 4, rating: 3, docs: 2, payments: 5, poCount: 6, color: 'bg-blue-100 text-blue-800' },
  { id: 'V-2', name: 'Bosch Rexroth AG (Hydraulics)', email: 'export.mena@boschrexroth.de', phone: '+49 9352 18 0', country: 'Germany', bills: 2, rating: 5, docs: 4, payments: 4, poCount: 12, color: 'bg-indigo-100 text-indigo-800' },
  { id: 'V-3', name: 'Petronyx Industrial Oils & Fuels', email: 'accounts@petronyx.fuels.sa', phone: '+966 13 882 6789', country: 'Saudi Arabia', bills: 1, rating: 2, docs: 1, payments: 3, poCount: 4, color: 'bg-amber-100 text-amber-800' },
  { id: 'V-4', name: 'Saudi Customs & ZATCA Port Authority', email: 'bayan.clearance@zatca.gov.sa', phone: '+966 19993', country: 'Saudi Arabia (Gov)', bills: 6, rating: 5, docs: 8, payments: 6, poCount: 0, color: 'bg-emerald-100 text-emerald-800' },
  { id: 'V-5', name: 'Al Yamama Logistics & Fleet Co. (Sister Co.)', email: 'ic.billing@alyamama.sa', phone: '+966 11 210 9900', country: 'Saudi Arabia (Inter-Company)', bills: 5, rating: 5, docs: 5, payments: 4, poCount: 9, color: 'bg-blue-100 text-blue-900' },
];

export default function App() {
  // Layout & Navigation State (Locked to Option 2 Left Accent Indicator in Darker Blue)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState('accounting');
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'invoices', 'journal_entries', 'vendors', 'bills', 'landed_costs', 'reconcile', 'reports', 'product_categories', 'lock_dates', 'module_overview', 'settings'
  const [openTopDropdown, setOpenTopDropdown] = useState(null);
  const [selectedReportName, setSelectedReportName] = useState('Profit and Loss');
  const [settingsSearchQuery, setSettingsSearchQuery] = useState('');

  // Company Switcher & User Preferences State
  const [selectedCompanies, setSelectedCompanies] = useState(['HYD', 'PARENT', 'HVY', 'IND', 'LOG', 'INS']);
  const [primaryCompanyId, setPrimaryCompanyId] = useState('HYD');
  const [companyPopupOpen, setCompanyPopupOpen] = useState(false);
  const [userMenuPopupOpen, setUserMenuPopupOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [prefTab, setPrefTab] = useState('Preferences');

  // User Preferences Form Data (Matching Screenshot 1)
  const [lang, setLang] = useState('en'); // 'en' | 'ar'
  const [themeMode, setThemeMode] = useState('Light');
  const [notifMode, setNotifMode] = useState('By Emails');
  const [emailSignature, setEmailSignature] = useState('Tariq Al-Mansoor — Chief Accountant\nFlames of Al Yamama Trading Group (Riyadh)');

  // Search, Filters & View Mode State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChips, setActiveChips] = useState(['Posted']);
  const [displayMode, setDisplayMode] = useState('list'); // 'list' | 'kanban'

  // Invoices & Selected Record Modal State
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [printPreviewMode, setPrintPreviewMode] = useState(null); // null | 'proforma' | 'zatca'
  const [selectedJeRecord, setSelectedJeRecord] = useState(null);

  // Creation Modals & Payment State
  const [invoiceCreateOpen, setInvoiceCreateOpen] = useState(false);
  const [invoiceCreateType, setInvoiceCreateType] = useState('customer'); // 'customer' | 'vendor'
  const [paymentCreateOpen, setPaymentCreateOpen] = useState(false);
  const [paymentCreateDefaults, setPaymentCreateDefaults] = useState({
    type: 'receive',
    partner: '',
    amount: 25000,
    memo: '',
    invoiceId: null,
  });

  const INITIAL_PAYMENTS = [
    {
      id: 'PAY-1',
      number: 'PAY/IN/2026/00084',
      paymentType: 'receive',
      partner: 'Neom Bay Infrastructure JV',
      amount: 150000.0,
      date: '2026-10-30',
      journal: 'Al Rajhi Corporate Bank SAR (111101)',
      paymentMethod: 'Electronic Bank Transfer (SARIE / SADAD)',
      chequeNo: '',
      memo: 'Settlement for PRO/2026/00006',
      companyId: 'HYD',
      companyName: 'Al Yamama Hydraulic Workshop Co.',
      status: 'Posted',
    },
    {
      id: 'PAY-2',
      number: 'PAY/IN/2026/00083',
      paymentType: 'receive',
      partner: 'Riyadh Metro Construction Corp.',
      amount: 57500.0,
      date: '2026-10-28',
      journal: 'Riyad Bank Corporate SAR (111102)',
      paymentMethod: 'Electronic Bank Transfer (SARIE / SADAD)',
      chequeNo: '',
      memo: 'INV/2026/00012 settlement',
      companyId: 'HYD',
      companyName: 'Al Yamama Hydraulic Workshop Co.',
      status: 'Reconciled',
    },
    {
      id: 'PAY-3',
      number: 'PAY/OUT/2026/00082',
      paymentType: 'send',
      partner: 'Bosch Rexroth AG (Germany)',
      amount: 185000.0,
      date: '2026-10-25',
      journal: 'SNB National Commercial Bank SAR (111103)',
      paymentMethod: 'Electronic Bank Transfer (SARIE / SADAD)',
      chequeNo: '',
      memo: 'Piston pumps procurement RBILL/2026/10/0001',
      companyId: 'IND',
      companyName: 'Al Yamama Industrial Spare Parts Co.',
      status: 'Posted',
    },
    {
      id: 'PAY-4',
      number: 'PAY/OUT/2026/00081',
      paymentType: 'send',
      partner: 'Ready Mat Industrial Saudi',
      amount: 42500.0,
      date: '2026-10-22',
      journal: 'Al Rajhi Corporate Bank SAR (111101)',
      paymentMethod: 'Corporate Cheque',
      chequeNo: 'CHQ/0048912',
      memo: 'Workshop spare parts batch #882',
      companyId: 'HYD',
      companyName: 'Al Yamama Hydraulic Workshop Co.',
      status: 'Reconciled',
    },
    {
      id: 'PAY-5',
      number: 'PAY/IN/2026/00080',
      paymentType: 'receive',
      partner: 'Saudi Aramco Mining Div',
      amount: 92000.0,
      date: '2026-10-20',
      journal: 'Al Rajhi Corporate Bank SAR (111101)',
      paymentMethod: 'Electronic Bank Transfer (SARIE / SADAD)',
      chequeNo: '',
      memo: 'Mining rig hydraulic cylinders',
      companyId: 'HYD',
      companyName: 'Al Yamama Hydraulic Workshop Co.',
      status: 'Reconciled',
    },
  ];

  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const isRtl = lang === 'ar';
  const t = (en, ar) => (lang === 'ar' ? ar : en);

  const activeCompanyObj = useMemo(
    () => COMPANIES.find((c) => c.id === primaryCompanyId) || COMPANIES[0],
    [primaryCompanyId]
  );

  // Create New Invoice draft in Odoo Form View
  const handleCreateNewInvoice = (subtype = 'cash') => {
    const newInv = {
      id: `INV-${Date.now()}`,
      number: 'Draft Invoice',
      proformaRef: '',
      customerEn: '44 Supermarket',
      customerAr: 'سوبرماركت 44',
      vatNo: '300112233400003',
      invoiceDate: '06/03/2026',
      invoiceDateTime: '06/03/2026 12:46:33',
      forceDate: '2026-03-06',
      dueDateText: '06/03/2026',
      dueDateType: 'normal',
      taxExcluded: 975.00,
      total: 1121.25,
      amountDue: 1121.25,
      currency: 'SAR',
      zatcaStatus: 'DRAFT (Phase 2)',
      status: 'Draft',
      type: 'customer',
      invoiceSubtype: subtype,
      subtypeLabelEn: subtype === 'cash' ? 'Cash Invoice' : 'Credit Invoice',
      subtypeLabelAr: subtype === 'cash' ? 'فاتورة نقدية' : 'فاتورة آجل',
      companyId: 'HYD',
      companyName: 'Al Yamama Hydraulic Workshop Co.',
      isSubscription: subtype === 'cash',
      project: '',
      contactPerson: '',
      paymentTerms: subtype === 'cash' ? 'Immediate Payment' : '30 Days',
      showDiscount: false,
      vendorProjectName: '',
      prNumber: '',
      poNumber: '',
      salesperson: 'Adithya PL',
      equipmentDetails: '',
      groupTask: 'No Grouping',
      companySeal: true,
      showOutStock: false,
      salesTeam: 'Sales',
      lines: [
        {
          id: Date.now(),
          task: 'Subscription',
          category: 'Subscription',
          showSeparately: false,
          showLine: false,
          mainQuantityCheck: false,
          partnerType: 'FAY',
          subType: 'Annual Service Subscription - 1 Year',
          product: 'Annual Service Subscription - 1 Year',
          descEn: 'Annual Service Subscription (Renewal)',
          descAr: 'اشتراك صيانة سنوي (تجديد)',
          account: '479104 Revenue (Renewal)',
          analytic: 'CC-101 Workshop Ops',
          mainQty: 0.0,
          qty: 3,
          uom: 'Units',
          price: 325,
          tax: 15,
          discount: 0.0,
          roundingRequired: false,
        }
      ]
    };
    setSelectedInvoice(newInv);
    setInvoiceCreateOpen(false);
  };

  // Toggle Company Selection in Multi-Company Switcher (Odoo 13+ Checkbox behavior)
  const toggleCompanyCheckbox = (compId) => {
    setSelectedCompanies((prev) => {
      if (prev.includes(compId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== compId);
      }
      return [...prev, compId];
    });
    setPrimaryCompanyId(compId);
  };

  // Top Bar Menu Structure (Exact Match to Screenshots 4, 5, 6, 7, 9)
  const TOP_MENUS = [
    {
      id: 'Dashboard',
      labelEn: 'Dashboard',
      labelAr: 'لوحة التحكم',
      action: () => {
        setActiveView('dashboard');
        setOpenTopDropdown(null);
      },
    },
    {
      id: 'Customers',
      labelEn: 'Customers',
      labelAr: 'العملاء',
      groups: [
        {
          isSubheader: true,
          labelEn: 'Invoices',
          labelAr: 'فواتير العملاء',
          view: 'invoices',
          chip: 'All Invoices',
          odooId: 'account.menu_action_invoice_tree1',
          subItems: [
            { labelEn: 'Cash Invoices', labelAr: 'الفواتير النقدية', view: 'invoices', chip: 'Cash Invoices', odooId: 'account_customization.menu_action_invoice_tree13' },
            { labelEn: 'Credit Invoices', labelAr: 'فواتير الآجل', view: 'invoices', chip: 'Credit Invoices', odooId: 'account_customization.menu_action_invoice_tree14' },
            { labelEn: 'Proforma Invoices', labelAr: 'الفواتير المبدئية (البروفرما)', view: 'invoices', chip: 'Proforma Only', odooId: 'sale_custom.menu_proforma_invoice' },
            { labelEn: 'Progressive Invoices', labelAr: 'فواتير الإنجاز (المستخلصات)', view: 'invoices', chip: 'Progressive Invoices', odooId: 'att_progressive_invoicing.menu_progressive_invoice' },
          ],
        },
        { labelEn: 'Credit Notes', labelAr: 'الإشعارات الدائنة', view: 'invoices', chip: 'Credit Notes', odooId: 'account.menu_action_invoice_out_refund' },
        { labelEn: 'Internal Voucher', labelAr: 'سندات القبض الداخلية', view: 'journal_entries', chip: 'Internal Voucher', odooId: 'account_voucher_extension.menu_internal_voucher' },
        { labelEn: 'Payments', labelAr: 'المدفوعات والشيكات', view: 'payments', chip: 'Customer Payments', odooId: 'account.menu_action_account_payments_receivable' },
        { labelEn: 'Products', labelAr: 'المنتجات والخدمات', view: 'product_categories', chip: 'Sellable Products', odooId: 'account.product_product_menu_sellable' },
        { labelEn: 'Customers', labelAr: 'دليل العملاء', view: 'vendors', chip: 'Customers', odooId: 'account.menu_account_customer' },
      ],
    },
    {
      id: 'Vendors',
      labelEn: 'Vendors',
      labelAr: 'الموردين',
      groups: [
        {
          isSubheader: true,
          labelEn: 'Bills',
          labelAr: 'فواتير الموردين',
          view: 'bills',
          chip: 'Vendor Bills',
          odooId: 'account.menu_action_invoice_tree2',
          subItems: [
            { labelEn: 'To Approve Bill', labelAr: 'فواتير قيد الاعتماد', view: 'bills', chip: 'To Approve', odooId: 'account_customization.action_invoice_accoun_to_approve' },
            { labelEn: 'Approved Bill', labelAr: 'الفواتير المعتمدة', view: 'bills', chip: 'Approved Bills', odooId: 'account_customization.action_invoice_accoun_to_approved' },
            { labelEn: 'Vendor Bills', labelAr: 'كافة فواتير الموردين', view: 'bills', chip: 'Vendor Bills', odooId: 'account.menu_action_invoice_tree2' },
          ],
        },
        { labelEn: 'Refunds', labelAr: 'إشعارات المدين للموردين', view: 'bills', chip: 'Vendor Refunds', odooId: 'account.menu_action_invoice_in_refund' },
        { labelEn: 'Internal Voucher', labelAr: 'سندات الصرف للمشتريات', view: 'bills', chip: 'Purchase Receipts', odooId: 'account_voucher_extension.menu_action_purchase_receipt' },
        { labelEn: 'Payments', labelAr: 'مدفوعات الموردين', view: 'payments', chip: 'Vendor Payments', odooId: 'account.menu_action_account_payments_payable' },
        { labelEn: 'Landed Costs', labelAr: 'التكاليف الإضافية للمخزون', view: 'landed_costs', chip: 'Landed Costs', odooId: 'landedcost_custom.menu_stock_landed_cost' },
        { labelEn: 'Products', labelAr: 'منتجات المشتريات', view: 'product_categories', chip: 'Purchasable Products', odooId: 'account.product_product_menu_purchasable' },
        { labelEn: 'Vendors', labelAr: 'دليل الموردين', view: 'vendors', chip: 'Vendors', odooId: 'account.menu_account_supplier' },
      ],
    },
    {
      id: 'Accounting',
      labelEn: 'Accounting',
      labelAr: 'المحاسبة',
      menuWidth: 'w-60',
      groups: [
        {
          isSubheader: true,
          labelEn: 'Accounting Entries',
          labelAr: 'القيود المحاسبية',
          subItems: [
            { labelEn: 'Journal Entries', labelAr: 'قيود اليومية', view: 'journal_entries', chip: 'Posted', odooId: 'account.menu_action_move_journal_line_form' },
            { labelEn: 'Journal Items', labelAr: 'عناصر اليومية', view: 'journal_entries', chip: 'All Items', odooId: 'account.menu_action_account_moves_all' },
            { labelEn: 'Analytic Items', labelAr: 'القيود التحليلية', view: 'journal_entries', chip: 'Analytic', odooId: 'account.menu_action_analytic_lines_tree' },
          ],
        },
        {
          isSubheader: true,
          labelEn: 'Management',
          labelAr: 'الإدارة',
          subItems: [
            { labelEn: 'Assets', labelAr: 'الأصول الثابتة', view: 'landed_costs', chip: 'Fixed Assets', odooId: 'om_account_asset.menu_action_account_asset_asset_form' },
            { labelEn: 'Asset Rental', labelAr: 'تأجير الأصول', view: 'landed_costs', chip: 'Asset Rental', odooId: 'asset_management_extended.menu_action_asset_rental' },
          ],
        },
        {
          isSubheader: true,
          labelEn: 'Actions',
          labelAr: 'الإجراءات',
          subItems: [
            { labelEn: 'Reconciliation', labelAr: 'التسوية', view: 'reconcile', chip: 'Unreconciled', odooId: 'account.menu_action_manual_reconciliation' },
            { labelEn: 'Tax Adjustments', labelAr: 'تسويات الضرائب', view: 'journal_entries', chip: 'Tax Adjustment', odooId: 'account.menu_action_tax_adjustment' },
          ],
        },
        {
          isSubheader: true,
          labelEn: 'Generate Entries',
          labelAr: 'توليد القيود',
          subItems: [
            { labelEn: 'Generate Assets Entries', labelAr: 'توليد قيود إهلاك الأصول', view: 'journal_entries', chip: 'Depreciation Wizard', odooId: 'om_account_asset.menu_asset_depreciation_confirmation_wizard' },
          ],
        },
      ],
    },
    {
      id: 'Reporting',
      labelEn: 'Reporting',
      labelAr: 'التقارير المالية',
      menuWidth: 'w-64',
      groups: [
        {
          isSubheader: true,
          labelEn: 'Management',
          labelAr: 'تقارير الإدارة',
          subItems: [
            { labelEn: 'Invoices', labelAr: 'تقرير الفواتير', view: 'invoices', chip: 'All Invoices', report: 'Invoices Report' },
            { labelEn: 'Partner Ledger', labelAr: 'كشف حساب الشركاء', view: 'reports', report: 'Partner Ledger' },
            { labelEn: 'General Ledger', labelAr: 'دفتر الأستاذ العام', view: 'reports', report: 'General Ledger' },
            { labelEn: 'Journals Audit', labelAr: 'مراجعة دفاتر اليومية', view: 'reports', report: 'Journals Audit' },
            { labelEn: 'Trial Balance', labelAr: 'ميزان المراجعة', view: 'reports', report: 'Trial Balance' },
            { labelEn: 'Balance Sheet', labelAr: 'الميزانية العمومية', view: 'reports', report: 'Balance Sheet' },
            { labelEn: 'Profit and Loss', labelAr: 'الأرباح والخسائر', view: 'reports', report: 'Profit and Loss' },
            { labelEn: 'Aged Partner Balance', labelAr: 'أعمار ديون الشركاء', view: 'reports', report: 'Aged Partner Balance' },
            { labelEn: 'Custom Profit and Loss', labelAr: 'الأرباح والخسائر المخصصة', view: 'reports', report: 'Custom Profit and Loss' },
            { labelEn: 'Vat Due Report', labelAr: 'تقرير استحقاق ضريبة القيمة المضافة', view: 'reports', report: 'VAT Due Report' },
            { labelEn: 'Analytic Report', labelAr: 'التقرير التحليلي (مراكز التكلفة)', view: 'reports', report: 'Analytic Report' },
            { labelEn: 'Cash Payment Report', labelAr: 'تقرير المدفوعات النقدية', view: 'reports', report: 'Cash Payment Report' },
            { labelEn: 'Assets', labelAr: 'تقرير الأصول الثابتة', view: 'reports', report: 'Assets Report' },
            { labelEn: 'Tax Report', labelAr: 'الإقرار الضريبي (VAT 15%)', view: 'reports', report: 'Tax Report (VAT 15%)' },
          ],
        },
        {
          isSubheader: true,
          labelEn: 'OCA accounting reports',
          labelAr: 'تقارير محاسبة OCA',
          subItems: [
            { labelEn: 'General Ledger', labelAr: 'دفتر الأستاذ العام (OCA)', view: 'reports', report: 'OCA General Ledger' },
            { labelEn: 'Journal Ledger', labelAr: 'دفتر القيود اليومية (OCA)', view: 'reports', report: 'OCA Journal Ledger' },
            { labelEn: 'Trial Balance', labelAr: 'ميزان المراجعة (OCA)', view: 'reports', report: 'OCA Trial Balance' },
            { labelEn: 'Open Items', labelAr: 'البنود المفتوحة المعلقة', view: 'reports', report: 'OCA Open Items' },
            { labelEn: 'Aged Partner Balance', labelAr: 'أعمار الديون (OCA)', view: 'reports', report: 'OCA Aged Partner Balance' },
            { labelEn: 'VAT Report', labelAr: 'تقرير ضريبة القيمة المضافة (OCA)', view: 'reports', report: 'OCA VAT Report' },
          ],
        },
        {
          isSubheader: true,
          labelEn: 'Cumulative Finance Reports',
          labelAr: 'التقارير المالية المجمعة للمجموعة',
          subItems: [
            { labelEn: 'Trial Balance', labelAr: 'ميزان المراجعة المجمع', view: 'reports', report: 'Cumulative Trial Balance' },
            { labelEn: 'Balance Sheet', labelAr: 'الميزانية العمومية المجمعة', view: 'reports', report: 'Cumulative Balance Sheet' },
            { labelEn: 'Profit and Loss', labelAr: 'قائمة الدخل المجمعة', view: 'reports', report: 'Cumulative Profit and Loss' },
            { labelEn: 'General Ledger', labelAr: 'دفتر الأستاذ العام المجمع', view: 'reports', report: 'Cumulative General Ledger' },
          ],
        },
        { labelEn: 'Inventory Adjustment', labelAr: 'تسوية الجرد المخزني', view: 'product_categories', chip: 'Stock Valuation' },
        { labelEn: 'Print Approved Suppliers', labelAr: 'طباعة الموردين المعتمدين', view: 'reports', report: 'Approved Suppliers Report' },
      ],
    },
    {
      id: 'Configuration',
      labelEn: 'Configuration',
      labelAr: 'الإعدادات والتهيئة',
      menuWidth: 'w-60',
      groups: [
        { labelEn: 'Settings', labelAr: 'الإعدادات', view: 'settings', chip: 'Settings', odooId: 'account.action_account_config' },
        {
          isSubheader: true,
          labelEn: 'Accounting',
          labelAr: 'المحاسبة',
          subItems: [
            { labelEn: 'Currencies', labelAr: 'العملات', view: 'product_categories', chip: 'Currencies', odooId: 'base.action_currency_form' },
            { labelEn: 'Chart of Accounts', labelAr: 'شجرة الحسابات', view: 'product_categories', chip: 'CoA', odooId: 'account.action_account_form' },
            { labelEn: 'Taxes', labelAr: 'الضرائب', view: 'product_categories', chip: 'Taxes', odooId: 'account.action_tax_form' },
            { labelEn: 'Fiscal Positions', labelAr: 'الأوضاع المالية والضريبية', view: 'product_categories', chip: 'Fiscal Positions', odooId: 'account.action_account_fiscal_position_form' },
            { labelEn: 'Bank Accounts', labelAr: 'الحسابات البنكية', view: 'product_categories', chip: 'Bank Accounts', odooId: 'account.action_account_bank_journal_form' },
            { labelEn: 'Fiscal Year', labelAr: 'السنة المالية', view: 'lock_dates', chip: 'Fiscal Year', odooId: 'account.action_fiscal_year' },
            { labelEn: 'Journals', labelAr: 'دفاتر اليومية', view: 'product_categories', chip: 'Journals', odooId: 'account.action_account_journal_form' },
            { labelEn: 'Incoterms', labelAr: 'شروط التجارة الدولية (Incoterms)', view: 'product_categories', chip: 'Incoterms', odooId: 'account.action_incoterms_tree' },
            { labelEn: 'Reconciliation Models', labelAr: 'نماذج التسوية', view: 'reconcile', chip: 'Reconciliation Models', odooId: 'account.action_account_reconcile_model' },
          ],
        },
        {
          isSubheader: true,
          labelEn: 'Management',
          labelAr: 'الإدارة',
          subItems: [
            { labelEn: 'Payment Terms', labelAr: 'شروط الدفع', view: 'product_categories', chip: 'Payment Terms', odooId: 'account.action_payment_term_form' },
            { labelEn: 'Asset Types', labelAr: 'أنواع الأصول الثابتة', view: 'product_categories', chip: 'Asset Types', odooId: 'om_account_asset.action_account_asset_asset_list_normal_purchase' },
          ],
        },
        {
          isSubheader: true,
          labelEn: 'Analytic Accounting',
          labelAr: 'المحاسبة التحليلية',
          subItems: [
            { labelEn: 'Analytic Accounts', labelAr: 'الحسابات التحليلية', view: 'product_categories', chip: 'Analytic Accounts', odooId: 'analytic.action_account_analytic_account_form' },
            { labelEn: 'Analytic Account Groups', labelAr: 'مجموعات الحسابات التحليلية', view: 'product_categories', chip: 'Analytic Account Groups', odooId: 'analytic.account_analytic_group_action' },
          ],
        },
        {
          isSubheader: true,
          labelEn: 'Payments',
          labelAr: 'المدفوعات الإلكترونية',
          subItems: [
            { labelEn: 'Payment Acquirers', labelAr: 'بوابات الدفع الإلكتروني', view: 'reconcile', chip: 'Payment Acquirers', odooId: 'payment.action_payment_acquirer' },
            { labelEn: 'Saved Payment Data', labelAr: 'بيانات الدفع المحفوظة', view: 'reconcile', chip: 'Saved Payment Data', odooId: 'payment.action_payment_token' },
            { labelEn: 'Payment Icons', labelAr: 'أيقونات الدفع', view: 'reconcile', chip: 'Payment Icons', odooId: 'payment.action_payment_icon' },
            { labelEn: 'Payment Transactions', labelAr: 'معاملات الدفع', view: 'reconcile', chip: 'Payment Transactions', odooId: 'payment.action_payment_transaction' },
          ],
        },
        {
          isSubheader: true,
          labelEn: 'Financial Reports',
          labelAr: 'التقارير المالية',
          subItems: [
            { labelEn: 'Account Reports', labelAr: 'تقارير الحسابات', view: 'reports', report: 'Account Reports', odooId: 'account_reports.action_account_financial_report_tree' },
          ],
        },
      ],
    },
  ];

  // Status Pill Renderer (Darker Corporate Blue / Emerald / Indigo palette)
  const renderStatusPill = (status) => {
    const styles = {
      Paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Posted: 'bg-blue-100 text-blue-800 border-blue-200',
      Sent: 'bg-blue-50 text-blue-700 border-blue-200',
      Proforma: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Partially Paid': 'bg-amber-100 text-amber-800 border-amber-200',
      Draft: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status] || styles.Draft}`}>
        {status}
      </span>
    );
  };

  // Shared Popover Menus for Company Switcher & User Profile (Used in Sidebar Bottom or Top Right when Sidebar is hidden)
  const renderCompanyPopover = (positionClass = 'bottom-14 left-0') =>
    companyPopupOpen && (
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute ${positionClass} w-80 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50`}
      >
        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span className="text-xs font-bold text-slate-800">
              {t('Switch or Consolidate Companies', 'اختر أو وحد الشركات')}
            </span>
          </div>
          <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            {selectedCompanies.length}/{COMPANIES.length}
          </span>
        </div>
        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 my-1">
          {COMPANIES.map((comp) => {
            const isChecked = selectedCompanies.includes(comp.id);
            const isPrimary = primaryCompanyId === comp.id;
            return (
              <div
                key={comp.id}
                onClick={() => toggleCompanyCheckbox(comp.id)}
                className={`px-4 py-2.5 flex items-center justify-between text-xs cursor-pointer transition ${
                  isPrimary ? 'bg-blue-50/90 font-bold text-blue-950' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-blue-700 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <div className="truncate">
                    <div className="truncate">{t(comp.nameEn, comp.nameAr)}</div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                      VAT: {comp.vat} • {comp.cityEn}
                    </div>
                  </div>
                </div>
                {comp.isParent && (
                  <span className="text-[9px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold shrink-0">
                    HQ
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );

  const renderUserPopover = (positionClass = 'bottom-12 left-0') =>
    userMenuPopupOpen && (
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute ${positionClass} w-60 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 text-xs z-50`}
      >
        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-900">Tariq Al-Mansoor</div>
            <div className="text-[11px] text-slate-500">t.almansoor@alyamama-group.sa</div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
          </span>
        </div>
        <button
          onClick={() => {
            setUserMenuPopupOpen(false);
            setPreferencesModalOpen(true);
          }}
          className="w-full px-4 py-2.5 text-start hover:bg-blue-50 flex items-center justify-between font-semibold text-blue-900"
        >
          <span>{t('My Preferences', 'تفضيلاتي وحسابي')}</span>
          <Settings className="w-4 h-4 text-blue-700" />
        </button>
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="w-full px-4 py-2.5 text-start hover:bg-slate-50 flex items-center justify-between"
        >
          <span>{t('Switch Language (عربي / EN)', 'تبديل اللغة (English / عربي)')}</span>
          <Globe className="w-4 h-4 text-slate-500" />
        </button>
        <div className="px-4 py-2 flex items-center justify-between text-slate-500">
          <span>{t('Shortcuts', 'الاختصارات')}</span>
          <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono">CTRL+K</kbd>
        </div>
        <div className="my-1 border-t border-slate-100" />
        <button
          onClick={() => setUserMenuPopupOpen(false)}
          className="w-full px-4 py-2 text-start hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('Log out', 'تسجيل الخروج')}</span>
        </button>
      </div>
    );

  // =========================================================================
  // FINALIZED OPTION 2 LEFT SIDEBAR:
  // Crisp White (#FFFFFF), Darker Blue 4px Left Accent Bar, Icon + Name Only,
  // Flat Borderless Company & User rows at the bottom.
  // =========================================================================
  const renderFinalLeftSidebar = () => {
    const handleModuleClick = (mod) => {
      setActiveModule(mod.id);
      if (mod.id === 'accounting') {
        setActiveView('dashboard');
      } else {
        setActiveView('module_overview');
      }
    };

    return (
      <aside className="w-64 h-full bg-white border-r border-slate-200 text-slate-800 flex flex-col justify-between shrink-0 select-none relative z-30">
        {/* Top Brand Header + Clean Module List (Icon + Name ONLY) */}
        <div className="py-5 space-y-6">
          <div className="flex items-center justify-between px-5">
            <div
              onClick={() => {
                setActiveModule('accounting');
                setActiveView('dashboard');
              }}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-2.5 h-6 rounded-full bg-blue-700" />
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                {t('Al Yamama ERP', 'نظام اليمامة')}
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-blue-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
              title={t('Hide Left Sidebar', 'إخفاء القائمة الجانبية')}
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {ERP_MODULES.map((mod) => {
              const Icon = mod.icon;
              const isSelected = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleModuleClick(mod)}
                  className={`w-full px-5 py-3 flex items-center gap-3.5 text-xs transition border-l-4 ${
                    isSelected
                      ? 'border-blue-700 bg-blue-50/80 text-blue-700 font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span className="truncate">{t(mod.nameEn, mod.nameAr)}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Area: Flat & Borderless Company Switcher + User Profile Rows */}
        <div
          className="px-5 py-4 border-t border-slate-100 space-y-3 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Row 1: Flat Company Switcher Link */}
          <div
            onClick={() => {
              setCompanyPopupOpen(!companyPopupOpen);
              setUserMenuPopupOpen(false);
            }}
            className="flex items-center justify-between gap-2 text-xs text-slate-700 hover:text-blue-700 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span className="truncate font-semibold group-hover:underline">
                {t(activeCompanyObj.nameEn, activeCompanyObj.nameAr)}
              </span>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
              {selectedCompanies.length}
            </span>
          </div>

          {/* Row 2: Flat User Avatar + Name Link */}
          <div className="flex items-center justify-between gap-2">
            <div
              onClick={() => {
                setUserMenuPopupOpen(!userMenuPopupOpen);
                setCompanyPopupOpen(false);
              }}
              className="flex items-center gap-2.5 text-xs text-slate-800 hover:text-blue-700 cursor-pointer group min-w-0"
            >
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                TM
              </span>
              <span className="truncate font-bold group-hover:underline">Tariq Al-Mansoor</span>
            </div>
            <button
              onClick={() => setPreferencesModalOpen(true)}
              className="text-slate-400 hover:text-blue-700 transition p-1"
              title={t('Change my Preferences', 'تعديل تفضيلات المستخدم')}
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          {renderCompanyPopover(isRtl ? 'bottom-20 right-3' : 'bottom-20 left-3')}
          {renderUserPopover(isRtl ? 'bottom-12 right-3' : 'bottom-12 left-3')}
        </div>
      </aside>
    );
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="h-screen w-full overflow-hidden bg-[#F8FAFC] text-slate-800 flex select-none font-sans"
      onClick={() => {
        if (openTopDropdown) setOpenTopDropdown(null);
        if (companyPopupOpen) setCompanyPopupOpen(false);
        if (userMenuPopupOpen) setUserMenuPopupOpen(false);
      }}
    >
      {/* =====================================================================
          LEFT SIDEBAR (OPTION 2: LEFT ACCENT INDICATOR WITH DARKER BLUE)
          When sidebarOpen === true, Company & User sit at the bottom of the
          left sidebar and are AUTOMATICALLY HIDDEN in the top-right header!
         ===================================================================== */}
      {sidebarOpen && renderFinalLeftSidebar()}

      {/* =====================================================================
          RIGHT MAIN WORKSPACE
         ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* 1. TOP HORIZONTAL NAVIGATION BAR */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20">
          {/* Left: Sidebar Open Toggle (when closed) + Module Title + Horizontal Menu Dropdowns */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition"
                  title={t('Open Left Module Sidebar', 'إظهار القائمة الجانبية')}
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
              )}
              <div
                onClick={() => {
                  setActiveModule('accounting');
                  setActiveView('dashboard');
                }}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  %
                </div>
                <span className="font-bold text-slate-900 text-sm tracking-tight">
                  {activeModule === 'accounting'
                    ? t('Accounting', 'المحاسبة')
                    : t(
                        ERP_MODULES.find((m) => m.id === activeModule)?.nameEn || 'Accounting',
                        ERP_MODULES.find((m) => m.id === activeModule)?.nameAr || 'المحاسبة'
                      )}
                </span>
              </div>
            </div>

            {/* Horizontal Menu Items with Screenshot-style Dropdowns */}
            <nav className="hidden lg:flex items-center gap-1">
              {TOP_MENUS.map((menu) => {
                const isOpen = openTopDropdown === menu.id;
                return (
                  <div key={menu.id} className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setActiveModule('accounting');
                        if (menu.action) {
                          menu.action();
                        } else {
                          setOpenTopDropdown(isOpen ? null : menu.id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                        isOpen
                          ? 'bg-[#1E293B] text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span>{t(menu.labelEn, menu.labelAr)}</span>
                    </button>

                    {/* Sub-header Dropdown (Exact Odoo 12 Menu Structure) */}
                    {isOpen && menu.groups && (
                      <div className={`absolute left-0 mt-1.5 ${menu.menuWidth || 'w-60'} bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 text-slate-700 max-h-[520px] overflow-y-auto`}>
                        {menu.groups.map((group, gIdx) => {
                          if (group.isSubheader) {
                            return (
                              <div key={gIdx} className="mb-1">
                                {/* Sub-header */}
                                <div
                                  onClick={() => {
                                    if (group.view) {
                                      setActiveModule('accounting');
                                      setActiveView(group.view);
                                      if (group.chip) setActiveChips([group.chip]);
                                      if (group.report) setSelectedReportName(group.report);
                                      setOpenTopDropdown(null);
                                    }
                                  }}
                                  className={`w-full px-4 py-1.5 text-start text-xs font-medium text-slate-500 transition block select-none ${
                                    group.view ? 'hover:text-slate-900 cursor-pointer' : 'cursor-default'
                                  }`}
                                >
                                  {t(group.labelEn, group.labelAr)}
                                </div>
                                {/* Indented Sub-items */}
                                <div className="space-y-0.5">
                                  {group.subItems.map((sub, sIdx) => (
                                    <button
                                      key={sIdx}
                                      onClick={() => {
                                        setActiveModule('accounting');
                                        setActiveView(sub.view);
                                        if (sub.chip) setActiveChips([sub.chip]);
                                        if (sub.report) setSelectedReportName(sub.report);
                                        setOpenTopDropdown(null);
                                      }}
                                      className={`w-full text-start text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition block py-1.5 ${
                                        isRtl ? 'pr-8 pl-4' : 'pl-8 pr-4'
                                      }`}
                                    >
                                      {t(sub.labelEn, sub.labelAr)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                          {/* Root Level Items */}
                          return (
                            <button
                              key={gIdx}
                              onClick={() => {
                                setActiveModule('accounting');
                                setActiveView(group.view);
                                if (group.view === 'invoices') setSelectedInvoice(null);
                                if (group.chip) setActiveChips([group.chip]);
                                if (group.report) setSelectedReportName(group.report);
                                setOpenTopDropdown(null);
                              }}
                              className="w-full px-4 py-1.5 text-start text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition block"
                            >
                              {t(group.labelEn, group.labelAr)}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Simple Dropdown fallback (if menu.items) */}
                    {isOpen && menu.items && (
                      <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                        {menu.items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setActiveModule('accounting');
                              setActiveView(item.view);
                              if (item.view === 'invoices') setSelectedInvoice(null);
                              if (item.chip) setActiveChips([item.chip]);
                              setOpenTopDropdown(null);
                            }}
                            className="w-full px-3.5 py-2 text-start text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-800 font-medium transition block"
                          >
                            {t(item.labelEn, item.labelAr)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right: Notifications, Language Toggle & Smart Auto-Hidden Company/User when Sidebar is Closed */}
          <div className="flex items-center gap-3">
            {/* Activity & Messaging Counters */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <button
                onClick={() => {
                  setActiveModule('accounting');
                  setActiveView('invoices');
                }}
                className="relative p-1.5 hover:bg-slate-100 rounded-lg transition"
                title="Pending Messages"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 bg-blue-700 text-white text-[9px] font-bold px-1 rounded-full">
                  14
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveModule('accounting');
                  setActiveView('bills');
                }}
                className="relative p-1.5 hover:bg-slate-100 rounded-lg transition"
                title="Pending Approvals"
              >
                <Clock className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[9px] font-bold px-1 rounded-full">
                  32
                </span>
              </button>
            </div>

            {/* Bilingual Quick Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-blue-700" />
              <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            {/* SMART AUTO-HIDE: Only show Company & User in Top-Right when Left Sidebar is CLOSED! */}
            {!sidebarOpen && (
              <div
                className="flex items-center gap-3 pl-3 border-l border-slate-200 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setCompanyPopupOpen(!companyPopupOpen);
                    setUserMenuPopupOpen(false);
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-blue-700 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-100 transition"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-700" />
                  <span className="hidden md:inline truncate max-w-[180px]">
                    {t(activeCompanyObj.nameEn, activeCompanyObj.nameAr)}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setUserMenuPopupOpen(!userMenuPopupOpen);
                    setCompanyPopupOpen(false);
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-800 hover:text-blue-700 p-1 rounded-md hover:bg-slate-100 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-700 text-white font-bold text-[10px] flex items-center justify-center relative">
                    TM
                    <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <span className="hidden sm:inline">Tariq Al-Mansoor</span>
                </button>

                {renderCompanyPopover(isRtl ? 'top-10 left-0' : 'top-10 right-10')}
                {renderUserPopover(isRtl ? 'top-10 left-0' : 'top-10 right-0')}
              </div>
            )}
          </div>
        </header>

        {/* 2. SUB-HEADER ACTION, SEARCH & PAGINATION BAR (Hidden when viewing an Invoice Form View) */}
        {!(activeView === 'invoices' && selectedInvoice) && (
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
          {/* Left: New / Upload / Save / Discard Buttons + Active View Title */}
          <div className="flex items-center gap-2.5">
            {activeView === 'settings' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    alert(t('Settings saved successfully (prototype)', 'تم حفظ الإعدادات بنجاح (نموذج تجريبي)'));
                  }}
                  className="px-3.5 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t('Save', 'حفظ')}</span>
                </button>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-3.5 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t('Discard', 'إلغاء')}</span>
                </button>
                <div className="h-4 w-px bg-slate-300 mx-1" />
                <h1 className="text-base font-bold text-slate-800">
                  {t('Accounting Settings', 'إعدادات المحاسبة')}
                </h1>
              </div>
            ) : (
              <>
                {activeView !== 'dashboard' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        if (activeView === 'bills') {
                          setInvoiceCreateType('vendor');
                          setInvoiceCreateOpen(true);
                        } else if (activeView === 'invoices') {
                          const isCash = activeChips.includes('Cash Invoices');
                          handleCreateNewInvoice(isCash ? 'cash' : 'credit');
                        } else if (activeView === 'payments' || activeView === 'reconcile') {
                          const isVendorPay = activeChips.includes('Vendor Payments');
                          setPaymentCreateDefaults({
                            type: isVendorPay ? 'send' : 'receive',
                            partner: '',
                            amount: 25000,
                            memo: '',
                            invoiceId: null,
                          });
                          setPaymentCreateOpen(true);
                        } else {
                          handleCreateNewInvoice('cash');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition"
                    >
                      {t('New', 'جديد')}
                    </button>
                    {(activeView === 'invoices' || activeView === 'bills') && (
                      <button
                        onClick={() => {
                          if (activeView === 'invoices') {
                            handleCreateNewInvoice('proforma');
                          } else {
                            setInvoiceCreateType('vendor');
                            setInvoiceCreateOpen(true);
                          }
                        }}
                        className="px-3 py-1.5 rounded-md bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-xs transition"
                      >
                        {t('Proforma / Upload', 'بروفرما / رفع')}
                      </button>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-800">
                    {activeView === 'dashboard' && t('Accounting Dashboard', 'لوحة التحكم المحاسبية')}
                    {activeView === 'invoices' && t('Customer Invoices & Proforma', 'فواتير العملاء والفواتير المبدئية (البروفرما)')}
                    {activeView === 'journal_entries' && t('Journal Entries', 'قيود اليومية')}
                    {activeView === 'vendors' && t('Vendors & Customers Directory', 'دليل الموردين والعملاء')}
                    {activeView === 'bills' && t('Vendor Bills & Inter-Company Mirroring', 'فواتير الموردين والشركات الشقيقة')}
                    {activeView === 'landed_costs' && t('Landed Costs & Fixed Assets', 'التكاليف الإضافية للمخزون والأصول الثابتة')}
                    {activeView === 'reconcile' && t('Payment Reconciliation & Cheques', 'تسوية الدفعات وسجل الشيكات')}
                    {activeView === 'payments' && (
                      activeChips.includes('Vendor Payments')
                        ? t('Supplier Payments (Outbound)', 'مدفوعات الموردين (سندات صرف)')
                        : t('Customer Payments & Cheques (Inbound)', 'مدفوعات العملاء والشيكات (سندات قبض)')
                    )}
                    {activeView === 'reports' && selectedReportName}
                    {activeView === 'product_categories' && t('Inventory Valuation & CoA Configuration', 'إعدادات تقييم المخزون وشجرة الحسابات')}
                    {activeView === 'lock_dates' && t('Fiscal Period Lock Dates', 'تواريخ إغلاق الفترات المحاسبية')}
                    {activeView === 'module_overview' &&
                      t(
                        MODULE_SUMMARIES[activeModule]?.titleEn || 'Module Overview',
                        MODULE_SUMMARIES[activeModule]?.titleAr || 'نظرة عامة'
                      )}
                  </h1>
                </div>
              </>
            )}
          </div>

          {/* Center: Search Bar */}
          {activeView === 'settings' ? (
            <div className="flex-1 max-w-xl mx-auto">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 focus-within:border-blue-700 focus-within:bg-white rounded-full px-3 py-1 transition">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={settingsSearchQuery}
                  onChange={(e) => setSettingsSearchQuery(e.target.value)}
                  placeholder={t('Search settings (ZATCA, Taxes, Currencies, Payments, Bank, OCR...)...', 'بحث في إعدادات المحاسبة...')}
                  className="w-full bg-transparent text-xs focus:outline-none text-slate-700"
                />
                {settingsSearchQuery && (
                  <X
                    onClick={() => setSettingsSearchQuery('')}
                    className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 max-w-xl mx-auto">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 focus-within:border-blue-700 focus-within:bg-white rounded-full px-3 py-1 transition">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {activeChips.map((chip, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full text-[11px] font-medium"
                  >
                    <Filter className="w-2.5 h-2.5 text-blue-700" />
                    <span>{chip}</span>
                    <X
                      onClick={() => setActiveChips(activeChips.filter((_, i) => i !== idx))}
                      className="w-3 h-3 cursor-pointer hover:text-rose-600"
                    />
                  </span>
                ))}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('Search invoices, proforma, journal entries, partner...', 'بحث في الفواتير، البروفرما، القيود، الشركاء...')}
                  className="w-full bg-transparent text-xs focus:outline-none text-slate-700"
                />
              </div>
            </div>
          )}

          {/* Right: Record Counter + Pager (hidden in Settings view) */}
          {activeView !== 'settings' && (
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="font-medium">
                {activeView === 'invoices'
                  ? `1-${invoices.length} / ${invoices.length}`
                  : (activeView === 'payments' ? `1-${payments.length} / ${payments.length}` : '1-25 / 25')}
              </span>
              <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-white">
                <button
                  onClick={() => setDisplayMode('list')}
                  className={`p-1.5 ${displayMode === 'list' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDisplayMode('kanban')}
                  className={`p-1.5 border-l border-slate-200 ${
                    displayMode === 'kanban' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                  title="Kanban View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
        )}

        {/* 3. SCROLLABLE WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* ===============================================================
              VIEW A: DASHBOARD (DARKER CORPORATE BLUE PALETTE)
             =============================================================== */}
          {activeView === 'dashboard' && (
            <div className="max-w-[1600px] mx-auto space-y-6">
              {/* Top Row: 5 Summary KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { labelEn: 'Invoices (Incl. Proforma)', labelAr: 'الفواتير (شامل البروفرما)', amount: 'SAR 85,482.79', sub: 'ZATCA Phase 2 Cleared', target: 'invoices' },
                  { labelEn: 'Expenses & Landed Costs', labelAr: 'المصروفات والتكاليف المضافة', amount: 'SAR 93,878.27', sub: 'Analytic Cost Centres Linked', target: 'bills' },
                  { labelEn: 'Cash & Bank (SAR/USD)', labelAr: 'النقدية والبنوك', amount: 'SAR 242,592.42', sub: 'Al Rajhi + SNB USD + Cash', target: 'reconcile' },
                  { labelEn: 'Receivable (AR)', labelAr: 'الذمم المدينة (العملاء)', amount: 'SAR 92,630.50', sub: 'Direct Invoice vs Payment Rec', target: 'invoices' },
                  { labelEn: 'Payable (AP & IC)', labelAr: 'الذمم الدائنة (الموردين)', amount: 'SAR 104,796.40', sub: 'Includes Auto-IC Bills', target: 'bills' },
                ].map((kpi, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveView(kpi.target)}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-blue-600 cursor-pointer transition"
                  >
                    <div className="text-xs font-semibold text-slate-500">{t(kpi.labelEn, kpi.labelAr)}</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">{kpi.amount}</div>
                    <div className="text-[11px] text-blue-700 font-medium mt-1">{kpi.sub}</div>
                  </div>
                ))}
              </div>

              {/* Second Row: 6 Journal Cards with Mini Charts & Action Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Card 1: Sales & Proforma Journal */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        onClick={() => setActiveView('invoices')}
                        className="font-bold text-sm text-blue-700 hover:underline cursor-pointer"
                      >
                        {t('Sales & Proforma Invoices', 'المبيعات والفواتير المبدئية (البروفرما)')}
                      </h3>
                      <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                        ZATCA Phase 2
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setInvoiceCreateType('customer');
                            setInvoiceCreateOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-2xs"
                        >
                          {t('New', 'جديد')}
                        </button>
                      </div>
                      <div className="text-xs space-y-1 text-end">
                        <div
                          onClick={() => {
                            setActiveView('invoices');
                            setSelectedInvoice(invoices[0]);
                          }}
                          className="flex items-center justify-end gap-4 cursor-pointer hover:underline"
                        >
                          <span className="text-blue-700 font-medium">1 Proforma To Confirm</span>
                          <span className="font-semibold text-slate-800">SAR 166,750.00</span>
                        </div>
                        <div
                          onClick={() => {
                            setActiveView('invoices');
                            setSelectedInvoice(null);
                          }}
                          className="flex items-center justify-end gap-4 cursor-pointer hover:underline"
                        >
                          <span className="text-blue-700 font-medium">14 Unpaid Invoices</span>
                          <span className="font-semibold text-slate-800">SAR 92,630.50</span>
                        </div>
                        <div
                          onClick={() => {
                            setActiveView('invoices');
                            setSelectedInvoice(null);
                          }}
                          className="flex items-center justify-end gap-4 cursor-pointer hover:underline"
                        >
                          <span className="text-amber-600 font-medium">8 Late</span>
                          <span className="font-semibold text-slate-800">SAR 13,299.00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mini Bar Chart */}
                  <div className="mt-6 pt-3 border-t border-slate-100">
                    <div className="h-24 flex items-end justify-between gap-1.5 px-1">
                      {[18, 28, 22, 35, 42, 30, 50, 46, 64, 58, 72, 95].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            style={{ height: `${h}%` }}
                            className={`w-full rounded-t ${i === 11 ? 'bg-blue-700' : 'bg-blue-200/80'}`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                      <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Purchases & Vendor Bills */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        onClick={() => setActiveView('bills')}
                        className="font-bold text-sm text-blue-700 hover:underline cursor-pointer"
                      >
                        {t('Purchases & Inter-Company Bills', 'المشتريات وفواتير الشركات الشقيقة')}
                      </h3>
                      <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                        Auto-IC
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveView('bills')}
                          className="px-3 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-2xs"
                        >
                          {t('Upload', 'رفع')}
                        </button>
                        <button
                          onClick={() => setActiveView('bills')}
                          className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold"
                        >
                          {t('New', 'جديد')}
                        </button>
                      </div>
                      <div className="text-xs space-y-1 text-end">
                        <div onClick={() => setActiveView('bills')} className="flex items-center justify-end gap-4 cursor-pointer hover:underline">
                          <span className="text-blue-700 font-medium">2 To Validate</span>
                          <span className="font-semibold text-slate-800">SAR 162,000.00</span>
                        </div>
                        <div onClick={() => setActiveView('bills')} className="flex items-center justify-end gap-4 cursor-pointer hover:underline">
                          <span className="text-blue-700 font-medium">7 To Pay</span>
                          <span className="font-semibold text-slate-800">SAR 104,796.40</span>
                        </div>
                        <div onClick={() => setActiveView('landed_costs')} className="flex items-center justify-end gap-4 cursor-pointer hover:underline">
                          <span className="text-blue-800 font-medium">1 Landed Cost</span>
                          <span className="font-semibold text-slate-800">SAR 14,500.00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mini Bar Chart */}
                  <div className="mt-6 pt-3 border-t border-slate-100">
                    <div className="h-24 flex items-end justify-between gap-1.5 px-1">
                      {[12, 15, 78, 25, 20, 30, 18, 24, 38, 29, 44, 62].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            style={{ height: `${h}%` }}
                            className={`w-full rounded-t ${i === 2 || i === 11 ? 'bg-blue-700' : 'bg-blue-100'}`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                      <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Bank & Direct Payment Reconciliation */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        onClick={() => setActiveView('reconcile')}
                        className="font-bold text-sm text-blue-700 hover:underline cursor-pointer"
                      >
                        {t('Al Rajhi Bank (SAR)', 'مصرف الراجحي')}
                      </h3>
                      <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                        Direct Payment Rec
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveView('reconcile')}
                          className="px-3 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-2xs"
                        >
                          {t('Transactions', 'المعاملات')}
                        </button>
                        <button
                          onClick={() => setActiveView('reconcile')}
                          className="px-3 py-1.5 rounded-md bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 text-xs font-bold"
                        >
                          {t('6 to reconcile', '6 للتسوية')}
                        </button>
                      </div>
                      <div className="text-xs space-y-1 text-end">
                        <div className="flex items-center justify-end gap-4">
                          <span className="text-blue-700">Balance</span>
                          <span className="font-bold text-slate-900">SAR 1,485,200.00</span>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                          <span className="text-blue-700">Outstanding receipts</span>
                          <span className="font-semibold text-slate-800">SAR 35,000.00</span>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                          <span className="text-blue-700">Cheques Presented</span>
                          <span className="font-semibold text-slate-800">SAR 68,000.00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Area Trend Graphic */}
                  <div className="mt-6 pt-3 border-t border-slate-100">
                    <div className="h-24 w-full bg-gradient-to-t from-blue-600/20 to-transparent rounded-b-lg border-b-2 border-blue-700 relative flex items-end p-2">
                      <span className="text-[10px] font-semibold text-blue-900">
                        +18.4% Cashflow • Multi-Currency SAR / USD / EUR
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Inventory Valuation & stock_force_date */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        onClick={() => setActiveView('journal_entries')}
                        className="font-bold text-sm text-blue-700 hover:underline cursor-pointer"
                      >
                        {t('Inventory Valuation & Force Date', 'تقييم المخزون الآلي وتاريخ القيد')}
                      </h3>
                      <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                        stock_force_date
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      {t(
                        'Product category settings drive automated Stock Input, Stock Output & Valuation journal entries.',
                        'إعدادات فئة المنتج تنشئ قيود وسيط الاستلام والمنصرف وتقييم المخزون آلياً.'
                      )}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveView('journal_entries')}
                        className="px-3 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold"
                      >
                        {t('View Stock JEs', 'قيود المخزون')}
                      </button>
                      <button
                        onClick={() => setActiveView('product_categories')}
                        className="px-3 py-1.5 rounded-md bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                      >
                        {t('Category Accounts', 'حسابات الفئات')}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                    <span className="text-slate-500">Last Auto Stock JE:</span>
                    <span className="font-mono font-bold text-blue-800">STJ/2026/10/0006 (SAR 162,000)</span>
                  </div>
                </div>

                {/* Card 5: Miscellaneous, Fixed Assets & Lock Dates */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => setActiveView('journal_entries')}
                      className="font-bold text-sm text-blue-700 hover:underline cursor-pointer mb-2"
                    >
                      {t('Miscellaneous & Fixed Asset Depreciation', 'القيود اليدوية وإهلاك الأصول الثابتة')}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      {t(
                        'Manual vouchers, monthly machinery depreciation schedules, and company-level Fiscal Lock Dates.',
                        'السندات اليدوية، جداول إهلاك الآلات الشهرية، وإغلاق الفترات المحاسبية.'
                      )}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveView('journal_entries')}
                        className="px-3 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold"
                      >
                        {t('New Manual JE', 'قيد يدوي جديد')}
                      </button>
                      <button
                        onClick={() => setActiveView('lock_dates')}
                        className="px-3 py-1.5 rounded-md bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                      >
                        {t('Lock Dates (Sep 30)', 'تاريخ الإغلاق')}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                    <span className="text-slate-500">Hard Period Lock:</span>
                    <span className="font-mono font-bold text-rose-700">2026-09-30 (Active)</span>
                  </div>
                </div>

                {/* Card 6: ZATCA Phase 2 & Proforma Onboarding Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-blue-700">
                      {t('ZATCA Phase 2 & Proforma E-Invoicing', 'الفوترة الإلكترونية (الزكاة) والبروفرما')}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t('Generate Proforma quotes or clear XML/QR Tax Invoices.', 'إصدار فواتير بروفرما مبدئية أو اعتماد الفواتير الضريبية.')}
                    </p>
                  </div>

                  <div className="my-4 grid grid-cols-2 gap-3 text-center">
                    <div
                      onClick={() => {
                        setActiveView('invoices');
                        setSelectedInvoice(invoices[0]);
                      }}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 cursor-pointer transition"
                    >
                      <FileCheck className="w-7 h-7 text-indigo-600 mx-auto mb-1" />
                      <div className="text-xs font-bold text-indigo-900">
                        {t('1. Proforma Invoice', '1. فاتورة بروفرما')}
                      </div>
                      <div className="text-[10px] text-slate-500">No GL / Pre-Tax Print</div>
                    </div>

                    <div
                      onClick={() => {
                        setActiveView('invoices');
                        setSelectedInvoice(invoices[1]);
                      }}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 cursor-pointer transition"
                    >
                      <QrCode className="w-7 h-7 text-blue-700 mx-auto mb-1" />
                      <div className="text-xs font-bold text-blue-900">
                        {t('2. ZATCA Cleared QR', '2. فاتورة ضريبية معتمدة')}
                      </div>
                      <div className="text-[10px] text-slate-500">XML + SHA256 Stamp</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              VIEW A2: CROSS-MODULE OVERVIEW (SALES, PURCHASE, INVENTORY, ETC.)
             =============================================================== */}
          {activeView === 'module_overview' && MODULE_SUMMARIES[activeModule] && (
            <div className="max-w-[1600px] mx-auto bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/60">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                    {t('ERP Module to General Ledger Link', 'ربط الوحدة بدفتر الأستاذ العام')}
                  </span>
                  <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {t(MODULE_SUMMARIES[activeModule].titleEn, MODULE_SUMMARIES[activeModule].titleAr)}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t(MODULE_SUMMARIES[activeModule].subtitleEn, MODULE_SUMMARIES[activeModule].subtitleAr)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const target = MODULE_SUMMARIES[activeModule].targetAccountingView;
                    setActiveModule('accounting');
                    setActiveView(target);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-2xs flex items-center gap-2 transition"
                >
                  <span>
                    {t(
                      MODULE_SUMMARIES[activeModule].targetButtonEn,
                      MODULE_SUMMARIES[activeModule].targetButtonAr
                    )}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-3 px-4 text-start">{t('Document #', 'رقم المستند')}</th>
                      <th className="py-3 px-4 text-start">{t('Date', 'التاريخ')}</th>
                      <th className="py-3 px-4 text-start">{t('Partner', 'الشريك')}</th>
                      <th className="py-3 px-4 text-start">{t('Operation Details', 'تفاصيل العملية')}</th>
                      <th className="py-3 px-4 text-end">{t('Amount (SAR)', 'المبلغ')}</th>
                      <th className="py-3 px-4 text-center">{t('Accounting GL Document', 'المستند المحاسبي')}</th>
                      <th className="py-3 px-4 text-center">{t('Status', 'الحالة')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MODULE_SUMMARIES[activeModule].rows.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => {
                          const target = MODULE_SUMMARIES[activeModule].targetAccountingView;
                          setActiveModule('accounting');
                          setActiveView(target);
                          if (target === 'invoices') {
                            const matched = invoices.find((inv) => inv.number === r.glRef || inv.proformaRef === r.glRef);
                            if (matched) {
                              setSelectedInvoice(matched);
                            }
                          }
                        }}
                        className="hover:bg-blue-50/40 cursor-pointer transition"
                      >
                        <td className="py-3 px-4 font-bold text-slate-900">{r.id}</td>
                        <td className="py-3 px-4 text-slate-600">{r.date}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{t(r.partnerEn, r.partnerAr)}</td>
                        <td className="py-3 px-4 text-slate-600">{r.descEn}</td>
                        <td className="py-3 px-4 text-end font-bold text-slate-900">
                          SAR {r.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                            {r.glRef}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">{renderStatusPill('Posted')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===============================================================
              VIEW B: CUSTOMERS -> INVOICES & PROFORMA (ODOO FORM VIEW OR LIST)
             =============================================================== */}
          {activeView === 'invoices' && (
            selectedInvoice ? (
              <InvoiceFormView
                invoice={selectedInvoice}
                onBack={() => setSelectedInvoice(null)}
                onSave={(saved) => {
                  setInvoices((prev) => {
                    const idx = prev.findIndex((inv) => inv.id === saved.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = saved;
                      return updated;
                    }
                    return [saved, ...prev];
                  });
                  setSelectedInvoice(saved);
                }}
                onValidate={(validated) => {
                  setInvoices((prev) =>
                    prev.map((inv) => (inv.id === validated.id ? validated : inv))
                  );
                  setSelectedInvoice(validated);
                }}
                onRegisterPayment={(inv) => {
                  setPaymentCreateDefaults({
                    type: 'receive',
                    partner: inv.customerEn,
                    amount: inv.amountDue || inv.total,
                    memo: `Payment for ${inv.number}`,
                    invoiceId: inv.id,
                  });
                  setPaymentCreateOpen(true);
                }}
                onCreateNew={() => handleCreateNewInvoice(selectedInvoice.invoiceSubtype || 'cash')}
                t={t}
                isRtl={isRtl}
                allInvoices={invoices}
                onSelectInvoice={(inv) => setSelectedInvoice(inv)}
              />
            ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-3 px-4 w-8">
                        <input type="checkbox" className="rounded border-slate-300" />
                      </th>
                      <th className="py-3 px-3 text-start">{t('Number', 'رقم المستند')}</th>
                      <th className="py-3 px-3 text-start">{t('Customer', 'العميل')}</th>
                      <th className="py-3 px-3 text-start">{t('Invoice Date', 'تاريخ الفاتورة')}</th>
                      <th className="py-3 px-3 text-start">{t('Due Date', 'تاريخ الاستحقاق')}</th>
                      <th className="py-3 px-3 text-start">{t('Force Date', 'تاريخ القيد')}</th>
                      <th className="py-3 px-3 text-end">{t('Tax Excluded', 'بدون ضريبة')}</th>
                      <th className="py-3 px-3 text-end">{t('Total', 'الإجمالي')}</th>
                      <th className="py-3 px-3 text-end">{t('Amount Due', 'المبلغ المستحق')}</th>
                      <th className="py-3 px-3 text-center">{t('ZATCA / Proforma', 'الزكاة / البروفرما')}</th>
                      <th className="py-3 px-4 text-center">{t('Status', 'الحالة')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices
                      .filter((inv) => {
                        const q = searchQuery.toLowerCase();
                        const matchesSearch =
                          !searchQuery ||
                          inv.number.toLowerCase().includes(q) ||
                          inv.customerEn.toLowerCase().includes(q) ||
                          (inv.customerAr && inv.customerAr.includes(searchQuery));
                        if (!matchesSearch) return false;

                        if (activeChips.length === 0 || activeChips.includes('All Invoices')) return true;

                        return activeChips.some((chip) => {
                          if (chip === 'Cash Invoices') return inv.invoiceSubtype === 'cash';
                          if (chip === 'Credit Invoices') return inv.invoiceSubtype === 'credit';
                          if (chip === 'Proforma Only') return inv.status === 'Proforma' || inv.invoiceSubtype === 'proforma';
                          if (chip === 'Progressive Invoices') return inv.invoiceSubtype === 'progressive';
                          if (chip === 'Credit Notes') return inv.invoiceSubtype === 'refund' || inv.number.startsWith('RINV');
                          if (chip === 'ZATCA Cleared') return inv.zatcaStatus && inv.zatcaStatus.includes('CLEARED');
                          if (chip === 'Posted') return inv.status === 'Posted' || inv.status === 'Paid' || inv.status === 'Partially Paid' || inv.status === 'Sent';
                          return true;
                        });
                      })
                      .map((inv) => (
                        <tr
                          key={inv.id}
                          onClick={() => {
                            setSelectedInvoice(inv);
                          }}
                          className="hover:bg-blue-50/40 cursor-pointer transition"
                        >
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="rounded border-slate-300" />
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{inv.number}</div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              {inv.invoiceSubtype === 'cash' && t('Cash Invoice', 'فاتورة نقدية')}
                              {inv.invoiceSubtype === 'credit' && t('Credit Invoice', 'فاتورة آجل')}
                              {inv.invoiceSubtype === 'proforma' && t('Proforma Invoice', 'فاتورة مبدئية')}
                              {inv.invoiceSubtype === 'progressive' && t('Progressive Invoice', 'فاتورة إنجاز')}
                              {inv.invoiceSubtype === 'refund' && t('Credit Note', 'إشعار دائن')}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-800">
                            {t(inv.customerEn, inv.customerAr)}
                          </td>
                          <td className="py-3 px-3 text-slate-600">{inv.invoiceDate}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`font-semibold ${
                                inv.dueDateType === 'danger'
                                  ? 'text-rose-600'
                                  : inv.dueDateType === 'warning'
                                  ? 'text-amber-600'
                                  : 'text-slate-600'
                              }`}
                            >
                              {inv.dueDateText}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-blue-700">{inv.forceDate}</td>
                          <td className="py-3 px-3 text-end text-slate-700">
                            SAR {inv.taxExcluded.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-end font-bold text-slate-900">
                            SAR {inv.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-end font-semibold text-slate-800">
                            SAR {inv.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                inv.status === 'Proforma'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {inv.zatcaStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">{renderStatusPill(inv.status)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            )
          )}

          {/* ===============================================================
              VIEW C: ACCOUNTING -> JOURNAL ENTRIES (SCREENSHOT 1/3/7 TABLE)
             =============================================================== */}
          {activeView === 'journal_entries' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="py-3 px-4 w-8">
                          <input type="checkbox" className="rounded border-slate-300" />
                        </th>
                        <th className="py-3 px-3 text-start">{t('Date', 'التاريخ')}</th>
                        <th className="py-3 px-3 text-start">{t('Force Acc. Date', 'تاريخ القيد (Force)')}</th>
                        <th className="py-3 px-3 text-start">{t('Number', 'رقم القيد')}</th>
                        <th className="py-3 px-3 text-start">{t('Partner', 'الشريك')}</th>
                        <th className="py-3 px-3 text-start">{t('Reference', 'المرجع والبيان')}</th>
                        <th className="py-3 px-3 text-start">{t('Journal', 'اليومية')}</th>
                        <th className="py-3 px-3 text-start">{t('Company', 'الشركة')}</th>
                        <th className="py-3 px-3 text-end">{t('Total', 'الإجمالي')}</th>
                        <th className="py-3 px-4 text-center">{t('Status', 'الحالة')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {JOURNAL_ENTRIES_LIST.map((je) => (
                        <tr
                          key={je.id}
                          onClick={() => setSelectedJeRecord(je)}
                          className="hover:bg-blue-50/40 cursor-pointer transition"
                        >
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="rounded border-slate-300" />
                          </td>
                          <td className="py-3 px-3 text-slate-600">{je.date}</td>
                          <td className="py-3 px-3 font-mono text-blue-700 font-semibold">{je.forceDate}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{je.number}</td>
                          <td className="py-3 px-3 font-medium text-slate-800">{je.partner}</td>
                          <td className="py-3 px-3 text-slate-600">{je.ref}</td>
                          <td className="py-3 px-3 text-slate-700">{je.journal}</td>
                          <td className="py-3 px-3 text-slate-600">{je.company}</td>
                          <td className="py-3 px-3 text-end font-bold text-slate-900">
                            SAR {je.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-center">{renderStatusPill(je.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected Journal Entry Balanced Lines Drawer */}
              {selectedJeRecord && (
                <div className="bg-white rounded-xl border-2 border-blue-700 p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-blue-700">
                        {selectedJeRecord.journal} • {selectedJeRecord.company}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {selectedJeRecord.number} — {selectedJeRecord.ref}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedJeRecord(null)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold"
                    >
                      {t('Close Lines', 'إغلاق التفاصيل')}
                    </button>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 text-start">GL Account</th>
                        <th className="py-2 px-3 text-start">Partner</th>
                        <th className="py-2 px-3 text-start">Analytic Cost Centre</th>
                        <th className="py-2 px-3 text-end">Debit (SAR)</th>
                        <th className="py-2 px-3 text-end">Credit (SAR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2 px-3 font-mono font-bold text-blue-800">
                          {selectedJeRecord.type === 'INVENTORY'
                            ? '113101 — Inventory Valuation Account'
                            : '112101 — Accounts Receivable / Asset'}
                        </td>
                        <td className="py-2 px-3">{selectedJeRecord.partner}</td>
                        <td className="py-2 px-3">CC-101 Workshop Operations</td>
                        <td className="py-2 px-3 text-end font-bold">
                          {selectedJeRecord.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 px-3 text-end">0.00</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono font-bold text-blue-800">
                          {selectedJeRecord.type === 'INVENTORY'
                            ? '113901 — Stock Interim Account (Received)'
                            : '411101 — Revenue / Payable Counter Account'}
                        </td>
                        <td className="py-2 px-3">{selectedJeRecord.partner}</td>
                        <td className="py-2 px-3">CC-101 Workshop Operations</td>
                        <td className="py-2 px-3 text-end">0.00</td>
                        <td className="py-2 px-3 text-end font-bold">
                          {selectedJeRecord.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===============================================================
              VIEW D: VENDORS DIRECTORY (EXACT SCREENSHOT 8 LAYOUT)
             =============================================================== */}
          {activeView === 'vendors' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-3 px-4 w-8">
                        <input type="checkbox" className="rounded border-slate-300" />
                      </th>
                      <th className="py-3 px-3 text-start">{t('Name', 'اسم المورد / الشريك')}</th>
                      <th className="py-3 px-3 text-start">{t('Email', 'البريد الإلكتروني')}</th>
                      <th className="py-3 px-3 text-start">{t('Phone', 'رقم الهاتف')}</th>
                      <th className="py-3 px-3 text-center">{t('Activities', 'الأنشطة')}</th>
                      <th className="py-3 px-3 text-start">{t('Country', 'الدولة')}</th>
                      <th className="py-3 px-4 text-end">{t('Linked Records', 'السجلات المرتبطة')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {VENDORS_DIRECTORY.map((v) => (
                      <tr key={v.id} className="hover:bg-blue-50/40 cursor-pointer transition">
                        <td className="py-3 px-4">
                          <input type="checkbox" className="rounded border-slate-300" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-md font-bold flex items-center justify-center text-[11px] ${v.color}`}>
                              {v.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-900">{v.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{v.email}</td>
                        <td className="py-3 px-3 text-slate-600 font-mono">{v.phone}</td>
                        <td className="py-3 px-3 text-center">
                          <Clock className="w-4 h-4 text-slate-500 mx-auto" />
                        </td>
                        <td className="py-3 px-3 text-slate-700">{v.country}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-3 text-slate-600 font-medium">
                            <span className="flex items-center gap-1" title="Activities">
                              <Edit3 className="w-3.5 h-3.5" /> {v.bills}
                            </span>
                            <span className="flex items-center gap-1" title="Priority">
                              <Star className="w-3.5 h-3.5" /> {v.rating}
                            </span>
                            <span className="flex items-center gap-1" title="Vendor Bills">
                              <FileText className="w-3.5 h-3.5 text-blue-700" /> {v.payments}
                            </span>
                            <span className="flex items-center gap-1" title="Purchase Orders">
                              <ShoppingCart className="w-3.5 h-3.5" /> {v.poCount}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===============================================================
              VIEW E: VENDOR BILLS, LANDED COSTS, RECONCILE, REPORTS & CONFIG
             =============================================================== */}
          {(activeView === 'bills' ||
            activeView === 'landed_costs' ||
            activeView === 'reconcile' ||
            activeView === 'reports' ||
            activeView === 'product_categories' ||
            activeView === 'lock_dates') && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-blue-700">
                    {t('Active Company:', 'الشركة النشطة:')} {t(activeCompanyObj.nameEn, activeCompanyObj.nameAr)}
                  </span>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {activeView === 'bills' && t('Vendor Bills, 3-Tier Approvals & Automatic Inter-Company Mirroring', 'فواتير الموردين، صلاحيات الاعتماد، والربط الآلي للشركات الشقيقة')}
                    {activeView === 'landed_costs' && t('Landed Costs (Customs/Freight on Stock Transfers) & Fixed Assets', 'التكاليف الإضافية للمخزون (الجمارك والشحن) والأصول الثابتة')}
                    {activeView === 'reconcile' && t('Direct Invoice-to-Payment Reconciliation & Cheque Lifecycle', 'تسوية الفواتير مقابل الدفعات ودورة حياة الشيكات')}
                    {activeView === 'reports' && `${selectedReportName} — ${t('Interactive Financial Statement', 'التقرير المالي التفاعلي')}`}
                    {activeView === 'product_categories' && t('Inventory-to-Accounting Product Category Accounts & Chart of Accounts', 'حسابات فئات المخزون وشجرة الحسابات')}
                    {activeView === 'lock_dates' && t('Fiscal Year & Period Lock Dates (Hard Lock vs Tax Lock)', 'تواريخ إغلاق الفترات المحاسبية والسنة المالية')}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                >
                  {t('Back to Dashboard', 'العودة للوحة التحكم')}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 text-start">Code / Ref</th>
                      <th className="py-2.5 px-4 text-start">Description / Partner / GL Account</th>
                      <th className="py-2.5 px-4 text-start">Accounting Rule / Analytic / Force Date</th>
                      <th className="py-2.5 px-4 text-end">Amount / Balance (SAR)</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-blue-800">BILL/2026/0312</td>
                      <td className="py-3 px-4 font-medium">Al Yamama Logistics & Fleet Co. (Auto Inter-Company Bill)</td>
                      <td className="py-3 px-4 text-blue-700">Mirrored from INV/2026/00005 • IC Payable 211201</td>
                      <td className="py-3 px-4 text-end font-bold">15,525.00 SAR</td>
                      <td className="py-3 px-4 text-center">{renderStatusPill('Posted')}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-blue-800">LC/2026/0018</td>
                      <td className="py-3 px-4 font-medium">Saudi Customs & Freight Allocated to Receipt WH/IN/0089</td>
                      <td className="py-3 px-4 text-blue-700">Debits Stock Valuation 113101 • stock_force_date: 2026-10-25</td>
                      <td className="py-3 px-4 text-end font-bold">14,500.00 SAR</td>
                      <td className="py-3 px-4 text-center">{renderStatusPill('Posted')}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-blue-800">CHQ/0048912</td>
                      <td className="py-3 px-4 font-medium">Al Rajhi Corporate Cheque — Dammam Steel & Chrome Shafts</td>
                      <td className="py-3 px-4 text-blue-700">Cheque Lifecycle: Issued → Presented → Cleared</td>
                      <td className="py-3 px-4 text-end font-bold">42,500.00 SAR</td>
                      <td className="py-3 px-4 text-center">{renderStatusPill('Paid')}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-blue-800">214101 — VAT 15%</td>
                      <td className="py-3 px-4 font-medium">ZATCA Output VAT 15% less Input VAT Recoverable</td>
                      <td className="py-3 px-4 text-blue-700">Net VAT Return Payable • Hard Lock Date: 2026-09-30</td>
                      <td className="py-3 px-4 text-end font-bold">86,150.00 SAR</td>
                      <td className="py-3 px-4 text-center">{renderStatusPill('Posted')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===============================================================
              VIEW G: PAYMENTS & VOUCHERS (ODOO 12 account.payment)
             =============================================================== */}
          {activeView === 'payments' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-blue-700">
                    {t('Active Company:', 'الشركة النشطة:')} {t(activeCompanyObj.nameEn, activeCompanyObj.nameAr)}
                  </span>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {activeChips.includes('Vendor Payments')
                      ? t('Supplier Payments & Outbound Vouchers', 'سندات صرف الموردين والتحويلات المصرفية')
                      : t('Customer Payments, Cheques & Inbound Vouchers', 'سندات قبض العملاء والشيكات الواردة')}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const isVendorPay = activeChips.includes('Vendor Payments');
                      setPaymentCreateDefaults({
                        type: isVendorPay ? 'send' : 'receive',
                        partner: '',
                        amount: 25000,
                        memo: '',
                        invoiceId: null,
                      });
                      setPaymentCreateOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('Register New Payment', 'تسجيل دفعة جديدة')}</span>
                  </button>
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                  >
                    {t('Back to Dashboard', 'العودة للوحة التحكم')}
                  </button>
                </div>
              </div>

              {/* Payments Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 text-start">{t('Payment Number', 'رقم الدفعة')}</th>
                      <th className="py-2.5 px-4 text-start">{t('Date', 'التاريخ')}</th>
                      <th className="py-2.5 px-4 text-start">{t('Partner', 'الشريك / المستفيد')}</th>
                      <th className="py-2.5 px-4 text-start">{t('Journal / Bank', 'دفتر اليومية / البنك')}</th>
                      <th className="py-2.5 px-4 text-start">{t('Payment Method / Ref', 'طريقة السداد / الشيك')}</th>
                      <th className="py-2.5 px-4 text-end">{t('Amount (SAR)', 'المبلغ')}</th>
                      <th className="py-2.5 px-4 text-center">{t('Status', 'الحالة')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments
                      .filter((p) => {
                        if (activeChips.includes('Vendor Payments')) return p.paymentType === 'send';
                        if (activeChips.includes('Customer Payments')) return p.paymentType === 'receive';
                        return true;
                      })
                      .map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-blue-50/40 cursor-pointer transition"
                          onClick={() => {
                            setPaymentCreateDefaults({
                              type: p.paymentType,
                              partner: p.partner,
                              amount: p.amount,
                              memo: p.memo,
                              invoiceId: null,
                            });
                            setPaymentCreateOpen(true);
                          }}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-blue-800 flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                            <span>{p.number}</span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-600">{p.date}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{p.partner}</td>
                          <td className="py-3 px-4 text-slate-600">{p.journal}</td>
                          <td className="py-3 px-4">
                            <div className="text-slate-800 font-medium">{p.paymentMethod}</div>
                            {p.chequeNo && (
                              <div className="font-mono text-[11px] text-blue-700">{p.chequeNo}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-end font-mono font-bold text-slate-900">
                            SAR {Number(p.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {renderStatusPill(p.status)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===============================================================
              VIEW F: ACCOUNTING SETTINGS (ODOO 12 res.config.settings)
             =============================================================== */}
          {activeView === 'settings' && (
            <AccountingSettingsView
              t={t}
              isRtl={isRtl}
              hideHeader={true}
              searchFilter={settingsSearchQuery}
              onSave={() => {
                alert(t('Settings saved successfully (prototype)', 'تم حفظ الإعدادات بنجاح (نموذج تجريبي)'));
                setActiveView('dashboard');
              }}
              onDiscard={() => setActiveView('dashboard')}
            />
          )}
        </main>
      </div>

      {/* =====================================================================
          MODAL 1: "CHANGE MY PREFERENCES" MODAL (EXACT MATCH TO SCREENSHOT 1)
         ===================================================================== */}
      {preferencesModalOpen && (
        <div
          onClick={() => setPreferencesModalOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-[1px] z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                {t('Change my Preferences', 'تعديل تفضيلات المستخدم')}
              </h2>
              <button
                onClick={() => setPreferencesModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs">
              {/* Top User Profile Row (Avatar + Name + Contact Info) */}
              <div className="flex flex-wrap items-start gap-6">
                <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-800 to-blue-600 text-white flex flex-col items-center justify-center shadow-md shrink-0">
                  <User className="w-12 h-12 mb-1" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Chief Accountant</span>
                </div>
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-bold text-slate-900">Tariq Al-Mansoor (Mitchell Admin)</h1>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                    <span>t.almansoor@alyamama-group.sa</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-blue-700" />
                    <span>+966 11 498 5555</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>+966 50 555 0199 (Work Mobile)</span>
                  </div>
                </div>
              </div>

              {/* Tabs Row: Preferences | Calendar | Private | Phone | Security */}
              <div className="border-b border-slate-200 flex items-center gap-1">
                {['Preferences', 'Calendar', 'Private', 'Phone', 'Security'].map((tabName) => (
                  <button
                    key={tabName}
                    onClick={() => setPrefTab(tabName)}
                    className={`px-4 py-2 font-semibold border-b-2 transition ${
                      prefTab === tabName
                        ? 'border-blue-700 text-blue-800 bg-blue-50/40'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tabName}
                  </button>
                ))}
              </div>

              {/* Two-Column Preferences Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-semibold text-slate-700">
                      {t('Language', 'اللغة')} <span className="text-blue-700">?</span>
                    </label>
                    <div className="col-span-2 flex items-center gap-2">
                      <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 bg-white font-medium"
                      >
                        <option value="en">English (US) — LTR</option>
                        <option value="ar">العربية (Arabic Saudi) — RTL</option>
                      </select>
                      <Globe className="w-4 h-4 text-blue-700 shrink-0" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-start gap-2">
                    <label className="font-semibold text-slate-700 pt-1">
                      {t('Email Signature', 'توقيع البريد')}
                    </label>
                    <textarea
                      rows={4}
                      value={emailSignature}
                      onChange={(e) => setEmailSignature(e.target.value)}
                      className="col-span-2 w-full border border-slate-300 rounded-md p-2 text-slate-700"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-semibold text-slate-700">{t('Theme', 'المظهر')}</label>
                    <div className="col-span-2 flex items-center gap-4">
                      {['System', 'Light', 'Dark'].map((opt) => (
                        <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            checked={themeMode === opt}
                            onChange={() => setThemeMode(opt)}
                            className="text-blue-700 focus:ring-blue-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-semibold text-slate-700">
                      {t('Notification', 'الإشعارات')} <span className="text-blue-700">?</span>
                    </label>
                    <div className="col-span-2 flex items-center gap-4">
                      {['By Emails', 'In ERP'].map((opt) => (
                        <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="notif"
                            checked={notifMode === opt}
                            onChange={() => setNotifMode(opt)}
                            className="text-blue-700 focus:ring-blue-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-semibold text-slate-700">{t('Default Company', 'الشركة الافتراضية')}</label>
                    <div className="col-span-2">
                      <select
                        value={primaryCompanyId}
                        onChange={(e) => setPrimaryCompanyId(e.target.value)}
                        className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 bg-white font-medium"
                      >
                        {COMPANIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-semibold text-slate-700">{t('Expertise', 'الصلاحيات')}</label>
                    <div className="col-span-2 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                        Accounting Manager ×
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                        ZATCA Admin ×
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <button
                onClick={() => setPreferencesModalOpen(false)}
                className="px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-2xs"
              >
                {t('Update Preferences', 'حفظ التفضيلات')}
              </button>
              <button
                onClick={() => setPreferencesModalOpen(false)}
                className="px-4 py-2 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold"
              >
                {t('Discard', 'إلغاء')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: INVOICE / BILL DETAILS & CREATE FORM (ODOO 12 MODEL)
         ===================================================================== */}
      <InvoiceCreateModal
        isOpen={invoiceCreateOpen}
        onClose={() => {
          setInvoiceCreateOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        type={invoiceCreateType}
        t={t}
        isRtl={isRtl}
        companies={COMPANIES}
        activeCompany={activeCompanyObj}
        onRegisterPayment={(inv) => {
          setInvoiceCreateOpen(false);
          setPaymentCreateDefaults({
            type: inv.type === 'vendor' ? 'send' : 'receive',
            partner: inv.customerEn,
            amount: inv.amountDue || inv.total,
            memo: `Payment for ${inv.number}`,
            invoiceId: inv.id,
          });
          setPaymentCreateOpen(true);
        }}
        onSave={(savedInvoice) => {
          if (selectedInvoice) {
            setInvoices(invoices.map((inv) => (inv.id === savedInvoice.id ? savedInvoice : inv)));
          } else {
            setInvoices([savedInvoice, ...invoices]);
          }
          setSelectedInvoice(null);
        }}
      />

      {/* =====================================================================
          MODAL 4: PAYMENT CREATE FORM (Odoo 12 account.payment)
         ===================================================================== */}
      <PaymentCreateModal
        isOpen={paymentCreateOpen}
        onClose={() => setPaymentCreateOpen(false)}
        defaultType={paymentCreateDefaults.type}
        defaultPartner={paymentCreateDefaults.partner}
        defaultAmount={paymentCreateDefaults.amount}
        defaultMemo={paymentCreateDefaults.memo}
        t={t}
        isRtl={isRtl}
        companies={COMPANIES}
        activeCompany={activeCompanyObj}
        onSave={(newPayment) => {
          setPayments([newPayment, ...payments]);
          if (paymentCreateDefaults.invoiceId) {
            setInvoices(
              invoices.map((inv) =>
                inv.id === paymentCreateDefaults.invoiceId
                  ? { ...inv, status: 'Paid', amountDue: 0 }
                  : inv
              )
            );
            if (selectedInvoice && selectedInvoice.id === paymentCreateDefaults.invoiceId) {
              setSelectedInvoice({ ...selectedInvoice, status: 'Paid', amountDue: 0 });
            }
          }
        }}
      />
    </div>
  );
}

