# KiteForge Website

Plain HTML/CSS/JS marketing site for KiteForge. No CMS, no server-side software
to patch. Deploys to **Netlify** as static files.

## Structure

```
index.html            one-page site (anchor sections)
privacy.html          privacy policy
404.html              custom not-found page (Netlify serves it automatically)
css/style.css         hand-written CSS, dark brand theme
js/main.js            footer year, mobile nav, contact-form submit, FB embed resize
assets/               logo, favicon, About photo, OG image
assets/industries/    optimized webp images for the "Who it's for" section
robots.txt, sitemap.xml
netlify.toml          build command, security headers, CSP, redirects
scripts/build.sh      copies deployable files into dist/
tests/smoke.spec.js   Playwright smoke tests
```

## Local development

```
npm install
npm run dev            # live-reload server on http://localhost:8080
```

## Build

```
npm run build          # stages static files into dist/
```

Netlify runs this automatically (`publish = "dist"`), so `node_modules`,
tests, and config never ship.

## Tests

```
npx playwright install --with-deps chromium   # first time only
npm test
```

Covers: page loads with no console errors, every section and nav link present,
JAMstack pricing (not the old WordPress tiers), contact form wired for Netlify
with a honeypot, FAQ, "Who it's for" images, About, privacy page, no
WordPress/PHP strings in the markup, mobile nav, custom 404.

## Contact form

Uses **Netlify Forms**. The static markup in `index.html` (`data-netlify="true"`,
hidden `form-name`, `bot-field` honeypot) is what Netlify detects at deploy.
`js/main.js` submits it in the background and swaps in a thank-you message.
Submissions show up in the Netlify dashboard under Forms; set up an email or
Slack notification there.

## Analytics

Cloudflare Web Analytics, cookie-free. The `<script>` snippet is commented out at
the bottom of `index.html`. After adding the site in the Cloudflare dashboard
(Analytics and Logs > Web Analytics), paste the real token in and uncomment it.
The CSP in `netlify.toml` already allows it.

## Deploying to Netlify

1. Connect this repo in the Netlify dashboard. Build settings come from
   `netlify.toml`, nothing to fill in.
2. Add the custom domain `kiteforge.org`. Netlify provisions HTTPS.
3. Point DNS at Netlify (or use Netlify DNS).
4. Deploy previews run on every PR; `main` auto-deploys to production.

### Still to do before / at launch

- **About section:** `assets/keith-about.png` is a placeholder (the brand
  cartoon). Replace it with the real portrait at the same path, and swap the
  TODO bio text in `index.html`.
- **Cloudflare token:** paste it into the commented snippet in `index.html`.
- **Redirects:** `netlify.toml` only stubs the old WP endpoints. Pull the real
  old URLs from Google Search Console and add `301`s so SEO and links survive.
- **Google Business Profile:** set one up for local search, then add its URL to
  the `sameAs` array in the JSON-LD in `index.html`.
- **Old host:** once this is live on Netlify, the Bitnami/Lightsail instance and
  WordPress can be shut down. Nothing here depends on them.

## Status

First site on KiteForge's static pipeline. The same setup is the template for
migrating the Toulouse bar sites (Molly's on Toulouse, Toulouse Dive Bar) off
self-hosted WordPress.
