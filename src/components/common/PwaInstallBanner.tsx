import React, { useState, useEffect } from 'react';
import { GcciLogo } from './GcciLogo';
import { Download, X } from 'lucide-react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isStandalone || sessionStorage.getItem('gcci_pwa_banner_dismissed') === 'true') return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as InstallPromptEvent);
      setVisible(true);
    };

    const handleAppInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
      sessionStorage.setItem('gcci_pwa_banner_dismissed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
      sessionStorage.setItem('gcci_pwa_banner_dismissed', 'true');
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDeferredPrompt(null);
    sessionStorage.setItem('gcci_pwa_banner_dismissed', 'true');
  };

  if (!visible || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white/95 p-3 text-slate-900 shadow-xl backdrop-blur-md sm:p-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 p-1">
            <GcciLogo variant="mark" className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-xs font-bold leading-tight text-slate-900 sm:text-sm">Install the GCCI app</h4>
            <p className="truncate text-[11px] leading-tight text-slate-500">A faster, full-screen experience.</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={handleInstallClick} className="flex items-center gap-1.5 rounded-full bg-[#0B42A0] px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#002E7A]">
            <Download className="h-3.5 w-3.5" />
            Install
          </button>
          <button onClick={handleDismiss} className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Dismiss install prompt">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
