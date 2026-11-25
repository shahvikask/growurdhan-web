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
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
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
    title: 'Home Overview',
    summary: 'See total family wealth, switch by member, hide balances in public, and view home equity.',
  },
  {
    id: 'portfolio',
    step: '02',
    title: 'All 8 Investment Types',
    summary: 'Shares, mutual funds, gold, PPF/FD, property, bank cash, and loans with official daily prices.',
  },
  {
    id: 'statements',
    step: '03',
    title: 'Easy Statement Import',
    summary: 'Add CAMS, KFintech, CDSL, NSDL, and NPS PDFs or turn on optional read-only Gmail Sync.',
  },
  {
    id: 'insights',
    step: '04',
    title: 'Goals & EMI Calendar',
    summary: 'Track education or retirement goals alongside upcoming monthly EMIs and interest dates.',
  },
  {
    id: 'family',
    step: '05',
    title: 'Family & Nominees',
    summary: 'Keep Self, Spouse, Children, and HUF separate and spot missing nominees in one glance.',
  },
];

const FAQ_GROUPS: Array<'All' | FaqItem['group']> = [
  'All',
  'Basics',
  'Statements & Gmail',
  'Privacy & Safety',
  'Pricing & Plans',
  'Availability',
];

type QuotaScenario = 'trial' | 'pro-cancel' | 'april-reset';

const QUOTA_SCENARIOS: Record<
  QuotaScenario,
  { label: string; headline: string; detail: string; remaining: string }
