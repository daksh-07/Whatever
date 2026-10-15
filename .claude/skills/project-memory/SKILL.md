---
name: project-memory
description: Read and update this repo's persistent project memory (decisions, architecture, bugs & fixes, progress). Use at the start of non-trivial work to recall prior context, and after making a notable decision, fixing a tricky bug, or finishing a work session to record it. This is the repo-based, git-persisted replacement for a background memory worker in ephemeral cloud sessions.
---

# Project Memory

Persistent knowledge for this repository lives in `.claude/memory/`. It is plain
Markdown committed to git, so it survives across sessions, machines, and clones —
no worker, daemon, or account required.

## Files

| File | Holds | Write when |
|------|-------|-----------|
| `decisions.md` | Durable technical/product decisions + why | You (or the user) commit to an approach |
| `architecture.md` | Components, data flow, integration points, gotchas | Structure changes or you learn how something works |
| `bugs-and-fixes.md` | Recurring bugs → root cause → fix | You spend real effort debugging something |
| `progress.md` | Session log, newest on top | End of a work session, or a milestone |

## How to use it

**On starting non-trivial work:** skim the four files (they are short) to recall
prior context before asking the user or re-deriving things.

**While working:** when you make a decision worth remembering, fix a non-obvious
bug, or change the architecture, append a dated entry to the right file. Keep
entries terse — facts over prose. Newest entries go at the top.

**Privacy:** never write secrets, tokens, keys, customer data, or anything the
user marked private into memory. Memory is committed to git.

**Token discipline:** these files are injected/skimmed, not dumped verbatim into
every prompt. Keep each file lean; prune stale entries. Do not read memory for
trivial one-line tasks.

## Updating from the shell

```bash
# append a progress entry
printf '\n## %s — <what happened>\n- <fact>\n' "$(date +%F)" >> .claude/memory/progress.md
```

Then commit so it persists: `git add .claude/memory && git commit -m "memory: <note>"`.
