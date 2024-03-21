<!-- @license CC0-1.0 -->

# Styling

## Status

Proposed

## Context

We want to use linters and code formatters in our project, for a number of reasons:

- They help you catch errors early in the development process, when they are easier and cheaper to fix.
- They can help promote coding standards and best practices within a development team,
  ensuring that code is consistent and maintainable.
- They can help you identify potential security vulnerabilities in your code, reducing the risk of a breach.

We want linters for JavaScript / TypeScript files, style files and Markdown files.

## Decision

For JavaScript / TypeScript we will use ESLint and the TypeScript compiler itself.
For style files we will use Stylelint.
For Markdown files we will use Markdownlint.

We will use Prettier for code formatting of all these files.

These linters and formatters are run:

- on save (requiring some configuration by developers)
- pre-commit
- on a push to `main` or `develop`
- when opening a PR

## Consequences

It’s will be easier to have consistent, safer, better code.
It will require some configuration on the developer’s side to run these on save.
