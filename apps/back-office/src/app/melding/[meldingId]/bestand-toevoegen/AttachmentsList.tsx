'use client'

import { useTranslations } from 'next-intl'

import type { FileUploadState } from '@meldingen/file-upload'

import { FileList } from '@meldingen/file-upload'

import styles from './AttachmentsList.module.css'

type Props = {
  files: FileUploadState[]
  handleDelete: (id: string, fileName: string, xhr?: XMLHttpRequest, serverId?: number) => void
}

export const AttachmentsList = ({ files, handleDelete }: Props) => {
  const t = useTranslations('add-attachment')

  const handleOnDelete = (id: string, fileName: string, xhr?: XMLHttpRequest, serverId?: number) => {
    const shouldDelete = window.confirm(`Are you sure you want to delete ${fileName}?`)

    if (!shouldDelete) return

    handleDelete(id, fileName, xhr, serverId)
  }

  return (
    <FileList>
      {files.map(({ errorMessage, file, id, progress, serverId, status, xhr }) => {
        const labels = {
          actionButtonCancelLabel: t('file-upload.action-button-cancel'),
          actionButtonDeleteLabel: t('file-upload.action-button-delete'),
          progressFinishedLabel: progress === 100 ? t('file-upload.progress-finished') : '',
          progressLoadingLabel: t('file-upload.progress-loading', {
            percentage: Math.round(progress),
          }),
        }

        return (
          <FileList.Item
            className={styles.ListItem}
            deleteButtonId={id}
            errorMessage={errorMessage ? t(errorMessage) : undefined}
            file={file}
            key={id}
            labels={labels}
            onDelete={() => handleOnDelete(id, file.name, xhr, serverId)}
            status={status}
          />
        )
      })}
    </FileList>
  )
}
