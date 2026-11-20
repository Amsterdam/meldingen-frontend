# End-to-end tests

Playwright tests live in this separate workspace and run separately from Vitest.
See the [testing conventions](../docs/code-conventions/testing.md) for guidance on writing and organising tests.

## Getting started

Run the following commands from the repository root.
After installing workspace dependencies with `pnpm install`, install the browsers:

```sh
pnpm --filter e2e exec playwright install chromium firefox webkit
```

On Linux CI, also install the browser system dependencies:

```sh
pnpm --filter e2e exec playwright install --with-deps chromium firefox webkit
```

## Running tests

| Scope                        | Command                                       |
| ---------------------------- | --------------------------------------------- |
| All tests                    | `pnpm test:e2e`                               |
| Interactive UI               | `pnpm test:e2e:ui`                            |
| Back Office in Firefox       | `pnpm test:e2e --project=back-office-firefox` |
| Melding Form across browsers | `pnpm test:e2e --project='melding-form-*'`    |
| Both apps in Firefox         | `pnpm test:e2e --project='*-firefox'`         |

## Local servers and authentication

The configuration starts Melding Form on `http://127.0.0.1:3100` and Back Office on
`http://localhost:3102` automatically.
It reuses an existing Melding Form server on that port outside CI, but always starts a fresh Back Office
server with the configured test URLs.
Both apps use separate `.next-e2e` build directories so they can run alongside the normal dev servers.
The test servers set local backend and frontend URLs and enable these directories with `PLAYWRIGHT_TEST=1`.
Back Office tests sign in to Keycloak automatically through the browser, using the same flow locally
and against deployed environments. Start the normal local backend and Keycloak services first, and
configure Back Office authentication as described in the
[authentication documentation](../docs/patterns/session-management-and-authentication.md#back-office).
Local tests use the documented Keycloak development account automatically (`meldingen_user` / `password`).
Set `PLAYWRIGHT_USERNAME` and `PLAYWRIGHT_PASSWORD` to override it when using a different local test account.
No credential environment variables are needed for the standard local setup:

```sh
pnpm test:e2e
```

The Keycloak client must allow callbacks to `http://localhost:3102/api/auth/callback/keycloak`.
Playwright saves traces for failed tests in `e2e/test-results`.

## Authentication in UI mode

Launch UI mode directly:

```sh
pnpm test:e2e:ui
```

The Back Office authentication fixture signs in automatically before each test, in both CLI and UI mode.
No manual login, setup-project run, or saved authentication file is needed, including on reruns.

## Testing a deployed environment

Set `PLAYWRIGHT_MELDING_FORM_BASE_URL` and `PLAYWRIGHT_BACK_OFFICE_BASE_URL` to the deployed app URLs.
Include a trailing slash and any deployment base path, for example `https://acc.example.org/back-office/`.
Each configured URL disables the corresponding local server; omitted URLs retain local testing.
Setting a URL does not deploy the apps.

For deployed Back Office tests, also supply `PLAYWRIGHT_USERNAME` and `PLAYWRIGHT_PASSWORD` for a dedicated
Keycloak test user. Store the password as a pipeline secret and explicitly map it into the test step's environment.
Local development credentials are never used as defaults when `PLAYWRIGHT_BACK_OFFICE_BASE_URL` is set.
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
Authentication state is passed to the test in memory, without saving session cookies to disk.
The authentication fixture uses a separate browser context without traces, screenshots, or video
to avoid recording login credentials.
Test traces can still contain authenticated requests and data, so restrict access to pipeline artifacts.
The deployment pipeline must run these tests after ACC is available; triggering tests from ACC alone does not select it.
