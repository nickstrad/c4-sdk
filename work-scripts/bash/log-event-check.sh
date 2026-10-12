#!/usr/bin/env bash
set -euo pipefail

# Uses an isolated temporary Git repository; never touches the real shared inbox.
root=$(git rev-parse --show-toplevel)
logger=$root/work-scripts/bash/log-event.sh
archiver=$root/work-scripts/bash/archive-events.sh
scratch=$(mktemp -d "${TMPDIR:-/tmp}/c4-sdk-event-log-check.XXXXXXXX")
trap 'rm -rf -- "$scratch"' EXIT
export LC_ALL=C
export GIT_CONFIG_NOSYSTEM=1
export GIT_CONFIG_GLOBAL=/dev/null
unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE

git init -q --initial-branch=fixture "$scratch/repo"
cd "$scratch/repo"
git -c user.name=Fixture -c user.email=fixture@example.invalid commit -q --allow-empty -m fixture
git worktree add -q -b fixture-linked "$scratch/linked"
inbox=$(git rev-parse --path-format=absolute --git-common-dir)/agent-work/events

reject() {
  if "$logger" "$@" > "$scratch/out" 2> "$scratch/err"; then
    printf 'Unexpected success: %s\n' "$*" >&2
    exit 1
  fi
}
reject --type unknown --branch fixture --summary invalid
reject --type task_started --branch fixture --summary $'two\nlines'
reject --type task_started --branch fixture --summary '   '
reject --type task_started --branch $'bad\rbranch' --summary invalid
reject --type task_started --branch fixture --summary invalid --actor ../escape
reject --type task_started --branch fixture --summary invalid --detail
reject --type task_started --branch fixture --summary invalid --unknown x
[[ ! -e $inbox ]]

for type in task_started task_completed landed review_verdict blocker decision_needed; do
  AGENT_ACTOR=fixture-env "$logger" --type "$type" --branch fixture --summary "Type: $type" >/dev/null
done

# Same actor and branch from both linked worktrees stress the unique publisher.
pids=()
for ((i=1; i<=100; i++)); do
  (
    if ((i % 2)); then cd "$scratch/linked"; fi
    "$logger" --type task_completed --branch fixture --actor same-actor \
      --summary "Concurrent $i" --detail $'type: blocker\nComplete body.' > "$scratch/path-$i"
  ) &
  pids+=("$!")
done

shopt -s nullglob
for ((pass=0; pass<10; pass++)); do
  for file in "$inbox"/[0-9]*.md; do
    mapfile -t lines < "$file"
    [[ ${lines[0]} == '# Agent event' && ${lines[2]} == '```text' && ${lines[8]} == '```' ]]
    if [[ ${lines[4]} == 'actor: same-actor' ]]; then
      [[ ${#lines[@]} == 12 && ${lines[11]} == 'Complete body.' ]]
    fi
  done
done
for pid in "${pids[@]}"; do wait "$pid"; done
files=("$inbox"/[0-9]*.md)
[[ ${#files[@]} == 106 ]]
for ((i=1; i<=100; i++)); do
  IFS= read -r file < "$scratch/path-$i"
  [[ $file == "$inbox/"* ]]
  mapfile -t lines < "$file"
  [[ ${lines[7]} == "summary: Concurrent $i" && ${lines[6]} == 'type: task_completed' ]]
done
pending=("$inbox"/.pending.*)
[[ ${#pending[@]} == 0 ]]

# Literal shell syntax is stored as data.
file=$("$logger" --type decision_needed --branch fixture --actor literal --summary 'Literal: "$(false)"')
mapfile -t lines < "$file"
[[ ${lines[7]} == 'summary: Literal: "$(false)"' ]]

# Exercise the actual archive command: publication, idempotence, and ID collision refusal.
mkdir -p "$scratch/repo/work-scripts/bash"
cp -- "$archiver" "$scratch/repo/work-scripts/bash/archive-events.sh"
bash "$archiver" >/dev/null
archive=$scratch/repo/agent-work/events
archived=("$archive"/[0-9]*.md)
[[ ${#archived[@]} == 107 ]]
for event in "${files[@]}"; do cmp -- "$event" "$archive/${event##*/}"; done
bash "$archiver" >/dev/null
archived_again=("$archive"/[0-9]*.md)
[[ ${#archived_again[@]} == 107 ]]
event=${files[0]}
cp -- "$event" "$scratch/original"
printf '\nconflicting edit\n' >> "$archive/${event##*/}"
if bash "$archiver" > "$scratch/archive-out" 2> "$scratch/archive-err"; then
  printf '%s\n' 'Archive unexpectedly accepted different bytes for an existing event ID' >&2
  exit 1
fi
cmp -- "$event" "$scratch/original"

printf '%s\n' 'PASS: validation, six types, 100 concurrent cross-worktree writes, complete publication, literal fields, archive byte check and collision detection'
