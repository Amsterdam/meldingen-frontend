# Mocking API requests

Melding form and Back office use [MSW](https://mswjs.io/) to mock the back end in unit tests, instead of mocking `fetch` or the generated API client with `vi.mock`.

MSW intercepts requests at the network level, so the same client code (`@meldingen/api-client`) runs in tests as it does in production. Only the response coming back from the network is faked. This means a test exercises the real request-building and response-handling code, not a stand-in for it.

## Structure

Each app that talks to the back end has its own `src/mocks/` folder (`apps/back-office/src/mocks` and `apps/melding-form/src/mocks`), with the same three files at its core:

- `endpoints.ts` — a single `ENDPOINTS` object mapping a descriptive key to a path, e.g. `GET_MELDING_BY_MELDING_ID: '/melding/:id'`. Keys follow `<METHOD>_<RESOURCE>[_BY_<PARAM>]`, matching the path.
- `data.ts` — reusable fixture data (typed with the generated API types from `@meldingen/api-client`) returned by handlers.
- `handlers.ts` — the list of MSW request handlers, grouped by resource and built from `ENDPOINTS` and the fixtures in `data.ts`.

## Adding a new endpoint

1. **Add the path to `endpoints.ts`**, using a key that describes the method and resource, and `:param` for path parameters:

   ```ts
   GET_MELDING_BY_MELDING_ID_ATTACHMENTS: '/melding/:id/attachments',
   ```

2. **Add fixture data to `data.ts`** if the existing fixtures don't already cover it, typed with the matching type from `@meldingen/api-client`.

3. **Add a handler to `handlers.ts`**, using `http.<method>` with the endpoint and returning `HttpResponse.json(...)` (or an empty `new HttpResponse()` for endpoints without a response body):

   ```ts
   http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
     HttpResponse.json([{ id: 42, original_filename: 'IMG_0815.jpg' }]),
   ),
   ```

   Place it under the relevant resource comment (`// Melding`, `// Labels`, etc.) to keep the list scannable.

This default handler is now active in every test in that app.

## Overriding a handler in a single test

To test a different response (an error, empty state, etc.) for one test, override the handler locally with `server.use`. It's reset automatically after the test by the `afterEach` in `vitest.setup.ts`:

```ts
server.use(
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })),
)
```
