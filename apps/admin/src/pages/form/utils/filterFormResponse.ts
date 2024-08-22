const allowLists: Record<string, string[]> = {
  panel: ['label', 'key', 'type', 'input', 'components'],
  radio: ['label', 'description', 'key', 'type', 'input', 'values'],
  select: ['label', 'description', 'key', 'type', 'input', 'widget', 'placeholder', 'data'],
  selectboxes: ['label', 'description', 'key', 'type', 'input', 'values'],
  textarea: ['label', 'description', 'key', 'type', 'input', 'autoExpand', 'showCharCount'],
  textfield: ['label', 'description', 'key', 'type', 'input'],
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterFormResponse = (obj: any): any => {
  // If the input is a JS primitive, return the unmodified input
  if (obj !== Object(obj)) {
    return obj
  }

  // If the input is an array, run this function recursively on all items of the array
  if (Array.isArray(obj)) {
    return obj.map((item) => filterFormResponse(item))
  }

  return (
    Object.keys(obj)
      // If input has a key called 'type', and the value of 'type' is present in the keys of the allowLists object,
      // filter keys based on that specific allow list. Otherwise, all keys are passed.
      .filter((key) => {
        if (Object.keys(allowLists).includes(obj?.type)) {
          return allowLists[obj.type].includes(key)
        }

        return true
      })
      // Reduce the input by recursively calling the function on each value and assigning it to the key
      .reduce((acc, x) => Object.assign(acc, { [x]: filterFormResponse(obj[x]) }), {})
  )
}
