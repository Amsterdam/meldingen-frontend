import { render, screen } from '@testing-library/react'

import { Map } from './Map'
import { useWFSLayer } from './useWFSLayer'

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

vi.mock('./useWFSLayer', () => ({
  useWFSLayer: vi.fn(),
}))

describe('Map', () => {
  it('renders the component', () => {
    const { container } = render(<Map setCoordinates={() => {}} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders the current location button', () => {
    render(<Map setCoordinates={() => {}} />)

    const button = screen.getByRole('button', { name: 'current-location-button' })

    expect(button).toBeInTheDocument()
  })

  it('calls the useWFSLayer hook', () => {
    render(<Map setCoordinates={() => {}} />)

    expect(useWFSLayer).toHaveBeenCalled()
  })
})
