import { TextInput as ADSTextInput, TextInputProps } from '@amsterdam/design-system-react/dist/TextInput'

import styles from './TextInput.module.css'

// This component resets the :invalid styling of the TextInput component from the Amsterdam Design System.
// Input type 'email' gets the :invalid styling on change, which is not what we want.

const TextInput = (props: TextInputProps) => {
  return <ADSTextInput {...props} className={`${styles.input} ${props.className}`} />
}

export { TextInput }
