import type { NextRequest } from 'next/server'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { client } from '@meldingen/api-client'

import { COOKIES } from '../../constants'
import { resolveClassificationRedirect } from '../utils'

// Configure the API client here, because a route handler does not pass layout.tsx.
// All server requests that pass through layout.tsx are configured in layout.tsx itself.
// Client requests are configured in ApiClientInitializer.
client.setConfig({
  baseUrl: process.env.NEXT_INTERNAL_BACKEND_BASE_URL,
})

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl
  const classification_id = searchParams.get('classification_id') ?? undefined
  const id = searchParams.get('id')
  const token = searchParams.get('token')

  // Determine public address using x-forwarded headers, or fallback to the request's URL if headers are not present
  // This is necessary because the Melding Form is behind a reverse proxy.
  const host = request.headers.get('x-forwarded-host') ?? request.nextUrl.host
  const proto = request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '')
  const origin = `${proto}://${host}`

  // If id or token is missing, redirect to the home page
  if (!id || !token) {
    return NextResponse.redirect(new URL('/', origin))
  }

  // Set session variables in cookies
  const cookieStore = await cookies()
  const oneDay = 24 * 60 * 60
  cookieStore.set(COOKIES.ID, id, { maxAge: oneDay })
  cookieStore.set(COOKIES.TOKEN, token, { maxAge: oneDay })
  cookieStore.set(COOKIES.SOURCE, 'back-office', { maxAge: oneDay })

  const result = await resolveClassificationRedirect(
    parseInt(id, 10),
    token,
    classification_id ? parseInt(classification_id, 10) : undefined,
  )

  if (result.type === 'error') {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(result.error)
    return NextResponse.redirect(new URL('/', origin))
  }

  return NextResponse.redirect(new URL(result.url, origin))
}
