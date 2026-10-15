# Claude Code AI Toolkit — Setup Status

Setup run: **2026-10-15** · Environment: Claude Code **cloud** session (ephemeral container, root, Docker available, Node 22 / Bun / Python 3.13 / uv).

**The one fact that governs everything below:** cloud sessions are ephemeral — only files
committed to git survive a container recycle. `~/.claude` global installs, background
workers, and pip/npm installs do **not** persist. So everything reusable was built as
**repo files** (`.claude/`, `CLAUDE.md`, `scripts/`), and the runtime pieces are rebuilt
on demand by `scripts/claude-toolkit-bootstrap.sh`.

> ⚠️ **To make any of this persist, commit and push these files.** They are currently in
> the working tree only. Nothing has been pushed and no PR was opened.

---

## Summary

| Tool | Status | One-line |
|------|--------|----------|
| 1. Claude Mem | 🟡 **Alternative configured** | Worker/hooks/account can't run in ephemeral cloud → git-based memory in `.claude/memory/`. |
| 2. Claude Code Setup | ✅ **Installed & tested** | Official `claude-automation-recommender` skill vendored into the repo. |
| 3. Agent Reach | ✅ **Installed & tested** | CLI installed, `doctor` passes, web + RSS reads verified, Exa wired. |
| 4. Strix | 🟠 **Partially configured / needs approval** | Skills wired + Docker & CLI proven installable; local scans need `LLM_API_KEY` (your call). |
| 5. FreeLLMAPI | 🟠 **Opt-in prepared / needs approval** | Feasible on Docker; opt-in script ready. Not started; Claude's model/auth untouched. |

---

## 1. Claude Mem — 🟡 Alternative configured

**Why not the real thing:** Claude Mem's design needs (a) a long-lived Bun **worker
service**, (b) lifecycle **hooks installed into `~/.claude`**, (c) a **SQLite + Chroma**
store on local disk, and (d) a browser **sign-in** to provision a hosted "observer" key
(a third-party data sync). In an ephemeral cloud session the worker and `~/.claude` hooks
are wiped on recycle, and the account sign-in is a data-sharing step that needs your
explicit approval. So a claimed "full install" would silently stop working next session.

**What I built instead — git-persisted project memory:**
- `.claude/memory/decisions.md` · `architecture.md` · `bugs-and-fixes.md` · `progress.md`
- `.claude/skills/project-memory/SKILL.md` — rules for reading/recording memory.
- `.claude/hooks/session-memory.sh` + a **SessionStart hook** in `.claude/settings.json`
  that injects a compact memory digest into every new session.

**Tested:** the SessionStart hook runs and prints the decisions/architecture/progress
digest (verified this session). **Persists:** yes — it's plain Markdown in git, and
travels to any repo/machine/clone. **Cost:** none. **If you want real Claude Mem:** run it
where a session is long-lived (your Mac/desktop Claude Code) via
`/plugin marketplace add thedotmack/claude-mem` — I can wire that for local use on request.

## 2. Claude Code Setup — ✅ Installed & tested

Vendored the official skill from `anthropics/claude-plugins-official` →
`.claude/skills/claude-automation-recommender/` (SKILL.md + 5 reference files on hooks,
MCP servers, plugins, skills, subagent templates). It analyzes a repo and recommends the
right Claude Code automations — directly useful for standing up **Expo / React Native,
Next.js, Supabase** setups across Everest Local, Everest Marketing, and client sites.

**Tested:** front-matter and references load; skill is discoverable by Claude Code.
**Persists:** yes (in repo). **Cost:** none.

## 3. Agent Reach — ✅ Installed & tested

