#!/usr/bin/env bash
set -euo pipefail

# Copy immutable live events to this worktree's tracked archive. Never stages or commits.
root=$(git rev-parse --show-toplevel) || {
  printf '%s\n' 'archive-events: run inside the target Git repository' >&2
  exit 1
}
common=$(git rev-parse --path-format=absolute --git-common-dir)
inbox=$common/agent-work/events
archive=$root/agent-work/events
mkdir -p -- "$archive"
pending=$(mktemp -d "$archive/.archive.XXXXXXXXXXXX")
trap 'rm -rf -- "$pending"' EXIT

shopt -s nullglob
events=("$inbox"/[0-9]*.md)
for file in "${events[@]}"; do
  target=$archive/${file##*/}
  if [[ -e $target ]]; then
    cmp -- "$file" "$target" || {
      printf 'archive-events: event ID has different archived bytes: %s\n' "${file##*/}" >&2
      exit 1
    }
  else
    cp -- "$file" "$pending/event"
    ln -T -- "$pending/event" "$target"
    rm -- "$pending/event"
  fi
done

printf 'Archived or verified %d event(s) in %s\n' "${#events[@]}" "$archive"
