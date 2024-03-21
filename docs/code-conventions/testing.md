<!-- @license CC0-1.0 -->

# Testing code conventions

## Unit tests

We aim to have a unit test for all React components. A unit test should test functionality, not implementation details.
In other words, it should test a component the same way a user would use it.

For that reason, we avoid using test ids (which is something a user can't / won't use),
and instead find elements by their accessible name.

React Testing Library has nice [documentation on how to find elements](https://testing-library.com/docs/queries/about/#priority),
where they prioritize the queries you can use.
