import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SourcingOpportunity, SupplierResponse } from '../../types';
import { getRecommendedSuppliersForOpportunity } from '../../utils/matchingEngine';
import { DealRoomWorkspace } from './DealRoomWorkspace';
import { 
  ShoppingBag, 
  Plus, 
  FileText, 
  CheckCircle, 
  Users, 
  Clock, 
  DollarSign, 
  MapPin, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  Eye,
  CheckSquare,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

interface BuyerPortalProps {
  setActiveTab?: (tab: string) => void;
}

export const BuyerPortal: React.FC<BuyerPortalProps> = ({ setActiveTab }) => {
  const { 
    currentUser, 
    opportunities, 
    responses, 
    businesses, 
    products, 
    createOpportunity, 
    updateResponseStatus, 
    createDealRoom,
    dealRooms
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'my_rfps' | 'create_rfp' | 'compare_quotes' | 'dealrooms'>('dashboard');
  const [selectedOppId, setSelectedOppId] = useState<string>(opportunities[0]?.id || '');
  const [activeDealRoomId, setActiveDealRoomId] = useState<string | null>(null);

  // New RFP form state
  const [rfpTitle, setRfpTitle] = useState('');
  const [rfpCategory, setRfpCategory] = useState('Agribusiness & Food Processing');
  const [rfpSector, setRfpSector] = useState('Agriculture');
  const [rfpDesc, setRfpDesc] = useState('');
  const [rfpSpecs, setRfpSpecs] = useState('');
  const [rfpQuantity, setRfpQuantity] = useState<number>(100);
  const [rfpUnit, setRfpUnit] = useState('Units');
  const [rfpLocation, setRfpLocation] = useState('Kanifing Industrial Depot, KMC');
  const [rfpDeadline, setRfpDeadline] = useState('2026-12-01');
  const [rfpBudgetMax, setRfpBudgetMax] = useState<number>(1000000);
  const [rfpCriteria, setRfpCriteria] = useState('GCCI Verified Business, Valid GRA Tax Clearance 2026');
  const [rfpCreatedSuccess, setRfpCreatedSuccess] = useState(false);

  const selectedOpp = opportunities.find(o => o.id === selectedOppId) || opportunities[0];
  const oppResponses = responses.filter(r => r.opportunityId === selectedOpp?.id);
  const recommendedSuppliers = selectedOpp ? getRecommendedSuppliersForOpportunity(selectedOpp, businesses, products) : [];

  const handleCreateRFP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfpTitle || !rfpDesc) return;

    const newOpp = createOpportunity({
      buyerId: currentUser.id,
      buyerName: currentUser.fullName,
      buyerOrg: currentUser.organization || currentUser.businessName || 'National Procurement Entity',
      buyerVerified: true,
      buyerRegion: 'Banjul',
      title: rfpTitle,
      category: rfpCategory,
      sector: rfpSector,
      description: rfpDesc,
      requiredSpecs: rfpSpecs || rfpDesc,
      quantity: Number(rfpQuantity),
      unit: rfpUnit,
      deliveryLocation: rfpLocation,
      requiredDeliveryDate: rfpDeadline,
      budgetMin: Math.round(rfpBudgetMax * 0.8),
      budgetMax: Number(rfpBudgetMax),
      currency: 'GMD',
      eligibilityCriteria: rfpCriteria.split(',').map(s => s.trim()).filter(Boolean),
      openingDate: new Date().toISOString().slice(0, 10),
      closingDate: rfpDeadline,
      visibility: 'public',
      status: 'published'
    });

    setRfpCreatedSuccess(true);
    setSelectedOppId(newOpp.id);
    setTimeout(() => {
      setRfpCreatedSuccess(false);
      setActiveSubTab('my_rfps');
    }, 1500);
  };

  const handleLaunchProcurementRoom = (resp: SupplierResponse) => {
    const targetBiz = businesses.find(b => b.id === resp.supplierId);
    const room = createDealRoom({
      title: `Procurement Negotiation: ${selectedOpp.title}`,
      originatingType: 'sourcing',
      originatingId: selectedOpp.id,
      targetUserId: targetBiz ? targetBiz.ownerId : 'user-supplier',
      targetUserName: resp.supplierName,
      targetBusinessName: resp.supplierName,
      initialMessage: `Greetings from ${currentUser.fullName} (${currentUser.organization}). We have reviewed your formal quotation of D${resp.totalProposedPrice.toLocaleString()} ${resp.currency} for "${selectedOpp.title}". We would like to finalize commercial delivery dates and contract terms.`
    });

    updateResponseStatus(resp.id, 'negotiating');
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
    <div className="gcci-portal-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Buyer Header */}
      <div className="gcci-portal-heading bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Procurement Directorate
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            {currentUser.organization || 'Procurement Management Portal'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Officer: <strong className="text-slate-800">{currentUser.fullName}</strong> · Sourcing across verified suppliers in The Gambia & ECOWAS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('create_rfp')}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Sourcing RFP</span>
          </button>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="gcci-portal-tabs flex border-b border-slate-200 px-1 text-xs font-medium text-slate-600 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Procurement Dashboard' },
          { id: 'my_rfps', label: `Published Tenders (${opportunities.length})` },
          { id: 'create_rfp', label: 'Create New Sourcing RFP' },
          { id: 'compare_quotes', label: `Quotation Comparison (${oppResponses.length} Bids)` }
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

      {/* 1. BUYER DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="gcci-metric-card p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block">Published RFPs</span>
              <p className="text-2xl font-bold text-slate-900 font-mono-numbers mt-1">
                {opportunities.length} <span className="text-xs font-normal text-slate-500">Tenders</span>
              </p>
              <span className="text-[11px] text-emerald-700 mt-1 block">Active on Exchange</span>
            </div>

            <div className="gcci-metric-card p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block">Supplier Quotes</span>
              <p className="text-2xl font-bold text-slate-900 font-mono-numbers mt-1">
                {responses.length} <span className="text-xs font-normal text-slate-500">Bids</span>
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Awaiting review</span>
            </div>

            <div className="gcci-metric-card p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block">Shortlisted Bidders</span>
              <p className="text-2xl font-bold text-emerald-800 font-mono-numbers mt-1">
                {responses.filter(r => r.status === 'shortlisted' || r.status === 'negotiating').length}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">In commercial discussion</span>
            </div>

            <div className="gcci-metric-card p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 block">Procurement Value</span>
              <p className="text-2xl font-bold text-emerald-800 font-mono-numbers mt-1">
                D{(opportunities.reduce((acc, o) => acc + (o.budgetMax || 0), 0) / 1000000).toFixed(1)}M
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block font-mono-numbers">GMD total budget</span>
            </div>
          </div>

          {/* Quick Tender List */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Active Sourcing Requirements</h3>
            <div className="space-y-3">
              {opportunities.map(opp => (
                <div
                  key={opp.id}
                  className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-800">{opp.category}</span>
                      <span>·</span>
                      <span className="text-rose-700 font-mono-numbers">Closing {opp.closingDate}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{opp.title}</h4>
                    <p className="text-slate-500">{opp.deliveryLocation} · Budget: D{opp.budgetMax?.toLocaleString()} GMD</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-numbers font-semibold text-slate-700">
                      {opp.responsesCount} supplier quotations
                    </span>
                    <button
                      onClick={() => { setSelectedOppId(opp.id); setActiveSubTab('compare_quotes'); }}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                    >
                      Compare Bids →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PUBLISHED RFPS LIST */}
      {activeSubTab === 'my_rfps' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Published Sourcing Requirements</h3>
            <button
              onClick={() => setActiveSubTab('create_rfp')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Tender</span>
            </button>
          </div>

          <div className="space-y-4">
            {opportunities.map(opp => (
              <div key={opp.id} className="bg-white p-5 rounded-lg border border-slate-200 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800">{opp.category}</span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">{opp.title}</h4>
                  </div>
                  <div className="text-right font-mono-numbers">
                    <span className="text-slate-400 block text-[10px]">Budget Ceiling</span>
                    <span className="text-sm font-bold text-slate-900">
                      D{opp.budgetMax?.toLocaleString()} {opp.currency}
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed">{opp.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-mono-numbers text-slate-500">
                    Quantity: {opp.quantity} {opp.unit} · Location: {opp.deliveryLocation}
                  </span>
                  <button
                    onClick={() => { setSelectedOppId(opp.id); setActiveSubTab('compare_quotes'); }}
                    className="font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    <span>View {opp.responsesCount} Received Quotations</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CREATE SOURCING REQUIREMENT WIZARD (Section 10.1) */}
      {activeSubTab === 'create_rfp' && (
        <form onSubmit={handleCreateRFP} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-5 text-xs max-w-3xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Publish Commercial Sourcing Requirement (RFP)</h3>
            <p className="text-slate-500 mt-0.5">Broadcast your purchasing needs to verified Gambian suppliers and producers.</p>
          </div>

          {rfpCreatedSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-2 font-semibold">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
              <span>Sourcing opportunity published successfully! Suppliers will receive matching alerts.</span>
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">RFP / Tender Title</label>
            <input
              type="text"
              required
              value={rfpTitle}
              onChange={e => setRfpTitle(e.target.value)}
              placeholder="e.g. Supply of 200 Metric Tonnes of Certified Groundnut Seeds"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Sector Classification</label>
              <select
                value={rfpCategory}
                onChange={e => setRfpCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="Agribusiness & Food Processing">Agribusiness & Food Processing</option>
                <option value="Fisheries & Marine Resources">Fisheries & Marine Resources</option>
                <option value="Construction & Real Estate">Construction & Infrastructure</option>
                <option value="Energy & Renewable Systems">Energy & Solar</option>
                <option value="Logistics, Port & Transport">Logistics & Port Freight</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Delivery Location in The Gambia</label>
              <input
                type="text"
                required
                value={rfpLocation}
                onChange={e => setRfpLocation(e.target.value)}
                placeholder="e.g. Banjul Port Terminal / Brikama Warehouse"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Required Quantity</label>
              <input
                type="number"
                required
                value={rfpQuantity}
                onChange={e => setRfpQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-numbers"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Unit of Measurement</label>
              <input
                type="text"
                required
                value={rfpUnit}
                onChange={e => setRfpUnit(e.target.value)}
                placeholder="Metric Tonnes / Bags / Pieces"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Budget Ceiling (GMD)</label>
              <input
                type="number"
                required
                value={rfpBudgetMax}
                onChange={e => setRfpBudgetMax(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-numbers"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Required Delivery Completion Date</label>
            <input
              type="date"
              required
              value={rfpDeadline}
              onChange={e => setRfpDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-numbers"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Detailed Technical Specifications</label>
            <textarea
              rows={3}
              required
              value={rfpSpecs}
              onChange={e => setRfpSpecs(e.target.value)}
              placeholder="State purity, outturn, moisture limits, packaging size, technical standards..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Supplier Mandatory Eligibility Criteria (comma separated)</label>
            <input
              type="text"
              value={rfpCriteria}
              onChange={e => setRfpCriteria(e.target.value)}
              placeholder="GCCI Verified Business, GRA Tax Clearance 2026, FSQA Food Handler license..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shadow-xs"
            >
              Broadcast Opportunity to Exchange
            </button>
          </div>
        </form>
      )}

      {/* 4. COMPARE QUOTATIONS SIDE-BY-SIDE (Section 10.4) & MATCHING RECOMMENDATIONS (Section 11) */}
      {activeSubTab === 'compare_quotes' && (
        <div className="space-y-6">
          {/* Opportunity selector */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Evaluating Tender:</span>
              <select
                value={selectedOppId}
                onChange={e => setSelectedOppId(e.target.value)}
                className="py-1.5 px-3 border border-slate-300 rounded-lg font-bold text-slate-900 bg-white"
              >
                {opportunities.map(o => (
                  <option key={o.id} value={o.id}>{o.title}</option>
                ))}
              </select>
            </div>
            <div className="font-mono-numbers text-slate-500">
              Budget: <strong>D{selectedOpp?.budgetMax?.toLocaleString()} GMD</strong> · Closing: {selectedOpp?.closingDate}
            </div>
          </div>

          {/* Quotations comparison table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Supplier Responses & Binding Quotations ({oppResponses.length})
              </h3>
              <p className="text-xs text-slate-500">Side-by-side technical and price compliance.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Supplier</th>
                    <th className="py-3 px-4 font-mono-numbers">Proposed Price</th>
                    <th className="py-3 px-4 font-mono-numbers">Offered Qty</th>
                    <th className="py-3 px-4 font-mono-numbers">Lead Time</th>
                    <th className="py-3 px-4">Compliance & Accreditations</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {oppResponses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No quotations received yet for this requirement. Review recommended suppliers below to invite them.
                      </td>
                    </tr>
                  ) : (
                    oppResponses.map(resp => (
                      <tr key={resp.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span>{resp.supplierName}</span>
                            {resp.supplierVerified && (
                              <span title="GCCI Verified">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-normal">{resp.supplierRegion}</span>
                        </td>
                        <td className="py-3 px-4 font-mono-numbers font-bold text-emerald-900">
                          D{resp.totalProposedPrice.toLocaleString()} {resp.currency}
                        </td>
                        <td className="py-3 px-4 font-mono-numbers">{resp.offeredQuantity} {resp.unit}</td>
                        <td className="py-3 px-4 font-mono-numbers">{resp.deliveryDays} days</td>
                        <td className="py-3 px-4 max-w-[200px] truncate" title={resp.complianceNotes}>
                          {resp.complianceNotes}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold text-[10px] capitalize">
                            {resp.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleLaunchProcurementRoom(resp)}
                            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs text-xs whitespace-nowrap"
                          >
                            Open Deal Room →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transparent Rules-Based Recommended Suppliers Section (Section 11) */}
          <div className="space-y-3 pt-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Explainable Supplier Matching Recommendations
              </h3>
              <p className="text-xs text-slate-500">
                Ranked using GCCI multi-factor criteria: sector capabilities, geographic proximity, statutory verification, and accreditations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedSuppliers.slice(0, 4).map(rec => (
                <div
                  key={rec.supplier.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">{rec.supplier.name}</h4>
                        {rec.supplier.verificationStatus === 'verified' && (
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold font-mono-numbers">
                        <span>{rec.score}% Match</span>
                      </div>
                    </div>

                    <p className="text-slate-600 line-clamp-2">{rec.supplier.description}</p>

                    {/* Factor Breakdown */}
                    <div className="space-y-1 pt-2 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Matching Explanations
                      </span>
                      {rec.factors.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${f.matched ? 'bg-emerald-600' : 'bg-slate-300'}`}></span>
                          <strong className={f.matched ? 'text-slate-800' : 'text-slate-400'}>{f.factor}:</strong>
                          <span className="text-slate-500 truncate">{f.explanation}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono-numbers">{rec.supplier.region}</span>
                    <button
                      onClick={() => {
                        const room = createDealRoom({
                          title: `Procurement Invitation: ${selectedOpp.title}`,
                          originatingType: 'sourcing',
                          originatingId: selectedOpp.id,
                          targetUserId: rec.supplier.ownerId,
                          targetUserName: rec.supplier.name,
                          targetBusinessName: rec.supplier.name,
                          initialMessage: `Invitation to bid on RFP "${selectedOpp.title}". We evaluated your company profile on GCCI Business Exchange and identified a ${rec.score}% match with our requirements.`
                        });
                        setActiveDealRoomId(room.id);
                      }}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs"
                    >
                      Invite to Bid in Deal Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
