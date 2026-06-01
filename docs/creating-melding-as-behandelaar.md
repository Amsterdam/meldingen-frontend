# Creating a Melding as a Behandelaar

A Behandelaar creates a Melding by starting in the Back Office app and continuing in the Melding Form app. The two apps communicate through URL parameters and a session cookie. This document describes how the flow works and where the non-obvious parts are.

See [XXXX-link-back-office-to-melding-form-to-create-melding-as-behandelaar.md](decisions/XXXX-link-back-office-to-melding-form-to-create-melding-as-behandelaar.md) for why this architecture was chosen.

---

## Step-by-step

### 1. Back Office `/melden`

The Behandelaar creates a Melding and is allowed to set some Melding metadata, like source, urgency, and labels. This form lives entirely in `apps/back-office/src/app/melden/`.

On submit, the server action in `actions.ts`:

1. Creates (or updates) the Melding via the API — this gives back an `id`, `token`, `public_id`, `created_at`, and an optional `classification`.
2. Immediately patches the Melding with `source`, `urgency`, and `label` in a second API call.
3. Redirects to an API route of the regular Melding Form with some URL parameters: `/back-office-entry?id=…&token=…&public_id=…&created_at=…[&classification_id=…]`.

At this point the Melding already exists in the database with all Back Office metadata set. The Melding Form app will not modify this metadata.

### 2. Melding Form `back-office-entry` route handler

`apps/melding-form/src/app/back-office-entry/route.ts` is a Next.js Route Handler (not a page). It:

1. Reads `id`, `token`, and `classification_id` from the query string.
2. Sets three session cookies (`id`, `token`, `source=back-office`) with a 1-day TTL.
3. Clears the `LAST_PANEL_PATH` cookie (see gotcha below).
4. Calls `resolveClassificationRedirect()` to determine where to send the user next.
5. Redirects to either `/aanvullende-vragen/…` or `/locatie` (so the root (`/`) is skipped).

### 3. Melding Form pages

From here the Behandelaar follows the same steps as a regular Melder: additional questions (if any), location, etc. The `(general)` layout reads the `source` cookie and renders `BackOfficeLayout` instead of `RegularLayout` when the value is `back-office`. This affects the header and shows a menu.

The back-navigation links that would normally send the user back to the root now send the user back to Back Office `/melden` with URL parameters, so the Back Office form can be pre-filled with the existing Melding.

### 4. Summary and completion

On the summary page the Behandelaar submits the final form. The server action in `samenvatting/actions.ts`:

1. Deletes stale answers.
2. Calls the submit API endpoint.
3. **Deletes all session cookies.**
4. Redirects to `/bedankt?created_at=…&public_id=…&id=…&source=back-office`.

The `/bedankt` page reads `source` from the URL (not from a cookie, because they were just deleted) and renders `BackOfficeLayout`. It shows links to the Melding detail page and `/melden` in the Back Office.

---

## Gotchas

### The Melding is created in the Back Office, not in the Melding Form

Source and urgency are set before the user ever reaches the Melding Form. The Melding Form only handles location, attachments, and additional questions. If you are looking for where source or urgency is stored, it is in `apps/back-office/src/app/melden/actions.ts`, not anywhere in the Melding Form.

### `back-office-entry` is a Route Handler, not a page

Route Handlers do not pass through `layout.tsx`, so the API client is not configured there automatically. The route handler configures the client itself. If you add API calls to `back-office-entry` without configuring the client, they will fail silently or use the wrong base URL.

### `request.nextUrl.origin` is the internal address in production

Inside a Route Handler, `request.nextUrl.origin` resolves to the internal server address, not the public-facing URL. The route handler uses `NEXT_PUBLIC_MELDING_FORM_BASE_URL` for all redirects instead of `request.nextUrl.origin`.

### Back-office mode is tracked by a cookie, not by URL

After `back-office-entry` runs, there is no `source` in the URL. Every page in the `(general)` route group reads the `source` cookie to decide which layout and which back-navigation links to render. If the cookie is missing or expired, the user sees the regular public layout.

### `source` on `/bedankt` comes from the URL, not the cookie

The session cookies are deleted before the redirect to `/bedankt`. The server action explicitly copies `source` into the URL params before deleting the cookies. This means `/bedankt` is stateless and safe to reload, but it also means the back-office context is visible in the URL on the final page.

### `LAST_PANEL_PATH` is cleared on re-entry

If a Behandelaar goes back to the Back Office form, changes the description (which may trigger reclassification), and resubmits, the flow re-enters via `back-office-entry`. The route handler clears the `LAST_PANEL_PATH` cookie at that point so the user is not sent to a stale position in the additional-questions wizard.

### `id` and `public_id` are different things

`id` is the internal numeric Melding ID used in API calls and in the Back Office detail URL (`/melding/{id}`). `public_id` is the human-readable identifier shown to users. Both are passed around as URL params throughout the flow.

### Both apps must run simultaneously during local development

There is no mock or stub for the cross-app redirect. To work on the Behandelaar Melden flow locally you need both the Back Office app (default port 3002) and the Melding Form app (default port 3000) running at the same time.
