import { getTranslations } from 'next-intl/server'

import {
  getAdditionalQuestionsData,
  getAssetsData,
  getAttachmentsData,
  getContactData,
  getLocationData,
  getMeldingData,
} from './_utils'
import { Detail } from './Detail'
import { getMeldingByMeldingId } from '~/app/_api-client/proxy'

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
  if (error) return t('detail.errors.melding-not-found')

  const additionalQuestions = await getAdditionalQuestionsData(meldingId)
  if ('error' in additionalQuestions) return additionalQuestions.error

  const additionalQuestionsWithMeldingText = [
    {
      description: data.text,
      key: 'text',
      term: t('detail.melding-text'),
    },
    ...additionalQuestions.data,
  ]

  const attachments = await getAttachmentsData(meldingId, t)
  if ('error' in attachments) return attachments.error

  const contact = getContactData(data, t)
  const location = getLocationData(data, t)
  const meldingData = getMeldingData(data, t)
  const { assets, assetsTerm } = await getAssetsData(data, meldingId)

  return (
    <Detail
      additionalQuestionsWithMeldingText={additionalQuestionsWithMeldingText}
      assets={assets}
      assetsTerm={assetsTerm}
      attachments={attachments}
      contact={contact}
      location={location}
      meldingData={meldingData}
      publicId={data.public_id}
    />
  )
}
