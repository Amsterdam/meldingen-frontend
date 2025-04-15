import { render, screen } from '@testing-library/react'

import { Overview } from './Overview'
import { melding } from '../mocks/data'

describe('Overview', () => {
  it('should render correctly', () => {
    render(<Overview data={[melding]} />)

    const idHeader = screen.getByRole('columnheader', { name: 'Id' })
    const firstId = screen.getByRole('cell', { name: '123' })

    expect(idHeader).toBeInTheDocument()
    expect(firstId).toBeInTheDocument()
  })
})
