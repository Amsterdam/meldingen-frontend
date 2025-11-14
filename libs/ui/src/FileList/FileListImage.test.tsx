import { render, screen } from '@testing-library/react'

import { FileListImage } from './FileListImage'

const createObjectURLMock = vi.fn().mockImplementation(() => 'test-url')

global.URL.createObjectURL = createObjectURLMock
global.URL.revokeObjectURL = vi.fn()

const testBlob = new Blob(['test-blob'], { type: 'image/jpeg' }) as Blob

describe('FileListImage', () => {
  it('renders an image when a blob is provided', async () => {
    render(<FileListImage blob={testBlob} />)

    expect(createObjectURLMock).toHaveBeenCalled()

    const image = screen.getByRole('presentation')

    expect(image).toHaveAttribute('src', 'test-url')
  })

  it('revokes the object URL on unmount', () => {
    const { unmount } = render(<FileListImage blob={testBlob} />)

    unmount()

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('test-url')
  })
})
