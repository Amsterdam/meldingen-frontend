import type { NextRequest } from 'next/server'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { COOKIES } from '../../constants'
import { resolveClassificationRedirect } from '../utils'

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl
  const classification_id = searchParams.get('classification_id') ?? undefined
  const id = searchParams.get('id')
  const token = searchParams.get('token')

  // If id or token is missing, redirect to the home page
  if (!id || !token) {
    return NextResponse.redirect(new URL('/', request.url))
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
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.redirect(new URL(result.url, request.url))
}
