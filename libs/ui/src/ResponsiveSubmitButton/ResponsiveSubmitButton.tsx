import { clsx } from 'clsx'

import type { SubmitButtonProps } from '../SubmitButton/SubmitButton'

import { SubmitButton } from '../SubmitButton/SubmitButton'

import styles from './ResponsiveSubmitButton.module.css'

export const ResponsiveSubmitButton = ({ className, ...restProps }: SubmitButtonProps) => (
  <SubmitButton className={clsx(styles.button, className)} {...restProps} />
)
