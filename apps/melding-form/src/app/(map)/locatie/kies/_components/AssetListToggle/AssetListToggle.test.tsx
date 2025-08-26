import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AssetListToggle, type Props } from './AssetListToggle'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

const defaultProps: Props = {
  assetList: containerAssets,
  handleAssetListToggle: vi.fn(),
  showAssetList: false,
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

  it('calls handleAssetListToggle when button is clicked', async () => {
    render(<AssetListToggle {...defaultProps} />)

    await userEvent.click(screen.getByRole('button'))

    expect(defaultProps.handleAssetListToggle).toHaveBeenCalledTimes(1)
  })
})
