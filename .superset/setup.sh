#!/usr/bin/env bash
set -euo pipefail

cd "$SUPERSET_WORKSPACE_PATH"

echo "==> Installing dependencies (pnpm)"
pnpm install

echo "==> Copying untracked env files from main checkout"
copy_if_present() {
  local rel="$1"
  local src="$SUPERSET_ROOT_PATH/$rel"
  local dest="$SUPERSET_WORKSPACE_PATH/$rel"
  if [ -f "$src" ]; then
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    echo "  copied $rel"
  fi
}

copy_if_present ".env"
copy_if_present ".env.local"
copy_if_present "apps/collectstory/.env"
copy_if_present "apps/collectstory/.env.local"

echo "==> Setup complete"
