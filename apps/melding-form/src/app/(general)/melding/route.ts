import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

import {
  client,
  getApiErrorMessage,
  hasValidationErrors,
  patchMeldingByMeldingIdMelder,
  postMelding,
} from '@meldingen/api-client'

import type { PrimaryFormResponse } from './responseSchema'

import { getPrimaryFormComponents } from '../_utils/getPrimaryFormComponents'
import { resolveClassificationRedirect } from '../../_utils/resolveClassificationRedirect'
import { COOKIES, SESSION_COOKIE_OPTIONS } from '~/constants'
import { getClientEnv } from '~/env/client'
import { serverEnv } from '~/env/server'

// Route handlers do not pass through the layout that configures the server API client.
client.setConfig({ baseUrl: serverEnv.NEXT_INTERNAL_BACKEND_BASE_URL })

export const POST = async (request: Request) => {
  const origin = new URL(getClientEnv().NEXT_PUBLIC_MELDING_FORM_BASE_URL).origin

  if (request.headers.get('origin') !== origin) {
    return Response.json({ apiError: 'Invalid request origin.', type: 'api-error' } satisfies PrimaryFormResponse, {
      status: 403,
    })
  }

  const formData = await request.formData()
  const primary = formData.get('primary')

  // Return validation error if primary question is not answered
  if (typeof primary !== 'string' || !primary) {
    const components = await getPrimaryFormComponents()
    const t = await getTranslations('homepage.errors')
    const requiredErrorMessage =
      components.find((component) => component.key === 'primary')?.validate?.required_error_message ||
      t('required-error-message-fallback')

    return Response.json(
      {
        type: 'validation-error',
        validationErrors: [{ key: 'primary', message: requiredErrorMessage }],
      } satisfies PrimaryFormResponse,
      { status: 422 },
    )
  }

  const cookieStore = await cookies()
  const existingId = cookieStore.get(COOKIES.ID)?.value
  const existingToken = cookieStore.get(COOKIES.TOKEN)?.value
  const isExistingMelding = existingId && existingToken

  const { data, error, response } = isExistingMelding
    ? await patchMeldingByMeldingIdMelder({
        body: { text: primary },
        path: { melding_id: parseInt(existingId, 10) },
        query: { token: existingToken },
      })
    : await postMelding({ body: { text: primary } })

  // Return other validation errors if there are any
  if (hasValidationErrors(response, error)) {
    return Response.json(
      {
        type: 'validation-error',
        validationErrors: [{ key: 'primary', message: getApiErrorMessage(error) }],
      } satisfies PrimaryFormResponse,
      { status: 422 },
    )
  }

  if (error) {
    return Response.json({ apiError: error, type: 'api-error' } satisfies PrimaryFormResponse, { status: 502 })
  }

  const { classification, id, token } = data

  // Set session variables in cookies
  cookieStore.set(COOKIES.ID, id.toString(), SESSION_COOKIE_OPTIONS)
  cookieStore.set(COOKIES.TOKEN, token, SESSION_COOKIE_OPTIONS)

  // The LAST_PANEL_PATH cookie might be populated by earlier additional questions.
  // Delete it here in case a reclassification occurs.
  cookieStore.delete(COOKIES.LAST_PANEL_PATH)

  const result = await resolveClassificationRedirect(id, token, classification?.id)

  if (result.type === 'error') {
    return Response.json({ apiError: result.error, type: 'api-error' } satisfies PrimaryFormResponse, { status: 502 })
  }

  return Response.json({ redirectUrl: result.url, type: 'success' } satisfies PrimaryFormResponse)
}
