import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { getAttachmentsData } from '../_utils'
import { Attachments } from './_components/Attachments'
import { Page } from './_components/Page'
import { RemoveAttachmentErrorProvider } from './_context/RemoveAttachmentErrorContext'
import { getMeldingByMeldingId } from '~/app/_api-client/proxy'
import { handleApiError } from '~/app/_utils/handleApiError'

export const generateMetadata = async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const t = await getTranslations('remove-attachment')
  const { data } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  return {
    title: t('metadata.title', { publicId: data?.public_id ?? '' }),
  }
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  let attachmentFiles

  try {
    attachmentFiles = await getAttachmentsData(meldingId)
  } catch (error) {
    return typeof error === 'string' ? error : handleApiError(error)
  }

  if (attachmentFiles.length === 0) {
    redirect(`/melding/${meldingId}`)
  }

  return (
    <RemoveAttachmentErrorProvider>
      <Page meldingId={meldingId}>
        <Attachments initialAttachments={attachmentFiles} meldingId={meldingId} />
      </Page>
    </RemoveAttachmentErrorProvider>
  )
}
