import type { ButtonHTMLAttributes, MouseEvent } from 'react'

import { Button } from '@amsterdam/design-system-react/dist/Button'

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
      aria-disabled={isLoading || ariaDisabled}
      // Updating aria-label is the most reliable way to inform screen readers of the loading state.
      // See https://github.com/w3c/aria/issues/2178
      aria-label={isLoading ? `${label}, ${loadingLabel}` : undefined}
      className={styles.button}
      onClick={handleClick}
      type="submit"
    >
      {label}
      {isLoading && <span className={styles.spinner} />}
    </Button>
  )
}
