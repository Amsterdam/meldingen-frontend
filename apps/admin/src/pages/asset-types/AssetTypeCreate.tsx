import { Create, required, SaveButton, SimpleForm, TextInput, Toolbar, ToolbarClasses } from 'react-admin'

type AssetTypeCreateData = {
  arguments: {
    base_url: string
  }
  name: string
}

export const transform = (data: AssetTypeCreateData) => ({
  ...data,
  // class_name defines the way the assets are fetched.
  // Currently only meldingen.wfs.ProxyWfsProviderFactory class is available.
  class_name: 'meldingen.wfs.ProxyWfsProviderFactory',
})

export const AssetTypeCreate = () => (
  <Create redirect="list" transform={transform}>
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
      <TextInput source="arguments.base_url" validate={required()} />
    </SimpleForm>
  </Create>
)
