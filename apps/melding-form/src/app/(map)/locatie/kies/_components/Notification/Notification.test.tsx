import { render, screen } from '@testing-library/react'

import { Notification } from './Notification'

describe('Notification component', () => {
  it('renders the too many assets notification', () => {
    render(<Notification type="too-many-assets" />)

    expect(screen.getByText('too-many-assets.title', { exact: false })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'too-many-assets.close-button' })).toBeInTheDocument()
  })

  it('renders the location service disabled notification', () => {
    render(<Notification type="location-service-disabled" />)

    expect(screen.getByText('location-service-disabled.title')).toBeInTheDocument()
    expect(screen.getByText('location-service-disabled.description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'location-service-disabled.close-button' })).toBeInTheDocument()
  })
})
