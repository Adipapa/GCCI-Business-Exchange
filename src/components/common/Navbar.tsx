import React, { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/seedData';
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

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          onClick={() => navigate('home')}
          className="flex shrink-0 items-center"
          aria-label="GCCI Business Exchange home"
        >
          <GcciLogo size="md" />
        </button>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
          {links.map(link => (
            <button
              key={link.tab}
              onClick={() => navigate(link.tab)}
              className={`py-2 text-sm font-medium transition-colors ${
                activeTab === link.tab
                  ? 'text-[#0B42A0]'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {link.label}
              {activeTab === link.tab && <span className="block h-0.5 mt-1 rounded-full bg-[#0B42A0]" />}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {currentUser.role === 'visitor' ? (
            <>
              <button
                onClick={() => openAuthModal('signin')}
                className="hidden sm:inline-flex rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Sign in
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="rounded-lg bg-[#0B42A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#002E7A]"
              >
                Join
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate(portalTab())}
                className="hidden sm:inline-flex rounded-lg bg-[#0B42A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#002E7A]"
              >
                My workspace
              </button>
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(value => !value)}
                  aria-expanded={accountMenuOpen}
                  className="inline-flex max-w-40 items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <span className="max-w-28 truncate">{currentUser.fullName}</span>
                  <ChevronDown className="h-4 w-4 shrink-0" />
                </button>
                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Demo account</p>
                    {DEMO_USERS.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setAccountMenuOpen(false);
                          if (user.role === 'business_owner' || user.role === 'business_employee') navigate('business_portal');
                          else if (user.role === 'buyer') navigate('buyer_portal');
                          else if (user.role === 'investor') navigate('investor_portal');
                          else if (user.role === 'gcci_admin' || user.role === 'verification_officer' || user.role === 'super_admin') navigate('admin_portal');
                          else navigate('home');
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                          currentUser.id === user.id ? 'bg-blue-50 font-semibold text-[#0B42A0]' : 'text-slate-700'
                        }`}
                      >
                        <span className="block">{user.fullName}</span>
                        <span className="mt-0.5 block text-xs capitalize text-slate-400">{user.role.replaceAll('_', ' ')}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(value => !value)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto max-w-6xl space-y-1">
            <button onClick={() => navigate('home')} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">Home</button>
            {links.map(link => (
              <button
                key={link.tab}
                onClick={() => navigate(link.tab)}
                className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  activeTab === link.tab ? 'bg-blue-50 text-[#0B42A0]' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            {currentUser.role !== 'visitor' && (
              <button onClick={() => navigate(portalTab())} className="mt-2 block w-full rounded-lg bg-[#0B42A0] px-3 py-2.5 text-left text-sm font-semibold text-white">
                My workspace
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
