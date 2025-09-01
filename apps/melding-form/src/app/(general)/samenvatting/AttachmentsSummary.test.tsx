import { render, screen } from '@testing-library/react'

import { AttachmentsSummary, type Props } from './AttachmentsSummary'

const defaultProps: Props = {
  attachments: {
    key: 'attachments',
    term: 'attachments.step.title',
    files: [],
  },
}

describe('AttachmentsSummary', () => {
  beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/uploaded-file-1')
  })

  it('displays the correct number of attachments', () => {
    const attachments = {
      key: 'attachments',
      term: 'attachments.step.title',
      files: [
        {
          blob: new Blob(['file content'], { type: 'application/pdf' }),
          fileName: 'file1.pdf',
          contentType: 'application/pdf',
        },
        {
          blob: new Blob(['image content'], { type: 'image/jpeg' }),
          fileName: 'file2.jpg',
          contentType: 'image/jpeg',
        },
      ],
    }
    render(<AttachmentsSummary {...defaultProps} attachments={attachments} />)

    expect(screen.getByText('file1.pdf')).toBeInTheDocument()
    expect(screen.getByText('file2.jpg')).toBeInTheDocument()
  })

  it('return early when there are no attachments', () => {
    const { container } = render(<AttachmentsSummary {...defaultProps} />)

    expect(container).toBeEmptyDOMElement()
  })
})
