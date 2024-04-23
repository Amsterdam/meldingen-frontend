import { useEffect, useState } from 'react'
import { Create, SaveButton, SimpleForm, TextInput, Toolbar, useRefresh } from 'react-admin'
import { JsonInput } from 'react-admin-json-view'
import { useFormContext } from 'react-hook-form'

import { Builder } from '../Builder'

const allowed = ['label', 'description', 'key', 'type', 'input', 'autoExpand', 'showCharCount']

const filterAttributes = (raw: any) =>
  Object.keys(raw)
    .filter((key) => allowed.includes(key))
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: raw[key],
      }),
      {},
    )

const HiddenComponentsInput = ({ value }: { value: any }) => {
  const { setValue } = useFormContext()

  useEffect(() => {
    setValue('components', value)
  }, [setValue, value])

  return <JsonInput source="components" />
}

export const FormCreate = () => {
  const [builderJson, setBuilderJson] = useState([])

  const refresh = useRefresh()

  const onChange = (schema: any) => {
    // TODO: we currently filter all attributes that aren't supported by the backend from the schema.
    // When the backend supports all these, we can remove this filter.
    const filteredSchema = schema?.components.map((item: any) => filterAttributes(item))

    setBuilderJson(filteredSchema)
    refresh()
  }

  return (
    <Create>
      <SimpleForm
        toolbar={
          <Toolbar>
            <SaveButton alwaysEnable />
          </Toolbar>
        }
      >
        <TextInput source="title" />
        <TextInput source="display" defaultValue="form" readOnly />
        <HiddenComponentsInput value={builderJson} />
        <Builder onChange={onChange} />
      </SimpleForm>
    </Create>
  )
}
