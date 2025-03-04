import { render, screen } from '@testing-library/react'

import { Overview } from './Overview'

describe('Overview', () => {
  it('should render correctly', () => {
    render(<Overview />)

    expect(screen.getByText('Back Office')).toBeInTheDocument()
  })
})
