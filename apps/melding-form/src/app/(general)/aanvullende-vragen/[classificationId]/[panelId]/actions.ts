'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { putMeldingByMeldingIdAnswerQuestions } from '@meldingen/api-client'

import type { AnswersByKey } from '../../../_utils/getAnswersByKey'
import type { PanelComponentsConditions } from './_utils/navigationUtils'

import { hasValidationErrors } from '../../../_utils/hasValidationErrors'
import { shouldRenderComponent } from '../../../_utils/shouldRenderComponent'
import { buildAnswerPromises } from './_utils/buildAnswerPromises'
import { categorizeFormEntries } from './_utils/categorizeFormEntries'
import { mergeCheckboxAnswers } from './_utils/mergeCheckboxAnswers'
import { mergeUnknownTimeAnswers } from './_utils/mergeUnknownTimeAnswers'
import { AFTER_ADDITIONAL_QUESTIONS_PATH, getNextPanelPath, refilterAnswersByKey } from './_utils/navigationUtils'
import { COOKIES, TOP_ANCHOR_ID } from 'apps/melding-form/src/constants'
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

  if (!meldingId || !token) return redirect(`/cookie-storing#${TOP_ANCHOR_ID}`)

  // Checkbox and Time answers are stored as separate key-value pairs in the FormData object.
  // We filter and merge them into a single entry per question.
  // Checkbox and Time components have unique identifiers in their name.
  // Checkbox components start with 'checkbox___' and the Time component inputs start with 'time___'.
  const { checkboxEntries, otherEntries, timeEntries } = categorizeFormEntries(formData)

  // If a Time component has both a time value and an 'unknown' checkbox checked, return a validation error.
  // This can only happen when JavaScript fails to disable the time input when 'unknown' is checked, or fails to disable the 'unknown' checkbox when a time is entered.
  const timeConflictErrors = timeEntries
    .filter(([key, value]) => !key.endsWith('-unknown') && value)
    .filter(([key]) => timeEntries.some(([k, v]) => k === `${key}-unknown` && v === 'on'))
    .map(([key]) => ({ key: key.replace(/^time___/, ''), message: 'Selecteer een tijd, of vink "Weet ik niet" aan.' }))

  if (timeConflictErrors.length > 0) {
    return { formData, validationErrors: timeConflictErrors }
  }

  const mergedCheckboxEntries = mergeCheckboxAnswers(checkboxEntries)
  const mergedTimeEntries = mergeUnknownTimeAnswers(timeEntries)

  const entries = [...otherEntries, ...mergedCheckboxEntries, ...mergedTimeEntries]

  // Merge previously submitted answers with the current panel's just-submitted answers.
  // Current panel answers take priority, enabling up-to-date conditional evaluation.
  // Re-filter to null out answers for conditions that are no longer met after the merge.
  const allAnswersByKey = refilterAnswersByKey(panelComponentsConditions, {
    ...previousAnswersByKey,
    ...Object.fromEntries(entries),
  })

  // Check if all required questions are answered
  const componentsConditions = panelComponentsConditions[currentPanelIndex].componentsConditions
  const missingRequiredQuestionErrorMessages = getMissingRequiredQuestionErrorMessages(
    requiredQuestionErrorMessages,
    entries,
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
    entries,
    meldingId,
    questionAndAnswerIdPairs,
    questionMetadata,
    token,
  })
  const allResults = await Promise.all(promiseArray)
  const results = allResults.filter((result) => result !== undefined)

  // Return validation errors if there are any
  const resultsWithValidationError = results.filter(({ value }) => hasValidationErrors(value.response, value.error))

  if (resultsWithValidationError.length > 0) {
    return {
      formData,
      validationErrors: resultsWithValidationError.map(({ key, value }) => ({
        key,
        message: handleApiError(value.error),
      })),
    }
  }

  // Return an array of all errors if there are any
  const erroredResults = results.filter(({ value }) => value.error)

  if (erroredResults.length > 0) {
    return {
      formData,
      systemError: erroredResults.map(({ value }) => value.error),
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
      `/aanvullende-vragen/${classificationId}/${panelComponentsConditions[currentPanelIndex].key}#${TOP_ANCHOR_ID}`,
      { maxAge: oneDay },
    )
  }

  return redirect(nextPanelPath)
}
