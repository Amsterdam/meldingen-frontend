import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import type { ClassificationOutput, NoteOutput } from '@meldingen/api-client'

import { Heading, StandaloneLink, TabNavigation, UnorderedList } from '@meldingen/ui'

import type { NoteWithParentNote } from './_utils/addParentNotes'

import { PageWrapper } from '../_components/PageWrapper'
import { Note } from './_components/Note/Note'

import styles from './NotesOverview.module.css'

type Props = {
  classifications?: ClassificationOutput[]
  currentUserId: number
  meldingId: number
  notes: NoteWithParentNote[]
  overviewHref: string
  publicId: string
}

export const NotesOverview = ({ classifications, currentUserId, meldingId, notes, overviewHref, publicId }: Props) => {
  const t = useTranslations('notes-overview')

  const getClassification = (classificationId: NoteOutput['classification_id']) =>
    classifications?.find((classification) => classification.id === classificationId)

  const getNoteLink = (note: NoteOutput) => {
    const isNoteOwner = currentUserId === note.user.id
    const isDeleted = note.text === ''

    // Deleted notes can not be replied to.
    if (!isNoteOwner && isDeleted) return undefined

    return {
      href: `/melding/${meldingId}/notities/${note.id}/${isNoteOwner ? 'wijzigen' : 'reageren'}`,
      label: isNoteOwner ? t('edit-link') : t('reply-link'),
    }
  }

  const hasNotes = notes.length > 0

  return (
    <PageWrapper backLink={{ href: overviewHref, label: t('back-link') }}>
      <Heading className="ams-mb-l" level={1}>
        {t('title', { publicId })}
      </Heading>
      <TabNavigation className="ams-mb-l">
        <TabNavigation.List>
          <TabNavigation.Link href={`/melding/${meldingId}`} linkComponent={NextLink}>
            {t('tab-navigation.detail')}
          </TabNavigation.Link>

          <TabNavigation.Link aria-current="page" href={`/melding/${meldingId}/notities`} linkComponent={NextLink}>
            {t('tab-navigation.notes')} {hasNotes && `(${notes.length})`}
          </TabNavigation.Link>
        </TabNavigation.List>
      </TabNavigation>
      <StandaloneLink className="ams-mb-m" href={`/melding/${meldingId}/notities/toevoegen`} linkComponent={NextLink}>
        {t('add-note-link')}
      </StandaloneLink>

      {hasNotes && (
        <UnorderedList className={styles.list} markers={false}>
          {notes.map((note) => (
            <UnorderedList.Item key={note.id}>
              <Note classification={getClassification(note.classification_id)} link={getNoteLink(note)} note={note} />
            </UnorderedList.Item>
          ))}
        </UnorderedList>
      )}
    </PageWrapper>
  )
}
