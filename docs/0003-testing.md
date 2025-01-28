<!-- @license CC0-1.0 -->

# Testing

## End-to-end tests

Currently we do not have any automated end-to-end tests.
During development, we will describe which features we add to the `requirements.md` file in the docs of the respective app.
This will result in a list of features and requirements that we can test.
Initially, this testing will be done manually. Eventually, we will create automated tests for this.

## Unit tests

To ensure the quality of our code, we write unit tests for our React components.
We use [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
for this.

### Code conventions

We aim to have a unit test for all React components. A unit test should test functionality, not implementation details.
In other words, it should test a component the same way a user would use it.

For that reason, we avoid using test ids (which is something a user can’t / won’t use),
and instead find elements by their accessible name.

React Testing Library has nice [documentation on how to find elements](https://testing-library.com/docs/queries/about/#priority),
where they prioritize the queries you can use.
