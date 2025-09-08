import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AssetList, type Props } from './AssetList'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

const defaultProps: Props = {
  assetList: containerAssets,
  selectedAssets: [],
}

describe('AssetList', () => {
  it('renders a list of assets', () => {
    render(<AssetList {...defaultProps} />)

    expect(screen.getByText('Container-001')).toBeInTheDocument()
    expect(screen.getByText('Container-002')).toBeInTheDocument()
  })

  it('renders correct number of list items', () => {
    render(<AssetList {...defaultProps} />)

    const items = screen.getAllByRole('listitem')

    expect(items).toHaveLength(containerAssets.length)
  })

  it('renders nothing when assetList and selectedAssets are empty', () => {
    render(<AssetList {...defaultProps} assetList={[]} />)

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('renders selected asset on the top of list', () => {
    render(<AssetList {...defaultProps} selectedAssets={[containerAssets[1]]} />)

    const items = screen.getAllByRole('listitem')

    const span = items[0].querySelector('span')

    expect(span).toHaveTextContent('Container-002')
  })

  it('renders no duplicated assets', () => {
    render(<AssetList {...defaultProps} selectedAssets={containerAssets} />)

    const items = screen.getAllByRole('listitem')

    expect(items).toHaveLength(containerAssets.length)
  })
})
