# backend-challenge

## Setup

```
pnpm install
```

## Run

```
pnpm test
```

Runs a small (5 items) and a large (50 items) randomly-generated batch of entities through the Lambda pipeline, one item at a time, and prints a pass/fail summary for each batch. Run just one size with `pnpm test:small` or `pnpm test:large`.

## Docs

- [Queue](./docs/queue.md) — the standalone mock SQS helper
- [GLOSSARY.md](./GLOSSARY.md) — terminology
- [docs/adr](./docs/adr) — design decisions
