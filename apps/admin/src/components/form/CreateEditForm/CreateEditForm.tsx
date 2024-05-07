import type { ComponentSchema, ExtendedComponentSchema } from 'formiojs'
import { useState } from 'react'
import {
  useRefresh,
  SimpleForm,
  Toolbar,
  SaveButton,
  TextInput,
  ToolbarClasses,
  DeleteWithConfirmButton,
  required,
  ReferenceInput,
  useRecordContext,
  AutocompleteInput,
} from 'react-admin'

import type { FormioSchema } from '../../../types/formio'
import { filterAttributes } from '../../../utils/filterAttributes'
import { Builder } from '../Builder'
import { HiddenComponentsInput } from '../HiddenComponentsInput'

import styles from './CreateEditForm.module.css'

type CreateEditFormProps = {
  isEditForm?: boolean
}

const OptionRenderer = () => {
  const record = useRecordContext()
  return (
    <span>
      {record.name}
      {record.form && ' GEKOPPELD'}
    </span>
  )
}

const inputText = (choice) => `${choice.name}`

export const CreateEditForm = ({ isEditForm = false }: CreateEditFormProps) => {
  const [initialValue, setInitialValue] = useState<ComponentSchema[] | undefined>(undefined)
  const [builderJson, setBuilderJson] = useState<ComponentSchema[] | undefined>(undefined)

  const refresh = useRefresh()

  const onChange = (schema: FormioSchema) => {
    // TODO: we currently filter all attributes that aren't supported by the backend from the schema.
    // When the backend supports all these, we can remove this filter.
    const filteredSchema: ExtendedComponentSchema[] = schema?.components.map((item) => filterAttributes(item))

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
      <TextInput source="title" validate={required()} />
      <TextInput source="display" defaultValue="wizard" hidden />
      <ReferenceInput source="classification" reference="classification">
        <AutocompleteInput inputText={inputText} optionText={<OptionRenderer />} />
      </ReferenceInput>
      <HiddenComponentsInput value={builderJson} setInitialValue={setInitialValue} />
      <div className={styles.builder}>
        <Builder data={initialValue} onChange={onChange} />
      </div>
    </SimpleForm>
  )
}
