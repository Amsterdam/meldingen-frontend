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
  required,
} from 'react-admin'

import type { FormioSchema } from '../../../types/formio'
import { Builder } from '../Builder'
import { CategoryInput } from '../CategoryInput'
import { HiddenComponentsInput } from '../HiddenComponentsInput'

import styles from './CreateEditForm.module.css'

type CreateEditFormProps = {
  isEditForm?: boolean
}

export const CreateEditForm = ({ isEditForm = false }: CreateEditFormProps) => {
  const [initialValue, setInitialValue] = useState<ComponentSchema[] | undefined>(undefined)
  const [builderJson, setBuilderJson] = useState<ComponentSchema[] | undefined>(undefined)

  const refresh = useRefresh()

  const onChange = (schema: FormioSchema) => {
    setBuilderJson(schema?.components)
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
      <CategoryInput />
      <HiddenComponentsInput value={builderJson} setInitialValue={setInitialValue} />
      <div className={styles.builder}>
        <Builder data={initialValue} onChange={onChange} />
      </div>
    </SimpleForm>
  )
}
