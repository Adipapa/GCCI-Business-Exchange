export type UserRole = 
  | 'visitor' 
  | 'business_owner' 
  | 'business_employee' 
  | 'buyer' 
  | 'investor' 
  | 'verification_officer' 
  | 'gcci_admin' 
  | 'super_admin';

export type BusinessStatus = 
  | 'draft' 
  | 'submitted' 
  | 'unverified' 
  | 'verification_pending' 
  | 'verified' 
  | 'verification_rejected' 
  | 'suspended';

export type MembershipTier = 'basic' | 'verified' | 'pro' | 'corporate' | 'enterprise';

export type Currency = 'GMD' | 'USD' | 'EUR' | 'XOF';

export type GambianRegion = 
  | 'Banjul'
  | 'Kanifing Municipality (KMC)'
  | 'West Coast Region (Brikama)'
  | 'North Bank Region (Kerewan)'
  | 'Lower River Region (Mansa Konko)'
  | 'Central River Region (Janjangbureh)'
  | 'Upper River Region (Basse)'
  | 'ECOWAS / Regional';

export interface VerificationDocument {
  id: string;
  title: string;
  type: 'incorporation' | 'tin_certificate' | 'tax_clearance' | 'gcci_certificate' | 'license';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface BusinessEmployee {
  id: string;
  businessId: string;
  name: string;
  email: string;
  role: string;
  permissions: {
    canEditProfile: boolean;
    canManageProducts: boolean;
    canManageOpportunities: boolean;
    canRespondInquiries: boolean;
    canAccessDealRooms: boolean;
    canViewAnalytics: boolean;
  };
  status: 'active' | 'invited' | 'disabled';
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  tradingName: string;
  registrationNumber: string;
  tinNumber: string;
  gcciMemberNumber: string;
  legalStructure: 'Sole Proprietorship' | 'Partnership' | 'Private Limited Company (Ltd)' | 'Public Company' | 'Cooperative' | 'NGO/Enterprise';
  sector: string;
  category: string;
  description: string;
  yearEstablished: number;
  employeesCount: number;
  logo: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  region: GambianRegion;
  country: string;
  capabilities: string[];
  certifications: string[];
  verificationStatus: BusinessStatus;
  verificationLevel: 'Unverified' | 'Basic Documents Checked' | 'GCCI Verified Business' | 'Gold Certified Exporter';
  verificationNotes?: string;
  verifiedAt?: string;
  verificationDocs: VerificationDocument[];
  membershipTier: MembershipTier;
  membershipExpiry: string;
  featured: boolean;
  publicVisibility: boolean;
  rating?: number;
  completedDealsCount?: number;
  totalDealValueGMD?: number;
  dueDiligence?: DueDiligenceDossier;
  isSanctioned?: boolean;
  sanctionReason?: string;
  sanctionedAt?: string;
  complianceNotice?: string;
  riskScore?: number;
  fiuClearanceStatus?: 'cleared' | 'pending' | 'flagged';
  annualComplianceExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DueDiligenceChecklist {
  legalRegistration: boolean;        // Ministry of Justice certificate & annual returns
  tinTaxClearance: boolean;          // GRA Tax Clearance Certificate 2026
  physicalPremiseVerified: boolean;  // GCCI Field Inspector physical site verification
  sshfcCompliance: boolean;          // Social Security & Housing Finance Corp standing
  amlSanctionsClear: boolean;        // Financial Intelligence Unit (FIU) & ECOWAS PEP/Sanctions
  uboIdentification: boolean;        // Ultimate Beneficial Owners (UBO) ID verified
  bankReferenceValid: boolean;       // Commercial bank solvency reference
  qualityCertifications: boolean;    // FSQA / TGSB / ISO / PURA standards
}

export interface SiteInspectionRecord {
  inspectorName: string;
  inspectionDate: string;
  premiseAddress: string;
  premiseType: 'Factory / Plant' | 'Warehouse / Logistics Depot' | 'Corporate Office' | 'Commercial Farm' | 'Retail Facility';
  facilityStatus: 'Operational & Verified' | 'Conditional Approval' | 'Discrepancy Noted';
  notes: string;
}

export interface DueDiligenceDossier {
  diligenceScore: number; // 0 to 100
  diligenceLevel: 'Tier 1: Basic Statutory' | 'Tier 2: Enhanced Due Diligence (EDD)' | 'Tier 3: Gold Sovereign Exporter';
  riskRating: 'Low Risk' | 'Moderate Risk' | 'Enhanced Monitoring' | 'High Risk';
  checklist: DueDiligenceChecklist;
  auditorId: string;
  auditorName: string;
  lastAuditedAt: string;
  expiryDate: string;
  dossierReference: string;
  siteInspection?: SiteInspectionRecord;
  sanctionsCheckResult: 'Clear - No Sanction Matches' | 'Pending FIU Review' | 'Flagged';
  complianceNotes: string;
}

export interface AdminStaffUser {
  id: string;
  name: string;
  email: string;
  department: 'Compliance & Legal' | 'Trade Development & Sourcing' | 'Member Services' | 'Finance & Treasury' | 'Executive Secretariat';
  role: 'super_admin' | 'gcci_admin' | 'verification_officer';
  permissions: {
    canApproveVerification: boolean;
    canExecuteDueDiligence: boolean;
    canFreezeBusinesses: boolean;
    canModerateOpportunities: boolean;
    canManagePayments: boolean;
    canExportRegistry: boolean;
  };
  status: 'active' | 'suspended';
  lastActive: string;
}

export interface ProductService {
  id: string;
  businessId: string;
  businessName: string;
  businessRegion: GambianRegion;
  businessVerified: boolean;
  type: 'product' | 'service';
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
  currency: Currency;
  priceType: 'fixed' | 'quotation' | 'starting_at';
  moq?: string;
  leadTime?: string;
  location: string;
  availability: 'in_stock' | 'made_to_order' | 'available' | 'booked';
  status: 'draft' | 'pending' | 'published' | 'rejected' | 'archived';
  specifications: Record<string, string>;
  createdAt: string;
}

export interface SourcingOpportunity {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerOrg: string;
  buyerVerified: boolean;
  buyerRegion: GambianRegion;
  title: string;
  category: string;
  sector: string;
  description: string;
  requiredSpecs: string;
  quantity: number;
  unit: string;
  deliveryLocation: string;
  requiredDeliveryDate: string;
  budgetMin?: number;
  budgetMax?: number;
  currency: Currency;
  eligibilityCriteria: string[];
  supportingDocs?: string[];
  openingDate: string;
  closingDate: string;
  visibility: 'public' | 'verified_only' | 'confidential';
  status: 'draft' | 'published' | 'under_review' | 'closed' | 'awarded';
  responsesCount: number;
  createdAt: string;
}

export interface SupplierResponse {
  id: string;
  opportunityId: string;
  supplierId: string;
  supplierName: string;
  supplierVerified: boolean;
  supplierRegion: GambianRegion;
  supplierMembershipTier: MembershipTier;
  offeredQuantity: number;
  unit: string;
  proposedPricePerUnit: number;
  totalProposedPrice: number;
  currency: Currency;
  deliveryDays: number;
  technicalProposal: string;
  complianceNotes: string;
  submittedAt: string;
  status: 'submitted' | 'shortlisted' | 'negotiating' | 'accepted' | 'rejected';
  rejectionReason?: string;
}

export interface InvestmentOpportunity {
  id: string;
  businessId: string;
  businessName: string;
  businessRegion: GambianRegion;
  sector: string;
  businessStage: 'Seed' | 'Early Stage' | 'Growth' | 'Expansion' | 'Scale-Up';
  investmentObjective: string;
  fundingRequired: number;
  currency: Currency;
  equityOfferedPercentage?: number;
  debtOfferedRate?: number;
  structure: 'Equity' | 'Convertible Debt' | 'Venture Debt' | 'Revenue Sharing' | 'Trade Financing';
  intendedUseOfFunds: string;
  annualRevenue: number;
  grossMarginPercentage: number;
  pitchSummary: string;
  confidential: boolean;
  documentsCount: number;
  status: 'draft' | 'published' | 'in_discussion' | 'due_diligence' | 'funded' | 'closed';
  introductionRequestsCount: number;
  createdAt: string;
}

export interface IntroductionRequest {
  id: string;
  investmentOpportunityId: string;
  opportunityTitle: string;
  investorId: string;
  investorName: string;
  investorOrg: string;
  targetBusinessId: string;
  targetBusinessName: string;
  message: string;
  ndaSigned: boolean;
  status: 'pending' | 'approved' | 'declined';
  requestedAt: string;
  approvedAt?: string;
}

export interface InvestorProfile {
  id: string;
  userId: string;
  fullName: string;
  organization: string;
  investorType: 'Angel Investor' | 'Venture Capital' | 'Private Equity' | 'Development Finance Institution (DFI)' | 'Family Office' | 'Corporate Venture';
  ticketMinGMD: number;
  ticketMaxGMD: number;
  preferredSectors: string[];
  preferredStages: string[];
  geographicFocus: string[];
  bio: string;
  accredited: boolean;
}

export interface DealRoomActionItem {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
}

export interface DealRoomDocument {
  id: string;
  title: string;
  fileName: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  confidential: boolean;
  fileUrl: string;
}

export interface DealRoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderBusiness: string;
  content: string;
  timestamp: string;
  attachmentName?: string;
}

export interface DealRoom {
  id: string;
  referenceNumber: string;
  title: string;
  originatingType: 'sourcing' | 'investment' | 'partnership' | 'direct_inquiry';
  originatingId?: string;
  participants: {
    userId: string;
    name: string;
    businessName: string;
    role: string;
    isLead?: boolean;
  }[];
  status: 
    | 'awaiting_response'
    | 'contacted'
    | 'negotiating'
    | 'due_diligence'
    | 'agreement_reached'
    | 'completed'
    | 'unsuccessful'
    | 'cancelled';
  reportedValue?: number;
  currency: Currency;
  reportedOutcome?: string;
  closureReason?: string;
  actionItems: DealRoomActionItem[];
  documents: DealRoomDocument[];
  messages: DealRoomMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  tier: MembershipTier;
  priceGMD: number;
  priceUSD: number;
  billingInterval: 'monthly' | 'annual';
  description: string;
  features: string[];
  badgeText: string;
  active: boolean;
  maxListings: number;
  includesDealRooms: boolean;
  directoryPriority: number;
}

export interface PaymentRecord {
  id: string;
  businessId: string;
  businessName: string;
  planId: string;
  planName: string;
  amount: number;
  currency: Currency;
  paymentMethod: 'QMoney' | 'Afrimoney' | 'Bank Transfer (Trust Bank / Ecobank)' | 'Card (Visa/Mastercard)' | 'Cash at GCCI Secretariat';
  reference: string;
  invoiceNumber: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  timestamp: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'deal';
  linkTab?: string;
  read: boolean;
  timestamp: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  sector: string;
  description: string;
  iconName: string;
  active: boolean;
  itemCount: number;
}

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  businessId?: string;
  businessName?: string;
  organization?: string;
  phone?: string;
  avatar?: string;
}
