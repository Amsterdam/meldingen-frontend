# Use Next.js as front-end framework

## Status

Accepted on 21-3-2024

## Context

Our applications are built with React, the standard UI library for the City of Amsterdam. We needed a full-stack web framework to handle routing, data fetching, caching, and server-side rendering for the Melding Form and Back Office applications.

## Options

- [Next.js](https://nextjs.org/)
- [Remix](https://remix.run/)

Both are full-stack web frameworks recommended by the React team, capable of setting up performant websites.

## Decision

We chose Next.js. It is by far the more popular of the two frameworks, which means a larger ecosystem, more community support, and it is easier to find developers familiar with it.

## Consequences

- Routing, data fetching, caching, and server-side rendering are handled by Next.js across Melding Form and Back Office.
- The large Next.js ecosystem and community reduce the cost of onboarding new developers.
- We are dependent on a third party for important parts of our application. Breaking changes and shifts in project conventions can mean substantial rework.
