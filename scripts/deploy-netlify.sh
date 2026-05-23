#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-prod}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLISH_DIR="${ROOT_DIR}/landing"

: "${NETLIFY_AUTH_TOKEN:?NETLIFY_AUTH_TOKEN is required}"
: "${NETLIFY_SITE_ID:?NETLIFY_SITE_ID is required}"

if [[ ! -d "${PUBLISH_DIR}" ]]; then
  echo "Landing directory not found: ${PUBLISH_DIR}" >&2
  exit 1
fi

if [[ "${MODE}" == "preview" ]]; then
  npx netlify-cli deploy --dir="${PUBLISH_DIR}"
  exit 0
fi

npx netlify-cli deploy --dir="${PUBLISH_DIR}" --prod
