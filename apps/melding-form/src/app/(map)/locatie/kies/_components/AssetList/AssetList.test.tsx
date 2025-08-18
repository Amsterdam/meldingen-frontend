import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AssetList } from './AssetList'
import { containerAsset2, containerAsset } from 'apps/melding-form/src/mocks/data'

const mockAssetList = [containerAsset, containerAsset2]

describe('AssetList', () => {
  it('renders a list of assets', () => {
    render(<AssetList assetList={mockAssetList} />)

    expect(screen.getByText('Container-001')).toBeInTheDocument()
    expect(screen.getByText('Container-002')).toBeInTheDocument()
  })

  it('renders correct number of list items', () => {
    render(<AssetList assetList={mockAssetList} />)

    const items = screen.getAllByRole('listitem')

    expect(items).toHaveLength(mockAssetList.length)
  })

  it('renders nothing when assetList is empty', () => {
    render(<AssetList assetList={[]} />)

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
