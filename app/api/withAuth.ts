import { type apiClient, type ApiClientResponse } from './apiClient'
import { getToken } from './getToken'

export function withAuth(_apiClient: typeof apiClient) {
  const middleware = async function <Data, ErrorCode extends string = never>(
    input: string,
    init?: RequestInit,
  ): Promise<ApiClientResponse<Data, ErrorCode | '1003'>> {
    const refresh = await getToken()

    if (refresh.token === null) {
      console.log('Auth: failed to refresh token')
      return (
        refresh.res ?? {
          data: null,
          error: '1003',
          status: {
            code: '1003',
            message: 'Failed to refresh token',
            dateTime: Date.now().toString(),
            traceCode: 'mocked response',
          },
        }
      )
    }

    const res = await _apiClient<Data, ErrorCode>(input, {
      ...init,
      headers: {
        Authorization: refresh.token ? `Bearer ${refresh.token}` : '',
        ...init?.headers,
      },
    })

    return res
  }
  return middleware
}
