import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Date as DateComponent } from './Date'

vi.mock('@formio/js', () => {
  const mockSchema = vi.fn((schema) => ({ ...schema }))
  const mockRender = vi.fn((template) => template)
  const mockRenderTemplate = vi.fn((templateName, data) => `<label>${data.label}</label>`)

  class MockFormioComponent {
    component: Record<string, unknown>

    constructor(component: Record<string, unknown>) {
      this.component = component
    }

    static schema(schema: Record<string, unknown>) {
      return mockSchema(schema)
    }

    render(template: string) {
      return mockRender(template)
    }

    renderTemplate(templateName: string, data: Record<string, unknown>) {
      return mockRenderTemplate(templateName, data)
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

vi.mock('./editForm', () => ({
  editForm: { components: [] },
}))

describe('Date Component', () => {
  let instance: DateComponent

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance = new (DateComponent as any)({ key: 'date', label: 'Date', type: 'date' })
  })

  describe('builderInfo', () => {
    it('should return the correct group', () => {
      expect(DateComponent.builderInfo.group).toBe('basic')
    })

    it('should return the correct icon', () => {
      expect(DateComponent.builderInfo.icon).toBe('calendar')
    })

    it('should return the correct title', () => {
      expect(DateComponent.builderInfo.title).toBe('Date')
    })

    it('should include a schema', () => {
      expect(DateComponent.builderInfo.schema).toBeDefined()
    })
  })

  describe('schema', () => {
    it('should return a schema with the correct type', () => {
      expect(DateComponent.schema().type).toBe('date')
    })

    it('should return a schema with the correct key', () => {
      expect(DateComponent.schema().key).toBe('date')
    })

    it('should return a schema with the correct label', () => {
      expect(DateComponent.schema().label).toBe('Date')
    })
  })

  describe('editForm', () => {
    it('should have an editForm static property', () => {
      expect(DateComponent.editForm).toBeDefined()
    })
  })

  describe('render', () => {
    it('should call renderTemplate with label template', () => {
      const renderTemplateSpy = vi.spyOn(instance, 'renderTemplate')
      instance.render()

      expect(renderTemplateSpy).toHaveBeenCalledWith('label', {
        component: instance.component,
        label: instance.component.label,
      })
    })

    it('should return rendered output containing the label', () => {
      const result = instance.render()

      expect(result).toContain('<label>Date</label>')
    })
  })
})
