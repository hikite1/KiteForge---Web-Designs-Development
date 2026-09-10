#!/usr/bin/env bash
# Stage the deployable static files into dist/ for Netlify.
# Headers and redirects live in netlify.toml, not in dist/.
set -euo pipefail

rm -rf dist
mkdir -p dist

cp -R index.html privacy.html 404.html css js assets robots.txt sitemap.xml dist/

echo "Built dist/ with $(find dist -type f | wc -l) files."
