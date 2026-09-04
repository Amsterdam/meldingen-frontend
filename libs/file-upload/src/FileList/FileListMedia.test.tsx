import { render, screen } from '@testing-library/react'

import { FileListMedia } from './FileListMedia'

const createObjectURLMock = vi.fn().mockImplementation(() => 'test-url')

global.URL.createObjectURL = createObjectURLMock
global.URL.revokeObjectURL = vi.fn()

const testFile = new File(['test-file'], 'test.jpg', { type: 'image/jpeg' })
const testPDFFile = new File(['test-pdf-file'], 'test.pdf', { type: 'application/pdf' })

describe('FileListMedia', () => {
  it('renders an image when an image is provided', async () => {
    render(<FileListMedia file={testFile} />)

    expect(createObjectURLMock).toHaveBeenCalled()

    const image = screen.getByRole('presentation')

    expect(image).toHaveAttribute('src', 'test-url')
  })

  it('renders a PDF placeholder when a PDF is provided', async () => {
    const { container } = render(<FileListMedia file={testPDFFile} />)

    expect(createObjectURLMock).toHaveBeenCalled()

    const pdfPlaceholder = container.querySelector('[class*="_pdf"]')

    expect(pdfPlaceholder).toBeInTheDocument()
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
  })

  it('revokes the object URL on unmount', () => {
    const { unmount } = render(<FileListMedia file={testFile} />)

    unmount()

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('test-url')
  })

  it('shows a placeholder when only passing the file name instead of a File instance', () => {
    const { container } = render(<FileListMedia file={{ name: 'test' }} />)

    const placeholder = container.querySelector('[class*="_placeholder"]')

    expect(placeholder).toBeInTheDocument()
  })
})
