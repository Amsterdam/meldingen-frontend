# Monorepo tooling

The 3 Meldingen front-ends (Public, Backoffice, Admin) are stored in a single repo.
This is called a monorepo. You can find these front-ends in the `/apps` directory.

The front-ends make use of both external and internal libraries.
You can find our internal libraries in the `/libs` directory.

By separating our code like this, we hope to stimulate organizing our source code and logic into smaller,
more focused and highly cohesive units.

## Nx

We use [Nx](https://nx.dev/) to stay on top of the different apps and libs in this project.
Nx does a lot of things, but we mainly use it for these reasons:

- It’s easy to scaffold a new app or lib, with a preconfigured setup for things like linting and testing.
- Because it’s easy to start a new lib, it is easier to move code out of your apps and into libs,
  resulting in a more modular organisation of our code.
  [Nx recommends having roughly 20% of your code in apps, and 80% in libs](https://nx.dev/concepts/more-concepts/applications-and-libraries#mental-model).
- It allows you to easily define scripts in the root which you can run for all apps.
- Nx caches builds and linting and testing runs, which means you spend less time waiting for these to finish.

### Importing from local libraries

When creating a new library, you can define a lookup location for easier imports.
We prefix all our libs with `@meldingen`, and then the name of the lib.
So in order to import from our UI library, you can use `import { Heading } from '@meldingen/ui'`.
