#!/usr/bin/env bash
set -euo pipefail

PORTS_LIB="$SUPERSET_ROOT_PATH/.superset/lib/ports.mjs"
[ -f "$PORTS_LIB" ] || exit 0

for service in "main-website" "collectstory"; do
  key="${SUPERSET_WORKSPACE_PATH}#${service}"
  port="$(node "$PORTS_LIB" get "$key" || true)"

  if [ -n "${port:-}" ] && command -v lsof >/dev/null 2>&1; then
    pids="$(lsof -ti "tcp:${port}" 2>/dev/null || true)"
    if [ -n "$pids" ]; then
      echo "==> Stopping ${service} dev server on port ${port}"
      kill $pids 2>/dev/null || true
    fi
  fi

  node "$PORTS_LIB" release "$key" || true
done

echo "==> Teardown complete"
