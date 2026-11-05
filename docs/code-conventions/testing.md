# Testing

We aim to have a unit test for all React components. A unit test should test functionality, not implementation details.
In other words, it should test a component the same way a user would use it.

## Querying elements

We find elements by their accessible name (role, label, or visible text), following React Testing Library's [priority guide](https://testing-library.com/docs/queries/about/#priority).

We do not use `data-testid`. Test IDs are an implementation detail that users cannot perceive; querying by accessible name verifies accessibility and describes user-visible behaviour at the same time. A useful side-effect: if a test cannot find an element, a screen reader user likely cannot either.

If an element is hard to query accessibly, fix the component rather than working around it with a test ID.

## Mocking API requests

We mock API requests with [MSW](https://mswjs.io/) rather than mocking `fetch` or the API client directly with `vi.mock`. MSW intercepts requests at the network level, so the same client code runs in tests as in production; only the response is mocked.

See [Mocking API requests](../patterns/mocking-api-requests.md) for how this is set up and how to add a new endpoint.

## End-to-end tests

Playwright tests live in the separate `e2e` workspace.
They run separately from the unit tests.

Tests are grouped by app in `e2e/melding-form` and `e2e/back-office`.
Each app has its own projects and base URL, sharing desktop Chromium, Firefox, and WebKit,
plus Mobile Chrome (Pixel 7) and Mobile Safari (iPhone 13) using device emulation.
The `back-office-auth` setup project runs `back-office/auth.setup.ts` once before the Back Office browser projects.
It saves an authenticated session that those projects reuse through Playwright's `storageState` option.
Tests import `test` and `expect` directly from `@playwright/test`.

After installing workspace dependencies with `pnpm install`, install the browsers:

```sh
pnpm --filter e2e exec playwright install chromium firefox webkit
```

Run the end-to-end tests from the repository root:

```sh
pnpm test:e2e
```

For Playwright's interactive UI, use `pnpm test:e2e:ui`.
To run a single app and browser, use `pnpm test:e2e --project=back-office-firefox`.
To run one app across all browsers, use `pnpm test:e2e --project='melding-form-*'`.
To run Firefox for both apps, use `pnpm test:e2e --project='*-firefox'`.
On Linux CI, install the browsers and their system dependencies with
`pnpm --filter e2e exec playwright install --with-deps chromium firefox webkit`.

The configuration starts Melding Form on `http://127.0.0.1:3100` and Back Office on
`http://127.0.0.1:3102` automatically.
It reuses an existing Melding Form server on that port outside CI, but always starts a fresh Back Office
server so its test-only session secret matches the tests.
Both apps use separate `.next-e2e` build directories so they can run alongside the normal dev servers.
The test servers set local backend and frontend URLs and enable these directories with `PLAYWRIGHT_TEST=1`.
The smoke tests check the Melding Form cookie-error page and both apps' not-found pages without a running backend.
The Back Office test uses an encrypted NextAuth session cookie with a randomly generated test-only secret
shared with its test server. This tests the real authentication middleware without requiring a running identity provider.
Playwright saves traces for failed tests in `e2e/test-results`.

### Testing a deployed environment

Set `PLAYWRIGHT_MELDING_FORM_BASE_URL` and `PLAYWRIGHT_BACK_OFFICE_BASE_URL` to the deployed app URLs.
Include a trailing slash and any deployment base path, for example `https://acc.example.org/back-office/`.
Each configured URL disables the corresponding local server; omitted URLs retain local testing.
Setting a URL does not deploy the apps.

For deployed Back Office tests, also supply `PLAYWRIGHT_USERNAME` and `PLAYWRIGHT_PASSWORD` for a dedicated
Keycloak test user. Store the password as a pipeline secret and explicitly map it into the test step's environment.
The user must be allowed to sign in with a username and password without interactive MFA or required account actions.
The login helper supports the standard English and Dutch Keycloak login labels.

```sh
PLAYWRIGHT_MELDING_FORM_BASE_URL=https://meldingen.acc.example.org/ \
PLAYWRIGHT_BACK_OFFICE_BASE_URL=https://back-office.acc.example.org/ \
pnpm test:e2e
```

This command assumes the test username and password are already provided in the environment.
The deployed app keeps its existing Keycloak client configuration; Playwright does not need its client secret,
token endpoint, or NextAuth secret. Tests sign in through NextAuth and Keycloak in the browser, then verify
that NextAuth exposes a valid session before running assertions.
Authentication state is saved to `e2e/playwright/.auth/back-office.json` and regenerated on each run.
This directory is gitignored: it contains sensitive session cookies and must not be published as a pipeline artifact.
The authentication setup disables traces, screenshots, and video to avoid recording login credentials.
In Playwright UI mode, run the `back-office-auth` setup project before running Back Office tests.
Test traces can still contain authenticated requests and data, so restrict access to pipeline artifacts.
The deployment pipeline must run these tests after ACC is available; triggering tests from ACC alone does not select it.
