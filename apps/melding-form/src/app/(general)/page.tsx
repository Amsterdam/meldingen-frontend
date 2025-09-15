import { cookies } from 'next/headers'

import { getStaticForm, getStaticFormByStaticFormId, StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { postPrimaryForm } from './actions'
import { Home } from './Home'
import { isTypeTextAreaComponent } from '../../typeguards'
import { getMeldingData } from './_utils/getMeldingData'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

const getPrefilledPrimaryFormComponents = async (
  meldingId: string,
  token: string,
  formComponents: StaticFormTextAreaComponentOutput[],
) => {
  const { text } = await getMeldingData(meldingId, token)

  return formComponents.map((component) => {
    return {
      ...component,
      defaultValue: text,
    }
  })
}

export default async () => {
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) throw new Error('Failed to fetch static forms.')

  const primaryFormId = staticFormsData?.find((form) => form.type === 'primary')?.id

  if (!primaryFormId) throw new Error('Primary form id not found.')

  const { data: primaryForm, error } = await getStaticFormByStaticFormId({
    path: { static_form_id: primaryFormId },
  })

  if (error) throw new Error('Failed to fetch primary form data.')
  if (!primaryForm) throw new Error('Primary form data not found.')

  // A primary form is always an array with 1 text area component, but TypeScript doesn't know that
  // We use a type guard here to make sure we're always working with the right type
  const primaryFormComponents = primaryForm.components.filter(isTypeTextAreaComponent)

  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  const isExistingMelding = meldingId && token

  const formComponents = isExistingMelding
    ? await getPrefilledPrimaryFormComponents(meldingId, token, primaryFormComponents)
    : primaryFormComponents

  const action = postPrimaryForm.bind(null, { existingId: meldingId, existingToken: token })

  return <Home action={action} formComponents={formComponents} />
}
