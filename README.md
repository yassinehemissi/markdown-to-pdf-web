# M2PDF

A simple, entirely local Markdown notebook built with Vite, Preact, TypeScript, TanStack Router, Tailwind CSS, and shadcn/ui components using Radix through Preact compat.

```sh
pnpm install
pnpm dev
```

`pnpm build` checks TypeScript and builds `dist/`; `pnpm preview` serves the production build. Use pnpm exclusively.

- Full-window **Write**, **Split**, and **Preview** modes.
- Collapsible notes sidebar; new notes are named in a modal with a blurred backdrop.
- Automatic localStorage saving, editable note names, and confirmed deletion.
- Plain GitHub-style Markdown preview and PDF download with selectable, searchable text and automatic page breaks. PDFs contain only the rendered Markdown, without extra titles or footers.
- Montserrat is loaded from Google Fonts throughout the app and in PDF exports. No font files are stored in the project; loading fonts requires a connection to Google Fonts. PDF generation runs in the browser using pdfmake with explicit Markdown layout for heading rules, code padding, quote borders, lists, and tables.
- No account, backend, or analytics. Note content stays in the browser; Google Fonts requests carry no note content.

Notes belong to the current browser and origin. Download PDF copies before clearing browser data. Existing notes from the earlier Folio version are retained and copied to the M2PDF storage key. Remote embedded media is excluded to keep Markdown previews local; normal links remain usable.

Routes use `/notes/:noteId`. Static hosting must fall back to `index.html`; Vite handles this during development and preview.

To run tests:

```sh
pnpm exec playwright install chromium
pnpm test
pnpm test:watch
pnpm test:e2e
```

`pnpm test` runs Vitest with React Testing Library in headless Chromium, using the same Preact compatibility aliases as the app. Unit and component tests are colocated with their code; configuration and shared setup live in `vitest.config.mts` and `vitest.setup.ts`. PDF export is deliberately mocked in component tests. The supplemental Playwright checks mock Google Fonts and reject other external HTTP requests. They cover naming, persistence, all three views, deletion, mobile layouts, migration, and selectable text in multi-page PDFs. `pdfjs-dist` is used only to verify exports.

Applicable project conventions are recorded in `AGENTS.md`. Route-specific components, hooks, state, types, constants, and utilities live in `src/routes/workspace/`; shared shadcn controls live in `src/components/ui/`, and internal links are centralized in `src/constants/links/`.
