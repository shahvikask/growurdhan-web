const steps = [
  {
    n: '01',
    title: 'Create a vault on this device',
    body: 'Kosha opens an encrypted local store. There is no mandatory account in someone else\u2019s datacentre.',
  },
  {
    n: '02',
    title: 'Bring official statements',
    body: 'Drop a CAS or RTA PDF. A local parser detects the issuer, shows PDF total versus parsed total, and waits for your confirmation.',
  },
  {
    n: '03',
    title: 'Reconcile, do not double-count',
    body: 'Holdings in a statement are snapshots. Re-importing January and then February keeps February. The ledger is append-only; corrections are compensating events.',
  },
  {
    n: '04',
    title: 'Add what statements miss',
    body: 'Property, physical gold, PPF, loans, and family-owned accounts can be recorded by hand so net worth is the household, not just demat.',
  },
  {
    n: '05',
    title: 'Read the household',
    body: 'Switch between one member and the whole family. Export your data. Lock the vault when you walk away.',
  },
];

export function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--accent)' }}>Method</p>
      <h1 className="font-serif text-4xl sm:text-5xl font-extrabold mt-3">How Kosha treats your records</h1>
      <p className="mt-4 leading-relaxed" style={{ color: 'var(--muted)' }}>
        Financial facts come from documents and explicit entries. Deterministic parsers first.
        AI is only a bounded fallback, never an unchecked source of rupees.
      </p>
      <ol className="mt-10 space-y-5">
        {steps.map((step) => (
          <li key={step.n} className="card p-6">
            <div className="text-xs font-bold tracking-[0.2em]" style={{ color: 'var(--accent)' }}>{step.n}</div>
            <h2 className="font-serif text-2xl font-bold mt-2">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
