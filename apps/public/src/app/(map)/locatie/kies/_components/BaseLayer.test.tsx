import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { BaseLayer } from './BaseLayer'

describe('BaseLayer', () => {
  it('renders the component', () => {
    const { container } = render(<BaseLayer />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders the current location button', () => {
    render(<BaseLayer />)

    const button = screen.getByRole('button', { name: 'Mijn locatie' })

    expect(button).toBeInTheDocument()
  })

  it('displays a notification on geolocation error', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementationOnce((_, error) =>
        error({
          code: 1,
          message: 'User denied Geolocation',
        }),
      ),
    }

    // @ts-expect-error: This isn't a problem in tests
    global.navigator.geolocation = mockGeolocation

    const user = userEvent.setup()

    render(<BaseLayer />)

    const button = screen.getByRole('button', { name: 'Mijn locatie' })

    await user.click(button)

    const notification = screen.getByRole('heading', {
      name: 'meldingen.amsterdam.nl heeft geen toestemming om uw locatie te gebruiken.',
    })

    expect(notification).toBeInTheDocument()
  })

  it('calls onSuccess on geolocation success', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementationOnce((success) =>
        success({
          coords: {
            latitude: 52.370216,
            longitude: 4.895168,
          },
        }),
      ),
    }

    // @ts-expect-error: This isn't a problem in tests
    global.navigator.geolocation = mockGeolocation

    const user = userEvent.setup()

    render(<BaseLayer />)

    const button = screen.getByRole('button', { name: 'Mijn locatie' })

    await user.click(button)

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
  })
})

// TODO: add tests
