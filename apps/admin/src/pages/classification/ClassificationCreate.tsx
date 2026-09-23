import {
  Create,
  maxValue,
  minValue,
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

import {
  SERVICE_LEVEL_OBJECTIVE_DAY_TYPE_DEFAULT,
  SERVICE_LEVEL_OBJECTIVE_DAYS_DEFAULT,
  SERVICE_LEVEL_OBJECTIVE_DAYS_MAX,
  SERVICE_LEVEL_OBJECTIVE_TEXT_MAX_LENGTH,
} from './classification-config'
import { useServiceLevelObjectiveDayTypeChoices } from './classification-hooks'

export const ClassificationCreate = () => {
  const serviceLevelObjectiveDayTypeChoices = useServiceLevelObjectiveDayTypeChoices()
  return (
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
        <TextInput source="name" validate={required()} />
        <TextInput minRows={3} multiline source="instructions" />
        <NumberInput
          defaultValue={SERVICE_LEVEL_OBJECTIVE_DAYS_DEFAULT}
          max={SERVICE_LEVEL_OBJECTIVE_DAYS_MAX}
          min={1}
          source="service_level_objective_days"
        />
        <SelectInput
          choices={serviceLevelObjectiveDayTypeChoices}
          defaultValue={SERVICE_LEVEL_OBJECTIVE_DAY_TYPE_DEFAULT}
          source="service_level_objective_day_type"
          validate={[minValue(1), maxValue(SERVICE_LEVEL_OBJECTIVE_TEXT_MAX_LENGTH)]}
        />
        <TextInput minRows={3} multiline source="service_level_objective_text" validate={required()} />
        <ReferenceInput reference="asset-type" sort={{ field: 'name', order: 'ASC' }} source="asset_type" />
      </SimpleForm>
    </Create>
  )
}
