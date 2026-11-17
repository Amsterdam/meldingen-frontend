import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import type { ClassificationOutput, NoteOutput } from '@meldingen/api-client'

import { Column, Paragraph, StandaloneLink } from '@meldingen/ui'
import { formatDateString } from '@meldingen/utils'

import { TipTapMarkdownToHtml } from '../TipTapMarkdownToHtml'

import styles from './Note.module.css'

type Props = {
  classification?: ClassificationOutput
  link?: {
    href: string
    label: string
  }
  note: NoteOutput
}

export const Note = ({ classification, link, note }: Props) => {
  const t = useTranslations('notes-overview')
  const { created_at, text, updated_at, user } = note
  const { date, time } = formatDateString(created_at)

  const wasEdited = new Date(updated_at) > new Date(created_at)

  return (
    <div className={styles.item}>
      <Paragraph className={styles.metadata}>
        <span className="ams-visually-hidden">{t('visually-hidden-texts.created-at')}</span>
        <span>
          <time className={styles.time} dateTime={created_at}>
            {`${date} ${time}`}
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

      <Column>
        {link && (
          <StandaloneLink className={styles.link} href={link.href} linkComponent={NextLink}>
            {link.label}
          </StandaloneLink>
        )}

        {classification && (
          <Paragraph className={styles.metadata}>
            <span className={clsx(styles.classification)}>{t('classification')}</span>
            <span>{classification.name}</span>
          </Paragraph>
        )}
      </Column>
    </div>
  )
}
