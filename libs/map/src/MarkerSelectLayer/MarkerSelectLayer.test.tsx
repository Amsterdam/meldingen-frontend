import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { MarkerSelectLayer, Props } from './MarkerSelectLayer'

const defaultProps: Props = {
  features: [],
  maxMarkers: 5,
  onFeaturesChange: vi.fn(),
  onMaxMarkersReached: vi.fn(),
  onSelectedMarkersChange: vi.fn(),
  selectedMarkers: [],
  updateSelectedPoint: vi.fn(),
}

describe('MarkerSelectLayer', () => {
  it('returns undefined', () => {
    const { container } = render(<MarkerSelectLayer {...defaultProps} />)

    expect(container.firstChild).toBeNull()
  })
})
