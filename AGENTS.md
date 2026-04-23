# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, Cursor, Copilot, and
others) when working in this repository. It is loaded into agent context automatically — keep
it concise.

## Overview

`flow-playground` is the browser-based Cadence IDE served at play.flow.com. It is a React 17
+ TypeScript single-page app (bundled with webpack 5) that embeds the Monaco editor and the
Cadence Language Server (Go, compiled to WASM, loaded from the npm package
`@onflow/cadence-language-server`). The frontend talks to a separate backend,
[`onflow/flow-playground-api`](https://github.com/onflow/flow-playground-api), over GraphQL
via Apollo Client. This repo contains only the frontend.

## Build and Test Commands

Node 18.x is required (`package.json` `engines.node`). Use `npm` — `package-lock.json` is the
lockfile.

Setup:
- `npm install` — install dependencies.
- Rename `.env.local` to `.env` before first run (README Quick Start). `PLAYGROUND_API`
  defaults to `http://localhost:8080`.

Run:
- `npm run start` — webpack-dev-server on port 3000 (see `webpack.config.js` `devServer`).
- `npm run start-docker` — start the Playground API container
  (`gcr.io/dl-flow/playground-api:latest`) on port 8080. The README uses the raw
  `docker run` form instead.
- `npm run build` — production webpack build to `dist/`.

Quality gates (CI runs `make ci` = `clean install format types build test`):
- `npm run lint` — ESLint over `src` (`.js,.jsx,.ts,.tsx`).
- `npm run types` — `tsc` type-check (no emit; `tsconfig.json` has `noEmit: true`).
- `npm run format:check:app` — Prettier check on `src/**/*.{js,jsx,ts,tsx,css}`.
- `npm run format:app` — Prettier write on `src`.
- `npm run test` — Jest (sole test file today: `src/util/parser.test.ts`).
- `npm run ci:check` — format:check + lint + types (pre-push sanity).

GraphQL codegen:
- `npm run graphql:codegen` — regenerate `src/api/apollo/generated/graphql.tsx` from the live
  API schema at `http://localhost:8080/query` plus `src/api/apollo/local.graphql`
  (see `codegen.yml`). Run after editing `local.graphql` or when the backend schema changes;
  the API container must be running.

Make wraps the same npm scripts (`make install|lint|types|format|build|test|ci|clean`). CI
(`.github/workflows/ci.yml`) runs `make ci` on Node 18.

## Architecture

Top-level frontend source lives under `src/`:

- `src/index.tsx` + `src/App.tsx` — app entry; `src/wasm_exec.js` is the Go WASM runtime
  shim loaded alongside `index.tsx` (see `webpack.config.js` `entry`).
- `src/pages/` — route-level pages (`index.tsx`, `404.tsx`) mounted via `@reach/router`.
- `src/containers/Playground/` — the main editor container (`EditorLayout.tsx`, `index.tsx`).
- `src/components/` — presentational components (Editor panels, TopNav, LeftSidebar, Readme,
  popups, buttons, avatars).
- `src/providers/Project/` — project state (`projectDefault.ts`, `projectHooks.ts`,
  `projectMutator.ts`); wraps Apollo CRUD.
- `src/providers/CadenceChecker/` — bridges the Cadence Language Server into React context.
- `src/api/apollo/` — Apollo client (`client.ts`), `mutations.ts`, `queries.ts`,
  `resolvers.ts`, local schema (`local.graphql`), and generated types
  (`generated/graphql.tsx`).
- `src/util/` — Cadence Monaco integration (`cadence.ts`), language server/client
  (`language-server.ts`, `language-client.ts`), URL handling (`url.ts`), localStorage
  (`localstorage.ts`, `storage.ts`), analytics (`google-analytics.ts`, `mixpanel.ts`),
  parser (`parser.ts` + `parser.test.ts`).
- `src/layout/`, `src/hooks/`, `src/styles/`, `src/templates/`, `src/theme.ts`,
  `src/globalStyles.ts` — layout, hooks, Theme UI theme, global styles, and Handlebars
  templates (`.hbs`, compiled via `handlebars-loader` in `webpack.config.js`).

Key dependencies: `react@17`, `monaco-editor@0.34`, `monaco-languageclient@0.18`,
`@onflow/cadence-language-server@1.0.0-preview.39`, `apollo-client@2.6`,
`@apollo/react-hooks@3`, `@emotion/react`, `theme-ui`, `styled-components`, `@reach/router`,
`@sentry/react`, `mixpanel-browser`, `react-ga4`.

TypeScript path aliases (`tsconfig.json` + mirrored in `webpack.config.js` `resolve.alias`):
`pages/*`, `providers/*`, `components/*`, `containers/*`, `api/*`, `layout/*`, `util/*`,
`types/*`. Import with the alias, not relative paths crossing these roots.

Deployment: static build to `dist/` served via Nginx (`Dockerfile`, `nginx.conf`) or
Vercel (`vercel.json` rewrites all non-file paths to `/`). See `RUNBOOK.md`.

## Conventions and Gotchas

- **Default branch is `staging`, not `main`/`master`.** Open PRs against `staging`
  (CONTRIBUTING.md). Production deploys come from a staging -> `production` PR (RUNBOOK.md).
- **Cadence WASM must be copied to the bundle.** `webpack.config.js` copies
  `node_modules/@onflow/cadence-language-server/dist/cadence-language-server.wasm` into the
  output; breaking that copy rule breaks the editor.
- **Do not hand-edit `src/api/apollo/generated/graphql.tsx`.** It is regenerated by
  `npm run graphql:codegen` from the backend schema + `src/api/apollo/local.graphql`.
- **GraphQL codegen requires the API running.** `codegen.yml` points at
  `http://localhost:8080/query`; start the Docker API first.
- **Project sessions rely on cookies + localStorage.** The `flow-playground` cookie binds a
  browser session to a server-side project id; without it, saves fork instead of overwriting
  (RUNBOOK.md "User Sessions & Project Forking"). Do not remove cookie/localStorage logic in
  `src/providers/Project/projectMutator.ts` or `src/util/url.ts` without understanding this.
- **Styling: Theme UI theme values first, then `@emotion`.** Prefer values from `src/theme.ts`;
  avoid inline styles (CONTRIBUTING.md "Theme and CSS Styleguide").
- **React style: stateless function components, TypeScript types (not `PropTypes`),
  imports ordered React → local modules → components → styles → constants**
  (CONTRIBUTING.md).
- **ESLint is strict on React + a11y.** `.eslintrc` enables `plugin:react/recommended`,
  `plugin:react-hooks/recommended`, `plugin:jsx-a11y/recommended`, and
  `@typescript-eslint/no-explicit-any` as warn — don't silence with broad disables.
- **`tsconfig.json` has `noUnusedLocals`, `noUnusedParameters`, `noImplicitAny` on.**
  `npm run types` will fail on dead locals/params; prefix intentionally unused params with
  `_`.
- **Squash-merge PRs** (README "Contributing").
- **CODEOWNERS**: `@sideninja @MrDSGC` own everything; expect their review on PRs.

## Files Not to Modify

- `src/api/apollo/generated/**` — regenerated by `npm run graphql:codegen`.
- `src/wasm_exec.js` — vendored Go WASM runtime shim; replace only by updating the upstream
  Cadence Language Server package.
- `package-lock.json` — npm-managed; don't edit by hand.
- `public/fonts/**`, `public/*.svg`, `public/*.png` — static assets shipped as-is by the
  `CopyPlugin` rule in `webpack.config.js`.
