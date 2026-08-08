#!/usr/bin/env bash
set -euo pipefail

: "${SUPERSET_ROOT_PATH:?SUPERSET_ROOT_PATH not set}"
: "${SUPERSET_WORKSPACE_PATH:?SUPERSET_WORKSPACE_PATH not set}"

PORTS_LIB="$SUPERSET_ROOT_PATH/.superset/lib/ports.mjs"

cd "$SUPERSET_WORKSPACE_PATH"

# Distinct ranges per service so both keys can never race for the same port.
MAIN_WEBSITE_PORT="$(node "$PORTS_LIB" alloc "${SUPERSET_WORKSPACE_PATH}#main-website" 4300 4399)"
COLLECTSTORY_PORT="$(node "$PORTS_LIB" alloc "${SUPERSET_WORKSPACE_PATH}#collectstory" 3300 3399)"

echo "==> main-website  -> http://localhost:${MAIN_WEBSITE_PORT}"
echo "==> collectstory  -> http://localhost:${COLLECTSTORY_PORT}"

# turbo resolves each app's ^build dependency chain (design-tokens, components,
# icons) before starting its dev script, so workspace deps don't need a
# separate build step in setup.
pnpm turbo run dev --filter=@dezkareid/main-website -- --port "$MAIN_WEBSITE_PORT" &
PID_MAIN=$!

pnpm turbo run dev --filter=@dezkareid/collectstory -- --port "$COLLECTSTORY_PORT" &
PID_COLLECT=$!

cleanup() {
  echo "==> Stopping dev servers"
  kill "$PID_MAIN" "$PID_COLLECT" 2>/dev/null || true
  wait "$PID_MAIN" "$PID_COLLECT" 2>/dev/null || true
  node "$PORTS_LIB" release "${SUPERSET_WORKSPACE_PATH}#main-website" || true
  node "$PORTS_LIB" release "${SUPERSET_WORKSPACE_PATH}#collectstory" || true
}
trap cleanup EXIT INT TERM

wait -n "$PID_MAIN" "$PID_COLLECT" || wait
