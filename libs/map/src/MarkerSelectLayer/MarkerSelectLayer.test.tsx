import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { MarkerSelectLayer, Props } from './MarkerSelectLayer'

const defaultProps: Props = {
  markers: [],
  maxMarkers: 5,
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

// MARKER EFFECT

// returns early when mapInstance is not provided

// returns early when there are no assets

// removes the previous asset layer if it exists

// adds a new asset layer if it doesn't exist

// calls getContainerFeatureIcon for each feature

// assigns marker to markersRef using feature id

// creates cluster icons with correct properties and disables keyboard

// skips features without geometry or with non-Point geometry

// // CLICKED WHEN SELECTED

// // resets onMaxMarkersReached

// // calls onSelectedMarkersChange with list of selected markers minus clicked marked

// // sets selected point as undefined if it is the last marker

// // sets address to second last selected asset when last selected asset is deselected by clicking marker

// // CLICKED WHEN NOT SELECTED

// // does not add more than maxMarkers when marker is clicked

// calls onSelectedMarkersChange and updates selected point

// fetchMarkersOnMoveEnd

// // returns undefined if classification is undefined

// // does not fetch assets if classification has no asset support

// // does not fetch assets if map is hidden

// // calls setAssetList with fetched assets

// // calls onMarkersChange with fetched assets

// // throws an error if the API call fails

// // calls onMarkersChange with empty array and remove layer if zoom is below threshold
