'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { postMeldingByMeldingIdQuestionByQuestionId, putMeldingByMeldingIdAnswerQuestions } from '@meldingen/api-client'

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

const buildAnswerPromises = (
  entries: [string, string | File][],
  questionKeysAndIds: { key: string; id: number }[],
  meldingId: string,
  token: string,
) =>
  entries.map(([key, value]) => {
    if (value instanceof File) return undefined

    // Filter out empty answers
    if (value.length === 0) return undefined

    const questionId = questionKeysAndIds.find((component) => component.key === key)?.id

    if (!questionId) return undefined

    return postMeldingByMeldingIdQuestionByQuestionId({
      body: { text: value },
      path: {
        melding_id: parseInt(meldingId, 10),
        question_id: questionId,
      },
      query: { token },
    }).catch((error) => error)
  })

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
      validationErrors: mapValidationErrors(missingRequiredKeys),
      formData,
    }
  }

  // Build promise array
  const promiseArray = buildAnswerPromises(entriesWithMergedCheckboxes, questionKeysAndIds, meldingId, token)
  const results = await Promise.all(promiseArray)

  // Return a string of all error messages and do not redirect if one of the requests failed
  const erroredResults = results.filter((result) => result?.error)

  if (erroredResults.length > 0) {
    return {
      errorMessage: erroredResults.map(({ error }) => handleApiError(error)).join(', '),
      formData,
    }
  }

  // Set melding state to 'questions_answered'
  if (isLastPanel) {
    const { error } = await putMeldingByMeldingIdAnswerQuestions({
      path: { melding_id: parseInt(meldingId, 10) },
      query: { token },
    })

    if (error) return { errorMessage: handleApiError(error), formData }
  }

  return redirect(nextPanelPath)
}
