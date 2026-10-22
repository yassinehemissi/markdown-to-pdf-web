# Project rules

This application intentionally uses Vite, Preact, TypeScript, and TanStack Router. It is a browser-local Markdown notebook, not a Next.js application. Keep notes in localStorage; do not introduce a backend, credentials, or server infrastructure for this app.

- Use pnpm exclusively, including `pnpm test`, `pnpm test:watch`, `pnpm test:e2e`, and `pnpm build`. Keep the lockfile synchronized.
- Use Vitest and React Testing Library for unit/component tests. Use explicit Vitest imports, root `vitest.config.mts` and `vitest.setup.ts`, and colocated `*.test.ts(x)` files. Mock external boundaries; automated tests must not contact live services.
- Keep route-specific components, hooks, state, and utilities under the owning folder in `src/routes/`, using `(components)`, `(hooks)`, `(states)`, and `(utils)` folders. Keep shared UI in `src/components/`, shared types in `src/types/`, and shared constants in `src/constants/`. Only introduce shared contexts/hooks when there is actual reuse outside a route.
- Each component file exports one component. Keep types, context creation, providers, consumer hooks, state modules, and utilities in dedicated files. Each state file exports one state module.
- Use shadcn components for controls. Preserve the explicitly requested Montserrat typography, neutral buttons, text-only M2PDF wordmark, simple Markdown preview, and collapsible notes menu.
- Application links come from the aggregated `links` object under `src/constants/links/`. Route-specific non-link constants stay beside the route.
- Google Fonts is the only intentional runtime external dependency. Do not store downloaded fonts in this repository or send note content to external services. PDF text must remain selectable.
- Test changed user-visible behavior and public utility contracts. Keep browser checks as supplemental end-to-end coverage; `pnpm test` is the deterministic Vitest CI run.

The user's Next.js rules for server-only infrastructure, Server Actions, Route Handlers, caching, proxy middleware, and server authorization apply only if Next.js/server functionality is explicitly introduced later. They do not replace this project's local-storage requirement.
