import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { getStaticForm, getStaticFormByStaticFormId } from '@meldingen/api-client'

import { Attachments } from './Attachments'
import { handleApiError } from 'apps/melding-form/src/handleApiError'
import { isTypeTextAreaComponent } from 'apps/melding-form/src/typeguards'

export const generateMetadata = async () => {
  const t = await getTranslations('attachments')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  const t = await getTranslations('attachments')

  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) return handleApiError(staticFormsError)

  const attachmentsFormId = staticFormsData?.find((form) => form.type === 'attachments')?.id

  if (!attachmentsFormId) return t('errors.form-id-not-found')

  const { data, error } = await getStaticFormByStaticFormId({
    path: { static_form_id: attachmentsFormId },
  })

  if (error) return handleApiError(error)

  if (!data) return 'Attachments form data not found'

  const attachmentsForm = data.components

  // A attachments form is always an array with 1 text area component, but TypeScript doesn't know that
  // We use a type guard here to make sure we're always working with the right type
  const filteredAttachmentsForm = attachmentsForm?.filter(isTypeTextAreaComponent)

  if (!filteredAttachmentsForm || !filteredAttachmentsForm[0].label) throw new Error(t('errors.form-label-not-found'))

  return <Attachments formData={filteredAttachmentsForm} meldingId={parseInt(meldingId, 10)} token={token} />
}
