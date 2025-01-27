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
    const { container } = render(<Map setCoordinates={() => {}} hideListView />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders the current location button', () => {
    render(<Map setCoordinates={() => {}} hideListView />)

    const button = screen.getByRole('button', { name: 'Mijn locatie' })

    expect(button).toBeInTheDocument()
  })
})
