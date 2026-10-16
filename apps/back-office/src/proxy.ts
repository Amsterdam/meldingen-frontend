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
  matcher: [
    // Exclude the attachment upload route from the proxy (and so from NextAuth's middleware).
    // When the proxy runs, Next.js buffers the request body (capped by `proxyClientMaxBodySize`),
    // which breaks streaming and truncates large uploads. The route handler checks the session itself.
    '/((?!api/melding/[^/]+/attachment$).*)',
  ],
}
