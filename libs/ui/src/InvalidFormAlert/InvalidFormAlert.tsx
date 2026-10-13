'use client'

import { LinkList } from '@amsterdam/design-system-react'

import type { FocusableAlertProps } from '../FocusableAlert/FocusableAlert'

import { FocusableAlert } from '../FocusableAlert/FocusableAlert'

export type ValidationError = {
  key: string
  message: string
}

export type InvalidFormAlertProps = Omit<FocusableAlertProps, 'children' | 'description'> & {
  errors: ValidationError[]
}

export const InvalidFormAlert = ({ errors, ...alertProps }: InvalidFormAlertProps) => {
  if (errors.length === 0) {
    return null
  }

  return (
    <FocusableAlert {...alertProps}>
      <LinkList>
        {errors.map(({ key, message }) => (
          <LinkList.Link href={`#${key}`} key={`${key}-${message}`}>
            {message}
          </LinkList.Link>
        ))}
      </LinkList>
    </FocusableAlert>
  )
}
