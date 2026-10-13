import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import type { ClassificationOutput, NoteRetrieveOutput } from '@meldingen/api-client'

import { Heading, StandaloneLink, TabNavigation, UnorderedList } from '@meldingen/ui'

import { PageWrapper } from '../_components/PageWrapper'
import { Note } from './_components/Note/Note'

import styles from './NotesOverview.module.css'

type Props = {
  classifications?: ClassificationOutput[]
  currentUserId: number
  meldingId: number
  notes: NoteRetrieveOutput[]
  publicId: string
}

export const NotesOverview = ({ classifications, currentUserId, meldingId, notes, publicId }: Props) => {
  const t = useTranslations('notes-overview')
  const getClassification = (classificationId: NoteRetrieveOutput['classification_id']) =>
    classifications?.find((classification) => classification.id === classificationId)

  const hasNotes = notes.length > 0

  return (
    <PageWrapper backLink={{ href: '/', label: t('back-link') }}>
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
            <Note
              classification={getClassification(note.classification_id)}
              currentUserId={currentUserId}
              key={note.id}
              meldingId={meldingId}
              note={note}
            />
          ))}
        </UnorderedList>
      )}
    </PageWrapper>
  )
}
