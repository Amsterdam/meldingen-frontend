import { Button, Grid, Image, Paragraph } from '@amsterdam/design-system-react'
import type { Dispatch, SetStateAction } from 'react'

import { deleteMeldingByMeldingIdAttachmentByAttachmentId } from 'apps/public/src/apiClientProxy'

import type { UploadedFiles } from '../Bijlage'

import styles from './FileList.module.css'

type Props = {
  meldingId: number
  setUploadedFiles: Dispatch<SetStateAction<UploadedFiles[]>>
  token: string
  uploadedFiles: UploadedFiles[]
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
    <Grid className={`${styles.grid} ams-mb--sm`}>
      {uploadedFiles.map((file) => (
        <Grid.Cell span={6}>
          <Image alt="" src={file.image} />
          <div key={file.id} className={styles.description}>
            <Paragraph className={styles.paragraph}>{file.original_filename}</Paragraph>
            <Button variant="tertiary" onClick={() => onClick(file.id)} className={styles.button}>
              Verwijder foto
            </Button>
          </div>
        </Grid.Cell>
      ))}
    </Grid>
  )
}
