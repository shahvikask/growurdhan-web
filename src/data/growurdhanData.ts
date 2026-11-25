export type OwnerId = 'self' | 'spouse' | 'minor' | 'huf';
export type OwnerLens = 'all' | OwnerId;

export type AssetCategoryId =
  | 'EQUITY'
  | 'MUTUAL_FUNDS'
  | 'GOLD_SGB'
  | 'FIXED_INCOME'
  | 'REAL_ESTATE'
  | 'CASH_BANK'
  | 'SPECIALISED'
  | 'LIABILITY';

export interface AssetCategoryMeta {
  id: AssetCategoryId;
  label: string;
  shortLabel: string;
  colorHex: string;
  valuationMode: string;
  subcategories: string[];
  description: string;
}

export interface FamilyMemberProfile {
  id: OwnerId;
  displayName: string;
  relationship: string;
  entityType: 'INDIVIDUAL' | 'HUF' | 'MINOR';
  guardianName?: string;
  isPrimaryOwner?: boolean;
  panMasked: string;
  casId?: string;
  pranMasked?: string;
  gmailSyncEnabled: boolean;
  accentHex: string;
  initial: string;
}

export type CostBasisType = 'KNOWN' | 'UNKNOWN';
export type NomineeStatus = 'REGISTERED' | 'NOT_REGISTERED';

export interface SyntheticHolding {
  id: string;
  name: string;
  category: AssetCategoryId;
  subcategory: string;
  ownerId: OwnerId;
  custodyLabel: string;
  folioOrRef: string;
  isin?: string;
  rtaSchemeCode?: string;
  currentLakhs: number;
  investedLakhs?: number;
  costBasis: CostBasisType;
  priceSource: 'AMFI NAVAll' | 'NSE UDiFF' | 'BSE UDiFF' | 'CAS Snapshot' | 'Manual Valuation';
  asOfDate: string;
  nomineeStatus: NomineeStatus;
  linkedPropertyId?: string;
  emiDueDay?: number;
  interestRatePercent?: string;
  latestStatementSource?: 'CDSL' | 'NSDL' | 'CAMS' | 'KFINTECH' | 'NPS';
}

export interface OfficialSender {
  issuer: 'CAMS' | 'KFintech' | 'NSDL' | 'CDSL' | 'Protean NPS';
  email: string;
  coverage: string;
  unlockRule: string;
}

export interface GuideArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
}

export interface FaqItem {
  id: string;
  group: 'Product' | 'Sync & CAS' | 'Privacy & D57' | 'Pricing & FY Quota' | 'Availability';
  question: string;
  answer: string;
}

export interface LegalDocument {
  id: 'terms' | 'privacy' | 'open-source' | 'delete-account';
  title: string;
  versionTag: string;
  subtitle: string;
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
    steps?: string[];
  }[];
}

export const ASSET_CATEGORIES: AssetCategoryMeta[] = [
  {
    id: 'EQUITY',
    label: 'Equity',
    shortLabel: 'Equity',
    colorHex: '#38BDF8',
    valuationMode: 'Units × Price',
    subcategories: ['Indian Listed Stocks', 'ETFs', 'Global / Direct'],
    description: 'NSE & BSE listed shares and ETFs priced from official UDiFF CM Bhavcopy feeds.',
  },
  {
    id: 'MUTUAL_FUNDS',
    label: 'Mutual Funds',
    shortLabel: 'Mutual Funds',
    colorHex: '#818CF8',
    valuationMode: 'Units × NAV',
    subcategories: ['Equity Direct/Regular', 'Hybrid & Debt', 'ELSS', 'Index Funds'],
    description:
      'SOA folios and Demat MF units with AMC-first naming, RTA code extraction, and AMFI NAVAll.txt updates.',
  },
  {
    id: 'GOLD_SGB',
    label: 'Gold & SGB',
    shortLabel: 'Gold & SGB',
    colorHex: '#F5C14A',
    valuationMode: 'Grams × Rate/g',
    subcategories: ['Sovereign Gold Bond', 'Physical Gold (24K/22K)', 'Digital Gold'],
    description:
      'Weight-in-grams tracking for SGB series/coupons/maturity dates, HUID physical gold, and digital vaults.',
  },
  {
    id: 'FIXED_INCOME',
    label: 'Fixed Income',
    shortLabel: 'Fixed Income',
    colorHex: '#34D399',
    valuationMode: 'Balance & Rate',
    subcategories: [
      'PPF',
      'EPF',
      'NPS Tier I/II',
      'Sukanya Samriddhi (SSY)',
      'Bank FD & RD',
      'SCSS / POMIS / NSC / KVP',
      'RBI Floating Rate & GOI Bonds',
    ],
    description:
      'Direct balance valuation with recorded interest rates driving automatic interest accrual schedules.',
  },
  {
    id: 'REAL_ESTATE',
    label: 'Real Estate',
    shortLabel: 'Real Estate',
    colorHex: '#C084FC',
    valuationMode: 'Property Value / Units',
    subcategories: ['Residential', 'Commercial', 'Land', 'REIT', 'InvIT'],
    description:
      'Track ownership percentage, rental income schedules, and Net Property Equity alongside linked Home Loans.',
  },
  {
    id: 'CASH_BANK',
    label: 'Cash & Bank',
    shortLabel: 'Cash & Bank',
    colorHex: '#22D3EE',
    valuationMode: 'Current Balance',
    subcategories: ['Savings Account', 'Current Account', 'Liquid / Overnight Fund'],
    description: 'Clean direct balance tracking for liquid reserves without artificial unit fields.',
  },
  {
    id: 'SPECIALISED',
    label: 'Specialised',
    shortLabel: 'Specialised',
    colorHex: '#F472B6',
    valuationMode: 'Value / Units',
    subcategories: ['AIF (Cat I / II / III)', 'PMS', 'Unlisted Equity', 'ESOP'],
    description:
      'Subcategory-specific fields for AIF capital commitments/calls, PMS strategies, and ESOP vesting dates.',
  },
  {
    id: 'LIABILITY',
    label: 'Liabilities',
    shortLabel: 'Liabilities',
    colorHex: '#FB7185',
    valuationMode: 'Outstanding Principal',
    subcategories: ['Home Loan', 'Car Loan', 'Education Loan', 'Personal Loan'],
    description:
      'Linked Property picker for Home Loans and EMI Due Day (1–31) feeding the upcoming EMI calendar.',
  },
];

