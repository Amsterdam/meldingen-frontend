# Contributing Guidelines

These guidelines exist to keep our codebase consistent, our history readable, and our collaboration smooth. They are not bureaucracy for its own sake — each rule has a reason, and understanding that reason is more useful than following it blindly.

Please read this document before opening your first pull request.

## Getting Started

You can find our getting started guide [here](./getting-started.md).

## Git Workflow

Our code is open source and used by dozens of municipalities. This context makes it vital to keep our decisions and change history transparent. A clear version control strategy helps with this.

We follow [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow): all work happens on short-lived feature branches that are branched from `main` and merged back into `main` via a pull request.

Feature branches should be small and focused. This keeps continuous integration fast, reduces the chance of merge conflicts, and limits the scope of code reviews. Aim to merge within days, not weeks.

Once you have pushed a branch to the remote, do not rebase it. Rebasing rewrites history and forces your collaborators to reset their local copies. If you need to incorporate upstream changes, merge `main` into your branch instead.

### Branch Naming

Name branches using the Story/PBI ID followed by a brief description of the work:

```text
6803-add-tests-to-map-library
```

The ID lets you quickly find the branch belonging to a given Story/PBI. Jira also uses it to link the PR to the corresponding backlog item automatically. The short description makes it clear at a glance what the branch is about, without having to open it.

## Pull Requests

### PR Title

We squash-merge all PRs, which means the PR title becomes the commit message in `main`’s history. When you trace a specific line of code years from now, a well-written title makes it immediately clear what exactly was changed.

A good PR title should complete the sentence _“If applied, this commit will…”_:

1. Use the imperative mood (example: “Update spacing values”)
2. Capitalize the first word
3. Do not end with a period

All together, a good PR title looks like this: _“Filter conditional answers on Summary page”_

For more information, see [How to Write a Git Commit Message](https://cbea.ms/git-commit/).

### PR Template

The PR title records _what_ changed; the PR description records _why_. Please fill out [the template](../.github/PULL_REQUEST_TEMPLATE.md) — both sections matter.

Most IDEs can navigate from any line of code to the commit that last changed it, and from there directly to the PR. A well-filled template means that when someone traces a specific line of code years from now, they can immediately understand the reasoning behind the change, not just what it was.

This approach does make part of our decision history dependent on GitHub remaining available and retaining our PRs. We consider this less of a risk than relying on Jira or Confluence.

### Authoring

A PR is a proposal, not a finished product — it is an invitation to complete the work together. The author remains responsible for driving the PR to completion.

If you need early feedback — a sanity check on the approach, a look at the diff before you are done — open the PR in draft mode. Draft PRs suppress review notifications and make clear that the work is still in progress.

- **Keep PRs small and focused.** One PR per bug fix or feature. Do not include unrelated refactors or reformats. Smaller PRs are faster to review, easier to revert, and less likely to cause merge conflicts.
- **[Resolve merge conflicts yourself](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/resolving-a-merge-conflict-on-github)** before requesting a human review.
- **Fix CI failures promptly.** Push a fix if your PR fails to build or pass tests.
- **Resolve AI-generated review comments yourself** before requesting a human review.
- **The author merges** once the PR is approved.

See the [PR template](../.github/PULL_REQUEST_TEMPLATE.md) for a quality checklist.

### Reviewing

Review PRs promptly. After all, we want to avoid long-lived branches. The work will also be ‘top of mind’ for the author at the early stages. Make sure you receive notifications of new PRs in your name.

Invest the time to understand the PR change fully. Read the title and description, check out the branch locally, and test the functionality.

#### Giving feedback

Please realise that your written feedback may come across as more critical than you intended.

Your colleague has worked in good faith; make sure you communicate openly. Ask questions and make suggestions. “Would it be okay to…?” “Have you taken into account that…?” “I would expect such and such.”

Call each other if that is more convenient. And write a compliment if you come across some quality work.

Use GitHub’s **suggestion** feature to propose specific changes inline. The author can apply them with one click, which is clearer and faster than describing a change in prose.

#### Resolving comments

The reviewer resolves their own comments after verifying the change was addressed — this ensures no implemented change goes unseen. AI-generated comments are the exception: the author handles those before requesting human review.

Once all comments are resolved, approve the PR. The author then merges.

## Coding Style

Consistency matters more than personal preference. Code that matches its surroundings is easier to read, review, and modify — code that stands out forces every future reader to ask whether the difference is intentional.

Formatting and many style rules are enforced automatically by the linter and formatter.
These are run pre-commit and in the CI pipeline.

For everything the tooling does not cover — naming, structure, patterns — follow what the surrounding code already does. If you are unsure, search the codebase for a similar case or ask.

Code is read far more often than it is written. Prefer clarity over cleverness; add a comment only when the reasoning behind the code is not obvious.

See our [styling conventions](code-conventions/styling.md) and [testing conventions](code-conventions/testing.md).

## Architectural decision records

We use ADRs (Architectural Decision Records) to document important architectural decisions.

You can read more about these [here](decisions/README.md).
