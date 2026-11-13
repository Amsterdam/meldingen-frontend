import { getTranslations } from 'next-intl/server'

import { AddNote } from './AddNote'

type Props = Pick<PageProps<'/melding/[meldingId]/notities/toevoegen'>, 'params'>

export const generateMetadata = async () => {
  const t = await getTranslations('add-note')

  return { title: t('metadata.title') }
}

export default async ({ params }: Props) => {
  const { meldingId } = await params

  return <AddNote meldingId={Number(meldingId)} />
}
