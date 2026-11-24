import React from 'react';
import { GcciLogo } from './GcciLogo';
import { ShieldCheck, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="gcci-footer border-t border-slate-800 bg-[#071B3A] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pt-14">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          <div className="max-w-md">
            <div className="inline-flex rounded-xl bg-white p-2.5 shadow-sm">
              <GcciLogo size="md" />
            </div>
            <h2 className="mt-5 text-lg font-bold tracking-tight text-white">Gambia Chamber of Commerce and Industry</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">The voice of Gambian business and trade</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Established in 1978, GCCI supports enterprise, domestic and cross-border trade, investment and economic cooperation across The Gambia and the ECOWAS region.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              Trusted business network
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Explore the exchange</h3>
            <div className="mt-5 grid grid-cols-1 gap-3 text-sm">
              {[
                ['Business directory', 'directory'],
                ['Marketplace', 'marketplace'],
                ['Trade opportunities', 'opportunities'],
                ['Membership', 'membership'],
                ['About GCCI', 'about']
              ].map(([label, tab]) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="group flex w-fit items-center gap-2 text-left text-slate-400 transition hover:text-white">
                  <span>{label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Contact GCCI</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
                <span>Kerr Jula, Bertil Harding Highway, Bijilo / Kanifing, The Gambia</span>
              </div>
              <a href="tel:+2204463450" className="flex items-center gap-3 transition hover:text-white">
                <Phone className="h-4 w-4 shrink-0 text-blue-300" />
                <span>+220 446 3450 / +220 437 8810</span>
              </a>
              <a href="mailto:info@gcci.gm" className="flex items-center gap-3 transition hover:text-white">
                <Mail className="h-4 w-4 shrink-0 text-blue-300" />
                <span>info@gcci.gm / exchange@gcci.gm</span>
              </a>
            </div>
            <div className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">
              Digital exchange developed in partnership with <span className="font-semibold text-slate-300">Quality Tech Services (QTS)</span>.
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {year} Gambia Chamber of Commerce and Industry. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <button onClick={() => setActiveTab('about')} className="transition hover:text-slate-300">Privacy & terms</button>
            <button onClick={() => setActiveTab('about')} className="transition hover:text-slate-300">Commercial exchange rules</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
