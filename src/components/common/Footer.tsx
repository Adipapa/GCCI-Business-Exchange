import React from 'react';
import { GcciLogo } from './GcciLogo';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: GCCI Institution overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-2.5 rounded-xl inline-block shadow-sm">
              <GcciLogo size="md" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base tracking-tight">Gambia Chamber of Commerce and Industry</h3>
              <p className="text-xs text-amber-400 font-medium">The Voice of Gambian Business & Trade</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Established in 1978, GCCI is the national private sector organization facilitating domestic and cross-border trade, business verification, investment facilitation, and economic cooperation across The Gambia and the ECOWAS region.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Kerr Jula, Bertil Harding Highway, Bijilo / Kanifing, The Gambia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+220 446 3450 / +220 437 8810</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>info@gcci.gm / exchange@gcci.gm</span>
              </div>
            </div>
          </div>

          {/* Col 3: Exchange Workflows */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Trade Exchange</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('directory')} className="hover:text-white transition-colors">
                  Verified Business Directory
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition-colors">
                  Product & Service Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('opportunities')} className="hover:text-white transition-colors">
                  Sourcing Tenders & RFQs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('membership')} className="hover:text-white transition-colors">
                  Membership & Gold Verification
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
                  Statutory Compliance Criteria
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Key Sectors in The Gambia */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Sectors & Trade</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="text-slate-300">Agribusiness & Cashew Export</span>
              </li>
              <li>
                <span className="text-slate-300">Port of Banjul & Freight Transit</span>
              </li>
              <li>
                <span className="text-slate-300">Solar Energy & Mini-Grids</span>
              </li>
              <li>
                <span className="text-slate-300">Civil Infrastructure & Construction</span>
              </li>
              <li>
                <span className="text-slate-300">Fintech, QMoney & Mobile Banking</span>
              </li>
              <li>
                <span className="text-slate-300">ECOWAS & AfCFTA Trade Corridors</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Technical Development */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Platform Governance</h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Audited GCCI Verification</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  All Gold badges verified with GRA Tax Clearance and Ministry of Justice commercial registration.
                </p>
              </div>
              <div className="text-[11px] text-slate-500">
                <span>Developed in partnership with </span>
                <span className="text-slate-300 font-medium">Quality Tech Services (QTS)</span>
                <span> for the Gambia Chamber of Commerce and Industry.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal notices */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Gambia Chamber of Commerce and Industry (GCCI). All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs">
            <button onClick={() => setActiveTab('about')} className="hover:text-slate-400">Privacy Policy</button>
            <span aria-hidden="true">·</span>
            <button onClick={() => setActiveTab('about')} className="hover:text-slate-400">Terms of Commercial Exchange</button>
            <span aria-hidden="true">·</span>
            <button onClick={() => setActiveTab('about')} className="hover:text-slate-400">Arbitration & Dispute Resolution</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
