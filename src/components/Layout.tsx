import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { BrandMark } from './BrandMark';

const links = [
  { to: '/product', label: 'Kosha' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/family', label: 'Family' },
  { to: '/privacy', label: 'Privacy' },
];

export function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{
          background: 'color-mix(in srgb, var(--chrome) 92%, transparent)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" onClick={() => setOpen(false)} aria-label="GrowUrDhan home">
            <BrandMark showTagline />
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100')}
                style={{ color: 'var(--text)' }}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/waitlist"
              className="hidden sm:inline-flex text-sm font-bold px-4 py-2 rounded-xl"
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
            >
              Join waitlist
            </Link>
            <button
              type="button"
              className="md:hidden p-2 rounded-xl border"
              style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t px-4 py-4 space-y-3" style={{ borderColor: 'var(--border)', background: 'var(--chrome)' }}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-medium"
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/waitlist"
              onClick={() => setOpen(false)}
              className="inline-flex text-sm font-bold px-4 py-2 rounded-xl"
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
            >
              Join waitlist
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t mt-16" style={{ borderColor: 'var(--border)', background: 'var(--chrome)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <BrandMark />
            <p className="text-sm max-w-md leading-relaxed" style={{ color: 'var(--muted)' }}>
              GrowUrDhan is building Kosha \u2014 a local-first vault for Indian family wealth.
              Holdings, statements, and family records stay on your device.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--subtle)' }}>
              Product
            </div>
            <div className="space-y-2 text-sm">
              <Link to="/product" className="block opacity-80 hover:opacity-100">Kosha</Link>
              <Link to="/how-it-works" className="block opacity-80 hover:opacity-100">How it works</Link>
              <Link to="/family" className="block opacity-80 hover:opacity-100">Family records</Link>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--subtle)' }}>
              Trust
            </div>
            <div className="space-y-2 text-sm">
              <Link to="/privacy" className="block opacity-80 hover:opacity-100">Privacy</Link>
              <Link to="/waitlist" className="block opacity-80 hover:opacity-100">Waitlist</Link>
              <a href="https://github.com/shahvikask/growurdhan-web" className="block opacity-80 hover:opacity-100">
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 text-xs leading-relaxed" style={{ color: 'var(--subtle)' }}>
          GrowUrDhan is a portfolio and records tool, not a SEBI-registered investment adviser, broker, or bank.
          Nothing on this site is advice to buy or sell securities. \u00a9 {new Date().getFullYear()} GrowUrDhan.
        </div>
      </footer>
    </div>
  );
}
