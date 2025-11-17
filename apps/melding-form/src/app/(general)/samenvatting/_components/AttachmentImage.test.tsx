import { render, screen } from '@testing-library/react'

import { AttachmentImage } from './AttachmentImage'

const createObjectURLMock = vi.fn().mockImplementation(() => 'test-url')

global.URL.createObjectURL = createObjectURLMock
global.URL.revokeObjectURL = vi.fn()

const testBlob = new Blob(['test-blob'], { type: 'image/jpeg' }) as Blob

describe('AttachmentImage', () => {
  it('renders an image when a blob is provided', () => {
    render(<AttachmentImage blob={testBlob} fileName="IMG_0815.jpg" />)

    expect(createObjectURLMock).toHaveBeenCalled()

    const image = screen.getByRole('presentation')

    expect(image).toHaveAttribute('src', 'test-url')
  })

  it('revokes the object URL on unmount', () => {
    const { unmount } = render(<AttachmentImage blob={testBlob} fileName="IMG_0815.jpg" />)

    unmount()

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('test-url')
  })
})
