import { Create, SaveButton, SimpleForm, TextInput, Toolbar, ToolbarClasses } from 'react-admin'

import { AssetTypeInput } from './AssetTypeInput'

export const ClassificationCreate = () => (
  <Create redirect="list">
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
      <AssetTypeInput />
    </SimpleForm>
  </Create>
)
