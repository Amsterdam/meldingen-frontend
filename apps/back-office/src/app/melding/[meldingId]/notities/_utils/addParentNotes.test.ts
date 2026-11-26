import type { NoteOutput } from '@meldingen/api-client'

import { addParentNotes } from './addParentNotes'

const parent = {
  created_at: '2026-03-23T10:12:00Z',
  id: 1,
  parent_note_id: null,
  parent_note_text_snapshot: null,
  text: 'Current parent text.',
  user: { email: 'parent@example.com', id: 2 },
} as NoteOutput

const reply = {
  created_at: '2026-03-24T12:24:00Z',
  id: 2,
  parent_note_id: 1,
  parent_note_text_snapshot: 'Container is **nu** leeg.',
  text: 'Reply text.',
  user: { email: 'reply@example.com', id: 1 },
} as NoteOutput

describe('addParentNotes', () => {
  it('leaves notes without a parent unchanged', () => {
    expect(addParentNotes([parent])).toEqual([parent])
  })

  it('adds the parent email, created date and plain text snapshot to replies', () => {
    const [, result] = addParentNotes([parent, reply])

    expect(result.parentNote).toEqual({
      createdAt: '2026-03-23T10:12:00Z',
      email: 'parent@example.com',
      text: 'Container is nu leeg.',
    })
  })

  it('preserves long parent snapshots', () => {
    const snapshotText = 'a'.repeat(300)
    const snapshot = `**${snapshotText}**`
    const [, result] = addParentNotes([parent, { ...reply, parent_note_text_snapshot: snapshot }])

    expect(result.parentNote?.text).toBe(snapshotText)
  })

  it('uses the snapshot instead of the current text of the parent', () => {
    const [, result] = addParentNotes([{ ...parent, text: '' }, reply])

    expect(result.parentNote?.text).toBe('Container is nu leeg.')
  })

  it('finds the parent regardless of the order of the notes', () => {
    const [result] = addParentNotes([reply, parent])

    expect(result.parentNote?.email).toBe('parent@example.com')
  })

  it('only adds the snapshot when the parent is not in the list', () => {
    const [result] = addParentNotes([reply])

    expect(result.parentNote).toEqual({ createdAt: undefined, email: undefined, text: 'Container is nu leeg.' })
  })

  it('does not add a parent note when the snapshot is missing', () => {
    const [, result] = addParentNotes([parent, { ...reply, parent_note_text_snapshot: null }])

    expect(result.parentNote).toBeUndefined()
  })
})
