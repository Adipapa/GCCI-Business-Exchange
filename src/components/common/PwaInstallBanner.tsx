import React, { useState, useEffect } from 'react';
import { GcciLogo } from './GcciLogo';
import { Download, X, Check } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(true);
  const [installed, setInstalled] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('gcci_pwa_banner_dismissed') === 'true') {
      setVisible(false);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setVisible(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      setInfoMessage('Use browser menu (⋮ or Share) and choose "Add to Home screen" to install.');
      setTimeout(() => setInfoMessage(null), 4000);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('gcci_pwa_banner_dismissed', 'true');
  };

  if (!visible || installed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white/95 backdrop-blur-md border border-amber-900/15 rounded-2xl shadow-xl p-3 sm:p-3.5 flex flex-col gap-2 text-slate-900">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 p-1">
              <GcciLogo variant="mark" className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                Install the GCCI app
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight truncate">
                A faster, full-screen experience.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-4 py-1.5 bg-[#4d3205] hover:bg-[#3d2703] text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5 transition-all hover:scale-102"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {infoMessage && (
          <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
