#!/usr/bin/env bash
# SessionStart hook: surface this repo's persistent memory into the session.
# Fast, read-only, no network. Prints a compact digest that Claude Code adds to context.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/memory"
[ -d "$DIR" ] || exit 0

echo "## Project memory (from .claude/memory — update it as you work)"
echo
for f in decisions architecture bugs-and-fixes; do
  file="$DIR/$f.md"
  [ -f "$file" ] || continue
  echo "### ${f}.md (latest)"
  # Print from the first level-2 heading, capped so we never flood context.
  awk '/^## /{c++} c>=1 && c<=2' "$file" | head -40
  echo
done

if [ -f "$DIR/progress.md" ]; then
  echo "### progress.md (most recent session)"
  awk '/^## /{c++} c==1{print} c==2{exit}' "$DIR/progress.md" | head -25
fi
exit 0
