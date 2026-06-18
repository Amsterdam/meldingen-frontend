# Use PNPM workspaces for the frontend monorepo

## Status

Accepted on 18-06-2026

## Context

The Meldingen frontend codebase contains three applications and multiple shared libraries that are developed and released from one repository. We need tooling that makes it straightforward to install dependencies, run scripts from the repository root, and manage local package relationships across `/apps` and `/libs`.

We previously used NX to coordinate work in the monorepo. In practice, that setup introduced enough inconsistencies and maintenance overhead that it became a recurring source of friction for day-to-day frontend development.

## Options

- Continue using NX
- Use PNPM workspaces directly

Both options support working in a monorepo with shared packages. The main difference is how much tooling and indirection we want on top of the package manager.

## Decision

We use [PNPM](https://pnpm.io/) workspaces as the monorepo foundation for the frontend repository.

PNPM gives us the workspace and local-package features we need without adding another orchestration layer. It keeps dependency management close to standard package-manager behavior and makes root-level scripts easy to understand and run.

## Consequences

- Dependencies for all apps and libraries are installed and managed through PNPM workspaces.
- Root scripts can coordinate common tasks such as development, testing, linting, and builds across the repository.
- Shared frontend code lives in local packages under `/libs` and is consumed through workspace package imports such as `@meldingen/ui`.
- We avoid the extra abstraction of NX, but we also give up NX-specific features and conventions.
