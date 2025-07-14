import { mergeCheckboxAnswers } from './mergeCheckboxAnswers'

describe('mergeCheckboxAnswers', () => {
  it('merges checkbox answers correctly', () => {
    const answers: [string, string | File][] = [
      ['checkbox___checkboxQuestionId___value1', 'answer 1'],
      ['checkbox___checkboxQuestionId___value2', 'answer 2'],
      ['nonCheckboxQuestion', 'answer 3'],
    ]

    const result = mergeCheckboxAnswers(answers)
    expect(result).toEqual({
      checkboxQuestionId: 'value1, value2',
      nonCheckboxQuestion: 'answer 3',
    })
  })

  it('handles non-checkbox answers correctly', () => {
    const answers: [string, string | File][] = [
      ['q1', 'answer1'],
      ['q2', 'answer2'],
    ]

    const result = mergeCheckboxAnswers(answers)
    expect(result).toEqual({
      q1: 'answer1',
      q2: 'answer2',
    })
  })

  it('handles mixed answers correctly', () => {
    const answers: [string, string | File][] = [
      ['checkbox___checkboxQuestionId___value1', 'answer 1'],
      ['nonCheckboxQuestion1', 'answer 2'],
      ['checkbox___checkboxQuestionId___value2', 'answer 3'],
      ['nonCheckboxQuestion2', 'answer 4'],
    ]

    const result = mergeCheckboxAnswers(answers)
    expect(result).toEqual({
      checkboxQuestionId: 'value1, value2',
      nonCheckboxQuestion1: 'answer 2',
      nonCheckboxQuestion2: 'answer 4',
    })
  })

  it('handles empty answers array', () => {
    const answers: [string, string | File][] = []

    const result = mergeCheckboxAnswers(answers)
    expect(result).toEqual({})
  })
})
