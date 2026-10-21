# Brand logo generator

Rebuilds `src/media/brand/stiven-catalyst-logo-{landscape,portrait}.{svg,png}`.

```
pip install fonttools brotli
python3 scripts/brand/make-logo.py scripts/brand/montserrat-latin.woff2 src/fonts/archivo-black-latin-400-normal.woff2 src/media/brand
node scripts/brand/render-logo.cjs src/media/brand/stiven-catalyst-logo-landscape.svg src/media/brand/stiven-catalyst-logo-landscape.png 2
node scripts/brand/render-logo.cjs src/media/brand/stiven-catalyst-logo-portrait.svg src/media/brand/stiven-catalyst-logo-portrait.png 2.5
```

CATALYST and .com are set in Archivo Black, the site's display face; STIVEN in Montserrat ExtraBold (both SIL Open
Font License). The SVG has the type converted to outlines, so it needs no font to display. The PNG is rendered from
it with the Playwright Chromium already in the project.
