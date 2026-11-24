import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/seedData';
import { GcciLogo } from './GcciLogo';
import { X, ShieldCheck, Building2, ShoppingBag, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'signin' | 'register';
  onSuccessRedirect?: (tab: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode, onSuccessRedirect }) => {
  const { setCurrentUser, createBusiness } = useApp();
  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('business_owner');
  const [businessName, setBusinessName] = useState('');
  const [sector, setSector] = useState('Agribusiness & Food Processing');
  const [region, setRegion] = useState('Kanifing Municipality (KMC)');
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide your registered business email and password.');
      return;
    }

    // Check if matches demo user
    const matched = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      onClose();
      if (onSuccessRedirect) {
        if (matched.role === 'business_owner') onSuccessRedirect('business_portal');
        else if (matched.role === 'buyer') onSuccessRedirect('buyer_portal');
        else if (matched.role === 'investor') onSuccessRedirect('investor_portal');
        else onSuccessRedirect('admin_portal');
      }
      return;
    }

    // Or create user session from entered credentials
    const newSession = {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split('@')[0].replace('.', ' '),
      role: 'business_owner' as UserRole,
      organization: 'Registered Enterprise',
      phone: '+220 700 0000'
    };
    setCurrentUser(newSession);
    onClose();
    if (onSuccessRedirect) onSuccessRedirect('business_portal');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password) {
      setError('Please fill in your full name, email, and password.');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      phone,
      role: selectedRole,
      businessName: businessName || `${fullName}'s Business`,
      organization: businessName || `${fullName} Holdings`
    };

    setCurrentUser(newUser);

    // If business owner, initialize business profile draft
    if (selectedRole === 'business_owner') {
      createBusiness({
        name: businessName || `${fullName}'s Enterprise Ltd`,
        tradingName: businessName || fullName,
        email,
        phone,
        sector,
        category: sector,
        region: region as any
      });
    }

    onClose();
    if (onSuccessRedirect) {
      if (selectedRole === 'business_owner') onSuccessRedirect('business_portal');
      else if (selectedRole === 'buyer') onSuccessRedirect('buyer_portal');
      else if (selectedRole === 'investor') onSuccessRedirect('investor_portal');
      else onSuccessRedirect('home');
    }
  };

  const handleQuickDemoLogin = (user: typeof DEMO_USERS[0]) => {
    setCurrentUser(user);
    onClose();
    if (onSuccessRedirect) {
      if (user.role === 'business_owner') onSuccessRedirect('business_portal');
      else if (user.role === 'buyer') onSuccessRedirect('buyer_portal');
      else if (user.role === 'investor') onSuccessRedirect('investor_portal');
      else if (user.role === 'gcci_admin' || user.role === 'verification_officer') onSuccessRedirect('admin_portal');
      else onSuccessRedirect('home');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Official GCCI Logo */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <GcciLogo size="sm" />
            <span className="text-[10px] font-bold text-[#0B42A0] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Secure Gateway
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {mode === 'signin' && 'Sign In to GCCI Business Exchange'}
            {mode === 'register' && 'Register Your Company with GCCI'}
            {mode === 'forgot' && 'Reset Account Credentials'}
          </h2>
          <p className="text-xs text-slate-500">
            Access certified suppliers, procurement RFQs, and secure Deal Rooms across The Gambia and ECOWAS.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Fast Logins for Testing */}
        <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              1-Click Demo Profiles (Evaluate Roles)
            </span>
            <span className="text-[10px] text-[#0B42A0] font-bold">Instant Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(DEMO_USERS[0])}
              className="p-2 text-left bg-white border border-slate-200 rounded-lg hover:border-[#0B42A0] hover:bg-blue-50/50 transition-all text-slate-800"
            >
              <p className="font-semibold text-[#0B42A0]">Modou Faye</p>
              <p className="text-[10px] text-slate-500">Business Owner (Cashew Co.)</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(DEMO_USERS[1])}
              className="p-2 text-left bg-white border border-slate-200 rounded-lg hover:border-[#0B42A0] hover:bg-blue-50/50 transition-all text-slate-800"
            >
              <p className="font-semibold text-[#0B42A0]">Fatoumatta Jallow</p>
              <p className="text-[10px] text-slate-500">Buyer (Banjul Port Auth)</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(DEMO_USERS[2])}
              className="p-2 text-left bg-white border border-slate-200 rounded-lg hover:border-[#0B42A0] hover:bg-blue-50/50 transition-all text-slate-800"
            >
              <p className="font-semibold text-[#0B42A0]">Karamo Ceesay</p>
              <p className="text-[10px] text-slate-500">Investor (Sahel Growth)</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(DEMO_USERS[4])}
              className="p-2 text-left bg-white border border-slate-200 rounded-lg hover:border-[#0B42A0] hover:bg-blue-50/50 transition-all text-slate-800"
            >
              <p className="font-semibold text-[#0B42A0]">Aminata Touray</p>
              <p className="text-[10px] text-slate-500">GCCI Administrator</p>
            </button>
          </div>
        </div>

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Business Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. director@company.gm"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B42A0] text-xs"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[#0B42A0] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B42A0] text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0B42A0] hover:bg-[#002E7A] text-white font-semibold rounded-lg transition-colors shadow-xs"
            >
              Sign In to Exchange
            </button>

            <div className="text-center pt-2 text-slate-500">
              Don't have a registered business account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#0B42A0] font-semibold hover:underline"
              >
                Register Company
              </button>
            </div>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {/* Role Selection */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Select Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('business_owner')}
                  className={`p-2.5 rounded-lg border text-center transition-all ${selectedRole === 'business_owner' ? 'border-[#0B42A0] bg-blue-50 text-[#0B42A0] font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-[#0B42A0]" />
                  <span className="block text-[11px]">Supplier / Business</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('buyer')}
                  className={`p-2.5 rounded-lg border text-center transition-all ${selectedRole === 'buyer' ? 'border-[#0B42A0] bg-blue-50 text-[#0B42A0] font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <ShoppingBag className="w-4 h-4 mx-auto mb-1 text-[#0B42A0]" />
                  <span className="block text-[11px]">Buyer / Procurement</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('investor')}
                  className={`p-2.5 rounded-lg border text-center transition-all ${selectedRole === 'investor' ? 'border-[#0B42A0] bg-blue-50 text-[#0B42A0] font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <TrendingUp className="w-4 h-4 mx-auto mb-1 text-[#0B42A0]" />
                  <span className="block text-[11px]">Investor / Partner</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Representative Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Lamin Camara"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B42A0] text-xs"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Company / Trading Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="e.g. Gambia Agro Logistics Ltd"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B42A0] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Business Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contact@company.gm"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B42A0] text-xs"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Gambian Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+220 7XX XXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B42A0] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Commercial Sector</label>
                <select
                  value={sector}
                  onChange={e => setSector(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B42A0] text-xs bg-white"
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
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B42A0] text-xs bg-white"
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
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Create Secure Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B42A0] text-xs"
              />
            </div>

            <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-600">
              <input type="checkbox" required id="terms" className="mt-0.5 rounded text-[#0B42A0]" />
              <label htmlFor="terms">
                I agree to the GCCI Commercial Exchange terms, verification audit protocols, and data privacy notice.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0B42A0] hover:bg-[#002E7A] text-white font-semibold rounded-lg transition-colors shadow-xs"
            >
              Create Account & Start Onboarding
            </button>

            <div className="text-center pt-2 text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-[#0B42A0] font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Flow */}
        {mode === 'forgot' && (
          <div className="space-y-4 text-xs">
            {resetSent ? (
              <div className="p-4 bg-blue-50 rounded-xl text-blue-900 space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto text-[#0B42A0]" />
                <p className="font-semibold text-sm">Recovery Link Dispatched</p>
                <p className="text-xs text-blue-800">
                  We have dispatched password reset instructions to <strong>{email}</strong>. Check your inbox and follow the secure link.
                </p>
                <button
                  onClick={() => setMode('signin')}
                  className="mt-3 px-4 py-2 bg-[#0B42A0] text-white rounded-lg font-medium text-xs hover:bg-[#002E7A]"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (email) setResetSent(true);
                  else setError('Please enter your registered email address.');
                }}
                className="space-y-3"
              >
                <p className="text-slate-600">
                  Enter your registered business email and we will send you an official GCCI recovery link.
                </p>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Business Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="director@company.gm"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 text-white font-semibold rounded-lg text-xs hover:bg-emerald-900"
                >
                  Send Recovery Link
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-slate-600 hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
