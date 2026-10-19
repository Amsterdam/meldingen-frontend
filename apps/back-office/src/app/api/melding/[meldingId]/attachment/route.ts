import type { NextRequest } from 'next/server'

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

import { authOptions } from '~/app/_authentication/authOptions'
import { serverEnv } from '~/env/server'

/**
 * Route Handlers get none of the CSRF protection Next.js builds into Server Actions
 * (an Origin/Host check on every request). We add it back here by hand, since this
 * endpoint changes state (creates an attachment) and is reachable with a plain <form>
 * or XHR from anywhere unless we reject cross-origin requests ourselves.
 */
const isSameOriginRequest = (request: NextRequest) => {
  const origin = request.headers.get('origin')

  if (!origin || !URL.canParse(origin)) return false

  // `request.nextUrl.origin` reflects the app's internal bind address, not the URL users
  // reach through a proxy. So we compare the Origin host with `x-forwarded-host`
  // (or `host`), like Next.js does for Server Actions.
  const host = request.headers.get('x-forwarded-host')?.split(',')[0].trim() || request.headers.get('host')

  return new URL(origin).host === host
}

/**
 * Streams an attachment upload to the backend, adding the session's access token.
 *
 * This route is excluded from proxy.ts (see its `config.matcher`), so NextAuth's middleware does not run here.
 * Every handler in this file must check the session itself.
 */
export const POST = async (request: NextRequest, { params }: { params: Promise<{ meldingId: string }> }) => {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ detail: 'Invalid origin' }, { status: 403 })
  }

  const { meldingId } = await params

  // Don't remove: this prevents path traversal on the backend. Next.js decodes %2F in params, so meldingId
  // can be "1/../admin", which would turn the upload URL below into /melding/admin/attachment/.
  if (!/^\d+$/.test(meldingId)) {
    return NextResponse.json({ detail: 'Invalid melding id' }, { status: 400 })
  }

  const session = await getServerSession(authOptions)

  if (!session?.accessToken || session.error) {
    return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 })
  }

  const contentType = request.headers.get('content-type')

  if (!contentType?.startsWith('multipart/form-data')) {
    return NextResponse.json({ detail: 'Expected multipart/form-data' }, { status: 400 })
  }

  const uploadEndpoint = `${serverEnv.NEXT_INTERNAL_BACKEND_BASE_URL}/melding/${meldingId}/attachment/`

  let backendResponse: Response

  try {
    backendResponse = await fetch(uploadEndpoint, {
      body: request.body,
      // @ts-expect-error -- Node's fetch needs `duplex` for streamed bodies; the DOM RequestInit type lacks it
      // This tells Node's fetch that the request body is a stream, which is required for proper handling.
      // This expect error can be removed once TypeScript adds `duplex` to the DOM RequestInit type.
      duplex: 'half',
      headers: {
        authorization: `Bearer ${session.accessToken}`,
        'content-type': contentType,
      },
      method: 'POST',
      signal: request.signal,
    })
  } catch (error) {
    if (!request.signal.aborted) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(error)
    }

    return NextResponse.json({ detail: 'Upload failed' }, { status: 502 })
  }

  const headers = new Headers()
  const backendContentType = backendResponse.headers.get('content-type')

  if (backendContentType) {
    headers.set('content-type', backendContentType)
  }

  return new NextResponse(backendResponse.body, { headers, status: backendResponse.status })
}
