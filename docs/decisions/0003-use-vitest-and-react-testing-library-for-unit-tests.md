# Use Vitest and React Testing Library for unit tests

## Status

Accepted on 21-03-2024

## Context

We need a unit testing strategy for our React components. Our organisation [prescribes](https://developers.amsterdam/docs/general/testing) React Testing Library with either Jest or Vitest.

## Options

- Jest: the long-standing standard; requires additional configuration to work with ESM
- Vitest: faster, more modern test runner with a Jest-compatible API; no extra bundler configuration needed

## Decision

We chose Vitest, for its easier configuration and speed.

## Consequences

- Tests run fast: Vitest parallelises across worker threads and only re-runs files affected by a change.
- Vitest is ESM-native, so no transpilation overhead
- The API is largely Jest-compatible, but there are small differences — most notably `vi` instead of `jest` for mocks and spies.
