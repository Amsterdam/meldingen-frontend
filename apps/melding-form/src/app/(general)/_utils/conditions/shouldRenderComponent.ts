import type { FormIoConditional } from '@meldingen/api-client'

import type { AnswersByKey } from './getFilteredAnswersByKey'

const isNullOrEmpty = (value: unknown) => value === null || value === ''

export const shouldRenderComponent = (
  { conditional }: { conditional?: FormIoConditional | null },
  answersByKey: AnswersByKey,
) => {
  if (
    !conditional ||
    isNullOrEmpty(conditional.when) ||
    isNullOrEmpty(conditional.eq) ||
    isNullOrEmpty(conditional.show)
  )
    return true

  const answerValue = answersByKey[conditional.when] ?? null
  const conditionMet =
    answerValue !== null &&
    (Array.isArray(answerValue)
      ? answerValue.includes(String(conditional.eq)) // For checkboxes, the answerValue is an array. The condition is met if at least one of the values matches the condition.
      : answerValue === String(conditional.eq))

  return conditionMet ? conditional.show : !conditional.show
}
