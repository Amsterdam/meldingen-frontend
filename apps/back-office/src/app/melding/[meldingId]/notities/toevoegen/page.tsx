import type { Metadata } from 'next'

import { getTranslations } from 'next-intl/server'

import { AddNote } from './AddNote'

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('add-note')

  return {
    title: t('metadata.title'),
  }
}

type Params = { params: Promise<{ meldingId: number }> }

export default async ({ params }: Params) => {
  const { meldingId } = await params

  return <AddNote meldingId={meldingId} />
}
