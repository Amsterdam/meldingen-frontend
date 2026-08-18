import { render, screen } from '@testing-library/react'

import { Attachment } from './Attachment'

const createObjectURLMock = vi.fn().mockImplementation(() => {
  return 'test-url'
})

global.URL.createObjectURL = createObjectURLMock
global.URL.revokeObjectURL = vi.fn()

describe('Attachment', () => {
  describe('Image', () => {
    it('renders an image when a blob is provided', async () => {
      render(<Attachment blob={new Blob(['test-blob'], { type: 'image/jpeg' })} fileName={'IMG_0815.jpg'} />)

      expect(createObjectURLMock).toHaveBeenCalled()

      const image = screen.getByRole('presentation')

      expect(image).toHaveAttribute('src', 'test-url')
    })

    it('renders an an error message when the blob is missing', async () => {
      render(<Attachment blob={null} fileName={'IMG_0815.jpg'} />)

      const errorMessage = screen.getByText('IMG_0815.jpg')

      expect(errorMessage).toBeInTheDocument()
    })

    it('revokes the object URL on unmount', () => {
      const { unmount } = render(
        <Attachment blob={new Blob(['test-blob'], { type: 'image/jpeg' })} fileName={'IMG_0815.jpg'} />,
      )

      unmount()

      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('test-url')
    })
  })

  describe('AttachmentPDF', () => {
    it('renders a link when a blob is provided', async () => {
      render(<Attachment blob={new Blob(['test-blob'], { type: 'application/pdf' })} fileName={'test.pdf'} />)

      expect(createObjectURLMock).toHaveBeenCalled()

      const link = screen.getByRole('link')

      expect(link).toHaveAttribute('href')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('renders an an error message when the blob is missing', async () => {
      render(<Attachment blob={null} fileName={'test.pdf'} />)

      const errorMessage = screen.getByText('test.pdf')

      expect(errorMessage).toBeInTheDocument()
    })

    it('revokes the object URL on unmount', () => {
      const { unmount } = render(
        <Attachment blob={new Blob(['test-blob'], { type: 'application/pdf' })} fileName={'test.pdf'} />,
      )

      unmount()

      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('test-url')
    })
  })
})
