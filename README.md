# M2PDF

A simple, entirely local Markdown notebook built with Vite, Preact, TypeScript, TanStack Router, Tailwind CSS, and shadcn/ui components using Radix through Preact compat.

```sh
pnpm install
pnpm dev
```

`npm run dev` also works once dependencies are installed. `npm run build` checks TypeScript and builds `dist/`; `npm run preview` serves the production build.

- Full-window **Write**, **Split**, and **Preview** modes.
- Collapsible notes sidebar; new notes are named in a modal with a blurred backdrop.
- Automatic localStorage saving, editable note names, and confirmed deletion.
- Plain GitHub-style Markdown preview and PDF download with selectable, searchable text and automatic page breaks. PDFs contain only the rendered Markdown, without extra titles or footers.
- Montserrat is loaded from Google Fonts throughout the app and in PDF exports. No font files are stored in the project; loading fonts requires a connection to Google Fonts. PDF generation runs in the browser using bundled pdfmake and html-to-pdfmake, loaded only when exporting.
- No account, backend, or analytics. Note content stays in the browser; Google Fonts requests carry no note content.

Notes belong to the current browser and origin. Download Markdown copies before clearing browser data. Existing notes from the earlier Folio version are retained and copied to the M2PDF storage key. Remote embedded media is excluded to keep Markdown previews local; normal links remain usable.

Routes use `/notes/:noteId`. Static hosting must fall back to `index.html`; Vite handles this during development and preview.

To run browser checks:

```sh
pnpm exec playwright install chromium
pnpm test
```

The checks cover naming, persistence, all three views, imports, deletion, mobile layouts, existing-data migration, and extraction of real text from a multi-page exported PDF. `pdfjs-dist` is a development dependency used only to verify exports.
