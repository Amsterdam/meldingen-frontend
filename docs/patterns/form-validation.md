# Form validation

Our form pages follow [NL Design System's form guidelines](https://nldesignsystem.nl/richtlijnen/formulieren/).
A part of that is validating a user's input, and communicating clearly when this input is not valid.

We use the following pattern to tell the user what's gone wrong and how to fix it:

- show the page again, with the form fields as the user filled them in
- show an [Invalid Form Alert](https://designsystem.amsterdam/?path=/docs/components-forms-invalid-form-alert--docs) at the top of the `main` container, and move keyboard focus to it
- add '(X invoerfouten) ' to the beginning of the page `<title>` so that screen readers announce it immediately
- show [Error message](https://designsystem.amsterdam/?path=/docs/components-forms-error-message--docs) components next to fields with errors

NL Design System's guidelines on this topic are largely based on gov.uk's guidelines.
For more information, see [Recover from validation errors - gov.uk](https://design-system.service.gov.uk/patterns/validation/#how-to-tell-the-user-about-validation-errors).
