import { render, screen } from '@testing-library/react'

import { Overview } from './Overview'
import { melding } from '../mocks/data'

describe('Overview', () => {
  it('should render correctly', () => {
    const meldingWithAddress = {
      ...melding,
      address: 'Amstel 1',
    }

    render(<Overview data={[meldingWithAddress]} meldingCount={10} totalPages={1} />)

    const idHeader = screen.getByRole('columnheader', { name: 'column-header.public_id' })
    const firstId = screen.getByRole('cell', { name: 'ABC' })

    expect(idHeader).toBeInTheDocument()
    expect(firstId).toBeInTheDocument()
  })
})
