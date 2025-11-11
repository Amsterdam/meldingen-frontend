import { render, screen } from '@testing-library/react'

import { AttachmentImage } from './AttachmentImage'

vi.mock('@amsterdam/design-system-react', async () => {
  const actual = await vi.importActual('@amsterdam/design-system-react')
  return {
    ...actual,
    Image: vi.fn(),
  }
})

const createObjectURLMock = vi.fn().mockImplementation(() => {
  return 'test-url'
})

global.URL.createObjectURL = createObjectURLMock

describe('AttachmentImage', () => {
  it('renders an image when a blob is provided', async () => {
    render(<AttachmentImage blob={new Blob(['test-blob'], { type: 'image/jpeg' })} fileName={'IMG_0815.jpg'} />)

    expect(createObjectURLMock).toHaveBeenCalled()

    const image = screen.getByRole('presentation')

    expect(image).toHaveAttribute('src', 'test-url')
  })

  it('renders an an error message when the blob is missing', async () => {
    render(<AttachmentImage blob={null} fileName={'IMG_0815.jpg'} />)

    const errorMessage = screen.getByText('IMG_0815.jpg')

    expect(errorMessage).toBeInTheDocument()
  })
})
