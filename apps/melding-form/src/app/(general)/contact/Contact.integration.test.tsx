import type * as NextNavigation from 'next/navigation'
import type { ReactNode } from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'
import { Component } from 'react'

import { Contact } from './Contact'
import { TOP_ANCHOR_ID } from '~/constants'
import { contact as contactFormData } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'
import { mockIdAndTokenCookies } from '~/mocks/utils'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))
vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof NextNavigation>()

  return { ...actual, redirect: vi.fn(actual.redirect) }
})

class RedirectBoundary extends Component<{ children: ReactNode }, { redirected: boolean }> {
  state = { redirected: false }

  static getDerivedStateFromError(error: Error) {
    if (error.message !== 'NEXT_REDIRECT') throw error

    return { redirected: true }
  }

  render() {
    return this.state.redirected ? null : this.props.children
  }
}

const renderContact = () =>
  render(
    <RedirectBoundary>
      <Contact formComponents={contactFormData} />
    </RedirectBoundary>,
    { onCaughtError: vi.fn() },
  )

describe('Contact submission', () => {
  beforeEach(() => {
    mockIdAndTokenCookies()
  })

  it('submits the entered contact details before advancing the report state and redirecting', async () => {
    const user = userEvent.setup()
    const requests: { body?: unknown; path: string; token: null | string }[] = []

    server.use(
      http.patch(ENDPOINTS.PATCH_MELDING_BY_MELDING_ID_CONTACT, async ({ request }) => {
        const url = new URL(request.url)

        requests.push({ body: await request.json(), path: url.pathname, token: url.searchParams.get('token') })

        return new HttpResponse(null, { status: 204 })
      }),
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ADD_CONTACT_INFO, ({ request }) => {
        const url = new URL(request.url)

        requests.push({ path: url.pathname, token: url.searchParams.get('token') })

        return new HttpResponse(null, { status: 204 })
      }),
    )

    renderContact()

    await user.type(
      screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' }),
      'user@example.com',
    )
    await user.type(screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' }), '0612345678')
    await user.click(screen.getByRole('button', { name: 'submit-button' }))

    await waitFor(() => expect(redirect).toHaveBeenCalledWith(`/samenvatting#${TOP_ANCHOR_ID}`))

    expect(requests).toEqual([
      {
        body: { email: 'user@example.com', phone: '0612345678' },
        path: '/melding/123/contact',
        token: 'test-token',
      },
      { path: '/melding/123/add_contact_info', token: 'test-token' },
    ])
  })

  it('preserves input after validation fails and allows the user to correct and resubmit it', async () => {
    const user = userEvent.setup()
    const submittedBodies: unknown[] = []
    const advanceState = vi.fn(() => new HttpResponse(null, { status: 204 }))

    server.use(
      http.patch(ENDPOINTS.PATCH_MELDING_BY_MELDING_ID_CONTACT, async ({ request }) => {
        const body = await request.json()

        submittedBodies.push(body)

        if (submittedBodies.length === 1) {
          return HttpResponse.json(
            { detail: [{ loc: ['body', 'email'], msg: 'Invalid email', type: 'value_error' }] },
            { status: 422 },
          )
        }

        return new HttpResponse(null, { status: 204 })
      }),
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ADD_CONTACT_INFO, advanceState),
    )

    renderContact()

    const emailInput = screen.getByRole('textbox', { name: 'Wat is uw e-mailadres? (niet verplicht)' })
    const phoneInput = screen.getByRole('textbox', { name: 'Wat is uw telefoonnummer? (niet verplicht)' })

    await user.type(emailInput, 'invalid-email')
    await user.type(phoneInput, '0612345678')
    await user.click(screen.getByRole('button', { name: 'submit-button' }))

    expect(await screen.findByRole('link', { name: 'invalid-email' })).toHaveAttribute('href', '#email-input')
    expect(emailInput).toHaveAccessibleDescription(/invalid-email/)
    expect(emailInput).toHaveValue('invalid-email')
    expect(phoneInput).toHaveValue('0612345678')
    expect(advanceState).not.toHaveBeenCalled()
    expect(redirect).not.toHaveBeenCalled()

    await user.clear(emailInput)
    await user.type(emailInput, 'corrected@example.com')
    await user.click(screen.getByRole('button', { name: 'submit-button' }))

    await waitFor(() => expect(redirect).toHaveBeenCalledWith(`/samenvatting#${TOP_ANCHOR_ID}`))

    expect(advanceState).toHaveBeenCalledOnce()
    expect(submittedBodies).toEqual([
      { email: 'invalid-email', phone: '0612345678' },
      { email: 'corrected@example.com', phone: '0612345678' },
    ])
    expect(screen.queryByRole('link', { name: 'invalid-email' })).not.toBeInTheDocument()
  })
})
