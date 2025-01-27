'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson, throwIfInvalid } from '@/api/core/static'
import { appendEntries } from '@/domain/crud/appendEntries'
import { z } from 'zod'

const ReqSchema = z.object({
  token: z.string().min(1),
})

type Data = 'Success'

export async function LineUserBindingCallback(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)
  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await apiClientWithToken
    .post<
      SuccessResponseJson<Data>
    >('frontend/line-user-binding/callback', { body: urlencoded })
    .json()
    .catch(createApiErrorServerSide)

  return res
}
