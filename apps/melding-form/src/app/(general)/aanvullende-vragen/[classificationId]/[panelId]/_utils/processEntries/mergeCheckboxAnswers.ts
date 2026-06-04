export const mergeCheckboxAnswers = (answers: [string, string][]): [string, string[]][] => {
  const mergedCheckboxAnswers = answers.reduce<Record<string, string[]>>((acc, [key, value]) => {
    const questionId = key.split('___')[1]

    if (!acc[questionId]) {
      acc[questionId] = []
    }

    acc[questionId].push(value)

    return acc
  }, {})

  return Object.entries(mergedCheckboxAnswers)
}
