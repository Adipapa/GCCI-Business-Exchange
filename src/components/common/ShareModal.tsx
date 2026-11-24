import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Globe, 
  ShieldCheck, 
  FileCheck, 
  TrendingUp, 
  Briefcase, 
  Building2, 
  Calculator,
  Calendar,
  Lock
} from 'lucide-react';
import { GcciLogo } from './GcciLogo';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, currentTab }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  // Use the canonical production shared URL or fallback to current origin
  const baseUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('run.app') ? window.location.origin : 'https://ais-pre-mmoq5mnw7k5l3w4a6di3up-230393696260.europe-west1.run.app')
    : 'https://ais-pre-mmoq5mnw7k5l3w4a6di3up-230393696260.europe-west1.run.app';

  const shareLinks = [
    {
      key: 'main',
      title: 'GCCI Sovereign Platform (Main Entry)',
      description: 'Official Gambia Chamber of Commerce & Industry Digital Exchange',
      url: baseUrl,
      icon: Globe,
      color: 'text-[#0B42A0] bg-blue-50'
    },
    {
      key: 'verifier',
      title: 'Certificate of Origin (COO) & Business Verifier',
      description: 'Live statutory registry & legal standing lookup',
      url: `${baseUrl}/?tab=home#verifier`,
      icon: FileCheck,
      color: 'text-[#005A36] bg-emerald-50'
    },
    {
      key: 'commodities',
      title: 'GCCI Live Commodity Price Benchmark',
      description: 'Port of Banjul FOB & Kanifing Wholesale Indicative Rates',
      url: `${baseUrl}/?tab=home#commodities`,
      icon: TrendingUp,
      color: 'text-amber-700 bg-amber-50'
    },
    {
      key: 'due-diligence',
      title: 'Statutory Due Diligence & Accreditation Framework',
      description: '3-Tier accreditation standards: Basic, EDD, and Gold Sovereign Exporter',
      url: `${baseUrl}/?tab=home#due-diligence`,
      icon: ShieldCheck,
      color: 'text-[#005A36] bg-emerald-50'
    },
    {
      key: 'afcfta',
      title: 'AfCFTA & ECOWAS Tariff Savings Calculator',
      description: 'Zero-duty corridor calculations under GCCI Rules of Origin',
      url: `${baseUrl}/?tab=home#afcfta`,
      icon: Calculator,
      color: 'text-amber-700 bg-amber-50'
    },
    {
      key: 'missions',
      title: 'GCCI Bilateral Trade Missions 2026',
      description: 'Senegal Corridor Forum, AfCFTA Summit & Bilateral Delegations',
      url: `${baseUrl}/?tab=home#missions`,
      icon: Calendar,
      color: 'text-[#0B42A0] bg-blue-50'
    },
    {
      key: 'directory',
      title: 'Verified Business Directory',
      description: 'Certified Gambian Exporters, Manufacturers & Commercial Services',
      url: `${baseUrl}/?tab=directory`,
      icon: Building2,
      color: 'text-[#0B42A0] bg-blue-50'
    },
    {
      key: 'marketplace',
      title: 'Export Products & Commodity Catalog',
      description: 'Cashew, Atlantic seafood, groundnuts, solar & construction',
      url: `${baseUrl}/?tab=marketplace`,
      icon: Briefcase,
      color: 'text-[#005A36] bg-emerald-50'
    },
    {
      key: 'opportunities',
      title: 'Commercial Sourcing Tenders & RFQs',
      description: 'Active public & private sector procurement requirements',
      url: `${baseUrl}/?tab=opportunities`,
      icon: Briefcase,
      color: 'text-slate-700 bg-slate-100'
    },
    {
      key: 'admin',
      title: 'GCCI Administrative & Due Diligence Portal',
      description: 'Compliance officers, dossier auditing, sanctions & verification tools',
      url: `${baseUrl}/?tab=admin_portal`,
      icon: Lock,
      color: 'text-rose-700 bg-rose-50'
    }
  ];

  const handleCopy = (key: string, url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    } else {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#002E7A] to-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Access & Share Platform Via Link</h3>
                <p className="text-xs text-slate-300">
                  Share direct deep links to public exchange tools, verifiers, or portals
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Primary Direct Link Banner */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Direct Shareable Web Link
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={baseUrl}
              className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono text-slate-800 select-all focus:outline-none focus:border-[#0B42A0]"
            />
            <button
              onClick={() => handleCopy('main_direct', baseUrl)}
              className="px-4 py-2.5 bg-[#0B42A0] hover:bg-[#002E7A] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              {copiedKey === 'main_direct' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Anyone with this link can open and navigate the official GCCI digital trade exchange on desktop, tablet, or mobile.
          </p>
        </div>

        {/* Deep Links Grid */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Direct Links to Specific Sections & Tools
          </span>

          <div className="divide-y divide-slate-100">
            {shareLinks.map(link => {
              const Icon = link.icon;
              const isCopied = copiedKey === link.key;

              return (
                <div key={link.key} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${link.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {link.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {link.description}
                      </p>
                      <span className="text-[10px] font-mono text-blue-600 truncate block mt-0.5">
                        {link.url}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(link.key, link.url)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        isCopied 
                          ? 'bg-emerald-100 text-[#005A36]' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#005A36]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Open in new window"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <GcciLogo size="sm" className="h-5 w-auto" />
            <span>Gambia Chamber of Commerce and Industry</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
