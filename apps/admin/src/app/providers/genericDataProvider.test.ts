import { genericDataProvider } from './genericDataProvider'

describe('genericDataProvider', () => {
  it('builds a getList URL with filter, sort and optional limit, and returns data + total', async () => {
    const items = [{ id: 1 }, { id: 2 }]
    const httpClient = vi.fn().mockResolvedValue({ json: items })

    const client = genericDataProvider('http://localhost:3000', httpClient)

    const params = {
      filter: { status: 'active' },
      meta: { limit: 10 },
      pagination: { page: 1, perPage: 25 },
      sort: { field: 'created_at', order: 'DESC' },
    } as const

    const result = await client.getList('assets', params)

    expect(httpClient).toHaveBeenCalledTimes(1)

    const calledUrl = httpClient.mock.calls[0][0] as string
    const url = new URL(calledUrl)

    expect(url.pathname).toBe('/assets/')
    expect(url.searchParams.get('filter')).toBe(JSON.stringify(params.filter))
    expect(url.searchParams.get('sort')).toBe(JSON.stringify([params.sort.field, params.sort.order]))
    expect(url.searchParams.get('limit')).toBe('10')

    expect(result).toEqual({ data: items, total: items.length })
  })

  it('uses a PUT request for the `form` resource', async () => {
    const httpClient = vi.fn().mockResolvedValue({ json: { id: 1 } })

    const client = genericDataProvider('http://localhost:3000', httpClient)

    await client.update('form', {
      data: {},
      id: 1,
      previousData: { id: 1 },
    })

    expect(httpClient).toHaveBeenCalledWith('http://localhost:3000/form/1', {
      body: '{}',
      method: 'PUT',
    })
  })

  it('uses a PATCH request for all other resources', async () => {
    const httpClient = vi.fn().mockResolvedValue({ json: { id: 1 } })

    const client = genericDataProvider('http://localhost:3000', httpClient)

    await client.update('other', {
      data: {},
      id: 1,
      previousData: { id: 1 },
    })

    expect(httpClient).toHaveBeenCalledWith('http://localhost:3000/other/1', {
      body: '{}',
      method: 'PATCH',
    })
  })
})
