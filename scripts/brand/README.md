# Brand logo generator

Rebuilds `src/media/brand/stiven-catalyst-logo-{landscape,portrait}-{brand,vivid}.{svg,png}`.

```
pip install fonttools brotli
python3 scripts/brand/make-logo.py scripts/brand/montserrat-latin.woff2 src/media/brand
for g in brand vivid; do
  node scripts/brand/render-logo.cjs src/media/brand/stiven-catalyst-logo-landscape-$g.svg src/media/brand/stiven-catalyst-logo-landscape-$g.png 2
  node scripts/brand/render-logo.cjs src/media/brand/stiven-catalyst-logo-portrait-$g.svg src/media/brand/stiven-catalyst-logo-portrait-$g.png 2.5
done
```

The type is Montserrat (SIL Open Font License, variable latin subset from Google Fonts): STIVEN Regular, CATALYST
ExtraBold, .com Bold. The SVG has it converted to outlines, so it needs no font to display. The PNG is rendered from
it with the Playwright Chromium already in the project. The two gradients are defined at the top of make-logo.py.
