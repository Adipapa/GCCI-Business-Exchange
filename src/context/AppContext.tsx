import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Business, 
  ProductService, 
  SourcingOpportunity, 
  SupplierResponse, 
  InvestmentOpportunity, 
  DealRoom, 
  MembershipPlan, 
  PaymentRecord, 
  AuditLog, 
  CategoryItem,
  UserSession,
  NotificationItem,
  InvestorProfile,
  IntroductionRequest,
  DealRoomMessage,
  DealRoomDocument,
  DealRoomActionItem,
  BusinessStatus,
  AdminStaffUser,
  DueDiligenceDossier,
  SiteInspectionRecord
} from '../types';
import { 
  INITIAL_BUSINESSES, 
  INITIAL_PRODUCTS, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_RESPONSES, 
  INITIAL_INVESTMENTS, 
  INITIAL_DEAL_ROOMS, 
  INITIAL_MEMBERSHIP_PLANS, 
  INITIAL_CATEGORIES, 
  INITIAL_PAYMENTS, 
  INITIAL_AUDIT_LOGS, 
  DEMO_USERS, 
  INITIAL_INVESTOR_PROFILE,
  INITIAL_ADMIN_STAFF
} from '../data/seedData';

interface AppContextType {
  currentUser: UserSession;
  setCurrentUser: (user: UserSession) => void;
  businesses: Business[];
  products: ProductService[];
  opportunities: SourcingOpportunity[];
  responses: SupplierResponse[];
  investments: InvestmentOpportunity[];
  dealRooms: DealRoom[];
  membershipPlans: MembershipPlan[];
  categories: CategoryItem[];
  payments: PaymentRecord[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  investorProfile: InvestorProfile;
  introductionRequests: IntroductionRequest[];
  adminStaff: AdminStaffUser[];
  
  // Actions
  createBusiness: (data: Partial<Business>) => Business;
  updateBusiness: (id: string, data: Partial<Business>) => void;
  submitVerificationDoc: (businessId: string, doc: { title: string; type: any; fileName: string; fileSize: string }) => void;
  reviewVerification: (businessId: string, decision: 'verified' | 'verification_rejected', notes: string) => void;
  suspendBusiness: (businessId: string, reason: string) => void;
  reactivateBusiness: (businessId: string) => void;
  conductDueDiligence: (businessId: string, dossier: Partial<DueDiligenceDossier>) => void;
  applySanction: (businessId: string, reason: string) => void;
  liftSanction: (businessId: string) => void;
  issueComplianceNotice: (businessId: string, message: string) => void;
  reconcilePayment: (paymentId: string, status: 'completed' | 'failed') => void;
  moderateOpportunity: (opportunityId: string, status: SourcingOpportunity['status'], notes?: string) => void;
  updateAdminStaff: (id: string, updates: Partial<AdminStaffUser>) => void;
  addAdminStaff: (staff: Omit<AdminStaffUser, 'id' | 'lastActive'>) => void;
  
  createProduct: (data: Omit<ProductService, 'id' | 'createdAt'>) => ProductService;
  updateProduct: (id: string, data: Partial<ProductService>) => void;
  deleteProduct: (id: string) => void;
  
  createOpportunity: (data: Omit<SourcingOpportunity, 'id' | 'createdAt' | 'responsesCount'>) => SourcingOpportunity;
  updateOpportunityStatus: (id: string, status: SourcingOpportunity['status']) => void;
  
  submitSupplierResponse: (data: Omit<SupplierResponse, 'id' | 'submittedAt' | 'status'>) => SupplierResponse;
  updateResponseStatus: (id: string, status: SupplierResponse['status'], notes?: string) => void;
  
  createDealRoom: (data: {
    title: string;
    originatingType: DealRoom['originatingType'];
    originatingId?: string;
    targetUserId: string;
    targetUserName: string;
    targetBusinessName: string;
    initialMessage?: string;
  }) => DealRoom;
  addDealRoomMessage: (dealRoomId: string, content: string, attachmentName?: string) => void;
  addDealRoomDocument: (dealRoomId: string, doc: Omit<DealRoomDocument, 'id' | 'uploadedAt' | 'uploadedBy'>) => void;
  addDealRoomActionItem: (dealRoomId: string, item: { title: string; assignedTo: string; dueDate: string }) => void;
  toggleActionItem: (dealRoomId: string, itemId: string) => void;
  updateDealRoomStatus: (dealRoomId: string, status: DealRoom['status'], reportedValue?: number, outcome?: string) => void;
  
  requestIntroduction: (investmentId: string, message: string) => void;
  reviewIntroductionRequest: (requestId: string, status: 'approved' | 'declined') => void;
  
  subscribeMembership: (planId: string, paymentMethod: PaymentRecord['paymentMethod']) => PaymentRecord;
  updateMembershipPlan: (planId: string, updates: Partial<MembershipPlan>) => void;
  
  addCategory: (category: Omit<CategoryItem, 'id' | 'itemCount'>) => void;
  toggleCategory: (categoryId: string) => void;
  
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  logAuditEvent: (action: string, targetType: string, targetId: string, details: string) => void;
  exportDataToCSV: (type: 'businesses' | 'opportunities' | 'dealRooms' | 'payments') => void;
  resetToDemoSeed: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'gcci_v4_current_user',
  BUSINESSES: 'gcci_v4_businesses_db',
  PRODUCTS: 'gcci_v4_products_db',
  OPPORTUNITIES: 'gcci_v4_opportunities_db',
  RESPONSES: 'gcci_v4_responses_db',
  INVESTMENTS: 'gcci_v4_investments_db',
  DEAL_ROOMS: 'gcci_v4_deal_rooms_db',
  PLANS: 'gcci_v4_plans_db',
  CATEGORIES: 'gcci_v4_categories_db',
  PAYMENTS: 'gcci_v4_payments_db',
  LOGS: 'gcci_v4_logs_db',
  NOTIFICATIONS: 'gcci_v4_notifications_db',
  INTRO_REQS: 'gcci_v4_intro_requests_db',
  STAFF: 'gcci_v4_staff_db'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or seed
  const [currentUser, setCurrentUserState] = useState<UserSession>(() => {
    try {
      const saved = import.meta.env.DEV ? localStorage.getItem(STORAGE_KEYS.USER) : null;
      return saved ? JSON.parse(saved) : DEMO_USERS[5];
    } catch {
      return DEMO_USERS[5];
    }
  });

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
      return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
    } catch {
      return INITIAL_BUSINESSES;
    }
  });

  const [products, setProducts] = useState<ProductService[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [opportunities, setOpportunities] = useState<SourcingOpportunity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
    } catch {
      return INITIAL_OPPORTUNITIES;
    }
  });

  const [responses, setResponses] = useState<SupplierResponse[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESPONSES);
      return saved ? JSON.parse(saved) : INITIAL_RESPONSES;
    } catch {
      return INITIAL_RESPONSES;
    }
  });

  const [investments, setInvestments] = useState<InvestmentOpportunity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_INVESTMENTS;
    } catch {
      return INITIAL_INVESTMENTS;
    }
  });

  const [dealRooms, setDealRooms] = useState<DealRoom[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEAL_ROOMS);
      return saved ? JSON.parse(saved) : INITIAL_DEAL_ROOMS;
    } catch {
      return INITIAL_DEAL_ROOMS;
    }
  });

  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERSHIP_PLANS;
    } catch {
      return INITIAL_MEMBERSHIP_PLANS;
    }
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'notif-1',
        userId: 'user-modou',
        title: 'New Bid Discussion',
        message: 'Dr. Kebba Touray replied in Deal Room #GCCI-DR-2026-041 regarding groundnut seeds.',
        type: 'deal',
        linkTab: 'dealrooms',
        read: false,
        timestamp: '10 mins ago'
      },
      {
        id: 'notif-2',
        userId: 'user-modou',
        title: 'GCCI Verification Active',
        message: 'Your official GCCI Gold Verified badge is active until April 2027.',
        type: 'success',
        linkTab: 'verification',
        read: true,
        timestamp: '2 days ago'
      }
    ];
  });

  const [investorProfile, setInvestorProfile] = useState<InvestorProfile>(INITIAL_INVESTOR_PROFILE);
  const [introductionRequests, setIntroductionRequests] = useState<IntroductionRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTRO_REQS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'intro-1',
        investmentOpportunityId: 'inv-01',
        opportunityTitle: 'Automated Industrial Cashew Kernel Shelling Facility',
        investorId: 'user-karamo',
        investorName: 'Karamo Ceesay',
        investorOrg: 'Sahel Growth Capital',
        targetBusinessId: 'biz-01',
        targetBusinessName: 'Gambia Cashew & Agro-Processing Ltd',
        message: 'We are prepared to deploy 14.5M GMD growth equity with technical advisors from Abidjan. Requesting confidential financial statements and factory architectural blueprints.',
        ndaSigned: true,
        status: 'approved',
        requestedAt: '2026-10-10'
      }
    ];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
  }, [responses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEAL_ROOMS, JSON.stringify(dealRooms));
  }, [dealRooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(membershipPlans));
  }, [membershipPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const [adminStaff, setAdminStaff] = useState<AdminStaffUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_STAFF;
    } catch {
      return INITIAL_ADMIN_STAFF;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTRO_REQS, JSON.stringify(introductionRequests));
  }, [introductionRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(adminStaff));
  }, [adminStaff]);

  const setCurrentUser = (user: UserSession) => {
    if (!import.meta.env.DEV) return;
    setCurrentUserState(user);
    logAuditEvent('USER_ROLE_SWITCH', 'User', user.id, `Switched active demo session to ${user.fullName} (${user.role})`);
  };

  const logAuditEvent = (action: string, targetType: string, targetId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const createBusiness = (data: Partial<Business>): Business => {
    const newBiz: Business = {
      id: `biz-${Date.now()}`,
      ownerId: currentUser.id,
      name: data.name || 'New Gambian Commercial Enterprise Ltd',
      tradingName: data.tradingName || data.name || 'New Enterprise',
      registrationNumber: data.registrationNumber || `GM-CO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      tinNumber: data.tinNumber || `TIN-${Math.floor(100000000 + Math.random() * 900000000)}`,
      gcciMemberNumber: `GCCI-APP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      legalStructure: data.legalStructure || 'Private Limited Company (Ltd)',
      sector: data.sector || 'Agribusiness & Food Processing',
      category: data.category || 'Agribusiness & Food Processing',
      description: data.description || '',
      yearEstablished: data.yearEstablished || new Date().getFullYear(),
      employeesCount: data.employeesCount || 5,
      logo: data.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
      website: data.website || '',
      phone: data.phone || currentUser.phone || '+220 700 0000',
      email: data.email || currentUser.email || 'office@company.gm',
      address: data.address || 'Kairaba Avenue, KMC',
      region: data.region || 'Kanifing Municipality (KMC)',
      country: 'The Gambia',
      capabilities: data.capabilities || ['Commercial trading in The Gambia'],
      certifications: data.certifications || ['GCCI Registered Member'],
      verificationStatus: 'verification_pending',
      verificationLevel: 'Basic Documents Checked',
      verificationDocs: [],
      membershipTier: 'basic',
      membershipExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      featured: false,
      publicVisibility: true,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    setBusinesses(prev => [newBiz, ...prev]);
    logAuditEvent('CREATE_BUSINESS_PROFILE', 'Business', newBiz.id, `Created business profile for ${newBiz.name}`);

    // Update current user business ID
    setCurrentUser({
      ...currentUser,
      businessId: newBiz.id,
      businessName: newBiz.name
    });

    return newBiz;
  };

  const updateBusiness = (id: string, data: Partial<Business>) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : b));
    logAuditEvent('UPDATE_BUSINESS_PROFILE', 'Business', id, `Updated business details`);
  };

  const submitVerificationDoc = (businessId: string, doc: { title: string; type: any; fileName: string; fileSize: string }) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: doc.title,
      type: doc.type,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      uploadedAt: new Date().toISOString().slice(0, 10),
      status: 'pending' as const
    };

    setBusinesses(prev => prev.map(b => {
      if (b.id === businessId) {
        return {
          ...b,
          verificationDocs: [...b.verificationDocs, newDoc],
          verificationStatus: 'verification_pending' as BusinessStatus
        };
      }
      return b;
    }));

    logAuditEvent('SUBMITTED_VERIFICATION_DOC', 'Business', businessId, `Uploaded statutory document: ${doc.title} (${doc.fileName})`);
  };

  const reviewVerification = (businessId: string, decision: 'verified' | 'verification_rejected', notes: string) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === businessId) {
        return {
          ...b,
          verificationStatus: decision,
          verificationLevel: decision === 'verified' ? 'GCCI Verified Business' : 'Unverified',
          verificationNotes: notes,
          verifiedAt: decision === 'verified' ? new Date().toISOString().slice(0, 10) : undefined
        };
      }
      return b;
    }));

    logAuditEvent(
      decision === 'verified' ? 'APPROVED_BUSINESS_VERIFICATION' : 'REJECTED_BUSINESS_VERIFICATION',
      'Business',
      businessId,
      `Verification decision: ${decision}. Notes: ${notes}`
    );
  };

  const suspendBusiness = (businessId: string, reason: string) => {
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, verificationStatus: 'suspended', verificationNotes: `Suspended: ${reason}` } : b));
    logAuditEvent('SUSPENDED_BUSINESS', 'Business', businessId, `Business suspended. Reason: ${reason}`);
  };

  const reactivateBusiness = (businessId: string) => {
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, verificationStatus: 'verified', isSanctioned: false, sanctionReason: undefined } : b));
    logAuditEvent('REACTIVATED_BUSINESS', 'Business', businessId, `Business reactivated`);
  };

  const conductDueDiligence = (businessId: string, dossierUpdates: Partial<DueDiligenceDossier>) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === businessId) {
        const existing: DueDiligenceDossier = b.dueDiligence || {
          diligenceScore: 70,
          diligenceLevel: 'Tier 1: Basic Statutory',
          riskRating: 'Moderate Risk',
          checklist: {
            legalRegistration: true,
            tinTaxClearance: true,
            physicalPremiseVerified: false,
            sshfcCompliance: false,
            amlSanctionsClear: true,
            uboIdentification: true,
            bankReferenceValid: false,
            qualityCertifications: false
          },
          auditorId: currentUser.id,
          auditorName: currentUser.fullName,
          lastAuditedAt: new Date().toISOString().slice(0, 10),
          expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10),
          dossierReference: `GCCI-DD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          sanctionsCheckResult: 'Clear - No Sanction Matches',
          complianceNotes: ''
        };

        const updatedDossier: DueDiligenceDossier = {
          ...existing,
          ...dossierUpdates,
          auditorId: currentUser.id,
          auditorName: currentUser.fullName,
          lastAuditedAt: new Date().toISOString().slice(0, 10)
        };

        const checks = Object.values(updatedDossier.checklist);
        const passedCount = checks.filter(Boolean).length;
        const score = Math.round((passedCount / checks.length) * 100);
        updatedDossier.diligenceScore = score;
        
        let level: DueDiligenceDossier['diligenceLevel'] = 'Tier 1: Basic Statutory';
        let risk: DueDiligenceDossier['riskRating'] = 'Low Risk';
        let verLevel: Business['verificationLevel'] = 'Basic Documents Checked';

        if (score >= 88) {
          level = 'Tier 3: Gold Sovereign Exporter';
          risk = 'Low Risk';
          verLevel = 'Gold Certified Exporter';
        } else if (score >= 65) {
          level = 'Tier 2: Enhanced Due Diligence (EDD)';
          risk = 'Low Risk';
          verLevel = 'GCCI Verified Business';
        } else if (score >= 45) {
          level = 'Tier 1: Basic Statutory';
          risk = 'Moderate Risk';
          verLevel = 'Basic Documents Checked';
        } else {
          level = 'Tier 1: Basic Statutory';
          risk = 'High Risk';
          verLevel = 'Unverified';
        }

        updatedDossier.diligenceLevel = level;
        updatedDossier.riskRating = risk;

        return {
          ...b,
          dueDiligence: updatedDossier,
          riskScore: score,
          verificationLevel: verLevel,
          verificationStatus: score >= 65 ? ('verified' as BusinessStatus) : b.verificationStatus
        };
      }
      return b;
    }));

    logAuditEvent('CONDUCT_DUE_DILIGENCE', 'Business', businessId, `Updated due diligence dossier on ${businessId}`);
  };

  const applySanction = (businessId: string, reason: string) => {
    setBusinesses(prev => prev.map(b => b.id === businessId ? {
      ...b,
      isSanctioned: true,
      sanctionReason: reason,
      sanctionedAt: new Date().toISOString().slice(0, 10),
      verificationStatus: 'suspended' as BusinessStatus,
      publicVisibility: false
    } : b));
    logAuditEvent('APPLIED_BUSINESS_SANCTION', 'Business', businessId, `Placed business under GCCI trade sanctions / suspension. Reason: ${reason}`);
  };

  const liftSanction = (businessId: string) => {
    setBusinesses(prev => prev.map(b => b.id === businessId ? {
      ...b,
      isSanctioned: false,
      sanctionReason: undefined,
      sanctionedAt: undefined,
      verificationStatus: 'verified' as BusinessStatus,
      publicVisibility: true
    } : b));
    logAuditEvent('LIFTED_BUSINESS_SANCTION', 'Business', businessId, `Lifted trade sanctions and reinstated active standing`);
  };

  const issueComplianceNotice = (businessId: string, message: string) => {
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, complianceNotice: message } : b));
    logAuditEvent('ISSUED_COMPLIANCE_NOTICE', 'Business', businessId, `Issued statutory compliance notice: ${message}`);
  };

  const reconcilePayment = (paymentId: string, status: 'completed' | 'failed') => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        if (status === 'completed') {
          const plan = membershipPlans.find(pl => pl.id === p.planId);
          if (plan) {
            setBusinesses(bPrev => bPrev.map(b => b.id === p.businessId ? {
              ...b,
              membershipTier: plan.tier,
              membershipExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10)
            } : b));
          }
        }
        return { ...p, status };
      }
      return p;
    }));
    logAuditEvent('RECONCILE_PAYMENT', 'PaymentRecord', paymentId, `Reconciled Dalasi payment as ${status}`);
  };

  const moderateOpportunity = (opportunityId: string, status: SourcingOpportunity['status'], notes?: string) => {
    setOpportunities(prev => prev.map(o => o.id === opportunityId ? { ...o, status } : o));
    logAuditEvent('MODERATE_OPPORTUNITY', 'SourcingOpportunity', opportunityId, `Opportunity moderated to ${status}${notes ? `: ${notes}` : ''}`);
  };

  const updateAdminStaff = (id: string, updates: Partial<AdminStaffUser>) => {
    setAdminStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logAuditEvent('UPDATE_STAFF_PERMISSIONS', 'AdminStaffUser', id, `Updated staff RBAC permissions`);
  };

  const addAdminStaff = (staff: Omit<AdminStaffUser, 'id' | 'lastActive'>) => {
    const newStaff: AdminStaffUser = {
      ...staff,
      id: `staff-${Date.now()}`,
      lastActive: 'Never'
    };
    setAdminStaff(prev => [...prev, newStaff]);
    logAuditEvent('ADD_STAFF_MEMBER', 'AdminStaffUser', newStaff.id, `Created secretariat staff account for ${staff.name} (${staff.role})`);
  };

  const createProduct = (data: Omit<ProductService, 'id' | 'createdAt'>): ProductService => {
    const newProduct: ProductService = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setProducts(prev => [newProduct, ...prev]);
    logAuditEvent('CREATE_MARKETPLACE_LISTING', 'ProductService', newProduct.id, `Created listing: ${newProduct.title}`);
    return newProduct;
  };

  const updateProduct = (id: string, data: Partial<ProductService>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    logAuditEvent('UPDATE_MARKETPLACE_LISTING', 'ProductService', id, `Updated listing`);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    logAuditEvent('DELETE_MARKETPLACE_LISTING', 'ProductService', id, `Deleted listing`);
  };

  const createOpportunity = (data: Omit<SourcingOpportunity, 'id' | 'createdAt' | 'responsesCount'>): SourcingOpportunity => {
    const newOpp: SourcingOpportunity = {
      ...data,
      id: `opp-${Date.now()}`,
      responsesCount: 0,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setOpportunities(prev => [newOpp, ...prev]);
    logAuditEvent('PUBLISH_SOURCING_OPPORTUNITY', 'SourcingOpportunity', newOpp.id, `Published RFP: ${newOpp.title}`);
    return newOpp;
  };

  const updateOpportunityStatus = (id: string, status: SourcingOpportunity['status']) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    logAuditEvent('UPDATE_OPPORTUNITY_STATUS', 'SourcingOpportunity', id, `Updated RFP status to ${status}`);
  };

  const submitSupplierResponse = (data: Omit<SupplierResponse, 'id' | 'submittedAt' | 'status'>): SupplierResponse => {
    const newResponse: SupplierResponse = {
      ...data,
      id: `resp-${Date.now()}`,
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'submitted'
    };
    setResponses(prev => [newResponse, ...prev]);
    setOpportunities(prev => prev.map(o => o.id === data.opportunityId ? { ...o, responsesCount: o.responsesCount + 1 } : o));
    logAuditEvent('SUBMIT_SUPPLIER_QUOTE', 'SupplierResponse', newResponse.id, `Submitted quote of ${newResponse.totalProposedPrice} ${newResponse.currency} for tender ${data.opportunityId}`);
    return newResponse;
  };

  const updateResponseStatus = (id: string, status: SupplierResponse['status'], notes?: string) => {
    setResponses(prev => prev.map(r => r.id === id ? { ...r, status, rejectionReason: notes } : r));
    logAuditEvent('UPDATE_RESPONSE_STATUS', 'SupplierResponse', id, `Updated quote status to ${status}`);
  };

  const createDealRoom = (data: {
    title: string;
    originatingType: DealRoom['originatingType'];
    originatingId?: string;
    targetUserId: string;
    targetUserName: string;
    targetBusinessName: string;
    initialMessage?: string;
  }): DealRoom => {
    const refNum = `GCCI-DR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRoom: DealRoom = {
      id: `dr-${Date.now()}`,
      referenceNumber: refNum,
      title: data.title,
      originatingType: data.originatingType,
      originatingId: data.originatingId,
      participants: [
        {
          userId: currentUser.id,
          name: currentUser.fullName,
          businessName: currentUser.businessName || currentUser.organization || 'My Enterprise',
          role: currentUser.role === 'buyer' ? 'Buyer' : 'Party A',
          isLead: true
        },
        {
          userId: data.targetUserId,
          name: data.targetUserName,
          businessName: data.targetBusinessName,
          role: currentUser.role === 'buyer' ? 'Supplier' : 'Counterparty'
        }
      ],
      status: 'contacted',
      currency: 'GMD',
      actionItems: [
        {
          id: `act-${Date.now()}-1`,
          title: 'Review specifications and initiate commercial dialogue',
          assignedTo: currentUser.fullName,
          dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
          completed: false
        }
      ],
      documents: [],
      messages: data.initialMessage ? [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.fullName,
          senderBusiness: currentUser.businessName || currentUser.organization || 'My Enterprise',
          content: data.initialMessage,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ] : [],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    setDealRooms(prev => [newRoom, ...prev]);
    logAuditEvent('CREATE_DEAL_ROOM', 'DealRoom', newRoom.id, `Created Deal Room ${refNum}: ${newRoom.title}`);
    return newRoom;
  };

  const addDealRoomMessage = (dealRoomId: string, content: string, attachmentName?: string) => {
    const newMsg: DealRoomMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderBusiness: currentUser.businessName || currentUser.organization || 'Enterprise',
      content,
      attachmentName,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setDealRooms(prev => prev.map(dr => {
      if (dr.id === dealRoomId) {
        return {
          ...dr,
          messages: [...dr.messages, newMsg],
          updatedAt: new Date().toISOString().slice(0, 10)
        };
      }
      return dr;
    }));
  };

  const addDealRoomDocument = (dealRoomId: string, doc: Omit<DealRoomDocument, 'id' | 'uploadedAt' | 'uploadedBy'>) => {
    const newDoc: DealRoomDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().slice(0, 10),
      uploadedBy: currentUser.fullName
    };

    setDealRooms(prev => prev.map(dr => {
      if (dr.id === dealRoomId) {
        return {
          ...dr,
          documents: [...dr.documents, newDoc],
          updatedAt: new Date().toISOString().slice(0, 10)
        };
      }
      return dr;
    }));

    logAuditEvent('UPLOAD_DEAL_ROOM_DOC', 'DealRoom', dealRoomId, `Uploaded document: ${doc.title} (${doc.fileName})`);
  };

  const addDealRoomActionItem = (dealRoomId: string, item: { title: string; assignedTo: string; dueDate: string }) => {
    const newItem: DealRoomActionItem = {
      id: `act-${Date.now()}`,
      title: item.title,
      assignedTo: item.assignedTo,
      dueDate: item.dueDate,
      completed: false
    };

    setDealRooms(prev => prev.map(dr => {
      if (dr.id === dealRoomId) {
        return {
          ...dr,
          actionItems: [...dr.actionItems, newItem],
          updatedAt: new Date().toISOString().slice(0, 10)
        };
      }
      return dr;
    }));
  };

  const toggleActionItem = (dealRoomId: string, itemId: string) => {
    setDealRooms(prev => prev.map(dr => {
      if (dr.id === dealRoomId) {
        return {
          ...dr,
          actionItems: dr.actionItems.map(act => act.id === itemId ? { ...act, completed: !act.completed } : act),
          updatedAt: new Date().toISOString().slice(0, 10)
        };
      }
      return dr;
    }));
  };

  const updateDealRoomStatus = (dealRoomId: string, status: DealRoom['status'], reportedValue?: number, outcome?: string) => {
    setDealRooms(prev => prev.map(dr => {
      if (dr.id === dealRoomId) {
        return {
          ...dr,
          status,
          reportedValue: reportedValue !== undefined ? reportedValue : dr.reportedValue,
          reportedOutcome: outcome !== undefined ? outcome : dr.reportedOutcome,
          updatedAt: new Date().toISOString().slice(0, 10)
        };
      }
      return dr;
    }));

    logAuditEvent('UPDATE_DEAL_ROOM_STATUS', 'DealRoom', dealRoomId, `Status transitioned to ${status}. Reported value: ${reportedValue || 'N/A'}`);
  };

  const requestIntroduction = (investmentId: string, message: string) => {
    const opp = investments.find(i => i.id === investmentId);
    if (!opp) return;

    const newReq: IntroductionRequest = {
      id: `intro-${Date.now()}`,
      investmentOpportunityId: investmentId,
      opportunityTitle: opp.investmentObjective,
      investorId: currentUser.id,
      investorName: currentUser.fullName,
      investorOrg: currentUser.organization || 'Private Investor',
      targetBusinessId: opp.businessId,
      targetBusinessName: opp.businessName,
      message,
      ndaSigned: true,
      status: 'pending',
      requestedAt: new Date().toISOString().slice(0, 10)
    };

    setIntroductionRequests(prev => [newReq, ...prev]);
    setInvestments(prev => prev.map(i => i.id === investmentId ? { ...i, introductionRequestsCount: i.introductionRequestsCount + 1 } : i));

    logAuditEvent('REQUEST_INVESTOR_INTRODUCTION', 'InvestmentOpportunity', investmentId, `Investor ${currentUser.fullName} requested introduction to ${opp.businessName}`);
  };

  const reviewIntroductionRequest = (requestId: string, status: 'approved' | 'declined') => {
    setIntroductionRequests(prev => prev.map(r => r.id === requestId ? { ...r, status, approvedAt: status === 'approved' ? new Date().toISOString().slice(0, 10) : undefined } : r));
    logAuditEvent('REVIEW_INTRODUCTION_REQUEST', 'IntroductionRequest', requestId, `Introduction request ${status}`);
  };

  const subscribeMembership = (planId: string, paymentMethod: PaymentRecord['paymentMethod']): PaymentRecord => {
    const plan = membershipPlans.find(p => p.id === planId) || membershipPlans[1];
    const newRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      businessId: currentUser.businessId || 'biz-user',
      businessName: currentUser.businessName || currentUser.fullName,
      planId: plan.id,
      planName: plan.name,
      amount: plan.priceGMD,
      currency: 'GMD',
      paymentMethod,
      reference: `GCCI-TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
      invoiceNumber: `INV-GCCI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'completed',
      timestamp: new Date().toISOString().slice(0, 10)
    };

    setPayments(prev => [newRecord, ...prev]);

    // Update business membership tier if active business exists
    if (currentUser.businessId) {
      setBusinesses(prev => prev.map(b => b.id === currentUser.businessId ? {
        ...b,
        membershipTier: plan.tier,
        membershipExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10)
      } : b));
    }

    logAuditEvent('PURCHASE_MEMBERSHIP_SUBSCRIPTION', 'MembershipPlan', plan.id, `Purchased ${plan.name} (${plan.priceGMD} GMD) via ${paymentMethod}`);
    return newRecord;
  };

  const updateMembershipPlan = (planId: string, updates: Partial<MembershipPlan>) => {
    setMembershipPlans(prev => prev.map(p => p.id === planId ? { ...p, ...updates } : p));
    logAuditEvent('UPDATE_MEMBERSHIP_PLAN', 'MembershipPlan', planId, `Updated plan properties`);
  };

  const addCategory = (cat: Omit<CategoryItem, 'id' | 'itemCount'>) => {
    const newCat: CategoryItem = {
      ...cat,
      id: `cat-${Date.now()}`,
      itemCount: 0
    };
    setCategories(prev => [...prev, newCat]);
    logAuditEvent('ADD_CATEGORY', 'CategoryItem', newCat.id, `Added sector category: ${newCat.name}`);
  };

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, active: !c.active } : c));
    logAuditEvent('TOGGLE_CATEGORY', 'CategoryItem', categoryId, `Toggled category active status`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const exportDataToCSV = (type: 'businesses' | 'opportunities' | 'dealRooms' | 'payments') => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `gcci_export_${type}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (type === 'businesses') {
      headers = ['ID', 'Name', 'Sector', 'Region', 'Status', 'Level', 'TIN', 'GCCI Member ID', 'Deals Count', 'Deal Value GMD'];
      rows = businesses.map(b => [
        b.id,
        `"${b.name}"`,
        `"${b.sector}"`,
        `"${b.region}"`,
        b.verificationStatus,
        `"${b.verificationLevel}"`,
        b.tinNumber,
        b.gcciMemberNumber,
        b.completedDealsCount || 0,
        b.totalDealValueGMD || 0
      ]);
    } else if (type === 'opportunities') {
      headers = ['ID', 'Title', 'Category', 'Buyer', 'Region', 'Budget Min', 'Budget Max', 'Closing Date', 'Status', 'Responses'];
      rows = opportunities.map(o => [
        o.id,
        `"${o.title}"`,
        `"${o.category}"`,
        `"${o.buyerOrg}"`,
        `"${o.buyerRegion}"`,
        o.budgetMin || 0,
        o.budgetMax || 0,
        o.closingDate,
        o.status,
        o.responsesCount
      ]);
    } else if (type === 'dealRooms') {
      headers = ['Reference Number', 'Title', 'Type', 'Status', 'Reported Value GMD', 'Created At'];
      rows = dealRooms.map(dr => [
        dr.referenceNumber,
        `"${dr.title}"`,
        dr.originatingType,
        dr.status,
        dr.reportedValue || 0,
        dr.createdAt
      ]);
    } else if (type === 'payments') {
      headers = ['Invoice Number', 'Business', 'Plan', 'Amount GMD', 'Payment Method', 'Reference', 'Status', 'Date'];
      rows = payments.map(p => [
        p.invoiceNumber,
        `"${p.businessName}"`,
        `"${p.planName}"`,
        p.amount,
        `"${p.paymentMethod}"`,
        p.reference,
        p.status,
        p.timestamp
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAuditEvent('DATA_EXPORT_CSV', 'System', type, `Exported ${type} dataset (${rows.length} records) to CSV`);
  };

  const resetToDemoSeed = () => {
    if (!import.meta.env.DEV) return;
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    setBusinesses(INITIAL_BUSINESSES);
    setProducts(INITIAL_PRODUCTS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setResponses(INITIAL_RESPONSES);
    setInvestments(INITIAL_INVESTMENTS);
    setDealRooms(INITIAL_DEAL_ROOMS);
    setMembershipPlans(INITIAL_MEMBERSHIP_PLANS);
    setCategories(INITIAL_CATEGORIES);
    setPayments(INITIAL_PAYMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUserState(DEMO_USERS[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        businesses,
        products,
        opportunities,
        responses,
        investments,
        dealRooms,
        membershipPlans,
        categories,
        payments,
        auditLogs,
        notifications,
        investorProfile,
        introductionRequests,
        adminStaff,
        createBusiness,
        updateBusiness,
        submitVerificationDoc,
        reviewVerification,
        suspendBusiness,
        reactivateBusiness,
        conductDueDiligence,
        applySanction,
        liftSanction,
        issueComplianceNotice,
        reconcilePayment,
        moderateOpportunity,
        updateAdminStaff,
        addAdminStaff,
        createProduct,
        updateProduct,
        deleteProduct,
        createOpportunity,
        updateOpportunityStatus,
        submitSupplierResponse,
        updateResponseStatus,
        createDealRoom,
        addDealRoomMessage,
        addDealRoomDocument,
        addDealRoomActionItem,
        toggleActionItem,
        updateDealRoomStatus,
        requestIntroduction,
        reviewIntroductionRequest,
        subscribeMembership,
        updateMembershipPlan,
        addCategory,
        toggleCategory,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        logAuditEvent,
        exportDataToCSV,
        resetToDemoSeed
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
