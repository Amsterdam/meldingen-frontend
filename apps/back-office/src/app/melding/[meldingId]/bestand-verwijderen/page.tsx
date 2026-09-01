import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { getAttachmentsData } from '../_utils'
import { Attachments } from './_components/Attachments'
import { Page } from './_components/Page'
import { RemoveAttachmentErrorProvider } from './_context/RemoveAttachmentErrorContext'
import { getMeldingByMeldingId } from '~/app/_api-client/proxy'

export const generateMetadata = async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const t = await getTranslations('attachments.remove')
  const { data } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  return {
    title: t('metadata.title', { publicId: data?.public_id ?? '' }),
  }
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const attachments = await getAttachmentsData(meldingId)

  if (attachments.attachmentsWithFile.length === 0) {
    redirect(`/melding/${meldingId}`)
  }

  return (
    <RemoveAttachmentErrorProvider>
      <Page meldingId={meldingId}>
        <Attachments attachments={attachments} meldingId={meldingId} />
      </Page>
    </RemoveAttachmentErrorProvider>
  )
}
