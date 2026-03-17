'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { putMeldingByMeldingIdAnswerQuestions } from '@meldingen/api-client'

import type { AnswersByKey, PanelComponentsConditions } from './_utils/navigationUtils'

import { hasValidationErrors } from '../../../_utils/hasValidationErrors'
import { buildAnswerPromises } from './_utils/buildAnswerPromises'
import { mergeCheckboxAnswers } from './_utils/mergeCheckboxAnswers'
import { AFTER_ADDITIONAL_QUESTIONS_PATH, getNextPanelPath, shouldRenderComponent } from './_utils/navigationUtils'
import { COOKIES } from 'apps/melding-form/src/constants'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

type RequiredQuestionErrorMessage = { key: string; requiredErrorMessage: string }

export type ArgsType = {
  classificationId: number
  currentPanelIndex: number
  panelComponentsConditions: PanelComponentsConditions[]
  previousAnswersByKey: AnswersByKey
  questionAndAnswerIdPairs?: { answerId: number; questionId: number }[]
  questionMetadata: {
    id: number
    key: string
    type: string
    valuesAndLabels?: { label: string; value: string }[]
  }[]
  requiredQuestionErrorMessages: RequiredQuestionErrorMessage[]
}

const getMissingRequiredQuestionErrorMessages = (
  requiredQuestionErrorMessages: RequiredQuestionErrorMessage[],
  entries: [string, unknown][],
  componentsConditions: PanelComponentsConditions['componentsConditions'],
  answersByKey: AnswersByKey,
) =>
  requiredQuestionErrorMessages.filter(({ key }) => {
    const componentCondition = componentsConditions.find((component) => component.key === key)

    // If the component is not rendered, it should not return a 'required' error message.
    if (componentCondition && !shouldRenderComponent(componentCondition, answersByKey)) return false

    const entry = entries.find(([entryKey]) => entryKey === key)

    // If entries do not contain a key that is in requiredKeys, add it to missingRequiredKeys
    if (!entry) return true

    const value = entry[1]

    // If value is an empty string (or otherwise falsy), add it to missingRequiredKeys
    return !value
  })

export const postForm = async (
  {
    classificationId,
    currentPanelIndex,
    panelComponentsConditions,
    previousAnswersByKey,
    questionAndAnswerIdPairs,
    questionMetadata,
    requiredQuestionErrorMessages,
  }: ArgsType,
  _: unknown,
  formData: FormData,
) => {
  // Get session variables from cookies
  const cookieStore = await cookies()
  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  if (!meldingId || !token) return redirect('/cookie-storing#top')

  // Checkbox answers are stored as separate key-value pairs in the FormData object.
  // This function merges these answers into an array per question, using an identifier in the Checkbox component.
  const entriesArray = Array.from(formData.entries())
  const stringEntries = entriesArray.filter(([, value]) => typeof value === 'string') as [string, string][]
  const entriesWithMergedCheckboxes = Object.entries(mergeCheckboxAnswers(stringEntries))

  // Merge previously submitted answers with the current panel's just-submitted answers.
  // Current panel answers take priority, enabling up-to-date conditional evaluation.
  const allAnswersByKey = { ...previousAnswersByKey, ...Object.fromEntries(entriesWithMergedCheckboxes) }

  // Check if all required questions are answered
  const componentsConditions = panelComponentsConditions[currentPanelIndex].componentsConditions
  const missingRequiredQuestionErrorMessages = getMissingRequiredQuestionErrorMessages(
    requiredQuestionErrorMessages,
    entriesWithMergedCheckboxes,
    componentsConditions,
    allAnswersByKey,
  )

  if (missingRequiredQuestionErrorMessages.length > 0) {
    return {
      formData,
      validationErrors: missingRequiredQuestionErrorMessages.map(({ key, requiredErrorMessage }) => ({
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

  const nextPanelPath = getNextPanelPath(
    classificationId,
    currentPanelIndex,
    panelComponentsConditions,
    allAnswersByKey,
  )

  const isLastPanel = nextPanelPath === AFTER_ADDITIONAL_QUESTIONS_PATH

  if (isLastPanel) {
    // Set melding state to 'questions_answered'
    const { error } = await putMeldingByMeldingIdAnswerQuestions({
      path: { melding_id: parseInt(meldingId, 10) },
      query: { token },
    })

    if (error) return { formData, systemError: error }

    // Set current panel path as last panel path in cookies,
    // so that the user can be redirected back to it from AFTER_ADDITIONAL_QUESTIONS_PATH
    const oneDay = 24 * 60 * 60
    cookieStore.set(
      COOKIES.LAST_PANEL_PATH,
      `/aanvullende-vragen/${classificationId}/${panelComponentsConditions[currentPanelIndex].key}#top`,
      { maxAge: oneDay },
    )
  }

  return redirect(nextPanelPath)
}
