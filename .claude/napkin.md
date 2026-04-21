# Napkin

## Corrections
| Date | Source | What Went Wrong | What To Do Instead |
|------|--------|----------------|-------------------|

## User Preferences
- Verify old fork fixes by porting their tests into this upstream checkout and only carry runtime fixes that the tests still prove necessary.

## Patterns That Work
- Use targeted TryIt regression tests as the spec before deciding whether a fork-only patch still matters upstream.
- Porting only the old regression tests into `packages/elements-core/src/components/TryIt/TryIt.spec.tsx` quickly exposed the still-missing runtime fixes in `BinaryBody`, `useTextRequestBodyState`, `TryIt`, and `exampleGeneration`.
- In this repo, `persistAtom` is currently only used for `TryIt_securitySchemeValues`, so swapping it from `localStorage` to `sessionStorage` is narrowly scoped to auth persistence.
- For TryIt request URLs, bracketed IPv6 hosts are safest when we validate with the platform `URL` parser and build the final request URL through `new URL(relativePath, normalizedServerUrl)` instead of raw string concatenation.
- For function-valued web-component props, preserve property values set before `connectedCallback` and do not round-trip them through HTML attributes; otherwise custom callbacks like `tryItFetcher` get wiped out on mount.
- True CSS isolation for `<elements-api />` needs Shadow DOM or an iframe; the current light-DOM custom element still pulls in global Mosaic CSS and theme variables.
- A separate web-component-only build script is cleaner here than changing the main package build, because the React package still wants the old global stylesheet and legacy `web-components.min.js` path.
- For the scoped web-component stylesheet, a dedicated host class like `.stoplight` is a safer anchor than the `elements-api` tag, because React and nested Stoplight components can opt into the same scope without coupling selectors to one custom element name.

## Patterns That Don't Work
- Assuming a fork-only fix is still needed without checking the current upstream code and tests.
- Running Jest for this repo inside the sandbox can fail at report-writing time because `jest-junit` wants to create `test-results/`; use elevated filesystem access when you need a clean test run in this checkout.
- Running `yarn` via Corepack in this repo can auto-add a root `packageManager` field to `package.json`; remove that unrelated diff after build commands if the repo is not meant to declare it yet.

## Domain Notes
- This repo is being used as the current upstream comparison target for an older fork in `/Users/nik/Developer/elements`.
- `@stoplight/json-schema-sampler` defines `sample(schema, options, doc = schema)`; the third argument is the ref-resolution document, not an arbitrary context object.
