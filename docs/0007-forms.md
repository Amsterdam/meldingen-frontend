# Forms

Meldingen revolves for a large part around forms.
Our Admin app allows admins to create and update forms, which are shown in our Melding Form and Back Office apps.

## Guidelines

We follow [NL Design System’s form guidelines](https://nldesignsystem.nl/richtlijnen/formulieren/).

### Input validation

We check the information the user gives us to make sure it’s valid.
If there’s a validation error, we tell the user what’s gone wrong and how to fix it:

- show the page again, with the form fields as the user filled them in
- show an [Invalid Form Alert](https://designsystem.amsterdam/?path=/docs/components-forms-invalid-form-alert--docs) at the top of the `main` container, and move keyboard focus to it
- add ‘(X invoerfouten) ’ to the beginning of the page `<title>` so that screen readers announce it immediately
- show [Error message](https://designsystem.amsterdam/?path=/docs/components-forms-error-message--docs) components next to fields with errors

For more information, see [Recover from validation errors - gov.uk](https://design-system.service.gov.uk/patterns/validation/#how-to-tell-the-user-about-validation-errors).

## Schema

To make dealing with forms easier, we use the [Form.io](https://form.io/) JSON schema.
Form.io uses a relatively simple schema, which our back-end can also use.

In the Admin application, we use Form.io’s [Builder](https://help.form.io/developers/form-development/form-builder) to build forms.

We tried to use Form.io’s Renderer in the Melding Form application, but it didn’t integrate well with Next.js and server-side rendering.
So we built [our own renderer](/libs/form-renderer), which uses the same schema.
