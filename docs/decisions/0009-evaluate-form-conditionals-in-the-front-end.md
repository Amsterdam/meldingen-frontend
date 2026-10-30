# Evaluate form conditionals in the front-end

## Status

Accepted on 31-03-2026

## Context

The additional questions in the Melding Form can be conditional: a question is only shown when an earlier answer meets a condition. Conditions are configured in the Admin app and stored as part of the [Form.io schema](0004-use-form-io-schema-and-builder-for-forms.md). The back-end stores these `conditional` blocks and returns them with the form, but does not evaluate them.

Conditions affect the form at two moments:

- **When on a page**: a question can be shown or hidden when the page is rendered, based on answers on **previous** pages, or toggled in real time based on another question on the **same** page.
- **When navigating between pages**: when every question on a page has a condition that is not met, the whole page is skipped. Navigating forward and back therefore has to take these skipped pages into account.

Toggling questions in real time on a page requires evaluating conditions in the browser. Because of [progressive enhancement](0006-apply-progressive-enhancement.md), the flow also has to work without JavaScript. Conditions are therefore also evaluated on the server:

- **When a page is rendered**: to decide which questions to show, based on answers given on previous pages.
- **When a page is submitted**: to determine the next page, and to check required questions that are conditionally visible.

## Options

- **Front-end evaluates all conditions**: the form renderer decides which questions to render or toggle, and the server actions decide which page comes next or before. The back-end only stores the conditions.
- **Back-end evaluates conditions**: the back-end returns which questions and pages are visible, or the next page, based on the stored answers. The front-end would still have to evaluate conditions in the browser for questions that toggle in real time on a page.
- **Both evaluate conditions**: the front-end evaluates conditions for the user experience, and the back-end evaluates them again as the authority, for example to enforce required questions.

## Decision

We evaluate all conditions in the front-end. Part of the logic has to run in the browser anyway, so evaluating conditions in the front-end keeps the condition logic together. Evaluating conditions in the back-end as well would mean maintaining the same logic in two languages, which can drift apart.

How the condition logic works is described in [Additional questions form wizard](../patterns/additional-questions-form-wizard.md).

## Consequences

- Condition logic lives in the front-end, in TypeScript, and works both on the server and in the browser.
- Without JavaScript, questions that depend on another question on the same page are not shown, because there is no script to reveal them when the answer changes. See [Implementation trade-off](../patterns/additional-questions-form-wizard.md#implementation-trade-off).
- The back-end trusts the front-end with everything that depends on conditions:
  - **Required questions**: the back-end does not check whether required questions are answered at all. The check happens in the server action of the additional questions pages. A required question is only required when it is shown: when its condition is not met, the user never sees the question, so we do not return a validation error for it.
  - **Stale answers**: when a user changes an answer so that a previously answered question is hidden, the answer to that question stays stored in the back-end. The front-end ignores these answers when navigating and on the summary page, and deletes them when the melding is submitted from the summary page.
  - **Completing the questions**: `PUT /melding/{id}/answer-questions` does not check whether all required questions are answered. We accept this risk.
- Other clients of the API, such as a future app, would have to implement the condition logic themselves.
- Changes to how conditions work, or new condition types in the Form.io schema, only need front-end changes, as long as the back-end can store them.
