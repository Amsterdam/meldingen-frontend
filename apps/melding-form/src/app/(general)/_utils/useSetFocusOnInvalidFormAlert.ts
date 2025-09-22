import { RefObject, useEffect } from 'react'

import { ValidationError } from 'apps/melding-form/src/types'

export const useSetFocusOnInvalidFormAlert = (ref: RefObject<HTMLDivElement | null>, errors?: ValidationError[]) => {
  useEffect(() => {
    if (ref.current && errors) {
      ref.current.focus()
    }
  }, [ref, errors])
}
