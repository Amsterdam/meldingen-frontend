import { categorizeFormEntries } from './categorizeFormEntries'

describe('categorizeFormEntries', () => {
  it('separates checkbox, time, and other entries', () => {
    const formData = new FormData()
    formData.append('checkbox___questionId___value1', 'yes')
    formData.append('time___questionId', '10:00')
    formData.append('someQuestion', 'some answer')

    const result = categorizeFormEntries(formData)

    expect(result.checkboxEntries).toEqual([['checkbox___questionId___value1', 'yes']])
    expect(result.timeEntries).toEqual([['time___questionId', '10:00']])
    expect(result.otherEntries).toEqual([['someQuestion', 'some answer']])
  })

  it('returns empty arrays when FormData is empty', () => {
    const formData = new FormData()

    const result = categorizeFormEntries(formData)

    expect(result.checkboxEntries).toEqual([])
    expect(result.timeEntries).toEqual([])
    expect(result.otherEntries).toEqual([])
  })

  it('excludes file entries', () => {
    const formData = new FormData()
    formData.append('someQuestion', 'some answer')
    formData.append('fileUpload', new File(['content'], 'file.txt'))

    const result = categorizeFormEntries(formData)

    expect(result.otherEntries).toEqual([['someQuestion', 'some answer']])
    expect(result.checkboxEntries).toEqual([])
    expect(result.timeEntries).toEqual([])
  })

  it('handles multiple entries of the same type', () => {
    const formData = new FormData()
    formData.append('checkbox___q1___v1', 'a')
    formData.append('checkbox___q1___v2', 'b')
    formData.append('time___q2', '08:00')
    formData.append('time___q3', '09:00')
    formData.append('other1', 'x')
    formData.append('other2', 'y')

    const result = categorizeFormEntries(formData)

    expect(result.checkboxEntries).toEqual([
      ['checkbox___q1___v1', 'a'],
      ['checkbox___q1___v2', 'b'],
    ])
    expect(result.timeEntries).toEqual([
      ['time___q2', '08:00'],
      ['time___q3', '09:00'],
    ])
    expect(result.otherEntries).toEqual([
      ['other1', 'x'],
      ['other2', 'y'],
    ])
  })
})
