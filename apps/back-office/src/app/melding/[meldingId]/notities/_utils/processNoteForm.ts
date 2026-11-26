import { parseNoteDocument } from '~/app/_utils/parseNoteDocument'
import { MAX_NOTE_LENGTH } from '~/constants'

type NoteFieldName = 'addNote' | 'reactNote' | 'updateNote'

type ProcessNoteFormResult = {
  isEmpty: boolean
  markdown: string
} & ({ isValid: true } | { error: 'required' | 'maxLength'; isValid: false })

export const processNoteForm = (
  formData: FormData,
  fieldName: NoteFieldName,
  { required }: { required: boolean },
): ProcessNoteFormResult => {
  const formDataObject = Object.fromEntries(formData)
  const { characterCount, isEmpty, markdown } = parseNoteDocument(formDataObject[fieldName])

  formData.set(fieldName, markdown)

  if (required && isEmpty) {
    return { error: 'required', isEmpty, isValid: false, markdown }
  }

  if (characterCount > MAX_NOTE_LENGTH) {
    return { error: 'maxLength', isEmpty, isValid: false, markdown }
  }

  return { isEmpty, isValid: true, markdown }
}
