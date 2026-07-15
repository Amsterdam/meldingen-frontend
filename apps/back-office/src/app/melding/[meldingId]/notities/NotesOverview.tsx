import { StandaloneLink } from '@amsterdam/design-system-react/dist/StandaloneLink'
import { useTranslations } from 'next-intl'

import type { NoteRetrieveOutput } from '@meldingen/api-client'

import { Grid, Heading, OrderedList, Paragraph, TabNavigation } from '@meldingen/ui'

import { BackLink } from '../_components/BackLink'
import { TipTapMarkdownToHtml } from './_components/TipTapMarkdownToHtml'
import { NextLink } from '~/app/_components'

import styles from './NotesOverview.module.css'

type Props = {
  meldingId: number
  notes: NoteRetrieveOutput[]
  publicId: string
}

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)

  const formattedDate = date.toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('nl-NL', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Europe/Amsterdam',
  })

  return `${formattedDate} ${formattedTime}`
}

export const NotesOverview = ({ meldingId, notes, publicId }: Props) => {
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
            <OrderedList className={styles.list} markers={false}>
              {notes.map(({ created_at, id, text, user }) => (
                <OrderedList.Item className={styles.note} key={id}>
                  <Paragraph className={styles.metadata}>
                    <span className="ams-visually-hidden">{t('visually-hidden-texts.created-at')}</span>
                    <time className={styles.time} dateTime={created_at}>
                      {formatDateTime(created_at)}
                    </time>
                    <span className="ams-visually-hidden">{t('visually-hidden-texts.by')}</span>
                    <span>{user.email}</span>
                  </Paragraph>
                  {text === '' ? <Paragraph>{t('deleted-note')}</Paragraph> : <TipTapMarkdownToHtml markdown={text} />}
                  <StandaloneLink
                    className={styles.link}
                    href={`/melding/${meldingId}/notities/wijzigen/${id}`}
                    linkComponent={NextLink}
                  >
                    {t('edit-link')}
                  </StandaloneLink>
                </OrderedList.Item>
              ))}
            </OrderedList>
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
