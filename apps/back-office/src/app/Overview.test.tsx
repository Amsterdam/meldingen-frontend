import { render, screen } from '@testing-library/react'

import { melding } from '../mocks/data'
import { COOKIES } from '~/constants'

vi.mock('./_components/OverviewMobile', () => ({
  OverviewMobile: () => <div>OverviewMobile</div>,
}))
vi.mock('./_components/OverviewDesktop', () => ({
  OverviewDesktop: () => <div>OverviewDesktop</div>,
}))
vi.mock('./_components/PageSizeSelect', () => ({
  PageSizeSelect: () => <div>PageSizeSelect</div>,
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams('pagina=3'),
}))

import { Overview } from './Overview'

describe('Overview', () => {
  it('should render correctly', () => {
    render(<Overview meldingen={[melding]} meldingenCount={10} pageSize={10} totalPages={1} />)

    expect(screen.getByRole('heading', { level: 1, name: 'overview.title' })).toBeInTheDocument()

    expect(screen.getByText('OverviewMobile')).toBeInTheDocument()
    expect(screen.getByText('OverviewDesktop')).toBeInTheDocument()
    expect(screen.getByText('PageSizeSelect')).toBeInTheDocument()
  })

  it('remembers the current overview url', () => {
    render(<Overview meldingen={[melding]} meldingenCount={30} page={3} pageSize={10} totalPages={3} />)

    expect(document.cookie).toContain(`${COOKIES.LAST_OVERVIEW_URL}=${encodeURIComponent('/?pagina=3')}`)
  })
})
