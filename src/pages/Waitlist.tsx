import { useState, type FormEvent } from 'react';

export function WaitlistPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      note: String(data.get('note') || ''),
      at: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('growurdhan.waitlist') || '[]') as unknown[];
    localStorage.setItem('growurdhan.waitlist', JSON.stringify([...existing, payload]));
    setSent(true);
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--accent)' }}>Early access</p>
      <h1 className="font-serif text-4xl font-extrabold mt-3">Join the waitlist</h1>
      <p className="mt-4 leading-relaxed" style={{ color: 'var(--muted)' }}>
        Kosha is being shaped with a small set of Indian households first.
        Tell us who the vault is for. We will not ask for holdings here.
      </p>

      {sent ? (
        <div className="card p-6 mt-8">
          <h2 className="font-serif text-2xl font-bold">Received on this device</h2>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
            Your note is saved in the browser until a mailer is connected. If you emailed
            us separately, that is the reliable path for now.
          </p>
        </div>
      ) : (
        <form className="card p-6 mt-8 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            <span className="font-medium">Name</span>
            <input
              name="name"
              required
              className="mt-1.5 w-full rounded-xl border px-3 py-2.5 bg-transparent"
              style={{ borderColor: 'var(--border)', background: 'var(--input)' }}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Email</span>
            <input
              name="email"
              type="email"
              required
              className="mt-1.5 w-full rounded-xl border px-3 py-2.5 bg-transparent"
              style={{ borderColor: 'var(--border)', background: 'var(--input)' }}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Who is this vault for?</span>
            <textarea
              name="note"
              rows={4}
              className="mt-1.5 w-full rounded-xl border px-3 py-2.5 bg-transparent"
              style={{ borderColor: 'var(--border)', background: 'var(--input)' }}
              placeholder="Family in two cities, NRI + India accounts, CAS-heavy household\u2026"
            />
          </label>
          <button
            type="submit"
            className="w-full font-bold px-5 py-3 rounded-xl"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
          >
            Request a place
          </button>
        </form>
      )}
    </div>
  );
}
