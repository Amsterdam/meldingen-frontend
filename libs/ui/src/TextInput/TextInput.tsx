import { TextInput as ADSTextInput, TextInputProps } from '@amsterdam/design-system-react/dist/TextInput'
import clsx from 'clsx'
import { ForwardedRef, forwardRef } from 'react'

import styles from './TextInput.module.css'

// This component resets the :invalid styling of the TextInput component from the Amsterdam Design System.
// Input type 'email' gets the :invalid styling on change, which is not what we want.

const TextInput = forwardRef((props: TextInputProps, ref: ForwardedRef<HTMLInputElement>) => (
  <ADSTextInput {...props} className={clsx(styles.input, props.className && props.className)} ref={ref} />
))

export { TextInput }
