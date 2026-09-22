export function FamilyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--accent)' }}>Household</p>
      <h1 className="font-serif text-4xl sm:text-5xl font-extrabold mt-3 max-w-3xl">
        Wealth is rarely one PAN and one demat.
      </h1>
      <p className="mt-4 text-lg max-w-2xl leading-relaxed" style={{ color: 'var(--muted)' }}>
        Indian households split money across spouses, parents, children, and jointly held property.
        Kosha models people, accounts, and instruments separately so the family picture stays honest.
      </p>

      <div className="grid md:grid-cols-3 gap-5 mt-10">
        {[
          {
            title: 'Whole family or one person',
            body: 'See consolidated net worth, or isolate a member without mixing their folios into someone else\u2019s ledger.',
          },
          {
            title: 'Emergency sheet',
            body: 'A calm list of what exists and where \u2014 for the person who would have to act if you could not.',
          },
          {
            title: 'Records that can be handed on',
            body: 'Statements, as-of dates, and provenance travel with the vault. Guesswork does not.',
          },
        ].map((card) => (
          <article key={card.title} className="card p-6">
            <h2 className="font-serif text-xl font-bold">{card.title}</h2>
            <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--muted)' }}>{card.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
