# Melding Form

The Melding Form application allows the general public to create nuisance reports.

This is the general flow of the app:

```mermaid
graph LR
    MF["Main form"] --> ML["Text recognition algorithm"]
    ML --> AQ["Additional questions"]
    AQ --> CF["Contact form"]
    CF --> SM["Summary"]
```

## Getting started

Run `npm run dev:mf` in the root directory to start the Melding Form app.
