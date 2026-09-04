---
description: |
  Reviews pull requests against the conventions and patterns documented under
  /docs. Reads every file in /docs, then checks the PR diff against them and
  posts a review with a summary and any inline notes on divergence.

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened

permissions:
  contents: read
  pull-requests: read
  copilot-requests: write

engine: copilot

network: defaults

tools:
  bash: true
  github:
    toolsets:
      - pull_requests

safe-outputs:
  submit-pull-request-review:
    max: 1
    allowed-events:
      - COMMENT
  create-pull-request-review-comment:
    max: 10

timeout-minutes: 15
---

# Docs-driven PR review

You are reviewing pull request #${{ github.event.pull_request.number }} in
`${{ github.repository }}` for conformance with this repository's own
documented conventions.

## 1. Learn the conventions

Read every file under `docs/` in this checkout (recurse into subfolders such
as `docs/code-conventions/`, `docs/decisions/`, and `docs/patterns/`, plus the
top-level docs like `docs/README.md`, `docs/getting-started.md`, and
`docs/CONTRIBUTING.md`). Build an internal checklist of the concrete rules,
patterns, and architectural decisions they describe — for example naming and
directory-structure rules, styling and testing conventions, form-handling and
error-handling patterns, and the reasoning captured in the ADRs under
`docs/decisions/`.

Treat these docs as the source of truth for this review. Do not invent
opinions or style preferences that aren't grounded in them.

## 2. Review the diff

Fetch the changed files and diff for this pull request. For each changed
file, check whether it follows the relevant conventions and patterns you
collected in step 1. Focus on:

- Deviations from a documented pattern or convention (cite the specific doc
  and, where useful, quote or paraphrase the relevant rule).
- Cases where an existing documented pattern should have been reused but
  wasn't.
- Violations of an architectural decision recorded in `docs/decisions/`.

Ignore generated files, lockfiles, and anything outside the scope of what
`docs/` documents. Don't comment on matters of taste that aren't backed by a
doc.

## 3. Report findings

- For specific, line-level issues, add inline review comments pointing at the
  offending lines, referencing which doc/pattern applies.
- Submit one overall pull request review (as a comment, not a blocking
  review) summarizing:
  - Whether the PR follows the documented conventions.
  - Any notable deviations found (or "none found" if it's clean).
  - Anything worth a human double-check.

Keep the summary concise and actionable. If the PR fully conforms, say so
briefly rather than manufacturing feedback.
