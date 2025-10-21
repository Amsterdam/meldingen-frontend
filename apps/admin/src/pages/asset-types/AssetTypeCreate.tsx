import { Create, SaveButton, SimpleForm, TextInput, Toolbar, ToolbarClasses } from 'react-admin'

const transform = (data: any) => ({
  ...data,
  // class_name defines the way the assets are fetched.
  // Currently only meldingen.wfs.ProxyWfsProviderFactory class is available.
  class_name: 'meldingen.wfs.ProxyWfsProviderFactory',
})

export const AssetTypeCreate = () => (
  <Create transform={transform} redirect="list">
    <SimpleForm
      toolbar={
        <Toolbar>
          <div className={ToolbarClasses.defaultToolbar}>
            <SaveButton alwaysEnable />
          </div>
        </Toolbar>
      }
    >
      <TextInput source="name" />
      <TextInput source="arguments.additionalProp1.base_url" />
    </SimpleForm>
  </Create>
)
