import NextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default function proxy(request: NextRequestWithAuth) {
  const publicPaths = ['/robots.txt', '/favicon.ico', '/sitemap.xml']

  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  return NextAuthMiddleware(request)
}
