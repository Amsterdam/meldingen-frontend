'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { putMeldingByMeldingIdAnswerQuestions } from '@meldingen/api-client'

import { hasValidationErrors } from '../../../_utils/hasValidationErrors'
import { buildAnswerPromises } from './_utils/buildAnswerPromises'
import { mergeCheckboxAnswers } from './_utils/mergeCheckboxAnswers'
import { COOKIES } from 'apps/melding-form/src/constants'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

type RequiredQuestionKeyWithErrorMessage = { key: string; requiredErrorMessage: string }

export type ArgsType = {
  isLastPanel: boolean
  lastPanelPath: string
  nextPanelPath: string
  questionAndAnswerIdPairs?: { answerId: number; questionId: number }[]
  questionMetadata: {
    id: number
    key: string
    type: string
    valuesAndLabels?: { label: string; value: string }[]
  }[]
  requiredQuestionKeysWithErrorMessages: RequiredQuestionKeyWithErrorMessage[]
}

const getUnansweredRequiredQuestionKeysWithErrorMessages = (
  requiredKeysWithErrorMessages: RequiredQuestionKeyWithErrorMessage[],
  entries: [string, unknown][],
) =>
  requiredKeysWithErrorMessages.filter(({ key }) => {
    const entry = entries.find(([entryKey]) => entryKey === key)

    // If entries do not contain a key that is in requiredKeys, add it to missingRequiredKeys
    if (!entry) return true

    const value = entry[1]

    // If value is an empty string (or otherwise falsy), add it to missingRequiredKeys
    return !value
  })

export const postForm = async (
  {
    isLastPanel,
    lastPanelPath,
    nextPanelPath,
    questionAndAnswerIdPairs,
    questionMetadata,
    requiredQuestionKeysWithErrorMessages,
  }: ArgsType,
  _: unknown,
  formData: FormData,
) => {
  // Get session variables from cookies
  const cookieStore = await cookies()
  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  if (!meldingId || !token) return redirect('/cookie-storing')

  // Set last panel path in cookies
  const oneDay = 24 * 60 * 60
  cookieStore.set(COOKIES.LAST_PANEL_PATH, lastPanelPath, { maxAge: oneDay })

  // Checkbox answers are stored as separate key-value pairs in the FormData object.
  // This function merges these answers into an array per question, using an identifier in the Checkbox component.
  const entriesArray = Array.from(formData.entries())
  const stringEntries = entriesArray.filter(([, value]) => typeof value === 'string') as [string, string][]
  const entriesWithMergedCheckboxes = Object.entries(mergeCheckboxAnswers(stringEntries))

  // Check if all required questions are answered
  const missingRequiredKeysWithErrorMessages = getUnansweredRequiredQuestionKeysWithErrorMessages(
    requiredQuestionKeysWithErrorMessages,
    entriesWithMergedCheckboxes,
  )

  if (missingRequiredKeysWithErrorMessages.length > 0) {
    return {
      formData,
      validationErrors: missingRequiredKeysWithErrorMessages.map(({ key, requiredErrorMessage }) => ({
        key,
        message: requiredErrorMessage,
      })),
    }
  }

  // Build promise array
  const promiseArray = buildAnswerPromises({
    entries: entriesWithMergedCheckboxes,
    meldingId,
    questionAndAnswerIdPairs,
    questionMetadata,
    token,
  })
  const results = await Promise.all(promiseArray)

  // Return validation errors if there are any
  const resultsWithValidationError = results.filter((result) => {
    if (!result?.value) return false

    return hasValidationErrors(result.value.response, result.value.error)
  })

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
