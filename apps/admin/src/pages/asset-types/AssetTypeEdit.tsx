import {
  DeleteWithConfirmButton,
  Edit,
  minValue,
  NumberInput,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  ToolbarClasses,
} from 'react-admin'

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
      <TextInput source="name" validate={required()} />
      <TextInput source="arguments.type_names" validate={required()} />
      <TextInput minRows={4} multiline source="arguments.filter" validate={required()} />
      <TextInput source="arguments.base_url" validate={required()} />
      <NumberInput source="max_assets" validate={[required(), minValue(1)]} />
    </SimpleForm>
  </Edit>
)
