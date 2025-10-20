import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { SESSION_COOKIES } from './constants'

export const middleware = (request: NextRequest) => {
  // Allow Server Actions to pass through without checking cookies
  // We check for the existence of these cookies in the Actions themselves
  if (request.method === 'POST') {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIES.TOKEN)
  const id = request.cookies.get(SESSION_COOKIES.ID)

  if (!token || !id) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/aanvullende-vragen/:path*', '/locatie/:path*', '/bijlage', '/contact', '/samenvatting'],
}
