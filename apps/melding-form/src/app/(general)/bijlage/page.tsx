import { cookies } from 'next/headers'

import {
  getMeldingByMeldingIdAttachmentByAttachmentIdDownload,
  getMeldingByMeldingIdAttachmentsMelder,
  getStaticForm,
  getStaticFormByStaticFormId,
} from '@meldingen/api-client'

import { Attachments } from './Attachments'
import { COOKIES } from 'apps/melding-form/src/constants'
import { isTypeTextAreaComponent } from 'apps/melding-form/src/typeguards'

export type ExistingFileType = {
  blob: Blob
  fileName: string
  serverId: number
}

export default async () => {
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our proxy, so non-null assertion is safe here.
  const meldingId = cookieStore.get(COOKIES.ID)!.value
  const token = cookieStore.get(COOKIES.TOKEN)!.value

  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) throw new Error('Failed to fetch static forms.')

  const attachmentsFormId = staticFormsData?.find((form) => form.type === 'attachments')?.id

  if (!attachmentsFormId) throw new Error('Attachments form id not found.')

  const { data, error } = await getStaticFormByStaticFormId({
    path: { static_form_id: attachmentsFormId },
  })

  if (error) throw new Error('Failed to fetch attachments form data.')
  if (!data) throw new Error('Attachments form data not found.')

  const attachmentsForm = data.components

  // A attachments form is always an array with 1 text area component, but TypeScript doesn't know that
  // We use a type guard here to make sure we're always working with the right type
  const filteredAttachmentsForm = attachmentsForm.filter(isTypeTextAreaComponent)

  if (!filteredAttachmentsForm[0].label) throw new Error('Attachments form label not found.')

  const { data: attachmentData, error: attachmentError } = await getMeldingByMeldingIdAttachmentsMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (attachmentError) throw new Error('Failed to fetch attachments data.')

  const attachments = await Promise.all(
    attachmentData.map(async ({ id, original_filename }): Promise<ExistingFileType> => {
      const { data, error } = await getMeldingByMeldingIdAttachmentByAttachmentIdDownload({
        path: { melding_id: parseInt(meldingId, 10), attachment_id: id },
        query: { token, type: 'thumbnail' },
      })

      if (error) throw new Error('Failed to fetch attachment download.')

      // Returning blob instead of File since the File api is not available in Node.js
      return {
        blob: data as Blob,
        fileName: original_filename,
        serverId: id,
      }
    }),
  )

  return (
    <Attachments
      files={attachments}
      formData={filteredAttachmentsForm}
      meldingId={parseInt(meldingId, 10)}
      token={token}
    />
  )
}
