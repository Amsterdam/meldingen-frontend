import type { NextConfig } from 'next'
import type { ProxyMatcher } from 'next/dist/build/analysis/get-page-static-info'

import * as pageStaticInfo from 'next/dist/build/analysis/get-page-static-info'
import { getMiddlewareRouteMatcher } from 'next/dist/shared/lib/router/utils/middleware-route-matcher'

import { config } from './proxy'

// Compiles `config.matcher` the way the Next.js build does. It's exported at runtime, but missing from Next's types.
const { getMiddlewareMatchers } = pageStaticInfo as unknown as {
  getMiddlewareMatchers: (matcher: typeof config.matcher, nextConfig: NextConfig) => ProxyMatcher[]
}

// Mirrors how the Next.js server decides whether to run the proxy (next/dist/server/lib/router-utils/resolve-routes.js):
// it runs when either the raw or the decoded pathname matches. We don't use unstable_doesMiddlewareMatch from
// next/experimental/testing/server, because it parses the URL first, which resolves "/../" segments the server keeps.
const doesProxyRun = (pathname: string, nextConfig: NextConfig = {}) => {
  const matchesProxy = getMiddlewareRouteMatcher(getMiddlewareMatchers(config.matcher, nextConfig))

  // The request and query are only used for `has`/`missing` conditions, which our matcher doesn't have
  return matchesProxy(pathname, {} as never, {}) || matchesProxy(decodeURIComponent(pathname), {} as never, {})
}

describe('proxy matcher', () => {
  it.each(['/', '/melding/1', '/melding/1/bestand-toevoegen', '/api/auth/signin', '/api/melding/1/attachment/extra'])(
    'runs the proxy for %s',
    (url) => {
      expect(doesProxyRun(url)).toBe(true)
    },
  )

  it('skips the proxy for the attachment upload Route Handler', () => {
    expect(doesProxyRun('/api/melding/1/attachment')).toBe(false)
  })

  it('skips the proxy for the attachment upload Route Handler when a basePath is set', () => {
    const nextConfig = { basePath: '/back-office' }

    expect(doesProxyRun('/back-office/api/melding/1/attachment', nextConfig)).toBe(false)
    expect(doesProxyRun('/back-office/melding/1', nextConfig)).toBe(true)
  })

  describe('encoded paths', () => {
    it('runs the proxy when an encoded slash in the melding id decodes to extra path segments', () => {
      // Decoded: /api/melding/1/../admin/attachment, which doesn't match the attachment upload exclusion.
      // The Route Handler rejects this melding id as well, see its route.test.ts.
      expect(doesProxyRun('/api/melding/1%2F..%2Fadmin/attachment')).toBe(true)
    })

    it('skips the proxy when only the melding id itself is encoded', () => {
      // Decoded: /api/melding/1/attachment, the attachment upload Route Handler
      expect(doesProxyRun('/api/melding/%31/attachment')).toBe(false)
    })
  })
})
