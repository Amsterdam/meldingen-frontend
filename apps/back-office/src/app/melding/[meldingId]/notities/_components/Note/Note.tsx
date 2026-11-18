import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import type { ClassificationOutput } from '@meldingen/api-client'

import { Column, Link, Paragraph } from '@meldingen/ui'
import { formatDateString } from '@meldingen/utils'

import type { NoteWithParentNote } from '../../_utils/addParentNotes'

import { ParentNote } from '../ParentNote/ParentNote'
import { TipTapMarkdownToHtml } from '../TipTapMarkdownToHtml/TipTapMarkdownToHtml'

import styles from './Note.module.css'

type Props = {
  classification?: ClassificationOutput
  link?: {
    href: string
    label: string
  }
  note: NoteWithParentNote
}

export const Note = ({ classification, link, note }: Props) => {
  const t = useTranslations('notes-overview')
  const { created_at, parentNote, text, updated_at, user } = note
  const { date, time } = formatDateString(created_at)

  const wasEdited = new Date(updated_at) > new Date(created_at)

  return (
    <div className={styles.item}>
      {parentNote && <ParentNote parentNote={parentNote} />}

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

      {(classification || link) && (
        <Column>
          {classification && (
            <Paragraph className={styles.metadata}>
              <span className={clsx(styles.classification)}>{t('classification')}</span>
              <span>{classification.name}</span>
            </Paragraph>
          )}

          {link && (
            <Link className={styles.link} href={link.href} linkComponent={NextLink}>
              {link.label}
            </Link>
          )}
        </Column>
      )}
    </div>
  )
}
