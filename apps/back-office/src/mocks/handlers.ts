import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('https://mock-auth.com/protocol/openid-connect/token', () =>
    HttpResponse.json({
      ok: true,
      access_token: 'new-token',
      expires_in: 1800,
      refresh_token: 'new-refresh-token',
      refresh_expires_in: 2800,
    }),
  ),
]