export const FAMILY_MEMBERS: FamilyMemberProfile[] = [
  {
    id: 'self',
    displayName: 'Aarav (Self)',
    relationship: 'Primary Owner · Protected',
    entityType: 'INDIVIDUAL',
    isPrimaryOwner: true,
    panMasked: 'ABCDE••••F',
    casId: 'AA07970379',
    pranMasked: '1100••••4821',
    gmailSyncEnabled: true,
    accentHex: '#38BDF8',
    initial: 'A',
  },
  {
    id: 'spouse',
    displayName: 'Meera (Spouse)',
    relationship: 'Spouse',
    entityType: 'INDIVIDUAL',
    panMasked: 'FGHIJ••••K',
    casId: 'AA08412219',
    pranMasked: '1100••••9304',
    gmailSyncEnabled: true,
    accentHex: '#2DD4BF',
    initial: 'M',
  },
  {
    id: 'minor',
    displayName: 'Kavya (Minor)',
    relationship: 'Minor · Guardian: Aarav',
    entityType: 'MINOR',
    guardianName: 'Aarav (Self)',
    panMasked: 'LMNOP••••Q',
    gmailSyncEnabled: false,
    accentHex: '#C084FC',
    initial: 'K',
  },
  {
    id: 'huf',
    displayName: 'Sample Family HUF',
    relationship: 'HUF · Karta: Aarav',
    entityType: 'HUF',
    panMasked: 'AABHS••••H',
    casId: 'AA09110042',
    gmailSyncEnabled: true,
    accentHex: '#F5C14A',
    initial: 'H',
  },
];

