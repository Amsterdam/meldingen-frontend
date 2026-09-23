import {
  DeleteWithConfirmButton,
  Edit,
  NumberInput,
  ReferenceInput,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  ToolbarClasses,
} from 'react-admin'

import { useServiceLevelObjectiveDayTypeChoices } from './classification-hooks'

export const ClassificationEdit = () => {
  const serviceLevelObjectiveDayTypeChoices = useServiceLevelObjectiveDayTypeChoices()
  return (
    <Edit>
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
        <TextInput minRows={3} multiline source="instructions" />
        <NumberInput max={365} min={1} source="service_level_objective_days" />
        <SelectInput choices={serviceLevelObjectiveDayTypeChoices} source="service_level_objective_day_type" />
        <TextInput minRows={3} multiline source="service_level_objective_text" />
        <ReferenceInput reference="asset-type" sort={{ field: 'name', order: 'ASC' }} source="asset_type" />
        <TextInput readOnly source="form" />
      </SimpleForm>
    </Edit>
  )
}
