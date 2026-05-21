# Testing

We aim to have a unit test for all React components. A unit test should test functionality, not implementation details.
In other words, it should test a component the same way a user would use it.

We find elements by their accessible name (role, label, visible text) rather than test IDs. Test IDs are an implementation detail that users cannot perceive; accessible queries simultaneously verify that the component is accessible and describe user-visible behaviour.

We follow React Testing Library's [priority guide](https://testing-library.com/docs/queries/about/#priority) here.

- Tests describe observable behaviour, not component internals, so they survive refactors without modification.
- Writing tests by accessible name surfaces accessibility gaps early — if a test cannot find an element, a screen reader user likely cannot either.
- Developers must think about accessible names when building components, which raises the quality floor but requires familiarity with ARIA roles and labels.
- Test IDs are avoided; elements that are genuinely hard to query accessibly should be fixed at the component level rather than worked around with `data-testid`.
