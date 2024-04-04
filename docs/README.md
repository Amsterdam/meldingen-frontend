<!-- @license CC0-1.0 -->

# Meldingen front-end architecture

Meldingen is an application with three separate front-ends:

- Public: where the general public can create notifications.
- Backoffice: where professionals can handle these notifications.
- Admin: where admins can manage the Public and Backoffice apps.

```mermaid
graph TD
    DB[("Database")] <-->|Data| BE["Backend"]
    AI -->|Text recognition| BE["Backend"]
    BE -->|Form config| PFE["
        Public Frontend

        - Meldformulier
        - Openbare kaart
        - Mijn melding
    "]
    PFE -->|Signal| BE
    BE -->|Form config| BFE["
        Backoffice Frontend

        - Maken en afhandelen melding
        - Dashboard
    "]
    BE -->|CMS config| PFE
    BE <-->|Signal status| BFE
    BE <-->|CMS config| AFE["
        Admin Frontend

        - Form builder
        - CMS texts public FE & mails
    "]
    BE <-->|Form config| AFE
    PFE <-.-> BOB
    BFE <-.-> AMBT["Ambtenaar"]
    BFE <-.-> EXT["Extern"]
    AFE <-.-> FB["Functioneel beheer"]
```

## Further documentation

1. [Library and framework](./0001-library-and-framework.md)
2. Typescript
3. Testing
4. Styling
5. Linting
6. Monorepo tooling
7. Authentication
