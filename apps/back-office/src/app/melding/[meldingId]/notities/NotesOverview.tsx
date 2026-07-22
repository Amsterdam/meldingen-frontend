import { StandaloneLink } from '@amsterdam/design-system-react/dist/StandaloneLink'
import { useTranslations } from 'next-intl'

import type { NoteRetrieveOutput } from '@meldingen/api-client'

import { Grid, Heading, TabNavigation, UnorderedList } from '@meldingen/ui'

import { BackLink } from '../_components/BackLink'
import { Note } from './_components/Note/Note'
import { NextLink } from '~/app/_components'

import styles from './NotesOverview.module.css'

type Props = {
  currentUserId: number
  meldingId: number
  notes: NoteRetrieveOutput[]
  publicId: string
}

export const NotesOverview = ({ currentUserId, meldingId, notes, publicId }: Props) => {
  const t = useTranslations('notes-overview')

  return (
    <div className="ams-page__area--body">
      <BackLink href={`/`}>{t('back-link')}</BackLink>
      <Grid as="main">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          <Heading className="ams-mb-l" level={1}>
            {t('title', { publicId })}
          </Heading>
          <TabNavigation className="ams-mb-l">
            <TabNavigation.List>
              <TabNavigation.Link href={`/melding/${meldingId}`} linkComponent={NextLink}>
                {t('tab-navigation.detail')}
              </TabNavigation.Link>
              <TabNavigation.Link aria-current="page" href={`/melding/${meldingId}/notities`} linkComponent={NextLink}>
                {t('tab-navigation.notes')}
              </TabNavigation.Link>
            </TabNavigation.List>
          </TabNavigation>
          {notes.length > 0 && (
            <UnorderedList className={styles.list} markers={false}>
              {notes.map((note) => (
                <Note currentUserId={currentUserId} key={note.id} meldingId={meldingId} note={note} />
              ))}
            </UnorderedList>
          )}
          <StandaloneLink
            className="ams-mb-m"
            href={`/melding/${meldingId}/notities/toevoegen`}
            linkComponent={NextLink}
          >
            {t('add-note-link')}
          </StandaloneLink>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
