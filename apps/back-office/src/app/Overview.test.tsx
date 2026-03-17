import { render, screen } from '@testing-library/react'

import { melding } from '../mocks/data'

vi.mock('./_components/OverviewMobile', () => ({
  OverviewMobile: () => <div>OverviewMobile</div>,
}))
vi.mock('./_components/OverviewDesktop', () => ({
  OverviewDesktop: () => <div>OverviewDesktop</div>,
}))

import { Overview } from './Overview'

describe('Overview', () => {
  it('should render correctly', () => {
    render(<Overview meldingen={[melding]} meldingenCount={10} totalPages={1} />)

    expect(screen.getByRole('heading', { level: 1, name: 'overview.title' })).toBeInTheDocument()

    expect(screen.getByText('OverviewMobile')).toBeInTheDocument()
    expect(screen.getByText('OverviewDesktop')).toBeInTheDocument()
  })
})
