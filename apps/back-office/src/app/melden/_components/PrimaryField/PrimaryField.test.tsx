import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import * as apiClient from '@meldingen/api-client'

import { PrimaryField } from './PrimaryField'
import { textAreaComponent } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const defaultProps = {
  config: textAreaComponent,
  defaultValue: '',
  onMeldingPrefetched: vi.fn(),
}

describe('PrimaryField', () => {
  it('renders the primary field with the correct label and description', () => {
    render(<PrimaryField {...defaultProps} />)

    const input = screen.getByRole('textbox', { name: textAreaComponent.label })

    expect(input).toBeInTheDocument()
    expect(input).toHaveAccessibleDescription(textAreaComponent.description)
  })

  it('initializes the character count with 0', () => {
    render(<PrimaryField {...defaultProps} />)

    expect(screen.getByText(`0 van ${textAreaComponent.maxCharCount} tekens`)).toBeInTheDocument()
  })

  it('updates the character count when the user types in the textarea', async () => {
    const user = userEvent.setup()

    render(<PrimaryField {...defaultProps} />)

    await user.type(screen.getByRole('textbox', { name: textAreaComponent.label }), 'Hello')

    expect(screen.getByText(`5 van ${textAreaComponent.maxCharCount} tekens`)).toBeInTheDocument()
  })

  it('does not render the character count when maxCharCount is not provided', () => {
    render(<PrimaryField {...defaultProps} config={{ ...textAreaComponent, maxCharCount: null }} />)

    expect(screen.queryByText(/tekens/)).not.toBeInTheDocument()
  })

  it('does not update the character count when maxCharCount is not provided and the user types', async () => {
    const user = userEvent.setup()

    render(<PrimaryField {...defaultProps} config={{ ...textAreaComponent, maxCharCount: null }} />)

    await user.type(screen.getByRole('textbox', { name: textAreaComponent.label }), 'Hello')

    expect(screen.queryByText(/tekens/)).not.toBeInTheDocument()
  })

  it('renders an error message when there is one', () => {
    render(<PrimaryField {...defaultProps} errorMessage="Test error message" />)
    const textAreaWithErrorMessage = screen.getByRole('textbox', {
      description: 'Invoerfout:Test error message',
      name: textAreaComponent.label,
    })

    expect(textAreaWithErrorMessage).toBeInTheDocument()
  })

  it('marks the Field and input as invalid when there is an error message', () => {
    const { container } = render(<PrimaryField {...defaultProps} errorMessage="Test error message" />)

    const field = container.firstChild
    expect(field).toHaveClass('ams-field--invalid')

    const input = screen.getByRole('textbox', { name: textAreaComponent.label })
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  describe('handleBlur', () => {
    it('returns early when the textarea is empty', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const user = userEvent.setup()

      const { container } = render(<PrimaryField {...defaultProps} />)

      await user.click(screen.getByRole('textbox', { name: textAreaComponent.label }))
      await user.tab()

      const hiddenInput = container.querySelector('input[name="prefetchedMelding"]')

      expect(hiddenInput).toBeNull()
      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('returns early when the text matches the initial value', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const user = userEvent.setup()

      const { container } = render(<PrimaryField {...defaultProps} defaultValue="existing text" />)

      await user.click(screen.getByRole('textbox', { name: textAreaComponent.label }))
      await user.tab()

      const hiddenInput = container.querySelector('input[name="prefetchedMelding"]')

      expect(hiddenInput).toBeNull()
      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('uses a PATCH request when existingId and existingToken are provided', async () => {
      const spy = vi.spyOn(apiClient, 'patchMeldingByMeldingIdMelder')

      const user = userEvent.setup()

      render(<PrimaryField {...defaultProps} existingId={1} existingToken="token123" />)

      await user.type(screen.getByRole('textbox', { name: textAreaComponent.label }), 'Hello world')
      await user.tab()

      expect(spy).toHaveBeenCalled()

      spy.mockRestore()
    })

    it('uses a POST request when there is no existing id or token', async () => {
      const spy = vi.spyOn(apiClient, 'postMelding')

      const user = userEvent.setup()

      render(<PrimaryField {...defaultProps} />)

      await user.type(screen.getByRole('textbox', { name: textAreaComponent.label }), 'Hello world')
      await user.tab()

      expect(spy).toHaveBeenCalled()

      spy.mockRestore()
    })

    it('logs an error to the console when the API returns an error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      server.use(http.post(ENDPOINTS.POST_MELDING, () => HttpResponse.json('some error', { status: 400 })))

      const user = userEvent.setup()

      render(<PrimaryField {...defaultProps} />)

      await user.type(screen.getByRole('textbox', { name: textAreaComponent.label }), 'Hello world')
      await user.tab()

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('some error')
      })

      consoleSpy.mockRestore()
    })

    it('calls onMeldingPrefetched with the correct data when the API call is successful', async () => {
      const user = userEvent.setup()

      const onMeldingPrefetchedMock = vi.fn()

      render(<PrimaryField {...defaultProps} onMeldingPrefetched={onMeldingPrefetchedMock} />)

      await user.type(screen.getByRole('textbox', { name: textAreaComponent.label }), 'Hello world')
      await user.tab()

      await waitFor(() => {
        expect(onMeldingPrefetchedMock).toHaveBeenCalledWith({
          classificationId: 2,
          classificationName: 'Test classification',
          createdAt: '2025-05-26T11:56:34.081Z',
          id: 123,
          publicId: 'B100AA',
          token: 'test-token',
        })
      })
    })

    it('logs an error when the API call throws', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      server.use(http.post(ENDPOINTS.POST_MELDING, () => HttpResponse.error()))

      const user = userEvent.setup()

      render(<PrimaryField {...defaultProps} />)

      await user.type(screen.getByRole('textbox', { name: textAreaComponent.label }), 'Hello world')
      await user.tab()

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(TypeError))
      })

      consoleSpy.mockRestore()
    })
  })
})
