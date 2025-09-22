import useIsAfterBreakpoint from '@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Mock } from 'vitest'

import { FileListItem } from './FileListItem'

const file = new File(['sample content'], 'sample.txt', { type: 'text/plain' })

const createObjectURLMock = vi.fn().mockImplementation((file: File) => {
  return file.name
})

global.URL.createObjectURL = createObjectURLMock

vi.mock('@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint', () => ({
  default: vi.fn(),
}))

describe('FileListItem', () => {
  it('renders', () => {
    render(<FileListItem file={file} />)

    const component = screen.getByRole('listitem')

    expect(component).toBeInTheDocument()
  })

  it('renders the file name', () => {
    render(<FileListItem file={file} />)

    const fileName = screen.getAllByText('sample.txt')[0]

    expect(fileName).toBeInTheDocument()
  })

  it('renders an image with the correct src', () => {
    render(<FileListItem file={file} />)

    const image = screen.getByRole('presentation')

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'sample.txt')
  })

  it('adds the correct aspect ratio class to the image with a wide screen width', () => {
    ;(useIsAfterBreakpoint as Mock).mockImplementationOnce(() => true)

    render(<FileListItem file={file} />)

    const image = screen.getByRole('presentation')

    expect(image).toBeInTheDocument()
    expect(image).toHaveClass('ams-aspect-ratio-1-1')
  })

  it('adds the correct aspect ratio class to the image with a narrow screen width', () => {
    ;(useIsAfterBreakpoint as Mock).mockImplementationOnce(() => false)

    render(<FileListItem file={file} />)

    const image = screen.getByRole('presentation')

    expect(image).toBeInTheDocument()
    expect(image).toHaveClass('ams-aspect-ratio-16-9')
  })

  it('calls onDelete when the remove button is clicked', async () => {
    const revokeObjectURLMock = vi.fn()
    global.URL.revokeObjectURL = revokeObjectURLMock

    const user = userEvent.setup()

    const onDelete = vi.fn()

    render(<FileListItem file={file} onDelete={onDelete} />)

    const deleteButton = screen.getByRole('button', { name: 'Verwijder sample.txt' })

    await user.click(deleteButton)

    expect(onDelete).toHaveBeenCalled()
    expect(revokeObjectURLMock).toHaveBeenCalled()
  })

  it('renders an error message when provided', () => {
    render(<FileListItem file={file} errorMessage="This is an error" />)

    const errorMessage = screen.getByText('This is an error')

    expect(errorMessage).toBeInTheDocument()
  })

  it('renders a custom delete button label when provided', () => {
    render(<FileListItem file={file} deleteButtonLabel="Custom Delete" />)

    const deleteButton = screen.getByRole('button', { name: 'Custom Delete sample.txt' })

    expect(deleteButton).toBeInTheDocument()
  })
})
