import { cookies } from 'next/headers'

import {
  getMeldingByMeldingIdMelder,
  getStaticForm,
  getStaticFormByStaticFormId,
  StaticFormTextAreaComponentOutput,
} from '@meldingen/api-client'

import { COOKIES } from '../../constants'
import { isTypeTextAreaComponent } from '../../typeguards'
import { postPrimaryForm } from './actions'
import { Home } from './Home'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

const getPrefilledPrimaryFormComponents = async (
  meldingId: string,
  token: string,
  formComponents: StaticFormTextAreaComponentOutput[],
) => {
  const { data, error } = await getMeldingByMeldingIdMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
  }

  return formComponents.map((component) => {
    return {
      ...component,
      defaultValue: data?.text,
    }
  })
}

export default async () => {
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) throw new Error('Failed to fetch static forms.')

  const primaryFormId = staticFormsData.find((form) => form.type === 'primary')?.id

  if (!primaryFormId) throw new Error('Primary form id not found.')

  const { data: primaryForm, error } = await getStaticFormByStaticFormId({
    path: { static_form_id: primaryFormId },
  })

  if (error) throw new Error('Failed to fetch primary form data.')

  // A primary form is always an array with 1 text area component, but TypeScript doesn't know that
  // We use a type guard here to make sure we're always working with the right type
  const primaryFormComponents = primaryForm.components.filter(isTypeTextAreaComponent)

  const cookieStore = await cookies()

  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  const isExistingMelding = meldingId && token

  const formComponents = isExistingMelding
    ? await getPrefilledPrimaryFormComponents(meldingId, token, primaryFormComponents)
    : primaryFormComponents

  const action = postPrimaryForm.bind(null, { existingId: meldingId, existingToken: token, formComponents })

  return <Home action={action} formComponents={formComponents} />
}
