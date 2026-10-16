import type { NextRequestWithAuth } from 'next-auth/middleware'

import NextAuthMiddleware from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default function proxy(request: NextRequestWithAuth) {
  const publicPaths = ['/robots.txt', '/favicon.ico']

  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  return NextAuthMiddleware(request)
}

export const config = {
  // Exclude the attachment upload route from the NextAuth middleware
  matcher: ['/((?!api/melding/[^/]+/attachment$).*)'],
}
