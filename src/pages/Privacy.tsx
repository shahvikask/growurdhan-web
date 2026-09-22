const rules = [
  {
    title: 'Default boundary',
    items: [
      'No mandatory cloud database or portfolio API',
      'No server-side CAS processing',
      'No automatic upload of statement PDFs',
      'No third-party analytics that receives holdings',
      'No raw PAN in ordinary logs, URLs, or error reports',
    ],
  },
  {
    title: 'What may go online',
    items: [
      'Application updates',
      'Optional market / reference data you request (close prices, NAV)',
      'A future backup or sync feature only if you opt in and hold the key',
    ],
  },
  {
    title: 'Your rights on-device',
    items: [
      'View and export your records without an internet connection',
      'Lock the vault',
      'Mask amounts on screen',
      'Delete the local store the same way you delete any other local app data',
    ],
  },
];

export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--accent)' }}>Trust</p>
      <h1 className="font-serif text-4xl sm:text-5xl font-extrabold mt-3">Privacy is the product promise</h1>
      <p className="mt-4 leading-relaxed" style={{ color: 'var(--muted)' }}>
        GrowUrDhan\u2019s rule is simple: financial data should not leave the user\u2019s device.
        This page is the public version of that rule. The engineering documents in Kosha
        treat a privacy failure as a release-blocking defect.
      </p>
      <div className="space-y-5 mt-10">
        {rules.map((rule) => (
          <section key={rule.title} className="card p-6">
            <h2 className="font-serif text-2xl font-bold">{rule.title}</h2>
            <ul className="mt-4 space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
              {rule.items.map((item) => (
                <li key={item}>\u2022 {item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="text-xs mt-8" style={{ color: 'var(--subtle)' }}>
        This marketing site does not collect portfolio data. The waitlist form stores your note
        in this browser until a mailer is connected.
      </p>
    </div>
  );
}
