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
  In such cases, we display the current page with an `ApiErrorAlert` at the top of the `main` container.
- Form validation is also done by the back end.
  If a user’s responses fail validation, we show an `InvalidFormAlert` with the field-level errors, following [the form validation documentation](./form-validation.md).
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

- API errors: these include server errors or a 4XX or 5XX response when changing state or deleting an attachment.
- Generic errors: these are validation errors that affect the whole file upload module. For instance, when a user attempts to upload too many files.
- Validation errors: these are errors related to a specific file, such as a file that exceeds the size limit.

All three types of errors are displayed at the top of the page.  
However, validation errors also include an in-page link that takes the user directly to the corresponding upload, where the same error message is shown again.

## Back office

Most pages in the Back Office also follow a common error handling strategy.
There are a few exceptions, which are detailed below.

### Common error handling strategy

- For errors occurring during page load, we show a general error page (`src/app/error.tsx`).
  This is a catch-all, so any error not specifically addressed will end up here.
  An exception to this is the errors that happen when we retrieve answers that were given before.
  We consider these errors non-blocking, since you can still use the application without prefilled answers.
  All we do is log the errors.
- Session validity is enforced up front instead of being checked on each page.
  `next-auth` middleware (`src/proxy.ts`) requires a valid session for every route, and the API client config (`src/app/_api-client/proxy.ts`) redirects to `/api/auth/signin` if the access token is missing or its refresh has failed.
  This replaces the cookie-presence check the Melding form does, since Back office is an authenticated app rather than an anonymous one.
- When performing an action, an error may occur.
  This can be a server error, or a 4XX or 5XX response from the back end.
  In such cases, we display the current page with an `ApiErrorAlert` at the top of the `main` container, the same pattern the Melding form uses for action errors.
- Form validation is also done by the back end.
  If a user’s responses fail validation, we show an `InvalidFormAlert` with the field-level errors, following [the form validation documentation](./form-validation.md).
- When a user navigates to a path that does not exist, we show a `not-found` page.

### Exceptions

#### Attachments

The attachments page (`/melding/{meldingId}/bestand-toevoegen`) handles errors slightly differently.
It distinguishes between three types of errors:

- API errors: these include server errors or a 4XX or 5XX response when posting or deleting an attachment.
- Generic errors: these are validation errors that affect the whole file upload module. For instance, when a user attempts to upload too many files.
- Validation errors: these are errors related to a specific file, such as a file that exceeds the size limit.

All three types of errors are displayed at the top of the page.
However, validation errors also include an in-page link that takes the user directly to the corresponding upload, where the same error message is shown again.

### Not yet implemented

- There is no `src/app/error.tsx` or `src/app/not-found.tsx` yet, so uncaught errors and unknown routes currently fall through to Next.js’s default, unstyled error/404 pages.
- Some Server Component data loaders (e.g. `src/app/page.tsx`, `src/app/melding/[meldingId]/page.tsx`) catch fetch errors and return the error message as the page body instead of throwing or calling `notFound()`. These should be migrated once `error.tsx`/`not-found.tsx` exist. `getAssetsData` returns an empty array, so the page is still shown if the API client returns an error.

### To discuss

- When submitting the "melden" form, `prefetchedMelding` form data that fails to parse (`safeJSONParse`) or fails its shape check (`isMeldingData`) is silently discarded: the action falls back to the existing melding ID/token and proceeds, with no error, no alert, and no logging.
- Note documents that fail to parse (`_utils/parseNoteDocument.ts`, shared by `melden`, `notities/toevoegen`, and `notities/[noteId]/wijzigen`) are silently treated as an empty note instead of surfacing a parse error. In `toevoegen` this incidentally resurfaces as a normal "required" validation error; in `wijzigen`/`melden`, where empty is valid, the failure is completely invisible. Nothing is logged.
- On the melding detail page, if an individual attachment's blob fetch fails, `getAttachmentsData` keeps it in the list as `{ blob: null, error }`, but that `error` is never read downstream — `AttachmentSection.tsx`/`Attachment.tsx` silently fall back to plain filename text with no indication anything failed, and nothing is logged. This is distinct from the attachments exception above, which is about uploading new files rather than viewing already-uploaded ones.
