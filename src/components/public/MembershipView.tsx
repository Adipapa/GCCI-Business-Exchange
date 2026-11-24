import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MembershipPlan, PaymentRecord } from '../../types';
import { 
  Check, 
  ShieldCheck, 
  Award, 
  CreditCard, 
  PhoneCall, 
  Building2, 
  X, 
  CheckCircle,
  FileText,
  Printer,
  ArrowRight
} from 'lucide-react';

interface MembershipViewProps {
  openAuthModal?: (mode: 'signin' | 'register') => void;
  setActiveTab?: (tab: string) => void;
}

export const MembershipView: React.FC<MembershipViewProps> = ({ openAuthModal, setActiveTab }) => {
  const { membershipPlans, subscribeMembership, currentUser, payments } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentRecord['paymentMethod']>('QMoney');
  const [mobileNumber, setMobileNumber] = useState('+220 7');
  const [paymentSuccess, setPaymentSuccess] = useState<PaymentRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    if (currentUser.role === 'visitor') {
      if (openAuthModal) openAuthModal('signin');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const record = subscribeMembership(selectedPlan.id, paymentMethod);
      setIsProcessing(false);
      setPaymentSuccess(record);
    }, 1200);
  };

  // Structured tiers matching Role Model Image 2
  const tierConfig: Record<string, {
    title: string;
    sublabel: string;
    tagline: string;
    features: string[];
    isPopular?: boolean;
    btnStyle: string;
    cardStyle: string;
  }> = {
    'plan-basic': {
      title: 'Start',
      sublabel: 'Free',
      tagline: 'For micro-enterprises exploring the corridor.',
      features: [
        'Directory profile',
        'Marketplace access',
        'Event invitations'
      ],
      btnStyle: 'bg-amber-500 hover:bg-amber-600 text-slate-950',
      cardStyle: 'bg-white border-slate-200 text-slate-900'
    },
    'plan-verified': {
      title: 'SME',
      sublabel: 'Growing business',
      tagline: 'For small and medium enterprises ready to export.',
      features: [
        'All on Start',
        'Certificates of origin',
        'Halal Certificate',
        'Business opportunities',
        'Public Tender'
      ],
      btnStyle: 'bg-amber-500 hover:bg-amber-600 text-slate-950',
      cardStyle: 'bg-white border-slate-200 text-slate-900'
    },
    'plan-pro': {
      title: 'Corporate',
      sublabel: 'Established',
      tagline: 'For corporates with active cross-border trade.',
      features: [
        'All on SME',
        'Investment desk',
        'AI matching'
      ],
      isPopular: true,
      btnStyle: 'bg-white hover:bg-slate-100 text-slate-950',
      cardStyle: 'bg-[#523707] text-white border-[#664509] shadow-xl'
    },
    'plan-corporate': {
      title: 'Premium',
      sublabel: 'Full access',
      tagline: 'For investors and large enterprises, with concierge.',
      features: [
        'All on Corporate',
        'Dedicated concierge',
        'VIP treatment at events',
        'Visibility on the Chamber website'
      ],
      btnStyle: 'bg-amber-500 hover:bg-amber-600 text-slate-950',
      cardStyle: 'bg-white border-slate-200 text-slate-900'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header (Role Model Image 2) */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Choose the tier that fits your ambition
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Transparent tiers, clear benefits. Upgrade as you grow.
        </p>
      </div>

      {/* Pricing Cards Grid (Role Model Image 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {membershipPlans.map(plan => {
          const cfg = tierConfig[plan.id] || {
            title: plan.name,
            sublabel: plan.badgeText,
            tagline: plan.description,
            features: plan.features,
            btnStyle: 'bg-amber-500 hover:bg-amber-600 text-slate-950',
            cardStyle: 'bg-white border-slate-200 text-slate-900'
          };
          const isDark = cfg.isPopular;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border p-7 sm:p-8 flex flex-col justify-between transition-all relative ${cfg.cardStyle}`}
            >
              {/* MOST POPULAR BADGE */}
              {cfg.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#2e1d02] border border-amber-500/40 text-amber-300 text-[10px] font-extrabold rounded-full uppercase tracking-widest shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className={`font-extrabold text-2xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {cfg.title}
                  </h3>
                  <p className="text-xs font-bold text-amber-500 mt-1">
                    {cfg.sublabel}
                  </p>
                  <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-amber-100/80' : 'text-slate-500'}`}>
                    {cfg.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className={`pt-4 border-t font-mono-numbers ${isDark ? 'border-amber-900/60' : 'border-slate-100'}`}>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {plan.priceGMD === 0 ? 'Free' : `D${plan.priceGMD.toLocaleString()}`}
                    </span>
                    {plan.priceGMD > 0 && (
                      <span className={`text-xs ${isDark ? 'text-amber-200/70' : 'text-slate-500'}`}>
                        / year
                      </span>
                    )}
                  </div>
                  {plan.priceUSD > 0 && (
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-amber-300/60' : 'text-slate-400'}`}>
                      Approx. ${plan.priceUSD} USD equivalent
                    </span>
                  )}
                </div>

                {/* Features List */}
                <ul className={`space-y-3 pt-4 border-t text-xs ${isDark ? 'border-amber-900/60 text-slate-100' : 'border-slate-100 text-slate-700'}`}>
                  {cfg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button: Rounded Pill "Apply now ->" */}
              <div className="pt-8 mt-6">
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-3 px-6 text-xs font-bold rounded-full transition-all shadow-md flex items-center justify-center gap-2 hover:scale-102 ${cfg.btnStyle}`}
                >
                  <span>Apply now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Verification Disclaimer (Section 7.3 & 15.4) */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>GCCI Statutory Compliance Notice</span>
        </div>
        <p className="leading-relaxed">
          In strict accordance with GCCI governance guidelines, purchasing a membership plan activates platform capabilities and directory prioritization, but does <strong>not automatically confer the official GCCI Verification badge</strong>. Verification requires independent legal and tax documentation review by the GCCI Secretariat compliance officers.
        </p>
      </div>

      {/* PAYMENT & SUBSCRIPTION MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs">
            <button
              onClick={() => { setSelectedPlan(null); setPaymentSuccess(null); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {paymentSuccess ? (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">Payment Processed Successfully</h3>
                  <p className="text-slate-600 text-xs">
                    Your subscription to <strong>{paymentSuccess.planName}</strong> is active.
                  </p>
                </div>

                {/* Printable Invoice Card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono-numbers">
                  <div className="flex justify-between text-slate-500">
                    <span>Invoice Ref:</span>
                    <strong className="text-slate-900">{paymentSuccess.invoiceNumber}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Transaction Code:</span>
                    <strong className="text-slate-900">{paymentSuccess.reference}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Payment Method:</span>
                    <span className="text-slate-800">{paymentSuccess.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Amount Paid:</span>
                    <span className="font-bold text-emerald-800 text-sm">
                      D{paymentSuccess.amount.toLocaleString()} {paymentSuccess.currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Effective Date:</span>
                    <span>{paymentSuccess.timestamp}</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlan(null);
                      setPaymentSuccess(null);
                      if (setActiveTab) setActiveTab('business_portal');
                    }}
                    className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg"
                  >
                    Return to Portal
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                    Official GCCI Trade Checkout
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    Subscribe to {selectedPlan.name}
                  </h3>
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg flex justify-between items-center font-mono-numbers">
                    <span className="text-slate-600">Annual Subscription Fee:</span>
                    <span className="text-base font-bold text-emerald-900">
                      D{selectedPlan.priceGMD.toLocaleString()} GMD
                    </span>
                  </div>
                </div>

                {/* Gambian Payment Method Selector */}
                <div>
                  <label className="block font-medium text-slate-700 mb-2">Select Approved Payment Channel</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'QMoney', name: 'QMoney (QCell)', note: 'Fast SMS push' },
                      { id: 'Afrimoney', name: 'Afrimoney', note: 'Africell wallet' },
                      { id: 'Bank Transfer (Trust Bank / Ecobank)', name: 'Trust Bank / Ecobank', note: 'Direct bank transfer' },
                      { id: 'Card (Visa/Mastercard)', name: 'Visa / Mastercard', note: 'International debit/credit' }
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${paymentMethod === method.id ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-medium' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                      >
                        <p className="font-semibold text-xs">{method.name}</p>
                        <p className="text-[10px] text-slate-500">{method.note}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {(paymentMethod === 'QMoney' || paymentMethod === 'Afrimoney') && (
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Gambian Mobile Number ({paymentMethod})
                    </label>
                    <input
                      type="text"
                      required
                      value={mobileNumber}
                      onChange={e => setMobileNumber(e.target.value)}
                      placeholder="+220 7XXXXXX"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 text-xs font-mono-numbers"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      A PIN confirmation prompt will be dispatched to your phone.
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Verifying with {paymentMethod}...</span>
                    ) : (
                      <span>Authorize Payment of D{selectedPlan.priceGMD.toLocaleString()} GMD</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
