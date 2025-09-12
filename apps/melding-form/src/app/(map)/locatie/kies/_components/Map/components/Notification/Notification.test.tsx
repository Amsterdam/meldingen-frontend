import { render, screen } from '@testing-library/react'

import { Notification, type Props } from './Notification'

const defaultProps: Props = {
  closeButtonLabel: 'Sluiten',
  heading: 'We mogen je locatie niet gebruiken',
  onClose: vi.fn(),
  severity: 'error',
}

describe('Notification component', () => {
  it('renders without description', () => {
    render(<Notification {...defaultProps} />)

    expect(screen.getByText(defaultProps.heading)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sluiten' })).toBeInTheDocument()
  })

  it('render with description', () => {
    render(<Notification {...defaultProps} description="Zet locatie aan in de browser" />)

    expect(screen.getByText('Zet locatie aan in de browser')).toBeInTheDocument()
  })
})
