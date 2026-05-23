#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_LOG="/tmp/landing-test-server.log"

python3 -m http.server 3000 --directory "${ROOT_DIR}/landing" >"${SERVER_LOG}" 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "${SERVER_PID}" >/dev/null 2>&1 || true
}

trap cleanup EXIT
sleep 2

cd "${ROOT_DIR}"
PLAYWRIGHT_BASE_URL="http://127.0.0.1:3000" ./scripts/run-playwright.sh test tests/landing.spec.ts
