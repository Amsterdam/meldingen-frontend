# Architecture

```mermaid
graph TD
    DB[("Database")] <-->|Data| BE["Backend"]
    AI -->|Text recognition| BE["Backend"]
    BE -->|Form config| PFE["
        Public Frontend

        - Meldformulier
        - Openbare kaart
        - Mijn melding
        - KTO user feedback
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
