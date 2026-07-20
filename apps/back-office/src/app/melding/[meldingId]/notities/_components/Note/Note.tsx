import { StandaloneLink } from '@amsterdam/design-system-react/dist/StandaloneLink'
import { useTranslations } from 'next-intl'

import type { NoteRetrieveOutput } from '@meldingen/api-client'

import { Paragraph, UnorderedList } from '@meldingen/ui'

import { TipTapMarkdownToHtml } from '../TipTapMarkdownToHtml'
import { NextLink } from '~/app/_components'

import styles from './Note.module.css'

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

type Props = {
  currentUserId: number
  meldingId: number
  note: NoteRetrieveOutput
}

export const Note = ({ currentUserId, meldingId, note }: Props) => {
  const t = useTranslations('notes-overview')

  const { created_at, id, text, updated_at, user } = note

  const wasEdited = new Date(updated_at) > new Date(created_at)

  return (
    <UnorderedList.Item className={styles.item}>
      <Paragraph className={styles.metadata}>
        <span className="ams-visually-hidden">{t('visually-hidden-texts.created-at')}</span>
        <span>
          <time className={styles.time} dateTime={created_at}>
            {formatDateTime(created_at)}
          </time>
          {wasEdited && (
            <>
              {' '}
              <span className={styles.editedVisualText} hidden>
                {t('edited')}
              </span>
            </>
          )}
        </span>
        <span className="ams-visually-hidden">{t('visually-hidden-texts.by')}</span>
        <span>{user.email}</span>
        {wasEdited && <span className="ams-visually-hidden">{t('visually-hidden-texts.edited')}</span>}
      </Paragraph>
      {text === '' ? <Paragraph>{t('deleted-note')}</Paragraph> : <TipTapMarkdownToHtml markdown={text} />}
      {/* Only show the edit link if the current user is the author of the note */}
      {currentUserId === user.id && (
        <StandaloneLink
          className={styles.link}
          href={`/melding/${meldingId}/notities/${id}/wijzigen`}
          linkComponent={NextLink}
        >
          {t('edit-link')}
        </StandaloneLink>
      )}
    </UnorderedList.Item>
  )
}
