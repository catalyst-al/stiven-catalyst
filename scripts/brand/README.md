# Brand logo generator

Rebuilds `src/media/brand/stiven-catalyst-logo-{landscape,portrait}.{svg,png}`.

```
pip install fonttools brotli
python3 scripts/brand/make-logo.py scripts/brand/montserrat-latin.woff2 src/media/brand
node scripts/brand/render-logo.js src/media/brand/stiven-catalyst-logo-landscape.svg src/media/brand/stiven-catalyst-logo-landscape.png 2
node scripts/brand/render-logo.js src/media/brand/stiven-catalyst-logo-portrait.svg src/media/brand/stiven-catalyst-logo-portrait.png 2.5
```

The SVG has the type (Montserrat, SIL Open Font License, latin subset from Google Fonts) converted to outlines, so it needs no font to display. The PNG is rendered from it with the Playwright Chromium already in the project.
