import {
  maxLength,
  maxValue,
  minValue,
  NumberInput,
  ReferenceInput,
  required,
  SelectInput,
  TextInput,
} from 'react-admin'

import { isInteger } from '~/helpers/isInteger'

import styles from './ClassificationFormFieldsBase.module.css'

const serviceLevelObjectiveDayTypeChoices = [
  { id: 'calendar_days', name: `resources.classification.fields.service_level_objective_day_type_calendar_days` },
  { id: 'working_days', name: `resources.classification.fields.service_level_objective_day_type_working_days` },
]

const SERVICE_LEVEL_OBJECTIVE_DAY_TYPE_DEFAULT = 'calendar_days'
const SERVICE_LEVEL_OBJECTIVE_DAYS_MAX = 365
const SERVICE_LEVEL_OBJECTIVE_TEXT_MAX_LENGTH = 1000

export const ClassificationFormFieldsBase = () => (
  <>
    <TextInput source="name" validate={required()} />
    <TextInput minRows={3} multiline source="instructions" />
    <ReferenceInput reference="asset-type" sort={{ field: 'name', order: 'ASC' }} source="asset_type" />
    <div className={styles.daysAndTypeInputWrapper}>
      <NumberInput
        max={SERVICE_LEVEL_OBJECTIVE_DAYS_MAX}
        min={1}
        source="service_level_objective_days"
        step={1}
        validate={[required(), isInteger(), minValue(1), maxValue(SERVICE_LEVEL_OBJECTIVE_DAYS_MAX)]}
      />
      <SelectInput
        choices={serviceLevelObjectiveDayTypeChoices}
        defaultValue={SERVICE_LEVEL_OBJECTIVE_DAY_TYPE_DEFAULT}
        source="service_level_objective_day_type"
        validate={[required()]}
      />
    </div>
    <TextInput
      minRows={3}
      multiline
      source="service_level_objective_text"
      validate={[required(), maxLength(SERVICE_LEVEL_OBJECTIVE_TEXT_MAX_LENGTH)]}
    />
  </>
)
