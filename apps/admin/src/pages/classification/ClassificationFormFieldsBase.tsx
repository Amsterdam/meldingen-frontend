import { maxValue, required } from 'ra-core'
import { NumberInput, ReferenceInput, SelectInput, TextInput, useTranslate } from 'react-admin'

import './ClassificationForm.css'

const ServiceLevelObjectiveDayType = {
  CALENDAR_DAYS: 'calendar_days',
  WORKING_DAYS: 'working_days',
}

const SERVICE_LEVEL_OBJECTIVE_DAYS_DEFAULT = 5
const SERVICE_LEVEL_OBJECTIVE_DAYS_MAX = 365
const SERVICE_LEVEL_OBJECTIVE_DAY_TYPE_DEFAULT = ServiceLevelObjectiveDayType.CALENDAR_DAYS
const SERVICE_LEVEL_OBJECTIVE_TEXT_MAX_LENGTH = 1000

export const ClassificationFormFieldsBase = () => {
  const translate = useTranslate()
  const serviceLevelObjectiveDayTypeChoices = Object.values(ServiceLevelObjectiveDayType).map((id) => ({
    id,
    name: translate(`resources.classification.fields.service_level_objective_day_type_${id}`),
  }))

  return (
    <>
      <TextInput source="name" validate={required()} />
      <TextInput
        minRows={3}
        multiline
        source="instructions"
        validate={[required(), maxValue(SERVICE_LEVEL_OBJECTIVE_TEXT_MAX_LENGTH)]}
      />
      <div className="days-and-type-input-wrapper">
        <NumberInput
          defaultValue={SERVICE_LEVEL_OBJECTIVE_DAYS_DEFAULT}
          max={SERVICE_LEVEL_OBJECTIVE_DAYS_MAX}
          min={1}
          source="service_level_objective_days"
          validate={[required()]}
        />
        <SelectInput
          choices={serviceLevelObjectiveDayTypeChoices}
          defaultValue={SERVICE_LEVEL_OBJECTIVE_DAY_TYPE_DEFAULT}
          source="service_level_objective_day_type"
        />
      </div>
      <TextInput minRows={3} multiline source="service_level_objective_text" validate={required()} />
      <ReferenceInput reference="asset-type" sort={{ field: 'name', order: 'ASC' }} source="asset_type" />
    </>
  )
}
