import { NextResponse } from 'next/server'

export const middleware = () => NextResponse.next()

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)'],
}
