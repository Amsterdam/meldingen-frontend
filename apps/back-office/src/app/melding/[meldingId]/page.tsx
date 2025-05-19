import { getTranslations } from 'next-intl/server'

import { Detail } from './Detail'
import { getAdditionalQuestionsData, getContactData, getMeldingData } from './utils'
import { getMeldingByMeldingId } from 'apps/back-office/src/apiClientProxy'

type Params = { params: Promise<{ meldingId: number }> }

export const generateMetadata = async ({ params }: Params) => {
  const { meldingId } = await params
  const t = await getTranslations('detail')

  return {
    title: t('metadata.title', { meldingId }),
  }
}

export default async ({ params }: Params) => {
  const { meldingId } = await params

  const t = await getTranslations('detail')

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })
  if (error || !data) return t('errors.melding-not-found')

  const additionalQuestions = await getAdditionalQuestionsData(meldingId)
  if ('error' in additionalQuestions) return additionalQuestions.error

  const additionalQuestionsWithMeldingText = [
    {
      key: 'text',
      term: t('melding-text'),
      description: data.text,
    },
    ...additionalQuestions.data,
  ]

  const contact = getContactData(data, t)
  const meldingData = getMeldingData(data, t)

  return (
    <Detail
      additionalQuestionsWithMeldingText={additionalQuestionsWithMeldingText}
      contact={contact}
      meldingId={data.id}
      meldingData={meldingData}
    />
  )
}
