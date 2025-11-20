import type { ButtonProps } from '@amsterdam/design-system-react/dist/Button'

import { Button } from '@amsterdam/design-system-react/dist/Button'

import styles from './SubmitButton.module.css'

export const SubmitButton = ({ children, ...restProps }: ButtonProps) => (
  <Button {...restProps} className={styles.button} type="submit">
    {children}
  </Button>
)
