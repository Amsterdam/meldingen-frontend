import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FileListItem, type FileListItemProps } from './FileListItem'

const file = new File(['sample content'], 'sample.txt', { type: 'text/plain' })

const createObjectURLMock = vi.fn().mockImplementation((file: File) => {
  return file.name
})

global.URL.createObjectURL = createObjectURLMock

vi.mock('@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint', () => ({
  default: vi.fn(),
}))

const defaultProps: FileListItemProps = {
  actionButtonLabelCancel: 'Annuleren',
  actionButtonLabelDelete: 'Verwijderen',
  deleteButtonId: 'test-id',
  file,
  progressLabelFinished: 'Upload geslaagd',
  progressLabelLoading: 'Upload 100%',
  status: 'success' as const,
}

describe('FileListItem', () => {
  it('renders', () => {
    render(<FileListItem {...defaultProps} />)

    const component = screen.getByRole('listitem')

    expect(component).toBeInTheDocument()
  })

  it('renders the file name', () => {
    render(<FileListItem {...defaultProps} />)

    const fileName = screen.getAllByText('sample.txt')[0]

    expect(fileName).toBeInTheDocument()
  })

  it('renders an image with the correct src', () => {
    render(<FileListItem {...defaultProps} />)

    const image = screen.getByRole('presentation')

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'sample.txt')
  })

  it('should render correct labels when image is loading', () => {
    const defaultPropsWithLoading = {
      ...defaultProps,
      progressLabelLoading: 'Upload 20%',
      status: 'uploading' as const,
    }

    render(<FileListItem {...defaultPropsWithLoading} />)

    const buttonLabel = screen.getByRole('button', { name: 'Annuleren sample.txt' })
    const statusMessage = screen.getByText('Upload 20%')

    expect(buttonLabel).toBeInTheDocument()
    expect(statusMessage).toBeInTheDocument()
  })

  it('should render correct labels when image is successfully uploaded', () => {
    render(<FileListItem {...defaultProps} />)

    const buttonLabel = screen.getByRole('button', { name: 'Verwijderen sample.txt' })
    const statusMessage = screen.getByText('Upload geslaagd')

    expect(buttonLabel).toBeInTheDocument()
    expect(statusMessage).toBeInTheDocument()
  })

  it('should render correct labels when an error occurs', () => {
    const defaultPropsWithError = {
      ...defaultProps,
      status: 'error' as const,
      errorMessage: 'errors.duplicate-upload',
    }

    render(<FileListItem {...defaultPropsWithError} />)

    const buttonLabel = screen.getByRole('button', { name: 'Verwijderen sample.txt' })
    const statusMessage = screen.getByText('errors.duplicate-upload')

    expect(buttonLabel).toBeInTheDocument()
    expect(statusMessage).toBeInTheDocument()

    const container = screen.getByRole('listitem').firstChild
    expect(container).toHaveClass(/containerWithError/)

    const imageContainer = container?.firstChild
    expect(imageContainer).toHaveClass(/imageContainerWithError/)
  })

  it('calls onDelete when the remove button is clicked', async () => {
    const revokeObjectURLMock = vi.fn()
    global.URL.revokeObjectURL = revokeObjectURLMock

    const user = userEvent.setup()

    const onDelete = vi.fn()

    render(<FileListItem {...defaultProps} onDelete={onDelete} />)

    const deleteButton = screen.getByRole('button', { name: 'Verwijderen sample.txt' })

    await user.click(deleteButton)

    expect(onDelete).toHaveBeenCalled()
    expect(revokeObjectURLMock).toHaveBeenCalled()
  })

  it('adds the provided id to the delete button', () => {
    render(<FileListItem {...defaultProps} />)

    const deleteButton = screen.getByRole('button', { name: 'Verwijderen sample.txt' })

    expect(deleteButton).toHaveAttribute('id', 'test-id')
  })
})
