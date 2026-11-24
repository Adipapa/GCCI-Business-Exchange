import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import heroBanjulTradeHub from '../../assets/images/hero_banjul_trade_hub_1792068736812.jpg';

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
      <section className="relative isolate overflow-hidden bg-[#061B43] text-white">
        <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 right-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-24">
          <div className="relative z-10 hero-enter">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
              GAMBIA CHAMBER OF COMMERCE & INDUSTRY
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Where Gambian business <span className="text-cyan-300">meets opportunity.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-blue-100 sm:text-lg">
              Discover trusted businesses, connect with suppliers and buyers, and find new opportunities to grow across The Gambia and beyond.
            </p>

            <form onSubmit={submitSearch} className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/20 sm:flex-row">
              <input
                type="search"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Search businesses, products or services"
                aria-label="Search businesses, products or services"
                className="min-w-0 flex-1 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#0B42A0] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#002E7A] hover:shadow-lg"
              >
                Search exchange
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100">
              <button onClick={() => setActiveTab('directory')} className="font-medium transition hover:text-cyan-300">
                Explore business directory <span aria-hidden="true">→</span>
              </button>
              <button onClick={() => setActiveTab('opportunities')} className="font-medium transition hover:text-cyan-300">
                View opportunities <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div className="relative hero-photo-enter lg:pl-2">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 to-blue-700/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-blue-950 shadow-2xl shadow-black/40">
              <img
                src={heroBanjulTradeHub}
                alt="Banjul trade hub representing Gambian commerce and regional trade"
                className="h-[340px] w-full object-cover sm:h-[430px] lg:h-[490px]"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061B43]/90 via-[#061B43]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">One connected business community</p>
                <p className="mt-2 max-w-sm text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  Build connections. Create value. Grow trade.
                </p>
              </div>
            </div>
            <div className="hero-float absolute -left-5 top-8 hidden rounded-2xl border border-white/20 bg-white/95 px-4 py-3 text-slate-900 shadow-xl sm:block">
              <p className="text-xs font-medium text-slate-500">The national business exchange</p>
              <p className="mt-1 text-sm font-semibold text-[#0B42A0]">Discover • Connect • Trade</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-7 sm:grid-cols-3 sm:px-6">
          <div className="gcci-home-stat">
            <p className="text-2xl font-semibold tracking-tight text-slate-950">{businesses.length.toLocaleString()}</p>
            <p className="mt-1 text-sm text-slate-500">Businesses listed</p>
          </div>
          <div className="gcci-home-stat">
            <p className="text-2xl font-semibold tracking-tight text-slate-950">{verifiedBusinesses.toLocaleString()}</p>
            <p className="mt-1 text-sm text-slate-500">Verified businesses</p>
          </div>
          <div className="gcci-home-stat">
            <p className="text-2xl font-semibold tracking-tight text-slate-950">{activeOpportunities.toLocaleString()}</p>
            <p className="mt-1 text-sm text-slate-500">Open opportunities</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Discover</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Featured businesses</h2>
          </div>
          <button onClick={() => setActiveTab('directory')} className="text-sm font-semibold text-[#0B42A0] hover:underline">
            View directory
          </button>
        </div>

        {featuredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featuredBusinesses.map(business => (
              <button
                key={business.id}
                onClick={() => setActiveTab('directory')}
                className="rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-300 hover:shadow-sm"
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

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
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
                  className="flex w-full flex-col gap-2 p-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
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

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-6 rounded-2xl bg-[#0B42A0] px-6 py-10 text-white sm:px-10 sm:py-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to grow your business network?</h2>
            <p className="mt-3 text-sm leading-relaxed text-blue-100 sm:text-base">
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
