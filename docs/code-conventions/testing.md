# Testing

We test user-visible behaviour and important business rules, not implementation details. React components should have appropriate behaviour coverage, but a separate isolated test for every component is not the goal. Choose the smallest test scope that can catch the regression, and include tests that exercise collaborating pieces together.

## Test layers

All three apps (Melding form, Back office, and Admin) and the shared libraries use Vitest. React component tests use React Testing Library (RTL). Melding form and Back office also have shared MSW setups for frontend integration tests; Admin and the libraries do not currently have shared MSW servers.

| Layer       | What it exercises                                                      | Example                                                                                        |
| ----------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Unit        | One function or isolated piece of logic                                | Conditional form wizard navigation with different answers                                      |
| Component   | A rendered React component through its user interface                  | Field labels, error messages, and user interactions                                            |
| Integration | Multiple real pieces collaborating, with external boundaries mocked    | A form submission through React state, a server action, and the API client, with MSW responses |
| Browser E2E | A running application in a real browser, including framework behaviour | Completing and submitting a report across multiple pages                                       |

Component tests are split into unit tests and integration tests based on their scope; "component" is not a separate filename category. Unit tests isolate the component's own rendering and behaviour, mocking collaborating hooks or actions where needed. Integration tests exercise the component together with real collaborating logic, such as an upload hook or a server action and API client, while mocking external boundaries.

A server-action test using the real API client and MSW provides frontend integration coverage, but does not verify compatibility with the running back end. A test does not need to make a network request to be an integration test.

### Choosing coverage

- Use focused unit tests for business rules, boundary values, and combinations such as conditional panel navigation.
- Use component tests for accessible output and interactions. Prefer `userEvent.setup()` and awaited user interactions over invoking component handlers directly.
- Use integration tests for representative submissions, request payloads, validation recovery, and coordination between components and actions. Keep edge-case combinations in focused tests instead of repeating every case at every layer.
- Use browser E2E tests for critical complete journeys, cookies, navigation, hydration, and real server-action transport. Browser E2E is not currently configured in this repo; it remains a separate addition. Include a JavaScript-disabled public-form journey to verify progressive enhancement when adding it.

Coverage thresholds in each package's Vite configuration are regression guards, not proof that a workflow works. Prioritize meaningful assertions and risky behaviour over increasing percentages.

## Location and naming

Keep tests beside the code they exercise in `apps/` or `libs/`. For component tests, use these filenames:

- Unit tests: `ComponentName.test.tsx` (or `.test.ts` when JSX is not needed).
- Integration tests: `ComponentName.integration.test.tsx` (or `.integration.test.ts` when JSX is not needed).

Keep setup and mocks appropriate to each scope in its own file, and use descriptive `describe` blocks to group related behaviour. Do not duplicate every unit-test case in the integration suite; focus integration tests on the collaboration between pieces.

We are adopting this split gradually. When adding or modifying component tests in a PR, separate unit and integration coverage for the tests being touched, moving integration tests to the `.integration.test` file. Existing mixed test files may remain until they are touched. Do not perform a repo-wide rename or split unrelated tests as part of the migration.

For a future browser suite, use a root-level `e2e/` directory grouped by app, with shared setup for journeys that cross app boundaries. Run it separately from Vitest.

## Mocking boundaries

Keep real child components, React hooks, validation, and the API client when testing their collaboration. Mock external dependencies and framework boundaries that are unavailable in jsdom, such as request cookies.

Mocking `useActionState` is useful for focused rendering tests of pending and error states, but does not prove that submitting the form produces those states. Complement these tests with representative interactions using the real hook and action.

Preserve the behaviour of mocked boundaries. For example, Next.js `redirect()` throws to stop execution; a mock that simply returns can allow impossible code paths. When exercising a real React action, handle the redirect with a test boundary rather than changing the component to accommodate the mock.

For authentication, control time and environment variables and exercise the real callbacks with MSW token responses. Restore time and environment changes after each test. Cover valid and expired tokens, refresh success and failure, and provider-specific reauthentication behaviour.

## Querying elements

We find elements by their accessible name (role, label, or visible text), following React Testing Library's [priority guide](https://testing-library.com/docs/queries/about/#priority).

We do not use `data-testid`. Test IDs are an implementation detail that users cannot perceive; querying by accessible name checks important accessibility semantics and describes user-visible behaviour at the same time. These queries do not replace browser accessibility checks or manual keyboard testing.

If an element is hard to query accessibly, fix the component rather than working around it with a test ID.

## Mocking API requests

For tests exercising real network request behaviour, use [MSW](https://mswjs.io/) rather than mocking `fetch` or the API client directly with `vi.mock`. MSW intercepts requests at the network level, so the same client code runs in tests as in production; only the response is mocked. Isolated tests can still mock injected dependencies, as Admin's data-provider tests do with their HTTP client.

Melding form and Back office configure `onUnhandledRequest: 'error'` in their shared MSW setups so unexpected requests are rejected rather than sent to a real service. Admin and library suites do not currently have this safeguard. When adding an MSW server to another suite, use the same strict handling. Add an explicit handler instead of allowing unmatched requests. In submission tests, assert important request bodies and resulting UI or navigation, not just that a request occurred.

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

### Authentication in UI mode

Playwright UI mode does not run setup projects automatically. Before running Back Office tests:

1. Start the UI with `pnpm test:e2e:ui`.
2. Enable `back-office-auth` in the UI's project filters.
3. Click the run button next to `auth.setup.ts` and wait for it to pass.
4. Disable `back-office-auth` in the filters again and run the desired Back Office tests.

The setup creates `e2e/playwright/.auth/back-office.json`. Without it, Back Office tests fail with
`Error reading storage state` and `ENOENT`.
Repeat the setup whenever you restart local UI mode: each launch generates a new session secret,
so authentication state from a previous launch is no longer valid.
Run setup inside the same UI session, not in a separate CLI run, so the session secret matches the running server.
For deployed environments, rerun setup when the saved session expires.

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
Test traces can still contain authenticated requests and data, so restrict access to pipeline artifacts.
The deployment pipeline must run these tests after ACC is available; triggering tests from ACC alone does not select it.
