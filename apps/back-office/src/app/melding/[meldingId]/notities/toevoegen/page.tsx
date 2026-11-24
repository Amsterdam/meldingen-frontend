import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { AddNote } from './AddNote'
import { getMeldingByMeldingId } from '~/app/_api-client/proxy'

type Props = Pick<PageProps<'/melding/[meldingId]/notities/toevoegen'>, 'params'>

export const generateMetadata = async () => {
  const t = await getTranslations('add-note')

  return { title: t('metadata.title') }
}

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParams } = await params
  const meldingId = Number(meldingIdParams)

  const { error, response } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (response?.status === 404) notFound()

  if (error) throw new Error('Failed to fetch melding data.', { cause: error })

  return <AddNote meldingId={meldingId} />
}
