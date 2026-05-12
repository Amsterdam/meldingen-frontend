# Architectural decision records

We use ADRs (Architectural Decision Records) to document important architectural decisions.

## When to write an ADR

Not every decision needs one. Write an ADR when one or more of these apply:

- The decision affects how developers write or structure code
- The decision is hard or expensive to reverse
- The same question keeps coming up in meetings or from new team members
- The decision spans multiple services, teams, or systems
- The reasoning is complex enough that it won't be obvious from the code alone

A useful test: if the two people who made this decision left tomorrow, would the rest of the team know why? If not, write an ADR.

Skip it when a decision is low-risk, self-contained, temporary (a workaround or experiment), or already covered by existing standards or documentation.

Write the ADR during the decision-making process — use it as the decision-making tool, not a post-decision report.

## Our process

1. A frontend dev opens a PR with the ADR as a new file, or drafts it in Confluence first
2. The other frontend devs review and discuss it — in the PR / Confluence or an ad-hoc meeting
3. Once there's agreement, the ADR is merged with status Accepted

**Superseding a decision**: if a new ADR overrides an existing one, update the old ADR's status to `Superseded by XXXX` and leave its content intact. ADRs are append-only — they preserve history, they don't rewrite it.

## File naming

Use a zero-padded number prefix followed by a present-tense imperative verb phrase, lowercase with dashes:

`0001-use-next-js-as-front-end-framework.md`
`0002-store-sessions-in-redis.md`

The number makes ADRs referenceable from code comments and PRs, and keeps them ordered from oldest to newest. The imperative verb phrase means a reader scanning the list immediately knows what was decided, not just what was evaluated.

## Template

```text
# Title

## Status
Accepted on DD-MM-YYYY | Superseded by [XXXX] on DD-MM-YYYY | Deprecated on DD-MM-YYYY

## Context
What problem or situation prompted this decision?

## Options
What options did you consider?

## Decision
What did we decide, and why this over alternatives?

## Consequences
What are the trade-offs? What becomes easier/harder?

## References
(If applicable)
```

Based on [Michael Nygard's template](https://github.com/architecture-decision-record/architecture-decision-record/tree/main/locales/en/templates/decision-record-template-by-michael-nygard)
