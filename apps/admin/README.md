# Admin

The Admin application allows admins to manage the Melding Form and Back Office apps.

It allows an admin to...

- ... change the texts of the main form,
- ... build surveys for additional questions,
- ... create categories and assign these categories to surveys,
- ... create and change e-mail templates.

## Getting started

Run `npm run serve:admin` in the root directory to start the Admin app.

## Building with a base path

The app is served from `/` by default. To build for a subpath, set `VITE_BASE_PATH` at build time:

```sh
VITE_BASE_PATH=/admin/ pnpm build:admin
```

You can also set `VITE_BASE_PATH` in the Admin app's `.env` files. Use an absolute URL path, such as `/admin/`.
Asset URLs and client-side routes use this path. Changing it requires rebuilding the app.

Configure your web server to serve the build output under the same path and fall back to `index.html` for client-side routes.
For Entra authentication, include the path in `VITE_ENTRA_APP_BASE_URL` (for example, `https://example.com/admin`, without a trailing slash).
Allow the corresponding callback URL (`https://example.com/admin/auth-callback`) in your Entra application registration.
For Keycloak, allow redirect URLs under the configured path.
