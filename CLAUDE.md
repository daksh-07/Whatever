# CLAUDE.md — project instructions & AI toolkit

This repo is configured with a reusable Claude Code toolkit. Full setup report and
status: **`TOOLKIT-STATUS.md`**. This file is kept short on purpose — detail lives in
the skills, which load only when relevant (no token cost on ordinary tasks).

## Persistent memory (read/update as you work)

Durable project knowledge lives in `.claude/memory/` (git-committed, survives
ephemeral cloud sessions). At the start of non-trivial work, skim it; after a
notable decision, a tricky bug fix, or a finished session, append an entry.
See the **project-memory** skill for the rules. Never put secrets in memory.

- `decisions.md` — why we chose what we chose
- `architecture.md` — how things fit together
- `bugs-and-fixes.md` — root causes we already solved
- `progress.md` — session log (newest on top)

## Available skills (auto-trigger when relevant)

- **project-memory** — recall/record durable context.
- **claude-automation-recommender** — analyze a repo and recommend Claude Code
  hooks/subagents/skills/plugins/MCP. Use when setting up a new repo or improving the setup.
- **agent-reach** — public-web research (read any page, YouTube transcripts, RSS,
  GitHub, Exa semantic search). Use for competitor/market/product/lead research.
  Zero-config channels only; social accounts need explicit user approval + cookies.
- **Strix security skills** — `find-security-vulnerabilities-in-code`,
  `web-app-penetration-testing`, `api-security-testing`, `owasp-top-10-testing`,
  `fix-security-vulnerabilities-with-strix`, `ci-security-scanning-with-strix`,
  `managed-pentesting-with-strix` (cloud, no local Docker/key). Only test apps the
  user owns; never scan production/customer/payment systems without explicit approval.

## Research & security guardrails

- **Agent Reach:** do not log into, or read cookies from, the user's social accounts
  (Twitter/X, Reddit, Instagram, Facebook, 小红书, etc.) without explicit approval.
  Default to the no-auth channels.
- **Strix:** needs `STRIX_LLM` + `LLM_API_KEY` + a running Docker daemon for local
  scans — ask before setting these or running a scan. Prefer `managed-pentesting-with-strix`
  (Strix Cloud) when the user has an account. Only targets the user owns.
- **FreeLLMAPI:** opt-in only (`scripts/freellmapi-optin.sh`). Never point Claude
  Code's model/auth/routing/billing at it without explicit approval. Free tiers are
  not guaranteed or unlimited.

## Environment / persistence notes

- Cloud sessions are **ephemeral**: only committed git files persist. Runtime installs
  (Agent Reach CLI, mcporter, Docker daemon) are re-created each session by
  `scripts/claude-toolkit-bootstrap.sh` (wired to run on SessionStart).
- To reuse this toolkit in another repo (Everest Local/Marketing, client sites):
  copy `.claude/`, `CLAUDE.md`, and `scripts/claude-toolkit-bootstrap.sh` into it.

## Project: Whatever

Static browser game (`index.html`, `game.html`). No backend/build. Keep it
dependency-free and mobile-friendly.
