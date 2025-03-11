import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import type { StaticFormOutput, StaticFormTextAreaComponentOutput } from 'apps/public/src/apiClientProxy'
import { getStaticForm, getStaticFormByStaticFormId } from 'apps/public/src/apiClientProxy'

import { Attachments } from './Attachments'

export const generateMetadata = async () => {
  const t = await getTranslations('attachments')

  return {
    title: t('metadata.title'),
  }
}

const isTextArea = (
  component: StaticFormOutput['components'][number],
): component is StaticFormTextAreaComponentOutput => component.type === 'textarea'

export default async () => {
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  const t = await getTranslations('attachments')

  try {
    const attachmentsFormId = await getStaticForm().then(
      (response) => response.find((form) => form.type === 'attachments')?.id,
    )

    if (!attachmentsFormId) throw new Error(t('errors.form-id-not-found')) // TODO

    const attachmentsForm = (await getStaticFormByStaticFormId({ staticFormId: attachmentsFormId })).components
    // A attachments form is always an array with 1 text area component, but TypeScript doesn't know that
    // We use a type guard here to make sure we're always working with the right type
    const filteredAttachmentsForm = attachmentsForm.filter(isTextArea)

    if (!filteredAttachmentsForm[0].label) throw new Error(t('errors.form-label-not-found')) // TODO

    return <Attachments formData={filteredAttachmentsForm} meldingId={parseInt(meldingId, 10)} token={token} />
  } catch (error) {
    return (error as Error).message
  }
}
