import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  'On-device SQLite vault with a lock screen',
  'NSDL / CDSL CAS and CAMS / KFintech mutual-fund statements',
  'Holdings, accounts, documents, and family members as first-class screens',
  'Manual records for PPF, property, gold, loans, dividends, and EMIs',
  'Statement \u201cas of\u201d dates so you know how fresh the picture is',
  'Hide numbers when someone is looking over your shoulder',
  'Emergency sheet for the family \u2014 not just a dashboard',
  'Offline core: view, import, reconcile, search, export',
];

export function ProductPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--accent)' }}>Product</p>
      <h1 className="font-serif text-4xl sm:text-5xl font-extrabold mt-3">Kosha</h1>
      <p className="mt-4 text-lg max-w-2xl leading-relaxed" style={{ color: 'var(--muted)' }}>
        Kosha is GrowUrDhan\u2019s application: a private portfolio and net-worth tracker
        for Indian families. It treats CAS as a snapshot, not a pile of invented buy trades,
        and it refuses to guess missing rupees.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-10">
        {features.map((feature) => (
          <div key={feature} className="flex gap-3 card p-5">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--good)' }} />
            <p className="text-sm leading-relaxed">{feature}</p>
          </div>
        ))}
      </div>

      <div className="card card-hero p-8 mt-10">
        <h2 className="font-serif text-2xl font-bold">What Kosha is not</h2>
        <ul className="mt-4 space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
          <li>Not a high-yield investment scheme.</li>
          <li>Not a robo-advisor that moves your money.</li>
          <li>Not a brokerage, AMC, or bank.</li>
          <li>Not a place where your CAS is processed \u201cin the cloud for convenience.\u201d</li>
        </ul>
        <Link
          to="/waitlist"
          className="inline-flex mt-6 font-bold px-5 py-3 rounded-xl"
          style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
        >
          Request early access
        </Link>
      </div>
    </div>
  );
}
