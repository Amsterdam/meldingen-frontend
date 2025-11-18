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
      <TextInput readOnly source="title" />
      <span>
        <strong>E-mail</strong>
      </span>
      <TextInput source="components[0].label" validate={validateLabel} />
      <TextInput
        multiline
        /* v8 ignore next */
        parse={(value) => value ?? ''}
        source="components[0].description"
      />
      <span>
        <strong>Telefoonnummer</strong>
      </span>
      <TextInput source="components[1].label" validate={validateLabel} />
      <TextInput
        multiline
        /* v8 ignore next */
        parse={(value) => value ?? ''}
        source="components[1].description"
      />
    </SimpleForm>
  )
}
