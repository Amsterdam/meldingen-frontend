import { render } from '@testing-library/react'

import { RememberOverviewPage } from './RememberOverviewUrl'
import { COOKIES } from '~/constants'

const navigation = vi.hoisted(() => ({
  pathname: '/',
  searchParams: new URLSearchParams(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  usePathname: () => navigation.pathname,
  useSearchParams: () => navigation.searchParams,
}))

describe('RememberOverviewUrl', () => {
  beforeEach(() => {
    navigation.pathname = '/'
    navigation.searchParams = new URLSearchParams()
    document.cookie = `${COOKIES.LAST_OVERVIEW_URL}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  })

  it('stores the current overview url including search params in a cookie', () => {
    navigation.searchParams = new URLSearchParams('pagina=4')

    render(<RememberOverviewPage />)

    expect(document.cookie).toContain(`${COOKIES.LAST_OVERVIEW_URL}=${encodeURIComponent('/?pagina=4')}`)
  })

  it('stores only the pathname when there are no search params', () => {
    render(<RememberOverviewPage />)

    expect(document.cookie).toContain(`${COOKIES.LAST_OVERVIEW_URL}=${encodeURIComponent('/')}`)
  })

  it('updates the cookie when the search params change', () => {
    navigation.searchParams = new URLSearchParams('pagina=2')
    const { rerender } = render(<RememberOverviewPage />)

    navigation.searchParams = new URLSearchParams('pagina=3')
    rerender(<RememberOverviewPage />)

    expect(document.cookie).toContain(`${COOKIES.LAST_OVERVIEW_URL}=${encodeURIComponent('/?pagina=3')}`)
  })

  it('renders nothing', () => {
    const { container } = render(<RememberOverviewPage />)

    expect(container).toBeEmptyDOMElement()
  })
})
