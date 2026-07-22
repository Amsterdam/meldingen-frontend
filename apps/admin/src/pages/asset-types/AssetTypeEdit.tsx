import { DeleteWithConfirmButton, Edit, SaveButton, SimpleForm, Toolbar, ToolbarClasses } from 'react-admin'

import { AssetTypeFields } from './AssetTypeFields'

export const AssetTypeEdit = ({ id }: { id?: number }) => (
  <Edit id={id} resource="asset-type">
    <SimpleForm
      toolbar={
        <Toolbar>
          <div className={ToolbarClasses.defaultToolbar}>
            <SaveButton alwaysEnable />
            <DeleteWithConfirmButton />
          </div>
        </Toolbar>
      }
    >
      <AssetTypeFields />
    </SimpleForm>
  </Edit>
)
