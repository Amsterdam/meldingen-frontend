<!-- @license CC0-1.0 -->

# Library and framework for our frontend

## Status

Proposed

## Context

We need to choose a library and framework for our frontend.
It needs to be fast, modern, well maintained and take care of the heavy lifting with regards to routing,
data fetching, caching, server side rendering and the like.

The framework needs to be well-known and opinionated, so it’s easier for others to grok how it works.

## Decision

We will use React with Next js as our frontend framework.

We’ve chosen React because it is the standard UI library for the City of Amsterdam.
This means it will be easier to find developers that can work on the project, which in turn makes it easier to maintain.

We considered the following frameworks (recommended by the React team):

- Next js
- Remix

Both are full stack web frameworks, capable of setting up very performant websites.
Next is by far the more popular framework, which is why we chose it.

## Consequences

### Pros

- Having an opinionated framework means we don’t have to put a lot of thought into setting up our project structure.
- Next js takes care of the heavy lifting with regards to routing, data fetching, caching, server side rendering etc.
- React and Next js are very well know, making it easier to find developers who can work on the project.

### Cons

- React is not vanilla js, so you’re dependent on a third-party project and developers need to know React in order to contribute.
- Next js is opinionated, which means you have to at least somewhat follow their project structure and ways of working.
