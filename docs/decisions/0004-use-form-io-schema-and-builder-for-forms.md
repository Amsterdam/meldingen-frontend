# Use Form.io schema and builder for forms

## Status

Accepted on 16-04-2024

## Context

Forms are central to Meldingen: the Admin app lets admins create and update forms that are shown in the Melding Form app. We needed a form schema that both the front-end and back-end could use, a tool to build forms in the Admin app, and a way to render them in the Melding Form app.

## Options

- **Open Formulieren** — a Dutch government platform based on Form.io that covers form building, rendering, and submission handling. It supports far more than we need, making it too heavy for this application.
- **Form.io** — provides a JSON schema, a form builder UI, and a renderer. The schema is relatively simple and well-suited to our use case.
- **Build everything in-house** — design our own schema and build both a form builder and renderer ourselves. Building a builder is a significant amount of work for a tool that only a handful of people would use.

## Decision

We use the Form.io JSON schema and Form.io's Builder in the Admin app. We tried to use Form.io's Renderer in the Melding Form app, but it didn't integrate well with Next.js and server-side rendering, so we built [our own renderer](/libs/form-renderer) that uses the same schema.

## Consequences

- The Form.io schema is shared between front-end and back-end.
- Form building in the Admin app is handled by a maintained, ready-made tool.
- We maintain a custom renderer, which means keeping it aligned with the Form.io schema as it evolves.
- We are coupled to Form.io's schema format.
