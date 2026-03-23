import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { COOKIES } from './constants'

const BACK_OFFICE_HANDOFF_PATHS = ['/aanvullende-vragen', '/locatie']

const isBackOfficeHandoffPath = (pathname: string) =>
  BACK_OFFICE_HANDOFF_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))

export const proxy = (request: NextRequest) => {
  // Allow Server Actions to pass through without checking cookies
  // We check for the existence of these cookies in the Actions themselves
  if (request.method === 'POST') {
    return NextResponse.next()
  }

  const { pathname, searchParams } = request.nextUrl

  // Handle back-office handoff: set session cookies from URL params and redirect to clean URL
  if (isBackOfficeHandoffPath(pathname) && searchParams.get('source') === 'back-office') {
    const id = searchParams.get('id')
    const token = searchParams.get('token')
    const createdAt = searchParams.get('created_at')
    const publicId = searchParams.get('public_id')

    if (id && token && createdAt && publicId) {
      const cleanUrl = new URL(request.url)
      ;['id', 'token', 'created_at', 'public_id', 'source'].forEach((param) => cleanUrl.searchParams.delete(param))

      const response = NextResponse.redirect(cleanUrl)

      const oneDay = 24 * 60 * 60
      response.cookies.set(COOKIES.ID, id, { maxAge: oneDay })
      response.cookies.set(COOKIES.TOKEN, token, { maxAge: oneDay })
      response.cookies.set(COOKIES.CREATED_AT, createdAt, { maxAge: oneDay })
      response.cookies.set(COOKIES.PUBLIC_ID, publicId, { maxAge: oneDay })
      response.cookies.set(COOKIES.SOURCE, 'back-office', { maxAge: oneDay })

      return response
    }
  }

  const token = request.cookies.get(COOKIES.TOKEN)
  const id = request.cookies.get(COOKIES.ID)

  if (!token || !id) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/aanvullende-vragen/:path*', '/locatie/:path*', '/bijlage', '/contact', '/samenvatting'],
}
