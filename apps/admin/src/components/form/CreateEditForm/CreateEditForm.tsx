import type { ComponentSchema } from 'formiojs'
import { useState } from 'react'
import {
  useRefresh,
  SimpleForm,
  Toolbar,
  SaveButton,
  TextInput,
  ToolbarClasses,
  DeleteWithConfirmButton,
} from 'react-admin'

import type { FormioSchema } from '../../../types/formio'
import { filterAttributes } from '../../../utils/filterAttributes'
import { Builder } from '../Builder'
import { HiddenComponentsInput } from '../HiddenComponentsInput'

type CreateEditFormProps = {
  isEditForm?: boolean
}

export const CreateEditForm = ({ isEditForm = false }: CreateEditFormProps) => {
  const [initialValue, setInitialValue] = useState<ComponentSchema[] | undefined>(undefined)
  const [builderJson, setBuilderJson] = useState<ComponentSchema[] | undefined>(undefined)

  const refresh = useRefresh()

  const onChange = (schema: FormioSchema) => {
    // TODO: we currently filter all attributes that aren't supported by the backend from the schema.
    // When the backend supports all these, we can remove this filter.
    const filteredSchema: ComponentSchema[] = schema?.components.map((item) => filterAttributes(item))

    setBuilderJson(filteredSchema)
    refresh()
  }

  return (
    <SimpleForm
      toolbar={
        <Toolbar>
          <div className={ToolbarClasses.defaultToolbar}>
            <SaveButton alwaysEnable />
            {isEditForm && <DeleteWithConfirmButton />}
          </div>
        </Toolbar>
      }
    >
      <TextInput source="title" />
      <TextInput source="display" defaultValue="form" hidden />
      <HiddenComponentsInput value={builderJson} setInitialValue={setInitialValue} />
      <Builder data={initialValue} onChange={onChange} />
    </SimpleForm>
  )
}
