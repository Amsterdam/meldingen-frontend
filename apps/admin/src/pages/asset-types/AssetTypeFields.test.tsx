import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider, SimpleForm } from 'react-admin'

import { AssetTypeFields } from './AssetTypeFields'

const renderFields = (record?: Record<string, unknown>) =>
  render(
    <AdminContext>
      <ResourceContextProvider value="asset-type">
        <SimpleForm record={record}>
          <AssetTypeFields />
        </SimpleForm>
      </ResourceContextProvider>
    </AdminContext>,
  )

describe('AssetTypeFields', () => {
  it('should render all inputs', () => {
    renderFields()

    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.name' })).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.location_label' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.location_description' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.location_required_error' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.icon_entry' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.icon_folder' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.label' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.base_url' })).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.type_names' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.srs_name' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.filter' })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: 'resources.asset-type.fields.max_assets' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.singular' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.plural' })).toBeInTheDocument()
  })

  it('should prefill inputs from the record', () => {
    renderFields({
      arguments: {
        base_url: 'https://example.com/wfs',
        filter: 'my-filter',
        icon_entry: 'my-icon',
        icon_folder: 'my-folder',
        label: 'Test Label',
        location_description: 'Test location description',
        location_label: 'Test location label',
        location_required_error: 'Test location required error',
        plural: 'Test plural',
        singular: 'Test singular',
        srs_name: 'EPSG:4326',
        type_names: 'Type name',
      },
      max_assets: 5,
      name: 'Test Asset Type',
    })

    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.name' })).toHaveValue('Test Asset Type')
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.location_label' })).toHaveValue(
      'Test location label',
    )
    expect(
      screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.location_description' }),
    ).toHaveValue('Test location description')
    expect(
      screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.location_required_error' }),
    ).toHaveValue('Test location required error')
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.icon_entry' })).toHaveValue(
      'my-icon',
    )
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.icon_folder' })).toHaveValue(
      'my-folder',
    )
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.label' })).toHaveValue(
      'Test Label',
    )
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.base_url' })).toHaveValue(
      'https://example.com/wfs',
    )
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.type_names' })).toHaveValue(
      'Type name',
    )
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.srs_name' })).toHaveValue(
      'EPSG:4326',
    )
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.filter' })).toHaveValue(
      'my-filter',
    )
    expect(screen.getByRole('spinbutton', { name: 'resources.asset-type.fields.max_assets' })).toHaveValue(5)
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.singular' })).toHaveValue(
      'Test singular',
    )
    expect(screen.getByRole('textbox', { name: 'resources.asset-type.fields.arguments.plural' })).toHaveValue(
      'Test plural',
    )
  })
})
