import { minLength, required, SaveButton, SimpleForm, TextInput, Toolbar } from 'react-admin'

export const ContactForm = () => {
  const validateLabel = [required(), minLength(3)]

  return (
    <SimpleForm
      toolbar={
        <Toolbar>
          <SaveButton />
        </Toolbar>
      }
    >
      <TextInput source="title" readOnly />
      <span>
        <strong>E-mail</strong>
      </span>
      <TextInput source="components[0].label" validate={validateLabel} />
      <TextInput
        source="components[0].description"
        multiline
        /* v8 ignore next */
        parse={(value) => value ?? ''}
      />
      <span>
        <strong>Telefoonnummer</strong>
      </span>
      <TextInput source="components[1].label" validate={validateLabel} />
      <TextInput
        source="components[1].description"
        multiline
        /* v8 ignore next */
        parse={(value) => value ?? ''}
      />
    </SimpleForm>
  )
}
