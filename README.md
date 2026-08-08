# KiteForge Website (static rebuild)

Plain HTML/CSS/JS site — no CMS, no server-side software to patch.

## Local development

```
npm install
npm run dev
```

Opens a live-reload dev server (default: http://localhost:8080).

## Tests

```
npx playwright install --with-deps chromium   # first time only
npm test
```

Runs a smoke test suite: page loads, no console errors, key sections/nav present.

## CI/CD

`.github/workflows/ci.yml` runs the test suite on every pull request and on
pushes to `main`. The `deploy` job is a placeholder until a hosting provider
is chosen (Cloudflare Pages / Netlify / S3+CloudFront are the current
candidates — see project chat history for tradeoffs).

## Status

This is the first project using KiteForge's new static-site pipeline
(dev server + tests + CI/CD). Once this workflow is validated here, the
same pattern will be used to migrate the Bitnami/Lightsail-hosted bar
sites (Toulouse Dive Bar, Molly's on Toulouse) off WordPress.

Content/design in `index.html` is currently placeholder — next step is
to swap in the real KiteForge copy, logo, and imagery.
