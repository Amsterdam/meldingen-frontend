'use server'

import { postMeldingByMeldingIdQuestionByQuestionId } from '@meldingen/api-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { mergeCheckboxAnswers } from './_utils/mergeCheckboxAnswers'

type ArgsType = {
  questionIds: { key: string; id: number }[]
  lastPanelPath: string
  nextPanelPath: string
}

export const postForm = async (args: ArgsType, _: unknown, formData: FormData) => {
  // Get session variables from cookies
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  // Set last panel path in cookies
  cookieStore.set('lastPanelPath', args.lastPanelPath)

  // Checkbox answers are stored as separate key-value pairs in the FormData object.
  // This function merges these answers into a single string value per question, using an identifier in the Checkbox component.
  // TODO: This isn't the most robust solution.
  const formDataObj = Object.fromEntries(formData)
  const entries = Object.entries(formDataObj)
  const entriesWithMergedCheckboxes = Object.entries(mergeCheckboxAnswers(entries))

  const promiseArray = entriesWithMergedCheckboxes.map(([key, value]) => {
    if (value instanceof File) return undefined

    // Filter out empty answers
    if (value.length === 0) return undefined

    const questionId = args.questionIds.find((component) => component.key === key)?.id

    if (!meldingId || !questionId || !token) return undefined

    return postMeldingByMeldingIdQuestionByQuestionId({
      meldingId: parseInt(meldingId, 10),
      questionId,
      token,
      requestBody: { text: value },
    }).catch((error) => error)
  })

  const results = await Promise.all(promiseArray)

  // Return a string of all error messages and do not redirect if one of the requests failed
  const erroredResults = results.filter((result) => result instanceof Error)

  if (erroredResults.length > 0) {
    return { message: erroredResults.map((error) => error.message).join(', ') }
  }

  return redirect(args.nextPanelPath)
}
