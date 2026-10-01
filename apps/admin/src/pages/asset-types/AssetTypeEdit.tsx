import { DeleteWithConfirmButton, Edit, SaveButton, Toolbar, ToolbarClasses } from 'react-admin'

import { MeldingenSimpleForm } from '../../shared/simple-form/MeldingenSimpleForm'
import { AssetTypeFields } from './AssetTypeFields'

export const AssetTypeEdit = ({ id }: { id?: number }) => (
  <Edit id={id} resource="asset-type">
    <MeldingenSimpleForm
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
    </MeldingenSimpleForm>
  </Edit>
)
