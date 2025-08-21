# Meldingen front-end

TEST DO NOT MERGE 2

Hi and welcome to the Meldingen front-end repository!

This monorepo houses three separate front-ends:

- Melding Form: where the general public can create and view nuisance reports.
- Back Office: where professionals can handle these reports.
- Admin: where admins can manage the Melding Form and Back Office apps.

[Read the docs](./docs/README.md) for more information on the project architecture and plug-in choices.

## Local development

### In a local Node environment

To run these front-ends in a local Node environment, you need [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/).
The required versions of these are defined [here](https://github.com/Amsterdam/meldingen-frontend/blob/main/package.json#L8).

If you have those, you can:

- Install all dependencies with `pnpm install`
- Start all applications in development mode with `npm run dev`
- Build all applications for production using `npm run build`

### In a Docker container

You can run production builds of the applications in Docker containers.
Make sure you have [the back-end](https://github.com/amsterdam/meldingen) running in a container before running the front-ends.
The back-end Dockerfile is responsible for creating the Docker network necessary for use in the front-ends.

When you do, you can:

- Build the containers with `docker compose build`
- Start a production build of all applications with `docker compose up -d`

## Code of Conduct

We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.
Read [our Code of Conduct](https://github.com/Amsterdam/.github/blob/main/CODE_OF_CONDUCT.md) if you haven’t already.

## License

This project is free and open-source software licensed under the
[European Union Public License (EUPL) v1.2](LICENSE.md) or higher.
Documentation is licensed as [Creative Commons Zero 1.0 Universal (`CC0-1.0`)](https://creativecommons.org/publicdomain/zero/1.0/legalcode).
