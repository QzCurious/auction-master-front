import { z } from 'zod'

import { appendEntries } from '../static'
import { apiClient } from './apiClient'
import { throwIfInvalid } from './helpers/throwIfInvalid'

const ReqSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
})

interface Data {
  token: string
}

type ErrorCode =
  // TokenIncorrect
  '1003'

export async function RefreshToken(payload: z.input<typeof ReqSchema>) {
  const { token, refreshToken } = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, { refreshToken })

  const res = await apiClient<Data, ErrorCode>('/session/refresh', {
    method: 'POST',
    body: urlencoded,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res
}
