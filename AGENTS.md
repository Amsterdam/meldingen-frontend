# AGENTS.md

Guide for AI coding agents working on this codebase.

## Overview

This monorepo contains three front-end applications for the Meldingen (nuisance reporting) platform:

| App              | Path                 | Framework          | Purpose                               |
| ---------------- | -------------------- | ------------------ | ------------------------------------- |
| **Melding Form** | `/apps/melding-form` | Next.js SSR        | Public form for submitting reports    |
| **Back Office**  | `/apps/back-office`  | Next.js + NextAuth | Professionals processing reports      |
| **Admin**        | `/apps/admin`        | Vite + React-Admin | Managing forms, texts, configurations |

All apps share internal libraries from `/libs` (e.g., `ui`, `form-renderer`, `api-client`).

### Why Three Apps?

- **melding-form**: Next.js SSR for public users (SEO, progressive enhancement, cookie-based auth)
- **back-office**: Next.js with NextAuth for authenticated professionals
- **admin**: Vite SPA with React-Admin (switched from Next.js due to React-Admin performance issues)

## Quick Commands

```bash
pnpm dev:mf          # Melding Form on :3000
pnpm dev:bo          # Back Office on :3002
pnpm dev:admin       # Admin on :3001
pnpm test            # Run all tests sequentially
pnpm lint            # ESLint + Stylelint + Prettier + type-check
pnpm generate-api-client  # Regenerate from OpenAPI (backend must be running on :8000)
```

## Architecture & Data Flow

