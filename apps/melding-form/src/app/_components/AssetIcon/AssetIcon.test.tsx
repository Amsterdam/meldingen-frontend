import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import type { Feature } from '@meldingen/api-client'

import { AssetIcon } from './AssetIcon'
import { FALLBACK_SRC } from 'apps/melding-form/src/constants'

describe('AssetIcon', () => {
  it('renders an icon with the provided alt text', () => {
    render(
      <AssetIcon
        alt="Test icon"
        assetTypeIconConfig={{ iconEntry: 'icon_name', iconFolder: 'container' }}
        height={10}
        properties={{ icon_name: 'rest' } as Feature['properties']}
        width={20}
      />,
    )

    expect(screen.getByRole('img', { name: 'Test icon' })).toBeInTheDocument()
  })

  it.each(['rest', 'glas'])('resolves to the correct icon path for assets', (name) => {
    render(
      <AssetIcon
        alt="Test icon"
        assetTypeIconConfig={{ iconEntry: 'icon_name', iconFolder: 'container' }}
        height={10}
        properties={{ icon_name: name } as Feature['properties']}
        width={20}
      />,
    )

    expect(screen.getByRole('img', { name: 'Test icon' }).getAttribute('src')).toContain(`/container/${name}.svg`)
  })

  it('falls back to fallback src when iconFolder is missing', () => {
    render(
      <AssetIcon
        alt="Test icon"
        assetTypeIconConfig={{ iconEntry: 'icon_name' }}
        height={10}
        properties={{ icon_name: 'rest' } as Feature['properties']}
        width={20}
      />,
    )

    expect(screen.getByRole('img', { name: 'Test icon' }).getAttribute('src')).toContain(FALLBACK_SRC)
  })

  it('falls back to fallback src when iconEntry is missing or property is absent', () => {
    const { rerender } = render(
      <AssetIcon
        alt="Test icon"
        assetTypeIconConfig={{ iconFolder: 'container' }}
        height={10}
        properties={{ icon_name: 'rest' } as Feature['properties']}
        width={20}
      />,
    )

    expect(screen.getByRole('img', { name: 'Test icon' }).getAttribute('src')).toContain(FALLBACK_SRC)

    rerender(
      <AssetIcon
        alt="Test icon"
        assetTypeIconConfig={{ iconEntry: 'icon_name', iconFolder: 'container' }}
        height={10}
        properties={null}
        width={20}
      />,
    )

    expect(screen.getByRole('img', { name: 'Test icon' }).getAttribute('src')).toContain(FALLBACK_SRC)
  })

  it('falls back to the default fallback icon when loading fails', async () => {
    render(
      <AssetIcon
        alt="Test icon"
        assetTypeIconConfig={{ iconEntry: 'icon_name', iconFolder: 'container' }}
        height={10}
        properties={{ icon_name: 'broken' } as Feature['properties']}
        width={20}
      />,
    )

    const img = screen.getByRole('img', { name: 'Test icon' })

    fireEvent.error(img)

    await waitFor(() => {
      expect(img.getAttribute('src')).toContain('asset-fallback.svg')
    })
  })
})
