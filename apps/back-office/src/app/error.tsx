'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

import { ErrorPage } from './_components/ErrorPage/ErrorPage'

type ErrorProps = {
  error: Error & { digest?: string }
  retry: () => void
}

const Error = ({ error, retry }: ErrorProps) => {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  const t = useTranslations('error')

  return (
    <div className="ams-page__area--body">
      <title>{t('metadata.title')}</title>
      <ErrorPage error={error} retry={retry} />
    </div>
  )
}

export default Error
