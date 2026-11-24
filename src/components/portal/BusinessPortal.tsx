import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, ProductService, DealRoom } from '../../types';
import { DealRoomWorkspace } from './DealRoomWorkspace';
import { 
  Building2, 
  ShieldCheck, 
  Package, 
  Briefcase, 
  MessageSquare, 
  Award, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  FileText
} from 'lucide-react';

interface BusinessPortalProps {
  setActiveTab?: (tab: string) => void;
}

export const BusinessPortal: React.FC<BusinessPortalProps> = ({ setActiveTab }) => {
  const { 
    currentUser, 
    businesses, 
    products, 
    opportunities, 
    responses, 
    dealRooms, 
    updateBusiness, 
    submitVerificationDoc, 
    createProduct, 
    deleteProduct 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'profile' | 'verification' | 'products' | 'responses' | 'dealrooms' | 'employees'>('dashboard');
  const [activeDealRoomId, setActiveDealRoomId] = useState<string | null>(null);

  // Current company
  const business = businesses.find(b => b.ownerId === currentUser.id || b.id === currentUser.businessId) || businesses[0];

  // Business profile form state
  const [profileForm, setProfileForm] = useState({
    name: business?.name || '',
    tradingName: business?.tradingName || '',
    registrationNumber: business?.registrationNumber || '',
    tinNumber: business?.tinNumber || '',
    gcciMemberNumber: business?.gcciMemberNumber || '',
    legalStructure: business?.legalStructure || 'Private Limited Company (Ltd)',
    sector: business?.sector || 'Agribusiness & Food Processing',
    category: business?.category || 'Agribusiness & Food Processing',
    description: business?.description || '',
    yearEstablished: business?.yearEstablished || 2020,
    employeesCount: business?.employeesCount || 10,
    phone: business?.phone || '',
    email: business?.email || '',
    address: business?.address || '',
    region: business?.region || 'Kanifing Municipality (KMC)',
    capabilities: business?.capabilities.join(', ') || '',
    certifications: business?.certifications.join(', ') || ''
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // New product listing state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdType, setNewProdType] = useState<'product' | 'service'>('product');
  const [newProdCategory, setNewProdCategory] = useState(business?.category || 'Agribusiness & Food Processing');
  const [newProdPrice, setNewProdPrice] = useState<number>(1000);
  const [newProdMOQ, setNewProdMOQ] = useState('');
  const [newProdLeadTime, setNewProdLeadTime] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Document upload state
  const [docUploadTitle, setDocUploadTitle] = useState('');
  const [docUploadType, setDocUploadType] = useState<'incorporation' | 'tax_clearance' | 'gcci_certificate' | 'license'>('tax_clearance');
  const [docUploadFileName, setDocUploadFileName] = useState('');
  const [docUploadedSuccess, setDocUploadedSuccess] = useState(false);

  // Employees mock sub-accounts
  const [employees, setEmployees] = useState([
    { id: 'emp-1', name: 'Lamin Sanyang', email: 'lsanyang@company.gm', role: 'Sales & Export Manager', canProducts: true, canDealRooms: true, canProfile: false },
    { id: 'emp-2', name: 'Awa Ceesay', email: 'aceesay@company.gm', role: 'Operations Officer', canProducts: true, canDealRooms: false, canProfile: false }
  ]);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');

  const myProducts = products.filter(p => p.businessId === business?.id);
  const myResponses = responses.filter(r => r.supplierId === business?.id || r.supplierName === business?.name);
  const myDealRooms = dealRooms.filter(dr => dr.participants.some(p => p.userId === currentUser.id || p.businessName === business?.name));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    updateBusiness(business.id, {
      ...profileForm,
      capabilities: profileForm.capabilities.split(',').map(s => s.trim()).filter(Boolean),
      certifications: profileForm.certifications.split(',').map(s => s.trim()).filter(Boolean)
    });

    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !newProdTitle) return;

    createProduct({
      businessId: business.id,
      businessName: business.name,
      businessRegion: business.region,
      businessVerified: business.verificationStatus === 'verified',
      type: newProdType,
      title: newProdTitle,
      category: newProdCategory,
      description: newProdDesc,
      imageUrl: '/src/assets/images/gambia_agribusiness_export_1792068732551.jpg',
      price: Number(newProdPrice),
      currency: 'GMD',
      priceType: 'fixed',
      moq: newProdMOQ || '1 Unit',
      leadTime: newProdLeadTime || '3-5 business days',
      location: business.address,
      availability: 'in_stock',
      status: 'published',
      specifications: {
        'Origin': 'The Gambia',
        'Standard': 'GCCI Verified Exporter'
      }
    });

    setShowAddProductModal(false);
    setNewProdTitle('');
    setNewProdDesc('');
    setNewProdPrice(1000);
    setNewProdMOQ('');
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !docUploadTitle) return;

    submitVerificationDoc(business.id, {
      title: docUploadTitle,
      type: docUploadType,
      fileName: docUploadFileName || `${docUploadTitle.replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.9 MB'
    });

    setDocUploadedSuccess(true);
    setDocUploadTitle('');
    setDocUploadFileName('');
    setTimeout(() => setDocUploadedSuccess(false), 2000);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail) return;

    setEmployees(prev => [
      ...prev,
      {
        id: `emp-${Date.now()}`,
        name: newEmpName,
        email: newEmpEmail,
        role: newEmpRole || 'Commercial Representative',
        canProducts: true,
        canDealRooms: true,
        canProfile: false
      }
    ]);

    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpRole('');
  };

  if (activeDealRoomId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DealRoomWorkspace
          dealRoomId={activeDealRoomId}
          onBack={() => setActiveDealRoomId(null)}
        />
      </div>
    );
  }

  return (
    <div className="gcci-portal-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Banner Header */}
      <div className="gcci-portal-heading bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl border border-slate-700 shrink-0">
            {business?.tradingName?.slice(0, 2).toUpperCase() || 'GC'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {business?.name}
              </h1>
              {business?.verificationStatus === 'verified' && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>GCCI Gold</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Member ID: <strong className="text-slate-800 font-mono-numbers">{business?.gcciMemberNumber}</strong> · Tier: <span className="capitalize font-medium text-emerald-800">{business?.membershipTier}</span> · Region: {business?.region}
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveSubTab('products')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Manage Catalog ({myProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('verification')}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verification Status</span>
          </button>
        </div>
      </div>

      {/* Sub navigation bar */}
      <div className="gcci-portal-tabs flex border-b border-slate-200 px-1 text-xs font-medium text-slate-600 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard & Metrics' },
          { id: 'profile', label: 'Company Profile' },
          { id: 'verification', label: 'Statutory Verification' },
          { id: 'products', label: `Products & Services (${myProducts.length})` },
          { id: 'responses', label: `My Submitted Bids (${myResponses.length})` },
          { id: 'dealrooms', label: `Deal Rooms (${myDealRooms.length})` },
          { id: 'employees', label: 'Team & RBAC' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`py-3 px-4 border-b-2 whitespace-nowrap font-semibold transition-colors ${activeSubTab === tab.id ? 'border-emerald-800 text-emerald-900' : 'border-transparent hover:text-slate-900'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. DASHBOARD VIEW */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="gcci-metric-card p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block">Catalog Listings</span>
              <p className="text-2xl font-bold text-slate-900 font-mono-numbers mt-1">
                {myProducts.length} <span className="text-xs font-normal text-slate-500">Active</span>
              </p>
              <span className="text-[11px] text-emerald-700 mt-1 block">Live in marketplace</span>
            </div>

            <div className="gcci-metric-card p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block">Tenders Quoted</span>
              <p className="text-2xl font-bold text-slate-900 font-mono-numbers mt-1">
                {myResponses.length} <span className="text-xs font-normal text-slate-500">RFQs</span>
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Across Gambian buyers</span>
            </div>

            <div className="gcci-metric-card p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block">Active Deal Rooms</span>
              <p className="text-2xl font-bold text-emerald-800 font-mono-numbers mt-1">
                {myDealRooms.length} <span className="text-xs font-normal text-slate-500">Rooms</span>
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Encrypted negotiations</span>
            </div>

            <div className="gcci-metric-card p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block">Facilitated Trade Value</span>
              <p className="text-2xl font-bold text-emerald-800 font-mono-numbers mt-1">
                D{((business?.totalDealValueGMD || 0) / 1000000).toFixed(1)}M
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block font-mono-numbers">GMD recorded deals</span>
            </div>
          </div>

          {/* Verification Status Banner if pending */}
          {business?.verificationStatus !== 'verified' && (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">GCCI Verification Audit In Progress</h4>
                  <p className="mt-0.5 text-amber-800">
                    Your company documents have been received by the GCCI Secretariat compliance desk. Once certified, your profile unlocks direct quoting on protected national RFQs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSubTab('verification')}
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg shrink-0 whitespace-nowrap"
              >
                Upload Documents
              </button>
            </div>
          )}

          {/* Active Deal Rooms quick preview */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Your Active Deal Rooms</h3>
                <p className="text-xs text-slate-500">Direct commercial negotiations with buyers and partners.</p>
              </div>
              <button
                onClick={() => setActiveSubTab('dealrooms')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950"
              >
                View all ({myDealRooms.length})
              </button>
            </div>

            <div className="space-y-3">
              {myDealRooms.map(dr => (
                <div
                  key={dr.id}
                  onClick={() => setActiveDealRoomId(dr.id)}
                  className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-800 font-bold">{dr.referenceNumber}</span>
                      <span className="text-slate-400">·</span>
                      <span className="capitalize font-medium text-slate-700">{dr.status.replace('_', ' ')}</span>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">{dr.title}</p>
                    <p className="text-slate-500 text-[11px]">
                      Participants: {dr.participants.map(p => p.name).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    {dr.reportedValue ? (
                      <span className="font-bold text-slate-900 font-mono-numbers block text-sm">
                        D{dr.reportedValue.toLocaleString()} {dr.currency}
                      </span>
                    ) : null}
                    <span className="text-emerald-800 font-semibold flex items-center gap-1 justify-end mt-1">
                      <span>Enter Workspace</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPANY PROFILE EDITOR */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Official Company Profile</h2>
              <p className="text-slate-500">Keep statutory details and export capabilities updated for directory search.</p>
            </div>
            {profileSaved && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Profile Updated!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Registered Company Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Trading Name</label>
              <input
                type="text"
                value={profileForm.tradingName}
                onChange={e => setProfileForm({ ...profileForm, tradingName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Business Registration No.</label>
              <input
                type="text"
                value={profileForm.registrationNumber}
                onChange={e => setProfileForm({ ...profileForm, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-numbers"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Tax Identification Number (TIN)</label>
              <input
                type="text"
                value={profileForm.tinNumber}
                onChange={e => setProfileForm({ ...profileForm, tinNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-numbers"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">GCCI Membership ID</label>
              <input
                type="text"
                value={profileForm.gcciMemberNumber}
                onChange={e => setProfileForm({ ...profileForm, gcciMemberNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-numbers"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Commercial Sector</label>
              <select
                value={profileForm.sector}
                onChange={e => setProfileForm({ ...profileForm, sector: e.target.value, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="Agribusiness & Food Processing">Agribusiness & Food Processing</option>
                <option value="Fisheries & Marine Resources">Fisheries & Marine Resources</option>
                <option value="Construction & Real Estate">Construction & Infrastructure</option>
                <option value="Energy & Renewable Systems">Energy & Solar</option>
                <option value="Logistics, Port & Transport">Logistics & Port Freight</option>
                <option value="ICT, Telecoms & Fintech">ICT & Fintech</option>
                <option value="Professional & Business Services">Professional Services</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Gambian Region</label>
              <select
                value={profileForm.region}
                onChange={e => setProfileForm({ ...profileForm, region: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="Banjul">Banjul</option>
                <option value="Kanifing Municipality (KMC)">Kanifing Municipality (KMC)</option>
                <option value="West Coast Region (Brikama)">West Coast Region (Brikama)</option>
                <option value="North Bank Region (Kerewan)">North Bank Region</option>
                <option value="Lower River Region (Mansa Konko)">Lower River Region</option>
                <option value="Central River Region (Janjangbureh)">Central River Region</option>
                <option value="Upper River Region (Basse)">Upper River Region</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Year Established</label>
              <input
                type="number"
                value={profileForm.yearEstablished}
                onChange={e => setProfileForm({ ...profileForm, yearEstablished: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-numbers"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Business Description & Export Profile</label>
            <textarea
              rows={4}
              value={profileForm.description}
              onChange={e => setProfileForm({ ...profileForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Capabilities (comma separated)</label>
              <input
                type="text"
                value={profileForm.capabilities}
                onChange={e => setProfileForm({ ...profileForm, capabilities: e.target.value })}
                placeholder="Cashew shelling, HACCP packaging, cold storage..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Certifications & Licenses (comma separated)</label>
              <input
                type="text"
                value={profileForm.certifications}
                onChange={e => setProfileForm({ ...profileForm, certifications: e.target.value })}
                placeholder="GRA Tax Clearance, FSQA Food Handler, ISO 22000..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shadow-xs"
            >
              Save Profile Updates
            </button>
          </div>
        </form>
      )}

      {/* 3. STATUTORY VERIFICATION CENTER */}
      {activeSubTab === 'verification' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">GCCI Compliance & Verification Center</h3>
                <p className="text-slate-500">Official statutory compliance records reviewed by GCCI Legal & Audit Committee.</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase">Audit Standing</span>
                <span className="font-bold text-emerald-800 text-sm">
                  {business?.verificationLevel}
                </span>
              </div>
            </div>

            {/* Document checklist table */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800">Submitted Statutory Filings</h4>
              {business?.verificationDocs.length === 0 ? (
                <p className="p-4 bg-slate-50 rounded-lg text-slate-500 text-center">
                  No statutory verification documents uploaded yet.
                </p>
              ) : (
                business?.verificationDocs.map(doc => (
                  <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <div>
                        <p className="font-semibold text-slate-900">{doc.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono-numbers">
                          {doc.fileName} · {doc.fileSize} · Uploaded {doc.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px] capitalize">
                      {doc.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Upload form */}
            <form onSubmit={handleUploadDoc} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 pt-4">
              <h4 className="font-semibold text-slate-900">Upload New Statutory Filing</h4>
              {docUploadedSuccess && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded flex items-center gap-1.5 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Document submitted to GCCI verification queue!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    value={docUploadTitle}
                    onChange={e => setDocUploadTitle(e.target.value)}
                    placeholder="e.g. GRA Tax Clearance 2026"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Document Classification</label>
                  <select
                    value={docUploadType}
                    onChange={e => setDocUploadType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="tax_clearance">GRA Tax Clearance Certificate</option>
                    <option value="incorporation">Certificate of Incorporation (Registrar General)</option>
                    <option value="gcci_certificate">GCCI Annual Membership Certificate</option>
                    <option value="license">Industry Technical License (FSQA, PURA, GPA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">File Name</label>
                  <input
                    type="text"
                    value={docUploadFileName}
                    onChange={e => setDocUploadFileName(e.target.value)}
                    placeholder="GRA_Tax_Clearance_2026.pdf"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono-numbers"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Submit for Compliance Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. PRODUCTS & SERVICES CATALOG MANAGEMENT */}
      {activeSubTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Commercial Listings</h3>
              <p className="text-xs text-slate-500">Products and services active in the public GCCI marketplace.</p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Listing</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Item Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 font-mono-numbers">Price</th>
                  <th className="py-3 px-4">MOQ</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No products or services listed yet. Click "Add New Listing" to create your first offer.
                    </td>
                  </tr>
                ) : (
                  myProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          {prod.imageUrl && (
                            <img
                              src={prod.imageUrl}
                              alt={prod.title}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          )}
                          <span>{prod.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize">{prod.type}</td>
                      <td className="py-3 px-4">{prod.category}</td>
                      <td className="py-3 px-4 font-mono-numbers font-bold text-slate-900">
                        D{prod.price.toLocaleString()} {prod.currency}
                      </td>
                      <td className="py-3 px-4">{prod.moq || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold text-[10px]">
                          {prod.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* 5. SUBMITTED BIDS / RESPONSES */}
      {activeSubTab === 'responses' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Your Submitted Quotations & Bids</h3>
            <p className="text-xs text-slate-500">Track responses to commercial sourcing tenders published by buyers.</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">RFP Ref</th>
                  <th className="py-3 px-4">Offered Quantity</th>
                  <th className="py-3 px-4 font-mono-numbers">Total Quoted (GMD)</th>
                  <th className="py-3 px-4">Lead Time</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myResponses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      You have not submitted quotations to any public RFQs yet.
                    </td>
                  </tr>
                ) : (
                  myResponses.map(resp => (
                    <tr key={resp.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {resp.opportunityId.toUpperCase()}
                      </td>
                      <td className="py-3 px-4 font-mono-numbers">{resp.offeredQuantity} {resp.unit}</td>
                      <td className="py-3 px-4 font-mono-numbers font-bold text-emerald-900">
                        D{resp.totalProposedPrice.toLocaleString()} {resp.currency}
                      </td>
                      <td className="py-3 px-4">{resp.deliveryDays} days</td>
                      <td className="py-3 px-4 font-mono-numbers">{resp.submittedAt}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${resp.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : resp.status === 'shortlisted' ? 'bg-blue-50 text-blue-800' : 'bg-slate-100 text-slate-700'}`}>
                          {resp.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. DEAL ROOMS LIST */}
      {activeSubTab === 'dealrooms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Active Deal Rooms</h3>
              <p className="text-xs text-slate-500">Confidential workspaces for commercial negotiations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myDealRooms.map(room => (
              <div
                key={room.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {room.referenceNumber}
                    </span>
                    <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {room.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{room.title}</h4>
                  <p className="text-xs text-slate-500">
                    Counterparties: {room.participants.filter(p => p.name !== currentUser.fullName).map(p => p.name).join(', ') || 'GCCI Facilitator'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono-numbers text-slate-600">
                    {room.messages.length} messages · {room.documents.length} files
                  </span>
                  <button
                    onClick={() => setActiveDealRoomId(room.id)}
                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                  >
                    Enter Workspace →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TEAM & RBAC MANAGEMENT */}
      {activeSubTab === 'employees' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Company Team & Role-Based Access Control</h3>
              <p className="text-xs text-slate-500">Assign sub-permissions to employees for catalog or deal management.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Catalog Access</th>
                  <th className="py-3 px-4">Deal Room Access</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{emp.name}</td>
                    <td className="py-3 px-4">{emp.email}</td>
                    <td className="py-3 px-4">{emp.role}</td>
                    <td className="py-3 px-4 font-medium text-emerald-800">
                      {emp.canProducts ? 'Authorized' : 'Restricted'}
                    </td>
                    <td className="py-3 px-4 font-medium text-emerald-800">
                      {emp.canDealRooms ? 'Authorized' : 'Restricted'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold text-[10px]">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Team Member form */}
          <form onSubmit={handleAddEmployee} className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-semibold text-slate-900">Invite Team Member</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newEmpName}
                  onChange={e => setNewEmpName(e.target.value)}
                  placeholder="e.g. Binta Jammeh"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={newEmpEmail}
                  onChange={e => setNewEmpEmail(e.target.value)}
                  placeholder="bjammeh@company.gm"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Assigned Role</label>
                <input
                  type="text"
                  value={newEmpRole}
                  onChange={e => setNewEmpRole(e.target.value)}
                  placeholder="Export Coordinator"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 text-base mb-4">Add Commercial Listing to Marketplace</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Listing Title</label>
                <input
                  type="text"
                  required
                  value={newProdTitle}
                  onChange={e => setNewProdTitle(e.target.value)}
                  placeholder="e.g. Export-Grade Raw Cashews (KOR 50)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Listing Type</label>
                  <select
                    value={newProdType}
                    onChange={e => setNewProdType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Agribusiness & Food Processing">Agribusiness & Food</option>
                    <option value="Fisheries & Marine Resources">Fisheries & Marine</option>
                    <option value="Construction & Real Estate">Construction Materials</option>
                    <option value="Energy & Renewable Systems">Energy & Solar</option>
                    <option value="Logistics, Port & Transport">Logistics & Port Freight</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Price (GMD)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Minimum Order</label>
                  <input
                    type="text"
                    value={newProdMOQ}
                    onChange={e => setNewProdMOQ(e.target.value)}
                    placeholder="e.g. 5 Tonnes"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Lead Time</label>
                  <input
                    type="text"
                    value={newProdLeadTime}
                    onChange={e => setNewProdLeadTime(e.target.value)}
                    placeholder="e.g. 5-7 days"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Detailed Commercial Description</label>
                <textarea
                  rows={3}
                  required
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  placeholder="Detail moisture content, certification standards, packaging specifications..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shadow-xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
