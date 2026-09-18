# Agent Instructions

## Setup

```bash
npm install
npm run check
npm run dev
```

## Style

Use plain JavaScript ES modules, `const` by default, named exports, early returns, and no runtime dependencies unless explicitly approved. Keep data-loading errors explicit. Never insert fetched HTML as markup.

## Testing

Use red/green vertical slices. Tests should exercise public module interfaces and user-visible behavior, not private implementation details. Keep live upstream checks out of deterministic CI.

## Source rules

Do not commit full Berkshire letters, PDFs, extracted text, credentials, caches, or generated scratch artifacts. Store only original explainers, structured source links, citations, and return data.

## PR rules

Include test output, manual browser evidence, and source-review notes for changed letter content. Review AI-written PR descriptions before submitting.
