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
  priceSource: 'AMFI Official NAV' | 'NSE Daily Close' | 'BSE Daily Close' | 'From Statement' | 'Your Valuation';
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
  group: 'Basics' | 'Statements & Gmail' | 'Privacy & Safety' | 'Pricing & Plans' | 'Availability';
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
    label: 'Shares & ETFs',
    shortLabel: 'Shares',
    colorHex: '#38BDF8',
    valuationMode: 'Shares × Price',
    subcategories: ['Indian Listed Stocks', 'ETFs', 'Global Stocks'],
    description: 'Track all NSE and BSE shares and ETFs with automatic official daily closing prices.',
  },
  {
    id: 'MUTUAL_FUNDS',
    label: 'Mutual Funds',
    shortLabel: 'Mutual Funds',
    colorHex: '#818CF8',
    valuationMode: 'Units × NAV',
    subcategories: ['Equity Direct & Regular', 'Hybrid & Debt', 'ELSS Tax Saver', 'Index Funds'],
    description:
      'Keep both regular folios and Demat mutual funds neatly grouped by fund house with daily AMFI NAV updates.',
  },
  {
    id: 'GOLD_SGB',
    label: 'Gold & SGB',
    shortLabel: 'Gold & SGB',
    colorHex: '#F5C14A',
    valuationMode: 'Grams × Rate',
    subcategories: ['Sovereign Gold Bond', 'Physical Gold (24K/22K)', 'Digital Gold'],
    description:
      'Enter gold weight in grams and track Sovereign Gold Bond interest dates, maturity dates, and hallmark jewellery.',
  },
  {
    id: 'FIXED_INCOME',
    label: 'Savings & Fixed Income',
    shortLabel: 'Fixed Income',
    colorHex: '#34D399',
    valuationMode: 'Balance & Rate',
    subcategories: [
      'PPF & EPF',
      'NPS Tier I & II',
      'Sukanya Samriddhi (SSY)',
      'Bank FD & RD',
      'Post Office & RBI Bonds',
    ],
    description:
      'Simply record your current balance and interest rate — GrowUrDhan tracks upcoming interest dates for you.',
  },
  {
    id: 'REAL_ESTATE',
    label: 'Property & Real Estate',
    shortLabel: 'Property',
    colorHex: '#C084FC',
    valuationMode: 'Property Value',
    subcategories: ['Home / Flat', 'Commercial', 'Plot / Land', 'REIT & InvIT'],
    description:
      'Record your share of ownership, rental income, and see your true home equity after subtracting any linked home loan.',
  },
  {
    id: 'CASH_BANK',
    label: 'Cash & Bank Accounts',
    shortLabel: 'Cash & Bank',
    colorHex: '#22D3EE',
    valuationMode: 'Account Balance',
    subcategories: ['Savings Account', 'Current Account', 'Emergency Cash'],
    description: 'Record bank and emergency balances directly in rupees — quick, clean, and fuss-free.',
  },
  {
    id: 'SPECIALISED',
    label: 'Special Investments',
    shortLabel: 'Specialised',
    colorHex: '#F472B6',
    valuationMode: 'Current Value',
    subcategories: ['PMS', 'AIF', 'Unlisted Shares', 'Company ESOPs'],
    description:
      'Simple tailored fields for PMS portfolios, AIF commitments, unlisted shares, and employee ESOPs.',
  },
  {
    id: 'LIABILITY',
    label: 'Loans & Liabilities',
    shortLabel: 'Loans',
    colorHex: '#FB7185',
    valuationMode: 'Pending Balance',
    subcategories: ['Home Loan', 'Car Loan', 'Education Loan', 'Personal Loan'],
    description:
      'Link a home loan to your property and save your monthly EMI date so upcoming payments appear on your calendar.',
  },
];

