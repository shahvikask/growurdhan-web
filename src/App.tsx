import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileCheck2,
  Fingerprint,
  KeyRound,
  Lock,
  Mail,
  Moon,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { Header } from './components/Header';
import { BrandWordmark } from './components/BrandMark';
import { MobileAppSimulator, type AppDestination } from './components/MobileAppSimulator';
import { FamilyCustodyExplorer } from './components/FamilyCustodyExplorer';
import { DocumentModal } from './components/DocumentModal';
import {
  ASSET_CATEGORIES,
  FAQS,
  GUIDES,
  LEGAL_DOCUMENTS,
  OFFICIAL_SENDERS,
  type FaqItem,
  type GuideArticle,
  type LegalDocument,
} from './data/growurdhanData';
import vaultStoneImg from './assets/images/private_vault_stone_1795578719484.jpg';
import householdDeskImg from './assets/images/household_study_desk_1795578719555.jpg';

const APP_TOUR_DESTINATIONS: Array<{
  id: AppDestination;
  step: string;
  title: string;
  summary: string;
}> = [
  {
    id: 'home',
    step: '01',
    title: 'Home Command Center',
    summary: 'Net Worth, Owner Lens, Hide Mode (₹ •••••), and Linked Property Equity.',
  },
  {
    id: 'portfolio',
    step: '02',
    title: 'Portfolio & 8 Asset Classes',
    summary: 'Color-coded categories, NSE/BSE/AMFI pricing, and truthful Cost Unknown flags.',
  },
  {
    id: 'statements',
    step: '03',
    title: 'Statements & Gmail Sync',
    summary: 'On-device CAS/NPS parsing, 5 official senders, and CAMS/CDSL deduplication.',
  },
  {
    id: 'insights',
    step: '04',
    title: 'Insights & Cash-Flow Calendar',
    summary: 'Household goals progress, EMI due-day reminders, and Fixed Income accruals.',
  },
  {
    id: 'family',
    step: '05',
    title: 'Family, HUF & Custody Map',
    summary: 'Individual, HUF & Minor books with AMC-first folios and eCAS Nominee status.',
  },
];

const FAQ_GROUPS: Array<'All' | FaqItem['group']> = [
  'All',
  'Product',
  'Sync & CAS',
  'Privacy & D57',
  'Pricing & FY Quota',
  'Availability',
];

type QuotaScenario = 'trial' | 'pro-cancel' | 'april-reset';

const QUOTA_SCENARIOS: Record<
  QuotaScenario,
  { label: string; headline: string; detail: string; remaining: string }
