import { render, screen } from '@testing-library/react'

import { Map, type Props } from './Map'

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

const defaultProps: Props = {
  mapInstance: null,
  setCoordinates: vi.fn(),
  setMapInstance: vi.fn(),
  setSelectedAssets: vi.fn(),
  selectedAssets: [],
}

describe('Map', () => {
  it('renders the component', () => {
    const { container } = render(<Map {...defaultProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders the current location button', () => {
    render(<Map {...defaultProps} />)

    const button = screen.getByRole('button', { name: 'current-location-button' })

    expect(button).toBeInTheDocument()
  })
})
