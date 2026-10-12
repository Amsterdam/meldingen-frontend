import type { Session } from 'next-auth'

import { http, HttpResponse } from 'msw'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

import { POST } from './route'
import { MAX_ATTACHMENT_SIZE_BYTES } from '~/constants'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const PUBLIC_HOST = 'backoffice.example.nl'
const SAME_ORIGIN_HEADERS = { host: PUBLIC_HOST, origin: `https://${PUBLIC_HOST}` }
// What request.nextUrl.origin resolves to inside the Docker container, behind the reverse proxy.
// The id in this URL is irrelevant: the route reads the melding id from `params` (see `postAttachment`).
const INTERNAL_URL = `http://0.0.0.0:3002${ENDPOINTS.POST_API_MELDING_BY_MELDING_ID_ATTACHMENT.replace(':id', '1')}`

const MULTIPART_BOUNDARY = 'test-boundary'

// The route streams the body to the backend without parsing it, so any bytes will do
const UPLOAD_BODY = 'file content'

// A generic stream body (unlike FormData/Blob/string) isn't re-measured by fetch, so a
// Content-Length set alongside it is the one the route handler actually reads.
const createStreamBody = () =>
  new ReadableStream({
    start: (controller) => {
      controller.enqueue(new Uint8Array([1, 2, 3]))
      controller.close()
    },
  })

// A body without Content-Length, like a chunked upload: the route can only measure it while streaming
const createChunkedBody = (sizeInBytes: number) =>
  new ReadableStream({
    start: (controller) => {
      controller.enqueue(new Uint8Array(sizeInBytes))
      controller.close()
    },
  })

type NextRequestInit = NonNullable<ConstructorParameters<typeof NextRequest>[1]>

type PostAttachmentOptions = {
  body?: NextRequestInit['body']
  headers?: Record<string, string>
  meldingId?: string
  signal?: AbortSignal
}

const postAttachment = ({
  body = UPLOAD_BODY,
  headers = SAME_ORIGIN_HEADERS,
  meldingId = '1',
  signal,
}: PostAttachmentOptions = {}) => {
  const init = {
    body,
    // `duplex` is required by Node whenever `body` is a stream, but it's missing from TypeScript's RequestInit type
    duplex: 'half',
    headers: { 'content-type': `multipart/form-data; boundary=${MULTIPART_BOUNDARY}`, ...headers },
    method: 'POST',
    signal,
  } as NextRequestInit

  return POST(new NextRequest(INTERNAL_URL, init), { params: Promise.resolve({ meldingId }) })
}