export const SYNTHETIC_HOLDINGS: SyntheticHolding[] = [
  {
    id: 'sh-1',
    name: 'NIPPON INDIA MNC FUND - DIRECT GROWTH',
    category: 'MUTUAL_FUNDS',
    subcategory: 'Equity Direct',
    ownerId: 'self',
    custodyLabel: 'Nippon India Mutual Fund',
    folioOrRef: 'Folio 499278997181/0',
    isin: 'INF204K01E54',
    rtaSchemeCode: 'MCAG',
    currentLakhs: 21.4,
    investedLakhs: 18.2,
    costBasis: 'KNOWN',
    priceSource: 'AMFI NAVAll',
    asOfDate: '2026-10-31',
    nomineeStatus: 'REGISTERED',
    latestStatementSource: 'CDSL',
  },
  {
    id: 'sh-2',
    name: 'HDFC Mid-Cap Opportunities Direct Growth',
    category: 'MUTUAL_FUNDS',
    subcategory: 'Equity Direct',
    ownerId: 'spouse',
    custodyLabel: 'HDFC Mutual Fund',
    folioOrRef: 'Folio 18429011/42',
    isin: 'INF179K01XQ0',
    rtaSchemeCode: '101G',
    currentLakhs: 16.8,
    investedLakhs: 13.4,
    costBasis: 'KNOWN',
    priceSource: 'AMFI NAVAll',
    asOfDate: '2026-10-31',
    nomineeStatus: 'REGISTERED',
    latestStatementSource: 'CAMS',
  },
  {
    id: 'sh-3',
    name: 'Direct Large-Cap Indian Equities',
    category: 'EQUITY',
    subcategory: 'Indian Listed Stocks',
    ownerId: 'self',
    custodyLabel: 'CDSL Demat · DP 12081600',
    folioOrRef: 'BO 12081600••••4412',
    isin: 'INE040A01034',
    currentLakhs: 32.5,
    investedLakhs: 26.0,
    costBasis: 'KNOWN',
    priceSource: 'NSE UDiFF',
    asOfDate: '2026-11-24',
    nomineeStatus: 'REGISTERED',
    latestStatementSource: 'CDSL',
  },
  {
    id: 'sh-4',
    name: 'HUF Bluechip Demat Basket',
    category: 'EQUITY',
    subcategory: 'Indian Listed Stocks',
    ownerId: 'huf',
    custodyLabel: 'NSDL Demat · IN300214',
    folioOrRef: 'Client ••••8819',
    isin: 'INE002A01018',
    currentLakhs: 24.6,
    costBasis: 'UNKNOWN',
    priceSource: 'BSE UDiFF',
    asOfDate: '2026-11-24',
    nomineeStatus: 'NOT_REGISTERED',
    latestStatementSource: 'NSDL',
  },
  {
    id: 'sh-5',
    name: 'Sovereign Gold Bond 2029-30 Series II',
    category: 'GOLD_SGB',
    subcategory: 'Sovereign Gold Bond',
    ownerId: 'spouse',
    custodyLabel: 'CDSL Demat · DP 12081600',
    folioOrRef: '110g · 2.50% coupon',
    isin: 'IN0020210111',
    currentLakhs: 9.2,
    investedLakhs: 6.1,
    costBasis: 'KNOWN',
    priceSource: 'NSE UDiFF',
    asOfDate: '2026-11-24',
    nomineeStatus: 'REGISTERED',
  },
  {
    id: 'sh-6',
    name: 'Public Provident Fund (PPF)',
    category: 'FIXED_INCOME',
    subcategory: 'PPF',
    ownerId: 'self',
    custodyLabel: 'State Bank of India',
    folioOrRef: '7.10% p.a. · EEE',
    currentLakhs: 14.2,
    investedLakhs: 11.5,
    costBasis: 'KNOWN',
    priceSource: 'Manual Valuation',
    asOfDate: '2026-10-15',
    nomineeStatus: 'REGISTERED',
    interestRatePercent: '7.10',
  },
  {
    id: 'sh-7',
    name: 'NPS Tier I (Protean CRA)',
    category: 'FIXED_INCOME',
    subcategory: 'NPS',
    ownerId: 'spouse',
    custodyLabel: 'Protean CRA · Tier I',
    folioOrRef: 'PRAN 1100••••9304',
    currentLakhs: 11.8,
    investedLakhs: 9.6,
    costBasis: 'KNOWN',
    priceSource: 'CAS Snapshot',
    asOfDate: '2026-10-31',
    nomineeStatus: 'REGISTERED',
    latestStatementSource: 'NPS',
  },
  {
    id: 'sh-8',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    category: 'FIXED_INCOME',
    subcategory: 'Sukanya Samriddhi (SSY)',
    ownerId: 'minor',
    custodyLabel: 'India Post · Guardian: Aarav',
    folioOrRef: '8.20% p.a. · 21-yr',
    currentLakhs: 9.8,
    investedLakhs: 8.1,
    costBasis: 'KNOWN',
    priceSource: 'Manual Valuation',
    asOfDate: '2026-10-01',
    nomineeStatus: 'REGISTERED',
    interestRatePercent: '8.20',
  },
  {
    id: 'sh-9',
    name: 'Residential Apartment — Pune',
    category: 'REAL_ESTATE',
    subcategory: 'Residential',
    ownerId: 'self',
    custodyLabel: 'Direct Registry · 100% Share',
    folioOrRef: '1,420 sq ft · Self-occupied',
    currentLakhs: 84.0,
    investedLakhs: 68.0,
    costBasis: 'KNOWN',
    priceSource: 'Manual Valuation',
    asOfDate: '2026-09-30',
    nomineeStatus: 'REGISTERED',
  },
  {
    id: 'sh-10',
    name: 'Household Emergency Savings',
    category: 'CASH_BANK',
    subcategory: 'Savings Account',
    ownerId: 'spouse',
    custodyLabel: 'HDFC Bank · IFSC HDFC0000142',
    folioOrRef: 'Liquid Reserve',
    currentLakhs: 7.4,
    investedLakhs: 7.4,
    costBasis: 'KNOWN',
    priceSource: 'Manual Valuation',
    asOfDate: '2026-11-20',
    nomineeStatus: 'REGISTERED',
    interestRatePercent: '3.50',
  },
  {
    id: 'sh-11',
    name: 'Home Loan — Linked to Pune Residence',
    category: 'LIABILITY',
    subcategory: 'Home Loan',
    ownerId: 'self',
    custodyLabel: 'HDFC Home Loans · Floating',
    folioOrRef: 'EMI Day 10 · 8.55% p.a.',
    currentLakhs: 36.2,
    investedLakhs: 52.0,
    costBasis: 'KNOWN',
    priceSource: 'Manual Valuation',
    asOfDate: '2026-11-10',
    nomineeStatus: 'NOT_REGISTERED',
    linkedPropertyId: 'sh-9',
    emiDueDay: 10,
    interestRatePercent: '8.55',
  },
];

export const OFFICIAL_SENDERS: OfficialSender[] = [
  {
    issuer: 'CAMS',
    email: 'donotreply@camsonline.com',
    coverage: 'Mutual Fund SOA folios & consolidated RTA transactions',
    unlockRule: 'Uppercase PAN (or custom KFintech/CAMS password fallback)',
  },
  {
    issuer: 'KFintech',
    email: 'samfS@kfintech.com',
    coverage: 'KFintech-serviced Mutual Fund SOA statements',
    unlockRule: 'Uppercase PAN or guided custom password prompt in Review Queue',
  },
  {
    issuer: 'NSDL',
    email: 'NSDL-CAS@nsdl.co.in',
    coverage: 'NSDL Demat equities, bonds, ETFs, SGBs & SOA MF summary',
    unlockRule: 'Household uppercase PAN matching printed investor PAN',
  },
  {
    issuer: 'CDSL',
    email: 'eCAS@cdslstatement.com',
    coverage: 'CDSL Demat eCAS (_TXN preferred over _HLD) & MF folios',
    unlockRule: 'Filename CAS ID + uppercase PAN verification',
  },
  {
    issuer: 'Protean NPS',
    email: 'nps-statements@mailer.proteantech.in',
    coverage: 'NPS Tier I & Tier II CRA valuation & contribution statements',
    unlockRule: 'Auto-derived 4 lowercase letters of first name + DDMM DOB',
  },
];

export const SAMPLE_GOALS = [
  {
    id: 'g-1',
    title: 'Kavya Higher Education Corpus',
    ownerLabel: 'Kavya (Minor)',
    currentLakhs: 14.8,
    targetLakhs: 35.0,
    horizon: '2036',
  },
  {
    id: 'g-2',
    title: 'Home Loan Prepayment Buffer',
    ownerLabel: 'Aarav (Self)',
    currentLakhs: 11.4,
    targetLakhs: 18.0,
    horizon: '2028',
  },
  {
    id: 'g-3',
    title: 'Retirement Independence Base',
    ownerLabel: 'Whole Household',
    currentLakhs: 98.6,
    targetLakhs: 250.0,
    horizon: '2042',
  },
];

