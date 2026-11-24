import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, GambianRegion } from '../../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle, 
  Award, 
  Calendar, 
  Users, 
  ArrowRight, 
  X,
  MessageSquare,
  FileText,
  Ship
} from 'lucide-react';

interface BusinessDirectoryProps {
  initialSearchQuery?: string;
  initialCategory?: string;
  onOpenDealRoom?: (targetBusiness: Business) => void;
  openAuthModal?: (mode: 'signin' | 'register') => void;
}

export const BusinessDirectory: React.FC<BusinessDirectoryProps> = ({ 
  initialSearchQuery = '', 
  initialCategory = 'all',
  onOpenDealRoom,
  openAuthModal
}) => {
  const { businesses, products, currentUser, createDealRoom } = useApp();
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>(initialCategory);
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified_only'>('all');
  const [enterpriseTypeFilter, setEnterpriseTypeFilter] = useState<'all' | 'exporters' | 'producers' | 'services'>('all');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');

  const regions: GambianRegion[] = [
    'Banjul',
    'Kanifing Municipality (KMC)',
    'West Coast Region (Brikama)',
    'North Bank Region (Kerewan)',
    'Lower River Region (Mansa Konko)',
    'Central River Region (Janjangbureh)',
    'Upper River Region (Basse)',
    'ECOWAS / Regional'
  ];

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      // Exclude sanctioned or suspended businesses from public directory
      if (b.isSanctioned || b.verificationStatus === 'suspended') {
        return false;
      }

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(query) || b.tradingName.toLowerCase().includes(query);
        const matchesDesc = b.description.toLowerCase().includes(query);
        const matchesCap = b.capabilities.some(c => c.toLowerCase().includes(query));
        const matchesSector = b.sector.toLowerCase().includes(query) || b.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCap && !matchesSector) return false;
      }

      // Region filter
      if (selectedRegion !== 'all' && b.region !== selectedRegion) {
        return false;
      }

      // Sector filter
      if (selectedSector !== 'all' && !b.sector.toLowerCase().includes(selectedSector.toLowerCase()) && !b.category.toLowerCase().includes(selectedSector.toLowerCase())) {
        return false;
      }

      // Verification filter
      if (verificationFilter === 'verified_only' && b.verificationStatus !== 'verified') {
        return false;
      }

      // Enterprise Classification filter
      if (enterpriseTypeFilter === 'exporters') {
        const isExporter = b.verificationLevel === 'Gold Certified Exporter' ||
          b.dueDiligence?.diligenceLevel === 'Tier 3: Gold Sovereign Exporter' ||
          b.capabilities.some(c => c.toLowerCase().includes('export'));
        if (!isExporter) return false;
      } else if (enterpriseTypeFilter === 'producers') {
        const isProducer = (b.sector === 'Agriculture' || b.sector === 'Infrastructure' || b.category.includes('Processing') || b.category.includes('Construction')) &&
          b.verificationLevel !== 'Gold Certified Exporter';
        if (!isProducer) return false;
      } else if (enterpriseTypeFilter === 'services') {
        const isService = b.sector === 'Transport' || b.sector === 'Technology' || b.sector === 'Services' || b.category.includes('Logistics') || b.category.includes('Services');
        if (!isService) return false;
      }

      return true;
    });
  }, [businesses, searchTerm, selectedRegion, selectedSector, verificationFilter, enterpriseTypeFilter]);

  const handleStartDealRoom = (biz: Business) => {
    if (currentUser.role === 'visitor') {
      if (openAuthModal) openAuthModal('signin');
      return;
    }

    const room = createDealRoom({
      title: `Commercial Enquiry with ${biz.name}`,
      originatingType: 'direct_inquiry',
      targetUserId: biz.ownerId,
      targetUserName: biz.name,
      targetBusinessName: biz.name,
      initialMessage: enquiryMessage || `Greetings from ${currentUser.fullName} (${currentUser.businessName || currentUser.organization}). We are interested in discussing commercial opportunities with your firm.`
    });

    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setSelectedBusiness(null);
      if (onOpenDealRoom) onOpenDealRoom(biz);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Directory Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Official Gambian Commercial Registry
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Verified Business Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Search and verify incorporated companies across the 7 administrative regions of The Gambia. Review audited statutory credentials, export capabilities, and trade certifications.
        </p>
      </div>

      {/* Filter and Search Bar Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by company name, cashew, solar, curbstones, logistics..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Region Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-slate-700"
            >
              <option value="all">All Regions of The Gambia</option>
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-slate-700"
            >
              <option value="all">All Sectors</option>
              <option value="Agriculture">Agriculture & Food</option>
              <option value="Marine">Fisheries & Marine</option>
              <option value="Infrastructure">Construction</option>
              <option value="Energy">Energy & Solar</option>
              <option value="Transport">Logistics & Port</option>
              <option value="Technology">ICT & Fintech</option>
              <option value="Services">Professional Services</option>
            </select>
          </div>

          {/* Verification Only Segmented Toggle */}
          <div className="md:col-span-2 flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setVerificationFilter('all')}
              className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${verificationFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All ({businesses.length})
            </button>
            <button
              onClick={() => setVerificationFilter('verified_only')}
              className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${verificationFilter === 'verified_only' ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified</span>
            </button>
          </div>
        </div>

        {/* Enterprise Classification Segment Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Classification:</span>
          <button
            onClick={() => setEnterpriseTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${enterpriseTypeFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
          >
            All Enterprises
          </button>
          <button
            onClick={() => setEnterpriseTypeFilter('exporters')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${enterpriseTypeFilter === 'exporters' ? 'bg-amber-800 text-white shadow-xs' : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'}`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Certified Gambian Exporters (Tier 3)</span>
          </button>
          <button
            onClick={() => setEnterpriseTypeFilter('producers')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${enterpriseTypeFilter === 'producers' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'}`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Domestic Producers & Manufacturers</span>
          </button>
          <button
            onClick={() => setEnterpriseTypeFilter('services')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${enterpriseTypeFilter === 'services' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            <span>Logistics & Commercial Services</span>
          </button>
        </div>

        {/* Active Filters readout */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800 font-mono-numbers">{filteredBusinesses.length}</strong> registered enterprises matching criteria
          </span>
          {(searchTerm || selectedRegion !== 'all' || selectedSector !== 'all' || verificationFilter !== 'all' || enterpriseTypeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('all');
                setSelectedSector('all');
                setVerificationFilter('all');
                setEnterpriseTypeFilter('all');
              }}
              className="text-emerald-700 hover:underline font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map(biz => (
          <div
            key={biz.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Business Facility / Operational Banner */}
            {biz.logo && (
              <div 
                className="relative h-44 w-full bg-slate-100 overflow-hidden group cursor-pointer"
                onClick={() => setSelectedBusiness(biz)}
              >
                <img
                  src={biz.logo}
                  alt={biz.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold rounded">
                    {biz.category}
                  </span>
                </div>
              </div>
            )}

            <div className="p-5 space-y-4">
              {/* Header with Verification Indicator */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base leading-tight hover:text-emerald-900 cursor-pointer" onClick={() => setSelectedBusiness(biz)}>
                    {biz.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{biz.region}</span>
                  </div>
                </div>

                {biz.verificationLevel === 'Gold Certified Exporter' || biz.dueDiligence?.diligenceLevel === 'Tier 3: Gold Sovereign Exporter' ? (
                  <div className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded text-[11px] font-bold shrink-0">
                    <Award className="w-3.5 h-3.5 text-amber-700" />
                    <span>Gold Exporter</span>
                  </div>
                ) : biz.verificationStatus === 'verified' ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-semibold shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Verified</span>
                  </div>
                ) : (
                  <div className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium shrink-0">
                    {biz.verificationStatus === 'verification_pending' ? 'Audit Pending' : 'Registered Member'}
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {biz.description}
              </p>

              {/* Unboxed Metadata row with typographic separators */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono-numbers">
                <span>Est. {biz.yearEstablished}</span>
                <span aria-hidden="true">·</span>
                <span>{biz.employeesCount} Staff</span>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[120px]">{biz.legalStructure}</span>
              </div>

              {/* Capabilities checklist */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Key Capabilities</p>
                <div className="space-y-1 text-xs text-slate-700">
                  {biz.capabilities.slice(0, 2).map((cap, i) => (
                    <div key={i} className="flex items-center gap-1.5 truncate">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono-numbers text-[11px]">
                {biz.completedDealsCount || 0} Deals Completed
              </span>
              <button
                onClick={() => setSelectedBusiness(biz)}
                className="font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 py-1 px-2 rounded hover:bg-emerald-50 transition-colors"
              >
                <span>Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">No matching Gambian enterprises found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords, clearing regional restrictions, or switching sectors.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('all');
              setSelectedSector('all');
              setVerificationFilter('all');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* FULL PUBLIC BUSINESS PROFILE MODAL (Section 7) */}
      {selectedBusiness && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
            <button
              onClick={() => setSelectedBusiness(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Business Header */}
            {selectedBusiness.logo && (
              <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden border border-slate-200 mb-6 bg-slate-100">
                <img
                  src={selectedBusiness.logo}
                  alt={selectedBusiness.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4 pb-6 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {selectedBusiness.name}
                    </h2>
                    {selectedBusiness.verificationStatus === 'verified' && (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{selectedBusiness.verificationLevel}</span>
                        </span>
                        {selectedBusiness.riskScore && (
                          <span className="text-[11px] text-emerald-800 font-mono-numbers font-semibold">
                            Diligence Index: {selectedBusiness.riskScore}/100
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Trading as: <strong>{selectedBusiness.tradingName}</strong> · Legal: {selectedBusiness.legalStructure}
                  </p>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400 font-mono-numbers block">GCCI Member ID</span>
                  <span className="font-bold text-slate-800 font-mono-numbers">{selectedBusiness.gcciMemberNumber}</span>
                </div>
              </div>

              {/* Unboxed Meta Badges with Typographic Separators */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedBusiness.address}, {selectedBusiness.region}
                </span>
                <span aria-hidden="true">·</span>
                <span>Established {selectedBusiness.yearEstablished}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedBusiness.employeesCount} Employees</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-800 font-medium">{selectedBusiness.category}</span>
              </div>
            </div>

            {/* Profile Body */}
            <div className="py-6 space-y-6 text-xs text-slate-700">
              {/* About */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Company Overview</h4>
                <p className="leading-relaxed text-slate-600 text-xs sm:text-sm">
                  {selectedBusiness.description}
                </p>
              </div>

              {/* Capabilities & Certifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Commercial Capabilities
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {selectedBusiness.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Certifications & Audited Compliance
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {selectedBusiness.certifications.map((cert, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 text-[11px] text-slate-500 font-mono-numbers">
                    TIN: {selectedBusiness.tinNumber} · Reg: {selectedBusiness.registrationNumber}
                  </div>
                </div>
              </div>

              {/* Products by this Business */}
              {products.filter(p => p.businessId === selectedBusiness.id).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Published Catalog Items</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.filter(p => p.businessId === selectedBusiness.id).map(prod => (
                      <div key={prod.id} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900 text-xs">{prod.title}</p>
                          <p className="text-[11px] text-slate-500">MOQ: {prod.moq || 'Contact for quote'}</p>
                        </div>
                        <span className="font-bold text-emerald-800 font-mono-numbers text-xs">
                          D{prod.price.toLocaleString()} {prod.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Contact Info */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
                <h4 className="font-semibold text-emerald-950 text-xs">Direct Commercial Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{selectedBusiness.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="truncate">{selectedBusiness.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="truncate">{selectedBusiness.website || 'gcci.gm/exchange'}</span>
                  </div>
                </div>
              </div>

              {/* Initiate Commercial Negotiation / Deal Room */}
              <div className="p-5 bg-slate-900 rounded-xl text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-sm">Initiate Commercial Dialogue & Deal Room</h4>
                  </div>
                  <span className="text-[11px] text-slate-400">GCCI Protected Workspace</span>
                </div>
                <p className="text-xs text-slate-300">
                  Open an encrypted B2B Deal Room with {selectedBusiness.name} to exchange RFQs, request technical catalogs, review contracts, and negotiate purchase orders under GCCI trade guidelines.
                </p>

                {enquirySuccess ? (
                  <div className="p-3 bg-emerald-800 rounded-lg text-emerald-100 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Deal Room initiated successfully! Redirecting to workspace...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={enquiryMessage}
                      onChange={e => setEnquiryMessage(e.target.value)}
                      placeholder="Optional introductory note regarding your procurement requirements..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setSelectedBusiness(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => handleStartDealRoom(selectedBusiness)}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        Open B2B Deal Room
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
