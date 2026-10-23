# M2PDF

**Your words. Clean Markdown. Ready-to-share PDFs.**

A minimal Markdown notebook that lives in your browser. Write without distractions, preview as you go, and export PDFs with selectable text. No account required.

## A small workspace for big ideas

- **Write your way** — switch between writing, split view, and preview.
- **Keep everything close** — organize notes in a collapsible sidebar with automatic local saving.
- **Share clean documents** — simple GitHub-style Markdown rendering and PDF export.
- **Stay in control** — notes stay in your browser, with no backend or analytics.

Notes are saved for the current browser and site. Clearing browser data removes them. Montserrat loads from Google Fonts; PDF export needs a connection to load its fonts.

## Run locally

```sh
pnpm install
pnpm dev
```

| Command             | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `pnpm build`        | Check TypeScript and build for production |
| `pnpm preview`      | Preview the production build              |
| `pnpm format`       | Format the project with Prettier          |
| `pnpm format:check` | Check formatting                          |

Built with Vite, Preact, TypeScript, TanStack Router, Tailwind CSS, shadcn/ui, and pdfmake.

Vercel routing is configured in `vercel.json`. For other static hosts, serve `dist/` and redirect application routes to `index.html` so note links work on refresh.
