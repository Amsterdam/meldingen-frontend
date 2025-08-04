import { useEffect, useState } from 'react'

import { ValidationError } from 'apps/melding-form/src/types'

export const useGetDocumentTitleOnError = (
  originalDocTitle: string,
  t: (key: string, { count }: { count: number }) => string,
  validationErrors?: ValidationError[],
) => {
  const [documentTitle, setDocumentTitle] = useState(originalDocTitle)

  useEffect(() => {
    if (validationErrors) {
      const errorCount = validationErrors.length

      setDocumentTitle(`${t('error-count-label', { count: errorCount })} ${originalDocTitle}`)
    }
  }, [validationErrors])

  return documentTitle
}
