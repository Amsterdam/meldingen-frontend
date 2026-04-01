import type { NextRequest } from 'next/server'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getFormClassificationByClassificationId, putMeldingByMeldingIdAnswerQuestions } from '@meldingen/api-client'

import { COOKIES, TOP_ANCHOR_ID } from '../../constants'
import { handleApiError } from '../../handleApiError'

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl
  const classification_id = searchParams.get('classification_id') ?? undefined
  const created_at = searchParams.get('created_at')
  const id = searchParams.get('id')
  const public_id = searchParams.get('public_id')
  const token = searchParams.get('token')

  // If any of the required parameters are missing, redirect to the home page
  if (!id || !token || !created_at || !public_id) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const cookieStore = await cookies()
  const oneDay = 24 * 60 * 60

  cookieStore.set(COOKIES.ID, id, { maxAge: oneDay })
  cookieStore.set(COOKIES.TOKEN, token, { maxAge: oneDay })
  cookieStore.set(COOKIES.CREATED_AT, created_at, { maxAge: oneDay })
  cookieStore.set(COOKIES.PUBLIC_ID, public_id, { maxAge: oneDay })
  cookieStore.set(COOKIES.SOURCE, 'back-office', { maxAge: oneDay })

  if (classification_id) {
    const { data, error } = await getFormClassificationByClassificationId({
      path: { classification_id: parseInt(classification_id, 10) },
    })

    if (error && handleApiError(error) !== 'Not Found') {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(error)
      return NextResponse.redirect(new URL('/', request.url))
    }

    const hasAdditionalQuestions = Boolean(data?.components[0])

    if (!hasAdditionalQuestions) {
      const { error } = await putMeldingByMeldingIdAnswerQuestions({
        path: { melding_id: parseInt(id, 10) },
        query: { token },
      })

      if (error) {
        // TODO: Log the error to an error reporting service
        // eslint-disable-next-line no-console
        console.error(error)
        return NextResponse.redirect(new URL('/', request.url))
      }

      return NextResponse.redirect(new URL(`/locatie#${TOP_ANCHOR_ID}`, request.url))
    }

    const nextFormFirstKey = data?.components[0].key

    return NextResponse.redirect(
      new URL(`/aanvullende-vragen/${classification_id}/${nextFormFirstKey}#${TOP_ANCHOR_ID}`, request.url),
    )
  }

  return NextResponse.redirect(new URL(`/locatie#${TOP_ANCHOR_ID}`, request.url))
}
