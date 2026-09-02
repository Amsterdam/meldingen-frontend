import type { ComponentProps } from 'react'

import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { AssetItem } from '../../_utils/formatAssetItem'

import { AssetElement } from './AssetElement'

vi.mock('next/image', () => ({
  default: ({ alt = '', ...props }: ComponentProps<'img'>) =>
    createElement('img', { ...props, alt }) as ReturnType<typeof createElement>,
}))

const createAsset = (overrides?: Partial<AssetItem>): AssetItem => ({
  icon: {
    entry: 'fractie_omschrijving',
    folder: 'container',
  },
  id: 'container.1',
  label: 'Restafval container - Container-001',
  subtype: 'Glas',
  ...overrides,
})

describe('AssetElement', () => {
  it('renders the asset label and matching icon', () => {
    render(createElement(AssetElement, { asset: createAsset() }))

    expect(screen.getByText('Restafval container - Container-001')).toBeInTheDocument()

    const icon = screen.getByRole('presentation')

    expect(icon).toHaveAttribute('src', '/container/glas.svg')
    expect(icon).toHaveAttribute('width', '32')
    expect(icon).toHaveAttribute('height', '32')
    expect(icon).toHaveAttribute('alt', '')
  })

  it('falls back to the default icon when the subtype is unknown', () => {
    render(createElement(AssetElement, { asset: createAsset({ subtype: 'Unknown subtype' }) }))

    const icon = screen.getByRole('presentation')

    expect(icon).toHaveAttribute('src', '/container/rest.svg')
  })
})
