<!-- @license CC0-1.0 -->

# Library and framework for our applications

Our Admin is based on [React Admin](https://marmelab.com/react-admin/) and completely client side.
We tried to use NextJS to keep the framework consistent throughout the codebase but ran into performace issues.
Therefore we use [Vite](https://vitejs.dev/) to bundle the application.

Our Public App can benifit from server side rendering.
Therefore we chose [React](https://react.dev/) with [Next.js](https://nextjs.org/) as its frontend framework.

We’ve chosen React because it is the standard UI library for the City of Amsterdam.
This means it will be easier to find developers that can work on the project, which in turn makes it easier to maintain.
Another benefit is that the [Amsterdam Design System](https://github.com/amsterdam/design-system) has React components,
which we can use.

Next.js takes care of the heavy lifting with regards to routing, data fetching, caching, server side rendering etc.

## Decision

We considered the following frameworks (recommended by the React team):

- [Next.js](https://nextjs.org/)
- [Remix](https://remix.run/)

Both are full stack web frameworks, capable of setting up very performant websites.
Next is by far the more popular framework, which is why we chose it.
