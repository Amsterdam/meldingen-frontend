import { RefObject, useEffect } from 'react'

import { ValidationError } from 'apps/melding-form/src/types'

export const useSetFocusOnInvalidFormAlert = (ref: RefObject<HTMLDivElement>, errors?: ValidationError[]) => {
  useEffect(() => {
    if (ref.current && errors) {
      ref.current.focus()
    }
  }, [ref, errors])
}
