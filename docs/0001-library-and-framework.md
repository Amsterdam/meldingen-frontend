<!-- @license CC0-1.0 -->

# Library and framework for our applications

All of our applications use [React](https://react.dev/) with [Next.js](https://nextjs.org/) as their frontend framework.

We’ve chosen React because it is the standard UI library for the City of Amsterdam.
This means it will be easier to find developers that can work on the project, which in turn makes it easier to maintain.
Another benefit is that the [Amsterdam Design System](https://github.com/amsterdam/design-system) has React components,
which we can use.

Next.js takes care of the heavy lifting with regards to routing, data fetching, caching, server side rendering etc.

Our Admin app is a completely client side app, which makes Next.js an unlikely choice.
The reason we've chosen Next.js for that app as well is because it works well with [NextAuth.js](https://next-auth.js.org/).
This way, we can keep our authentication the same for all our apps.
NextAuth.js is planning to remove their dependency on Next.js.
When that is stable, we will reconsider this decision.

## Decision

We considered the following frameworks (recommended by the React team):

- [Next.js](https://nextjs.org/)
- [Remix](https://remix.run/)

Both are full stack web frameworks, capable of setting up very performant websites.
Next is by far the more popular framework, which is why we chose it.
