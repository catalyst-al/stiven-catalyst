#!/usr/bin/env bash
# Builds one version of the site for the rollback proof: build.sh <checkout of that version> <output folder>.
# The checkout has its own node_modules (npm ci there: the old version keeps Playwright 1.56.1 and markdown-it 14.3.2,
# the new one has 1.64.1 and 14.3.3). src/media is linked, not copied (build-light.config.mjs).
#
# The two checkouts used on 27 October 2026:
#   new: this branch (rollback-proof = claude/gifted-pasteur-v7n2dw at 5dd8dfc5)
#   old: git worktree add --detach <tmp>/old origin/main   (f34b1c4b, the site that is live today)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
src="$(cd "$1" && pwd)"
out="$2"
mkdir -p "$out"
out="$(cd "$out" && pwd)"
cd "$src"
npx eleventy --config="$here/build-light.config.mjs" --output="$out" > "$out.build.log" 2>&1
rm -rf "$out/media"
ln -s "$src/src/media" "$out/media"
echo "built $(git -C "$src" rev-parse --short HEAD) into $out ($(du -sh "$out" | cut -f1))"
