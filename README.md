# DentiFront

Legacy Vue 2 frontend imported from the supplied `kaiiinc-dt2022-front` source archive.

## Technology baseline

- Vue 2.6, Vue CLI 4.5 / Webpack 4, Vuex 3, Vue Router 3, Axios
- npm lockfile included for reproducible installations
- Node.js 22 for initial tooling, with the legacy OpenSSL provider required by Webpack 4
- GitHub Actions workflow: `.github/workflows/frontend-ci.yml`

## Local setup

```bash
nvm use             # Reads .nvmrc (install Node 22 first if needed)
npm ci --legacy-peer-deps
npm run serve       # Existing development server on port 9090; invokes auto-fixing lint
```

The inherited `serve` script calls `lint` with `--fix`. It **may rewrite source files**. To perform a read-only lint check, use:

```bash
npm run lint:check
```

For a production build:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

## Backend integration boundary

- API transport entry point: `src/apis/Api.js`
- REST API wrappers: `src/apis/`
- Vuex state: `src/store/`
- Routes: `src/router/`
- Current API endpoints are inherited from the legacy deployment; they have **not** been migrated or verified against `codon62/denti-i`.
- The old Slack webhook credentials were **removed** from `src/plugins/slack.js`. Implement error reporting in a backend service; do not place webhook credentials in browser code or `VUE_APP_*` variables.

## Baseline status

This is an **initial source import**, not a claim that the legacy frontend has been upgraded to supported frameworks or that all screens work against the new backend.

See [`docs/BASELINE.md`](docs/BASELINE.md) for validation and migration notes.
