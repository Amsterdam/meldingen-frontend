import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const middleware = (request: NextRequest) => {
  const token = request.cookies.get('token')
  const id = request.cookies.get('id')

  if (request.method === 'POST') {
    return NextResponse.next() // skip auth check for actions
  }

  if (!token || !id) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/aanvullende-vragen/:path*', '/locatie/:path*', '/bijlage', '/contact', '/samenvatting'],
}
