'use client'

import { ErrorPage } from './_components/ErrorPage'

type ErrorProps = {
  error: Error & { digest?: string }
  retry: () => void
}

const Error = ({ error, retry }: ErrorProps) => (
  <div className="ams-page__area--body">
    <ErrorPage error={error} retry={retry} />
  </div>
)

export default Error
