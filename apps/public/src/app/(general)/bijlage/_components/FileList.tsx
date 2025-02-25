import { Button, Grid, Image, Paragraph } from '@amsterdam/design-system-react'
import type { Dispatch, SetStateAction } from 'react'

import type { ApiError } from 'apps/public/src/apiClientProxy'
import { deleteMeldingByMeldingIdAttachmentByAttachmentId } from 'apps/public/src/apiClientProxy'

import type { UploadedFiles } from '../Attachments'

import styles from './FileList.module.css'

export type Props = {
  meldingId: number
  setUploadedFiles: Dispatch<SetStateAction<UploadedFiles[]>>
  token: string
  uploadedFiles: UploadedFiles[]
  setErrorMessage: (errorMessage?: string) => void
}

export const FileList = ({ uploadedFiles, meldingId, token, setUploadedFiles, setErrorMessage }: Props) => {
  const handleOnClick = async (attachmentId: number) => {
    setErrorMessage(undefined)

    try {
      await deleteMeldingByMeldingIdAttachmentByAttachmentId({
        meldingId,
        attachmentId,
        token,
      })
      setUploadedFiles((files) => files.filter((file) => file.id !== attachmentId))
    } catch (error) {
      setErrorMessage((error as ApiError).message)
    }
  }

  return (
    <Grid className={`${styles.grid} ams-mb--sm`}>
      {uploadedFiles.map((file) => (
        <Grid.Cell span={6} key={file.id}>
          <Image alt="" src={file.image} />
          <div className={styles.description}>
            <Paragraph className={styles.paragraph}>{file.original_filename}</Paragraph>
            <Button variant="tertiary" onClick={() => handleOnClick(file.id)} className={styles.button}>
              Verwijder foto
            </Button>
          </div>
        </Grid.Cell>
      ))}
    </Grid>
  )
}
