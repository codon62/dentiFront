# DentiFront Initial Baseline

## Provenance

- Source archive: `kaiiinc-dt2022-front-20260906T020221Z-1-001.zip`
- Source archive SHA-256: `7f7dd2acacb1693ccb2180d661f7fcb09945e8c5506afe723b18f4d31ef9afd5`
- Original files: 767
- Original uncompressed bytes: 24,837,108
- Repository: `codon62/dentiFront`

## Intentional source changes

- `src/plugins/slack.js`: removes two embedded Slack webhook URLs and leaves a no-op integration point.
- `.gitignore`: ignores local `.env*` files except `.env.example`.
- `package.json`: adds a non-mutating `lint:check` script.
- `README.md`: replaces generic Vue CLI README with repository-specific usage and integration boundaries.

## Initial tooling

- `.nvmrc`: Node.js 22 baseline (chosen for an active LTS release).
- `.github/workflows/frontend-ci.yml`: `npm ci --legacy-peer-deps` and production build with Webpack 4 OpenSSL compatibility flag.

## Verification criteria

1. `npm ci --legacy-peer-deps` succeeds.
2. `NODE_OPTIONS=--openssl-legacy-provider npm run build` succeeds.
3. A smoke test checks login, routes, and primary flows against the intended `denti-i` backend.
4. GitHub Actions build is green after repository import.

**Validation caveat:** Offline execution environments may not have a dependency cache. CI/build must be observed on a network-enabled runner; do not mark this baseline VERIFIED until then.

## Important follow-up risks

- Vue 2 and Vue CLI 4 are legacy; dependency security upgrade should be planned as a separate tracked effort.
- Current REST URL selection and token refresh logic remain legacy and must be reconciled with the current `denti-i` Identity / Access contracts.
- Existing `npm run serve` auto-fixes files via lint. Avoid unexpected working-tree changes by using `npm run lint:check` first.
- Frontend-side webhooks are insecure. Rotate the exposed historical Slack webhooks if still active.
- Noto Sans font assets originate from the provided archive; review distribution license before publication if required.
