import { getTranslations } from 'next-intl/server'

import { Detail } from './Detail'
import { getAdditionalQuestionsData, getContactData, getLocationData, getMeldingData } from './utils'
import { getMeldingByMeldingId } from 'apps/back-office/src/apiClientProxy'

export const generateMetadata = async ({ searchParams }: { searchParams: Promise<{ id: string }> }) => {
  const { id } = await searchParams

  const t = await getTranslations('detail')

  return {
    title: t('metadata.title', { publicId: id }),
  }
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const t = await getTranslations()

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })
  if (error || !data) return t('errors.melding-not-found')

  const additionalQuestions = await getAdditionalQuestionsData(meldingId)
  if ('error' in additionalQuestions) return additionalQuestions.error

  const additionalQuestionsWithMeldingText = [
    {
      key: 'text',
      term: t('detail.melding-text'),
      description: data.text,
    },
    ...additionalQuestions.data,
  ]

  const contact = getContactData(data, t)
  const location = getLocationData(data, t)
  const meldingData = getMeldingData(data, t)

  return (
    <Detail
      additionalQuestionsWithMeldingText={additionalQuestionsWithMeldingText}
      contact={contact}
      location={location}
      meldingData={meldingData}
      publicId={data.public_id}
    />
  )
}
