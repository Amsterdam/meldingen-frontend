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

## Document titles

Rendering a component in a unit test does not run Next.js metadata generation.
For melding detail subroutes, seed `document.title` in `beforeEach` with the server-rendered base title, including the layout suffix.
This also prevents title changes from leaking between tests.

```typescript
beforeEach(() => {
  document.title = 'Notitie toevoegen - Melding ABC - Gemeente Amsterdam'
})
```

Test `generateMetadata` separately in the route's `page.test.tsx`.
Component tests should verify that the base title is preserved without errors, that errors prefix it, and that it is restored when errors clear or the component unmounts.
Include a rerender with persistent errors to check that prefixes do not accumulate.

See [Document titles for melding detail subroutes](../patterns/error-handling.md#document-titles-for-melding-detail-subroutes) for the implementation pattern.
