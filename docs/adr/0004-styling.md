<!-- @license CC0-1.0 -->

# Styling

## Status

Proposed

## Context

We need a styling approach for our frontend.
We prefer something that’s as close to vanilla css as possible, to avoid a dependency on third-party packages.
Because we chose Next js in an [earlier architectural decision](./0001-library-and-framework.md),
simply using vanilla css (with a BEM methodology for example) doesn’t really work.
Next js uses CSS Modules by default for component level styling to ensure correct scoping and for performance optimalisations.

## Decision

We will use CSS Modules for our styling. This stays closest to vanilla css within the Next js framework.

## Consequences

We will have styling that is scoped to the component by default.
For extending styles we will use CSS Modules’ composition features, which strays from vanilla css.
