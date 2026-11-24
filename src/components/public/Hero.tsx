import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';

interface HeroProps {
  setActiveTab: (tab: string) => void;
  openAuthModal: (mode: 'signin' | 'register') => void;
  onSearchQuery: (query: string, category?: string) => void;
  onOpenShare?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab, openAuthModal, onSearchQuery }) => {
  const { businesses, opportunities } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const verifiedBusinesses = businesses.filter(b => b.verificationStatus === 'verified').length;
  const activeOpportunities = opportunities.filter(o => o.status === 'published').length;

  const featuredBusinesses = useMemo(
    () => businesses.filter(b => b.featured).slice(0, 3),
    [businesses]
  );
  const latestOpportunities = useMemo(
    () => opportunities.filter(o => o.status === 'published').slice(0, 3),
    [opportunities]
  );

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearchQuery(searchTerm);
    setActiveTab('directory');
  };

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-wide text-[#0B42A0] mb-4">
              GAMBIA CHAMBER OF COMMERCE & INDUSTRY
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-slate-950">
              Business connections that move trade forward.
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl">
              Discover Gambian businesses, find trusted suppliers and connect with new commercial opportunities through one national exchange.
            </p>

            <form onSubmit={submitSearch} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <input
                type="search"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Search businesses, products or services"
                aria-label="Search businesses, products or services"
                className="flex-1 min-w-0 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0B42A0] focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#0B42A0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#002E7A]"
              >
                Search exchange
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <button onClick={() => setActiveTab('directory')} className="font-medium text-[#0B42A0] hover:underline">
                Explore business directory
              </button>
              <button onClick={() => setActiveTab('opportunities')} className="font-medium text-[#0B42A0] hover:underline">
                View opportunities
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-2xl font-semibold tracking-tight text-slate-950">{businesses.length.toLocaleString()}</p>
            <p className="mt-1 text-sm text-slate-500">Businesses listed</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight text-slate-950">{verifiedBusinesses.toLocaleString()}</p>
            <p className="mt-1 text-sm text-slate-500">Verified businesses</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight text-slate-950">{activeOpportunities.toLocaleString()}</p>
            <p className="mt-1 text-sm text-slate-500">Open opportunities</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Discover</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Featured businesses</h2>
          </div>
          <button onClick={() => setActiveTab('directory')} className="text-sm font-semibold text-[#0B42A0] hover:underline">
            View directory
          </button>
        </div>

        {featuredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredBusinesses.map(business => (
              <button
                key={business.id}
                onClick={() => setActiveTab('directory')}
                className="text-left rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-slate-900">{business.name}</h3>
                  {business.verificationStatus === 'verified' && (
                    <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-[#0B42A0]">Verified</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-500">{business.sector}</p>
                <p className="mt-1 text-xs text-slate-400">{business.region}</p>
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
            Business listings will appear here as they are added.
          </p>
        )}
      </section>

      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Trade opportunities</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Find your next opportunity</h2>
            </div>
            <button onClick={() => setActiveTab('opportunities')} className="text-sm font-semibold text-[#0B42A0] hover:underline">
              View all
            </button>
          </div>

          {latestOpportunities.length > 0 ? (
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
              {latestOpportunities.map(opportunity => (
                <button
                  key={opportunity.id}
                  onClick={() => setActiveTab('opportunities')}
                  className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-5 text-left transition hover:bg-slate-50"
                >
                  <span>
                    <span className="block font-semibold text-slate-900">{opportunity.title}</span>
                    <span className="mt-1 block text-sm text-slate-500">{opportunity.category} · {opportunity.buyerOrg}</span>
                  </span>
                  <span className="shrink-0 text-sm font-medium text-[#0B42A0]">View opportunity →</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
              New commercial opportunities will appear here.
            </p>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="rounded-2xl bg-[#0B42A0] px-6 py-10 sm:px-10 sm:py-12 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Ready to grow your business network?</h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-blue-100">
              Join the exchange to present your business, connect with buyers and discover new markets.
            </p>
          </div>
          <button
            onClick={() => openAuthModal('register')}
            className="shrink-0 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#0B42A0] transition hover:bg-blue-50"
          >
            Join the exchange
          </button>
        </div>
      </section>
    </div>
  );
};
