import { Business, SourcingOpportunity, ProductService } from '../types';

export interface MatchFactor {
  factor: string;
  weight: number;
  matched: boolean;
  explanation: string;
}

export interface MatchResult {
  supplier: Business;
  score: number; // 0 - 100
  factors: MatchFactor[];
  matchLevel: 'High Match' | 'Good Match' | 'Potential Match';
}

/**
 * Rules-based explainable matching engine adhering strictly to Section 11 of GCCI specification.
 * Evaluates category alignment, geographic region, verification status, capability keywords, and certifications.
 */
export function calculateSupplierMatch(
  opportunity: SourcingOpportunity,
  supplier: Business,
  supplierProducts: ProductService[]
): MatchResult {
  const factors: MatchFactor[] = [];
  let totalScore = 0;

  // 1. Category Alignment (Weight: 30%)
  const sameCategory = 
    supplier.category.toLowerCase().includes(opportunity.category.toLowerCase()) ||
    opportunity.category.toLowerCase().includes(supplier.category.toLowerCase()) ||
    supplier.sector.toLowerCase().includes(opportunity.sector.toLowerCase());
  
  if (sameCategory) {
    totalScore += 30;
    factors.push({
      factor: 'Category Alignment',
      weight: 30,
      matched: true,
      explanation: `Operates directly in the requested sector (${supplier.category}).`
    });
  } else {
    factors.push({
      factor: 'Category Alignment',
      weight: 30,
      matched: false,
      explanation: `Specialized in ${supplier.category} rather than requested ${opportunity.category}.`
    });
  }

  // 2. Verification Status & Trust Level (Weight: 25%)
  if (supplier.verificationStatus === 'verified') {
    totalScore += 25;
    factors.push({
      factor: 'GCCI Verification & Compliance',
      weight: 25,
      matched: true,
      explanation: `Fully vetted and certified by GCCI (${supplier.verificationLevel}). Statutory documents on record.`
    });
  } else if (supplier.verificationStatus === 'verification_pending') {
    totalScore += 12;
    factors.push({
      factor: 'GCCI Verification & Compliance',
      weight: 25,
      matched: false,
      explanation: 'Statutory documents submitted; physical review currently pending at GCCI Secretariat.'
    });
  } else {
    factors.push({
      factor: 'GCCI Verification & Compliance',
      weight: 25,
      matched: false,
      explanation: 'Unverified business profile. Has not completed GCCI statutory compliance audit.'
    });
  }

  // 3. Relevant Product / Service Catalog (Weight: 20%)
  const relevantProducts = supplierProducts.filter(p => 
    p.businessId === supplier.id &&
    p.status === 'published' &&
    (p.category.toLowerCase().includes(opportunity.category.toLowerCase()) ||
     opportunity.title.toLowerCase().split(' ').some(w => w.length > 3 && p.title.toLowerCase().includes(w)))
  );

  if (relevantProducts.length > 0) {
    totalScore += 20;
    factors.push({
      factor: 'Product / Service Availability',
      weight: 20,
      matched: true,
      explanation: `Actively lists ${relevantProducts.length} approved commercial item(s) matching requirements.`
    });
  } else {
    factors.push({
      factor: 'Product / Service Availability',
      weight: 20,
      matched: false,
      explanation: 'No identical published product listing in public catalog; evaluated on declared capabilities.'
    });
  }

  // 4. Regional Proximity & Delivery Logistics (Weight: 15%)
  const isLocalRegion = supplier.region === opportunity.buyerRegion;
  const isNational = supplier.region.includes('Kanifing') || supplier.region.includes('Banjul');

  if (isLocalRegion) {
    totalScore += 15;
    factors.push({
      factor: 'Geographic Proximity',
      weight: 15,
      matched: true,
      explanation: `Stationed in the same region (${supplier.region}), reducing transport and lead time.`
    });
  } else if (isNational) {
    totalScore += 10;
    factors.push({
      factor: 'Geographic Proximity',
      weight: 15,
      matched: true,
      explanation: `Located in the Greater Banjul / KMC commercial corridor with nationwide dispatch capability.`
    });
  } else {
    factors.push({
      factor: 'Geographic Proximity',
      weight: 15,
      matched: false,
      explanation: `Located in ${supplier.region}; cross-regional freight transit required.`
    });
  }

  // 5. Explicit Eligibility & Certifications (Weight: 10%)
  let certMatch = false;
  if (opportunity.eligibilityCriteria && opportunity.eligibilityCriteria.length > 0) {
    const matchedCerts = supplier.certifications.filter(c => 
      opportunity.eligibilityCriteria.some(req => req.toLowerCase().includes(c.toLowerCase().slice(0, 5)))
    );
    if (matchedCerts.length > 0 || supplier.certifications.length > 1) {
      certMatch = true;
      totalScore += 10;
      factors.push({
        factor: 'Technical Certifications',
        weight: 10,
        matched: true,
        explanation: `Maintains relevant commercial accreditations (${supplier.certifications.slice(0, 2).join(', ')}).`
      });
    }
  }

  if (!certMatch) {
    factors.push({
      factor: 'Technical Certifications',
      weight: 10,
      matched: false,
      explanation: 'Specific buyer licensing requirements require manual verification during RFP submission.'
    });
  }

  const matchLevel: MatchResult['matchLevel'] = 
    totalScore >= 75 ? 'High Match' : totalScore >= 50 ? 'Good Match' : 'Potential Match';

  return {
    supplier,
    score: Math.min(100, totalScore),
    factors,
    matchLevel
  };
}

/**
 * Finds and ranks all matching suppliers for an opportunity.
 */
export function getRecommendedSuppliersForOpportunity(
  opportunity: SourcingOpportunity,
  allBusinesses: Business[],
  allProducts: ProductService[]
): MatchResult[] {
  // Exclude the buyer's own business
  const candidates = allBusinesses.filter(b => b.ownerId !== opportunity.buyerId && b.id !== opportunity.buyerId);
  
  return candidates
    .map(supplier => calculateSupplierMatch(opportunity, supplier, allProducts))
    .sort((a, b) => b.score - a.score);
}
