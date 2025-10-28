import NextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware'

export default function proxy(request: NextRequestWithAuth) {
  return NextAuthMiddleware(request)
}
