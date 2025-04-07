'use server'

import { getMelding } from '@meldingen/api-client'

export const test = async (formData: FormData) => {
  const data = formData.get('melding') // Get the value of the input field

  const authenticatedApiCall = await getMelding()

  console.log(data, authenticatedApiCall)
}
