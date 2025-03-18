<!-- @license CC0-1.0 -->

# Meldingen front-end architecture

Meldingen is an application with three separate front-ends:

- Public: where the general public can create nuisance reports.
- Back Office: where professionals can handle these reports.
- Admin: where admins can manage the Public and Back Office apps.

```mermaid
graph TD
    DB[("Database")] <-->|Data| BE["Back-end"]
    AI -->|Tekstherkenning| BE
    BE -->|Formulier config| PFE["Public Front-end: Meldformulier, Openbare kaart, Mijn melding"]
    PFE -->|Melding| BE
    BE -->|Formulier config| BFE["Back Office Front-end: Maken en afhandelen melding"]
    BE -->|Teksten| PFE
    BE <-->|Status van melding| BFE
    BE <-->|Teksten| AFE["Admin Front-end: Form builder, teksten van Public front-end & mails"]
    BE <-->|Formulier config| AFE
    PFE <-.-> BOB
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
8. [Authentication](./0008-authentication.md)
9. [Directory structure](./0009-directory-structure.md)
10. [Progressive enhancement](./0010-progressive-enhancement.md)
