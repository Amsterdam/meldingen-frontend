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
