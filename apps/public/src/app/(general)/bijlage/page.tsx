import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { getStaticForm, getStaticFormByStaticFormId } from '@meldingen/api-client'

import { Attachments } from './Attachments'
import { isTypeTextAreaComponent } from 'apps/public/src/typeguards'

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

  try {
    const attachmentsFormId = await getStaticForm().then(
      (response) => response.data?.find((form) => form.type === 'attachments')?.id,
    )

    if (!attachmentsFormId) throw new Error(t('errors.form-id-not-found'))

    const response = await getStaticFormByStaticFormId({ path: { static_form_id: attachmentsFormId } })
    const attachmentsForm = response.data?.components

    // A attachments form is always an array with 1 text area component, but TypeScript doesn't know that
    // We use a type guard here to make sure we're always working with the right type
    const filteredAttachmentsForm = attachmentsForm?.filter(isTypeTextAreaComponent)

    if (!filteredAttachmentsForm || !filteredAttachmentsForm[0].label) throw new Error(t('errors.form-label-not-found'))

    return <Attachments formData={filteredAttachmentsForm} meldingId={parseInt(meldingId, 10)} token={token} />
  } catch (error) {
    return (error as Error).message
  }
}