export const UPCOMING_SCHEDULE = [
  {
    id: 'ev-1',
    date: '10 Dec 2026',
    title: 'Home Loan Monthly EMI',
    detail: 'EMI Due Day 10 · Linked to Pune Residence',
    amountLabel: '-₹46,850',
    type: 'EMI' as const,
  },
  {
    id: 'ev-2',
    date: '18 Dec 2026',
    title: 'SGB 2029-30 Semi-Annual Coupon',
    detail: '2.50% p.a. on 110g Sovereign Gold Bond',
    amountLabel: '+₹7,610',
    type: 'INTEREST' as const,
  },
  {
    id: 'ev-3',
    date: '31 Mar 2027',
    title: 'PPF & SSY Annual Interest Accrual',
    detail: '7.10% PPF · 8.20% Sukanya Samriddhi',
    amountLabel: '+₹1,81,200',
    type: 'INTEREST' as const,
  },
];

export const GUIDES: GuideArticle[] = [
  {
    id: 'on-device-cas-parsing',
    title: 'How on-device CAS & NPS PDF parsing works without a cloud server',
    category: 'Statement Engine',
    readTime: '3 min read',
    summary:
      'GrowUrDhan bundles a local Python runtime (casparser + pypdfium2) directly inside the Android app so your statements and passwords never leave your device.',
    sections: [
      {
        heading: 'Zero server upload for sensitive PDFs',
        paragraphs: [
          'Most Indian portfolio trackers ask you to forward your CAMS, KFintech, CDSL, NSDL, or NPS PDFs — along with your PAN password — to a remote backend server. GrowUrDhan eliminates that server hop entirely.',
          'Using Chaquopy on arm64-v8a Android devices, GrowUrDhan unlocks and parses PDFs completely inside your phone’s private sandbox. Passwords are derived automatically from your encrypted family profiles: uppercase PAN for CAS files, and first 4 lowercase letters of first name plus DDMM date of birth for Protean NPS statements.',
        ],
      },
      {
        heading: 'Review before committing',
        paragraphs: [
          'Every parsed batch passes through PAN/PRAN/CAS ID owner verification and shows printed versus parsed totals before writing append-only ledger events to your encrypted local vault.',
        ],
      },
    ],
  },
  {
    id: 'read-only-gmail-sync',
    title: 'Optional read-only Gmail Statement Sync across family inboxes',
    category: 'Gmail Sync',
    readTime: '3 min read',
    summary:
      'Connect one or multiple Gmail accounts into a family-wide inbox pool with per-member toggles, strict 5-sender allowlisting, and volatile RAM-only OAuth tokens.',
    sections: [
      {
        heading: 'Designed for real Indian household inboxes',
        paragraphs: [
          'Indian families rarely follow a 1-person-to-1-email model. Often one shared family Gmail receives eCAS PDFs for Self, Spouse, and HUF, or one person receives CDSL statements on a personal address and NPS on another.',
          'GrowUrDhan’s Family-Wide Inbox Pool supports both topologies simultaneously. You link 1 to N Gmail accounts via Android Google Identity Services using strictly the gmail.readonly scope, and toggle Gmail Sync per Family Member.',
        ],
      },
      {
        heading: 'Strict allowlist, bounded lookback & zero token persistence',
        paragraphs: [
          'Sync queries only the 5 official Indian statement senders (CAMS, KFintech, NSDL, CDSL, Protean NPS) within a configurable lookback window (default Last 3 months) and imports only the latest statement month per (member, issuer) stream.',
        ],
        bullets: [
          'OAuth access tokens live strictly in volatile RAM and are wiped immediately when the vault locks.',
          'Clean, owner-verified batches auto-commit silently; any PAN/PRAN mismatch, custom password, or reconciliation conflict routes cleanly to the Review Queue.',
          '3-layer idempotency (seen ledger + SHA-256 content hash + pending queue deduplication) prevents already-committed or pending statements from looping.',
        ],
      },
    ],
  },
  {
    id: 'cross-source-deduplication',
    title: 'Preventing CAMS + CDSL duplicate mutual funds automatically',
    category: 'Reconciliation',
    readTime: '3 min read',
    summary:
      'How GrowUrDhan separates SOA folios from Demat accounts, skips back-dated statements, backfills missing cost basis, and strips noisy RTA scheme codes.',
    sections: [
      {
        heading: 'Why depository and RTA statements collide',
        paragraphs: [
          'CDSL eCAS and NSDL CAS include both Demat holdings and non-demat Statement of Account (SOA) Mutual Fund folios serviced by CAMS and KFintech. Naive trackers match only on ISIN or raw title, causing 2× inflated portfolios when you import both.',
          'GrowUrDhan resolves every holding to a canonical (Owner, ISIN, Custody Mode) identity — normalizing SOA folio numbers (e.g., 499278997181 / 0 == 499278997181/0) separately from Demat DP/Client accounts.',
        ],
      },
      {
        heading: 'Latest-date survivorship & canonical scheme titles',
        paragraphs: [
          'Back-dated holdings older than a position’s recorded statement date are automatically marked Skipped (Older) so older files never double-count units. When one source omits purchase cost and (ISIN, Folio, Quantity) match, GrowUrDhan backfills the missing cost without regressing your latest valuation date.',
          'Registrar prefixes like MCAG - or 101G - and suffixes like (Non Demat) are stripped from titles (protecting real AMC names like SBI, HDFC, ICICI, UTI) and stored cleanly as structured RTA Scheme Code metadata.',
        ],
      },
    ],
  },
  {
    id: 'd57-vault-and-recovery',
    title: 'Understanding D57 local-only vault security & your Offline Recovery Code',
    category: 'Security',
    readTime: '3 min read',
    summary:
      'Why GrowUrDhan disables cloud vault backups (allowBackup=false) by design, and how your A4 Offline Recovery Code PDF protects access on your device.',
    sections: [
      {
        heading: 'No cloud vault means zero server breach surface',
        paragraphs: [
          'Per GrowUrDhan’s D57 architecture policy, android:allowBackup is disabled and there is no cloud backup, export, or restore of your financial vault. Your household holdings, PANs, PRANs, and ledger live exclusively in AES-256-GCM encrypted local storage backed by Android Keystore.',
        ],
      },
      {
        heading: 'Your Offline Recovery Code (XXXX-XXXX-XXXX)',
        paragraphs: [
          'During onboarding, GrowUrDhan generates a unique Offline Recovery Code and lets you save a clean A4 Recovery Code PDF directly to your device via zero-permission Android SAF or print it for a physical safe.',
          'Because GrowUrDhan never holds a copy of your data or keys, uninstalling the app or losing both your Vault Passcode and Offline Recovery Code permanently erases your local records.',
        ],
      },
    ],
  },
  {
    id: 'family-huf-nominees',
    title: 'Family Ownership, HUF, Minor Guardians & eCAS Nominee Tracking',
    category: 'Family & Ownership',
    readTime: '3 min read',
    summary:
      'Keep Individual, HUF, and Minor books separate while monitoring AMC-first custody accounts, Home Loan Net Property Equity, and Registered / Not Registered nominee compliance.',
    sections: [
      {
        heading: 'Built for multi-generational Indian ownership',
        paragraphs: [
          'Every holding distinguishes Legal Owner, Beneficial Owner, Guardian (for Minors), and linked Custody Account. Your primary Self profile created at sign-up is permanently protected from accidental deletion.',
        ],
      },
      {
        heading: 'Automatic custody linking & nominee status',
        paragraphs: [
          'Importing an eCAS automatically creates and links Demat accounts, NPS PRANs, and Mutual Fund folios labeled by clean Indian AMC names (such as Nippon India Mutual Fund or HDFC Mutual Fund) rather than generic folio placeholders.',
          'Folio nomination lines are parsed on-device so the Family Ownership & Custody Map immediately highlights Registered versus Not Registered nominee status across your entire household.',
        ],
      },
    ],
  },
  {
    id: 'honest-math-and-official-feeds',
    title: 'Fixed-scale accounting, truthful Unknown cost & official NSE/BSE/AMFI feeds',
    category: 'Financial Engine',
    readTime: '2 min read',
    summary:
      'Why GrowUrDhan rejects floating-point math, refuses to fake ₹0 purchase cost, and refreshes valuations from official Indian public market feeds.',
    sections: [
      {
        heading: 'Exact arithmetic & append-only audit trail',
        paragraphs: [
          'GrowUrDhan stores money at fixed 10⁴ integer scale and quantities at 10⁸ integer scale — never binary floating-point Doubles — backed by an append-only 11-event ledger (BUY, SELL, OPENING_BALANCE, BONUS, SPLIT, DIVIDEND, INTEREST, VALUATION_UPDATE, REPAYMENT, CORRECTION, SNAPSHOT_ADJUSTMENT).',
          'If a statement omits acquisition cost, GrowUrDhan explicitly preserves Cost Unknown rather than silently setting cost to ₹0 and fabricating fake gains.',
        ],
      },
      {
        heading: 'Official Indian exchange end-of-day data',
        paragraphs: [
          'Valuations refresh directly from AMFI NAVAll.txt (ISIN-matched for Growth & IDCW mutual funds) and official NSE & BSE UDiFF CM Bhavcopy end-of-day archives with weekend and holiday lookback.',
        ],
      },
    ],
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    group: 'Product',
    question: 'What asset classes can my household track in GrowUrDhan?',
    answer:
      'GrowUrDhan tracks all 8 Indian household asset categories with subcategory-smart forms: Equity, Mutual Funds, Gold & SGB, Fixed Income (PPF, EPF, NPS, SSY, SCSS, Bank FD, Post Office RD, NSC, KVP, POMIS, RBI Floating Rate & GOI Bonds), Real Estate (Residential, Commercial, Land, REIT, InvIT), Cash & Bank, Specialised (AIF, PMS, Unlisted Equity, ESOP), and Liabilities (Home, Car, Education, Personal Loans with Linked Property Net Equity and EMI Due Day calendars).',
  },
  {
    id: 'faq-2',
    group: 'Product',
    question: 'Is GrowUrDhan a broker, SEBI-registered adviser, or tax-filing app?',
    answer:
      'No. GrowUrDhan is strictly a private, offline-first personal and household financial record-keeping tool. It does not execute trades, hold funds, offer investment or tax advice, or file returns. Capital gains tax screens are also held back from Release 1 pending tax-planner review.',
  },
  {
    id: 'faq-3',
    group: 'Sync & CAS',
    question: 'How does optional Gmail Statement Sync work and is it safe?',
    answer:
      'Gmail Sync is 100% optional and uses Android Google Identity OAuth with strictly read-only scope (gmail.readonly). It scans only 5 official Indian senders (CAMS, KFintech, NSDL, CDSL, Protean NPS) within a configurable lookback window (default Last 3 months), keeps OAuth tokens strictly in volatile RAM (wiped immediately when the vault locks), and decrypts/parses PDFs entirely on your phone.',
  },
  {
    id: 'faq-4',
    group: 'Sync & CAS',
    question: 'What happens if I import both CAMS and CDSL statements for the same mutual fund?',
    answer:
      'GrowUrDhan’s cross-source deduplication engine identifies SOA Mutual Fund folios by normalized (Owner, ISIN, Folio) separately from Demat accounts. Same-month overlaps never double-count units, older back-dated rows are safely marked Skipped (Older), and missing acquisition cost is automatically backfilled when the other statement prints it.',
  },
  {
    id: 'faq-5',
    group: 'Privacy & D57',
    question: 'Does GrowUrDhan back up my financial vault to the cloud?',
    answer:
      'No. Under our D57 local-only security policy (android:allowBackup="false"), there is no cloud financial vault backup, export, or restore. Your records remain strictly on your device in AES-256-GCM encrypted storage backed by Android Keystore. Always store your A4 Offline Recovery Code PDF safely, because uninstalling the app or losing both your passcode and recovery code permanently deletes local data.',
  },
  {
    id: 'faq-6',
    group: 'Privacy & D57',
    question: 'Are biometrics enabled automatically and what Android permissions are requested?',
    answer:
      'Biometric unlock is disabled by default — you opt in from Settings, where hardware BiometricPrompt binds to Android Keystore CryptoObject. GrowUrDhan requests zero dangerous runtime permissions (only install-time INTERNET for official AMFI/NSE/BSE feeds and optional Gmail Sync).',
  },
  {
    id: 'faq-7',
    group: 'Pricing & FY Quota',
    question: 'Does the 90-Day Free Trial require a credit card or UPI AutoPay mandate?',
    answer:
      'No. The 90-Day Free Trial starts automatically with zero payment details and zero mandate upfront. On Day 91, you transition cleanly to Free Forever with zero surprise charges and all your existing household data intact.',
  },
  {
    id: 'faq-8',
    group: 'Pricing & FY Quota',
    question: 'How does the ₹20/month Pro Monthly subscription and Financial Year PDF quota carry-over work?',
    answer:
      'Pro Monthly costs ₹20/month (inclusive of applicable taxes, Google Play SKU gud_pro_monthly_20) via an auto-renewing Google Play / UPI AutoPay mandate that you can cancel anytime in Google Play Subscriptions. Free Forever includes 3 manual PDF parses per Indian Financial Year (April 1 – March 31). PDFs parsed during the 90-day trial do NOT consume Free Forever quota, whereas PDFs parsed while subscribed to Pro Monthly DO count toward that Financial Year’s tally if you later cancel to Free Forever (resetting cleanly to 0 on April 1).',
  },
  {
    id: 'faq-9',
    group: 'Availability',
    question: 'Where can I get GrowUrDhan for Android?',
    answer:
      'GrowUrDhan for Android (package ID: in.growurdhan.app, Android 8.0+ / minSdk 26, arm64-v8a) is preparing for public Google Play Store launch. We do not host unofficial APKs or email waitlists on this website; the official Google Play link will be published here once live.',
  },
];

