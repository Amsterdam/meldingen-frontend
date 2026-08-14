import { render, screen } from '@testing-library/react'

import { AttachmentPDF } from './AttachmentPDF'

const createObjectURLMock = vi.fn().mockImplementation(() => {
  return 'test-url'
})

global.URL.createObjectURL = createObjectURLMock
global.URL.revokeObjectURL = vi.fn()

describe('AttachmentPDF', () => {
  it('renders a link when a blob is provided', async () => {
    render(<AttachmentPDF blob={new Blob(['test-blob'], { type: 'application/pdf' })} fileName={'test.pdf'} />)

    expect(createObjectURLMock).toHaveBeenCalled()

    const link = screen.getByRole('link')

    expect(link).toHaveAttribute('href')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders an an error message when the blob is missing', async () => {
    render(<AttachmentPDF blob={null} fileName={'test.pdf'} />)

    const errorMessage = screen.getByText('test.pdf')

    expect(errorMessage).toBeInTheDocument()
  })

  it('revokes the object URL on unmount', () => {
    const { unmount } = render(
      <AttachmentPDF blob={new Blob(['test-blob'], { type: 'application/pdf' })} fileName={'test.pdf'} />,
    )

    unmount()

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('test-url')
  })
})
