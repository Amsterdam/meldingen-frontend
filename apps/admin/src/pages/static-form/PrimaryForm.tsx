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
        source="components[0].maxCharCount"
        onChange={onChange}
        inputMode="numeric"
        parse={(value) => parseInt(value, 10)}
      />
      {/* Hidden input to set max length in JSONLogic using maxCharCount field */}
      <TextInput source="components[0].validate.json.if[0]['<='][1]" hidden />
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
      <TextInput source="title" readOnly />
      <TextInput source="components[0].label" validate={validateLabel} />
      {/* v8 ignore next */}
      <TextInput source="components[0].description" multiline parse={(value) => value ?? ''} />
      <MaxCharCountInputs />
      {/* Set JSONLogic error message */}
      <TextInput source="components[0].validate.json.if[2]" />
    </SimpleForm>
  )
}
