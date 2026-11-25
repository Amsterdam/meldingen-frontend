import { render, screen } from '@testing-library/react'

import { FileList } from './FileList'

describe('FileList', () => {
  it('renders', () => {
    render(<FileList />)

    const component = screen.getByRole('list')

    expect(component).toBeInTheDocument()
    expect(component).toBeVisible()
  })

  // Safari drops the implicit list role when `list-style: none` is set, so the role must be explicit
  it('has an explicit list role', () => {
    render(<FileList />)

    expect(screen.getByRole('list')).toHaveAttribute('role', 'list')
  })
})
