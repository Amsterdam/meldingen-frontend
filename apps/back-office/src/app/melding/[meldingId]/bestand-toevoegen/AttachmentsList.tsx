'use client'

import { useTranslations } from 'next-intl'

import type { FileUploadState } from '@meldingen/file-upload'

import { FileList } from '@meldingen/file-upload'

type Props = {
  files: FileUploadState[]
  handleDelete: (id: string, fileName: string, xhr?: XMLHttpRequest, serverId?: number) => void
}

export const AttachmentsList = ({ files, handleDelete }: Props) => {
  const t = useTranslations('attachments.add')

  return (
    <FileList>
      {files.map(({ errorMessage, file, id, progress, serverId, status, xhr }) => {
        const labels = {
          actionButtonDeleteLabel: t('file-upload.action-button-delete'),
          progressFinishedLabel: progress === 100 ? t('file-upload.progress-finished') : '',
          progressLoadingLabel: t('file-upload.progress-loading'),
        }

        return (
          <FileList.Item
            deleteButtonId={id}
            errorMessage={errorMessage ? t(errorMessage) : undefined}
            file={file}
            key={id}
            labels={labels}
            onDelete={() => handleDelete(id, file.name, xhr, serverId)}
            status={status}
          />
        )
      })}
    </FileList>
  )
}
