import { genericDataProvider } from './genericDataProvider'

describe('genericDataProvider', () => {
  it('builds a getList URL with filter, sort and returns data + total', async () => {
    const items = [{ id: 1 }, { id: 2 }]
    const httpClient = vi.fn().mockResolvedValue({
      headers: new Headers({ 'Content-Range': 'items 0-1/200' }),
      json: items,
    })

    const client = genericDataProvider('http://localhost:3000', httpClient)

    const params = {
      filter: { status: 'active' },
      pagination: { page: 1, perPage: 25 },
      sort: { field: 'created_at', order: 'DESC' },
    } as const

    const result = await client.getList('assets', params)

    expect(httpClient).toHaveBeenCalledTimes(1)

    const calledUrl = httpClient.mock.calls[0][0] as string
    const url = new URL(calledUrl)

    expect(url.pathname).toBe('/assets')
    expect(url.searchParams.get('filter')).toBe(JSON.stringify(params.filter))
    expect(url.searchParams.get('sort')).toBe(JSON.stringify([params.sort.field, params.sort.order]))
    expect(url.searchParams.get('limit')).toBe('25')

    expect(result).toEqual({ data: items, total: 200 })
  })

  it('falls back to limit=50 and offset=0 when pagination is missing', async () => {
    const items = [{ id: 1 }, { id: 2 }]
    const httpClient = vi.fn().mockResolvedValue({
      headers: new Headers({ 'Content-Range': 'items 0-1/2' }),
      json: items,
    })

    const client = genericDataProvider('http://localhost:3000', httpClient)

    await client.getList('assets', {
      filter: {},
      sort: { field: 'id', order: 'ASC' },
    })

    const calledUrl = httpClient.mock.calls[0][0] as string
    const url = new URL(calledUrl)

    expect(url.searchParams.get('limit')).toBe('50')
    expect(url.searchParams.get('offset')).toBe('0')
  })

  it('falls back to limit=50 when pagination.perPage is missing', async () => {
    type Params = Parameters<ReturnType<typeof genericDataProvider>['getList']>[1]

    const items = [{ id: 1 }]
    const httpClient = vi.fn().mockResolvedValue({
      headers: new Headers({ 'Content-Range': 'items 0-0/1' }),
      json: items,
    })

    const client = genericDataProvider('http://localhost:3000', httpClient)

    await client.getList('assets', {
      filter: {},
      pagination: { page: 1 } as Params['pagination'],
      sort: { field: 'id', order: 'ASC' },
    })

    const calledUrl = httpClient.mock.calls[0][0] as string
    const url = new URL(calledUrl)

    expect(url.searchParams.get('limit')).toBe('50')
  })

  it('prefers meta.limit over pagination.perPage when both are provided', async () => {
    const items = [{ id: 1 }]
    const httpClient = vi.fn().mockResolvedValue({
      headers: new Headers({ 'Content-Range': 'items 0-0/200' }),
      json: items,
    })

    const client = genericDataProvider('http://localhost:3000', httpClient)

    await client.getList('assets', {
      filter: {},
      meta: { limit: 5 },
      pagination: { page: 2, perPage: 25 },
      sort: { field: 'id', order: 'ASC' },
    })

    const calledUrl = httpClient.mock.calls[0][0] as string
    const url = new URL(calledUrl)

    expect(url.searchParams.get('limit')).toBe('5')
  })

  it('throws when Content-Range is missing', async () => {
    const httpClient = vi.fn().mockResolvedValue({ headers: new Headers(), json: { id: 1 } })

    const client = genericDataProvider('http://localhost:3000', httpClient)

    await expect(
      client.getList('assets', {
        filter: {},
        meta: { limit: 10 },
        pagination: { page: 1, perPage: 25 },
        sort: { field: 'id', order: 'ASC' },
      }),
    ).rejects.toThrow('Content-Range header is missing in the response. Total count cannot be determined.')
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
