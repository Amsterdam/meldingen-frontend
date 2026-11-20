import { useTranslations } from 'next-intl'

import { Paragraph } from '@meldingen/ui'
import { formatDateString } from '@meldingen/utils'

import type { ParentNote as ParentNoteType } from '../../_utils/addParentNotes'

import styles from './ParentNote.module.css'

type Props = {
  parentNote: ParentNoteType
}

export const ParentNote = ({ parentNote }: Props) => {
  const t = useTranslations('notes-overview.parent-note')
  const { createdAt, email, text } = parentNote

  const formattedDate = createdAt && formatDateString(createdAt)
  const hasAuthor = email && formattedDate

  return (
    <div className={styles.container}>
      <figure className={styles.figure}>
        <figcaption>
          <Paragraph className={styles.metadata}>
            <span className="ams-visually-hidden">
              {hasAuthor
                ? t('intro', { date: `${formattedDate.date} ${formattedDate.time}`, email })
                : t('intro-without-author')}
            </span>

            {hasAuthor && (
              <>
                <span aria-hidden="true">{email}</span>
                <time aria-hidden="true" dateTime={createdAt}>
                  {`${formattedDate.date} ${formattedDate.time}`}
                </time>
              </>
            )}
          </Paragraph>
        </figcaption>

        <blockquote className={styles.quote}>
          <Paragraph>{text}</Paragraph>
        </blockquote>
      </figure>
    </div>
  )
}
