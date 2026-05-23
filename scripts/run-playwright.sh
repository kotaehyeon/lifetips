#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
LOCAL_NODE_BIN="${HOME}/.local/bin"
LOCAL_LIB_DIR="${HOME}/.local/share/playwright-libs/usr/lib/x86_64-linux-gnu"
WORDPRESS_ENV_LOADER="${ROOT_DIR}/scripts/load-wordpress-env.sh"

export PATH="${LOCAL_NODE_BIN}:${PATH}"

if [[ -d "${LOCAL_LIB_DIR}" ]]; then
  export LD_LIBRARY_PATH="${LOCAL_LIB_DIR}${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}"
fi

if [[ -z "${PLAYWRIGHT_BASE_URL:-}" ]] && [[ -f "${WORDPRESS_ENV_LOADER}" ]]; then
  if source "${WORDPRESS_ENV_LOADER}" >/dev/null 2>&1; then
    export PLAYWRIGHT_BASE_URL="${WORDPRESS_SITE_URL}"
  fi
fi

cd "${ROOT_DIR}"
exec npx playwright "$@"
