import { required } from 'ra-core'
import { maxValue, minValue } from 'ra-core'
import { TextInput } from 'react-admin'
import { NumberInput, ReferenceInput, SelectInput } from 'react-admin'

import {
  SERVICE_LEVEL_OBJECTIVE_DAY_TYPE_DEFAULT,
  SERVICE_LEVEL_OBJECTIVE_DAYS_DEFAULT,
  SERVICE_LEVEL_OBJECTIVE_DAYS_MAX,
  SERVICE_LEVEL_OBJECTIVE_TEXT_MAX_LENGTH,
} from './classification-config'
import { useServiceLevelObjectiveDayTypeChoices } from './classification-hooks'

export const ClassificationFormFieldsBase = () => {
  const serviceLevelObjectiveDayTypeChoices = useServiceLevelObjectiveDayTypeChoices()
  return (
    <>
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
    </>
  )
}
