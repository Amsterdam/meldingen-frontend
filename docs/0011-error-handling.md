# Error handling

## Melding form

Most pages in the Melding form follow a common error handling strategy.
There are a few exceptions, which are detailed below.

### Common error handling strategy

- For errors occurring during page load, we show a general error page (`src/app/(general)/error.tsx` and `src/app/(map)/locatie/kies/error.tsx`).
  An error can be a server error, or a 4XX or 5XX response from the back end.
  These error pages are catch-all, so any error not specifically addressed will end up here.
  An exception to this is the errors that happen when we retrieve answers that were given before.
  We consider these errors non-blocking, since you can still use the application without prefilled answers.
  All we do is log the errors.
- On page load for all pages except the first, we verify if the required session cookies (an `id` and `token`) are present.
  If they are absent, we redirect to the first page.
- When performing an action, an error may occur.
  This can be a server error, or a 4XX or 5XX response from the back end.
  In such cases, we display the current page with an [Alert](https://designsystem.amsterdam/?path=/docs/components-feedback-alert--docs) at the top of the `main` container.
- Form validation is also done by the back end.
  If a user’s responses fail validation, the back end returns an error.
  We handle those errors differently from others; refer to [the forms documentation](./0007-forms.md) for further details.
- If session tokens are missing when executing an action, we redirect to `/cookie-storing`.
  From there, a user can start the form flow again.
  Directly redirecting to the first page would be too abrupt, hence the intermediate page.
- When a user navigates to a path that does not exist, we show a `not-found` page.

### Exceptions

#### Map page

The map page (`/locatie/kies`) handles errors in a slightly different manner.
At the time of writing, we do not know how exactly.
When we do, we will update this section.

#### Attachments

The attachments page (`/bijlage`) handles errors slightly differently.  
It distinguishes between three types of errors:

- System errors: errors returned by API responses
- Generic errors: validation errors that apply to the entire form
- Validation errors: errors tied to a specific upload/component

All three types of errors are displayed at the top of the page.  
However, validation errors also include a link that takes the user directly to the corresponding upload.

## Back office

We haven’t decided on an error handling strategy for this application yet.
When we do, we will update this section.
