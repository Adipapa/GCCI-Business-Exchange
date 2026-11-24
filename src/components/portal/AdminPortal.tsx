import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Business, 
  CategoryItem, 
  MembershipPlan, 
  AdminStaffUser, 
  DueDiligenceChecklist, 
  SiteInspectionRecord, 
  DueDiligenceDossier, 
  PaymentRecord, 
  SourcingOpportunity 
} from '../../types';
import { 
  ShieldCheck, 
  Building2, 
  FileCheck, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Download, 
  Plus, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  Search,
  Filter,
  Check,
  Edit,
  Eye,
  Lock,
  Layers,
  ArrowRight,
  Printer,
  AlertTriangle,
  UserCheck,
  UserX,
  Award,
  MapPin,
  Compass,
  Briefcase,
  RefreshCw,
  Key,
  Shield,
  Calendar,
  ExternalLink,
  ShieldAlert,
  Sliders,
  Send,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser,
    businesses, 
    products, 
    opportunities, 
    responses, 
    dealRooms, 
    membershipPlans, 
    categories, 
    payments, 
    auditLogs, 
    adminStaff,
    reviewVerification, 
    suspendBusiness, 
    reactivateBusiness, 
    conductDueDiligence,
    applySanction,
    liftSanction,
    issueComplianceNotice,
    reconcilePayment,
    moderateOpportunity,
    updateAdminStaff,
    addAdminStaff,
    addCategory, 
    toggleCategory, 
    updateMembershipPlan,
    exportDataToCSV,
    resetToDemoSeed
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 
    'due_diligence' | 
    'verification_queue' | 
    'businesses' | 
    'opportunities' | 
    'payments' | 
    'staff_access' | 
    'categories_plans' | 
    'audit_logs'
  >('overview');

  // Notification banners
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const showSuccessBanner = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // 1. Verification Review Modal State
  const [selectedVerificationBiz, setSelectedVerificationBiz] = useState<Business | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  // 2. Due Diligence Workspace Modal State
  const [selectedDiligenceBiz, setSelectedDiligenceBiz] = useState<Business | null>(null);
  const [diligenceChecklist, setDiligenceChecklist] = useState<DueDiligenceChecklist>({
    legalRegistration: true,
    tinTaxClearance: true,
    physicalPremiseVerified: false,
    sshfcCompliance: false,
    amlSanctionsClear: true,
    uboIdentification: true,
    bankReferenceValid: false,
    qualityCertifications: false
  });
  const [siteInspection, setSiteInspection] = useState<SiteInspectionRecord>({
    inspectorName: 'Ebrima Sowe (GCCI Senior Auditor)',
    inspectionDate: new Date().toISOString().slice(0, 10),
    premiseAddress: '',
    premiseType: 'Factory / Plant',
    facilityStatus: 'Operational & Verified',
    notes: 'Physical premise visited. Machinery and staff operational.'
  });
  const [sanctionsResult, setSanctionsResult] = useState<DueDiligenceDossier['sanctionsCheckResult']>('Clear - No Sanction Matches');
  const [diligenceNotes, setDiligenceNotes] = useState('');

  // Official Certificate Preview Modal
  const [certificateBiz, setCertificateBiz] = useState<Business | null>(null);

  // 3. Business Management & Sanctions State
  const [bizSearchTerm, setBizSearchTerm] = useState('');
  const [bizSectorFilter, setBizSectorFilter] = useState('all');
  const [bizStatusFilter, setBizStatusFilter] = useState('all');
  const [sanctioningBiz, setSanctioningBiz] = useState<Business | null>(null);
  const [sanctionReasonInput, setSanctionReasonInput] = useState('');
  const [complianceNoticeBiz, setComplianceNoticeBiz] = useState<Business | null>(null);
  const [complianceNoticeInput, setComplianceNoticeInput] = useState('');

  // 4. Opportunities Moderation State
  const [oppFilter, setOppFilter] = useState<'all' | 'published' | 'under_review' | 'closed'>('all');
  const [moderatingOpp, setModeratingOpp] = useState<SourcingOpportunity | null>(null);
  const [oppNotes, setOppNotes] = useState('');

  // 5. Payment Reconciliations State
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [receiptPayment, setReceiptPayment] = useState<PaymentRecord | null>(null);

  // 6. Staff Access Management State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffDept, setNewStaffDept] = useState<AdminStaffUser['department']>('Compliance & Legal');
  const [newStaffRole, setNewStaffRole] = useState<AdminStaffUser['role']>('verification_officer');
  const [newStaffPerms, setNewStaffPerms] = useState<AdminStaffUser['permissions']>({
    canApproveVerification: true,
    canExecuteDueDiligence: true,
    canFreezeBusinesses: false,
    canModerateOpportunities: false,
    canManagePayments: false,
    canExportRegistry: true
  });

  // 7. Categories & Plans State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSector, setNewCatSector] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingPlanPrice, setEditingPlanPrice] = useState<number>(0);

  // 8. Audit Logs Filter State
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [logActionFilter, setLogActionFilter] = useState('all');

  // Computations
  const totalBusinesses = businesses.length;
  const verifiedBusinesses = businesses.filter(b => b.verificationStatus === 'verified').length;
  const pendingBusinesses = businesses.filter(b => b.verificationStatus === 'verification_pending');
  const sanctionedBusinesses = businesses.filter(b => b.isSanctioned || b.verificationStatus === 'suspended');
  const activeOpportunities = opportunities.filter(o => o.status === 'published').length;
  const reviewOpportunities = opportunities.filter(o => o.status === 'under_review').length;
  const totalDealRooms = dealRooms.length;
  const completedDealRooms = dealRooms.filter(dr => dr.status === 'completed' || dr.status === 'agreement_reached').length;
  const totalTradeValueGMD = businesses.reduce((acc, b) => acc + (b.totalDealValueGMD || 0), 0) + 
    dealRooms.reduce((acc, dr) => acc + (dr.reportedValue || 0), 0);
  const totalSubscriptionRevenueGMD = payments.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending');

  // Handlers for Verification Queue
  const handleApproveVerification = (biz: Business) => {
    reviewVerification(biz.id, 'verified', verificationNotes || 'Statutory legal incorporation and tax clearance audited and approved.');
    showSuccessBanner(`Approved GCCI Verification for ${biz.name}`);
    setSelectedVerificationBiz(null);
    setVerificationNotes('');
  };

  const handleRejectVerification = (biz: Business) => {
    reviewVerification(biz.id, 'verification_rejected', verificationNotes || 'Missing active 2026 GRA Tax Clearance or certified premise audit.');
    showSuccessBanner(`Rejected verification application for ${biz.name}`);
    setSelectedVerificationBiz(null);
    setVerificationNotes('');
  };

  // Handlers for Due Diligence Workspace
  const openDueDiligenceWorkspace = (biz: Business) => {
    setSelectedDiligenceBiz(biz);
    if (biz.dueDiligence) {
      setDiligenceChecklist({ ...biz.dueDiligence.checklist });
      if (biz.dueDiligence.siteInspection) {
        setSiteInspection({ ...biz.dueDiligence.siteInspection });
      } else {
        setSiteInspection({
          inspectorName: 'Ebrima Sowe (GCCI Senior Auditor)',
          inspectionDate: new Date().toISOString().slice(0, 10),
          premiseAddress: biz.address,
          premiseType: 'Factory / Plant',
          facilityStatus: 'Operational & Verified',
          notes: 'Premise inspected by GCCI Field Operations.'
        });
      }
      setSanctionsResult(biz.dueDiligence.sanctionsCheckResult);
      setDiligenceNotes(biz.dueDiligence.complianceNotes || '');
    } else {
      setDiligenceChecklist({
        legalRegistration: true,
        tinTaxClearance: true,
        physicalPremiseVerified: false,
        sshfcCompliance: false,
        amlSanctionsClear: true,
        uboIdentification: true,
        bankReferenceValid: false,
        qualityCertifications: false
      });
      setSiteInspection({
        inspectorName: 'Ebrima Sowe (GCCI Senior Auditor)',
        inspectionDate: new Date().toISOString().slice(0, 10),
        premiseAddress: biz.address,
        premiseType: 'Factory / Plant',
        facilityStatus: 'Operational & Verified',
        notes: 'Physical site inspection verified by GCCI Field Unit.'
      });
      setSanctionsResult('Clear - No Sanction Matches');
      setDiligenceNotes('');
    }
  };

  const handleSaveDueDiligence = () => {
    if (!selectedDiligenceBiz) return;

    conductDueDiligence(selectedDiligenceBiz.id, {
      checklist: diligenceChecklist,
      siteInspection,
      sanctionsCheckResult: sanctionsResult,
      complianceNotes: diligenceNotes
    });

    showSuccessBanner(`Due diligence dossier updated and indexed for ${selectedDiligenceBiz.name}`);
    setSelectedDiligenceBiz(null);
  };

  // Handlers for Sanctions
  const handleConfirmSanction = () => {
    if (!sanctioningBiz || !sanctionReasonInput) return;
    applySanction(sanctioningBiz.id, sanctionReasonInput);
    showSuccessBanner(`Applied trade sanction and account suspension to ${sanctioningBiz.name}`);
    setSanctioningBiz(null);
    setSanctionReasonInput('');
  };

  const handleLiftSanction = (biz: Business) => {
    liftSanction(biz.id);
    showSuccessBanner(`Reinstated clean standing for ${biz.name}`);
  };

  const handleSendComplianceNotice = () => {
    if (!complianceNoticeBiz || !complianceNoticeInput) return;
    issueComplianceNotice(complianceNoticeBiz.id, complianceNoticeInput);
    showSuccessBanner(`Dispatched formal Chamber compliance notice to ${complianceNoticeBiz.name}`);
    setComplianceNoticeBiz(null);
    setComplianceNoticeInput('');
  };

  // Handlers for Opportunities
  const handleModerateOpp = (opp: SourcingOpportunity, status: SourcingOpportunity['status']) => {
    moderateOpportunity(opp.id, status, oppNotes);
    showSuccessBanner(`Updated opportunity ${opp.id} status to ${status.toUpperCase()}`);
    setModeratingOpp(null);
    setOppNotes('');
  };

  // Handlers for Payments
  const handleReconcilePayment = (pay: PaymentRecord, status: 'completed' | 'failed') => {
    reconcilePayment(pay.id, status);
    showSuccessBanner(`Reconciled payment ${pay.invoiceNumber} as ${status.toUpperCase()}`);
  };

  // Handlers for Staff
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    addAdminStaff({
      name: newStaffName,
      email: newStaffEmail,
      department: newStaffDept,
      role: newStaffRole,
      permissions: newStaffPerms,
      status: 'active'
    });

    showSuccessBanner(`Created administrative staff profile for ${newStaffName}`);
    setShowAddStaffModal(false);
    setNewStaffName('');
    setNewStaffEmail('');
  };

  // Handlers for Categories
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    addCategory({
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      sector: newCatSector || newCatName,
      description: newCatDesc,
      iconName: 'Building',
      active: true
    });

    setNewCatName('');
    setNewCatSector('');
    setNewCatDesc('');
    showSuccessBanner(`Added new economic sector: ${newCatName}`);
  };

  const handleSavePlanPrice = (planId: string) => {
    updateMembershipPlan(planId, { priceGMD: Number(editingPlanPrice) });
    setEditingPlanId(null);
    showSuccessBanner(`Updated Dalasi fee for membership plan`);
  };

  // Filtered Businesses
  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(bizSearchTerm.toLowerCase()) ||
      b.tinNumber.toLowerCase().includes(bizSearchTerm.toLowerCase()) ||
      b.registrationNumber.toLowerCase().includes(bizSearchTerm.toLowerCase()) ||
      b.region.toLowerCase().includes(bizSearchTerm.toLowerCase());
    const matchesSector = bizSectorFilter === 'all' || b.sector.toLowerCase().includes(bizSectorFilter.toLowerCase());
    const matchesStatus = bizStatusFilter === 'all' || 
      (bizStatusFilter === 'verified' && b.verificationStatus === 'verified') ||
      (bizStatusFilter === 'pending' && b.verificationStatus === 'verification_pending') ||
      (bizStatusFilter === 'sanctioned' && (b.isSanctioned || b.verificationStatus === 'suspended'));
    return matchesSearch && matchesSector && matchesStatus;
  });

  // Filtered Opportunities
  const filteredOpportunities = opportunities.filter(o => {
    if (oppFilter === 'all') return true;
    return o.status === oppFilter;
  });

  // Filtered Payments
  const filteredPayments = payments.filter(p => {
    if (paymentFilter === 'all') return true;
    return p.status === paymentFilter;
  });

  // Filtered Logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.actorName.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(logSearchTerm.toLowerCase());
    const matchesAction = logActionFilter === 'all' || log.action.includes(logActionFilter);
    return matchesSearch && matchesAction;
  });

  return (
    <div className="gcci-portal-page gcci-admin-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Banner / Secretariat Header */}
      <div className="gcci-admin-heading bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Gambia Chamber of Commerce & Industry · Sovereign Secretariat
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
            National Business Exchange & Due Diligence Command
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Session: <strong className="text-white">{currentUser.fullName}</strong> ({currentUser.role.replace('_', ' ')}) · Kerr Jula, Bijilo Headquarters
          </p>
        </div>

        {/* Global Action & Export Strip */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportDataToCSV('businesses')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5"
            title="Download full registered enterprise registry as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Registry</span>
          </button>
          <button
            onClick={() => exportDataToCSV('payments')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5"
            title="Download Dalasi revenue ledgers"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Ledgers</span>
          </button>
          {import.meta.env.DEV && (
            <button
              onClick={() => {
                if (window.confirm('Reset this local demo to its sample data? This only affects this browser.')) resetToDemoSeed();
              }}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-medium rounded-lg border border-rose-800"
              title="Reset local development demo data"
            >
              Reset Demo Data
            </button>
          )}
        </div>
      </div>

      {/* Floating Success Banner */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-950">✕</button>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="gcci-portal-tabs flex border-b border-slate-200 px-1 text-xs font-medium text-slate-600 overflow-x-auto">
        {[
          { id: 'overview', label: 'Dashboard & Metrics' },
          { id: 'due_diligence', label: `Due Diligence & Audit (${businesses.length})` },
          { id: 'verification_queue', label: `Verification Queue (${pendingBusinesses.length})` },
          { id: 'businesses', label: `Enterprises & Sanctions (${businesses.length})` },
          { id: 'opportunities', label: `RFQ Moderation (${reviewOpportunities > 0 ? `${reviewOpportunities} New` : opportunities.length})` },
          { id: 'payments', label: `Reconciliations (${pendingPayments.length > 0 ? `${pendingPayments.length} Pending` : payments.length})` },
          { id: 'staff_access', label: `Staff & RBAC (${adminStaff.length})` },
          { id: 'categories_plans', label: 'Sectors & Plans' },
          { id: 'audit_logs', label: `Security Logs (${auditLogs.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap font-semibold transition-colors ${activeTab === tab.id ? 'border-emerald-800 text-emerald-900' : 'border-transparent hover:text-slate-900'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW & LIVE ANALYTICS
      ========================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="gcci-metric-card p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block font-medium">Registered Companies</span>
              <p className="text-2xl font-bold text-slate-900 font-mono-numbers mt-1">
                {totalBusinesses}
              </p>
              <span className="text-[11px] text-emerald-700 mt-1 block">
                {verifiedBusinesses} GCCI Certified
              </span>
            </div>

            <div className="gcci-metric-card p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block font-medium">Verification Backlog</span>
              <p className="text-2xl font-bold text-amber-700 font-mono-numbers mt-1">
                {pendingBusinesses.length}
              </p>
              <button 
                onClick={() => setActiveTab('verification_queue')}
                className="text-[11px] text-emerald-800 font-semibold hover:underline mt-1 block"
              >
                Audit Filings Queue →
              </button>
            </div>

            <div className="gcci-metric-card p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block font-medium">Commercial Trade Value</span>
              <p className="text-2xl font-bold text-emerald-800 font-mono-numbers mt-1">
                D{(totalTradeValueGMD / 1000000).toFixed(1)}M
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block font-mono-numbers">GMD recorded agreements</span>
            </div>

            <div className="gcci-metric-card p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block font-medium">Subscription Revenue</span>
              <p className="text-2xl font-bold text-slate-900 font-mono-numbers mt-1">
                D{totalSubscriptionRevenueGMD.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block font-mono-numbers">GMD reconciled in treasury</span>
            </div>
          </div>

          {/* Due Diligence Risk Distribution & Governance Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Due Diligence Standing</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Tier 3: Gold Sovereign Exporter</span>
                  <span className="font-bold font-mono-numbers text-emerald-800">
                    {businesses.filter(b => b.dueDiligence?.diligenceLevel === 'Tier 3: Gold Sovereign Exporter' || b.verificationLevel === 'Gold Certified Exporter').length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Tier 2: Enhanced Due Diligence (EDD)</span>
                  <span className="font-bold font-mono-numbers text-emerald-700">
                    {businesses.filter(b => b.dueDiligence?.diligenceLevel === 'Tier 2: Enhanced Due Diligence (EDD)').length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Tier 1: Basic Statutory Checked</span>
                  <span className="font-bold font-mono-numbers text-amber-700">
                    {businesses.filter(b => b.verificationStatus === 'verification_pending' || b.dueDiligence?.diligenceLevel === 'Tier 1: Basic Statutory').length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Sanctioned / Suspended</span>
                  <span className="font-bold font-mono-numbers text-rose-700">{sanctionedBusinesses.length}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('due_diligence')}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-center mt-2"
              >
                Open Due Diligence Command →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Treasury & Dalasi Collections</h3>
                <DollarSign className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Reconciled Payments</span>
                  <span className="font-bold font-mono-numbers text-emerald-800">
                    D{payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Pending Offline Bank Wires</span>
                  <span className="font-bold font-mono-numbers text-amber-700">
                    D{payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Active Pro / Corporate Seats</span>
                  <span className="font-bold font-mono-numbers text-slate-800">
                    {businesses.filter(b => b.membershipTier === 'corporate' || b.membershipTier === 'pro').length} accounts
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('payments')}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-lg text-center mt-2 border border-slate-200"
              >
                Review Offline Wire Transfers ({pendingPayments.length}) →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Procurement & Trade Tenders</h3>
                <Briefcase className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Published Live Tenders</span>
                  <span className="font-bold font-mono-numbers text-emerald-800">{activeOpportunities}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Pending Moderation Review</span>
                  <span className="font-bold font-mono-numbers text-amber-700">{reviewOpportunities}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Bids / Quotes Submitted</span>
                  <span className="font-bold font-mono-numbers text-slate-800">{responses.length} proposals</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Active Private Deal Rooms</span>
                  <span className="font-bold font-mono-numbers text-emerald-800">{dealRooms.length}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('opportunities')}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-lg text-center mt-2 border border-slate-200"
              >
                Moderate Tenders & RFQs →
              </button>
            </div>
          </div>

          {/* Regional & Activity Grid */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Commercial Participation by Gambian Region</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono-numbers">
              {[
                { region: 'Kanifing Municipality (KMC)', count: 4, trade: 'D128.5M' },
                { region: 'West Coast Region (Brikama)', count: 4, trade: 'D84.2M' },
                { region: 'Banjul (Port Zone)', count: 2, trade: 'D157.0M' },
                { region: 'Rural & ECOWAS Corridors', count: 2, trade: 'D41.0M' }
              ].map(r => (
                <div key={r.region} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-sans truncate">{r.region}</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">{r.count} Enterprises</p>
                  <span className="text-[11px] text-emerald-800 font-semibold mt-0.5 block">{r.trade} trade</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: DEEP DUE DILIGENCE & AUDIT COMMAND (NEW CORE FEATURE)
      ========================================================================== */}
      {activeTab === 'due_diligence' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Comprehensive Commercial Due Diligence Registry</h3>
              <p className="text-slate-500">
                8-point integrity assessment: Ministry of Justice registration, GRA tax compliance, physical site verification, AML/PEP checks, and official GCCI Due Diligence Certificate issuance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Standards:</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold text-[11px]">
                GCCI Sovereign Trade Compliance Standard 2026
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Enterprise Name</th>
                  <th className="py-3 px-4">Sector & Region</th>
                  <th className="py-3 px-4 text-center">Integrity Score</th>
                  <th className="py-3 px-4">Due Diligence Tier</th>
                  <th className="py-3 px-4">AML / PEP Clearance</th>
                  <th className="py-3 px-4">Site Inspection</th>
                  <th className="py-3 px-4 text-right">Dossier Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businesses.map(biz => {
                  const score = biz.riskScore ?? (biz.verificationStatus === 'verified' ? 90 : 65);
                  const diligence = biz.dueDiligence;
                  const tier = diligence?.diligenceLevel || (score >= 88 ? 'Tier 3: Gold Sovereign Exporter' : score >= 65 ? 'Tier 2: Enhanced Due Diligence (EDD)' : 'Tier 1: Basic Statutory');
                  const amlStatus = diligence?.sanctionsCheckResult || (biz.isSanctioned ? 'Flagged' : 'Clear - No Sanction Matches');
                  const inspectionStatus = diligence?.siteInspection?.facilityStatus || (biz.verificationStatus === 'verified' ? 'Operational & Verified' : 'Pending Site Visit');

                  return (
                    <tr key={biz.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{biz.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono-numbers">
                          TIN: {biz.tinNumber} · GCCI: {biz.gcciMemberNumber}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{biz.category}</div>
                        <div className="text-[11px] text-slate-500">{biz.region}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 font-mono-numbers">
                          <span className={`text-sm font-bold ${score >= 85 ? 'text-emerald-700' : score >= 60 ? 'text-amber-700' : 'text-rose-700'}`}>
                            {score}/100
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {score >= 85 ? 'Low Risk' : score >= 60 ? 'Moderate' : 'High Risk'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${tier.includes('Tier 3') ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : tier.includes('Tier 2') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                          {tier}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-[11px]">
                          {amlStatus.includes('Clear') ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          )}
                          <span className={amlStatus.includes('Clear') ? 'text-slate-700' : 'text-amber-800 font-medium'}>
                            {amlStatus}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-medium ${inspectionStatus.includes('Operational') ? 'text-emerald-800' : 'text-slate-500'}`}>
                          {inspectionStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openDueDiligenceWorkspace(biz)}
                            className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold"
                            title="Audit 8-point checklist and record site inspection"
                          >
                            Conduct Audit
                          </button>
                          <button
                            onClick={() => setCertificateBiz(biz)}
                            className="p-1 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
                            title="View / Print Official GCCI Due Diligence Certificate"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: VERIFICATION QUEUE (FAST-TRACK DOCUMENT AUDITS)
      ========================================================================== */}
      {activeTab === 'verification_queue' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Statutory Filing Review Queue</h3>
            <p className="text-xs text-slate-500">
              Audit submitted Certificates of Incorporation, GRA Tax Clearances, and mandatory regulatory permits (FSQA, PURA, TGSB).
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4 font-mono-numbers">TIN / Reg No.</th>
                  <th className="py-3 px-4">Uploaded Filings</th>
                  <th className="py-3 px-4">Audit Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingBusinesses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      All verification applications are audited! No pending reviews in queue.
                    </td>
                  </tr>
                ) : (
                  pendingBusinesses.map(biz => (
                    <tr key={biz.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{biz.name}</td>
                      <td className="py-3 px-4">{biz.region}</td>
                      <td className="py-3 px-4 font-mono-numbers">{biz.tinNumber}</td>
                      <td className="py-3 px-4 font-mono-numbers">
                        {biz.verificationDocs.length} statutory files
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-semibold text-[10px]">
                          Pending Review
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedVerificationBiz(biz)}
                          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg text-xs"
                        >
                          Audit Application →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ENTERPRISES & SANCTIONS GOVERNANCE
      ========================================================================== */}
      {activeTab === 'businesses' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Registered Enterprises & Governance Controls</h3>
              <p className="text-slate-500">Manage corporate profiles, suspensions, compliance notices, and trade sanctions.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-56 relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={bizSearchTerm}
                  onChange={e => setBizSearchTerm(e.target.value)}
                  placeholder="Search company or TIN..."
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                />
              </div>

              <select
                value={bizStatusFilter}
                onChange={e => setBizStatusFilter(e.target.value)}
                className="py-1.5 px-3 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
              >
                <option value="all">All Standing</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Audit Pending</option>
                <option value="sanctioned">Sanctioned / Suspended</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">Membership</th>
                  <th className="py-3 px-4">Compliance Status</th>
                  <th className="py-3 px-4">Expiry Tracking</th>
                  <th className="py-3 px-4 text-right">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBusinesses.map(biz => (
                  <tr key={biz.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{biz.name}</span>
                        {biz.isSanctioned && (
                          <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">SANCTIONED</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono-numbers">
                        Reg: {biz.registrationNumber} · {biz.region}
                      </div>
                    </td>
                    <td className="py-3 px-4">{biz.category}</td>
                    <td className="py-3 px-4 capitalize font-medium text-slate-800">
                      {biz.membershipTier} Tier
                    </td>
                    <td className="py-3 px-4">
                      {biz.isSanctioned ? (
                        <div className="text-rose-700 font-semibold text-[11px]">
                          Suspended: <span className="font-normal text-slate-500">{biz.sanctionReason}</span>
                        </div>
                      ) : biz.verificationStatus === 'verified' ? (
                        <span className="flex items-center gap-1 text-emerald-800 font-semibold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{biz.verificationLevel}</span>
                        </span>
                      ) : (
                        <span className="text-amber-800 font-medium text-[11px]">Verification Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono-numbers text-[11px]">
                      <div>Tax TCC: {biz.annualComplianceExpiry || '2026-12-31'}</div>
                      <div className="text-slate-400">Member: {biz.membershipExpiry}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setComplianceNoticeBiz(biz);
                            setComplianceNoticeInput(`Notice from GCCI Secretariat: Please ensure submission of your renewed 2026 GRA Tax Clearance and premise inspection clearance before ${biz.annualComplianceExpiry || '2026-12-31'}.`);
                          }}
                          className="px-2 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded text-xs"
                          title="Issue Chamber statutory compliance notice"
                        >
                          Send Notice
                        </button>
                        {biz.isSanctioned ? (
                          <button
                            onClick={() => handleLiftSanction(biz)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold"
                          >
                            Lift Sanction
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSanctioningBiz(biz);
                              setSanctionReasonInput('');
                            }}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-xs font-semibold"
                          >
                            Sanction / Freeze
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: SOURCING TENDERS & RFQ MODERATION
      ========================================================================== */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Commercial Sourcing & Tender Moderation</h3>
              <p className="text-slate-500">
                Audit buyer specifications, budget realism, and delivery terms before making RFQs visible across the public exchange.
              </p>
            </div>
            
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(['all', 'published', 'under_review', 'closed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setOppFilter(f)}
                  className={`px-3 py-1 rounded capitalize font-medium transition-colors ${oppFilter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Tender Title</th>
                  <th className="py-3 px-4">Buyer Organization</th>
                  <th className="py-3 px-4">Indicative Budget (GMD)</th>
                  <th className="py-3 px-4">Closing Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOpportunities.map(opp => (
                  <tr key={opp.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 line-clamp-1">{opp.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {opp.category} · Qty: {opp.quantity} {opp.unit}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{opp.buyerOrg}</div>
                      <div className="text-[11px] text-slate-400">{opp.buyerName}</div>
                    </td>
                    <td className="py-3 px-4 font-mono-numbers font-bold text-slate-900">
                      {opp.budgetMin ? `D${opp.budgetMin.toLocaleString()} - D${opp.budgetMax?.toLocaleString()}` : 'Quotation Basis'}
                    </td>
                    <td className="py-3 px-4 font-mono-numbers">{opp.closingDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${opp.status === 'published' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : opp.status === 'under_review' ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                        {opp.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {opp.status === 'under_review' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleModerateOpp(opp, 'published')}
                            className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold"
                          >
                            Approve & Publish
                          </button>
                          <button
                            onClick={() => handleModerateOpp(opp, 'closed')}
                            className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleModerateOpp(opp, opp.status === 'published' ? 'under_review' : 'published')}
                          className="text-slate-500 hover:text-slate-800 underline text-xs"
                        >
                          {opp.status === 'published' ? 'Suspend from public' : 'Re-publish'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: FINANCIAL RECONCILIATIONS & DALASI LEDGERS
      ========================================================================== */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Secretariat Treasury & Offline Reconciliations</h3>
              <p className="text-slate-500">
                Verify incoming Bank Wire Transfers (Trust Bank, Ecobank), QMoney, Afrimoney, and cash deposits made at GCCI Kerr Jula Secretariat.
              </p>
            </div>
            
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(['all', 'pending', 'completed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setPaymentFilter(f)}
                  className={`px-3 py-1 rounded capitalize font-medium transition-colors ${paymentFilter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {f} ({payments.filter(p => f === 'all' ? true : p.status === f).length})
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Invoice / Ref</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Membership Plan</th>
                  <th className="py-3 px-4 font-mono-numbers">Amount (GMD)</th>
                  <th className="py-3 px-4">Payment Channel</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-numbers">
                {filteredPayments.map(pay => (
                  <tr key={pay.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{pay.invoiceNumber}</div>
                      <div className="text-[11px] text-slate-400">{pay.reference}</div>
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-800">
                      {pay.businessName}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-700">
                      {pay.planName}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-900">
                      D{pay.amount.toLocaleString()} {pay.currency}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-600 text-[11px]">
                      {pay.paymentMethod}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${pay.status === 'completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-100 text-amber-900 font-bold'}`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        {pay.status === 'pending' ? (
                          <button
                            onClick={() => handleReconcilePayment(pay, 'completed')}
                            className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold"
                          >
                            Reconcile & Clear
                          </button>
                        ) : (
                          <button
                            onClick={() => setReceiptPayment(pay)}
                            className="p-1 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded"
                            title="View official GCCI Dalasi receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: SECRETARIAT STAFF & RBAC ACCESS CONTROL MATRIX
      ========================================================================== */}
      {activeTab === 'staff_access' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-base">GCCI Secretariat Role-Based Access Control (RBAC)</h3>
              <p className="text-slate-500">
                Control officer permissions for verification sign-off, due diligence audit execution, business sanctions, tender moderation, and financial ledgers.
              </p>
            </div>
            
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Secretariat Officer</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Officer Name & Email</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4 text-center">Verify Filings</th>
                  <th className="py-3 px-4 text-center">Due Diligence</th>
                  <th className="py-3 px-4 text-center">Sanctions</th>
                  <th className="py-3 px-4 text-center">Moderate RFPs</th>
                  <th className="py-3 px-4 text-center">Treasury</th>
                  <th className="py-3 px-4 text-right">Switch Test Persona</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminStaff.map(staff => (
                  <tr key={staff.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{staff.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono-numbers">{staff.email}</div>
                    </td>
                    <td className="py-3 px-4">{staff.department}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[11px] capitalize">
                        {staff.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={staff.permissions.canApproveVerification}
                        onChange={e => updateAdminStaff(staff.id, {
                          permissions: { ...staff.permissions, canApproveVerification: e.target.checked }
                        })}
                        className="rounded text-emerald-700 focus:ring-emerald-700"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={staff.permissions.canExecuteDueDiligence}
                        onChange={e => updateAdminStaff(staff.id, {
                          permissions: { ...staff.permissions, canExecuteDueDiligence: e.target.checked }
                        })}
                        className="rounded text-emerald-700 focus:ring-emerald-700"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={staff.permissions.canFreezeBusinesses}
                        onChange={e => updateAdminStaff(staff.id, {
                          permissions: { ...staff.permissions, canFreezeBusinesses: e.target.checked }
                        })}
                        className="rounded text-emerald-700 focus:ring-emerald-700"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={staff.permissions.canModerateOpportunities}
                        onChange={e => updateAdminStaff(staff.id, {
                          permissions: { ...staff.permissions, canModerateOpportunities: e.target.checked }
                        })}
                        className="rounded text-emerald-700 focus:ring-emerald-700"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={staff.permissions.canManagePayments}
                        onChange={e => updateAdminStaff(staff.id, {
                          permissions: { ...staff.permissions, canManagePayments: e.target.checked }
                        })}
                        className="rounded text-emerald-700 focus:ring-emerald-700"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setCurrentUser({
                            id: staff.id,
                            email: staff.email,
                            fullName: staff.name,
                            role: staff.role as any,
                            organization: 'Gambia Chamber of Commerce & Industry (GCCI)'
                          });
                          showSuccessBanner(`Switched active user session to ${staff.name} (${staff.role.replace('_', ' ')})`);
                        }}
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium"
                      >
                        Act as {staff.name.split(' ')[0]}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 8: SECTORS, CATEGORIES & MEMBERSHIP PLANS
      ========================================================================== */}
      {activeTab === 'categories_plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Categories Management */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Economic Sectors & Categories</h3>
              <p className="text-slate-500">Configure business directory taxonomies.</p>
            </div>

            <form onSubmit={handleAddCategory} className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
              <h4 className="font-semibold text-slate-900">Add New Category</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder="Category Name (e.g. Mining & Minerals)"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={newCatSector}
                  onChange={e => setNewCatSector(e.target.value)}
                  placeholder="Sector (e.g. Extractive Industries)"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <textarea
                rows={2}
                value={newCatDesc}
                onChange={e => setNewCatDesc(e.target.value)}
                placeholder="Description of economic scope..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-800 text-white font-semibold rounded-lg text-xs"
              >
                Add Category
              </button>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
              {categories.map(cat => (
                <div key={cat.id} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{cat.name}</p>
                    <p className="text-[11px] text-slate-400">{cat.sector} · {cat.itemCount} items</p>
                  </div>
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-2 py-1 text-xs rounded font-medium ${cat.active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {cat.active ? 'Active' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Membership Plans Management */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Chamber Membership Tiers & Pricing</h3>
              <p className="text-slate-500">Configure annual statutory membership fees in Gambian Dalasi (GMD).</p>
            </div>

            <div className="space-y-3">
              {membershipPlans.map(plan => (
                <div key={plan.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{plan.name}</h4>
                      <span className="text-[11px] text-slate-400 capitalize">{plan.tier} tier · Max {plan.maxListings} listings</span>
                    </div>

                    {editingPlanId === plan.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editingPlanPrice}
                          onChange={e => setEditingPlanPrice(Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-slate-300 rounded text-xs font-mono-numbers"
                        />
                        <button
                          onClick={() => handleSavePlanPrice(plan.id)}
                          className="px-2.5 py-1 bg-emerald-800 text-white rounded font-semibold text-xs"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-emerald-900 font-mono-numbers text-sm">
                          D{plan.priceGMD.toLocaleString()} GMD/yr
                        </span>
                        <button
                          onClick={() => {
                            setEditingPlanId(plan.id);
                            setEditingPlanPrice(plan.priceGMD);
                          }}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-600 text-xs">{plan.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: FORENSIC AUDIT TRAILS & SECURITY LOGS
      ========================================================================== */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Immutable Security & Governance Audit Trail</h3>
              <p className="text-slate-500">Every administrative verification, sanction, and due diligence event is timestamped.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={logSearchTerm}
                onChange={e => setLogSearchTerm(e.target.value)}
                placeholder="Search audit trail..."
                className="w-56 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Auditor / Actor</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-numbers">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 font-sans">{log.action}</td>
                    <td className="py-2.5 px-4 font-sans text-slate-800">
                      {log.actorName} ({log.actorRole.replace('_', ' ')})
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">{log.targetType} #{log.targetId}</td>
                    <td className="py-2.5 px-4 font-sans text-slate-700 max-w-md truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: INTERACTIVE DUE DILIGENCE WORKSPACE
      ========================================================================== */}
      {selectedDiligenceBiz && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs space-y-6">
            <button
              onClick={() => setSelectedDiligenceBiz(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>

            {/* Header */}
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Gambia Chamber of Commerce & Industry · Statutory Due Diligence Audit
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Due Diligence Workspace: {selectedDiligenceBiz.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-slate-500 mt-1 text-[11px] font-mono-numbers">
                <span>TIN: {selectedDiligenceBiz.tinNumber}</span>
                <span aria-hidden="true">·</span>
                <span>Reg: {selectedDiligenceBiz.registrationNumber}</span>
                <span aria-hidden="true">·</span>
                <span>Member: {selectedDiligenceBiz.gcciMemberNumber}</span>
                <span aria-hidden="true">·</span>
                <span>Region: {selectedDiligenceBiz.region}</span>
              </div>
            </div>

            {/* 8-Point Compliance Checklist with Auto Score Calculation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                  1. Statutory 8-Point Compliance Verification
                </h4>
                {(() => {
                  const passed = Object.values(diligenceChecklist).filter(Boolean).length;
                  const currentScore = Math.round((passed / 8) * 100);
                  return (
                    <span className="font-mono-numbers font-bold text-sm text-emerald-800">
                      Score: {currentScore}/100 ({passed}/8 Checks Passed)
                    </span>
                  );
                })()}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'legalRegistration', label: 'Ministry of Justice Certificate of Incorporation & Annual Returns' },
                  { key: 'tinTaxClearance', label: 'Gambia Revenue Authority (GRA) 2026 Tax Clearance Certificate' },
                  { key: 'physicalPremiseVerified', label: 'GCCI Field Officer Physical Site Visit & Geolocation Verified' },
                  { key: 'sshfcCompliance', label: 'Social Security & Housing Finance Corp (SSHFC) Employer Standing' },
                  { key: 'amlSanctionsClear', label: 'Financial Intelligence Unit (FIU) & ECOWAS PEP / Sanctions Screened' },
                  { key: 'uboIdentification', label: 'Ultimate Beneficial Ownership (UBO) & Board Directors Verified' },
                  { key: 'bankReferenceValid', label: 'Commercial Bank Solvency Reference Letter (Trust Bank / Ecobank)' },
                  { key: 'qualityCertifications', label: 'Regulatory Standards Clearance (FSQA / PURA / TGSB / ISO)' }
                ].map(item => (
                  <label key={item.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={(diligenceChecklist as any)[item.key]}
                      onChange={e => setDiligenceChecklist({ ...diligenceChecklist, [item.key]: e.target.checked })}
                      className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-800"
                    />
                    <span className="text-slate-800 text-[11px] font-medium leading-relaxed">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Field Officer Physical Site Inspection Log */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                2. GCCI Field Officer Physical Site Inspection Record
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Inspecting Officer</label>
                  <input
                    type="text"
                    value={siteInspection.inspectorName}
                    onChange={e => setSiteInspection({ ...siteInspection, inspectorName: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Inspection Date</label>
                  <input
                    type="date"
                    value={siteInspection.inspectionDate}
                    onChange={e => setSiteInspection({ ...siteInspection, inspectionDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Facility Category</label>
                  <select
                    value={siteInspection.premiseType}
                    onChange={e => setSiteInspection({ ...siteInspection, premiseType: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Factory / Plant">Factory / Plant</option>
                    <option value="Warehouse / Logistics Depot">Warehouse / Logistics Depot</option>
                    <option value="Corporate Office">Corporate Office</option>
                    <option value="Commercial Farm">Commercial Farm</option>
                    <option value="Retail Facility">Retail Facility</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Premise Physical Address</label>
                  <input
                    type="text"
                    value={siteInspection.premiseAddress || selectedDiligenceBiz.address}
                    onChange={e => setSiteInspection({ ...siteInspection, premiseAddress: e.target.value })}
                    placeholder="e.g. Plot 14, Kanifing Industrial Estate"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Operational Standing</label>
                  <select
                    value={siteInspection.facilityStatus}
                    onChange={e => setSiteInspection({ ...siteInspection, facilityStatus: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-emerald-900"
                  >
                    <option value="Operational & Verified">Operational & Verified</option>
                    <option value="Conditional Approval">Conditional Approval</option>
                    <option value="Discrepancy Noted">Discrepancy Noted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Field Findings & Capacity Notes</label>
                <textarea
                  rows={2}
                  value={siteInspection.notes}
                  onChange={e => setSiteInspection({ ...siteInspection, notes: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  placeholder="Record operational capacity, equipment serial checks, or workforce observations..."
                />
              </div>
            </div>

            {/* AML / PEP Screening & Auditor Findings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-900 mb-1">
                  3. AML / PEP & Sanctions Screening Status
                </label>
                <select
                  value={sanctionsResult}
                  onChange={e => setSanctionsResult(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800"
                >
                  <option value="Clear - No Sanction Matches">Clear - No Sanction Matches (FIU Compliant)</option>
                  <option value="Pending FIU Review">Pending FIU Review (Enhanced Check)</option>
                  <option value="Flagged">Flagged - High Risk Entity</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-1">
                  Official Auditor Sign-off Notes
                </label>
                <textarea
                  rows={2}
                  value={diligenceNotes}
                  onChange={e => setDiligenceNotes(e.target.value)}
                  placeholder="Summarize compliance findings for the official GCCI dossier..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setCertificateBiz(selectedDiligenceBiz);
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center gap-1.5 text-xs"
              >
                <Award className="w-4 h-4 text-emerald-800" />
                <span>Preview GCCI Certificate</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDiligenceBiz(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDueDiligence}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shadow-xs text-xs"
                >
                  Save & Index Due Diligence Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: OFFICIAL GCCI DUE DILIGENCE CERTIFICATE PREVIEW
      ========================================================================== */}
      {certificateBiz && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border-4 border-emerald-900/20 text-slate-800 space-y-6">
            <button
              onClick={() => setCertificateBiz(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>

            {/* Chamber Crest Header */}
            <div className="text-center space-y-2 border-b-2 border-emerald-900/20 pb-5">
              <img
                src="/assets/aistudio/GcciLogo_f68a2d53.png"
                alt="GCCI Seal"
                className="w-16 h-16 object-contain mx-auto"
              />
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  THE REPUBLIC OF THE GAMBIA
                </p>
                <h2 className="text-xl font-extrabold text-emerald-950 uppercase tracking-wide">
                  Gambia Chamber of Commerce & Industry
                </h2>
                <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                  Official Statutory Due Diligence & Commercial Integrity Certificate
                </p>
              </div>
              <p className="text-[10px] text-slate-400 font-mono-numbers">
                Dossier Ref: {certificateBiz.dueDiligence?.dossierReference || `GCCI-DD-2026-${Math.floor(1000 + Math.random() * 9000)}`}
              </p>
            </div>

            {/* Certificate Statement */}
            <div className="text-center space-y-3 py-2">
              <p className="text-xs text-slate-600 italic">This is to officially certify that</p>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {certificateBiz.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono-numbers">
                TIN: <strong>{certificateBiz.tinNumber}</strong> · Reg No: <strong>{certificateBiz.registrationNumber}</strong> · GCCI: <strong>{certificateBiz.gcciMemberNumber}</strong>
              </p>
              <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed">
                Has successfully satisfied the comprehensive statutory verification and due diligence standards established under the GCCI Trade Secretariat, including GRA corporate tax clearance, physical premise confirmation in {certificateBiz.region}, and AML/PEP sanctions compliance.
              </p>
            </div>

            {/* Badges / Rating Strip */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 grid grid-cols-3 gap-3 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Integrity Score</span>
                <span className="font-bold text-emerald-950 text-base font-mono-numbers">
                  {certificateBiz.riskScore || 94}/100
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Certification Level</span>
                <span className="font-bold text-emerald-800 text-xs block truncate">
                  {certificateBiz.verificationLevel}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Validity Period</span>
                <span className="font-bold text-slate-800 text-xs font-mono-numbers block">
                  Until 2027-04-01
                </span>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">Ebrima Sowe</p>
                <p className="text-[11px] text-slate-500">Chief Compliance Auditor, GCCI</p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full border-2 border-emerald-800 border-dashed flex items-center justify-center text-[10px] text-emerald-900 font-bold uppercase mx-auto">
                  SEAL
                </div>
                <span className="text-[9px] text-slate-400 font-mono-numbers mt-0.5 block">Official Secretariat</span>
              </div>

              <div className="text-right">
                <p className="font-bold text-slate-900">Alieu Secka</p>
                <p className="text-[11px] text-slate-500">Secretary General & CEO, GCCI</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCertificateBiz(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: STATUTORY FILING REVIEW (FAST-TRACK)
      ========================================================================== */}
      {selectedVerificationBiz && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs space-y-4">
            <button
              onClick={() => setSelectedVerificationBiz(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>

            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                GCCI Statutory Document Audit
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Audit Filings: {selectedVerificationBiz.name}
              </h3>
              <p className="text-slate-500 mt-0.5">
                TIN: {selectedVerificationBiz.tinNumber} · Registered: {selectedVerificationBiz.registrationNumber}
              </p>
            </div>

            {/* Submitted documents viewer */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-semibold text-slate-900">
                Submitted Statutory Filings ({selectedVerificationBiz.verificationDocs.length})
              </h4>
              {selectedVerificationBiz.verificationDocs.length === 0 ? (
                <p className="text-slate-400">No documents attached.</p>
              ) : (
                selectedVerificationBiz.verificationDocs.map(doc => (
                  <div key={doc.id} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <div>
                        <p className="font-semibold text-slate-800">{doc.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono-numbers">{doc.fileName} · {doc.fileSize}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono-numbers">
                      Valid 2026 Filing
                    </span>
                  </div>
                ))
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Official Audit Notes & Decision Rationale
              </label>
              <textarea
                rows={3}
                value={verificationNotes}
                onChange={e => setVerificationNotes(e.target.value)}
                placeholder="Record verification checklist confirmation, GRA tax status validity, or reasons if documents are deficient..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleRejectVerification(selectedVerificationBiz)}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-xs"
              >
                Reject Application
              </button>
              <button
                type="button"
                onClick={() => handleApproveVerification(selectedVerificationBiz)}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shadow-xs text-xs"
              >
                Approve GCCI Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: SANCTION & SUSPENSION DIALOG
      ========================================================================== */}
      {sanctioningBiz && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 text-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Apply Chamber Trade Sanctions</span>
            </div>

            <p className="text-slate-600">
              You are about to freeze commercial activities and revoke public directory visibility for <strong>{sanctioningBiz.name}</strong>.
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Statutory Regulatory Reason *
              </label>
              <textarea
                rows={3}
                required
                value={sanctionReasonInput}
                onChange={e => setSanctionReasonInput(e.target.value)}
                placeholder="Specify violation (e.g. Failed GRA Tax Clearance audit, fraudulent bills of lading, breach of arbitration)..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSanctioningBiz(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSanction}
                disabled={!sanctionReasonInput}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded font-bold"
              >
                Confirm Sanction & Freeze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: DISPATCH COMPLIANCE NOTICE
      ========================================================================== */}
      {complianceNoticeBiz && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Send className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>Dispatch Statutory Compliance Notice</span>
            </div>

            <p className="text-slate-600">
              Send an official compliance reminder to <strong>{complianceNoticeBiz.name}</strong> ({complianceNoticeBiz.email}).
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notice Content</label>
              <textarea
                rows={4}
                value={complianceNoticeInput}
                onChange={e => setComplianceNoticeInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setComplianceNoticeBiz(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSendComplianceNotice}
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold"
              >
                Send Formal Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 6: ADD SECRETARIAT OFFICER
      ========================================================================== */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <button
              onClick={() => setShowAddStaffModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              ✕
            </button>

            <h3 className="font-bold text-slate-900 text-base">Add GCCI Secretariat Officer</h3>

            <form onSubmit={handleCreateStaff} className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1">Full Officer Name</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  placeholder="e.g. Fatoumatta Bah"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Official GCCI Email</label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={e => setNewStaffEmail(e.target.value)}
                  placeholder="fbah@gcci.gm"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1">Department</label>
                  <select
                    value={newStaffDept}
                    onChange={e => setNewStaffDept(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Compliance & Legal">Compliance & Legal</option>
                    <option value="Trade Development & Sourcing">Trade Development</option>
                    <option value="Member Services">Member Services</option>
                    <option value="Finance & Treasury">Finance & Treasury</option>
                    <option value="Executive Secretariat">Executive Secretariat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">System Role</label>
                  <select
                    value={newStaffRole}
                    onChange={e => setNewStaffRole(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="verification_officer">Verification Officer</option>
                    <option value="gcci_admin">GCCI Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              {/* Permissions Checklist */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="font-semibold text-slate-800 block text-[11px]">Assigned Privileges:</span>
                <label className="flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={newStaffPerms.canApproveVerification}
                    onChange={e => setNewStaffPerms({ ...newStaffPerms, canApproveVerification: e.target.checked })}
                    className="rounded text-emerald-800"
                  />
                  <span>Can Approve / Reject Statutory Filings</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={newStaffPerms.canExecuteDueDiligence}
                    onChange={e => setNewStaffPerms({ ...newStaffPerms, canExecuteDueDiligence: e.target.checked })}
                    className="rounded text-emerald-800"
                  />
                  <span>Can Conduct Comprehensive Due Diligence Audits</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={newStaffPerms.canFreezeBusinesses}
                    onChange={e => setNewStaffPerms({ ...newStaffPerms, canFreezeBusinesses: e.target.checked })}
                    className="rounded text-emerald-800"
                  />
                  <span>Can Freeze Accounts & Apply Sanctions</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={newStaffPerms.canManagePayments}
                    onChange={e => setNewStaffPerms({ ...newStaffPerms, canManagePayments: e.target.checked })}
                    className="rounded text-emerald-800"
                  />
                  <span>Can Reconcile Dalasi Offline Treasury Wires</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold"
                >
                  Create Officer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 7: OFFICIAL GCCI DALASI PAYMENT RECEIPT PREVIEW
      ========================================================================== */}
      {receiptPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 text-xs space-y-4">
            <button
              onClick={() => setReceiptPayment(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              ✕
            </button>

            <div className="text-center pb-3 border-b border-slate-200">
              <img
                src="/assets/aistudio/GcciLogo_f68a2d53.png"
                alt="GCCI Logo"
                className="w-12 h-12 object-contain mx-auto mb-1"
              />
              <p className="font-extrabold text-sm text-emerald-950 uppercase">Gambia Chamber of Commerce & Industry</p>
              <p className="text-[11px] text-slate-500 font-mono-numbers">Official Treasury Receipt · Kerr Jula, Bijilo</p>
            </div>

            <div className="space-y-2 font-mono-numbers text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Receipt Ref:</span>
                <span className="font-bold text-slate-900">{receiptPayment.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-bold text-slate-900">{receiptPayment.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payer Business:</span>
                <span className="font-bold text-slate-900 font-sans">{receiptPayment.businessName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Service / Plan:</span>
                <span className="font-bold text-slate-900 font-sans">{receiptPayment.planName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Channel:</span>
                <span className="font-bold text-slate-900 font-sans">{receiptPayment.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span className="font-bold text-slate-800">Total Cleared (GMD):</span>
                <span className="font-extrabold text-emerald-900">
                  D{receiptPayment.amount.toLocaleString()} GMD
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-800 text-center font-bold text-[11px]">
              STATUS: CLEARED & RECONCILED IN CHAMBER GENERAL LEDGER
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReceiptPayment(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-medium"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-emerald-800 text-white rounded font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
