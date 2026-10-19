import { getOverviewHref } from './getOverviewHref'
import { COOKIES } from '~/constants'
import { mockCookies } from '~/mocks/utils'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

describe('getOverviewHref', () => {
  it('returns the overview page stored in the cookie', async () => {
    mockCookies({ [COOKIES.OVERVIEW_PAGE]: '4' })

    expect(await getOverviewHref()).toBe('/?pagina=4')
  })

  it('returns the first overview page when the cookie is not set', async () => {
    mockCookies({})

    expect(await getOverviewHref()).toBe('/')
  })

  it.each(['1', '0', '-2', 'abc'])('returns the first overview page when the cookie value is "%s"', async (value) => {
    mockCookies({ [COOKIES.OVERVIEW_PAGE]: value })

    expect(await getOverviewHref()).toBe('/')
  })
})
