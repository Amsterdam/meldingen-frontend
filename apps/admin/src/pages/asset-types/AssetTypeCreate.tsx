import {
  Create,
  minValue,
  NumberInput,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  ToolbarClasses,
} from 'react-admin'

type AssetTypeCreateData = {
  arguments: {
    base_url: string
    filter: string
    type_names: string
  }
  max_assets: number
  name: string
}

export const transform = (data: AssetTypeCreateData) => ({
  ...data,
  // class_name defines the way the assets are fetched.
  // Currently only meldingen.wfs.ProxyWfsProviderFactory class is available.
  class_name: 'meldingen.wfs.ProxyWfsProviderFactory',
})

export const AssetTypeCreate = () => (
  <Create redirect="list" resource="asset-type" transform={transform}>
    <SimpleForm
      toolbar={
        <Toolbar>
          <div className={ToolbarClasses.defaultToolbar}>
            <SaveButton alwaysEnable />
          </div>
        </Toolbar>
      }
    >
      <TextInput source="name" validate={required()} />
      <TextInput source="arguments.type_names" validate={required()} />
      <TextInput minRows={4} multiline source="arguments.filter" validate={required()} />
      <TextInput source="arguments.base_url" validate={required()} />
      <NumberInput defaultValue={3} source="max_assets" validate={[required(), minValue(1)]} />
    </SimpleForm>
  </Create>
)
