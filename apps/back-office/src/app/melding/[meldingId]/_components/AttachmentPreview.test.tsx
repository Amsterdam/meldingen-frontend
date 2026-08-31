import { render, screen } from '@testing-library/react'

import { AttachmentPreview } from './AttachmentPreview'

const createObjectURLMock = vi.fn().mockImplementation(() => {
  return 'test-url'
})

global.URL.createObjectURL = createObjectURLMock
global.URL.revokeObjectURL = vi.fn()

describe('AttachmentPreview', () => {
  describe('Image', () => {
    it('renders an image when a blob is provided', async () => {
      render(
        <AttachmentPreview
          blob={new Blob(['test-blob'], { type: 'image/jpeg' })}
          fileName={'IMG_0815.jpg'}
          id={7}
          meldingId={42}
        />,
      )

      expect(createObjectURLMock).toHaveBeenCalled()

      const image = screen.getByRole('presentation')

      expect(image).toHaveAttribute('src', 'test-url')

      const link = screen.getByRole('link')

      expect(link).toHaveAttribute('href', '/melding/42/foto?id=7')
    })

    it('renders an an error message when the blob is missing', async () => {
      render(<AttachmentPreview blob={null} fileName={'IMG_0815.jpg'} id={7} meldingId={42} />)

      const errorMessage = screen.getByText('IMG_0815.jpg')

      expect(errorMessage).toBeInTheDocument()
    })

    it('revokes the object URL on unmount', () => {
      const { unmount } = render(
        <AttachmentPreview
          blob={new Blob(['test-blob'], { type: 'image/jpeg' })}
          fileName={'IMG_0815.jpg'}
          id={7}
          meldingId={42}
        />,
      )

      unmount()

      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('test-url')
    })
  })

  describe('AttachmentPreviewPDF', () => {
    it('renders a link with an accessible name when a blob is provided', async () => {
      render(
        <AttachmentPreview
          blob={new Blob(['test-blob'], { type: 'application/pdf' })}
          fileName={'test.pdf'}
          id={1}
          meldingId={42}
        />,
      )

      expect(createObjectURLMock).toHaveBeenCalled()

      const link = screen.getByRole('link', { name: 'pdf-link' })

      expect(link).toHaveAttribute('href')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAccessibleName('pdf-link')
    })

    it('renders an an error message when the blob is missing', async () => {
      render(<AttachmentPreview blob={null} fileName={'test.pdf'} id={1} meldingId={42} />)

      const errorMessage = screen.getByText('test.pdf')

      expect(errorMessage).toBeInTheDocument()
    })

    it('revokes the object URL on unmount', () => {
      const { unmount } = render(
        <AttachmentPreview
          blob={new Blob(['test-blob'], { type: 'application/pdf' })}
          fileName={'test.pdf'}
          id={1}
          meldingId={42}
        />,
      )

      unmount()

      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('test-url')
    })
  })
})
