import { render, screen } from '@testing-library/react'

import { Attachment } from './Attachment'

const createObjectURLMock = vi.fn().mockImplementation(() => {
  return 'test-url'
})

global.URL.createObjectURL = createObjectURLMock
global.URL.revokeObjectURL = vi.fn()

describe('Attachment', () => {
  describe('Image', () => {
    it('renders a link containing an image when an image blob is provided', async () => {
      render(
        <Attachment
          blob={new Blob(['test-blob'], { type: 'image/jpeg' })}
          fileName="IMG_0815.jpg"
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
      render(<Attachment blob={null} fileName="IMG_0815.jpg" id={7} meldingId={42} />)

      const errorMessage = screen.getByText('IMG_0815.jpg')

      expect(errorMessage).toBeInTheDocument()
    })

    it('revokes the object URL on unmount', () => {
      const { unmount } = render(
        <Attachment
          blob={new Blob(['test-blob'], { type: 'image/jpeg' })}
          fileName="IMG_0815.jpg"
          id={7}
          meldingId={42}
        />,
      )

      unmount()

      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('test-url')
    })
  })

  describe('AttachmentPDF', () => {
    it('renders a link when a PDF blob is provided', async () => {
      render(
        <Attachment
          blob={new Blob(['test-blob'], { type: 'application/pdf' })}
          fileName="test.pdf"
          id={1}
          meldingId={42}
        />,
      )

      expect(createObjectURLMock).toHaveBeenCalled()

      const link = screen.getByRole('link')

      expect(link).toHaveAttribute('href')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('renders an an error message when the blob is missing', async () => {
      render(<Attachment blob={null} fileName="test.pdf" id={1} meldingId={42} />)

      const errorMessage = screen.getByText('test.pdf')

      expect(errorMessage).toBeInTheDocument()
    })

    it('revokes the object URL on unmount', () => {
      const { unmount } = render(
        <Attachment
          blob={new Blob(['test-blob'], { type: 'application/pdf' })}
          fileName="test.pdf"
          id={1}
          meldingId={42}
        />,
      )

      unmount()

      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('test-url')
    })
  })
})
