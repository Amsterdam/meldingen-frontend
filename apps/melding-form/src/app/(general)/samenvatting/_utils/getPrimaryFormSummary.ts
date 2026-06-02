import { getStaticForm, getStaticFormByStaticFormId } from '@meldingen/api-client'

export const getPrimaryFormSummary = async (description: string) => {
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) throw new Error('Failed to fetch static forms.')

  const primaryFormId = staticFormsData.find((form) => form.type === 'primary')?.id

  if (!primaryFormId) throw new Error('Primary form id not found.')

  const { data: primaryFormData, error: primaryFormError } = await getStaticFormByStaticFormId({
    path: { static_form_id: primaryFormId },
  })

  if (primaryFormError) throw new Error('Failed to fetch primary form data.')

  const primaryForm = primaryFormData.components[0]

  return {
    data: { description, key: 'primary', term: primaryForm.label },
  }
}
