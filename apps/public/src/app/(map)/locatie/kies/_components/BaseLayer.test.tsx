import { screen, render } from '@testing-library/react'
import { vi } from 'vitest'

import { BaseLayer } from './BaseLayer'

vi.mock('leaflet', async (importOriginal) => {
  const actual = await importOriginal()

  const markerMock = {
    addTo: vi.fn(),
  }

  return {
    default: {
      ...(typeof actual === 'object' ? actual : {}),
      marker: vi.fn(() => markerMock),
    },
  }
})

describe('BaseLayer', () => {
  it('renders the component', () => {
    const { container } = render(<BaseLayer setCoordinates={() => {}} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders the current location button', () => {
    render(<BaseLayer setCoordinates={() => {}} />)

    const button = screen.getByRole('button', { name: 'Mijn locatie' })

    expect(button).toBeInTheDocument()
  })
})
