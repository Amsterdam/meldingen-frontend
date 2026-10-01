import type { SimpleFormProps } from 'react-admin'

import { SimpleForm } from 'react-admin'

import styles from './MeldingenSimpleForm.module.css'

export const MeldingenSimpleForm = (props: SimpleFormProps) => (
  <SimpleForm className={styles['meldingen-simple-form']} {...props} />
)
