'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { putMeldingByMeldingIdAnswerQuestions } from '@meldingen/api-client'

import { buildAnswerPromises } from './_utils/buildAnswerPromises'
import { mergeCheckboxAnswers } from './_utils/mergeCheckboxAnswers'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

type ArgsType = {
  isLastPanel: boolean
  lastPanelPath: string
  nextPanelPath: string
  questionKeysAndIds: { key: string; id: number }[]
  requiredQuestionKeys: string[]
}

const getMissingRequiredKeys = (requiredKeys: string[], entries: [string, unknown][]) =>
  requiredKeys.filter((requiredKey) => {
    const entry = entries.find(([key]) => key === requiredKey)

    // If entries do not contain a key that is in requiredKeys, add it to missingRequiredKeys
    if (!entry) return true

    const value = entry[1]

    // If value is an empty string (or otherwise falsy), add it to missingRequiredKeys
    return !value
  })

const mapValidationErrors = (keys: string[]) =>
  keys.map((key) => ({
    key,
    message: 'Vraag is verplicht en moet worden beantwoord.',
  }))

export const postForm = async (
  { isLastPanel, lastPanelPath, nextPanelPath, questionKeysAndIds, requiredQuestionKeys }: ArgsType,
  _: unknown,
  formData: FormData,
) => {
  // Get session variables from cookies
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return redirect('/cookie-storing')

  // Set last panel path in cookies
  cookieStore.set('lastPanelPath', lastPanelPath)

  // Checkbox answers are stored as separate key-value pairs in the FormData object.
  // This function merges these answers into a single string value per question, using an identifier in the Checkbox component.
  // TODO: This isn't the most robust solution.
  const formDataObj = Object.fromEntries(formData)
  const entries = Object.entries(formDataObj)
  const entriesWithMergedCheckboxes = Object.entries(mergeCheckboxAnswers(entries))

  // Check if all required questions are answered
  const missingRequiredKeys = getMissingRequiredKeys(requiredQuestionKeys, entriesWithMergedCheckboxes)

  if (missingRequiredKeys.length > 0) {
    return {
      formData,
      validationErrors: mapValidationErrors(missingRequiredKeys),
    }
  }

  // Build promise array
  const promiseArray = buildAnswerPromises(entriesWithMergedCheckboxes, questionKeysAndIds, meldingId, token)
  const results = await Promise.all(promiseArray)

  // Return validation errors if there are any
  const resultsWithValidationError = results.filter((result) => result?.value.response.status === 422)

  if (resultsWithValidationError.length > 0) {
    return {
      formData,
      validationErrors: resultsWithValidationError.map((result) => ({
        key: result?.key || 'fallback-key',
        message: handleApiError(result?.value.error),
      })),
    }
  }

  // Return an array of all errors if there are any
  const erroredResults = results.filter((result) => result?.value.error)

  if (erroredResults.length > 0) {
    const errors = erroredResults.map((result) => result?.value.error)

    return {
      formData,
      systemError: errors,
    }
  }

  // Set melding state to 'questions_answered'
  if (isLastPanel) {
    const { error } = await putMeldingByMeldingIdAnswerQuestions({
      path: { melding_id: parseInt(meldingId, 10) },
      query: { token },
    })

    if (error) return { formData, systemError: error }
  }

  return redirect(nextPanelPath)
}
