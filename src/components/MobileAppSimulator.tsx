import { useMemo, useState } from 'react';
import {
  BarChart3,
  Briefcase,
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Home,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Unlock,
  Users,
  X,
} from 'lucide-react';
import { BrandMark } from './BrandMark';
import {
  ASSET_CATEGORIES,
  FAMILY_MEMBERS,
  formatInrFull,
  formatInrLakhs,
  OFFICIAL_SENDERS,
  SAMPLE_GOALS,
  SYNTHETIC_HOLDINGS,
  UPCOMING_SCHEDULE,
  type AssetCategoryId,
  type OwnerLens,
  type SyntheticHolding,
} from '../data/growurdhanData';

export type AppDestination = 'home' | 'portfolio' | 'statements' | 'insights' | 'family';

interface MobileAppSimulatorProps {
  activeDestination: AppDestination;
  onDestinationChange: (dest: AppDestination) => void;
}

export function MobileAppSimulator({
  activeDestination,
  onDestinationChange,
}: MobileAppSimulatorProps) {
  const [ownerLens, setOwnerLens] = useState<OwnerLens>('all');
  const [ownerMenuOpen, setOwnerMenuOpen] = useState(false);
  const [hideMode, setHideMode] = useState(false);
  const [vaultLocked, setVaultLocked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | AssetCategoryId>('ALL');
  const [selectedHolding, setSelectedHolding] = useState<SyntheticHolding | null>(null);
  const [dedupRan, setDedupRan] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const memberMap = useMemo(() => new Map(FAMILY_MEMBERS.map((m) => [m.id, m])), []);
  const categoryMap = useMemo(() => new Map(ASSET_CATEGORIES.map((c) => [c.id, c])), []);

  const scopedHoldings = useMemo(
    () =>
      SYNTHETIC_HOLDINGS.filter((h) => ownerLens === 'all' || h.ownerId === ownerLens),
    [ownerLens]
  );

  const summary = useMemo(() => {
    const assets = scopedHoldings
      .filter((h) => h.category !== 'LIABILITY')
      .reduce((s, h) => s + h.currentLakhs, 0);
    const liabilities = scopedHoldings
      .filter((h) => h.category === 'LIABILITY')
      .reduce((s, h) => s + h.currentLakhs, 0);
    const knownCostCount = scopedHoldings.filter(
      (h) => h.category !== 'LIABILITY' && h.costBasis === 'KNOWN'
    ).length;
    const unknownCostCount = scopedHoldings.filter(
      (h) => h.category !== 'LIABILITY' && h.costBasis === 'UNKNOWN'
    ).length;
    return {
      assets,
      liabilities,
      netWorth: assets - liabilities,
      knownCostCount,
      unknownCostCount,
    };
  }, [scopedHoldings]);

  // Order populated categories first, empty categories muted after (matches Android PortfolioScreen)
  const orderedCategories = useMemo(() => {
    const counts = new Map<AssetCategoryId, number>();
    for (const h of scopedHoldings) {
      counts.set(h.category, (counts.get(h.category) ?? 0) + 1);
    }
    return [...ASSET_CATEGORIES]
      .map((cat) => ({ ...cat, count: counts.get(cat.id) ?? 0 }))
      .sort((a, b) => {
        if (a.count > 0 && b.count === 0) return -1;
        if (a.count === 0 && b.count > 0) return 1;
        return b.count - a.count;
      });
  }, [scopedHoldings]);

  const visiblePortfolioHoldings = useMemo(() => {
    if (selectedCategory === 'ALL') return scopedHoldings;
    return scopedHoldings.filter((h) => h.category === selectedCategory);
  }, [scopedHoldings, selectedCategory]);

  const activeOwnerLabel =
    ownerLens === 'all' ? 'Whole Family' : memberMap.get(ownerLens)?.displayName ?? 'Whole Family';

  const categoryTotals = useMemo(() => {
    const map = new Map<AssetCategoryId, number>();
    for (const h of scopedHoldings) {
      if (h.category === 'LIABILITY') continue;
      map.set(h.category, (map.get(h.category) ?? 0) + h.currentLakhs);
    }
    return ASSET_CATEGORIES.filter((c) => c.id !== 'LIABILITY' && (map.get(c.id) ?? 0) > 0)
      .map((c) => ({
        ...c,
        lakhs: map.get(c.id) ?? 0,
        pct: Math.round(((map.get(c.id) ?? 0) / Math.max(summary.assets, 1)) * 100),
      }))
      .sort((a, b) => b.lakhs - a.lakhs);
  }, [scopedHoldings, summary.assets]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Android Phone Frame */}
      <div className="relative w-full max-w-[348px] rounded-[2.6rem] bg-gradient-to-b from-[#1B2B3C] via-[#0E1A26] to-[#071019] p-[9px] shadow-[0_28px_70px_-18px_rgba(7,19,31,0.55)] ring-1 ring-[#1C374F]">
        {/* Inner Phone Screen */}
        <div className="relative flex flex-col h-[640px] w-full rounded-[2.05rem] bg-[#F6EFE3] dark:bg-[#07131F] overflow-hidden text-[#1C1917] dark:text-[#F4F7FB] border border-black/15 dark:border-[#1C374F]">
          {/* Phone Status Bar */}
          <div className="flex items-center justify-between px-5 pt-2.5 pb-1.5 bg-white dark:bg-[#0C1C2C] text-[11px] font-semibold text-[#6B5E52] dark:text-[#9BB3C7] shrink-0 select-none">
            <span className="font-mono tabular-nums">9:41</span>
            <span
              aria-hidden="true"
              className="w-3.5 h-3.5 rounded-full bg-[#07131F] ring-1 ring-[#1C374F]"
            />
            <span className="font-mono text-[10px]">5G · 96%</span>
          </div>

          {/* App Top Bar: Mark · Family Switcher · Hide Balances · Lock */}
          <div className="relative flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#0C1C2C] border-b border-[#E3D9C8] dark:border-[#1C374F] shrink-0 z-20">
            <BrandMark size={24} />

            {/* Family Member Switcher */}
            <div className="relative flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setOwnerMenuOpen((v) => !v)}
                aria-expanded={ownerMenuOpen}
                className="w-full flex items-center justify-between gap-1 px-2.5 py-1.5 rounded-lg bg-[#FBF8F2] dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] text-xs font-semibold text-[#1C1917] dark:text-[#F4F7FB] cursor-pointer"
              >
                <span className="truncate">{activeOwnerLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#6B5E52] dark:text-[#9BB3C7] shrink-0" />
              </button>

              {ownerMenuOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] shadow-xl py-1 z-30">
                  <button
                    type="button"
                    onClick={() => {
                      setOwnerLens('all');
                      setOwnerMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-[#FBF8F2] dark:hover:bg-[#0C1C2C] cursor-pointer ${
                      ownerLens === 'all'
                        ? 'text-[#0F766E] dark:text-[#F5C14A] font-semibold'
                        : 'text-[#1C1917] dark:text-[#F4F7FB]'
                    }`}
                  >
                    <span>Whole Family (4)</span>
                    {ownerLens === 'all' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {FAMILY_MEMBERS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setOwnerLens(m.id);
                        setOwnerMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-[#FBF8F2] dark:hover:bg-[#0C1C2C] cursor-pointer ${
                        ownerLens === m.id
                          ? 'text-[#0F766E] dark:text-[#F5C14A] font-semibold'
                          : 'text-[#1C1917] dark:text-[#F4F7FB]'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: m.accentHex }}
                        />
                        <span className="truncate">{m.displayName}</span>
                      </span>
                      {ownerLens === m.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hide Balances Toggle */}
            <button
              type="button"
              onClick={() => setHideMode((h) => !h)}
              aria-pressed={hideMode}
              title={hideMode ? 'Show amounts' : 'Hide amounts for privacy'}
              aria-label={hideMode ? 'Show amounts' : 'Hide amounts'}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                hideMode
                  ? 'bg-[#0C2338] dark:bg-[#F5C14A] text-[#F6EFE3] dark:text-[#07131F] border-transparent'
                  : 'bg-[#FBF8F2] dark:bg-[#102536] border-[#E3D9C8] dark:border-[#1C374F] text-[#6B5E52] dark:text-[#9BB3C7]'
              }`}
            >
              {hideMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>

            {/* Instant Lock Button */}
            <button
              type="button"
              onClick={() => setVaultLocked(true)}
              title="Lock App Now"
              aria-label="Lock App Now"
              className="w-8 h-8 rounded-lg bg-[#FBF8F2] dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] text-[#6B5E52] dark:text-[#9BB3C7] hover:text-[#1C1917] dark:hover:text-[#F4F7FB] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sample Data Banner */}
          <div className="px-3.5 py-1.5 bg-[#EFE6D6] dark:bg-[#0C1C2C] border-b border-[#E3D9C8] dark:border-[#1C374F] flex items-center justify-between text-[10px] font-medium text-[#6B5E52] dark:text-[#9BB3C7] shrink-0">
            <span>Sample Family Preview</span>
            <span className="font-semibold text-[#B87D0B] dark:text-[#F5C14A]">Phone-Only</span>
          </div>

          {/* Scrollable Content Viewport */}
          <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
            {/* TAB 1: HOME */}
            {activeDestination === 'home' && (
              <>
                <div className="rounded-xl bg-[#0C2338] dark:bg-[#102536] text-[#F4F7FB] p-4 border border-[#1C374F]">
                  <div className="flex items-center justify-between text-[11px] text-[#9BB3C7]">
                    <span>{activeOwnerLabel} · Net Worth</span>
                    <span className="text-[#2DD4BF] font-medium">Updated Daily</span>
                  </div>

                  <div className="mt-1.5 font-mono tabular-nums text-[1.45rem] font-bold tracking-tight text-white">
                    {formatInrFull(summary.netWorth, hideMode)}
                  </div>

                  <div className="mt-1 text-[10px] text-[#9BB3C7]">
                    Assets {formatInrLakhs(summary.assets, hideMode)} − Loans{' '}
                    {formatInrLakhs(summary.liabilities, hideMode)}
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <div className="text-[#9BB3C7] text-[10px]">Purchase Price</div>
                      <div className="font-semibold text-[#F4F7FB] mt-0.5">
                        {summary.knownCostCount} Known · {summary.unknownCostCount} Not Shown
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#9BB3C7] text-[10px]">Official Prices</div>
                      <div className="font-semibold text-[#F5C14A] mt-0.5">NSE · BSE · AMFI</div>
                    </div>
                  </div>
                </div>

                {/* Home Equity Highlight */}
                {(ownerLens === 'all' || ownerLens === 'self') && (
                  <div className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Your True Home Equity</span>
                      <span className="font-mono tabular-nums text-[#0F766E] dark:text-[#2DD4BF]">
                        {formatInrLakhs(84.0 - 36.2, hideMode)}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                      Pune Home ({formatInrLakhs(84.0, hideMode)}) − Linked Home Loan (
                      {formatInrLakhs(36.2, hideMode)})
                    </div>
                  </div>
                )}

                {/* Asset Mix Bar */}
                <div className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Where Your Wealth Is</span>
                    <button
                      type="button"
                      onClick={() => onDestinationChange('portfolio')}
                      className="text-[11px] font-semibold text-[#0F766E] dark:text-[#2DD4BF] cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden flex bg-[#EFE6D6] dark:bg-[#07131F]">
                    {categoryTotals.map((c) => (
                      <div
                        key={c.id}
                        style={{ width: `${c.pct}%`, backgroundColor: c.colorHex }}
                        title={`${c.label}: ${c.pct}%`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
                    {categoryTotals.slice(0, 4).map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5 truncate text-[#6B5E52] dark:text-[#9BB3C7]">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: c.colorHex }}
                          />
                          <span className="truncate">{c.shortLabel}</span>
                        </span>
                        <span className="font-mono tabular-nums font-semibold">{c.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onDestinationChange('statements')}
                    className="text-left p-3 rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] hover:border-[#B87D0B] dark:hover:border-[#F5C14A] transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold">Import Statements</div>
                    <div className="mt-0.5 text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                      PDF or Gmail Sync
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDestinationChange('family')}
                    className="text-left p-3 rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] hover:border-[#B87D0B] dark:hover:border-[#F5C14A] transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold">Check Nominees</div>
                    <div className="mt-0.5 text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                      Every family account
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* TAB 2: PORTFOLIO */}
            {activeDestination === 'portfolio' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">Portfolio</div>
                    <div className="text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                      Tap any investment to see full details
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-[#0F766E] dark:text-[#2DD4BF] flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Daily Prices
                  </span>
                </div>

                {/* Color-coded Category Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      selectedCategory === 'ALL'
                        ? 'bg-[#0C2338] dark:bg-[#F5C14A] text-white dark:text-[#07131F]'
                        : 'bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] text-[#6B5E52] dark:text-[#9BB3C7]'
                    }`}
                  >
                    All ({scopedHoldings.length})
                  </button>
                  {orderedCategories.map((cat) => {
                    const active = selectedCategory === cat.id;
                    const empty = cat.count === 0;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap shrink-0 cursor-pointer border transition-colors ${
                          active
                            ? 'bg-[#0C2338] dark:bg-[#1C374F] text-white border-transparent'
                            : empty
                            ? 'bg-transparent border-[#E3D9C8]/60 dark:border-[#1C374F]/50 text-[#6B5E52]/50 dark:text-[#9BB3C7]/40'
                            : 'bg-white dark:bg-[#102536] border-[#E3D9C8] dark:border-[#1C374F] text-[#1C1917] dark:text-[#F4F7FB]'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: empty ? '#64748B' : cat.colorHex,
                            opacity: empty ? 0.45 : 1,
                          }}
                        />
                        <span>
                          {cat.shortLabel} ({cat.count})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Holdings List */}
                <div className="space-y-2">
                  {visiblePortfolioHoldings.length === 0 ? (
                    <div className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-4 text-center text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
                      No items in this category for {activeOwnerLabel}.
                    </div>
                  ) : (
                    visiblePortfolioHoldings.map((h) => {
                      const cat = categoryMap.get(h.category);
                      const owner = memberMap.get(h.ownerId);
                      const isLiability = h.category === 'LIABILITY';
                      return (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => setSelectedHolding(h)}
                          className="w-full text-left rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] hover:border-[#B87D0B] dark:hover:border-[#F5C14A] p-2.5 flex items-start justify-between gap-2 transition-colors cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: cat?.colorHex }}
                              />
                              <span className="text-xs font-semibold truncate">{h.name}</span>
                            </div>
                            <div className="mt-0.5 text-[10px] text-[#6B5E52] dark:text-[#9BB3C7] truncate">
                              {owner?.displayName} · {h.custodyLabel}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-[10px]">
                              <span className="text-[#6B5E52] dark:text-[#9BB3C7]">
                                {h.priceSource}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span
                                className={
                                  h.costBasis === 'UNKNOWN'
                                    ? 'font-semibold text-[#B87D0B] dark:text-[#F5C14A]'
                                    : 'text-[#0F766E] dark:text-[#2DD4BF]'
                                }
                              >
                                {h.costBasis === 'UNKNOWN' ? 'Cost Not Shown' : 'Cost Saved'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div
                              className={`font-mono tabular-nums text-xs font-bold ${
                                isLiability
                                  ? 'text-[#B91C1C] dark:text-[#E05252]'
                                  : 'text-[#1C1917] dark:text-[#F4F7FB]'
                              }`}
                            >
                              {isLiability ? '-' : ''}
                              {formatInrLakhs(h.currentLakhs, hideMode)}
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-[#6B5E52] dark:text-[#9BB3C7] ml-auto mt-1" />
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </>
            )}

            {/* TAB 3: STATEMENTS & GMAIL SYNC */}
            {activeDestination === 'statements' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">Statements &amp; Sync</div>
                    <div className="text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                      Reads PDFs privately on your phone
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                    Read-only Gmail
                  </span>
                </div>

                {/* Interactive Duplicate Protection Demo */}
                <div className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">Auto Duplicate Check</span>
                    <button
                      type="button"
                      onClick={() => setDedupRan((v) => !v)}
                      className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-[#0C2338] dark:bg-[#F5C14A] text-white dark:text-[#07131F] cursor-pointer whitespace-nowrap"
                    >
                      {dedupRan ? 'Reset Demo' : 'Try CAMS + CDSL'}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
                    See what happens if you import an older CAMS file after your latest CDSL
                    statement for the same mutual fund.
                  </p>

                  {dedupRan && (
                    <div className="rounded-lg bg-[#FBF8F2] dark:bg-[#07131F] border border-[#E3D9C8] dark:border-[#1C374F] p-2.5 space-y-1.5 text-[10px]">
                      <div className="flex items-center justify-between font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                        <span>Older copy skipped · No duplicates</span>
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[#6B5E52] dark:text-[#9BB3C7]">
                        Kept your latest Oct 2026 balance and neatly grouped it under{' '}
                        <span className="font-semibold text-[#1C1917] dark:text-[#F4F7FB]">
                          Nippon India Mutual Fund
                        </span>
                        .
                      </div>
                    </div>
                  )}
                </div>

                {/* 5 Official Senders */}
                <div className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Mail className="w-3.5 h-3.5 text-[#B87D0B] dark:text-[#F5C14A]" />
                    <span>Only 5 Official Statement Senders</span>
                  </div>
                  <div className="space-y-1 pt-0.5">
                    {OFFICIAL_SENDERS.map((s) => (
                      <div
                        key={s.email}
                        className="flex items-center justify-between gap-2 text-[10px]"
                      >
                        <span className="font-semibold">{s.issuer}</span>
                        <span className="font-mono text-[#6B5E52] dark:text-[#9BB3C7] truncate">
                          {s.email}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Imports */}
                <div className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Recent Statement Imports</span>
                    <button
                      type="button"
                      onClick={() => setHistoryExpanded((e) => !e)}
                      className="text-[10px] font-semibold text-[#0F766E] dark:text-[#2DD4BF] cursor-pointer"
                    >
                      {historyExpanded ? 'Show latest 1' : 'Show all (3)'}
                    </button>
                  </div>
                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex items-center justify-between">
                      <span>Oct 2026 · CDSL Statement</span>
                      <span className="text-[#0F766E] dark:text-[#2DD4BF] font-semibold">
                        Added
                      </span>
                    </div>
                    {historyExpanded && (
                      <>
                        <div className="flex items-center justify-between pt-1 border-t border-[#E3D9C8]/60 dark:border-[#1C374F]">
                          <span>Oct 2026 · Protean NPS</span>
                          <span className="text-[#0F766E] dark:text-[#2DD4BF] font-semibold">
                            Added
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-[#E3D9C8]/60 dark:border-[#1C374F]">
                          <span>Sep 2026 · CAMS Statement</span>
                          <span className="text-[#6B5E52] dark:text-[#9BB3C7] font-medium">
                            Skipped (Older)
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* TAB 4: INSIGHTS & GOALS */}
            {activeDestination === 'insights' && (
              <>
                <div>
                  <div className="text-sm font-bold">Goals &amp; Upcoming Dates</div>
                  <div className="text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                    Track family milestones, EMIs &amp; interest credits
                  </div>
                </div>

                {/* Goals */}
                <div className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-3 space-y-2.5">
                  <div className="text-xs font-semibold">Family Goals</div>
                  {SAMPLE_GOALS.map((g) => {
                    const pct = Math.min(100, Math.round((g.currentLakhs / g.targetLakhs) * 100));
                    return (
                      <div key={g.id} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold truncate">{g.title}</span>
                          <span className="font-mono tabular-nums text-[10px] text-[#0F766E] dark:text-[#2DD4BF]">
                            {pct}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#EFE6D6] dark:bg-[#07131F] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#0F766E] dark:bg-[#2DD4BF]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                          <span>
                            {g.ownerLabel} · By {g.horizon}
                          </span>
                          <span className="font-mono tabular-nums">
                            {formatInrLakhs(g.currentLakhs, hideMode)} /{' '}
                            {formatInrLakhs(g.targetLakhs, hideMode)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Upcoming EMI & Interest Schedule */}
                <div className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-3 space-y-2">
                  <div className="text-xs font-semibold">Upcoming EMIs &amp; Interest</div>
                  {UPCOMING_SCHEDULE.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-start justify-between gap-2 pt-1.5 first:pt-0 border-t first:border-t-0 border-[#E3D9C8]/60 dark:border-[#1C374F]"
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold truncate">{ev.title}</div>
                        <div className="text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                          {ev.date} · {ev.detail}
                        </div>
                      </div>
                      <span
                        className={`font-mono tabular-nums text-[11px] font-bold shrink-0 ${
                          ev.type === 'EMI'
                            ? 'text-[#B91C1C] dark:text-[#E05252]'
                            : 'text-[#0F766E] dark:text-[#2DD4BF]'
                        }`}
                      >
                        {hideMode ? '₹ ••••' : ev.amountLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* TAB 5: FAMILY & NOMINEES */}
            {activeDestination === 'family' && (
              <>
                <div>
                  <div className="text-sm font-bold">Family &amp; Nominees</div>
                  <div className="text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                    Self · Spouse · Children · Family HUF
                  </div>
                </div>

                <div className="space-y-2">
                  {FAMILY_MEMBERS.map((m) => {
                    const memberAssets = SYNTHETIC_HOLDINGS.filter(
                      (h) => h.ownerId === m.id && h.category !== 'LIABILITY'
                    ).reduce((s, h) => s + h.currentLakhs, 0);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setOwnerLens(ownerLens === m.id ? 'all' : m.id)}
                        className={`w-full text-left rounded-xl p-2.5 border transition-colors cursor-pointer ${
                          ownerLens === m.id
                            ? 'bg-[#FBF8F2] dark:bg-[#102536] border-[#0F766E] dark:border-[#F5C14A]'
                            : 'bg-white dark:bg-[#102536] border-[#E3D9C8] dark:border-[#1C374F]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-7 h-7 rounded-lg text-[#07131F] text-xs font-extrabold flex items-center justify-center shrink-0"
                              style={{ backgroundColor: m.accentHex }}
                            >
                              {m.initial}
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">{m.displayName}</div>
                              <div className="text-[10px] text-[#6B5E52] dark:text-[#9BB3C7] truncate">
                                {m.relationship}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-mono tabular-nums text-xs font-bold">
                              {formatInrLakhs(memberAssets, hideMode)}
                            </div>
                            <div className="text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                              Gmail Sync: {m.gmailSyncEnabled ? 'On' : 'Off'}
                            </div>
                          </div>
                        </div>
                        <div className="mt-1.5 pt-1.5 border-t border-[#E3D9C8]/60 dark:border-[#1C374F] flex items-center justify-between text-[10px] font-mono text-[#6B5E52] dark:text-[#9BB3C7]">
                          <span>PAN {hideMode ? '••••••••••' : m.panMasked}</span>
                          {m.casId && <span>CAS {hideMode ? '••••••••' : m.casId}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Nominee Check List */}
                <div className="rounded-xl bg-white dark:bg-[#102536] border border-[#E3D9C8] dark:border-[#1C374F] p-3 space-y-1.5">
                  <div className="text-xs font-semibold">Nominee Status Check</div>
                  {SYNTHETIC_HOLDINGS.slice(0, 4).map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between gap-2 text-[10px] pt-1 border-t border-[#E3D9C8]/50 dark:border-[#1C374F]"
                    >
                      <span className="truncate font-medium">{h.custodyLabel}</span>
                      <span
                        className={`font-semibold shrink-0 ${
                          h.nomineeStatus === 'REGISTERED'
                            ? 'text-[#0F766E] dark:text-[#2DD4BF]'
                            : 'text-[#B87D0B] dark:text-[#F5C14A]'
                        }`}
                      >
                        {h.nomineeStatus === 'REGISTERED' ? 'Registered' : 'Not Registered'}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 5-Tab Bottom Navigation Bar */}
          <nav
            aria-label="GrowUrDhan 5 app tabs"
            className="grid grid-cols-5 bg-white dark:bg-[#0C1C2C] border-t border-[#E3D9C8] dark:border-[#1C374F] px-1 py-1.5 shrink-0"
          >
            {(
              [
                { id: 'home', label: 'Home', Icon: Home },
                { id: 'portfolio', label: 'Portfolio', Icon: Briefcase },
                { id: 'statements', label: 'Statements', Icon: FileSpreadsheet },
                { id: 'insights', label: 'Insights', Icon: BarChart3 },
                { id: 'family', label: 'Family', Icon: Users },
              ] as const
            ).map(({ id, label, Icon }) => {
              const active = activeDestination === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onDestinationChange(id)}
                  className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    active
                      ? 'text-[#0C2338] dark:text-[#F5C14A] font-bold'
                      : 'text-[#6B5E52] dark:text-[#9BB3C7] hover:text-[#1C1917] dark:hover:text-[#F4F7FB]'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={active ? 2.3 : 1.8} />
                  <span className="text-[10px] leading-none">{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Holding Detail Overlay inside Phone */}
          {selectedHolding && (
            <div className="absolute inset-0 z-30 bg-[#07131F]/70 flex items-end">
              <div className="w-full rounded-t-2xl bg-white dark:bg-[#102536] border-t border-[#E3D9C8] dark:border-[#1C374F] p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                      {selectedHolding.subcategory} · {selectedHolding.priceSource}
                    </div>
                    <div className="text-xs font-bold leading-snug mt-0.5">
                      {selectedHolding.name}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedHolding(null)}
                    aria-label="Close investment details"
                    className="w-7 h-7 rounded-lg hover:bg-[#FBF8F2] dark:hover:bg-[#0C1C2C] flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#FBF8F2] dark:bg-[#07131F] rounded-xl p-2.5 border border-[#E3D9C8] dark:border-[#1C374F]">
                  <div>
                    <div className="text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                      Current Value
                    </div>
                    <div className="font-mono tabular-nums font-bold">
                      {formatInrLakhs(selectedHolding.currentLakhs, hideMode)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                      Purchase Price
                    </div>
                    <div className="font-mono tabular-nums font-bold">
                      {selectedHolding.costBasis === 'UNKNOWN'
                        ? 'Not Shown'
                        : formatInrLakhs(selectedHolding.investedLakhs ?? 0, hideMode)}
                    </div>
                  </div>
                </div>

                <dl className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#6B5E52] dark:text-[#9BB3C7]">Held With</dt>
                    <dd className="font-semibold text-right">{selectedHolding.custodyLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#6B5E52] dark:text-[#9BB3C7]">Reference</dt>
                    <dd className="font-mono text-right">{selectedHolding.folioOrRef}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#6B5E52] dark:text-[#9BB3C7]">Nominee Status</dt>
                    <dd
                      className={`font-semibold ${
                        selectedHolding.nomineeStatus === 'REGISTERED'
                          ? 'text-[#0F766E] dark:text-[#2DD4BF]'
                          : 'text-[#B87D0B] dark:text-[#F5C14A]'
                      }`}
                    >
                      {selectedHolding.nomineeStatus === 'REGISTERED'
                        ? 'Registered'
                        : 'Not Registered'}
                    </dd>
                  </div>
                  {selectedHolding.emiDueDay && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-[#6B5E52] dark:text-[#9BB3C7]">Monthly EMI Date</dt>
                      <dd className="font-semibold">Day {selectedHolding.emiDueDay} of every month</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}

          {/* Instant App Lock Screen */}
          {vaultLocked && (
            <div className="absolute inset-0 z-40 bg-[#07131F] text-[#F4F7FB] flex flex-col items-center justify-center p-6 text-center space-y-4">
              <BrandMark size={48} />
              <div className="space-y-1">
                <div className="text-base font-bold">App Locked</div>
                <p className="text-xs text-[#9BB3C7] leading-relaxed">
                  All family balances, PAN numbers, and temporary Gmail access are cleared from
                  screen memory.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVaultLocked(false)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F5C14A] hover:bg-[#EAB032] text-[#07131F] text-xs font-bold transition-colors cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock Sample Preview</span>
              </button>
              <div className="text-[10px] text-[#9BB3C7]">
                Locked privately on your phone · Zero cloud copy
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-[#6B5E52] dark:text-[#9BB3C7] text-center max-w-[348px]">
        Interactive app preview · Try switching family members, hiding balances, locking the app,
        or testing duplicate protection
      </p>
    </div>
  );
}
