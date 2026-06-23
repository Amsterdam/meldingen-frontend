# Use Vite for the Admin application

## Status

Accepted on 16-07-2025

## Context

The Admin application is built on [React-admin](https://marmelab.com/react-admin/), a framework for building admin interfaces. We initially used Next.js as the bundler and runtime, consistent with our other applications (see [0001](0001-use-next-js-as-front-end-framework.md)).

Next.js caused significant performance issues when combined with React-admin. React-admin is designed for client-side single-page applications and does not benefit from Next.js's server-side rendering features; the combination created unnecessary overhead.

## Options

- Keep Next.js and work around the performance issues
- Switch to [Vite](https://vitejs.dev/) as a client-side SPA bundler

## Decision

We switched to Vite. The benefits of React-admin outweigh the benefit of using the same framework across all applications. Vite is a lightweight, fast bundler well-suited to client-side SPAs, and it resolves the performance issues without sacrificing any React-admin functionality.

## Consequences

- Vite's fast dev server and build times improve the developer experience for Admin-specific work.
- The Admin application uses a different build toolchain than Melding Form and Back Office, which adds a small amount of context-switching overhead for developers working across apps.
