<!-- @license CC0-1.0 -->

# Meldingen front-end architecture

Meldingen is an application with three separate front-ends:

- Melding Form: where the general public can create nuisance reports.
- Back Office: where professionals can handle these reports.
- Admin: where admins can manage the Melding Form and Back Office apps.

```mermaid
graph TD
    DB[("Database")] <-->|Data| BE["Back-end"]
    AI -->|Tekstherkenning| BE
    BE -->|Formulier config| MFE["Melding Form Front-end: Meldformulier, Openbare kaart, Mijn melding"]
    MFE -->|Melding| BE
    BE -->|Formulier config| BFE["Back Office Front-end: Maken en afhandelen melding"]
    BE -->|Teksten| MFE
    BE <-->|Status van melding| BFE
    BE <-->|Teksten| AFE["Admin Front-end: Form builder, teksten van Melding Form front-end & mails"]
    BE <-->|Formulier config| AFE
    MFE <-.-> BOB
    BFE <-.-> AMBT["Ambtenaar"]
    BFE <-.-> EXT["Extern"]
    AFE <-.-> FB["Functioneel beheer"]
```

## Further documentation

1. [Libraries and frameworks](./0001-libraries-and-frameworks.md)
2. [Type safety](./0002-type-safety.md)
3. [Testing](./0003-testing.md)
4. [Styling](./0004-styling.md)
5. [Linting](./0005-linting.md)
6. [Monorepo tooling](./0006-monorepo-tooling.md)
7. [Forms](./0007-forms.md)
8. [Session management and authentication](./0008-session-management-and-authentication.md)
9. [Directory structure](./0009-directory-structure.md)
10. [Progressive enhancement](./0010-progressive-enhancement.md)
11. [Error handling](./0011-error-handling.md)