export const FAMILY_MEMBERS: FamilyMemberProfile[] = [
  {
    id: 'self',
    displayName: 'Aarav (Self)',
    relationship: 'Primary Member',
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
    displayName: 'Kavya (Child)',
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
    name: 'Nippon India MNC Fund - Direct Growth',
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
    priceSource: 'AMFI Official NAV',
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
    priceSource: 'AMFI Official NAV',
    asOfDate: '2026-10-31',
    nomineeStatus: 'REGISTERED',
    latestStatementSource: 'CAMS',
  },
  {
    id: 'sh-3',
    name: 'Direct Large-Cap Indian Shares',
    category: 'EQUITY',
    subcategory: 'Indian Listed Stocks',
    ownerId: 'self',
    custodyLabel: 'CDSL Demat Account',
    folioOrRef: 'Demat ••••4412',
    isin: 'INE040A01034',
    currentLakhs: 32.5,
    investedLakhs: 26.0,
    costBasis: 'KNOWN',
    priceSource: 'NSE Daily Close',
    asOfDate: '2026-11-24',
    nomineeStatus: 'REGISTERED',
    latestStatementSource: 'CDSL',
  },
  {
    id: 'sh-4',
    name: 'HUF Bluechip Demat Shares',
    category: 'EQUITY',
    subcategory: 'Indian Listed Stocks',
    ownerId: 'huf',
    custodyLabel: 'NSDL Demat Account',
    folioOrRef: 'Client ••••8819',
    isin: 'INE002A01018',
    currentLakhs: 24.6,
    costBasis: 'UNKNOWN',
    priceSource: 'BSE Daily Close',
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
    custodyLabel: 'CDSL Demat Account',
    folioOrRef: '110g · 2.50% interest',
    isin: 'IN0020210111',
    currentLakhs: 9.2,
    investedLakhs: 6.1,
    costBasis: 'KNOWN',
    priceSource: 'NSE Daily Close',
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
    folioOrRef: '7.10% p.a. · Tax-Free',
    currentLakhs: 14.2,
    investedLakhs: 11.5,
    costBasis: 'KNOWN',
    priceSource: 'Your Valuation',
    asOfDate: '2026-10-15',
    nomineeStatus: 'REGISTERED',
    interestRatePercent: '7.10',
  },
  {
    id: 'sh-7',
    name: 'NPS Retirement Account (Tier I)',
    category: 'FIXED_INCOME',
    subcategory: 'NPS',
    ownerId: 'spouse',
    custodyLabel: 'Protean NPS Account',
    folioOrRef: 'PRAN 1100••••9304',
    currentLakhs: 11.8,
    investedLakhs: 9.6,
    costBasis: 'KNOWN',
    priceSource: 'From Statement',
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
    folioOrRef: '8.20% p.a. · 21-yr plan',
    currentLakhs: 9.8,
    investedLakhs: 8.1,
    costBasis: 'KNOWN',
    priceSource: 'Your Valuation',
    asOfDate: '2026-10-01',
    nomineeStatus: 'REGISTERED',
    interestRatePercent: '8.20',
  },
  {
    id: 'sh-9',
    name: 'Family Home — Pune',
    category: 'REAL_ESTATE',
    subcategory: 'Home / Flat',
    ownerId: 'self',
    custodyLabel: 'Self-Owned · 100% Share',
    folioOrRef: '1,420 sq ft · Self-occupied',
    currentLakhs: 84.0,
    investedLakhs: 68.0,
    costBasis: 'KNOWN',
    priceSource: 'Your Valuation',
    asOfDate: '2026-09-30',
    nomineeStatus: 'REGISTERED',
  },
  {
    id: 'sh-10',
    name: 'Family Emergency Bank Savings',
    category: 'CASH_BANK',
    subcategory: 'Savings Account',
    ownerId: 'spouse',
    custodyLabel: 'HDFC Bank',
    folioOrRef: 'Liquid Savings',
    currentLakhs: 7.4,
    investedLakhs: 7.4,
    costBasis: 'KNOWN',
    priceSource: 'Your Valuation',
    asOfDate: '2026-11-20',
    nomineeStatus: 'REGISTERED',
    interestRatePercent: '3.50',
  },
  {
    id: 'sh-11',
    name: 'Home Loan — Pune Apartment',
    category: 'LIABILITY',
    subcategory: 'Home Loan',
    ownerId: 'self',
    custodyLabel: 'HDFC Home Loans',
    folioOrRef: 'EMI on 10th · 8.55% p.a.',
    currentLakhs: 36.2,
    investedLakhs: 52.0,
    costBasis: 'KNOWN',
    priceSource: 'Your Valuation',
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
    coverage: 'Mutual fund statements & folios serviced by CAMS',
    unlockRule: 'Opens automatically using your saved PAN (or asks if you set a custom password)',
  },
  {
    issuer: 'KFintech',
    email: 'samfS@kfintech.com',
    coverage: 'Mutual fund statements & folios serviced by KFintech',
    unlockRule: 'Opens using your saved PAN or prompts neatly for your custom password',
  },
  {
    issuer: 'NSDL',
    email: 'NSDL-CAS@nsdl.co.in',
    coverage: 'NSDL Demat shares, bonds, ETFs, SGBs & mutual fund summary',
    unlockRule: 'Opens automatically on your phone using the member’s PAN',
  },
  {
    issuer: 'CDSL',
    email: 'eCAS@cdslstatement.com',
    coverage: 'CDSL monthly eCAS statements covering Demat & mutual funds',
    unlockRule: 'Matches the member’s CAS ID and PAN automatically on your phone',
  },
  {
    issuer: 'Protean NPS',
    email: 'nps-statements@mailer.proteantech.in',
    coverage: 'NPS Tier I & Tier II retirement balance statements',
    unlockRule: 'Opens automatically using first 4 letters of name + birth day & month',
  },
];

