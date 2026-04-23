import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { Image } from './Image'

describe('Image', () => {
  it('renders an image with the provided alt text', () => {
    render(<Image alt="Test image" height={10} src="/test.png" width={20} />)

    expect(screen.getByRole('img', { name: 'Test image' })).toBeInTheDocument()
  })

  it('falls back to the default fallback image when loading fails', async () => {
    render(<Image alt="Test image" height={10} src="/broken.png" width={20} />)

    const img = screen.getByRole('img', { name: 'Test image' })

    fireEvent.error(img)

    await waitFor(() => {
      expect(img.getAttribute('src') ?? '').toContain('happy.png')
    })
  })

  it('falls back to a custom fallback image when provided', async () => {
    render(<Image alt="Test image" fallbackSrc="/custom-fallback.png" height={10} src="/broken.png" width={20} />)

    const img = screen.getByRole('img', { name: 'Test image' })

    fireEvent.error(img)

    await waitFor(() => {
      expect(img.getAttribute('src') ?? '').toContain('custom-fallback.png')
    })
  })
})
