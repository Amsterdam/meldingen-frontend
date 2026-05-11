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

The number makes ADRs referenceable from code comments and PRs. The imperative verb phrase means a reader scanning the list immediately knows what was decided, not just what was evaluated.

## Template

```text
# Title

## Status
Accepted on DD-MM-YYYY | Superseded by [XXXX] on DD-MM-YYYY | Deprecated on DD-MM-YYYY

## Context
What problem or situation prompted this decision?

## Decision
What did we decide, and why this over alternatives?

## Consequences
What are the trade-offs? What becomes easier/harder?

## References
(If applicable)
```

Based on [Michael Nygard's template](https://github.com/architecture-decision-record/architecture-decision-record/tree/main/locales/en/templates/decision-record-template-by-michael-nygard)

## Section guide

Suggestions for writing good ADRs
Characteristics of a good ADR:

Rationale: Explain the reasons for doing the particular AD. This can include the context (see below), pros and cons of various potential choices, feature comparisons, cost/benefit discussions, and more.

Specific: Each ADR should be about one AD, not multiple ADs.

Timestamps: Identify when each item in the ADR is written. This is especially important for aspects that may change over time, such as costs, schedules, scaling, and the like.

Immutable: Don't alter existing information in an ADR. Instead, amend the ADR by adding new information, or supersede the ADR by creating a new ADR.

Characteristics of a good "Context" section in an ADR:

Explain your organization's situation and business priorities.

Include rationale and considerations based on social and skills makeups of your teams.

Include pros and cons that are relevant, and describe them in terms that align with your needs and goals.

Characteristics of good "Consequences" section in an ADR:

Explain what follows from making the decision. This can include the effects, outcomes, outputs, follow ups, and more.

Include information about any subsequent ADRs. It's relatively common for one ADR to trigger the need for more ADRs, such as when one ADR makes a big overarching choice, which in turn creates needs for more smaller decisions.

Include any after-action review processes. It's typical for teams to review each ADR one month later, to compare the ADR information with what's happened in actual practice, in order to learn and grow.

A new ADR may take the place of a previous ADR:

When an AD is made that replaces or invalidates a previous ADR, then a new ADR should be created

3. Context
   Answer one question here: Why does this decision need to be made? Describe the situation, the constraints, the requirements driving the choice. Include assumptions you are making — and flag them explicitly, because a false assumption invalidates the decision. The reader needs to understand the environment that made this decision necessary.

4. Evaluation Criteria
   This section separates good ADRs from mediocre ones. Document what matters when comparing options. Your architecture characteristics — performance, fault tolerance, extensibility, cost, data residency, GDPR compliance — belong here. When a developer reads this ADR two years from now, they need to understand what you were optimizing for, not just what you chose. Without evaluation criteria, your decision looks arbitrary. With them, it looks defensible.​

5. Options
   List the options you considered — no more than three, to avoid decision paralysis. For each option, score it against your evaluation criteria. Use a simple table with a star rating or Harvey balls for quick visual comparison. Add any trade-offs outside of your criteria in a separate row. Show your work: include cost calculations, benchmark links, proof-of-concept results. A reader should not have to trust your conclusion — they should be able to follow your reasoning.​

6. Decision
   State the chosen option and why. One short paragraph is enough. The detail lives in the sections above; this section connects the dots. "We chose event-driven architecture because it scores highest against our top three characteristics — fault tolerance, extensibility, and auditability — and its operational complexity is acceptable given our current team's experience with Kafka." That is a decision statement. Not "We went with events because it seemed best."

7. Consequences
   State both the positives and the negatives of your decision. Every architectural choice carries trade-offs. Documenting the downsides shows that you considered them — and warns future maintainers what to watch for. If ADR-012 introduces eventual consistency, say so. If it creates a vendor dependency on AWS SQS, say so. Implications are not a place to justify the decision; they are a warning label and a gift to your future self.
