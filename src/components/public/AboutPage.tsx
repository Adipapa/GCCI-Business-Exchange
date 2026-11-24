import React, { useState } from 'react';
import { GcciLogo } from '../common/GcciLogo';
import { 
  ShieldCheck, 
  Building2, 
  Award, 
  FileCheck, 
  ChevronDown, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is GCCI Business Exchange?',
      a: 'The GCCI Business Exchange is the national digital commerce, sourcing, and trade facilitation platform established by the Gambia Chamber of Commerce and Industry (GCCI) in partnership with Quality Tech Services (QTS). It provides verified company discovery, tender publication, transparent rules-based matching, and encrypted Deal Rooms.'
    },
    {
      q: 'How does a Gambian business obtain the GCCI Verified badge?',
      a: 'Verification is an audited statutory process. A company must upload its valid Certificate of Incorporation from the Ministry of Justice, current Tax Clearance Certificate from Gambia Revenue Authority (GRA), GCCI annual membership certificate, and operational sector licenses (e.g. FSQA for food handling, PURA for electrical/energy, GPA for shipping). GCCI verification officers independently audit these filings before conferring the Gold badge.'
    },
    {
      q: 'Does paying for a membership plan automatically verify my business?',
      a: 'No. In compliance with Section 7.3 and 15.4 of the GCCI Governance Constitution, paying for a subscription unlocks advanced platform features (unlimited Deal Rooms, analytics, priority directory ranking), but never bypasses or guarantees statutory verification. Every verification is vetted independently by designated compliance officers.'
    },
    {
      q: 'What is a B2B Deal Room?',
      a: 'A Deal Room is a private, confidential workspace created between an approved buyer and supplier (or investor and enterprise). Within the Deal Room, parties exchange binding quotations, sign contracts, upload non-disclosure agreements, assign action items, and record final commercial completion values under GCCI arbitration guidelines.'
    },
    {
      q: 'Can international buyers and investors from ECOWAS participate?',
      a: 'Yes. The platform is designed to connect Gambian producers and logistics providers with buyers and institutional funds across Senegal (Casamance & Dakar), Mali, Ghana, Nigeria, and broader international export markets.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section with Official GCCI Logo and Theme Colors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#0B42A0] border border-blue-200 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#0B42A0]" />
            <span>Gambia Chamber of Commerce and Industry & QTS Partnership</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Institutional Infrastructure for Gambian Commercial Growth
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The Gambia Chamber of Commerce and Industry (GCCI) is the autonomous non-profit membership organization representing the voice of the Gambian private sector. The GCCI Business Exchange transforms national trade by replacing informal arrangements with verified corporate profiles, structured public tenders, and auditable commercial agreements.
          </p>
          {/* Official Chamber Palette Indicators */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
            <span className="text-slate-500">Official Theme:</span>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0B42A0] border border-blue-800"></span>
              <span>GCCI Royal Blue (#0B42A0)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3.5 h-3.5 rounded-full bg-[#005A36] border border-emerald-800"></span>
              <span>Gambian Green (#005A36)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] border border-amber-600"></span>
              <span>Chamber Gold (#F59E0B)</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <GcciLogo size="lg" className="mb-3" />
          <p className="text-xs font-semibold text-slate-800">Official GCCI Insignia</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
            Representing industrial mechanization, Gambian agriculture, and statutory trade leadership.
          </p>
        </div>
      </div>

      {/* Verification Pillars Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            The GCCI 4-Pillar Verification Standard
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Every verified badge on this platform represents genuine, verified statutory standing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: '1. Legal Incorporation',
              desc: 'Confirmed registration with the Ministry of Justice Registrar of Companies and verified Business Registration Number.',
              icon: Building2
            },
            {
              title: '2. Fiscal Compliance',
              desc: 'Audited Tax Identification Number (TIN) and active Tax Clearance Certificate issued by Gambia Revenue Authority (GRA).',
              icon: FileCheck
            },
            {
              title: '3. Technical Accreditation',
              desc: 'Industry-specific licensing from Food Safety and Quality Authority (FSQA), PURA, or Gambia Ports Authority (GPA).',
              icon: Award
            },
            {
              title: '4. Physical Audit',
              desc: 'Inspection of physical commercial premises, processing facility, or warehouse by GCCI designated compliance officers.',
              icon: ShieldCheck
            }
          ].map((item, idx) => (
            <div key={idx} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 mt-1">Common inquiries from Gambian enterprises, procurement buyers, and investors.</p>
        </div>

        <div className="space-y-3 max-w-3xl">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:text-emerald-900"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === i && (
                <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Secretariats and Regional Contact Information */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">GCCI Secretariat & Regional Hubs</h2>
          <p className="text-xs text-slate-400 mt-1">Our offices across The Gambia are available to assist with onboarding and verification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <h3 className="font-bold text-sm text-white">GCCI Headquarters (Kerr Jula)</h3>
            <p className="text-slate-400">Bertil Harding Highway, Bijilo / Kanifing</p>
            <p className="pt-1 font-mono-numbers">Tel: +220 446 3450 / 446 3452</p>
            <p className="font-mono-numbers">Email: info@gcci.gm</p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <h3 className="font-bold text-sm text-white">Banjul Port Trade Desk</h3>
            <p className="text-slate-400">Liberation Avenue, Near GPA Terminal, Banjul</p>
            <p className="pt-1 font-mono-numbers">Tel: +220 422 7100</p>
            <p className="font-mono-numbers">Email: portdesk@gcci.gm</p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <h3 className="font-bold text-sm text-white">Brikama & West Coast Liaison</h3>
            <p className="text-slate-400">Brikama Commercial Centre, Kombo Central</p>
            <p className="pt-1 font-mono-numbers">Tel: +220 771 9020</p>
            <p className="font-mono-numbers">Email: westcoast@gcci.gm</p>
          </div>
        </div>
      </section>
    </div>
  );
};
