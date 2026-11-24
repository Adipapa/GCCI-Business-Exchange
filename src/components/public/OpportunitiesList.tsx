import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SourcingOpportunity, SupplierResponse } from '../../types';
import { calculateSupplierMatch } from '../../utils/matchingEngine';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  CheckCircle, 
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface OpportunitiesListProps {
  onOpenDealRoom?: (opp: SourcingOpportunity) => void;
  openAuthModal?: (mode: 'signin' | 'register') => void;
}

export const OpportunitiesList: React.FC<OpportunitiesListProps> = ({ onOpenDealRoom, openAuthModal }) => {
  const { opportunities, businesses, products, currentUser, submitSupplierResponse } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<SourcingOpportunity | null>(null);
  
  // Quotation Submission Form State
  const [offeredQuantity, setOfferedQuantity] = useState<number>(0);
  const [proposedPricePerUnit, setProposedPricePerUnit] = useState<number>(0);
  const [deliveryDays, setDeliveryDays] = useState<number>(14);
  const [technicalProposal, setTechnicalProposal] = useState('');
  const [complianceNotes, setComplianceNotes] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentBusiness = businesses.find(b => b.ownerId === currentUser.id || b.id === currentUser.businessId);

  const filteredOpportunities = opportunities.filter(opp => {
    if (opp.status !== 'published') return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchDesc = opp.description.toLowerCase().includes(q);
      const matchBuyer = opp.buyerOrg.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchBuyer) return false;
    }

    if (selectedCategory !== 'all' && !opp.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }

    return true;
  });

  const handleOpenBidModal = (opp: SourcingOpportunity) => {
    setSelectedOpportunity(opp);
    setOfferedQuantity(opp.quantity);
    setProposedPricePerUnit(opp.budgetMax ? Math.round(opp.budgetMax / opp.quantity) : 1000);
    setDeliveryDays(21);
    setTechnicalProposal('');
    setComplianceNotes('');
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (currentUser.role === 'visitor') {
      if (openAuthModal) openAuthModal('signin');
      return;
    }

    if (!technicalProposal) {
      setSubmitError('Please provide a technical proposal describing how you will execute this delivery.');
      return;
    }

    if (!selectedOpportunity) return;

    submitSupplierResponse({
      opportunityId: selectedOpportunity.id,
      supplierId: currentBusiness ? currentBusiness.id : currentUser.id,
      supplierName: currentBusiness ? currentBusiness.name : currentUser.fullName,
      supplierVerified: currentBusiness ? currentBusiness.verificationStatus === 'verified' : false,
      supplierRegion: currentBusiness ? currentBusiness.region : 'Kanifing Municipality (KMC)',
      supplierMembershipTier: currentBusiness ? currentBusiness.membershipTier : 'basic',
      offeredQuantity,
      unit: selectedOpportunity.unit,
      proposedPricePerUnit,
      totalProposedPrice: offeredQuantity * proposedPricePerUnit,
      currency: selectedOpportunity.currency,
      deliveryDays,
      technicalProposal,
      complianceNotes: complianceNotes || 'Meets all mandatory RFP criteria'
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setSelectedOpportunity(null);
    }, 1800);
  };

  return (
    <div className="gcci-public-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Header */}
      <div className="gcci-page-heading">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Public Procurement & Sourcing Gateway
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Commercial Sourcing Opportunities & RFQs
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Review active tenders published by Gambian procurement authorities, multinational contractors, and commercial buyers. Submit competitive quotations directly through GCCI.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="gcci-filter-panel bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search tenders by keyword, groundnut seeds, solar hybrid, concrete blocks..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-slate-700"
            >
              <option value="all">All Sourcing Categories</option>
              <option value="Agriculture">Agribusiness & Food</option>
              <option value="Energy">Energy & Renewable Systems</option>
              <option value="Construction">Construction & Civil Works</option>
              <option value="Logistics">Logistics & Marine</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800 font-mono-numbers">{filteredOpportunities.length}</strong> active commercial tenders
          </span>
          {(searchTerm || selectedCategory !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="text-emerald-700 hover:underline font-medium"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.map(opp => {
          // If logged in as business, calculate match preview
          const matchResult = currentBusiness 
            ? calculateSupplierMatch(opp, currentBusiness, products)
            : null;

          return (
            <div
              key={opp.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-colors space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-emerald-800">{opp.category}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">Ref #{opp.id.toUpperCase()}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-rose-700 font-semibold font-mono-numbers flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Closing {opp.closingDate}
                    </span>
                  </div>

                  <h3 
                    onClick={() => handleOpenBidModal(opp)}
                    className="text-lg font-bold text-slate-900 leading-snug hover:text-emerald-900 cursor-pointer"
                  >
                    {opp.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                {/* Right Procurement Strip */}
                <div className="lg:text-right shrink-0 bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[200px]">
                  <span className="text-[11px] text-slate-400 block">Indicative Budget</span>
                  <span className="text-base font-bold text-slate-900 font-mono-numbers block">
                    D{opp.budgetMax ? opp.budgetMax.toLocaleString() : 'Negotiable'} {opp.currency}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono-numbers block mt-0.5">
                    Quantity: {opp.quantity} {opp.unit}
                  </span>
                </div>
              </div>

              {/* Match Score Indicator (if logged in as business owner) */}
              {matchResult && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-800 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                      {matchResult.score}%
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-950">{matchResult.matchLevel} for your business profile</span>
                      <p className="text-[11px] text-emerald-800">
                        {matchResult.factors.find(f => f.matched)?.explanation || 'Category & capabilities aligned'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">GCCI Match Score</span>
                </div>
              )}

              {/* Bottom Details and Action */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {opp.deliveryLocation}
                  </span>
                  <span>Buyer: <strong className="text-slate-800">{opp.buyerOrg}</strong></span>
                  <span className="font-mono-numbers">{opp.responsesCount} quotes received</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenBidModal(opp)}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
                  >
                    Submit Quotation / Bid
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TENDER DETAILS & SUBMISSION MODAL */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
            <button
              onClick={() => setSelectedOpportunity(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="font-semibold text-emerald-800">{selectedOpportunity.category}</span>
                  <span>·</span>
                  <span className="text-slate-500">Buyer: {selectedOpportunity.buyerOrg}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {selectedOpportunity.title}
                </h2>
              </div>

              {/* Specifications Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">RFP Specification & Scope</h4>
                <p className="text-slate-700 leading-relaxed">
                  {selectedOpportunity.requiredSpecs || selectedOpportunity.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 font-mono-numbers">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Required Quantity</span>
                    <span className="font-semibold text-slate-900">{selectedOpportunity.quantity} {selectedOpportunity.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated Budget</span>
                    <span className="font-semibold text-slate-900">D{selectedOpportunity.budgetMax?.toLocaleString()} {selectedOpportunity.currency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Delivery Site</span>
                    <span className="font-semibold text-slate-900 truncate block">{selectedOpportunity.deliveryLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Required Deadline</span>
                    <span className="font-semibold text-rose-700">{selectedOpportunity.requiredDeliveryDate}</span>
                  </div>
                </div>
              </div>

              {/* Mandatory Eligibility Rules */}
              {selectedOpportunity.eligibilityCriteria && selectedOpportunity.eligibilityCriteria.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Mandatory Eligibility Criteria</h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {selectedOpportunity.eligibilityCriteria.map((crit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submission Form */}
              <div className="p-5 bg-slate-900 rounded-xl text-white space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-emerald-400">
                    Submit Formal Supplier Response / Quotation
                  </h4>
                  <span className="text-[11px] text-slate-400">Recorded on GCCI Ledger</span>
                </div>

                {submitSuccess ? (
                  <div className="p-4 bg-emerald-800 text-emerald-100 rounded-lg text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle className="w-5 h-5" />
                      <span>Quotation Successfully Submitted!</span>
                    </div>
                    <p>
                      Your bid for <strong>{offeredQuantity} {selectedOpportunity.unit}</strong> has been transmitted to {selectedOpportunity.buyerOrg}.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitBid} className="space-y-3 text-xs">
                    {submitError && (
                      <div className="p-2.5 bg-rose-900/60 border border-rose-600 text-rose-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-300 mb-1">Offered Quantity ({selectedOpportunity.unit})</label>
                        <input
                          type="number"
                          required
                          value={offeredQuantity}
                          onChange={e => setOfferedQuantity(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono-numbers focus:ring-1 focus:ring-emerald-500 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1">Unit Price ({selectedOpportunity.currency})</label>
                        <input
                          type="number"
                          required
                          value={proposedPricePerUnit}
                          onChange={e => setProposedPricePerUnit(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono-numbers focus:ring-1 focus:ring-emerald-500 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1">Total Quotation Value</label>
                        <div className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-emerald-400 font-bold font-mono-numbers text-xs">
                          D{(offeredQuantity * proposedPricePerUnit).toLocaleString()} {selectedOpportunity.currency}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 mb-1">Delivery Lead Time (Days)</label>
                        <input
                          type="number"
                          value={deliveryDays}
                          onChange={e => setDeliveryDays(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono-numbers focus:ring-1 focus:ring-emerald-500 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1">Compliance & Accreditations</label>
                        <input
                          type="text"
                          value={complianceNotes}
                          onChange={e => setComplianceNotes(e.target.value)}
                          placeholder="e.g. FSQA food handler license attached; PURA certified"
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-1 focus:ring-emerald-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Technical Proposal & Delivery Methodology</label>
                      <textarea
                        rows={3}
                        required
                        value={technicalProposal}
                        onChange={e => setTechnicalProposal(e.target.value)}
                        placeholder="Detail product grade, packaging, logistics transport, and warranty provisions..."
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:ring-1 focus:ring-emerald-500 text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOpportunity(null)}
                        className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm"
                      >
                        Submit Binding Quotation
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
