import { render, screen } from '@testing-library/react'

import { Overview } from './Overview'
import { melding } from '../mocks/data'

describe('Overview', () => {
  it('should render correctly', () => {
    render(<Overview data={[melding]} meldingCount={10} totalPages={1} />)

    const idHeader = screen.getByRole('columnheader', { name: 'column-header.id' })
    const firstId = screen.getByRole('cell', { name: '123' })

    expect(idHeader).toBeInTheDocument()
    expect(firstId).toBeInTheDocument()
  })
})
