import { StandaloneLink } from '@amsterdam/design-system-react/dist/StandaloneLink'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import type { NoteRetrieveOutput } from '@meldingen/api-client'

import { Paragraph, UnorderedList } from '@meldingen/ui'

import { getFormattedDateString } from '../../../_utils/getFormattedDateString'
import { TipTapMarkdownToHtml } from '../TipTapMarkdownToHtml'

import styles from './Note.module.css'

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
            {getFormattedDateString(created_at)}
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
