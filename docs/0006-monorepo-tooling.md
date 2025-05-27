# Monorepo tooling

The 3 Meldingen front-ends (Melding Form, Back Office, Admin) are stored in a single repo.
This is called a monorepo. You can find these front-ends in the `/apps` directory.

The front-ends make use of both external and internal libraries.
You can find our internal libraries in the `/libs` directory.

By separating our code like this, we hope to stimulate organizing our source code and logic into smaller,
more focused and highly cohesive units.

## PNPM

We use [PNPM](https://pnpm.io/) as the package manager for our monorepo.
It uses workspaces to manage multiple projects inside a single repository.
PNPM allows you to easily define scripts in the root which you can run for all apps.
We used NX to handle our monorepo before, but we encountered many problems and inconsistencies. So, we switched to PNPM.

### Importing from local libraries

When creating a new library, you can define a lookup location for easier imports.
We prefix all our libs with `@meldingen`, and then the name of the lib.
So in order to import from our UI library, you can use `import { Heading } from '@meldingen/ui'`.
