# Getting started

## Prerequisites

You need [Node.js](https://nodejs.org/) and the back-end running locally.

We recommend [nvm](https://github.com/nvm-sh/nvm) to manage Node versions. With nvm, switch to the correct version using the project's `.nvmrc`:

```sh
nvm install
```

For the back-end, follow the [back-end setup guide](https://github.com/Amsterdam/meldingen/blob/main/docs/development/setup.md) before continuing.

## In a local Node environment

### Package manager

This project uses [pnpm](https://pnpm.io/). Install it via [Corepack](https://nodejs.org/api/corepack.html), which is bundled with Node.js:

```sh
corepack enable
```

Corepack activates the correct pnpm version automatically based on the `packageManager` field in `package.json`.

Do not use `npm install -g pnpm` – that installs a different version and may cause errors.

Do not use `npm install` inside this project – it does not understand the pnpm workspace structure and will produce a broken installation.

### Setup

Install all dependencies:

```sh
pnpm install
```

### Running the apps

This is a monorepo containing three apps:

| App          | Description                                          | Dev URL               |
| ------------ | ---------------------------------------------------- | --------------------- |
| Melding Form | Public-facing form for creating Meldingen            | http://localhost:3000 |
| Back Office  | For professionals handling Meldingen                 | http://localhost:3002 |
| Admin        | For admins managing the Melding Form and Back Office | http://localhost:3001 |

Start all three in development mode:

```sh
npm run dev
```

Or start a single app:

```sh
npm run dev:mf     # Melding Form
npm run dev:bo     # Back Office
npm run dev:admin  # Admin
```

### Testing and linting

Run all tests:

```sh
npm run test
```

Check for linting, formatting, and type errors:

```sh
npm run lint
```

Auto-fix what can be fixed:

```sh
npm run lint-fix
```

### Building for production

Build all apps:

```sh
npm run build
```

## In a Docker container

You can run production builds of the apps in Docker containers. Make sure the [back-end](https://github.com/amsterdam/meldingen) is running in a container first — its Dockerfile creates the Docker network the front-ends require.

Build the containers:

```sh
docker compose build
```

Start all apps:

```sh
docker compose up -d
```

The apps are available on the same ports as in local development (see table above).

## Repository layout

This repository is a monorepo.

- Applications live in `/apps`
- Shared frontend packages live in `/libs`

This structure treats large internal modules like external packages, which enforces cleaner boundaries and a more deliberate public interface.

Local packages are imported through the `@meldingen/*` workspace scope. For example:

```ts
import { Heading } from '@meldingen/ui'
```
