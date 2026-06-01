# Link Back Office to Melding Form to create Melding as Behandelaar

## Status

Accepted on 01-06-2026

## Context

A Behandelaar should be able to create a Melding from the Back Office. The flow is largely the same as for a Melder, but a Behandelaar can set additional metadata such as the source and urgency of a Melding.

## Options

- **Rebuild the Melding Form flow in Back Office** — copy the existing flow into the Back Office codebase.
- **Link from Back Office to Melding Form** — reuse the existing Melding Form with small, mostly visual, Back Office–specific changes.
- **Embed Melding Form via iframe** — load a section of the Melding Form inside the Back Office (POC: [#1200](https://github.com/Amsterdam/meldingen-frontend/pull/1200)).
- **Import Melding Form via ESModules** — share code between apps at build time (POC: [#1201](https://github.com/Amsterdam/meldingen-frontend/pull/1201)).

## Decision

We chose to link from Back Office to Melding Form and back.

Rebuilding the flow in Back Office would introduce significant duplication and inevitable drift between the two implementations, which is not manageable long-term.

The iframe approach caused persistent issues with assets not loading correctly and with URLs and URL parameters not working as expected.

The ESModule approach created a tight coupling between two apps that should be independent, and produced build-time issues that proved difficult to resolve.

## Consequences

- The Melding Form contains extra code to adjust its appearance and behaviour when accessed from the Back Office.
- Both the Melding Form and the Back Office must be running locally when working on the Behandelaar Melden flow.
- Part of the Back Office's Melden flow lives in a separate app.
- Changes to the Melding Form automatically apply to the Back Office Melden flow.
