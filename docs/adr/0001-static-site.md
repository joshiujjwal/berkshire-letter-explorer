# ADR 0001: Static site with checked-in JSON

## Decision

Use a plain static site with checked-in JSON data and no runtime upstream fetches.

## Consequences

The site is cheap to host on GitHub Pages and deterministic in CI. Source refreshes are deliberate editorial updates rather than user-time network calls.
