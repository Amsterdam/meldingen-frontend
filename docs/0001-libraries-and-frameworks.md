<!-- @license CC0-1.0 -->

# Libraries and frameworks for our applications

Our applications are built using [React](https://react.dev/) as the frontend library.

React is the standard UI library for the City of Amsterdam, making it easier to find developers and maintain the project.
Also, the [Amsterdam Design System](https://github.com/amsterdam/design-system) provides React components that we can utilize.

The Public and Back Office applications use React with [Next.js](https://nextjs.org/) as the frontend framework,
handling routing, data fetching, caching, and server-side rendering.

The Admin application is based on [React-admin](https://marmelab.com/react-admin/) and
uses [Vite](https://vitejs.dev/) as a bundler for a client-side single-page application.

Initially, we tried using Next.js for the Admin app but encountered performance issues with React-admin,
so we switched to Vite.

## Decision

We considered the following frameworks (recommended by the React team):

- [Next.js](https://nextjs.org/)
- [Remix](https://remix.run/)

Both are full stack web frameworks, capable of setting up very performant websites.
Next is by far the more popular framework, which is why we chose it.

For our Admin application we initially started with Next.js as well.
However, Next.js didn't play well with React-admin, causing performance issues.
The benefits of React-admin outweigh the benefit of using the same framework for all our apps,
so we dropped Next.js and migrated to Vite.
