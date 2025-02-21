import { Button } from '@amsterdam/design-system-react'
import type { Dispatch, SetStateAction } from 'react'

import type { AttachmentOutput } from 'apps/public/src/apiClientProxy'
import { deleteMeldingByMeldingIdAttachmentByAttachmentId } from 'apps/public/src/apiClientProxy'

import styles from './FileList.module.css'

type Props = {
  uploadedFiles: AttachmentOutput[]
  meldingId: number
  token: string
  setUploadedFiles: Dispatch<SetStateAction<AttachmentOutput[]>>
}

export const FileList = ({ uploadedFiles, meldingId, token, setUploadedFiles }: Props) => {
  const onClick = async (attachmentId: number) => {
    try {
      await deleteMeldingByMeldingIdAttachmentByAttachmentId({
        meldingId,
        attachmentId,
        token,
      })
      setUploadedFiles((files) => files.filter((file) => file.id !== attachmentId))
    } catch (error) {
      console.error('error', error)
    }
  }

  return (
    <div className={`${styles.wrapper} ams-mb--sm`}>
      {uploadedFiles.map((file) => (
        <div key={file.id} className={styles.item}>
          <span className={styles.name}>{file.original_filename}</span>
          <Button variant="tertiary" onClick={() => onClick(file.id)}>
            Verwijderen
          </Button>
        </div>
      ))}
    </div>
  )
}
