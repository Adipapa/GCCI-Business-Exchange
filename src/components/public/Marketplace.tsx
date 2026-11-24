import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductService, Currency } from '../../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Package, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  MessageSquare,
  CheckCircle,
  Truck,
  Award,
  Ship
} from 'lucide-react';

interface MarketplaceProps {
  onOpenDealRoom?: (product: ProductService) => void;
  openAuthModal?: (mode: 'signin' | 'register') => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onOpenDealRoom, openAuthModal }) => {
  const { products, currentUser, createDealRoom, businesses } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'product' | 'service'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [exportOnly, setExportOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductService | null>(null);
  const [quotationSuccess, setQuotationSuccess] = useState(false);
  const [quoteQuantity, setQuoteQuantity] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status !== 'published') return false;

      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesBiz = p.businessName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesBiz) return false;
      }

      if (typeFilter !== 'all' && p.type !== typeFilter) {
        return false;
      }

      if (categoryFilter !== 'all' && !p.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
        return false;
      }

      if (exportOnly) {
        const isExportGrade = (p.specifications && Object.values(p.specifications).some(v => v.toLowerCase().includes('export'))) ||
          p.moq?.toLowerCase().includes('ton') ||
          p.moq?.toLowerCase().includes('container') ||
          p.category.includes('Agribusiness') ||
          p.category.includes('Fisheries');
        if (!isExportGrade) return false;
      }

      return true;
    });
  }, [products, searchTerm, typeFilter, categoryFilter, exportOnly]);

  const handleRequestQuotation = (prod: ProductService) => {
    if (currentUser.role === 'visitor') {
      if (openAuthModal) openAuthModal('signin');
      return;
    }

    const biz = businesses.find(b => b.id === prod.businessId);

    createDealRoom({
      title: `Commercial Quotation for: ${prod.title}`,
      originatingType: 'sourcing',
      originatingId: prod.id,
      targetUserId: biz ? biz.ownerId : 'user-vendor',
      targetUserName: prod.businessName,
      targetBusinessName: prod.businessName,
      initialMessage: `Quotation Request from ${currentUser.fullName} (${currentUser.businessName || currentUser.organization}) for "${prod.title}". Requested Quantity: ${quoteQuantity || prod.moq || '1 Unit'}. Specific instructions: ${quoteNotes || 'Standard delivery specifications'}`
    });

    setQuotationSuccess(true);
    setTimeout(() => {
      setQuotationSuccess(false);
      setSelectedProduct(null);
      if (onOpenDealRoom) onOpenDealRoom(prod);
    }, 1500);
  };

  return (
    <div className="gcci-public-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Header */}
      <div className="gcci-page-heading">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            B2B Commercial Marketplace
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Gambian Products & Certified Services
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Procure agricultural commodities, marine exports, construction aggregates, renewable energy installations, and freight services directly from certified Gambian enterprises.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="gcci-filter-panel bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search products, services, raw cashews, solar inverters, curbstones..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Segmented Filter */}
          <div className="md:col-span-3 flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1.5 font-medium rounded-md text-center transition-colors ${typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('product')}
              className={`flex-1 py-1.5 font-medium rounded-md text-center transition-colors ${typeFilter === 'product' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Products
            </button>
            <button
              onClick={() => setTypeFilter('service')}
              className={`flex-1 py-1.5 font-medium rounded-md text-center transition-colors ${typeFilter === 'service' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Services
            </button>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-slate-700"
            >
              <option value="all">All Product Categories</option>
              <option value="Agribusiness">Agribusiness & Food</option>
              <option value="Fisheries">Fisheries & Seafood</option>
              <option value="Construction">Construction Materials</option>
              <option value="Energy">Energy & Solar</option>
              <option value="Logistics">Logistics & Port Freight</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span>
              Displaying <strong className="text-slate-800 font-mono-numbers">{filteredProducts.length}</strong> commercial listings
            </span>
            <button
              onClick={() => setExportOnly(!exportOnly)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${exportOnly ? 'bg-amber-800 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <Ship className="w-3.5 h-3.5" />
              <span>Certified Export Grade Only</span>
            </button>
          </div>
          {(searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' || exportOnly) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setCategoryFilter('all');
                setExportOnly(false);
              }}
              className="text-emerald-700 hover:underline font-medium"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(prod => (
          <div
            key={prod.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
          >
            {/* Image banner with styled fallback */}
            <div className="relative aspect-4/3 bg-slate-100 overflow-hidden group">
              <img
                src={prod.imageUrl}
                alt={prod.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold rounded capitalize">
                  {prod.type}
                </span>
                {prod.specifications?.['Standard']?.includes('Exporter') || prod.title.includes('Cashew') || prod.category === 'Fisheries' ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-800/90 backdrop-blur-xs text-white text-[11px] font-semibold rounded">
                    <Award className="w-3 h-3 text-amber-300" />
                    Certified Exporter
                  </span>
                ) : prod.businessVerified ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-800/90 backdrop-blur-xs text-white text-[11px] font-semibold rounded">
                    <ShieldCheck className="w-3 h-3 text-emerald-300" />
                    Verified Supplier
                  </span>
                ) : null}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <div className="text-[11px] text-slate-500 font-medium">
                {prod.category}
              </div>

              <h3 
                onClick={() => setSelectedProduct(prod)}
                className="font-bold text-slate-900 text-base leading-snug hover:text-emerald-900 cursor-pointer"
              >
                {prod.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {prod.description}
              </p>

              {/* Specs & Pricing Strip */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Indicative Price</span>
                  <span className="font-bold text-emerald-900 text-sm font-mono-numbers">
                    D{prod.price.toLocaleString()} <span className="text-xs font-normal text-slate-500">{prod.currency}</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">MOQ</span>
                  <span className="font-medium text-slate-700 text-xs truncate max-w-[120px] block">
                    {prod.moq || 'Quotation'}
                  </span>
                </div>
              </div>

              {/* Vendor & Region */}
              <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800 truncate max-w-[150px]">{prod.businessName}</span>
                <span className="text-slate-400 font-mono-numbers truncate">{prod.businessRegion}</span>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono-numbers">
                Lead: {prod.leadTime || 'Standard'}
              </span>
              <button
                onClick={() => setSelectedProduct(prod)}
                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
              >
                Request Quotation
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="gcci-empty-state rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <Package className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-base font-semibold text-slate-900">No matching marketplace listings</h3>
          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">Try a different keyword or clear your product, service and export filters.</p>
          <button onClick={() => { setSearchTerm(''); setTypeFilter('all'); setCategoryFilter('all'); setExportOnly(false); }} className="mt-4 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-[#0B42A0] transition hover:bg-blue-100">
            Clear marketplace filters
          </button>
        </div>
      )}

      {/* PRODUCT DETAILS & QUOTATION MODAL */}
      {selectedProduct && (
        <div className="gcci-modal-overlay fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              {selectedProduct.imageUrl && (
                <div className="w-full h-52 sm:h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-semibold uppercase">
                  {selectedProduct.type}
                </span>
                <span className="text-xs text-slate-500">{selectedProduct.category}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {selectedProduct.title}
              </h2>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Indicative Commercial Pricing</span>
                  <span className="text-xl font-bold text-emerald-900 font-mono-numbers">
                    D{selectedProduct.price.toLocaleString()} {selectedProduct.currency}
                  </span>
                  <span className="text-xs text-slate-500 block capitalize">({selectedProduct.priceType.replace('_', ' ')})</span>
                </div>
                <div className="text-right text-xs">
                  <span className="text-slate-500 block">Minimum Order Quantity</span>
                  <span className="font-bold text-slate-800">{selectedProduct.moq || 'As agreed'}</span>
                  <span className="text-slate-500 block mt-1">Lead Time: {selectedProduct.leadTime || 'Immediate'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Description & Scope</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Technical Specifications Table */}
              {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Technical Specifications</h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    {Object.entries(selectedProduct.specifications).map(([key, val], idx) => (
                      <div key={idx} className={`flex justify-between p-2.5 ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                        <span className="font-medium text-slate-600">{key}</span>
                        <span className="font-semibold text-slate-900 font-mono-numbers">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supplier Identity */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{selectedProduct.businessName}</p>
                  <p className="text-slate-500">Location: {selectedProduct.location || selectedProduct.businessRegion}</p>
                </div>
                {selectedProduct.businessVerified && (
                  <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Verified GCCI Supplier
                  </span>
                )}
              </div>

              {/* Direct Quotation Form */}
              <div className="p-5 bg-slate-900 rounded-xl text-white space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    Request Official Commercial Quotation
                  </h4>
                  <span className="text-[11px] text-slate-400">Creates Private Deal Room</span>
                </div>
                
                {quotationSuccess ? (
                  <div className="p-3 bg-emerald-800 text-emerald-100 rounded-lg text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Quotation request sent! Redirecting to Deal Room workspace...</span>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 mb-1">Target Order Quantity</label>
                        <input
                          type="text"
                          value={quoteQuantity}
                          onChange={e => setQuoteQuantity(e.target.value)}
                          placeholder={`e.g. ${selectedProduct.moq || '10 Metric Tonnes'}`}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1">Required Delivery Timeline</label>
                        <input
                          type="text"
                          placeholder="e.g. Within 14 business days"
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Commercial Notes / Specifications</label>
                      <textarea
                        rows={2}
                        value={quoteNotes}
                        onChange={e => setQuoteNotes(e.target.value)}
                        placeholder="Provide details on delivery location in Gambia, packaging preferences, or required testing certificates..."
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRequestQuotation(selectedProduct)}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-sm"
                      >
                        Submit Quotation Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
