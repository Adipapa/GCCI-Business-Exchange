/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { ShareModal } from './components/common/ShareModal';
import { Hero } from './components/public/Hero';
import { BusinessDirectory } from './components/public/BusinessDirectory';
import { Marketplace } from './components/public/Marketplace';
import { OpportunitiesList } from './components/public/OpportunitiesList';
import { MembershipView } from './components/public/MembershipView';
import { AboutPage } from './components/public/AboutPage';
import { BusinessPortal } from './components/portal/BusinessPortal';
import { BuyerPortal } from './components/portal/BuyerPortal';
import { InvestorPortal } from './components/portal/InvestorPortal';
import { AdminPortal } from './components/portal/AdminPortal';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';

const VALID_TABS = [
  'home', 
  'directory', 
  'marketplace', 
  'opportunities', 
  'membership', 
  'about', 
  'business_portal', 
  'buyer_portal', 
  'investor_portal', 
  'admin_portal'
];

const WorkspaceUnavailable: React.FC<{ onReturnHome: () => void }> = ({ onReturnHome }) => (
  <section className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center px-4 py-16">
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0B42A0]">
        <ShieldCheck className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Workspace access is not available yet</h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        This public preview does not yet have a connected GCCI authentication service. Business, buyer, investor and administrator workspaces will become available once secure account access is enabled.
      </p>
      <button onClick={onReturnHome} className="mt-6 rounded-lg bg-[#0B42A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#002E7A]">
        Return to the public exchange
      </button>
    </div>
  </section>
);

function MainApp() {
  const { currentUser } = useApp();

  // Read initial tab from URL params or hash
  const getInitialState = () => {
    if (typeof window === 'undefined') return { tab: 'home', query: '', category: 'all' };
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') || params.get('view');
    const qParam = params.get('q') || '';
    const catParam = params.get('category') || 'all';

    let initialTab = 'home';
    if (tabParam && VALID_TABS.includes(tabParam)) {
      initialTab = tabParam;
    } else if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (VALID_TABS.includes(hash)) {
        initialTab = hash;
      }
    }
    return { tab: initialTab, query: qParam, category: catParam };
  };

  const initial = getInitialState();
  const [activeTab, setActiveTabState] = useState<string>(initial.tab);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  // Search parameters passed between Hero and Directory
  const [directorySearchQuery, setDirectorySearchQuery] = useState(initial.query);
  const [directoryCategory, setDirectoryCategory] = useState(initial.category);

  // Synchronized activeTab setter that updates URL query parameters & browser history
  const setActiveTab = useCallback((tab: string, hash?: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'home') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      
      if (hash) {
        url.hash = hash.startsWith('#') ? hash : `#${hash}`;
      } else if (tab !== 'home') {
        url.hash = '';
      }
      
      window.history.pushState({ tab, hash }, '', url.toString());

      // If hash provided, smooth scroll to target section
      if (hash) {
        setTimeout(() => {
          const targetId = hash.replace('#', '');
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  // Handle browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') || params.get('view') || 'home';
      if (VALID_TABS.includes(tabParam)) {
        setActiveTabState(tabParam);
      }
      const q = params.get('q');
      if (q !== null) setDirectorySearchQuery(q);
      const cat = params.get('category');
      if (cat !== null) setDirectoryCategory(cat);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle anchor link scrolling on mount or tab change (e.g. #verifier, #commodities, #due-diligence)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const openAuth = (mode: 'signin' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleHeroSearch = (query: string, category?: string) => {
    setDirectorySearchQuery(query);
    if (category) setDirectoryCategory(category);
    setActiveTab('directory');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'directory');
      if (query) url.searchParams.set('q', query);
      if (category && category !== 'all') url.searchParams.set('category', category);
      window.history.pushState({}, '', url.toString());
    }
  };

  return (
    <div className="gcci-app min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navbar with Gambia Chamber branding, single-line links, and Share Link button */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={openAuth}
        onOpenShare={() => setShareModalOpen(true)}
      />

      {!import.meta.env.DEV && (
        <aside role="status" aria-live="polite" className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs leading-5 text-amber-950 sm:text-sm">
          <strong>Platform preview:</strong> directory, marketplace and opportunity records are demonstration content. Live account, submission and shared-data services are not connected.
        </aside>
      )}

      {/* Main Content Viewport */}
      <main className="gcci-main flex-1">
        {activeTab === 'home' && (
          <Hero
            setActiveTab={setActiveTab}
            openAuthModal={openAuth}
            onSearchQuery={handleHeroSearch}
            onOpenShare={() => setShareModalOpen(true)}
          />
        )}

        {activeTab === 'directory' && (
          <BusinessDirectory
            initialSearchQuery={directorySearchQuery}
            initialCategory={directoryCategory}
            openAuthModal={openAuth}
            onOpenDealRoom={() => {
              if (currentUser.role === 'business_owner' || currentUser.role === 'business_employee') {
                setActiveTab('business_portal');
              } else if (currentUser.role === 'buyer') {
                setActiveTab('buyer_portal');
              } else {
                setActiveTab('business_portal');
              }
            }}
          />
        )}

        {activeTab === 'marketplace' && (
          <Marketplace
            openAuthModal={openAuth}
            onOpenDealRoom={() => {
              if (currentUser.role === 'business_owner') setActiveTab('business_portal');
              else if (currentUser.role === 'buyer') setActiveTab('buyer_portal');
              else setActiveTab('business_portal');
            }}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesList
            openAuthModal={openAuth}
            onOpenDealRoom={() => {
              if (currentUser.role === 'buyer') setActiveTab('buyer_portal');
              else setActiveTab('business_portal');
            }}
          />
        )}

        {activeTab === 'membership' && (
          <MembershipView
            openAuthModal={openAuth}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}

        {activeTab === 'business_portal' && (
          import.meta.env.DEV || currentUser.role !== 'visitor'
            ? <BusinessPortal setActiveTab={setActiveTab} />
            : <WorkspaceUnavailable onReturnHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'buyer_portal' && (
          import.meta.env.DEV || currentUser.role !== 'visitor'
            ? <BuyerPortal setActiveTab={setActiveTab} />
            : <WorkspaceUnavailable onReturnHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'investor_portal' && (
          import.meta.env.DEV || currentUser.role !== 'visitor'
            ? <InvestorPortal setActiveTab={setActiveTab} />
            : <WorkspaceUnavailable onReturnHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'admin_portal' && (
          import.meta.env.DEV || currentUser.role === 'gcci_admin' || currentUser.role === 'super_admin' || currentUser.role === 'verification_officer'
            ? <AdminPortal />
            : <WorkspaceUnavailable onReturnHome={() => setActiveTab('home')} />
        )}
      </main>

      {/* Domain-Native Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Floating PWA In-App Install Prompt */}
      <PwaInstallBanner />

      {/* Global Share & Deep Link Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        currentTab={activeTab}
      />

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccessRedirect={tab => setActiveTab(tab)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
