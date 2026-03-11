# Additional questions form wizard

The additional questions section of the Melding Form (`/aanvullende-vragen/[classificationId]/[panelId]`) is a multi-step form wizard.
Each step corresponds to a panel in the additional questions form that is connected to the classification of the Melding.

## Glossary

- **Panel** (also: **PanelComponent**, **page**)
  A single step in the form wizard. Each panel contains one or more components and corresponds to a URL segment (`/aanvullende-vragen/[classificationId]/[panelId]`). Panels may be conditionally skipped based on answers given in earlier steps.

- **Component**
  A form element within a panel, such as a text input, radio button group, select, checkbox group, or time field. Each component maps to a question. Components mostly reuse the Form.io component data structure.

- **Question**
  The backend entity that a component represents. A question has an ID and a key, and belongs to a panel. When a user fills in a component, they are answering its corresponding question.

- **Answer**
  A user’s response to a question. Answers are stored on the backend and keyed by question ID. When the form on a page is submitted, each answered question results in either a new answer being created (POST) or an existing answer being updated (PATCH).

## Page

When a user arrives on a form wizard page, the following happens:

1. **Fetch form**: The form connected to the classification is fetched from the backend.
2. **Resolve panel**: The panel matching the `panelId` URL param is looked up in the form. If no matching panel is found, the user is redirected past the wizard.
3. **Fetch answers**: Previously submitted answers are fetched (using `meldingId` and `token` cookies) so form components can be prefilled.
4. **Prepare data for the Server Action**: Several pieces of data are calculated and forwarded to the Server Action:
   - `questionAndAnswerIdPairs`: maps each question ID to its existing answer ID, so the action can decide whether to POST (new answer) or PATCH (update existing answer).
   - `questionMetadata`: id, key, type, and available value/label pairs per component, used to build the correct answer body when submitting.
   - `requiredQuestionKeysWithErrorMessages`: the keys of required components together with their validation error messages, used to check required fields before submitting.
   - `panelKeyWithComponentsConditions`: the conditional rules of every component in every panel, used to skip conditionally hidden panels when navigating.
   - `previousAnswersByKey`: all previously submitted answers keyed by component key. This is merged with the answer(s) given on the current page, to ensure up-to-date answers when calculating the next step in the wizard.
5. **Calculate previous panel path**: The panel list is walked backwards (skipping conditionally hidden panels) to find the URL for the "back" button.
6. **Render**: All prepared data is passed to the `AdditionalQuestions` component, which renders the form.

## Server Action

When the user submits the form, the `postForm` Server Action is called:

1. **Validate required fields**: The submitted form data is checked against the required questions. If any are missing or empty, validation errors are returned and the page is shown again with the errors displayed.
2. **Send answers to the backend**: For each answered question, an answer is either POSTed (new) or PATCHed (existing), based on whether an `answerId` is already known. The answer type is determined by the component type (text, time, radio, select, or checkbox).
3. **Handle errors**: Validation errors returned from the backend are shown on the page. Other errors are returned as system errors.
4. **Calculate next panel path**: Previously submitted answers are merged with the just-submitted answers (current panel answers take priority). The panel list is then walked forward (skipping conditionally hidden panels) to determine the URL of the next step. If no more panels are visible, the path points to the page after the wizard.
5. **Handle last panel**: If the next path is past the wizard, the backend is notified that all questions have been answered (`PUT /melding/{id}/answer-questions`). The URL of the last panel is also stored in a cookie, so the user can navigate back to it when returning to the wizard from a later step.
6. **Redirect**: The user is redirected to the next panel, or out of the wizard if it was the last panel.

## Conditional panels

Panels and their components can have conditions that control their visibility. A component is visible when its condition is met based on previously given answers. A panel is visible when it has at least one visible component (or no conditions at all).

Both the previous and next panel paths are calculated by skipping over panels that are not visible given the current set of answers. This ensures the user only sees relevant panels.

## Conditional components on a page

Components on a visible page can also be shown or hidden conditionally. A component can be hidden based on answers given on previous pages, or toggled in real time based on the value of another component on the same page.

### Implementation trade-off

Conditional visibility can be implemented using CSS or JavaScript:

- **CSS**: A class is added to hide the component visually when its conditions are not met. This allows all components to be shown as a fallback when JavaScript is unavailable. However, hidden components are still part of the DOM and submit their data, which can trigger back-end validation errors for fields the user cannot see.
- **JavaScript**: Conditions are evaluated server-side to determine whether to render a component, with client-side JavaScript toggling visibility in real time based on answers to components on the same page. Because hidden components are not rendered, they submit no data. The downside is that users without JavaScript may not see a component they need to fill in. Also, these users may encounter a required question-validation error they cannot resolve, because the component is not shown.

We currently use the JavaScript approach, but may revisit this if issues arise in practice.
