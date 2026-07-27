'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { deleteMeldingByMeldingIdAnswerByAnswerId, putMeldingByMeldingIdSubmitMelder } from '@meldingen/api-client'

import { COOKIES, TOP_ANCHOR_ID } from '~/constants'

export const postSummaryForm = async ({
  created_at,
  public_id,
  staleAnswerIds,
}: {
  created_at: string
  public_id: string
  staleAnswerIds: number[]
}) => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  if (!meldingId || !token) return redirect(`/cookie-storing#${TOP_ANCHOR_ID}`)

  const source = cookieStore.get(COOKIES.SOURCE)?.value

  // Remove answers for questions that no longer meet their conditions
  const deletionResults = await Promise.all(
    staleAnswerIds.map((answerId) =>
      deleteMeldingByMeldingIdAnswerByAnswerId({
        path: { answer_id: answerId, melding_id: parseInt(meldingId, 10) },
        query: { token },
      }),
    ),
  )

  const deletionError = deletionResults.find((result) => result.error)?.error
  if (deletionError) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(deletionError)
  }

  // Set melding state to 'submitted'
  const { error } = await putMeldingByMeldingIdSubmitMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) {
    return { apiError: error }
  }

  // Delete all session cookies
  Object.values(COOKIES).forEach((cookie) => {
    cookieStore.delete(cookie)
  })

  const params = new URLSearchParams({ created_at, public_id })
  if (source) {
    params.set('id', meldingId)
    params.set('source', source)
  }

  return redirect(`/bedankt?${params.toString()}#${TOP_ANCHOR_ID}`)
}
