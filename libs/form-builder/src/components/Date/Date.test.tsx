import { Date as DateComponent } from './Date'

vi.mock('@formio/js', () => {
  class MockFormioComponent {
    component: Record<string, unknown>

    constructor(component: Record<string, unknown>) {
      this.component = component
    }

    static schema(schema: Record<string, unknown>) {
      return { ...schema }
    }

    render(template: string) {
      return template
    }

    renderTemplate(_templateName: string, data: Record<string, unknown>) {
      return `<label>${data.label}</label>`
    }
  }

  return {
    Components: {
      components: {
        component: MockFormioComponent,
      },
    },
  }
})

describe('Date Component', () => {
  it('has the correct builderInfo', () => {
    expect(DateComponent.builderInfo.schema).toBeDefined()
  })

  it('renders the label template', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance = new (DateComponent as any)({ key: 'date', label: 'Date', type: 'date' })
    const renderTemplateSpy = vi.spyOn(instance, 'renderTemplate')
    const result = instance.render()

    expect(renderTemplateSpy).toHaveBeenCalledWith('label', {
      component: instance.component,
      label: instance.component.label,
    })
    expect(result).toContain('<label>Date</label>')
  })
})
