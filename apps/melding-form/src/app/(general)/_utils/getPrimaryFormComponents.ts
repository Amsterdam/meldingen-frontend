import { getStaticForm, getStaticFormByStaticFormId } from '@meldingen/api-client'

import { isTypeTextAreaComponent } from '~/app/_utils/isTypeTextAreaComponent'

export const getPrimaryFormComponents = async () => {
  const { data: staticForms, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) throw new Error('Failed to fetch static forms.')

  const primaryFormId = staticForms.find((form) => form.type === 'primary')?.id

  if (!primaryFormId) throw new Error('Primary form id not found.')

  const { data: primaryForm, error } = await getStaticFormByStaticFormId({
    path: { static_form_id: primaryFormId },
  })

  if (error) throw new Error('Failed to fetch primary form data.')

  return primaryForm.components.filter(isTypeTextAreaComponent)
}
