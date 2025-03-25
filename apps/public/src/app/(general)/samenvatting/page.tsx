import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import {
  getMeldingByMeldingIdAnswers,
  getMeldingByMeldingIdMelder,
  getStaticForm,
  getStaticFormByStaticFormId,
} from '@meldingen/api-client'

import { getSummaryData } from './_utils/getSummaryData'
import { Summary } from './Summary'

export const generateMetadata = async () => {
  const t = await getTranslations('summary')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  // Get session variables from cookies
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value
  const location = cookieStore.get('location')?.value

  if (!meldingId || !token) return undefined

  const primaryFormId = await getStaticForm().then(
    (response) => response.data?.find((form) => form.type === 'primary')?.id,
  )

  if (!primaryFormId) return undefined

  const response = await getStaticFormByStaticFormId({ path: { static_form_id: primaryFormId } })
  const primaryForm = response.data?.components[0]

  const melding = await getMeldingByMeldingIdMelder({ path: { melding_id: parseInt(meldingId, 10) }, query: { token } })

  if (!melding.data) return undefined

  const additionalQuestionsAnswers = await getMeldingByMeldingIdAnswers({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  const t = await getTranslations()

  const data = getSummaryData({
    melding: melding.data,
    primaryFormLabel: primaryForm?.label ?? '',
    additionalQuestionsAnswers: additionalQuestionsAnswers.data ?? [],
    location: location ? JSON.parse(location) : undefined,
    locationLabel: t('location.title'),
    contactLabel: t('summary.contact-label'),
  })

  return <Summary data={data} />
}
