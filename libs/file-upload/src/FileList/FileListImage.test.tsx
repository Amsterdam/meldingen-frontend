import { render, screen } from '@testing-library/react'

import { FileListImage } from './FileListImage'

const createObjectURLMock = vi.fn().mockImplementation(() => 'test-url')

global.URL.createObjectURL = createObjectURLMock
global.URL.revokeObjectURL = vi.fn()

const testFile = new File(['test-file'], 'test.jpg', { type: 'image/jpeg' })

describe('FileListImage', () => {
  it('renders an image when a file is provided', async () => {
    render(<FileListImage file={testFile} />)

    expect(createObjectURLMock).toHaveBeenCalled()

    const image = screen.getByRole('presentation')

    expect(image).toHaveAttribute('src', 'test-url')
  })

  it('revokes the object URL on unmount', () => {
    const { unmount } = render(<FileListImage file={testFile} />)

    unmount()

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('test-url')
  })

  it('shows a placeholder when only passing the file name instead of a File instance', () => {
    const { container } = render(<FileListImage file={{ name: 'test' }} />)

    const placeholder = container.querySelector('[class*="_placeholder"]')

    expect(placeholder).toBeInTheDocument()
  })
})
