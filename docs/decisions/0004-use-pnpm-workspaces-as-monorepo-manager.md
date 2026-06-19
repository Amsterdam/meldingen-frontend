# Use pnpm workspaces as monorepo manager

## Status

Accepted on 21-01-2025

## Context

The Meldingen frontend repository contains three applications and multiple shared libraries.
We need tooling that makes it straightforward to install dependencies, run scripts from the repository root, and manage local package relationships across `/apps` and `/libs`.

We originally used [NX](https://nx.dev/) for this. Over time we encountered problems with NX: configuration complexity, inconsistent behaviour across packages, and a steep upgrade path. The overhead started outweighing the benefits.

## Options

- **NX** — status quo; feature-rich monorepo tooling with task graph, caching, and code generation.
- **pnpm workspaces** — package-manager-native workspaces without a separate orchestration layer.

## Decision

We switched to pnpm workspaces. pnpm gives us the workspace and local-package features we need without adding another orchestration layer. It keeps dependency management close to standard package-manager behavior and makes root-level scripts easy to understand and run.

## Consequences

- Workspace scripts and dependency resolution are handled entirely by pnpm — no NX config to maintain.
- We lose NX's task graph caching and code generation; build times may be slightly longer on large rebuilds.
- Learning curve for new developers is less steep with pnpm versus NX.
- We've kept the NX convention of separating `/apps` from `/libs`, but adding a new app or lib is a manual, copy-paste operation.
