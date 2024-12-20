type Answer = {
  [key: string]: string | File
}

type CheckboxAnswers = {
  [questionId: string]: string
}

export const mergeCheckboxAnswers = (answers: [string, string | File][]): Answer => {
  const checkboxAnswers = answers.filter(([key]) => key.startsWith('checkbox___'))

  const groupedCheckboxAnswers = checkboxAnswers.reduce<CheckboxAnswers>((acc, [key, value]) => {
    const questionId = key.split('___')[1]

    if (!acc[questionId]) {
      acc[questionId] = ''
    }

    if (acc[questionId].length === 0) {
      acc[questionId] = value as string
    } else {
      acc[questionId] = `${acc[questionId]}, ${value}`
    }

    return acc
  }, {})

  const answerObjWithoutCheckboxes = Object.fromEntries(answers.filter(([key]) => !key.startsWith('checkbox___')))

  return { ...answerObjWithoutCheckboxes, ...groupedCheckboxAnswers }
}
