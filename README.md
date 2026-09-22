# GrowUrDhan website

Public site for **GrowUrDhan** — private, local-first wealth records for Indian families.

The product is **Kosha** (separate private repository). This repository is the brand and trust surface: positioning, product story, privacy promise, and waitlist.

## Principles this site should keep

- Do not look like a yield product, broker, or AMC.
- Privacy is the headline, not a footer link.
- Indian asset classes and CAS language, not a generic US robo-advisor template.
- Visual language matches Kosha: navy, gold, teal, Cinzel + Plus Jakarta Sans.

## Local

```bash
npm install
npm run dev
```

## Production URL

GitHub Pages: `https://shahvikask.github.io/growurdhan-web/`

Assets use base path `/growurdhan-web/`. Routing uses hash URLs so Pages works without a rewrite rule.

## Deploy

Push to `main`. The Actions workflow builds and publishes Pages. In the repository settings, set Pages source to **GitHub Actions**.
