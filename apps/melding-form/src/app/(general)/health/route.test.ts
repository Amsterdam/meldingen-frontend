import { GET } from './route'

describe('GET', () => {
  it('returns a 200 response', async () => {
    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('OK')
  })
})
