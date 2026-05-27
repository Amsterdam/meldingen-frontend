'use server'

import { redirect } from 'next/navigation'

import { patchMeldingByMeldingId } from '~/apiClientProxy'

type MeldingIdParam = {
  currentLabelIds?: number[]
  meldingId: number
}

const extractLabelIdsFromFormData = (formData: FormData) => formData.getAll('labels').map(Number)

const sameLabels = (a: number[], b: number[]) => {
  const setA = new Set(a)
  const setB = new Set(b)
  return setA.size === setB.size && [...setA].every((id) => setB.has(id))
}

export const postChangeLabelsForm = async (
  { currentLabelIds, meldingId }: MeldingIdParam,
  _: { error?: unknown; labelIdsFromAction?: number[] } | null,
  formData: FormData,
) => {
  const labelIdsFromForm = extractLabelIdsFromFormData(formData)
  const redirectPath = `/melding/${meldingId}`

  // If the selected labels are the same as the current labels,
  // we simply redirect without calling the API
  if (sameLabels(labelIdsFromForm, currentLabelIds ?? [])) return redirect(redirectPath)

  const { error } = await patchMeldingByMeldingId({
    body: { label_ids: labelIdsFromForm },
    path: { melding_id: meldingId },
  })

  if (error) {
    return {
      error: error,
      labelIdsFromAction: labelIdsFromForm,
    }
  }

  return redirect(redirectPath)
}
