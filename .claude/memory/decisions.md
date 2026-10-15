# Decisions

> Durable technical/product decisions and the reasoning. Newest at top. Format:
> `## YYYY-MM-DD — <decision>` then **Why** / **Alternatives** / **Status**.

## 2026-10-15 — Use repo-based memory instead of claude-mem worker
**Why** Cloud Claude Code sessions are ephemeral; claude-mem's Bun worker + `~/.claude` hooks + SQLite do not survive container recycle, and its hosted observer needs browser sign-in (third-party data sync).
**Alternatives** Full claude-mem (rejected for cloud: non-persistent + account signup); no memory (rejected: loses continuity).
**Status** Active. Memory lives in git, so it persists wherever the repo goes.
