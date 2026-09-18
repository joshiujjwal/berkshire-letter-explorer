# Berkshire Letter Explorer

🚧 Early Development

A simple public GitHub Pages site for exploring Berkshire Hathaway shareholder letters, concise lessons, and a sourced market-return comparison from 1977 onward.

## Stack

- Plain HTML, CSS, and JavaScript ES modules
- Checked-in JSON data assets
- Node built-in test runner
- GitHub Pages static deployment

## Getting started

```bash
npm install
npm run check
npm run dev
```

Open <http://127.0.0.1:4173/>.

## Source boundaries

This project links to Berkshire Hathaway's official archive. It stores original summaries and structured citations, not full letters or PDFs. It is unaffiliated with Berkshire Hathaway and is not financial advice.

## Contributing

Use red/green TDD in vertical slices: write one failing behavior test, implement the minimum passing code, then review the diff. PRs need test output, source-review notes for changed letter content, and manual evidence for browser changes. Keep PRs focused and do not publish unreviewed generated content.
