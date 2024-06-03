import { Heading } from '@amsterdam/design-system-react'
import type { ComponentSchema, ExtendedComponentSchema } from 'formiojs'
import dynamic from 'next/dynamic'
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

import { Grid } from '@meldingen/ui'

import type { FormioSchema } from '../../../types/formio'
import { filterAttributes } from '../../../utils/filterAttributes'
import { Builder } from '../Builder'
import { CategoryInput } from '../CategoryInput'
import { HiddenComponentsInput } from '../HiddenComponentsInput'

import styles from './CreateEditForm.module.css'

const FormRenderer = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormRenderer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})
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
    const filteredSchema: ExtendedComponentSchema[] = schema?.components.map((item) => filterAttributes(item))

    setBuilderJson(filteredSchema)
    refresh()
  }

  return (
    <>
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
      {builderJson && (
        <>
          <Heading size="level-2">Preview</Heading>
          <Grid paddingBottom="large" paddingTop="medium">
            <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
              <FormRenderer form={{ display: 'wizard', components: builderJson }} />
            </Grid.Cell>
          </Grid>
        </>
      )}
    </>
  )
}
