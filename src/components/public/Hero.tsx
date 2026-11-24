import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { GcciLogo } from '../common/GcciLogo';
import { 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  TrendingUp, 
  CheckCircle, 
  Briefcase, 
  Truck, 
  Zap, 
  Fish, 
  Wheat, 
  MapPin, 
  Calendar,
  Layers,
  ChevronRight,
  UserPlus,
  Handshake,
  Store,
  Ship,
  Landmark,
  Award,
  FileText,
  FileCheck,
  Globe,
  Check,
  RefreshCw,
  BarChart3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Users,
  Clock,
  Sparkles,
  Calculator,
  Scale,
  Share2
} from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: string) => void;
  openAuthModal: (mode: 'signin' | 'register') => void;
  onSearchQuery: (query: string, category?: string) => void;
  onOpenShare?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab, openAuthModal, onSearchQuery, onOpenShare }) => {
  const { businesses, opportunities, products, categories, dealRooms } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredTab, setFeaturedTab] = useState<'all' | 'exporters' | 'producers'>('all');

  // Interactive Live Verifier State
  const [verifierQuery, setVerifierQuery] = useState('GM-CO-2017-0842');
  const [verifierSearched, setVerifierSearched] = useState(true);

  // Commodity Index Currency/Mode
  const [commodityCurrency, setCommodityCurrency] = useState<'USD' | 'GMD'>('USD');

  // AfCFTA Tariff Calculator State
  const [afcftaProduct, setAfcftaProduct] = useState('cashew');
  const [afcftaDestination, setAfcftaDestination] = useState('senegal');

  // Event Registration Toast state
  const [registeredEvent, setRegisteredEvent] = useState<string | null>(null);

  const verifiedBusinessesCount = businesses.filter(b => b.verificationStatus === 'verified').length;
  const activeOpportunitiesCount = opportunities.filter(o => o.status === 'published').length;
  const totalTradeGMD = businesses.reduce((acc, b) => acc + (b.totalDealValueGMD || 0), 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchQuery(searchTerm, selectedCategory === 'all' ? undefined : selectedCategory);
    setActiveTab('directory');
  };

  const displayedBusinesses = useMemo(() => {
    if (featuredTab === 'exporters') {
      return businesses.filter(b => 
        b.verificationLevel === 'Gold Certified Exporter' || 
        b.dueDiligence?.diligenceLevel === 'Tier 3: Gold Sovereign Exporter' ||
        b.capabilities.some(c => c.toLowerCase().includes('export'))
      ).slice(0, 3);
    }
    if (featuredTab === 'producers') {
      return businesses.filter(b => 
        (b.sector === 'Agriculture' || b.sector === 'Infrastructure' || b.sector === 'Energy' || b.category.includes('Processing') || b.category.includes('Construction')) &&
        b.verificationLevel !== 'Gold Certified Exporter'
      ).slice(0, 3);
    }
    return businesses.filter(b => b.featured).slice(0, 3);
  }, [businesses, featuredTab]);

  const latestOpportunities = opportunities.filter(o => o.status === 'published').slice(0, 3);

  // Verified Entity Lookup Result
  const verifiedEntity = useMemo(() => {
    if (!verifierQuery.trim()) return null;
    const q = verifierQuery.trim().toLowerCase();
    return businesses.find(b => 
      b.registrationNumber?.toLowerCase().includes(q) ||
      b.tinNumber?.toLowerCase().includes(q) ||
      b.gcciMemberNumber?.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q)
    ) || businesses[0];
  }, [businesses, verifierQuery]);

  // AfCFTA Calculator data
  const afcftaEstimates: Record<string, { name: string; standardMfn: number; afcftaRate: number; baseValUSD: number; unit: string; requiredDocs: string[] }> = {
    cashew: {
      name: 'Organic Raw Cashew Nuts (KOR 50)',
      standardMfn: 15,
      afcftaRate: 0,
      baseValUSD: 38400,
      unit: '20ft FCL (18 MT)',
      requiredDocs: ['GCCI Form C Certificate of Origin', 'FSQA Phytosanitary Certificate', 'Banjul Port Bill of Lading']
    },
    seafood: {
      name: 'Atlantic White Shrimp & Sole (Frozen)',
      standardMfn: 20,
      afcftaRate: 0,
      baseValUSD: 56800,
      unit: '40ft Reefer Container',
      requiredDocs: ['GCCI Origin Certificate', 'Ministry of Fisheries Health Guarantee', 'FSQA Export Seal']
    },
    oil: {
      name: 'Cold-Pressed Groundnut Oil & Cake',
      standardMfn: 18,
      afcftaRate: 0,
      baseValUSD: 29200,
      unit: '20ft Tank/Drum Consignment',
      requiredDocs: ['GCCI Certificate of Origin', 'GRA Customs Export Entry Form C20', 'Batch Analysis Sheet']
    },
    mangoes: {
      name: 'Keitt Mangoes & Horticultural Produce',
      standardMfn: 20,
      afcftaRate: 0,
      baseValUSD: 18500,
      unit: 'Refrigerated Road/Air Freight',
      requiredDocs: ['GCCI Electronic COO', 'National Plant Protection Permit', 'Packaging Standard Certificate']
    },
    concrete: {
      name: 'Precast Concrete & Civil Aggregates',
      standardMfn: 15,
      afcftaRate: 0,
      baseValUSD: 24000,
      unit: 'Cross-Border Truck Convoy',
      requiredDocs: ['GCCI ETLS Origin Certificate', 'TIN Tax Clearance Endorsement', 'Standard Weight Certificate']
    }
  };

  const selectedEstimate = afcftaEstimates[afcftaProduct] || afcftaEstimates.cashew;
  const dutySavedUSD = Math.round(selectedEstimate.baseValUSD * (selectedEstimate.standardMfn / 100));
  const dutySavedGMD = Math.round(dutySavedUSD * 68);

  const commodities = [
    {
      name: 'Raw Cashew Nuts (In-shell, KOR 50)',
      category: 'Export Agribusiness',
      spec: 'Moisture <8.5%, Defective <6%',
      priceUSD: '$1,280 / MT',
      priceGMD: 'D87,040 / MT',
      change: '+3.4%',
      trend: 'up',
      basis: 'FOB Port of Banjul',
      origin: 'West Coast / LRR Aggregation'
    },
    {
      name: 'Atlantic White Shrimp (P. notialis)',
      category: 'Marine Fisheries',
      spec: 'Head-on, Blast Frozen -18°C',
      priceUSD: '$14,200 / MT',
      priceGMD: 'D965,600 / MT',
      change: '+1.8%',
      trend: 'up',
      basis: 'CIF Rotterdam / Dakar',
      origin: 'Banjul Fisheries Wharf'
    },
    {
      name: 'Refined Cold-Pressed Groundnut Oil',
      category: 'Edible Oils & Processing',
      spec: 'Food-grade, Low Acidity <0.8%',
      priceUSD: '$1,460 / MT',
      priceGMD: 'D99,280 / MT',
      change: '0.0%',
      trend: 'steady',
      basis: 'FOB Banjul / Karang',
      origin: 'Denton Bridge / Kanifing'
    },
    {
      name: 'Fresh Keitt & Kent Mangoes',
      category: 'Horticulture & Fruits',
      spec: 'GlobalGAP Certified, Grade A',
      priceUSD: '$2,850 / MT',
      priceGMD: 'D193,800 / MT',
      change: '+4.2%',
      trend: 'up',
      basis: 'Airfreight Banjul (BJL)',
      origin: 'Brikama & Sibanor Orchards'
    },
    {
      name: 'Commercial Solar PV Modules (550Wp)',
      category: 'Energy & Renewables',
      spec: 'Tier-1 Bifacial Mono PERC',
      priceUSD: '$0.21 / Wp',
      priceGMD: 'D14.28 / Wp',
      change: '-1.2%',
      trend: 'down',
      basis: 'DDP Port Banjul Bonded',
      origin: 'Banjul Customs Free Zone'
    },
    {
      name: 'Portland Cement Grade 42.5R',
      category: 'Construction Materials',
      spec: 'BS EN 197-1 High Strength',
      priceUSD: '$7.13 / 50kg bag',
      priceGMD: 'D485 / 50kg bag',
      change: '0.0%',
      trend: 'steady',
      basis: 'Ex-Factory Kanifing',
      origin: 'Kanifing Industrial Estate'
    }
  ];

  const tradeMissions = [
    {
      id: 'tm-1',
      title: 'The Gambia–Senegal Bilateral Trade Corridor Forum',
      date: 'March 28–29, 2026',
      location: 'Kerr Jula, GCCI Headquarters, Bijilo',
      focus: 'Cross-Border Transit Facilitation, ETLS Customs Harmonization & Joint Agribusiness Processing',
      participants: '180+ Exporters, Forwarders & Trade Ministers',
      badge: 'Bilateral Corridor',
      status: 'Open for Registration'
    },
    {
      id: 'tm-2',
      title: 'AfCFTA Intra-African Trade Summit & Deal Matchmaking',
      date: 'April 16–18, 2026',
      location: 'Sir Dawda Kairaba Jawara International Conference Centre',
      focus: 'Rules of Origin Certification, Zero-Tariff Access & Sovereign Escrow Contracting',
      participants: 'Delegations from Senegal, Ghana, Nigeria, Cote d\'Ivoire',
      badge: 'AfCFTA Regional',
      status: 'High Demand'
    },
    {
      id: 'tm-3',
      title: 'The Gambia–Turkey Bilateral Business Council & Machinery Expo',
      date: 'May 12–14, 2026',
      location: 'Banjul & Istanbul (Hybrid Council)',
      focus: 'Agricultural Cold Storage, Solar Irrigation, Civil Construction & Concessions',
      participants: 'GCCI Exporters & DEIK Turkish Business Delegation',
      badge: 'International Mission',
      status: 'Accreditation Required'
    },
    {
      id: 'tm-4',
      title: 'GCCI 32nd Annual Private Sector Excellence Awards Gala',
      date: 'June 20, 2026',
      location: 'Coral Beach Hotel, Brufut',
      focus: 'Recognizing Top Sovereign Exporters, Domestic Manufacturers & Sustainable Employers',
      participants: 'Cabinet Ministers, Diplomatic Corps & 400+ Business Leaders',
      badge: 'National Gala',
      status: 'Corporate Table Bookings'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION with Split 2-Column Desktop Grid and Banjul Trade Hub Photography */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Ambient subtle background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-200">
                  <GcciLogo size="sm" className="h-5 w-auto" />
                  <span className="font-medium text-slate-200">Official Gambia Chamber of Commerce & Industry Platform</span>
                </div>
                {onOpenShare && (
                  <button
                    type="button"
                    onClick={onOpenShare}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-400 rounded-lg transition-colors shadow-2xs"
                    title="Share or copy direct platform links"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Share Platform Link</span>
                  </button>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                The National Business & Trade Exchange of The Gambia
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Discover verified suppliers, publish commercial procurement requirements, connect with accredited investors, and close deals securely across The Gambia and ECOWAS.
              </p>

              {/* Main Search Bar */}
              <form onSubmit={handleSearchSubmit} className="bg-white p-2 rounded-xl shadow-xl flex flex-col sm:flex-row gap-2 max-w-2xl border border-slate-200">
                <div className="flex-1 flex items-center px-3 gap-2">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search businesses, cashews, solar, freight, tenders..."
                    className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <div className="sm:border-l sm:border-slate-200 px-2 flex items-center">
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-auto text-xs text-slate-700 bg-transparent py-2 px-2 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Sectors</option>
                    <option value="Agriculture">Agribusiness</option>
                    <option value="Marine">Fisheries & Marine</option>
                    <option value="Infrastructure">Construction</option>
                    <option value="Energy">Energy & Solar</option>
                    <option value="Logistics">Logistics & Port</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0B42A0] hover:bg-[#002E7A] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap shadow-sm"
                >
                  Search Exchange
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
                <span className="text-slate-400">Popular:</span>
                <button
                  onClick={() => { onSearchQuery('Cashew'); setActiveTab('directory'); }}
                  className="hover:text-amber-400 underline decoration-slate-600 transition-colors"
                >
                  Export Cashews
                </button>
                <span>·</span>
                <button
                  onClick={() => { onSearchQuery('Fisheries'); setActiveTab('directory'); }}
                  className="hover:text-amber-400 underline decoration-slate-600 transition-colors"
                >
                  Atlantic Sole & Snapper
                </button>
                <span>·</span>
                <button
                  onClick={() => { onSearchQuery('Solar'); setActiveTab('directory'); }}
                  className="hover:text-amber-400 underline decoration-slate-600 transition-colors"
                >
                  Commercial Solar PV
                </button>
                <span>·</span>
                <button
                  onClick={() => { onSearchQuery('Cement'); setActiveTab('directory'); }}
                  className="hover:text-amber-400 underline decoration-slate-600 transition-colors"
                >
                  Portland Cement 42.5R
                </button>
                <span>·</span>
                <button
                  onClick={() => { onSearchQuery('Logistics'); setActiveTab('directory'); }}
                  className="hover:text-amber-400 underline decoration-slate-600 transition-colors"
                >
                  Port of Banjul Freight
                </button>
              </div>
            </div>

            {/* Right Media Column - High Fidelity Visual Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 aspect-16/10 lg:aspect-4/3 group">
                <img
                  src="/src/assets/images/hero_banjul_trade_hub_1792068736812.jpg"
                  alt="West African Banjul Business Hub and Port Commercial District"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                
                {/* Floating Trust Card Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Audited Statutory Compliance
                    </span>
                    <span className="text-amber-400 font-mono-numbers">GCCI Portal</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Connecting Banjul, Kanifing, and Brikama enterprises with verified regional buyers and international export markets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column Metric Strip below Hero Split */}
        <div className="border-t border-slate-800 bg-slate-950/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
              <div className="border-r border-slate-800/80 last:border-r-0 pr-4">
                <p className="text-xs text-slate-400 font-medium">Verified Companies</p>
                <p className="text-2xl lg:text-3xl font-bold text-white font-mono-numbers mt-0.5">
                  {verifiedBusinessesCount} <span className="text-emerald-400 text-sm font-normal">Audited</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Full GRA Tax Clearance</p>
              </div>

              <div className="border-r border-slate-800/80 last:border-r-0 pr-4">
                <p className="text-xs text-slate-400 font-medium">Active Sourcing Tenders</p>
                <p className="text-2xl lg:text-3xl font-bold text-white font-mono-numbers mt-0.5">
                  {activeOpportunitiesCount} <span className="text-emerald-400 text-sm font-normal">Open RFPs</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Public & Verified Quoting</p>
              </div>

              <div className="border-r border-slate-800/80 last:border-r-0 pr-4">
                <p className="text-xs text-slate-400 font-medium">Trade Volume Facilitated</p>
                <p className="text-2xl lg:text-3xl font-bold text-emerald-400 font-mono-numbers mt-0.5">
                  D{(totalTradeGMD / 1000000).toFixed(1)}M <span className="text-slate-400 text-xs font-normal">GMD</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Across Gambian corridors</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">Regional Coverage</p>
                <p className="text-2xl lg:text-3xl font-bold text-white font-mono-numbers mt-0.5">
                  7 <span className="text-emerald-400 text-sm font-normal">Regions</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Banjul to Upper River</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARTICIPANT PILLARS: HARMONIZED IN GCCI BRAND COLORS (EMERALD, BLUE, SLATE, GOLD) */}
      <section id="pillars" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Domestic Producers & Manufacturers (GCCI Forestry Green Theme) */}
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-xs overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:border-emerald-300 transition-all group">
            <div className="sm:w-1/2 relative min-h-[200px] sm:min-h-full overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/precast_concrete_pavers_1792757928681.jpg"
                alt="Domestic Gambian Producers and Manufacturers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#005A36] text-white rounded-full text-[11px] font-bold shadow-xs">
                Domestic Supply Chain
              </div>
            </div>
            <div className="sm:w-1/2 p-6 sm:p-7 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#005A36] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#005A36]" />
                </div>
                <p className="text-[11px] font-bold tracking-wider text-[#005A36] uppercase">
                  For Gambian Enterprises & Producers
                </p>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Producers & Manufacturers
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  List domestic agro-processing, construction materials, solar systems, and commercial services. Quote directly on national corporate RFQs and supply public sector tenders.
                </p>
              </div>
              <div>
                <button
                  onClick={() => openAuthModal('register')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005A36] hover:text-emerald-900 transition-colors group/link"
                >
                  <span>Register your enterprise</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Pillar 2: Certified Gambian Exporters (GCCI Deep Navy & Sovereign Gold Theme) */}
          <div className="bg-white rounded-3xl border border-blue-100 shadow-xs overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:border-blue-300 transition-all group">
            <div className="sm:w-1/2 relative min-h-[200px] sm:min-h-full overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/gambia_agribusiness_export_1792068732551.jpg"
                alt="Certified Gambian Exporters and Commodity Trade"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0B42A0] text-white rounded-full text-[11px] font-bold shadow-xs">
                Global & AfCFTA Trade
              </div>
            </div>
            <div className="sm:w-1/2 p-6 sm:p-7 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0B42A0] flex items-center justify-center">
                  <Ship className="w-5 h-5 text-[#0B42A0]" />
                </div>
                <p className="text-[11px] font-bold tracking-wider text-[#0B42A0] uppercase">
                  For Certified Exporters & Consortia
                </p>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Certified Gambian Exporters
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Scale cross-border trade across ECOWAS and global markets. Issue electronic GCCI Certificates of Origin, meet FSQA phytosanitary benchmarks, and negotiate bulk cashew, seafood, and horticulture consignments.
                </p>
              </div>
              <div>
                <button
                  onClick={() => { onSearchQuery('Exporter'); setActiveTab('directory'); }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B42A0] hover:text-[#002E7A] transition-colors group/link"
                >
                  <span>Explore export commodities</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Pillar 3: Procurement Buyers & Importers (GCCI Corporate Navy Slate Theme) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:border-slate-300 transition-all group">
            <div className="sm:w-1/2 relative min-h-[200px] sm:min-h-full overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/hero_banjul_trade_hub_1792068736812.jpg"
                alt="Institutional Procurement Buyers and Importers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900 text-white rounded-full text-[11px] font-bold shadow-xs">
                Institutional Sourcing
              </div>
            </div>
            <div className="sm:w-1/2 p-6 sm:p-7 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-slate-800" />
                </div>
                <p className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                  For Procurement Teams & Importers
                </p>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Procurement Buyers & Importers
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Source verified Gambian agricultural commodities, marine seafood, and industrial services with audited statutory compliance, verified supply chains, and formal chamber arbitration.
                </p>
              </div>
              <div>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B42A0] hover:text-[#002E7A] transition-colors group/link"
                >
                  <span>Browse the marketplace</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Pillar 4: Investors & Strategic Partners (GCCI Sovereign Gold Theme) */}
          <div className="bg-white rounded-3xl border border-amber-200 shadow-xs overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:border-amber-300 transition-all group">
            <div className="sm:w-1/2 relative min-h-[200px] sm:min-h-full overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/investor_meeting_deal_room_1792068733134.jpg"
                alt="Investors and Strategic Capital Partners"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-slate-950 rounded-full text-[11px] font-bold shadow-xs">
                Direct Capital Allocation
              </div>
            </div>
            <div className="sm:w-1/2 p-6 sm:p-7 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-amber-700" />
                </div>
                <p className="text-[11px] font-bold tracking-wider text-amber-800 uppercase">
                  For Arab & Global Investors
                </p>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Investors & Strategic Capital
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Browse vetted direct investment opportunities across agriculture, solar energy, infrastructure concessions, and industrial processing, backed by the dedicated GCCI Deal Room.
                </p>
              </div>
              <div>
                <button
                  onClick={() => setActiveTab('investor_portal')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors group/link"
                >
                  <span>Explore Deal Room opportunities</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION A: GCCI LIVE COMMODITY & EXPORT PRICE BENCHMARK */}
      <section id="commodities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Port of Banjul & Kanifing Wholesale Indicative Index</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>GCCI Sovereign Commodity Price Benchmark</span>
              </h2>
              <p className="text-xs text-slate-400">
                Weekly chamber market intelligence covering strategic Gambian export consignments and industrial wholesale inputs.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl text-xs">
              <span className="text-slate-400 text-[11px] px-2 font-medium">Currency:</span>
              <button
                onClick={() => setCommodityCurrency('USD')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${commodityCurrency === 'USD' ? 'bg-[#0B42A0] text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                USD ($) FOB
              </button>
              <button
                onClick={() => setCommodityCurrency('GMD')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${commodityCurrency === 'GMD' ? 'bg-[#005A36] text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                GMD (Dalasi)
              </button>
            </div>
          </div>

          {/* Commodity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commodities.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">
                      {item.category}
                    </span>
                    <span className={`text-[11px] font-mono-numbers font-bold px-2 py-0.5 rounded ${item.trend === 'up' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : item.trend === 'down' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-700 text-slate-300'}`}>
                      {item.change}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {item.spec}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{item.basis}</span>
                    <span className="text-lg font-bold font-mono-numbers text-amber-400">
                      {commodityCurrency === 'USD' ? item.priceUSD : item.priceGMD}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onSearchQuery(item.name.split(' ')[0]);
                      setActiveTab('marketplace');
                    }}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                  >
                    <span>View Suppliers</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Indicative rates compiled by GCCI Trade Facilitation & Banjul Port Customs clearing agents. Actual contract rates subject to volume and Incoterms 2020.</span>
            </span>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="font-bold text-white hover:text-amber-400 flex items-center gap-1 shrink-0"
            >
              <span>Explore 200+ Catalog Commodities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. THREE STEPS GUIDED PATH - HARMONIZED WITH GCCI BRAND PALETTE */}
      <section id="how-it-works" className="bg-slate-50 py-16 border-y border-slate-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-[#0B42A0] rounded-full text-xs font-bold">
              <span>National Commercial Protocol</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From application to first deal in three steps
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              A statutory, rules-governed path designed for serious national and cross-border commercial trade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {/* Step 1: Entity Registration - GCCI Navy */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col items-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-[#0B42A0] text-white flex items-center justify-center shadow-md">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <span className="text-xs font-extrabold text-[#0B42A0] uppercase tracking-widest">
                01
              </span>
              <h3 className="text-xl font-bold text-slate-900">Entity Registration</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Create your corporate account with Ministry of Justice business registration and TIN credentials.
              </p>
            </div>

            {/* Step 2: Statutory Due Diligence - GCCI Forestry Green */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col items-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-[#005A36] text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <span className="text-xs font-extrabold text-[#005A36] uppercase tracking-widest">
                02
              </span>
              <h3 className="text-xl font-bold text-slate-900">Statutory Due Diligence</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                GCCI compliance officers audit incorporation, GRA Tax Clearance 2026, and sector regulatory licenses.
              </p>
            </div>

            {/* Step 3: Exchange & Deal Contracting - GCCI Sovereign Navy/Gold */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col items-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md">
                <Handshake className="w-8 h-8 text-amber-400" />
              </div>
              <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
                03
              </span>
              <h3 className="text-xl font-bold text-slate-900">Exchange & Contracting</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Publish tenders, submit binding quotations, negotiate in encrypted Deal Rooms, and close deals with GCCI backing.
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={() => setActiveTab('membership')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0B42A0] hover:bg-[#002E7A] text-white font-extrabold text-sm rounded-full shadow-md transition-all hover:scale-102"
            >
              <span>Become an Accredited Member</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3B. GCCI STATUTORY DUE DILIGENCE & ACCREDITATION FRAMEWORK - FULLY HARMONIZED WITH GCCI COLOR PALETTE */}
      <section id="due-diligence" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Official Chamber Navy Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-[#002E7A] to-slate-900 p-8 sm:p-10 text-white relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Chamber Statutory Accreditation Standard</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  GCCI Statutory Due Diligence & Accreditation Framework
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Replacing informal counterparty risk with audited multi-tier statutory verification conducted by GCCI compliance officers and Gambian regulatory authorities.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setActiveTab('about')}
                  className="px-4 py-2 text-xs font-bold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <span>Verification Standards</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition-colors shadow-xs"
                >
                  Apply for Accreditation
                </button>
              </div>
            </div>
          </div>

          {/* 3 Due Diligence Tiers with Pristine GCCI Styling */}
          <div className="p-8 sm:p-10 space-y-8 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tier 1 Card - GCCI Blue Baseline */}
              <div className="bg-blue-50/40 rounded-2xl p-6 border border-blue-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-blue-100 text-[#0B42A0] rounded text-[11px] font-bold uppercase tracking-wider">
                      Tier 1
                    </span>
                    <span className="text-[11px] text-blue-900 font-semibold">Entry Statutory Baseline</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Basic Statutory Checked</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Confirms legal incorporation under Gambian law. Required for official directory publication and public tender notifications.
                  </p>
                  <div className="pt-2 border-t border-blue-200/80 space-y-2 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#0B42A0] shrink-0 mt-0.5" />
                      <span>Ministry of Justice Registration (GM-CO format)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#0B42A0] shrink-0 mt-0.5" />
                      <span>Active GRA Tax Identification Number (TIN)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#0B42A0] shrink-0 mt-0.5" />
                      <span>Valid GRA Annual Tax Clearance Certificate 2026</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-blue-200 text-[11px] text-[#0B42A0] font-semibold">
                  Entitlement: Directory Profile & RFP Access
                </div>
              </div>

              {/* Tier 2 Card - GCCI Forestry Green Commercial */}
              <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-300 flex flex-col justify-between space-y-4 relative shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-[#005A36] text-white rounded text-[11px] font-bold uppercase tracking-wider">
                      Tier 2
                    </span>
                    <span className="text-[11px] text-[#005A36] font-bold">Commercial Qualified</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Enhanced Due Diligence (EDD)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Comprehensive fiscal, employee, and physical operational verification for domestic commercial suppliers and contractors.
                  </p>
                  <div className="pt-2 border-t border-emerald-200 space-y-2 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#005A36] shrink-0 mt-0.5" />
                      <span>3-Year Audited Financial Statements</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#005A36] shrink-0 mt-0.5" />
                      <span>SSHFC Social Security Employee Contributions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#005A36] shrink-0 mt-0.5" />
                      <span>Physical Premises & Processing Facility Audit</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-emerald-200 text-[11px] text-[#005A36] font-bold">
                  Entitlement: Direct Corporate RFQ Bidding & Quoting
                </div>
              </div>

              {/* Tier 3 Card - GCCI Sovereign Gold Exporter */}
              <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-300 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded text-[11px] font-black uppercase tracking-wider">
                      Tier 3
                    </span>
                    <span className="text-[11px] text-amber-900 font-bold">Sovereign Export Tier</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Gold Sovereign Exporter</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Elite accreditation for major commodity exporters, international trade houses, and infrastructure concessionaires.
                  </p>
                  <div className="pt-2 border-t border-amber-200 space-y-2 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>National FSQA Food Hygiene or GPA Port Clearance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>GCCI Electronic Certificate of Origin (COO) Issuance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>Foreign Exchange & Central Bank Compliance</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-amber-200 text-[11px] text-amber-900 font-bold">
                  Entitlement: ECOWAS/Global Export Corridors & Deal Rooms
                </div>
              </div>
            </div>

            {/* Constitutional Clause Note */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-[#005A36] shrink-0" />
                <span>
                  <strong>GCCI Governance Principle (Section 7.3):</strong> Subscription fees provide platform operational features but never bypass statutory due diligence. All accreditation badges require audited documentary evidence.
                </span>
              </div>
              <button
                onClick={() => openAuthModal('register')}
                className="px-4 py-2 bg-[#0B42A0] hover:bg-[#002E7A] text-white font-semibold rounded-lg shrink-0 transition-colors shadow-xs"
              >
                Apply for Accreditation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION B: INTERACTIVE GCCI CERTIFICATE OF ORIGIN & ACCREDITATION VERIFIER */}
      <section id="verifier" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl border border-blue-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-100">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0B42A0]/10 text-[#0B42A0] rounded-full text-xs font-bold">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Public Verification Registry</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                GCCI Certificate of Origin (COO) & Business Accreditation Verifier
              </h2>
              <p className="text-xs text-slate-600 max-w-2xl">
                Verify statutory validity, GRA tax compliance, and chamber accreditation of any Gambian company or export consignment in real-time.
              </p>
            </div>

            {/* Quick Sample Queries */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Quick Verify:</span>
              <button
                onClick={() => { setVerifierQuery('GM-CO-2017-0842'); setVerifierSearched(true); }}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:border-[#0B42A0] text-slate-700 rounded-lg font-mono-numbers transition-colors"
              >
                GM-CO-2017-0842 (Cashew)
              </button>
              <button
                onClick={() => { setVerifierQuery('TIN-984210384'); setVerifierSearched(true); }}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:border-[#0B42A0] text-slate-700 rounded-lg font-mono-numbers transition-colors"
              >
                TIN-984210384
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={verifierQuery}
                onChange={e => { setVerifierQuery(e.target.value); setVerifierSearched(true); }}
                placeholder="Enter Certificate of Origin No, Registration No, or GRA TIN (e.g. GM-CO-2017-0842)..."
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B42A0] focus:ring-1 focus:ring-[#0B42A0]"
              />
            </div>
            <button
              onClick={() => setVerifierSearched(true)}
              className="px-6 py-3 bg-[#0B42A0] hover:bg-[#002E7A] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Legal Status</span>
            </button>
          </div>

          {/* Verification Result Card */}
          {verifierSearched && verifiedEntity && (
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#005A36] flex items-center justify-center font-bold text-lg">
                    <CheckCircle2 className="w-7 h-7 text-[#005A36]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-slate-900">{verifiedEntity.name}</h3>
                      <span className="px-2 py-0.5 bg-emerald-100 text-[#005A36] rounded text-[10px] font-bold">
                        STATUTORILY VALID
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Reg: <span className="font-mono-numbers font-semibold text-slate-800">{verifiedEntity.registrationNumber}</span> · TIN: <span className="font-mono-numbers font-semibold text-slate-800">{verifiedEntity.tinNumber}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-100 sm:pl-4">
                  <span className="text-[11px] text-slate-400 block">Accreditation Standing</span>
                  <span className="text-xs font-bold text-[#005A36]">
                    {verifiedEntity.dueDiligence?.diligenceLevel || 'Tier 2: Enhanced Due Diligence'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">GRA Tax Clearance</span>
                  <span className="font-bold text-slate-800">2026 Certified Clean</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">Certificate of Origin Status</span>
                  <span className="font-bold text-[#0B42A0]">Active Sovereign Issuer</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">Auditing Authority</span>
                  <span className="font-bold text-slate-800">GCCI Compliance Dept</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">Dossier Reference</span>
                  <span className="font-bold font-mono-numbers text-slate-800">{verifiedEntity.dueDiligence?.dossierReference || 'GCCI-DD-2026-0041'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-slate-500">
                  Last chamber physical site audit conducted on <strong className="text-slate-700">{verifiedEntity.dueDiligence?.lastAuditedAt || '2026-03-12'}</strong>.
                </span>
                <button
                  onClick={() => {
                    onSearchQuery(verifiedEntity.name);
                    setActiveTab('directory');
                  }}
                  className="font-bold text-[#0B42A0] hover:text-[#002E7A] flex items-center gap-1"
                >
                  <span>Open Full Statutory Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* NEW SECTION C: AfCFTA PREFERENTIAL TARIFF & DUTY CALCULATOR */}
      <section id="afcfta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-bold">
                <Calculator className="w-3.5 h-3.5" />
                <span>AfCFTA & ECOWAS Trade Calculator</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Calculate Export Tariff Savings Under GCCI Rules of Origin
              </h2>
              <p className="text-xs text-slate-400">
                Estimate customs tariff elimination across West Africa and the continent under the African Continental Free Trade Area.
              </p>
            </div>

            <div className="text-xs text-slate-400">
              Zero-Duty Corridor: <strong className="text-emerald-400 font-semibold">ECOWAS ETLS & AfCFTA Certified</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Interactive Inputs */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Gambian Export Commodity:
                </label>
                <select
                  value={afcftaProduct}
                  onChange={e => setAfcftaProduct(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="cashew">Organic Raw Cashew Nuts (KOR 50) - 18 MT FCL</option>
                  <option value="seafood">Atlantic White Shrimp & Sole (Blast Frozen) - 40ft Reefer</option>
                  <option value="oil">Cold-Pressed Groundnut Oil & Cake - 20ft Tank</option>
                  <option value="mangoes">Fresh Keitt Mangoes & Horticultural Produce - Airfreight</option>
                  <option value="concrete">Precast Concrete & Infrastructure Pavers - Road Convoy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Destination Corridor / African Port:
                </label>
                <select
                  value={afcftaDestination}
                  onChange={e => setAfcftaDestination(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="senegal">Senegal (Dakar Port / Karang Corridor) - ECOWAS ETLS 0%</option>
                  <option value="ghana">Ghana (Tema Port / Takoradi) - AfCFTA Preferential 0%</option>
                  <option value="nigeria">Nigeria (Lagos / Apapa Port) - AfCFTA Preferential 0%</option>
                  <option value="ivorycoast">Cote d'Ivoire (Abidjan) - AfCFTA Preferential 0%</option>
                  <option value="kenya">Kenya (Mombasa Port) - AfCFTA Guided Trade 0%</option>
                </select>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 text-xs">
                <span className="font-semibold text-amber-400 block">Required GCCI Export Documentation:</span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {selectedEstimate.requiredDocs.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div>
                  <span className="text-[11px] text-slate-400 block">Consignment Value</span>
                  <span className="text-xl font-bold font-mono-numbers text-white">
                    ${selectedEstimate.baseValUSD.toLocaleString()} USD
                  </span>
                  <span className="text-[11px] text-slate-400"> (D{(selectedEstimate.baseValUSD * 68).toLocaleString()} GMD)</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Applicable Tariff</span>
                  <span className="text-lg font-bold font-mono-numbers text-emerald-400">
                    0.0% <span className="line-through text-rose-400 text-xs font-normal">({selectedEstimate.standardMfn}%)</span>
                  </span>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-200 font-semibold block">Net Customs Tariff Saved:</span>
                  <span className="text-2xl font-extrabold font-mono-numbers text-emerald-400">
                    ${dutySavedUSD.toLocaleString()} USD
                  </span>
                  <span className="text-xs font-mono-numbers text-emerald-300 block">
                    ≈ D{dutySavedGMD.toLocaleString()} GMD per consignment
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-900 text-emerald-300 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Issued under GCCI Statutory Powers (Act 1978).
                </span>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Apply for Certificate of Origin
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION D: GCCI TRADE MISSIONS & BILATERAL DELEGATIONS CALENDAR */}
      <section id="missions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#005A36]/10 text-[#005A36] rounded-full text-xs font-bold mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>GCCI Bilateral Program 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Upcoming GCCI Trade Missions & Regional Summits
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Join official trade delegations, meet international trade ministers, and negotiate cross-border partnerships.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('opportunities')}
            className="text-xs font-semibold text-[#0B42A0] hover:text-[#002E7A] flex items-center gap-1"
          >
            <span>View All Tenders & Missions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Registered Banner Notification */}
        {registeredEvent && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-[#005A36] flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#005A36] shrink-0" />
              <span>
                <strong>Interest Registered:</strong> Your company profile has been submitted to the GCCI International Trade Directorate for <em>{registeredEvent}</em>. A briefing packet will be dispatched to your email.
              </span>
            </div>
            <button 
              onClick={() => setRegisteredEvent(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tradeMissions.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-[#0B42A0] rounded text-[11px] font-bold">
                    {event.badge}
                  </span>
                  <span className="text-[11px] font-mono-numbers text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {event.date}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  {event.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {event.focus}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{event.participants}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-700">
                  {event.status}
                </span>
                <button
                  onClick={() => setRegisteredEvent(event.title)}
                  className="px-4 py-2 bg-[#0B42A0] hover:bg-[#002E7A] text-white font-bold rounded-lg transition-colors shadow-xs"
                >
                  Register Delegate Interest
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MAJOR INDUSTRY CATEGORIES IN THE GAMBIA */}
      <section id="sectors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Sectors & Industry Classifications
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explore key pillars of Gambian commerce, agriculture, and international logistics.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('directory')}
            className="text-xs font-semibold text-[#005A36] hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View All Sectors</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map(cat => (
            <div
              key={cat.id}
              onClick={() => {
                onSearchQuery('', cat.sector);
                setActiveTab('directory');
              }}
              className="p-5 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-[#005A36] group-hover:bg-[#005A36] group-hover:text-white transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono-numbers text-slate-400">
                  {cat.itemCount || 42} items
                </span>
              </div>
              <h3 className="font-semibold text-sm text-slate-900 group-hover:text-[#005A36] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED GAMBIAN COMMERCIAL ENTERPRISES: EXPORTERS & PRODUCERS (HARMONIZED COLORS) */}
      <section id="enterprises" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Featured Gambian Commercial Enterprises
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Audited enterprises holding statutory legal incorporation, GRA tax clearance, and GCCI accreditation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Segment Switcher with GCCI Brand Colors */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFeaturedTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${featuredTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All Enterprises
              </button>
              <button
                onClick={() => setFeaturedTab('exporters')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${featuredTab === 'exporters' ? 'bg-blue-100 text-[#0B42A0] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Ship className="w-3.5 h-3.5 text-[#0B42A0]" />
                <span>Certified Exporters</span>
              </button>
              <button
                onClick={() => setFeaturedTab('producers')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${featuredTab === 'producers' ? 'bg-emerald-100 text-[#005A36] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#005A36]" />
                <span>Producers & Manufacturers</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('directory')}
              className="text-xs font-semibold text-[#0B42A0] hover:text-[#002E7A] hidden sm:flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedBusinesses.map(biz => {
            const isExporter = biz.verificationLevel === 'Gold Certified Exporter' || 
              biz.dueDiligence?.diligenceLevel === 'Tier 3: Gold Sovereign Exporter' || 
              biz.capabilities.some(c => c.toLowerCase().includes('export'));

            return (
              <div
                key={biz.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {biz.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{biz.category}</p>
                    </div>
                    {isExporter ? (
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#0B42A0] border border-blue-200 rounded text-[11px] font-bold shrink-0">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Certified Exporter</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-[#005A36] border border-emerald-200 rounded text-[11px] font-bold shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#005A36]" />
                        <span>Verified Producer</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {biz.description}
                  </p>

                  {/* Export or Production Highlight Banner */}
                  {isExporter ? (
                    <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200/80 text-[11px] text-blue-900 flex items-center gap-2 font-medium">
                      <Globe className="w-4 h-4 text-[#0B42A0] shrink-0" />
                      <span>GCCI Certificate of Origin Ready · Cross-Border Trade</span>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center gap-2 font-medium">
                      <Building2 className="w-4 h-4 text-[#005A36] shrink-0" />
                      <span>Domestic Gambian Manufacturer · Tender Qualified</span>
                    </div>
                  )}

                  {/* Capabilities list */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {isExporter ? 'Export Commodities & Specs' : 'Core Capabilities'}
                    </p>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {biz.capabilities.slice(0, 2).map((cap, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[140px]">{biz.region}</span>
                  </div>
                  <button
                    onClick={() => {
                      onSearchQuery(biz.name);
                      setActiveTab('directory');
                    }}
                    className="font-bold text-[#0B42A0] hover:text-[#002E7A] flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. LATEST SOURCING OPPORTUNITIES & PROCUREMENT TENDERS */}
      <section id="tenders" className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Current Commercial Procurement Opportunities
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Active tenders and RFQs published by commercial buyers, government agencies, and regional consortiums.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('opportunities')}
              className="text-xs font-semibold text-[#005A36] hover:text-emerald-950 flex items-center gap-1"
            >
              <span>View All Opportunities</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestOpportunities.map(opp => (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-[#005A36]">{opp.category}</span>
                    <span className="font-mono-numbers">Closing {opp.closingDate}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-lg space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Buyer:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[170px]">{opp.buyerOrg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimated Budget:</span>
                      <span className="font-bold text-slate-900 font-mono-numbers">
                        D{(opp.budgetMax ? (opp.budgetMax / 1000000).toFixed(2) : '0')}M {opp.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Delivery Location:</span>
                      <span className="text-slate-700 truncate max-w-[170px]">{opp.deliveryLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono-numbers">
                    {opp.responsesCount} bids submitted
                  </span>
                  <button
                    onClick={() => setActiveTab('opportunities')}
                    className="px-3 py-1.5 bg-[#005A36] text-white font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
                  >
                    Review & Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION STRIP - GCCI EXECUTIVE NAVY & EMERALD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-[#002E7A] to-[#005A36] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Empowering Gambian Commerce Since 1978
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Ready to Expand Your Business Across The Gambia and West Africa?
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Register your enterprise today, submit your statutory documents for GCCI accreditation, and connect directly with certified procurement buyers and institutional investors.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => openAuthModal('register')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md"
              >
                Register an Enterprise
              </button>
              <button
                onClick={() => setActiveTab('opportunities')}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs rounded-xl transition-colors"
              >
                Find Sourcing RFQs
              </button>
              <button
                onClick={() => setActiveTab('membership')}
                className="px-5 py-3 bg-transparent text-emerald-300 border border-emerald-500/40 font-semibold text-xs rounded-xl hover:text-white transition-colors"
              >
                View Membership Plans
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
