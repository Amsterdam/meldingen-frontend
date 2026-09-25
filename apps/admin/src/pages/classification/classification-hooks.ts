import { useTranslate } from 'react-admin'

import { ServiceLevelObjectiveDayType } from './classification-config'

export const useServiceLevelObjectiveDayTypeChoices = () => {
  const translate = useTranslate()
  return Object.values(ServiceLevelObjectiveDayType).map((id) => ({
    id,
    name: translate(`resources.classification.fields.service_level_objective_day_type_${id}`),
  }))
}
