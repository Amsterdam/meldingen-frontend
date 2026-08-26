import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { FileUploadState } from '@meldingen/file-upload'

import { AttachmentsList } from './AttachmentsList'

const createFile = (overrides: Partial<FileUploadState> = {}): FileUploadState =>
  ({
    file: new File(['sample content'], 'sample.txt', { type: 'text/plain' }),
    id: 'file-1',
    progress: 100,
    status: 'success',
    ...overrides,
  }) as FileUploadState

describe('AttachmentsList', () => {
  it('renders one list item per file', () => {
    const files = [createFile({ id: 'file-1' }), createFile({ id: 'file-2' })]

    render(<AttachmentsList files={files} handleDelete={vi.fn()} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('renders nothing when there are no files', () => {
    render(<AttachmentsList files={[]} handleDelete={vi.fn()} />)

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('renders the file name', () => {
    render(<AttachmentsList files={[createFile()]} handleDelete={vi.fn()} />)

    expect(screen.getAllByText('sample.txt')[0]).toBeInTheDocument()
  })

  it('shows the delete action and finished label when upload succeeded at 100%', () => {
    render(<AttachmentsList files={[createFile({ progress: 100, status: 'success' })]} handleDelete={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'file-upload.action-button-delete sample.txt' })).toBeInTheDocument()
    expect(screen.getByText('file-upload.progress-finished')).toBeInTheDocument()
  })

  it('does not show the finished label when a successful upload is below 100%', () => {
    render(<AttachmentsList files={[createFile({ progress: 99, status: 'success' })]} handleDelete={vi.fn()} />)

    expect(screen.queryByText('file-upload.progress-finished')).not.toBeInTheDocument()
  })

  it('shows the translated error message when a file errored', () => {
    render(
      <AttachmentsList
        files={[createFile({ errorMessage: 'validation-errors.file-too-large', status: 'error' })]}
        handleDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('validation-errors.file-too-large')).toBeInTheDocument()
  })

  it('confirms deletion has been called with required params', async () => {
    const user = userEvent.setup()
    const handleDelete = vi.fn()

    render(<AttachmentsList files={[createFile()]} handleDelete={handleDelete} />)

    await user.click(screen.getByRole('button', { name: 'file-upload.action-button-delete sample.txt' }))

    expect(handleDelete).toHaveBeenCalledWith('file-1', 'sample.txt', undefined, undefined)
  })

  it('calls handleDelete with the file details when deletion is confirmed', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const handleDelete = vi.fn()
    const xhr = new XMLHttpRequest()

    render(<AttachmentsList files={[createFile({ id: 'file-1', serverId: 42, xhr })]} handleDelete={handleDelete} />)

    await user.click(screen.getByRole('button', { name: 'file-upload.action-button-delete sample.txt' }))

    expect(handleDelete).toHaveBeenCalledWith('file-1', 'sample.txt', xhr, 42)
  })

  it('sets the delete button id to the file id', () => {
    render(<AttachmentsList files={[createFile({ id: 'my-file-id' })]} handleDelete={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'file-upload.action-button-delete sample.txt' })).toHaveAttribute(
      'id',
      'my-file-id',
    )
  })

  it('only deletes the file that was clicked when multiple files are present', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const handleDelete = vi.fn()

    const files = [
      createFile({ file: new File(['a'], 'first.txt'), id: 'file-1' }),
      createFile({ file: new File(['b'], 'second.txt'), id: 'file-2' }),
    ]

    render(<AttachmentsList files={files} handleDelete={handleDelete} />)

    await user.click(screen.getByRole('button', { name: 'file-upload.action-button-delete second.txt' }))

    expect(handleDelete).toHaveBeenCalledTimes(1)
    expect(handleDelete).toHaveBeenCalledWith('file-2', 'second.txt', undefined, undefined)
  })
})
