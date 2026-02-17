type CheckboxAnswers = {
  [questionId: string]: string[]
}

export const mergeCheckboxAnswers = (answers: [string, string][]) => {
  const checkboxAnswers = answers.filter(([key]) => key.startsWith('checkbox___'))

  const groupedCheckboxAnswers = checkboxAnswers.reduce<CheckboxAnswers>((acc, [key, value]) => {
    const questionId = key.split('___')[1]

    if (!acc[questionId]) {
      acc[questionId] = []
    }

    acc[questionId].push(value)

    return acc
  }, {})

  const answerObjWithoutCheckboxes = Object.fromEntries(answers.filter(([key]) => !key.startsWith('checkbox___')))

  return { ...answerObjWithoutCheckboxes, ...groupedCheckboxAnswers }
}
