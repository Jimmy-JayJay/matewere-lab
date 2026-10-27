# matewere-lab

The code behind [lab.matewere.dev](https://lab.matewere.dev).

This is where I put things before they are finished: prototypes, sketches, small tools, ideas I want to try in the open. Some will grow into proper projects on [matewere.dev](https://matewere.dev). Most will stay small, and a few will be abandoned, which is fine. Every experiment says how far along it is, so nobody mistakes a sketch for a product.

The first one is Nimby, the little rain cloud that lives on my site, rebuilt in code so the same drawing can animate on the web and render frame by frame in video.

## Adding an experiment

Make a folder at `src/app/<name>/` with a `page.tsx`, then add one entry to the list in `src/lib/experiments.ts` with a date, a one-line summary and a status (sketch, working, done or abandoned). The index page picks it up from there.

## Running it locally

```bash
pnpm install
pnpm dev
```

Jimmy Matewere, [matewere.dev](https://matewere.dev)