export const LEGAL_DOCUMENTS: Record<LegalDocument['id'], LegalDocument> = {
  terms: {
    id: 'terms',
    title: 'Terms & Conditions',
    versionTag: 'v2.1-LEGAL-RELEASE · Republic of India',
    subtitle:
      'Binding legal agreement governing use of the GrowUrDhan Android application (in.growurdhan.app) and www.growurdhan.com.',
    sections: [
      {
        heading: '1. Acceptance, Eligibility & Family / Minor / HUF Authority',
        paragraphs: [
          'By creating a local vault or using GrowUrDhan, you confirm that you are at least 18 years of age and legally competent to contract under the Indian Contract Act, 1872. Where you record information belonging to a spouse, adult family member, minor child (as lawful guardian), or Hindu Undivided Family (as Karta or authorised coparcener), you represent that you hold lawful authority and consent under applicable Indian law including the Digital Personal Data Protection Act, 2023 (DPDP Act).',
        ],
      },
      {
        heading: '2. Informational Tool Only — No Financial, Tax, or Legal Advice',
        paragraphs: [
          'GrowUrDhan is strictly a private household financial record-keeping and organisation tool. GrowUrDhan is NOT a SEBI-registered investment adviser, portfolio manager, stockbroker, depository participant, Registrar & Transfer Agent (RTA), bank, or ICAI Chartered Accountant / tax-filing service. Nothing displayed constitutes investment, financial, legal, or tax advice.',
        ],
      },
      {
        heading: '3. Local-Only Storage, Zero Cloud Backup & Permanent Data-Loss Warning (D57)',
        paragraphs: [
          'All household portfolios, PAN/PRAN/CAS IDs, custody records, and ledger events reside strictly in encrypted local device storage (android:allowBackup="false"). GrowUrDhan operates no cloud household database and provides no cloud vault backup or restore. Uninstalling the app, wiping device storage, losing the device, or losing both your Vault Passcode and Offline Recovery Code (XXXX-XXXX-XXXX) will permanently and irreversibly delete your local records.',
        ],
      },
      {
        heading: '4. Platform Security Controls, Permissions & Play Release Disclosures',
        paragraphs: [
          'GrowUrDhan uses AES-256-GCM local encryption backed by Android Keystore, PBKDF2-SHA256 passcode derivation, embedded on-device Chaquopy CPython + pypdfium2 parsing (arm64-v8a), Android SAF / PrintManager for zero-permission Offline Recovery PDF export, optional FLAG_SECURE screenshot blocking, and opt-in hardware BiometricPrompt (disabled by default). GrowUrDhan requests zero dangerous Android runtime permissions. Subscriptions are processed exclusively via Google Play Billing (SKU: gud_pro_monthly_20).',
        ],
      },
      {
        heading: '5. Market Data & Third-Party Sources Disclaimer',
        paragraphs: [
          'End-of-day valuations fetched from official public sources — including AMFI NAVAll.txt, NSE UDiFF CM Bhavcopy, and BSE UDiFF CM Bhavcopy — are provided strictly "AS IS" without warranty of completeness, timeliness, or uninterrupted availability.',
        ],
      },
      {
        heading: '6. Optional Read-Only Gmail Statement Sync & Google API Limited Use',
        paragraphs: [
          'If enabled by you, Gmail Statement Sync requests strictly the read-only scope (https://www.googleapis.com/auth/gmail.readonly) via Android Google Identity Services, scans only the 5 official Indian statement sender addresses (CAMS, KFintech, NSDL, CDSL, Protean NPS), holds OAuth access tokens solely in volatile RAM (wiped immediately upon vault lock), and never transfers Gmail data to GrowUrDhan or third-party servers. GrowUrDhan’s use of Google Workspace APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.',
        ],
      },
      {
        heading: '7. 90-Day Trial, Free Forever & Pro Monthly Subscription (₹20/month) + FY PDF Quota',
        paragraphs: [
          'New vaults receive a 90-Day Free Trial with all features unlocked and zero payment details or payment mandate required upfront. Upon expiry, the vault transitions cleanly to Free Forever with all existing records intact and zero surprise charges.',
          'Pro Monthly Subscription is priced at ₹20/month (inclusive of applicable taxes) via Google Play Billing (gud_pro_monthly_20) using an auto-renewing payment mandate (e.g., UPI AutoPay, card, or supported Play method) that renews monthly until cancelled directly in Google Play → Payments & Subscriptions → Subscriptions. Refunds follow Google Play policies.',
          'Free Forever includes up to 3 manual PDF parses per Indian Financial Year (April 1 – March 31) and no Gmail Sync. PDFs parsed during the 90-Day Free Trial do not consume Free Forever quota; PDFs parsed while subscribed to Pro Monthly DO count toward that Financial Year’s tally — if you parse 3 or more PDFs while subscribed and cancel to Free Forever in the same FY, Free Forever PDF parsing pauses until April 1 reset.',
        ],
      },
      {
        heading: '8. On-Device Statement Parsing & Open-Source Attribution',
        paragraphs: [
          'On-device PDF statement extraction incorporates the open-source casparser library (MIT License, Copyright © Sandeep Somasekharan / codereverser/casparser) and pypdfium2 (Apache License 2.0 / BSD-3-Clause). Both libraries and parsed outputs are provided "AS IS" without warranty. Because registrar PDF layouts may change without notice, users must inspect and verify printed vs. parsed totals and owner attribution in Review & Commit.',
        ],
      },
      {
        heading: '9. Intellectual Property, Limited License & Prohibited Conduct',
        paragraphs: [
          'GrowUrDhan grants a personal, non-exclusive, non-transferable, revocable licence to use the application for lawful private household record-keeping. Reverse-engineering licensing gates, tampering with billing entitlements, or commercial redistribution is prohibited.',
        ],
      },
      {
        heading: '10. Disclaimer of Warranties ("AS IS" / "AS AVAILABLE")',
        paragraphs: [
          'To the fullest extent permitted by Indian law, GrowUrDhan is provided "AS IS" and "AS AVAILABLE" without express or implied warranties of merchantability, fitness for a particular purpose, accuracy of calculations, or uninterrupted operation.',
        ],
      },
      {
        heading: '11. Limitation of Liability, Indemnification & Force Majeure',
        paragraphs: [
          'To the maximum extent permitted by law, GrowUrDhan’s aggregate liability arising from or relating to use of the application shall not exceed the subscription fees actually paid by you to GrowUrDhan in the 12 months preceding the claim (or ₹500 if on Free Forever or Trial). You agree to indemnify GrowUrDhan against claims arising from unauthorised entry of third-party personal data. Neither party is liable for delays caused by force majeure events.',
        ],
      },
      {
        heading: '12. Modifications, Severability, Governing Law & Indian Jurisdiction',
        paragraphs: [
          'Material updates to these Terms require explicit review and re-acceptance inside the app upon vault unlock. If any clause is held unenforceable, remaining provisions stay in effect. These Terms are governed by the laws of the Republic of India, subject to the exclusive jurisdiction of competent courts in India.',
        ],
      },
    ],
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy & Google API Limited Use',
    versionTag: 'Aligned with Android App v2.1-LEGAL-RELEASE & DPDP Act 2023',
    subtitle:
      'How GrowUrDhan protects your family’s financial records entirely on-device and complies with Google API Services User Data Policy.',
    sections: [
      {
        heading: '1. Zero Cloud Household Database & Zero Website Tracking',
        paragraphs: [
          'www.growurdhan.com is a static product website. It collects no email addresses, phone numbers, PANs, cookies for ad targeting, or financial files.',
          'Inside the GrowUrDhan Android app, all family profiles (names, relationships, PAN, DOB, PRAN, CAS ID), holdings, custody accounts, goals, and append-only ledger events are stored exclusively on your Android device inside AES-256-GCM encrypted storage (growurdhan_vault.enc) protected by Android Keystore.',
        ],
      },
      {
        heading: '2. D57 Strict Local-Only Policy (No Cloud Backup)',
        paragraphs: [
          'GrowUrDhan sets android:allowBackup="false" and exposes zero cloud backup, sync, or restore features for your financial vault. GrowUrDhan has no server-side access to your records and cannot recover lost passcodes or deleted vaults.',
        ],
      },
      {
        heading: '3. On-Device CAS & NPS Statement Parsing',
        paragraphs: [
          'PDF statements from CAMS, KFintech, NSDL, CDSL, and Protean NPS are unlocked and parsed entirely inside an embedded local Python runtime on your device. Neither the raw PDF nor your PDF password (PAN / DOB-derived NPS password) is ever transmitted to any GrowUrDhan server.',
        ],
      },
      {
        heading: '4. Optional Gmail Statement Sync — Google API Services User Data Policy (Limited Use)',
        paragraphs: [
          'Gmail Statement Sync is strictly opt-in. If you choose to connect one or more Gmail accounts via Android Google Identity Services:',
        ],
        bullets: [
          'Read-Only Minimal Scope: GrowUrDhan requests only https://www.googleapis.com/auth/gmail.readonly. It can never send, edit, move, or delete emails.',
          'Strict 5-Sender Allowlist: Queries filter exclusively for donotreply@camsonline.com, samfS@kfintech.com, NSDL-CAS@nsdl.co.in, eCAS@cdslstatement.com, and nps-statements@mailer.proteantech.in within your configured lookback window (default Last 3 months).',
          'Direct Device-to-Google Communication: Attachments download directly to your phone’s local memory for on-device parsing; zero Gmail content, metadata, or OAuth tokens ever touch a GrowUrDhan server.',
          'Volatile RAM-Only OAuth Tokens: Access tokens are held solely in memory and wiped immediately when the vault locks.',
          'Limited Use Compliance: GrowUrDhan’s use and transfer of information received from Google APIs strictly adheres to the Google API Services User Data Policy, including the Limited Use requirements — never used for advertising, profiling, data brokerage, or training AI/ML models.',
        ],
      },
      {
        heading: '5. Public Market Feeds & Google Play Billing',
        paragraphs: [
          'When you refresh valuations, the app makes read-only HTTPS requests to official public Indian end-of-day price files (AMFI NAVAll.txt, NSE & BSE UDiFF CM Bhavcopy) without sending your portfolio holdings or personal identifiers.',
          'Optional Pro Monthly subscriptions (₹20/month, SKU gud_pro_monthly_20) are processed exclusively by Google Play Billing; GrowUrDhan never receives your card or UPI credentials.',
        ],
      },
    ],
  },
  'open-source': {
    id: 'open-source',
    title: 'Open-Source Notices & Attributions',
    versionTag: 'On-Device Parsing Engine & Native Runtime',
    subtitle:
      'GrowUrDhan acknowledges and complies with the open-source licences powering on-device Indian statement parsing.',
    sections: [
      {
        heading: 'casparser — MIT License',
        paragraphs: [
          'Copyright © Sandeep Somasekharan (codereverser/casparser). Used on-device inside GrowUrDhan’s embedded local Python runtime to extract structured mutual fund, depository, and valuation records from CAMS, KFintech, NSDL, and CDSL CAS PDFs.',
          'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files to deal in the Software without restriction, subject to inclusion of the copyright and permission notice. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.',
        ],
      },
      {
        heading: 'pypdfium2 — Apache License 2.0 / BSD-3-Clause',
        paragraphs: [
          'Used on-device for fast, native arm64-v8a PDF decryption and text/layout extraction inside the local parsing sandbox, provided "AS IS" without warranty of any kind.',
        ],
      },
      {
        heading: 'Typography & Platform Libraries',
        paragraphs: [
          'Uses Plus Jakarta Sans (SIL Open Font License 1.1), JetBrains Mono (SIL Open Font License 1.1), AndroidX Jetpack Compose & Material 3 (Apache License 2.0), and Chaquopy Python SDK for Android.',
        ],
      },
    ],
  },
  'delete-account': {
    id: 'delete-account',
    title: 'Delete Account & Local Data',
    versionTag: 'Zero Cloud Account · Full User Control',
    subtitle:
      'Because GrowUrDhan maintains no cloud user account or remote financial database, data erasure is immediate and completely under your control.',
    sections: [
      {
        heading: 'How to permanently erase all GrowUrDhan data',
        paragraphs: [
          'Follow these steps on your Android device and Google Account to remove every local record, optional Gmail link, and optional subscription:',
        ],
        steps: [
          'Clear local encrypted vault: Open Android Settings → Apps → GrowUrDhan → Storage & Cache → Clear Storage (or uninstall GrowUrDhan). This permanently destroys growurdhan_vault.enc and growurdhan_auth.enc.',
          'Remove Offline Recovery PDF: Delete any A4 Recovery Code PDF you saved to your device storage or destroy any printed physical copy.',
          'Revoke optional Gmail Sync (if connected): Disconnect accounts inside GrowUrDhan Settings → Gmail Sync before uninstalling, or revoke access anytime at Google Account → Security → Third-party apps & services.',
          'Cancel optional Pro Monthly subscription (if subscribed): Open Google Play → Payments & Subscriptions → Subscriptions → GrowUrDhan and cancel the auto-renewing ₹20/month mandate.',
        ],
      },
    ],
  },
};

export function formatInrLakhs(lakhs: number, masked = false): string {
  if (masked) return '₹ •••••';
  const abs = Math.abs(lakhs);
  const sign = lakhs < 0 ? '-' : '';
  if (abs >= 100) {
    return `${sign}₹${(abs / 100).toFixed(2)} Cr`;
  }
  return `${sign}₹${abs.toFixed(1)} L`;
}

export function formatInrFull(lakhs: number, masked = false): string {
  if (masked) return '₹ ••,••,•••';
  const rupees = Math.round(lakhs * 100000);
  const sign = rupees < 0 ? '-' : '';
  return `${sign}₹ ${Math.abs(rupees).toLocaleString('en-IN')}`;
}
