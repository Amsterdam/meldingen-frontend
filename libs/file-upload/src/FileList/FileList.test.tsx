import { render, screen } from '@testing-library/react'

import { FileList } from './FileList'

describe('FileList', () => {
  it('renders', () => {
    render(<FileList />)

    const component = screen.getByRole('list')

    expect(component).toBeInTheDocument()
    expect(component).toBeVisible()
  })
})
