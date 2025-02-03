import { screen, render } from '@testing-library/react'
import { vi } from 'vitest'

import { Map } from './Map'

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

describe('Map', () => {
  it('renders the component', () => {
    const { container } = render(<Map />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders the current location button', () => {
    render(<Map />)

    const button = screen.getByRole('button', { name: 'Mijn locatie' })

    expect(button).toBeInTheDocument()
  })
})
