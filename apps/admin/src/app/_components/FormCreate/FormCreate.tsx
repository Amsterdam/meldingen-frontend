import type { ComponentSchema } from '@formio/js'
import { useState } from 'react'
import { Create, SaveButton, SimpleForm, TextInput, Toolbar, useRefresh } from 'react-admin'

import type { FormioSchema } from '../../../types/formio'
import { filterAttributes } from '../../../utils/filterAttributes'
import { Builder } from '../Builder'
import { HiddenComponentsInput } from '../HiddenComponentsInput'

export const FormCreate = () => {
  const [builderJson, setBuilderJson] = useState([])

  const refresh = useRefresh()

  const onChange = (schema: FormioSchema) => {
    // TODO: we currently filter all attributes that aren't supported by the backend from the schema.
    // When the backend supports all these, we can remove this filter.
    const filteredSchema = schema?.components.map((item: ComponentSchema) => filterAttributes(item))

    setBuilderJson(filteredSchema)
    refresh()
  }

  return (
    <Create
      transform={(data: any) => ({
        ...data,
        components: JSON.parse(data.components),
      })}
    >
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
