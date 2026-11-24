import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/seedData';
import { GcciLogo } from './GcciLogo';
import { 
  Building2, 
  Search, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  User, 
  LogOut, 
  ChevronDown, 
  Bell, 
  Menu, 
  X,
  FileText,
  Share2
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: (mode: 'signin' | 'register') => void;
  onOpenShare?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAuthModal, onOpenShare }) => {
  const { currentUser, setCurrentUser, notifications, markAllNotificationsAsRead } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const getPortalName = () => {
    switch (currentUser.role) {
      case 'business_owner':
      case 'business_employee':
        return 'Business Portal';
      case 'buyer':
        return 'Buyer Portal';
      case 'investor':
        return 'Investor Portal';
      case 'verification_officer':
      case 'gcci_admin':
      case 'super_admin':
        return 'GCCI Admin';
      default:
        return 'Public Exchange';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Main Nav Container following Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-18">
          {/* Zone 1: GCCI Official Logo */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-3 cursor-pointer shrink-0 py-1"
            title="Gambia Chamber of Commerce and Industry - Home"
          >
            <GcciLogo size="md" className="hover:opacity-95 transition-opacity" />
            <div className="hidden xl:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-xs font-bold text-slate-900 tracking-tight leading-tight">
                Business Exchange
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                National B2B Trade Platform
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links in GCCI Blue Theme */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('directory')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'directory' ? 'text-[#0B42A0] font-bold border-b-2 border-[#0B42A0]' : 'hover:text-[#0B42A0]'}`}
            >
              Directory
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'marketplace' ? 'text-[#0B42A0] font-bold border-b-2 border-[#0B42A0]' : 'hover:text-[#0B42A0]'}`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'opportunities' ? 'text-[#0B42A0] font-bold border-b-2 border-[#0B42A0]' : 'hover:text-[#0B42A0]'}`}
            >
              Opportunities
            </button>
            <button
              onClick={() => setActiveTab('membership')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'membership' ? 'text-[#0B42A0] font-bold border-b-2 border-[#0B42A0]' : 'hover:text-[#0B42A0]'}`}
            >
              Membership
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'about' ? 'text-[#0B42A0] font-bold border-b-2 border-[#0B42A0]' : 'hover:text-[#0B42A0]'}`}
            >
              About & Verification
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action Area with Role Switcher & Account */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Share / Copy Platform Link */}
            {onOpenShare && (
              <button
                onClick={onOpenShare}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#0B42A0] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-2xs"
                title="Get shareable direct links to platform and tools"
              >
                <Share2 className="w-3.5 h-3.5 text-[#0B42A0]" />
                <span className="hidden sm:inline">Share Link</span>
              </button>
            )}

            {/* Notifications Dropdown */}
            {currentUser.role !== 'visitor' && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full"></span>
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                      <span className="font-semibold text-sm text-slate-900">Notifications ({unreadNotifs.length})</span>
                      {unreadNotifs.length > 0 && (
                        <button 
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-emerald-700 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 p-4 text-center">No notifications yet</p>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              if (n.linkTab) setActiveTab(n.linkTab);
                              setShowNotifMenu(false);
                            }}
                            className={`p-3 text-xs hover:bg-slate-50 cursor-pointer ${!n.read ? 'bg-emerald-50/50' : ''}`}
                          >
                            <p className="font-medium text-slate-800">{n.title}</p>
                            <p className="text-slate-600 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Role & Portal Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 whitespace-nowrap"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                <span className="max-w-[120px] sm:max-w-[160px] truncate">
                  {currentUser.role === 'visitor' ? 'Public Visitor' : currentUser.fullName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-slate-400 font-medium">Switch Active Role / Persona</p>
                    <p className="text-slate-800 font-semibold mt-0.5">{currentUser.fullName}</p>
                    <p className="text-slate-500 capitalize">{currentUser.role.replace('_', ' ')} · {currentUser.organization || 'Gambia'}</p>
                  </div>
                  <div className="py-1">
                    {DEMO_USERS.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setShowRoleMenu(false);
                          if (user.role === 'business_owner') setActiveTab('business_portal');
                          else if (user.role === 'buyer') setActiveTab('buyer_portal');
                          else if (user.role === 'investor') setActiveTab('investor_portal');
                          else if (user.role === 'gcci_admin' || user.role === 'verification_officer') setActiveTab('admin_portal');
                          else setActiveTab('home');
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${currentUser.id === user.id ? 'bg-blue-50 text-[#0B42A0] font-medium' : 'text-slate-700'}`}
                      >
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-[11px] text-slate-500 capitalize">{user.role.replace('_', ' ')} · {user.businessName || user.organization}</p>
                        </div>
                        {currentUser.id === user.id && (
                          <span className="text-[#0B42A0] font-bold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portal Jump Button / Sign In in GCCI Blue */}
            {currentUser.role === 'visitor' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0B42A0] rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0B42A0] hover:bg-[#002E7A] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
                >
                  Join the Exchange
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (currentUser.role === 'business_owner' || currentUser.role === 'business_employee') {
                    setActiveTab('business_portal');
                  } else if (currentUser.role === 'buyer') {
                    setActiveTab('buyer_portal');
                  } else if (currentUser.role === 'investor') {
                    setActiveTab('investor_portal');
                  } else {
                    setActiveTab('admin_portal');
                  }
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0B42A0] hover:bg-[#002E7A] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <span>{getPortalName()}</span>
                <span className="text-amber-300">→</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-[#0B42A0]"
          >
            Home
          </button>
          <button
            onClick={() => { setActiveTab('directory'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-[#0B42A0]"
          >
            Find Businesses
          </button>
          <button
            onClick={() => { setActiveTab('marketplace'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-[#0B42A0]"
          >
            Products & Services
          </button>
          <button
            onClick={() => { setActiveTab('opportunities'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-[#0B42A0]"
          >
            Commercial Opportunities
          </button>
          <button
            onClick={() => { setActiveTab('membership'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-[#0B42A0]"
          >
            Membership Plans
          </button>
          <button
            onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-[#0B42A0]"
          >
            About & Verification Standards
          </button>
          {onOpenShare && (
            <button
              onClick={() => { onOpenShare(); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 text-sm font-semibold text-[#0B42A0] flex items-center gap-2 pt-2 border-t border-slate-100"
            >
              <Share2 className="w-4 h-4 text-[#0B42A0]" />
              <span>Share & Copy Platform Links</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
