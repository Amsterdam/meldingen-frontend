import { getTranslations } from 'next-intl/server'

import { getStaticForm, getStaticFormByStaticFormId } from '@meldingen/api-client'

import { Home } from './Home'
import { handleApiError } from '../../handleApiError'
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
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) return handleApiError(staticFormsError)

  const primaryFormId = staticFormsData?.find((form) => form.type === 'primary')?.id

  if (!primaryFormId) return 'Primary form id not found'

  const { data, error } = await getStaticFormByStaticFormId({
    path: { static_form_id: primaryFormId },
  })

  if (error) return handleApiError(error)

  if (!data) return 'Primary form data not found'

  // A primary form is always an array with 1 text area component, but TypeScript doesn't know that
  // We use a type guard here to make sure we're always working with the right type
  const filteredPrimaryForm = data.components.filter(isTypeTextAreaComponent)
  return <Home formData={filteredPrimaryForm} />
}
