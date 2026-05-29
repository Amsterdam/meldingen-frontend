import type { Props } from '../MeldingForm'

// Form components can be prefilled on load on the server, where we fill in existing answers from the backend,
// or in case of an error, where we use the form data provided.
// If there is form data, it should take priority over the prefilled components from the server.
export const calculateDefaultValues = (formData?: FormData, defaultValues?: Props['defaultValues']) => {
  const primaryDefaultValue = (formData?.get('primary') as string | null) ?? defaultValues?.primary ?? ''
  const sourceDefaultValue = (formData?.get('source') as string | null) ?? defaultValues?.source ?? ''
  const labelsDefaultValues = formData?.getAll('labels').map((label) => Number(label)) ?? defaultValues?.labels ?? []
  const rawUrgency = formData?.get('urgency')
  const urgencyDefaultValue =
    rawUrgency !== null && rawUrgency !== undefined ? Number(rawUrgency) : (defaultValues?.urgency ?? 0)

  return { labelsDefaultValues, primaryDefaultValue, sourceDefaultValue, urgencyDefaultValue }
}
