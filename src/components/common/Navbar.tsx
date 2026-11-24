import React, { useState } from 'react';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/seedData';

const isDemoMode = import.meta.env.DEV;
import { GcciLogo } from './GcciLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: (mode: 'signin' | 'register') => void;
  onOpenShare?: () => void;
}

const links = [
  { label: 'Directory', tab: 'directory' },
  { label: 'Marketplace', tab: 'marketplace' },
  { label: 'Opportunities', tab: 'opportunities' },
  { label: 'Membership', tab: 'membership' },
  { label: 'About', tab: 'about' }
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAuthModal }) => {
  const { currentUser, setCurrentUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const portalTab = () => {
    switch (currentUser.role) {
      case 'business_owner':
      case 'business_employee':
        return 'business_portal';
      case 'buyer':
        return 'buyer_portal';
      case 'investor':
        return 'investor_portal';
      case 'verification_officer':
      case 'gcci_admin':
      case 'super_admin':
        return 'admin_portal';
      default:
        return 'home';
    }
  };

  const navigate = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  };

  const switchDemoUser = (user: typeof DEMO_USERS[number]) => {
    setCurrentUser(user);
    setAccountMenuOpen(false);
    if (user.role === 'business_owner' || user.role === 'business_employee') navigate('business_portal');
    else if (user.role === 'buyer') navigate('buyer_portal');
    else if (user.role === 'investor') navigate('investor_portal');
    else if (user.role === 'gcci_admin' || user.role === 'verification_officer' || user.role === 'super_admin') navigate('admin_portal');
    else navigate('home');
  };

  return (
    <header className="gcci-navbar sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('home')}
          className="flex shrink-0 items-center rounded-lg transition-opacity hover:opacity-85"
          aria-label="GCCI Business Exchange home"
        >
          <GcciLogo size="md" />
        </button>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          <button
            onClick={() => navigate('home')}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${activeTab === 'home' ? 'bg-blue-50 text-[#0B42A0]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}
          >
            Home
          </button>
          {links.map(link => (
            <button
              key={link.tab}
              onClick={() => navigate(link.tab)}
              aria-current={activeTab === link.tab ? 'page' : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${activeTab === link.tab ? 'bg-blue-50 text-[#0B42A0]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {currentUser.role === 'visitor' ? (
            <>
              <button
                onClick={() => openAuthModal('signin')}
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
              >
                Sign in
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B42A0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#002E7A] hover:shadow-md"
              >
                Join GCCI <ArrowUpRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate(portalTab())}
                className="hidden rounded-lg bg-[#0B42A0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#002E7A] hover:shadow-md sm:inline-flex"
              >
                My workspace
              </button>
              <div className="relative">
                <button
                  onClick={() => isDemoMode ? setAccountMenuOpen(value => !value) : navigate(portalTab())}
                  aria-expanded={isDemoMode ? accountMenuOpen : undefined}
                  className="inline-flex max-w-48 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#0B42A0]">
                    {currentUser.fullName.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                  <span className="max-w-28 truncate">{currentUser.fullName}</span>
                  {isDemoMode && <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />}
                </button>
                {accountMenuOpen && isDemoMode && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                    <div className="border-b border-slate-100 px-3 pb-2 pt-1">
                      <p className="text-xs font-semibold text-slate-900">{currentUser.fullName}</p>
                      <p className="mt-0.5 text-[11px] capitalize text-slate-500">{currentUser.role.replaceAll('_', ' ')}</p>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Development demo account switcher</p>
                    </div>
                    <div className="mt-1 max-h-72 space-y-0.5 overflow-y-auto">
                      {DEMO_USERS.map(user => (
                        <button
                          key={user.id}
                          onClick={() => switchDemoUser(user)}
                          className={`w-full rounded-lg px-3 py-2 text-left transition hover:bg-slate-50 ${currentUser.id === user.id ? 'bg-blue-50 text-[#0B42A0]' : 'text-slate-700'}`}
                        >
                          <span className="block text-sm font-semibold">{user.fullName}</span>
                          <span className="mt-0.5 block text-[11px] capitalize text-slate-400">{user.role.replaceAll('_', ' ')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(value => !value)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 xl:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-900/5 xl:hidden" aria-label="Mobile navigation">
          <div className="mx-auto max-w-7xl space-y-1 sm:px-2">
            <button
              onClick={() => navigate('home')}
              className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${activeTab === 'home' ? 'bg-blue-50 text-[#0B42A0]' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              Home
            </button>
            {links.map(link => (
              <button
                key={link.tab}
                onClick={() => navigate(link.tab)}
                className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${activeTab === link.tab ? 'bg-blue-50 text-[#0B42A0]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {link.label}
              </button>
            ))}
            {currentUser.role !== 'visitor' && (
              <button onClick={() => navigate(portalTab())} className="mt-2 block w-full rounded-lg bg-[#0B42A0] px-3 py-2.5 text-left text-sm font-semibold text-white">
                My workspace
              </button>
            )}
            {currentUser.role === 'visitor' && (
              <button onClick={() => { setMobileMenuOpen(false); openAuthModal('signin'); }} className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-left text-sm font-semibold text-slate-700">
                Sign in
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
