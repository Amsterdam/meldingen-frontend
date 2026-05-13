# Use TypeScript for type safety

## Status

Accepted on 21-3-2024

## Context

JavaScript is a weakly typed language, which can lead to type errors at runtime. As our codebase grows and code is shared across components and teams, we need a way to catch these errors early and make the contracts between parts of the code explicit.

## Options

- Continue with plain JavaScript
- Adopt [TypeScript](https://www.typescriptlang.org/), a statically typed superset of JavaScript

## Decision

We adopted TypeScript. It is the most popular and robust solution for adding type safety to JavaScript projects. It catches type errors at compile time, reduces the need for defensive programming, and makes interfaces between components explicit and verifiable.

## Consequences

- Type errors are caught at compile time rather than at runtime, reducing bugs in production.
- Interfaces between shared components are explicit and enforced by the compiler.
- Defensive programming for internal code becomes less necessary.
- TypeScript raises the entry barrier for developers who are not yet familiar with it.