export const SAMPLE_GOALS = [
  {
    id: 'g-1',
    title: 'Kavya Higher Education Fund',
    ownerLabel: 'Kavya (Child)',
    currentLakhs: 14.8,
    targetLakhs: 35.0,
    horizon: '2036',
  },
  {
    id: 'g-2',
    title: 'Home Loan Prepayment Reserve',
    ownerLabel: 'Aarav (Self)',
    currentLakhs: 11.4,
    targetLakhs: 18.0,
    horizon: '2028',
  },
  {
    id: 'g-3',
    title: 'Family Retirement Corpus',
    ownerLabel: 'Whole Family',
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
    detail: 'Due on 10th every month · Pune Apartment',
    amountLabel: '-₹46,850',
    type: 'EMI' as const,
  },
  {
    id: 'ev-2',
    date: '18 Dec 2026',
    title: 'Sovereign Gold Bond Interest',
    detail: '2.50% half-yearly interest on 110g SGB',
    amountLabel: '+₹7,610',
    type: 'INTEREST' as const,
  },
  {
    id: 'ev-3',
    date: '31 Mar 2027',
    title: 'PPF & Sukanya Samriddhi Interest',
    detail: 'Annual interest credit for PPF & SSY',
    amountLabel: '+₹1,81,200',
    type: 'INTEREST' as const,
  },
];

