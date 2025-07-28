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

  // if entries do not contain a key that is in requiredQuestionKeys,
  // or if the value is an empty string, return a validation error for that key
  const missingRequiredKeys = requiredQuestionKeys.filter(
    (requiredKey) =>
      !entriesWithMergedCheckboxes.some(([key]) => key === requiredKey) ||
      !entriesWithMergedCheckboxes.find(([key, value]) => key === requiredKey && value),
  )

  if (missingRequiredKeys.length > 0) {
    return {
      validationErrors: missingRequiredKeys.map((key) => ({
        key,
        message: 'Vraag is verplicht en moet worden beantwoord.',
      })),
      formData,
    }
  }

  const promiseArray = entriesWithMergedCheckboxes.map(([key, value]) => {
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

    // TODO: deze error moet vervangen worden door een generieke error
    if (error) return { errorMessage: handleApiError(error), formData }
  }

  return redirect(nextPanelPath)
}