- Apps isolated in `/apps`, shared code in `/libs`
- Forms configured in Admin → stored in backend → fetched as JSON schema → rendered by `@meldingen/form-renderer`. The form schema follows [Form.io](https://formio.github.io/formio.js/) format but uses a custom renderer for Next.js SSR compatibility.
- API client auto-generated from backend OpenAPI spec
- See [docs/README.md](docs/README.md) for architecture diagram

---

## Form.io Schema Structure

The form system uses a Form.io-inspired JSON schema, but **not** the Form.io renderer directly. The custom `@meldingen/form-renderer` provides Next.js SSR compatibility.

### Schema Hierarchy

```text
Form
├── display: "wizard"           # Multi-step form
├── components: PanelComponent[]
    └── PanelComponent
        ├── type: "panel"
        ├── key: "step-1"       # URL path segment
        ├── label: "Locatie"    # Page heading
        └── components: Component[]  # Form fields
```

### Supported Component Types

| `type` value  | Renders as         | Component file                                                             |
| ------------- | ------------------ | -------------------------------------------------------------------------- |
| `textfield`   | Single-line input  | [TextInput.tsx](libs/form-renderer/src/components/TextInput/TextInput.tsx) |
| `textarea`    | Multi-line input   | [TextArea.tsx](libs/form-renderer/src/components/TextArea/TextArea.tsx)    |
| `radio`       | Radio button group | [Radio.tsx](libs/form-renderer/src/components/Radio/Radio.tsx)             |
| `select`      | Dropdown select    | [Select.tsx](libs/form-renderer/src/components/Select/Select.tsx)          |
| `selectboxes` | Checkbox group     | [Checkbox.tsx](libs/form-renderer/src/components/Checkbox/Checkbox.tsx)    |

### Component Schema Example

```typescript
// Radio component schema (from backend API)
{
  type: "radio",
  key: "urgency",                    // Form field name & error key
  label: "Hoe urgent is dit?",       // Legend text
  description: "Optionele toelichting", // Rendered as markdown
  validate: { required: true },      // Shows "(niet verplicht)" if false
  values: [
    { label: "Zeer urgent", value: "high" },
    { label: "Normaal", value: "normal" }
  ],
  defaultValue: "normal"             // Pre-selected option
}
```

### Type Guards for Component Detection

Use the type guards in [libs/form-renderer/src/utils.ts](libs/form-renderer/src/utils.ts):

```typescript
import { isRadio, isTextfield, isSelectboxes } from '@meldingen/form-renderer'

if (isRadio(component)) {
  // TypeScript now knows component is FormRadioComponent
  component.values // ✓ Available
}
```

### Adding a New Component Type

1. Regenerate `@meldingen/api-client` from updated OpenAPI
2. Create component in `libs/form-renderer/src/components/NewType/`
3. Add type guard in [libs/form-renderer/src/utils.ts](libs/form-renderer/src/utils.ts)
4. Add case in `FormRenderer.tsx` `getComponent()` function
5. Export from `libs/form-renderer/src/index.ts`

### Heading Behavior

The renderer handles headings intelligently:

- **Single component on page**: Label becomes the `<h1>`
- **Multiple components**: Panel label renders as `<h1>`, component labels are regular labels

This is controlled by `hasOneFormComponent` in [FormRenderer.tsx:44](libs/form-renderer/src/FormRenderer.tsx#L44).

---

## Environment Variables

### Naming Conventions

| Prefix            | Scope                 | Used In                   |
| ----------------- | --------------------- | ------------------------- |
| `NEXT_PUBLIC_*`   | Client-side (browser) | melding-form, back-office |
| `NEXT_INTERNAL_*` | Server-side only      | melding-form, back-office |
| `VITE_*`          | Client-side (browser) | admin                     |
| No prefix         | Server-side only      | back-office (auth)        |

### Core Variables by App

**melding-form** (`apps/melding-form/.env`):

```bash
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:8000   # Browser API calls
NEXT_INTERNAL_BACKEND_BASE_URL=http://localhost:8000 # Server-side API calls
```

**back-office** (`apps/back-office/.env`):

```bash
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:8000
NEXT_INTERNAL_BACKEND_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BASE_PATH=""

# Keycloak (local development)
KEYCLOAK_AUTH_URL=http://localhost:8002/realms/meldingen/protocol/openid-connect/auth
KEYCLOAK_CLIENT_ID=meldingen
KEYCLOAK_CLIENT_SECRET=""  # Set in .env.local
KEYCLOAK_ISSUER_URL=http://localhost:8002/realms/meldingen
KEYCLOAK_TOKEN_URL=http://localhost:8002/realms/meldingen/protocol/openid-connect/token

# NextAuth
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET="<generate-random-secret>"  # Set in .env.local
```

**admin** (`apps/admin/.env`):

```bash
VITE_BACKEND_BASE_URL=http://localhost:8000
VITE_KEYCLOAK_BASE_URL=http://localhost:8002
VITE_KEYCLOAK_REALM=meldingen
VITE_KEYCLOAK_CLIENT_ID=meldingen
```

### Docker vs Local Development

| Context   | Backend URL             | Auth URLs               |
| --------- | ----------------------- | ----------------------- |
| Local dev | `http://localhost:8000` | `http://localhost:8002` |
| Docker    | `http://meldingen:8000` | `http://keycloak:8002`  |

Docker uses container hostnames instead of `localhost`. The `NEXT_INTERNAL_BACKEND_BASE_URL` is passed as a build arg in `docker-compose.yml`.

### Sensitive Variables (Never Commit)

Store in `.env.local` (gitignored):

- `KEYCLOAK_CLIENT_SECRET`
- `ENTRA_CLIENT_SECRET`
- `NEXTAUTH_SECRET`

### Production (Entra ID)

The production builds use Entra ID instead of Keycloak.
This is done by using different environment variables, which are set in Azure DevOps.

Generally, it is not necessary to use Entra ID locally.
If you do want to test Entra ID locally, uncomment and configure these Entra ID variables:

```bash
ENTRA_CLIENT_ID=<app-registration-id>
ENTRA_CLIENT_SECRET=<secret>
ENTRA_TENANT_ID=<tenant-id>
ENTRA_TOKEN_URL=https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
```

---

## i18n / next-intl Patterns

Both Next.js apps use `next-intl` with single locale (Dutch).

### Translation File Structure

Translations are organized by feature in `apps/{app}/translations/nl.json`:

```json
{
  "metadata": { "description": "..." },
  "homepage": {
    "title": "Melding maken",
    "step": "Stap 1 van 5",
    "submit-button": "Volgende"
  },
  "contact": {
    "question": "Mogen wij contact opnemen?",
    "errors": { "invalid-email": "Ongeldig e-mailadres" }
  },
  "shared": {
    "invalid-form-alert-title": "Verbeter de fouten",
    "state": {
      "processing": "In behandeling",
      "completed": "Afgehandeld"
    }
  }
}
```

### Client Components

```typescript
'use client'
import { useTranslations } from 'next-intl'

export const Contact = () => {
  const t = useTranslations('contact')
  const tShared = useTranslations('shared')

  return (
    <>
      <Heading>{t('question')}</Heading>
      <InvalidFormAlert heading={tShared('invalid-form-alert-title')} />
    </>
  )
}
```

### Server Components & Metadata

```typescript
import { getTranslations } from 'next-intl/server'

export const generateMetadata = async () => {
  const t = await getTranslations('metadata')
  return { description: t('description') }
}
```

### Parameter Interpolation

```typescript
// Translation: "Meldingen ({meldingenCount})"
{
  t('overview.title', { meldingenCount: 42 })
}

// Translation with date: "Aangemaakt op {date} om {time}"
{
  t('created', {
    date: new Date(createdAt).toLocaleDateString('nl-NL'),
    time: new Date(createdAt).toLocaleTimeString('nl-NL', { timeStyle: 'short' }),
  })
}
```

### Dynamic Keys

```typescript
// For state translations like shared.state.processing
{
  t(`shared.state.${melding.state}`)
}
```

---

## Authentication Flows

### Overview

| App          | Method               | Local Dev                | Production |
| ------------ | -------------------- | ------------------------ | ---------- |
| melding-form | Cookie token         | Cookie with 1-day expiry | Same       |
| back-office  | NextAuth             | Keycloak                 | Entra ID   |
| admin        | React-Admin provider | Keycloak                 | Entra ID   |

### melding-form: Cookie-Based Session

Public users don't authenticate. Instead, a temporary token is created per melding:

```typescript
// On form start, backend returns id + token, stored in cookies
COOKIES = {
  ID: 'meldingen_id',
  TOKEN: 'meldingen_token', // Passed as ?token= query param
}

// Middleware protects routes (apps/melding-form/src/proxy.ts)
if (!token || !id) {
  return NextResponse.redirect(new URL('/', request.url))
}
```

Cookie expiry: **1 day** (SameSite=Strict, HttpOnly)

### back-office: NextAuth with Token Refresh

**Provider selection** in [authOptions.ts](apps/back-office/src/app/_authentication/authOptions.ts):

```typescript
const isEntraAuthEnabled =
  Boolean(process.env.ENTRA_CLIENT_ID) &&
  Boolean(process.env.ENTRA_CLIENT_SECRET) &&
  Boolean(process.env.ENTRA_TENANT_ID)
```

**Token lifecycle:**

1. User signs in → tokens captured in `jwt` callback
2. On each request, check if `accessTokenExpiresAt` has passed
3. If expired (Keycloak only): call token endpoint with `refresh_token`
4. If refresh fails: set `error: 'RefreshAccessTokenError'`
5. `apiClientProxy` checks for error and redirects to signin

**Critical Entra ID limitation:** Refresh tokens cannot be stored (exceed 4KB with access token). Users must re-authenticate every ~90 minutes.

**API calls with auth:**

```typescript
// apps/back-office/src/apiClientProxy.ts
client.setConfig({
  auth: async () => {
    const session = await getServerSession(authOptions)
    if (!session?.accessToken || session.error) {
      redirect('/api/auth/signin')
    }
    return session.accessToken
  },
})
```

### admin: React-Admin Providers

**Keycloak** (local dev):

```typescript
// Token refresh is automatic via Keycloak-js
keycloakInstance.onTokenExpired = () => {
  keycloakInstance.updateToken().catch(() => keycloakInstance.login())
}
```

**Entra ID** (production):

```typescript
// MSAL handles token refresh; wrapper retries on 401/403
const entraDataProvider = addRefreshAuthToDataProvider(
  genericDataProvider(VITE_BACKEND_BASE_URL, httpClient),
  msalRefreshAuth({ msalInstance, tokenRequest }),
)
```

### Error Scenarios

| Scenario       | melding-form    | back-office                   | admin                        |
| -------------- | --------------- | ----------------------------- | ---------------------------- |
| Token expired  | Redirect to `/` | Refresh or redirect to signin | Auto-refresh or login prompt |
| Refresh failed | N/A             | Redirect to signin            | Login prompt                 |
| No session     | Redirect to `/` | Redirect to signin            | Login prompt                 |

---

## Server Actions Pattern (Critical)

All form submissions in melding-form and back-office use Next.js Server Actions. Follow this exact pattern:

```typescript
// apps/melding-form/src/app/(general)/contact/actions.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { patchMeldingByMeldingIdContact } from '@meldingen/api-client'
import { handleApiError, hasValidationErrors, isApiErrorArray } from 'handleApiError'

export const postContactForm = async (_: FormState, formData: FormData): Promise<FormState> => {
  const cookieStore = await cookies()
  const id = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  const { error } = await patchMeldingByMeldingIdContact({
    path: { melding_id: Number(id) },
    query: { token },
    body: { email: formData.get('email') as string },
  })

  if (hasValidationErrors(error) && isApiErrorArray(error)) {
    return { validationErrors: error.detail.map((e) => ({ key: e.loc[1], message: e.msg })) }
  }
  if (error) return { systemError: handleApiError(error) }

  redirect('/samenvatting')
}
```

**Key rules:**

- Always retrieve `id` and `token` from cookies for melding-form endpoints
- Return `FormState` with either `validationErrors` or `systemError`
- Use `redirect()` for navigation on success (throws, so must be last)

---

## API Client Usage

The API client at `libs/api-client` is auto-generated. Never edit `*.gen.ts` files directly.

```typescript
// Correct usage with types
import { getMeldingByMeldingId, type MeldingOutput } from '@meldingen/api-client'

const { data, error, response } = await getMeldingByMeldingId({
  path: { melding_id: 123 },
  query: { token: 'abc' }, // Required for public endpoints
})

// Pagination is in Content-Range header
const total = parseInt(response.headers.get('Content-Range')?.split('/')[1] || '0')
```

---

### JavaScript Code Style Principles

We follow Clean Code principles throughout this codebase. Prioritize **clarity and readability** over clever or overly concise solutions. Code should be easy to understand and maintain by any team member, not just the original author.

- **Legibility over cleverness:** Write code that is self-explanatory and easy to follow. Avoid "smart" one-liners or obscure patterns that make the intent unclear.
- **DRY (Don't Repeat Yourself):** Extract reusable logic into functions or components when you see duplication. However, don't over-abstract prematurely—wait until repetition is clear (see Rule of Three).
- **YAGNI (You Aren't Gonna Need It):** Only implement features and abstractions that are actually required. Avoid speculative generalization or adding options "just in case."
- **Rule of Three:** If you find yourself copying similar code a third time, refactor it into a shared function or component. Do not cross app boundaries when doing this, an app should be self-contained. It is okay to export shared functions or components from libraries.
- **Descriptive naming:** Use clear, descriptive names for variables, functions, and components. Avoid abbreviations unless they are widely understood.
- **Consistent formatting:** Follow the project's Prettier and ESLint rules for code style and formatting.
- **Comment only when necessary:** Prefer self-documenting code, but add comments to explain non-obvious decisions, workarounds, or business logic.

---

## CSS Modules Patterns

All styling uses CSS Modules with Amsterdam Design System tokens:

```css
/* ComponentName.module.css */
.container {
  /* Use design system tokens */
  padding: var(--ams-space-m);
  font-family: var(--ams-typography-font-family);

  /* Mobile-first responsive */
  @media screen and (min-width: 37.5rem) {
    padding: var(--ams-space-l);
  }
}

/* Composition for reuse */
.variant {
  composes: container;
  background: var(--ams-color-primary-blue);
}

/* Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  animation: none;
}
```

**CSS rules enforced by Stylelint:**

- No external margins on components (layout at container level)
- Use logical properties (`margin-inline`, `padding-block`)
- camelCase class names in JS: `styles.submitButton`

---

## Testing Patterns

We use Vitest + React Testing Library + MSW.
Tests are co-located with source files. MSW mocks are set up globally.

```typescript
// Component test example
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('FileUpload', () => {
  it('calls onChange when file selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FileUpload onChange={onChange} />)

    // Always query by accessible role/name, not test IDs
    const input = screen.getByLabelText(/upload/i)
    await user.upload(input, new File(['content'], 'test.pdf'))

    expect(onChange).toHaveBeenCalled()
  })
})
```

**Server Action tests** require mocking cookies:

```typescript
// apps/melding-form/src/app/(general)/contact/actions.test.ts
import { server } from 'apps/melding-form/src/mocks/node'

beforeEach(() => {
  mockIdAndTokenCookies()
})

it('returns validation error for invalid email', async () => {
  server.use(
    http.patch(ENDPOINTS.PATCH_MELDING_CONTACT, () =>
      HttpResponse.json({ detail: [{ loc: ['body', 'email'], msg: 'invalid' }] }, { status: 422 }),
    ),
  )
  const result = await postContactForm(undefined, formData)
  expect(result.validationErrors).toContainEqual({ key: 'email', message: 'invalid' })
})
```

---

## Common Gotchas

1. **Next.js client components**: Files using hooks must have `'use client'` directive
2. **Form.io schema**: The custom `@meldingen/form-renderer` renders schemas, not the Form.io library directly
3. **Map components**: Leaflet requires dynamic import with `ssr: false` in Next.js
4. **Admin uses Vite**: Not Next.js - different routing (`react-router-dom`) and build config
5. **Coverage thresholds**: Tests will fail if coverage drops below thresholds in `vite.config.ts`
6. **Timezone in tests**: Set to UTC via `process.env.TZ = 'UTC'` in vitest.setup.ts
7. **Entra ID sessions**: Users logged out after ~90 min (no refresh token storage)
8. **Translation keys**: Use dot notation for nested access: `t('shared.state.processing')`

---

## Key Files to Reference

| Pattern            | Reference File                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Server Action      | [apps/melding-form/src/app/(general)/contact/actions.ts](<apps/melding-form/src/app/(general)/contact/actions.ts>)  |
| Form rendering     | [libs/form-renderer/src/FormRenderer.tsx](libs/form-renderer/src/FormRenderer.tsx)                                  |
| Form type guards   | [libs/form-renderer/src/utils.ts](libs/form-renderer/src/utils.ts)                                                  |
| API error handling | [apps/melding-form/src/handleApiError.ts](apps/melding-form/src/handleApiError.ts)                                  |
| MSW mock handlers  | [apps/melding-form/src/mocks/handlers.ts](apps/melding-form/src/mocks/handlers.ts)                                  |
| UI component       | [libs/ui/src/FileUpload/FileUpload.tsx](libs/ui/src/FileUpload/FileUpload.tsx)                                      |
| CSS Module         | [libs/ui/src/FileUpload/FileUpload.module.css](libs/ui/src/FileUpload/FileUpload.module.css)                        |
| NextAuth config    | [apps/back-office/src/app/\_authentication/authOptions.ts](apps/back-office/src/app/_authentication/authOptions.ts) |
| API client proxy   | [apps/back-office/src/apiClientProxy.ts](apps/back-office/src/apiClientProxy.ts)                                    |
| Translations       | [apps/melding-form/translations/nl.json](apps/melding-form/translations/nl.json)                                    |
| i18n config        | [apps/melding-form/i18n/request.ts](apps/melding-form/i18n/request.ts)                                              |
| Cookie constants   | [apps/melding-form/src/constants.ts](apps/melding-form/src/constants.ts)                                            |
| Middleware         | [apps/melding-form/src/proxy.ts](apps/melding-form/src/proxy.ts)                                                    |

## Documentation References

- [docs/README.md](docs/README.md): Architecture diagram
- [docs/0004-styling.md](docs/0004-styling.md): Styling conventions
- [docs/0006-monorepo-tooling.md](docs/0006-monorepo-tooling.md): PNPM workspaces
- [docs/0009-directory-structure.md](docs/0009-directory-structure.md): File conventions
- [docs/0011-error-handling.md](docs/0011-error-handling.md): Error patterns

---

## Adding New Features Checklist

- [ ] Add types to `@meldingen/api-client` by regenerating from updated OpenAPI spec
- [ ] Place component with its `.module.css` and `.test.tsx` in same directory
- [ ] Export from package's `index.ts` if it's a shared lib component
- [ ] Use Amsterdam Design System components/tokens before creating custom styles
- [ ] Add MSW handlers if new API endpoints are involved
- [ ] Maintain coverage thresholds (check `vite.config.ts`)
- [ ] Add translations to `translations/nl.json` for user-facing text
- [ ] For new form field types: add to form-renderer with type guard
