# Berkshire Letter Explorer Spec

## Overview

A static educational site that organizes Berkshire Hathaway shareholder letters with concise explainers and a sourced performance visualization.

## Requirements

- [x] Link every official letter listed at planning time, 1977-2024.
- [x] Preserve actual document URLs for 1998-2003 PDF landing pages.
- [x] Provide searchable year timeline and theme filter.
- [x] Plot Berkshire market-value returns against S&P 500 returns with dividends from $100 at the start of 1977.
- [ ] Complete editorial review: summary, three lessons, themes, and precise citations for every letter.
- [ ] Publish to GitHub Pages after GitHub auth and human review.

## Interface design

- `validateLetters(letters)`: validates and freezes letter records.
- `filterLetters(letters, filters)`: returns deterministic search/theme results.
- `validatePerformanceData(performance)`: enforces metric and row invariants.
- `calculateGrowthSeries(rows, initialValue)`: returns chart/table points.

## Test plan

Use Node tests for data contracts and return math. Add browser tests for hash year selection, filtering, chart/table rendering, and project-prefix loading.
