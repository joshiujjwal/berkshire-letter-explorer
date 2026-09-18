# Berkshire Letter Explorer Context

## Commands

```bash
npm install
npm run lint
npm test
npm run validate:data
npm run check
npm run dev
```

## Directory map

- `site/`: only files intended for the public GitHub Pages artifact.
- `site/src/`: browser modules and shared pure functions.
- `site/data/`: checked-in JSON assets used at runtime.
- `scripts/`: local validation and advisory source audit scripts.
- `tests/`: Node behavior tests and future browser tests.
- `docs/`: spec and architecture decisions.

## Non-obvious invariants

- 1977-1997 are actual HTML letters.
- 1998-2003 are HTML landing pages; use their linked PDFs as `documentUrl`.
- 2004-2024 are direct PDFs in the current official index.
- Performance chart uses Berkshire per-share market value and S&P 500 with dividends.
- Start with $100 before applying the 1977 return; round only for display.
- Do not publish unreviewed summaries as final editorial content.

## Workflow

Read TODO.md, run tests first, make one red/green change at a time, review the diff, then update context if something durable changes.
