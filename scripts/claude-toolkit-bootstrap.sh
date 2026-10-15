#!/usr/bin/env bash
# claude-toolkit-bootstrap.sh
# Re-create the ephemeral runtime pieces of the AI toolkit in a fresh cloud session.
# Everything here is non-persistent across container recycles; the committed files
# (.claude/, CLAUDE.md) persist, this script rebuilds the runtimes on demand.
#
# Safe by design: installs into an isolated venv, never writes secrets, never
# touches Claude Code's model/auth/routing, never runs a security scan or a
# social-account login. Run it manually when you need research/security runtimes:
#   bash scripts/claude-toolkit-bootstrap.sh [--with-exa] [--start-docker]
set -uo pipefail

VENV="${AGENT_REACH_VENV:-$HOME/.agent-reach-venv}"
WITH_EXA=0; START_DOCKER=0
for a in "$@"; do case "$a" in --with-exa) WITH_EXA=1;; --start-docker) START_DOCKER=1;; esac; done

say() { printf '\033[1;36m[toolkit]\033[0m %s\n' "$*"; }

# --- Agent Reach (public-web research CLI) --------------------------------
if ! command -v agent-reach >/dev/null 2>&1 && [ ! -x "$VENV/bin/agent-reach" ]; then
  say "Installing Agent Reach into $VENV (isolated, no --system) ..."
  python3 -m venv "$VENV"
  # Install from the upstream repo (NOT the unrelated PyPI 'agent-reach').
  "$VENV/bin/pip" install -q "git+https://github.com/Panniantong/Agent-Reach@main" \
    || say "Agent Reach install failed (offline?). Skipping."
fi
if [ -x "$VENV/bin/agent-reach" ]; then
  export PATH="$VENV/bin:$PATH"
  # yt-dlp JS runtime (free, needed for YouTube transcripts)
  mkdir -p "$HOME/.config/yt-dlp"
  grep -qxF -- '--js-runtimes node' "$HOME/.config/yt-dlp/config" 2>/dev/null \
    || printf '%s\n' '--js-runtimes node' >> "$HOME/.config/yt-dlp/config"
  say "Agent Reach ready: $(agent-reach --version 2>/dev/null)"
fi

# --- Exa semantic search (optional, free shared tier; set EXA_API_KEY for unlimited) ---
if [ "$WITH_EXA" = 1 ]; then
  command -v mcporter >/dev/null 2>&1 || { say "Installing mcporter ..."; npm install -g mcporter >/dev/null 2>&1; }
  URL="https://mcp.exa.ai/mcp"; [ -n "${EXA_API_KEY:-}" ] && URL="https://mcp.exa.ai/mcp?exaApiKey=${EXA_API_KEY}"
  mcporter config add exa "$URL" --scope home >/dev/null 2>&1 || true
  say "Exa MCP configured (${EXA_API_KEY:+with your key}${EXA_API_KEY:-free shared tier — may be rate-limited})."
fi

# --- Docker (needed only for a local Strix / FreeLLMAPI run) ---------------
if [ "$START_DOCKER" = 1 ] && ! docker info >/dev/null 2>&1; then
  say "Starting dockerd ..."
  (dockerd >/tmp/dockerd.log 2>&1 &) ; sleep 6
  docker info >/dev/null 2>&1 && say "Docker up." || say "Docker failed to start — see /tmp/dockerd.log"
fi

say "Done. Health check: agent-reach doctor"
