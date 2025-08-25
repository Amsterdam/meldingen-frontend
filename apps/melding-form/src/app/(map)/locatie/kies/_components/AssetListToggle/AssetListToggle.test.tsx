import { fireEvent, render, screen } from '@testing-library/react'

import { AssetListToggle } from './AssetListToggle'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

const mockT = (key: string) => key

describe('AssetListToggle', () => {
  it('renders nothing if assetList is empty', () => {
    const { container } = render(
      <AssetListToggle assetList={[]} showAssetList={false} t={mockT} handleAssetListToggle={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders button with "list" label when showAssetList is false', () => {
    render(
      <AssetListToggle assetList={containerAssets} showAssetList={false} t={mockT} handleAssetListToggle={vi.fn()} />,
    )
    expect(screen.getByRole('button')).toHaveTextContent('toggle-button.list')
  })

  it('renders button with "map" label when showAssetList is true', () => {
    render(
      <AssetListToggle assetList={containerAssets} showAssetList={true} t={mockT} handleAssetListToggle={vi.fn()} />,
    )
    expect(screen.getByRole('button')).toHaveTextContent('toggle-button.map')
  })

  it('calls handleAssetListToggle when button is clicked', () => {
    const handleToggle = vi.fn()
    render(
      <AssetListToggle
        assetList={containerAssets}
        showAssetList={false}
        t={mockT}
        handleAssetListToggle={handleToggle}
      />,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })
})
