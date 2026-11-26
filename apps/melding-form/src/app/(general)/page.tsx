import { cookies } from 'next/headers'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { getMeldingByMeldingIdMelder } from '@meldingen/api-client'

import { getPrimaryFormComponents } from './_utils/getPrimaryFormComponents'
import { Home } from './Home'
import { COOKIES } from '~/constants'

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

  return formComponents.map((component) => ({
    ...component,
    defaultValue: data?.text,
  }))
}

export default async () => {
  const primaryFormComponents = await getPrimaryFormComponents()
  const cookieStore = await cookies()

  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  const isExistingMelding = meldingId && token
  const formComponents = isExistingMelding
    ? await getPrefilledPrimaryFormComponents(meldingId, token, primaryFormComponents)
    : primaryFormComponents

  return <Home formComponents={formComponents} />
}
