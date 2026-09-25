import type { NextRequest } from 'next/server'

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

import { authOptions } from '~/app/_authentication/authOptions'
import { serverEnv } from '~/env/server'

// Matches the limit the UI already enforces before starting an upload (see AddAttachment.tsx).
// The backend is the source of truth; this is only a cheap early rejection.
const MAX_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024

/**
 * Route Handlers get none of the CSRF protection Next.js builds into Server Actions
 * (an Origin/Host check on every request). We add it back here by hand, since this
 * endpoint changes state (creates an attachment) and is reachable with a plain <form>
 * or XHR from anywhere unless we reject cross-origin requests ourselves.
 */
const isSameOriginRequest = (request: NextRequest) => {
  const origin = request.headers.get('origin')

  // Browsers always send Origin on POST requests, same-origin or not. No Origin means
  // either a non-browser client or a browser old/unusual enough not to send it; reject either way.
  if (!origin) return false

  return origin === request.nextUrl.origin
}

export const POST = async (request: NextRequest, { params }: { params: Promise<{ meldingId: string }> }) => {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ detail: 'Invalid origin' }, { status: 403 })
  }

  const { meldingId } = await params

  if (!/^\d+$/.test(meldingId)) {
    return NextResponse.json({ detail: 'Invalid melding id' }, { status: 400 })
  }

  const session = await getServerSession(authOptions)

  // Unlike apiClientProxy.ts, we don't redirect() to the sign-in page here: this endpoint
  // is called from XHR (see startUpload.ts), which would just follow the redirect and receive
  // the sign-in page's HTML as if it were the upload response.
  if (!session?.accessToken || session.error) {
    return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 })
  }

  const contentType = request.headers.get('content-type')

  if (!contentType?.startsWith('multipart/form-data')) {
    return NextResponse.json({ detail: 'Expected multipart/form-data' }, { status: 400 })
  }

  const contentLength = Number(request.headers.get('content-length'))

  if (contentLength > MAX_UPLOAD_SIZE_BYTES) {
    return NextResponse.json({ detail: 'Allowed content size exceeded' }, { status: 400 })
  }

  // `duplex` is required by Node's fetch (undici) whenever `body` is a stream, but it's missing
  // from TypeScript's DOM RequestInit type, hence the extra field on this derived type.
  type FetchInit = NonNullable<Parameters<typeof fetch>[1]> & { duplex: 'half' }

  const backendResponse = await fetch(`${serverEnv.NEXT_INTERNAL_BACKEND_BASE_URL}/melding/${meldingId}/attachment/`, {
    // Stream the incoming body straight through instead of buffering it via request.formData():
    // the file never needs to sit in memory in full on this hop.
    body: request.body,
    duplex: 'half',
    headers: {
      authorization: `Bearer ${session.accessToken}`,
      'content-type': contentType,
    },
    method: 'POST',
  } as FetchInit)

  // Relay the backend's response as-is (status and body). This keeps the response shape identical
  // to what melding-form's XHR upload gets directly from the backend, so the shared startUpload.ts
  // in @meldingen/file-upload needs no special-casing for back-office.
  return new NextResponse(backendResponse.body, {
    headers: { 'content-type': backendResponse.headers.get('content-type') ?? 'application/json' },
    status: backendResponse.status,
  })
}