> = {
  trial: {
    label: '90-Day Trial → Free Forever',
    headline: 'Trial imports never reduce your Free Forever allowance',
    detail:
      'Import as many monthly statements as you want during your 90-day free trial. When your trial ends on Day 91 with zero automatic charge, you still start Free Forever with all 3 yearly PDF imports available.',
    remaining: '3 / 3 free left',
  },
  'pro-cancel': {
    label: 'Pro Monthly → Cancel',
    headline: 'PDF imports on Pro count toward the same Financial Year',
    detail:
      'If you import 3 or more PDF statements while subscribed to Pro Monthly (₹20/month) and later cancel back to Free Forever in the same Indian Financial Year, free PDF imports pause until April 1. All your saved records stay 100% accessible.',
    remaining: 'Resets Apr 1',
  },
  'april-reset': {
    label: 'Every April 1 Reset',
    headline: 'Your 3 free PDF imports refresh every April 1',
    detail:
      'At the start of every new Indian Financial Year (April 1 – March 31), your Free Forever plan automatically gets 3 fresh manual PDF imports while every past record stays safely on your phone.',
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

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

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

      <Header onExploreApp={scrollToPreview} theme={theme} onToggleTheme={toggleTheme} />

      <main id="main" className="flex-1">
        {/* SECTION 1: HERO + INTERACTIVE ANDROID APP PREVIEW */}
        <section id="app-preview" className="pt-10 pb-14 lg:pt-16 lg:pb-20">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Column: Clear Family Purpose + 5-Tab App Tour */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-8">
                <div className="space-y-5">
                  <h1 className="text-[clamp(2.25rem,4.1vw,3.5rem)] font-extrabold tracking-[-0.035em] leading-[1.08] text-[#1C1917] dark:text-[#F4F7FB] max-w-2xl">
                    One private place to track your entire family’s wealth.
                  </h1>

                  <p className="text-base sm:text-[1.06rem] text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed max-w-[58ch]">
                    Bring together mutual funds, shares, gold, PPF, fixed deposits, property, and
                    loans for yourself, your spouse, children, and family HUF — safely stored right
                    on your Android phone with no cloud account and no ads.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <a
                      href="#pricing"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-[#F6EFE3] dark:text-[#07131F] bg-[#0C2338] hover:bg-[#143350] dark:bg-[#F5C14A] dark:hover:bg-[#EAB032] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
                    >
                      <span>See 90-Day Free Trial &amp; Plans</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <a
                      href="#sync-cas"
                      className="inline-flex items-center justify-center px-3 py-3 text-sm font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
                    >
                      See how statement import works
                    </a>
                  </div>
                </div>

                {/* 5-Tab Interactive Tour Controls */}
                <div className="pt-6 border-t border-[#E3D9C8] dark:border-[#1C374F] space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                      Five Simple App Screens
                    </h2>
                    <span className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                      Tap any screen below to try it live on the phone
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

              {/* Right Column: Live Interactive Android Preview */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <MobileAppSimulator
                  activeDestination={activeDest}
                  onDestinationChange={setActiveDest}
                />
              </div>
            </div>

            {/* Full-Width 4-Column Highlights Strip */}
            <div className="mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-5 bg-white dark:bg-[#0C1C2C] border border-[#E3D9C8] dark:border-[#1C374F] rounded-2xl p-6">
              <div className="space-y-1">
                <div className="font-mono tabular-nums text-2xl font-bold text-[#1C1917] dark:text-[#F5C14A]">
                  8 Categories
                </div>
                <div className="text-xs font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                  Everything Your Family Owns
                </div>
                <div className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                  Shares, Mutual Funds, Gold, PPF/FD, Property, Bank Cash &amp; Loans
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-mono tabular-nums text-2xl font-bold text-[#1C1917] dark:text-[#2DD4BF]">
                  5 Issuers
                </div>
                <div className="text-xs font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                  Automatic Statement Import
                </div>
                <div className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                  Reads CAMS, KFintech, NSDL, CDSL &amp; NPS statements right on your phone
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-mono tabular-nums text-2xl font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                  100% Private
                </div>
                <div className="text-xs font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                  Stored Only on Your Phone
                </div>
                <div className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                  No cloud account, no ads, and no access to your SMS or contacts
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
                  No card needed to try · Free Forever plan also included
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: FAMILY OWNERSHIP, NOMINEES & 8 ASSET CATEGORIES */}
        <section
          id="features"
          className="py-16 lg:py-24 bg-[#FBF8F2] dark:bg-[#0C1C2C] border-t border-[#E3D9C8] dark:border-[#1C374F]"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8 space-y-14">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] mb-2">
                01 · Built for Indian Families
              </p>
              <h2 className="text-[clamp(1.85rem,3vw,2.55rem)] font-extrabold tracking-[-0.03em] leading-tight text-[#1C1917] dark:text-[#F4F7FB]">
                Know who owns what, where it is kept, and whether a nominee is added.
              </h2>
              <p className="mt-3 text-base text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                Keep investments for yourself, your spouse, your children (with guardian details),
                and your family HUF neatly separated — while seeing the combined family total
                whenever you need it.
              </p>
            </div>

            {/* Asymmetric Two-Column Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <article className="lg:col-span-2 rounded-2xl bg-[#F6EFE3] dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-6 sm:p-7 space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                    Interactive Family &amp; Nominee View
                  </h3>
                  <p className="mt-1.5 text-sm text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                    Every mutual fund shows its clear fund house name, nominee status clearly flags{' '}
                    <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                      Registered
                    </span>{' '}
                    versus{' '}
                    <span className="font-semibold text-[#B87D0B] dark:text-[#F5C14A]">
                      Not Registered
                    </span>
                    , and missing purchase prices are honestly marked instead of guessed.
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
                    Official Daily Prices &amp; Honest Numbers
                  </h3>
                  <p className="text-sm text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                    Your share and mutual fund values stay up to date using official daily prices
                    from Indian markets — with accurate rupee totals and no made-up profits when an
                    old statement is missing your buy price.
                  </p>
                </div>

                <dl className="space-y-2.5 pt-5 border-t border-[#E3D9C8] dark:border-[#1C374F] text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#6B5E52] dark:text-[#9BB3C7]">Mutual Funds</dt>
                    <dd className="font-semibold">Official AMFI Daily NAV</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#6B5E52] dark:text-[#9BB3C7]">NSE Shares &amp; ETFs</dt>
                    <dd className="font-semibold">Official NSE Daily Close</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#6B5E52] dark:text-[#9BB3C7]">BSE Shares</dt>
                    <dd className="font-semibold">Official BSE Daily Close</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#6B5E52] dark:text-[#9BB3C7]">Missing Buy Price</dt>
                    <dd className="font-semibold text-[#B87D0B] dark:text-[#F5C14A]">
                      Marked Honestly (Never ₹0)
                    </dd>
                  </div>
                </dl>
              </article>
            </div>

            {/* All 8 Color-Coded Asset Categories */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                  All 8 Family Wealth Categories
                </h3>
                <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                  Simple, easy forms tailored to each investment — enter grams for gold, balance
                  for PPF, or EMI date for loans
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
                        <span className="text-[11px] font-medium text-[#6B5E52] dark:text-[#9BB3C7]">
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

        {/* SECTION 3: EASY STATEMENT IMPORT & OPTIONAL GMAIL SYNC */}
        <section
          id="sync-cas"
          className="py-16 lg:py-24 bg-[#F6EFE3] dark:bg-[#07131F] border-t border-[#E3D9C8] dark:border-[#1C374F]"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8 space-y-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-[#B87D0B] dark:text-[#F5C14A] mb-2">
                02 · Effortless Monthly Updates
              </p>
              <h2 className="text-[clamp(1.85rem,3vw,2.55rem)] font-extrabold tracking-[-0.03em] leading-tight text-[#1C1917] dark:text-[#F4F7FB]">
                Import monthly PDF statements without typing everything by hand.
              </h2>
              <p className="mt-3 text-base text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                Pick PDF statements from your phone or turn on optional read-only Gmail Sync to
                fetch them automatically. Every PDF opens privately inside your phone and never
                counts the same investment twice.
              </p>
            </div>

            {/* 4 Simple Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <article className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                  <span>Step 1 · Find</span>
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold">Manual PDF or Gmail Sync</h3>
                <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                  Select PDFs manually anytime, or connect one or more family Gmail accounts to
                  automatically check for your latest monthly statements (default last 3 months).
                </p>
              </article>

              <article className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#B87D0B] dark:text-[#F5C14A]">
                  <span>Step 2 · Unlock</span>
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold">Opens Right on Your Phone</h3>
                <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                  Unlocks password-protected statements privately on your phone using your saved
                  family PAN or NPS birth-date rule — nothing is ever uploaded to any server.
                </p>
              </article>

              <article className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                  <span>Step 3 · Clean Up</span>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold">Zero Double-Counting</h3>
                <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                  Importing both CAMS and CDSL won’t duplicate your mutual funds. Older statements
                  are automatically skipped, and messy registrar codes are cleaned up for easy reading.
                </p>
              </article>

              <article className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#B87D0B] dark:text-[#F5C14A]">
                  <span>Step 4 · Organise</span>
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold">Updated &amp; Nominees Checked</h3>
                <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                  Verified statements update each family member’s portfolio and nominee status
                  automatically. Only items needing your confirmation wait in a simple Review screen.
                </p>
              </article>
            </div>

            {/* 5 Official Senders Table */}
            <div className="rounded-2xl bg-white dark:bg-[#0C1C2C] border border-[#E3D9C8] dark:border-[#1C374F] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E3D9C8] dark:border-[#1C374F] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                    Gmail Sync Only Checks These 5 Official Statement Senders
                  </h3>
                  <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                    Read-only access — GrowUrDhan never looks at personal emails, bank OTPs, or
                    chats, and can never send or delete emails.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openLegalDoc('privacy')}
                  className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                >
                  Read Privacy &amp; Gmail Policy
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px] text-xs">
                  <thead>
                    <tr className="border-b border-[#E3D9C8] dark:border-[#1C374F] text-[#6B5E52] dark:text-[#9BB3C7]">
                      <th className="py-3 px-6 font-semibold">Official Issuer</th>
                      <th className="py-3 px-6 font-semibold">Official Email Address</th>
                      <th className="py-3 px-6 font-semibold">What It Covers</th>
                      <th className="py-3 px-6 font-semibold">How It Opens</th>
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

        {/* SECTION 4: PHONE-ONLY PRIVACY & SAFETY */}
        <section
          id="security"
          className="py-16 lg:py-24 bg-[#07131F] text-[#F4F7FB] border-t border-[#1C374F]"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between gap-8">
                <div>
                  <p className="text-xs font-semibold text-[#F5C14A] mb-2">
                    03 · Complete Family Privacy
                  </p>
                  <h2 className="text-[clamp(1.85rem,3.1vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-tight text-white">
                    Locked safely on your phone. Never uploaded to any cloud.
                  </h2>
                  <p className="mt-3 text-base text-[#9BB3C7] leading-relaxed max-w-[58ch]">
                    Your family’s wealth is deeply personal. GrowUrDhan keeps every PAN, folio,
                    loan, and rupee locked right inside your Android phone — with no GrowUrDhan
                    account, no cloud servers, and no sneaky phone permissions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#0C1C2C] border border-[#1C374F] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <KeyRound className="w-4 h-4 text-[#F5C14A]" />
                      <span>Bank-Grade Phone Lock</span>
                    </div>
                    <p className="text-xs text-[#9BB3C7] leading-relaxed">
                      All your family’s records are encrypted with your personal passcode and
                      protected by your Android phone’s built-in security hardware.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0C1C2C] border border-[#1C374F] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <ShieldAlert className="w-4 h-4 text-[#FB7185]" />
                      <span>Zero Cloud Backup by Design</span>
                    </div>
                    <p className="text-xs text-[#9BB3C7] leading-relaxed">
                      Because we never keep a copy in the cloud, nobody can hack a server to see
                      your wealth. Remember: uninstalling the app permanently removes your local
                      records.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0C1C2C] border border-[#1C374F] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <FileCheck2 className="w-4 h-4 text-[#2DD4BF]" />
                      <span>Printable Recovery Code PDF</span>
                    </div>
                    <p className="text-xs text-[#9BB3C7] leading-relaxed">
                      During setup, save or print your unique 12-character Recovery Code PDF to
                      keep in a safe home file in case you ever forget your passcode.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0C1C2C] border border-[#1C374F] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <Fingerprint className="w-4 h-4 text-[#F5C14A]" />
                      <span>Everyday Privacy Controls</span>
                    </div>
                    <p className="text-xs text-[#9BB3C7] leading-relaxed">
                      One-tap Hide Balances (<span className="font-mono">₹ •••••</span>) when
                      others are nearby, automatic lock timer, screenshot blocking, and optional
                      fingerprint or face unlock.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col">
                <div className="relative flex-1 min-h-[300px] rounded-2xl overflow-hidden border border-[#1C374F] bg-[#0C1C2C]">
                  {!vaultImgError ? (
                    <img
                      src={vaultStoneImg}
                      alt="Obsidian stone and brass architectural detail representing GrowUrDhan's private phone vault"
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
                    <p className="text-xs font-semibold text-[#F5C14A]">No Intrusive Permissions</p>
                    <p className="text-sm font-semibold text-white leading-snug">
                      Only uses the internet to fetch official NSE, BSE &amp; AMFI daily prices and
                      optional read-only Gmail Sync.
                    </p>
                    <p className="text-xs text-[#9BB3C7]">
                      No SMS Access · No Contacts · No Photos · No Location · No Cloud Copy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: SIMPLE, HONEST PRICING */}
        <section
          id="pricing"
          className="py-16 lg:py-24 bg-[#F6EFE3] dark:bg-[#07131F] border-t border-[#E3D9C8] dark:border-[#1C374F]"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8 space-y-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] mb-2">
                04 · Simple, Honest Pricing
              </p>
              <h2 className="text-[clamp(1.85rem,3vw,2.55rem)] font-extrabold tracking-[-0.03em] leading-tight text-[#1C1917] dark:text-[#F4F7FB]">
                90 days completely free. Then Free Forever or ₹20/month.
              </h2>
              <p className="mt-3 text-base text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                No ads, no fund commissions, and no surprise renewals. All your saved family
                records stay 100% accessible on Free Forever even if you never subscribe or cancel
                later.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Tier 1: 90-Day Free Trial */}
              <article className="rounded-2xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-6 sm:p-7 flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs font-medium text-[#6B5E52] dark:text-[#9BB3C7]">
                    First 90 days · No card or UPI mandate
                  </p>
                  <div className="mt-2 font-mono tabular-nums text-4xl font-extrabold text-[#1C1917] dark:text-[#F4F7FB]">
                    ₹0
                  </div>
                  <h3 className="mt-2 text-base font-bold">90-Day Free Trial</h3>
                  <p className="mt-2 text-sm text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                    Try every feature freely from Day 1. Moves smoothly to Free Forever on Day 91
                    with zero automatic charges.
                  </p>
                </div>
                <ul className="space-y-2 pt-5 border-t border-[#E3D9C8] dark:border-[#1C374F] text-sm text-[#1C1917] dark:text-[#F4F7FB]">
                  <li>Unlimited PDF statement imports</li>
                  <li>Trial imports don’t reduce your yearly free limit</li>
                  <li>Full automatic read-only Gmail Sync included</li>
                </ul>
              </article>

              {/* Tier 2: Free Forever */}
              <article className="rounded-2xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-6 sm:p-7 flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs font-medium text-[#6B5E52] dark:text-[#9BB3C7]">
                    No ads · Always accessible
                  </p>
                  <div className="mt-2 font-mono tabular-nums text-4xl font-extrabold text-[#1C1917] dark:text-[#F4F7FB]">
                    ₹0
                  </div>
                  <h3 className="mt-2 text-base font-bold">Free Forever</h3>
                  <p className="mt-2 text-sm text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                    Complete ad-free family wealth tracking with unlimited manual entries, simple
                    spreadsheet imports, and official daily market prices.
                  </p>
                </div>
                <ul className="space-y-2 pt-5 border-t border-[#E3D9C8] dark:border-[#1C374F] text-sm text-[#1C1917] dark:text-[#F4F7FB]">
                  <li>3 free manual PDF imports every Financial Year (Apr–Mar)</li>
                  <li>Unlimited manual holdings, Family profiles &amp; Goals</li>
                  <li className="text-[#6B5E52] dark:text-[#9BB3C7]">Automatic Gmail Sync not included</li>
                </ul>
              </article>

              {/* Tier 3: Pro Monthly */}
              <article className="rounded-2xl bg-white dark:bg-[#102536] border-2 border-[#0F766E] dark:border-[#F5C14A] p-6 sm:p-7 flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs font-bold text-[#0F766E] dark:text-[#F5C14A]">
                    Inclusive of taxes · Cancel anytime
                  </p>
                  <div className="mt-2 font-mono tabular-nums text-4xl font-extrabold text-[#1C1917] dark:text-[#F4F7FB]">
                    ₹20
                    <span className="text-sm font-sans font-normal text-[#6B5E52] dark:text-[#9BB3C7]">
                      {' '}
                      / month
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold">Pro Monthly</h3>
                  <p className="mt-2 text-sm text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                    Keep your whole family’s monthly statements updated effortlessly. Manage or
                    cancel anytime right inside Google Play.
                  </p>
                </div>
                <ul className="space-y-2 pt-5 border-t border-[#E3D9C8] dark:border-[#1C374F] text-sm text-[#1C1917] dark:text-[#F4F7FB]">
                  <li>Unlimited manual &amp; automatic PDF statement imports</li>
                  <li>Full family Gmail Statement Sync</li>
                  <li className="text-xs text-[#6B5E52] dark:text-[#9BB3C7] pt-1">
                    Billing as per Google Play policy
                  </li>
                </ul>
              </article>
            </div>

            {/* Interactive Financial Year PDF Allowance Explainer */}
            <div className="rounded-2xl bg-white dark:bg-[#0C1C2C] border border-[#E3D9C8] dark:border-[#1C374F] p-6 sm:p-7 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                    How the Yearly Free PDF Limit Works (April 1 – March 31)
                  </h3>
                  <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7] mt-1">
                    Clear, upfront rules with no hidden fine print.
                  </p>
                </div>

                <div
                  role="tablist"
                  aria-label="Inspect yearly PDF limit scenarios"
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
                <p className="text-xs font-semibold text-[#B87D0B] dark:text-[#F5C14A]">
                  Coming Soon for Android Phones (Android 8.0 and above)
                </p>
                <h3 className="text-base font-bold">Official Google Play Store Release</h3>
                <p className="text-sm text-[#6B5E52] dark:text-[#9BB3C7] max-w-2xl leading-relaxed">
                  GrowUrDhan will be available exclusively through the official Google Play Store.
                  We never share unofficial download files or ask for your email address on this
                  website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openLegalDoc('terms')}
                className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-[#1C1917] dark:text-[#F4F7FB] bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] hover:border-[#B87D0B] dark:hover:border-[#F5C14A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Read Terms &amp; Conditions
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 6: PLAIN-LANGUAGE GUIDES & FAQ */}
        <section
          id="guides"
          className="py-16 lg:py-24 bg-white dark:bg-[#0C1C2C] border-t border-[#E3D9C8] dark:border-[#1C374F]"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
                <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                  05 · Simple Family Guides
                </p>
                <h2 className="text-[clamp(1.85rem,3vw,2.5rem)] font-extrabold tracking-[-0.03em] leading-tight text-[#1C1917] dark:text-[#F4F7FB]">
                  Easy guides to help your family get started.
                </h2>
                <p className="text-base text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                  Short, jargon-free answers explaining how statement imports, optional Gmail Sync,
                  duplicate checks, nominees, and your Recovery Code work.
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
                  <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] mb-1.5">
                    Frequently Asked Questions
                  </p>
                  <h2 className="text-[clamp(1.65rem,2.6vw,2.2rem)] font-extrabold tracking-[-0.03em] text-[#1C1917] dark:text-[#F4F7FB]">
                    Clear answers before you install
                  </h2>
                </div>

                <div
                  role="tablist"
                  aria-label="Filter FAQ by topic"
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
                          <span className="text-xs font-medium text-[#6B5E52] dark:text-[#9BB3C7]">
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
                One private place on your Android phone to organise your entire family’s
                investments, loans, and nominees.
              </p>
              <div className="text-xs font-mono text-[#6B5E52] dark:text-[#9BB3C7]">
                www.growurdhan.com
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-[#6B5E52] dark:text-[#9BB3C7]">Product</h3>
              <ul className="space-y-2 text-sm font-medium text-[#1C1917] dark:text-[#F4F7FB]">
                <li>
                  <a href="#app-preview" className="hover:text-[#0F766E] dark:hover:text-[#F5C14A]">
                    Interactive App Preview
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#0F766E] dark:hover:text-[#F5C14A]">
                    Family &amp; 8 Asset Categories
                  </a>
                </li>
                <li>
                  <a href="#sync-cas" className="hover:text-[#0F766E] dark:hover:text-[#F5C14A]">
                    Statement Import &amp; Gmail Sync
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[#0F766E] dark:hover:text-[#F5C14A]">
                    90-Day Free Trial &amp; Pricing
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
                      {g.category}: {g.title.split(' ').slice(0, 5).join(' ')}…
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-[#6B5E52] dark:text-[#9BB3C7]">
                Legal &amp; Policies
              </h3>
              <ul className="space-y-2 text-sm font-medium text-[#1C1917] dark:text-[#F4F7FB]">
                <li>
                  <button
                    type="button"
                    onClick={() => openLegalDoc('terms')}
                    className="hover:text-[#0F766E] dark:hover:text-[#F5C14A] cursor-pointer"
                  >
                    Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openLegalDoc('privacy')}
                    className="hover:text-[#0F766E] dark:hover:text-[#F5C14A] cursor-pointer"
                  >
                    Privacy &amp; Gmail Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openLegalDoc('open-source')}
                    className="hover:text-[#0F766E] dark:hover:text-[#F5C14A] cursor-pointer"
                  >
                    Open-Source Notices
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openLegalDoc('delete-account')}
                    className="hover:text-[#0F766E] dark:hover:text-[#F5C14A] cursor-pointer"
                  >
                    Delete Account &amp; Phone Data
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E3D9C8] dark:border-[#1C374F] space-y-2 text-xs text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
            <p>
              <strong className="font-semibold text-[#1C1917] dark:text-[#F4F7FB]">
                Important Note:
              </strong>{' '}
              GrowUrDhan is a private family financial record-keeping app for adults aged 18+. It is
              not a SEBI-registered investment adviser, broker, bank, or Chartered Accountant /
              tax-filing service, and does not provide financial, investment, legal, or tax advice.
            </p>
            <p>
              All names, account numbers, and rupee amounts shown in the interactive preview are
              sample figures for demonstration only.
            </p>
          </div>
        </div>
      </footer>

      <DocumentModal guide={activeGuide} legal={activeLegal} onClose={closeModal} />
    </div>
  );
}
