import { processNoteForm } from './processNoteForm'
import { MAX_NOTE_LENGTH } from '~/constants'

const noteDocument = (text: string) =>
  JSON.stringify({
    content: [{ content: text ? [{ text, type: 'text' }] : [], type: 'paragraph' }],
    type: 'doc',
  })

describe('processNoteForm', () => {
  it('restores parsed markdown in the form data', () => {
    const formData = new FormData()

    formData.append('addNote', noteDocument('A note'))

    const result = processNoteForm(formData, 'addNote', { required: true })

    expect(result).toEqual({ isEmpty: false, isValid: true, markdown: 'A note' })
    expect(formData.get('addNote')).toBe('A note')
  })

  it('returns a required error for a missing required field', () => {
    const formData = new FormData()

    const result = processNoteForm(formData, 'addNote', { required: true })

    expect(result).toEqual({ error: 'required', isEmpty: true, isValid: false, markdown: '' })
    expect(formData.get('addNote')).toBe('')
  })

  it('allows an empty optional field', () => {
    const formData = new FormData()

    formData.append('updateNote', noteDocument('   '))

    const result = processNoteForm(formData, 'updateNote', { required: false })

    expect(result).toEqual({ isEmpty: true, isValid: true, markdown: '' })
  })

  it('checks required content before the maximum length', () => {
    const formData = new FormData()

    formData.append('addNote', noteDocument(' '.repeat(MAX_NOTE_LENGTH + 1)))

    const result = processNoteForm(formData, 'addNote', { required: true })

    expect(result).toMatchObject({ error: 'required', isValid: false })
  })

  it('rejects optional content over the maximum length', () => {
    const formData = new FormData()

    formData.append('updateNote', noteDocument('a'.repeat(MAX_NOTE_LENGTH + 1)))

    const result = processNoteForm(formData, 'updateNote', { required: false })

    expect(result).toMatchObject({ error: 'maxLength', isValid: false })
  })

  it('accepts content at the maximum length', () => {
    const formData = new FormData()

    formData.append('reactNote', noteDocument('a'.repeat(MAX_NOTE_LENGTH)))

    const result = processNoteForm(formData, 'reactNote', { required: true })

    expect(result).toMatchObject({ isEmpty: false, isValid: true })
  })
})