export const GUIDES: GuideArticle[] = [
  {
    id: 'on-device-cas-parsing',
    title: 'How GrowUrDhan reads your PDF statements safely on your phone',
    category: 'Statements',
    readTime: '2 min read',
    summary:
      'Your CAMS, KFintech, CDSL, NSDL, and NPS PDFs open directly inside your phone — you never have to forward statements or passwords to any company.',
    sections: [
      {
        heading: 'Your statements never leave your phone',
        paragraphs: [
          'Many investment apps ask you to forward your monthly CAMS, CDSL, NSDL, or NPS PDFs — along with your PAN password — to their servers. GrowUrDhan works differently: everything happens privately right on your Android phone.',
          'Once you save your family profiles in the app, GrowUrDhan can open standard password-protected statements automatically using each member’s PAN (or first name and birth date for NPS), without sending anything over the internet.',
        ],
      },
      {
        heading: 'You stay in control before anything is saved',
        paragraphs: [
          'GrowUrDhan checks that each statement belongs to the right family member and verifies that the total matches what is printed on your statement before adding it to your records.',
        ],
      },
    ],
  },
  {
    id: 'read-only-gmail-sync',
    title: 'How optional Gmail Sync finds your monthly statements automatically',
    category: 'Gmail Sync',
    readTime: '2 min read',
    summary:
      'Connect one or more family Gmail accounts if you want GrowUrDhan to fetch official monthly statements automatically — strictly read-only and strictly from 5 official issuers.',
    sections: [
      {
        heading: 'Built for how Indian families actually use email',
        paragraphs: [
          'In many Indian households, one shared family email receives statements for Self, Spouse, and HUF — or one person gets Demat emails on one Gmail and NPS emails on another.',
          'GrowUrDhan lets you connect one or several Gmail accounts and choose which family members should sync automatically. You can turn it on or off anytime.',
        ],
      },
      {
        heading: 'Strictly limited to 5 official statement senders',
        paragraphs: [
          'GrowUrDhan only checks emails from 5 official issuers (CAMS, KFintech, NSDL, CDSL, and Protean NPS) from the last few months (default 3 months). It never looks at personal emails, OTPs, bank alerts, or chats.',
        ],
        bullets: [
          'Read-only access only: the app can never send, edit, move, or delete any email.',
          'Your Gmail sign-in permission is cleared from phone memory the moment you lock the app.',
          'Clean statements update automatically; if a statement needs a custom password or review, it waits neatly in your Review Queue.',
        ],
      },
    ],
  },
  {
    id: 'cross-source-deduplication',
    title: 'Why importing both CAMS and CDSL will never double-count your mutual funds',
    category: 'Accuracy',
    readTime: '2 min read',
    summary:
      'Many families receive both a CAMS email and a CDSL/NSDL eCAS email every month. GrowUrDhan matches your folios automatically so nothing is ever counted twice.',
    sections: [
      {
        heading: 'No more doubled mutual fund totals',
        paragraphs: [
          'CDSL and NSDL monthly statements often include the same mutual funds that also appear in your CAMS or KFintech statement. In ordinary spreadsheets or apps, importing both makes your wealth look twice as big by mistake.',
          'GrowUrDhan matches each mutual fund by family member, scheme, and folio number — while keeping regular folios separate from Demat mutual funds — so every investment is counted once.',
        ],
      },
      {
        heading: 'Smart handling of older statements and missing purchase prices',
        paragraphs: [
          'If you accidentally import an older month’s statement after a newer one, GrowUrDhan automatically skips the older copy instead of overwriting your latest numbers. And if one statement shows your purchase cost while another leaves it blank, GrowUrDhan fills in the missing purchase cost cleanly.',
        ],
      },
    ],
  },
  {
    id: 'd57-vault-and-recovery',
    title: 'Why there is no cloud backup — and how to keep your Recovery Code PDF safe',
    category: 'Privacy & Safety',
    readTime: '2 min read',
    summary:
      'Your family’s wealth stays locked strictly on your phone so no outsider can ever hack a server to see it. Here is how your printable Recovery Code protects you.',
    sections: [
      {
        heading: 'Private means nobody else holds a copy',
        paragraphs: [
          'GrowUrDhan does not store your family’s wealth on any cloud server and does not create cloud backups. Every PAN, folio number, loan, and rupee stays locked on your own phone.',
        ],
      },
      {
        heading: 'Save or print your 12-character Recovery Code',
        paragraphs: [
          'When you first set up GrowUrDhan, the app creates a unique Recovery Code (like XXXX-XXXX-XXXX) and lets you save it as a neat A4 PDF or print a copy to keep in your home file or locker.',
          'Because GrowUrDhan has no cloud copy of your records, please keep that Recovery Code safe. Uninstalling the app or forgetting both your passcode and Recovery Code will permanently erase your saved records.',
        ],
      },
    ],
  },
  {
    id: 'family-huf-nominees',
    title: 'Tracking Self, Spouse, Children, HUF & Nominees in one place',
    category: 'Family',
    readTime: '2 min read',
    summary:
      'See the full household picture while keeping every person’s legal ownership, child guardian details, and nominee status crystal clear.',
    sections: [
      {
        heading: 'Clear ownership for every family member',
        paragraphs: [
          'Instead of mixing everyone’s investments into one confusing list, GrowUrDhan lets you add profiles for Yourself, your Spouse, Parents, Children (with a named Guardian), and your family HUF. Switch between the whole family view or any single member with one tap.',
        ],
      },
      {
        heading: 'Spot missing nominees in seconds',
        paragraphs: [
          'When you import monthly statements, GrowUrDhan automatically groups mutual funds under familiar Indian fund house names (like HDFC Mutual Fund or Nippon India Mutual Fund) and highlights which accounts have a nominee Registered and which ones are Not Registered — so your family never faces surprises later.',
        ],
      },
    ],
  },
  {
    id: 'honest-math-and-official-feeds',
    title: 'Honest profit tracking & official Indian market prices',
    category: 'Accuracy',
    readTime: '2 min read',
    summary:
      'Why GrowUrDhan never guesses missing purchase prices and updates your shares and mutual funds using official NSE, BSE, and AMFI prices.',
    sections: [
      {
        heading: 'Honest numbers, never fake profits',
        paragraphs: [
          'Sometimes an old Demat or mutual fund statement does not mention how much you originally paid. Instead of quietly assuming ₹0 cost and showing an inflated fake profit, GrowUrDhan clearly marks it as "Purchase Price Not Shown" until you enter it or import a statement that includes it.',
        ],
      },
      {
        heading: 'Official daily prices from Indian exchanges',
        paragraphs: [
          'Mutual fund NAVs refresh from official AMFI daily data and Indian shares refresh from official NSE and BSE daily closing prices — without sending your personal portfolio anywhere.',
        ],
      },
    ],
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    group: 'Basics',
    question: 'What investments and loans can my family track in GrowUrDhan?',
    answer:
      'You can track almost everything an Indian household owns or owes across 8 simple categories: Shares & ETFs, Mutual Funds, Gold & Sovereign Gold Bonds, Savings & Fixed Income (PPF, EPF, NPS, Sukanya Samriddhi, Bank FDs/RDs, Post Office schemes, RBI Bonds), Property & Real Estate, Cash & Bank Accounts, Special Investments (PMS, AIF, Unlisted Shares, ESOPs), and Loans (Home, Car, Education, Personal Loans with monthly EMI reminders).',
  },
  {
    id: 'faq-2',
    group: 'Basics',
    question: 'Is GrowUrDhan a broker, investment adviser, or tax-filing app?',
    answer:
      'No. GrowUrDhan is purely a private family record-keeping app. It does not buy or sell investments, hold your money, suggest what to buy, or file income tax returns.',
  },
  {
    id: 'faq-3',
    group: 'Statements & Gmail',
    question: 'Is optional Gmail Sync safe? Will it read my personal emails?',
    answer:
      'Gmail Sync is completely optional and strictly read-only. If you turn it on, GrowUrDhan only checks emails from 5 official Indian statement senders (CAMS, KFintech, NSDL, CDSL, and Protean NPS). It can never read personal emails, never send or delete emails, and your statement PDFs are opened right on your phone without touching any server.',
  },
  {
    id: 'faq-4',
    group: 'Statements & Gmail',
    question: 'What if I import both CAMS and CDSL statements for the same mutual fund?',
    answer:
      'GrowUrDhan checks your folio numbers and dates automatically so the same mutual fund is never counted twice. If you accidentally add an older month’s statement, it safely skips the older file while keeping your latest numbers.',
  },
  {
    id: 'faq-5',
    group: 'Privacy & Safety',
    question: 'Does GrowUrDhan back up my family’s data to the cloud?',
    answer:
      'No. To keep your household’s wealth truly private, GrowUrDhan stores everything strictly on your phone with no cloud account and no cloud backup. Please save or print your Recovery Code PDF during setup, because uninstalling the app or losing both your passcode and Recovery Code permanently deletes your saved data.',
  },
  {
    id: 'faq-6',
    group: 'Privacy & Safety',
    question: 'Does the app ask for access to my SMS, contacts, or photos?',
    answer:
      'No. GrowUrDhan never asks for your SMS messages, contacts, call logs, location, or photo gallery. It only uses the internet when fetching official NSE/BSE/AMFI daily prices or when you choose to run optional Gmail Sync. Fingerprint or face unlock is also optional and turned off by default.',
  },
  {
    id: 'faq-7',
    group: 'Pricing & Plans',
    question: 'Do I need to enter a credit card or UPI AutoPay to start the 90-day free trial?',
    answer:
      'No. Your 90-day free trial starts right away with no card, no UPI mandate, and no automatic charges. On Day 91, the app simply moves to the Free Forever plan and all your saved family records stay safe and accessible.',
  },
  {
    id: 'faq-8',
    group: 'Pricing & Plans',
    question: 'How does the ₹20/month Pro Monthly plan and yearly free PDF limit work?',
    answer:
      'Pro Monthly is ₹20/month (inclusive of applicable taxes), with billing handled as per Google Play policy — and you can cancel anytime in Google Play Subscriptions. On Free Forever, you get 3 free manual PDF statement imports every Indian Financial Year (April 1 to March 31) plus unlimited manual entries. PDFs imported during your 90-day free trial do not reduce your Free Forever limit. If you subscribe to Pro Monthly, import 3 or more PDFs, and later cancel back to Free Forever in the same Financial Year, free PDF imports pause until the automatic April 1 reset.',
  },
  {
    id: 'faq-9',
    group: 'Availability',
    question: 'Where can I download GrowUrDhan for Android?',
    answer:
      'GrowUrDhan is preparing for its official Google Play Store launch for Android phones (Android 8.0 and above). We never offer unofficial download files on this website — the official Google Play link will be added right here once it goes live.',
  },
];

