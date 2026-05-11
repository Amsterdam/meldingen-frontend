# Architectural decision records

We use ADRs (Architectural Decision Records) to document important architectural decisions.

These documents start as Drafts in a Drive folder, with a status “proposed”, where we can describe all available options. Sometimes the options are only two, the one suggested and the current one.

Based on discussions in Refinement sessions or ad-hoc meetings, we make a decision and if it’s accepted then:

Document that in the "Decision Outcome" section of the document.
Change its status to "accepted" (or "declined" or just "decided").
Make a copy of the document here (see next pages) for visibility reasons.
All the pending ADRs are in our ADR Drive folder.

File name conventions for ADRs
If you choose to create your ADRs using typical text files, then you may want to come up with your own ADR file name convention.

We prefer to use a file name convention that has a specific format.

Examples:

choose-database.md

format-timestamps.md

manage-passwords.md

handle-exceptions.md

Our file name convention:

The name has a present tense imperative verb phrase. This helps readability and matches our commit message format.

The name uses lowercase and dashes (same as this repo). This is a balance of readability and system usability.

The extension is markdown. This can be useful for easy formatting.

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

What justifies raising an ADR?
Consider areas such as your organization's team ways of working, your software system structure, cross-team coordination, long-term maintainability, external interfaces, who you want to benefit, and the like.

Example answer: We want to create an ADR when we want future developers to understand the “why” of what we're doing.

What justifies not raising an ADR?
Consider areas such as decisions that are not about architecture, or are tiny such as minimal-risk or self-contained or single-developer, or are already fully covered elsewhere such as by standards or policies or documentation, or are temporary such as workarounds or proofs of concepts or orexperiments.

Example answer: We want to skip an ADR when a decision is limited in scope and time and risk and cost, or is already covered elsewhere.

What is the lifecycle of an ADR?
Consider areas such as the creation process, research process, decisioning process, implementation process, and sunsetting process. Consider how to track the ADR lifecycle over time, such as how to move the ADR from one state to the next state, and also how to communicate this to stakeholders.

Example answer: We want an ADR to have five lifecycle stages: Initiating → Researching → Evaluating → Implementing → Maintaining → Sunsetting.

What are criteria for lifecycle steps of an ADR?
Consider areas such as acceptance criteria for an ADR, meaning how do you know it's good enough to progress from one lifecycle step to the next? Is the problem clearly articulated? Have the alternatives been considered? Are trade-offs well-enough understood and documented? Is all relevant context in place? Are all relevant stakeholders involved? Has all feedback been incorporated?

Example answer: We want an ADR to be voted on by stakeholders when the active team has 1) completed their research, 2) completed their evaluation, 3) published the ADR proposal to the stakeholders with a request for comments and a timebox of one week, 4) all stakeholder comments have been incorporated and addressed.

Uitdenken hoe het proces werkt:

- frontend dev schrijft een ADR in Confluence of in een PR
- andere FE devs checken 't en accorderen.
- ADR wordt gemerged in codebase als Accepted

When to Write One
Not every decision needs an ADR. Reserve them for decisions that meet one or more of these conditions:​

The decision will affect how developers write or structure the code.
The decision is hard or expensive to reverse.
The decision keeps being revisited in meetings, wasting everyone’s time.
New team members repeatedly ask the same question about it.
The decision affects multiple services, teams, or systems.
The decision is complex or difficult to explain without context.
You are overriding or adopting a decision made by another team.
A good mental test: “If the two people who made this decision left tomorrow, would the rest of the team know why we did this?” If the answer is no, write an ADR.

1. Title and Identifier
   Name your ADR with its decision, not its topic. ADR-012 Use PostgreSQL for the Media Service communicates more than ADR-012 Database Selection. The identifier (e.g. 012) lets you reference this ADR from code comments, pull requests, and other documentation. A reader scanning a list of ADR titles immediately knows what was decided — not just what was evaluated.

2. Status
   The status tells readers whether this decision is still in force. Keep the workflow simple: Draft → Decided → Superseded by ADR-XXX. If ADR-021 overrides ADR-007, update ADR-007's status to Superseded by ADR-021 and keep the original content intact. ADRs are immutable by design — they preserve history, they don't rewrite it.​

3. Context
   Answer one question here: Why does this decision need to be made? Describe the situation, the constraints, the requirements driving the choice. Include assumptions you are making — and flag them explicitly, because a false assumption invalidates the decision. The reader needs to understand the environment that made this decision necessary.

4. Evaluation Criteria
   This section separates good ADRs from mediocre ones. Document what matters when comparing options. Your architecture characteristics — performance, fault tolerance, extensibility, cost, data residency, GDPR compliance — belong here. When a developer reads this ADR two years from now, they need to understand what you were optimizing for, not just what you chose. Without evaluation criteria, your decision looks arbitrary. With them, it looks defensible.​

5. Options
   List the options you considered — no more than three, to avoid decision paralysis. For each option, score it against your evaluation criteria. Use a simple table with a star rating or Harvey balls for quick visual comparison. Add any trade-offs outside of your criteria in a separate row. Show your work: include cost calculations, benchmark links, proof-of-concept results. A reader should not have to trust your conclusion — they should be able to follow your reasoning.​

6. Decision
   State the chosen option and why. One short paragraph is enough. The detail lives in the sections above; this section connects the dots. "We chose event-driven architecture because it scores highest against our top three characteristics — fault tolerance, extensibility, and auditability — and its operational complexity is acceptable given our current team's experience with Kafka." That is a decision statement. Not "We went with events because it seemed best."

7. Implications
   State both the positives and the negatives of your decision. Every architectural choice carries trade-offs. Documenting the downsides shows that you considered them — and warns future maintainers what to watch for. If ADR-012 introduces eventual consistency, say so. If it creates a vendor dependency on AWS SQS, say so. Implications are not a place to justify the decision; they are a warning label and a gift to your future self.

8. Consultation
   If you solicited feedback before deciding, record it here. Note who was asked, what they said, and how their input shaped the decision. This section prevents the myth that senior engineers make decisions unilaterally. It shows that the decision owner gathered diverse perspectives and made an informed call.​

Write the ADR during the decision-making process — use it as the decision-making tool, not the post-decision report.

We moeten bedenken en beschrijven hoe de ADR bestanden moeten heten. Het is een log, dus iets als 0001-naam-van-adr of 16-02-2026-naam-van-adr is wel logisch. Nummers lijken iets gangbaarder te zijn. Present tense imperative houdt 't redelijk leesbaar. Naam van beslissing als titel zorgt dat je snel de juiste ADR kan vinden. Bij elkaar iets als 0001-use-next-js-as-front-end-framework?

Template:

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
