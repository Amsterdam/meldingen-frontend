import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { AssetList, type Props } from './AssetList'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

const defaultProps: Props = {
  assetList: containerAssets,
  selectedAssets: [],
  setCoordinates: vi.fn(),
  setSelectedAssets: vi.fn(),
}

describe('AssetList', () => {
  it('renders nothing when assetList and selectedAssets are empty', () => {
    const { container } = render(<AssetList {...defaultProps} assetList={[]} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders a list of assets', () => {
    render(<AssetList {...defaultProps} />)

    expect(screen.getByText('Container-001')).toBeInTheDocument()
    expect(screen.getByText('Container-002')).toBeInTheDocument()
  })

  it('renders correct number of list items', () => {
    render(<AssetList {...defaultProps} />)

    const checkboxes = screen.getAllByRole('checkbox')

    expect(checkboxes).toHaveLength(containerAssets.length)
  })

  it('renders selected asset on the top of list', () => {
    render(<AssetList {...defaultProps} selectedAssets={[containerAssets[1]]} />)

    const checkboxes = screen.getAllByRole('checkbox')

    expect(checkboxes[0]).toHaveAccessibleName(/Container-002/)
  })

  it('renders no duplicated assets', () => {
    render(<AssetList {...defaultProps} selectedAssets={containerAssets} />)

    const checkboxes = screen.getAllByRole('checkbox')

    expect(checkboxes).toHaveLength(containerAssets.length)
  })

  it('sets coordinates and update selected assets when asset in list is clicked', async () => {
    render(<AssetList {...defaultProps} />)

    const checkbox = screen.getByRole('checkbox', { name: /Container-001/ })

    expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox)

    // @ts-expect-error an asset always has coordinates
    const [y, x] = containerAssets[0].geometry.coordinates

    expect(defaultProps.setCoordinates).toHaveBeenCalledWith({ lat: x, lng: y })
    expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
    expect(checkbox).toBeChecked()
  })

  it('resets coordinates when last selected asset is deselected', async () => {
    render(<AssetList {...defaultProps} selectedAssets={[containerAssets[0]]} />)

    const checkbox = screen.getByRole('checkbox', { name: /Container-001/ })

    await userEvent.click(checkbox)

    expect(defaultProps.setCoordinates).toHaveBeenCalledWith()
    expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
  })

  it('it sets coordinates of the previous selected asset when top selected asset is deselected', async () => {
    render(<AssetList {...defaultProps} selectedAssets={containerAssets} />)

    const checkbox = screen.getByRole('checkbox', { name: /Container-001/ })

    await userEvent.click(checkbox)

    // @ts-expect-error an asset always has coordinates
    const [y, x] = containerAssets[1].geometry.coordinates

    expect(defaultProps.setCoordinates).toHaveBeenCalledWith({ lat: x, lng: y })
    expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
  })

  it('it keeps coordinates when other then top asset is deselected', async () => {
    render(<AssetList {...defaultProps} selectedAssets={containerAssets} />)

    const checkbox = screen.getByRole('checkbox', { name: /Container-002/ })

    await userEvent.click(checkbox)

    expect(defaultProps.setCoordinates).not.toHaveBeenCalled()
    expect(defaultProps.setSelectedAssets).toHaveBeenCalled()
  })
})
