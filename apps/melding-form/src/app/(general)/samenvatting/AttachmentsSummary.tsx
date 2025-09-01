import { FileList } from '@amsterdam/design-system-react'

import { SummaryList } from '@meldingen/ui'

import type { Props as SummaryProps } from './Summary'

import styles from './AttachmentsSummary.module.css'

export type Props = {
  attachments: SummaryProps['attachments']
}

export const AttachmentsSummary = ({ attachments }: Props) => {
  if (attachments.files.length === 0) return

  return (
    <SummaryList.Item key={attachments.key}>
      <SummaryList.Term>{attachments.term}</SummaryList.Term>
      <SummaryList.Description key={attachments.key}>
        <FileList className={styles.fileListAttachments}>
          {attachments.files.map(({ fileName, blob, contentType }) => (
            <FileList.Item key={fileName} file={new File([blob], fileName, { type: contentType })} />
          ))}
        </FileList>
      </SummaryList.Description>
    </SummaryList.Item>
  )
}
