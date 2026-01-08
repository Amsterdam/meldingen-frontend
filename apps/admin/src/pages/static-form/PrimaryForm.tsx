import { minLength, required, SaveButton, SimpleForm, TextInput, Toolbar } from 'react-admin'
import { useFormContext } from 'react-hook-form'

const MaxCharCountInputs = () => {
  const { getValues, setValue } = useFormContext()

  const onChange = () => {
    const data = getValues('components[0].maxCharCount')

    setValue('components[0].validate.json.if[0]["<="][1]', data)
  }

  return (
    <>
      <TextInput
        inputMode="numeric"
        onChange={onChange}
        parse={(value) => parseInt(value, 10)}
        source="components[0].maxCharCount"
      />
      {/* Hidden input to set max length in JSONLogic using maxCharCount field */}
      <TextInput hidden source="components[0].validate.json.if[0]['<='][1]" />
    </>
  )
}

export const PrimaryForm = () => {
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
      <TextInput source="components[0].label" validate={validateLabel} />
      {/* v8 ignore next */}
      <TextInput multiline parse={(value) => value ?? ''} source="components[0].description" />
      <MaxCharCountInputs />
      {/* Set JSONLogic error message */}
      <TextInput source="components[0].validate.json.if[2]" />
      <TextInput source="components[0].validate.required_error_message" />
    </SimpleForm>
  )
}
