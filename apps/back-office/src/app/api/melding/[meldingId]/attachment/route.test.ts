import type { Session } from 'next-auth'

import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

import { POST } from './route'

const SAME_ORIGIN = 'http://localhost:3002'

const validSession: Session = {
  accessToken: 'valid-access-token',
  expires: '',
  user: { email: null, image: null, name: null },
}

const postAttachment = (init: { headers?: Record<string, string>; meldingId?: string } = {}) => {
  const request = new NextRequest(`${SAME_ORIGIN}/api/melding/123/attachment`, {
    body: (() => {
      const formData = new FormData()
      formData.append('file', new File(['content'], 'IMG_0815.jpg', { type: 'image/jpeg' }))
      return formData
    })(),
    headers: { origin: SAME_ORIGIN, ...init.headers },
    method: 'POST',
  })

  return POST(request, { params: Promise.resolve({ meldingId: init.meldingId ?? '123' }) })
}

describe('POST /api/melding/[meldingId]/attachment', () => {
  it('rejects a request with no Origin header', async () => {
    const request = new NextRequest(`${SAME_ORIGIN}/api/melding/123/attachment`, { method: 'POST' })

    const response = await POST(request, { params: Promise.resolve({ meldingId: '123' }) })

    expect(response.status).toBe(403)
  })

  it('rejects a request with a mismatched Origin header', async () => {
    const response = await postAttachment({ headers: { origin: 'https://evil.example' } })

    expect(response.status).toBe(403)
  })

  it('rejects a non-numeric melding id', async () => {
    const response = await postAttachment({ meldingId: 'not-a-number' })

    expect(response.status).toBe(400)
  })

  it('rejects a body that is not multipart/form-data', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(validSession)

    const request = new NextRequest(`${SAME_ORIGIN}/api/melding/123/attachment`, {
      body: JSON.stringify({ not: 'a file' }),
      headers: { 'content-type': 'application/json', origin: SAME_ORIGIN },
      method: 'POST',
    })

    const response = await POST(request, { params: Promise.resolve({ meldingId: '123' }) })

    expect(response.status).toBe(400)
  })

  it('rejects a request whose Content-Length exceeds the upload limit, without calling the backend', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(validSession)
    const fetchSpy = vi.spyOn(global, 'fetch')

    // A generic stream body (unlike FormData/Blob) isn't re-measured by fetch, so the
    // Content-Length we set here is the one the route handler actually reads.
    const request = new NextRequest(`${SAME_ORIGIN}/api/melding/123/attachment`, {
      body: new ReadableStream({
        start: (controller) => {
          controller.enqueue(new Uint8Array([1, 2, 3]))
          controller.close()
        },
      }),
      duplex: 'half',
      headers: {
        'content-length': String(21 * 1024 * 1024),
        'content-type': 'multipart/form-data; boundary=x',
        origin: SAME_ORIGIN,
      },
      method: 'POST',
    } as ConstructorParameters<typeof NextRequest>[1])

    const response = await POST(request, { params: Promise.resolve({ meldingId: '123' }) })

    expect(response.status).toBe(400)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('returns 401 without calling the backend when there is no session', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null)
    const fetchSpy = vi.spyOn(global, 'fetch')

    const response = await postAttachment()

    expect(response.status).toBe(401)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('returns 401 without calling the backend when the session has a refresh error', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({ ...validSession, error: 'RefreshAccessTokenError' })
    const fetchSpy = vi.spyOn(global, 'fetch')

    const response = await postAttachment()

    expect(response.status).toBe(401)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('forwards the request to the backend with the session access token and relays its response', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(validSession)

    const response = await postAttachment()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      created_at: '2025-05-26T11:56:34.081Z',
      id: 42,
      original_filename: 'IMG_0815.jpg',
      updated_at: '2025-05-26T11:56:34.081Z',
    })
  })

  it('relays the backend error response as-is on failure', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(validSession)
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: 'Allowed content size exceeded' }), {
        headers: { 'content-type': 'application/json' },
        status: 400,
      }),
    )

    const response = await postAttachment()
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({ detail: 'Allowed content size exceeded' })
  })
})
