import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { AssetIcon } from './AssetIcon'

describe('AssetIcon', () => {
  it('renders an icon with the provided alt text', () => {
    render(<AssetIcon alt="Test icon" height={10} src="/test.png" width={20} />)

    expect(screen.getByRole('img', { name: 'Test icon' })).toBeInTheDocument()
  })

  it('falls back to the default fallback icon when loading fails', async () => {
    render(<AssetIcon alt="Test icon" height={10} src="/broken.png" width={20} />)

    const img = screen.getByRole('img', { name: 'Test icon' })

    fireEvent.error(img)

    await waitFor(() => {
      expect(img.getAttribute('src')).toContain('asset-fallback.svg')
    })
  })
})
