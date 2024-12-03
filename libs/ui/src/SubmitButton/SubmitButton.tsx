import type { ButtonProps } from '@amsterdam/design-system-react'
import { Button } from '@amsterdam/design-system-react'

import styles from './SubmitButton.module.css'

export const SubmitButton = ({ children, ...restProps }: ButtonProps) => (
  <Button {...restProps} className={styles.button} type="submit">
    {children}
  </Button>
)
