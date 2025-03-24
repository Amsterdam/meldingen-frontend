import { getTranslations } from 'next-intl/server'

import { getStaticForm, getStaticFormByStaticFormId } from '@meldingen/api-client'

import { Home } from './Home'
import { isTypeTextAreaComponent } from '../../typeguards'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export const generateMetadata = async () => {
  const t = await getTranslations('homepage')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  try {
    const primaryFormId = await getStaticForm().then(
      (response) => response.data?.find((form) => form.type === 'primary')?.id,
    )

    if (!primaryFormId) throw new Error('Primary form id not found')

    const response = await getStaticFormByStaticFormId({ path: { static_form_id: primaryFormId } })

    if (!response.data) throw new Error('Primary form data not found')

    const primaryForm = response.data.components

    // A primary form is always an array with 1 text area component, but TypeScript doesn't know that
    // We use a type guard here to make sure we're always working with the right type
    const filteredPrimaryForm = primaryForm.filter(isTypeTextAreaComponent)
    return <Home formData={filteredPrimaryForm} />
  } catch (error) {
    return (error as Error).message
  }
}