Installed the real CLI (`Agent Reach v1.5.0`) from the upstream repo into an isolated
venv (**not** the unrelated PyPI package, per the project's own warning). Ran the safe
default install (**no `--system`**, no system packages modified). Skill vendored to
`.claude/skills/agent-reach/`.

**`agent-reach doctor` → 5/16 channels live, all zero-config / no-auth:**
- ✅ **Any web page** (Jina Reader) — *verified:* fetched `example.com` as clean text.
- ✅ **RSS/Atom** (feedparser) — *verified:* parsed 20 entries from a live feed.
- ✅ **Bilibili search**, ✅ **V2EX**, and **YouTube transcripts** (yt-dlp; fixed its JS runtime).
- ✅ **Exa semantic web search** wired via mcporter — server healthy (2 tools). The free
  **shared** Exa endpoint is rate-limited; a free key from dashboard.exa.ai gives unlimited use.
- **GitHub** research already works through this session's GitHub MCP tools.

Good for competitor analysis, market/product research, and lead research on public data.

**Not enabled (by design — need your approval + a throwaway account's cookies):** Twitter/X,
Reddit, Instagram, Facebook, 小红书, LinkedIn, etc. I did not log into or read cookies from
any account. **Persists:** config in repo/memory; the CLI itself is rebuilt each session by
the bootstrap script. **Cost:** free (optional free Exa key for heavy search use).

## 4. Strix — 🟠 Partially configured / needs approval

**Feasibility proven this session:**
- ✅ Docker daemon **starts** in this container (`dockerd` → `docker info` OK).
- ✅ Strix CLI (`strix-agent 1.7.0`) **resolves and installs** cleanly (dry-run verified).
- ❌ Missing only `STRIX_LLM` + **`LLM_API_KEY`** — a credential I won't set without you.

**Wired:** 9 Strix agent skills vendored to `.claude/skills/` (code review, web-app &
API pentesting, OWASP Top-10, CI scanning, fix-verification, and **`managed-pentesting-with-strix`**).
Apache-2.0 license preserved at `.claude/skills/STRIX-LICENSE-Apache-2.0.txt`.

**Two safe paths forward (your choice):**
- **Local open-source:** give me an `LLM_API_KEY` (OpenAI/Anthropic/OpenRouter) and a
  target **you own** (e.g. a staging Everest Local build) and I'll run an isolated,
  sandboxed scan. First run pulls a Docker sandbox image (disk/time cost).
- **Strix Cloud** (`managed-pentesting-with-strix`): no local Docker or key — needs a
  Strix account at app.strix.ai. Lightest path from a cloud session.

**Guardrail honored:** no intrusive scans against production, customer, or payment systems
without explicit approval. **Persists:** skills in repo; runtime rebuilt on demand.
**Cost:** your LLM tokens (local) or Strix Cloud credits (managed).

## 5. FreeLLMAPI — 🟠 Opt-in prepared / needs approval

**Feasibility:** it runs as a Docker container (Node 20+), localhost-bound, single-user —
all compatible with this container once Docker is started. **But** it is only useful once
**you** add your own provider API keys, and its own README is explicit that free tiers are
**for experimentation, not production, and not unlimited**.

**Prepared (not started):** `scripts/freellmapi-optin.sh {up|down|logs}` writes a
localhost-only compose file, generates a local encryption key (chmod 600, git-ignored),
and starts the gateway on `http://localhost:3001` **only when you run it**.

**Guardrail honored:** I did **not** start it, and I did **not** change Claude Code's
default model, Anthropic authentication, API routing, or billing. Repointing Claude Code at
it stays a deliberate, separate decision — ask me and I'll walk through it.
**Persists:** script in repo; data/keys are local & git-ignored. **Cost:** free to run;
provider free-tier limits apply; optional $19/yr live catalog (not needed).

---

## What persists vs. what rebuilds

| Persists in git (survives everything) | Rebuilt each session by `claude-toolkit-bootstrap.sh` |
|---|---|
| `.claude/skills/*`, `.claude/memory/*`, `.claude/hooks/*`, `.claude/settings.json` | Agent Reach CLI (isolated venv) |
| `CLAUDE.md`, `scripts/*`, `.gitignore` | mcporter + Exa (with `--with-exa`) |
| | Docker daemon (with `--start-docker`) |

## Reuse on your other repos

Copy `.claude/`, `CLAUDE.md`, and `scripts/claude-toolkit-bootstrap.sh` into Everest Local,
Everest Marketing, or any client repo. The skills, memory system, and guardrails travel
with it. (I can do this per-repo on request.)

## Remaining steps (need you)

1. **Commit & push** these files so the setup persists (I can do it on a branch — say the word).
2. **Strix:** provide an `LLM_API_KEY` + an owned target, **or** confirm Strix Cloud — then I'll run a real, sandboxed scan.
3. **Exa (optional):** a free `EXA_API_KEY` for unlimited semantic search.
4. **FreeLLMAPI (optional):** say "start FreeLLMAPI" and add your provider keys in its dashboard.
5. **Agent Reach social channels (optional):** approve a specific platform + throwaway account if you want authenticated research.