describe('POST /api/melding/[meldingId]/attachment', () => {
  beforeEach(() => {
    vi.mocked(getServerSession).mockResolvedValue({ accessToken: 'access-token' } as Session)
    // Not mocked: requests still reach the MSW handlers. We only spy to assert the backend isn't called.
    vi.spyOn(global, 'fetch')
  })

  describe('origin check', () => {
    it('returns 403 when the Origin header is missing', async () => {
      const response = await postAttachment({ headers: { host: PUBLIC_HOST } })

      expect(response.status).toBe(403)
      expect(getServerSession).not.toHaveBeenCalled()
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('returns 403 when the Origin header is malformed', async () => {
      const response = await postAttachment({ headers: { host: PUBLIC_HOST, origin: 'not a url' } })

      expect(response.status).toBe(403)
      expect(getServerSession).not.toHaveBeenCalled()
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('returns 403 when the Origin host does not match the Host header', async () => {
      const response = await postAttachment({ headers: { host: PUBLIC_HOST, origin: 'https://evil.example' } })

      expect(response.status).toBe(403)
      expect(getServerSession).not.toHaveBeenCalled()
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('returns 403 when the Origin host does not match X-Forwarded-Host, even if Host matches', async () => {
      const response = await postAttachment({
        headers: { ...SAME_ORIGIN_HEADERS, 'x-forwarded-host': 'evil.example' },
      })

      expect(response.status).toBe(403)
      expect(getServerSession).not.toHaveBeenCalled()
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('returns 200 when the Origin host matches the Host header', async () => {
      const response = await postAttachment()

      expect(response.status).toBe(200)
    })

    it('returns 200 when the Origin host matches X-Forwarded-Host and Host is internal', async () => {
      const response = await postAttachment({
        headers: {
          host: '0.0.0.0:3002',
          origin: `https://${PUBLIC_HOST}`,
          // Proxies may add whitespace around the comma-separated entries
          'x-forwarded-host': `${PUBLIC_HOST} , internal-gateway`,
        },
      })

      expect(response.status).toBe(200)
    })
  })

  describe('authentication', () => {
    it('returns 401 when there is no session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const response = await postAttachment()

      expect(response.status).toBe(401)
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('returns 401 when the session has a token refresh error', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        accessToken: 'access-token',
        error: 'RefreshAccessTokenError',
      } as Session)

      const response = await postAttachment()

      expect(response.status).toBe(401)
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })

  describe('request validation', () => {
    it('returns 400 when the melding id is not numeric', async () => {
      const response = await postAttachment({ meldingId: '1/../../admin' })

      expect(response.status).toBe(400)
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('returns 400 when the body is not multipart/form-data', async () => {
      const response = await postAttachment({
        body: JSON.stringify({ not: 'a file' }),
        headers: { ...SAME_ORIGIN_HEADERS, 'content-type': 'application/json' },
      })

      expect(response.status).toBe(400)
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('returns 400 when Content-Length exceeds the upload limit', async () => {
      const response = await postAttachment({
        body: createStreamBody(),
        headers: {
          ...SAME_ORIGIN_HEADERS,
          'content-length': String(MAX_ATTACHMENT_SIZE_BYTES + 1),
        },
      })

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ detail: 'Allowed content size exceeded' })
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('returns 200 when Content-Length is exactly the upload limit', async () => {
      const response = await postAttachment({
        body: createStreamBody(),
        headers: {
          ...SAME_ORIGIN_HEADERS,
          'content-length': String(MAX_ATTACHMENT_SIZE_BYTES),
        },
      })

      expect(response.status).toBe(200)
    })
  })

  describe('streaming size limit', () => {
    it('returns 400 when a body without Content-Length exceeds the upload limit and the backend rejects the cut-off body', async () => {
      let hasBackendReceivedFullBody = false

      server.use(
        http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, async ({ request }) => {
          // Reading the body throws once the route cuts it off, which MSW turns into a 500 response
          await request.arrayBuffer()
          hasBackendReceivedFullBody = true

          return HttpResponse.json({ id: 42 })
        }),
      )

      const response = await postAttachment({ body: createChunkedBody(MAX_ATTACHMENT_SIZE_BYTES + 1) })

      expect(hasBackendReceivedFullBody).toBe(false)
      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ detail: 'Allowed content size exceeded' })
    })

    it('returns 400 when a body without Content-Length exceeds the upload limit and the backend request fails', async () => {
      // How Node's fetch behaves when its body stream errors: it rejects. MSW can't simulate this
      // (see the test above), so we stub fetch to consume the body the way Node's fetch would.
      vi.mocked(global.fetch).mockImplementationOnce(async (_input, init) => {
        await new Response(init?.body).arrayBuffer()

        return Response.json({ id: 42 })
      })

      const response = await postAttachment({ body: createChunkedBody(MAX_ATTACHMENT_SIZE_BYTES + 1) })

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ detail: 'Allowed content size exceeded' })
    })

    it('returns 200 and forwards a body without Content-Length that is exactly the upload limit', async () => {
      let backendBodySize: number | undefined

      server.use(
        http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, async ({ request }) => {
          backendBodySize = (await request.arrayBuffer()).byteLength

          return HttpResponse.json({ id: 42 })
        }),
      )

      const response = await postAttachment({ body: createChunkedBody(MAX_ATTACHMENT_SIZE_BYTES) })

      expect(response.status).toBe(200)
      expect(backendBodySize).toBe(MAX_ATTACHMENT_SIZE_BYTES)
    })
  })

  describe('backend response', () => {
    it('returns 200 and forwards the upload to the backend with the access token', async () => {
      const backendRequest: {
        authorization?: string | null
        body?: string
        contentType?: string | null
        meldingId?: string
      } = {}

      server.use(
        http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, async ({ params, request }) => {
          backendRequest.authorization = request.headers.get('authorization')
          backendRequest.body = await request.text()
          backendRequest.contentType = request.headers.get('content-type')
          backendRequest.meldingId = params.id as string

          return HttpResponse.json({ id: 42 })
        }),
      )

      const response = await postAttachment()

      expect(backendRequest.authorization).toBe('Bearer access-token')
      expect(backendRequest.meldingId).toBe('1')
      // The body and content-type (with its boundary) must reach the backend unchanged, or it can't parse the upload
      expect(backendRequest.contentType).toBe(`multipart/form-data; boundary=${MULTIPART_BOUNDARY}`)
      expect(backendRequest.body).toBe(UPLOAD_BODY)
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toBe('application/json')
      expect(await response.json()).toEqual({ id: 42 })
    })

    it('returns 201 without a content-type when the backend response has none', async () => {
      server.use(
        http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, () => new HttpResponse(null, { status: 201 })),
      )

      const response = await postAttachment()

      expect(response.status).toBe(201)
      expect(response.headers.get('content-type')).toBeNull()
    })

    it('returns 200 without backend response headers other than content-type', async () => {
      server.use(
        http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, () =>
          HttpResponse.json({ id: 42 }, { headers: { 'x-backend-internal': 'secret' } }),
        ),
      )

      const response = await postAttachment()

      expect(response.headers.get('content-type')).toBe('application/json')
      expect(response.headers.get('x-backend-internal')).toBeNull()
    })

    it('returns 400 with the backend error response as-is', async () => {
      server.use(
        http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, () =>
          HttpResponse.json({ detail: 'Allowed content size exceeded' }, { status: 400 }),
        ),
      )

      const response = await postAttachment()

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ detail: 'Allowed content size exceeded' })
    })
  })

  describe('backend failure', () => {
    it('returns 502 and logs the error when the backend is unreachable', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      server.use(http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, () => HttpResponse.error()))

      const response = await postAttachment()

      expect(response.status).toBe(502)
      expect(await response.json()).toEqual({ detail: 'Upload failed' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(TypeError))
    })

    it('returns 502 without calling the backend or logging when the request is already aborted', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const backendHandler = vi.fn(() => HttpResponse.json({ id: 42 }))
      const abortController = new AbortController()

      server.use(http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, backendHandler))
      abortController.abort()

      const response = await postAttachment({ signal: abortController.signal })

      expect(response.status).toBe(502)
      expect(backendHandler).not.toHaveBeenCalled()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('returns 502 without logging when the browser cancels mid-upload', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const abortController = new AbortController()

      server.use(
        http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, () => {
          // The browser cancels while the backend is still handling the upload
          abortController.abort()

          return HttpResponse.json({ id: 42 })
        }),
      )

      const response = await postAttachment({ signal: abortController.signal })

      expect(response.status).toBe(502)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
  })
})