export const LEGAL_DOCUMENTS: Record<LegalDocument['id'], LegalDocument> = {
  terms: {
    id: 'terms',
    title: 'Terms & Conditions',
    versionTag: 'v2.1 · Republic of India',
    subtitle:
      'Simple, clear legal terms governing your use of the GrowUrDhan Android app and www.growurdhan.com.',
    sections: [
      {
        heading: '1. Eligibility & Adding Family, Child, or HUF Details',
        paragraphs: [
          'By using GrowUrDhan, you confirm that you are at least 18 years old and legally able to enter into a contract under the Indian Contract Act, 1872. When you enter details for a spouse, adult family member, minor child (as lawful guardian), or Hindu Undivided Family (as Karta or authorised member), you confirm that you have lawful permission and consent under applicable Indian law including the Digital Personal Data Protection Act, 2023 (DPDP Act).',
        ],
      },
      {
        heading: '2. Record-Keeping App Only — Not Financial, Tax, or Legal Advice',
        paragraphs: [
          'GrowUrDhan is strictly a private personal and family financial record-keeping app. GrowUrDhan is NOT a SEBI-registered investment adviser, portfolio manager, stockbroker, depository, Registrar & Transfer Agent (RTA), bank, or Chartered Accountant / tax-filing service. Nothing in the app or on this website is investment, financial, legal, or tax advice.',
        ],
      },
      {
        heading: '3. Phone-Only Storage, No Cloud Backup & Data-Loss Warning',
        paragraphs: [
          'All family records, PAN/PRAN/CAS IDs, accounts, and investment history are stored strictly in encrypted storage on your Android phone. GrowUrDhan does not operate a cloud database for your household wealth and does not offer cloud backup or cloud restore. Uninstalling the app, clearing app storage, losing your phone, or losing both your Passcode and Offline Recovery Code (XXXX-XXXX-XXXX) will permanently erase your saved records.',
        ],
      },
      {
        heading: '4. Device Security, Permissions & Google Play Billing',
        paragraphs: [
          'GrowUrDhan protects your data on your phone with strong local encryption, optional screenshot blocking, optional fingerprint/face unlock (off by default), and a printable Offline Recovery Code PDF. GrowUrDhan does not request SMS, Contacts, Location, or general Storage permissions. Paid subscriptions are billed through Google Play as per Google Play policy.',
        ],
      },
      {
        heading: '5. Official Market Prices Disclaimer',
        paragraphs: [
          'Daily end-of-day prices fetched from official public sources — including AMFI, NSE, and BSE — are shown strictly "AS IS" without guarantee of uninterrupted availability or completeness.',
        ],
      },
      {
        heading: '6. Optional Read-Only Gmail Statement Sync & Google API Limited Use',
        paragraphs: [
          'If you choose to turn on Gmail Statement Sync, GrowUrDhan requests strictly read-only Gmail permission, looks only for emails from the 5 official Indian statement issuers (CAMS, KFintech, NSDL, CDSL, and Protean NPS), keeps your Gmail session token only in temporary phone memory (cleared immediately when the app locks), and never sends any Gmail data to GrowUrDhan or third-party servers. GrowUrDhan’s use of Google APIs strictly follows the Google API Services User Data Policy, including the Limited Use requirements.',
        ],
      },
      {
        heading: '7. 90-Day Free Trial, Free Forever & ₹20/month Pro Plan',
        paragraphs: [
          'Every new user starts with a 90-Day Free Trial with all features unlocked and no payment details or mandate required upfront. After 90 days, the app moves smoothly to the Free Forever plan with zero surprise charges and all your existing family records intact.',
          'The optional Pro Monthly plan costs ₹20/month (inclusive of applicable taxes), billed through Google Play as per Google Play policy. You can manage or cancel your subscription anytime directly in Google Play → Payments & Subscriptions → Subscriptions. Refunds are governed by Google Play policy.',
          'Free Forever includes up to 3 manual PDF statement imports per Indian Financial Year (April 1 – March 31) and excludes automatic Gmail Sync. PDFs imported during the 90-Day Free Trial do not use up your Free Forever yearly allowance. PDFs imported while on Pro Monthly do count toward that Financial Year’s tally — if you import 3 or more PDFs on Pro Monthly and cancel back to Free Forever in the same Financial Year, free PDF imports pause until the April 1 reset.',
        ],
      },
      {
        heading: '8. Statement Reading & Open-Source Libraries',
        paragraphs: [
          'On-device PDF statement reading uses open-source libraries (casparser under the MIT License and pypdfium2 under Apache 2.0 / BSD-3-Clause), provided "AS IS". Because registrar PDF formats can change without notice, please review statement totals and family member assignments before confirming imports.',
        ],
      },
      {
        heading: '9. Personal Use Licence',
        paragraphs: [
          'GrowUrDhan grants you a personal, non-transferable licence to use the app for private household record-keeping. Commercial redistribution or tampering with app billing controls is not permitted.',
        ],
      },
      {
        heading: '10. Disclaimer of Warranties',
        paragraphs: [
          'To the fullest extent permitted by Indian law, GrowUrDhan is provided "AS IS" and "AS AVAILABLE" without express or implied warranties of accuracy, fitness for a particular purpose, or uninterrupted operation.',
        ],
      },
      {
        heading: '11. Limitation of Liability & Responsibility',
        paragraphs: [
          'To the maximum extent permitted by law, GrowUrDhan’s total liability relating to use of the app shall not exceed the subscription fees actually paid by you in the 12 months before the claim (or ₹500 if on Free Forever or Trial). You remain responsible for having permission to enter any other family member’s personal details.',
        ],
      },
      {
        heading: '12. Updates & Governing Law',
        paragraphs: [
          'Important updates to these Terms will be shown clearly inside the app for your review and acceptance. These Terms are governed by the laws of the Republic of India, subject to the jurisdiction of competent courts in India.',
        ],
      },
    ],
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy & Gmail Limited Use',
    versionTag: 'Aligned with Indian DPDP Act 2023 & Google API Policy',
    subtitle:
      'How GrowUrDhan keeps your family’s financial life private on your phone and complies with Google’s Gmail security rules.',
    sections: [
      {
        heading: '1. No Cloud Database & No Website Tracking',
        paragraphs: [
          'www.growurdhan.com is a simple informational website. It does not ask for your email, phone number, PAN, or financial files, and uses no advertising trackers.',
          'Inside the GrowUrDhan Android app, all family member profiles, investments, loans, nominees, and goals are stored strictly on your own phone inside an encrypted local vault.',
        ],
      },
      {
        heading: '2. Strict Phone-Only Policy (No Cloud Backup)',
        paragraphs: [
          'GrowUrDhan deliberately disables cloud backups for your financial vault. GrowUrDhan never receives a copy of your records and cannot reset forgotten passcodes or restore deleted vaults.',
        ],
      },
      {
        heading: '3. Private On-Device Statement Reading',
        paragraphs: [
          'Monthly PDF statements from CAMS, KFintech, NSDL, CDSL, and Protean NPS are unlocked and read right inside your phone. Neither the PDF file nor your password ever leaves your device.',
        ],
      },
      {
        heading: '4. Optional Gmail Statement Sync — Google API Services Limited Use Policy',
        paragraphs: [
          'Gmail Statement Sync is completely optional. If you choose to connect one or more Gmail accounts:',
        ],
        bullets: [
          'Read-Only Access: GrowUrDhan only asks for read-only Gmail access. It can never send, edit, move, or delete your emails.',
          'Only 5 Official Senders: The app strictly searches only for donotreply@camsonline.com, samfS@kfintech.com, NSDL-CAS@nsdl.co.in, eCAS@cdslstatement.com, and nps-statements@mailer.proteantech.in within your chosen date range (default last 3 months).',
          'Direct Phone-to-Google Connection: Statement attachments are read directly on your phone — no email content or sign-in tokens ever pass through a GrowUrDhan server.',
          'Cleared on Lock: Your temporary Gmail sign-in token is kept only in active memory and cleared immediately when you lock the app.',
          'Google Limited Use Compliance: GrowUrDhan’s use of information received from Google APIs strictly adheres to the Google API Services User Data Policy, including the Limited Use requirements — never used for ads, profiling, selling data, or training AI models.',
        ],
      },
      {
        heading: '5. Official Market Prices & Google Play Billing',
        paragraphs: [
          'When you tap refresh, the app downloads official public end-of-day prices from AMFI, NSE, and BSE without sending your holdings or personal details.',
          'Optional Pro Monthly subscriptions (₹20/month) are billed through Google Play as per Google Play policy; GrowUrDhan never sees your bank card or UPI details.',
        ],
      },
    ],
  },
  'open-source': {
    id: 'open-source',
    title: 'Open-Source Notices & Attributions',
    versionTag: 'Licences & Credits',
    subtitle:
      'GrowUrDhan gratefully acknowledges the open-source libraries that help read Indian financial statements privately on your phone.',
    sections: [
      {
        heading: 'casparser — MIT License',
        paragraphs: [
          'Copyright © Sandeep Somasekharan (codereverser/casparser). Used privately inside the Android app to read mutual fund and Demat statements from CAMS, KFintech, NSDL, and CDSL.',
          'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files to deal in the Software without restriction, subject to inclusion of the copyright and permission notice. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.',
        ],
      },
      {
        heading: 'pypdfium2 — Apache License 2.0 / BSD-3-Clause',
        paragraphs: [
          'Used on-device to unlock and read password-protected PDF statements locally inside the app, provided "AS IS" without warranty of any kind.',
        ],
      },
      {
        heading: 'Fonts & Android Components',
        paragraphs: [
          'Uses Plus Jakarta Sans (SIL Open Font License 1.1), JetBrains Mono (SIL Open Font License 1.1), and AndroidX Jetpack libraries (Apache License 2.0).',
        ],
      },
    ],
  },
  'delete-account': {
    id: 'delete-account',
    title: 'Delete Account & Phone Data',
    versionTag: 'No Cloud Account · Instant Control',
    subtitle:
      'Because GrowUrDhan never creates a cloud account or stores your wealth on any server, deleting your data is instant and completely in your hands.',
    sections: [
      {
        heading: 'How to permanently delete all your GrowUrDhan data',
        paragraphs: [
          'Follow these simple steps on your Android phone and Google Account to remove everything completely:',
        ],
        steps: [
          'Delete app data on your phone: Open Android Settings → Apps → GrowUrDhan → Storage → Clear Storage (or simply uninstall GrowUrDhan). This permanently erases all saved family records from your phone.',
          'Delete your Recovery Code PDF: Delete any Recovery Code PDF you saved on your phone or shred any printed paper copy.',
          'Disconnect optional Gmail Sync (if you turned it on): Disconnect inside GrowUrDhan Settings → Gmail Sync before uninstalling, or remove permission anytime in Google Account → Security → Third-party apps & services.',
          'Cancel optional Pro Monthly plan (if subscribed): Open Google Play → Payments & Subscriptions → Subscriptions → GrowUrDhan and cancel as per Google Play policy.',
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
