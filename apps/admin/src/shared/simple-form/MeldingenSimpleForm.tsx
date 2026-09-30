import type { SimpleFormProps } from 'react-admin'

import { SimpleForm } from 'react-admin'

import './MeldingenSimpleForm.css'

export const MeldingenSimpleForm = (props: SimpleFormProps) => (
  <SimpleForm className="meldingen-simple-form" {...props} />
)
