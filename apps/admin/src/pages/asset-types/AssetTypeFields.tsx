import { minValue, NumberInput, required, TextInput } from 'react-admin'

export const AssetTypeFields = () => (
  <>
    <TextInput source="name" validate={required()} />

    <span>
      <strong>Locatie pagina</strong>
    </span>
    <TextInput source="arguments.location_label" />
    <TextInput source="arguments.location_description" />
    <TextInput source="arguments.location_required_error" />

    <span>
      <strong>Icoon</strong>
    </span>
    <TextInput source="arguments.icon_entry" validate={required()} />
    <TextInput source="arguments.icon_folder" validate={required()} />

    <span>
      <strong>Label</strong>
    </span>
    <TextInput source="arguments.label" />

    <span>
      <strong>WFS-laag</strong>
    </span>
    <TextInput source="arguments.base_url" validate={required()} />
    <TextInput source="arguments.type_names" validate={required()} />
    <TextInput source="arguments.srs_name" validate={required()} />
    <TextInput minRows={4} multiline source="arguments.filter" validate={required()} />

    <span>
      <strong>Validatie</strong>
    </span>
    <NumberInput defaultValue={3} source="max_assets" validate={[required(), minValue(1)]} />
    <TextInput source="arguments.singular" />
    <TextInput source="arguments.plural" />
  </>
)
