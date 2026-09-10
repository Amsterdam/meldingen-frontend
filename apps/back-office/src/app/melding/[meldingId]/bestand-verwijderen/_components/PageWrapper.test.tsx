import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { RemoveAttachmentErrorProvider, useRemoveAttachmentError } from '../_context/RemoveAttachmentErrorContext'
import { PageWrapper } from './PageWrapper'

const ErrorTrigger = () => {
  const { setApiError } = useRemoveAttachmentError()

  return (
    <button onClick={() => setApiError('Could not delete attachment')} type="button">
      Trigger error
    </button>
  )
}

describe('PageWrapper', () => {
  it('renders the back link, title and content', () => {
    render(
      <RemoveAttachmentErrorProvider>
        <PageWrapper meldingId={123}>
          <p>Child content</p>
        </PageWrapper>
      </RemoveAttachmentErrorProvider>,
    )

    expect(screen.getByRole('link', { name: 'back-link' })).toHaveAttribute('href', '/melding/123')
    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('renders ApiErrorAlert above the page heading when the context contains an api error', async () => {
    const user = userEvent.setup()

    render(
      <RemoveAttachmentErrorProvider>
        <PageWrapper meldingId={123}>
          <ErrorTrigger />
        </PageWrapper>
      </RemoveAttachmentErrorProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Trigger error' }))

    expect(screen.getByText('Could not delete attachment')).toBeInTheDocument()
    expect(screen.getAllByRole('heading').map((heading) => heading.textContent)).toEqual(['heading', 'title'])
  })
})
