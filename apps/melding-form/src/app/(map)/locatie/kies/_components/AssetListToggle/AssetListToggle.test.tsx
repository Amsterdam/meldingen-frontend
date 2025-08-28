import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type L from 'leaflet'

import { AssetListToggle, type Props } from './AssetListToggle'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

const mapInstanceMock = {
  invalidateSize: vi.fn(),
} as unknown as L.Map

const defaultProps: Props = {
  assetList: containerAssets,
  showAssetList: false,
  mapInstance: mapInstanceMock,
  setShowAssetList: vi.fn(),
}

describe('AssetListToggle', () => {
  it('renders nothing if assetList is empty', () => {
    const { container } = render(<AssetListToggle {...defaultProps} assetList={[]} />)

    expect(container.firstChild).toBeNull()
  })

  it('renders button with "list" label when showAssetList is false', () => {
    render(<AssetListToggle {...defaultProps} />)

    expect(screen.getByRole('button')).toHaveTextContent('toggle-button.list')
  })

  it('renders button with "map" label when showAssetList is true', () => {
    render(<AssetListToggle {...defaultProps} showAssetList={true} />)

    expect(screen.getByRole('button')).toHaveTextContent('toggle-button.map')
  })

  it('calls setShowAssetList and mapInstance.invalidateSize() when button is clicked', async () => {
    render(<AssetListToggle {...defaultProps} />)

    await userEvent.click(screen.getByRole('button'))

    expect(defaultProps.setShowAssetList).toHaveBeenCalledTimes(1)
    expect(mapInstanceMock.invalidateSize).toHaveBeenCalledTimes(1)
  })
})
