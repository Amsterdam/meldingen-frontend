import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { MarkerSelectLayer, Props } from './MarkerSelectLayer'

const defaultProps: Props = {
  markers: [],
  selectedMarkers: [],
  onMarkersChange: vi.fn(),
  onSelectedMarkersChange: vi.fn(),
  updateSelectedPoint: vi.fn(),
  onMaxMarkersReached: vi.fn(),
}

describe('MarkerSelectLayer', () => {
  it('returns undefined', () => {
    const { container } = render(<MarkerSelectLayer {...defaultProps} />)

    expect(container.firstChild).toBeNull()
  })
})
