export const categorizeFormEntries = (formData: FormData) => {
  const entriesAsStringsWithoutFiles = Array.from(formData.entries()).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string',
  )

  const checkboxEntries = entriesAsStringsWithoutFiles.filter(([key]) => key.startsWith('checkbox___'))
  const timeEntries = entriesAsStringsWithoutFiles.filter(([key]) => key.startsWith('time___'))
  const otherEntries = entriesAsStringsWithoutFiles.filter(
    ([key]) => !key.startsWith('checkbox___') && !key.startsWith('time___'),
  )

  return { checkboxEntries, otherEntries, timeEntries }
}
