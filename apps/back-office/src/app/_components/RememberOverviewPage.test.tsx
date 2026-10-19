import { render } from '@testing-library/react'

import { RememberOverviewPage } from './RememberOverviewPage'
import { COOKIES } from '~/constants'

describe('RememberOverviewPage', () => {
  beforeEach(() => {
    document.cookie = `${COOKIES.OVERVIEW_PAGE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  })

  it('stores the current overview page in a cookie', () => {
    render(<RememberOverviewPage page={4} />)

    expect(document.cookie).toContain(`${COOKIES.OVERVIEW_PAGE}=4`)
  })

  it('stores page 1 when no page is provided', () => {
    render(<RememberOverviewPage />)

    expect(document.cookie).toContain(`${COOKIES.OVERVIEW_PAGE}=1`)
  })

  it('updates the cookie when the page changes', () => {
    const { rerender } = render(<RememberOverviewPage page={2} />)

    rerender(<RememberOverviewPage page={3} />)

    expect(document.cookie).toContain(`${COOKIES.OVERVIEW_PAGE}=3`)
  })

  it('renders nothing', () => {
    const { container } = render(<RememberOverviewPage page={2} />)

    expect(container).toBeEmptyDOMElement()
  })
})
