<!-- @license CC0-1.0 -->

# Testing

## Status

Proposed

## Context

We want to write maintainable unit tests for our React components.
We should be able to test functionality without testing implementation details.
We should be able to write tests in a React-like way.
The solution should be well-known, so it’s easier for new / other developers to understand it.

## Decision

We will use Vitest with React Testing Library for our tests.
Vitest is faster and easier to setup than Jest,
and React Testing Library is a light-weight solution for writing tests in a React-like way.

## Consequences

We will be able to write tests fairly quickly, in the same React way as our components.
