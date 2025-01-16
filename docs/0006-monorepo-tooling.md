# Monorepo tooling

The 3 Meldingen front-ends (Public, Backoffice, Admin) are stored in a single repo.
This is called a monorepo. You can find these front-ends in the `/apps` directory.

The front-ends make use of both external and internal libraries.
You can find our internal libraries in the `/libs` directory.

By separating our code like this, we hope to stimulate organizing our source code and logic into smaller,
more focused and highly cohesive units.

## PNPM

We use [PNPM](https://pnpm.io/) as package manager of our monorepo. It uses workspaces to manage dependecies
and let them interact with each other. Previously we used NX to manage our monorepo but faced a lot of issues
and inconsistencies with it. Therefore we moved to PNPM.

### Importing from local libraries

When creating a new library, you can define a lookup location for easier imports.
We prefix all our libs with `@meldingen`, and then the name of the lib.
So in order to import from our UI library, you can use `import { Heading } from '@meldingen/ui'`.
