import {
  EyeOff,
  Fingerprint,
  IndianRupee,
  Landmark,
  Lock,
  ShieldCheck,
  Smartphone,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const pillars = [
  {
    icon: Lock,
    title: 'Local first',
    body: 'The ledger lives on your device. There is no mandatory cloud portfolio database.',
  },
  {
    icon: Fingerprint,
    title: 'CAS stays home',
    body: 'NSDL, CDSL, CAMS and KFintech PDFs are parsed on-device. They are never uploaded by default.',
  },
  {
    icon: IndianRupee,
    title: 'Paise, not floats',
    body: 'Money and quantity are stored with explicit scale. JavaScript floats are not the source of truth.',
  },
  {
    icon: Users,
    title: 'Built for families',
    body: 'Whole-family and per-member views, emergency sheet, and records that outlive a single login.',
  },
];

const assets = [
  { label: 'Shares', color: '#38bdf8' },
  { label: 'Mutual funds', color: '#818cf8' },
  { label: 'Gold', color: '#f5c14a' },
  { label: 'Govt / small savings', color: '#34d399' },
  { label: 'Property', color: '#c084fc' },
  { label: 'Bank', color: '#22d3ee' },
  { label: 'Special accounts', color: '#f472b6' },
  { label: 'Loans', color: '#fb7185' },
];

export function HomePage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 lg:pt-24">
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border mb-6" style={{ borderColor: 'var(--border)', background: 'var(--chip)', color: 'var(--accent)' }}>
          <ShieldCheck className="w-3.5 h-3.5" />
          Private by default \u00b7 India-first asset classes
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] max-w-3xl">
          Grow your dhan without giving it away.
        </h1>
        <p className="mt-6 text-lg max-w-2xl leading-relaxed" style={{ color: 'var(--muted)' }}>
          Kosha is GrowUrDhan\u2019s local-first vault for Indian families \u2014 net worth, holdings,
          CAS statements, and family records with paise-level arithmetic. Your money data
          does not leave the machine unless you choose otherwise.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/waitlist"
            className="inline-flex items-center justify-center font-bold px-5 py-3 rounded-xl"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
          >
            Join the private waitlist
          </Link>
          <Link
            to="/product"
            className="inline-flex items-center justify-center font-semibold px-5 py-3 rounded-xl border"
            style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
          >
            See Kosha
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="card card-hero p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--subtle)' }}>
                Family vault preview
              </div>
              <div className="font-serif text-2xl mt-1">Whole family</div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border" style={{ borderColor: 'var(--border)' }}>
              <EyeOff className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              Numbers can be hidden
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { k: 'Net worth', v: '\u20b9 1,84,32,610.47', n: 'As of statement date' },
              { k: 'Invested', v: '\u20b9 1,21,08,400.00', n: 'Ledger, not guessed' },
              { k: 'Unrealised', v: '\u20b9 18,44,210.47', n: 'When prices are available' },
            ].map((item) => (
              <div key={item.k} className="rounded-2xl p-4 border" style={{ borderColor: 'var(--border)', background: 'var(--input)' }}>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{item.k}</div>
                <div className="text-xl font-bold mt-1 tabular-nums">{item.v}</div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--subtle)' }}>{item.n}</div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-5" style={{ color: 'var(--subtle)' }}>
            Illustrative figures only. Kosha never fabricates missing source values.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 grid md:grid-cols-2 gap-5">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="card p-6">
            <pillar.icon className="w-6 h-6 mb-4" style={{ color: 'var(--accent)' }} />
            <h2 className="font-serif text-xl font-bold">{pillar.title}</h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{pillar.body}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="font-serif text-3xl font-bold">Indian money, not a US clone</h2>
        <p className="mt-3 max-w-2xl" style={{ color: 'var(--muted)' }}>
          Demat, folios, PPF, EPF, NPS, SGB, property, gold, and loans sit in one family picture \u2014
          identified by ISIN whenever the source provides one.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {assets.map((asset) => (
            <span
              key={asset.label}
              className="text-sm px-3 py-1.5 rounded-full border"
              style={{ borderColor: 'var(--border)', background: 'var(--chip)' }}
            >
              <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle" style={{ background: asset.color }} />
              {asset.label}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 grid md:grid-cols-3 gap-5">
        {[
          { icon: Landmark, title: 'Statements you already have', body: 'Import official CAS snapshots. Re-import is idempotent. The latest period wins.' },
          { icon: Smartphone, title: 'Web now, Android next', body: 'The product rules live outside the UI so the same ledger can ship on phone later.' },
          { icon: ShieldCheck, title: 'Privacy is a release gate', body: 'No raw PAN in ordinary logs. No third-party analytics on portfolio data.' },
        ].map((item) => (
          <div key={item.title} className="card p-6">
            <item.icon className="w-5 h-5 mb-3" style={{ color: 'var(--accent-2)' }} />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
