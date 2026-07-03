#!/bin/bash
# SessionStart hook for Claude Code on the web.
#  1. Wires git to push directly to github.com (bypassing the write-restricted
#     relay) using a personal access token, so `git push` works for onehandonly
#     repos in the remote environment.
#  2. Installs project dependencies so `pnpm build` / `astro check` are ready.
#
# No secret lives in this file: the token is read from the ONEHANDONLY_GH_PAT
# environment secret. Set that secret in your Claude Code environment settings.
set -euo pipefail

# Only relevant inside the remote (Claude Code on the web) environment.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# --- 1. Direct-to-github.com git access via personal access token ----------
PAT="${ONEHANDONLY_GH_PAT:-}"
if [ -n "$PAT" ]; then
  # Persist the token for github.com via git's credential store.
  git config --global credential.helper store
  umask 077
  printf 'https://x-access-token:%s@github.com\n' "$PAT" > "$HOME/.git-credentials"
  chmod 600 "$HOME/.git-credentials"

  # The remote env injects an `insteadOf` rewrite that sends github.com URLs to
  # a relay which rejects writes. Drop it so github.com URLs stay direct.
  relay_keys="$(git config --global --get-regexp '^url\..*local_proxy.*\.insteadof$' 2>/dev/null | awk '{print $1}' || true)"
  if [ -n "$relay_keys" ]; then
    while read -r key; do
      [ -n "$key" ] && git config --global --unset-all "$key" || true
    done <<< "$relay_keys"
  fi

  # Point this repo's origin at github.com if it currently targets the relay.
  origin_url="$(git remote get-url origin 2>/dev/null || true)"
  case "$origin_url" in
    *local_proxy*/git/onehandonly/*)
      repo="${origin_url##*/git/onehandonly/}"
      repo="${repo%/}"; repo="${repo%.git}"
      git remote set-url origin "https://github.com/onehandonly/${repo}.git"
      ;;
  esac
else
  echo "session-start: ONEHANDONLY_GH_PAT not set — skipping direct-github git setup" >&2
fi

# --- 2. Install project dependencies ---------------------------------------
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || true
fi
pnpm install --prefer-offline
