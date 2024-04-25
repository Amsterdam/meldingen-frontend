import type { ComponentSchema } from '@formio/js'
import { useState } from 'react'
import { DeleteButton, Edit, SaveButton, SimpleForm, TextInput, Toolbar, ToolbarClasses, useRefresh } from 'react-admin'

import type { FormioSchema } from '../../../types/formio'
import { filterAttributes } from '../../../utils/filterAttributes'
import { Builder } from '../Builder'
import { HiddenComponentsInput } from '../HiddenComponentsInput'

export const FormEdit = () => {
  const [initialValue, setInitialValue] = useState(undefined)
  const [builderJson, setBuilderJson] = useState(undefined)

  const refresh = useRefresh()

  const onChange = (schema: FormioSchema) => {
    // TODO: we currently filter all attributes that aren't supported by the backend from the schema.
    // When the backend supports all these, we can remove this filter.
    const filteredSchema = schema?.components.map((item: ComponentSchema) => filterAttributes(item))

    setBuilderJson(filteredSchema)
    refresh()
  }

  return (
    <Edit
      transform={(data: any) => ({
        ...data,
        components: data.components,
      })}
    >
      <SimpleForm
        toolbar={
          <Toolbar>
            <div className={ToolbarClasses.defaultToolbar}>
              <SaveButton alwaysEnable />
              <DeleteButton />
            </div>
          </Toolbar>
        }
      >
        <TextInput source="title" />
        <TextInput source="display" defaultValue="form" readOnly />
        <HiddenComponentsInput value={builderJson} setInitialValue={setInitialValue} />
        <Builder data={initialValue} onChange={onChange} />
      </SimpleForm>
    </Edit>
  )
}
