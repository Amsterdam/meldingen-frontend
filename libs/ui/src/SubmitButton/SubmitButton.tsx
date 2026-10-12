'use client'

import type { ButtonHTMLAttributes, MouseEvent } from 'react'

import { Button } from '@amsterdam/design-system-react/dist/Button'
import { useEffect, useState } from 'react'

import styles from './SubmitButton.module.css'

export type SubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children' | 'type'> & {
  isLoading: boolean
  label: string
  loadingLabel: string
}

export const SubmitButton = ({
  'aria-disabled': ariaDisabled,
  isLoading,
  label,
  loadingLabel,
  onClick,
  ...restProps
}: SubmitButtonProps) => {
  const [hasDelayPassed, setHasDelayPassed] = useState(false)

  useEffect(() => {
    if (!isLoading) return

    const timeout = setTimeout(() => setHasDelayPassed(true), 500)

    return () => {
      clearTimeout(timeout)
      setHasDelayPassed(false)
    }
  }, [isLoading])

  const shouldConveyLoading = isLoading && hasDelayPassed

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isLoading) {
      event.preventDefault()

      return
    }

    onClick?.(event)
  }

  return (
    <Button
      {...restProps}
      aria-disabled={shouldConveyLoading || ariaDisabled}
      // Updating aria-label is the most reliable way to inform screen readers of the loading state.
      // See https://github.com/w3c/aria/issues/2178
      aria-label={shouldConveyLoading ? `${label}, ${loadingLabel}` : undefined}
      className={styles.button}
      onClick={handleClick}
      type="submit"
    >
      {label}
      {shouldConveyLoading && <span className={styles.spinner} />}
    </Button>
  )
}
