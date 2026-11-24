import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvestmentOpportunity, IntroductionRequest } from '../../types';
import { DealRoomWorkspace } from './DealRoomWorkspace';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Lock, 
  FileText, 
  CheckCircle, 
  Users, 
  MapPin, 
  Briefcase, 
  ChevronRight,
  ArrowRight,
  Building2,
  Clock,
  X
} from 'lucide-react';

interface InvestorPortalProps {
  setActiveTab?: (tab: string) => void;
}

export const InvestorPortal: React.FC<InvestorPortalProps> = ({ setActiveTab }) => {
  const { 
    investments, 
    currentUser, 
    investorProfile, 
    introductionRequests, 
    requestIntroduction, 
    dealRooms,
    createDealRoom,
    businesses
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'opportunities' | 'my_requests' | 'preferences'>('dashboard');
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentOpportunity | null>(null);
  const [activeDealRoomId, setActiveDealRoomId] = useState<string | null>(null);

  // Request intro modal state
  const [introMessage, setIntroMessage] = useState('');
  const [ndaChecked, setNdaChecked] = useState(false);
  const [introSubmitted, setIntroSubmitted] = useState(false);

  // Sector filter
  const [sectorFilter, setSectorFilter] = useState('all');

  const myRequests = introductionRequests.filter(r => r.investorId === currentUser.id);

  const filteredInvestments = investments.filter(inv => {
    if (inv.status === 'draft' || inv.status === 'closed') return false;
    if (sectorFilter !== 'all' && !inv.sector.toLowerCase().includes(sectorFilter.toLowerCase())) return false;
    return true;
  });

  const handleSendIntroRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvestment || !ndaChecked) return;

    requestIntroduction(selectedInvestment.id, introMessage);
    setIntroSubmitted(true);
    setTimeout(() => {
      setIntroSubmitted(false);
      setSelectedInvestment(null);
      setIntroMessage('');
      setNdaChecked(false);
    }, 1500);
  };

  const handleOpenInvestorDealRoom = (inv: InvestmentOpportunity) => {
    const biz = businesses.find(b => b.id === inv.businessId);
    const room = createDealRoom({
      title: `Investment Facilitation: ${inv.investmentObjective}`,
      originatingType: 'investment',
      originatingId: inv.id,
      targetUserId: biz ? biz.ownerId : 'user-founder',
      targetUserName: inv.businessName,
      targetBusinessName: inv.businessName,
      initialMessage: `Introduction from ${currentUser.fullName} (${currentUser.organization || 'Accredited Investor'}). We are reviewing the funding requirement of D${inv.fundingRequired.toLocaleString()} ${inv.currency} for "${inv.investmentObjective}". Let's arrange an introductory diligence session.`
    });

    setActiveDealRoomId(room.id);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Investor Portal Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Accredited Investment Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            {investorProfile.organization || 'West Africa Capital Desk'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Partner: <strong className="text-slate-800">{currentUser.fullName}</strong> · Focus: {investorProfile.preferredSectors.join(', ')}
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono-numbers">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Ticket Mandate</span>
            <span className="text-sm font-bold text-emerald-900">
              D{(investorProfile.ticketMinGMD / 1000000).toFixed(1)}M – D{(investorProfile.ticketMaxGMD / 1000000).toFixed(1)}M GMD
            </span>
          </div>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex border-b border-slate-200 px-1 text-xs font-medium text-slate-600 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Investor Dashboard' },
          { id: 'opportunities', label: `Investment Opportunities (${filteredInvestments.length})` },
          { id: 'my_requests', label: `Introduction Requests (${myRequests.length})` },
          { id: 'preferences', label: 'Investment Mandate' }
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

      {/* 1. INVESTOR DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block">Active Pipeline</span>
              <p className="text-2xl font-bold text-slate-900 font-mono-numbers mt-1">
                {investments.length} <span className="text-xs font-normal text-slate-500">Deals</span>
              </p>
              <span className="text-[11px] text-emerald-700 mt-1 block">Vetted by GCCI Trade Desk</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block">Total Capital Demand</span>
              <p className="text-2xl font-bold text-slate-900 font-mono-numbers mt-1">
                D{(investments.reduce((acc, i) => acc + i.fundingRequired, 0) / 1000000).toFixed(1)}M
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block font-mono-numbers">GMD growth capital</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block">My Introductions</span>
              <p className="text-2xl font-bold text-emerald-800 font-mono-numbers mt-1">
                {myRequests.length} <span className="text-xs font-normal text-slate-500">Active</span>
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">NDA executed</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block">Accreditation</span>
              <p className="text-xl font-bold text-emerald-800 mt-1">
                GCCI Verified
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Institutional Partner</span>
            </div>
          </div>

          {/* Featured Investment Showcase using meeting photography */}
          <div className="bg-slate-900 text-white rounded-2xl overflow-hidden shadow-xl border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 relative aspect-4/3 lg:aspect-auto">
                <img
                  src="/src/assets/images/investor_meeting_deal_room_1792068733134.jpg"
                  alt="West African Executive Commercial Negotiation"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-semibold">
                      Featured Gambian Growth Deal
                    </span>
                    <span className="text-xs text-slate-400">Agribusiness Value-Addition</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Automated Industrial Cashew Deshelling Facility Expansion
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Kanifing industrial expansion to process 10 MT/day of raw cashew nuts for direct AGOA/EBA duty-free export to European and US buyers. Projected to double net profit margin.
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-mono-numbers">
                    <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Capital Required</span>
                      <span className="font-bold text-emerald-400 text-sm">D14,500,000 GMD</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Structure</span>
                      <span className="font-bold text-white text-sm">18% Equity</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Annual Revenue</span>
                      <span className="font-bold text-white text-sm">D38.4M GMD</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Enterprise: Gambia Cashew & Agro-Processing Ltd</span>
                  <button
                    onClick={() => {
                      const inv = investments.find(i => i.id === 'inv-01') || investments[0];
                      setSelectedInvestment(inv);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm"
                  >
                    Request Confidential Diligence
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. INVESTMENT OPPORTUNITIES DIRECTORY */}
      {activeSubTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Curated Gambian Investment Pipeline</h3>
              <p className="text-slate-500">Enterprises seeking growth capital, equipment debt, or export trade financing.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">Filter Sector:</span>
              <select
                value={sectorFilter}
                onChange={e => setSectorFilter(e.target.value)}
                className="py-1.5 px-3 border border-slate-300 rounded-lg bg-white text-xs text-slate-800"
              >
                <option value="all">All Sectors</option>
                <option value="Agribusiness">Agribusiness & Food</option>
                <option value="Energy">Energy & Solar</option>
                <option value="Logistics">Logistics & Port</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInvestments.map(inv => (
              <div
                key={inv.id}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-800">{inv.sector}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold text-[11px]">
                      {inv.businessStage} Stage
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base leading-snug">
                    {inv.investmentObjective}
                  </h4>

                  <p className="text-slate-600 line-clamp-3 leading-relaxed">
                    {inv.pitchSummary}
                  </p>

                  {/* Financial Metrics Strip */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 font-mono-numbers">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Funding Target</span>
                      <span className="font-bold text-slate-900 text-xs">
                        D{(inv.fundingRequired / 1000000).toFixed(1)}M {inv.currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Offering</span>
                      <span className="font-bold text-slate-900 text-xs">
                        {inv.equityOfferedPercentage ? `${inv.equityOfferedPercentage}% Equity` : `${inv.debtOfferedRate}% Debt`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Annual Revenue</span>
                      <span className="font-bold text-slate-900 text-xs">
                        D{(inv.annualRevenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{inv.businessName}</span>
                  <button
                    onClick={() => setSelectedInvestment(inv)}
                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                  >
                    Request Diligence / Intro →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. INTRODUCTION REQUESTS */}
      {activeSubTab === 'my_requests' && (
        <div className="space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Your Introduction Requests & Diligence Desks</h3>
            <p className="text-slate-500">Track GCCI introduction requests sent to Gambian enterprise founders.</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Target Company</th>
                  <th className="py-3 px-4">NDA Status</th>
                  <th className="py-3 px-4 font-mono-numbers">Date Requested</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myRequests.map(req => {
                  const inv = investments.find(i => i.id === req.investmentOpportunityId);
                  return (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {req.opportunityTitle}
                      </td>
                      <td className="py-3 px-4">{req.targetBusinessName}</td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          NDA Executed
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono-numbers">{req.requestedAt}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold text-[10px] capitalize">
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (inv) handleOpenInvestorDealRoom(inv);
                          }}
                          className="px-3 py-1.5 bg-emerald-800 text-white font-semibold rounded-lg text-xs"
                        >
                          Open Deal Room
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INTRODUCTION / CONFIDENTIAL ACCESS MODAL */}
      {selectedInvestment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedInvestment(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  GCCI Investment Introduction Desk
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  Request Confidential Diligence: {selectedInvestment.businessName}
                </h3>
              </div>

              {introSubmitted ? (
                <div className="p-4 bg-emerald-800 text-emerald-100 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle className="w-5 h-5" />
                    <span>Introduction Request Dispatched</span>
                  </div>
                  <p>
                    Your accredited mandate has been transmitted to {selectedInvestment.businessName} and the GCCI Investment Facilitation Directorate.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendIntroRequest} className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono-numbers">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Funding Objective:</span>
                      <strong className="text-slate-900">{selectedInvestment.structure}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Capital Requirement:</span>
                      <strong className="text-emerald-900 font-bold">
                        D{selectedInvestment.fundingRequired.toLocaleString()} {selectedInvestment.currency}
                      </strong>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Investor Introduction Message & Scope
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={introMessage}
                      onChange={e => setIntroMessage(e.target.value)}
                      placeholder="Outline your investment fund, previous West African portfolio deals, and proposed diligence timetable..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 space-y-2">
                    <label className="flex items-start gap-2 cursor-pointer font-medium text-[11px]">
                      <input
                        type="checkbox"
                        required
                        checked={ndaChecked}
                        onChange={e => setNdaChecked(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-800"
                      />
                      <span>
                        I execute the GCCI Standard Non-Disclosure Agreement (NDA). I agree to maintain absolute confidentiality over factory audits, financial statements, and proprietary customer lists.
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedInvestment(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!ndaChecked}
                      className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-lg shadow-xs"
                    >
                      Transmit Introduction Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
