import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandWordmark } from './BrandMark';

interface HeaderProps {
  onExploreApp: () => void;
}

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#sync-cas', label: 'Sync & CAS' },
  { href: '#security', label: 'Security' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#guides', label: 'Guides' },
];

export function Header({ onExploreApp }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/92 dark:bg-[#0C1C2C]/92 backdrop-blur-md border-b border-[#E3D9C8] dark:border-[#1C374F]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-Line Brand Wordmark */}
        <a
          href="#top"
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F766E] dark:focus-visible:outline-[#F5C14A] rounded-md whitespace-nowrap shrink-0"
          aria-label="GrowUrDhan Home"
        >
          <BrandWordmark />
        </a>

        {/* Zone 2: 5 Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B5E52] dark:text-[#9BB3C7]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 hover:text-[#1C1917] dark:hover:text-[#F4F7FB] underline-offset-4 hover:underline decoration-[#B87D0B] dark:decoration-[#F5C14A] transition-colors duration-150 rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onExploreApp}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#F6EFE3] dark:text-[#07131F] bg-[#0C2338] hover:bg-[#143350] dark:bg-[#F5C14A] dark:hover:bg-[#EAB032] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer"
          >
            Explore the App
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#E3D9C8] dark:border-[#1C374F] text-[#1C1917] dark:text-[#F4F7FB] hover:bg-[#FBF8F2] dark:hover:bg-[#102536] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#E3D9C8] dark:border-[#1C374F] bg-white dark:bg-[#0C1C2C] px-5 py-4">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-sm font-medium text-[#1C1917] dark:text-[#F4F7FB] hover:bg-[#FBF8F2] dark:hover:bg-[#102536] rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onExploreApp();
              }}
              className="mt-2 w-full py-3 px-4 text-sm font-semibold text-[#F6EFE3] dark:text-[#07131F] bg-[#0C2338] dark:bg-[#F5C14A] rounded-lg transition-colors cursor-pointer"
            >
              Explore the App
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
