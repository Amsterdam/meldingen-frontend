import { mergeCheckboxAnswers } from './mergeCheckboxAnswers'

describe('mergeCheckboxAnswers', () => {
  it('merges checkbox answers correctly', () => {
    const answers: [string, string][] = [
      ['checkbox___checkboxQuestionId___value1', 'answer 1'],
      ['checkbox___checkboxQuestionId___value2', 'answer 2'],
      ['checkbox___checkboxQuestionId___value3', 'answer 3'],
    ]

    const result = mergeCheckboxAnswers(answers)
    expect(result).toEqual([['checkboxQuestionId', ['answer 1', 'answer 2', 'answer 3']]])
  })

  it('handles empty answers array', () => {
    const answers: [string, string][] = []

    const result = mergeCheckboxAnswers(answers)
    expect(result).toEqual([])
  })
})
