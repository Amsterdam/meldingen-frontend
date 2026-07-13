import { getTranslations } from 'next-intl/server'

import { NotesOverview } from './NotesOverview'
import { getMeldingByMeldingId } from '~/app/_api-client/proxy'

export const generateMetadata = async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const t = await getTranslations('detail')

  const { data } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  return {
    title: t('metadata.title', { publicId: data?.public_id ?? '' }),
  }
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const t = await getTranslations()

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })
  if (error) return t('detail.errors.melding-not-found')

  return <NotesOverview meldingId={meldingId} publicId={data.public_id} />
}
