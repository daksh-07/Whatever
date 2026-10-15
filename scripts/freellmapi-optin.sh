#!/usr/bin/env bash
# freellmapi-optin.sh — OPT-IN only. Runs the FreeLLMAPI gateway locally for
# EXPERIMENTING with cheaper/free models. It does NOT touch Claude Code's model,
# Anthropic auth, API routing, or billing. You add your own provider keys in the
# dashboard; nothing is sent anywhere until you do.
#
# Prereqs: Docker running (`bash scripts/claude-toolkit-bootstrap.sh --start-docker`).
# Usage:   bash scripts/freellmapi-optin.sh up      # start on http://localhost:3001
#          bash scripts/freellmapi-optin.sh down
#          bash scripts/freellmapi-optin.sh logs
#
# Caveats (from the project's own README):
#  - Local-first, single-user, for experimentation — NOT production.
#  - Free tiers are not unlimited or guaranteed; each provider's ToS still applies.
#  - Bind stays on 127.0.0.1. Do not expose it to the internet.
set -euo pipefail
DIR="${FREELLMAPI_HOME:-$HOME/freellmapi}"
CMD="${1:-up}"

if ! docker info >/dev/null 2>&1; then
  echo "Docker is not running. Start it first:  bash scripts/claude-toolkit-bootstrap.sh --start-docker" >&2
  exit 1
fi

mkdir -p "$DIR"
COMPOSE="$DIR/docker-compose.yml"
if [ ! -f "$COMPOSE" ]; then
  # Minimal, localhost-bound compose. Encryption key generated locally, kept out of git.
  if [ ! -f "$DIR/.env" ]; then
    echo "FREELLMAPI_ENCRYPTION_KEY=$(openssl rand -hex 32)" > "$DIR/.env"
    chmod 600 "$DIR/.env"
    echo "Generated encryption key at $DIR/.env (chmod 600, not committed)."
  fi
  cat > "$COMPOSE" <<'YML'
services:
  freellmapi:
    image: ghcr.io/tashfeenahmed/freellmapi:latest
    env_file: [.env]
    environment:
      NODE_ENV: production
      PORT: 3001
    ports:
      - "127.0.0.1:3001:3001"   # localhost only — never expose publicly
    volumes:
      - freellmapi-data:/app/server/data
    extra_hosts:
      - "host.docker.internal:host-gateway"
    restart: unless-stopped
volumes:
  freellmapi-data:
YML
fi

case "$CMD" in
  up)
    ( cd "$DIR" && docker compose up -d )
    echo "FreeLLMAPI starting at http://localhost:3001"
    echo "Next: open it, add YOUR provider keys on the Keys page, copy the unified 'freellmapi-...' key."
    echo "To experiment, point an OpenAI-compatible client at http://localhost:3001/v1 with that key."
    echo "Do NOT repoint Claude Code's model/auth here unless you explicitly decide to."
    ;;
  down) ( cd "$DIR" && docker compose down ) ;;
  logs) ( cd "$DIR" && docker compose logs -f freellmapi ) ;;
  *) echo "usage: $0 {up|down|logs}"; exit 2 ;;
esac
