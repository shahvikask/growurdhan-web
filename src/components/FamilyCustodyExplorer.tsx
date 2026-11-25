import { useState } from 'react';
import {
  ASSET_CATEGORIES,
  FAMILY_MEMBERS,
  formatInrLakhs,
  SYNTHETIC_HOLDINGS,
  type OwnerLens,
} from '../data/growurdhanData';

export function FamilyCustodyExplorer() {
  const [ownerFilter, setOwnerFilter] = useState<OwnerLens>('all');

  const memberMap = new Map(FAMILY_MEMBERS.map((m) => [m.id, m]));
  const catMap = new Map(ASSET_CATEGORIES.map((c) => [c.id, c]));

  const rows = SYNTHETIC_HOLDINGS.filter(
    (h) => ownerFilter === 'all' || h.ownerId === ownerFilter
  );

  const totalAssets = rows
    .filter((r) => r.category !== 'LIABILITY')
    .reduce((sum, r) => sum + r.currentLakhs, 0);
  const totalLoans = rows
    .filter((r) => r.category === 'LIABILITY')
    .reduce((sum, r) => sum + r.currentLakhs, 0);
  const registeredCount = rows.filter((r) => r.nomineeStatus === 'REGISTERED').length;

  return (
    <div className="space-y-4">
      {/* Interactive Owner Lens Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setOwnerFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            ownerFilter === 'all'
              ? 'bg-[#0C2338] dark:bg-[#F5C14A] text-white dark:text-[#07131F]'
              : 'bg-white dark:bg-[#0C1C2C] border border-[#E3D9C8] dark:border-[#1C374F] text-[#6B5E52] dark:text-[#9BB3C7] hover:text-[#1C1917] dark:hover:text-[#F4F7FB]'
          }`}
        >
          Whole Family
        </button>
        {FAMILY_MEMBERS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setOwnerFilter(m.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              ownerFilter === m.id
                ? 'bg-[#0C2338] dark:bg-[#F5C14A] text-white dark:text-[#07131F]'
                : 'bg-white dark:bg-[#0C1C2C] border border-[#E3D9C8] dark:border-[#1C374F] text-[#6B5E52] dark:text-[#9BB3C7] hover:text-[#1C1917] dark:hover:text-[#F4F7FB]'
            }`}
          >
            {m.displayName}
          </button>
        ))}
      </div>

      {/* Ownership & Nominee Map Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E3D9C8] dark:border-[#1C374F] bg-white dark:bg-[#0C1C2C]">
        <table className="w-full text-left border-collapse min-w-[560px]">
          <thead>
            <tr className="border-b border-[#E3D9C8] dark:border-[#1C374F] text-[11px] font-semibold text-[#6B5E52] dark:text-[#9BB3C7]">
              <th className="py-2.5 px-3.5">Investment &amp; Owner</th>
              <th className="py-2.5 px-3.5">Where It Is Held</th>
              <th className="py-2.5 px-3.5">Nominee Status</th>
              <th className="py-2.5 px-3.5 text-right">Current Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3D9C8]/70 dark:divide-[#1C374F] text-xs">
            {rows.slice(0, 6).map((h) => {
              const owner = memberMap.get(h.ownerId);
              const cat = catMap.get(h.category);
              const isLiability = h.category === 'LIABILITY';
              return (
                <tr key={h.id} className="hover:bg-[#FBF8F2] dark:hover:bg-[#102536]/60">
                  <td className="py-2.5 px-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat?.colorHex }}
                      />
                      <span className="font-semibold text-[#1C1917] dark:text-[#F4F7FB]">
                        {h.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6B5E52] dark:text-[#9BB3C7] pl-4">
                      {owner?.displayName}
                      {owner?.guardianName ? ` · Guardian: ${owner.guardianName}` : ''}
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div className="font-medium text-[#1C1917] dark:text-[#F4F7FB]">
                      {h.custodyLabel}
                    </div>
                    <div className="font-mono text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                      {h.folioOrRef}
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span
                      className={`font-semibold ${
                        h.nomineeStatus === 'REGISTERED'
                          ? 'text-[#0F766E] dark:text-[#2DD4BF]'
                          : 'text-[#B87D0B] dark:text-[#F5C14A]'
                      }`}
                    >
                      {h.nomineeStatus === 'REGISTERED' ? 'Registered' : 'Not Registered'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right">
                    <div
                      className={`font-mono tabular-nums font-bold ${
                        isLiability
                          ? 'text-[#B91C1C] dark:text-[#E05252]'
                          : 'text-[#1C1917] dark:text-[#F4F7FB]'
                      }`}
                    >
                      {isLiability ? '-' : ''}
                      {formatInrLakhs(h.currentLakhs)}
                    </div>
                    <div className="text-[10px] text-[#6B5E52] dark:text-[#9BB3C7]">
                      {h.costBasis === 'UNKNOWN' ? 'Purchase Price Not Shown' : h.priceSource}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Reconciled Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white dark:bg-[#0C1C2C] border border-[#E3D9C8] dark:border-[#1C374F] px-4 py-3 text-xs">
        <div className="text-[#6B5E52] dark:text-[#9BB3C7]">
          <span className="font-semibold text-[#1C1917] dark:text-[#F4F7FB]">
            {registeredCount}/{rows.length}
          </span>{' '}
          items have a nominee registered · Assets{' '}
          <span className="font-mono tabular-nums font-semibold text-[#1C1917] dark:text-[#F4F7FB]">
            {formatInrLakhs(totalAssets)}
          </span>{' '}
          − Loans{' '}
          <span className="font-mono tabular-nums font-semibold text-[#B91C1C] dark:text-[#E05252]">
            {formatInrLakhs(totalLoans)}
          </span>
        </div>
        <div className="font-mono tabular-nums text-sm font-bold text-[#0F766E] dark:text-[#2DD4BF]">
          Net Worth {formatInrLakhs(totalAssets - totalLoans)}
        </div>
      </div>
    </div>
  );
}
