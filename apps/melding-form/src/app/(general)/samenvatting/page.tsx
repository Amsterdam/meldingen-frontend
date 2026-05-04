import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

import { postSummaryForm } from './actions'
import { Summary } from './Summary'
import {
  getAdditionalQuestionsSummary,
  getAttachmentsSummary,
  getContactSummary,
  getLocationSummary,
  getMeldingData,
  getPrimaryFormSummary,
} from './utils'
import { COOKIES, TOP_ANCHOR_ID } from '~/constants'

export default async () => {
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our proxy, so non-null assertion is safe here.
  const meldingId = cookieStore.get(COOKIES.ID)!.value
  const token = cookieStore.get(COOKIES.TOKEN)!.value

  const t = await getTranslations('summary')

  const meldingData = await getMeldingData(meldingId, token)
  const { classification, created_at, email, phone, public_id, text } = meldingData

  const primaryForm = await getPrimaryFormSummary(text)
  const attachments = await getAttachmentsSummary(t('attachments-label'), meldingId, token)
  const additionalQuestions = await getAdditionalQuestionsSummary(meldingId, token, classification?.id)
  const location = getLocationSummary(t, meldingData)
  const contact = getContactSummary(t('contact-label'), email, phone)

  // Pass extra arguments to the postSummaryForm action
  const postSummaryFormWithExtraArgs = postSummaryForm.bind(null, { created_at, public_id })

  const source = cookieStore.get(COOKIES.SOURCE)?.value

  const primaryFormLink =
    source === 'back-office'
      ? `${process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melden?id=${meldingId}&token=${token}`
      : `/#${TOP_ANCHOR_ID}`

  return (
    <Summary
      action={postSummaryFormWithExtraArgs}
      additionalQuestions={additionalQuestions.data}
      attachments={attachments}
      contact={contact}
      location={location}
      primaryForm={primaryForm.data}
      primaryFormLink={primaryFormLink}
    />
  )
}
