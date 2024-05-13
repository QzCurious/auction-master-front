export async function apiClient<Data, Error extends ApiStatusGeneric | null = null>(
  input: string,
  init?: RequestInit | undefined,
) {
  const url = process.env.API_BASE_URL + input
  const res = await fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
    },
  })

  try {
    const j: ApiResponse<Data, Error> = await res.json()

    console.log(`apiClient:`, `[${init?.method ?? 'GET'} ${url}]:`)
    console.log(`payload:`, init?.body)
    console.log(`response:`, j)

    if (j.status.code !== '0') {
      return { data: null, error: j.status, status: j.status }
    }

    return { data: j.data, error: null, status: j.status }
  } catch (e) {
    console.log(e)
    throw new Error('Failed to parse response as JSON')
  }
}

export type ApiStatusGeneric = { code: string; message: string }

export type ApiErrorStatus<E extends ApiStatusGeneric | null> = E

export interface ApiResponse<Data, E extends ApiStatusGeneric | null> {
  data: Data
  status: (E extends ApiStatusGeneric
    ? { code: '0'; message: 'Success' } | ApiErrorStatus<E>
    : { code: '0'; message: 'Success' }) & {
    dateTime: string
    traceCode: string
  }
}