> = {
  trial: {
    label: '90-Day Trial → Free Forever',
    headline: 'Trial parses never consume your Free Forever quota',
    detail:
      'Parse unlimited CAS and NPS PDFs during your 90-day free trial. When you transition to Free Forever on Day 91 with zero auto-charge, your Indian FY counter starts fresh at 0 / 3 used.',
    remaining: '3 / 3 left in FY',
  },
  'pro-cancel': {
    label: 'Pro Monthly (3+ PDFs) → Cancel',
    headline: 'Paid-tier parses carry over within the same Indian FY',
    detail:
      'Every PDF parsed while on Pro Monthly (₹20/month) increments your current Indian Financial Year tally. If you parse 3 or more PDFs and cancel to Free Forever in the same FY, Free Forever pauses new PDF parses until April 1.',
    remaining: '0 / 3 until Apr 1',
  },
  'april-reset': {
    label: 'April 1 Financial Year Reset',
    headline: 'Automatic annual reset every April 1',
    detail:
      'On April 1 of the new Indian Financial Year (Apr 1 – Mar 31), your Free Forever allowance automatically resets to 0 / 3 used while every previously imported holding and ledger event remains intact.',
    remaining: '3 / 3 refreshed',
  },
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeDest, setActiveDest] = useState<AppDestination>('home');
  const [faqGroup, setFaqGroup] = useState<'All' | FaqItem['group']>('All');
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');
  const [quotaScenario, setQuotaScenario] = useState<QuotaScenario>('trial');
  const [activeGuide, setActiveGuide] = useState<GuideArticle | null>(null);
  const [activeLegal, setActiveLegal] = useState<LegalDocument | null>(null);
  const [vaultImgError, setVaultImgError] = useState(false);
  const [deskImgError, setDeskImgError] = useState(false);

  // Sync Tailwind v4 .dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Deep-link hash routing for Legal & Guides (#terms, #privacy, #open-source, #delete-account, #guides/<id>)
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash === 'terms' || hash === 'privacy' || hash === 'open-source' || hash === 'delete-account') {
        setActiveGuide(null);
        setActiveLegal(LEGAL_DOCUMENTS[hash]);
        return;
      }
      if (hash.startsWith('guides/')) {
        const slug = hash.slice('guides/'.length);
        const found = GUIDES.find((g) => g.id === slug);
        if (found) {
          setActiveLegal(null);
          setActiveGuide(found);
        }
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const openLegalDoc = (id: LegalDocument['id']) => {
    setActiveGuide(null);
    setActiveLegal(LEGAL_DOCUMENTS[id]);
    window.history.replaceState(null, '', `#${id}`);
  };

  const openGuideDoc = (guide: GuideArticle) => {
    setActiveLegal(null);
    setActiveGuide(guide);
    window.history.replaceState(null, '', `#guides/${guide.id}`);
  };

  const closeModal = () => {
    setActiveGuide(null);
    setActiveLegal(null);
    if (
      window.location.hash.startsWith('#guides/') ||
      ['#terms', '#privacy', '#open-source', '#delete-account'].includes(window.location.hash)
    ) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const visibleFaqs = useMemo(
    () => (faqGroup === 'All' ? FAQS : FAQS.filter((f) => f.group === faqGroup)),
    [faqGroup]
  );

  const scrollToPreview = () => {
    const el = document.getElementById('app-preview');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const currentQuota = QUOTA_SCENARIOS[quotaScenario];

  return (
    <div
      id="top"
      className="min-h-screen flex flex-col bg-[#F6EFE3] dark:bg-[#07131F] text-[#1C1917] dark:text-[#F4F7FB] transition-colors duration-200"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#0C2338] focus:text-white focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>

      <Header onExploreApp={scrollToPreview} />

      <main id="main" className="flex-1">
        {/* SECTION 1: HERO + LIVE 5-DESTINATION ANDROID PREVIEW */}
        <section id="app-preview" className="pt-10 pb-14 lg:pt-14 lg:pb-20">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            {/* Quiet utility metadata line + Heritage Light/Dark Theme Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-[#E3D9C8] dark:border-[#1C374F]">
              <p className="text-xs sm:text-sm font-medium text-[#6B5E52] dark:text-[#9BB3C7]">
                Native Android (<span className="font-mono">in.growurdhan.app</span>) · Offline-first
                AES-256-GCM vault · Heritage Modern Wealth
              </p>

              <div
                role="group"
                aria-label="Preview Heritage Modern Wealth app theme"
                className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#EFE6D6] dark:bg-[#0C1C2C] border border-[#E3D9C8] dark:border-[#1C374F]"
              >
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  aria-pressed={theme === 'dark'}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    theme === 'dark'
                      ? 'bg-[#102536] text-[#F5C14A] shadow-xs'
                      : 'text-[#6B5E52] hover:text-[#1C1917]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Heritage Navy</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  aria-pressed={theme === 'light'}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    theme === 'light'
                      ? 'bg-white text-[#0C2338] shadow-xs'
                      : 'text-[#9BB3C7] hover:text-[#F4F7FB]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Warm Ivory</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Column: Value Proposition + 5-Destination Tour */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-8">
                <div className="space-y-5">
                  <h1 className="text-[clamp(2.25rem,4.1vw,3.5rem)] font-extrabold tracking-[-0.035em] leading-[1.07] text-[#1C1917] dark:text-[#F4F7FB] max-w-2xl">
                    Your private Indian family wealth intelligence platform.
                  </h1>

                  <p className="text-base sm:text-[1.05rem] text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed max-w-[60ch]">
                    Unify all 8 Indian asset classes across Individual, HUF, and Minor books inside
                    an encrypted local Android vault. Parse CAMS, KFintech, NSDL, CDSL, and Protean
                    NPS PDFs on-device — or enable optional read-only Gmail Sync — with zero cloud
                    database and zero ads.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <a
                      href="#pricing"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-[#F6EFE3] dark:text-[#07131F] bg-[#0C2338] hover:bg-[#143350] dark:bg-[#F5C14A] dark:hover:bg-[#EAB032] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
                    >
                      <span>Compare 90-Day Trial &amp; Plans</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <a
                      href="#sync-cas"
                      className="inline-flex items-center justify-center px-3 py-3 text-sm font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
                    >
                      How on-device CAS &amp; Gmail Sync work
                    </a>
                  </div>
                </div>

                {/* 5-Destination App Tour Controls */}
                <div className="pt-6 border-t border-[#E3D9C8] dark:border-[#1C374F] space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                      Five Native App Destinations
                    </h2>
                    <span className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                      Select any screen to inspect it live on the phone
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {APP_TOUR_DESTINATIONS.map((item) => {
                      const active = activeDest === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveDest(item.id)}
                          className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                            active
                              ? 'bg-white dark:bg-[#102536] border-[#0F766E] dark:border-[#F5C14A]'
                              : 'bg-[#FBF8F2] dark:bg-[#0C1C2C] border-[#E3D9C8] dark:border-[#1C374F] hover:border-[#B87D0B] dark:hover:border-[#2DD4BF]'
                          }`}
                        >
                          <div className="flex items-baseline gap-2">
                            <span
                              className={`font-mono text-xs font-semibold ${
                                active
                                  ? 'text-[#0F766E] dark:text-[#F5C14A]'
                                  : 'text-[#6B5E52] dark:text-[#9BB3C7]'
                              }`}
                            >
                              {item.step}.
                            </span>
                            <span className="text-sm font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                              {item.title}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                            {item.summary}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Live 5-Destination Android Preview */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <MobileAppSimulator
                  activeDestination={activeDest}
                  onDestinationChange={setActiveDest}
                />
              </div>
            </div>

            {/* Full-Width 4-Column Proof Strip */}
            <div className="mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-5 bg-white dark:bg-[#0C1C2C] border border-[#E3D9C8] dark:border-[#1C374F] rounded-2xl p-6">
              <div className="space-y-1">
                <div className="font-mono tabular-nums text-2xl font-bold text-[#1C1917] dark:text-[#F5C14A]">
                  8 Classes
                </div>
                <div className="text-xs font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                  Subcategory-Smart Forms
                </div>
                <div className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                  Equity, MF, Gold/SGB, Fixed Income, Real Estate, Cash, Specialised, Loans
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-mono tabular-nums text-2xl font-bold text-[#1C1917] dark:text-[#2DD4BF]">
                  5 Senders
                </div>
                <div className="text-xs font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                  On-Device CAS &amp; Gmail Sync
                </div>
                <div className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                  CAMS · KFintech · NSDL · CDSL · Protean NPS parsed locally
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-mono tabular-nums text-2xl font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                  0 Cloud DBs
                </div>
                <div className="text-xs font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                  D57 Local-Only Vault
                </div>
                <div className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                  AES-256-GCM · allowBackup=false · Offline A4 Recovery PDF
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-mono tabular-nums text-2xl font-bold text-[#1C1917] dark:text-[#F5C14A]">
                  ₹20 / mo
                </div>
                <div className="text-xs font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                  After 90-Day Free Trial
                </div>
                <div className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                  Zero upfront mandate · Free Forever (3 PDFs/FY) also included
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: CAPABILITIES, FAMILY CUSTODY MAP & 8 ASSET CLASSES */}
        <section
          id="features"
          className="py-16 lg:py-24 bg-[#FBF8F2] dark:bg-[#0C1C2C] border-t border-[#E3D9C8] dark:border-[#1C374F]"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8 space-y-14">
            <div className="max-w-2xl">
              <p className="text-xs font-mono font-semibold text-[#0F766E] dark:text-[#2DD4BF] mb-2">
                01 · Household Intelligence &amp; Accounting Engine
              </p>
              <h2 className="text-[clamp(1.85rem,3vw,2.55rem)] font-extrabold tracking-[-0.03em] leading-tight text-[#1C1917] dark:text-[#F4F7FB]">
                Every owner, custody account, nominee, and rupee accounted for honestly.
              </h2>
              <p className="mt-3 text-base text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                Built natively for multi-generational Indian households — separating Self, Spouse,
                Minor (with Guardian), and HUF without merging PANs, folios, or legal ownership.
              </p>
            </div>

            {/* Asymmetric Bento Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <article className="lg:col-span-2 rounded-2xl bg-[#F6EFE3] dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-6 sm:p-7 space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                    Interactive Family Ownership &amp; Custody Map
                  </h3>
                  <p className="mt-1.5 text-sm text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                    Mutual Fund folios display clean Indian AMC names (never generic folio
                    placeholders), eCAS nominee compliance flags{' '}
                    <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                      Registered
                    </span>{' '}
                    vs{' '}
                    <span className="font-semibold text-[#B87D0B] dark:text-[#F5C14A]">
                      Not Registered
                    </span>
                    , and missing purchase costs stay honestly marked{' '}
                    <span className="font-mono text-xs">UNKNOWN</span>.
                  </p>
                </div>
                <FamilyCustodyExplorer />
              </article>

              <article className="lg:col-span-1 rounded-2xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-6 sm:p-7 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F6EFE3] dark:bg-[#07131F] border border-[#E3D9C8] dark:border-[#1C374F] text-[#0F766E] dark:text-[#2DD4BF] flex items-center justify-center">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                    Official Market Feeds &amp; Fixed-Scale Ledger
                  </h3>
                  <p className="text-sm text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                    No binary floating-point rounding drift and no fragile screen-scraping. All INR
                    balances compute at exact <span className="font-mono">10⁴</span> integer scale
                    and quantities at <span className="font-mono">10⁸</span> scale across an
                    append-only 11-event ledger.
                  </p>
                </div>

                <dl className="space-y-2.5 pt-5 border-t border-[#E3D9C8] dark:border-[#1C374F] text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#6B5E52] dark:text-[#9BB3C7]">Mutual Funds</dt>
                    <dd className="font-mono font-semibold">AMFI NAVAll.txt</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#6B5E52] dark:text-[#9BB3C7]">NSE Equities &amp; ETFs</dt>
                    <dd className="font-mono font-semibold">NSE UDiFF Bhavcopy</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#6B5E52] dark:text-[#9BB3C7]">BSE Equities</dt>
                    <dd className="font-mono font-semibold">BSE UDiFF Bhavcopy</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#6B5E52] dark:text-[#9BB3C7]">Cost Provenance</dt>
                    <dd className="font-mono font-semibold text-[#B87D0B] dark:text-[#F5C14A]">
                      Explicit UNKNOWN
                    </dd>
                  </div>
                </dl>
              </article>
            </div>

            {/* All 8 Color-Coded Asset Categories */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                  All 8 Color-Coded Indian Asset Categories
                </h3>
                <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                  Subcategory-aware forms hide irrelevant fields &amp; artificial Units = 1 friction
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ASSET_CATEGORIES.map((cat) => (
                  <article
                    key={cat.id}
                    className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-5 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.colorHex }}
                          />
                          <h4 className="text-sm font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                            {cat.label}
                          </h4>
                        </div>
                        <span className="font-mono text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                          {cat.valuationMode}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                    <p className="pt-2.5 border-t border-[#E3D9C8]/70 dark:border-[#1C374F] text-[11px] text-[#6B5E52] dark:text-[#9BB3C7]">
                      {cat.subcategories.slice(0, 4).join(' · ')}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: ON-DEVICE CAS ENGINE, READ-ONLY GMAIL SYNC & DEDUPLICATION */}
        <section id="sync-cas" className="py-16 lg:py-24 bg-[#F6EFE3] dark:bg-[#07131F] border-t border-[#E3D9C8] dark:border-[#1C374F]">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8 space-y-12">
            <div className="max-w-2xl">
              <p className="text-xs font-mono font-semibold text-[#B87D0B] dark:text-[#F5C14A] mb-2">
                02 · Zero-Upload Statement Engine &amp; Optional Gmail Sync
              </p>
              <h2 className="text-[clamp(1.85rem,3vw,2.55rem)] font-extrabold tracking-[-0.03em] leading-tight text-[#1C1917] dark:text-[#F4F7FB]">
                Import eCAS &amp; NPS PDFs on-device without duplicate holdings.
              </h2>
              <p className="mt-3 text-base text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                Pick PDFs manually or connect a family-wide pool of Gmail accounts over strictly
                read-only OAuth (<span className="font-mono text-sm">gmail.readonly</span>). Every
                statement is decrypted, verified, deduplicated, and linked to custody accounts right
                on your phone.
              </p>
            </div>

            {/* 4-Stage Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <article className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#0F766E] dark:text-[#2DD4BF]">
                  <span>01 · Discovery</span>
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold">Family-Wide Gmail Pool</h3>
                <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                  Link 1 to N Gmail accounts and toggle sync per member. First sync defaults to the
                  Last 3 months (configurable 3m / 6m / 12m / Current FY) and imports only the
                  latest statement month incrementally.
                </p>
              </article>

              <article className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#B87D0B] dark:text-[#F5C14A]">
                  <span>02 · Local Parse</span>
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold">Embedded Python Parser</h3>
                <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                  Unlocks PDFs inside your device using Chaquopy + <span className="font-mono">casparser</span>{' '}
                  (MIT) + <span className="font-mono">pypdfium2</span>. Auto-derives uppercase PAN
                  for CAS and <span className="font-mono">first4+DDMM</span> for Protean NPS.
                </p>
              </article>

              <article className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#0F766E] dark:text-[#2DD4BF]">
                  <span>03 · Golden Record</span>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold">Cross-Source Deduplication</h3>
                <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                  Separates SOA Folios from Demat DP/Client accounts, skips older back-dated rows (
                  <span className="font-mono">Skipped (Older)</span>), backfills missing cost basis,
                  and strips noisy RTA prefixes (<span className="font-mono">MCAG -</span>) into
                  structured metadata.
                </p>
              </article>

              <article className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#B87D0B] dark:text-[#F5C14A]">
                  <span>04 · Auto-Custody</span>
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold">Auto-Commit &amp; Nominees</h3>
                <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                  100% owner-verified batches auto-commit and link Demat, NPS PRAN, and AMC-named MF
                  Custody Accounts alongside eCAS Nominee status. Only genuine conflicts enter
                  Review &amp; Commit.
                </p>
              </article>
            </div>

            {/* 5 Official Senders Allowlist Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0C1C2C] border border-[#E3D9C8] dark:border-[#1C374F] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E3D9C8] dark:border-[#1C374F] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                    Strict 5-Sender Gmail Allowlist (Read-Only · RAM-Only OAuth Tokens)
                  </h3>
                  <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                    Optional Gmail Sync never queries personal correspondence — only these 5
                    official Indian statement senders.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openLegalDoc('privacy')}
                  className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                >
                  Read Google API Limited Use Policy
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px] text-xs">
                  <thead>
                    <tr className="border-b border-[#E3D9C8] dark:border-[#1C374F] text-[#6B5E52] dark:text-[#9BB3C7]">
                      <th className="py-3 px-6 font-semibold">Issuer</th>
                      <th className="py-3 px-6 font-semibold">Allowlisted Sender Email</th>
                      <th className="py-3 px-6 font-semibold">Statement Coverage</th>
                      <th className="py-3 px-6 font-semibold">On-Device Unlock Rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3D9C8]/70 dark:divide-[#1C374F]">
                    {OFFICIAL_SENDERS.map((sender) => (
                      <tr key={sender.email}>
                        <td className="py-3 px-6 font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                          {sender.issuer}
                        </td>
                        <td className="py-3 px-6 font-mono text-[#0F766E] dark:text-[#2DD4BF]">
                          {sender.email}
                        </td>
                        <td className="py-3 px-6 text-[#6B5E52] dark:text-[#9BB3C7]">
                          {sender.coverage}
                        </td>
                        <td className="py-3 px-6 text-[#6B5E52] dark:text-[#9BB3C7]">
                          {sender.unlockRule}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: D57 SECURITY & ZERO-CLOUD VAULT ARCHITECTURE */}
        <section
          id="security"
          className="py-16 lg:py-24 bg-[#07131F] text-[#F4F7FB] border-t border-[#1C374F]"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between gap-8">
                <div>
                  <p className="text-xs font-mono font-semibold text-[#F5C14A] mb-2">
                    03 · D57 Zero-Cloud Vault Security
                  </p>
                  <h2 className="text-[clamp(1.85rem,3.1vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-tight text-white">
                    Encrypted on your Android device. Never backed up to any cloud.
                  </h2>
                  <p className="mt-3 text-base text-[#9BB3C7] leading-relaxed max-w-[58ch]">
                    GrowUrDhan is engineered with zero cloud household storage and zero dangerous
                    Android permissions. Every PAN, PRAN, CAS ID, folio, and rupee lives inside an
                    AES-256-GCM encrypted vault on your phone.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#0C1C2C] border border-[#1C374F] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <KeyRound className="w-4 h-4 text-[#F5C14A]" />
                      <span>AES-256-GCM &amp; Keystore</span>
                    </div>
                    <p className="text-xs text-[#9BB3C7] leading-relaxed">
                      Local vault encryption backed by Android Keystore and PBKDF2-SHA256 passcode
                      derivation.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0C1C2C] border border-[#1C374F] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <ShieldAlert className="w-4 h-4 text-[#FB7185]" />
                      <span>D57 No Cloud Backup</span>
                    </div>
                    <p className="text-xs text-[#9BB3C7] leading-relaxed">
                      <span className="font-mono text-[#F4F7FB]">allowBackup="false"</span> by
                      design. Uninstalling or losing both Passcode and Offline Recovery Code
                      permanently erases local books.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0C1C2C] border border-[#1C374F] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <FileCheck2 className="w-4 h-4 text-[#2DD4BF]" />
                      <span>Offline Recovery Code PDF</span>
                    </div>
                    <p className="text-xs text-[#9BB3C7] leading-relaxed">
                      During onboarding, save your <span className="font-mono">XXXX-XXXX-XXXX</span>{' '}
                      recovery code as an A4 PDF via zero-permission Android SAF or print it for a
                      home safe.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0C1C2C] border border-[#1C374F] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <Fingerprint className="w-4 h-4 text-[#F5C14A]" />
                      <span>Privacy &amp; Opt-In Biometrics</span>
                    </div>
                    <p className="text-xs text-[#9BB3C7] leading-relaxed">
                      Hide Mode (<span className="font-mono">₹ •••••</span>), Auto-Lock (1/5/15
                      min), screenshot blocking (<span className="font-mono">FLAG_SECURE</span>),
                      and opt-in hardware BiometricPrompt (OFF by default).
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col">
                <div className="relative flex-1 min-h-[300px] rounded-2xl overflow-hidden border border-[#1C374F] bg-[#0C1C2C]">
                  {!vaultImgError ? (
                    <img
                      src={vaultStoneImg}
                      alt="Deep obsidian slate and brushed brass architectural seam representing GrowUrDhan's local-first vault"
                      referrerPolicy="no-referrer"
                      onError={() => setVaultImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 text-center">
                      <Lock className="w-8 h-8 text-[#F5C14A]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07131F]/92 via-[#07131F]/35 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6 space-y-2.5">
                    <p className="text-xs font-mono text-[#F5C14A]">Zero Dangerous Permissions</p>
                    <p className="text-sm font-semibold text-white leading-snug">
                      Only normal install-time <span className="font-mono">INTERNET</span> for
                      official AMFI/NSE/BSE price feeds and optional read-only Gmail Sync.
                    </p>
                    <p className="text-xs text-[#9BB3C7]">
                      No Contacts · No SMS · No Storage Permissions · No Cloud Server Copy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: TRANSPARENT 3-TIER PRICING & FY PDF QUOTA CARRY-OVER */}
        <section
          id="pricing"
          className="py-16 lg:py-24 bg-[#F6EFE3] dark:bg-[#07131F] border-t border-[#E3D9C8] dark:border-[#1C374F]"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8 space-y-10">
            <div className="max-w-2xl">
              <p className="text-xs font-mono font-semibold text-[#0F766E] dark:text-[#2DD4BF] mb-2">
                04 · Transparent Indian Licensing
              </p>
              <h2 className="text-[clamp(1.85rem,3vw,2.55rem)] font-extrabold tracking-[-0.03em] leading-tight text-[#1C1917] dark:text-[#F4F7FB]">
                90 days free with zero mandate. Then Free Forever or ₹20/month.
              </h2>
              <p className="mt-3 text-base text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                No ads, no regular-plan fund commissions, and zero lock-in. All existing household
                records remain 100% accessible on Free Forever even if you never subscribe or cancel
                later.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Tier 1: 90-Day Free Trial */}
              <article className="rounded-2xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-6 sm:p-7 flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs font-medium text-[#6B5E52] dark:text-[#9BB3C7]">
                    First 90 days · Zero card or mandate
                  </p>
                  <div className="mt-2 font-mono tabular-nums text-4xl font-extrabold text-[#1C1917] dark:text-[#F4F7FB]">
                    ₹0
                  </div>
                  <h3 className="mt-2 text-base font-bold">90-Day Free Trial</h3>
                  <p className="mt-2 text-sm text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                    Every Pro capability unlocked from Day 1. Transitions cleanly to Free Forever on
                    Day 91 with zero surprise charge.
                  </p>
                </div>
                <ul className="space-y-2 pt-5 border-t border-[#E3D9C8] dark:border-[#1C374F] text-sm text-[#1C1917] dark:text-[#F4F7FB]">
                  <li>Unlimited on-device CAS &amp; NPS PDF parsing</li>
                  <li>Trial PDFs excluded from Free Forever FY cap</li>
                  <li>Full automated read-only Gmail Statement Sync</li>
                </ul>
              </article>

              {/* Tier 2: Free Forever */}
              <article className="rounded-2xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-6 sm:p-7 flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs font-medium text-[#6B5E52] dark:text-[#9BB3C7]">
                    No ads · Zero lock-in
                  </p>
                  <div className="mt-2 font-mono tabular-nums text-4xl font-extrabold text-[#1C1917] dark:text-[#F4F7FB]">
                    ₹0
                  </div>
                  <h3 className="mt-2 text-base font-bold">Free Forever</h3>
                  <p className="mt-2 text-sm text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                    Complete ad-free household tracking with unlimited manual entries, CSV/TXT
                    imports, and official NSE/BSE/AMFI price updates.
                  </p>
                </div>
                <ul className="space-y-2 pt-5 border-t border-[#E3D9C8] dark:border-[#1C374F] text-sm text-[#1C1917] dark:text-[#F4F7FB]">
                  <li>3 manual PDF parses per Indian FY (Apr 1 – Mar 31)</li>
                  <li>Unlimited manual holdings, Goals &amp; Family profiles</li>
                  <li className="text-[#6B5E52] dark:text-[#9BB3C7]">No automated Gmail Sync</li>
                </ul>
              </article>

              {/* Tier 3: Pro Monthly (Featured) */}
              <article className="rounded-2xl bg-white dark:bg-[#102536] border-2 border-[#0F766E] dark:border-[#F5C14A] p-6 sm:p-7 flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs font-bold text-[#0F766E] dark:text-[#F5C14A]">
                    Inclusive of applicable taxes · Cancel anytime
                  </p>
                  <div className="mt-2 font-mono tabular-nums text-4xl font-extrabold text-[#1C1917] dark:text-[#F4F7FB]">
                    ₹20
                    <span className="text-sm font-sans font-normal text-[#6B5E52] dark:text-[#9BB3C7]">
                      {' '}
                      / month
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold">Pro Monthly Subscription</h3>
                  <p className="mt-2 text-sm text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                    Auto-renewing Google Play / UPI AutoPay mandate until cancelled anytime in
                    Google Play Subscriptions.
                  </p>
                </div>
                <ul className="space-y-2 pt-5 border-t border-[#E3D9C8] dark:border-[#1C374F] text-sm text-[#1C1917] dark:text-[#F4F7FB]">
                  <li>Unlimited manual &amp; synced CAS/NPS PDF parsing</li>
                  <li>Full multi-account Gmail Statement Sync</li>
                  <li className="font-mono text-xs text-[#6B5E52] dark:text-[#9BB3C7] pt-1">
                    Google Play SKU: gud_pro_monthly_20
                  </li>
                </ul>
              </article>
            </div>

            {/* Interactive Indian FY PDF Quota Carry-Over Explainer */}
            <div className="rounded-2xl bg-white dark:bg-[#0C1C2C] border border-[#E3D9C8] dark:border-[#1C374F] p-6 sm:p-7 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                    How the Indian Financial Year (Apr 1 – Mar 31) PDF Quota Works
                  </h3>
                  <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7] mt-1">
                    Transparent anti-abuse rules disclosed clearly before you subscribe.
                  </p>
                </div>

                <div
                  role="tablist"
                  aria-label="Inspect FY PDF quota scenarios"
                  className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#F6EFE3] dark:bg-[#07131F] border border-[#E3D9C8] dark:border-[#1C374F]"
                >
                  {(Object.keys(QUOTA_SCENARIOS) as QuotaScenario[]).map((key) => {
                    const active = quotaScenario === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setQuotaScenario(key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-[#0C2338] dark:bg-[#F5C14A] text-white dark:text-[#07131F]'
                            : 'text-[#6B5E52] dark:text-[#9BB3C7] hover:text-[#1C1917] dark:hover:text-[#F4F7FB]'
                        }`}
                      >
                        {QUOTA_SCENARIOS[key].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl bg-[#FBF8F2] dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="text-sm font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                    {currentQuota.headline}
                  </div>
                  <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                    {currentQuota.detail}
                  </p>
                </div>
                <div className="font-mono tabular-nums text-sm font-bold text-[#0F766E] dark:text-[#2DD4BF] shrink-0">
                  {currentQuota.remaining}
                </div>
              </div>
            </div>

            {/* Honest Pre-Launch Notice */}
            <div className="rounded-2xl bg-[#FBF8F2] dark:bg-[#0C1C2C] border border-[#E3D9C8] dark:border-[#1C374F] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-mono text-[#B87D0B] dark:text-[#F5C14A]">
                  Android 8.0+ (minSdk 26 · arm64-v8a) · Package ID: in.growurdhan.app
                </p>
                <h3 className="text-base font-bold">Google Play Release Preparation</h3>
                <p className="text-sm text-[#6B5E52] dark:text-[#9BB3C7] max-w-2xl leading-relaxed">
                  GrowUrDhan will be distributed exclusively via Google Play. No sideloaded APKs and
                  no email capture forms are hosted on www.growurdhan.com.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openLegalDoc('terms')}
                className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-[#1C1917] dark:text-[#F4F7FB] bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] hover:border-[#B87D0B] dark:hover:border-[#F5C14A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Review Terms v2.1-LEGAL-RELEASE
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 6: PLAIN-LANGUAGE GUIDES & GROUPED FAQ HUB */}
        <section
          id="guides"
          className="py-16 lg:py-24 bg-white dark:bg-[#0C1C2C] border-t border-[#E3D9C8] dark:border-[#1C374F]"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
                <p className="text-xs font-mono font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                  05 · Household Guides &amp; Documentation
                </p>
                <h2 className="text-[clamp(1.85rem,3vw,2.5rem)] font-extrabold tracking-[-0.03em] leading-tight text-[#1C1917] dark:text-[#F4F7FB]">
                  Plain-language architecture guides for Indian families.
                </h2>
                <p className="text-base text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                  Understand exactly how on-device CAS parsing, optional read-only Gmail Sync,
                  cross-source deduplication, D57 local security, and fixed-scale accounting work.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className="relative aspect-[16/9] lg:h-full w-full rounded-2xl overflow-hidden border border-[#E3D9C8] dark:border-[#1C374F] bg-[#FBF8F2] dark:bg-[#102536]">
                  {!deskImgError ? (
                    <img
                      src={householdDeskImg}
                      alt="Sunlit Indian home study desk with a linen ledger book and brass pen"
                      referrerPolicy="no-referrer"
                      onError={() => setDeskImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 text-[#6B5E52] dark:text-[#9BB3C7]">
                      <BookOpen className="w-7 h-7 mr-2.5" />
                      <span className="text-sm font-semibold">GrowUrDhan Guides</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 6 Clickable Guides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {GUIDES.map((guide) => (
                <button
                  key={guide.id}
                  type="button"
                  onClick={() => openGuideDoc(guide)}
                  className="text-left rounded-2xl bg-[#FBF8F2] dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] hover:border-[#0F766E] dark:hover:border-[#F5C14A] p-6 flex flex-col justify-between gap-4 transition-colors cursor-pointer group"
                >
                  <div>
                    <p className="text-xs font-medium text-[#6B5E52] dark:text-[#9BB3C7] mb-2">
                      {guide.category} · {guide.readTime}
                    </p>
                    <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F4F7FB] group-hover:text-[#0F766E] dark:group-hover:text-[#F5C14A] transition-colors leading-snug">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                      {guide.summary}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                    <span>Read guide</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              ))}
            </div>

            {/* Filterable Grouped FAQ */}
            <div id="faq" className="pt-8 border-t border-[#E3D9C8] dark:border-[#1C374F]">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs font-mono font-semibold text-[#0F766E] dark:text-[#2DD4BF] mb-1.5">
                    Frequently Asked Questions
                  </p>
                  <h2 className="text-[clamp(1.65rem,2.6vw,2.2rem)] font-extrabold tracking-[-0.03em] text-[#1C1917] dark:text-[#F4F7FB]">
                    Clear answers before you install
                  </h2>
                </div>

                <div
                  role="tablist"
                  aria-label="Filter FAQ by category"
                  className="flex items-center gap-1 p-1 rounded-xl bg-[#F6EFE3] dark:bg-[#07131F] border border-[#E3D9C8] dark:border-[#1C374F] overflow-x-auto"
                >
                  {FAQ_GROUPS.map((group) => {
                    const active = faqGroup === group;
                    return (
                      <button
                        key={group}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setFaqGroup(group)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#0C2338] dark:bg-[#F5C14A] text-white dark:text-[#07131F]'
                            : 'text-[#6B5E52] dark:text-[#9BB3C7] hover:text-[#1C1917] dark:hover:text-[#F4F7FB]'
                        }`}
                      >
                        {group}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="divide-y divide-[#E3D9C8] dark:divide-[#1C374F] border-y border-[#E3D9C8] dark:border-[#1C374F]">
                {visibleFaqs.map((item) => {
                  const isOpen = openFaqId === item.id;
                  return (
                    <div key={item.id}>
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? '' : item.id)}
                        aria-expanded={isOpen}
                        className="w-full py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer group"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-mono text-[#6B5E52] dark:text-[#9BB3C7]">
                            {item.group}
                          </span>
                          <div className="text-[15px] sm:text-base font-bold text-[#1C1917] dark:text-[#F4F7FB] group-hover:text-[#0F766E] dark:group-hover:text-[#F5C14A] transition-colors">
                            {item.question}
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-[#6B5E52] dark:text-[#9BB3C7] shrink-0 transition-transform duration-150 ${
                            isOpen ? 'rotate-180 text-[#0F766E] dark:text-[#F5C14A]' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="pb-5 pr-8 text-sm sm:text-[15px] text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed max-w-3xl">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET FOOTER & LEGAL CENTER */}
      <footer className="bg-[#F6EFE3] dark:bg-[#07131F] border-t border-[#E3D9C8] dark:border-[#1C374F] py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <BrandWordmark />
              <p className="text-sm text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                Your Private Family Wealth Intelligence Platform for Indian households. Encrypted on
                Android, with every owner kept distinct.
              </p>
              <div className="flex items-center gap-3 text-xs font-mono text-[#6B5E52] dark:text-[#9BB3C7]">
                <span>www.growurdhan.com</span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                  className="font-sans font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                >
                  {theme === 'dark' ? 'Switch to Ivory Light' : 'Switch to Navy Dark'}
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-[#6B5E52] dark:text-[#9BB3C7]">Product</h3>
              <ul className="space-y-2 text-sm font-medium text-[#1C1917] dark:text-[#F4F7FB]">
                <li>
                  <a href="#app-preview" className="hover:text-[#0F766E] dark:hover:text-[#F5C14A]">
                    5-Destination App Preview
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#0F766E] dark:hover:text-[#F5C14A]">
                    8 Asset Classes &amp; Custody Map
                  </a>
                </li>
                <li>
                  <a href="#sync-cas" className="hover:text-[#0F766E] dark:hover:text-[#F5C14A]">
                    On-Device CAS &amp; Gmail Sync
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[#0F766E] dark:hover:text-[#F5C14A]">
                    90-Day Trial &amp; ₹20/mo Pro
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-[#6B5E52] dark:text-[#9BB3C7]">Guides</h3>
              <ul className="space-y-2 text-sm font-medium text-[#1C1917] dark:text-[#F4F7FB]">
                {GUIDES.slice(0, 4).map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      onClick={() => openGuideDoc(g)}
                      className="text-left hover:text-[#0F766E] dark:hover:text-[#F5C14A] cursor-pointer"
                    >
                      {g.category}: {g.title.split(' ').slice(0, 4).join(' ')}…
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-[#6B5E52] dark:text-[#9BB3C7]">
                Legal &amp; Compliance
              </h3>
              <ul className="space-y-2 text-sm font-medium text-[#1C1917] dark:text-[#F4F7FB]">
                <li>
                  <button
                    type="button"
                    onClick={() => openLegalDoc('terms')}
                    className="hover:text-[#0F766E] dark:hover:text-[#F5C14A] cursor-pointer"
                  >
                    Terms &amp; Conditions (v2.1)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openLegalDoc('privacy')}
                    className="hover:text-[#0F766E] dark:hover:text-[#F5C14A] cursor-pointer"
                  >
                    Privacy &amp; Gmail Limited Use
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openLegalDoc('open-source')}
                    className="hover:text-[#0F766E] dark:hover:text-[#F5C14A] cursor-pointer"
                  >
                    Open-Source Notices (casparser)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openLegalDoc('delete-account')}
                    className="hover:text-[#0F766E] dark:hover:text-[#F5C14A] cursor-pointer"
                  >
                    Delete Account &amp; Local Data
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E3D9C8] dark:border-[#1C374F] space-y-2 text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
            <p>
              <strong className="font-semibold text-[#1C1917] dark:text-[#F4F7FB]">
                Regulatory Disclaimer:
              </strong>{' '}
              GrowUrDhan (<span className="font-mono">in.growurdhan.app</span>) is a private
              personal and household financial record-keeping application for users aged 18+. It is
              not a SEBI-registered investment adviser, portfolio manager, stockbroker, depository,
              RTA, bank, or ICAI Chartered Accountant / tax-filing service. Nothing on this site or
              in the app constitutes financial, investment, legal, or tax advice.
            </p>
            <p>
              All names, folios, PAN/PRAN masks, and rupee figures shown in the interactive preview
              are synthetic sample records. On-device statement parsing uses open-source{' '}
              <span className="font-mono">casparser</span> (MIT License) and{' '}
              <span className="font-mono">pypdfium2</span>.
            </p>
          </div>
        </div>
      </footer>

      <DocumentModal guide={activeGuide} legal={activeLegal} onClose={closeModal} />
    </div>
  );
}
